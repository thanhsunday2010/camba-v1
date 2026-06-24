import type { CurriculumUnitGroup } from "@/lib/learning/pivot-units";
import {
  computeLevelProgressPercent,
  computeUnitCompletedLessonCount,
  computeUnitProgressPercent,
  findUnitSlugForLesson,
  getUnitVisualState,
  type UnitVisualState,
} from "@/lib/learning/path-ui-utils";
import { isLessonUnlockedFromProgress } from "@/lib/learning/unlock";
import { getProgramTheme, normalizeProgramSlug } from "@/lib/design/cambridge-programs";
import type { MockTestHubSummary } from "@/lib/mock-tests/mock-test-types";
import type {
  JourneyLevelStatus,
  JourneyMilestone,
  JourneyMock,
  JourneyReadinessBand,
  JourneyUnit,
  JourneyUnitStatus,
  JourneyPreview,
  JourneyProgressSummary,
} from "@/lib/learning/journey/learning-journey-types";
import type { NextLessonContext } from "@/lib/queries/dashboard";
import type { LessonWithProgress } from "@/types/learning";

export type LevelLessonAggregate = {
  levelId: string;
  totalLessons: number;
  completedLessons: number;
  completionPercent: number;
  writingProgressPercent: number;
  speakingProgressPercent: number;
};

export function aggregateLessonsByLevel(
  rows: {
    levelId: string;
    skillSlug: string;
    completionPercent: number;
    isCompleted: boolean;
  }[]
): Map<string, LevelLessonAggregate> {
  const buckets = new Map<
    string,
    {
      total: number;
      completed: number;
      sum: number;
      writing: { sum: number; count: number };
      speaking: { sum: number; count: number };
    }
  >();

  for (const row of rows) {
    const bucket = buckets.get(row.levelId) ?? {
      total: 0,
      completed: 0,
      sum: 0,
      writing: { sum: 0, count: 0 },
      speaking: { sum: 0, count: 0 },
    };
    bucket.total += 1;
    bucket.sum += row.completionPercent;
    if (row.isCompleted) bucket.completed += 1;
    if (row.skillSlug === "writing") {
      bucket.writing.sum += row.completionPercent;
      bucket.writing.count += 1;
    }
    if (row.skillSlug === "speaking") {
      bucket.speaking.sum += row.completionPercent;
      bucket.speaking.count += 1;
    }
    buckets.set(row.levelId, bucket);
  }

  const result = new Map<string, LevelLessonAggregate>();
  for (const [levelId, bucket] of buckets) {
    result.set(levelId, {
      levelId,
      totalLessons: bucket.total,
      completedLessons: bucket.completed,
      completionPercent:
        bucket.total > 0 ? Math.round(bucket.sum / bucket.total) : 0,
      writingProgressPercent:
        bucket.writing.count > 0
          ? Math.round(bucket.writing.sum / bucket.writing.count)
          : 0,
      speakingProgressPercent:
        bucket.speaking.count > 0
          ? Math.round(bucket.speaking.sum / bucket.speaking.count)
          : 0,
    });
  }
  return result;
}

export function resolveLevelStatus(
  levelId: string,
  sortOrder: number,
  currentLevelId: string | null,
  currentLevelSortOrder: number,
  completionPercent: number
): JourneyLevelStatus {
  if (currentLevelId && levelId === currentLevelId) return "current";
  if (completionPercent >= 100) return "completed";
  if (currentLevelId && sortOrder > currentLevelSortOrder) return "upcoming";
  if (completionPercent > 0) return "in-progress";
  return "not-started";
}

export function mapUnitJourneyStatus(
  unitIndex: number,
  currentUnitIndex: number,
  visualState: UnitVisualState
): JourneyUnitStatus {
  if (unitIndex === currentUnitIndex) return "current";
  if (unitIndex < currentUnitIndex) {
    if (visualState === "completed" || visualState === "mastered") return "completed";
    if (visualState === "in-progress" || visualState === "not-started") return "completed";
    return "locked";
  }
  if (visualState === "locked") return "locked";
  if (visualState === "coming-soon") return "upcoming";
  return "upcoming";
}

