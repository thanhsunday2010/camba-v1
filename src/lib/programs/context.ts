import { createClient } from "@/lib/supabase/server";
import { DEFAULT_PROGRAM_SLUG } from "@/lib/programs/constants";
import type { Level, Program } from "@/types/database";

export interface ActiveProgramContext {
  programId: string;
  program: Pick<Program, "id" | "slug" | "name" | "description">;
  levelId: string | null;
  level: Pick<Level, "id" | "slug" | "name"> | null;
}

export async function getDefaultProgramId(): Promise<string | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("programs")
    .select("id")
    .eq("slug", DEFAULT_PROGRAM_SLUG)
    .eq("is_active", true)
    .maybeSingle();

  return data?.id ?? null;
}

export async function resolveProgramId(
  userId: string,
  programId?: string | null
): Promise<string | null> {
  if (programId) return programId;

  const supabase = await createClient();

  const { data: gamification } = await supabase
    .from("user_gamification")
    .select("current_program_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (gamification?.current_program_id) {
    return gamification.current_program_id;
  }

  return getDefaultProgramId();
}

export async function getActiveProgramContext(
  userId: string
): Promise<ActiveProgramContext | null> {
  const supabase = await createClient();

  const programId = await resolveProgramId(userId);
  if (!programId) return null;

  const { data: program } = await supabase
    .from("programs")
    .select("id, slug, name, description")
    .eq("id", programId)
    .eq("is_active", true)
    .single();

  if (!program) return null;

  const { data: gamification } = await supabase
    .from("user_gamification")
    .select("current_level_id")
    .eq("user_id", userId)
    .maybeSingle();

  let level: Pick<Level, "id" | "slug" | "name"> | null = null;
  let levelId = gamification?.current_level_id ?? null;

  if (levelId) {
    const { data: levelRow } = await supabase
      .from("levels")
      .select("id, slug, name, program_id")
      .eq("id", levelId)
      .single();

    if (levelRow?.program_id === programId) {
      level = { id: levelRow.id, slug: levelRow.slug, name: levelRow.name };
    } else {
      levelId = null;
    }
  }

  return { programId, program, levelId, level };
}

export async function validateLevelInProgram(
  levelId: string,
  programId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("levels")
    .select("id")
    .eq("id", levelId)
    .eq("program_id", programId)
    .maybeSingle();

  return !!data;
}
