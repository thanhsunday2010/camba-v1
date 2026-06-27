"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatVnd } from "@/lib/subscriptions/subscription-catalog";
import { setUserSubscription } from "@/actions/admin/subscriptions";
import type {
  AdminPlanDisplayRow,
  AdminUserSubscriptionRow,
} from "@/lib/admin/subscriptions/types";
import type { BillingPeriod, SubscriptionProgram, SubscriptionTier } from "@/lib/subscriptions/subscription-types";

interface AdminPlansClientProps {
  plans: AdminPlanDisplayRow[];
  subscriptions: AdminUserSubscriptionRow[];
  total: number;
  page: number;
  canManage: boolean;
}

export function AdminPlansClient({
  plans,
  subscriptions,
  total,
  page,
  canManage,
}: AdminPlansClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const query = searchParams.get("q") ?? "";

  const [grantEmail, setGrantEmail] = useState("");
  const [grantProgram, setGrantProgram] = useState<SubscriptionProgram>("cambridge");
  const [grantTier, setGrantTier] = useState<SubscriptionTier>("pro");
  const [grantPeriod, setGrantPeriod] = useState<BillingPeriod>("monthly");

  function navigate(nextPage: number, q?: string) {
    const params = new URLSearchParams();
    if (q ?? query) params.set("q", q ?? query);
    if (nextPage > 1) params.set("page", String(nextPage));
    router.push(`/admin/subscriptions/plans?${params.toString()}`);
  }

  function runGrant() {
    startTransition(async () => {
      const result = await setUserSubscription({
        email: grantEmail,
        program: grantProgram,
        tier: grantTier,
        billingPeriod: grantTier === "free" ? null : grantPeriod,
      });
      setMessage(result.success ? "Đã cập nhật gói đăng ký" : result.error ?? "Lỗi");
      if (result.success) {
        setGrantEmail("");
        router.refresh();
      }
    });
  }

  const totalPages = Math.max(1, Math.ceil(total / 25));

  return (
    <div className="space-y-6">
      {message && (
        <p className="rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-900">{message}</p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bảng giá hiện tại</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-gray-600">
                  <th className="px-4 py-3 font-medium">Chương trình</th>
                  <th className="px-4 py-3 font-medium">Gói</th>
                  <th className="px-4 py-3 font-medium">Tháng</th>
                  <th className="px-4 py-3 font-medium">Năm</th>
                  <th className="px-4 py-3 font-medium">AI/ngày</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => (
                  <tr key={`${p.program}-${p.tier}`} className="border-b last:border-0">
                    <td className="px-4 py-3">{p.programLabel}</td>
                    <td className="px-4 py-3">
                      <Badge variant={p.tier === "free" ? "secondary" : "default"}>
                        {p.tierLabel}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {p.monthlyPriceVnd != null ? `${formatVnd(p.monthlyPriceVnd)} ₫` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {p.yearlyPriceVnd != null ? (
                        <>
                          {formatVnd(p.yearlyPriceVnd)} ₫
                          {p.yearlySavingsPercent != null && (
                            <span className="ml-1 text-xs text-green-600">
                              (-{p.yearlySavingsPercent}%)
                            </span>
                          )}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">{p.dailyAiLimit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t px-4 py-3 text-xs text-gray-500">
            Giá và giới hạn AI được cấu hình trong mã nguồn (
            <code>subscription-catalog.ts</code>). Thay đổi giá cần deploy lại.
          </p>
        </CardContent>
      </Card>

      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gán gói thủ công</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-1">
              <Label>Email người dùng</Label>
              <Input
                value={grantEmail}
                onChange={(e) => setGrantEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-1">
              <Label>Chương trình</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={grantProgram}
                onChange={(e) => setGrantProgram(e.target.value as SubscriptionProgram)}
              >
                <option value="cambridge">Cambridge</option>
                <option value="speaking_writing">Speaking & Writing</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>Gói</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={grantTier}
                onChange={(e) => setGrantTier(e.target.value as SubscriptionTier)}
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="vip">VIP</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>Chu kỳ</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={grantPeriod}
                disabled={grantTier === "free"}
                onChange={(e) => setGrantPeriod(e.target.value as BillingPeriod)}
              >
                <option value="monthly">Tháng</option>
                <option value="yearly">Năm</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={runGrant} disabled={isPending || !grantEmail.trim()}>
                Gán gói
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            startTransition(() => navigate(1, String(fd.get("q") ?? "")));
          }}
        >
          <Input name="q" defaultValue={query} placeholder="Tìm email người dùng..." className="max-w-sm" />
          <Button type="submit" variant="outline" disabled={isPending}>
            Tìm kiếm
          </Button>
        </form>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Đăng ký đang hoạt động ({total})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-gray-600">
                    <th className="px-4 py-3 font-medium">Người dùng</th>
                    <th className="px-4 py-3 font-medium">Chương trình</th>
                    <th className="px-4 py-3 font-medium">Gói</th>
                    <th className="px-4 py-3 font-medium">Hết hạn</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        Không có đăng ký
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map((s) => (
                      <tr key={s.id} className="border-b last:border-0">
                        <td className="px-4 py-3">
                          <div className="font-medium">{s.userName}</div>
                          <div className="text-xs text-gray-500">{s.userEmail}</div>
                        </td>
                        <td className="px-4 py-3">{s.program}</td>
                        <td className="px-4 py-3">
                          <Badge>{s.tier.toUpperCase()}</Badge>
                          {s.billingPeriod && (
                            <span className="ml-1 text-xs text-gray-500">{s.billingPeriod}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {s.currentPeriodEnd
                            ? new Date(s.currentPeriodEnd).toLocaleDateString("vi-VN")
                            : "—"}
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
            Trang {page}/{totalPages}
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
    </div>
  );
}
