import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { lookupUserProgress } from "@/actions/admin/users";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminProgressLookupClient } from "@/components/admin/users/admin-progress-lookup-client";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "users.progress")) redirect("/admin/users");

  const params = await searchParams;
  const initialResult = params.q ? await lookupUserProgress(params.q) : null;

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Người dùng › Tiến độ"
        title="Tiến độ học tập"
        description="Tra cứu tiến độ theo email hoặc tên"
      />
      <Suspense fallback={null}>
        <AdminProgressLookupClient initialQuery={params.q ?? ""} initialResult={initialResult} />
      </Suspense>
    </div>
  );
}
