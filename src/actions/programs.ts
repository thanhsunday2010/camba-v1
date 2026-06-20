"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveProgramContext } from "@/lib/programs/context";
import { getActivePrograms } from "@/lib/queries/user";
import { clearStaleProgressForProgramSwitch } from "@/lib/programs/progress-cleanup";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types";
import type { Program } from "@/types/database";

export async function fetchAvailablePrograms(): Promise<
  Pick<Program, "id" | "slug" | "name" | "description">[]
> {
  return getActivePrograms();
}

export async function fetchActiveProgramContext() {
  const user = await getSessionUser();
  if (!user) return null;
  return getActiveProgramContext(user.id);
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
    redirect("/placement-test");
  }
}
