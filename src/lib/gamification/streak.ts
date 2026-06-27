import { createClient } from "@/lib/supabase/server";
import { todayDateString } from "@/lib/gamification/constants";
import { markStreakBrokenForRestore } from "@/lib/gamification/streak-restore";

interface ActivityOptions {
  xpEarned?: number;
  minutesStudied?: number;
  lessonsCompleted?: number;
}

export async function recordDailyActivity(
  userId: string,
  activity: ActivityOptions
): Promise<{ newStreak: number; streakMilestone: number | null }> {
  const supabase = await createClient();
  const today = todayDateString();

  const { data: existing } = await supabase
    .from("streak_calendar")
    .select("*")
    .eq("user_id", userId)
    .eq("activity_date", today)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("streak_calendar")
      .update({
        minutes_studied: existing.minutes_studied + (activity.minutesStudied ?? 0),
        xp_earned: existing.xp_earned + (activity.xpEarned ?? 0),
        lessons_completed: existing.lessons_completed + (activity.lessonsCompleted ?? 0),
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("streak_calendar").insert({
      user_id: userId,
      activity_date: today,
      minutes_studied: activity.minutesStudied ?? 0,
      xp_earned: activity.xpEarned ?? 0,
      lessons_completed: activity.lessonsCompleted ?? 0,
    });
  }

  return updateStreak(userId, today);
}

async function updateStreak(
  userId: string,
  today: string
): Promise<{ newStreak: number; streakMilestone: number | null }> {
  const supabase = await createClient();

  const { data: streak } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!streak) return { newStreak: 0, streakMilestone: null };

  const lastDate = streak.last_activity_date;
  const previousStreak = streak.current_streak;
  let newStreak = streak.current_streak;

  if (!lastDate) {
    newStreak = 1;
  } else if (lastDate === today) {
    newStreak = streak.current_streak;
  } else {
    const last = new Date(lastDate);
    const current = new Date(today);
    const diffDays = Math.floor(
      (current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) {
      newStreak = streak.current_streak + 1;
    } else {
      newStreak = 1;
    }
  }

  const bestStreak = Math.max(streak.best_streak, newStreak);
  const brokeStreak =
    !!lastDate &&
    lastDate !== today &&
    Math.floor(
      (new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24)
    ) > 1;

  const restoreFields = brokeStreak
    ? markStreakBrokenForRestore(lastDate, streak.current_streak, today)
    : {
        pending_restore_streak: streak.pending_restore_streak,
        restore_available_until: streak.restore_available_until,
        restore_anchor_date: streak.restore_anchor_date,
      };

  await supabase
    .from("user_streaks")
    .update({
      current_streak: newStreak,
      best_streak: bestStreak,
      last_activity_date: today,
      ...restoreFields,
    })
    .eq("user_id", userId);

  let streakMilestone: number | null = null;
  if (newStreak > previousStreak && (newStreak === 7 || newStreak === 30)) {
    streakMilestone = newStreak;
  }

  return { newStreak, streakMilestone };
}

export async function getStreakCalendar(userId: string, days = 35) {
  const supabase = await createClient();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data } = await supabase
    .from("streak_calendar")
    .select("*")
    .eq("user_id", userId)
    .gte("activity_date", startDate.toISOString().split("T")[0])
    .order("activity_date");

  return data ?? [];
}
