import { cn } from "@/lib/utils";
import { CambridgeShield } from "@/components/camba/cambridge-shield";
import { ProgramBadge } from "@/components/camba/cambridge/program-badge";
import { ProgressRing } from "@/components/camba/progress-ring";
import { ProgressSegmentBar } from "@/components/camba/cambridge/shield-progress";
import { SHIELD_SEGMENTS } from "@/lib/design/cambridge-programs";

interface ProgramProgressHeroCardProps {
  programSlug?: string | null;
  programName?: string;
  levelName?: string;
  shieldFilledSegments: number;
  levelProgressPercent: number;
  shieldLabel: string;
  levelLabel: string;
  className?: string;
}

export function ProgramProgressHeroCard({
  programSlug,
  programName,
  levelName,
  shieldFilledSegments,
  levelProgressPercent,
  shieldLabel,
  levelLabel,
  className,
}: ProgramProgressHeroCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-3 rounded-2xl border-2 border-program/15 bg-white/90 p-4 sm:p-5 shadow-md backdrop-blur-sm overflow-hidden",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] camba-gradient-program"
        aria-hidden
      />
      <div className="relative hidden lg:flex flex-col items-center gap-2 w-full">
        <ProgramBadge programSlug={programSlug} />
        {(programName || levelName) && (
          <p className="camba-caption text-center text-muted font-medium">
            {programName}
            {levelName ? ` · ${levelName}` : ""}
          </p>
        )}
      </div>
      <div className="relative flex items-center justify-center gap-3 sm:gap-4 w-full">
        <ProgressRing
          value={levelProgressPercent}
          label={`${levelProgressPercent}%`}
          sublabel={levelLabel}
          size={80}
        />
        <CambridgeShield
          programSlug={programSlug}
          filledSegments={shieldFilledSegments}
          size="lg"
          showLabel
        />
      </div>
      <div className="relative w-full space-y-1.5 pt-1 border-t border-border/50">
        <div className="flex justify-between camba-caption text-muted">
          <span className="font-semibold text-foreground/80">{shieldLabel}</span>
          <span>
            {shieldFilledSegments}/{SHIELD_SEGMENTS}
          </span>
        </div>
        <ProgressSegmentBar segments={SHIELD_SEGMENTS} filled={shieldFilledSegments} />
      </div>
    </div>
  );
}
