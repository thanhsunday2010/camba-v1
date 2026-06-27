import { AnimatedSection } from "@/components/camba/motion";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardDailyMissionCard } from "@/components/dashboard/dashboard-daily-mission-card";
import { DashboardContinueLearningCard } from "@/components/dashboard/dashboard-continue-learning-card";
import { DashboardWeeklyProgress } from "@/components/dashboard/dashboard-weekly-progress";
import { DashboardRecommendedMock, type DashboardRecommendedMockLabels } from "@/components/dashboard/dashboard-recommended-mock";
import { DashboardSkillInsights } from "@/components/dashboard/dashboard-skill-insights";
import { DashboardRecentActivity } from "@/components/dashboard/dashboard-recent-activity";
import { DashboardAiPracticeSection } from "@/components/dashboard/dashboard-ai-practice-section";
import { DashboardCollapsibleSection } from "@/components/dashboard/dashboard-collapsible-section";
import {
  DashboardLeaderboardsSection,
  type DashboardLeaderboardsLabels,
} from "@/components/dashboard/dashboard-leaderboards-section";
import type { PracticeHistoryLabels } from "@/components/ai-practice/practice-history-panel";
import type { PracticeHistorySummary } from "@/lib/ai-practice/practice-history-types";
import { PlacementTestCTA } from "@/components/dashboard/placement-test-cta";
import { ProgramPicker } from "@/components/programs/program-picker";
import { StreakRestoreBanner } from "@/components/gamification/streak-restore-banner";
import type { StudentDashboardData } from "@/lib/dashboard/student-dashboard-data";
import { Activity, Brain, ClipboardList, Trophy } from "lucide-react";

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
  sectionExpand: string;
  sectionCollapse: string;
  progressStripLabel: string;
  leaderboards: DashboardLeaderboardsLabels;
  streakRestore: {
    title: string;
    description: string;
    cta: string;
    pending: string;
    insufficientXp: string;
    daysLeft: string;
    error: string;
  };
}

interface StudentDashboardViewProps {
  userName: string;
  data: StudentDashboardData;
  labels: StudentDashboardLabels;
}

function hasSkillInsightsContent(data: StudentDashboardData): boolean {
  const insights = data.skillInsights;
  return (
    insights.hasAnalytics ||
    insights.skillStrengths.length > 0 ||
    insights.skillWeaknesses.length > 0 ||
    insights.grammarStrengths.length > 0 ||
    insights.grammarWeaknesses.length > 0
  );
}

export function StudentDashboardView({ userName, data, labels }: StudentDashboardViewProps) {
  const hasProgram = !!data.programContext?.programId;
  const programName = data.programContext?.program.name;
  const levelName = data.programContext?.level?.name;
  const programSlug = data.programContext?.program.slug;
  const skillLabel = data.nextLesson?.skillSlug
    ? labels.skillLabels[data.nextLesson.skillSlug] ?? data.nextLesson.skillName ?? undefined
    : undefined;

  const sectionToggle = {
    expandLabel: labels.sectionExpand,
    collapseLabel: labels.sectionCollapse,
  };

  const showSkillInsights = hasSkillInsightsContent(data);
  const hasRecentActivity = data.recentActivity.length > 0;

  return (
    <>
      {!hasProgram && <ProgramPicker programs={data.programs} labels={labels.programPicker} />}

      {hasProgram && data.gamification && (
        <div className="camba-section-stack gap-5 sm:gap-6">
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
            <StreakRestoreBanner
              offer={data.streakRestoreOffer}
              labels={labels.streakRestore}
            />
          </AnimatedSection>

          <AnimatedSection staggerIndex={2}>
            <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
              <DashboardDailyMissionCard mission={data.dailyMission} labels={labels.dailyMission} compact />
              <DashboardContinueLearningCard
                nextLesson={data.nextLesson}
                labels={labels.continueLearning}
                skillLabel={skillLabel}
                compact
              />
            </div>
          </AnimatedSection>

          <AnimatedSection staggerIndex={3}>
            <DashboardAiPracticeSection
              labels={labels.aiPractice}
              writingSummary={labels.aiPracticeHistory.writingSummary}
              speakingSummary={labels.aiPracticeHistory.speakingSummary}
              historyLabels={labels.aiPracticeHistory.labels}
            />
          </AnimatedSection>

          <AnimatedSection staggerIndex={4}>
            <DashboardLeaderboardsSection
              leaderboards={data.leaderboards}
              labels={labels.leaderboards}
            />
          </AnimatedSection>

          <AnimatedSection staggerIndex={5}>
            <div className="space-y-3">
              <h2 className="camba-h3 text-foreground flex items-center gap-2">
                <Trophy className="h-5 w-5 text-warning" aria-hidden />
                {labels.progressStripLabel}
              </h2>
              <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
                <CambaCard variant="default" padding="md" className="h-full">
                  <DashboardWeeklyProgress
                    stats={data.weeklyProgress}
                    labels={labels.weeklyProgress}
                    variant="panel"
                  />
                </CambaCard>
                <CambaCard variant="default" padding="md" className="h-full">
                  <DashboardRecommendedMock test={data.recommendedMock} labels={labels.recommendedMock} compact />
                </CambaCard>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection staggerIndex={6}>
            <div className="rounded-2xl border border-border/60 bg-[var(--surface-sunken)]/40 p-3 sm:p-4 space-y-1">
              <DashboardCollapsibleSection
                title={labels.skillInsights.title}
                icon={Brain}
                defaultOpen={showSkillInsights}
                panel
                {...sectionToggle}
              >
                <DashboardSkillInsights insights={data.skillInsights} labels={labels.skillInsights} bodyOnly />
              </DashboardCollapsibleSection>

              <DashboardCollapsibleSection
                title={labels.recentActivity.title}
                icon={Activity}
                defaultOpen={hasRecentActivity}
                panel
                {...sectionToggle}
              >
                <DashboardRecentActivity
                  items={data.recentActivity}
                  labels={labels.recentActivity}
                  bodyOnly
                  variant="strip"
                  maxVisible={6}
                />
              </DashboardCollapsibleSection>

              <DashboardCollapsibleSection
                title={labels.placement.title}
                icon={ClipboardList}
                defaultOpen={false}
                panel
                {...sectionToggle}
              >
                <PlacementTestCTA
                  title={labels.placement.title}
                  description={labels.placement.description}
                  buttonText={labels.placement.button}
                  compact
                />
              </DashboardCollapsibleSection>
            </div>
          </AnimatedSection>
        </div>
      )}

      {!hasProgram && (
        <PlacementTestCTA
          title={labels.placement.title}
          description={labels.placement.description}
          buttonText={labels.placement.button}
          compact
        />
      )}
    </>
  );
}
