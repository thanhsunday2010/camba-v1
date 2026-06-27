import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminPlaceholder } from "@/components/admin/shell/admin-placeholder";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "users.students")) redirect("/admin/users");

  return (
    <div>
      <AdminPageHeader breadcrumb="Admin › Người dùng › Học sinh" title="Học sinh" />
      <AdminPlaceholder title="Quản lý học sinh" />
    </div>
  );
}
