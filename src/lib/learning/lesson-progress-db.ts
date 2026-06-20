import type { SupabaseClient } from "@supabase/supabase-js";

export type LessonProgressUpsertRow = {
  user_id: string;
  lesson_id: string;
  program_id?: string;
  is_unlocked?: boolean;
  completion_percent?: number;
  accuracy_percent?: number;
  mastery_level?: number;
  attempts_count?: number;
  last_attempt_at?: string | null;
  mastered_at?: string | null;
};

function isMissingProgramIdColumn(message: string | undefined): boolean {
  if (!message) return false;
  const lower = message.toLowerCase();
  return (
    lower.includes("program_id") &&
    (lower.includes("schema cache") ||
      lower.includes("column") ||
      lower.includes("does not exist"))
  );
}

export async function upsertLessonProgress(
  supabase: SupabaseClient,
  row: LessonProgressUpsertRow
): Promise<{ error: string | null }> {
  if (row.program_id) {
    const { error } = await supabase
      .from("lesson_progress")
      .upsert(row, { onConflict: "user_id,lesson_id" });

    if (!error) return { error: null };
    if (!isMissingProgramIdColumn(error.message)) {
      return { error: error.message };
    }
  }

  const { program_id: _programId, ...withoutProgram } = row;
  const { error } = await supabase
    .from("lesson_progress")
    .upsert(withoutProgram, { onConflict: "user_id,lesson_id" });

  return { error: error?.message ?? null };
}

export async function fetchUserLessonProgress(
  supabase: SupabaseClient,
  userId: string,
  programId?: string
) {
  if (programId) {
    const { data, error } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("program_id", programId);

    if (!error) return data ?? [];
    if (!isMissingProgramIdColumn(error.message)) return [];
  }

  const { data } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId);

  return data ?? [];
}
