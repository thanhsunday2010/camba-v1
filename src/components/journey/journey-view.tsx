import { StudentPageShell } from "@/components/camba";
import { SectionHeader } from "@/components/camba/section-header";
import { JourneyProgressSummary } from "@/components/journey/journey-progress-summary";
import { JourneyLevelCard } from "@/components/journey/journey-level-card";
import { JourneyUnitRoadmap } from "@/components/journey/journey-unit-roadmap";
import { JourneyMockMilestone } from "@/components/journey/journey-mock-milestone";
import { JourneyMilestoneSection } from "@/components/journey/journey-milestone-section";
import { JourneyAchievementPreview } from "@/components/journey/journey-achievement-preview";
import type { EvaluatedAchievement } from "@/lib/achievements/achievement-types";
import type { AchievementCardLabels } from "@/components/achievements/achievement-card";
import { LearningPathEmpty } from "@/components/learning/learning-path-empty";
import { LearningLevelSwitcher } from "@/components/learning/learning-level-switcher";
import { PortfolioLink } from "@/components/profile/portfolio-link";
import type { LearningJourneyViewModel } from "@/lib/learning/journey/learning-journey-types";
import { Map, Route } from "lucide-react";

export interface JourneyViewLabels {
  pageTitle: string;
  pageSubtitle: string;
  viewPortfolio?: string;
  summary: JourneyProgressSummaryPropsLabels;
  levels: JourneyLevelCardLabels;
  roadmap: JourneyUnitRoadmapLabels;
  mocks: JourneyMockMilestoneLabels;
  milestones: JourneyMilestoneSectionLabels;
  levelPathTitle: string;
  levelPathSubtitle: string;
  unitRoadmapTitle: string;
  unitRoadmapSubtitle: string;
  mockSectionTitle: string;
  mockSectionSubtitle: string;
  noLevelTitle: string;
  noLevelDesc: string;
  levelSwitcher: {
    title: string;
    selecting: string;
    current: string;
  };
  achievements?: AchievementCardLabels & {
    title: string;
    subtitle: string;
    viewAll: string;
    linkedMilestone: string;
  };
}

type JourneyProgressSummaryPropsLabels = Parameters<typeof JourneyProgressSummary>[0]["labels"];
type JourneyLevelCardLabels = Parameters<typeof JourneyLevelCard>[0]["labels"];
type JourneyUnitRoadmapLabels = Parameters<typeof JourneyUnitRoadmap>[0]["labels"];
type JourneyMockMilestoneLabels = Parameters<typeof JourneyMockMilestone>[0]["labels"];
type JourneyMilestoneSectionLabels = Parameters<typeof JourneyMilestoneSection>[0]["labels"];

interface JourneyViewProps {
  model: LearningJourneyViewModel;
  levels: { id: string; slug: string; name: string; description: string | null; sort_order: number }[];
  labels: JourneyViewLabels;
  journeyAchievements?: EvaluatedAchievement[];
  achievementItemLabels?: Record<string, { title: string; description: string }>;
}

export function JourneyView({
  model,
  levels,
  labels,
  journeyAchievements,
  achievementItemLabels,
}: JourneyViewProps) {
  const currentLevel = model.levels.find((l) => l.isCurrent);

  if (!model.hasLevelSelected) {
    return (
      <StudentPageShell>
        <LearningPathEmpty icon={Map} title={labels.noLevelTitle} description={labels.noLevelDesc}>
          {levels.length > 0 && (
            <LearningLevelSwitcher
              levels={levels}
              currentLevelId={null}
              pickMode
              labels={labels.levelSwitcher}
            />
          )}
        </LearningPathEmpty>
      </StudentPageShell>
    );
  }

  return (
    <StudentPageShell>
      <div className="camba-section-stack gap-8 sm:gap-10">
        <header className="space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-2 flex-1">
              <div className="flex items-center gap-2 text-program">
                <Route className="h-6 w-6" aria-hidden />
                <span className="camba-caption font-bold uppercase tracking-wide">{model.programName}</span>
              </div>
              <h1 className="camba-display text-foreground">{labels.pageTitle}</h1>
              <p className="camba-body text-muted max-w-2xl">{labels.pageSubtitle}</p>
            </div>
            {labels.viewPortfolio && <PortfolioLink label={labels.viewPortfolio} />}
          </div>
        </header>

        <JourneyProgressSummary summary={model.summary} labels={labels.summary} />

        <section aria-labelledby="journey-levels-heading">
          <SectionHeader
            titleId="journey-levels-heading"
            title={labels.levelPathTitle}
            description={labels.levelPathSubtitle}
            icon={Map}
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {model.levels.map((level) => (
              <JourneyLevelCard key={level.id} level={level} labels={labels.levels} />
            ))}
          </div>
        </section>

        {currentLevel && currentLevel.units.length > 0 && (
          <section aria-labelledby="journey-units-heading">
            <SectionHeader
              titleId="journey-units-heading"
              title={labels.unitRoadmapTitle}
              description={labels.unitRoadmapSubtitle.replace("{level}", currentLevel.name)}
              icon={Route}
            />
            <JourneyUnitRoadmap
              units={currentLevel.units}
              mocks={currentLevel.mocks}
              recommendedMockId={model.recommendedMockId}
              labels={labels.roadmap}
            />
          </section>
        )}

        {currentLevel && (
          <section aria-labelledby="journey-mocks-heading">
            <SectionHeader
              titleId="journey-mocks-heading"
              title={labels.mockSectionTitle}
              description={labels.mockSectionSubtitle}
            />
            <JourneyMockMilestone
              mocks={currentLevel.mocks}
              recommendedMockId={model.recommendedMockId}
              labels={labels.mocks}
            />
          </section>
        )}

        <JourneyMilestoneSection milestones={model.milestones} labels={labels.milestones} />

        {journeyAchievements &&
          journeyAchievements.length > 0 &&
          labels.achievements &&
          achievementItemLabels && (
            <JourneyAchievementPreview
              achievements={journeyAchievements}
              itemLabels={achievementItemLabels}
              labels={labels.achievements}
            />
          )}
      </div>
    </StudentPageShell>
  );
}
