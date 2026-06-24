import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type {
  WritingAiEvaluationResult,
  WritingBandScore,
} from "@/lib/cambridge-assessment/cambridge-writing-ai-contracts";
import { WRITING_DIMENSION_ORDER } from "@/lib/cambridge-assessment/cambridge-writing-ai-contracts";
import type { CambridgeWritingGeminiResponse } from "@/lib/ai/writing/cambridge-writing-schema";
import { GEMINI_MODEL_VERSION } from "@/lib/ai/gemini-client";

const PROMPT_VERSION = "cambridge-writing-v1";

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function buildBandScore(
  level: CambridgeExamLevel,
  bandScore: number,
  overallScore: number
): WritingBandScore {
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

export function parseCambridgeWritingGeminiResponse(
  raw: CambridgeWritingGeminiResponse,
  request: {
    requestId: string;
    level: CambridgeExamLevel;
    wordCount?: number;
  }
): WritingAiEvaluationResult {
  const dimensionSet = new Set(raw.dimensions.map((d) => d.dimension));
  for (const required of WRITING_DIMENSION_ORDER) {
    if (!dimensionSet.has(required)) {
      throw new Error(`Missing dimension: ${required}`);
    }
  }

  const sortedDimensions = WRITING_DIMENSION_ORDER.map(
    (key) => raw.dimensions.find((d) => d.dimension === key)!
  );

  return {
    requestId: request.requestId,
    evaluatedAt: new Date().toISOString(),
    overallScore: clamp(Math.round(raw.overallScore), 0, 100),
    bandScore: buildBandScore(request.level, raw.bandScore, raw.overallScore),
    dimensions: sortedDimensions,
    strengths: raw.strengths ?? [],
    weaknesses: raw.weaknesses ?? [],
    feedback: raw.feedback,
    correctedVersion: raw.correctedVersion,
    suggestedImprovements: raw.suggestedImprovements,
    metadata: {
      modelId: GEMINI_MODEL_VERSION,
      promptVersion: PROMPT_VERSION,
      wordCount: request.wordCount,
    },
  };
}
