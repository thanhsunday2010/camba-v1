import { cn } from "@/lib/utils";
import {
  LESSON_STATE_STYLES,
  MASTERY_LEVEL_STYLES,
  type LessonVisualState,
  type MasteryLevel,
} from "@/lib/design/status-tokens";

interface LessonStatusPillProps {
  state: LessonVisualState;
  label: string;
  className?: string;
}

export function LessonStatusPill({ state, label, className }: LessonStatusPillProps) {
  const styles = LESSON_STATE_STYLES[state];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      {label}
    </span>
  );
}

interface MasteryBadgeProps {
  level: MasteryLevel;
  label: string;
  className?: string;
}

export function MasteryBadge({ level, label, className }: MasteryBadgeProps) {
  const styles = MASTERY_LEVEL_STYLES[level];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
        styles.bg,
        styles.color,
        className
      )}
    >
      {label}
    </span>
  );
}

interface LevelBadgeProps {
  level: number;
  label?: string;
  className?: string;
}

export function LevelBadge({ level, label = "Cấp", className }: LevelBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full camba-gradient-program px-3 py-1 text-xs font-bold text-white shadow-sm",
        className
      )}
    >
      {label} {level}
    </span>
  );
}

interface CoinChipProps {
  amount: number;
  label?: string;
  className?: string;
}

export function CoinChip({ amount, label, className }: CoinChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-[var(--color-coins)]/12 px-2.5 py-0.5 text-xs font-bold text-[var(--color-coins)]",
        className
      )}
    >
      {label && <span className="font-medium opacity-80">{label}</span>}
      {amount}
    </span>
  );
}

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FilterChip({ label, active, onClick, className }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium camba-focus-ring transition-colors min-h-[var(--touch-target-min)] sm:min-h-0",
        active
          ? "border-program bg-program-muted text-program"
          : "border-border bg-card text-muted hover:border-program/30",
        className
      )}
    >
      {label}
    </button>
  );
}

interface ProgressPillProps {
  value: number;
  label?: string;
  className?: string;
}

export function ProgressPill({ value, label, className }: ProgressPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-program-muted px-2.5 py-0.5 text-xs font-semibold text-program",
        className
      )}
    >
      {label ?? `${value}%`}
    </span>
  );
}
