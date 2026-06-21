import {
  StudentPageShell,
  ContentSection,
  CambridgeShieldCard,
} from "@/components/camba";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { TodayMissionSection } from "@/components/dashboard/today-mission-section";
import { ContinueLearningPanel } from "@/components/dashboard/continue-learning-panel";
import { SkillProgressSection } from "@/components/dashboard/skill-progress-section";
import { AchievementSection } from "@/components/dashboard/achievement-section";
import { LearningStreakSection } from "@/components/dashboard/learning-streak-section";
import { MockTestPanel } from "@/components/dashboard/mock-test-panel";
import { SmartRecommendationPanel } from "@/components/dashboard/smart-recommendation-panel";
import { PlacementTestCTA } from "@/components/dashboard/placement-test-cta";
import { StudyCoachCard } from "@/components/ai/study-coach-card";
import { ProgramPicker } from "@/components/programs/program-picker";
import type { DailyMissionItem } from "@/components/gamification/daily-missions";
import type { BadgeItem } from "@/components/gamification/badge-grid";
import type { SkillProgressRow, NextLessonContext } from "@/lib/queries/dashboard";
import type { ActiveProgramContext } from "@/lib/programs/context";
import type { UserGamification, Program } from "@/types/database";
import type { MockTestSummary } from "@/types/learning";

export interface StudentDashboardLabels {
  encouragement: {
    program: string;
    topSkill: string;
    weakSkill: string;
    streak: string;
    missions: string;
    default: string;
    start: string;
  };
  hero: {
    greeting: string;
    continueLesson: string;
    startLearning: string;
    minutes: string;
    recommendedReason: string;
    shieldLabel: string;
    levelLabel: string;
    stats: {
      xp: string;
      level: string;
      coins: string;
      streak: string;
      xpToday: string;
      lessonsToday: string;
      days: string;
    };
  };
  missions: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
    allCompleteTitle: string;
    allCompleteDesc: string;
    progressLabel: string;
    progressRingLabel: string;
    pendingXpLabel: string;
    xpLabel: string;
    coinsLabel: string;
  };
  continueLearning: {
    title: string;
    subtitle: string;
    continueLesson: string;
    startLearning: string;
    viewPath: string;
    minutes: string;
    emptyTitle: string;
    emptyDescription: string;
    inProgress: string;
    recommended: string;
    notStarted: string;
    skillPrefix: string;
    unitPrefix: string;
  };
  skills: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    focusLabel: string;
    strongLabel: string;
    shieldBySkill: string;
    emptyAction: string;
  };
  achievements: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
    nextBadgeTitle: string;
    recentEarnedTitle: string;
    earnedSummary: string;
  };
  streak: {
    title: string;
    subtitle: string;
    currentStreak: string;
    bestStreak: string;
    days: string;
    encouragement: string;
    calendarLabel: string;
    todayLabel: string;
    noStreakYet: string;
  };
  mockTests: {
    title: string;
    subtitle: string;
    viewAll: string;
    emptyTitle: string;
    emptyDescription: string;
    ctaLabel: string;
    retakeLabel: string;
    bestScore: string;
    attempts: string;
    moreTests: string;
  };
  recommendations: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    motivationLabel: string;
  };
  shield: {
    title: string;
    description: string;
  };
  placement: {
    title: string;
    description: string;
    button: string;
  };
  programPicker: {
    title: string;
    subtitle: string;
    select: string;
    selecting: string;
    current: string;
  };
  ai: {
    coachTitle: string;
    coachSubtitle: string;
    generate: string;
    generating: string;
    dailyRecommendations: string;
    motivation: string;
    strengths: string;
    weaknesses: string;
    weeklyPlan: string;
  };
  skillLabels: Record<string, string>;
}

interface StudentDashboardViewProps {
  userName: string;
  encouragement: string;
  programs: Pick<Program, "id" | "slug" | "name" | "description">[];
  programContext: ActiveProgramContext | null;
  gamification: UserGamification | null;
  currentStreak: number;
  bestStreak: number;
  xpToday: number;
  lessonsToday: number;
  levelProgressPercent: number;
  missions: DailyMissionItem[];
  streakCalendar: { activity_date: string; xp_earned: number; lessons_completed: number }[];
  badges: BadgeItem[];
  nextLesson: NextLessonContext | null;
  skillSnapshot: SkillProgressRow[];
  mockTests: MockTestSummary[];
  shieldFilledSegments: number;
  shieldProgress: Record<string, number> | null;
  coachPlan: Awaited<ReturnType<typeof import("@/actions/ai/study-coach").getLatestStudyCoach>>;
  recommendations: Awaited<
    ReturnType<typeof import("@/actions/ai/recommendations").fetchActiveRecommendations>
  >;
  labels: StudentDashboardLabels;
}

