import { getAdminContentTree, getPendingReviewExercises } from "@/actions/admin/content";

export async function loadAdminContentBundle() {
  const [content, pendingExercises] = await Promise.all([
    getAdminContentTree(),
    getPendingReviewExercises(),
  ]);
  return { content, pendingExercises };
}
