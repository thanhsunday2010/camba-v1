"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";
import type { ContentStatus, ExerciseType, Json } from "@/types/database";
import type {
  AdminContentTree,
  AdminExercise,
  AdminQuestion,
} from "@/lib/admin/types";
import {
  nextSortOrder,
  requireAdmin,
  revalidateAdmin,
} from "./_shared";
import {
  optionalInt,
  optionalStr,
  parseJsonField,
  str,
} from "@/lib/admin/form-utils";

export async function getAdminContentTree(): Promise<AdminContentTree> {
  await requireAdmin();
  const supabase = await createClient();

  const [
    { data: programs },
    { data: levels },
    { data: skills },
    { data: units },
    { data: lessons },
    { data: exercises },
    { data: questions },
    { data: choices },
    { data: pairs },
  ] = await Promise.all([
    supabase.from("programs").select("*").order("sort_order"),
    supabase.from("levels").select("*").order("sort_order"),
    supabase.from("skills").select("*").order("sort_order"),
    supabase.from("units").select("*").order("sort_order"),
    supabase.from("lessons").select("*").order("sort_order"),
    supabase.from("exercises").select("*").order("sort_order"),
    supabase.from("questions").select("*").order("sort_order"),
    supabase.from("choices").select("*").order("sort_order"),
    supabase.from("question_pairs").select("*").order("sort_order"),
  ]);

  const questionsWithRelations: AdminQuestion[] = (questions ?? []).map((q) => ({
    ...q,
    content: (q.content ?? {}) as Record<string, unknown>,
    choices: (choices ?? []).filter((c) => c.question_id === q.id),
    pairs: (pairs ?? []).filter((p) => p.question_id === q.id),
  }));

  return {
    programs: (programs ?? []).map((p) => ({
      ...p,
      settings: (p.settings ?? {}) as Record<string, unknown>,
    })),
    levels: levels ?? [],
    skills: skills ?? [],
    units: units ?? [],
    lessons: lessons ?? [],
    exercises: (exercises ?? []).map((e) => ({
      ...e,
      content: (e.content ?? {}) as Record<string, unknown>,
    })),
    questions: questionsWithRelations,
  };
}

export async function getPendingReviewExercises(): Promise<AdminExercise[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("exercises")
    .select("*")
    .eq("status", "pending_review")
    .order("updated_at", { ascending: false });
  return (data ?? []).map((e) => ({
    ...e,
    content: (e.content ?? {}) as Record<string, unknown>,
  }));
}

