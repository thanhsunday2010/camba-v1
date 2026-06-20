import { createClient } from "@/lib/supabase/server";
import { getWeekBounds, getTierFromWeeklyXp } from "@/lib/gamification/constants";
import type { LeagueTier } from "@/types/database";

export async function updateLeagueRanking(
  userId: string,
  xpAmount: number
): Promise<void> {
  const supabase = await createClient();
  const { weekStart, weekEnd } = getWeekBounds();
  const tier = getTierFromWeeklyXp(0) as LeagueTier;

  let { data: league } = await supabase
    .from("leagues")
    .select("*")
    .eq("week_start", weekStart)
    .eq("tier", tier)
    .maybeSingle();

  if (!league) {
    const { data: newLeague } = await supabase
      .from("leagues")
      .insert({
        week_start: weekStart,
        week_end: weekEnd,
        tier,
        is_active: true,
      })
      .select("*")
      .single();
    league = newLeague;
  }

  if (!league) return;

  const { data: existing } = await supabase
    .from("league_rankings")
    .select("*")
    .eq("league_id", league.id)
    .eq("user_id", userId)
    .maybeSingle();

  const newWeeklyXp = (existing?.weekly_xp ?? 0) + xpAmount;
  const newTier = getTierFromWeeklyXp(newWeeklyXp) as LeagueTier;

  if (existing) {
    await supabase
      .from("league_rankings")
      .update({
        weekly_xp: newWeeklyXp,
        tier: newTier,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("league_rankings").insert({
      league_id: league.id,
      user_id: userId,
      weekly_xp: newWeeklyXp,
      tier: newTier,
    });
  }

  await recalculateRanks(league.id);
}

async function recalculateRanks(leagueId: string): Promise<void> {
  const supabase = await createClient();

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

export async function getWeeklyLeagueRanking(userId: string, limit = 10) {
  const supabase = await createClient();
  const { weekStart } = getWeekBounds();

  const { data: league } = await supabase
    .from("leagues")
    .select("*")
    .eq("week_start", weekStart)
    .eq("tier", "bronze")
    .maybeSingle();

  if (!league) return { rankings: [], userRank: null, tier: "bronze" };

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
    rankings: (rankings ?? []).map((r) => {
      const profile = profileMap.get(r.user_id);
      return {
        id: r.id,
        userId: r.user_id,
        weeklyXp: r.weekly_xp,
        rank: r.rank,
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
    tier: userRanking?.tier ?? "bronze",
  };
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
