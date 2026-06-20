import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getUserGamification } from "@/lib/queries/user";
import { getLearningPath, initializeLessonUnlocks } from "@/lib/queries/learning";
import { LearningUnitPath } from "@/components/learning/learning-unit-path";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";

export default async function LearningPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = await getTranslations("learning");
  const tm = await getTranslations("mastery");

  const gamification = await getUserGamification(user.id);

  if (!gamification?.current_level_id) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-12">
        <ClipboardList className="h-16 w-16 text-primary mx-auto" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("noLevelTitle")}</h1>
          <p className="text-gray-500 mt-2">{t("noLevelDesc")}</p>
        </div>
        <Link href="/placement-test">
          <Button size="lg">{t("takePlacementTest")}</Button>
        </Link>
      </div>
    );
  }

  await initializeLessonUnlocks(user.id, gamification.current_level_id);
  const path = await getLearningPath(user.id, gamification.current_level_id);

  if (!path) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t("noContent")}</p>
      </div>
    );
  }

  const masteryLabels: Record<number, string> = {
    0: tm("notStarted"),
    1: tm("beginner"),
    2: tm("developing"),
    3: tm("proficient"),
    4: tm("mastered"),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      <LearningUnitPath
        levelName={path.level.name}
        levelSlug={path.level.slug}
        programName={path.program.name}
        skills={path.skills}
        masteryLabels={masteryLabels}
      />
    </div>
  );
}
