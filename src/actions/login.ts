"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveSignIn } from "@/lib/auth/sign-in";
import { getAppUrl } from "@/lib/env";
import type { ActionResult } from "@/types";

const AUTH_PATHS = {
  login: "/login",
  callback: "/auth/callback",
} as const;

export async function loginAction(
  _previousState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const outcome = await resolveSignIn(supabase, formData);

  if (!outcome.ok) {
    return outcome.result;
  }

  revalidatePath("/", "layout");
  redirect(outcome.redirectPath);
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
