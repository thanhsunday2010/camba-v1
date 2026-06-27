import { redirect } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { loadAdminContentBundle } from "@/lib/admin/load-content";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminContentExercisesPage() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "content.exercises")) redirect("/admin/content");

  const { content } = await loadAdminContentBundle();
  const byStatus = {
    published: content.exercises.filter((e) => e.status === "published").length,
    draft: content.exercises.filter((e) => e.status === "draft").length,
    pending: content.exercises.filter((e) => e.status === "pending_review").length,
  };

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Học liệu › Bài tập"
        title="Bài tập & Câu hỏi"
        description="Soạn bài tập qua cây nội dung hoặc ngân hàng câu hỏi."
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/content/tree">Mở cây nội dung</Link>
          </Button>
        }
      />
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: "Đã xuất bản", value: byStatus.published },
          { label: "Nháp", value: byStatus.draft },
          { label: "Chờ duyệt", value: byStatus.pending },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-sm text-gray-600">
        Tổng {content.exercises.length} bài tập, {content.questions.length} câu hỏi.
      </p>
    </div>
  );
}
