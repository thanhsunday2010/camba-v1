/**
 * M2.0 — Speaking AI evaluation contracts (Gemini-ready, no implementation).
 * Pipeline: Audio → Transcription → Language Analysis → Rubric Evaluation
 */

import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { CambridgeTaskTypeKey } from "@/lib/cambridge-assessment/cambridge-task-taxonomy";

/** Cambridge-aligned speaking evaluation dimensions. */
export type SpeakingEvaluationDimension =
  | "pronunciation"
  | "grammar"
  | "vocabulary"
  | "fluency"
  | "task_achievement";

export type SpeakingDimensionScore = {
  dimension: SpeakingEvaluationDimension;
  /** 0–100 normalized score. */
  score: number;
  feedback: string;
  evidence?: string[];
};

export type SpeakingAudioInput = {
  /** Storage URL or base64 blob reference (implementation-specific). */
  audioRef: string;
  mimeType: string;
  durationSeconds: number;
};

export type SpeakingAiEvaluationRequest = {
  requestId: string;
  level: CambridgeExamLevel;
  taskType: CambridgeTaskTypeKey;
  prompt: string;
  audio: SpeakingAudioInput;
  /** Optional follow-up questions for multi-turn speaking tasks. */
  followUpPrompts?: string[];
  stimulus?: {
    imageUrl?: string;
    imageDescription?: string;
    pictureSequence?: string[];
  };
  locale?: string;
};

/** Stage 1 — raw transcription output. */
export type SpeakingTranscriptionResult = {
  transcript: string;
  confidence?: number;
  language?: string;
  segments?: Array<{ startMs: number; endMs: number; text: string }>;
};

/** Stage 2 — linguistic analysis on transcript. */
export type SpeakingLanguageAnalysis = {
  wordCount: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  detectedErrors?: Array<{ type: string; excerpt: string; suggestion?: string }>;
  vocabularyRange?: "limited" | "adequate" | "good" | "wide";
  grammarControl?: "limited" | "adequate" | "good" | "strong";
};

/** Stage 3 — final rubric evaluation (output contract). */
export type SpeakingAiEvaluationResult = {
  requestId: string;
  evaluatedAt: string;
  overallScore: number;
  bandScore: SpeakingBandScore;
  dimensions: SpeakingDimensionScore[];
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  transcript: string;
  pipeline: {
    transcription: SpeakingTranscriptionResult;
    languageAnalysis: SpeakingLanguageAnalysis;
  };
  metadata?: {
    modelId?: string;
    promptVersion?: string;
  };
};

export type SpeakingBandScore =
  | { model: "yle_shields"; shields: number; maxShields: 5 }
  | { model: "cambridge_scale"; scaleScore: number; cefrBand?: string }
  | { model: "percent"; percent: number };

/** Full speaking pipeline contract (M2.3+ implementation). */
export interface CambridgeSpeakingAiEvaluator {
  transcribe(audio: SpeakingAudioInput): Promise<SpeakingTranscriptionResult>;
  analyzeLanguage(
    transcript: string,
    level: CambridgeExamLevel
  ): Promise<SpeakingLanguageAnalysis>;
  evaluate(request: SpeakingAiEvaluationRequest): Promise<SpeakingAiEvaluationResult>;
}

export const SPEAKING_DIMENSION_LABELS: Record<SpeakingEvaluationDimension, string> = {
  pronunciation: "Pronunciation",
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  fluency: "Fluency",
  task_achievement: "Task achievement",
};

export const SPEAKING_DIMENSION_ORDER: SpeakingEvaluationDimension[] = [
  "pronunciation",
  "grammar",
  "vocabulary",
  "fluency",
  "task_achievement",
];

export const SPEAKING_PIPELINE_STAGES = [
  "audio",
  "transcription",
  "language_analysis",
  "rubric_evaluation",
] as const;

export type SpeakingPipelineStage = (typeof SPEAKING_PIPELINE_STAGES)[number];
