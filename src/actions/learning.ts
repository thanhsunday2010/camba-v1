"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { scoreExercise } from "@/lib/learning/scoring";
import {
  calculateMasteryLevel,
  canUnlockNextLesson,
  calculateLessonCompletion,
  calculateLessonAccuracy,
} from "@/lib/learning/mastery";
import {
  fetchExerciseQuestionsFull,
  getLessonExerciseIds,
  getLevelIdForLesson,
} from "@/lib/queries/learning";
import { assertExerciseInLesson, assertLessonUnlockedForUser } from "@/lib/auth/lesson-access";
import { assertLessonPracticeAllowed } from "@/lib/subscriptions/assert-lesson-practice-allowed";
import { getAuthUser } from "@/lib/auth/session";
import { onExerciseCompleted } from "@/lib/gamification/events";
import { resolveProgramId } from "@/lib/programs/context";
import { getMasteryUnlockThreshold } from "@/lib/programs/settings";
import { getProgramIdForLesson } from "@/lib/programs/progress-cleanup";
import { unlockNextLessonsInLevel } from "@/lib/learning/unlock-lessons";
import {
  hasCambridgeAiEvaluatedQuestions,
  markCambridgeAiAnswersPending,
  runCambridgeAiEvaluationPipeline,
  serializeCambridgeAiAnswersForAttempt,
} from "@/lib/learning/cambridge-ai-evaluation-pipeline";
import { persistWritingEvaluationsForAttempt } from "@/lib/writing/writing-evaluation-persistence";
import { persistSpeakingEvaluationsForAttempt } from "@/lib/speaking/speaking-evaluation-persistence";
import { generateRecommendationsFromFeedback } from "@/lib/ai/recommendations-engine";
import type { ActionResult } from "@/types";
import type { Json } from "@/types/database";
import type { ExerciseResult, UserAnswer } from "@/types/learning";
import type { ExerciseGamificationSummary } from "@/lib/gamification/gamification-types";

