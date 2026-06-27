"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AuditLogRow } from "@/lib/admin/users/types";

interface AdminAuditLogClientProps {
  logs: AuditLogRow[];
  total: number;
  page: number;
}

export function AdminAuditLogClient({ logs, total, page }: AdminAuditLogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionFilter = searchParams.get("action") ?? "";
  const totalPages = Math.max(1, Math.ceil(total / 50));

  function navigate(nextPage: number, action?: string) {
    const params = new URLSearchParams();
    const a = action ?? actionFilter;
    if (a) params.set("action", a);
    if (nextPage > 1) params.set("page", String(nextPage));
    router.push(`/admin/system/audit?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          navigate(1, String(fd.get("action") ?? ""));
        }}
      >
        <Input
          name="action"
          defaultValue={actionFilter}
          placeholder="Lọc theo action (vd. user.role)"
          className="max-w-sm"
        />
        <Button type="submit" variant="outline">
          Lọc
        </Button>
      </form>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Người thực hiện</th>
                <th className="px-4 py-3">Hành động</th>
                <th className="px-4 py-3">Resource</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b align-top">
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                    {new Date(log.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-xs">{log.actorEmail ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{log.action}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {log.resourceType && (
                      <span>
                        {log.resourceType}
                        {log.resourceId && `: ${log.resourceId.slice(0, 8)}…`}
                      </span>
                    )}
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <pre className="mt-1 max-w-xs overflow-x-auto rounded bg-gray-50 p-1 text-[10px]">
                        {JSON.stringify(log.metadata)}
                      </pre>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="flex justify-between text-sm text-gray-600">
        <span>{total} bản ghi</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => navigate(page - 1)}>
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => navigate(page + 1)}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}
