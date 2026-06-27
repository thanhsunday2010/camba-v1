import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { listBadges } from "@/actions/admin/gamification";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminBadgesClient } from "@/components/admin/gamification/admin-badges-client";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "gamification.badges")) redirect("/admin/gamification");

  const badges = await listBadges();

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Gamification › Huy hiệu"
        title="Huy hiệu"
        description="Quản lý badge và trao thủ công"
      />
      <AdminBadgesClient badges={badges} canManage={canAccess(user, "gamification.manage")} />
    </div>
  );
}
