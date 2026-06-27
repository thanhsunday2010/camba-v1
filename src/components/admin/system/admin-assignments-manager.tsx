"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  assignAdminTemplate,
  grantAdminAccess,
  revokeAdminAccess,
  savePermissionOverrides,
  setSuperAdminFlag,
} from "@/actions/admin/admins";
import {
  ALL_ADMIN_PERMISSIONS,
  type AdminPermission,
} from "@/lib/auth/admin-permissions";
import type { AdminAssignmentRow, AdminRoleTemplateRow } from "@/lib/admin/users/types";

const PERM_GROUPS: { label: string; perms: AdminPermission[] }[] = [
  {
    label: "Dashboard",
    perms: ["dashboard.read", "dashboard.export"],
  },
  {
    label: "Nội dung",
    perms: [
      "content.read",
      "content.write",
      "content.delete",
      "content.programs",
      "content.lessons",
      "content.exercises",
      "workflow.review",
      "workflow.publish",
    ],
  },
  {
    label: "Người dùng",
    perms: [
      "users.read",
      "users.students",
      "users.teachers",
      "users.parents",
      "users.progress",
      "users.roles",
      "users.admin",
    ],
  },
  {
    label: "Khác",
    perms: ALL_ADMIN_PERMISSIONS.filter(
      (p) =>
        ![
          "dashboard.read",
          "dashboard.export",
          "content.read",
          "content.write",
          "content.delete",
          "content.programs",
          "content.lessons",
          "content.exercises",
          "workflow.review",
          "workflow.publish",
          "users.read",
          "users.students",
          "users.teachers",
          "users.parents",
          "users.progress",
          "users.roles",
          "users.admin",
        ].includes(p)
    ) as AdminPermission[],
  },
];

interface AdminAssignmentsManagerProps {
  assignments: AdminAssignmentRow[];
  templates: AdminRoleTemplateRow[];
  isSuperAdmin: boolean;
}

export function AdminAssignmentsManager({
  assignments,
  templates,
  isSuperAdmin,
}: AdminAssignmentsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [grantEmail, setGrantEmail] = useState("");
  const [grantTemplate, setGrantTemplate] = useState(templates[0]?.slug ?? "content_editor");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [overrideDraft, setOverrideDraft] = useState<Map<string, boolean>>(new Map());

  function run(promise: Promise<{ success: boolean; error?: string }>, ok: string) {
    startTransition(async () => {
      const result = await promise;
      setMessage(result.success ? ok : result.error ?? "Lỗi");
      if (result.success) router.refresh();
    });
  }

  function openEditor(row: AdminAssignmentRow) {
    setEditingUserId(row.userId);
    const map = new Map<string, boolean>();
    for (const o of row.overridePermissions) {
      map.set(o.permission, o.granted);
    }
    setOverrideDraft(map);
  }

  const editingRow = assignments.find((a) => a.userId === editingUserId);

  return (
    <div className="space-y-6">
      {message && (
        <p className="rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-900">{message}</p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thêm Admin mới</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <Label>Email</Label>
            <Input
              value={grantEmail}
              onChange={(e) => setGrantEmail(e.target.value)}
              placeholder="user@email.com"
            />
          </div>
          <div>
            <Label>Mẫu vai trò</Label>
            <select
              value={grantTemplate}
              onChange={(e) => setGrantTemplate(e.target.value)}
              className="mt-1 h-10 rounded-lg border px-3 text-sm"
            >
              {templates.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.nameVi}
                </option>
              ))}
            </select>
          </div>
          <Button
            disabled={isPending || !grantEmail.trim()}
            onClick={() =>
              run(grantAdminAccess(grantEmail, grantTemplate, false), "Đã gán quyền admin")
            }
          >
            Gán Admin
          </Button>
          {isSuperAdmin && (
            <Button
              variant="outline"
              disabled={isPending || !grantEmail.trim()}
              onClick={() =>
                run(grantAdminAccess(grantEmail, grantTemplate, true), "Đã gán Super Admin")
              }
            >
              Gán Super Admin
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                <th className="px-4 py-3">Admin</th>
                <th className="px-4 py-3">Vai trò</th>
                <th className="px-4 py-3">Gán lúc</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((row) => (
                <tr key={row.userId} className="border-b">
                  <td className="px-4 py-3">
                    <p className="font-medium">{row.fullName}</p>
                    <p className="text-xs text-gray-500">{row.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    {row.isSuperAdmin ? (
                      <Badge className="bg-violet-600">Super Admin</Badge>
                    ) : (
                      <span>{row.templateName ?? "Chưa gán mẫu"}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {row.grantedAt
                      ? new Date(row.grantedAt).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {!row.isSuperAdmin && (
                        <Button size="sm" variant="outline" onClick={() => openEditor(row)}>
                          Chỉnh quyền
                        </Button>
                      )}
                      {isSuperAdmin && !row.isSuperAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          onClick={() =>
                            run(setSuperAdminFlag(row.userId, true), "Đã nâng Super Admin")
                          }
                        >
                          → Super Admin
                        </Button>
                      )}
                      {isSuperAdmin && row.isSuperAdmin && (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isPending}
                          onClick={() =>
                            run(setSuperAdminFlag(row.userId, false), "Đã hạ quyền")
                          }
                        >
                          Hạ Super Admin
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isPending}
                        onClick={() =>
                          run(revokeAdminAccess(row.userId), "Đã thu hồi admin")
                        }
                      >
                        Thu hồi
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {editingRow && !editingRow.isSuperAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Tùy chỉnh quyền — {editingRow.fullName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <Label>Đổi mẫu vai trò</Label>
                <select
                  defaultValue={editingRow.templateSlug ?? templates[0]?.slug}
                  className="mt-1 h-10 rounded-lg border px-3 text-sm"
                  onChange={(e) =>
                    run(assignAdminTemplate(editingRow.userId, e.target.value), "Đã đổi mẫu")
                  }
                >
                  {templates.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.nameVi}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {PERM_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-xs font-semibold uppercase text-gray-500">{group.label}</p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {group.perms.map((perm) => {
                    const templateHas = editingRow.templateSlug
                      ? templates
                          .find((t) => t.slug === editingRow.templateSlug)
                          ?.permissions.includes(perm)
                      : false;
                    const override = overrideDraft.get(perm);
                    const checked = override !== undefined ? override : templateHas;
                    return (
                      <label
                        key={perm}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const next = new Map(overrideDraft);
                            next.set(perm, e.target.checked);
                            setOverrideDraft(next);
                          }}
                        />
                        <span>{perm}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <Button
                disabled={isPending}
                onClick={() => {
                  const overrides: { permission: string; granted: boolean }[] = [];
                  for (const [perm, granted] of overrideDraft) {
                    const templateHas =
                      templates
                        .find((t) => t.slug === editingRow.templateSlug)
                        ?.permissions.includes(perm as AdminPermission) ?? false;
                    if (granted !== templateHas) {
                      overrides.push({ permission: perm, granted });
                    }
                  }
                  run(
                    savePermissionOverrides(editingRow.userId, overrides),
                    "Đã lưu tùy chỉnh quyền"
                  );
                }}
              >
                Lưu override
              </Button>
              <Button variant="ghost" onClick={() => setEditingUserId(null)}>
                Đóng
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
