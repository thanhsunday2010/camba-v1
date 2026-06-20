import { redirect, notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getPlacementTestData } from "@/actions/placement";
import { fetchActiveProgramContext } from "@/actions/programs";
import { createClient } from "@/lib/supabase/server";
import { PlacementTestPlayer } from "@/components/learning/placement-test-player";
import { getShieldScaleMax } from "@/lib/programs/settings";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default async function PlacementTestByIdPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = await getTranslations("placement");
  const tm = await getTranslations("mockTests");
  const context = await fetchActiveProgramContext();

  if (!context?.programId) {
    redirect("/placement-test");
  }

  const test = await getPlacementTestData(testId);
  if (!test || test.questions.length === 0) {
    notFound();
  }

  const supabase = await createClient();
  const { data: levels } = await supabase
    .from("levels")
    .select("id, name")
    .eq("program_id", context.programId);

  const levelNames = Object.fromEntries((levels ?? []).map((l) => [l.id, l.name]));
  const maxShields = await getShieldScaleMax(context.programId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/placement-test">
          <Button variant="ghost" size="sm" className="mb-2 -ml-2">
            <ChevronLeft className="h-4 w-4" />
            {t("backToList")}
          </Button>
        </Link>
        <p className="text-sm text-primary font-medium">{context.program.name}</p>
        <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
        {test.description && (
          <p className="text-sm text-gray-500 mt-1">{test.description}</p>
        )}
      </div>

      <PlacementTestPlayer
        test={test}
        levelNames={levelNames}
        maxShields={maxShields}
        labels={{
          complete: t("complete"),
          totalScore: t("totalScore"),
          cambridgeScore: t("cambridgeScore"),
          suggestedLevel: t("suggestedLevel"),
          suggestedLevelNote: t("suggestedLevelNote"),
          skillBreakdown: tm("skillBreakdown"),
          shields: tm("shields"),
          overallShields: t("overallShields"),
          goToSettings: t("goToSettings"),
          backToList: t("backToList"),
          previous: tm("previous"),
          next: tm("next"),
          submit: tm("submit"),
          submitting: tm("submitting"),
          questionOf: t("questionOf"),
        }}
      />
    </div>
  );
}
