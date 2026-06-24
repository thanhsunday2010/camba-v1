import { CambaCard } from "@/components/camba/primitives/camba-card";
import type { CambridgeSnapshot } from "@/lib/profile/student-profile-types";
import {
  Award,
  BookOpen,
  ClipboardList,
  Mic,
  PenLine,
  Sparkles,
} from "lucide-react";

export type CambridgeSnapshotLabels = {
  title: string;
  subtitle: string;
  level: string;
  cefr: string;
  units: string;
  mocks: string;
  writing: string;
  speaking: string;
  certifications: string;
  achievements: string;
  emptyNote: string;
};

interface CambridgeSnapshotCardProps {
  snapshot: CambridgeSnapshot;
  labels: CambridgeSnapshotLabels;
}

export function CambridgeSnapshotCard({ snapshot, labels }: CambridgeSnapshotCardProps) {
  const stats = [
    { icon: BookOpen, label: labels.units, value: snapshot.unitsCompleted },
    { icon: ClipboardList, label: labels.mocks, value: snapshot.mocksCompleted },
    { icon: PenLine, label: labels.writing, value: snapshot.writingTasksCompleted },
    { icon: Mic, label: labels.speaking, value: snapshot.speakingTasksCompleted },
    { icon: Sparkles, label: labels.certifications, value: snapshot.certificationsEarned },
    { icon: Award, label: labels.achievements, value: snapshot.achievementsUnlocked },
  ];

  return (
    <CambaCard variant="stat" padding="md">
      <header className="mb-4">
        <h2 className="camba-h2 text-foreground">{labels.title}</h2>
        <p className="camba-caption text-muted mt-1">{labels.subtitle}</p>
      </header>

      {!snapshot.hasProgram && (
        <p className="camba-caption text-muted rounded-lg bg-program-muted/30 px-3 py-2 mb-4">
          {labels.emptyNote}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {snapshot.levelName && (
          <span className="rounded-full bg-program-muted px-3 py-1 camba-caption font-semibold text-program">
            {labels.level}: {snapshot.levelName}
          </span>
        )}
        {snapshot.cefrEstimate && (
          <span className="rounded-full bg-[var(--surface-sunken)] px-3 py-1 camba-caption font-medium text-muted">
            {labels.cefr}: {snapshot.cefrEstimate}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-border/50 bg-white/70 px-3 py-2.5"
          >
            <p className="camba-caption text-muted flex items-center gap-1">
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {label}
            </p>
            <p className="camba-stat text-foreground mt-0.5">{value}</p>
          </div>
        ))}
      </div>
    </CambaCard>
  );
}
