import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { loadAdminContentBundle } from "@/lib/admin/load-content";
import { ContentReviewClient } from "@/components/admin/content/content-review-client";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";

export default async function AdminContentReviewPage() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "workflow.review")) redirect("/admin/content");

  const { pendingExercises } = await loadAdminContentBundle();

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Học liệu › Duyệt"
        title="Duyệt & Xuất bản"
        description={
          pendingExercises.length > 0
            ? `${pendingExercises.length} bài tập đang chờ duyệt.`
            : "Không có bài tập chờ duyệt."
        }
      />
      <ContentReviewClient pendingExercises={pendingExercises} />
    </div>
  );
}
