"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminWebhookEventRow } from "@/lib/admin/subscriptions/types";

interface AdminWebhooksClientProps {
  events: AdminWebhookEventRow[];
  total: number;
  page: number;
}

export function AdminWebhooksClient({ events, total, page }: AdminWebhooksClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / 25));

  function navigate(nextPage: number) {
    const params = new URLSearchParams();
    if (nextPage > 1) params.set("page", String(nextPage));
    router.push(`/admin/subscriptions/webhooks?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-gray-600">
                  <th className="px-4 py-3 font-medium">SePay ID</th>
                  <th className="px-4 py-3 font-medium">Mã đơn</th>
                  <th className="px-4 py-3 font-medium">Nhận lúc</th>
                  <th className="px-4 py-3 font-medium">Payload</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      Chưa có webhook nào
                    </td>
                  </tr>
                ) : (
                  events.map((e) => (
                    <Fragment key={e.sepayId}>
                      <tr key={e.sepayId} className="border-b">
                        <td className="px-4 py-3 font-mono">{e.sepayId}</td>
                        <td className="px-4 py-3 font-mono text-xs">{e.orderCode ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {new Date(e.receivedAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setExpandedId(expandedId === e.sepayId ? null : e.sepayId)
                            }
                          >
                            {expandedId === e.sepayId ? "Ẩn" : "Xem"}
                          </Button>
                        </td>
                      </tr>
                      {expandedId === e.sepayId && (
                        <tr key={`${e.sepayId}-payload`} className="border-b bg-gray-50">
                          <td colSpan={4} className="px-4 py-3">
                            <pre className="max-h-64 overflow-auto rounded bg-white p-3 text-xs">
                              {JSON.stringify(e.payload, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {total} sự kiện · trang {page}/{totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1 || isPending}
            onClick={() => startTransition(() => navigate(page - 1))}
          >
            Trước
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages || isPending}
            onClick={() => startTransition(() => navigate(page + 1))}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}
