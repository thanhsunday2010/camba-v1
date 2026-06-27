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
  requirePermission,
  revalidateAdmin,
} from "./_shared";
import {
  optionalInt,
  optionalStr,
  parseJsonField,
  str,
} from "@/lib/admin/form-utils";
import { QUESTION_BANK_METADATA_KEY } from "@/lib/admin/constants";

export async function getAdminContentTree(): Promise<AdminContentTree> {
  await requirePermission("content.read");
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
      metadata: (e.metadata ?? {}) as Record<string, unknown>,
    })),
    questions: questionsWithRelations,
  };
}

export async function getPendingReviewExercises(): Promise<AdminExercise[]> {
  await requirePermission("content.read");
  const supabase = await createClient();
  const { data } = await supabase
    .from("exercises")
    .select("*")
    .eq("status", "pending_review")
    .order("updated_at", { ascending: false });
  return (data ?? []).map((e) => ({
    ...e,
    content: (e.content ?? {}) as Record<string, unknown>,
    metadata: (e.metadata ?? {}) as Record<string, unknown>,
  }));
}

// --- Skills ---
export async function createSkill(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requirePermission("content.write");
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
  await requirePermission("content.write");
  const supabase = await createClient();
  const id = str(formData, "id");

  const { error } = await supabase
    .from("skills")
    .update({
      name: str(formData, "name"),
      slug: str(formData, "slug").toLowerCase(),
      description: optionalStr(formData, "description"),
      icon: optionalStr(formData, "icon"),
      sort_order: optionalInt(formData, "sortOrder") ?? undefined,
      is_active: formData.get("isActive") === "true",
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  await requirePermission("content.delete");
  const supabase = await createClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

// --- Units ---
export async function createUnit(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requirePermission("content.write");
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
  await requirePermission("content.write");
  const supabase = await createClient();
  const id = str(formData, "id");

  const { error } = await supabase
    .from("units")
    .update({
      title: str(formData, "title"),
      slug: str(formData, "slug").toLowerCase(),
      description: optionalStr(formData, "description"),
      unlock_after_unit_id: optionalStr(formData, "unlockAfterUnitId"),
      sort_order: optionalInt(formData, "sortOrder") ?? undefined,
      is_active: formData.get("isActive") === "true",
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function deleteUnit(id: string): Promise<ActionResult> {
  await requirePermission("content.delete");
  const supabase = await createClient();
  const { error } = await supabase.from("units").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

// --- Lessons ---
export async function createLesson(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requirePermission("content.write");
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
  await requirePermission("content.write");
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
      sort_order: optionalInt(formData, "sortOrder") ?? undefined,
      is_active: formData.get("isActive") === "true",
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function deleteLesson(id: string): Promise<ActionResult> {
  await requirePermission("content.delete");
  const supabase = await createClient();
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

// --- Exercises ---
export async function createExercise(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requirePermission("content.write");
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
  await requirePermission("content.write");
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
      sort_order: optionalInt(formData, "sortOrder") ?? undefined,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function deleteExercise(id: string): Promise<ActionResult> {
  await requirePermission("content.delete");
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
  const user =
    status === "published"
      ? await requirePermission("workflow.publish")
      : status === "pending_review"
        ? await requirePermission("workflow.review")
        : await requirePermission("content.write");
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

async function ensureQuestionBankLesson(programId: string): Promise<string> {
  const supabase = await createClient();

  const { data: existingLevel } = await supabase
    .from("levels")
    .select("id")
    .eq("program_id", programId)
    .eq("slug", "internal")
    .maybeSingle();

  let levelId = existingLevel?.id;
  if (!levelId) {
    const { data: level, error } = await supabase
      .from("levels")
      .insert({
        program_id: programId,
        slug: "internal",
        name: "Internal",
        description: "Internal content containers",
        sort_order: 9999,
        is_active: false,
        metadata: { internal: true } as Json,
      })
      .select("id")
      .single();
    if (error || !level) throw new Error(error?.message ?? "Failed to create internal level");
    levelId = level.id;
  }

  const { data: existingSkill } = await supabase
    .from("skills")
    .select("id")
    .eq("level_id", levelId)
    .eq("slug", "question-banks")
    .maybeSingle();

  let skillId = existingSkill?.id;
  if (!skillId) {
    const { data: skill, error } = await supabase
      .from("skills")
      .insert({
        level_id: levelId,
        slug: "question-banks",
        name: "Question Banks",
        description: "Shared reusable question pools",
        sort_order: 0,
        is_active: false,
        metadata: { internal: true } as Json,
      })
      .select("id")
      .single();
    if (error || !skill) throw new Error(error?.message ?? "Failed to create question bank skill");
    skillId = skill.id;
  }

  const { data: existingUnit } = await supabase
    .from("units")
    .select("id")
    .eq("skill_id", skillId)
    .eq("slug", "shared-pool")
    .maybeSingle();

  let unitId = existingUnit?.id;
  if (!unitId) {
    const { data: unit, error } = await supabase
      .from("units")
      .insert({
        skill_id: skillId,
        slug: "shared-pool",
        title: "Shared Pool",
        description: "Container for question bank exercises",
        sort_order: 0,
        is_active: false,
        metadata: { internal: true } as Json,
      })
      .select("id")
      .single();
    if (error || !unit) throw new Error(error?.message ?? "Failed to create question bank unit");
    unitId = unit.id;
  }

  const { data: existingLesson } = await supabase
    .from("lessons")
    .select("id")
    .eq("unit_id", unitId)
    .eq("slug", "question-bank-container")
    .maybeSingle();

  if (existingLesson?.id) return existingLesson.id;

  const { data: lesson, error } = await supabase
    .from("lessons")
    .insert({
      unit_id: unitId,
      slug: "question-bank-container",
      title: "Question Bank Container",
      description: "Holds reusable question bank exercises",
      sort_order: 0,
      estimated_minutes: 0,
      is_active: false,
      metadata: { internal: true } as Json,
    })
    .select("id")
    .single();

  if (error || !lesson) throw new Error(error?.message ?? "Failed to create question bank lesson");
  return lesson.id;
}

export async function createQuestionBank(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("content.write");
  const supabase = await createClient();

  const programId = str(formData, "programId");
  const title = str(formData, "title");
  const slug = str(formData, "slug").toLowerCase();
  const exerciseType = str(formData, "exerciseType") as ExerciseType;

  if (!programId || !title || !slug) {
    return { success: false, error: "Program, title and slug required" };
  }

  try {
    const lessonId = await ensureQuestionBankLesson(programId);

    const { data, error } = await supabase
      .from("exercises")
      .insert({
        lesson_id: lessonId,
        slug,
        title,
        instructions: optionalStr(formData, "instructions"),
        exercise_type: exerciseType,
        content: {} as Json,
        metadata: { [QUESTION_BANK_METADATA_KEY]: true } as Json,
        max_score: 100,
        sort_order: await nextSortOrder("exercises", "lesson_id", lessonId),
        status: "published",
        is_active: true,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (error || !data) return { success: false, error: error?.message ?? "Failed" };

    await revalidateAdmin();
    return { success: true, data: { id: data.id } };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create question bank",
    };
  }
}

// Legacy createQuestion kept for backward compat — delegates to questions.ts pattern inline
export async function createQuestion(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const { saveQuestion } = await import("./questions");
  return saveQuestion(formData);
}
