import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/session";
import { ensureUserBootstrap } from "@/lib/auth/provision-user";
import { loadAdminPermissionsForUser } from "@/lib/auth/admin-permissions";
import { isAdmin } from "@/lib/auth/roles";
import type { AuthUser } from "@/types";
import type { UserRole } from "@/types/database";

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const user = await getAuthUser();
  if (!user) return null;

  const supabase = await createClient();
  await ensureUserBootstrap(supabase, user.id);

  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
  ]);

  const roleList = (roles?.map((r) => r.role) ?? ["student"]) as UserRole[];
  const isSuperAdmin = profile?.is_super_admin === true;
  const adminPermissions = isAdmin(roleList)
    ? await loadAdminPermissionsForUser(user.id, isSuperAdmin)
    : [];

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile?.full_name ?? user.user_metadata?.full_name ?? user.user_metadata?.name ?? "",
    avatarUrl:
      profile?.avatar_url ??
      user.user_metadata?.avatar_url ??
      user.user_metadata?.picture ??
      null,
    roles: roleList,
    onboardingCompleted: profile?.onboarding_completed ?? false,
    isSuperAdmin,
    adminPermissions,
  };
});

export async function requireCurrentUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    const { redirectToLogin } = await import("@/lib/auth/navigation");
    await redirectToLogin();
    throw new Error("Unreachable");
  }
  return user;
}
