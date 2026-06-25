import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActionResult } from "@/types";
import type { Database, UserRole } from "@/types/database";
import { getDashboardPath } from "@/lib/auth/roles";
import { sanitizeRedirectPath, resolvePostAuthRedirect } from "@/lib/auth/redirect";
import { withLocalePath } from "@/lib/auth/request-origin";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { resolveAuthIdentity } from "@/lib/auth/identity";
import { ensureUserBootstrap } from "@/lib/auth/provision-user";

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
  const identity = resolveAuthIdentity(formData);
  const password = formData.get("password") as string;
  const redirectTo = sanitizeRedirectPath(formData.get("redirect") as string | null);

  if (!identity.ok) {
    return {
      ok: false,
      result: {
        success: false,
        error: identity.errorKey,
      },
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: identity.authEmail,
    password,
  });

  if (error) {
    return { ok: false, result: { success: false, error: error.message } };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await ensureUserBootstrap(supabase, user.id);
  }

  const roles = user
    ? ((await supabase.from("user_roles").select("role").eq("user_id", user.id)).data?.map(
        (r) => r.role
      ) ?? ["student"])
    : ["student"];

  const roleBasedPath = getDashboardPath(roles as UserRole[]);
  const redirectPath = resolvePostAuthRedirect(redirectTo, roleBasedPath);

  return { ok: true, redirectPath: withLocalePath(redirectPath, DEFAULT_LOCALE) };
}
