import { renderToBuffer } from "@react-pdf/renderer";
import { ProgressReportPdfDocument } from "@/lib/reporting/pdf/progress-report-pdf-document";
import type { StudentProgressReportLabels } from "@/lib/reporting/report-labels";
import type {
  ReportExportVariant,
  StudentProgressReportViewModel,
} from "@/lib/reporting/report-types";

export async function generateProgressReportPdf(
  report: StudentProgressReportViewModel,
  labels: StudentProgressReportLabels,
  variant: ReportExportVariant = "full"
): Promise<Buffer> {
  const buffer = await renderToBuffer(
    <ProgressReportPdfDocument report={report} labels={labels} variant={variant} />
  );
  return Buffer.from(buffer);
}
