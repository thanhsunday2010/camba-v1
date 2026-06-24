import type { SpeakingAiEvaluationRequest } from "@/lib/cambridge-assessment/cambridge-speaking-ai-contracts";
import { SPEAKING_DIMENSION_ORDER } from "@/lib/cambridge-assessment/cambridge-speaking-ai-contracts";
import type { SpeakingEvaluationEnvelope } from "@/lib/speaking/speaking-evaluation-types";
import { CambridgeSpeakingGeminiResponseSchema } from "@/lib/ai/speaking/cambridge-speaking-schema";
import { parseCambridgeSpeakingGeminiResponse } from "@/lib/ai/speaking/cambridge-speaking-parser";
import {
  SPEAKING_EVALUATION_MAX_RETRIES,
  SPEAKING_EVALUATION_TIMEOUT_MS,
  SPEAKING_MAX_DURATION_SECONDS,
} from "@/lib/speaking/speaking-submission";

export { SPEAKING_EVALUATION_MAX_RETRIES, SPEAKING_EVALUATION_TIMEOUT_MS };

export type SpeakingEvaluationValidationIssue = {
  code: string;
  message: string;
};

export function assertSpeakingEvaluationAllowed(request: SpeakingAiEvaluationRequest): void {
  if (request.audio.durationSeconds > SPEAKING_MAX_DURATION_SECONDS) {
    throw new Error(`Recording exceeds ${SPEAKING_MAX_DURATION_SECONDS} seconds`);
  }
  if (!request.audio.audioRef.trim()) {
    throw new Error("Audio reference is required");
  }
}

export function validateSpeakingEvaluationEnvelope(
  envelope: SpeakingEvaluationEnvelope | null | undefined
): SpeakingEvaluationValidationIssue[] {
  const issues: SpeakingEvaluationValidationIssue[] = [];
  if (!envelope) {
    issues.push({ code: "EVALUATION_MISSING", message: "No evaluation envelope" });
    return issues;
  }

  if (envelope.status === "failed" && !envelope.errorMessage) {
    issues.push({ code: "EVALUATION_ERROR_MISSING", message: "Failed evaluation lacks error message" });
  }

  if (envelope.status === "completed") {
    if (!envelope.result) {
      issues.push({ code: "EVALUATION_RESULT_MISSING", message: "Completed evaluation lacks result" });
      return issues;
    }
    issues.push(...validateSpeakingEvaluationResult(envelope.result));
  }

  return issues;
}

export function validateSpeakingEvaluationResult(
  result: NonNullable<SpeakingEvaluationEnvelope["result"]>
): SpeakingEvaluationValidationIssue[] {
  const issues: SpeakingEvaluationValidationIssue[] = [];

  if (result.overallScore < 0 || result.overallScore > 100) {
    issues.push({ code: "OVERALL_SCORE_RANGE", message: "overallScore must be 0–100" });
  }

  if (!result.transcript.trim()) {
    issues.push({ code: "TRANSCRIPT_EMPTY", message: "Transcript is required" });
  }

  if (result.dimensions.length !== SPEAKING_DIMENSION_ORDER.length) {
    issues.push({
      code: "DIMENSION_COUNT",
      message: `Expected ${SPEAKING_DIMENSION_ORDER.length} dimensions`,
    });
  }

  return issues;
}

export function validateGeminiSpeakingResponse(raw: unknown): SpeakingEvaluationValidationIssue[] {
  const parsed = CambridgeSpeakingGeminiResponseSchema.safeParse(raw);
  if (!parsed.success) {
    return parsed.error.issues.map((i) => ({
      code: "GEMINI_SCHEMA",
      message: i.message,
    }));
  }
  return [];
}

export function parseAndValidateGeminiSpeakingResponse(
  raw: unknown,
  context: { requestId: string; level: "starters" | "movers" | "flyers" | "ket" | "pet" }
) {
  const schemaIssues = validateGeminiSpeakingResponse(raw);
  if (schemaIssues.length > 0) {
    throw new Error(schemaIssues.map((i) => i.message).join("; "));
  }
  return parseCambridgeSpeakingGeminiResponse(
    CambridgeSpeakingGeminiResponseSchema.parse(raw),
    context
  );
}
