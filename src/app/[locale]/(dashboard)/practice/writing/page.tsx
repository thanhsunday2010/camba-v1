import { getTranslations } from "next-intl/server";
import { PracticeSetupForm } from "@/components/ai-practice/practice-setup-form";
import { StudentPageShell } from "@/components/camba";
import { buildWritingSetupLabels } from "@/lib/ai-practice/practice-labels";

export default async function PracticeWritingSetupPage() {
  const t = await getTranslations("aiPractice");
  const labels = buildWritingSetupLabels((key) => t(key));

  return (
    <StudentPageShell narrow>
      <PracticeSetupForm skill="writing" labels={labels} sessionPath="/practice/writing/session" />
    </StudentPageShell>
  );
}
