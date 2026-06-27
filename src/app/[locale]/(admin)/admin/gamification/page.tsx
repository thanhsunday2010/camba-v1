import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  canAccess,
  canAccessAdminModule,
  GAMIFICATION_MODULE_PERMISSIONS,
} from "@/lib/auth/admin-permissions";
import { AdminModuleHub } from "@/components/admin/shell/admin-module-hub";
import { Trophy, Star, Flame, Medal } from "lucide-react";
import type { AdminPermission } from "@/lib/auth/admin-permissions";

const GAMIFICATION_HUB_CARDS: {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: typeof Trophy;
  permission: AdminPermission;
}[] = [
  {
    id: "xp",
    title: "XP & Cấp độ",
    description: "xp_rules và logs",
    href: "/admin/gamification/xp",
    icon: Trophy,
    permission: "gamification.xp",
  },
  {
    id: "badges",
    title: "Huy hiệu",
    description: "Badges và gán thủ công",
    href: "/admin/gamification/badges",
    icon: Medal,
    permission: "gamification.badges",
  },
  {
    id: "missions",
    title: "Streak & Nhiệm vụ",
    description: "Daily missions",
    href: "/admin/gamification/missions",
    icon: Flame,
    permission: "gamification.missions",
  },
  {
    id: "leagues",
    title: "Giải đấu tuần",
    description: "Leagues và ranking",
    href: "/admin/gamification/leagues",
    icon: Star,
    permission: "gamification.leagues",
  },
];

export default async function AdminGamificationHubPage() {
  const user = await getCurrentUser();
  if (!user || !canAccessAdminModule(user, GAMIFICATION_MODULE_PERMISSIONS)) {
    redirect("/admin");
  }

  const cards = GAMIFICATION_HUB_CARDS.filter(
    (card) =>
      user.isSuperAdmin ||
      canAccess(user, "gamification.read") ||
      canAccess(user, "gamification.manage") ||
      canAccess(user, card.permission)
  ).map(({ permission: _p, ...card }) => card);

  return (
    <AdminModuleHub
      title="Gamification"
      description="XP, huy hiệu, streak, nhiệm vụ ngày và giải đấu tuần."
      cards={cards}
    />
  );
}
