import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { loadAdminContentBundle } from "@/lib/admin/load-content";
import { ContentCreatePanel } from "@/components/admin/content/content-panels";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";

export default async function AdminContentLessonsPage() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "content.lessons")) redirect("/admin/content");

  const { content } = await loadAdminContentBundle();

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Học liệu › Bài học"
        title="Bài học & Tạo mới"
        description={`${content.lessons.length} bài học — tạo mới hoặc chỉnh sửa qua cây nội dung.`}
      />
      <ContentCreatePanel content={content} />
    </div>
  );
}
