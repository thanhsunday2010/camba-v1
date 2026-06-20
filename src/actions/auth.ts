"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult, AuthUser } from "@/types";
import type { UserRole } from "@/types/database";
import { getDashboardPath } from "@/lib/auth/roles";
import { getAppUrl } from "@/lib/env";
import { resolvePostAuthRedirect, sanitizeRedirectPath } from "@/lib/auth/redirect";

const AUTH_PATHS = {
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  callback: "/auth/callback",
} as const;

export async function signUp(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${getAppUrl()}${AUTH_PATHS.callback}`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function signIn(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = sanitizeRedirectPath(formData.get("redirect") as string | null);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const roles = user
    ? ((await supabase.from("user_roles").select("role").eq("user_id", user.id)).data?.map(
        (r) => r.role
      ) ?? ["student"])
    : ["student"];

  revalidatePath("/", "layout");
  redirect(resolvePostAuthRedirect(redirectTo, getDashboardPath(roles as UserRole[])));
}

export async function signInWithGoogle(): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getAppUrl()}${AUTH_PATHS.callback}`,
    },
  });

  if (error) {
    redirect(`${AUTH_PATHS.login}?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(AUTH_PATHS.login);
}

export async function resetPassword(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getAppUrl()}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updatePassword(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters" };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile?.full_name ?? user.user_metadata?.full_name ?? "",
    avatarUrl: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null,
    roles: (roles?.map((r) => r.role) ?? ["student"]) as UserRole[],
    onboardingCompleted: profile?.onboarding_completed ?? false,
  };
}

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const fullName = formData.get("fullName") as string;
  const locale = formData.get("locale") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      locale: locale || "vi",
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
