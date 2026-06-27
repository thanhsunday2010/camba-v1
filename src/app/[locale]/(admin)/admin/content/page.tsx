import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  canAccess,
  canAccessAdminModule,
  CONTENT_MODULE_PERMISSIONS,
} from "@/lib/auth/admin-permissions";
import { getAdminContentTree, getPendingReviewExercises } from "@/actions/admin/content";
import { AdminModuleHub } from "@/components/admin/shell/admin-module-hub";
import { filterModuleCards } from "@/components/admin/shell/admin-sidebar";
import { CONTENT_MODULE_CARDS } from "@/lib/admin/nav-config";
import { formatCompactNumber } from "@/lib/admin/analytics/format";
import type { AdminContentTree } from "@/lib/admin/types";

const EMPTY_CONTENT_TREE: AdminContentTree = {
  programs: [],
  levels: [],
  skills: [],
  units: [],
  lessons: [],
  exercises: [],
  questions: [],
};

export default async function AdminContentHubPage() {
  const user = await getCurrentUser();
  if (!user || !canAccessAdminModule(user, CONTENT_MODULE_PERMISSIONS)) {
    redirect("/admin");
  }

  const canReadTree = canAccess(user, "content.read");
  const canReview = canAccess(user, "workflow.review");

  const [content, pendingExercises] = await Promise.all([
    canReadTree ? getAdminContentTree() : Promise.resolve(EMPTY_CONTENT_TREE),
    canReview ? getPendingReviewExercises() : Promise.resolve([]),
  ]);

  const cards = filterModuleCards(user, CONTENT_MODULE_CARDS).map((card) => ({
    ...card,
    stat:
      card.id === "programs"
        ? `${formatCompactNumber(content.programs.length)} chương trình`
        : card.id === "lessons"
          ? `${formatCompactNumber(content.lessons.length)} bài học`
          : card.id === "exercises"
            ? `${formatCompactNumber(content.exercises.length)} bài tập`
            : undefined,
    badge: card.id === "review" ? pendingExercises.length : undefined,
  }));

  return (
    <AdminModuleHub
      title="Học liệu & Nội dung"
      description="Quản lý chương trình, bài học, bài tập và quy trình duyệt xuất bản."
      cards={cards}
    />
  );
}
