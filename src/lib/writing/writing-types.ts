/**
 * M2.1 — Writing runtime domain types (no AI / scoring fields).
 */

import type { CambridgeTaskTypeKey } from "@/lib/cambridge-assessment/cambridge-task-taxonomy";

/** Runtime-supported writing tasks (M2.1). */
export type WritingRuntimeTaskType =
  | "write_sentence"
  | "write_note"
  | "write_email"
  | "write_story"
  | "picture_description";

/** Maps spec alias → canonical Cambridge taxonomy key. */
export type WritingTaxonomyTaskType = Extract<
  CambridgeTaskTypeKey,
  | "write_sentence"
  | "write_note"
  | "write_email"
  | "write_story"
  | "picture_description_writing"
>;

export type WritingWordRange = {
  minWords?: number;
  maxWords?: number;
};

export type WritingConstraints = WritingWordRange & {
  maxCharacters?: number;
  requiredPoints?: string[];
};

export type WritingPrompt = {
  /** Primary instruction shown to the learner. */
  prompt: string;
  taskDescription?: string;
  bulletPoints?: string[];
};

export type WritingQuestionContent = {
  cambridgeTaskType: WritingRuntimeTaskType;
  prompt: WritingPrompt;
  constraints: WritingConstraints;
  stimulus?: {
    imageUrl?: string;
    imageDescription?: string;
  };
};

export type WritingResponse = {
  responseText: string;
  wordCount: number;
  characterCount: number;
};

export type WritingSubmission = {
  questionId: string;
  responseText: string;
  wordCount: number;
  submittedAt: string;
  taskType?: WritingRuntimeTaskType;
};

/** Serialized shape stored inside exercise/mock attempt answers JSON. */
export type WritingUserAnswerPayload = {
  type: "writing";
  responseText: string;
  wordCount: number;
  submittedAt?: string;
  taskType?: WritingRuntimeTaskType;
  evaluation?: import("@/lib/writing/writing-evaluation-types").WritingEvaluationEnvelope;
};

export const WRITING_RUNTIME_TASK_TYPES: WritingRuntimeTaskType[] = [
  "write_sentence",
  "write_note",
  "write_email",
  "write_story",
  "picture_description",
];
