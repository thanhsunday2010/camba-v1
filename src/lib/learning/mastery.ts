import { MASTERY_LEVELS, MASTERY_UNLOCK_THRESHOLD } from "@/lib/constants";

export function calculateMasteryLevel(accuracyPercent: number, completionPercent: number): number {
  if (completionPercent === 0) return MASTERY_LEVELS.NOT_STARTED;
  if (accuracyPercent >= 95 && completionPercent >= 100) return MASTERY_LEVELS.MASTERED;
  if (accuracyPercent >= 80) return MASTERY_LEVELS.PROFICIENT;
  if (accuracyPercent >= 60) return MASTERY_LEVELS.DEVELOPING;
  return MASTERY_LEVELS.BEGINNER;
}

export function canUnlockNextLesson(
  masteryLevel: number,
  threshold: number = MASTERY_UNLOCK_THRESHOLD
): boolean {
  return masteryLevel >= threshold;
}

export function calculateLessonCompletion(
  completedExercises: number,
  totalExercises: number
): number {
  if (totalExercises === 0) return 0;
  return Math.round((completedExercises / totalExercises) * 100);
}

export function calculateLessonAccuracy(exerciseAccuracies: number[]): number {
  if (exerciseAccuracies.length === 0) return 0;
  const sum = exerciseAccuracies.reduce((a, b) => a + b, 0);
  return Math.round(sum / exerciseAccuracies.length);
}

export function estimatePlacementLevel(
  skillScores: Record<string, number>,
  levels: { id: string; slug: string; sort_order: number }[]
): string | null {
  const avgScore =
    Object.values(skillScores).reduce((a, b) => a + b, 0) /
    Math.max(Object.values(skillScores).length, 1);

  const sortedLevels = [...levels].sort((a, b) => a.sort_order - b.sort_order);
  const index = Math.min(
    Math.floor(avgScore / (100 / sortedLevels.length)),
    sortedLevels.length - 1
  );

  return sortedLevels[Math.max(0, index)]?.id ?? null;
}
