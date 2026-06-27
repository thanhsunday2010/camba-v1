import { createClient } from "@/lib/supabase/server";
import { getMonthBounds } from "@/lib/gamification/constants";
import {
  getNextLeagueTierInfo,
  type DashboardLeaderboardsView,
  type LeaderboardBoardView,
  type LeaderboardEntry,
} from "@/lib/gamification/leaderboard-types";
import {
  buildContextualLeaderboardRows,
  type ScoredLeaderboardRow,
} from "@/lib/gamification/leaderboard-utils";
import { getWeeklyLeagueRanking, getWeeklyXpEarned } from "@/lib/gamification/league";

const LEADERBOARD_LIMIT = 8;
const LEADERBOARD_POOL = 50;

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

function sortScoreRows(rows: ScoredLeaderboardRow[]): ScoredLeaderboardRow[] {
  return [...rows].sort((a, b) => b.score - a.score || a.userId.localeCompare(b.userId));
}

async function finalizeBoard(
  sortedAll: ScoredLeaderboardRow[],
  userId: string,
  userScore: number
): Promise<LeaderboardBoardView> {
  const rankedAll = sortScoreRows(sortedAll);
  const userRankIndex = rankedAll.findIndex((row) => row.userId === userId);
  let userRank = userRankIndex >= 0 ? userRankIndex + 1 : null;

  if (userRank == null && userScore > 0) {
    userRank =
      rankedAll.filter((row) => row.score > userScore).length +
      rankedAll.filter((row) => row.score === userScore && row.userId < userId).length +
      1;
  }

  const pool = rankedAll.slice(0, LEADERBOARD_POOL);
  if (userScore > 0 && !pool.some((row) => row.userId === userId)) {
    pool.push({ userId, score: userScore });
  }

  const contextualRows = buildContextualLeaderboardRows(
    sortScoreRows(pool),
    userId,
    LEADERBOARD_LIMIT
  );
  const entries = await attachProfiles(contextualRows, userId);

  return { entries, userRank, userScore };
}

async function getMonthlyXpLeaderboard(userId: string): Promise<LeaderboardBoardView> {
  const supabase = await createClient();
  const { monthStart } = getMonthBounds();
  const monthStartDate = new Date(`${monthStart}T00:00:00.000Z`);

  const { data: logs } = await supabase
    .from("xp_logs")
    .select("user_id, xp_amount")
    .gte("created_at", monthStartDate.toISOString());

  const scoreByUser = new Map<string, number>();
  for (const log of logs ?? []) {
    scoreByUser.set(log.user_id, (scoreByUser.get(log.user_id) ?? 0) + log.xp_amount);
  }

  const sortedAll = [...scoreByUser.entries()].map(([id, score]) => ({ userId: id, score }));
  const userScore = scoreByUser.get(userId) ?? 0;

  return finalizeBoard(sortedAll, userId, userScore);
}

async function getAllTimeXpLeaderboard(userId: string): Promise<LeaderboardBoardView> {
  const supabase = await createClient();

  const { data: topRows } = await supabase
    .from("user_gamification")
    .select("user_id, total_xp")
    .gt("total_xp", 0)
    .order("total_xp", { ascending: false })
    .limit(LEADERBOARD_POOL);

  const { data: userRow } = await supabase
    .from("user_gamification")
    .select("total_xp")
    .eq("user_id", userId)
    .maybeSingle();

  const userScore = userRow?.total_xp ?? 0;
  const sortedAll =
    topRows?.map((row) => ({ userId: row.user_id, score: row.total_xp })) ?? [];

  return finalizeBoard(sortedAll, userId, userScore);
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

  const { data: peers } = await supabase
    .from("user_gamification")
    .select("user_id, total_xp")
    .eq("current_level_id", levelId)
    .gt("total_xp", 0)
    .order("total_xp", { ascending: false })
    .limit(LEADERBOARD_POOL);

  const { data: userRow } = await supabase
    .from("user_gamification")
    .select("total_xp")
    .eq("user_id", userId)
    .maybeSingle();

  const userScore = userRow?.total_xp ?? 0;
  const sortedAll =
    peers?.map((row) => ({ userId: row.user_id, score: row.total_xp })) ?? [];
  const board = await finalizeBoard(sortedAll, userId, userScore);

  return { levelName, ...board };
}

async function getStreakLeaderboard(
  userId: string,
  field: "current_streak" | "best_streak"
): Promise<LeaderboardBoardView> {
  const supabase = await createClient();

  if (field === "current_streak") {
    const { data: topRows } = await supabase
      .from("user_streaks")
      .select("user_id, current_streak")
      .gt("current_streak", 0)
      .order("current_streak", { ascending: false })
      .limit(LEADERBOARD_POOL);

    const { data: userRow } = await supabase
      .from("user_streaks")
      .select("current_streak")
      .eq("user_id", userId)
      .maybeSingle();

    const userScore = userRow?.current_streak ?? 0;
    const sortedAll =
      topRows?.map((row) => ({ userId: row.user_id, score: row.current_streak })) ?? [];

    return finalizeBoard(sortedAll, userId, userScore);
  }

  const { data: topRows } = await supabase
    .from("user_streaks")
    .select("user_id, best_streak")
    .gt("best_streak", 0)
    .order("best_streak", { ascending: false })
    .limit(LEADERBOARD_POOL);

  const { data: userRow } = await supabase
    .from("user_streaks")
    .select("best_streak")
    .eq("user_id", userId)
    .maybeSingle();

  const userScore = userRow?.best_streak ?? 0;
  const sortedAll =
    topRows?.map((row) => ({ userId: row.user_id, score: row.best_streak })) ?? [];

  return finalizeBoard(sortedAll, userId, userScore);
}

export async function getDashboardLeaderboards(
  userId: string,
  levelId: string | null,
  levelName: string | null
): Promise<DashboardLeaderboardsView> {
  const [
    weeklyLeagueRaw,
    monthlyBoard,
    allTimeBoard,
    levelBoard,
    streakBoard,
    bestStreakBoard,
  ] = await Promise.all([
    getWeeklyLeagueRanking(userId, LEADERBOARD_LIMIT),
    getMonthlyXpLeaderboard(userId),
    getAllTimeXpLeaderboard(userId),
    getLevelLeaderboard(userId, levelId, levelName),
    getStreakLeaderboard(userId, "current_streak"),
    getStreakLeaderboard(userId, "best_streak"),
  ]);

  const weeklyXp = weeklyLeagueRaw.userWeeklyXp ?? (await getWeeklyXpEarned(userId));
  const nextTierInfo = getNextLeagueTierInfo(weeklyXp);

  const weeklySortedAll = weeklyLeagueRaw.rankings.map((r) => ({
    userId: r.userId,
    score: r.weeklyXp,
  }));

  if (weeklyLeagueRaw.userRank && !weeklySortedAll.some((row) => row.userId === userId)) {
    weeklySortedAll.push({
      userId,
      score: weeklyLeagueRaw.userRank.weeklyXp,
    });
  }

  const weeklyBoard = await finalizeBoard(weeklySortedAll, userId, weeklyXp);

  return {
    weeklyLeague: {
      ...weeklyBoard,
      tier: weeklyLeagueRaw.tier,
      nextTier: nextTierInfo?.tier ?? null,
      xpToNextTier: nextTierInfo?.xpNeeded ?? null,
    },
    monthlyBoard,
    allTimeBoard,
    levelBoard,
    streakBoard,
    bestStreakBoard,
  };
}
