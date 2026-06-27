import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminPlaceholder } from "@/components/admin/shell/admin-placeholder";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "audit.read")) redirect("/admin/system");

  return (
    <div>
      <AdminPageHeader breadcrumb="Admin › Hệ thống › Audit" title="Nhật ký & Bảo mật" />
      <AdminPlaceholder title="Admin audit logs" phase="Phase 2" />
    </div>
  );
}
