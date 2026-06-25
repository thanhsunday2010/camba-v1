import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export async function ensureUserBootstrap(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<void> {
  const [{ data: profile }, { data: gamification }] = await Promise.all([
    supabase.from("profiles").select("id").eq("id", userId).maybeSingle(),
    supabase.from("user_gamification").select("user_id").eq("user_id", userId).maybeSingle(),
  ]);

  if (profile && gamification) {
    return;
  }

  const { error } = await supabase.rpc("ensure_user_bootstrap", {
    p_user_id: userId,
  });

  if (error) {
    console.error("[ensureUserBootstrap]", error.message);
  }
}
