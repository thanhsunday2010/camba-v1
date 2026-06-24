import { StudentPageShell } from "@/components/camba";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardDailyMissionCard } from "@/components/dashboard/dashboard-daily-mission-card";
import { DashboardContinueLearningCard } from "@/components/dashboard/dashboard-continue-learning-card";
import { DashboardWeeklyProgress } from "@/components/dashboard/dashboard-weekly-progress";
import { DashboardRecommendedMock, type DashboardRecommendedMockLabels } from "@/components/dashboard/dashboard-recommended-mock";
import { DashboardAchievementsSection } from "@/components/dashboard/dashboard-achievements-section";
import type { AchievementShowcaseLabels } from "@/components/achievements/achievement-showcase";
import type { NextAchievementCardLabels } from "@/components/achievements/next-achievement-card";
import { DashboardSkillInsights } from "@/components/dashboard/dashboard-skill-insights";
import { DashboardRecentActivity } from "@/components/dashboard/dashboard-recent-activity";
import { DashboardJourneyPreview } from "@/components/dashboard/dashboard-journey-preview";
import { SectionHeader } from "@/components/camba/section-header";
import { PlacementTestCTA } from "@/components/dashboard/placement-test-cta";
import { ProgramPicker } from "@/components/programs/program-picker";
import type { StudentDashboardData } from "@/lib/dashboard/student-dashboard-data";
import { Route } from "lucide-react";

export interface StudentDashboardLabels {
  hero: {
    welcomeBack: string;
    progressingThrough: string;
    currentStreak: string;
    days: string;
    xp: string;
    level: string;
    cefrEstimate: string;
    viewPortfolio?: string;
  };
  dailyMission: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
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
    lastActivity: string;
    unitPrefix: string;
  };
  weeklyProgress: {
    title: string;
    subtitle: string;
    xpEarned: string;
    lessonsCompleted: string;
    mockTestsCompleted: string;
    writingTasksCompleted: string;
    speakingTasksCompleted: string;
    emptyNote: string;
  };
  recommendedMock: DashboardRecommendedMockLabels;
  achievements: AchievementShowcaseLabels & {
    next: NextAchievementCardLabels;
    toastUnlocked: string;
    toastCelebration: string;
    itemLabels: Record<string, { title: string; description: string }>;
  };
  skillInsights: {
    title: string;
    subtitle: string;
    strengths: string;
    weaknesses: string;
    grammar: string;
    vocabulary: string;
    skills: string;
    viewDetails: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
  };
  recentActivity: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
    kindLesson: string;
    kindMock: string;
    kindBadge: string;
  };
  journeyPreview: {
    title: string;
    subtitle: string;
    currentLevel: string;
    currentUnit: string;
    nextMilestone: string;
    openJourney: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
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
  skillLabels: Record<string, string>;
}

interface StudentDashboardViewProps {
  userName: string;
  data: StudentDashboardData;
  labels: StudentDashboardLabels;
}

export function StudentDashboardView({ userName, data, labels }: StudentDashboardViewProps) {
  const hasProgram = !!data.programContext?.programId;
  const programName = data.programContext?.program.name;
  const levelName = data.programContext?.level?.name;
  const programSlug = data.programContext?.program.slug;
  const skillLabel = data.nextLesson?.skillSlug
    ? labels.skillLabels[data.nextLesson.skillSlug] ?? data.nextLesson.skillName ?? undefined
    : undefined;

  return (
    <StudentPageShell>
      {!hasProgram && (
        <ProgramPicker programs={data.programs} labels={labels.programPicker} />
      )}

      {hasProgram && data.gamification && (
        <div className="camba-section-stack gap-8 sm:gap-10">
          <DashboardHero
            studentName={userName}
            programName={programName}
            levelName={levelName}
            programSlug={programSlug}
            totalXp={data.gamification.total_xp}
            level={data.gamification.level}
            streak={data.currentStreak}
            cefrEstimate={data.cefrEstimate}
            levelProgressPercent={data.levelProgressPercent}
            labels={labels.hero}
          />

          <DashboardDailyMissionCard
            mission={data.dailyMission}
            labels={labels.dailyMission}
          />

          <DashboardContinueLearningCard
            nextLesson={data.nextLesson}
            labels={labels.continueLearning}
            skillLabel={skillLabel}
          />

          <section aria-labelledby="journey-preview-heading">
            <SectionHeader
              titleId="journey-preview-heading"
              title={labels.journeyPreview.title}
              description={labels.journeyPreview.subtitle}
              icon={Route}
            />
            <DashboardJourneyPreview
              preview={data.journeyPreview}
              labels={labels.journeyPreview}
            />
          </section>

          <DashboardWeeklyProgress
            stats={data.weeklyProgress}
            labels={labels.weeklyProgress}
          />

          <DashboardRecommendedMock
            test={data.recommendedMock}
            labels={labels.recommendedMock}
          />

          <DashboardAchievementsSection
            recentUnlocked={data.achievements.recentUnlocked}
            nextAchievement={data.achievements.nextAchievement}
            unlockedCount={data.achievements.unlockedCount}
            totalCount={data.achievements.totalCount}
            itemLabels={labels.achievements.itemLabels}
            showcaseLabels={labels.achievements}
            nextLabels={labels.achievements.next}
            toastLabels={{
              unlocked: labels.achievements.toastUnlocked,
              celebration: labels.achievements.toastCelebration,
            }}
          />

          <DashboardSkillInsights
            insights={data.skillInsights}
            labels={labels.skillInsights}
          />

          <DashboardRecentActivity
            items={data.recentActivity}
            labels={labels.recentActivity}
          />

          <PlacementTestCTA
            title={labels.placement.title}
            description={labels.placement.description}
            buttonText={labels.placement.button}
          />
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
