import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/actions/auth";
import { getMockTestsList } from "@/actions/mock-tests";
import { MockTestList } from "@/components/learning/mock-test-list";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default async function MockTestsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = await getTranslations("mockTests");
  const tests = await getMockTestsList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      {tests.length === 0 ? (
        <div className="space-y-4">
          <MockTestList
            tests={[]}
            labels={{
              start: t("start"),
              retake: t("retake"),
              questions: t("questions"),
              minutes: t("minutes"),
              bestScore: t("bestScore"),
              attempts: t("attempts"),
              noTests: t("noTests"),
              noTestsDesc: t("noTestsDesc"),
              level: t("level"),
            }}
          />
          <div className="text-center">
            <Link href="/placement-test">
              <Button variant="outline">{t("takePlacementFirst")}</Button>
            </Link>
          </div>
        </div>
      ) : (
        <MockTestList
          tests={tests}
          labels={{
            start: t("start"),
            retake: t("retake"),
            questions: t("questions"),
            minutes: t("minutes"),
            bestScore: t("bestScore"),
            attempts: t("attempts"),
            noTests: t("noTests"),
            noTestsDesc: t("noTestsDesc"),
            level: t("level"),
          }}
        />
      )}
    </div>
  );
}
