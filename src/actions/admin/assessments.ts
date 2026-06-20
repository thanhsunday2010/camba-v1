"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";
import type { Json } from "@/types/database";
import type { AdminMockTest, AdminPlacementTest } from "@/lib/admin/types";
import { requireAdmin, revalidateAdmin } from "./_shared";
import {
  optionalInt,
  optionalStr,
  parseJsonField,
  str,
} from "@/lib/admin/form-utils";

export async function getAdminAssessments(): Promise<{
  placementTests: AdminPlacementTest[];
  mockTests: AdminMockTest[];
}> {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: placementTests }, { data: ptQuestions }, { data: mockTests }, { data: sections }, { data: mtQuestions }, { data: questions }] =
    await Promise.all([
      supabase.from("placement_tests").select("*").order("created_at"),
      supabase.from("placement_test_questions").select("*").order("sort_order"),
      supabase.from("mock_tests").select("*").order("created_at"),
      supabase.from("mock_test_sections").select("*").order("sort_order"),
      supabase.from("mock_test_questions").select("*").order("sort_order"),
      supabase.from("questions").select("id, question_text"),
    ]);

  const questionMap = new Map((questions ?? []).map((q) => [q.id, q.question_text]));

  const placement: AdminPlacementTest[] = (placementTests ?? []).map((pt) => ({
    ...pt,
    settings: (pt.settings ?? {}) as Record<string, unknown>,
    questions: (ptQuestions ?? [])
      .filter((pq) => pq.placement_test_id === pt.id)
      .map((pq) => ({
        id: pq.id,
        question_id: pq.question_id,
        sort_order: pq.sort_order,
        skill_weight: (pq.skill_weight ?? {}) as Record<string, number>,
        question_text: questionMap.get(pq.question_id) ?? pq.question_id,
      })),
  }));

  const mock: AdminMockTest[] = (mockTests ?? []).map((mt) => ({
    ...mt,
    settings: (mt.settings ?? {}) as Record<string, unknown>,
    sections: (sections ?? [])
      .filter((s) => s.mock_test_id === mt.id)
      .map((s) => ({
        id: s.id,
        title: s.title,
        skill_id: s.skill_id,
        sort_order: s.sort_order,
        time_limit_minutes: s.time_limit_minutes,
        questions: (mtQuestions ?? [])
          .filter((mq) => mq.mock_test_section_id === s.id)
          .map((mq) => ({
            id: mq.id,
            question_id: mq.question_id,
            sort_order: mq.sort_order,
            points: mq.points,
            question_text: questionMap.get(mq.question_id) ?? mq.question_id,
          })),
      })),
  }));

  return { placementTests: placement, mockTests: mock };
}

// --- Placement Tests ---
export async function createPlacementTest(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("placement_tests")
    .insert({
      program_id: str(formData, "programId"),
      title: str(formData, "title"),
      description: optionalStr(formData, "description"),
      question_count: optionalInt(formData, "questionCount") ?? 0,
      time_limit_minutes: optionalInt(formData, "timeLimitMinutes"),
      is_active: formData.get("isActive") === "true",
      settings: {} as Json,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true, data: { id: data.id } };
}

export async function updatePlacementTest(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("placement_tests")
    .update({
      title: str(formData, "title"),
      description: optionalStr(formData, "description"),
      question_count: optionalInt(formData, "questionCount") ?? 0,
      time_limit_minutes: optionalInt(formData, "timeLimitMinutes"),
      is_active: formData.get("isActive") === "true",
    })
    .eq("id", str(formData, "id"));

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function deletePlacementTest(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("placement_tests").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function addPlacementTestQuestion(
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const placementTestId = str(formData, "placementTestId");
  const questionId = str(formData, "questionId");
  const skillWeight = parseJsonField<Record<string, number>>(
    formData.get("skillWeight"),
    {}
  );

  const { data: existing } = await supabase
    .from("placement_test_questions")
    .select("sort_order")
    .eq("placement_test_id", placementTestId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const { error } = await supabase.from("placement_test_questions").insert({
    placement_test_id: placementTestId,
    question_id: questionId,
    sort_order: (existing?.[0]?.sort_order ?? -1) + 1,
    skill_weight: skillWeight as Json,
  });

  if (error) return { success: false, error: error.message };

  const { count } = await supabase
    .from("placement_test_questions")
    .select("*", { count: "exact", head: true })
    .eq("placement_test_id", placementTestId);

  await supabase
    .from("placement_tests")
    .update({ question_count: count ?? 0 })
    .eq("id", placementTestId);

  await revalidateAdmin();
  return { success: true };
}

export async function removePlacementTestQuestion(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: row } = await supabase
    .from("placement_test_questions")
    .select("placement_test_id")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("placement_test_questions").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  if (row) {
    const { count } = await supabase
      .from("placement_test_questions")
      .select("*", { count: "exact", head: true })
      .eq("placement_test_id", row.placement_test_id);
    await supabase
      .from("placement_tests")
      .update({ question_count: count ?? 0 })
      .eq("id", row.placement_test_id);
  }

  await revalidateAdmin();
  return { success: true };
}

// --- Mock Tests ---
export async function createMockTest(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mock_tests")
    .insert({
      program_id: str(formData, "programId"),
      level_id: optionalStr(formData, "levelId"),
      title: str(formData, "title"),
      description: optionalStr(formData, "description"),
      time_limit_minutes: optionalInt(formData, "timeLimitMinutes") ?? 60,
      total_score: optionalInt(formData, "totalScore") ?? 100,
      is_active: formData.get("isActive") === "true",
      settings: {} as Json,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true, data: { id: data.id } };
}

export async function updateMockTest(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("mock_tests")
    .update({
      title: str(formData, "title"),
      description: optionalStr(formData, "description"),
      level_id: optionalStr(formData, "levelId"),
      time_limit_minutes: optionalInt(formData, "timeLimitMinutes") ?? 60,
      total_score: optionalInt(formData, "totalScore") ?? 100,
      is_active: formData.get("isActive") === "true",
    })
    .eq("id", str(formData, "id"));

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function deleteMockTest(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("mock_tests").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function createMockTestSection(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const supabase = await createClient();
  const mockTestId = str(formData, "mockTestId");

  const { data: existing } = await supabase
    .from("mock_test_sections")
    .select("sort_order")
    .eq("mock_test_id", mockTestId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const { data, error } = await supabase
    .from("mock_test_sections")
    .insert({
      mock_test_id: mockTestId,
      title: str(formData, "title"),
      skill_id: optionalStr(formData, "skillId"),
      time_limit_minutes: optionalInt(formData, "timeLimitMinutes"),
      sort_order: (existing?.[0]?.sort_order ?? -1) + 1,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true, data: { id: data.id } };
}

export async function deleteMockTestSection(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("mock_test_sections").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function addMockTestQuestion(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const sectionId = str(formData, "sectionId");

  const { data: existing } = await supabase
    .from("mock_test_questions")
    .select("sort_order")
    .eq("mock_test_section_id", sectionId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const { error } = await supabase.from("mock_test_questions").insert({
    mock_test_section_id: sectionId,
    question_id: str(formData, "questionId"),
    sort_order: (existing?.[0]?.sort_order ?? -1) + 1,
    points: optionalInt(formData, "points") ?? 1,
  });

  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function removeMockTestQuestion(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("mock_test_questions").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}
