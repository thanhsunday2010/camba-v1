import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type {
  SpeakingAiEvaluationResult,
  SpeakingBandScore,
} from "@/lib/cambridge-assessment/cambridge-speaking-ai-contracts";
import { SPEAKING_DIMENSION_ORDER } from "@/lib/cambridge-assessment/cambridge-speaking-ai-contracts";
import type { CambridgeSpeakingGeminiResponse } from "@/lib/ai/speaking/cambridge-speaking-schema";
import { GEMINI_MODEL_VERSION } from "@/lib/ai/gemini-client";

const PROMPT_VERSION = "cambridge-speaking-v1";

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function buildSpeakingBandScore(
  level: CambridgeExamLevel,
  bandScore: number,
  overallScore: number
): SpeakingBandScore {
  if (level === "ket" || level === "pet") {
    const base = level === "ket" ? 120 : 140;
    const scaleScore =
      bandScore >= 100 && bandScore <= 170
        ? Math.round(bandScore)
        : Math.round(base + (overallScore / 100) * 30);
    return {
      model: "cambridge_scale",
      scaleScore: clamp(scaleScore, 100, 170),
      cefrBand: level === "ket" ? "a2" : "b1",
    };
  }

  const shields = clamp(Math.round(bandScore), 0, 5);
  return { model: "yle_shields", shields, maxShields: 5 };
}

export function parseCambridgeSpeakingGeminiResponse(
  raw: CambridgeSpeakingGeminiResponse,
  request: { requestId: string; level: CambridgeExamLevel }
): SpeakingAiEvaluationResult {
  const dimensionSet = new Set(raw.dimensions.map((d) => d.dimension));
  for (const required of SPEAKING_DIMENSION_ORDER) {
    if (!dimensionSet.has(required)) {
      throw new Error(`Missing dimension: ${required}`);
    }
  }

  const sortedDimensions = SPEAKING_DIMENSION_ORDER.map(
    (key) => raw.dimensions.find((d) => d.dimension === key)!
  );

  return {
    requestId: request.requestId,
    evaluatedAt: new Date().toISOString(),
    overallScore: clamp(Math.round(raw.overallScore), 0, 100),
    bandScore: buildSpeakingBandScore(request.level, raw.bandScore, raw.overallScore),
    dimensions: sortedDimensions,
    strengths: raw.strengths ?? [],
    weaknesses: raw.weaknesses ?? [],
    feedback: raw.feedback,
    transcript: raw.transcript,
    pipeline: {
      transcription: {
        transcript: raw.transcript,
        language: "en",
      },
      languageAnalysis: raw.languageAnalysis,
    },
    metadata: {
      modelId: GEMINI_MODEL_VERSION,
      promptVersion: PROMPT_VERSION,
    },
  };
}
