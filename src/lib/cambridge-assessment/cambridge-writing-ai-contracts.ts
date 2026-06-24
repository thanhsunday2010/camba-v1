/**
 * M2.0 — Writing AI evaluation contracts (Gemini-ready, no implementation).
 * Extends lesson-path feedback with Cambridge rubric dimensions.
 */

import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { CambridgeTaskTypeKey } from "@/lib/cambridge-assessment/cambridge-task-taxonomy";

/** Cambridge-aligned writing evaluation dimensions. */
export type WritingEvaluationDimension =
  | "grammar"
  | "vocabulary"
  | "task_achievement"
  | "organization"
  | "communicative_effectiveness";

export type WritingDimensionScore = {
  dimension: WritingEvaluationDimension;
  /** 0–100 normalized score for this dimension. */
  score: number;
  /** Human-readable feedback for the learner. */
  feedback: string;
  /** Optional examples from the learner's response. */
  evidence?: string[];
};

export type WritingAiEvaluationRequest = {
  requestId: string;
  level: CambridgeExamLevel;
  taskType: CambridgeTaskTypeKey;
  /** Official task prompt shown to the learner. */
  prompt: string;
  /** Learner's submitted text. */
  learnerResponse: string;
  /** Optional word-count constraints from the task. */
  constraints?: {
    minWords?: number;
    maxWords?: number;
    requiredPoints?: string[];
  };
  /** Optional picture/stimulus metadata for picture-based writing. */
  stimulus?: {
    imageUrl?: string;
    imageDescription?: string;
    bulletPoints?: string[];
  };
  locale?: string;
};

export type WritingAiEvaluationResult = {
  requestId: string;
  evaluatedAt: string;
  /** Overall normalized score 0–100. */
  overallScore: number;
  /**
   * Level-appropriate band score.
   * YLE: shield count 0–5 per skill; KET/PET: Cambridge scale subset or CEFR band label.
   */
  bandScore: WritingBandScore;
  dimensions: WritingDimensionScore[];
  strengths: string[];
  weaknesses: string[];
  /** Actionable feedback summary for the learner. */
  feedback: string;
  /** Model-suggested improved version (not shown as "the only correct answer"). */
  correctedVersion: string;
  /** Optional per-dimension suggested improvements (maps to legacy lesson AI shape). */
  suggestedImprovements?: string[];
  metadata?: {
    modelId?: string;
    promptVersion?: string;
    wordCount?: number;
  };
};

export type WritingBandScore =
  | { model: "yle_shields"; shields: number; maxShields: 5 }
  | { model: "cambridge_scale"; scaleScore: number; cefrBand?: string }
  | { model: "percent"; percent: number };

/** Contract for the Writing AI service (M2.2+ implementation). */
export interface CambridgeWritingAiEvaluator {
  evaluate(request: WritingAiEvaluationRequest): Promise<WritingAiEvaluationResult>;
}

/** Maps legacy lesson WritingFeedback to M2 writing result shape (migration helper). */
export type LegacyWritingFeedbackBridge = {
  overallScore: number;
  grammarFeedback: string;
  vocabularyFeedback: string;
  coherenceFeedback: string;
  strengths?: string[];
  weaknesses?: string[];
  suggestedImprovements?: string[];
};

export const WRITING_DIMENSION_LABELS: Record<WritingEvaluationDimension, string> = {
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  task_achievement: "Task achievement",
  organization: "Organization",
  communicative_effectiveness: "Communicative effectiveness",
};

export const WRITING_DIMENSION_ORDER: WritingEvaluationDimension[] = [
  "grammar",
  "vocabulary",
  "task_achievement",
  "organization",
  "communicative_effectiveness",
];
