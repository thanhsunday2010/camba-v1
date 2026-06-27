import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminAssessmentResultsPage() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "assessments.read")) redirect("/admin/assessments");

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Bài kiểm tra › Kết quả"
        title="Kết quả & Thống kê"
        description="Xem lượt làm placement và mock test."
      />
      <Card>
        <CardContent className="p-6 text-sm text-gray-600">
          Module thống kê kết quả bài kiểm tra sẽ được bổ sung trong bản cập nhật tiếp theo.
        </CardContent>
      </Card>
    </div>
  );
}
