"use server";

import { revalidatePath } from "next/cache";
import { createAdminAnalyticsClient } from "@/lib/supabase/admin-analytics";
import { writeAuditLog } from "@/lib/admin/audit";
import { requirePermission } from "@/actions/admin/_shared";
import { calculateLevelFromXp } from "@/lib/gamification/constants";
import type {
  AdminBadgeRow,
  AdminDailyMissionRow,
  AdminLeagueRankingRow,
  AdminLeagueRow,
  AdminXpRuleRow,
} from "@/lib/admin/gamification/types";
import type {
  BadgeDbRow,
  DailyMissionDbRow,
  LeagueDbRow,
  LeagueRankingDbRow,
  ProfileRow,
  UserGamificationRow,
  XpRuleDbRow,
} from "@/lib/admin/db-rows";
import type { LeagueTier, XpEventType } from "@/types/database";

const PAGE_SIZE = 25;

function revalidateGamification() {
  revalidatePath("/admin/gamification", "layout");
}

export async function listXpRules(): Promise<AdminXpRuleRow[]> {
  await requirePermission("gamification.xp");

  const supabase = createAdminAnalyticsClient();
  const { data } = (await supabase
    .from("xp_rules")
    .select("id, event_type, xp_amount, coin_amount, description, is_active")
    .order("event_type")) as { data: XpRuleDbRow[] | null };

  return (data ?? []).map((r) => ({
    id: r.id,
    eventType: r.event_type as XpEventType,
    xpAmount: r.xp_amount,
    coinAmount: r.coin_amount,
    description: r.description,
    isActive: r.is_active,
  }));
}

