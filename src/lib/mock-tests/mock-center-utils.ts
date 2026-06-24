import type { MockTestHubSummary, MockTestLevelBucket } from "@/lib/mock-tests/mock-test-types";
import type { YleLevelSlug } from "@/lib/mock-blueprints/yle-mock-blueprint-types";

export type MockDifficultyBand = "standard" | "review" | "challenge";

export type MockReadinessBand = "building" | "developing" | "approaching" | "ready";

export type MockCenterRecentResult = {
  attemptId: string;
  mockTestId: string;
  mockTitle: string;
  levelName: string | null;
  scorePercent: number;
  completedAt: string;
  writingScorePercent: number | null;
  speakingScorePercent: number | null;
  displayState: MockTestHubSummary["displayState"];
  detailHref: string;
};

export type MockCenterLevelCollection = {
  slug: YleLevelSlug;
  name: string;
  tests: MockTestHubSummary[];
  completedCount: number;
  totalCount: number;
  recommendedNext: MockTestHubSummary | null;
};

export type MockCenterReadiness = {
  readinessPercent: number;
  readinessBand: MockReadinessBand;
  strongestSkill: string | null;
  weakestSkill: string | null;
  suggestedFocus: string | null;
  recommendedLevelName: string | null;
  hasAnalytics: boolean;
};

export type MockCenterAchievementPreview = {
  recentUnlocked: import("@/lib/achievements/achievement-types").EvaluatedAchievement[];
  nextAchievement: import("@/lib/achievements/achievement-types").EvaluatedAchievement | null;
  unlockedCount: number;
  totalCount: number;
};

export type MockCenterViewModel = {
  hub: import("@/lib/mock-tests/mock-test-types").MockTestHubViewModel;
  featuredMock: MockTestHubSummary | null;
  continueMock: MockTestHubSummary | null;
  recommendedMock: MockTestHubSummary | null;
  goldMocks: MockTestHubSummary[];
  levelCollections: MockCenterLevelCollection[];
  recentResults: MockCenterRecentResult[];
  readiness: MockCenterReadiness;
  achievementPreview: MockCenterAchievementPreview;
};

export function isMockMastered(test: MockTestHubSummary): boolean {
  return test.displayState === "completed" && (test.latestScorePercent ?? 0) >= 80;
}

export function pickRecommendedMock(tests: MockTestHubSummary[]): MockTestHubSummary | null {
  const pool = tests.filter((t) => t.isRecommendedForLearner && !isMockMastered(t));
  if (!pool.length) return null;

  const priority: MockTestHubSummary["displayState"][] = [
    "needs-review",
    "in-progress",
    "not-started",
    "completed",
  ];

  for (const state of priority) {
    const match = pool.find((t) => t.displayState === state);
    if (match) return match;
  }

  const goldFirst = pool.find((t) => t.isGoldMock);
  return goldFirst ?? pool[0] ?? null;
}

export function pickFeaturedMock(
  hub: import("@/lib/mock-tests/mock-test-types").MockTestHubViewModel
): MockTestHubSummary | null {
  const recommended = pickRecommendedMock(hub.recommendedTests);
  if (recommended) return recommended;

  const goldRecommended = hub.tests.find(
    (t) => t.isGoldMock && t.isRecommendedForLearner && !isMockMastered(t)
  );
  if (goldRecommended) return goldRecommended;

  const needsReview = hub.tests.find((t) => t.displayState === "needs-review");
  if (needsReview) return needsReview;

  return hub.tests.find((t) => t.displayState === "not-started") ?? hub.tests[0] ?? null;
}

export function pickContinueMock(tests: MockTestHubSummary[]): MockTestHubSummary | null {
  return tests.find((t) => t.displayState === "in-progress") ?? null;
}

export function deriveMockDifficulty(test: MockTestHubSummary): MockDifficultyBand {
  if (test.displayState === "needs-review") return "review";
  if (test.isGoldMock) return "challenge";
  return "standard";
}

export function deriveReadinessBand(percent: number): MockReadinessBand {
  if (percent >= 85) return "ready";
  if (percent >= 60) return "approaching";
  if (percent >= 30) return "developing";
  return "building";
}

export function buildLevelCollections(
  tests: MockTestHubSummary[],
  buckets: MockTestLevelBucket[]
): MockCenterLevelCollection[] {
  return buckets.map((bucket) => {
    const levelTests = tests.filter((t) => t.levelSlug === bucket.slug);
    const completedCount = levelTests.filter(
      (t) => t.displayState === "completed" || t.displayState === "needs-review"
    ).length;
    const recommendedNext = pickRecommendedMock(levelTests.filter((t) => t.isRecommendedForLearner))
      ?? levelTests.find((t) => !isMockMastered(t))
      ?? null;

    return {
      slug: bucket.slug,
      name: bucket.name,
      tests: levelTests,
      completedCount,
      totalCount: levelTests.length,
      recommendedNext,
    };
  });
}

export function buildReadinessFromHub(input: {
  tests: MockTestHubSummary[];
  learnerLevelName: string | null;
  latestSkillBreakdown: Record<string, number> | null;
}): MockCenterReadiness {
  const completed = input.tests.filter((t) => t.attemptCount > 0);
  const avgLatest =
    completed.length > 0
      ? Math.round(
          completed.reduce((sum, t) => sum + (t.latestScorePercent ?? 0), 0) / completed.length
        )
      : 0;

  const breakdown = input.latestSkillBreakdown ?? {};
  const skills = Object.entries(breakdown).filter(([, v]) => v > 0);

  let strongestSkill: string | null = null;
  let weakestSkill: string | null = null;
  if (skills.length > 0) {
    const sorted = [...skills].sort((a, b) => b[1] - a[1]);
    strongestSkill = sorted[0]?.[0] ?? null;
    weakestSkill = sorted[sorted.length - 1]?.[0] ?? null;
  }

  const readinessPercent =
    completed.length > 0
      ? avgLatest
      : input.tests.some((t) => t.isRecommendedForLearner)
        ? 15
        : 0;

  return {
    readinessPercent,
    readinessBand: deriveReadinessBand(readinessPercent),
    strongestSkill,
    weakestSkill,
    suggestedFocus: weakestSkill,
    recommendedLevelName: input.learnerLevelName,
    hasAnalytics: skills.length > 0 || completed.length > 0,
  };
}

export function deriveDetailReadiness(
  latestScorePercent: number | null
): { readinessPercent: number | null; readinessBand: MockReadinessBand | null } {
  if (latestScorePercent == null) {
    return { readinessPercent: null, readinessBand: null };
  }
  return {
    readinessPercent: latestScorePercent,
    readinessBand: deriveReadinessBand(latestScorePercent),
  };
}
