import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActionResult } from "@/types";
import type { Database, UserRole } from "@/types/database";
import { getDashboardPath } from "@/lib/auth/roles";
import { resolvePostAuthRedirect, sanitizeRedirectPath } from "@/lib/auth/redirect";

export type SignInSuccess = {
  ok: true;
  redirectPath: string;
};

export type SignInFailure = {
  ok: false;
  result: ActionResult;
};

export type SignInOutcome = SignInSuccess | SignInFailure;

export async function resolveSignIn(
  supabase: SupabaseClient<Database>,
  formData: FormData
): Promise<SignInOutcome> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = sanitizeRedirectPath(formData.get("redirect") as string | null);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { ok: false, result: { success: false, error: error.message } };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const roles = user
    ? ((await supabase.from("user_roles").select("role").eq("user_id", user.id)).data?.map(
        (r) => r.role
      ) ?? ["student"])
    : ["student"];

  const roleBasedPath = getDashboardPath(roles as UserRole[]);
  const redirectPath = resolvePostAuthRedirect(redirectTo, roleBasedPath);

  return { ok: true, redirectPath };
}
