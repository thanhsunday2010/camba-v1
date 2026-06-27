import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { getAdminContentTree } from "@/actions/admin/content";
import { BulkToolsClient } from "@/components/admin/tools/bulk-tools-client";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";

export default async function AdminBulkToolsPage() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "tools.bulk")) redirect("/admin/tools");

  const content = await getAdminContentTree();

  return (
    <div>
      <AdminPageHeader breadcrumb="Admin › Công cụ › Import" title="Import / Export" />
      <BulkToolsClient programs={content.programs} />
    </div>
  );
}
