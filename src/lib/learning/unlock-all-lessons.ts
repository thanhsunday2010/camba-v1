import { isAdmin } from "@/lib/auth/roles";
import type { AuthUser } from "@/types";
import type { UserRole } from "@/types/database";

/**
 * Temporary content QA: unlock every lesson in the active level.
 * Set NEXT_PUBLIC_UNLOCK_ALL_LESSONS=true — remove or set false for sequential unlock.
 */
export function isUnlockAllLessonsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_UNLOCK_ALL_LESSONS === "true";
}

/** Admins and Super Admins can browse all lessons without sequential unlock. */
export function canBypassLessonUnlock(
  roles: UserRole[],
  isSuperAdmin = false
): boolean {
  return isSuperAdmin || isAdmin(roles);
}

export function canBypassLessonUnlockForUser(
  user: Pick<AuthUser, "roles" | "isSuperAdmin" | "adminPermissions">
): boolean {
  if (user.isSuperAdmin || isAdmin(user.roles)) return true;
  return user.adminPermissions.length > 0;
}

export function shouldUnlockAllLessons(options?: {
  roles?: UserRole[];
  isSuperAdmin?: boolean;
  bypassUnlock?: boolean;
}): boolean {
  if (isUnlockAllLessonsEnabled()) return true;
  if (options?.bypassUnlock) return true;
  if (options?.roles && canBypassLessonUnlock(options.roles, options.isSuperAdmin)) {
    return true;
  }
  return false;
}

export function mergeLessonProgressWithBypass<
  T extends {
    completion_percent?: number | null;
    accuracy_percent?: number | null;
    mastery_level?: number | null;
    is_unlocked?: boolean | null;
    attempts_count?: number | null;
  },
>(
  progress: T | undefined | null,
  bypassUnlock: boolean
): {
  completion_percent: number;
  accuracy_percent: number;
  mastery_level: number;
  is_unlocked: boolean;
  attempts_count: number;
} | undefined {
  if (!bypassUnlock) {
    if (!progress) return undefined;
    return {
      completion_percent: Number(progress.completion_percent ?? 0),
      accuracy_percent: Number(progress.accuracy_percent ?? 0),
      mastery_level: progress.mastery_level ?? 0,
      is_unlocked: progress.is_unlocked === true,
      attempts_count: progress.attempts_count ?? 0,
    };
  }

  return {
    completion_percent: Number(progress?.completion_percent ?? 0),
    accuracy_percent: Number(progress?.accuracy_percent ?? 0),
    mastery_level: progress?.mastery_level ?? 0,
    is_unlocked: true,
    attempts_count: progress?.attempts_count ?? 0,
  };
}
