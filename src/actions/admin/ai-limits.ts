"use server";

import { createAdminAnalyticsClient } from "@/lib/supabase/admin-analytics";
import { requirePermission } from "@/actions/admin/_shared";
import { getAiUnlimitedEmails } from "@/lib/subscriptions/ai-usage-exemptions";
import { AI_DAILY_LIMITS } from "@/lib/subscriptions/subscription-catalog";
import type { ProfileRow } from "@/lib/admin/db-rows";
import type { SubscriptionTier } from "@/lib/subscriptions/subscription-types";

const PAGE_SIZE = 30;

export interface AdminAiUsageRow {
  userId: string;
  email: string;
  fullName: string;
  tier: SubscriptionTier;
  usageDate: string;
  aiCallCount: number;
  dailyLimit: number;
  isUnlimited: boolean;
}

export async function listAiUnlimitedEmails(): Promise<string[]> {
  await requirePermission("tools.ai");
  return [...getAiUnlimitedEmails()];
}

export async function listAiUsageDaily(options: {
  date?: string;
  query?: string;
  page?: number;
}): Promise<{ rows: AdminAiUsageRow[]; total: number; page: number; date: string }> {
  await requirePermission("tools.ai");

  const supabase = createAdminAnalyticsClient();
  const page = Math.max(1, options.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;
  const usageDate =
    options.date ?? new Date().toISOString().slice(0, 10);

  let userFilterIds: string[] | null = null;
  const query = options.query?.trim() ?? "";
  if (query) {
    const { data: profiles } = (await supabase
      .from("profiles")
      .select("id")
      .or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(50)) as { data: { id: string }[] | null };
    userFilterIds = (profiles ?? []).map((p) => p.id);
    if (userFilterIds.length === 0) {
      return { rows: [], total: 0, page, date: usageDate };
    }
  }

  let q = supabase
    .from("ai_usage_daily")
    .select("user_id, usage_date, ai_call_count", { count: "exact" })
    .eq("usage_date", usageDate)
    .order("ai_call_count", { ascending: false });

  if (userFilterIds) q = q.in("user_id", userFilterIds);

  const { data, count } = (await q.range(offset, offset + PAGE_SIZE - 1)) as {
    data: { user_id: string; usage_date: string; ai_call_count: number }[] | null;
    count: number | null;
  };

  const userIds = [...new Set((data ?? []).map((r) => r.user_id))];
  const unlimitedSet = getAiUnlimitedEmails();

  const [{ data: profiles }, { data: subs }] = await Promise.all([
    userIds.length
      ? ((await supabase
          .from("profiles")
          .select("id, email, full_name")
          .in("id", userIds)) as { data: Pick<ProfileRow, "id" | "email" | "full_name">[] | null })
      : { data: [] },
    userIds.length
      ? ((await supabase
          .from("user_subscriptions")
          .select("user_id, tier")
          .in("user_id", userIds)
          .eq("program", "cambridge")
          .eq("status", "active")) as {
          data: { user_id: string; tier: string }[] | null;
        })
      : { data: [] },
  ]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const tierMap = new Map(
    (subs ?? []).map((s) => [s.user_id, s.tier as SubscriptionTier])
  );

  const rows: AdminAiUsageRow[] = (data ?? []).map((r) => {
    const profile = profileMap.get(r.user_id);
    const email = profile?.email ?? "";
    const tier = tierMap.get(r.user_id) ?? "free";
    const isUnlimited = unlimitedSet.has(email.toLowerCase());
    return {
      userId: r.user_id,
      email,
      fullName: profile?.full_name ?? "—",
      tier,
      usageDate: r.usage_date,
      aiCallCount: r.ai_call_count,
      dailyLimit: AI_DAILY_LIMITS[tier],
      isUnlimited,
    };
  });

  return { rows, total: count ?? 0, page, date: usageDate };
}

export async function getAiUsageSummary(date?: string): Promise<{
  date: string;
  totalCalls: number;
  uniqueUsers: number;
  unlimitedCount: number;
}> {
  await requirePermission("tools.ai");

  const supabase = createAdminAnalyticsClient();
  const usageDate = date ?? new Date().toISOString().slice(0, 10);

  const { data } = (await supabase
    .from("ai_usage_daily")
    .select("user_id, ai_call_count")
    .eq("usage_date", usageDate)) as {
    data: { user_id: string; ai_call_count: number }[] | null;
  };

  const rows = data ?? [];
  const unlimitedSet = getAiUnlimitedEmails();

  let unlimitedCount = 0;
  if (unlimitedSet.size > 0 && rows.length > 0) {
    const userIds = rows.map((r) => r.user_id);
    const { data: profiles } = (await supabase
      .from("profiles")
      .select("id, email")
      .in("id", userIds)) as { data: { id: string; email: string }[] | null };
    for (const p of profiles ?? []) {
      if (unlimitedSet.has(p.email.toLowerCase())) unlimitedCount++;
    }
  }

  return {
    date: usageDate,
    totalCalls: rows.reduce((s, r) => s + r.ai_call_count, 0),
    uniqueUsers: rows.length,
    unlimitedCount,
  };
}
