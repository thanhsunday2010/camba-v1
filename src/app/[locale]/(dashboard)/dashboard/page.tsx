import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { StudentDashboardHubView } from "@/components/dashboard/student-dashboard-hub-view";
import { getStudentDashboardData } from "@/lib/dashboard/student-dashboard-data";
import { buildMockTestPageLabels } from "@/lib/mock-tests/mock-test-labels";
import {
  buildAchievementItemLabels,
  buildSharedAchievementLabels,
  resolveAchievementViewModel,
} from "@/lib/achievements/achievement-i18n";
import { buildDashboardAiPracticeLabels, buildPracticeHistoryLabels } from "@/lib/ai-practice/practice-labels";
import { getPracticeDashboardSummaries } from "@/lib/ai-practice/practice-history";
import { parseDashboardHubTab } from "@/lib/dashboard/dashboard-hub-routes";
import { getAchievementViewModel } from "@/lib/achievements/achievement-view-model";
import { getStudentPortfolioViewModel } from "@/lib/profile/student-profile-view-model";
import { buildStudentProfileViewLabels } from "@/lib/profile/build-profile-view-labels";
import type { AchievementsCollectionLabels } from "@/components/achievements/achievements-collection-view";

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
  const taAch = await getTranslations("achievements");
  const tap = await getTranslations("aiPractice");
  const tProfile = await getTranslations("profile");
  const tmc = await getTranslations("mockCenter");
  const tj = await getTranslations("journey");

  const userName = user.fullName || user.email.split("@")[0];
  const mockLabels = await buildMockTestPageLabels();
  const achievementShared = buildSharedAchievementLabels(taAch);
  const achievementItems = buildAchievementItemLabels(taAch);

  const [dashboardData, achievementModelRaw, portfolioModel, practiceSummaries] =
    await Promise.all([
      activeTab === "overview"
        ? getStudentDashboardData(
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
          )
        : Promise.resolve(null),
      activeTab === "achievements" ? getAchievementViewModel(user.id) : Promise.resolve(null),
      activeTab === "profile"
        ? getStudentPortfolioViewModel(user, tProfile("nextMilestoneFallback"))
        : Promise.resolve(null),
      activeTab === "overview" ? getPracticeDashboardSummaries() : Promise.resolve(null),
    ]);

  const practiceHistoryLabels =
    activeTab === "overview" ? buildPracticeHistoryLabels((key) => tap(key)) : null;

  const achievementModel =
    achievementModelRaw != null
      ? resolveAchievementViewModel(achievementModelRaw, achievementShared.itemLabels)
      : null;

  const resolveMilestone = (titleKey: string) => {
    try {
      return tj(titleKey as Parameters<typeof tj>[0]);
    } catch {
      return achievementItems[titleKey]?.title ?? titleKey;
    }
  };

  const resolveCertTitle = (entry: NonNullable<typeof portfolioModel>["certifications"]["entries"][number]) => {
    if (entry.kind === "achievement") {
      return achievementItems[entry.title]?.title ?? entry.title;
    }
    return entry.title;
  };

  const resolveGoal = (key: string) => {
    try {
      return tProfile(key as Parameters<typeof tProfile>[0]);
    } catch {
      return achievementItems[key]?.title ?? key;
    }
  };

  const achievementLabels: AchievementsCollectionLabels | null =
    achievementModel != null
      ? {
          pageTitle: taAch("pageTitle"),
          pageSubtitle: taAch("pageSubtitle"),
          filterAll: taAch("filterAll"),
          filterUnlocked: taAch("filterUnlocked"),
          filterLocked: taAch("filterLocked"),
          emptyTitle: taAch("emptyTitle"),
          emptyDescription: taAch("emptyDescription"),
          emptyAction: taAch("emptyAction"),
          resetFiltersAction: taAch("resetFiltersAction"),
          unlockedSummary: taAch("unlockedSummary"),
          encouragement: taAch("encouragement"),
          ...achievementShared,
        }
      : null;

  const profileLabels =
    portfolioModel != null
      ? buildStudentProfileViewLabels({
          t: (key) => tProfile(key),
          ta: (key) => taAch(key),
          tmc: (key) => tmc(key),
          tj: resolveMilestone,
          mockLabels,
          achievementShared,
          resolveMilestone,
        })
      : null;

  return (
    <StudentDashboardHubView
      activeTab={activeTab}
      tabLabels={{
        overview: t("hubTabOverview"),
        achievements: t("hubTabAchievements"),
        profile: t("hubTabProfile"),
      }}
      overview={
        dashboardData && practiceSummaries && practiceHistoryLabels
          ? {
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
              },
            }
          : undefined
      }
      achievements={
        achievementModel && achievementLabels
          ? {
              model: achievementModel,
              labels: achievementLabels,
              toastLabels: {
                unlocked: taAch("toastUnlocked"),
                celebration: taAch("toastCelebration"),
              },
            }
          : undefined
      }
      profile={
        portfolioModel && profileLabels
          ? {
              model: portfolioModel,
              labels: profileLabels,
              achievementItemLabels: achievementItems,
              resolveCertificationTitle: resolveCertTitle,
              resolveGoalTitle: resolveGoal,
              resolveGoalDescription: resolveGoal,
            }
          : undefined
      }
    />
  );
}
