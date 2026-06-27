import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminPlaceholder } from "@/components/admin/shell/admin-placeholder";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "gamification.xp")) redirect("/admin/gamification");

  return (
    <div>
      <AdminPageHeader breadcrumb="Admin › Gamification › XP" title="XP & Cấp độ" />
      <AdminPlaceholder title="Quản lý XP rules" phase="Phase 3" />
    </div>
  );
}
