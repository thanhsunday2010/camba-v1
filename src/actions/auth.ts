"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { getAuthCallbackUrl } from "@/lib/auth/request-origin";
import { signInWithGoogleOAuth } from "@/lib/auth/google-oauth";
import { resolveSignIn } from "@/lib/auth/sign-in";
import { resolveAuthIdentity } from "@/lib/auth/identity";

const AUTH_PATHS = {
  login: `/${DEFAULT_LOCALE}/login`,
  register: `/${DEFAULT_LOCALE}/register`,
  dashboard: `/${DEFAULT_LOCALE}/dashboard`,
} as const;

export async function signUp(formData: FormData): Promise<ActionResult<{ method: "phone" | "email" }>> {
  const supabase = await createClient();

  const identity = resolveAuthIdentity(formData);
  if (!identity.ok) {
    return { success: false, error: identity.errorKey };
  }

  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const { data, error } = await supabase.auth.signUp({
    email: identity.authEmail,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: identity.phone ?? undefined,
      },
      emailRedirectTo: identity.method === "email" ? await getAuthCallbackUrl() : undefined,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (identity.phone && data.user) {
    await supabase.from("profiles").update({ phone: identity.phone }).eq("id", data.user.id);
  }

  if (identity.method === "phone") {
    if (data.session) {
      revalidatePath("/", "layout");
      redirect(AUTH_PATHS.dashboard);
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: identity.authEmail,
      password,
    });

    if (!signInError) {
      revalidatePath("/", "layout");
      redirect(AUTH_PATHS.dashboard);
    }
  }

  return { success: true, data: { method: identity.method } };
}

export async function signIn(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const outcome = await resolveSignIn(supabase, formData);

  if (!outcome.ok) {
    return outcome.result;
  }

  revalidatePath("/", "layout");
  redirect(outcome.redirectPath);
}

export async function signInWithGoogle(formData: FormData): Promise<void> {
  const nextPath = formData.get("redirect") as string | null;
  const supabase = await createClient();
  await signInWithGoogleOAuth(supabase, { loginPath: AUTH_PATHS.login, nextPath });
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
    redirectTo: await getAuthCallbackUrl("/reset-password"),
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
