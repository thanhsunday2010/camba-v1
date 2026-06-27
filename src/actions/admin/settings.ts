"use server";

import { revalidatePath } from "next/cache";
import { createAdminAnalyticsClient } from "@/lib/supabase/admin-analytics";
import { writeAuditLog } from "@/lib/admin/audit";
import { requirePermission } from "@/actions/admin/_shared";
import { AI_DAILY_LIMITS, SUBSCRIPTION_PROGRAMS } from "@/lib/subscriptions/subscription-catalog";
import type { SubscriptionTier } from "@/lib/subscriptions/subscription-types";
import type { Json } from "@/types/database";

export interface AdminProgramRow {
  id: string;
  name: string;
  slug: string;
}

export interface AdminProgramSettingRow {
  key: string;
  value: unknown;
  description: string | null;
}

export interface AdminAiLimitTierRow {
  tier: SubscriptionTier;
  tierLabel: string;
  dailyAiLimit: number;
}

const KNOWN_SETTING_KEYS = [
  {
    key: "mastery_unlock_threshold",
    label: "Ngưỡng mastery mở khóa",
    type: "number" as const,
    defaultValue: 3,
    description: "Mức mastery cần để mở bài học tiếp theo",
  },
  {
    key: "shield_scale_max",
    label: "Shield tối đa",
    type: "number" as const,
    defaultValue: 15,
    description: "Thang điểm shield tối đa cho chương trình YLE",
  },
  {
    key: "placement_test_questions",
    label: "Số câu placement test",
    type: "number" as const,
    defaultValue: 20,
    description: "Số câu hỏi trong bài placement test",
  },
];

function revalidateSettings() {
  revalidatePath("/admin/system/settings", "layout");
}

export async function listAdminPrograms(): Promise<AdminProgramRow[]> {
  await requirePermission("platform.settings");

  const supabase = createAdminAnalyticsClient();
  const { data } = (await supabase
    .from("programs")
    .select("id, name, slug")
    .order("sort_order")) as { data: AdminProgramRow[] | null };

  return data ?? [];
}

export async function getProgramSettings(
  programId: string
): Promise<AdminProgramSettingRow[]> {
  await requirePermission("platform.settings");

  const supabase = createAdminAnalyticsClient();
  const { data } = (await supabase
    .from("program_settings")
    .select("key, value, description")
    .eq("program_id", programId)) as {
    data: { key: string; value: unknown; description: string | null }[] | null;
  };

  const map = new Map((data ?? []).map((r) => [r.key, r]));

  return KNOWN_SETTING_KEYS.map((def) => {
    const existing = map.get(def.key);
    let value: unknown = existing?.value ?? def.defaultValue;
    if (typeof value === "object" && value !== null && "value" in (value as object)) {
      value = (value as { value: unknown }).value;
    }
    if (typeof value === "string" && def.type === "number") {
      value = Number(value) || def.defaultValue;
    }
    return {
      key: def.key,
      value,
      description: existing?.description ?? def.description,
    };
  });
}

export { KNOWN_SETTING_KEYS };

export async function saveProgramSetting(input: {
  programId: string;
  key: string;
  value: number | string;
}): Promise<{ success: boolean; error?: string }> {
  const actor = await requirePermission("platform.settings");
  const def = KNOWN_SETTING_KEYS.find((k) => k.key === input.key);
  if (!def) return { success: false, error: "Khóa cài đặt không hợp lệ" };

  const supabase = createAdminAnalyticsClient();
  const { error } = await supabase.from("program_settings").upsert(
    {
      program_id: input.programId,
      key: input.key,
      value: input.value as Json,
      description: def.description,
    },
    { onConflict: "program_id,key" }
  );

  if (error) return { success: false, error: error.message };

  await writeAuditLog({
    actorId: actor.id,
    action: "platform.program_setting_update",
    resourceType: "program_setting",
    resourceId: input.programId,
    metadata: { key: input.key, value: input.value },
  });

  revalidateSettings();
  return { success: true };
}

export async function getDefaultAiLimits(): Promise<AdminAiLimitTierRow[]> {
  await requirePermission("platform.settings");

  const tiers: SubscriptionTier[] = ["free", "pro", "vip"];
  const labels: Record<SubscriptionTier, string> = {
    free: "Free",
    pro: "Pro",
    vip: "VIP",
  };

  return tiers.map((tier) => ({
    tier,
    tierLabel: labels[tier],
    dailyAiLimit: AI_DAILY_LIMITS[tier],
  }));
}

export async function getPlatformCatalogSummary(): Promise<
  { programId: string; programName: string; tierCount: number }[]
> {
  await requirePermission("platform.settings");

  const programs = await listAdminPrograms();
  return programs.map((p) => ({
    programId: p.id,
    programName: p.name,
    tierCount: SUBSCRIPTION_PROGRAMS[0]?.plans.length ?? 3,
  }));
}
