import { cn } from "@/lib/utils";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Target } from "lucide-react";

interface MissionCardProps {
  title: string;
  description?: string;
  progress: number;
  progressLabel?: string;
  completed?: boolean;
  className?: string;
}

export function MissionCard({
  title,
  description,
  progress,
  progressLabel,
  completed,
  className,
}: MissionCardProps) {
  return (
    <CambaCard variant="mission" padding="md" className={className}>
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "camba-icon-box-md shrink-0",
            completed ? "bg-success/15 text-success" : "bg-program-muted text-program"
          )}
        >
          {completed ? <CheckCircle2 className="h-5 w-5" /> : <Target className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="camba-h3 text-foreground">{title}</h3>
          {description && <p className="camba-caption text-muted mt-0.5">{description}</p>}
          <div className="mt-3 space-y-1">
            <Progress value={progress} max={100} className="h-2" />
            {progressLabel && (
              <p className="camba-caption text-muted text-right">{progressLabel}</p>
            )}
          </div>
        </div>
      </div>
    </CambaCard>
  );
}

interface RewardSummaryCardProps {
  title: string;
  xp?: number;
  coins?: number;
  badges?: string[];
  xpLabel?: string;
  coinsLabel?: string;
  className?: string;
}

export function RewardSummaryCard({
  title,
  xp,
  coins,
  badges,
  xpLabel = "XP",
  coinsLabel = "Xu",
  className,
}: RewardSummaryCardProps) {
  return (
    <CambaCard variant="achievement" padding="md" className={className}>
      <h3 className="camba-h3 text-foreground mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {xp != null && xp > 0 && (
          <span className="rounded-full bg-[var(--color-xp)]/10 px-3 py-1 text-sm font-semibold text-[var(--color-xp)]">
            +{xp} {xpLabel}
          </span>
        )}
        {coins != null && coins > 0 && (
          <span className="rounded-full bg-[var(--color-coins)]/10 px-3 py-1 text-sm font-semibold text-[var(--color-coins)]">
            +{coins} {coinsLabel}
          </span>
        )}
        {badges?.map((b) => (
          <span
            key={b}
            className="rounded-full bg-[var(--color-badge)]/10 px-3 py-1 text-sm font-semibold text-[var(--color-badge)]"
          >
            {b}
          </span>
        ))}
      </div>
    </CambaCard>
  );
}

interface RecommendationCardProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function RecommendationCard({
  title,
  description,
  action,
  className,
}: RecommendationCardProps) {
  return (
    <CambaCard variant="default" padding="md" className={className}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="camba-h3 text-foreground">{title}</h3>
          <p className="camba-body text-muted mt-1">{description}</p>
        </div>
        {action}
      </div>
    </CambaCard>
  );
}

export function EmptyStateCard({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <CambaCard variant="empty" padding="lg" className={cn("text-center", className)}>
      <Circle className="h-10 w-10 text-muted mx-auto mb-3 opacity-50" />
      <h3 className="camba-h3 text-foreground">{title}</h3>
      <p className="camba-body text-muted mt-2 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </CambaCard>
  );
}