export async function updateXpRule(input: {
  eventType: XpEventType;
  xpAmount: number;
  coinAmount: number;
  description?: string;
  isActive: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const actor = await requirePermission("gamification.manage");
  const supabase = createAdminAnalyticsClient();

  const { error } = await supabase
    .from("xp_rules")
    .update({
      xp_amount: input.xpAmount,
      coin_amount: input.coinAmount,
      description: input.description ?? null,
      is_active: input.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("event_type", input.eventType);

  if (error) return { success: false, error: error.message };

  await writeAuditLog({
    actorId: actor.id,
    action: "gamification.xp_rule_update",
    resourceType: "xp_rule",
    resourceId: input.eventType,
    metadata: input,
  });

  revalidateGamification();
  return { success: true };
}

export async function adjustUserXp(input: {
  email: string;
  xpDelta: number;
  coinDelta?: number;
  reason?: string;
}): Promise<{ success: boolean; error?: string }> {
  const actor = await requirePermission("gamification.manage");
  const supabase = createAdminAnalyticsClient();
  const email = input.email.trim().toLowerCase();
  if (!email) return { success: false, error: "Email không hợp lệ" };
  if (input.xpDelta === 0 && (input.coinDelta ?? 0) === 0) {
    return { success: false, error: "Nhập XP hoặc coin khác 0" };
  }

  const { data: profile } = (await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle()) as { data: { id: string } | null };

  if (!profile) return { success: false, error: "Không tìm thấy người dùng" };

  const { data: gamification } = (await supabase
    .from("user_gamification")
    .select("user_id, total_xp, level, coins")
    .eq("user_id", profile.id)
    .maybeSingle()) as { data: UserGamificationRow | null };

  if (!gamification) return { success: false, error: "Chưa có dữ liệu gamification" };

  const coinDelta = input.coinDelta ?? 0;
  const newTotalXp = Math.max(0, gamification.total_xp + input.xpDelta);
  const newCoins = Math.max(0, gamification.coins + coinDelta);
  const newLevel = calculateLevelFromXp(newTotalXp);

  await supabase.from("xp_logs").insert({
    user_id: profile.id,
    event_type: "admin_adjustment",
    xp_amount: input.xpDelta,
    coin_amount: coinDelta,
    reference_type: "admin",
    metadata: { reason: input.reason ?? null, actor_id: actor.id },
  });

  const { error } = await supabase
    .from("user_gamification")
    .update({
      total_xp: newTotalXp,
      coins: newCoins,
      level: newLevel,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", profile.id);

  if (error) return { success: false, error: error.message };

  await writeAuditLog({
    actorId: actor.id,
    action: "gamification.xp_adjust",
    resourceType: "user",
    resourceId: profile.id,
    metadata: { email, xpDelta: input.xpDelta, coinDelta, reason: input.reason },
  });

  revalidateGamification();
  return { success: true };
}

export async function listBadges(): Promise<AdminBadgeRow[]> {
  await requirePermission("gamification.badges");

  const supabase = createAdminAnalyticsClient();
  const { data: badges } = (await supabase
    .from("badges")
    .select("*")
    .order("slug")) as { data: BadgeDbRow[] | null };

  const badgeIds = (badges ?? []).map((b) => b.id);
  const { data: counts } = badgeIds.length
    ? ((await supabase.from("user_badges").select("badge_id")) as {
        data: { badge_id: string }[] | null;
      })
    : { data: [] as { badge_id: string }[] };

  const countMap = new Map<string, number>();
  for (const row of counts ?? []) {
    countMap.set(row.badge_id, (countMap.get(row.badge_id) ?? 0) + 1);
  }

  return (badges ?? []).map((b) => ({
    id: b.id,
    slug: b.slug,
    name: b.name,
    description: b.description,
    iconUrl: b.icon_url,
    criteria: b.criteria ?? {},
    xpReward: b.xp_reward,
    coinReward: b.coin_reward,
    isActive: b.is_active,
    earnedCount: countMap.get(b.id) ?? 0,
  }));
}

export async function saveBadge(input: {
  id?: string;
  slug: string;
  name: string;
  description?: string;
  xpReward: number;
  coinReward: number;
  isActive: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const actor = await requirePermission("gamification.manage");
  const supabase = createAdminAnalyticsClient();
  const slug = input.slug.trim().toLowerCase().replace(/\s+/g, "-");
  if (!slug || !input.name.trim()) return { success: false, error: "Slug và tên bắt buộc" };

  const payload = {
    slug,
    name: input.name.trim(),
    description: input.description?.trim() ?? null,
    xp_reward: input.xpReward,
    coin_reward: input.coinReward,
    is_active: input.isActive,
    criteria: {},
  };

  if (input.id) {
    const { error } = await supabase.from("badges").update(payload).eq("id", input.id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from("badges").insert(payload);
    if (error) return { success: false, error: error.message };
  }

  await writeAuditLog({
    actorId: actor.id,
    action: input.id ? "gamification.badge_update" : "gamification.badge_create",
    resourceType: "badge",
    resourceId: slug,
    metadata: input,
  });

  revalidateGamification();
  return { success: true };
}

export async function grantBadgeToUser(input: {
  email: string;
  badgeId: string;
}): Promise<{ success: boolean; error?: string }> {
  const actor = await requirePermission("gamification.manage");
  const supabase = createAdminAnalyticsClient();
  const email = input.email.trim().toLowerCase();

  const { data: profile } = (await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle()) as { data: { id: string } | null };

  if (!profile) return { success: false, error: "Không tìm thấy người dùng" };

  const { error } = await supabase.from("user_badges").upsert(
    { user_id: profile.id, badge_id: input.badgeId, metadata: { granted_by: "admin" } },
    { onConflict: "user_id,badge_id", ignoreDuplicates: true }
  );

  if (error) return { success: false, error: error.message };

  await writeAuditLog({
    actorId: actor.id,
    action: "gamification.badge_grant",
    resourceType: "user_badge",
    resourceId: profile.id,
    metadata: { email, badgeId: input.badgeId },
  });

  revalidateGamification();
  return { success: true };
}

export async function listDailyMissions(): Promise<AdminDailyMissionRow[]> {
  await requirePermission("gamification.missions");

  const supabase = createAdminAnalyticsClient();
  const { data } = (await supabase
    .from("daily_missions")
    .select("*")
    .order("slug")) as { data: DailyMissionDbRow[] | null };

  return (data ?? []).map((m) => ({
    id: m.id,
    slug: m.slug,
    title: m.title,
    description: m.description,
    missionType: m.mission_type,
    targetValue: m.target_value,
    xpReward: m.xp_reward,
    coinReward: m.coin_reward,
    isActive: m.is_active,
  }));
}

export async function saveDailyMission(input: {
  id?: string;
  slug: string;
  title: string;
  description?: string;
  missionType: string;
  targetValue: number;
  xpReward: number;
  coinReward: number;
  isActive: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const actor = await requirePermission("gamification.manage");
  const supabase = createAdminAnalyticsClient();
  const slug = input.slug.trim().toLowerCase().replace(/\s+/g, "-");
  if (!slug || !input.title.trim()) return { success: false, error: "Slug và tiêu đề bắt buộc" };

  const payload = {
    slug,
    title: input.title.trim(),
    description: input.description?.trim() ?? null,
    mission_type: input.missionType.trim(),
    target_value: input.targetValue,
    xp_reward: input.xpReward,
    coin_reward: input.coinReward,
    is_active: input.isActive,
    metadata: {},
  };

  if (input.id) {
    const { error } = await supabase.from("daily_missions").update(payload).eq("id", input.id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from("daily_missions").insert(payload);
    if (error) return { success: false, error: error.message };
  }

  await writeAuditLog({
    actorId: actor.id,
    action: input.id ? "gamification.mission_update" : "gamification.mission_create",
    resourceType: "daily_mission",
    resourceId: slug,
    metadata: input,
  });

  revalidateGamification();
  return { success: true };
}

export async function listLeagues(options?: {
  limit?: number;
}): Promise<AdminLeagueRow[]> {
  await requirePermission("gamification.leagues");

  const supabase = createAdminAnalyticsClient();
  const limit = options?.limit ?? 12;

  const { data: leagues } = (await supabase
    .from("leagues")
    .select("id, week_start, week_end, tier, is_active")
    .order("week_start", { ascending: false })
    .limit(limit)) as { data: LeagueDbRow[] | null };

  const leagueIds = (leagues ?? []).map((l) => l.id);
  const { data: rankings } = leagueIds.length
    ? ((await supabase
        .from("league_rankings")
        .select("league_id")
        .in("league_id", leagueIds)) as { data: { league_id: string }[] | null })
    : { data: [] as { league_id: string }[] };

  const countMap = new Map<string, number>();
  for (const r of rankings ?? []) {
    countMap.set(r.league_id, (countMap.get(r.league_id) ?? 0) + 1);
  }

  return (leagues ?? []).map((l) => ({
    id: l.id,
    weekStart: l.week_start,
    weekEnd: l.week_end,
    tier: l.tier as LeagueTier,
    isActive: l.is_active,
    participantCount: countMap.get(l.id) ?? 0,
  }));
}

export async function getLeagueRankings(
  leagueId: string
): Promise<AdminLeagueRankingRow[]> {
  await requirePermission("gamification.leagues");

  const supabase = createAdminAnalyticsClient();
  const { data } = (await supabase
    .from("league_rankings")
    .select("rank, user_id, weekly_xp, tier")
    .eq("league_id", leagueId)
    .order("weekly_xp", { ascending: false })
    .limit(50)) as { data: LeagueRankingDbRow[] | null };

  const userIds = [...new Set((data ?? []).map((r) => r.user_id))];
  const { data: profiles } = userIds.length
    ? ((await supabase.from("profiles").select("id, email, full_name").in("id", userIds)) as {
        data: Pick<ProfileRow, "id" | "email" | "full_name">[] | null;
      })
    : { data: [] };

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  return (data ?? []).map((r, i) => {
    const profile = profileMap.get(r.user_id);
    return {
      rank: r.rank ?? i + 1,
      userId: r.user_id,
      userEmail: profile?.email ?? "—",
      userName: profile?.full_name ?? "—",
      weeklyXp: r.weekly_xp,
      tier: r.tier as LeagueTier,
    };
  });
}
