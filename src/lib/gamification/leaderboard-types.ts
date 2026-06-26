import { LEAGUE_TIER_THRESHOLDS, getTierFromWeeklyXp } from "@/lib/gamification/constants";

export type LeaderboardEntry = {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  rank: number;
  score: number;
  isCurrentUser: boolean;
};

export type WeeklyLeagueBoardView = {
  tier: string;
  entries: LeaderboardEntry[];
  userRank: number | null;
  userScore: number;
  nextTier: string | null;
  xpToNextTier: number | null;
};

export type LevelLeaderboardView = {
  levelName: string | null;
  entries: LeaderboardEntry[];
  userRank: number | null;
  userScore: number;
};

export type StreakLeaderboardView = {
  entries: LeaderboardEntry[];
  userRank: number | null;
  userScore: number;
};

export type DashboardLeaderboardsView = {
  weeklyLeague: WeeklyLeagueBoardView;
  levelBoard: LevelLeaderboardView;
  streakBoard: StreakLeaderboardView;
};

export const LEAGUE_TIER_LABELS: Record<string, string> = {
  bronze: "Đồng",
  silver: "Bạc",
  gold: "Vàng",
  platinum: "Bạch kim",
  diamond: "Kim cương",
  master: "Cao thủ",
  grandmaster: "Đại cao thủ",
  champion: "Quán quân",
};

export function getNextLeagueTierInfo(
  weeklyXp: number
): { tier: string; xpNeeded: number } | null {
  const currentTier = getTierFromWeeklyXp(weeklyXp);
  const currentIndex = LEAGUE_TIER_THRESHOLDS.findIndex((t) => t.tier === currentTier);
  if (currentIndex < 0 || currentIndex >= LEAGUE_TIER_THRESHOLDS.length - 1) {
    return null;
  }
  const next = LEAGUE_TIER_THRESHOLDS[currentIndex + 1];
  return { tier: next.tier, xpNeeded: Math.max(0, next.minWeeklyXp - weeklyXp) };
}

export function leagueTierLabel(tier: string, labels?: Record<string, string>): string {
  return labels?.[tier] ?? LEAGUE_TIER_LABELS[tier] ?? tier;
}
