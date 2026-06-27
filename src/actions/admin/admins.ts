"use server";

import { revalidatePath } from "next/cache";
import { createAdminAnalyticsClient } from "@/lib/supabase/admin-analytics";
import { writeAuditLog } from "@/lib/admin/audit";
import {
  isAdminPermission,
} from "@/lib/auth/admin-permissions";
import type { AdminAssignmentRow, AdminRoleTemplateRow } from "@/lib/admin/users/types";
import type {
  AdminAssignmentDbRow,
  AdminOverrideRow,
  AdminTemplatePermRow,
  AdminTemplateRow,
  ProfileRow,
  UserRoleRow,
} from "@/lib/admin/db-rows";
import { requirePermission } from "@/actions/admin/_shared";

function revalidateAdminSystem() {
  revalidatePath("/admin/system", "layout");
}

async function countSuperAdmins(): Promise<number> {
  const supabase = createAdminAnalyticsClient();
  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("is_super_admin", true);
  return count ?? 0;
}

export async function listRoleTemplates(): Promise<AdminRoleTemplateRow[]> {
  await requirePermission("users.admin");

  const supabase = createAdminAnalyticsClient();
  const { data: templates } = (await supabase
    .from("admin_role_templates")
    .select("id, slug, name_vi, description_vi")
    .order("name_vi")) as { data: AdminTemplateRow[] | null };

  const rows: AdminRoleTemplateRow[] = [];
  for (const t of templates ?? []) {
    const { data: perms } = (await supabase
      .from("admin_template_permissions")
      .select("permission")
      .eq("template_id", t.id)) as { data: AdminTemplatePermRow[] | null };
    rows.push({
      id: t.id,
      slug: t.slug,
      nameVi: t.name_vi,
      descriptionVi: t.description_vi,
      permissions: (perms ?? []).map((p) => p.permission),
    });
  }
  return rows;
}

export async function listAdminAssignments(): Promise<AdminAssignmentRow[]> {
  await requirePermission("users.admin");

  const supabase = createAdminAnalyticsClient();
  const { data: adminRoles } = (await supabase
    .from("user_roles")
    .select("user_id")
    .eq("role", "admin")) as { data: UserRoleRow[] | null };

  const adminIds = [...new Set((adminRoles ?? []).map((r) => r.user_id))];
  if (adminIds.length === 0) return [];

  const { data: profiles } = (await supabase
    .from("profiles")
    .select("id, email, full_name, is_super_admin")
    .in("id", adminIds)) as { data: ProfileRow[] | null };

  const { data: assignments } = (await supabase
    .from("admin_assignments")
    .select("user_id, template_id, granted_at")
    .in("user_id", adminIds)) as { data: AdminAssignmentDbRow[] | null };

  const templateIds = [...new Set((assignments ?? []).map((a) => a.template_id))];
  const { data: templates } = templateIds.length
    ? ((await supabase
        .from("admin_role_templates")
        .select("id, slug, name_vi")
        .in("id", templateIds)) as { data: AdminTemplateRow[] | null })
    : { data: [] as AdminTemplateRow[] };

  const templateMap = new Map(
    (templates ?? []).map((t) => [t.id, { slug: t.slug, name: t.name_vi }])
  );
  const assignmentMap = new Map(
    (assignments ?? []).map((a) => [a.user_id, a] as const)
  );

  const { data: allOverrides } = (await supabase
    .from("admin_permission_overrides")
    .select("user_id, permission, granted")
    .in("user_id", adminIds)) as { data: AdminOverrideRow[] | null };

  const overridesByUser = new Map<string, { permission: string; granted: boolean }[]>();
  for (const o of allOverrides ?? []) {
    const list = overridesByUser.get(o.user_id) ?? [];
    list.push({ permission: o.permission, granted: o.granted });
    overridesByUser.set(o.user_id, list);
  }

  return (profiles ?? []).map((p) => {
    const assignment = assignmentMap.get(p.id);
    const template = assignment ? templateMap.get(assignment.template_id) : null;
    return {
      userId: p.id,
      email: p.email,
      fullName: p.full_name,
      isSuperAdmin: p.is_super_admin ?? false,
      templateId: assignment?.template_id ?? null,
      templateSlug: template?.slug ?? null,
      templateName: template?.name ?? null,
      grantedAt: assignment?.granted_at ?? null,
      overridePermissions: overridesByUser.get(p.id) ?? [],
    };
  });
}

