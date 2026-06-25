import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { getAuthCallbackUrl, withLocalePath } from "@/lib/auth/request-origin";
import type { Database } from "@/types/database";

export async function signInWithGoogleOAuth(
  supabase: SupabaseClient<Database>,
  options?: { loginPath?: string; nextPath?: string | null }
): Promise<void> {
  const loginPath = options?.loginPath ?? `/${DEFAULT_LOCALE}/login`;
  const redirectTo = await getAuthCallbackUrl(options?.nextPath);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) {
    redirect(`${loginPath}?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }

  redirect(`${loginPath}?error=${encodeURIComponent("oauth_start_failed")}`);
}

export async function revalidateAppLayout(): Promise<void> {
  revalidatePath("/", "layout");
}

export function localizedDashboardRedirect(path: string): string {
  return withLocalePath(path, DEFAULT_LOCALE);
}
