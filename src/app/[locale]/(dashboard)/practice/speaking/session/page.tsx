import { getTranslations } from "next-intl/server";
import { PracticeSpeakingSession } from "@/components/ai-practice/practice-speaking-session";
import {
  buildPracticeHistoryLabels,
  buildSpeakingSessionLabels,
} from "@/lib/ai-practice/practice-labels";
import { getPracticeHistorySummary } from "@/lib/ai-practice/practice-history";
import { requirePracticeSubscriptionContext } from "@/lib/subscriptions/practice-subscription-context";

export default async function PracticeSpeakingSessionPage() {
  const t = await getTranslations("aiPractice");
  const labels = buildSpeakingSessionLabels((key) => t(key));
  const historyLabels = buildPracticeHistoryLabels((key) => t(key));
  const [historySummary, subscriptionContext] = await Promise.all([
    getPracticeHistorySummary("speaking"),
    requirePracticeSubscriptionContext(),
  ]);

  return (
    <PracticeSpeakingSession
      labels={labels}
      historySummary={historySummary}
      historyLabels={historyLabels}
      aiUsage={subscriptionContext.aiUsage}
      aiUsageLabels={subscriptionContext.aiUsageLabels}
      limitDialogLabels={subscriptionContext.limitDialogLabels}
    />
  );
}
