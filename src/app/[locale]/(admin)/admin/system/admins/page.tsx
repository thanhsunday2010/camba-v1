import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminPlaceholder } from "@/components/admin/shell/admin-placeholder";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "users.admin")) redirect("/admin/system");

  return (
    <div>
      <AdminPageHeader breadcrumb="Admin › Hệ thống › Admin" title="Quản lý Admin" />
      <AdminPlaceholder title="Gán vai trò và quyền admin" phase="Phase 2" />
    </div>
  );
}
