import { createClient } from "@/lib/supabase/server";
import { fetchUserLessonProgress } from "@/lib/learning/lesson-progress-db";
import { getUserGamification, getUserStreak } from "@/lib/queries/user";
import { getUserBadges } from "@/lib/gamification/badges";
import { getMockTestHubViewModel } from "@/lib/mock-tests/mock-test-hub";
import { aggregateLessonsByLevel } from "@/lib/learning/journey/learning-journey-utils";
import { YLE_LEVEL_IDS } from "@/lib/mock-blueprints/yle-coverage";
import type { YleLevelSlug } from "@/lib/mock-blueprints/yle-mock-blueprint-types";
import { buildAchievementViewModel } from "@/lib/achievements/achievement-utils";
import type {
  AchievementViewModel,
  StudentAchievementContext,
} from "@/lib/achievements/achievement-types";

const COMPLETION_THRESHOLD = 100;

async function fetchProgramLessonRows(userId: string, programId: string) {
  const supabase = await createClient();
  const progressList = await fetchUserLessonProgress(supabase, userId, programId);
  const progressMap = new Map(progressList.map((p) => [p.lesson_id, p]));

  const { data: levels } = await supabase
    .from("levels")
    .select("id, slug")
    .eq("program_id", programId)
    .eq("is_active", true);

  const levelSlugById = new Map((levels ?? []).map((l) => [l.id, l.slug]));
  const programLevelIds = new Set((levels ?? []).map((l) => l.id));
  if (programLevelIds.size === 0) return { rows: [], levelSlugById };

  const { data: skills } = await supabase
    .from("skills")
    .select("id, level_id, slug")
    .in("level_id", [...programLevelIds])
    .eq("is_active", true);

  const skillMeta = new Map(
    (skills ?? []).map((s) => [s.id, { levelId: s.level_id, skillSlug: s.slug }])
  );

  const { data: units } = await supabase
    .from("units")
    .select("id, skill_id")
    .in("skill_id", [...skillMeta.keys()])
    .eq("is_active", true);

  const unitIds = (units ?? []).map((u) => u.id);
  if (!unitIds.length) return { rows: [], levelSlugById };

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, unit_id")
    .in("unit_id", unitIds)
    .eq("is_active", true);

  const unitToSkill = new Map((units ?? []).map((u) => [u.id, u.skill_id]));

  const rows = (lessons ?? []).map((lesson) => {
    const skillId = unitToSkill.get(lesson.unit_id);
    const meta = skillId ? skillMeta.get(skillId) : null;
    const progress = progressMap.get(lesson.id);
    const completionPercent = Number(progress?.completion_percent ?? 0);
    return {
      levelId: meta?.levelId ?? "",
      skillSlug: meta?.skillSlug ?? "",
      unitId: lesson.unit_id,
      lessonId: lesson.id,
      completionPercent,
      isCompleted: completionPercent >= COMPLETION_THRESHOLD,
    };
  });

  return { rows, levelSlugById };
}

function countCompletedUnits(
  rows: { unitId: string; completionPercent: number }[]
): number {
  const byUnit = new Map<string, { total: number; completed: number }>();
  for (const row of rows) {
    const bucket = byUnit.get(row.unitId) ?? { total: 0, completed: 0 };
    bucket.total += 1;
    if (row.completionPercent >= COMPLETION_THRESHOLD) bucket.completed += 1;
    byUnit.set(row.unitId, bucket);
  }
  return [...byUnit.values()].filter((u) => u.total > 0 && u.completed >= u.total).length;
}

function buildLevelCompletionPercent(
  aggregates: ReturnType<typeof aggregateLessonsByLevel>,
  levelSlugById: Map<string, string>
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [levelId, agg] of aggregates) {
    const slug = levelSlugById.get(levelId);
    if (slug) result[slug] = agg.completionPercent;
  }
  for (const slug of Object.keys(YLE_LEVEL_IDS) as YleLevelSlug[]) {
    if (!(slug in result)) result[slug] = 0;
  }
  return result;
}

async function fetchAiSubmissionCounts(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_feedback")
    .select("feedback_type")
    .eq("user_id", userId);

  let writingSubmissions = 0;
  let speakingSubmissions = 0;
  for (const row of data ?? []) {
    if (row.feedback_type === "writing") writingSubmissions += 1;
    if (row.feedback_type === "speaking") speakingSubmissions += 1;
  }
  return { writingSubmissions, speakingSubmissions };
}

