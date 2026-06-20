"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getTeacherClasses, getClassDetail } from "@/lib/queries/teacher";
import { resolveProgramId } from "@/lib/programs/context";
import type { ActionResult } from "@/types";

export async function fetchTeacherClasses() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  return getTeacherClasses(user.id);
}

export async function fetchClassDetail(classId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return getClassDetail(classId, user.id);
}

export async function createClass(formData: FormData): Promise<ActionResult<{ classId: string }>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const programId =
    (formData.get("programId") as string) || (await resolveProgramId(user.id));

  if (!name) return { success: false, error: "Class name is required" };
  if (!programId) return { success: false, error: "Program is required" };

  const { data, error } = await supabase
    .from("classes")
    .insert({
      teacher_id: user.id,
      name,
      description,
      program_id: programId,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/teacher");
  return { success: true, data: { classId: data.id } };
}

export async function joinClassByCode(code: string): Promise<ActionResult<{ classId: string }>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const { data, error } = await supabase.rpc("join_class_by_code", {
    code: code.trim(),
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/settings");
  return { success: true, data: { classId: data as string } };
}
