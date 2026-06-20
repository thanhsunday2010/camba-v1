import { createClient } from "@/lib/supabase/server";

/**
 * Removes progress and attempts for lessons outside the selected program.
 * Called when a user switches programs to prevent stale unlock/state bleed.
 */
export async function clearStaleProgressForProgramSwitch(
  userId: string,
  newProgramId: string
): Promise<void> {
  const supabase = await createClient();

  const { data: staleProgress } = await supabase
    .from("lesson_progress")
    .select("id, lesson_id")
    .eq("user_id", userId)
    .neq("program_id", newProgramId);

  if (!staleProgress?.length) return;

  const staleLessonIds = staleProgress.map((p) => p.lesson_id);

  await supabase
    .from("exercise_attempts")
    .delete()
    .eq("user_id", userId)
    .in("lesson_id", staleLessonIds);

  await supabase
    .from("lesson_progress")
    .delete()
    .eq("user_id", userId)
    .neq("program_id", newProgramId);
}

export async function getProgramIdForLesson(lessonId: string): Promise<string | null> {
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("unit_id")
    .eq("id", lessonId)
    .maybeSingle();

  if (!lesson) return null;

  const { data: unit } = await supabase
    .from("units")
    .select("skill_id")
    .eq("id", lesson.unit_id)
    .maybeSingle();

  if (!unit) return null;

  const { data: skill } = await supabase
    .from("skills")
    .select("level_id")
    .eq("id", unit.skill_id)
    .maybeSingle();

  if (!skill) return null;

  const { data: level } = await supabase
    .from("levels")
    .select("program_id")
    .eq("id", skill.level_id)
    .maybeSingle();

  return level?.program_id ?? null;
}
