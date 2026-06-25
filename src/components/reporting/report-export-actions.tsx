"use client";

import { FileDown, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReportExportVariant } from "@/lib/reporting/report-types";

interface ReportExportActionsProps {
  exportSnapshotLabel: string;
  exportFullLabel: string;
  printLabel: string;
}

export function ReportExportActions({
  exportSnapshotLabel,
  exportFullLabel,
  printLabel,
}: ReportExportActionsProps) {
  function download(variant: ReportExportVariant) {
    window.location.href = `/api/reports/progress?variant=${variant}`;
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap print:hidden">
      <Button
        type="button"
        variant="quest"
        size="lg"
        className="w-full sm:w-auto min-h-[var(--touch-target-min)] gap-2"
        onClick={() => download("snapshot")}
      >
        <FileDown className="h-4 w-4" aria-hidden />
        {exportSnapshotLabel}
      </Button>
      <Button
        type="button"
        variant="default"
        size="lg"
        className="w-full sm:w-auto min-h-[var(--touch-target-min)] gap-2"
        onClick={() => download("full")}
      >
        <FileDown className="h-4 w-4" aria-hidden />
        {exportFullLabel}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full sm:w-auto min-h-[var(--touch-target-min)] gap-2"
        onClick={() => window.print()}
      >
        <Printer className="h-4 w-4" aria-hidden />
        {printLabel}
      </Button>
    </div>
  );
}
