import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { listAuditLogs } from "@/actions/admin/audit-log";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminAuditLogClient } from "@/components/admin/system/admin-audit-log-client";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "audit.read")) redirect("/admin/system");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const { logs, total } = await listAuditLogs({ action: params.action, page });

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Hệ thống › Nhật ký"
        title="Nhật ký & Bảo mật"
        description="Theo dõi thao tác admin trên nền tảng"
      />
      <Suspense fallback={null}>
        <AdminAuditLogClient logs={logs} total={total} page={page} />
      </Suspense>
    </div>
  );
}
