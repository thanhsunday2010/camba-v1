import { z } from "zod";
import { SPEAKING_DIMENSION_ORDER } from "@/lib/cambridge-assessment/cambridge-speaking-ai-contracts";

const SPEAKING_DIMENSIONS = SPEAKING_DIMENSION_ORDER;

export const CambridgeSpeakingDimensionSchema = z.object({
  dimension: z.enum(SPEAKING_DIMENSIONS),
  score: z.number().min(0).max(100),
  feedback: z.string().min(1),
  evidence: z.array(z.string()).optional(),
});

export const CambridgeSpeakingLanguageAnalysisSchema = z.object({
  wordCount: z.number().min(0),
  sentenceCount: z.number().min(0),
  averageWordsPerSentence: z.number().min(0),
  vocabularyRange: z.enum(["limited", "adequate", "good", "wide"]).optional(),
  grammarControl: z.enum(["limited", "adequate", "good", "strong"]).optional(),
  detectedErrors: z
    .array(
      z.object({
        type: z.string(),
        excerpt: z.string(),
        suggestion: z.string().optional(),
      })
    )
    .optional(),
});

/** Required Gemini JSON shape (M2.3). */
export const CambridgeSpeakingGeminiResponseSchema = z.object({
  transcript: z.string().min(1),
  overallScore: z.number().min(0).max(100),
  bandScore: z.number(),
  dimensions: z.array(CambridgeSpeakingDimensionSchema).length(SPEAKING_DIMENSIONS.length),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  feedback: z.string().min(1),
  languageAnalysis: CambridgeSpeakingLanguageAnalysisSchema,
});

export type CambridgeSpeakingGeminiResponse = z.infer<
  typeof CambridgeSpeakingGeminiResponseSchema
>;
