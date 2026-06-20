import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";
import { MASTERY_UNLOCK_THRESHOLD } from "@/lib/constants";

export async function getProgramSetting<T>(
  programId: string,
  key: string,
  defaultValue: T
): Promise<T> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("program_settings")
    .select("value")
    .eq("program_id", programId)
    .eq("key", key)
    .maybeSingle();

  if (!data?.value) return defaultValue;

  const raw = data.value;

  if (typeof defaultValue === "number") {
    if (typeof raw === "number") return raw as T;
    if (typeof raw === "string") return Number(raw) as T;
    if (typeof raw === "object" && raw !== null && "value" in (raw as object)) {
      return Number((raw as { value: unknown }).value) as T;
    }
  }

  if (typeof defaultValue === "string" && typeof raw === "string") {
    return raw as T;
  }

  if (typeof defaultValue === "object" && typeof raw === "object") {
    return raw as T;
  }

  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  }

  return defaultValue;
}

export async function getShieldScaleMax(programId: string): Promise<number> {
  const value = await getProgramSetting<number | string>(
    programId,
    "shield_scale_max",
    15
  );
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 15;
}

export async function getMasteryUnlockThreshold(programId: string): Promise<number> {
  const value = await getProgramSetting<number | string>(
    programId,
    "mastery_unlock_threshold",
    MASTERY_UNLOCK_THRESHOLD
  );
  return typeof value === "number" ? value : Number(value) || MASTERY_UNLOCK_THRESHOLD;
}

export async function upsertProgramSetting(
  programId: string,
  key: string,
  value: Json,
  description?: string
): Promise<void> {
  const supabase = await createClient();

  await supabase.from("program_settings").upsert(
    {
      program_id: programId,
      key,
      value,
      description: description ?? null,
    },
    { onConflict: "program_id,key" }
  );
}
