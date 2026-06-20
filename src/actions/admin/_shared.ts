"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/actions/auth";
import { isAdmin } from "@/lib/auth/roles";

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !isAdmin(user.roles)) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function revalidateAdmin() {
  revalidatePath("/admin");
}

export async function nextSortOrder(
  table: "levels" | "skills" | "units" | "lessons" | "exercises" | "questions",
  parentColumn: string,
  parentId: string
): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase
    .from(table)
    .select("sort_order")
    .eq(parentColumn, parentId)
    .order("sort_order", { ascending: false })
    .limit(1);
  return (data?.[0]?.sort_order ?? -1) + 1;
}
