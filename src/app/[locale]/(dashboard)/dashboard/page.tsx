import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { StudentDashboardHubView } from "@/components/dashboard/student-dashboard-hub-view";
import { getStudentDashboardData } from "@/lib/dashboard/student-dashboard-data";
import { buildMockTestPageLabels } from "@/lib/mock-tests/mock-test-labels";
import { buildDashboardAiPracticeLabels, buildPracticeHistoryLabels } from "@/lib/ai-practice/practice-labels";
import { getPracticeDashboardSummaries } from "@/lib/ai-practice/practice-history";
import { parseDashboardHubTab } from "@/lib/dashboard/dashboard-hub-routes";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;

  const { tab } = await searchParams;
  const activeTab = parseDashboardHubTab(tab);

  const t = await getTranslations("dashboard");
  const ta = await getTranslations("ai");
  const tp = await getTranslations("programs");
  const tap = await getTranslations("aiPractice");

  const userName = user.fullName || user.email.split("@")[0];
  const mockLabels = await buildMockTestPageLabels();

  const [dashboardData, practiceSummaries] = await Promise.all([
    getStudentDashboardData(
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
    ),
    getPracticeDashboardSummaries(),
  ]);

  const practiceHistoryLabels = buildPracticeHistoryLabels((key) => tap(key));

  return (
    <StudentDashboardHubView
      activeTab={activeTab}
      tabLabels={{
        overview: t("hubTabOverview"),
        achievements: t("hubTabAchievements"),
        profile: t("hubTabProfile"),
      }}
      overview={{
        userName,
        data: dashboardData,
        labels: {
          hero: {
            welcomeBack: t("welcomeBack"),
            progressingThrough: t("progressingThrough"),
            currentStreak: t("currentStreakLabel"),
            days: t("days"),
            xp: t("xp"),
            level: t("level"),
            cefrEstimate: t("cefrEstimate"),
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
          aiPracticeHistory: {
            writingSummary: practiceSummaries.writing,
            speakingSummary: practiceSummaries.speaking,
            labels: practiceHistoryLabels,
          },
          sectionExpand: t("sectionExpand"),
          sectionCollapse: t("sectionCollapse"),
          progressStripLabel: t("progressStripLabel"),
          leaderboards: {
            sectionTitle: t("leaderboardsTitle"),
            sectionSubtitle: t("leaderboardsSubtitle"),
            weeklyLeague: t("leaderboardsWeekly"),
            levelBoard: t("leaderboardsLevel"),
            streakBoard: t("leaderboardsStreak"),
            yourRank: t("leaderboardsYourRank"),
            empty: t("leaderboardsEmpty"),
            xpUnit: t("leaderboardsXpUnit"),
            streakUnit: t("leaderboardsStreakUnit"),
            tierLabel: t("leaderboardsTierLabel"),
            promoteHint: t("leaderboardsPromoteHint"),
            maxTierHint: t("leaderboardsMaxTierHint"),
            tierNames: {
              bronze: t("leaderboardTierBronze"),
              silver: t("leaderboardTierSilver"),
              gold: t("leaderboardTierGold"),
              platinum: t("leaderboardTierPlatinum"),
              diamond: t("leaderboardTierDiamond"),
              master: t("leaderboardTierMaster"),
              grandmaster: t("leaderboardTierGrandmaster"),
              champion: t("leaderboardTierChampion"),
            },
          },
        },
      }}
    />
  );
}
