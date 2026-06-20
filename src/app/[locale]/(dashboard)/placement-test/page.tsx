import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getPlacementTestData } from "@/actions/placement";
import { fetchActiveProgramContext } from "@/actions/programs";
import { createClient } from "@/lib/supabase/server";
import { PlacementTestPlayer } from "@/components/learning/placement-test-player";
import { ProgramPicker } from "@/components/programs/program-picker";
import { fetchAvailablePrograms } from "@/actions/programs";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default async function PlacementTestPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = await getTranslations("placement");
  const tp = await getTranslations("programs");
  const context = await fetchActiveProgramContext();

  if (!context?.programId) {
    const programs = await fetchAvailablePrograms();
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-6">
        <ProgramPicker
          programs={programs}
          labels={{
            title: tp("selectTitle"),
            subtitle: tp("selectBeforePlacement"),
            select: tp("select"),
            selecting: tp("selecting"),
            current: tp("current"),
          }}
        />
      </div>
    );
  }

  if (context.levelId && context.level) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-12">
        <CheckCircle2 className="h-16 w-16 text-success mx-auto" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("alreadyCompleted")}</h1>
          <p className="text-sm text-primary font-medium mt-1">{context.program.name}</p>
          <p className="text-gray-500 mt-2">
            {t("currentLevel")}: <strong>{context.level.name}</strong>
          </p>
        </div>
        <Link href="/learning">
          <Button size="lg">{t("goToLearning")}</Button>
        </Link>
      </div>
    );
  }

  const test = await getPlacementTestData(context.programId);
  if (!test || test.questions.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-gray-500">{t("notAvailable")}</p>
        <p className="text-sm text-gray-400">{context.program.name}</p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: levels } = await supabase
    .from("levels")
    .select("id, name")
    .eq("program_id", context.programId);

  const levelNames = Object.fromEntries(
    (levels ?? []).map((l) => [l.id, l.name])
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <p className="text-sm text-primary font-medium">{context.program.name}</p>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
      </div>
      <PlacementTestPlayer test={test} levelNames={levelNames} />
    </div>
  );
}
