import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { StudentDashboardView } from "@/components/dashboard/student-dashboard-view";
import { getStudentDashboardData } from "@/lib/dashboard/student-dashboard-data";
import { buildMockTestPageLabels } from "@/lib/mock-tests/mock-test-labels";
import { buildSharedAchievementLabels } from "@/lib/achievements/achievement-i18n";
import { buildDashboardAiPracticeLabels } from "@/lib/ai-practice/practice-labels";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const t = await getTranslations("dashboard");
  const ta = await getTranslations("ai");
  const tp = await getTranslations("programs");
  const taAch = await getTranslations("achievements");
  const tap = await getTranslations("aiPractice");
  const mockLabels = await buildMockTestPageLabels();
  const achievementShared = buildSharedAchievementLabels(taAch);

  const userName = user.fullName || user.email.split("@")[0];

  const data = await getStudentDashboardData(
    user.id,
    {
      completeMission: t("dailyMissionComplete"),
      continueLesson: t("continueLesson"),
      takeMock: t("dailyMissionTakeMock"),
      reviewSkill: t("dailyMissionReviewSkill"),
      startLearning: t("startLearning"),
      viewMock: t("dailyMissionViewMock"),
      skillReviewDesc: t("dailyMissionSkillReviewDesc"),
    },
    {
      vocabulary: ta("vocabulary"),
      grammar: ta("grammar"),
      reading: t("skillReading"),
      listening: t("skillListening"),
      writing: t("skillWriting"),
      speaking: t("skillSpeaking"),
    },
    {
      strong: t("skillStrong"),
      focus: t("skillFocus"),
    },
    {
      badgeEarned: t("activityBadgeEarned"),
    }
  );

  return (
    <StudentDashboardView
      userName={userName}
      data={data}
      labels={{
        hero: {
          welcomeBack: t("welcomeBack"),
          progressingThrough: t("progressingThrough"),
          currentStreak: t("currentStreakLabel"),
          days: t("days"),
          xp: t("xp"),
          level: t("level"),
          cefrEstimate: t("cefrEstimate"),
          viewPortfolio: t("viewPortfolio"),
        },
        dailyMission: {
          title: t("dailyMissionTitle"),
          subtitle: t("dailyMissionSubtitle"),
          emptyTitle: t("dailyMissionEmpty"),
          emptyDescription: t("dailyMissionEmptyDesc"),
          emptyAction: t("startLearning"),
        },
        continueLearning: {
          title: t("continueSectionTitle"),
          subtitle: t("continueSectionSubtitle"),
          continueLesson: t("continueLesson"),
          startLearning: t("startLearning"),
          viewPath: t("viewLearningPath"),
          minutes: t("minutes"),
          emptyTitle: t("continueEmptyTitle"),
          emptyDescription: t("continueEmptyDesc"),
          inProgress: t("lessonInProgress"),
          lastActivity: t("lastActivity"),
          unitPrefix: t("unitPrefix"),
        },
        weeklyProgress: {
          title: t("weeklyProgressTitle"),
          subtitle: t("weeklyProgressSubtitle"),
          xpEarned: t("weeklyXpEarned"),
          lessonsCompleted: t("weeklyLessonsCompleted"),
          mockTestsCompleted: t("weeklyMocksCompleted"),
          writingTasksCompleted: t("weeklyWritingCompleted"),
          speakingTasksCompleted: t("weeklySpeakingCompleted"),
          emptyNote: t("weeklyProgressEmptyNote"),
        },
        recommendedMock: {
          ...mockLabels.hub,
          title: t("recommendedMockTitle"),
          subtitle: t("recommendedMockSubtitle"),
          emptyTitle: t("mockTestsEmpty"),
          emptyDescription: t("mockTestsEmptyDesc"),
          emptyAction: t("startMockTest"),
          viewAll: t("viewAll"),
          goldBadge: t("goldMockBadge"),
          writingAi: t("writingAi"),
          speakingAi: t("speakingAi"),
          difficultyStandard: t("difficultyStandard"),
          difficultyReview: t("difficultyReview"),
          difficultyChallenge: t("difficultyChallenge"),
          startTest: mockLabels.detail.startTest,
          resumeTest: t("resumeTest"),
          retakeTest: mockLabels.detail.retakeTest,
        },
        achievements: {
          ...achievementShared,
          title: taAch("showcaseTitle"),
          subtitle: taAch("showcaseSubtitle"),
          emptyTitle: taAch("showcaseEmptyTitle"),
          emptyDescription: taAch("showcaseEmptyDescription"),
          emptyAction: taAch("showcaseEmptyAction"),
          viewAll: taAch("viewAll"),
          unlockedSummary: taAch("unlockedSummary"),
          itemLabels: achievementShared.itemLabels,
          toastUnlocked: taAch("toastUnlocked"),
          toastCelebration: taAch("toastCelebration"),
          next: {
            title: taAch("nextTitle"),
            subtitle: taAch("nextSubtitle"),
            progressRemaining: taAch("progressRemaining"),
            progressComplete: taAch("progressComplete"),
            viewAchievements: taAch("viewAll"),
            emptyTitle: taAch("nextEmptyTitle"),
            emptyDescription: taAch("nextEmptyDescription"),
            emptyAction: taAch("showcaseEmptyAction"),
          },
        },
        skillInsights: {
          title: t("skillInsightsTitle"),
          subtitle: t("skillInsightsSubtitle"),
          strengths: t("skillInsightsStrengths"),
          weaknesses: t("skillInsightsWeaknesses"),
          grammar: ta("grammar"),
          vocabulary: ta("vocabulary"),
          skills: t("skillInsightsSkills"),
          viewDetails: t("skillInsightsViewDetails"),
          emptyTitle: t("skillInsightsEmpty"),
          emptyDescription: t("skillInsightsEmptyDesc"),
          emptyAction: t("skillProgressEmptyAction"),
        },
        recentActivity: {
          title: t("recentActivityTitle"),
          subtitle: t("recentActivitySubtitle"),
          emptyTitle: t("recentActivityEmpty"),
          emptyDescription: t("recentActivityEmptyDesc"),
          emptyAction: t("startLearning"),
          kindLesson: t("activityKindLesson"),
          kindMock: t("activityKindMock"),
          kindBadge: t("activityKindBadge"),
        },
        journeyPreview: {
          title: t("journeyPreviewTitle"),
          subtitle: t("journeyPreviewSubtitle"),
          currentLevel: t("journeyPreviewCurrentLevel"),
          currentUnit: t("journeyPreviewCurrentUnit"),
          nextMilestone: t("journeyPreviewNextMilestone"),
          openJourney: t("journeyPreviewOpen"),
          emptyTitle: t("journeyPreviewEmptyTitle"),
          emptyDescription: t("journeyPreviewEmptyDesc"),
          emptyAction: t("journeyPreviewEmptyAction"),
        },
        placement: {
          title: t("startPlacementTest"),
          description: t("startPlacementTestDesc"),
          button: t("startPlacementTest"),
        },
        programPicker: {
          title: tp("selectTitle"),
          subtitle: tp("selectSubtitle"),
          select: tp("select"),
          selecting: tp("selecting"),
          current: tp("current"),
        },
        skillLabels: {
          vocabulary: ta("vocabulary"),
          grammar: ta("grammar"),
          reading: t("skillReading"),
          listening: t("skillListening"),
          writing: t("skillWriting"),
          speaking: t("skillSpeaking"),
        },
        aiPractice: buildDashboardAiPracticeLabels((key) => tap(key)),
      }}
    />
  );
}
