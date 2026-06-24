import { createClient } from "@/lib/supabase/server";
import { getMockTestHubViewModel } from "@/lib/mock-tests/mock-test-hub";
import {
  buildLevelCollections,
  buildReadinessFromHub,
  pickContinueMock,
  pickFeaturedMock,
  pickRecommendedMock,
  type MockCenterRecentResult,
  type MockCenterViewModel,
} from "@/lib/mock-tests/mock-center-utils";
import { getAchievementPreviewForMocks } from "@/lib/achievements/achievement-view-model";
import { deriveMockTestDisplayState } from "@/lib/mock-tests/mock-test-ui-utils";

async function getRecentMockResults(userId: string, limit = 5): Promise<MockCenterRecentResult[]> {
  const supabase = await createClient();

  const { data: attempts } = await supabase
    .from("mock_test_attempts")
    .select(
      "id, mock_test_id, score, max_score, completed_at, skill_breakdown, mock_tests(title, level_id)"
    )
    .eq("user_id", userId)
    .eq("is_completed", true)
    .order("completed_at", { ascending: false })
    .limit(limit);

  if (!attempts?.length) return [];

  const levelIds = [
    ...new Set(
      attempts
        .map((a) => (a.mock_tests as { level_id?: string } | null)?.level_id)
        .filter(Boolean)
    ),
  ] as string[];

  const levelMap = new Map<string, string>();
  if (levelIds.length > 0) {
    const { data: levels } = await supabase
      .from("levels")
      .select("id, name")
      .in("id", levelIds);
    for (const level of levels ?? []) {
      levelMap.set(level.id, level.name);
    }
  }

  return attempts.map((attempt) => {
    const mockMeta = attempt.mock_tests as { title?: string; level_id?: string } | null;
    const scorePercent =
      Number(attempt.max_score) > 0
        ? Math.round((Number(attempt.score) / Number(attempt.max_score)) * 100)
        : 0;
    const breakdown = (attempt.skill_breakdown as Record<string, number> | null) ?? {};
    const displayState = deriveMockTestDisplayState({
      attemptCount: 1,
      latestScorePercent: scorePercent,
      skillBreakdown: breakdown,
    });

    return {
      attemptId: attempt.id,
      mockTestId: attempt.mock_test_id,
      mockTitle: mockMeta?.title ?? "Mock test",
      levelName: mockMeta?.level_id ? levelMap.get(mockMeta.level_id) ?? null : null,
      scorePercent,
      completedAt: attempt.completed_at ?? new Date().toISOString(),
      writingScorePercent: breakdown.writing ?? null,
      speakingScorePercent: breakdown.speaking ?? null,
      displayState,
      detailHref: `/mock-tests/${attempt.mock_test_id}`,
    };
  });
}

async function getLatestSkillBreakdown(userId: string): Promise<Record<string, number> | null> {
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

export async function getMockCenterViewModel(userId: string): Promise<MockCenterViewModel> {
  const [hub, recentResults, latestSkillBreakdown, achievementPreview] = await Promise.all([
    getMockTestHubViewModel(userId),
    getRecentMockResults(userId),
    getLatestSkillBreakdown(userId),
    getAchievementPreviewForMocks(userId),
  ]);

  const readiness = buildReadinessFromHub({
    tests: hub.tests,
    learnerLevelName: hub.currentLearnerLevelName,
    latestSkillBreakdown,
  });

  return {
    hub,
    featuredMock: pickFeaturedMock(hub),
    continueMock: pickContinueMock(hub.tests),
    recommendedMock: pickRecommendedMock(hub.recommendedTests),
    goldMocks: hub.tests.filter((t) => t.isGoldMock),
    levelCollections: buildLevelCollections(hub.tests, hub.availableLevelBuckets),
    recentResults,
    readiness,
    achievementPreview,
  };
}
