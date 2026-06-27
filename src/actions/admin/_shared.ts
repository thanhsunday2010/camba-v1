"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { isAdmin } from "@/lib/auth/roles";
import {
  canAccess,
  type AdminPermission,
} from "@/lib/auth/admin-permissions";
import type { AuthUser } from "@/types";

export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user || !isAdmin(user.roles)) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requirePermission(
  permission: AdminPermission
): Promise<AuthUser> {
  const user = await requireAdmin();
  if (!canAccess(user, permission)) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAnyPermission(
  ...permissions: AdminPermission[]
): Promise<AuthUser> {
  const user = await requireAdmin();
  if (user.isSuperAdmin) return user;
  if (permissions.some((p) => canAccess(user, p))) return user;
  throw new Error("Unauthorized");
}

export async function revalidateAdmin() {
  revalidatePath("/admin", "layout");
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
