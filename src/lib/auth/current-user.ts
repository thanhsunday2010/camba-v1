import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/session";
import type { AuthUser } from "@/types";
import type { UserRole } from "@/types/database";

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const user = await getAuthUser();
  if (!user) return null;

  const supabase = await createClient();

  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
  ]);

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile?.full_name ?? user.user_metadata?.full_name ?? "",
    avatarUrl: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null,
    roles: (roles?.map((r) => r.role) ?? ["student"]) as UserRole[],
    onboardingCompleted: profile?.onboarding_completed ?? false,
  };
});
