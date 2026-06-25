import type { EvaluatedAchievement } from "@/lib/achievements/achievement-types";
import type { DashboardSkillInsightsView } from "@/lib/dashboard/skill-insights";
import type { DashboardActivityItem } from "@/lib/dashboard/recent-activity";
import type { StudentPortfolioViewModel } from "@/lib/profile/student-profile-types";
import type { CertificationEntry } from "@/lib/profile/student-profile-types";
import type {
  AchievementSummary,
  JourneySummary,
  LearningProgressSummary,
  MockPerformanceSummary,
  NextStepRecommendation,
  NextStepsSummary,
  ParentProgressSnapshot,
  ParentSkillSummary,
  ReportConsistencyLabel,
  ReportTrendLabel,
  SpeakingProgressSummary,
  StudentProgressReportViewModel,
  WritingProgressSummary,
} from "@/lib/reporting/report-types";
import type { StudentProgressReportLabels } from "@/lib/reporting/report-labels";

export type ReportResolvers = {
  resolveAchievement: (a: EvaluatedAchievement) => { title: string; description: string };
  resolveMilestone: (titleKey: string) => string;
  resolveCertification: (entry: CertificationEntry) => string;
  resolveGoal: (key: string) => string;
};

export function deriveConsistency(
  streak: number,
  lessonsCompleted: number
): ReportConsistencyLabel {
  if (streak >= 3) return "consistent";
  if (lessonsCompleted > 0 && streak > 0) return "returning";
  return "getting-started";
}

export function formatTrendLabel(
  trend: ReportTrendLabel,
  labels: StudentProgressReportLabels
): string | null {
  if (!trend) return null;
  return labels.trends[trend];
}

export function formatReadinessBand(
  band: string | null | undefined,
  labels: StudentProgressReportLabels
): string | null {
  if (!band) return null;
  const key = band as keyof StudentProgressReportLabels["readinessBands"];
  return labels.readinessBands[key] ?? band;
}

export function buildParentProgressSnapshot(
  portfolio: StudentPortfolioViewModel,
  latestActivity: DashboardActivityItem | null
): ParentProgressSnapshot {
  const hasData =
    portfolio.learning.lessonsCompleted > 0 ||
    portfolio.snapshot.mocksCompleted > 0 ||
    portfolio.writing.hasHistory ||
    portfolio.speaking.hasHistory;

  return {
    studentName: portfolio.identity.name,
    levelName: portfolio.hero.levelName,
    programName: portfolio.hero.programName,
    cefrEstimate: portfolio.hero.cefrEstimate,
    currentStreak: portfolio.hero.currentStreak,
    bestStreak: portfolio.hero.bestStreak,
    lessonsCompleted: portfolio.learning.lessonsCompleted,
    unitsCompleted: portfolio.snapshot.unitsCompleted,
    mocksCompleted: portfolio.snapshot.mocksCompleted,
    latestActivityTitle: latestActivity?.title ?? null,
    latestActivityDate: latestActivity?.occurredAt ?? null,
    journeyCompletionPercent: portfolio.journey.summary?.completionPercent ?? null,
    journeyCurrentLevel: portfolio.journey.summary?.currentLevelName ?? portfolio.hero.levelName,
    generatedAt: new Date().toISOString(),
    hasData,
  };
}

export function buildLearningProgressSummary(
  portfolio: StudentPortfolioViewModel,
  latestActivity: DashboardActivityItem | null,
  labels: StudentProgressReportLabels
): LearningProgressSummary {
  const consistency = deriveConsistency(
    portfolio.hero.currentStreak,
    portfolio.learning.lessonsCompleted
  );

  const isEmpty = !portfolio.learning.hasProgress;

  return {
    consistency,
    consistencyNote: labels.consistency[consistency],
    recentActivitySummary: latestActivity
      ? labels.recentActivityTemplate.replace("{activity}", latestActivity.title)
      : isEmpty
        ? labels.learningEmpty
        : null,
    unitsCompleted: portfolio.learning.unitsCompleted,
    lessonsCompleted: portfolio.learning.lessonsCompleted,
    currentStage:
      portfolio.learning.currentLessonTitle ??
      portfolio.learning.currentUnitTitle ??
      portfolio.hero.levelName,
    progressTrend: portfolio.writing.trendLabel ?? portfolio.mockPerformance.trendLabel,
    progressPercent: portfolio.learning.progressPercent,
    isEmpty,
  };
}

