import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { UserGamification, UserStreak } from "@/types/database";

export async function getUserGamification(
  userId: string
): Promise<UserGamification | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("user_gamification")
    .select("*")
    .eq("user_id", userId)
    .single();

  return data;
}

export async function getUserStreak(userId: string): Promise<UserStreak | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  return data;
}

const fetchActiveProgramsCached = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("programs")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    return data ?? [];
  },
  ["active-programs"],
  { revalidate: 3600 }
);

export async function getActivePrograms() {
  return fetchActiveProgramsCached();
}

export async function getProgramLevels(programId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("levels")
    .select("*")
    .eq("program_id", programId)
    .eq("is_active", true)
    .order("sort_order");

  return data ?? [];
}
