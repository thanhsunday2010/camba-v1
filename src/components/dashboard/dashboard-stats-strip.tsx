import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import { Coins, Flame, Sparkles, Target, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClassName?: string;
  highlight?: boolean;
  pulse?: boolean;
}

interface DashboardStatsStripProps {
  totalXp: number;
  level: number;
  coins: number;
  streak: number;
  xpToday?: number;
  lessonsToday?: number;
  levelProgressPercent: number;
  labels: {
    xp: string;
    level: string;
    coins: string;
    streak: string;
    xpToday: string;
    lessonsToday: string;
    days: string;
  };
  compact?: boolean;
  showLevelBar?: boolean;
  className?: string;
}

export function DashboardStatsStrip({
  totalXp,
  level,
  coins,
  streak,
  xpToday = 0,
  lessonsToday = 0,
  levelProgressPercent,
  labels,
  compact,
  showLevelBar,
  className,
}: DashboardStatsStripProps) {
  const items: StatItem[] = [
    {
      label: labels.xp,
      value: formatNumber(totalXp),
      icon: Zap,
      iconClassName: "bg-[var(--color-xp)]/12 text-[var(--color-xp)]",
    },
    {
      label: labels.level,
      value: String(level),
      icon: Sparkles,
      iconClassName: "bg-[var(--color-level-up)]/12 text-[var(--color-level-up)]",
      highlight: true,
    },
    {
      label: labels.streak,
      value: streak > 0 ? `${streak}` : "0",
      icon: Flame,
      iconClassName: "bg-[var(--color-streak)]/12 text-[var(--color-streak)]",
      pulse: streak > 0,
    },
    {
      label: labels.coins,
      value: formatNumber(coins),
      icon: Coins,
      iconClassName: "bg-[var(--color-coins)]/12 text-[var(--color-coins)]",
    },
  ];

  if (xpToday > 0) {
    items.push({
      label: labels.xpToday,
      value: `+${xpToday}`,
      icon: Target,
      iconClassName: "bg-program-muted text-program",
      highlight: true,
    });
  }

  const showBar = showLevelBar ?? !compact;

  return (
    <div className={cn("space-y-2.5", className)}>
      <div
        className={cn(
          "flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-none",
          compact ? "sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0" : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        )}
      >
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              "flex min-w-[7.5rem] snap-start items-center gap-2.5 rounded-xl border border-white/70 bg-white/85 px-3 py-2.5 shadow-sm backdrop-blur-sm sm:min-w-0",
              item.highlight && "ring-1 ring-program/25",
              item.pulse && "camba-streak-glow"
            )}
          >
            <div className={cn("camba-icon-box-sm shrink-0", item.iconClassName)}>
              <item.icon className={cn("h-4 w-4", item.pulse && "camba-pulse-soft")} />
            </div>
            <div className="min-w-0">
              <p className="camba-caption text-muted truncate text-[0.65rem] sm:text-xs">
                {item.label}
              </p>
              <p className="camba-stat text-sm text-foreground leading-tight">
                {item.value}
                {item.label === labels.streak && streak > 0 && (
                  <span className="camba-caption text-muted font-normal ml-0.5">
                    {labels.days}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
      {showBar && (
        <div className="space-y-1 rounded-xl bg-white/50 px-3 py-2 border border-white/60">
          <div className="flex justify-between camba-caption text-muted">
            <span>
              {labels.level} {level}
            </span>
            <span className="font-semibold text-program">{levelProgressPercent}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/80 overflow-hidden shadow-inner">
            <div
              className="h-full camba-gradient-program rounded-full camba-animate-fill transition-all duration-700"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
