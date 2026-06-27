import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import {
  getDefaultAiLimits,
  getProgramSettings,
  listAdminPrograms,
} from "@/actions/admin/settings";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminPlatformSettingsClient } from "@/components/admin/system/admin-platform-settings-client";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "platform.settings")) redirect("/admin/system");

  const [programs, aiLimits] = await Promise.all([
    listAdminPrograms(),
    getDefaultAiLimits(),
  ]);

  const initialProgramId = programs[0]?.id ?? "";
  const initialSettings = initialProgramId
    ? await getProgramSettings(initialProgramId)
    : [];

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Hệ thống › Cài đặt"
        title="Cài đặt nền tảng"
        description="Cấu hình chương trình học và giới hạn AI mặc định"
      />
      {programs.length === 0 ? (
        <p className="text-sm text-gray-500">Chưa có chương trình học nào.</p>
      ) : (
        <AdminPlatformSettingsClient
          programs={programs}
          initialProgramId={initialProgramId}
          initialSettings={initialSettings}
          aiLimits={aiLimits}
        />
      )}
    </div>
  );
}
