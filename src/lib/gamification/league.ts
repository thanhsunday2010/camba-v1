import { createClient } from "@/lib/supabase/server";
import { getWeekBounds, getTierFromWeeklyXp } from "@/lib/gamification/constants";
import type { LeagueTier } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type ServerClient = SupabaseClient<Database>;

async function findOrCreateLeague(
  supabase: ServerClient,
  weekStart: string,
  weekEnd: string,
  tier: LeagueTier
) {
  const { data: existing } = await supabase
    .from("leagues")
    .select("*")
    .eq("week_start", weekStart)
    .eq("tier", tier)
    .maybeSingle();

  if (existing) return existing;

  const { data: created } = await supabase
    .from("leagues")
    .insert({
      week_start: weekStart,
      week_end: weekEnd,
      tier,
      is_active: true,
    })
    .select("*")
    .single();

  return created;
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

  const league = await findOrCreateLeague(supabase, weekStart, weekEnd, newTier);
  if (!league) return;

  if (existing && existing.league_id === league.id) {
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
      league_id: league.id,
      user_id: userId,
      weekly_xp: newWeeklyXp,
      tier: newTier,
    });
  }

  await recalculateRanks(supabase, league.id);
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
  const { weekStart } = getWeekBounds();
  const weeklyXp = await getWeeklyXpEarned(userId);
  const tier = getTierFromWeeklyXp(weeklyXp) as LeagueTier;

  const { data: league } = await supabase
    .from("leagues")
    .select("*")
    .eq("week_start", weekStart)
    .eq("tier", tier)
    .maybeSingle();

  if (!league) {
    return { rankings: [], userRank: null, tier, userWeeklyXp: weeklyXp };
  }

  const { data: rankings } = await supabase
    .from("league_rankings")
    .select("*")
    .eq("league_id", league.id)
    .order("weekly_xp", { ascending: false })
    .limit(limit);

  const userIds = rankings?.map((r) => r.user_id) ?? [];
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, full_name, avatar_url").in("id", userIds)
    : { data: [] };

  const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

  const { data: userRanking } = await supabase
    .from("league_rankings")
    .select("*")
    .eq("league_id", league.id)
    .eq("user_id", userId)
    .maybeSingle();

  return {
    rankings: (rankings ?? []).map((r, index) => {
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
