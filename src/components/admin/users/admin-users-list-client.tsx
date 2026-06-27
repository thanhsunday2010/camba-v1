"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  assignUserRole,
  revokeUserRole,
  setUserActive,
} from "@/actions/admin/users";
import type { AdminUserSummary } from "@/lib/admin/users/types";
import type { UserRole } from "@/types/database";

const ROLE_LABELS: Record<UserRole, string> = {
  student: "Học sinh",
  teacher: "Giáo viên",
  parent: "Phụ huynh",
  admin: "Admin",
};

interface AdminUsersListClientProps {
  users: AdminUserSummary[];
  total: number;
  page: number;
  roleFilter?: UserRole;
  basePath: string;
  canManageRoles?: boolean;
}

export function AdminUsersListClient({
  users,
  total,
  page,
  roleFilter,
  basePath,
  canManageRoles = false,
}: AdminUsersListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const query = searchParams.get("q") ?? "";

  function navigate(nextPage: number, q?: string) {
    const params = new URLSearchParams();
    if (q ?? query) params.set("q", q ?? query);
    if (nextPage > 1) params.set("page", String(nextPage));
    router.push(`${basePath}?${params.toString()}`);
  }

  function runAction(action: () => Promise<{ success: boolean; error?: string }>, ok: string) {
    startTransition(async () => {
      const result = await action();
      setMessage(result.success ? ok : result.error ?? "Lỗi");
      if (result.success) router.refresh();
    });
  }

  const totalPages = Math.max(1, Math.ceil(total / 25));

  return (
    <div className="space-y-4">
      {message && (
        <p className="rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-900">{message}</p>
      )}

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          navigate(1, String(fd.get("q") ?? ""));
        }}
      >
        <Input name="q" defaultValue={query} placeholder="Tìm email hoặc tên..." className="max-w-sm" />
        <Button type="submit" variant="outline" disabled={isPending}>
          Tìm kiếm
        </Button>
      </form>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                  <th className="px-4 py-3">Người dùng</th>
                  <th className="px-4 py-3">Vai trò</th>
                  <th className="px-4 py-3">Gói</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  {canManageRoles && <th className="px-4 py-3">Thao tác</th>}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td colSpan={canManageRoles ? 5 : 4} className="px-4 py-8 text-center text-gray-500">
                      Không có kết quả
                    </td>
                  </tr>
                )}
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{user.fullName || "—"}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((r) => (
                          <Badge key={r} variant="secondary" className="text-xs">
                            {ROLE_LABELS[r]}
                          </Badge>
                        ))}
                        {user.isSuperAdmin && (
                          <Badge className="bg-violet-600 text-xs">Super Admin</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">{user.subscriptionTier ?? "free"}</td>
                    <td className="px-4 py-3">
                      {user.isActive ? (
                        <span className="text-emerald-600">Hoạt động</span>
                      ) : (
                        <span className="text-gray-400">Vô hiệu</span>
                      )}
                    </td>
                    {canManageRoles && (
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {roleFilter &&
                            !user.roles.includes(roleFilter) && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isPending}
                                onClick={() =>
                                  runAction(
                                    () => assignUserRole(user.id, roleFilter),
                                    "Đã gán vai trò"
                                  )
                                }
                              >
                                + {ROLE_LABELS[roleFilter]}
                              </Button>
                            )}
                          {roleFilter && user.roles.includes(roleFilter) && roleFilter !== "student" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isPending}
                              onClick={() =>
                                runAction(
                                  () => revokeUserRole(user.id, roleFilter),
                                  "Đã thu hồi vai trò"
                                )
                              }
                            >
                              Thu hồi {ROLE_LABELS[roleFilter]}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={isPending}
                            onClick={() =>
                              runAction(
                                () => setUserActive(user.id, !user.isActive),
                                user.isActive ? "Đã vô hiệu hóa" : "Đã kích hoạt"
                              )
                            }
                          >
                            {user.isActive ? "Vô hiệu" : "Kích hoạt"}
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {total} kết quả — trang {page}/{totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isPending}
            onClick={() => navigate(page - 1)}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || isPending}
            onClick={() => navigate(page + 1)}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}
