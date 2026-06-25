import { getTranslations } from "next-intl/server";
import { PracticeWritingSession } from "@/components/ai-practice/practice-writing-session";
import { buildWritingSessionLabels } from "@/lib/ai-practice/practice-labels";

export default async function PracticeWritingSessionPage() {
  const t = await getTranslations("aiPractice");
  const labels = buildWritingSessionLabels((key) => t(key));

  return <PracticeWritingSession labels={labels} />;
}
