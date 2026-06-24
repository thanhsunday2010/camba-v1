import type { ExerciseType } from "@/types/database";
import { isWritingQuestion } from "@/lib/writing/writing-utils";
import { isSpeakingQuestion } from "@/lib/speaking/speaking-utils";

/** DB legacy value mapped to application exercise type */
const LEGACY_QUESTION_TYPE_MAP: Record<string, ExerciseType> = {
  reading: "reading_comprehension",
};

/**
 * Normalizes question_type from DB to application ExerciseType.
 * Handles legacy `reading` enum value until migration 010 is applied everywhere.
 */
export function normalizeQuestionType(type: string): ExerciseType {
  return (LEGACY_QUESTION_TYPE_MAP[type] ?? type) as ExerciseType;
}

export function isMcStyleQuestionType(type: string): boolean {
  const normalized = normalizeQuestionType(type);
  return (
    normalized === "multiple_choice" ||
    normalized === "listening" ||
    normalized === "reading_comprehension" ||
    normalized === "image_selection"
  );
}

export function isWritingQuestionType(
  question: Pick<{ question_type: string; content: Record<string, unknown> }, "question_type" | "content">
): boolean {
  return isWritingQuestion(question as Parameters<typeof isWritingQuestion>[0]);
}

export function isSpeakingQuestionType(
  question: Pick<{ question_type: string; content: Record<string, unknown> }, "question_type" | "content">
): boolean {
  return isSpeakingQuestion(question as Parameters<typeof isSpeakingQuestion>[0]);
}
