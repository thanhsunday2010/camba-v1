import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { loadAdminContentBundle } from "@/lib/admin/load-content";
import { ProgramManager } from "@/components/admin/program-manager";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";

export default async function AdminContentProgramsPage() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "content.programs")) redirect("/admin/content");

  const { content } = await loadAdminContentBundle();

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Học liệu › Chương trình"
        title="Chương trình & Cấp độ"
        description="Tạo và quản lý program, level cho từng chương trình học."
      />
      <ProgramManager programs={content.programs} levels={content.levels} />
    </div>
  );
}
