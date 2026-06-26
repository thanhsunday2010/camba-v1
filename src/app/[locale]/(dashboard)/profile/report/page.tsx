import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/auth/current-user";
import { StudentPageShell } from "@/components/camba";
import { StudentProgressReportView } from "@/components/reporting/student-progress-report-view";
import { getStudentProgressReport } from "@/lib/reporting/report-view-model";
import { buildStudentProgressReportLabels } from "@/lib/reporting/report-i18n";
import { buildReportResolvers } from "@/lib/reporting/report-resolvers";
import { dashboardHubHref } from "@/lib/dashboard/dashboard-hub-routes";
import { ArrowLeft } from "lucide-react";

export default async function ProfileReportPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [t, tProfile, resolvers] = await Promise.all([
    getTranslations("report"),
    getTranslations("profile"),
    buildReportResolvers(),
  ]);

  const labels = buildStudentProgressReportLabels((key) => t(key));
  const report = await getStudentProgressReport(
    user,
    labels,
    resolvers,
    tProfile("nextMilestoneFallback")
  );

  return (
    <StudentPageShell narrow className="print:max-w-none">
      <nav aria-label={t("backToProfile")} className="print:hidden">
        <Link
          href={dashboardHubHref("profile")}
          className="inline-flex items-center gap-1.5 camba-caption font-semibold text-program hover:underline camba-focus-ring rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t("backToProfile")}
        </Link>
      </nav>
      <StudentProgressReportView report={report} labels={labels} />
    </StudentPageShell>
  );
}
