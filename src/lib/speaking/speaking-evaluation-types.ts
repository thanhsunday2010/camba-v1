/**
 * M2.3 — Speaking evaluation domain types.
 * Bridges runtime answers with M2.0 Cambridge AI contracts.
 */

import type {
  SpeakingAiEvaluationResult,
  SpeakingBandScore,
  SpeakingDimensionScore,
  SpeakingEvaluationDimension,
  SpeakingTranscriptionResult,
} from "@/lib/cambridge-assessment/cambridge-speaking-ai-contracts";

export type SpeakingEvaluationStatus = "pending" | "completed" | "failed";

export type SpeakingEvaluationEnvelope = {
  status: SpeakingEvaluationStatus;
  result?: SpeakingEvaluationResult;
  evaluatedAt?: string;
  modelVersion?: string;
  errorMessage?: string;
};

export type SpeakingEvaluationResult = SpeakingAiEvaluationResult;

export type SpeakingDimensionResult = SpeakingDimensionScore;

export type SpeakingTranscript = SpeakingTranscriptionResult;

export type SpeakingFeedback = {
  summary: string;
  strengths: string[];
  weaknesses: string[];
};

export type SpeakingBand = SpeakingBandScore;

export type { SpeakingEvaluationDimension };

export type SpeakingQuestionEvaluationSummary = {
  overallScore: number;
  bandScore: SpeakingBandScore;
  dimensions: SpeakingDimensionScore[];
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  transcript: string;
  status: SpeakingEvaluationStatus;
};

export type SpeakingAnalyticsSignals = {
  grammarWeaknesses: string[];
  vocabularyWeaknesses: string[];
  pronunciationWeaknesses: string[];
  fluencyWeaknesses: string[];
  overallWeaknesses: string[];
  overallScore: number;
  questionId: string;
  taskType?: string;
};
