import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { SUBSCRIPTION_PROGRAMS } from "@/lib/subscriptions/subscription-catalog";
import { getAiUsageStatus } from "@/lib/subscriptions/ai-usage";
import type {
  SubscriptionProgram,
  SubscriptionProgramCatalog,
  UserSubscriptionStatus,
} from "@/lib/subscriptions/subscription-types";

export async function getUserSubscriptionStatus(): Promise<UserSubscriptionStatus | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const [aiUsage, { data: subscriptions }] = await Promise.all([
    getAiUsageStatus(user.id),
    supabase
      .from("user_subscriptions")
      .select("program, tier, status")
      .eq("user_id", user.id)
      .eq("status", "active"),
  ]);

  const activePrograms = ((subscriptions ?? []) as Array<{ program: SubscriptionProgram }>)
    .map((row) => row.program)
    .filter(Boolean);

  return {
    effectiveTier: aiUsage.tier,
    aiUsage,
    activePrograms,
  };
}

export function getSubscriptionCatalog(): SubscriptionProgramCatalog[] {
  return SUBSCRIPTION_PROGRAMS;
}
