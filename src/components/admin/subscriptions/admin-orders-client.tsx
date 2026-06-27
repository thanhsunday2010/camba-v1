"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatVnd } from "@/lib/subscriptions/subscription-catalog";
import type {
  AdminPaymentOrderRow,
  PaymentOrderStatus,
} from "@/lib/admin/subscriptions/types";

const STATUS_LABELS: Record<PaymentOrderStatus, string> = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  expired: "Hết hạn",
  cancelled: "Đã hủy",
};

const STATUS_VARIANT: Record<
  PaymentOrderStatus,
  "default" | "secondary" | "warning" | "outline"
> = {
  pending: "outline",
  paid: "default",
  expired: "secondary",
  cancelled: "warning",
};

interface AdminOrdersClientProps {
  orders: AdminPaymentOrderRow[];
  total: number;
  page: number;
  statusFilter?: PaymentOrderStatus;
}

export function AdminOrdersClient({
  orders,
  total,
  page,
  statusFilter,
}: AdminOrdersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const query = searchParams.get("q") ?? "";

  function navigate(nextPage: number, status?: string, q?: string) {
    const params = new URLSearchParams();
    const s = status ?? statusFilter;
    const search = q ?? query;
    if (s) params.set("status", s);
    if (search) params.set("q", search);
    if (nextPage > 1) params.set("page", String(nextPage));
    router.push(`/admin/subscriptions/orders?${params.toString()}`);
  }

  const totalPages = Math.max(1, Math.ceil(total / 25));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["pending", "paid", "expired", "cancelled"] as PaymentOrderStatus[]).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={statusFilter === s ? "default" : "outline"}
            disabled={isPending}
            onClick={() => startTransition(() => navigate(1, statusFilter === s ? "" : s))}
          >
            {STATUS_LABELS[s]}
          </Button>
        ))}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          startTransition(() => navigate(1, statusFilter, String(fd.get("q") ?? "")));
        }}
      >
        <Input
          name="q"
          defaultValue={query}
          placeholder="Mã đơn CAMBA... hoặc email người dùng"
          className="max-w-md"
        />
        <Button type="submit" variant="outline" disabled={isPending}>
          Tìm kiếm
        </Button>
      </form>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-gray-600">
                  <th className="px-4 py-3 font-medium">Mã đơn</th>
                  <th className="px-4 py-3 font-medium">Người dùng</th>
                  <th className="px-4 py-3 font-medium">Gói</th>
                  <th className="px-4 py-3 font-medium">Số tiền</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 font-medium">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Không có đơn hàng
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-mono text-xs">{o.orderCode}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{o.userName}</div>
                        <div className="text-xs text-gray-500">{o.userEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        {o.tier.toUpperCase()} · {o.program}
                        <div className="text-xs text-gray-500">{o.billingPeriod}</div>
                      </td>
                      <td className="px-4 py-3">{formatVnd(o.amountVnd)} ₫</td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_VARIANT[o.status]}>{STATUS_LABELS[o.status]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {o.paidAt
                          ? `TT: ${new Date(o.paidAt).toLocaleString("vi-VN")}`
                          : `Tạo: ${new Date(o.createdAt).toLocaleString("vi-VN")}`}
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
          {total} đơn · trang {page}/{totalPages}
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
