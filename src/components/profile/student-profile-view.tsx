import type { StudentPortfolioViewModel } from "@/lib/profile/student-profile-types";
import { StudentProfileHero, type StudentProfileHeroLabels } from "@/components/profile/student-profile-hero";
import { CambridgeSnapshotCard, type CambridgeSnapshotLabels } from "@/components/profile/cambridge-snapshot-card";
import {
  LearningProgressSection,
  type LearningProgressSectionLabels,
} from "@/components/profile/learning-progress-section";
import {
  MockPerformanceSection,
  type MockPerformanceSectionLabels,
} from "@/components/profile/mock-performance-section";
import {
  WritingGrowthSection,
  type WritingGrowthSectionLabels,
} from "@/components/profile/writing-growth-section";
import {
  SpeakingGrowthSection,
  type SpeakingGrowthSectionLabels,
} from "@/components/profile/speaking-growth-section";
import {
  CertificationShowcase,
  type CertificationShowcaseLabels,
} from "@/components/profile/certification-showcase";
import { ProfileAchievementSection } from "@/components/profile/profile-achievement-section";
import {
  JourneyProgressSection,
  type JourneyProgressSectionLabels,
} from "@/components/profile/journey-progress-section";
import { FutureGoalsCard, type FutureGoalsCardLabels } from "@/components/profile/future-goals-card";
import type { AchievementShowcaseLabels } from "@/components/achievements/achievement-showcase";
import type { NextAchievementCardLabels } from "@/components/achievements/next-achievement-card";
import type { EvaluatedAchievement } from "@/lib/achievements/achievement-types";
import type { CertificationPortfolio } from "@/lib/profile/student-profile-types";

export type StudentProfileViewLabels = {
  hero: StudentProfileHeroLabels;
  snapshot: CambridgeSnapshotLabels;
  learning: LearningProgressSectionLabels;
  mockPerformance: MockPerformanceSectionLabels;
  writing: WritingGrowthSectionLabels;
  speaking: SpeakingGrowthSectionLabels;
  certifications: CertificationShowcaseLabels;
  achievements: AchievementShowcaseLabels & {
    next: NextAchievementCardLabels;
    rareTitle: string;
    rareSubtitle: string;
  };
  journey: JourneyProgressSectionLabels;
  futureGoals: FutureGoalsCardLabels;
};

interface StudentProfileViewProps {
  model: StudentPortfolioViewModel;
  labels: StudentProfileViewLabels;
  resolveAchievementText: (achievement: EvaluatedAchievement) => {
    title: string;
    description: string;
  };
  resolveCertificationTitle: (entry: CertificationPortfolio["entries"][number]) => string;
  resolveGoalTitle: (goalKey: string) => string;
  resolveGoalDescription: (goalKey: string) => string;
}

export function StudentProfileView({
  model,
  labels,
  resolveAchievementText,
  resolveCertificationTitle,
  resolveGoalTitle,
  resolveGoalDescription,
}: StudentProfileViewProps) {
  return (
    <div className="camba-section-stack gap-8 sm:gap-10">
      <StudentProfileHero identity={model.identity} hero={model.hero} labels={labels.hero} />

      <CambridgeSnapshotCard snapshot={model.snapshot} labels={labels.snapshot} />

      <LearningProgressSection learning={model.learning} labels={labels.learning} />

      <MockPerformanceSection
        mockPerformance={model.mockPerformance}
        labels={labels.mockPerformance}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <WritingGrowthSection writing={model.writing} labels={labels.writing} />
        <SpeakingGrowthSection speaking={model.speaking} labels={labels.speaking} />
      </div>

      <CertificationShowcase
        certifications={model.certifications}
        labels={labels.certifications}
        resolveTitle={resolveCertificationTitle}
      />

      <ProfileAchievementSection
        achievements={model.achievements}
        showcaseLabels={labels.achievements}
        nextLabels={labels.achievements.next}
        resolveText={resolveAchievementText}
        rareTitle={labels.achievements.rareTitle}
        rareSubtitle={labels.achievements.rareSubtitle}
      />

      <JourneyProgressSection journey={model.journey} labels={labels.journey} />

      <FutureGoalsCard
        goals={model.futureGoals}
        labels={{
          ...labels.futureGoals,
          resolveTitle: (goal) => resolveGoalTitle(goal.titleKey),
          resolveDescription: (goal) => resolveGoalDescription(goal.descriptionKey),
        }}
      />
    </div>
  );
}
