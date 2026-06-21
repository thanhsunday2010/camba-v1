import type { LessonVisualState } from "@/lib/design/status-tokens";
import type { CurriculumUnitGroup } from "@/lib/learning/pivot-units";
import type { LessonWithProgress } from "@/types/learning";
import { isLessonUnlockedFromProgress } from "@/lib/learning/unlock";

export type UnitVisualState =
  | "coming-soon"
  | "locked"
  | "not-started"
  | "in-progress"
  | "completed"
  | "mastered";

/** Visual state from server progress only — no client mastery recomputation */
export function getLessonVisualState(
  lesson: LessonWithProgress,
  recommendedLessonId?: string | null
): LessonVisualState {
  const unlocked = isLessonUnlockedFromProgress(lesson.progress);
  if (!unlocked) return "locked";

  const mastery = lesson.progress?.mastery_level ?? 0;
  const completion = lesson.progress?.completion_percent ?? 0;

  if (recommendedLessonId === lesson.id) return "recommended";
  if (mastery >= 4 && completion >= 100) return "mastered";
  if (completion >= 100) return "completed";
  if (completion > 0) return "in-progress";
  return "unlocked";
}

export function getUnitVisualState(unit: CurriculumUnitGroup): UnitVisualState {
  if (!unit.hasContent) return "coming-soon";

  const lessons = unit.entries.flatMap((entry) => entry.lessons);
  if (lessons.length === 0) return "coming-soon";

  const unlockedCount = lessons.filter((lesson) =>
    isLessonUnlockedFromProgress(lesson.progress)
  ).length;
  if (unlockedCount === 0) return "locked";

  let allMastered = true;
  let allComplete = true;
  let anyStarted = false;

  for (const lesson of lessons) {
    const completion = lesson.progress?.completion_percent ?? 0;
    const mastery = lesson.progress?.mastery_level ?? 0;
    if (completion > 0) anyStarted = true;
    if (completion < 100) allComplete = false;
    if (!(completion >= 100 && mastery >= 4)) allMastered = false;
  }

  if (allMastered) return "mastered";
  if (allComplete) return "completed";
  if (anyStarted) return "in-progress";
  return "not-started";
}

export function computeUnitProgressPercent(unit: CurriculumUnitGroup): number {
  const lessons = unit.entries.flatMap((entry) => entry.lessons);
  if (lessons.length === 0) return 0;
  const sum = lessons.reduce(
    (acc, lesson) => acc + (lesson.progress?.completion_percent ?? 0),
    0
  );
  return Math.round(sum / lessons.length);
}

export function computeLevelProgressPercent(units: CurriculumUnitGroup[]): number {
  const lessons = units.flatMap((unit) =>
    unit.entries.flatMap((entry) => entry.lessons)
  );
  if (lessons.length === 0) return 0;
  const sum = lessons.reduce(
    (acc, lesson) => acc + (lesson.progress?.completion_percent ?? 0),
    0
  );
  return Math.round(sum / lessons.length);
}

export function findUnitSlugForLesson(
  units: CurriculumUnitGroup[],
  lessonId: string
): string | null {
  for (const unit of units) {
    for (const entry of unit.entries) {
      if (entry.lessons.some((lesson) => lesson.id === lessonId)) {
        return unit.slug;
      }
    }
  }
  return null;
}

export function unitHasSkillEntry(
  unit: CurriculumUnitGroup,
  skillSlug: string | null
): boolean {
  if (!skillSlug || skillSlug === "all") return true;
  return unit.entries.some((entry) => entry.skillSlug === skillSlug && entry.lessons.length > 0);
}
