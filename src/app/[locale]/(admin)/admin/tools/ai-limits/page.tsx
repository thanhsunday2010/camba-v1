import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import {
  getAiUsageSummary,
  listAiUnlimitedEmails,
  listAiUsageDaily,
} from "@/actions/admin/ai-limits";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminAiLimitsClient } from "@/components/admin/tools/admin-ai-limits-client";

export default async function AdminAiLimitsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; q?: string; page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "tools.ai")) redirect("/admin/tools");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const date = params.date ?? new Date().toISOString().slice(0, 10);

  const [usage, summary, unlimitedEmails] = await Promise.all([
    listAiUsageDaily({ date, query: params.q, page }),
    getAiUsageSummary(date),
    listAiUnlimitedEmails(),
  ]);

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Công cụ › Giới hạn AI"
        title="Giới hạn AI"
        description="Theo dõi lượt dùng AI và whitelist không giới hạn"
      />
      <Suspense fallback={null}>
        <AdminAiLimitsClient
          rows={usage.rows}
          total={usage.total}
          page={page}
          date={date}
          summary={summary}
          unlimitedEmails={unlimitedEmails}
        />
      </Suspense>
    </div>
  );
}
