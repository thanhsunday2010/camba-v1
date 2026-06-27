import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { loadAdminContentBundle } from "@/lib/admin/load-content";
import { QuestionBankPageClient } from "@/components/admin/content/question-bank-page-client";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";

export default async function AdminQuestionBankPage() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "content.read")) redirect("/admin/content");

  const { content } = await loadAdminContentBundle();

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Học liệu › Ngân hàng câu hỏi"
        title="Ngân hàng câu hỏi"
        description="Tìm kiếm, chỉnh sửa và tái sử dụng câu hỏi."
      />
      <QuestionBankPageClient content={content} />
    </div>
  );
}
