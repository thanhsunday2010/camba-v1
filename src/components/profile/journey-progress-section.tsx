import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import type { JourneyProgressPortfolio } from "@/lib/profile/student-profile-types";
import { Map, Route } from "lucide-react";
import { Button } from "@/components/ui/button";

export type JourneyProgressSectionLabels = {
  title: string;
  subtitle: string;
  currentLevel: string;
  levelsCompleted: string;
  journeyProgress: string;
  currentMilestone: string;
  nextMilestone: string;
  viewJourney: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction: string;
  resolveMilestone: (titleKey: string) => string;
};

interface JourneyProgressSectionProps {
  journey: JourneyProgressPortfolio;
  labels: JourneyProgressSectionLabels;
}

export function JourneyProgressSection({ journey, labels }: JourneyProgressSectionProps) {
  return (
    <section aria-labelledby="profile-journey-heading">
      <SectionHeader
        titleId="profile-journey-heading"
        title={labels.title}
        description={labels.subtitle}
        icon={Map}
        action={
          <Link href={journey.journeyHref}>
            <Button variant="ghost" size="sm">
              {labels.viewJourney}
            </Button>
          </Link>
        }
      />

      {!journey.hasJourney || !journey.summary ? (
        <DashboardEmptyState
          icon={Route}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          actionLabel={labels.emptyAction}
          actionHref="/journey"
        />
      ) : (
        <CambaCard variant="default" padding="md" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 camba-caption">
            <div>
              <p className="text-muted">{labels.currentLevel}</p>
              <p className="font-semibold text-foreground">{journey.summary.currentLevelName ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted">{labels.levelsCompleted}</p>
              <p className="camba-stat text-foreground">
                {journey.completedLevelCount}/{journey.totalLevelCount}
              </p>
            </div>
            <div>
              <p className="text-muted">{labels.journeyProgress}</p>
              <p className="camba-stat text-program">{journey.summary.completionPercent}%</p>
            </div>
          </div>
          {journey.currentMilestoneTitle && (
            <p className="camba-caption text-muted">
              {labels.currentMilestone}:{" "}
              <span className="font-semibold text-foreground">
                {labels.resolveMilestone(journey.currentMilestoneTitle)}
              </span>
            </p>
          )}
          {journey.nextMilestoneTitle && (
            <p className="camba-caption text-program font-medium">
              {labels.nextMilestone}: {labels.resolveMilestone(journey.nextMilestoneTitle)}
            </p>
          )}
        </CambaCard>
      )}
    </section>
  );
}
