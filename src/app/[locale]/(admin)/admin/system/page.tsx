import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { hasAnyAdminPermission, SYSTEM_MODULE_PERMISSIONS } from "@/lib/auth/admin-permissions";
import { AdminModuleHub } from "@/components/admin/shell/admin-module-hub";
import { filterModuleCards } from "@/components/admin/shell/admin-sidebar";
import { SYSTEM_MODULE_CARDS } from "@/lib/admin/nav-config";

export default async function AdminSystemHubPage() {
  const user = await getCurrentUser();
  if (
    !user ||
    (!user.isSuperAdmin &&
      !hasAnyAdminPermission(user.adminPermissions, SYSTEM_MODULE_PERMISSIONS))
  ) {
    redirect("/admin");
  }

  const cards = filterModuleCards(user, SYSTEM_MODULE_CARDS);

  return (
    <AdminModuleHub
      title="Hệ thống"
      description="Quản lý admin, cài đặt nền tảng và nhật ký audit."
      cards={cards}
    />
  );
}
