import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { listWebhookEvents } from "@/actions/admin/subscriptions";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminWebhooksClient } from "@/components/admin/subscriptions/admin-webhooks-client";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "subscriptions.webhooks")) redirect("/admin/subscriptions");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const { events, total } = await listWebhookEvents({ page });

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Thanh toán › Webhook"
        title="Nhật ký webhook SePay"
        description="Theo dõi sự kiện thanh toán từ SePay"
      />
      <Suspense fallback={null}>
        <AdminWebhooksClient events={events} total={total} page={page} />
      </Suspense>
    </div>
  );
}
