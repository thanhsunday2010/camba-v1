"use server";

import { createClient } from "@/lib/supabase/server";
import { upsertProgramSetting } from "@/lib/programs/settings";
import type { ActionResult } from "@/types";
import type { Json } from "@/types/database";
import {
  nextSortOrder,
  requireAdmin,
  revalidateAdmin,
} from "./_shared";
import {
  optionalStr,
  parseJsonField,
  str,
} from "@/lib/admin/form-utils";

export async function createProgram(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const supabase = await createClient();

  const name = str(formData, "name");
  const slug = str(formData, "slug").toLowerCase();
  const description = optionalStr(formData, "description");

  if (!name || !slug) return { success: false, error: "Name and slug required" };

  const { data, error } = await supabase
    .from("programs")
    .insert({
      name,
      slug,
      description,
      is_active: true,
      settings: {} as Json,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  await upsertProgramSetting(
    data.id,
    "mastery_unlock_threshold",
    3,
    "Mastery level required to unlock next lesson"
  );

  await revalidateAdmin();
  return { success: true, data: { id: data.id } };
}

export async function updateProgram(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const settings = parseJsonField<Record<string, unknown>>(
    formData.get("settings"),
    {}
  );

  const { error } = await supabase
    .from("programs")
    .update({
      name: str(formData, "name"),
      slug: str(formData, "slug").toLowerCase(),
      description: optionalStr(formData, "description"),
      icon_url: optionalStr(formData, "iconUrl"),
      cover_url: optionalStr(formData, "coverUrl"),
      sort_order: parseInt(str(formData, "sortOrder") || "0", 10),
      is_active: formData.get("isActive") === "true",
      settings: settings as Json,
    })
    .eq("id", str(formData, "id"));

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function deleteProgram(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("programs").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function createLevel(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const supabase = await createClient();

  const programId = str(formData, "programId");
  const name = str(formData, "name");
  const slug = str(formData, "slug").toLowerCase();
  const description = optionalStr(formData, "description");

  if (!programId || !name || !slug) {
    return { success: false, error: "Program, name and slug required" };
  }

  const { data, error } = await supabase
    .from("levels")
    .insert({
      program_id: programId,
      name,
      slug,
      description,
      sort_order: await nextSortOrder("levels", "program_id", programId),
      is_active: true,
      metadata: {} as Json,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true, data: { id: data.id } };
}

export async function updateLevel(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("levels")
    .update({
      name: str(formData, "name"),
      slug: str(formData, "slug").toLowerCase(),
      description: optionalStr(formData, "description"),
      is_active: formData.get("isActive") === "true",
    })
    .eq("id", str(formData, "id"));

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function deleteLevel(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("levels").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function updateProgramStatus(
  programId: string,
  isActive: boolean
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("programs")
    .update({ is_active: isActive })
    .eq("id", programId);

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}
