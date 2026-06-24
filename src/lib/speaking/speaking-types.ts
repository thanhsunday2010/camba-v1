/**
 * M2.3 — Speaking runtime domain types (no raw Gemini fields).
 */

import type { CambridgeTaskTypeKey } from "@/lib/cambridge-assessment/cambridge-task-taxonomy";

/** Runtime-supported speaking tasks (M2.3). */
export type SpeakingRuntimeTaskType =
  | "speaking_picture_description"
  | "speaking_personal_questions"
  | "speaking_storytelling"
  | "speaking_discussion";

export type SpeakingTaxonomyTaskType = Extract<
  CambridgeTaskTypeKey,
  "picture_description_speaking" | "short_answer" | "story_telling" | "conversation"
>;

export type SpeakingPrompt = {
  prompt: string;
  taskDescription?: string;
  followUpQuestions?: string[];
};

export type SpeakingConstraints = {
  maxDurationSeconds?: number;
  minDurationSeconds?: number;
};

export type SpeakingQuestionContent = {
  cambridgeTaskType: SpeakingRuntimeTaskType;
  prompt: SpeakingPrompt;
  constraints: SpeakingConstraints;
  stimulus?: {
    imageUrl?: string;
    imageDescription?: string;
    pictureSequence?: string[];
  };
};

export type SpeakingSubmission = {
  questionId: string;
  audioRef: string;
  mimeType: string;
  durationSeconds: number;
  submittedAt: string;
  taskType?: SpeakingRuntimeTaskType;
  transcript?: string;
};

/** Serialized shape stored inside attempt answers JSON. */
export type SpeakingUserAnswerPayload = {
  type: "speaking";
  audioRef: string;
  mimeType: string;
  durationSeconds: number;
  submittedAt?: string;
  taskType?: SpeakingRuntimeTaskType;
  transcript?: string;
  evaluation?: import("@/lib/speaking/speaking-evaluation-types").SpeakingEvaluationEnvelope;
};

export const SPEAKING_RUNTIME_TASK_TYPES: SpeakingRuntimeTaskType[] = [
  "speaking_picture_description",
  "speaking_personal_questions",
  "speaking_storytelling",
  "speaking_discussion",
];
