import { getTranslations } from "next-intl/server";
import { PracticeWritingSession } from "@/components/ai-practice/practice-writing-session";
import {
  buildPracticeHistoryLabels,
  buildWritingSessionLabels,
} from "@/lib/ai-practice/practice-labels";
import { getPracticeHistorySummary } from "@/lib/ai-practice/practice-history";

export default async function PracticeWritingSessionPage() {
  const t = await getTranslations("aiPractice");
  const labels = buildWritingSessionLabels((key) => t(key));
  const historyLabels = buildPracticeHistoryLabels((key) => t(key));
  const historySummary = await getPracticeHistorySummary("writing");

  return (
    <PracticeWritingSession
      labels={labels}
      historySummary={historySummary}
      historyLabels={historyLabels}
    />
  );
}
