import { cn } from "@/lib/utils";
import { CambridgeShield } from "@/components/camba/cambridge-shield";
import { Flame, Sparkles } from "lucide-react";

interface StudentHeroCardProps {
  studentName: string;
  greeting: string;
  programName?: string;
  levelName?: string;
  programSlug?: string | null;
  streak?: number;
  streakLabel?: string;
  level?: number;
  levelLabel?: string;
  shieldFilledSegments?: number;
  className?: string;
}

export function StudentHeroCard({
  studentName,
  greeting,
  programName,
  levelName,
  programSlug,
  streak = 0,
  streakLabel = "Chuỗi ngày học",
  level = 1,
  levelLabel = "Cấp",
  shieldFilledSegments = 0,
  className,
}: StudentHeroCardProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border camba-gradient-program-soft p-5 sm:p-6",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-30 blur-2xl camba-gradient-program"
        aria-hidden
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="camba-caption uppercase tracking-wider text-program font-bold">
            {greeting}
          </p>
          <h1 className="camba-display text-foreground truncate">{studentName}</h1>
          {(programName || levelName) && (
            <p className="camba-body text-muted">
              {programName}
              {levelName ? ` · ${levelName}` : ""}
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            {streak > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-error shadow-sm">
                <Flame className="h-4 w-4 camba-pulse-soft" />
                {streak} {streakLabel}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-program shadow-sm">
              <Sparkles className="h-4 w-4" />
              {levelLabel} {level}
            </span>
          </div>
        </div>
        <CambridgeShield
          programSlug={programSlug}
          filledSegments={shieldFilledSegments}
          size="lg"
          showLabel
        />
      </div>
    </section>
  );
}
