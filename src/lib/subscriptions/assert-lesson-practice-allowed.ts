import type { ActionResult } from "@/types";
import { canPracticeLesson } from "@/lib/subscriptions/lesson-practice-usage";

const PRACTICE_LIMIT_MESSAGES: Record<"free" | "pro" | "vip", string> = {
  free: "Bạn đã hết lượt luyện tập bài học miễn phí hôm nay. Nâng cấp Pro hoặc VIP để luyện tập không giới hạn.",
  pro: "Bạn đã đạt giới hạn luyện tập bài học hôm nay.",
  vip: "Bạn đã đạt giới hạn luyện tập bài học hôm nay.",
};

export async function assertLessonPracticeAllowed(
  userId: string,
  lessonId: string
): Promise<ActionResult<void>> {
  const check = await canPracticeLesson(userId, lessonId);
  if (check.allowed) {
    return { success: true };
  }

  const { tier, usedToday, dailyLimit, remaining, practicedLessonIds } = check.status;

  return {
    success: false,
    code: "PRACTICE_LIMIT_EXCEEDED",
    error: PRACTICE_LIMIT_MESSAGES[tier],
    practiceLimitMeta: {
      tier,
      usedToday,
      dailyLimit: dailyLimit ?? 0,
      remaining: remaining ?? 0,
      practicedLessonIds,
    },
  };
}
