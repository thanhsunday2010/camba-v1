import { cn } from "@/lib/utils";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { CambridgeShield } from "@/components/camba/cambridge-shield";
import { ProgressRing } from "@/components/camba/progress-ring";
import { SHIELD_SEGMENTS } from "@/lib/design/cambridge-programs";
import { ProgramBadge } from "@/components/camba/cambridge/program-badge";

interface CambridgeShieldCardProps {
  programSlug?: string | null;
  programLabel?: string;
  filledSegments?: number;
  totalSegments?: number;
  title?: string;
  description?: string;
  progressPercent?: number;
  className?: string;
}

export function CambridgeShieldCard({
  programSlug,
  programLabel,
  filledSegments = 0,
  totalSegments = SHIELD_SEGMENTS,
  title = "Tiến độ Shield Cambridge",
  description,
  progressPercent,
  className,
}: CambridgeShieldCardProps) {
  const pct =
    progressPercent ??
    Math.round((filledSegments / Math.max(1, totalSegments)) * 100);

  return (
    <CambaCard variant="elevated" padding="md" className={className}>
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <ProgressRing value={pct} label={`${pct}%`} sublabel="Shield" size={96} />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <ProgramBadge programSlug={programSlug} />
            {programLabel && (
              <span className="camba-caption text-muted">{programLabel}</span>
            )}
          </div>
          <h3 className="camba-h2 text-foreground">{title}</h3>
          {description && (
            <p className="camba-body text-muted mt-1">{description}</p>
          )}
          <div className="flex gap-1 mt-3 justify-center sm:justify-start">
            {Array.from({ length: totalSegments }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-2 flex-1 max-w-8 rounded-full",
                  i < filledSegments ? "camba-gradient-program" : "bg-[var(--surface-sunken)]"
                )}
              />
            ))}
          </div>
        </div>
        <CambridgeShield programSlug={programSlug} filledSegments={filledSegments} size="md" />
      </div>
    </CambaCard>
  );
}

interface SkillShieldProgressProps {
  skillLabel: string;
  filledSegments: number;
  totalSegments?: number;
  className?: string;
}

export function SkillShieldProgress({
  skillLabel,
  filledSegments,
  totalSegments = SHIELD_SEGMENTS,
  className,
}: SkillShieldProgressProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex justify-between camba-caption">
        <span className="text-foreground font-semibold capitalize">{skillLabel}</span>
        <span className="text-muted">
          {filledSegments}/{totalSegments}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: totalSegments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full",
              i < filledSegments ? "bg-[var(--color-shield)]" : "bg-[var(--surface-sunken)]"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function ProgressSegmentBar({
  segments,
  filled,
  className,
}: {
  segments: number;
  filled: number;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 flex-1 rounded-full transition-colors",
            i < filled ? "camba-gradient-program" : "bg-[var(--surface-sunken)]"
          )}
        />
      ))}
    </div>
  );
}

interface MasteryMeterProps {
  level: number;
  maxLevel?: number;
  label?: string;
  className?: string;
}

export function MasteryMeter({ level, maxLevel = 4, label, className }: MasteryMeterProps) {
  const pct = Math.round((level / maxLevel) * 100);
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <div className="flex justify-between camba-caption text-muted">
          <span>{label}</span>
          <span>{level}/{maxLevel}</span>
        </div>
      )}
      <div className="h-2.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
        <div
          className="h-full rounded-full bg-success transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
