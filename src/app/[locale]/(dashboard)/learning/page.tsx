import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getUserGamification } from "@/lib/queries/user";
import {
  getLearningPath,
  initializeLessonUnlocks,
} from "@/lib/queries/learning";
import {
  getNextLessonContext,
  getSkillProgressSnapshot,
} from "@/lib/queries/dashboard";
import { LearningPathView } from "@/components/learning/learning-path-view";
import { LearningPathEmpty } from "@/components/learning/learning-path-empty";
import { LearningLevelSwitcher } from "@/components/learning/learning-level-switcher";
import { StudentPageShell } from "@/components/camba";
import { fetchActiveProgramContext, fetchLevelsForProgram } from "@/actions/programs";
import { canBypassLessonUnlock, isUnlockAllLessonsEnabled } from "@/lib/learning/unlock-all-lessons";
import { buildDashboardAiPracticeLabels, buildPracticeHistoryLabels } from "@/lib/ai-practice/practice-labels";
import { getPracticeDashboardSummaries } from "@/lib/ai-practice/practice-history";
import type { LessonVisualState } from "@/lib/design/status-tokens";
import type { UnitVisualState } from "@/lib/learning/path-ui-utils";
import { BookOpen, Map } from "lucide-react";

export default async function LearningPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = await getTranslations("learning");
  const tp = await getTranslations("programs");
  const tm = await getTranslations("mastery");
  const td = await getTranslations("dashboard");
  const ta = await getTranslations("ai");
  const tap = await getTranslations("aiPractice");

  const gamification = await getUserGamification(user.id);
  const programContext = await fetchActiveProgramContext(gamification);

  if (!programContext?.programId) {
    redirect("/settings");
  }

  const levels = await fetchLevelsForProgram(programContext.programId);

  const skillLabels = {
    vocabulary: ta("vocabulary"),
    grammar: ta("grammar"),
    reading: td("skillReading"),
    listening: td("skillListening"),
    writing: td("skillWriting"),
    speaking: td("skillSpeaking"),
  };

  const masteryLabels: Record<number, string> = {
    0: tm("notStarted"),
    1: tm("beginner"),
    2: tm("developing"),
    3: tm("proficient"),
    4: tm("mastered"),
  };

  const lessonStateLabels: Record<LessonVisualState, string> = {
    locked: t("stateLocked"),
    unlocked: t("stateUnlocked"),
    "in-progress": t("stateInProgress"),
    completed: t("stateCompleted"),
    mastered: t("stateMastered"),
    recommended: t("stateRecommended"),
    "needs-review": t("stateNeedsReview"),
  };

  const unitStateLabels: Record<UnitVisualState, string> = {
    "coming-soon": t("unitStateComingSoon"),
    locked: t("unitStateLocked"),
    "not-started": t("unitStateNotStarted"),
    "in-progress": t("unitStateInProgress"),
    completed: t("unitStateCompleted"),
    mastered: t("unitStateMastered"),
  };

  if (!gamification?.current_level_id) {
    return (
      <StudentPageShell narrow>
        <LearningPathEmpty
          icon={Map}
          title={t("noLevelTitle")}
          description={t("noLevelDesc")}
        >
          {levels.length > 0 && (
            <LearningLevelSwitcher
              levels={levels}
              currentLevelId={null}
              pickMode
              labels={{
                title: tp("levelTitle"),
                selecting: tp("selecting"),
                current: tp("currentLevel"),
              }}
            />
          )}
        </LearningPathEmpty>
      </StudentPageShell>
    );
  }

  const levelId = gamification.current_level_id;

  await initializeLessonUnlocks(user.id, levelId);

  const [path, nextLesson, skillProgress, practiceSummaries] = await Promise.all([
    getLearningPath(user.id, levelId),
    getNextLessonContext(user.id, levelId),
    getSkillProgressSnapshot(user.id, levelId),
    getPracticeDashboardSummaries(),
  ]);

  if (!path) {
    return (
      <StudentPageShell narrow>
        <LearningPathEmpty
          icon={BookOpen}
          title={t("noContentTitle")}
          description={t("noContent")}
        />
      </StudentPageShell>
    );
  }

  const objectiveText = nextLesson
    ? t("objectiveNextLesson", { lesson: nextLesson.title })
    : t("objectiveExplore");

  const practiceHistoryLabels = buildPracticeHistoryLabels((key) => tap(key));

  return (
    <LearningPathView
      programSlug={path.program.slug}
      levelName={path.level.name}
      levelSlug={path.level.slug}
      currentLevelId={levelId}
      skills={path.skills}
      levels={levels}
      skillProgress={skillProgress}
      nextLesson={nextLesson}
      masteryLabels={masteryLabels}
      objectiveText={objectiveText}
      showUnlockAllBanner={isUnlockAllLessonsEnabled() || canBypassLessonUnlock(user.roles)}
      labels={{
        hero: {
          title: t("title"),
          subtitle: t("subtitle"),
          currentObjective: t("currentObjective"),
          continueLesson: td("continueLesson"),
          startLearning: td("startLearning"),
          viewAllUnits: t("viewAllUnits"),
          minutes: t("minutes"),
          levelProgress: t("levelProgress"),
          units: t("progressUnits"),
          lessons: t("progressLessons"),
          recommendedReason: td("recommendedReason"),
        },
        levelSwitcher: {
          title: tp("levelChangeSubtitle"),
          selecting: tp("selecting"),
          current: tp("currentLevel"),
        },
        skillLabels,
        review: {
          title: t("reviewTitle"),
          subtitle: t("reviewSubtitle"),
          stateNeedsReview: t("stateNeedsReview"),
          ctaReview: t("ctaReview"),
          minutes: t("minutes"),
          reasons: {
            lowMastery: t("reviewReasonLowMastery"),
            completedNotMastered: t("reviewReasonCompletedNotMastered"),
            weakAccuracy: t("reviewReasonWeakAccuracy"),
            needsPractice: t("reviewReasonNeedsPractice"),
          },
        },
        units: {
          skillNoContent: t("skillNoContent"),
          minutes: t("minutes"),
          lockedHint: t("lockedHint"),
          lockContinueLabel: t("lockContinueLabel"),
          unitComingSoon: t("unitComingSoon"),
          comingSoon: t("comingSoon"),
          recommended: t("stateRecommended"),
          needsReview: t("needsReviewMarker"),
          continueHere: t("continueHere"),
          lockedLessonsTitle: t("lockedLessonsTitle"),
          lockedUnitsTitle: t("lockedUnitsTitle"),
          lockedUnitsSubtitle: t("lockedUnitsSubtitle"),
          lessonStateLabels,
          unitStateLabels,
          ctaStart: t("ctaStart"),
          ctaContinue: t("ctaContinue"),
          ctaReview: t("ctaReview"),
          sectionTitle: t("journeyTitle"),
          sectionSubtitle: t("journeySubtitle"),
        },
        unlockAllBanner: t("unlockAllBanner"),
      }}
      aiPractice={{
        labels: buildDashboardAiPracticeLabels((key) => tap(key)),
        writingSummary: practiceSummaries.writing,
        speakingSummary: practiceSummaries.speaking,
        historyLabels: practiceHistoryLabels,
      }}
    />
  );
}
