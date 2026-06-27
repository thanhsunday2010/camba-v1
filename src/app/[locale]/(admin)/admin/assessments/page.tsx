import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { getAdminContentTree } from "@/actions/admin/content";
import { getAdminAssessments } from "@/actions/admin/assessments";
import { AdminModuleHub } from "@/components/admin/shell/admin-module-hub";
import { FileText, BarChart3 } from "lucide-react";

export default async function AdminAssessmentsHubPage() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "assessments.read")) redirect("/admin");

  const assessments = await getAdminAssessments();

  return (
    <AdminModuleHub
      title="Bài kiểm tra"
      description="Quản lý placement test, mock test và xem kết quả."
      cards={[
        {
          id: "placement",
          title: "Placement test",
          description: "Soạn đề và cấu hình bài placement",
          href: "/admin/assessments/placement",
          icon: FileText,
          stat: `${assessments.placementTests.length} bài`,
        },
        {
          id: "mock",
          title: "Mock test",
          description: "Soạn mock test và section",
          href: "/admin/assessments/mock",
          icon: FileText,
          stat: `${assessments.mockTests.length} bài`,
        },
        {
          id: "results",
          title: "Kết quả & Thống kê",
          description: "Xem lượt làm bài (sắp ra mắt)",
          href: "/admin/assessments/results",
          icon: BarChart3,
        },
      ]}
    />
  );
}