export async function submitExerciseAttempt(
  exerciseId: string,
  lessonId: string,
  answers: Record<string, UserAnswer>,
  timeSpentSeconds: number
): Promise<ActionResult<ExerciseResult>> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const [unlockCheck, exerciseCheck, practiceCheck] = await Promise.all([
    assertLessonUnlockedForUser(user.id, lessonId),
    assertExerciseInLesson(exerciseId, lessonId),
    assertLessonPracticeAllowed(user.id, lessonId),
  ]);

  if (!unlockCheck.ok) {
    return { success: false, error: unlockCheck.error };
  }

  if (!exerciseCheck.ok) {
    return { success: false, error: exerciseCheck.error };
  }

  if (!practiceCheck.success) {
    return {
      success: false,
      error: practiceCheck.error,
      code: practiceCheck.code,
      practiceLimitMeta: practiceCheck.practiceLimitMeta,
    };
  }

  const questions = await fetchExerciseQuestionsFull(exerciseId);
  if (questions.length === 0) {
    return { success: false, error: "No questions found" };
  }

  const normalizedAnswers = serializeCambridgeAiAnswersForAttempt(answers);
  const hasAiEval = hasCambridgeAiEvaluatedQuestions(questions);
  const supabase = await createClient();
  const wasLessonComplete = await getPreviousCompletion(user.id, lessonId);

  if (!hasAiEval) {
    const result = scoreExercise(questions, normalizedAnswers);
    const { error: attemptError } = await supabase.from("exercise_attempts").insert({
      user_id: user.id,
      exercise_id: exerciseId,
      lesson_id: lessonId,
      score: result.score,
      max_score: result.maxScore,
      accuracy_percent: result.accuracyPercent,
      time_spent_seconds: timeSpentSeconds,
      answers: normalizedAnswers as unknown as Json,
      is_completed: true,
      completed_at: new Date().toISOString(),
    });

    if (attemptError) {
      return { success: false, error: attemptError.message };
    }

    const gamification = await runPostExerciseGamification(
      user.id,
      lessonId,
      exerciseId,
      result.accuracyPercent,
      timeSpentSeconds,
      wasLessonComplete,
      supabase
    );

    after(async () => {
      try {
        revalidatePath("/learning");
        revalidatePath(`/learning/lesson/${lessonId}`);
        revalidatePath("/dashboard");
      } catch (error) {
        console.error("Post-submit revalidation failed:", error);
      }
    });

    return { success: true, data: { ...result, gamification } };
  }

  const pendingAnswers = markCambridgeAiAnswersPending(questions, normalizedAnswers);

  const { data: attemptRow, error: draftError } = await supabase
    .from("exercise_attempts")
    .insert({
      user_id: user.id,
      exercise_id: exerciseId,
      lesson_id: lessonId,
      score: 0,
      max_score: 100,
      accuracy_percent: 0,
      time_spent_seconds: timeSpentSeconds,
      answers: pendingAnswers as unknown as Json,
      is_completed: false,
      completed_at: null,
    })
    .select("id")
    .single();

  if (draftError || !attemptRow) {
    return { success: false, error: draftError?.message ?? "Failed to save attempt" };
  }

  const pipeline = await runCambridgeAiEvaluationPipeline({
    questions,
    answers: normalizedAnswers,
  });

  const result: ExerciseResult = {
    score: pipeline.score,
    maxScore: pipeline.maxScore,
    accuracyPercent: pipeline.accuracyPercent,
    questionResults: pipeline.questionResults,
  };

  const { error: attemptError } = await supabase
    .from("exercise_attempts")
    .update({
      score: result.score,
      max_score: result.maxScore,
      accuracy_percent: result.accuracyPercent,
      answers: pipeline.enrichedAnswers as unknown as Json,
      is_completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq("id", attemptRow.id);

  if (attemptError) {
    return { success: false, error: attemptError.message };
  }

  const gamification = await runPostExerciseGamification(
    user.id,
    lessonId,
    exerciseId,
    result.accuracyPercent,
    timeSpentSeconds,
    wasLessonComplete,
    supabase
  );

  after(async () => {
    try {
      await persistWritingEvaluationsForAttempt(
        pipeline.writingPersistence.map((p) => ({
          ...p,
          attemptType: "exercise_attempt" as const,
          attemptId: attemptRow.id,
        }))
      );
      await persistSpeakingEvaluationsForAttempt(
        pipeline.speakingPersistence.map((p) => ({
          ...p,
          attemptType: "exercise_attempt" as const,
          attemptId: attemptRow.id,
        }))
      );
      if (pipeline.analyticsWeaknesses.length) {
        await generateRecommendationsFromFeedback(user.id, pipeline.analyticsWeaknesses);
      }
      revalidatePath("/learning");
      revalidatePath(`/learning/lesson/${lessonId}`);
      revalidatePath("/dashboard");
    } catch (error) {
      console.error("Post-writing evaluation persistence failed:", error);
    }
  });

  return {
    success: true,
    data: { ...result, answers: pipeline.enrichedAnswers, gamification },
  };
}

async function runPostExerciseGamification(
  userId: string,
  lessonId: string,
  exerciseId: string,
  accuracyPercent: number,
  timeSpentSeconds: number,
  previousCompletionPercent: number,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<ExerciseGamificationSummary> {
  await updateLessonProgress(userId, lessonId);

  const exerciseIds = await getLessonExerciseIds(lessonId);
  const { data: attemptsAfter } = await supabase
    .from("exercise_attempts")
    .select("exercise_id")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .eq("is_completed", true);

  const completedCount = new Set(attemptsAfter?.map((a) => a.exercise_id)).size;
  const lessonJustCompleted =
    previousCompletionPercent < 100 &&
    exerciseIds.length > 0 &&
    completedCount >= exerciseIds.length;

  return onExerciseCompleted(
    userId,
    lessonId,
    exerciseId,
    accuracyPercent,
    timeSpentSeconds,
    lessonJustCompleted
  );
}

async function getPreviousCompletion(userId: string, lessonId: string): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lesson_progress")
    .select("completion_percent")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();
  return Number(data?.completion_percent ?? 0);
}

async function updateLessonProgress(userId: string, lessonId: string) {
  const supabase = await createClient();
  const exerciseIds = await getLessonExerciseIds(lessonId);
  if (!exerciseIds.length) return;

  const { data: attempts } = await supabase
    .from("exercise_attempts")
    .select("exercise_id, accuracy_percent, is_completed")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .eq("is_completed", true);

  const completedExerciseIds = new Set(attempts?.map((a) => a.exercise_id) ?? []);
  const completionPercent = calculateLessonCompletion(
    completedExerciseIds.size,
    exerciseIds.length
  );

  const latestAccuracies = exerciseIds
    .map((id) => {
      const exerciseAttempts = attempts?.filter((a) => a.exercise_id === id) ?? [];
      const latest = exerciseAttempts[exerciseAttempts.length - 1];
      return latest ? Number(latest.accuracy_percent) : 0;
    })
    .filter((a) => a > 0);

  const accuracyPercent = calculateLessonAccuracy(latestAccuracies);
  const masteryLevel = calculateMasteryLevel(accuracyPercent, completionPercent);

  const programId = (await getProgramIdForLesson(lessonId)) ?? (await resolveProgramId(userId));
  if (!programId) return;

  const { data: existing } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .single();

  await supabase.from("lesson_progress").upsert(
    {
      user_id: userId,
      lesson_id: lessonId,
      program_id: programId,
      completion_percent: completionPercent,
      accuracy_percent: accuracyPercent,
      mastery_level: masteryLevel,
      attempts_count: (existing?.attempts_count ?? 0) + 1,
      is_unlocked: existing?.is_unlocked ?? true,
      last_attempt_at: new Date().toISOString(),
      mastered_at:
        masteryLevel >= 4
          ? new Date().toISOString()
          : existing?.mastered_at ?? null,
    },
    { onConflict: "user_id,lesson_id" }
  );

  if (canUnlockNextLesson(masteryLevel, await getUnlockThreshold(userId))) {
    await unlockNextLesson(userId, lessonId);
  }
}

async function getUnlockThreshold(userId: string): Promise<number> {
  const programId = await resolveProgramId(userId);
  if (!programId) return 3;
  return getMasteryUnlockThreshold(programId);
}

async function unlockNextLesson(userId: string, currentLessonId: string) {
  const supabase = await createClient();

  const levelId = await getLevelIdForLesson(currentLessonId);
  if (!levelId) return;

  const programId =
    (await getProgramIdForLesson(currentLessonId)) ?? (await resolveProgramId(userId));
  if (!programId) return;

  await unlockNextLessonsInLevel(supabase, userId, programId, levelId, currentLessonId);
}

export async function startLesson(lessonId: string): Promise<ActionResult> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const unlockCheck = await assertLessonUnlockedForUser(user.id, lessonId);
  if (!unlockCheck.ok) {
    return { success: false, error: unlockCheck.error };
  }

  const practiceCheck = await assertLessonPracticeAllowed(user.id, lessonId);
  if (!practiceCheck.success) {
    return practiceCheck;
  }

  return { success: true };
}
