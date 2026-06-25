import { NextRequest, NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getStudentProgressReport } from "@/lib/reporting/report-view-model";
import { buildStudentProgressReportLabels } from "@/lib/reporting/report-i18n";
import { buildReportResolvers } from "@/lib/reporting/report-resolvers";
import { generateProgressReportPdf } from "@/lib/reporting/pdf/generate-progress-pdf";
import type { ReportExportVariant } from "@/lib/reporting/report-types";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const variantParam = request.nextUrl.searchParams.get("variant");
  const variant: ReportExportVariant = variantParam === "snapshot" ? "snapshot" : "full";

  const t = await getTranslations("report");
  const tProfile = await getTranslations("profile");
  const labels = buildStudentProgressReportLabels((key) => t(key));
  const resolvers = await buildReportResolvers();

  const report = await getStudentProgressReport(
    user,
    labels,
    resolvers,
    tProfile("nextMilestoneFallback")
  );

  const pdf = await generateProgressReportPdf(report, labels, variant);
  const safeName = report.snapshot.studentName.replace(/[^\w\s-]/g, "").trim() || "student";
  const filename =
    variant === "snapshot"
      ? `camba-progress-snapshot-${safeName}.pdf`
      : `camba-progress-report-${safeName}.pdf`;

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
