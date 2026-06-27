import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminPlaceholder } from "@/components/admin/shell/admin-placeholder";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "subscriptions.webhooks")) redirect("/admin/subscriptions");

  return (
    <div>
      <AdminPageHeader breadcrumb="Admin › Thanh toán › Webhook" title="Webhook SePay" />
      <AdminPlaceholder title="Nhật ký webhook SePay" phase="Phase 3" />
    </div>
  );
}
