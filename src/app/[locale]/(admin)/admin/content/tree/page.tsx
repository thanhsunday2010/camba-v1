import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { loadAdminContentBundle } from "@/lib/admin/load-content";
import { ContentTreePanel } from "@/components/admin/content/content-panels";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";

export default async function AdminContentTreePage() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "content.read")) redirect("/admin/content");

  const { content } = await loadAdminContentBundle();

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Học liệu › Cây nội dung"
        title="Cây nội dung"
        description="Duyệt và chỉnh sửa skill, unit, bài học, bài tập trong cây phân cấp."
      />
      <ContentTreePanel content={content} />
    </div>
  );
}
