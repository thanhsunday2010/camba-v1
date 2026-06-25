import { getTranslations } from "next-intl/server";
import { PracticeSpeakingSession } from "@/components/ai-practice/practice-speaking-session";
import { buildSpeakingSessionLabels } from "@/lib/ai-practice/practice-labels";

export default async function PracticeSpeakingSessionPage() {
  const t = await getTranslations("aiPractice");
  const labels = buildSpeakingSessionLabels((key) => t(key));

  return <PracticeSpeakingSession labels={labels} />;
}
