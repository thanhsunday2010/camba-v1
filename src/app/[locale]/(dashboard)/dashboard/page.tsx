import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { StudentDashboardView } from "@/components/dashboard/student-dashboard-view";
import { getUserGamification, getUserStreak } from "@/lib/queries/user";
import { getGamificationDashboardData } from "@/lib/queries/gamification";
import {
  getSkillProgressSnapshot,
  computeShieldFilledSegments,
  getNextLessonContext,
} from "@/lib/queries/dashboard";
import { getMockTestsForUser } from "@/lib/queries/mock-tests";
import { getLatestStudyCoach } from "@/actions/ai/study-coach";
import { fetchActiveRecommendations } from "@/actions/ai/recommendations";
import { fetchActiveProgramContext, fetchAvailablePrograms } from "@/actions/programs";
import { xpProgressInLevel } from "@/lib/gamification/constants";
import { todayDateString } from "@/lib/gamification/constants";
import { pickHeroEncouragement, getTodayActivity } from "@/lib/dashboard/encouragement";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const t = await getTranslations("dashboard");
  const tg = await getTranslations("gamification");
  const ta = await getTranslations("ai");
  const tp = await getTranslations("programs");

  const [gamification, streakData, gamificationData, coachPlan, recommendations, programs] =
    await Promise.all([
      getUserGamification(user.id),
      getUserStreak(user.id),
      getGamificationDashboardData(user.id),
      getLatestStudyCoach(user.id),
      fetchActiveRecommendations(user.id),
      fetchAvailablePrograms(),
    ]);

  const programContext = await fetchActiveProgramContext(gamification);
  const levelId = gamification?.current_level_id;

  const [nextLesson, skillSnapshot, mockTests] = await Promise.all([
    levelId ? getNextLessonContext(user.id, levelId) : Promise.resolve(null),
    levelId ? getSkillProgressSnapshot(user.id, levelId) : Promise.resolve([]),
    getMockTestsForUser(user.id),
  ]);

  const shieldProgress =
    (gamification?.shield_progress as Record<string, number> | null) ?? null;
  const shieldFilledSegments = computeShieldFilledSegments(shieldProgress);

  const userName = user.fullName || user.email.split("@")[0];
  const today = todayDateString();
  const { xpToday, lessonsToday } = getTodayActivity(gamificationData.streakCalendar, today);
  const levelProgressPercent = gamification
    ? xpProgressInLevel(gamification.total_xp, gamification.level)
    : 0;

  const skillLabels = {
    vocabulary: ta("vocabulary"),
    grammar: ta("grammar"),
    reading: t("skillReading"),
    listening: t("skillListening"),
    writing: t("skillWriting"),
    speaking: t("skillSpeaking"),
  };

  const encouragementMessages = {
    program: t("encourageProgram"),
    topSkill: t("encourageTopSkill"),
    weakSkill: t("encourageWeakSkill"),
    streak: t("encourageStreak"),
    missions: t("encourageMissions"),
    default: t("encourageDefault"),
    start: t("encourageStart"),
  };

  const missionsCompleted = gamificationData.missions.filter((m) => m.isCompleted).length;
  const encouragement = pickHeroEncouragement(
    {
      programName: programContext?.program.name,
      skills: skillSnapshot,
      streak: streakData?.current_streak ?? 0,
      missionsCompleted,
      missionsTotal: gamificationData.missions.length,
      hasNextLesson: !!nextLesson,
    },
    encouragementMessages,
    skillLabels
  );

  return (
    <StudentDashboardView
      userName={userName}
      encouragement={encouragement}
      programs={programs}
      programContext={programContext}
      gamification={gamification}
      currentStreak={streakData?.current_streak ?? 0}
      bestStreak={streakData?.best_streak ?? 0}
      xpToday={xpToday}
      lessonsToday={lessonsToday}
      levelProgressPercent={levelProgressPercent}
      missions={gamificationData.missions}
      streakCalendar={gamificationData.streakCalendar}
      badges={gamificationData.badges}
      nextLesson={nextLesson}
      skillSnapshot={skillSnapshot}
      mockTests={mockTests}
      shieldFilledSegments={shieldFilledSegments}
      shieldProgress={shieldProgress}
      coachPlan={coachPlan}
      recommendations={recommendations}
      labels={{
        encouragement: encouragementMessages,
        hero: {
          greeting: t("heroGreeting"),
          continueLesson: t("continueLesson"),
          startLearning: t("startLearning"),
          minutes: t("minutes"),
          recommendedReason: t("recommendedReason"),
          shieldLabel: t("shieldProgress"),
          levelLabel: tg("levelProgress"),
          stats: {
            xp: t("xp"),
            level: t("level"),
            coins: tg("coins"),
            streak: t("streak"),
            xpToday: t("xpToday"),
            lessonsToday: t("lessonsToday"),
            days: t("days"),
          },
        },
        missions: {
          title: t("dailyMissions"),
          subtitle: t("missionsSubtitle"),
          emptyTitle: t("missionsEmpty"),
          emptyDescription: t("missionsEmptyDesc"),
          allCompleteTitle: t("missionsAllComplete"),
          allCompleteDesc: t("missionsAllCompleteDesc"),
          progressLabel: t("missionsProgress"),
          xpLabel: t("xp"),
          coinsLabel: tg("coins"),
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
          recommended: t("lessonRecommended"),
          notStarted: t("notStarted"),
          skillPrefix: t("skillPrefix"),
          unitPrefix: t("unitPrefix"),
        },
        skills: {
          title: t("skillProgress"),
          subtitle: t("skillProgressSubtitle"),
          emptyTitle: t("skillProgressEmpty"),
          emptyDescription: t("skillProgressEmptyDesc"),
          focusLabel: t("skillFocus"),
          strongLabel: t("skillStrong"),
          shieldBySkill: t("shieldBySkill"),
        },
        achievements: {
          title: t("recentAchievements"),
          subtitle: t("achievementsSubtitle"),
          emptyTitle: t("recentAchievementsEmpty"),
          emptyDescription: t("recentAchievementsEmptyDesc"),
          nextBadgeTitle: t("nextBadgeTitle"),
          recentEarnedTitle: t("recentEarnedTitle"),
          earnedSummary: t("earnedBadgesSummary"),
        },
        streak: {
          title: t("streakSectionTitle"),
          subtitle: t("streakSectionSubtitle"),
          currentStreak: tg("currentStreak"),
          bestStreak: tg("bestStreak"),
          days: t("days"),
          encouragement: t("streakEncouragement"),
          calendarLabel: tg("streakCalendar"),
        },
        mockTests: {
          title: t("mockTests"),
          subtitle: t("mockTestsSubtitle"),
          viewAll: t("viewAll"),
          emptyTitle: t("mockTestsEmpty"),
          emptyDescription: t("mockTestsEmptyDesc"),
          ctaLabel: t("startMockTest"),
          retakeLabel: t("retakeMockTest"),
          bestScore: t("mockBestScore"),
          attempts: t("mockAttempts"),
          moreTests: t("moreMockTests"),
        },
        recommendations: {
          title: t("smartRecommendations"),
          subtitle: t("smartRecommendationsSubtitle"),
          emptyTitle: t("recommendationsEmpty"),
          emptyDescription: t("recommendationsEmptyDesc"),
          motivationLabel: ta("motivation"),
        },
        shield: {
          title: t("shieldProgress"),
          description: t("shieldDescription"),
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
        ai: {
          coachTitle: ta("coachTitle"),
          coachSubtitle: ta("coachSubtitle"),
          generate: ta("generatePlan"),
          generating: ta("generating"),
          dailyRecommendations: ta("dailyRecommendations"),
          motivation: ta("motivation"),
          strengths: ta("strengths"),
          weaknesses: ta("weaknesses"),
          weeklyPlan: ta("weeklyPlan"),
        },
        skillLabels,
      }}
    />
  );
}
