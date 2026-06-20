import { awardXp } from "@/lib/gamification/award-xp";
import { updateMissionProgress } from "@/lib/gamification/missions";
import { recordDailyActivity } from "@/lib/gamification/streak";
import { todayDateString } from "@/lib/gamification/constants";

export async function onExerciseCompleted(
  userId: string,
  lessonId: string,
  exerciseId: string,
  accuracyPercent: number,
  timeSpentSeconds: number,
  lessonJustCompleted: boolean
): Promise<void> {
  const today = todayDateString();
  const minutes = Math.max(1, Math.ceil(timeSpentSeconds / 60));

  await recordDailyActivity(userId, { minutesStudied: minutes });
  await updateMissionProgress(userId, "listening_minutes", minutes);

  await awardXp({
    userId,
    eventType: "daily_practice",
    referenceType: "daily",
    referenceId: today,
    idempotent: true,
  });

  if (accuracyPercent === 100) {
    await awardXp({
      userId,
      eventType: "perfect_score",
      referenceType: "exercise",
      referenceId: `${exerciseId}-perfect`,
      idempotent: true,
    });
  }

  if (lessonJustCompleted) {
    await awardXp({
      userId,
      eventType: "lesson_complete",
      referenceType: "lesson",
      referenceId: lessonId,
      idempotent: true,
    });

    await updateMissionProgress(userId, "lessons_completed", 1);
    await recordDailyActivity(userId, { lessonsCompleted: 1 });
  }
}

export async function onPlacementTestCompleted(
  userId: string,
  testId: string
): Promise<void> {
  await awardXp({
    userId,
    eventType: "placement_test_complete",
    referenceType: "placement_test",
    referenceId: testId,
    idempotent: true,
  });
}

export async function onMockTestCompleted(
  userId: string,
  testId: string
): Promise<void> {
  await awardXp({
    userId,
    eventType: "mock_test_complete",
    referenceType: "mock_test",
    referenceId: testId,
    idempotent: false,
  });
}
