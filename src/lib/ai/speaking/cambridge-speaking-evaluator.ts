import type { SpeakingAiEvaluationRequest } from "@/lib/cambridge-assessment/cambridge-speaking-ai-contracts";
import type { SpeakingAiEvaluationResult } from "@/lib/cambridge-assessment/cambridge-speaking-ai-contracts";
import { generateJsonWithAudioWithRetry } from "@/lib/ai/gemini-client";
import { parseGeminiJson } from "@/lib/ai/parse-feedback";
import {
  CAMBRIDGE_SPEAKING_EVAL_SYSTEM,
  buildCambridgeSpeakingEvalPrompt,
} from "@/lib/ai/speaking/cambridge-speaking-prompts";
import { parseCambridgeSpeakingGeminiResponse } from "@/lib/ai/speaking/cambridge-speaking-parser";
import { CambridgeSpeakingGeminiResponseSchema } from "@/lib/ai/speaking/cambridge-speaking-schema";
import { assertSpeakingEvaluationAllowed } from "@/lib/speaking/speaking-evaluation-validation";

export class SpeakingEvaluationError extends Error {
  constructor(
    message: string,
    readonly code: "DURATION_LIMIT" | "EMPTY_AUDIO" | "PARSE_ERROR" | "API_ERROR"
  ) {
    super(message);
    this.name = "SpeakingEvaluationError";
  }
}

export async function evaluateCambridgeSpeaking(
  request: SpeakingAiEvaluationRequest,
  audioBase64: string
): Promise<SpeakingAiEvaluationResult> {
  assertSpeakingEvaluationAllowed(request);

  if (!audioBase64.trim()) {
    throw new SpeakingEvaluationError("Empty audio payload", "EMPTY_AUDIO");
  }

  try {
    const rawJson = await generateJsonWithAudioWithRetry(
      CAMBRIDGE_SPEAKING_EVAL_SYSTEM,
      buildCambridgeSpeakingEvalPrompt(request),
      audioBase64,
      request.audio.mimeType
    );

    const parsed = parseGeminiJson(rawJson, CambridgeSpeakingGeminiResponseSchema);

    return parseCambridgeSpeakingGeminiResponse(parsed, {
      requestId: request.requestId,
      level: request.level,
    });
  } catch (error) {
    if (error instanceof SpeakingEvaluationError) throw error;
    throw new SpeakingEvaluationError(
      error instanceof Error ? error.message : "Gemini speaking evaluation failed",
      error instanceof Error && error.message.includes("JSON") ? "PARSE_ERROR" : "API_ERROR"
    );
  }
}

export const cambridgeSpeakingEvaluator = {
  async evaluate(
    request: SpeakingAiEvaluationRequest,
    audioBase64: string
  ): Promise<SpeakingAiEvaluationResult> {
    return evaluateCambridgeSpeaking(request, audioBase64);
  },
};