export function buildJourneyUnits(
  units: CurriculumUnitGroup[],
  nextLessonId: string | null
): JourneyUnit[] {
  const currentUnitSlug = nextLessonId ? findUnitSlugForLesson(units, nextLessonId) : null;
  const currentUnitIndex = currentUnitSlug
    ? units.findIndex((u) => u.slug === currentUnitSlug)
    : units.findIndex((u) => {
        const state = getUnitVisualState(u);
        return state === "in-progress" || state === "not-started";
      });

  return units.map((unit, index) => {
    const visualState = getUnitVisualState(unit);
    const status = mapUnitJourneyStatus(
      index,
      currentUnitIndex >= 0 ? currentUnitIndex : 0,
      visualState
    );
    const allLessons = unit.entries.flatMap((e) => e.lessons);

    return {
      slug: unit.slug,
      title: unit.title,
      unitNumber: unit.unitNumber,
      status,
      visualState,
      completionPercent: computeUnitProgressPercent(unit),
      completedLessonCount: computeUnitCompletedLessonCount(unit),
      totalLessonCount: unit.lessonCount,
      sortOrder: unit.sortOrder,
      lessons: allLessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        completionPercent: lesson.progress?.completion_percent ?? 0,
        isUnlocked: isLessonUnlockedFromProgress(lesson.progress),
        isCurrent: lesson.id === nextLessonId,
        href: `/learning/lesson/${lesson.id}`,
      })),
    };
  });
}

export function mapMockToJourneyMock(
  test: MockTestHubSummary,
  isRecommended: boolean
): JourneyMock {
  return {
    id: test.id,
    title: test.title,
    levelSlug: test.levelSlug,
    displayState: test.displayState,
    isGoldMock: test.isGoldMock,
    isRecommended,
    includesWriting: test.format.includedSkillSlugs.includes("writing"),
    includesSpeaking: test.format.includedSkillSlugs.includes("speaking"),
    bestScorePercent: test.bestScorePercent,
    href: `/mock-tests/${test.id}`,
  };
}

export function countCompletedMocks(mocks: JourneyMock[]): number {
  return mocks.filter(
    (m) => m.displayState === "completed" && (m.bestScorePercent ?? 0) >= 0
  ).length;
}

export function deriveReadinessBand(
  levelCompletionPercent: number,
  mocksCompleted: number,
  totalMocks: number
): { band: JourneyReadinessBand; percent: number } {
  const mockRatio = totalMocks > 0 ? mocksCompleted / totalMocks : 0;
  const blended = Math.round(levelCompletionPercent * 0.7 + mockRatio * 100 * 0.3);

  if (blended >= 85) return { band: "ready", percent: blended };
  if (blended >= 60) return { band: "approaching", percent: blended };
  if (blended >= 25) return { band: "developing", percent: blended };
  return { band: "building", percent: blended };
}

export function buildJourneyMilestones(input: {
  levels: { slug: string; name: string; completionPercent: number }[];
  mocks: JourneyMock[];
  currentLevelSlug: string | null;
}): JourneyMilestone[] {
  const milestones: JourneyMilestone[] = [];
  const normalizedCurrent = normalizeProgramSlug(input.currentLevelSlug);

  for (const level of input.levels) {
    const slug = normalizeProgramSlug(level.slug);
    if (!slug) continue;
    milestones.push({
      id: `level-complete-${slug}`,
      kind: "level-complete",
      titleKey: `milestoneLevelComplete.${slug}`,
      descriptionKey: `milestoneLevelCompleteDesc.${slug}`,
      achieved: level.completionPercent >= 100,
      achievedAt: null,
      levelSlug: slug,
      href: "/learning",
    });
  }

  const writingMock = input.mocks.find(
    (m) => m.includesWriting && m.displayState === "completed"
  );
  milestones.push({
    id: "first-writing-exam",
    kind: "first-writing-exam",
    titleKey: "milestoneFirstWriting",
    descriptionKey: "milestoneFirstWritingDesc",
    achieved: Boolean(writingMock),
    achievedAt: null,
    levelSlug: null,
    href: writingMock?.href ?? "/mock-tests",
  });

  const speakingMock = input.mocks.find(
    (m) => m.includesSpeaking && m.displayState === "completed"
  );
  milestones.push({
    id: "first-speaking-exam",
    kind: "first-speaking-exam",
    titleKey: "milestoneFirstSpeaking",
    descriptionKey: "milestoneFirstSpeakingDesc",
    achieved: Boolean(speakingMock),
    achievedAt: null,
    levelSlug: null,
    href: speakingMock?.href ?? "/mock-tests",
  });

  const goldMock = input.mocks.find((m) => m.isGoldMock && m.displayState === "completed");
  milestones.push({
    id: "first-gold-mock",
    kind: "first-gold-mock",
    titleKey: "milestoneFirstGoldMock",
    descriptionKey: "milestoneFirstGoldMockDesc",
    achieved: Boolean(goldMock),
    achievedAt: null,
    levelSlug: null,
    href: goldMock?.href ?? "/mock-tests",
  });

  const ketLevel = input.levels.find((l) => normalizeProgramSlug(l.slug) === "ket");
  const flyersLevel = input.levels.find((l) => normalizeProgramSlug(l.slug) === "flyers");
  milestones.push({
    id: "ket-ready",
    kind: "ket-ready",
    titleKey: "milestoneKetReady",
    descriptionKey: "milestoneKetReadyDesc",
    achieved:
      (flyersLevel?.completionPercent ?? 0) >= 80 ||
      normalizedCurrent === "ket" ||
      normalizedCurrent === "pet",
    achievedAt: null,
    levelSlug: "ket",
    href: "/journey",
  });

  const petLevel = input.levels.find((l) => normalizeProgramSlug(l.slug) === "pet");
  milestones.push({
    id: "pet-ready",
    kind: "pet-ready",
    titleKey: "milestonePetReady",
    descriptionKey: "milestonePetReadyDesc",
    achieved:
      (petLevel?.completionPercent ?? 0) >= 80 || normalizedCurrent === "pet",
    achievedAt: null,
    levelSlug: "pet",
    href: "/journey",
  });

  return milestones;
}

