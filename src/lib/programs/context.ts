import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { DEFAULT_PROGRAM_SLUG } from "@/lib/programs/constants";
import type { Level, Program, UserGamification } from "@/types/database";

export interface ActiveProgramContext {
  programId: string;
  program: Pick<Program, "id" | "slug" | "name" | "description">;
  levelId: string | null;
  level: Pick<Level, "id" | "slug" | "name"> | null;
}

const getDefaultProgramIdCached = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("programs")
      .select("id")
      .eq("slug", DEFAULT_PROGRAM_SLUG)
      .eq("is_active", true)
      .maybeSingle();
    return data?.id ?? null;
  },
  ["default-program-id"],
  { revalidate: 3600 }
);

export async function getDefaultProgramId(): Promise<string | null> {
  return getDefaultProgramIdCached();
}

export async function resolveProgramId(
  userId: string,
  programId?: string | null,
  gamification?: Pick<UserGamification, "current_program_id"> | null
): Promise<string | null> {
  if (programId) return programId;

  const currentProgramId =
    gamification?.current_program_id ??
    (
      await (async () => {
        const supabase = await createClient();
        const { data } = await supabase
          .from("user_gamification")
          .select("current_program_id")
          .eq("user_id", userId)
          .maybeSingle();
        return data?.current_program_id ?? null;
      })()
    );

  if (currentProgramId) return currentProgramId;

  return getDefaultProgramId();
}

export async function getActiveProgramContext(
  userId: string,
  gamification?: Pick<UserGamification, "current_program_id" | "current_level_id"> | null
): Promise<ActiveProgramContext | null> {
  const supabase = await createClient();

  const programId = await resolveProgramId(userId, null, gamification);
  if (!programId) return null;

  let levelId = gamification?.current_level_id ?? null;

  const [programResult, gamificationResult] = await Promise.all([
    supabase
      .from("programs")
      .select("id, slug, name, description")
      .eq("id", programId)
      .eq("is_active", true)
      .single(),
    levelId
      ? Promise.resolve({ data: null })
      : supabase
          .from("user_gamification")
          .select("current_level_id")
          .eq("user_id", userId)
          .maybeSingle(),
  ]);

  const program = programResult.data;
  if (!program) return null;

  if (!levelId) {
    levelId = gamificationResult.data?.current_level_id ?? null;
  }

  let level: Pick<Level, "id" | "slug" | "name"> | null = null;

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
