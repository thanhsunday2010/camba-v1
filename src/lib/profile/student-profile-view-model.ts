import { createClient } from "@/lib/supabase/server";
import { getUserGamification, getUserStreak } from "@/lib/queries/user";
import { getActiveProgramContext } from "@/lib/programs/context";
import { getNextLessonContext } from "@/lib/queries/dashboard";
import { xpProgressInLevel } from "@/lib/gamification/constants";
import { getProgramTheme } from "@/lib/design/cambridge-programs";
import { getMockTestHubViewModel } from "@/lib/mock-tests/mock-test-hub";
import {
  buildReadinessFromHub,
  pickRecommendedMock,
} from "@/lib/mock-tests/mock-center-utils";
import {
  buildStudentAchievementContext,
} from "@/lib/achievements/achievement-view-model";
import { buildAchievementViewModel, pickNextAchievement } from "@/lib/achievements/achievement-utils";
import { getLearningJourneyViewModel } from "@/lib/learning/journey/learning-journey-view-model";
import type { AuthUser } from "@/types";
import type { StudentPortfolioViewModel } from "@/lib/profile/student-profile-types";
import {
  averageScore,
  buildFutureGoals,
  computeProfileCompletion,
  countCompletedLevels,
  currentAndNextMilestone,
  deriveMockTrend,
  parseSpeakingFeedbackRows,
  parseWritingFeedbackRows,
  pickRareAchievements,
  scoreTrend,
  topFrequencyLabels,
} from "@/lib/profile/student-profile-utils";

async function fetchProfileMeta(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("created_at, full_name, email")
    .eq("id", userId)
    .maybeSingle();
  return data;
}

async function fetchAiFeedback(userId: string, type: "writing" | "speaking", limit = 10) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_feedback")
    .select("id, created_at, response_data")
    .eq("user_id", userId)
    .eq("feedback_type", type)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

async function fetchRecentMockResults(userId: string, limit = 5) {
  const supabase = await createClient();
  const { data: attempts } = await supabase
    .from("mock_test_attempts")
    .select("id, mock_test_id, score, max_score, completed_at, mock_tests(title)")
    .eq("user_id", userId)
    .eq("is_completed", true)
    .order("completed_at", { ascending: false })
    .limit(limit);

  return (attempts ?? []).map((attempt) => {
    const mockMeta = attempt.mock_tests as { title?: string } | null;
    const scorePercent =
      Number(attempt.max_score) > 0
        ? Math.round((Number(attempt.score) / Number(attempt.max_score)) * 100)
        : 0;
    return {
      mockTitle: mockMeta?.title ?? "Mock test",
      scorePercent,
      completedAt: attempt.completed_at ?? new Date().toISOString(),
      detailHref: `/mock-tests/${attempt.mock_test_id}`,
    };
  });
}

async function fetchLatestSkillBreakdown(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mock_test_attempts")
    .select("skill_breakdown")
    .eq("user_id", userId)
    .eq("is_completed", true)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.skill_breakdown as Record<string, number> | null) ?? null;
}