export function buildMockPerformanceSummary(
  portfolio: StudentPortfolioViewModel,
  labels: StudentProgressReportLabels,
  resolveCertification: (entry: CertificationEntry) => string
): MockPerformanceSummary {
  const { mockPerformance, certifications } = portfolio;
  const isEmpty = !mockPerformance.hasMocks;

  return {
    latestScorePercent: mockPerformance.latestScorePercent,
    bestScorePercent: mockPerformance.bestScorePercent,
    mocksCompleted: mockPerformance.mocksCompleted,
    trendLabel: mockPerformance.trendLabel,
    readinessPercent: mockPerformance.readiness.hasAnalytics
      ? mockPerformance.readiness.readinessPercent
      : null,
    readinessBandLabel: formatReadinessBand(
      mockPerformance.readiness.readinessBand,
      labels
    ),
    recentScores: mockPerformance.recentResults.map((r) => ({
      title: r.mockTitle,
      scorePercent: r.scorePercent,
      date: r.completedAt,
    })),
    recentCertifications: certifications.entries.slice(0, 3).map((e) => ({
      title: resolveCertification(e),
      date: e.earnedAt,
    })),
    isEmpty,
  };
}

export function buildWritingProgressSummary(
  portfolio: StudentPortfolioViewModel,
  labels: StudentProgressReportLabels
): WritingProgressSummary {
  const { writing } = portfolio;
  return {
    tasksCompleted: writing.tasksCompleted,
    averageScore: writing.averageScore,
    strengths: writing.topStrengths,
    improvementAreas: writing.improvementAreas,
    trendLabel: writing.trendLabel,
    recentGrowthNote: writing.hasHistory
      ? formatTrendLabel(writing.trendLabel, labels)
      : null,
    isEmpty: !writing.hasHistory,
  };
}

export function buildSpeakingProgressSummary(
  portfolio: StudentPortfolioViewModel,
  labels: StudentProgressReportLabels
): SpeakingProgressSummary {
  const { speaking } = portfolio;
  return {
    practiceCount: speaking.tasksCompleted,
    averageScore: speaking.averageScore,
    fluencyTrend: speaking.trendLabel,
    pronunciationAvg: speaking.pronunciationAvg,
    fluencyAvg: speaking.fluencyAvg,
    vocabularyAvg: speaking.vocabularyAvg,
    growthNote: speaking.hasHistory
      ? formatTrendLabel(speaking.trendLabel, labels)
      : labels.speakingEmpty,
    isEmpty: !speaking.hasHistory,
  };
}

export function buildParentSkillSummary(
  skillInsights: DashboardSkillInsightsView,
  labels: StudentProgressReportLabels
): ParentSkillSummary {
  const hasItems =
    skillInsights.grammarStrengths.length > 0 ||
    skillInsights.vocabularyStrengths.length > 0 ||
    skillInsights.grammarWeaknesses.length > 0 ||
    skillInsights.vocabularyWeaknesses.length > 0;

  return {
    grammarStrengths: skillInsights.grammarStrengths.slice(0, 5),
    grammarImprovementAreas: skillInsights.grammarWeaknesses.slice(0, 5),
    vocabularyStrengths: skillInsights.vocabularyStrengths.slice(0, 5),
    vocabularyImprovementAreas: skillInsights.vocabularyWeaknesses.slice(0, 5),
    hasAnalytics: skillInsights.hasAnalytics,
    isEmpty: !hasItems,
    emptyNote: hasItems ? null : labels.skillsEmpty,
  };
}

export function buildAchievementSummary(
  portfolio: StudentPortfolioViewModel,
  resolveAchievement: (a: EvaluatedAchievement) => { title: string; description: string }
): AchievementSummary {
  const { achievements, hero } = portfolio;
  return {
    recentAchievements: achievements.recentUnlocked.map((a) => ({
      title: resolveAchievement(a).title,
      date: a.unlockedAt,
    })),
    milestonesUnlocked: achievements.unlockedCount,
    totalAchievements: achievements.totalCount,
    unlockedCount: achievements.unlockedCount,
    streakDays: hero.currentStreak,
    isEmpty: achievements.unlockedCount === 0,
  };
}

export function buildJourneySummary(
  portfolio: StudentPortfolioViewModel,
  resolveMilestone: (key: string) => string
): JourneySummary {
  const { journey } = portfolio;
  return {
    currentLevel: journey.summary?.currentLevelName ?? portfolio.hero.levelName,
    completedLevels: journey.completedLevelCount,
    totalLevels: journey.totalLevelCount,
    currentMilestone: journey.currentMilestoneTitle
      ? resolveMilestone(journey.currentMilestoneTitle)
      : null,
    nextMilestone: journey.nextMilestoneTitle
      ? resolveMilestone(journey.nextMilestoneTitle)
      : null,
    completionPercent: journey.summary?.completionPercent ?? null,
    isEmpty: !journey.hasJourney,
  };
}

