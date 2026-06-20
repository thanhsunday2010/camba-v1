"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifyTeacherOwnsClass } from "@/lib/queries/teacher";
import type { ActionResult } from "@/types";

export async function createAssignment(
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const classId = formData.get("classId") as string;
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const targetType = formData.get("targetType") as string;
  const targetId = formData.get("targetId") as string;
  const dueDate = (formData.get("dueDate") as string) || null;

  if (!classId || !title || !targetId) {
    return { success: false, error: "Missing required fields" };
  }

  const ownsClass = await verifyTeacherOwnsClass(user.id, classId);
  if (!ownsClass) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("assignments").insert({
    class_id: classId,
    teacher_id: user.id,
    title,
    description,
    lesson_id: targetType === "lesson" ? targetId : null,
    mock_test_id: targetType === "mock_test" ? targetId : null,
    due_date: dueDate ? new Date(dueDate).toISOString() : null,
    is_active: true,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/teacher/classes/${classId}`);
  return { success: true };
}

export async function deactivateAssignment(assignmentId: string): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const { data: assignment } = await supabase
    .from("assignments")
    .select("class_id, teacher_id")
    .eq("id", assignmentId)
    .single();

  if (!assignment || assignment.teacher_id !== user.id) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("assignments")
    .update({ is_active: false })
    .eq("id", assignmentId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/teacher/classes/${assignment.class_id}`);
  return { success: true };
}