export function StudentDashboardView({
  userName,
  encouragement,
  programs,
  programContext,
  gamification,
  currentStreak,
  bestStreak,
  xpToday,
  lessonsToday,
  levelProgressPercent,
  missions,
  streakCalendar,
  badges,
  nextLesson,
  skillSnapshot,
  mockTests,
  shieldFilledSegments,
  shieldProgress,
  coachPlan,
  recommendations,
  labels,
}: StudentDashboardViewProps) {
  const hasProgram = !!programContext?.programId;
  const programName = programContext?.program.name;
  const levelName = programContext?.level?.name;
  const programSlug = programContext?.program.slug;
  const skillLabel = nextLesson?.skillSlug
    ? labels.skillLabels[nextLesson.skillSlug] ?? nextLesson.skillName ?? undefined
    : undefined;

  const coachMotivation = coachPlan?.motivationMessage ?? null;

  return (
    <StudentPageShell>
      {!hasProgram && (
        <ProgramPicker programs={programs} labels={labels.programPicker} />
      )}

      {hasProgram && gamification && (
        <div className="camba-section-stack gap-8 sm:gap-10">
          <DashboardHero
            studentName={userName}
            encouragement={encouragement}
            programName={programName}
            levelName={levelName}
            programSlug={programSlug}
            totalXp={gamification.total_xp}
            level={gamification.level}
            coins={gamification.coins}
            streak={currentStreak}
            xpToday={xpToday}
            lessonsToday={lessonsToday}
            levelProgressPercent={levelProgressPercent}
            shieldFilledSegments={shieldFilledSegments}
            nextLesson={nextLesson}
            skillLabel={skillLabel}
            labels={labels.hero}
          />

          <TodayMissionSection missions={missions} labels={labels.missions} />

          <LearningStreakSection
            days={streakCalendar}
            currentStreak={currentStreak}
            bestStreak={bestStreak}
            labels={labels.streak}
          />

          <ContinueLearningPanel
            nextLesson={nextLesson}
            secondaryRecommendations={recommendations}
            labels={labels.continueLearning}
            skillLabel={skillLabel}
          />

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <SkillProgressSection
              skills={skillSnapshot}
              labels={labels.skills}
              skillLabels={labels.skillLabels}
              shieldProgress={shieldProgress}
            />
            <AchievementSection
              badges={badges}
              labels={{
                ...labels.achievements,
                earnedSummary: labels.achievements.earnedSummary.replace(
                  "{count}",
                  String(badges.filter((b) => b.earned).length)
                ),
              }}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <MockTestPanel tests={mockTests} labels={labels.mockTests} />
            <div className="hidden lg:block">
              <CambridgeShieldCard
                programSlug={programSlug}
                programLabel={levelName ?? programName}
                filledSegments={shieldFilledSegments}
                title={labels.shield.title}
                description={labels.shield.description}
              />
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <SmartRecommendationPanel
              recommendations={recommendations}
              coachMotivation={coachMotivation}
              labels={labels.recommendations}
            />
            <StudyCoachCard
              initialPlan={coachPlan}
              labels={{
                title: labels.ai.coachTitle,
                subtitle: labels.ai.coachSubtitle,
                generate: labels.ai.generate,
                generating: labels.ai.generating,
                dailyRecommendations: labels.ai.dailyRecommendations,
                motivation: labels.ai.motivation,
                strengths: labels.ai.strengths,
                weaknesses: labels.ai.weaknesses,
                weeklyPlan: labels.ai.weeklyPlan,
              }}
            />
          </div>

          <ContentSection>
            <PlacementTestCTA
              title={labels.placement.title}
              description={labels.placement.description}
              buttonText={labels.placement.button}
            />
          </ContentSection>
        </div>
      )}

      {!hasProgram && (
        <PlacementTestCTA
          title={labels.placement.title}
          description={labels.placement.description}
          buttonText={labels.placement.button}
        />
      )}
    </StudentPageShell>
  );
}
