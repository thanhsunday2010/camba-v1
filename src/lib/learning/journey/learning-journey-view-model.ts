import { createClient } from "@/lib/supabase/server";
import { fetchUserLessonProgress } from "@/lib/learning/lesson-progress-db";
import { getLearningPath } from "@/lib/queries/learning";
import { getNextLessonContext } from "@/lib/queries/dashboard";
import { getMockTestHubViewModel } from "@/lib/mock-tests/mock-test-hub";
import { getActiveProgramContext } from "@/lib/programs/context";
import { getUserGamification } from "@/lib/queries/user";
import { pivotSkillsToCurriculumUnits } from "@/lib/learning/pivot-units";
import { pickRecommendedMock } from "@/lib/mock-tests/mock-center-utils";
import {
  aggregateLessonsByLevel,
  buildJourneyMilestones,
  buildJourneyProgressSummary,
  buildJourneyUnits,
  countCompletedMocks,
  countLevelLessons,
  levelCefr,
  mapMockToJourneyMock,
  pickNextMilestoneTitle,
  resolveLevelStatus,
} from "@/lib/learning/journey/learning-journey-utils";
import type {
  JourneyLevel,
  LearningJourneyViewModel,
} from "@/lib/learning/journey/learning-journey-types";

async function fetchProgramLessonRows(userId: string, programId: string) {
  const supabase = await createClient();
  const progressList = await fetchUserLessonProgress(supabase, userId, programId);
  const progressMap = new Map(progressList.map((p) => [p.lesson_id, p]));

  const { data: levels } = await supabase
    .from("levels")
    .select("id")
    .eq("program_id", programId)
    .eq("is_active", true);

  const programLevelIds = new Set((levels ?? []).map((l) => l.id));
  if (programLevelIds.size === 0) return [];

  const { data: skills } = await supabase
    .from("skills")
    .select("id, level_id, slug")
    .in("level_id", [...programLevelIds])
    .eq("is_active", true);

  const programSkills = skills ?? [];
  const skillIds = programSkills.map((s) => s.id);
  if (!skillIds.length) return [];

  const skillMeta = new Map(
    programSkills.map((s) => [s.id, { levelId: s.level_id, skillSlug: s.slug }])
  );

  const { data: units } = await supabase
    .from("units")
    .select("id, skill_id")
    .in("skill_id", [...skillMeta.keys()])
    .eq("is_active", true);

  const unitIds = (units ?? []).map((u) => u.id);
  if (!unitIds.length) return [];

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, unit_id")
    .in("unit_id", unitIds)
    .eq("is_active", true);

  const unitToSkill = new Map((units ?? []).map((u) => [u.id, u.skill_id]));

  return (lessons ?? []).map((lesson) => {
    const skillId = unitToSkill.get(lesson.unit_id);
    const meta = skillId ? skillMeta.get(skillId) : null;
    const progress = progressMap.get(lesson.id);
    const completionPercent = Number(progress?.completion_percent ?? 0);
    return {
      levelId: meta?.levelId ?? "",
      skillSlug: meta?.skillSlug ?? "",
      completionPercent,
      isCompleted: completionPercent >= 100,
    };
  }).filter((row) => row.levelId);
}

