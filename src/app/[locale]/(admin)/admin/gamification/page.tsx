import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { AdminModuleHub } from "@/components/admin/shell/admin-module-hub";
import { Trophy, Star, Flame, Medal } from "lucide-react";

export default async function AdminGamificationHubPage() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "gamification.read")) redirect("/admin");

  return (
    <AdminModuleHub
      title="Gamification"
      description="XP, huy hiệu, streak, nhiệm vụ ngày và giải đấu tuần."
      cards={[
        { id: "xp", title: "XP & Cấp độ", description: "xp_rules và logs", href: "/admin/gamification/xp", icon: Trophy },
        { id: "badges", title: "Huy hiệu", description: "Badges và gán thủ công", href: "/admin/gamification/badges", icon: Medal },
        { id: "missions", title: "Streak & Nhiệm vụ", description: "Daily missions", href: "/admin/gamification/missions", icon: Flame },
        { id: "leagues", title: "Giải đấu tuần", description: "Leagues và ranking", href: "/admin/gamification/leagues", icon: Star },
      ]}
    />
  );
}
