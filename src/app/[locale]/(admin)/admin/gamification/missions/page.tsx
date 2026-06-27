import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { listDailyMissions } from "@/actions/admin/gamification";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminMissionsClient } from "@/components/admin/gamification/admin-missions-client";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "gamification.missions")) redirect("/admin/gamification");

  const missions = await listDailyMissions();

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Gamification › Nhiệm vụ"
        title="Streak & Nhiệm vụ"
        description="Nhiệm vụ hàng ngày cho học sinh"
      />
      <AdminMissionsClient missions={missions} canManage={canAccess(user, "gamification.manage")} />
    </div>
  );
}
