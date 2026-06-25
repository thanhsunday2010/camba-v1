import { CambaCard } from "@/components/camba/primitives/camba-card";
import type { ParentProgressSnapshot } from "@/lib/reporting/report-types";
import type { StudentProgressReportLabels } from "@/lib/reporting/report-labels";
import { Flame, BookOpen, ClipboardList, Activity } from "lucide-react";

interface ParentProgressSnapshotProps {
  snapshot: ParentProgressSnapshot;
  labels: Pick<
    StudentProgressReportLabels,
    | "snapshotTitle"
    | "levelLabel"
    | "streakLabel"
    | "lessonsLabel"
    | "unitsLabel"
    | "mocksLabel"
    | "latestActivityLabel"
    | "journeyLabel"
    | "gettingStartedTitle"
    | "gettingStartedBody"
    | "generatedOn"
  >;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ParentProgressSnapshotCard({
  snapshot,
  labels,
}: ParentProgressSnapshotProps) {
  return (
    <CambaCard variant="default" padding="lg" className="border-program/15">
      <h2 className="camba-h2 text-foreground">{labels.snapshotTitle}</h2>
      <p className="camba-caption text-muted mt-1">
        {labels.generatedOn} {formatDate(snapshot.generatedAt)}
      </p>

      <div className="mt-5 rounded-2xl bg-program-muted/30 p-4 sm:p-5">
        <p className="camba-h3 text-foreground">{snapshot.studentName}</p>
        <p className="camba-body text-muted mt-1">
          {[snapshot.levelName, snapshot.cefrEstimate].filter(Boolean).join(" · ") ||
            labels.levelLabel}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat icon={Flame} label={labels.streakLabel} value={String(snapshot.currentStreak)} />
        <Stat icon={BookOpen} label={labels.lessonsLabel} value={String(snapshot.lessonsCompleted)} />
        <Stat icon={BookOpen} label={labels.unitsLabel} value={String(snapshot.unitsCompleted)} />
        <Stat icon={ClipboardList} label={labels.mocksLabel} value={String(snapshot.mocksCompleted)} />
      </div>

      {snapshot.latestActivityTitle && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-border/60 bg-white px-4 py-3">
          <Activity className="h-4 w-4 text-program shrink-0 mt-0.5" aria-hidden />
          <div className="min-w-0">
            <p className="camba-caption text-muted">{labels.latestActivityLabel}</p>
            <p className="camba-body font-medium text-foreground">{snapshot.latestActivityTitle}</p>
            {snapshot.latestActivityDate && (
              <p className="camba-caption text-muted">{formatDate(snapshot.latestActivityDate)}</p>
            )}
          </div>
        </div>
      )}

      {snapshot.journeyCompletionPercent != null && (
        <p className="camba-body text-muted mt-4">
          {labels.journeyLabel}:{" "}
          <span className="font-semibold text-foreground">
            {snapshot.journeyCurrentLevel} · {snapshot.journeyCompletionPercent}%
          </span>
        </p>
      )}

      {!snapshot.hasData && (
        <div className="mt-5 rounded-xl border border-dashed border-program/25 bg-program-muted/20 px-4 py-4 text-center">
          <p className="camba-h3 text-foreground">{labels.gettingStartedTitle}</p>
          <p className="camba-body text-muted mt-2">{labels.gettingStartedBody}</p>
        </div>
      )}
    </CambaCard>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-white px-3 py-3 text-center">
      <Icon className="h-4 w-4 text-program mx-auto mb-1" aria-hidden />
      <p className="camba-caption text-muted">{label}</p>
      <p className="camba-stat text-lg text-foreground">{value}</p>
    </div>
  );
}
