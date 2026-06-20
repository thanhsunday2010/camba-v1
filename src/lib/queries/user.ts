import { createClient } from "@/lib/supabase/server";
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

export async function getActivePrograms() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("programs")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  return data ?? [];
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
