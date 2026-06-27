import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import {
  getSubscriptionPlansForAdmin,
  listManagedSubscriptions,
} from "@/actions/admin/subscriptions";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminPlansClient } from "@/components/admin/subscriptions/admin-plans-client";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "subscriptions.plans")) redirect("/admin/subscriptions");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const [plans, { subscriptions, total }] = await Promise.all([
    getSubscriptionPlansForAdmin(),
    listManagedSubscriptions({ query: params.q, page }),
  ]);

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Thanh toán › Gói"
        title="Gói đăng ký"
        description="Bảng giá và gán gói thủ công cho người dùng"
      />
      <Suspense fallback={null}>
        <AdminPlansClient
          plans={plans}
          subscriptions={subscriptions}
          total={total}
          page={page}
          canManage={canAccess(user, "subscriptions.manage")}
        />
      </Suspense>
    </div>
  );
}
