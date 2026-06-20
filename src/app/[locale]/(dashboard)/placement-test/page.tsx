import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listPlacementTests } from "@/actions/placement";
import { fetchActiveProgramContext } from "@/actions/programs";
import { ProgramPicker } from "@/components/programs/program-picker";
import { fetchAvailablePrograms } from "@/actions/programs";
import { Link } from "@/i18n/routing";
import { ClipboardList } from "lucide-react";

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

  const tests = await listPlacementTests(context.programId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-sm text-primary font-medium">{context.program.name}</p>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
        <p className="text-sm text-gray-500 mt-2">{t("advisoryNote")}</p>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <p className="text-gray-500">{t("comingSoon")}</p>
          <p className="text-sm text-gray-400 max-w-md mx-auto">{t("comingSoonDesc")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tests.map((test) => (
            <Link
              key={test.id}
              href={`/placement-test/${test.id}`}
              className="block p-4 rounded-lg border border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{test.title}</p>
                  {test.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{test.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {test.question_count} {t("questions")}
                    {test.time_limit_minutes
                      ? ` • ${test.time_limit_minutes} ${t("minutes")}`
                      : ""}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