async function fetchMockStats(userId: string) {
  const supabase = await createClient();
  const { data: attempts } = await supabase
    .from("mock_test_attempts")
    .select("mock_test_id, score, max_score, mock_tests(settings)")
    .eq("user_id", userId)
    .eq("is_completed", true);

  const mockIds = new Set<string>();
  let goldMocksCompleted = 0;
  let maxMockScorePercent = 0;

  for (const attempt of attempts ?? []) {
    mockIds.add(attempt.mock_test_id);
    const percent =
      Number(attempt.max_score) > 0
        ? Math.round((Number(attempt.score) / Number(attempt.max_score)) * 100)
        : 0;
    maxMockScorePercent = Math.max(maxMockScorePercent, percent);

    const settings = (attempt.mock_tests as { settings?: Record<string, unknown> } | null)
      ?.settings;
    if (settings?.goldMock) goldMocksCompleted += 1;
  }

  return {
    mocksCompleted: attempts?.length ?? 0,
    distinctMocksCompleted: mockIds.size,
    goldMocksCompleted,
    maxMockScorePercent,
  };
}

export async function buildStudentAchievementContext(
  userId: string
): Promise<StudentAchievementContext> {
  const [gamification, streak, badges, mockStats, aiCounts] = await Promise.all([
    getUserGamification(userId),
    getUserStreak(userId),
    getUserBadges(userId),
    fetchMockStats(userId),
    fetchAiSubmissionCounts(userId),
  ]);

  let lessonsCompleted = 0;
  let unitsCompleted = 0;
  let levelCompletionPercent: Record<string, number> = {};

  if (gamification?.current_program_id) {
    const { rows, levelSlugById } = await fetchProgramLessonRows(
      userId,
      gamification.current_program_id
    );
    lessonsCompleted = rows.filter((r) => r.isCompleted).length;
    unitsCompleted = countCompletedUnits(rows);
    const aggregates = aggregateLessonsByLevel(
      rows.map((r) => ({
        levelId: r.levelId,
        skillSlug: r.skillSlug,
        completionPercent: r.completionPercent,
        isCompleted: r.isCompleted,
      }))
    );
    levelCompletionPercent = buildLevelCompletionPercent(aggregates, levelSlugById);
  }

  const badgeSlugs: Record<string, string> = {};
  for (const badge of badges) {
    if (badge.earned && badge.earnedAt) {
      badgeSlugs[badge.slug] = badge.earnedAt;
    }
  }

  let ctx: StudentAchievementContext = {
    lessonsCompleted,
    unitsCompleted,
    ...mockStats,
    writingSubmissions: aiCounts.writingSubmissions,
    speakingSubmissions: aiCounts.speakingSubmissions,
    currentStreak: streak?.current_streak ?? 0,
    bestStreak: streak?.best_streak ?? 0,
    levelCompletionPercent,
    badgeSlugs,
  };

  ctx = await enrichAchievementContextFromHub(userId, ctx);
  return ctx;
}

export async function enrichAchievementContextFromHub(
  userId: string,
  ctx: StudentAchievementContext
): Promise<StudentAchievementContext> {
  const hub = await getMockTestHubViewModel(userId);
  const goldCompleted = hub.tests.filter(
    (t) => t.isGoldMock && t.attemptCount > 0
  ).length;
  return {
    ...ctx,
    goldMocksCompleted: Math.max(ctx.goldMocksCompleted, goldCompleted),
  };
}

export async function getAchievementViewModel(userId: string): Promise<AchievementViewModel> {
  const ctx = await buildStudentAchievementContext(userId);
  return buildAchievementViewModel(ctx);
}

export async function getStudentDashboardAchievements(userId: string) {
  const vm = await getAchievementViewModel(userId);
  return {
    recentUnlocked: vm.recentUnlocked.slice(0, 5),
    nextAchievement: vm.nextAchievement,
    unlockedCount: vm.unlockedCount,
    totalCount: vm.totalCount,
  };
}

export async function getAchievementPreviewForMocks(userId: string) {
  const vm = await getAchievementViewModel(userId);
  const assessmentUnlocked = vm.byCategory.assessment.filter((a) => a.unlocked).slice(0, 2);
  const next =
    vm.nextAchievement?.category === "assessment" ||
    vm.nextAchievement?.category === "certification"
      ? vm.nextAchievement
      : vm.byCategory.assessment.find((a) => !a.unlocked) ??
        vm.byCategory.certification.find((a) => !a.unlocked) ??
        vm.nextAchievement;

  return {
    recentUnlocked: assessmentUnlocked,
    nextAchievement: next,
    unlockedCount: vm.unlockedCount,
    totalCount: vm.totalCount,
  };
}

export async function getJourneyAchievementPreview(userId: string) {
  const vm = await getAchievementViewModel(userId);
  const journeyRelated = [
    ...vm.byCategory.journey,
    ...vm.byCategory.certification.filter((a) =>
      ["first-gold-mock", "gold-mock-finisher"].includes(a.id)
    ),
    ...vm.byCategory.writing.filter((a) => a.id === "writing-specialist"),
    ...vm.byCategory.speaking.filter((a) => a.id === "speaking-champion"),
  ];

  const unlocked = journeyRelated.filter((a) => a.unlocked).slice(0, 3);
  const nextLocked = journeyRelated.filter((a) => !a.unlocked).slice(0, 3 - unlocked.length);

  return {
    achievements: [...unlocked, ...nextLocked].slice(0, 3),
  };
}