export async function getLearningJourneyViewModel(
  userId: string,
  nextMilestoneFallback: string
): Promise<LearningJourneyViewModel | null> {
  const [gamification, programContext, mockHub] = await Promise.all([
    getUserGamification(userId),
    getActiveProgramContext(userId),
    getMockTestHubViewModel(userId),
  ]);

  if (!programContext?.programId) return null;

  const programId = programContext.programId;
  const currentLevelId = gamification?.current_level_id ?? null;

  const supabase = await createClient();
  const { data: levelRows } = await supabase
    .from("levels")
    .select("id, slug, name, sort_order")
    .eq("program_id", programId)
    .eq("is_active", true)
    .order("sort_order");

  const levels = levelRows ?? [];
  const currentLevelRow = levels.find((l) => l.id === currentLevelId) ?? null;
  const currentLevelSortOrder = currentLevelRow?.sort_order ?? -1;

  const [lessonRows, path, nextLesson] = await Promise.all([
    fetchProgramLessonRows(userId, programId),
    currentLevelId ? getLearningPath(userId, currentLevelId) : Promise.resolve(null),
    currentLevelId ? getNextLessonContext(userId, currentLevelId) : Promise.resolve(null),
  ]);

  const aggregates = aggregateLessonsByLevel(lessonRows);
  const recommendedMock = pickRecommendedMock(mockHub.recommendedTests);
  const allMocks = mockHub.tests.map((t) =>
    mapMockToJourneyMock(t, t.id === recommendedMock?.id)
  );

  const pivotedUnits = path ? pivotSkillsToCurriculumUnits(path.skills) : [];
  const journeyUnits = buildJourneyUnits(pivotedUnits, nextLesson?.id ?? null);
  const { total: currentTotalLessons, completed: currentCompletedLessons } = path
    ? countLevelLessons(path.skills)
    : { total: 0, completed: 0 };

  const journeyLevels: JourneyLevel[] = levels.map((level) => {
    const aggregate = aggregates.get(level.id);
    const levelMocks = allMocks.filter(
      (m) => m.levelSlug === level.slug || m.levelSlug === level.slug.replace(/-/g, "")
    );
    const status = resolveLevelStatus(
      level.id,
      level.sort_order,
      currentLevelId,
      currentLevelSortOrder,
      aggregate?.completionPercent ?? 0
    );

    return {
      id: level.id,
      slug: level.slug,
      name: level.name,
      sortOrder: level.sort_order,
      status,
      completionPercent: aggregate?.completionPercent ?? 0,
      lessonsCompleted: aggregate?.completedLessons ?? 0,
      totalLessons: aggregate?.totalLessons ?? 0,
      mocksCompleted: countCompletedMocks(levelMocks),
      totalMocks: levelMocks.length,
      writingProgressPercent: aggregate?.writingProgressPercent ?? 0,
      speakingProgressPercent: aggregate?.speakingProgressPercent ?? 0,
      cefr: levelCefr(level.slug),
      units: level.id === currentLevelId ? journeyUnits : [],
      mocks: levelMocks,
      isCurrent: level.id === currentLevelId,
    };
  });

  const currentLevelMocks = journeyLevels.find((l) => l.isCurrent)?.mocks ?? [];
  const milestones = buildJourneyMilestones({
    levels: journeyLevels.map((l) => ({
      slug: l.slug,
      name: l.name,
      completionPercent: l.completionPercent,
    })),
    mocks: allMocks,
    currentLevelSlug: currentLevelRow?.slug ?? null,
  });

  const recommendedJourneyMock =
    recommendedMock != null
      ? allMocks.find((m) => m.id === recommendedMock.id) ?? null
      : null;

  const nextMilestoneTitle = pickNextMilestoneTitle({
    nextLesson,
    recommendedMock: recommendedJourneyMock,
    milestones,
    fallback: nextMilestoneFallback,
  });

  const summary = buildJourneyProgressSummary({
    programName: programContext.program.name,
    programSlug: programContext.program.slug,
    currentLevelName: currentLevelRow?.name ?? null,
    currentLevelSlug: currentLevelRow?.slug ?? null,
    currentUnitTitle: nextLesson?.unitTitle ?? null,
    units: pivotedUnits,
    levelLessonsCompleted: currentCompletedLessons,
    levelTotalLessons: currentTotalLessons,
    mocksCompleted: countCompletedMocks(currentLevelMocks),
    totalMocks: currentLevelMocks.length,
    totalXp: gamification?.total_xp ?? 0,
    nextMilestoneTitle,
  });

  return {
    programId,
    programName: programContext.program.name,
    programSlug: programContext.program.slug,
    currentLevelId,
    levels: journeyLevels,
    milestones,
    summary,
    hasLevelSelected: Boolean(currentLevelId),
    recommendedMockId: recommendedMock?.id ?? null,
    nextLessonId: nextLesson?.id ?? null,
  };
}