export async function getStudentPortfolioViewModel(
  user: AuthUser,
  nextMilestoneFallback: string
): Promise<StudentPortfolioViewModel> {
  const userId = user.id;

  const achievementContext = await buildStudentAchievementContext(userId);

  const [
    gamification,
    streak,
    profileMeta,
    mockHub,
    writingRows,
    speakingRows,
    recentMocks,
    latestSkillBreakdown,
  ] = await Promise.all([
    getUserGamification(userId),
    getUserStreak(userId),
    fetchProfileMeta(userId),
    getMockTestHubViewModel(userId),
    fetchAiFeedback(userId, "writing"),
    fetchAiFeedback(userId, "speaking"),
    fetchRecentMockResults(userId),
    fetchLatestSkillBreakdown(userId),
  ]);

  const achievementVm = buildAchievementViewModel(achievementContext);

  const programContext = await getActiveProgramContext(userId, gamification);
  const levelId = gamification?.current_level_id ?? null;
  const nextLesson = levelId ? await getNextLessonContext(userId, levelId) : null;

  const journeyVm = programContext?.programId
    ? await getLearningJourneyViewModel(userId, nextMilestoneFallback)
    : null;

  const programSlug = programContext?.program.slug ?? null;
  const cefrEstimate = getProgramTheme(programSlug)?.cefr ?? null;
  const levelProgressPercent = gamification
    ? xpProgressInLevel(gamification.total_xp, gamification.level)
    : 0;

  const recommendedMock = pickRecommendedMock(mockHub.recommendedTests);
  const readiness = buildReadinessFromHub({
    tests: mockHub.tests,
    learnerLevelName: mockHub.currentLearnerLevelName,
    latestSkillBreakdown,
  });

  const completedMocks = mockHub.tests.filter((t) => t.attemptCount > 0);
  const bestScore = completedMocks.reduce(
    (best, t) => Math.max(best, t.bestScorePercent ?? 0),
    0
  );
  const latestScores = completedMocks
    .filter((t) => t.latestScorePercent != null)
    .map((t) => t.latestScorePercent as number);
  const latestScore = latestScores.length > 0 ? Math.max(...latestScores) : null;

  const writingItems = parseWritingFeedbackRows(writingRows);
  const speakingItems = parseSpeakingFeedbackRows(speakingRows);
  const writingScores = writingItems.map((w) => w.overallScore);
  const speakingScores = speakingItems.map((s) => s.overallScore);

  const goldCertifications = mockHub.tests.filter(
    (t) => t.isGoldMock && t.attemptCount > 0
  );
  const levelCompletions = journeyVm?.levels.filter((l) => l.status === "completed") ?? [];

  const certificationEntries = [
    ...goldCertifications.map((t) => ({
      id: `gold-${t.id}`,
      title: t.title,
      subtitle: t.levelName ?? "Gold certified mock",
      kind: "gold-mock" as const,
      earnedAt: t.latestCompletedAt,
      href: `/mock-tests/${t.id}`,
    })),
    ...levelCompletions.map((l) => ({
      id: `level-${l.id}`,
      title: l.name,
      subtitle: "Level completed",
      kind: "level-complete" as const,
      earnedAt: null,
      href: "/journey",
    })),
    ...pickRareAchievements(achievementVm.unlocked, 2).map((a) => ({
      id: `achievement-${a.id}`,
      title: a.titleKey,
      subtitle: a.category,
      kind: "achievement" as const,
      earnedAt: a.unlockedAt,
      href: "/achievements",
    })),
  ];

  const milestones = journeyVm?.milestones ?? [];
  const milestoneTitles = currentAndNextMilestone(milestones);

  const profileCompletion = computeProfileCompletion({
    hasProgram: Boolean(programContext?.programId),
    lessonsCompleted: achievementContext.lessonsCompleted,
    mocksCompleted: achievementContext.mocksCompleted,
    writingTasks: achievementContext.writingSubmissions,
    speakingTasks: achievementContext.speakingSubmissions,
    achievementsUnlocked: achievementVm.unlockedCount,
  });

  const nextAchievement =
    achievementVm.nextAchievement ?? pickNextAchievement(achievementVm.achievements);

  const futureGoals = buildFutureGoals({
    achievementContext,
    nextAchievement,
    recommendedMock,
    nextMilestoneTitle: journeyVm?.summary.nextMilestoneTitle ?? null,
    levelName: programContext?.level?.name ?? null,
    currentStreak: streak?.current_streak ?? 0,
  });

  const levelCompletion = journeyVm?.summary.completionPercent ?? 0;

  return {
    identity: {
      name: user.fullName || profileMeta?.full_name || user.email,
      email: user.email,
      avatarUrl: user.avatarUrl,
      joinDate: profileMeta?.created_at ?? null,
      profileCompletionPercent: profileCompletion,
    },
    hero: {
      levelName: programContext?.level?.name ?? mockHub.currentLearnerLevelName,
      programName: programContext?.program.name ?? null,
      programSlug,
      cefrEstimate,
      totalXp: gamification?.total_xp ?? 0,
      level: gamification?.level ?? 1,
      levelProgressPercent,
      currentStreak: streak?.current_streak ?? 0,
      bestStreak: streak?.best_streak ?? 0,
    },
    snapshot: {
      levelName: programContext?.level?.name ?? mockHub.currentLearnerLevelName,
      cefrEstimate,
      unitsCompleted: achievementContext.unitsCompleted,
      mocksCompleted: achievementContext.mocksCompleted,
      writingTasksCompleted: achievementContext.writingSubmissions,
      speakingTasksCompleted: achievementContext.speakingSubmissions,
      certificationsEarned: certificationEntries.length,
      achievementsUnlocked: achievementVm.unlockedCount,
      hasProgram: Boolean(programContext?.programId),
    },
    learning: {
      currentUnitTitle: nextLesson?.unitTitle ?? journeyVm?.summary.currentUnitTitle ?? null,
      currentLessonTitle: nextLesson?.title ?? null,
      unitsCompleted: achievementContext.unitsCompleted,
      lessonsCompleted: achievementContext.lessonsCompleted,
      progressPercent: levelCompletion,
      nextMilestoneTitle: journeyVm?.summary.nextMilestoneTitle ?? null,
      journeyHref: "/journey",
      hasProgress: achievementContext.lessonsCompleted > 0 || Boolean(nextLesson),
    },
    mockPerformance: {
      mocksCompleted: achievementContext.mocksCompleted,
      bestScorePercent: bestScore > 0 ? bestScore : null,
      latestScorePercent: latestScore,
      recommendedMock,
      readiness,
      recentResults: recentMocks,
      trendLabel: deriveMockTrend(recentMocks),
      hasMocks: achievementContext.mocksCompleted > 0,
    },
    writing: {
      tasksCompleted: writingItems.length,
      averageScore: averageScore(writingScores),
      topStrengths: topFrequencyLabels(writingItems.flatMap((w) => w.strengths)),
      improvementAreas: topFrequencyLabels(writingItems.flatMap((w) => w.weaknesses)),
      recentItems: writingItems.slice(0, 5),
      trendLabel: scoreTrend(writingScores),
      hasHistory: writingItems.length > 0,
    },
    speaking: {
      tasksCompleted: speakingItems.length,
      averageScore: averageScore(speakingScores),
      pronunciationAvg: averageScore(
        speakingItems.map((s) => s.pronunciationScore).filter((n): n is number => n != null)
      ),
      fluencyAvg: averageScore(
        speakingItems.map((s) => s.fluencyScore).filter((n): n is number => n != null)
      ),
      vocabularyAvg: averageScore(
        speakingItems.map((s) => s.vocabularyScore).filter((n): n is number => n != null)
      ),
      recentItems: speakingItems.slice(0, 5),
      trendLabel: scoreTrend(speakingScores),
      hasHistory: speakingItems.length > 0,
    },
    certifications: {
      entries: certificationEntries,
      goldMocksCompleted: achievementContext.goldMocksCompleted,
      hasCertifications: certificationEntries.length > 0,
    },
    achievements: {
      recentUnlocked: achievementVm.recentUnlocked.slice(0, 5),
      rareUnlocked: pickRareAchievements(achievementVm.unlocked),
      nextAchievement,
      unlockedCount: achievementVm.unlockedCount,
      totalCount: achievementVm.totalCount,
    },
    journey: {
      summary: journeyVm?.summary ?? null,
      milestones,
      completedLevelCount: journeyVm ? countCompletedLevels(journeyVm.levels) : 0,
      totalLevelCount: journeyVm?.levels.length ?? 0,
      currentMilestoneTitle: milestoneTitles.current,
      nextMilestoneTitle: milestoneTitles.next,
      journeyHref: "/journey",
      hasJourney: Boolean(journeyVm?.hasLevelSelected),
    },
    futureGoals,
    shareReady: {
      studentName: user.fullName || user.email,
      levelName: programContext?.level?.name ?? null,
      cefrEstimate,
      lessonsCompleted: achievementContext.lessonsCompleted,
      mocksCompleted: achievementContext.mocksCompleted,
      achievementsUnlocked: achievementVm.unlockedCount,
      certificationsCount: certificationEntries.length,
      generatedAt: new Date().toISOString(),
    },
  };
}
