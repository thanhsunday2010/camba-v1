import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { listAdminAssignments, listRoleTemplates } from "@/actions/admin/admins";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminAssignmentsManager } from "@/components/admin/system/admin-assignments-manager";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "users.admin")) redirect("/admin/system");

  const [assignments, templates] = await Promise.all([
    listAdminAssignments(),
    listRoleTemplates(),
  ]);

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Hệ thống › Quản lý Admin"
        title="Quản lý Admin"
        description="Gán mẫu vai trò và tùy chỉnh quyền từng admin"
      />
      <AdminAssignmentsManager
        assignments={assignments}
        templates={templates}
        isSuperAdmin={user.isSuperAdmin}
      />
    </div>
  );
}
