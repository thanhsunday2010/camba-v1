import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/roles";
import type { UserRole } from "@/types/database";

/**
 * Temporary content QA: unlock every lesson in the active level.
 * Set NEXT_PUBLIC_UNLOCK_ALL_LESSONS=true — remove or set false for sequential unlock.
 */
export function isUnlockAllLessonsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_UNLOCK_ALL_LESSONS === "true";
}

/** Admins can browse all lessons without sequential unlock requirements. */
export function canBypassLessonUnlock(roles: UserRole[]): boolean {
  return isAdmin(roles);
}

export const userCanBypassLessonUnlock = cache(async (userId: string): Promise<boolean> => {
  const supabase = await createClient();
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  return canBypassLessonUnlock((roles?.map((row) => row.role) ?? []) as UserRole[]);
});

export function shouldUnlockAllLessons(options?: {
  roles?: UserRole[];
  bypassUnlock?: boolean;
}): boolean {
  if (isUnlockAllLessonsEnabled()) return true;
  if (options?.bypassUnlock) return true;
  if (options?.roles && canBypassLessonUnlock(options.roles)) return true;
  return false;
}
