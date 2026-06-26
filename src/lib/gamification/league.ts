import { createClient } from "@/lib/supabase/server";
import { getWeekBounds, getTierFromWeeklyXp } from "@/lib/gamification/constants";
import type { LeagueTier } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type ServerClient = SupabaseClient<Database>;

export type UserLeagueSnapshot = {
  rank: number | null;
  tier: LeagueTier;
  weeklyXp: number;
};

async function ensureWeekLeagueId(
  supabase: ServerClient,
  weekStart: string,
  weekEnd: string,
  tier: LeagueTier
): Promise<string | null> {
  const { data, error } = await supabase.rpc("ensure_week_league", {
    p_week_start: weekStart,
    p_week_end: weekEnd,
    p_tier: tier,
  });

  if (error) {
    console.error("ensure_week_league failed:", error.message);
    return null;
  }

  return typeof data === "string" ? data : null;
}

async function recalculateRanks(supabase: ServerClient, leagueId: string): Promise<void> {
  const { data: rankings } = await supabase
    .from("league_rankings")
    .select("id, weekly_xp")
    .eq("league_id", leagueId)
    .order("weekly_xp", { ascending: false });

  for (let i = 0; i < (rankings ?? []).length; i++) {
    await supabase
      .from("league_rankings")
      .update({ rank: i + 1 })
      .eq("id", rankings![i].id);
  }
}

async function findUserWeekRanking(supabase: ServerClient, userId: string, weekStart: string) {
  const { data: weekLeagues } = await supabase
    .from("leagues")
    .select("id")
    .eq("week_start", weekStart);

  const leagueIds = weekLeagues?.map((l) => l.id) ?? [];
  if (leagueIds.length === 0) return null;

  const { data } = await supabase
    .from("league_rankings")
    .select("*")
    .eq("user_id", userId)
    .in("league_id", leagueIds)
    .maybeSingle();

  return data;
}

export async function getUserLeagueSnapshot(userId: string): Promise<UserLeagueSnapshot> {
  const supabase = await createClient();
  const { weekStart, weekEnd } = getWeekBounds();
  const weeklyXp = await getWeeklyXpEarned(userId);
  const tier = getTierFromWeeklyXp(weeklyXp) as LeagueTier;

  let { data: league } = await supabase
    .from("leagues")
    .select("id")
    .eq("week_start", weekStart)
    .eq("tier", tier)
    .maybeSingle();

  if (!league && weeklyXp > 0) {
    const leagueId = await ensureWeekLeagueId(supabase, weekStart, weekEnd, tier);
    if (leagueId) {
      league = { id: leagueId };
    }
  }

  if (!league) {
    return { rank: null, tier, weeklyXp };
  }

  let { data: userRanking } = await supabase
    .from("league_rankings")
    .select("rank, weekly_xp")
    .eq("league_id", league.id)
    .eq("user_id", userId)
    .maybeSingle();

  if (!userRanking && weeklyXp > 0) {
    await supabase.from("league_rankings").insert({
      league_id: league.id,
      user_id: userId,
      weekly_xp: weeklyXp,
      tier,
    });
    await recalculateRanks(supabase, league.id);
    const refreshed = await supabase
      .from("league_rankings")
      .select("rank, weekly_xp")
      .eq("league_id", league.id)
      .eq("user_id", userId)
      .maybeSingle();
    userRanking = refreshed.data;
  }

  return {
    rank: userRanking?.rank ?? null,
    tier,
    weeklyXp: userRanking?.weekly_xp ?? weeklyXp,
  };
}

export async function updateLeagueRanking(
  userId: string,
  xpAmount: number
): Promise<void> {
  const supabase = await createClient();
  const { weekStart, weekEnd } = getWeekBounds();

  const existing = await findUserWeekRanking(supabase, userId, weekStart);
  const newWeeklyXp = (existing?.weekly_xp ?? 0) + xpAmount;
  const newTier = getTierFromWeeklyXp(newWeeklyXp) as LeagueTier;
  const oldLeagueId = existing?.league_id ?? null;

  const leagueId = await ensureWeekLeagueId(supabase, weekStart, weekEnd, newTier);
  if (!leagueId) return;

  if (existing && existing.league_id === leagueId) {
    await supabase
      .from("league_rankings")
      .update({
        weekly_xp: newWeeklyXp,
        tier: newTier,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    if (existing) {
      await supabase.from("league_rankings").delete().eq("id", existing.id);
      if (oldLeagueId) await recalculateRanks(supabase, oldLeagueId);
    }

    await supabase.from("league_rankings").insert({
      league_id: leagueId,
      user_id: userId,
      weekly_xp: newWeeklyXp,
      tier: newTier,
    });
  }

  await recalculateRanks(supabase, leagueId);
}

export async function getWeeklyXpEarned(userId: string): Promise<number> {
  const supabase = await createClient();
  const { weekStart } = getWeekBounds();
  const weekStartDate = new Date(weekStart);

  const { data: logs } = await supabase
    .from("xp_logs")
    .select("xp_amount")
    .eq("user_id", userId)
    .gte("created_at", weekStartDate.toISOString());

  return logs?.reduce((sum, l) => sum + l.xp_amount, 0) ?? 0;
}

export async function getWeeklyLeagueRanking(userId: string, limit = 10) {
  const supabase = await createClient();
  const { weekStart, weekEnd } = getWeekBounds();
  const weeklyXp = await getWeeklyXpEarned(userId);
  const tier = getTierFromWeeklyXp(weeklyXp) as LeagueTier;

  let { data: league } = await supabase
    .from("leagues")
    .select("*")
    .eq("week_start", weekStart)
    .eq("tier", tier)
    .maybeSingle();

  if (!league && weeklyXp > 0) {
    const leagueId = await ensureWeekLeagueId(supabase, weekStart, weekEnd, tier);
    if (leagueId) {
      const { data: createdLeague } = await supabase
        .from("leagues")
        .select("*")
        .eq("id", leagueId)
        .maybeSingle();
      league = createdLeague;
    }
  }

  if (!league) {
    return { rankings: [], userRank: null, tier, userWeeklyXp: weeklyXp };
  }

  const { data: allRankings } = await supabase
    .from("league_rankings")
    .select("*")
    .eq("league_id", league.id)
    .order("weekly_xp", { ascending: false })
    .limit(Math.max(limit, 50));

  const { data: userRanking } = await supabase
    .from("league_rankings")
    .select("*")
    .eq("league_id", league.id)
    .eq("user_id", userId)
    .maybeSingle();

  const userIds = allRankings?.map((r) => r.user_id) ?? [];
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, full_name, avatar_url").in("id", userIds)
    : { data: [] };

  const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

  return {
    rankings: (allRankings ?? []).map((r, index) => {
      const profile = profileMap.get(r.user_id);
      return {
        id: r.id,
        userId: r.user_id,
        weeklyXp: r.weekly_xp,
        rank: r.rank ?? index + 1,
        tier: r.tier,
        fullName: profile?.full_name ?? "",
        avatarUrl: profile?.avatar_url ?? null,
      };
    }),
    userRank: userRanking
      ? {
          rank: userRanking.rank,
          weeklyXp: userRanking.weekly_xp,
          tier: userRanking.tier,
        }
      : null,
    tier,
    userWeeklyXp: weeklyXp,
  };
}
