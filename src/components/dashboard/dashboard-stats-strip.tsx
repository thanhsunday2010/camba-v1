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
      value: streak > 0 ? `${streak} ${labels.days}` : "0",
      icon: Flame,
      iconClassName: "bg-[var(--color-streak)]/12 text-[var(--color-streak)]",
    },
    {
      label: labels.coins,
      value: formatNumber(coins),
      icon: Coins,
      iconClassName: "bg-[var(--color-coins)]/12 text-[var(--color-coins)]",
    },
  ];

  if (xpToday > 0 || lessonsToday > 0) {
    items.push({
      label: labels.xpToday,
      value: `+${xpToday}`,
      icon: Target,
      iconClassName: "bg-program-muted text-program",
    });
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn(
          "grid gap-2",
          compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        )}
      >
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border border-white/60 bg-white/75 px-3 py-2.5 shadow-sm backdrop-blur-sm",
              item.highlight && "ring-1 ring-program/20"
            )}
          >
            <div className={cn("camba-icon-box-sm shrink-0", item.iconClassName)}>
              <item.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="camba-caption text-muted truncate">{item.label}</p>
              <p className="camba-stat text-sm text-foreground leading-tight">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      {!compact && (
        <div className="space-y-1">
          <div className="flex justify-between camba-caption text-muted">
            <span>{labels.level}</span>
            <span>{levelProgressPercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/60 overflow-hidden">
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
