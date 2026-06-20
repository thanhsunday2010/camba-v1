import { getUserDailyMissions } from "@/lib/gamification/missions";
import { getUserBadges } from "@/lib/gamification/badges";
import { getStreakCalendar } from "@/lib/gamification/streak";
import { getWeeklyLeagueRanking } from "@/lib/gamification/league";

export async function getGamificationDashboardData(userId: string) {
  const [missions, badges, streakCalendar, league] = await Promise.all([
    getUserDailyMissions(userId),
    getUserBadges(userId),
    getStreakCalendar(userId),
    getWeeklyLeagueRanking(userId),
  ]);

  return { missions, badges, streakCalendar, league };
}
