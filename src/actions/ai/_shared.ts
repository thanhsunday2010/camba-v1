"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { assertExerciseInLesson, assertLessonUnlockedForUser } from "@/lib/auth/lesson-access";
import { requireSessionUser } from "@/lib/auth/session";
import { onExerciseCompleted } from "@/lib/gamification/events";
import { resolveProgramId } from "@/lib/programs/context";
import { getMasteryUnlockThreshold } from "@/lib/programs/settings";
import { getProgramIdForLesson } from "@/lib/programs/progress-cleanup";
import { getLevelIdForLesson } from "@/lib/queries/learning";
import { unlockNextLessonsInLevel } from "@/lib/learning/unlock-lessons";
import type { Json } from "@/types/database";

import type { ExerciseGamificationSummary } from "@/lib/gamification/gamification-types";

export async function completeAiExercise(
  exerciseId: string,
  lessonId: string,
  overallScore: number,
  timeSpentSeconds: number
): Promise<ExerciseGamificationSummary> {
  const user = await requireSessionUser();
  const userId = user.id;

  const unlockCheck = await assertLessonUnlockedForUser(userId, lessonId);
  if (!unlockCheck.ok) {
    throw new Error(unlockCheck.error);
  }

  const exerciseCheck = await assertExerciseInLesson(exerciseId, lessonId);
  if (!exerciseCheck.ok) {
    throw new Error(exerciseCheck.error);
  }

  const supabase = await createClient();

  await supabase.from("exercise_attempts").insert({
    user_id: userId,
    exercise_id: exerciseId,
    lesson_id: lessonId,
    score: overallScore,
    max_score: 100,
    accuracy_percent: overallScore,
    time_spent_seconds: timeSpentSeconds,
    answers: { type: "ai_submission" } as Json,
    is_completed: true,
    completed_at: new Date().toISOString(),
  });

  const { getLessonWithExercises } = await import("@/lib/queries/learning");
  const lesson = await getLessonWithExercises(lessonId);
  if (!lesson?.exercises?.length) {
    return {
      totalXpAwarded: 0,
      leveledUp: false,
      newLevel: 1,
      leagueRank: null,
      leagueTier: null,
      tierPromoted: false,
    };
  }

  const exerciseIds = lesson.exercises.map((e) => e.id);
  const { data: attempts } = await supabase
    .from("exercise_attempts")
    .select("exercise_id, accuracy_percent")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .eq("is_completed", true);

  const completedIds = new Set(attempts?.map((a) => a.exercise_id) ?? []);
  const completionPercent = Math.round((completedIds.size / exerciseIds.length) * 100);

  const accuracies = exerciseIds
    .map((id) => {
      const exAttempts = attempts?.filter((a) => a.exercise_id === id) ?? [];
      const latest = exAttempts[exAttempts.length - 1];
      return latest ? Number(latest.accuracy_percent) : 0;
    })
    .filter((a) => a > 0);

  const accuracyPercent =
    accuracies.length > 0
      ? Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length)
      : overallScore;

  const { calculateMasteryLevel, canUnlockNextLesson } = await import(
    "@/lib/learning/mastery"
  );
  const masteryLevel = calculateMasteryLevel(accuracyPercent, completionPercent);

  const { data: existing } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  const wasLessonComplete = Number(existing?.completion_percent ?? 0) >= 100;

  const programId = (await getProgramIdForLesson(lessonId)) ?? (await resolveProgramId(userId));
  if (!programId) {
    return {
      totalXpAwarded: 0,
      leveledUp: false,
      newLevel: 1,
      leagueRank: null,
      leagueTier: null,
      tierPromoted: false,
    };
  }

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
        masteryLevel >= 4 ? new Date().toISOString() : existing?.mastered_at ?? null,
    },
    { onConflict: "user_id,lesson_id" }
  );

  const threshold = await getMasteryUnlockThreshold(programId);

  if (canUnlockNextLesson(masteryLevel, threshold)) {
    const levelId = await getLevelIdForLesson(lessonId);
    if (levelId) {
      await unlockNextLessonsInLevel(
        supabase,
        userId,
        programId,
        levelId,
        lessonId
      );
    }
  }

  const lessonJustCompleted = !wasLessonComplete && completionPercent >= 100;

  const gamification = await onExerciseCompleted(
    userId,
    lessonId,
    exerciseId,
    overallScore,
    timeSpentSeconds,
    lessonJustCompleted
  );

  revalidatePath("/learning");
  revalidatePath(`/learning/lesson/${lessonId}`);
  revalidatePath("/dashboard");

  return gamification;
}

export async function saveAiFeedback(params: {
  feedbackType: "writing" | "speaking" | "study_coach" | "question_generator";
  referenceType: string;
  referenceId: string;
  inputData: Record<string, unknown>;
  responseData: Record<string, unknown>;
  shieldEstimate?: Record<string, unknown>;
}) {
  const user = await requireSessionUser();
  const supabase = await createClient();

  await supabase.from("ai_feedback").insert({
    user_id: user.id,
    feedback_type: params.feedbackType,
    reference_type: params.referenceType,
    reference_id: params.referenceId,
    model_version: "gemini-2.5-flash",
    input_data: params.inputData as Json,
    response_data: params.responseData as Json,
    shield_estimate: (params.shieldEstimate ?? {}) as Json,
  });
}
