import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getAiUsageStatus } from "@/lib/subscriptions/ai-usage";
import {
  buildAiLimitDialogLabels,
  buildAiUsageBadgeLabels,
} from "@/lib/subscriptions/subscription-labels";

export async function getPracticeSubscriptionContext() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [aiUsage, tSub] = await Promise.all([
    getAiUsageStatus(user.id, user.email),
    getTranslations("subscriptions"),
  ]);

  return {
    aiUsage,
    aiUsageLabels: buildAiUsageBadgeLabels((key) => tSub(key)),
    limitDialogLabels: buildAiLimitDialogLabels((key) => tSub(key)),
  };
}

export async function requirePracticeSubscriptionContext() {
  const context = await getPracticeSubscriptionContext();
  if (!context) redirect("/login");
  return context;
}
