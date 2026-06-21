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

export type ReviewReasonKey =
  | "lowMastery"
  | "completedNotMastered"
  | "weakAccuracy"
  | "needsPractice";

export interface ReviewLessonItem {
  lesson: LessonWithProgress;
  skillSlug: string;
  skillName: string;
  unitTitle: string;
  reasonKey: ReviewReasonKey;
}

export interface LessonPresentationOptions {
  recommendedLessonId?: string | null;
  stateLabels: Record<LessonVisualState, string>;
  ctaStart: string;
  ctaContinue: string;
  ctaReview: string;
}

export interface LessonPresentation {
  state: LessonVisualState;
  stateLabel: string;
  cta: string | null;
  reviewReasonKey: ReviewReasonKey | null;
}

/** Whether a lesson qualifies for review — server fields only, no mastery recompute */
export function needsReviewFromServer(lesson: LessonWithProgress): boolean {
  if (!isLessonUnlockedFromProgress(lesson.progress) || !lesson.progress) return false;

  const completion = lesson.progress.completion_percent ?? 0;
  const mastery = lesson.progress.mastery_level ?? 0;
  const accuracy = lesson.progress.accuracy_percent ?? 0;
  const attempts = lesson.progress.attempts_count ?? 0;

  if (completion >= 100 && mastery < 3) return true;
  if (attempts >= 2 && mastery <= 2 && completion > 0) return true;
  if (completion >= 100 && accuracy > 0 && accuracy < 70 && mastery < 4) return true;
  return false;
}

export function getReviewReasonKey(lesson: LessonWithProgress): ReviewReasonKey {
  const completion = lesson.progress?.completion_percent ?? 0;
  const mastery = lesson.progress?.mastery_level ?? 0;
  const accuracy = lesson.progress?.accuracy_percent ?? 0;
  const attempts = lesson.progress?.attempts_count ?? 0;

  if (completion >= 100 && mastery < 3) return "completedNotMastered";
  if (completion >= 100 && accuracy > 0 && accuracy < 70) return "weakAccuracy";
  if (attempts >= 2 && mastery <= 2) return "needsPractice";
  return "lowMastery";
}

/** Single source of truth for lesson visual state across hero, recommended block, and path */
export function getLessonVisualState(
  lesson: LessonWithProgress,
  recommendedLessonId?: string | null
): LessonVisualState {
  const unlocked = isLessonUnlockedFromProgress(lesson.progress);
  if (!unlocked) return "locked";

  const mastery = lesson.progress?.mastery_level ?? 0;
  const completion = lesson.progress?.completion_percent ?? 0;

  if (recommendedLessonId === lesson.id) return "recommended";
  if (needsReviewFromServer(lesson)) return "needs-review";
  if (mastery >= 4 && completion >= 100) return "mastered";
  if (completion >= 100) return "completed";
  if (completion > 0) return "in-progress";
  return "unlocked";
}

export function getLessonCtaLabel(
  state: LessonVisualState,
  completion: number,
  labels: Pick<LessonPresentationOptions, "ctaStart" | "ctaContinue" | "ctaReview">
): string | null {
  switch (state) {
    case "locked":
      return null;
    case "in-progress":
      return labels.ctaContinue;
    case "recommended":
      return completion > 0 ? labels.ctaContinue : labels.ctaStart;
    case "needs-review":
    case "completed":
    case "mastered":
      return labels.ctaReview;
    default:
      return labels.ctaStart;
  }
}

