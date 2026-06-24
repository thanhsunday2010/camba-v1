import { ProgressRing } from "@/components/camba/progress-ring";
import { cn } from "@/lib/utils";
import type { JourneyProgressSummary } from "@/lib/learning/journey/learning-journey-types";
import { BookOpen, ClipboardList, MapPin, Sparkles, Zap } from "lucide-react";

interface JourneyProgressSummaryProps {
  summary: JourneyProgressSummary;
  labels: {
    title: string;
    currentLevel: string;
    currentUnit: string;
    completion: string;
    lessons: string;
    mocks: string;
    xp: string;
    readiness: string;
    readinessBuilding: string;
    readinessDeveloping: string;
    readinessApproaching: string;
    readinessReady: string;
    nextMilestone: string;
  };
  className?: string;
}

function readinessLabel(
  band: JourneyProgressSummary["readinessBand"],
  labels: JourneyProgressSummaryProps["labels"]
): string {
  switch (band) {
    case "ready":
      return labels.readinessReady;
    case "approaching":
      return labels.readinessApproaching;
    case "developing":
      return labels.readinessDeveloping;
    default:
      return labels.readinessBuilding;
  }
}

export function JourneyProgressSummary({
  summary,
  labels,
  className,
}: JourneyProgressSummaryProps) {
  return (
    <section
      aria-labelledby="journey-summary-heading"
      className={cn(
        "rounded-3xl border border-program/20 bg-gradient-to-br from-program-muted/40 via-white to-white p-5 sm:p-6 shadow-sm",
        className
      )}
    >
      <h2 id="journey-summary-heading" className="camba-h2 text-foreground">
        {labels.title}
      </h2>

      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <ProgressRing value={summary.completionPercent} size={72} strokeWidth={6} />
          <div>
            <p className="camba-caption text-muted">{labels.completion}</p>
            <p className="camba-display text-program">{summary.completionPercent}%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 camba-caption">
          <div className="rounded-xl border border-border/60 bg-white/80 px-3 py-2.5">
            <p className="text-muted flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {labels.currentLevel}
            </p>
            <p className="font-semibold text-foreground mt-0.5 truncate">
              {summary.currentLevelName ?? "—"}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-white/80 px-3 py-2.5">
            <p className="text-muted flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              {labels.lessons}
            </p>
            <p className="font-semibold text-foreground mt-0.5">
              {summary.lessonsCompleted}/{summary.totalLessons}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-white/80 px-3 py-2.5">
            <p className="text-muted flex items-center gap-1">
              <ClipboardList className="h-3.5 w-3.5" aria-hidden />
              {labels.mocks}
            </p>
            <p className="font-semibold text-foreground mt-0.5">
              {summary.mocksCompleted}/{summary.totalMocks}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-white/80 px-3 py-2.5">
            <p className="text-muted flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" aria-hidden />
              {labels.xp}
            </p>
            <p className="font-semibold text-foreground mt-0.5">{summary.totalXp}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-white/70 border border-white/80 px-4 py-3">
        <div className="min-w-0">
          <p className="camba-caption text-muted">{labels.currentUnit}</p>
          <p className="camba-body font-medium text-foreground truncate">
            {summary.currentUnitTitle ?? "—"}
          </p>
        </div>
        <div className="min-w-0 sm:text-right">
          <p className="camba-caption text-muted flex items-center gap-1 sm:justify-end">
            <Sparkles className="h-3.5 w-3.5 text-program" aria-hidden />
            {labels.readiness}
          </p>
          <p className="camba-body font-semibold text-program">
            {readinessLabel(summary.readinessBand, labels)} · {summary.readinessPercent}%
          </p>
        </div>
      </div>

      {summary.nextMilestoneTitle && (
        <p className="mt-3 camba-caption text-muted">
          {labels.nextMilestone}:{" "}
          <span className="font-semibold text-foreground">{summary.nextMilestoneTitle}</span>
        </p>
      )}
    </section>
  );
}
