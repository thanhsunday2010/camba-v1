import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { listXpRules } from "@/actions/admin/gamification";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminXpRulesClient } from "@/components/admin/gamification/admin-xp-rules-client";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "gamification.xp")) redirect("/admin/gamification");

  const rules = await listXpRules();

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Gamification › XP"
        title="XP & Cấp độ"
        description="Quy tắc XP theo sự kiện và điều chỉnh thủ công"
      />
      <AdminXpRulesClient rules={rules} canManage={canAccess(user, "gamification.manage")} />
    </div>
  );
}
