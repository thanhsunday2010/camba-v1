import { createAdminAnalyticsClient } from "@/lib/supabase/admin-analytics";
import type { AuthUser } from "@/types";

export const ADMIN_PERMISSIONS = [
  "dashboard.read",
  "dashboard.export",
  "content.read",
  "content.write",
  "content.delete",
  "content.programs",
  "content.lessons",
  "content.exercises",
  "content.translations",
  "workflow.review",
  "workflow.publish",
  "assessments.read",
  "assessments.write",
  "tools.ai",
  "tools.bulk",
  "users.read",
  "users.students",
  "users.teachers",
  "users.parents",
  "users.progress",
  "users.roles",
  "users.admin",
  "subscriptions.read",
  "subscriptions.plans",
  "subscriptions.orders",
  "subscriptions.webhooks",
  "subscriptions.manage",
  "gamification.read",
  "gamification.manage",
  "gamification.xp",
  "gamification.badges",
  "gamification.missions",
  "gamification.leagues",
  "site.read",
  "site.write",
  "platform.settings",
  "audit.read",
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

export const ALL_ADMIN_PERMISSIONS: AdminPermission[] = [...ADMIN_PERMISSIONS];

export function isAdminPermission(value: string): value is AdminPermission {
  return (ADMIN_PERMISSIONS as readonly string[]).includes(value);
}

export function hasAdminPermission(
  permissions: AdminPermission[],
  permission: AdminPermission
): boolean {
  return permissions.includes(permission);
}

export function hasAnyAdminPermission(
  permissions: AdminPermission[],
  required: AdminPermission[]
): boolean {
  return required.some((p) => permissions.includes(p));
}

/** First admin route the user may access (when dashboard is denied). */
export function getAdminFallbackPath(
  user: Pick<AuthUser, "isSuperAdmin" | "adminPermissions">
): string {
  const routes: { permission: AdminPermission; path: string }[] = [
    { permission: "content.read", path: "/admin/content" },
    { permission: "users.read", path: "/admin/users" },
    { permission: "subscriptions.read", path: "/admin/subscriptions" },
    { permission: "gamification.read", path: "/admin/gamification" },
    { permission: "assessments.read", path: "/admin/assessments" },
    { permission: "site.read", path: "/admin/site" },
    { permission: "tools.bulk", path: "/admin/tools/bulk" },
    { permission: "tools.ai", path: "/admin/tools/ai-generator" },
    { permission: "audit.read", path: "/admin/system/audit" },
    { permission: "platform.settings", path: "/admin/system/settings" },
  ];
  for (const { permission, path } of routes) {
    if (canAccess(user, permission)) return path;
  }
  return "/dashboard";
}

/** Super Admin or explicit permission. */
export function canAccess(
  user: Pick<AuthUser, "isSuperAdmin" | "adminPermissions">,
  permission: AdminPermission
): boolean {
  if (user.isSuperAdmin) return true;
  return hasAdminPermission(user.adminPermissions, permission);
}

export async function loadAdminPermissionsForUser(
  userId: string,
  isSuperAdmin: boolean
): Promise<AdminPermission[]> {
  if (isSuperAdmin) return ALL_ADMIN_PERMISSIONS;

  try {
    const supabase = createAdminAnalyticsClient();

    const { data: assignment, error: assignError } = await supabase
      .from("admin_assignments")
      .select("template_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (assignError) {
      console.error("[admin-permissions] assignment load failed:", assignError.message);
      return ["dashboard.read"];
    }
    if (!assignment?.template_id) return ALL_ADMIN_PERMISSIONS;

    const [{ data: templatePerms }, { data: overrides }] = await Promise.all([
      supabase
        .from("admin_template_permissions")
        .select("permission")
        .eq("template_id", assignment.template_id),
      supabase
        .from("admin_permission_overrides")
        .select("permission, granted")
        .eq("user_id", userId),
    ]);

    const set = new Set<AdminPermission>();
    for (const row of templatePerms ?? []) {
      if (isAdminPermission(row.permission)) set.add(row.permission);
    }
    for (const row of overrides ?? []) {
      if (!isAdminPermission(row.permission)) continue;
      if (row.granted) set.add(row.permission);
      else set.delete(row.permission);
    }

    if (!set.has("dashboard.read")) set.add("dashboard.read");
    return [...set];
  } catch (error) {
    console.error("[admin-permissions] load failed:", error);
    return ["dashboard.read"];
  }
}
