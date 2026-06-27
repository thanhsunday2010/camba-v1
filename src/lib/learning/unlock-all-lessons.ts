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

export function shouldUnlockAllLessons(options?: {
  roles?: UserRole[];
  bypassUnlock?: boolean;
}): boolean {
  if (isUnlockAllLessonsEnabled()) return true;
  if (options?.bypassUnlock) return true;
  if (options?.roles && canBypassLessonUnlock(options.roles)) return true;
  return false;
}
