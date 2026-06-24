import { createClient } from "@/lib/supabase/server";
import { fetchMockTestByIdFull, getLatestMockTestAttemptDetail } from "@/lib/queries/mock-tests";
import { buildMockTestSkillAnalyticsFromAttempt } from "@/lib/mock-tests/mock-test-skill-analytics-builder";
import { scoreExercise } from "@/lib/learning/scoring";
import type { UserAnswer } from "@/types/learning";
import type { SkillProgressRow } from "@/lib/queries/dashboard";

export type DashboardSkillInsightsView = {
  grammarStrengths: string[];
  grammarWeaknesses: string[];
  vocabularyStrengths: string[];
  vocabularyWeaknesses: string[];
  skillStrengths: string[];
  skillWeaknesses: string[];
  hasAnalytics: boolean;
  detailHref: string;
};

export function buildSkillInsightsFromSnapshot(
  skills: SkillProgressRow[],
  labels: { strong: string; focus: string },
  thresholdStrong = 65,
  thresholdWeak = 45
): Pick<DashboardSkillInsightsView, "skillStrengths" | "skillWeaknesses"> {
  const skillStrengths = skills
    .filter((s) => s.progressPercent >= thresholdStrong)
    .sort((a, b) => b.progressPercent - a.progressPercent)
    .slice(0, 3)
    .map((s) => s.name);

  const skillWeaknesses = skills
    .filter((s) => s.progressPercent < thresholdWeak)
    .sort((a, b) => a.progressPercent - b.progressPercent)
    .slice(0, 3)
    .map((s) => s.name);

  return { skillStrengths, skillWeaknesses };
}

export async function getDashboardSkillInsights(
  userId: string,
  skillSnapshot: SkillProgressRow[],
  labels: { strong: string; focus: string }
): Promise<DashboardSkillInsightsView> {
  const fromSnapshot = buildSkillInsightsFromSnapshot(skillSnapshot, labels);
  const emptyFallback: DashboardSkillInsightsView = {
    grammarStrengths: [],
    grammarWeaknesses: [],
    vocabularyStrengths: [],
    vocabularyWeaknesses: [],
    ...fromSnapshot,
    hasAnalytics:
      fromSnapshot.skillStrengths.length > 0 || fromSnapshot.skillWeaknesses.length > 0,
    detailHref: "/learning",
  };

  const supabase = await createClient();
  const { data: latestAttemptRow } = await supabase
    .from("mock_test_attempts")
    .select("mock_test_id")
    .eq("user_id", userId)
    .eq("is_completed", true)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latestAttemptRow?.mock_test_id) {
    return emptyFallback;
  }

  const mockTestId = latestAttemptRow.mock_test_id;
  const [fullTest, attemptDetail] = await Promise.all([
    fetchMockTestByIdFull(mockTestId),
    getLatestMockTestAttemptDetail(userId, mockTestId),
  ]);

  if (!fullTest || !attemptDetail || Object.keys(attemptDetail.answers).length === 0) {
    return {
      ...emptyFallback,
      detailHref: `/mock-tests/${mockTestId}`,
    };
  }

  const flatQuestions = fullTest.sections.flatMap((section) => section.questions);
  const analytics = buildMockTestSkillAnalyticsFromAttempt(
    flatQuestions,
    scoreExercise(flatQuestions, attemptDetail.answers as Record<string, UserAnswer>)
      .questionResults
  );

  return {
    grammarStrengths: analytics.grammarStrengths.map((g) => g.label),
    grammarWeaknesses: analytics.grammarWeaknesses.map((g) => g.label),
    vocabularyStrengths: analytics.vocabularyStrengths.map((v) => v.label),
    vocabularyWeaknesses: analytics.vocabularyWeaknesses.map((v) => v.label),
    ...fromSnapshot,
    hasAnalytics: analytics.hasData || fromSnapshot.skillStrengths.length > 0,
    detailHref: `/mock-tests/${mockTestId}`,
  };
}
