/**
 * M2.2 — Writing evaluation domain types.
 * Bridges M2.1 runtime answers with M2.0 Cambridge AI contracts.
 */

import type {
  WritingAiEvaluationResult,
  WritingBandScore,
  WritingDimensionScore,
  WritingEvaluationDimension,
} from "@/lib/cambridge-assessment/cambridge-writing-ai-contracts";

export type WritingEvaluationStatus = "pending" | "completed" | "failed";

/** Stored on writing UserAnswer.evaluation — no raw Gemini payload. */
export type WritingEvaluationEnvelope = {
  status: WritingEvaluationStatus;
  result?: WritingEvaluationResult;
  evaluatedAt?: string;
  modelVersion?: string;
  errorMessage?: string;
};

/** CAMBA-facing evaluation result — maps 1:1 to WritingAiEvaluationResult. */
export type WritingEvaluationResult = WritingAiEvaluationResult;

export type WritingDimensionResult = WritingDimensionScore;

export type WritingFeedback = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestedImprovements?: string[];
};

export type WritingCorrection = {
  correctedVersion: string;
};

export type WritingBand = WritingBandScore;

export type { WritingEvaluationDimension };

/** Slim shape attached to QuestionResult for review UI. */
export type WritingQuestionEvaluationSummary = {
  overallScore: number;
  bandScore: WritingBandScore;
  dimensions: WritingDimensionScore[];
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  correctedVersion: string;
  status: WritingEvaluationStatus;
};

/** Analytics signals for M1 adaptive learning (grammar / vocabulary). */
export type WritingAnalyticsSignals = {
  grammarWeaknesses: string[];
  vocabularyWeaknesses: string[];
  organizationWeaknesses: string[];
  taskAchievementWeaknesses: string[];
  overallWeaknesses: string[];
  overallScore: number;
  questionId: string;
  taskType?: string;
};
