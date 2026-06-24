import { Link } from "@/i18n/routing";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { ProgressRing } from "@/components/camba/progress-ring";
import type { JourneyPreview } from "@/lib/learning/journey/learning-journey-types";
import { ArrowRight, MapPin, Route, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardJourneyPreviewProps {
  preview: JourneyPreview;
  labels: {
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
}

export function DashboardJourneyPreview({ preview, labels }: DashboardJourneyPreviewProps) {
  const hasLocation = preview.currentLevelName || preview.currentUnitTitle;

  if (!hasLocation) {
    return (
      <CambaCard variant="default" padding="lg" className="border-dashed border-program/20">
        <div className="text-center py-2 space-y-2">
          <Route className="h-10 w-10 mx-auto text-program/60" aria-hidden />
          <p className="camba-h3 text-foreground">{labels.emptyTitle}</p>
          <p className="camba-body text-muted max-w-md mx-auto">{labels.emptyDescription}</p>
          <Link href={preview.href} className="inline-block mt-4">
            <Button variant="quest">{labels.emptyAction}</Button>
          </Link>
        </div>
      </CambaCard>
    );
  }

  return (
    <CambaCard variant="default" padding="lg" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] camba-gradient-program"
        aria-hidden
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4 min-w-0">
          <ProgressRing value={preview.completionPercent} size={56} strokeWidth={5} />
          <div className="min-w-0 space-y-2">
            <div>
              <p className="camba-caption text-program font-bold uppercase tracking-wide flex items-center gap-1.5">
                <Route className="h-4 w-4" aria-hidden />
                {labels.title}
              </p>
              <p className="camba-caption text-muted mt-0.5">{labels.subtitle}</p>
            </div>
            <dl className="space-y-1 camba-caption">
              {preview.currentLevelName && (
                <div className="flex items-center gap-1.5 text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-program shrink-0" aria-hidden />
                  <dt className="text-muted">{labels.currentLevel}:</dt>
                  <dd className="font-semibold truncate">{preview.currentLevelName}</dd>
                </div>
              )}
              {preview.currentUnitTitle && (
                <div className="flex items-center gap-1.5 text-foreground">
                  <Target className="h-3.5 w-3.5 text-program shrink-0" aria-hidden />
                  <dt className="text-muted">{labels.currentUnit}:</dt>
                  <dd className="font-semibold truncate">{preview.currentUnitTitle}</dd>
                </div>
              )}
              {preview.nextMilestoneTitle && (
                <div className="text-muted">
                  {labels.nextMilestone}:{" "}
                  <span className="font-semibold text-foreground">{preview.nextMilestoneTitle}</span>
                </div>
              )}
            </dl>
          </div>
        </div>
        <Link href={preview.href} className="shrink-0 camba-focus-ring rounded-xl">
          <Button variant="quest" className="w-full sm:w-auto">
            {labels.openJourney}
            <ArrowRight className="h-4 w-4 ml-1" aria-hidden />
          </Button>
        </Link>
      </div>
    </CambaCard>
  );
}
