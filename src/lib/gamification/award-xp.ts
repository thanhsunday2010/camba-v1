import { createClient } from "@/lib/supabase/server";
import { calculateLevelFromXp, todayDateString } from "@/lib/gamification/constants";
import { updateLeagueRanking } from "@/lib/gamification/league";
import { checkAndAwardBadges } from "@/lib/gamification/badges";
import { updateMissionProgress } from "@/lib/gamification/missions";
import { recordDailyActivity } from "@/lib/gamification/streak";
import type { XpEventType } from "@/types/database";
import type { Json } from "@/types/database";

export interface AwardXpOptions {
  userId: string;
  eventType: XpEventType;
  referenceType?: string;
  referenceId?: string;
  metadata?: Record<string, unknown>;
  /** Skip duplicate check when referenceType+referenceId provided */
  idempotent?: boolean;
}

export interface AwardXpResult {
  xpAwarded: number;
  coinsAwarded: number;
  newTotalXp: number;
  newLevel: number;
  leveledUp: boolean;
}

export async function awardXp(options: AwardXpOptions): Promise<AwardXpResult | null> {
  const supabase = await createClient();

  const { data: rule } = await supabase
    .from("xp_rules")
    .select("*")
    .eq("event_type", options.eventType)
    .eq("is_active", true)
    .single();

  if (!rule || (rule.xp_amount === 0 && rule.coin_amount === 0)) return null;

  if (options.idempotent && options.referenceType && options.referenceId) {
    const { data: existing } = await supabase
      .from("xp_logs")
      .select("id")
      .eq("user_id", options.userId)
      .eq("event_type", options.eventType)
      .eq("reference_type", options.referenceType)
      .eq("reference_id", options.referenceId)
      .maybeSingle();

    if (existing) return null;
  }

  const { data: gamification } = await supabase
    .from("user_gamification")
    .select("*")
    .eq("user_id", options.userId)
    .single();

  if (!gamification) return null;

  const previousLevel = gamification.level;
  const newTotalXp = gamification.total_xp + rule.xp_amount;
  const newCoins = gamification.coins + rule.coin_amount;
  const newLevel = calculateLevelFromXp(newTotalXp);

  await supabase.from("xp_logs").insert({
    user_id: options.userId,
    event_type: options.eventType,
    xp_amount: rule.xp_amount,
    coin_amount: rule.coin_amount,
    reference_type: options.referenceType ?? null,
    reference_id: options.referenceId ?? null,
    metadata: (options.metadata ?? {}) as Json,
  });

  await supabase
    .from("user_gamification")
    .update({
      total_xp: newTotalXp,
      coins: newCoins,
      level: newLevel,
    })
    .eq("user_id", options.userId);

  const streakResult = await recordDailyActivity(options.userId, {
    xpEarned: rule.xp_amount,
  });

  if (streakResult.streakMilestone) {
    await awardXp({
      userId: options.userId,
      eventType: "streak_bonus",
      referenceType: "streak",
      referenceId: `${todayDateString()}-${streakResult.streakMilestone}`,
      idempotent: true,
    });
  }

  await updateLeagueRanking(options.userId, rule.xp_amount);
  await updateMissionProgress(options.userId, "xp_earned", rule.xp_amount);
  await checkAndAwardBadges(options.userId);

  return {
    xpAwarded: rule.xp_amount,
    coinsAwarded: rule.coin_amount,
    newTotalXp,
    newLevel,
    leveledUp: newLevel > previousLevel,
  };
}

export async function awardXpBatch(
  userId: string,
  events: Omit<AwardXpOptions, "userId">[]
): Promise<AwardXpResult[]> {
  const results: AwardXpResult[] = [];
  for (const event of events) {
    const result = await awardXp({ userId, ...event });
    if (result) results.push(result);
  }
  return results;
}
