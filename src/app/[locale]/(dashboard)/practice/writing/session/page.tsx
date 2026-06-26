import { getTranslations } from "next-intl/server";
import { PracticeWritingSession } from "@/components/ai-practice/practice-writing-session";
import {
  buildPracticeHistoryLabels,
  buildWritingSessionLabels,
} from "@/lib/ai-practice/practice-labels";
import { getPracticeHistorySummary } from "@/lib/ai-practice/practice-history";
import { getPracticeProgress } from "@/actions/ai-practice";
import { requirePracticeSubscriptionContext } from "@/lib/subscriptions/practice-subscription-context";

export default async function PracticeWritingSessionPage() {
  const t = await getTranslations("aiPractice");
  const labels = buildWritingSessionLabels((key) => t(key));
  const historyLabels = buildPracticeHistoryLabels((key) => t(key));
  const [historySummary, progress, subscriptionContext] = await Promise.all([
    getPracticeHistorySummary("writing"),
    getPracticeProgress("writing"),
    requirePracticeSubscriptionContext(),
  ]);

  return (
    <PracticeWritingSession
      labels={labels}
      historySummary={historySummary}
      historyLabels={historyLabels}
      progress={progress}
      aiUsage={subscriptionContext.aiUsage}
      aiUsageLabels={subscriptionContext.aiUsageLabels}
      limitDialogLabels={subscriptionContext.limitDialogLabels}
    />
  );
}
