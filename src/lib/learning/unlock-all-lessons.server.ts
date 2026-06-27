import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { canBypassLessonUnlock } from "@/lib/learning/unlock-all-lessons";
import type { UserRole } from "@/types/database";

export const userCanBypassLessonUnlock = cache(async (userId: string): Promise<boolean> => {
  const supabase = await createClient();
  const [{ data: roles }, { data: profile }] = await Promise.all([
    supabase.from("user_roles").select("role").eq("user_id", userId),
    supabase.from("profiles").select("is_super_admin").eq("id", userId).maybeSingle(),
  ]);

  return canBypassLessonUnlock(
    (roles?.map((row) => row.role) ?? []) as UserRole[],
    profile?.is_super_admin === true
  );
});
