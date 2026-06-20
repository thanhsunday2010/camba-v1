import { redirect, notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/actions/auth";
import { getMockTestData } from "@/actions/mock-tests";
import { MockTestPlayer } from "@/components/learning/mock-test-player";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

interface MockTestPageProps {
  params: Promise<{ testId: string }>;
}

export default async function MockTestTakePage({ params }: MockTestPageProps) {
  const { testId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = await getTranslations("mockTests");
  const test = await getMockTestData(testId);

  if (!test) notFound();

  const questionCount = test.sections.reduce((n, s) => n + s.questions.length, 0);
  if (questionCount === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t("notAvailable")}</p>
        <Link href="/mock-tests" className="inline-block mt-4">
          <Button variant="outline">{t("backToList")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link href="/mock-tests">
        <Button variant="ghost" size="sm">← {t("backToList")}</Button>
      </Link>
      <MockTestPlayer
        test={test}
        labels={{
          section: t("section"),
          question: t("question"),
          of: t("of"),
          previous: t("previous"),
          next: t("next"),
          submit: t("submit"),
          submitting: t("submitting"),
          complete: t("complete"),
          totalScore: t("totalScore"),
          skillBreakdown: t("skillBreakdown"),
          shields: t("shields"),
          backToList: t("backToList"),
        }}
      />
    </div>
  );
}
