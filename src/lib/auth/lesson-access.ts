import { createClient } from "@/lib/supabase/server";
import { isUnlockAllLessonsEnabled } from "@/lib/learning/unlock-all-lessons";

export async function assertLessonUnlockedForUser(
  userId: string,
  lessonId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (isUnlockAllLessonsEnabled()) {
    return { ok: true };
  }

  const supabase = await createClient();

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("is_unlocked")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (!progress?.is_unlocked) {
    return { ok: false, error: "Lesson is locked" };
  }

  return { ok: true };
}

export async function assertExerciseInLesson(
  exerciseId: string,
  lessonId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();

  const { data: exercise } = await supabase
    .from("exercises")
    .select("lesson_id, is_active, status")
    .eq("id", exerciseId)
    .maybeSingle();

  if (!exercise || exercise.lesson_id !== lessonId) {
    return { ok: false, error: "Invalid exercise" };
  }

  if (!exercise.is_active || exercise.status !== "published") {
    return { ok: false, error: "Exercise is not available" };
  }

  return { ok: true };
}
