import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminAiLimitsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin");

  return (
    <div>
      <AdminPageHeader breadcrumb="Admin › Công cụ › Giới hạn AI" title="Giới hạn AI" />
      <Card>
        <CardContent className="p-6 text-sm text-gray-600">
          Chi tiết override giới hạn AI theo user sẽ được bổ sung trong Phase 3.
        </CardContent>
      </Card>
    </div>
  );
}
