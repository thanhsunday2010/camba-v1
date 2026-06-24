import type { CambridgeWritingAiEvaluator } from "@/lib/cambridge-assessment/cambridge-writing-ai-contracts";
import type { WritingAiEvaluationRequest } from "@/lib/cambridge-assessment/cambridge-writing-ai-contracts";
import type { WritingAiEvaluationResult } from "@/lib/cambridge-assessment/cambridge-writing-ai-contracts";
import { generateJsonResponseWithRetry } from "@/lib/ai/gemini-client";
import { parseGeminiJson } from "@/lib/ai/parse-feedback";
import {
  CAMBRIDGE_WRITING_EVAL_SYSTEM,
  buildCambridgeWritingEvalPrompt,
} from "@/lib/ai/writing/cambridge-writing-prompts";
import { parseCambridgeWritingGeminiResponse } from "@/lib/ai/writing/cambridge-writing-parser";
import { CambridgeWritingGeminiResponseSchema } from "@/lib/ai/writing/cambridge-writing-schema";
import {
  assertWritingEvaluationAllowed,
  WRITING_EVALUATION_MAX_WORDS,
} from "@/lib/writing/writing-evaluation-validation";

export class WritingEvaluationError extends Error {
  constructor(
    message: string,
    readonly code: "WORD_LIMIT" | "EMPTY_RESPONSE" | "PARSE_ERROR" | "API_ERROR"
  ) {
    super(message);
    this.name = "WritingEvaluationError";
  }
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export const cambridgeWritingEvaluator: CambridgeWritingAiEvaluator = {
  async evaluate(request: WritingAiEvaluationRequest): Promise<WritingAiEvaluationResult> {
    return evaluateCambridgeWriting(request);
  },
};

export async function evaluateCambridgeWriting(
  request: WritingAiEvaluationRequest
): Promise<WritingAiEvaluationResult> {
  assertWritingEvaluationAllowed(request);

  const wordCount = countWords(request.learnerResponse);
  if (wordCount > WRITING_EVALUATION_MAX_WORDS) {
    throw new WritingEvaluationError(
      `Response exceeds ${WRITING_EVALUATION_MAX_WORDS} words`,
      "WORD_LIMIT"
    );
  }

  if (!request.learnerResponse.trim()) {
    throw new WritingEvaluationError("Empty writing response", "EMPTY_RESPONSE");
  }

  try {
    const rawJson = await generateJsonResponseWithRetry(
      CAMBRIDGE_WRITING_EVAL_SYSTEM,
      buildCambridgeWritingEvalPrompt(request)
    );

    const parsed = parseGeminiJson(rawJson, CambridgeWritingGeminiResponseSchema);

    return parseCambridgeWritingGeminiResponse(parsed, {
      requestId: request.requestId,
      level: request.level,
      wordCount,
    });
  } catch (error) {
    if (error instanceof WritingEvaluationError) throw error;
    throw new WritingEvaluationError(
      error instanceof Error ? error.message : "Gemini evaluation failed",
      error instanceof Error && error.message.includes("JSON") ? "PARSE_ERROR" : "API_ERROR"
    );
  }
}
