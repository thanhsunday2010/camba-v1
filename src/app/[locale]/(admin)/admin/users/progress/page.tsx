import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminPlaceholder } from "@/components/admin/shell/admin-placeholder";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "users.progress")) redirect("/admin/users");

  return (
    <div>
      <AdminPageHeader breadcrumb="Admin › Người dùng › Tiến độ" title="Tiến độ học tập" />
      <AdminPlaceholder title="Tra cứu tiến độ học tập" />
    </div>
  );
}
