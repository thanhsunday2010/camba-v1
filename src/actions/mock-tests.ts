"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { scoreExercise } from "@/lib/learning/scoring";
import {
  computeShieldEstimate,
  computeSkillBreakdown,
} from "@/lib/learning/mock-test-scoring";
import { fetchMockTestByIdFull, getMockTestById, getMockTestsForUser } from "@/lib/queries/mock-tests";
import { mergeSkillShields } from "@/lib/learning/shields";
import { getShieldScaleMax } from "@/lib/programs/settings";
import { resolveProgramId } from "@/lib/programs/context";
import { onMockTestCompleted } from "@/lib/gamification/events";
import type { ActionResult } from "@/types";
import type { Json } from "@/types/database";
import type { MockTestData, MockTestResult, MockTestSummary, UserAnswer } from "@/types/learning";

export async function getMockTestsList(): Promise<MockTestSummary[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  return getMockTestsForUser(user.id);
}

export async function getMockTestData(testId: string): Promise<MockTestData | null> {
  return getMockTestById(testId);
}

export async function submitMockTest(
  testId: string,
  answers: Record<string, UserAnswer>,
  timeSpentSeconds: number
): Promise<ActionResult<MockTestResult>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const test = await fetchMockTestByIdFull(testId);
  if (!test) return { success: false, error: "Mock test not found" };

  const allQuestions = test.sections.flatMap((s) => s.questions);
  if (allQuestions.length === 0) {
    return { success: false, error: "No questions in this test" };
  }

  const result = scoreExercise(allQuestions, answers);
  const programId = await resolveProgramId(user.id);
  const maxShields = programId ? await getShieldScaleMax(programId) : 15;
  const skillBreakdown = computeSkillBreakdown(test.sections, result.questionResults);
  const shieldEstimate = computeShieldEstimate(skillBreakdown, maxShields);

  const { error: attemptError } = await supabase.from("mock_test_attempts").insert({
    user_id: user.id,
    mock_test_id: testId,
    score: result.score,
    max_score: result.maxScore,
    estimated_level_id: test.levelId,
    shield_estimate: shieldEstimate as Json,
    skill_breakdown: skillBreakdown as Json,
    answers: answers as unknown as Json,
    time_spent_seconds: timeSpentSeconds,
    is_completed: true,
    completed_at: new Date().toISOString(),
  });

  if (attemptError) {
    return { success: false, error: attemptError.message };
  }

  if (test.levelId && Object.keys(shieldEstimate).length > 0) {
    const { data: gamification } = await supabase
      .from("user_gamification")
      .select("shield_progress")
      .eq("user_id", user.id)
      .single();

    const existing = (gamification?.shield_progress as Record<string, number>) ?? {};
    const merged = mergeSkillShields(existing, shieldEstimate, maxShields);

    await supabase
      .from("user_gamification")
      .update({ shield_progress: merged as Json })
      .eq("user_id", user.id);
  }

  await onMockTestCompleted(user.id, testId);

  revalidatePath("/mock-tests");
  revalidatePath("/dashboard");
  revalidatePath(`/mock-tests/${testId}`);
  revalidatePath(`/mock-tests/${testId}/take`);

  return {
    success: true,
    data: {
      score: result.score,
      maxScore: result.maxScore,
      accuracyPercent: result.accuracyPercent,
      skillBreakdown,
      shieldEstimate,
      questionResults: result.questionResults,
    },
  };
}
