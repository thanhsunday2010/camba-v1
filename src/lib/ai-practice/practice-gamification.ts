import { awardXp } from "@/lib/gamification/award-xp";
import { recordDailyActivity } from "@/lib/gamification/streak";
import { todayDateString } from "@/lib/gamification/constants";
import type { PracticeSkill } from "@/lib/ai-practice/practice-types";

export interface StandalonePracticeGamificationResult {
  totalXpAwarded: number;
  streakUpdated: boolean;
}

export async function onStandalonePracticeCompleted(
  userId: string,
  skill: PracticeSkill,
  overallScore: number,
  durationSeconds: number
): Promise<StandalonePracticeGamificationResult> {
  const today = todayDateString();
  const minutes = Math.max(1, Math.ceil(durationSeconds / 60));

  await recordDailyActivity(userId, { minutesStudied: minutes });

  let totalXpAwarded = 0;

  const daily = await awardXp({
    userId,
    eventType: "daily_practice",
    referenceType: "daily",
    referenceId: `${today}-${skill}`,
    idempotent: true,
  });
  totalXpAwarded += daily?.xpAwarded ?? 0;

  if (overallScore >= 75) {
    const bonus = await awardXp({
      userId,
      eventType: "exercise_complete",
      referenceType: "practice",
      referenceId: `${today}-practice-${skill}`,
      idempotent: true,
    });
    totalXpAwarded += bonus?.xpAwarded ?? 0;
  }

  return {
    totalXpAwarded,
    streakUpdated: true,
  };
}
