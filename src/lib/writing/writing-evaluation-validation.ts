import type { WritingAiEvaluationRequest } from "@/lib/cambridge-assessment/cambridge-writing-ai-contracts";
import { WRITING_DIMENSION_ORDER } from "@/lib/cambridge-assessment/cambridge-writing-ai-contracts";
import type { WritingEvaluationEnvelope } from "@/lib/writing/writing-evaluation-types";
import { CambridgeWritingGeminiResponseSchema } from "@/lib/ai/writing/cambridge-writing-schema";
import { parseCambridgeWritingGeminiResponse } from "@/lib/ai/writing/cambridge-writing-parser";

export const WRITING_EVALUATION_MAX_WORDS = 500;
export const WRITING_EVALUATION_MAX_RETRIES = 2;
export const WRITING_EVALUATION_TIMEOUT_MS = 30_000;

export type WritingEvaluationValidationIssue = {
  code: string;
  message: string;
};

export function assertWritingEvaluationAllowed(request: WritingAiEvaluationRequest): void {
  const words = request.learnerResponse.trim().split(/\s+/).filter(Boolean).length;
  if (words > WRITING_EVALUATION_MAX_WORDS) {
    throw new Error(`Writing response exceeds ${WRITING_EVALUATION_MAX_WORDS} words`);
  }
  if (request.constraints?.maxWords != null && words > request.constraints.maxWords) {
    throw new Error(`Writing response exceeds task max of ${request.constraints.maxWords} words`);
  }
}

export function validateWritingEvaluationEnvelope(
  envelope: WritingEvaluationEnvelope | null | undefined
): WritingEvaluationValidationIssue[] {
  const issues: WritingEvaluationValidationIssue[] = [];
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
    issues.push(...validateWritingEvaluationResult(envelope.result));
  }

  return issues;
}

export function validateWritingEvaluationResult(
  result: NonNullable<WritingEvaluationEnvelope["result"]>
): WritingEvaluationValidationIssue[] {
  const issues: WritingEvaluationValidationIssue[] = [];

  if (result.overallScore < 0 || result.overallScore > 100) {
    issues.push({ code: "OVERALL_SCORE_RANGE", message: "overallScore must be 0–100" });
  }

  if (result.dimensions.length !== WRITING_DIMENSION_ORDER.length) {
    issues.push({
      code: "DIMENSION_COUNT",
      message: `Expected ${WRITING_DIMENSION_ORDER.length} dimensions`,
    });
  }

  for (const required of WRITING_DIMENSION_ORDER) {
    if (!result.dimensions.some((d) => d.dimension === required)) {
      issues.push({ code: "DIMENSION_MISSING", message: `Missing dimension: ${required}` });
    }
  }

  if (!result.feedback.trim()) {
    issues.push({ code: "FEEDBACK_EMPTY", message: "Feedback summary is required" });
  }

  return issues;
}

export function validateGeminiWritingResponse(raw: unknown): WritingEvaluationValidationIssue[] {
  const parsed = CambridgeWritingGeminiResponseSchema.safeParse(raw);
  if (!parsed.success) {
    return parsed.error.issues.map((i) => ({
      code: "GEMINI_SCHEMA",
      message: i.message,
    }));
  }
  return [];
}

export function parseAndValidateGeminiWritingResponse(
  raw: unknown,
  context: { requestId: string; level: "starters" | "movers" | "flyers" | "ket" | "pet"; wordCount?: number }
) {
  const schemaIssues = validateGeminiWritingResponse(raw);
  if (schemaIssues.length > 0) {
    throw new Error(schemaIssues.map((i) => i.message).join("; "));
  }
  return parseCambridgeWritingGeminiResponse(
    CambridgeWritingGeminiResponseSchema.parse(raw),
    context
  );
}
