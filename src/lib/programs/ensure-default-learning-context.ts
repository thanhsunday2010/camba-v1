import type { SupabaseClient } from "@supabase/supabase-js";
import { getDefaultProgramId } from "@/lib/programs/context";
import { initializeLessonUnlocks } from "@/lib/queries/learning";
import type { Database } from "@/types/database";

export async function ensureDefaultLearningContext(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<void> {
  const { data: gamification } = await supabase
    .from("user_gamification")
    .select("current_program_id, current_level_id")
    .eq("user_id", userId)
    .maybeSingle();

  let programId = gamification?.current_program_id ?? null;
  let levelId = gamification?.current_level_id ?? null;

  if (!programId) {
    programId = await getDefaultProgramId();
  }

  if (!programId) {
    return;
  }

  if (!levelId) {
    const { data: firstLevel } = await supabase
      .from("levels")
      .select("id")
      .eq("program_id", programId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    levelId = firstLevel?.id ?? null;
  }

  const needsProgram = !gamification?.current_program_id && !!programId;
  const needsLevel = !gamification?.current_level_id && !!levelId;

  if (!needsProgram && !needsLevel) {
    return;
  }

  const patch: {
    current_program_id?: string;
    current_level_id?: string;
  } = {};

  if (needsProgram) {
    patch.current_program_id = programId;
  }

  if (needsLevel && levelId) {
    patch.current_level_id = levelId;
  }

  if (gamification) {
    const { error } = await supabase
      .from("user_gamification")
      .update(patch)
      .eq("user_id", userId);

    if (error) {
      console.error("[ensureDefaultLearningContext]", error.message);
      return;
    }
  } else {
    const { error } = await supabase.from("user_gamification").insert({
      user_id: userId,
      current_program_id: programId,
      current_level_id: levelId,
    });

    if (error) {
      console.error("[ensureDefaultLearningContext]", error.message);
      return;
    }
  }

  if (levelId) {
    await initializeLessonUnlocks(userId, levelId);
  }
}
