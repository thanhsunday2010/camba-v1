import { createClient } from "@/lib/supabase/server";
import { LESSON_PRACTICE_DAILY_LIMITS } from "@/lib/subscriptions/subscription-catalog";
import {
  getEffectiveSubscriptionTier,
  getVnDayStartIso,
} from "@/lib/subscriptions/ai-usage";
import type { LessonPracticeUsageStatus } from "@/lib/subscriptions/subscription-types";

export async function getLessonsPracticedToday(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercise_attempts")
    .select("lesson_id")
    .eq("user_id", userId)
    .gte("created_at", getVnDayStartIso());

  if (error || !data?.length) {
    return [];
  }

  return [...new Set(data.map((row) => row.lesson_id))];
}

export async function getLessonPracticeUsageStatus(
  userId: string
): Promise<LessonPracticeUsageStatus> {
  const tier = await getEffectiveSubscriptionTier(userId);
  const dailyLimit = LESSON_PRACTICE_DAILY_LIMITS[tier];
  const practicedLessonIds = await getLessonsPracticedToday(userId);
  const usedToday = practicedLessonIds.length;

  if (dailyLimit == null) {
    return {
      tier,
      usedToday,
      dailyLimit: null,
      remaining: null,
      practicedLessonIds,
    };
  }

  return {
    tier,
    usedToday,
    dailyLimit,
    remaining: Math.max(0, dailyLimit - usedToday),
    practicedLessonIds,
  };
}

export type LessonPracticeCheckResult =
  | { allowed: true; status: LessonPracticeUsageStatus }
  | { allowed: false; status: LessonPracticeUsageStatus };

export async function canPracticeLesson(
  userId: string,
  lessonId: string
): Promise<LessonPracticeCheckResult> {
  const status = await getLessonPracticeUsageStatus(userId);

  if (status.dailyLimit == null) {
    return { allowed: true, status };
  }

  if (status.practicedLessonIds.includes(lessonId)) {
    return { allowed: true, status };
  }

  if (status.usedToday >= status.dailyLimit) {
    return { allowed: false, status };
  }

  return { allowed: true, status };
}
