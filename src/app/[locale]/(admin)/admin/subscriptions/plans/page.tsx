import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminPlaceholder } from "@/components/admin/shell/admin-placeholder";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "subscriptions.plans")) redirect("/admin/subscriptions");

  return (
    <div>
      <AdminPageHeader breadcrumb="Admin › Thanh toán › Gói" title="Gói đăng ký" />
      <AdminPlaceholder title="Quản lý gói Free / Pro / VIP" phase="Phase 3" />
    </div>
  );
}
