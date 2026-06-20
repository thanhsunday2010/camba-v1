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
import { getAuthUser } from "@/lib/auth/session";
import { onExerciseCompleted } from "@/lib/gamification/events";
import { resolveProgramId } from "@/lib/programs/context";
import { getMasteryUnlockThreshold } from "@/lib/programs/settings";
import { getProgramIdForLesson } from "@/lib/programs/progress-cleanup";
import { unlockNextLessonsInLevel } from "@/lib/learning/unlock-lessons";
import type { ActionResult } from "@/types";
import type { Json } from "@/types/database";
import type { ExerciseResult, UserAnswer } from "@/types/learning";

export async function submitExerciseAttempt(
  exerciseId: string,
  lessonId: string,
  answers: Record<string, UserAnswer>,
  timeSpentSeconds: number
): Promise<ActionResult<ExerciseResult>> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const [unlockCheck, exerciseCheck] = await Promise.all([
    assertLessonUnlockedForUser(user.id, lessonId),
    assertExerciseInLesson(exerciseId, lessonId),
  ]);

  if (!unlockCheck.ok) {
    return { success: false, error: unlockCheck.error };
  }

  if (!exerciseCheck.ok) {
    return { success: false, error: exerciseCheck.error };
  }

  const questions = await fetchExerciseQuestionsFull(exerciseId);
  if (questions.length === 0) {
    return { success: false, error: "No questions found" };
  }

  const result = scoreExercise(questions, answers);
  const wasLessonComplete = await getPreviousCompletion(user.id, lessonId);

  const supabase = await createClient();
  const { error: attemptError } = await supabase.from("exercise_attempts").insert({
    user_id: user.id,
    exercise_id: exerciseId,
    lesson_id: lessonId,
    score: result.score,
    max_score: result.maxScore,
    accuracy_percent: result.accuracyPercent,
    time_spent_seconds: timeSpentSeconds,
    answers: answers as unknown as Json,
    is_completed: true,
    completed_at: new Date().toISOString(),
  });

  if (attemptError) {
    return { success: false, error: attemptError.message };
  }

  after(async () => {
    try {
      await updateLessonProgress(user.id, lessonId);

      const exerciseIds = await getLessonExerciseIds(lessonId);
      const { data: attemptsAfter } = await supabase
        .from("exercise_attempts")
        .select("exercise_id")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .eq("is_completed", true);

      const completedCount = new Set(attemptsAfter?.map((a) => a.exercise_id)).size;
      const lessonJustCompleted =
        !wasLessonComplete && exerciseIds.length > 0 && completedCount >= exerciseIds.length;

      await onExerciseCompleted(
        user.id,
        lessonId,
        exerciseId,
        result.accuracyPercent,
        timeSpentSeconds,
        lessonJustCompleted
      );

      revalidatePath("/learning");
      revalidatePath(`/learning/lesson/${lessonId}`);
      revalidatePath("/dashboard");
    } catch (error) {
      console.error("Post-submit progress/gamification failed:", error);
    }
  });

  return { success: true, data: result };
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

  return { success: true };
}
