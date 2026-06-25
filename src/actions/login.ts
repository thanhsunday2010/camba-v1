"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveSignIn } from "@/lib/auth/sign-in";
import { signInWithGoogleOAuth } from "@/lib/auth/google-oauth";
import { DEFAULT_LOCALE } from "@/lib/constants";
import type { ActionResult } from "@/types";

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

export async function signInWithGoogle(formData: FormData): Promise<void> {
  const nextPath = formData.get("redirect") as string | null;
  const supabase = await createClient();
  await signInWithGoogleOAuth(supabase, {
    loginPath: `/${DEFAULT_LOCALE}/login`,
    nextPath,
  });
}