export function buildJourneyProgressSummary(input: {
  programName: string;
  programSlug: string;
  currentLevelName: string | null;
  currentLevelSlug: string | null;
  currentUnitTitle: string | null;
  units: CurriculumUnitGroup[];
  levelLessonsCompleted: number;
  levelTotalLessons: number;
  mocksCompleted: number;
  totalMocks: number;
  totalXp: number;
  nextMilestoneTitle: string | null;
}): JourneyProgressSummary {
  const completionPercent = computeLevelProgressPercent(input.units);
  const { band, percent } = deriveReadinessBand(
    completionPercent,
    input.mocksCompleted,
    input.totalMocks
  );

  return {
    programName: input.programName,
    programSlug: input.programSlug,
    currentLevelName: input.currentLevelName,
    currentLevelSlug: input.currentLevelSlug,
    currentUnitTitle: input.currentUnitTitle,
    completionPercent,
    lessonsCompleted: input.levelLessonsCompleted,
    totalLessons: input.levelTotalLessons,
    mocksCompleted: input.mocksCompleted,
    totalMocks: input.totalMocks,
    totalXp: input.totalXp,
    readinessBand: band,
    readinessPercent: percent,
    nextMilestoneTitle: input.nextMilestoneTitle,
  };
}

export function pickNextMilestoneTitle(input: {
  nextLesson: NextLessonContext | null;
  recommendedMock: JourneyMock | null;
  milestones: JourneyMilestone[];
  fallback: string;
}): string | null {
  if (input.recommendedMock && input.recommendedMock.displayState !== "completed") {
    return input.recommendedMock.title;
  }
  if (input.nextLesson) {
    return input.nextLesson.title;
  }
  const nextUnachieved = input.milestones.find((m) => !m.achieved);
  return nextUnachieved ? input.fallback : null;
}

export function buildJourneyPreview(input: {
  currentLevelName: string | null;
  currentUnitTitle: string | null;
  completionPercent: number;
  nextMilestoneTitle: string | null;
}): JourneyPreview {
  return {
    currentLevelName: input.currentLevelName,
    currentUnitTitle: input.currentUnitTitle,
    nextMilestoneTitle: input.nextMilestoneTitle,
    completionPercent: input.completionPercent,
    href: "/journey",
  };
}

export function levelCefr(slug: string): string | null {
  return getProgramTheme(slug)?.cefr ?? null;
}

export function countLevelLessons(skills: { units?: { lessons?: LessonWithProgress[] }[] }[]): {
  total: number;
  completed: number;
} {
  let total = 0;
  let completed = 0;
  for (const skill of skills) {
    for (const unit of skill.units ?? []) {
      for (const lesson of unit.lessons ?? []) {
        total += 1;
        if ((lesson.progress?.completion_percent ?? 0) >= 100) completed += 1;
      }
    }
  }
  return { total, completed };
}
