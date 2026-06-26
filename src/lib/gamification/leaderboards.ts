import { createClient } from "@/lib/supabase/server";
import { getWeekBounds } from "@/lib/gamification/constants";
import {
  getNextLeagueTierInfo,
  type DashboardLeaderboardsView,
  type LeaderboardEntry,
} from "@/lib/gamification/leaderboard-types";
import { getWeeklyLeagueRanking, getWeeklyXpEarned } from "@/lib/gamification/league";

const LEADERBOARD_LIMIT = 8;

async function attachProfiles(
  rows: { userId: string; score: number; rank: number }[],
  currentUserId: string
): Promise<LeaderboardEntry[]> {
  if (rows.length === 0) return [];

  const supabase = await createClient();
  const userIds = rows.map((r) => r.userId);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", userIds);

  const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

  return rows.map((row) => {
    const profile = profileMap.get(row.userId);
    return {
      userId: row.userId,
      fullName: profile?.full_name?.trim() || "Học sinh",
      avatarUrl: profile?.avatar_url ?? null,
      rank: row.rank,
      score: row.score,
      isCurrentUser: row.userId === currentUserId,
    };
  });
}

async function getLevelLeaderboard(
  userId: string,
  levelId: string | null,
  levelName: string | null
): Promise<DashboardLeaderboardsView["levelBoard"]> {
  if (!levelId) {
    return { levelName: null, entries: [], userRank: null, userScore: 0 };
  }

  const supabase = await createClient();
  const { weekStart } = getWeekBounds();
  const weekStartDate = new Date(weekStart);

  const { data: peers } = await supabase
    .from("user_gamification")
    .select("user_id")
    .eq("current_level_id", levelId);

  const peerIds = peers?.map((p) => p.user_id) ?? [];
  if (peerIds.length === 0) {
    return { levelName, entries: [], userRank: null, userScore: 0 };
  }

  const { data: logs } = await supabase
    .from("xp_logs")
    .select("user_id, xp_amount")
    .in("user_id", peerIds)
    .gte("created_at", weekStartDate.toISOString());

  const scoreByUser = new Map<string, number>();
  for (const log of logs ?? []) {
    scoreByUser.set(log.user_id, (scoreByUser.get(log.user_id) ?? 0) + log.xp_amount);
  }

  const sorted = [...scoreByUser.entries()]
    .map(([id, score]) => ({ userId: id, score }))
    .sort((a, b) => b.score - a.score);

  const userScore = scoreByUser.get(userId) ?? 0;
  const userRankIndex = sorted.findIndex((row) => row.userId === userId);
  const userRank = userScore > 0 && userRankIndex >= 0 ? userRankIndex + 1 : userScore > 0 ? sorted.length + 1 : null;

  const topRows = sorted.slice(0, LEADERBOARD_LIMIT).map((row, index) => ({
    userId: row.userId,
    score: row.score,
    rank: index + 1,
  }));

  const entries = await attachProfiles(topRows, userId);

  return { levelName, entries, userRank, userScore };
}

async function getStreakLeaderboard(
  userId: string
): Promise<DashboardLeaderboardsView["streakBoard"]> {
  const supabase = await createClient();

  const { data: topStreaks } = await supabase
    .from("user_streaks")
    .select("user_id, current_streak")
    .gt("current_streak", 0)
    .order("current_streak", { ascending: false })
    .limit(LEADERBOARD_LIMIT);

  const { data: userStreakRow } = await supabase
    .from("user_streaks")
    .select("current_streak")
    .eq("user_id", userId)
    .maybeSingle();

  const userScore = userStreakRow?.current_streak ?? 0;
  let userRank: number | null = null;

  if (userScore > 0) {
    const { count } = await supabase
      .from("user_streaks")
      .select("*", { count: "exact", head: true })
      .gt("current_streak", userScore);
    userRank = (count ?? 0) + 1;
  }

  const topRows = (topStreaks ?? []).map((row, index) => ({
    userId: row.user_id,
    score: row.current_streak,
    rank: index + 1,
  }));

  const entries = await attachProfiles(topRows, userId);

  return { entries, userRank, userScore };
}

export async function getDashboardLeaderboards(
  userId: string,
  levelId: string | null,
  levelName: string | null
): Promise<DashboardLeaderboardsView> {
  const [weeklyLeagueRaw, levelBoard, streakBoard] = await Promise.all([
    getWeeklyLeagueRanking(userId, LEADERBOARD_LIMIT),
    getLevelLeaderboard(userId, levelId, levelName),
    getStreakLeaderboard(userId),
  ]);

  const weeklyXp = weeklyLeagueRaw.userWeeklyXp ?? (await getWeeklyXpEarned(userId));
  const nextTierInfo = getNextLeagueTierInfo(weeklyXp);

  const weeklyEntries: LeaderboardEntry[] = weeklyLeagueRaw.rankings.map((r) => ({
    userId: r.userId,
    fullName: r.fullName?.trim() || "Học sinh",
    avatarUrl: r.avatarUrl,
    rank: r.rank ?? 0,
    score: r.weeklyXp,
    isCurrentUser: r.userId === userId,
  }));

  return {
    weeklyLeague: {
      tier: weeklyLeagueRaw.tier,
      entries: weeklyEntries,
      userRank: weeklyLeagueRaw.userRank?.rank ?? null,
      userScore: weeklyLeagueRaw.userRank?.weeklyXp ?? weeklyXp,
      nextTier: nextTierInfo?.tier ?? null,
      xpToNextTier: nextTierInfo?.xpNeeded ?? null,
    },
    levelBoard,
    streakBoard,
  };
}
