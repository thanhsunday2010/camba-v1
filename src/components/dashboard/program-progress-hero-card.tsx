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
        "flex flex-col items-center gap-4 rounded-2xl border border-white/50 bg-white/80 p-4 sm:p-5 shadow-md backdrop-blur-sm",
        className
      )}
    >
      <ProgramBadge programSlug={programSlug} />
      {(programName || levelName) && (
        <p className="camba-caption text-center text-muted font-medium">
          {programName}
          {levelName ? ` · ${levelName}` : ""}
        </p>
      )}
      <div className="flex items-center gap-4">
        <ProgressRing
          value={levelProgressPercent}
          label={`${levelProgressPercent}%`}
          sublabel={levelLabel}
          size={88}
        />
        <CambridgeShield
          programSlug={programSlug}
          filledSegments={shieldFilledSegments}
          size="lg"
          showLabel
        />
      </div>
      <div className="w-full space-y-1.5">
        <div className="flex justify-between camba-caption text-muted">
          <span>{shieldLabel}</span>
          <span>
            {shieldFilledSegments}/{SHIELD_SEGMENTS}
          </span>
        </div>
        <ProgressSegmentBar segments={SHIELD_SEGMENTS} filled={shieldFilledSegments} />
      </div>
    </div>
  );
}
