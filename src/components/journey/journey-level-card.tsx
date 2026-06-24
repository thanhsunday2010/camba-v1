import { Link } from "@/i18n/routing";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { ProgressRing } from "@/components/camba/progress-ring";
import { cn } from "@/lib/utils";
import type { JourneyLevel } from "@/lib/learning/journey/learning-journey-types";
import { Award, BookOpen, CheckCircle2, Lock, MapPin, Mic, PenLine } from "lucide-react";

interface JourneyLevelCardLabels {
  lessons: string;
  mocks: string;
  writing: string;
  speaking: string;
  currentPosition: string;
  statusCompleted: string;
  statusCurrent: string;
  statusInProgress: string;
  statusUpcoming: string;
  statusNotStarted: string;
  openLevel: string;
}

interface JourneyLevelCardProps {
  level: JourneyLevel;
  labels: JourneyLevelCardLabels;
}

const STATUS_STYLES = {
  completed: "border-success/30 bg-success/5",
  current: "border-program/40 bg-program-muted/40 ring-2 ring-program/20",
  "in-progress": "border-[var(--status-in-progress)]/30 bg-blue-50/50",
  upcoming: "border-border/60 bg-[var(--surface-sunken)]/30 opacity-90",
  "not-started": "border-border/60 bg-white",
} as const;

function statusLabel(level: JourneyLevel, labels: JourneyLevelCardLabels): string {
  switch (level.status) {
    case "completed":
      return labels.statusCompleted;
    case "current":
      return labels.statusCurrent;
    case "in-progress":
      return labels.statusInProgress;
    case "upcoming":
      return labels.statusUpcoming;
    default:
      return labels.statusNotStarted;
  }
}

export function JourneyLevelCard({ level, labels }: JourneyLevelCardProps) {
  const href = level.isCurrent ? "/learning" : "/settings";

  return (
    <CambaCard
      variant="default"
      padding="md"
      className={cn("h-full transition-shadow hover:shadow-md", STATUS_STYLES[level.status])}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="camba-h3 text-foreground">{level.name}</h3>
            {level.cefr && (
              <span className="rounded-full bg-white/80 px-2 py-0.5 camba-caption font-semibold text-program border border-program/15">
                {level.cefr}
              </span>
            )}
          </div>
          <p className="camba-caption text-muted mt-1">{statusLabel(level, labels)}</p>
        </div>
        <ProgressRing value={level.completionPercent} size={48} strokeWidth={4} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 camba-caption">
        <div>
          <dt className="text-muted flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            {labels.lessons}
          </dt>
          <dd className="font-semibold text-foreground mt-0.5">
            {level.lessonsCompleted}/{level.totalLessons}
          </dd>
        </div>
        <div>
          <dt className="text-muted flex items-center gap-1">
            <Award className="h-3.5 w-3.5" aria-hidden />
            {labels.mocks}
          </dt>
          <dd className="font-semibold text-foreground mt-0.5">
            {level.mocksCompleted}/{level.totalMocks}
          </dd>
        </div>
        <div>
          <dt className="text-muted flex items-center gap-1">
            <PenLine className="h-3.5 w-3.5" aria-hidden />
            {labels.writing}
          </dt>
          <dd className="font-semibold text-foreground mt-0.5">{level.writingProgressPercent}%</dd>
        </div>
        <div>
          <dt className="text-muted flex items-center gap-1">
            <Mic className="h-3.5 w-3.5" aria-hidden />
            {labels.speaking}
          </dt>
          <dd className="font-semibold text-foreground mt-0.5">{level.speakingProgressPercent}%</dd>
        </div>
      </dl>

      {level.isCurrent && (
        <p className="mt-3 camba-caption text-program font-medium flex items-center gap-1.5">
          <MapPin className="h-4 w-4" aria-hidden />
          {labels.currentPosition}
        </p>
      )}

      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1.5 camba-caption font-semibold text-program camba-focus-ring rounded-lg"
      >
        {level.isCurrent ? (
          labels.openLevel
        ) : level.status === "upcoming" ? (
          <>
            <Lock className="h-3.5 w-3.5" aria-hidden />
            {labels.statusUpcoming}
          </>
        ) : level.status === "completed" ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            {labels.openLevel}
          </>
        ) : (
          labels.openLevel
        )}
      </Link>
    </CambaCard>
  );
}
