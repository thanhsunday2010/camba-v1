"use server";

import { createClient } from "@/lib/supabase/server";
import { requireSessionUser } from "@/lib/auth/session";
import type { Json } from "@/types/database";
import type { WritingEvaluationEnvelope } from "@/lib/writing/writing-evaluation-types";
import type { WritingEvaluationResult } from "@/lib/writing/writing-evaluation-types";
import { GEMINI_MODEL_VERSION } from "@/lib/ai/gemini-client";

export type PersistWritingEvaluationInput = {
  attemptType: "exercise_attempt" | "mock_test_attempt";
  attemptId: string;
  questionId: string;
  prompt: string;
  responseText: string;
  wordCount: number;
  taskType?: string;
  level?: string;
  envelope: WritingEvaluationEnvelope;
};

/**
 * Persistence decision (M2.2):
 * - Primary: evaluation embedded in attempt `answers` JSON (reload-friendly, no migration).
 * - Secondary: `ai_feedback` row for analytics/history/recommendations (existing table).
 */
export async function persistWritingEvaluationRecord(
  input: PersistWritingEvaluationInput
): Promise<void> {
  if (input.envelope.status !== "completed" || !input.envelope.result) return;

  const user = await requireSessionUser();
  const supabase = await createClient();
  const result = input.envelope.result;

  await supabase.from("ai_feedback").insert({
    user_id: user.id,
    feedback_type: "writing",
    reference_type: input.attemptType,
    reference_id: input.attemptId,
    model_version: input.envelope.modelVersion ?? GEMINI_MODEL_VERSION,
    input_data: {
      questionId: input.questionId,
      prompt: input.prompt,
      responseText: input.responseText,
      wordCount: input.wordCount,
      taskType: input.taskType,
      level: input.level,
    } as Json,
    response_data: result as unknown as Json,
    shield_estimate: bandScoreToShieldEstimate(result) as Json,
  });
}

function bandScoreToShieldEstimate(result: WritingEvaluationResult): Record<string, number> {
  const band = result.bandScore;
  if (band.model === "yle_shields") {
    return { writing: band.shields };
  }
  if (band.model === "cambridge_scale") {
    return { writing: result.overallScore, scaleScore: band.scaleScore };
  }
  return { writing: result.overallScore };
}

export async function persistWritingEvaluationsForAttempt(
  inputs: PersistWritingEvaluationInput[]
): Promise<void> {
  for (const input of inputs) {
    try {
      await persistWritingEvaluationRecord(input);
    } catch (error) {
      console.error("Failed to persist writing evaluation:", input.questionId, error);
    }
  }
}
