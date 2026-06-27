import { createClient } from "@/lib/supabase/server";
import { calculateLevelFromXp, todayDateString } from "@/lib/gamification/constants";
import { updateLeagueRanking } from "@/lib/gamification/league";
import type { Json } from "@/types/database";

export const STREAK_RESTORE_XP_COST = 100;
export const STREAK_RESTORE_WINDOW_DAYS = 7;

export type StreakRestoreOffer = {
  eligible: boolean;
  xpCost: number;
  restoreToStreak: number;
  previousStreak: number;
  daysRemaining: number;
  userTotalXp: number;
  reason?: string;
};

function parseDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

function addDays(dateStr: string, days: number): string {
  const date = parseDate(dateStr);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split("T")[0]!;
}

function daysBetween(start: string, end: string): number {
  const ms = parseDate(end).getTime() - parseDate(start).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function enumerateDates(fromExclusive: string, toInclusive: string): string[] {
  const dates: string[] = [];
  let cursor = addDays(fromExclusive, 1);
  while (cursor <= toInclusive) {
    dates.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return dates;
}

export async function getStreakRestoreOffer(userId: string): Promise<StreakRestoreOffer> {
  const supabase = await createClient();
  const today = todayDateString();

  const [{ data: streak }, { data: gamification }] = await Promise.all([
    supabase.from("user_streaks").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("user_gamification").select("total_xp").eq("user_id", userId).maybeSingle(),
  ]);

  const base = {
    eligible: false,
    xpCost: STREAK_RESTORE_XP_COST,
    restoreToStreak: 0,
    previousStreak: 0,
    daysRemaining: 0,
    userTotalXp: gamification?.total_xp ?? 0,
  };

  if (!streak?.pending_restore_streak || !streak.restore_available_until) {
    return { ...base, reason: "no_pending_restore" };
  }

  if (streak.restore_available_until < today) {
    return { ...base, reason: "expired" };
  }

  const previousStreak = streak.pending_restore_streak;
  const studiedOnBreakDay = streak.last_activity_date === today;
  const restoreToStreak = previousStreak + (studiedOnBreakDay ? 1 : 0);
  const daysRemaining =
    daysBetween(today, streak.restore_available_until) + 1;

  if ((gamification?.total_xp ?? 0) < STREAK_RESTORE_XP_COST) {
    return {
      ...base,
      previousStreak,
      restoreToStreak,
      daysRemaining,
      reason: "insufficient_xp",
    };
  }

  return {
    eligible: true,
    xpCost: STREAK_RESTORE_XP_COST,
    restoreToStreak,
    previousStreak,
    daysRemaining,
    userTotalXp: gamification?.total_xp ?? 0,
  };
}

export async function restoreStreakWithXp(
  userId: string
): Promise<{ success: boolean; error?: string; newStreak?: number; xpSpent?: number }> {
  const supabase = await createClient();
  const today = todayDateString();
  const offer = await getStreakRestoreOffer(userId);

  if (!offer.eligible) {
    if (offer.reason === "insufficient_xp") {
      return { success: false, error: "Không đủ XP để khôi phục streak" };
    }
    if (offer.reason === "expired") {
      return { success: false, error: "Đã hết thời hạn khôi phục streak" };
    }
    return { success: false, error: "Không thể khôi phục streak lúc này" };
  }

  const { data: streak } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!streak?.pending_restore_streak || !streak.restore_anchor_date) {
    return { success: false, error: "Không tìm thấy streak cần khôi phục" };
  }

  const restoreKey = `${streak.restore_anchor_date}:${streak.pending_restore_streak}`;
  const { data: existingSpend } = await supabase
    .from("xp_logs")
    .select("id")
    .eq("user_id", userId)
    .eq("event_type", "streak_restore")
    .eq("reference_type", "streak_restore")
    .eq("reference_id", restoreKey)
    .maybeSingle();

  if (existingSpend) {
    return { success: false, error: "Streak này đã được khôi phục rồi" };
  }

  const { data: gamification } = await supabase
    .from("user_gamification")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!gamification || gamification.total_xp < STREAK_RESTORE_XP_COST) {
    return { success: false, error: "Không đủ XP để khôi phục streak" };
  }

  const fillUntil =
    streak.last_activity_date && streak.last_activity_date < today
      ? streak.last_activity_date
      : addDays(today, -1);
  const missedDates = enumerateDates(streak.restore_anchor_date, fillUntil);

  for (const activityDate of missedDates) {
    const { data: existingDay } = await supabase
      .from("streak_calendar")
      .select("id")
      .eq("user_id", userId)
      .eq("activity_date", activityDate)
      .maybeSingle();

    if (existingDay) continue;

    await supabase.from("streak_calendar").insert({
      user_id: userId,
      activity_date: activityDate,
      minutes_studied: 0,
      xp_earned: 0,
      lessons_completed: 0,
    });
  }

  const newTotalXp = gamification.total_xp - STREAK_RESTORE_XP_COST;
  const newLevel = calculateLevelFromXp(newTotalXp);
  const newStreak = offer.restoreToStreak;
  const bestStreak = Math.max(streak.best_streak, newStreak);

  await supabase.from("xp_logs").insert({
    user_id: userId,
    event_type: "streak_restore",
    xp_amount: -STREAK_RESTORE_XP_COST,
    coin_amount: 0,
    reference_type: "streak_restore",
    reference_id: restoreKey,
    metadata: {
      previous_streak: streak.pending_restore_streak,
      restored_streak: newStreak,
      anchor_date: streak.restore_anchor_date,
    } as Json,
  });

  await supabase
    .from("user_gamification")
    .update({
      total_xp: newTotalXp,
      level: newLevel,
    })
    .eq("user_id", userId);

  await supabase
    .from("user_streaks")
    .update({
      current_streak: newStreak,
      best_streak: bestStreak,
      pending_restore_streak: null,
      restore_available_until: null,
      restore_anchor_date: null,
    })
    .eq("user_id", userId);

  await updateLeagueRanking(userId, -STREAK_RESTORE_XP_COST);

  return {
    success: true,
    newStreak,
    xpSpent: STREAK_RESTORE_XP_COST,
  };
}

export function markStreakBrokenForRestore(
  lastActivityDate: string | null,
  previousStreak: number,
  today: string
): {
  pending_restore_streak: number | null;
  restore_available_until: string | null;
  restore_anchor_date: string | null;
} {
  if (!lastActivityDate || previousStreak < 2) {
    return {
      pending_restore_streak: null,
      restore_available_until: null,
      restore_anchor_date: null,
    };
  }

  return {
    pending_restore_streak: previousStreak,
    restore_available_until: addDays(today, STREAK_RESTORE_WINDOW_DAYS),
    restore_anchor_date: lastActivityDate,
  };
}
