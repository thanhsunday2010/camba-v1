import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { getAdminContentTree } from "@/actions/admin/content";
import { getAdminAssessments } from "@/actions/admin/assessments";
import { PlacementPageClient } from "@/components/admin/assessments/placement-page-client";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";

export default async function AdminPlacementPage() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "assessments.read")) redirect("/admin/assessments");

  const [content, assessments] = await Promise.all([
    getAdminContentTree(),
    getAdminAssessments(),
  ]);

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Bài kiểm tra › Placement"
        title="Placement test"
      />
      <PlacementPageClient content={content} placementTests={assessments.placementTests} />
    </div>
  );
}
