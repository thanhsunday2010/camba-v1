import { AnimatedSection } from "@/components/camba/motion";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardDailyMissionCard } from "@/components/dashboard/dashboard-daily-mission-card";
import { DashboardContinueLearningCard } from "@/components/dashboard/dashboard-continue-learning-card";
import { DashboardWeeklyProgress } from "@/components/dashboard/dashboard-weekly-progress";
import { DashboardRecommendedMock, type DashboardRecommendedMockLabels } from "@/components/dashboard/dashboard-recommended-mock";
import { DashboardSkillInsights } from "@/components/dashboard/dashboard-skill-insights";
import { DashboardRecentActivity } from "@/components/dashboard/dashboard-recent-activity";
import { DashboardAiPracticeSection } from "@/components/dashboard/dashboard-ai-practice-section";
import type { PracticeHistoryLabels } from "@/components/ai-practice/practice-history-panel";
import type { PracticeHistorySummary } from "@/lib/ai-practice/practice-history-types";
import { PlacementTestCTA } from "@/components/dashboard/placement-test-cta";
import { ProgramPicker } from "@/components/programs/program-picker";
import type { StudentDashboardData } from "@/lib/dashboard/student-dashboard-data";

export interface StudentDashboardLabels {
  hero: {
    welcomeBack: string;
    progressingThrough: string;
    currentStreak: string;
    days: string;
    xp: string;
    level: string;
    cefrEstimate: string;
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
  aiPractice: {
    title: string;
    subtitle: string;
    writingTitle: string;
    writingDesc: string;
    speakingTitle: string;
    speakingDesc: string;
    start: string;
    aiBadge: string;
  };
  aiPracticeHistory: {
    writingSummary: PracticeHistorySummary;
    speakingSummary: PracticeHistorySummary;
    labels: PracticeHistoryLabels;
  };
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
    <>
      {!hasProgram && (
        <ProgramPicker programs={data.programs} labels={labels.programPicker} />
      )}

      {hasProgram && data.gamification && (
        <div className="camba-section-stack gap-8 sm:gap-10">
          <AnimatedSection staggerIndex={0}>
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
              compact
            />
          </AnimatedSection>

          <AnimatedSection staggerIndex={1}>
            <DashboardDailyMissionCard
              mission={data.dailyMission}
              labels={labels.dailyMission}
            />
          </AnimatedSection>

          <AnimatedSection staggerIndex={2}>
            <DashboardContinueLearningCard
              nextLesson={data.nextLesson}
              labels={labels.continueLearning}
              skillLabel={skillLabel}
            />
          </AnimatedSection>

          <AnimatedSection staggerIndex={3}>
            <DashboardWeeklyProgress
              stats={data.weeklyProgress}
              labels={labels.weeklyProgress}
            />
          </AnimatedSection>

          <AnimatedSection staggerIndex={4}>
            <DashboardRecommendedMock
              test={data.recommendedMock}
              labels={labels.recommendedMock}
            />
          </AnimatedSection>

          <AnimatedSection staggerIndex={5}>
            <DashboardAiPracticeSection
              labels={labels.aiPractice}
              writingSummary={labels.aiPracticeHistory.writingSummary}
              speakingSummary={labels.aiPracticeHistory.speakingSummary}
              historyLabels={labels.aiPracticeHistory.labels}
            />
          </AnimatedSection>

          <AnimatedSection staggerIndex={6}>
            <DashboardSkillInsights
              insights={data.skillInsights}
              labels={labels.skillInsights}
            />
          </AnimatedSection>

          <AnimatedSection staggerIndex={7}>
            <DashboardRecentActivity
              items={data.recentActivity}
              labels={labels.recentActivity}
            />
          </AnimatedSection>

          <AnimatedSection staggerIndex={8}>
            <PlacementTestCTA
              title={labels.placement.title}
              description={labels.placement.description}
              buttonText={labels.placement.button}
            />
          </AnimatedSection>
        </div>
      )}

      {!hasProgram && (
        <PlacementTestCTA
          title={labels.placement.title}
          description={labels.placement.description}
          buttonText={labels.placement.button}
        />
      )}
    </>
  );
}
