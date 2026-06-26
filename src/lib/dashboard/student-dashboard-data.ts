import { createClient } from "@/lib/supabase/server";
import { getUserGamification, getUserStreak } from "@/lib/queries/user";
import { getGamificationDashboardData } from "@/lib/queries/gamification";
import { getSkillProgressSnapshot, getNextLessonContext } from "@/lib/queries/dashboard";
import { getMockTestHubViewModel } from "@/lib/mock-tests/mock-test-hub";
import { getActiveProgramContext } from "@/lib/programs/context";
import { getActivePrograms } from "@/lib/queries/user";
import { xpProgressInLevel } from "@/lib/gamification/constants";
import { getProgramTheme } from "@/lib/design/cambridge-programs";
import { pickDailyMission } from "@/lib/dashboard/daily-mission";
import { pickRecommendedMock } from "@/lib/mock-tests/mock-center-utils";
import { getDashboardSkillInsights } from "@/lib/dashboard/skill-insights";
import { getDashboardRecentActivity } from "@/lib/dashboard/recent-activity";
import type { DailyMissionItem } from "@/components/gamification/daily-missions";
import type { BadgeItem } from "@/components/gamification/badge-grid";
import type { NextLessonContext, SkillProgressRow } from "@/lib/queries/dashboard";
import type { ActiveProgramContext } from "@/lib/programs/context";
import type { UserGamification, Program } from "@/types/database";
import type { MockTestHubSummary, MockTestHubViewModel } from "@/lib/mock-tests/mock-test-types";
import type { DashboardDailyMission } from "@/lib/dashboard/daily-mission";
import type { DashboardSkillInsightsView } from "@/lib/dashboard/skill-insights";
import type { DashboardActivityItem } from "@/lib/dashboard/recent-activity";
import { buildJourneyPreview } from "@/lib/learning/journey/learning-journey-utils";
import type { JourneyPreview } from "@/lib/learning/journey/learning-journey-types";

export type WeeklyProgressStats = {
  xpEarned: number;
  lessonsCompleted: number;
  mockTestsCompleted: number;
  writingTasksCompleted: number;
  speakingTasksCompleted: number;
};

export type StudentDashboardData = {
  programs: Pick<Program, "id" | "slug" | "name" | "description">[];
  programContext: ActiveProgramContext | null;
  gamification: UserGamification | null;
  currentStreak: number;
  levelProgressPercent: number;
  cefrEstimate: string | null;
  mockHub: MockTestHubViewModel;
  missions: DailyMissionItem[];
  badges: BadgeItem[];
  streakCalendar: { activity_date: string; xp_earned: number; lessons_completed: number }[];
  nextLesson: NextLessonContext | null;
  skillSnapshot: SkillProgressRow[];
  dailyMission: DashboardDailyMission | null;
  recommendedMock: MockTestHubSummary | null;
  weeklyProgress: WeeklyProgressStats;
  skillInsights: DashboardSkillInsightsView;
  recentActivity: DashboardActivityItem[];
  journeyPreview: JourneyPreview;
};

function weekStartIsoDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 6);
  return date.toISOString().slice(0, 10);
}

function sumWeeklyCalendar(
  calendar: { activity_date: string; xp_earned: number; lessons_completed: number }[]
): Pick<WeeklyProgressStats, "xpEarned" | "lessonsCompleted"> {
  const cutoff = weekStartIsoDate();
  return calendar
    .filter((day) => day.activity_date >= cutoff)
    .reduce(
      (acc, day) => ({
        xpEarned: acc.xpEarned + day.xp_earned,
        lessonsCompleted: acc.lessonsCompleted + day.lessons_completed,
      }),
      { xpEarned: 0, lessonsCompleted: 0 }
    );
}

async function getWeeklyTaskCounts(
  userId: string,
  mockSkillMap: Map<string, string[]>
): Promise<
  Pick<WeeklyProgressStats, "mockTestsCompleted" | "writingTasksCompleted" | "speakingTasksCompleted">
