"use client";

import { useTransition, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportDashboardCsv } from "@/actions/admin/dashboard-export";
import type { DashboardTimeRange } from "@/lib/admin/analytics/types";

interface DashboardExportButtonProps {
  timeRange: DashboardTimeRange;
}

export function DashboardExportButton({ timeRange }: DashboardExportButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleExport() {
    startTransition(async () => {
      setMessage(null);
      const result = await exportDashboardCsv(timeRange);
      if (!result.success) {
        setMessage(result.error);
        return;
      }
      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(url);
      setMessage("Đã tải CSV");
      setTimeout(() => setMessage(null), 3000);
    });
  }

  return (
    <div className="flex items-center gap-2">
      {message && <span className="text-xs text-violet-700">{message}</span>}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={handleExport}
        className="gap-1.5"
      >
        <Download className="h-4 w-4" />
        Xuất CSV
      </Button>
    </div>
  );
}
