"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exportContentBundle, importContentBundle } from "@/actions/admin/bulk";
import type { AdminContentTree } from "@/lib/admin/types";

interface BulkImportExportProps {
  programs: AdminContentTree["programs"];
  onMessage: (msg: string) => void;
}

export function BulkImportExport({ programs, onMessage }: BulkImportExportProps) {
  const [isPending, startTransition] = useTransition();
  const [programId, setProgramId] = useState(programs[0]?.id ?? "");
  const [importJson, setImportJson] = useState("");

  function handleExport() {
    startTransition(async () => {
      const result = await exportContentBundle(programId || undefined);
      if (!result.success || !result.data) {
        onMessage(result.error ?? "Export failed");
        return;
      }
      const blob = new Blob([JSON.stringify(result.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `camba-export-${programId || "all"}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      onMessage("Đã xuất file JSON");
    });
  }

  function handleImport() {
    startTransition(async () => {
      const result = await importContentBundle(importJson);
      onMessage(
        result.success
          ? `Đã import ${result.data?.imported ?? 0} bản ghi`
          : result.error ?? "Import failed"
      );
      if (result.success) setImportJson("");
    });
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Xuất nội dung (Export)</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <select
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            className="w-full h-10 rounded-lg border px-3 text-sm"
          >
            <option value="">Tất cả chương trình</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            Xuất cây nội dung, câu hỏi, placement test và mock test dưới dạng JSON.
          </p>
          <Button onClick={handleExport} disabled={isPending} size="sm">
            Tải xuống JSON
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Nhập nội dung (Import)</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <textarea
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder='Dán JSON export (version: 1)...'
            className="w-full min-h-[160px] rounded-lg border px-3 py-2 text-sm font-mono"
          />
          <p className="text-xs text-gray-500">
            Import tạo bản ghi mới với ID mới. Không ghi đè nội dung hiện có.
          </p>
          <Button
            onClick={handleImport}
            disabled={isPending || !importJson.trim()}
            size="sm"
          >
            Import JSON
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
