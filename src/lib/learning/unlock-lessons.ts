import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import {
  fetchLevelLessonUnlockNodes,
  resolveNextUnlockLessonIdsInLevel,
} from "@/lib/learning/curriculum-unlock";
import { upsertLessonProgress } from "@/lib/learning/lesson-progress-db";

export async function unlockNextLessonsInLevel(
  supabase: SupabaseClient<Database>,
  userId: string,
  programId: string,
  levelId: string,
  completedLessonId: string
): Promise<void> {
  const levelLessons = await fetchLevelLessonUnlockNodes(supabase, levelId);
  const unlockIds = resolveNextUnlockLessonIdsInLevel(completedLessonId, levelLessons);

  for (const lessonId of unlockIds) {
    const { data: existing } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .maybeSingle();

    await upsertLessonProgress(supabase, {
      user_id: userId,
      lesson_id: lessonId,
      program_id: programId,
      is_unlocked: true,
      completion_percent: Number(existing?.completion_percent ?? 0),
      accuracy_percent: Number(existing?.accuracy_percent ?? 0),
      mastery_level: existing?.mastery_level ?? 0,
      attempts_count: existing?.attempts_count ?? 0,
    });
  }
}
