import { getUserDailyMissions } from "@/lib/gamification/missions";
import { getUserBadges } from "@/lib/gamification/badges";
import { getStreakCalendar } from "@/lib/gamification/streak";

export async function getGamificationDashboardData(userId: string) {
  const [missions, badges, streakCalendar] = await Promise.all([
    getUserDailyMissions(userId),
    getUserBadges(userId),
    getStreakCalendar(userId),
  ]);

  return { missions, badges, streakCalendar };
}
