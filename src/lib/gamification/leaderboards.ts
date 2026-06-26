import { createClient } from "@/lib/supabase/server";
import { getWeekBounds } from "@/lib/gamification/constants";
import {
  getNextLeagueTierInfo,
  type DashboardLeaderboardsView,
  type LeaderboardEntry,
} from "@/lib/gamification/leaderboard-types";
import { buildContextualLeaderboardRows } from "@/lib/gamification/leaderboard-utils";
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
  for (const peerId of peerIds) {
    scoreByUser.set(peerId, 0);
  }
  for (const log of logs ?? []) {
    scoreByUser.set(log.user_id, (scoreByUser.get(log.user_id) ?? 0) + log.xp_amount);
  }

  const sortedAll = [...scoreByUser.entries()]
    .map(([id, score]) => ({ userId: id, score }))
    .sort((a, b) => b.score - a.score || a.userId.localeCompare(b.userId));

  const userScore = scoreByUser.get(userId) ?? 0;
  const userRankIndex = sortedAll.findIndex((row) => row.userId === userId);
  const userRank = userRankIndex >= 0 ? userRankIndex + 1 : null;

  const contextualRows = buildContextualLeaderboardRows(sortedAll, userId, LEADERBOARD_LIMIT);
  const entries = await attachProfiles(contextualRows, userId);

  return { levelName, entries, userRank, userScore };
}

async function getStreakLeaderboard(
  userId: string
): Promise<DashboardLeaderboardsView["streakBoard"]> {
  const supabase = await createClient();

  const { data: allStreaks } = await supabase
    .from("user_streaks")
    .select("user_id, current_streak")
    .gt("current_streak", 0)
    .order("current_streak", { ascending: false })
    .limit(50);

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

  const sortedAll = (allStreaks ?? []).map((row) => ({
    userId: row.user_id,
    score: row.current_streak,
  }));

  if (userScore > 0 && !sortedAll.some((row) => row.userId === userId)) {
    sortedAll.push({ userId, score: userScore });
    sortedAll.sort((a, b) => b.score - a.score || a.userId.localeCompare(b.userId));
  }

  const contextualRows = buildContextualLeaderboardRows(sortedAll, userId, LEADERBOARD_LIMIT);
  const entries = await attachProfiles(contextualRows, userId);

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

  const weeklySortedAll = weeklyLeagueRaw.rankings.map((r) => ({
    userId: r.userId,
    score: r.weeklyXp,
  }));

  if (
    weeklyLeagueRaw.userRank &&
    !weeklySortedAll.some((row) => row.userId === userId)
  ) {
    weeklySortedAll.push({
      userId,
      score: weeklyLeagueRaw.userRank.weeklyXp,
    });
    weeklySortedAll.sort((a, b) => b.score - a.score || a.userId.localeCompare(b.userId));
  }

  const weeklyContextual = buildContextualLeaderboardRows(
    weeklySortedAll,
    userId,
    LEADERBOARD_LIMIT
  );

  const weeklyEntries = await attachProfiles(weeklyContextual, userId);

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
