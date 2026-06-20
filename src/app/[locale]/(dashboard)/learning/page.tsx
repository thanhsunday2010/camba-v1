import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getUserGamification } from "@/lib/queries/user";
import { getLearningPath, initializeLessonUnlocks } from "@/lib/queries/learning";
import { LearningUnitPath } from "@/components/learning/learning-unit-path";
import { fetchActiveProgramContext, fetchLevelsForProgram } from "@/actions/programs";
import { LevelPicker } from "@/components/programs/level-picker";
import { isUnlockAllLessonsEnabled } from "@/lib/learning/unlock-all-lessons";

export default async function LearningPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = await getTranslations("learning");
  const tp = await getTranslations("programs");
  const tm = await getTranslations("mastery");

  const gamification = await getUserGamification(user.id);
  const programContext = await fetchActiveProgramContext(gamification);

  if (!programContext?.programId) {
    redirect("/settings");
  }

  if (!gamification?.current_level_id) {
    const levels = await fetchLevelsForProgram(programContext.programId);

    return (
      <div className="max-w-2xl mx-auto space-y-8 py-6">
        <LevelPicker
          levels={levels}
          currentLevelId={null}
          redirectToLearning
          labels={{
            title: tp("levelTitle"),
            subtitle: tp("levelSubtitle"),
            select: tp("levelSelect"),
            selecting: tp("selecting"),
            current: tp("currentLevel"),
            startLearning: tp("startLearning"),
          }}
        />
      </div>
    );
  }

  const levels = await fetchLevelsForProgram(programContext.programId);

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
      {isUnlockAllLessonsEnabled() && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Chế độ test nội dung: tất cả bài học trong level này đã mở khóa. Tắt{" "}
          <code className="text-xs bg-amber-100 px-1 rounded">NEXT_PUBLIC_UNLOCK_ALL_LESSONS</code>{" "}
          khi triển khai học tuần tự.
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      {levels.length > 0 && (
        <LevelPicker
          levels={levels}
          currentLevelId={gamification.current_level_id}
          labels={{
            title: tp("levelTitle"),
            subtitle: tp("levelChangeSubtitle"),
            select: tp("levelSelect"),
            selecting: tp("selecting"),
            current: tp("currentLevel"),
            startLearning: tp("startLearning"),
          }}
        />
      )}

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
