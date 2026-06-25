import { getTranslations } from "next-intl/server";
import { PracticeSetupForm } from "@/components/ai-practice/practice-setup-form";
import { PracticeHistoryPanel } from "@/components/ai-practice/practice-history-panel";
import { StudentPageShell } from "@/components/camba";
import {
  buildPracticeHistoryLabels,
  buildSpeakingSetupLabels,
} from "@/lib/ai-practice/practice-labels";
import { getPracticeHistorySummary } from "@/lib/ai-practice/practice-history";
import { requirePracticeSubscriptionContext } from "@/lib/subscriptions/practice-subscription-context";

export default async function PracticeSpeakingSetupPage() {
  const t = await getTranslations("aiPractice");
  const labels = buildSpeakingSetupLabels((key) => t(key));
  const historyLabels = buildPracticeHistoryLabels((key) => t(key));
  const [historySummary, subscriptionContext] = await Promise.all([
    getPracticeHistorySummary("speaking"),
    requirePracticeSubscriptionContext(),
  ]);

  return (
    <StudentPageShell narrow>
      <div className="camba-section-stack gap-8 max-w-2xl mx-auto">
        <PracticeSetupForm
          skill="speaking"
          labels={labels}
          sessionPath="/practice/speaking/session"
          aiUsage={subscriptionContext.aiUsage}
          aiUsageLabels={subscriptionContext.aiUsageLabels}
          limitDialogLabels={subscriptionContext.limitDialogLabels}
        />
        <PracticeHistoryPanel skill="speaking" summary={historySummary} labels={historyLabels} />
      </div>
    </StudentPageShell>
  );
}
