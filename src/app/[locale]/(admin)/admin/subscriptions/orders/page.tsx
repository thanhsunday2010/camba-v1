import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { listPaymentOrders } from "@/actions/admin/subscriptions";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminOrdersClient } from "@/components/admin/subscriptions/admin-orders-client";
import type { PaymentOrderStatus } from "@/lib/admin/subscriptions/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "subscriptions.orders")) redirect("/admin/subscriptions");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const status = params.status as PaymentOrderStatus | undefined;
  const { orders, total } = await listPaymentOrders({
    status,
    query: params.q,
    page,
  });

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Thanh toán › Đơn hàng"
        title="Đơn thanh toán"
        description={`${total} đơn SePay / VietQR`}
      />
      <Suspense fallback={null}>
        <AdminOrdersClient orders={orders} total={total} page={page} statusFilter={status} />
      </Suspense>
    </div>
  );
}
