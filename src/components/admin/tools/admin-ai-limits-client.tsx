"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminAiUsageRow } from "@/actions/admin/ai-limits";

interface AdminAiLimitsClientProps {
  rows: AdminAiUsageRow[];
  total: number;
  page: number;
  date: string;
  summary: {
    totalCalls: number;
    uniqueUsers: number;
    unlimitedCount: number;
  };
  unlimitedEmails: string[];
}

export function AdminAiLimitsClient({
  rows,
  total,
  page,
  date,
  summary,
  unlimitedEmails,
}: AdminAiLimitsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const query = searchParams.get("q") ?? "";

  function navigate(nextPage: number, nextDate?: string, q?: string) {
    const params = new URLSearchParams();
    params.set("date", nextDate ?? date);
    if (q ?? query) params.set("q", q ?? query);
    if (nextPage > 1) params.set("page", String(nextPage));
    router.push(`/admin/tools/ai-limits?${params.toString()}`);
  }

  const totalPages = Math.max(1, Math.ceil(total / 30));

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-gray-900">{summary.totalCalls}</p>
            <p className="text-xs text-gray-500">Lượt AI ({date})</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-gray-900">{summary.uniqueUsers}</p>
            <p className="text-xs text-gray-500">Người dùng có gọi AI</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-gray-900">{summary.unlimitedCount}</p>
            <p className="text-xs text-gray-500">Whitelist unlimited hôm nay</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Whitelist không giới hạn (env)</CardTitle>
        </CardHeader>
        <CardContent>
          {unlimitedEmails.length === 0 ? (
            <p className="text-sm text-gray-500">
              Chưa cấu hình <code>AI_UNLIMITED_USER_EMAILS</code> trong biến môi trường.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {unlimitedEmails.map((email) => (
                <li key={email}>
                  <Badge variant="secondary">{email}</Badge>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-gray-500">
            Chỉnh sửa qua Vercel env hoặc <code>.env.local</code>, sau đó redeploy.
          </p>
        </CardContent>
      </Card>

      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          startTransition(() =>
            navigate(1, String(fd.get("date") ?? date), String(fd.get("q") ?? ""))
          );
        }}
      >
        <Input name="date" type="date" defaultValue={date} className="w-40" />
        <Input name="q" defaultValue={query} placeholder="Tìm email..." className="max-w-xs" />
        <Button type="submit" variant="outline" disabled={isPending}>
          Lọc
        </Button>
      </form>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-gray-600">
                  <th className="px-4 py-3 font-medium">Người dùng</th>
                  <th className="px-4 py-3 font-medium">Gói</th>
                  <th className="px-4 py-3 font-medium">Đã dùng</th>
                  <th className="px-4 py-3 font-medium">Giới hạn</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      Không có dữ liệu cho ngày này
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={`${r.userId}-${r.usageDate}`} className="border-b last:border-0">
                      <td className="px-4 py-3">
                        <div className="font-medium">{r.fullName}</div>
                        <div className="text-xs text-gray-500">{r.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{r.tier.toUpperCase()}</Badge>
                        {r.isUnlimited && (
                          <Badge className="ml-1" variant="secondary">
                            ∞
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">{r.aiCallCount}</td>
                      <td className="px-4 py-3">
                        {r.isUnlimited ? "Không giới hạn" : r.dailyLimit}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {total} bản ghi · trang {page}/{totalPages}
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
