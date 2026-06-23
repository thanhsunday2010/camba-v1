import type {
  MockTestAttemptSummary,
  MockTestDisplayState,
  MockTestHubSummary,
  MockTestRecommendationVariant,
  ResolvedMockTestProgress,
} from "@/lib/mock-tests/mock-test-types";

/** UI-only threshold — mirrors lesson review signal, not official Cambridge mastery */
export const MOCK_TEST_REVIEW_ACCURACY_THRESHOLD = 70;

export function scoreToPercent(score: number, maxScore: number): number {
  if (maxScore <= 0) return 0;
  return Math.round((score / maxScore) * 100);
}

export function needsReviewFromMockTestAttempt(
  scorePercent: number,
  skillBreakdown: Record<string, number>
): boolean {
  if (scorePercent > 0 && scorePercent < MOCK_TEST_REVIEW_ACCURACY_THRESHOLD) {
    return true;
  }
  return Object.values(skillBreakdown).some(
    (percent) => percent > 0 && percent < MOCK_TEST_REVIEW_ACCURACY_THRESHOLD
  );
}

export function getMockTestRecommendationVariant(
  scorePercent: number,
  needsReview: boolean
): MockTestRecommendationVariant {
  if (needsReview) return "needs-review";
  if (scorePercent >= 80) return "great-job";
  return "solid";
}

export function deriveMockTestDisplayState(input: {
  attemptCount: number;
  latestScorePercent: number | null;
  skillBreakdown?: Record<string, number>;
  hasInProgressAttempt?: boolean;
}): MockTestDisplayState {
  if (input.hasInProgressAttempt) return "in-progress";
  if (input.attemptCount <= 0) return "not-started";

  const breakdown = input.skillBreakdown ?? {};
  const latest = input.latestScorePercent ?? 0;
  if (needsReviewFromMockTestAttempt(latest, breakdown)) {
    return "needs-review";
  }
  return "completed";
}

export function buildMockTestAttemptSummary(input: {
  attemptId: string;
  score: number;
  maxScore: number;
  completedAt: string | null;
  timeSpentSeconds: number | null;
  skillBreakdown: Record<string, number>;
  shieldEstimate: Record<string, number>;
}): MockTestAttemptSummary {
  const scorePercent = scoreToPercent(input.score, input.maxScore);
  const needsReview = needsReviewFromMockTestAttempt(
    scorePercent,
    input.skillBreakdown
  );

  return {
    attemptId: input.attemptId,
    score: input.score,
    maxScore: input.maxScore,
    scorePercent,
    completedAt: input.completedAt,
    timeSpentSeconds: input.timeSpentSeconds,
    skillBreakdown: input.skillBreakdown,
    shieldEstimate: input.shieldEstimate,
    needsReview,
    recommendationVariant: getMockTestRecommendationVariant(scorePercent, needsReview),
  };
}

export function getWeakSkillsFromBreakdown(
  skillBreakdown: Record<string, number>,
  threshold = MOCK_TEST_REVIEW_ACCURACY_THRESHOLD
): string[] {
  return Object.entries(skillBreakdown)
    .filter(([, percent]) => percent > 0 && percent < threshold)
    .sort((a, b) => a[1] - b[1])
    .map(([skill]) => skill);
}

export function mockTestDisplayStateToVisualState(
  state: MockTestDisplayState
): "unlocked" | "in-progress" | "completed" | "needs-review" {
  switch (state) {
    case "not-started":
      return "unlocked";
    case "in-progress":
      return "in-progress";
    case "completed":
      return "completed";
    case "needs-review":
      return "needs-review";
  }
}

export function filterHubSummariesByDisplayState(
  tests: MockTestHubSummary[],
  filter: MockTestDisplayState | "all"
): MockTestHubSummary[] {
  if (filter === "all") return tests;
  return tests.filter((t) => t.displayState === filter);
}

export function deriveResolvedMockTestProgress(input: {
  totalQuestions: number;
  currentQuestionIndex: number;
  answers: Record<string, unknown>;
  isTestCompleteResolved: boolean;
  currentSectionTitle?: string | null;
  currentSectionId?: string | null;
}): ResolvedMockTestProgress {
  const answeredCount = Object.keys(input.answers).length;
  const completionPercent =
    input.totalQuestions > 0
      ? Math.round(
          ((input.isTestCompleteResolved
            ? input.totalQuestions
            : answeredCount) /
            input.totalQuestions) *
            100
        )
      : 0;

  return {
    totalQuestions: input.totalQuestions,
    currentQuestionIndex: input.currentQuestionIndex,
    answeredCount,
    completionPercent: input.isTestCompleteResolved ? 100 : completionPercent,
    isTestCompleteResolved: input.isTestCompleteResolved,
    currentSectionTitle: input.currentSectionTitle ?? null,
    currentSectionId: input.currentSectionId ?? null,
  };
}

export function getWeakQuestionIdsForSkill(
  questions: Array<{ id: string; skillName: string | null; skillSlug: string | null }>,
  skill: string
): string[] {
  const normalized = skill.toLowerCase();
  return questions
    .filter((q) => {
      const name = q.skillName?.toLowerCase();
      const slug = q.skillSlug?.toLowerCase();
      return name === normalized || slug === normalized || name?.includes(normalized);
    })
    .map((q) => q.id);
}