export async function grantAdminAccess(
  email: string,
  templateSlug: string,
  makeSuperAdmin = false
): Promise<{ success: boolean; error?: string }> {
  const actor = await requirePermission("users.admin");
  if (makeSuperAdmin && !actor.isSuperAdmin) {
    return { success: false, error: "Chỉ Super Admin mới gán Super Admin" };
  }

  const supabase = createAdminAnalyticsClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", email.trim())
    .maybeSingle();

  if (!profile) return { success: false, error: "Không tìm thấy user" };

  const { data: template } = await supabase
    .from("admin_role_templates")
    .select("id")
    .eq("slug", templateSlug)
    .maybeSingle();

  if (!template && !makeSuperAdmin) {
    return { success: false, error: "Mẫu vai trò không hợp lệ" };
  }

  await supabase.from("user_roles").upsert(
    { user_id: profile.id, role: "admin", assigned_by: actor.id },
    { onConflict: "user_id,role" }
  );

  if (makeSuperAdmin) {
    await supabase.from("profiles").update({ is_super_admin: true }).eq("id", profile.id);
  } else if (template) {
    await supabase.from("admin_assignments").upsert({
      user_id: profile.id,
      template_id: template.id,
      granted_by: actor.id,
    });
    await supabase.from("profiles").update({ is_super_admin: false }).eq("id", profile.id);
  }

  await writeAuditLog({
    actorId: actor.id,
    action: "admin.grant",
    resourceType: "user",
    resourceId: profile.id,
    metadata: { templateSlug, makeSuperAdmin },
  });

  revalidateAdminSystem();
  return { success: true };
}

export async function assignAdminTemplate(
  userId: string,
  templateSlug: string
): Promise<{ success: boolean; error?: string }> {
  const actor = await requirePermission("users.admin");
  const supabase = createAdminAnalyticsClient();

  const { data: template } = await supabase
    .from("admin_role_templates")
    .select("id")
    .eq("slug", templateSlug)
    .maybeSingle();

  if (!template) return { success: false, error: "Mẫu vai trò không hợp lệ" };

  await supabase.from("admin_assignments").upsert({
    user_id: userId,
    template_id: template.id,
    granted_by: actor.id,
  });

  await supabase.from("admin_permission_overrides").delete().eq("user_id", userId);
  await supabase.from("profiles").update({ is_super_admin: false }).eq("id", userId);

  await writeAuditLog({
    actorId: actor.id,
    action: "admin.template.assign",
    resourceType: "user",
    resourceId: userId,
    metadata: { templateSlug },
  });

  revalidateAdminSystem();
  return { success: true };
}

export async function setSuperAdminFlag(
  userId: string,
  isSuperAdmin: boolean
): Promise<{ success: boolean; error?: string }> {
  const actor = await requirePermission("users.admin");
  if (!actor.isSuperAdmin) {
    return { success: false, error: "Chỉ Super Admin mới thay đổi cờ Super Admin" };
  }

  if (!isSuperAdmin) {
    const count = await countSuperAdmins();
    const supabase = createAdminAnalyticsClient();
    const { data: target } = await supabase
      .from("profiles")
      .select("is_super_admin")
      .eq("id", userId)
      .maybeSingle();
    if (target?.is_super_admin && count <= 1) {
      return { success: false, error: "Không thể thu hồi Super Admin cuối cùng" };
    }
  }

  const supabase = createAdminAnalyticsClient();
  await supabase.from("profiles").update({ is_super_admin: isSuperAdmin }).eq("id", userId);

  if (isSuperAdmin) {
    await supabase.from("admin_assignments").delete().eq("user_id", userId);
    await supabase.from("admin_permission_overrides").delete().eq("user_id", userId);
    await supabase.from("user_roles").upsert(
      { user_id: userId, role: "admin", assigned_by: actor.id },
      { onConflict: "user_id,role" }
    );
  }

  await writeAuditLog({
    actorId: actor.id,
    action: isSuperAdmin ? "admin.super_admin.grant" : "admin.super_admin.revoke",
    resourceType: "user",
    resourceId: userId,
  });

  revalidateAdminSystem();
  return { success: true };
}

export async function savePermissionOverrides(
  userId: string,
  overrides: { permission: string; granted: boolean }[]
): Promise<{ success: boolean; error?: string }> {
  const actor = await requirePermission("users.admin");
  const supabase = createAdminAnalyticsClient();

  const valid = overrides.filter((o) => isAdminPermission(o.permission));
  if (valid.length === 0 && overrides.length > 0) {
    return { success: false, error: "Quyền không hợp lệ" };
  }

  await supabase.from("admin_permission_overrides").delete().eq("user_id", userId);
  if (valid.length > 0) {
    await supabase.from("admin_permission_overrides").insert(
      valid.map((o) => ({
        user_id: userId,
        permission: o.permission,
        granted: o.granted,
      }))
    );
  }

  await writeAuditLog({
    actorId: actor.id,
    action: "admin.permissions.override",
    resourceType: "user",
    resourceId: userId,
    metadata: { count: valid.length },
  });

  revalidateAdminSystem();
  return { success: true };
}

export async function revokeAdminAccess(userId: string): Promise<{ success: boolean; error?: string }> {
  const actor = await requirePermission("users.admin");

  const supabase = createAdminAnalyticsClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_super_admin")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.is_super_admin) {
    const count = await countSuperAdmins();
    if (count <= 1) {
      return { success: false, error: "Không thể thu hồi Super Admin cuối cùng" };
    }
  }

  await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
  await supabase.from("admin_assignments").delete().eq("user_id", userId);
  await supabase.from("admin_permission_overrides").delete().eq("user_id", userId);
  await supabase.from("profiles").update({ is_super_admin: false }).eq("id", userId);

  await writeAuditLog({
    actorId: actor.id,
    action: "admin.revoke",
    resourceType: "user",
    resourceId: userId,
  });

  revalidateAdminSystem();
  return { success: true };
}
