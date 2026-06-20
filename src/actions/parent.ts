"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  getLinkedStudents,
  getStudentProgressSummary,
  verifyParentAccess,
} from "@/lib/queries/parent";
import type { ActionResult } from "@/types";

export async function inviteStudentByEmail(
  email: string
): Promise<ActionResult<{ studentId: string }>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const { data, error } = await supabase.rpc("invite_student_by_email", {
    student_email: email.trim(),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/parent");

  const result = data as { linkId: string; studentId: string };
  return { success: true, data: { studentId: result.studentId } };
}

export async function fetchLinkedStudents() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  return getLinkedStudents(user.id);
}

export async function fetchStudentProgress(studentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const hasAccess = await verifyParentAccess(user.id, studentId);
  if (!hasAccess) return null;

  return getStudentProgressSummary(studentId);
}

export async function respondToParentLink(
  linkId: string,
  accept: boolean
): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.rpc("respond_to_parent_link", {
    link_id: linkId,
    accept,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/settings");
  revalidatePath("/parent");
  return { success: true };
}
