import { createClient } from "@/lib/supabase/server";
import { AI_DAILY_LIMITS, TIER_ORDER } from "@/lib/subscriptions/subscription-catalog";
import type {
  AiUsageStatus,
  SubscriptionTier,
} from "@/lib/subscriptions/subscription-types";

const VN_TIMEZONE = "Asia/Ho_Chi_Minh";

export function getVnUsageDate(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: VN_TIMEZONE }).format(new Date());
}

export function getVnDayStartIso(): string {
  const usageDate = getVnUsageDate();
  return `${usageDate}T00:00:00+07:00`;
}

export async function getEffectiveSubscriptionTier(userId: string): Promise<SubscriptionTier> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("tier")
    .eq("user_id", userId)
    .eq("status", "active");

  if (error || !data?.length) {
    return "free";
  }

  const rows = data as Array<{ tier: SubscriptionTier }>;

  return rows.reduce<SubscriptionTier>((best, row) => {
    const tier = row.tier;
    return TIER_ORDER[tier] > TIER_ORDER[best] ? tier : best;
  }, "free");
}

async function countAiFeedbackToday(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("ai_feedback")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", getVnDayStartIso());

  return count ?? 0;
}

async function readAiUsageCount(userId: string, usageDate: string): Promise<number | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_usage_daily")
    .select("ai_call_count")
    .eq("user_id", userId)
    .eq("usage_date", usageDate)
    .maybeSingle();

  if (error) return null;
  const row = data as { ai_call_count: number } | null;
  return row?.ai_call_count ?? 0;
}

export async function getAiUsageToday(userId: string): Promise<number> {
  const usageDate = getVnUsageDate();
  const tracked = await readAiUsageCount(userId, usageDate);
  if (tracked != null) {
    return tracked;
  }
  return countAiFeedbackToday(userId);
}

export async function getAiUsageStatus(userId: string): Promise<AiUsageStatus> {
  const tier = await getEffectiveSubscriptionTier(userId);
  const dailyLimit = AI_DAILY_LIMITS[tier];
  const usedToday = await getAiUsageToday(userId);

  return {
    tier,
    usedToday,
    dailyLimit,
    remaining: Math.max(0, dailyLimit - usedToday),
  };
}

export type AiUsageReservationResult =
  | { allowed: true; status: AiUsageStatus }
  | { allowed: false; status: AiUsageStatus };

export async function reserveAiUsage(userId: string): Promise<AiUsageReservationResult> {
  const tier = await getEffectiveSubscriptionTier(userId);
  const dailyLimit = AI_DAILY_LIMITS[tier];
  const usageDate = getVnUsageDate();
  const supabase = await createClient();

  const usedToday = await getAiUsageToday(userId);
  const status: AiUsageStatus = {
    tier,
    usedToday,
    dailyLimit,
    remaining: Math.max(0, dailyLimit - usedToday),
  };

  if (usedToday >= dailyLimit) {
    return { allowed: false, status };
  }

  const nextCount = usedToday + 1;
  const { error: upsertError } = await supabase.from("ai_usage_daily").upsert(
    {
      user_id: userId,
      usage_date: usageDate,
      ai_call_count: nextCount,
    } as never,
    { onConflict: "user_id,usage_date" }
  );

  if (upsertError) {
    return {
      allowed: true,
      status: {
        tier,
        usedToday: nextCount,
        dailyLimit,
        remaining: Math.max(0, dailyLimit - nextCount),
      },
    };
  }

  return {
    allowed: true,
    status: {
      tier,
      usedToday: nextCount,
      dailyLimit,
      remaining: Math.max(0, dailyLimit - nextCount),
    },
  };
}
