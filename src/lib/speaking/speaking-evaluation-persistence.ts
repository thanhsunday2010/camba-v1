"use server";

import { createClient } from "@/lib/supabase/server";
import { requireSessionUser } from "@/lib/auth/session";
import type { Json } from "@/types/database";
import type { SpeakingEvaluationEnvelope } from "@/lib/speaking/speaking-evaluation-types";
import type { SpeakingEvaluationResult } from "@/lib/speaking/speaking-evaluation-types";
import { GEMINI_MODEL_VERSION } from "@/lib/ai/gemini-client";

export type PersistSpeakingEvaluationInput = {
  attemptType: "exercise_attempt" | "mock_test_attempt";
  attemptId: string;
  questionId: string;
  prompt: string;
  audioRef: string;
  durationSeconds: number;
  taskType?: string;
  level?: string;
  envelope: SpeakingEvaluationEnvelope;
};

/**
 * Persistence decision (M2.3):
 * - Primary: evaluation + audioRef embedded in attempt `answers` JSON.
 * - Secondary: `ai_feedback` row for analytics/history (existing table).
 * - Audio binary: Supabase `speaking-audio` bucket via audioRef path.
 */
export async function persistSpeakingEvaluationRecord(
  input: PersistSpeakingEvaluationInput
): Promise<void> {
  if (input.envelope.status !== "completed" || !input.envelope.result) return;

  const user = await requireSessionUser();
  const supabase = await createClient();
  const result = input.envelope.result;

  await supabase.from("ai_feedback").insert({
    user_id: user.id,
    feedback_type: "speaking",
    reference_type: input.attemptType,
    reference_id: input.attemptId,
    model_version: input.envelope.modelVersion ?? GEMINI_MODEL_VERSION,
    input_data: {
      questionId: input.questionId,
      prompt: input.prompt,
      audioRef: input.audioRef,
      durationSeconds: input.durationSeconds,
      taskType: input.taskType,
      level: input.level,
    } as Json,
    response_data: result as unknown as Json,
    shield_estimate: bandScoreToShieldEstimate(result) as Json,
  });
}

function bandScoreToShieldEstimate(result: SpeakingEvaluationResult): Record<string, number> {
  const band = result.bandScore;
  if (band.model === "yle_shields") {
    return { speaking: band.shields };
  }
  if (band.model === "cambridge_scale") {
    return { speaking: result.overallScore, scaleScore: band.scaleScore };
  }
  return { speaking: result.overallScore };
}

export async function persistSpeakingEvaluationsForAttempt(
  inputs: PersistSpeakingEvaluationInput[]
): Promise<void> {
  for (const input of inputs) {
    try {
      await persistSpeakingEvaluationRecord(input);
    } catch (error) {
      console.error("Failed to persist speaking evaluation:", input.questionId, error);
    }
  }
}