export function buildNextStepsSummary(
  portfolio: StudentPortfolioViewModel,
  labels: StudentProgressReportLabels,
  resolvers: ReportResolvers
): NextStepsSummary {
  const steps: NextStepRecommendation[] = [];

  if (portfolio.learning.currentLessonTitle) {
    steps.push({
      id: "continue-lesson",
      title: labels.nextSteps.continueLesson.replace(
        "{lesson}",
        portfolio.learning.currentLessonTitle
      ),
      reason: labels.nextSteps.continueLessonReason,
      priority: "high",
    });
  } else if (portfolio.learning.lessonsCompleted === 0) {
    steps.push({
      id: "start-learning",
      title: labels.nextSteps.startLearning,
      reason: labels.nextSteps.startLearningReason,
      priority: "high",
    });
  }

  if (portfolio.mockPerformance.recommendedMock) {
    steps.push({
      id: "take-mock",
      title: labels.nextSteps.takeMock.replace(
        "{mock}",
        portfolio.mockPerformance.recommendedMock.title
      ),
      reason: labels.nextSteps.takeMockReason,
      priority: portfolio.mockPerformance.hasMocks ? "medium" : "high",
    });
  }

  if (!portfolio.writing.hasHistory) {
    steps.push({
      id: "practice-writing",
      title: labels.nextSteps.practiceWriting,
      reason: labels.nextSteps.practiceWritingReason,
      priority: "medium",
    });
  } else if (portfolio.writing.improvementAreas[0]) {
    steps.push({
      id: "writing-focus",
      title: labels.nextSteps.reviewWriting.replace(
        "{area}",
        portfolio.writing.improvementAreas[0]
      ),
      reason: labels.nextSteps.reviewWritingReason,
      priority: "medium",
    });
  }

  if (!portfolio.speaking.hasHistory) {
    steps.push({
      id: "practice-speaking",
      title: labels.nextSteps.practiceSpeaking,
      reason: labels.nextSteps.practiceSpeakingReason,
      priority: "medium",
    });
  } else if (portfolio.speaking.fluencyAvg != null && portfolio.speaking.fluencyAvg < 70) {
    steps.push({
      id: "speaking-fluency",
      title: labels.nextSteps.improveFluency,
      reason: labels.nextSteps.improveFluencyReason,
      priority: "medium",
    });
  }

  for (const goal of portfolio.futureGoals.slice(0, 2)) {
    steps.push({
      id: `goal-${goal.id}`,
      title: resolvers.resolveGoal(goal.titleKey),
      reason: resolvers.resolveGoal(goal.descriptionKey),
      priority: "low",
    });
  }

  const unique = steps.filter(
    (step, index, arr) => arr.findIndex((s) => s.id === step.id) === index
  );

  return {
    steps: unique.slice(0, 5),
    isEmpty: unique.length === 0,
  };
}

/** Merge skill-based next step after skill summary is built */
export function appendSkillNextStep(
  summary: NextStepsSummary,
  skillSummary: ParentSkillSummary,
  labels: StudentProgressReportLabels
): NextStepsSummary {
  const area =
    skillSummary.grammarImprovementAreas[0] ??
    skillSummary.vocabularyImprovementAreas[0];
  if (!area || summary.steps.some((s) => s.id === "skill-focus")) {
    return summary;
  }
  return {
    ...summary,
    steps: [
      ...summary.steps,
      {
        id: "skill-focus",
        title: labels.nextSteps.reviewGrammar.replace("{area}", area),
        reason: labels.nextSteps.reviewGrammarReason,
        priority: "medium" as const,
      },
    ].slice(0, 5),
    isEmpty: false,
  };
}

export function buildStudentProgressReportViewModel(
  portfolio: StudentPortfolioViewModel,
  skillInsights: DashboardSkillInsightsView,
  latestActivity: DashboardActivityItem | null,
  labels: StudentProgressReportLabels,
  resolvers: ReportResolvers
): StudentProgressReportViewModel {
  const snapshot = buildParentProgressSnapshot(portfolio, latestActivity);
  const skills = buildParentSkillSummary(skillInsights, labels);
  let nextSteps = buildNextStepsSummary(portfolio, labels, resolvers);
  nextSteps = appendSkillNextStep(nextSteps, skills, labels);

  const hasAnyProgress = snapshot.hasData;

  return {
    snapshot,
    learning: buildLearningProgressSummary(portfolio, latestActivity, labels),
    mockPerformance: buildMockPerformanceSummary(
      portfolio,
      labels,
      resolvers.resolveCertification
    ),
    writing: buildWritingProgressSummary(portfolio, labels),
    speaking: buildSpeakingProgressSummary(portfolio, labels),
    skills,
    achievements: buildAchievementSummary(portfolio, resolvers.resolveAchievement),
    journey: buildJourneySummary(portfolio, resolvers.resolveMilestone),
    nextSteps,
    hasAnyProgress,
  };
}
