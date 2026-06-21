import { cn } from "@/lib/utils";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Award, Lock } from "lucide-react";

interface BadgeCardProps {
  name: string;
  description?: string;
  earned?: boolean;
  onClick?: () => void;
  className?: string;
}

export function BadgeCard({ name, description, earned = false, onClick, className }: BadgeCardProps) {
  const body = (
    <CambaCard
      variant={earned ? "achievement" : "default"}
      padding="md"
      interactive={!!onClick}
      className={cn("text-center w-full", !earned && "opacity-55", className)}
    >
      <div
        className={cn(
          "mx-auto mb-2 camba-icon-box-lg relative overflow-hidden",
          earned
            ? "bg-[var(--color-badge)]/15 text-[var(--color-badge)]"
            : "bg-[var(--surface-sunken)] text-[var(--status-locked)]"
        )}
      >
        {earned ? <Award className="h-6 w-6 relative z-10" /> : <Lock className="h-5 w-5" />}
      </div>
      <p className="camba-h3 text-foreground text-sm leading-snug">{name}</p>
      {description && (
        <p className="camba-caption text-muted mt-1 line-clamp-2">{description}</p>
      )}
    </CambaCard>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full camba-focus-ring rounded-2xl">
        {body}
      </button>
    );
  }
  return body;
}

interface StreakCardProps {
  currentStreak: number;
  bestStreak?: number;
  currentLabel?: string;
  bestLabel?: string;
  daysLabel?: string;
  encouragement?: string;
  className?: string;
}

export function StreakCard({
  currentStreak,
  bestStreak,
  currentLabel = "Chuỗi hiện tại",
  bestLabel = "Kỷ lục",
  daysLabel = "ngày",
  encouragement,
  className,
}: StreakCardProps) {
  return (
    <CambaCard variant="stat" padding="md" className={className}>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "camba-icon-box-lg bg-[var(--color-streak)]/12 text-[var(--color-streak)]",
            currentStreak > 0 && "camba-streak-glow rounded-xl"
          )}
        >
          <span
            className={cn("text-3xl block", currentStreak > 0 && "camba-pulse-soft")}
            role="img"
            aria-label="Ngọn lửa chuỗi ngày học"
          >
            🔥
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="camba-caption text-muted">{currentLabel}</p>
          <p className="camba-stat text-[var(--color-streak)] text-2xl">
            {currentStreak}{" "}
            <span className="text-base font-semibold">{daysLabel}</span>
          </p>
          {bestStreak != null && bestStreak > 0 && (
            <p className="camba-caption text-muted mt-1">
              {bestLabel}: <strong className="text-foreground">{bestStreak}</strong> {daysLabel}
            </p>
          )}
          {encouragement && (
            <p className="camba-caption text-foreground mt-2 font-medium leading-snug">
              {encouragement}
            </p>
          )}
        </div>
      </div>
    </CambaCard>
  );
}
