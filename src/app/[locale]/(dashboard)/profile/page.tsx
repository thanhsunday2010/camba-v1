import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { StudentPageShell } from "@/components/camba";
import { getStudentPortfolioViewModel } from "@/lib/profile/student-profile-view-model";
import { StudentProfileView } from "@/components/profile/student-profile-view";
import {
  buildAchievementItemLabels,
  buildSharedAchievementLabels,
  resolveAchievementText,
} from "@/lib/achievements/achievement-i18n";
import { buildMockTestPageLabels } from "@/lib/mock-tests/mock-test-labels";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = await getTranslations("profile");
  const [ta, tmc, tj, mockLabels, model] = await Promise.all([
    getTranslations("achievements"),
    getTranslations("mockCenter"),
    getTranslations("journey"),
    buildMockTestPageLabels(),
    getStudentPortfolioViewModel(user, t("nextMilestoneFallback")),
  ]);

  const achievementItems = buildAchievementItemLabels(ta);
  const achievementShared = buildSharedAchievementLabels(ta);
  const resolveAchievement = (a: Parameters<typeof resolveAchievementText>[0]) =>
    resolveAchievementText(a, achievementItems);

  const resolveMilestone = (titleKey: string) => {
    try {
      return tj(titleKey as Parameters<typeof tj>[0]);
    } catch {
      return achievementItems[titleKey]?.title ?? titleKey;
    }
  };

  const resolveCertTitle = (entry: (typeof model.certifications.entries)[number]) => {
    if (entry.kind === "achievement") {
      return achievementItems[entry.title]?.title ?? entry.title;
    }
    return entry.title;
  };

  const resolveGoal = (key: string) => {
    try {
      return t(key as Parameters<typeof t>[0]);
    } catch {
      return achievementItems[key]?.title ?? key;
    }
  };

  return (
    <StudentPageShell narrow>
      <StudentProfileView
        model={model}
        resolveAchievementText={resolveAchievement}
        resolveCertificationTitle={resolveCertTitle}
        resolveGoalTitle={resolveGoal}
        resolveGoalDescription={resolveGoal}
        labels={{
          hero: {
            portfolioLabel: t("portfolioLabel"),
            level: t("level"),
            xp: t("xp"),
            streak: t("streak"),
            days: t("days"),
            bestStreak: t("bestStreak"),
            profileCompletion: t("profileCompletion"),
            memberSince: t("memberSince"),
            editSettings: t("editSettings"),
            cefrEstimate: t("cefrEstimate"),
          },
          snapshot: {
            title: t("snapshotTitle"),
            subtitle: t("snapshotSubtitle"),
            level: t("level"),
            cefr: t("cefrEstimate"),
            units: t("unitsCompleted"),
            mocks: t("mocksCompleted"),
            writing: t("writingTasks"),
            speaking: t("speakingTasks"),
            certifications: t("certificationsEarned"),
            achievements: t("achievementsUnlocked"),
            emptyNote: t("snapshotEmptyNote"),
          },
          learning: {
            title: t("learningTitle"),
            subtitle: t("learningSubtitle"),
            currentUnit: t("currentUnit"),
            currentLesson: t("currentLesson"),
            unitsCompleted: t("unitsCompleted"),
            lessonsCompleted: t("lessonsCompleted"),
            progress: t("progress"),
            nextMilestone: t("nextMilestone"),
            viewJourney: t("viewJourney"),
            emptyTitle: t("learningEmptyTitle"),
            emptyDescription: t("learningEmptyDescription"),
            emptyAction: t("learningEmptyAction"),
          },
          mockPerformance: {
            title: t("mockTitle"),
            subtitle: t("mockSubtitle"),
            bestScore: t("bestScore"),
            latestScore: t("latestScore"),
            mocksCompleted: t("mocksCompleted"),
            readiness: t("readiness"),
            trendImproving: t("trendImproving"),
            trendStable: t("trendStable"),
            trendBuilding: t("trendBuilding"),
            recentResults: t("recentResults"),
            viewMockCenter: t("viewMockCenter"),
            recommended: t("recommendedMock"),
            emptyTitle: t("mockEmptyTitle"),
            emptyDescription: t("mockEmptyDescription"),
            emptyAction: t("mockEmptyAction"),
            card: {
              ...mockLabels.hub,
              goldBadge: tmc("goldBadge"),
              writingAi: tmc("writingAi"),
              speakingAi: tmc("speakingAi"),
              difficultyStandard: tmc("difficultyStandard"),
              difficultyReview: tmc("difficultyReview"),
              difficultyChallenge: tmc("difficultyChallenge"),
              startTest: mockLabels.detail.startTest,
              resumeTest: tmc("resumeTest"),
              retakeTest: mockLabels.detail.retakeTest,
            },
          },
          writing: {
            title: t("writingTitle"),
            subtitle: t("writingSubtitle"),
            tasksCompleted: t("writingTasks"),
            averageScore: t("averageScore"),
            strengths: t("strengths"),
            improvements: t("improvements"),
            recent: t("recentActivity"),
            trendImproving: t("trendImproving"),
            trendStable: t("trendStable"),
            trendBuilding: t("trendBuilding"),
            viewLearning: t("viewLearning"),
            emptyTitle: t("writingEmptyTitle"),
            emptyDescription: t("writingEmptyDescription"),
            emptyAction: t("writingEmptyAction"),
          },
          speaking: {
            title: t("speakingTitle"),
            subtitle: t("speakingSubtitle"),
            tasksCompleted: t("speakingTasks"),
            averageScore: t("averageScore"),
            pronunciation: t("pronunciation"),
            fluency: t("fluency"),
            vocabulary: t("vocabulary"),
            recent: t("recentActivity"),
            trendImproving: t("trendImproving"),
            trendStable: t("trendStable"),
            trendBuilding: t("trendBuilding"),
            viewLearning: t("viewLearning"),
            emptyTitle: t("speakingEmptyTitle"),
            emptyDescription: t("speakingEmptyDescription"),
            emptyAction: t("speakingEmptyAction"),
          },
          certifications: {
            title: t("certificationsTitle"),
            subtitle: t("certificationsSubtitle"),
            goldMock: t("goldMockCert"),
            levelComplete: t("levelCompleteCert"),
            achievement: t("achievementCert"),
            emptyTitle: t("certificationsEmptyTitle"),
            emptyDescription: t("certificationsEmptyDescription"),
            emptyAction: t("certificationsEmptyAction"),
          },
          achievements: {
            ...achievementShared,
            title: ta("showcaseTitle"),
            subtitle: ta("showcaseSubtitle"),
            emptyTitle: ta("showcaseEmptyTitle"),
            emptyDescription: ta("showcaseEmptyDescription"),
            emptyAction: ta("showcaseEmptyAction"),
            viewAll: ta("viewAll"),
            unlockedSummary: ta("unlockedSummary"),
            rareTitle: t("rareAchievementsTitle"),
            rareSubtitle: t("rareAchievementsSubtitle"),
            next: {
              title: ta("nextTitle"),
              subtitle: ta("nextSubtitle"),
              progressRemaining: ta("progressRemaining"),
              progressComplete: ta("progressComplete"),
              viewAchievements: ta("viewAll"),
              emptyTitle: ta("nextEmptyTitle"),
              emptyDescription: ta("nextEmptyDescription"),
              emptyAction: ta("showcaseEmptyAction"),
            },
          },
          journey: {
            title: t("journeyTitle"),
            subtitle: t("journeySubtitle"),
            currentLevel: t("currentLevel"),
            levelsCompleted: t("levelsCompleted"),
            journeyProgress: t("journeyProgress"),
            currentMilestone: t("currentMilestone"),
            nextMilestone: t("nextMilestone"),
            viewJourney: t("viewJourney"),
            emptyTitle: t("journeyEmptyTitle"),
            emptyDescription: t("journeyEmptyDescription"),
            emptyAction: t("journeyEmptyAction"),
            resolveMilestone,
          },
          futureGoals: {
            title: t("goalsTitle"),
            subtitle: t("goalsSubtitle"),
            emptyTitle: t("goalsEmptyTitle"),
            emptyDescription: t("goalsEmptyDescription"),
            resolveTitle: (goal) => resolveGoal(goal.titleKey),
            resolveDescription: (goal) => resolveGoal(goal.descriptionKey),
          },
        }}
      />
    </StudentPageShell>
  );
}
