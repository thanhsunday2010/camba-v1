"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserGamification } from "@/types/database";
import { getActiveProgramContext, resolveProgramId } from "@/lib/programs/context";
import { getActivePrograms } from "@/lib/queries/user";
import { clearStaleProgressForProgramSwitch } from "@/lib/programs/progress-cleanup";
import { initializeLessonUnlocks } from "@/lib/queries/learning";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types";
import type { Program } from "@/types/database";

export async function fetchAvailablePrograms(): Promise<
  Pick<Program, "id" | "slug" | "name" | "description">[]
> {
  return getActivePrograms();
}

export async function fetchActiveProgramContext(
  gamification?: Pick<UserGamification, "current_program_id" | "current_level_id"> | null
) {
  const user = await getSessionUser();
  if (!user) return null;
  return getActiveProgramContext(user.id, gamification);
}

export async function selectProgram(programId: string): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const { data: program } = await supabase
    .from("programs")
    .select("id")
    .eq("id", programId)
    .eq("is_active", true)
    .single();

  if (!program) return { success: false, error: "Program not found" };

  await clearStaleProgressForProgramSwitch(user.id, programId);

  const { data: existing } = await supabase
    .from("user_gamification")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("user_gamification")
      .update({
        current_program_id: programId,
        current_level_id: null,
        shield_progress: {},
      })
      .eq("user_id", user.id);
  } else {
    await supabase.from("user_gamification").insert({
      user_id: user.id,
      current_program_id: programId,
      current_level_id: null,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/learning");
  revalidatePath("/placement-test");
  revalidatePath("/mock-tests");
  revalidatePath("/settings");

  return { success: true };
}

export async function selectProgramAndRedirect(programId: string): Promise<void> {
  const result = await selectProgram(programId);
  if (result.success) {
    redirect("/settings");
  }
}

export async function fetchLevelsForProgram(programId: string) {
  const supabase = await createClient();

  const { data: levels } = await supabase
    .from("levels")
    .select("id, slug, name, description, sort_order")
    .eq("program_id", programId)
    .eq("is_active", true)
    .order("sort_order");

  return levels ?? [];
}

export async function selectLevel(levelId: string): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const programId = await resolveProgramId(user.id);
  if (!programId) {
    return { success: false, error: "No program selected" };
  }

  const { data: level } = await supabase
    .from("levels")
    .select("id, program_id")
    .eq("id", levelId)
    .eq("is_active", true)
    .single();

  if (!level || level.program_id !== programId) {
    return { success: false, error: "Level not found" };
  }

  const { data: existing } = await supabase
    .from("user_gamification")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("user_gamification")
      .update({
        current_program_id: programId,
        current_level_id: levelId,
      })
      .eq("user_id", user.id);
  } else {
    await supabase.from("user_gamification").insert({
      user_id: user.id,
      current_program_id: programId,
      current_level_id: levelId,
    });
  }

  await initializeLessonUnlocks(user.id, levelId);

  revalidatePath("/dashboard");
  revalidatePath("/learning");
  revalidatePath("/mock-tests");
  revalidatePath("/settings");
  revalidatePath("/placement-test");

  return { success: true };
}
