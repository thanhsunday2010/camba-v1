"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { scoreExercise } from "@/lib/learning/scoring";
import {
  hasCambridgeAiEvaluatedQuestions,
  mergeMockTestCambridgeAiScores,
  runCambridgeAiEvaluationPipeline,
  serializeCambridgeAiAnswersForAttempt,
} from "@/lib/learning/cambridge-ai-evaluation-pipeline";
import { persistWritingEvaluationsForAttempt } from "@/lib/writing/writing-evaluation-persistence";
import { persistSpeakingEvaluationsForAttempt } from "@/lib/speaking/speaking-evaluation-persistence";
import { generateRecommendationsFromFeedback } from "@/lib/ai/recommendations-engine";
import {
  computeShieldEstimate,
  computeSkillBreakdown,
} from "@/lib/learning/mock-test-scoring";
import { fetchMockTestByIdFull, getMockTestById, getMockTestsForUser } from "@/lib/queries/mock-tests";
import { mergeSkillShields, DEFAULT_SHIELD_SCALE_MAX } from "@/lib/learning/shields";
import { getShieldScaleMax } from "@/lib/programs/settings";
import { resolveProgramId } from "@/lib/programs/context";
import { onMockTestCompleted } from "@/lib/gamification/events";
import { getAuthUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types";
import type { Json } from "@/types/database";
import type {
  MockTestData,
  MockTestResult,
  MockTestSummary,
  QuestionResult,
  UserAnswer,
} from "@/types/learning";

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

function serializeMockTestResult(result: {
  score: number;
  maxScore: number;
  accuracyPercent: number;
  skillBreakdown: Record<string, number>;
  shieldEstimate: Record<string, number>;
  questionResults: QuestionResult[];
  answers?: Record<string, UserAnswer>;
}): MockTestResult {
  return JSON.parse(
    JSON.stringify({
      score: result.score,
      maxScore: result.maxScore,
      accuracyPercent: result.accuracyPercent,
      skillBreakdown: result.skillBreakdown,
      shieldEstimate: result.shieldEstimate,
      questionResults: result.questionResults.map((r) => ({
        questionId: r.questionId,
        isCorrect: r.isCorrect,
        pointsEarned: r.pointsEarned,
        maxPoints: r.maxPoints,
        explanation: r.explanation ?? null,
        ...(r.correctChoiceId != null ? { correctChoiceId: r.correctChoiceId } : {}),
        ...(r.correctChoiceIds != null ? { correctChoiceIds: r.correctChoiceIds } : {}),
        ...(r.correctPairs != null ? { correctPairs: r.correctPairs } : {}),
        ...(r.correctAnswers != null ? { correctAnswers: r.correctAnswers } : {}),
        ...(r.correctOrder != null ? { correctOrder: r.correctOrder } : {}),
      })),
      ...(result.answers ? { answers: result.answers } : {}),
    })
  ) as MockTestResult;
}

async function runPostMockTestSubmitWork(input: {
  userId: string;
  testId: string;
  levelId: string | null;
  shieldEstimate: Record<string, number>;
  maxShields: number;
}): Promise<void> {
  const supabase = await createClient();

  if (input.levelId && Object.keys(input.shieldEstimate).length > 0) {
    const { data: gamification } = await supabase
      .from("user_gamification")
      .select("shield_progress")
      .eq("user_id", input.userId)
      .single();

    const existing = (gamification?.shield_progress as Record<string, number>) ?? {};
    const merged = mergeSkillShields(existing, input.shieldEstimate, input.maxShields);

    await supabase
      .from("user_gamification")
      .update({ shield_progress: merged as Json })
      .eq("user_id", input.userId);
  }

  await onMockTestCompleted(input.userId, input.testId);

  revalidatePath("/mock-tests");
  revalidatePath("/dashboard");
  revalidatePath(`/mock-tests/${input.testId}`);
  revalidatePath(`/mock-tests/${input.testId}/take`);
}

export async function submitMockTest(
  testId: string,
  answers: Record<string, UserAnswer>,
  timeSpentSeconds: number
): Promise<ActionResult<MockTestResult>> {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const supabase = await createClient();
    const test = await fetchMockTestByIdFull(testId);
    if (!test) return { success: false, error: "Mock test not found" };

    const allQuestions = test.sections.flatMap((s) => s.questions);
    if (allQuestions.length === 0) {
      return { success: false, error: "No questions in this test" };
    }

    const normalizedAnswers = serializeCambridgeAiAnswersForAttempt(answers);
    const baseResult = scoreExercise(allQuestions, normalizedAnswers);

    const aiPipeline = hasCambridgeAiEvaluatedQuestions(allQuestions)
      ? await runCambridgeAiEvaluationPipeline({
          questions: allQuestions,
          answers: normalizedAnswers,
          level: test.levelName ?? undefined,
        })
      : null;

    const result = aiPipeline
      ? {
          score: aiPipeline.score,
          maxScore: aiPipeline.maxScore,
          accuracyPercent: aiPipeline.accuracyPercent,
          questionResults: aiPipeline.questionResults,
        }
      : baseResult;

    const answersToStore = aiPipeline?.enrichedAnswers ?? normalizedAnswers;

    let maxShields = DEFAULT_SHIELD_SCALE_MAX;
    try {
      const programId = await resolveProgramId(user.id);
      if (programId) {
        maxShields = await getShieldScaleMax(programId);
      }
    } catch (error) {
      console.error("Mock test shield scale lookup failed, using default:", error);
    }

    const skillBreakdown = mergeMockTestCambridgeAiScores(
      test.sections,
      answersToStore,
      computeSkillBreakdown(test.sections, result.questionResults)
    );
    const shieldEstimate = computeShieldEstimate(skillBreakdown, maxShields);
    const levelId = test.levelId;
    const userId = user.id;

    const { data: attemptRow, error: attemptError } = await supabase
      .from("mock_test_attempts")
      .insert({
      user_id: userId,
      mock_test_id: testId,
      score: result.score,
      max_score: result.maxScore,
      estimated_level_id: levelId,
      shield_estimate: shieldEstimate as Json,
      skill_breakdown: skillBreakdown as Json,
      answers: answersToStore as unknown as Json,
      time_spent_seconds: timeSpentSeconds,
      is_completed: true,
      completed_at: new Date().toISOString(),
    })
      .select("id")
      .single();

    if (attemptError || !attemptRow) {
      return { success: false, error: attemptError?.message ?? "Submit failed" };
    }

    const postSubmitInput = {
      userId,
      testId,
      levelId,
      shieldEstimate: { ...shieldEstimate },
      maxShields,
    };

    after(async () => {
      try {
        if (aiPipeline) {
          await persistWritingEvaluationsForAttempt(
            aiPipeline.writingPersistence.map((p) => ({
              ...p,
              attemptType: "mock_test_attempt" as const,
              attemptId: attemptRow.id,
            }))
          );
          await persistSpeakingEvaluationsForAttempt(
            aiPipeline.speakingPersistence.map((p) => ({
              ...p,
              attemptType: "mock_test_attempt" as const,
              attemptId: attemptRow.id,
            }))
          );
          if (aiPipeline.analyticsWeaknesses.length) {
            await generateRecommendationsFromFeedback(userId, aiPipeline.analyticsWeaknesses);
          }
        }
        await runPostMockTestSubmitWork(postSubmitInput);
      } catch (error) {
        console.error("Post-mock-test submit gamification failed:", error);
      }
    });

    return {
      success: true,
      data: serializeMockTestResult({
        score: result.score,
        maxScore: result.maxScore,
        accuracyPercent: result.accuracyPercent,
        skillBreakdown,
        shieldEstimate,
        questionResults: result.questionResults,
        answers: answersToStore,
      }),
    };
  } catch (error) {
    console.error("submitMockTest failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Submit failed",
    };
  }
}
