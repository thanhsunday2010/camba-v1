import type { StudentPortfolioViewModel } from "@/lib/profile/student-profile-types";
import { AnimatedSection } from "@/components/camba/motion";
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
import type { AchievementItemLabels } from "@/lib/achievements/achievement-i18n";
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
  achievementItemLabels: AchievementItemLabels;
  resolveCertificationTitle: (entry: CertificationPortfolio["entries"][number]) => string;
  resolveGoalTitle: (goalKey: string) => string;
  resolveGoalDescription: (goalKey: string) => string;
}

export function StudentProfileView({
  model,
  labels,
  achievementItemLabels,
  resolveCertificationTitle,
  resolveGoalTitle,
  resolveGoalDescription,
}: StudentProfileViewProps) {
  return (
    <div className="camba-section-stack gap-8 sm:gap-10">
      <AnimatedSection staggerIndex={0}>
        <StudentProfileHero identity={model.identity} hero={model.hero} labels={labels.hero} />
      </AnimatedSection>

      <AnimatedSection staggerIndex={1}>
        <CambridgeSnapshotCard snapshot={model.snapshot} labels={labels.snapshot} />
      </AnimatedSection>

      <AnimatedSection staggerIndex={2}>
        <LearningProgressSection learning={model.learning} labels={labels.learning} />
      </AnimatedSection>

      <AnimatedSection staggerIndex={3}>
        <MockPerformanceSection
          mockPerformance={model.mockPerformance}
          labels={labels.mockPerformance}
        />
      </AnimatedSection>

      <AnimatedSection staggerIndex={4}>
        <div className="grid gap-8 lg:grid-cols-2">
          <WritingGrowthSection writing={model.writing} labels={labels.writing} />
          <SpeakingGrowthSection speaking={model.speaking} labels={labels.speaking} />
        </div>
      </AnimatedSection>

      <AnimatedSection staggerIndex={5}>
        <CertificationShowcase
          certifications={model.certifications}
          labels={labels.certifications}
          resolveTitle={resolveCertificationTitle}
        />
      </AnimatedSection>

      <AnimatedSection staggerIndex={6}>
        <ProfileAchievementSection
          achievements={model.achievements}
          achievementItemLabels={achievementItemLabels}
          showcaseLabels={labels.achievements}
          nextLabels={labels.achievements.next}
          rareTitle={labels.achievements.rareTitle}
          rareSubtitle={labels.achievements.rareSubtitle}
        />
      </AnimatedSection>

      <AnimatedSection staggerIndex={7}>
        <JourneyProgressSection journey={model.journey} labels={labels.journey} />
      </AnimatedSection>

      <AnimatedSection staggerIndex={8}>
        <FutureGoalsCard
          goals={model.futureGoals}
          labels={{
            ...labels.futureGoals,
            resolveTitle: (goal) => resolveGoalTitle(goal.titleKey),
            resolveDescription: (goal) => resolveGoalDescription(goal.descriptionKey),
          }}
        />
      </AnimatedSection>
    </div>
  );
}
