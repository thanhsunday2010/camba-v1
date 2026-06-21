import { cn } from "@/lib/utils";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconClassName?: string;
  trend?: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, iconClassName, trend, className }: StatCardProps) {
  return (
    <CambaCard variant="stat" padding="md" className={className}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="camba-caption text-muted truncate">{label}</p>
          <p className="camba-stat text-foreground mt-1">{value}</p>
          {trend && <p className="camba-caption text-success mt-0.5">{trend}</p>}
        </div>
        {Icon && (
          <div
            className={cn(
              "camba-icon-box-md shrink-0 bg-program-muted text-program",
              iconClassName
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </CambaCard>
  );
}

interface ProgressCardProps {
  title: string;
  description?: string;
  value: number;
  valueLabel?: string;
  footer?: React.ReactNode;
  className?: string;
}

export function ProgressCard({
  title,
  description,
  value,
  valueLabel,
  footer,
  className,
}: ProgressCardProps) {
  return (
    <CambaCard variant="progress" padding="md" className={className}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="camba-h3 text-foreground">{title}</h3>
          {description && <p className="camba-caption text-muted mt-0.5">{description}</p>}
        </div>
        {valueLabel && (
          <span className="camba-stat text-program text-xl">{valueLabel}</span>
        )}
      </div>
      <div className="h-2.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
        <div
          className="h-full camba-gradient-program camba-animate-fill rounded-full"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {footer && <div className="mt-3">{footer}</div>}
    </CambaCard>
  );
}

interface AchievementCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  earned?: boolean;
  className?: string;
}

export function AchievementCard({
  title,
  description,
  icon: Icon,
  earned = true,
  className,
}: AchievementCardProps) {
  return (
    <CambaCard
      variant="achievement"
      padding="md"
      className={cn(!earned && "opacity-60 grayscale", className)}
    >
      <div className="flex gap-3">
        <div className="camba-icon-box-lg bg-[var(--color-badge)]/15 text-[var(--color-badge)]">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="camba-h3 text-foreground">{title}</h3>
          <p className="camba-caption text-muted mt-1">{description}</p>
        </div>
      </div>
    </CambaCard>
  );
}
