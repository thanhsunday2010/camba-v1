import { isUnlockAllLessonsEnabled } from "@/lib/learning/unlock-all-lessons";

export type LessonUnlockNode = {
  id: string;
  unit_id: string;
  sort_order: number;
  unlock_after_lesson_id: string | null;
};

/**
 * Entry lessons: no explicit prerequisite (unlock_after_lesson_id IS NULL).
 * These are unlocked when a level/path is initialized or after placement.
 */
export function getEntryLessonIds(lessons: LessonUnlockNode[]): string[] {
  return lessons.filter((l) => !l.unlock_after_lesson_id).map((l) => l.id);
}

/** Lessons that explicitly require the given lesson to be completed first. */
export function getLessonsUnlockedAfter(
  completedLessonId: string,
  lessons: LessonUnlockNode[]
): string[] {
  return lessons
    .filter((l) => l.unlock_after_lesson_id === completedLessonId)
    .map((l) => l.id);
}

/** Fallback: next lesson by sort_order within the same unit (legacy content without unlock_after). */
export function getSortOrderSuccessorId(
  completedLessonId: string,
  unitLessons: LessonUnlockNode[]
): string | null {
  const sorted = [...unitLessons].sort((a, b) => a.sort_order - b.sort_order);
  const currentIndex = sorted.findIndex((l) => l.id === completedLessonId);
  if (currentIndex < 0 || currentIndex >= sorted.length - 1) return null;
  return sorted[currentIndex + 1].id;
}

/**
 * Resolve which lesson IDs to unlock after mastery.
 * Prefers explicit unlock_after_lesson_id chain; falls back to sort_order only when no explicit dependents exist.
 */
export function resolveNextUnlockLessonIds(
  completedLessonId: string,
  unitLessons: LessonUnlockNode[]
): string[] {
  const explicit = getLessonsUnlockedAfter(completedLessonId, unitLessons);
  if (explicit.length > 0) return explicit;

  const fallback = getSortOrderSuccessorId(completedLessonId, unitLessons);
  return fallback ? [fallback] : [];
}

export function isLessonUnlockedFromProgress(
  progress: { is_unlocked: boolean } | undefined | null,
  options?: { bypassUnlock?: boolean }
): boolean {
  if (isUnlockAllLessonsEnabled() || options?.bypassUnlock) return true;
  return progress?.is_unlocked === true;
}
