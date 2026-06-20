"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";
import type { Json, QuestionType } from "@/types/database";
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

interface ChoiceInput {
  text: string;
  isCorrect: boolean;
}

interface PairInput {
  leftText: string;
  rightText: string;
}

export async function saveQuestion(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const supabase = await createClient();

  const id = optionalStr(formData, "id");
  const exerciseId = str(formData, "exerciseId");
  const questionType = str(formData, "questionType") as QuestionType;
  const content = parseJsonField<Record<string, unknown>>(
    formData.get("content"),
    {}
  );
  const choices = parseJsonField<ChoiceInput[]>(formData.get("choices"), []);
  const pairs = parseJsonField<PairInput[]>(formData.get("pairs"), []);

  const payload = {
    question_text: str(formData, "questionText"),
    question_type: questionType,
    explanation: optionalStr(formData, "explanation"),
    media_url: optionalStr(formData, "mediaUrl"),
    points: optionalInt(formData, "points") ?? 1,
    content: content as Json,
  };

  let questionId = id;

  if (id) {
    const { error } = await supabase.from("questions").update(payload).eq("id", id);
    if (error) return { success: false, error: error.message };
  } else {
    const { data, error } = await supabase
      .from("questions")
      .insert({
        ...payload,
        exercise_id: exerciseId,
        sort_order: await nextSortOrder("questions", "exercise_id", exerciseId),
      })
      .select("id")
      .single();
    if (error || !data) return { success: false, error: error?.message ?? "Failed" };
    questionId = data.id;
  }

  if (!questionId) return { success: false, error: "Question ID missing" };

  await supabase.from("choices").delete().eq("question_id", questionId);
  await supabase.from("question_pairs").delete().eq("question_id", questionId);

  if (choices.length > 0) {
    const { error } = await supabase.from("choices").insert(
      choices.map((c, i) => ({
        question_id: questionId!,
        text: c.text,
        is_correct: c.isCorrect,
        sort_order: i,
      }))
    );
    if (error) return { success: false, error: error.message };
  }

  if (pairs.length > 0) {
    const { error } = await supabase.from("question_pairs").insert(
      pairs.map((p, i) => ({
        question_id: questionId!,
        left_text: p.leftText,
        right_text: p.rightText,
        sort_order: i,
      }))
    );
    if (error) return { success: false, error: error.message };
  }

  await revalidateAdmin();
  return { success: true, data: { id: questionId } };
}

export async function deleteQuestion(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("questions").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  await revalidateAdmin();
  return { success: true };
}

export async function reorderQuestion(
  questionId: string,
  direction: "up" | "down"
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: current } = await supabase
    .from("questions")
    .select("id, exercise_id, sort_order")
    .eq("id", questionId)
    .single();

  if (!current) return { success: false, error: "Question not found" };

  const { data: siblings } = await supabase
    .from("questions")
    .select("id, sort_order")
    .eq("exercise_id", current.exercise_id)
    .order("sort_order");

  const idx = siblings?.findIndex((s) => s.id === questionId) ?? -1;
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (!siblings || idx < 0 || swapIdx < 0 || swapIdx >= siblings.length) {
    return { success: false, error: "Cannot reorder" };
  }

  const a = siblings[idx];
  const b = siblings[swapIdx];

  await supabase.from("questions").update({ sort_order: b.sort_order }).eq("id", a.id);
  await supabase.from("questions").update({ sort_order: a.sort_order }).eq("id", b.id);

  await revalidateAdmin();
  return { success: true };
}
