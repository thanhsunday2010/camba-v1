import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { searchAdminUsers } from "@/actions/admin/users";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminUsersListClient } from "@/components/admin/users/admin-users-list-client";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "users.students")) redirect("/admin/users");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const { users, total } = await searchAdminUsers({
    query: params.q,
    role: "student",
    page,
  });

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Người dùng › Học sinh"
        title="Học sinh"
        description={`${total} học sinh đã đăng ký`}
      />
      <Suspense fallback={<div className="py-8 text-center text-sm text-gray-500">Đang tải...</div>}>
        <AdminUsersListClient
          users={users}
          total={total}
          page={page}
          roleFilter="student"
          basePath="/admin/users/students"
          canManageRoles={canAccess(user, "users.roles")}
        />
      </Suspense>
    </div>
  );
}
