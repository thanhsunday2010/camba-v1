import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { listParentLinks } from "@/actions/admin/users";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminParentsClient } from "@/components/admin/users/admin-parents-client";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "users.parents")) redirect("/admin/users");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const { links, total } = await listParentLinks({ query: params.q, page });

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Người dùng › Phụ huynh"
        title="Phụ huynh & Liên kết"
        description={`${total} liên kết parent–student`}
      />
      <Suspense fallback={null}>
        <AdminParentsClient links={links} total={total} page={page} />
      </Suspense>
    </div>
  );
}
