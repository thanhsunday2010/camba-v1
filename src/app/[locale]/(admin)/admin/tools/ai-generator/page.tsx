import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { getAdminContentTree } from "@/actions/admin/content";
import { AiQuestionGenerator } from "@/components/admin/ai-question-generator";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";

export default async function AdminAiGeneratorPage() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "tools.ai")) redirect("/admin/tools");

  const content = await getAdminContentTree();

  return (
    <div>
      <AdminPageHeader breadcrumb="Admin › Công cụ › AI" title="Sinh câu hỏi AI" />
      <AiQuestionGenerator lessons={content.lessons.map((l) => ({ id: l.id, title: l.title }))} />
    </div>
  );
}
