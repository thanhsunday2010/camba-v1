import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { listAdminClasses, searchAdminUsers } from "@/actions/admin/users";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminUsersListClient } from "@/components/admin/users/admin-users-list-client";
import { AdminClassesClient } from "@/components/admin/users/admin-classes-client";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "users.teachers")) redirect("/admin/users");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const [usersResult, classesResult] = await Promise.all([
    searchAdminUsers({ query: params.q, role: "teacher", page: 1 }),
    listAdminClasses({ query: params.q, page }),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        breadcrumb="Admin › Người dùng › Giáo viên"
        title="Giáo viên & Lớp học"
        description="Quản lý giáo viên và danh sách lớp"
      />

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Giáo viên
        </h2>
        <Suspense fallback={null}>
          <AdminUsersListClient
            users={usersResult.users}
            total={usersResult.total}
            page={1}
            roleFilter="teacher"
            basePath="/admin/users/teachers"
            canManageRoles={canAccess(user, "users.roles")}
          />
        </Suspense>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Lớp học
        </h2>
        <Suspense fallback={null}>
          <AdminClassesClient
            classes={classesResult.classes}
            total={classesResult.total}
            page={page}
          />
        </Suspense>
      </section>
    </div>
  );
}