export function getLessonPresentation(
  lesson: LessonWithProgress,
  options: LessonPresentationOptions
): LessonPresentation {
  const state = getLessonVisualState(lesson, options.recommendedLessonId);
  const completion = lesson.progress?.completion_percent ?? 0;
  return {
    state,
    stateLabel: options.stateLabels[state],
    cta: getLessonCtaLabel(state, completion, options),
    reviewReasonKey: state === "needs-review" ? getReviewReasonKey(lesson) : null,
  };
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

export function computeUnitCompletedLessonCount(unit: CurriculumUnitGroup): number {
  return unit.entries
    .flatMap((entry) => entry.lessons)
    .filter((lesson) => (lesson.progress?.completion_percent ?? 0) >= 100).length;
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

export function findSkillSlugForLesson(
  units: CurriculumUnitGroup[],
  lessonId: string
): string | null {
  for (const unit of units) {
    for (const entry of unit.entries) {
      if (entry.lessons.some((lesson) => lesson.id === lessonId)) {
        return entry.skillSlug;
      }
    }
  }
  return null;
}

export function findLessonInUnits(
  units: CurriculumUnitGroup[],
  lessonId: string
): { lesson: LessonWithProgress; skillSlug: string; skillName: string; unitTitle: string } | null {
  for (const unit of units) {
    for (const entry of unit.entries) {
      const lesson = entry.lessons.find((l) => l.id === lessonId);
      if (lesson) {
        return {
          lesson,
          skillSlug: entry.skillSlug,
          skillName: entry.skillName,
          unitTitle: unit.title,
        };
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

export function isLessonVisibleInSkillFilter(
  lessonId: string,
  units: CurriculumUnitGroup[],
  activeSkill: string
): boolean {
  if (activeSkill === "all") return true;
  return findSkillSlugForLesson(units, lessonId) === activeSkill;
}

export function collectReviewLessons(
  units: CurriculumUnitGroup[],
  recommendedLessonId?: string | null,
  limit = 4
): ReviewLessonItem[] {
  const items: ReviewLessonItem[] = [];

  for (const unit of units) {
    for (const entry of unit.entries) {
      for (const lesson of entry.lessons) {
        if (lesson.id === recommendedLessonId) continue;
        if (!needsReviewFromServer(lesson)) continue;
        items.push({
          lesson,
          skillSlug: entry.skillSlug,
          skillName: entry.skillName,
          unitTitle: unit.title,
          reasonKey: getReviewReasonKey(lesson),
        });
      }
    }
  }

  items.sort((a, b) => {
    const masteryA = a.lesson.progress?.mastery_level ?? 0;
    const masteryB = b.lesson.progress?.mastery_level ?? 0;
    if (masteryA !== masteryB) return masteryA - masteryB;
    const accA = a.lesson.progress?.accuracy_percent ?? 100;
    const accB = b.lesson.progress?.accuracy_percent ?? 100;
    return accA - accB;
  });

  return items.slice(0, limit);
}

export function getWeakestSkillSlug(
  skills: { slug: string; progressPercent: number }[]
): string | null {
  if (skills.length === 0) return null;
  const started = skills.filter((s) => s.progressPercent > 0);
  const pool = started.length > 0 ? started : skills;
  const sorted = [...pool].sort((a, b) => a.progressPercent - b.progressPercent);
  return sorted[0]?.slug ?? null;
}

export type FocusLessonSource = "in-progress" | "unlocked" | "review";

export interface FocusLessonResult {
  lesson: LessonWithProgress;
  skillSlug: string;
  skillName: string;
  unitTitle: string;
  source: FocusLessonSource;
}

function collectLessonsInPathOrder(units: CurriculumUnitGroup[]) {
  const items: Omit<FocusLessonResult, "source">[] = [];
  for (const unit of units) {
    for (const entry of unit.entries) {
      for (const lesson of entry.lessons) {
        items.push({
          lesson,
          skillSlug: entry.skillSlug,
          skillName: entry.skillName,
          unitTitle: unit.title,
        });
      }
    }
  }
  return items;
}

/** UI-only focus when server nextLesson is null: in-progress → unlocked incomplete → review */
export function resolveFocusLesson(units: CurriculumUnitGroup[]): FocusLessonResult | null {
  const ordered = collectLessonsInPathOrder(units);

  for (const item of ordered) {
    if (!isLessonUnlockedFromProgress(item.lesson.progress)) continue;
    const completion = item.lesson.progress?.completion_percent ?? 0;
    if (completion > 0 && completion < 100) {
      return { ...item, source: "in-progress" };
    }
  }

  for (const item of ordered) {
    if (!isLessonUnlockedFromProgress(item.lesson.progress)) continue;
    const completion = item.lesson.progress?.completion_percent ?? 0;
    if (completion < 100) {
      return { ...item, source: "unlocked" };
    }
  }

  for (const item of ordered) {
    if (needsReviewFromServer(item.lesson)) {
      return { ...item, source: "review" };
    }
  }

  return null;
}