> {
  const supabase = await createClient();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const { data: attempts } = await supabase
    .from("mock_test_attempts")
    .select("mock_test_id")
    .eq("user_id", userId)
    .eq("is_completed", true)
    .gte("completed_at", weekStart.toISOString());

  let mockTestsCompleted = 0;
  let writingTasksCompleted = 0;
  let speakingTasksCompleted = 0;

  for (const attempt of attempts ?? []) {
    mockTestsCompleted += 1;
    const skills = mockSkillMap.get(attempt.mock_test_id) ?? [];
    if (skills.includes("writing")) writingTasksCompleted += 1;
    if (skills.includes("speaking")) speakingTasksCompleted += 1;
  }

  return { mockTestsCompleted, writingTasksCompleted, speakingTasksCompleted };
}

export async function getStudentDashboardData(
  userId: string,
  missionLabels: Parameters<typeof pickDailyMission>[0]["labels"],
  skillLabels: Record<string, string>,
  insightLabels: { strong: string; focus: string },
  activityLabels: { badgeEarned: string }
): Promise<StudentDashboardData> {
  const [gamification, streakData, gamificationData, programs, mockHub] = await Promise.all([
    getUserGamification(userId),
    getUserStreak(userId),
    getGamificationDashboardData(userId),
    getActivePrograms(),
    getMockTestHubViewModel(userId),
  ]);

  const programContext = await getActiveProgramContext(userId, gamification);
  const levelId = gamification?.current_level_id ?? null;

  const mockSkillMap = new Map(
    mockHub.tests.map((test) => [test.id, test.format.includedSkillSlugs])
  );

  const [nextLesson, skillSnapshot, recentActivity, weeklyTasks] =
    await Promise.all([
    levelId ? getNextLessonContext(userId, levelId) : Promise.resolve(null),
    levelId ? getSkillProgressSnapshot(userId, levelId) : Promise.resolve([]),
    getDashboardRecentActivity(userId, activityLabels),
    getWeeklyTaskCounts(userId, mockSkillMap),
  ]);

  const skillInsights = await getDashboardSkillInsights(userId, skillSnapshot, insightLabels);

  const weeklyCalendar = sumWeeklyCalendar(gamificationData.streakCalendar);
  const dailyMission = pickDailyMission({
    missions: gamificationData.missions,
    nextLesson,
    recommendedMocks: mockHub.recommendedTests,
    skillSnapshot,
    labels: missionLabels,
    skillLabels,
  });

  const recommendedMock = pickRecommendedMock(mockHub.recommendedTests);
  const programSlug = programContext?.program.slug ?? null;
  const cefrEstimate = getProgramTheme(programSlug)?.cefr ?? null;

  const levelCompletion =
    skillSnapshot.length > 0
      ? Math.round(
          skillSnapshot.reduce((sum, row) => sum + row.progressPercent, 0) /
            skillSnapshot.length
        )
      : 0;

  const journeyPreview = buildJourneyPreview({
    currentLevelName: programContext?.level?.name ?? null,
    currentUnitTitle: nextLesson?.unitTitle ?? null,
    completionPercent: levelCompletion,
    nextMilestoneTitle: dailyMission?.title ?? recommendedMock?.title ?? null,
  });

  return {
    programs,
    programContext,
    gamification,
    currentStreak: streakData?.current_streak ?? 0,
    levelProgressPercent: gamification
      ? xpProgressInLevel(gamification.total_xp, gamification.level)
      : 0,
    cefrEstimate,
    mockHub,
    missions: gamificationData.missions,
    badges: gamificationData.badges,
    streakCalendar: gamificationData.streakCalendar,
    nextLesson,
    skillSnapshot,
    dailyMission,
    recommendedMock,
    weeklyProgress: {
      ...weeklyCalendar,
      ...weeklyTasks,
    },
    skillInsights,
    recentActivity,
    journeyPreview,
  };
}
