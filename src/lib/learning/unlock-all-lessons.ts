/**
 * Temporary content QA: unlock every lesson in the active level.
 * Set NEXT_PUBLIC_UNLOCK_ALL_LESSONS=true — remove or set false for sequential unlock.
 */
export function isUnlockAllLessonsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_UNLOCK_ALL_LESSONS === "true";
}
