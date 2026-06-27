import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess, hasAnyAdminPermission, TOOLS_MODULE_PERMISSIONS } from "@/lib/auth/admin-permissions";
import { getAdminContentTree } from "@/actions/admin/content";
import { AdminModuleHub } from "@/components/admin/shell/admin-module-hub";
import { Sparkles, Upload } from "lucide-react";

export default async function AdminToolsHubPage() {
  const user = await getCurrentUser();
  if (
    !user ||
    (!user.isSuperAdmin &&
      !hasAnyAdminPermission(user.adminPermissions, TOOLS_MODULE_PERMISSIONS))
  ) {
    redirect("/admin");
  }

  const content = canAccess(user, "content.read")
    ? await getAdminContentTree()
    : { lessons: [] as { id: string }[] };

  const cards = [
    canAccess(user, "tools.bulk") || user.isSuperAdmin
      ? {
          id: "bulk",
          title: "Import / Export",
          description: "Import và export bundle nội dung JSON",
          href: "/admin/tools/bulk",
          icon: Upload,
        }
      : null,
    canAccess(user, "tools.ai") || user.isSuperAdmin
      ? {
          id: "ai",
          title: "Sinh câu hỏi AI",
          description: "Tạo câu hỏi bằng Gemini AI",
          href: "/admin/tools/ai-generator",
          icon: Sparkles,
          stat: `${content.lessons.length} bài học`,
        }
      : null,
    canAccess(user, "platform.settings") ||
    canAccess(user, "subscriptions.read") ||
    canAccess(user, "tools.ai") ||
    user.isSuperAdmin
      ? {
          id: "ai-limits",
          title: "Giới hạn AI",
          description: "Theo dõi usage AI hàng ngày",
          href: "/admin/tools/ai-limits",
          icon: Sparkles,
        }
      : null,
  ].filter(Boolean) as Parameters<typeof AdminModuleHub>[0]["cards"];

  return (
    <AdminModuleHub
      title="AI & Công cụ"
      description="Công cụ sinh nội dung, import/export và giám sát AI."
      cards={cards}
    />
  );
}
