"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/session";
import { fetchExerciseQuestionsFull } from "@/lib/queries/learning";
import { evaluateWritingQuestion } from "@/lib/writing/writing-evaluation";
import {
  isWritingQuestion,
  parseWritingQuestionContent,
  userAnswerToWritingPayload,
} from "@/lib/writing/writing-utils";
import { persistWritingEvaluationRecord } from "@/lib/writing/writing-evaluation-persistence";
import type { ActionResult } from "@/types";
import type { Json } from "@/types/database";
import type { UserAnswer } from "@/types/learning";

export async function retryWritingEvaluationForQuestion(
  attemptType: "exercise_attempt" | "mock_test_attempt",
  attemptId: string,
  questionId: string,
  exerciseId?: string
): Promise<ActionResult<{ evaluation: UserAnswer }>> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const supabase = await createClient();

  if (attemptType === "exercise_attempt") {
    const { data: attempt, error } = await supabase
      .from("exercise_attempts")
      .select("id, user_id, answers, exercise_id")
      .eq("id", attemptId)
      .eq("user_id", user.id)
      .single();

    if (error || !attempt) {
      return { success: false, error: "Attempt not found" };
    }

    const resolvedExerciseId = exerciseId ?? attempt.exercise_id;
    const answers = (attempt.answers ?? {}) as Record<string, UserAnswer>;
    const answer = answers[questionId];
    if (!answer || answer.type !== "writing") {
      return { success: false, error: "No writing answer for this question" };
    }

    const questions = await fetchExerciseQuestionsFull(resolvedExerciseId);
    const question = questions.find((q) => q.id === questionId);
    if (!question || !isWritingQuestion(question)) {
      return { success: false, error: "Question is not a writing task" };
    }

    const envelope = await evaluateWritingQuestion(question, answer);
    const updatedAnswer: UserAnswer = { ...answer, evaluation: envelope };
    const updatedAnswers = { ...answers, [questionId]: updatedAnswer };

    await supabase
      .from("exercise_attempts")
      .update({ answers: updatedAnswers as unknown as Json })
      .eq("id", attemptId);

    await maybePersistEvaluation({
      attemptType,
      attemptId,
      questionId,
      question,
      updatedAnswer,
    });

    return { success: true, data: { evaluation: updatedAnswer } };
  }

  const { data: attempt, error } = await supabase
    .from("mock_test_attempts")
    .select("id, user_id, answers")
    .eq("id", attemptId)
    .eq("user_id", user.id)
    .single();

  if (error || !attempt) {
    return { success: false, error: "Attempt not found" };
  }

  return {
    success: false,
    error: "Mock test writing retry requires exercise context (pass exerciseId)",
  };
}

async function maybePersistEvaluation(input: {
  attemptType: "exercise_attempt" | "mock_test_attempt";
  attemptId: string;
  questionId: string;
  question: Parameters<typeof evaluateWritingQuestion>[0];
  updatedAnswer: UserAnswer;
}) {
  const payload = userAnswerToWritingPayload(input.updatedAnswer);
  if (payload?.evaluation?.status !== "completed") return;

  const content = parseWritingQuestionContent(input.question);
  await persistWritingEvaluationRecord({
    attemptType: input.attemptType,
    attemptId: input.attemptId,
    questionId: input.questionId,
    prompt: content.prompt.prompt,
    responseText: payload.responseText,
    wordCount: payload.wordCount,
    taskType: payload.taskType,
    envelope: payload.evaluation,
  });
}
