import { StatCard } from "@/components/camba/cards/stat-progress-cards";
import { Coins, Flame, Star, Trophy, Zap } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { UserGamification } from "@/types/database";

interface StatsCardsProps {
  gamification: UserGamification | null;
  streak: number;
  levelName?: string;
  labels: {
    xp: string;
    level: string;
    streak: string;
    coins: string;
    currentLevel: string;
    days: string;
    notStarted: string;
  };
}

export function StatsCards({
  gamification,
  streak,
  levelName,
  labels,
}: StatsCardsProps) {
  const stats = [
    {
      title: labels.xp,
      value: formatNumber(gamification?.total_xp ?? 0),
      icon: Zap,
      iconClassName: "bg-[var(--color-xp)]/10 text-[var(--color-xp)]",
    },
    {
      title: labels.level,
      value: String(gamification?.level ?? 1),
      icon: Star,
      iconClassName: "bg-[var(--color-level-up)]/12 text-[var(--color-level-up)]",
    },
    {
      title: labels.coins,
      value: formatNumber(gamification?.coins ?? 0),
      icon: Coins,
      iconClassName: "bg-[var(--color-coins)]/12 text-[var(--color-coins)]",
    },
    {
      title: labels.streak,
      value: `${streak}`,
      icon: Flame,
      iconClassName: "bg-[var(--color-streak)]/12 text-[var(--color-streak)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          label={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconClassName={stat.iconClassName}
        />
      ))}
      <StatCard
        label={labels.currentLevel}
        value={levelName ?? labels.notStarted}
        icon={Trophy}
        iconClassName="bg-program-muted text-program"
        className="col-span-2 lg:col-span-4"
      />
    </div>
  );
}
