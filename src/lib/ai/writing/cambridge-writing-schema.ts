import { z } from "zod";
import { WRITING_DIMENSION_ORDER } from "@/lib/cambridge-assessment/cambridge-writing-ai-contracts";

const WRITING_DIMENSIONS = WRITING_DIMENSION_ORDER;

export const CambridgeWritingDimensionSchema = z.object({
  dimension: z.enum(WRITING_DIMENSIONS),
  score: z.number().min(0).max(100),
  feedback: z.string().min(1),
  evidence: z.array(z.string()).optional(),
});

/** Required Gemini JSON shape (M2.2). */
export const CambridgeWritingGeminiResponseSchema = z.object({
  overallScore: z.number().min(0).max(100),
  bandScore: z.number(),
  dimensions: z
    .array(CambridgeWritingDimensionSchema)
    .length(WRITING_DIMENSIONS.length),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  feedback: z.string().min(1),
  correctedVersion: z.string(),
  suggestedImprovements: z.array(z.string()).optional(),
});

export type CambridgeWritingGeminiResponse = z.infer<
  typeof CambridgeWritingGeminiResponseSchema
>;
