import { getTranslations } from "next-intl/server";
import { PracticeSetupForm } from "@/components/ai-practice/practice-setup-form";
import { StudentPageShell } from "@/components/camba";
import { buildSpeakingSetupLabels } from "@/lib/ai-practice/practice-labels";

export default async function PracticeSpeakingSetupPage() {
  const t = await getTranslations("aiPractice");
  const labels = buildSpeakingSetupLabels((key) => t(key));

  return (
    <StudentPageShell narrow>
      <PracticeSetupForm skill="speaking" labels={labels} sessionPath="/practice/speaking/session" />
    </StudentPageShell>
  );
}