// --- Skills ---
export async function createSkill(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const supabase = await createClient();
  const levelId = str(formData, "levelId");
  const name = str(formData, "name");
  const slug = str(formData, "slug").toLowerCase();
  const description = optionalStr(formData, "description");

  const { data, error } = await supabase
    .from("skills")
    .insert({
      level_id: levelId,
      slug,
      name,
      description,
      sort_order: await nextSortOrder("skills", "level_id", levelId),
      is_active: true,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true, data: { id: data.id } };
}

export async function updateSkill(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const id = str(formData, "id");

  const { error } = await supabase
    .from("skills")
    .update({
      name: str(formData, "name"),
      slug: str(formData, "slug").toLowerCase(),
      description: optionalStr(formData, "description"),
      icon: optionalStr(formData, "icon"),
      is_active: formData.get("isActive") === "true",
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

// --- Units ---
export async function createUnit(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const supabase = await createClient();
  const skillId = str(formData, "skillId");
  const title = str(formData, "title");
  const slug = str(formData, "slug").toLowerCase();

  const { data, error } = await supabase
    .from("units")
    .insert({
      skill_id: skillId,
      slug,
      title,
      description: optionalStr(formData, "description"),
      unlock_after_unit_id: optionalStr(formData, "unlockAfterUnitId"),
      sort_order: await nextSortOrder("units", "skill_id", skillId),
      is_active: true,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true, data: { id: data.id } };
}

export async function updateUnit(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const id = str(formData, "id");

  const { error } = await supabase
    .from("units")
    .update({
      title: str(formData, "title"),
      slug: str(formData, "slug").toLowerCase(),
      description: optionalStr(formData, "description"),
      unlock_after_unit_id: optionalStr(formData, "unlockAfterUnitId"),
      is_active: formData.get("isActive") === "true",
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function deleteUnit(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("units").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

// --- Lessons ---
export async function createLesson(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const supabase = await createClient();
  const unitId = str(formData, "unitId");

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      unit_id: unitId,
      slug: str(formData, "slug").toLowerCase(),
      title: str(formData, "title"),
      description: optionalStr(formData, "description"),
      estimated_minutes: optionalInt(formData, "estimatedMinutes") ?? 15,
      unlock_after_lesson_id: optionalStr(formData, "unlockAfterLessonId"),
      sort_order: await nextSortOrder("lessons", "unit_id", unitId),
      is_active: true,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true, data: { id: data.id } };
}

export async function updateLesson(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const id = str(formData, "id");

  const { error } = await supabase
    .from("lessons")
    .update({
      title: str(formData, "title"),
      slug: str(formData, "slug").toLowerCase(),
      description: optionalStr(formData, "description"),
      estimated_minutes: optionalInt(formData, "estimatedMinutes") ?? 15,
      unlock_after_lesson_id: optionalStr(formData, "unlockAfterLessonId"),
      is_active: formData.get("isActive") === "true",
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function deleteLesson(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

// --- Exercises ---
export async function createExercise(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const supabase = await createClient();
  const lessonId = str(formData, "lessonId");
  const exerciseType = str(formData, "exerciseType") as ExerciseType;
  const content = parseJsonField<Record<string, unknown>>(
    formData.get("content"),
    {}
  );

  const { data, error } = await supabase
    .from("exercises")
    .insert({
      lesson_id: lessonId,
      slug: str(formData, "slug").toLowerCase(),
      title: str(formData, "title"),
      instructions: optionalStr(formData, "instructions"),
      exercise_type: exerciseType,
      content: content as Json,
      max_score: optionalInt(formData, "maxScore") ?? 100,
      time_limit_seconds: optionalInt(formData, "timeLimitSeconds"),
      sort_order: await nextSortOrder("exercises", "lesson_id", lessonId),
      status: "draft",
      is_active: false,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true, data: { id: data.id } };
}

export async function updateExercise(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const id = str(formData, "id");
  const content = parseJsonField<Record<string, unknown>>(
    formData.get("content"),
    {}
  );

  const { error } = await supabase
    .from("exercises")
    .update({
      title: str(formData, "title"),
      slug: str(formData, "slug").toLowerCase(),
      instructions: optionalStr(formData, "instructions"),
      exercise_type: str(formData, "exerciseType") as ExerciseType,
      content: content as Json,
      max_score: optionalInt(formData, "maxScore") ?? 100,
      time_limit_seconds: optionalInt(formData, "timeLimitSeconds"),
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function deleteExercise(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("exercises").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function updateExerciseStatus(
  exerciseId: string,
  status: ContentStatus
): Promise<ActionResult> {
  const user = await requireAdmin();
  const supabase = await createClient();

  const base = {
    status,
    is_active: status === "published",
  };

  const { error } =
    status === "published"
      ? await supabase
          .from("exercises")
          .update({
            ...base,
            approved_by: user.id,
            approved_at: new Date().toISOString(),
          })
          .eq("id", exerciseId)
      : status === "pending_review"
        ? await supabase
            .from("exercises")
            .update({ ...base, is_active: false })
            .eq("id", exerciseId)
        : await supabase
            .from("exercises")
            .update({
              ...base,
              is_active: false,
              approved_by: null,
              approved_at: null,
            })
            .eq("id", exerciseId);

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function submitExerciseForReview(exerciseId: string): Promise<ActionResult> {
  return updateExerciseStatus(exerciseId, "pending_review");
}

// Legacy createQuestion kept for backward compat — delegates to questions.ts pattern inline
export async function createQuestion(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const { saveQuestion } = await import("./questions");
  return saveQuestion(formData);
}
