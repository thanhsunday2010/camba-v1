import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Star, Trophy, Zap, Coins } from "lucide-react";
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
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: labels.level,
      value: String(gamification?.level ?? 1),
      icon: Star,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      title: labels.coins,
      value: formatNumber(gamification?.coins ?? 0),
      icon: Coins,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      title: labels.streak,
      value: `${streak} ${labels.days}`,
      icon: Flame,
      color: "text-error",
      bg: "bg-error/10",
    },
    {
      title: labels.currentLevel,
      value: levelName ?? labels.notStarted,
      icon: Trophy,
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">
              {stat.title}
            </CardTitle>
            <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
