import { Card, CardContent } from "@/components/ui/card";
import { xpProgressInLevel } from "@/lib/gamification/constants";
import { formatNumber } from "@/lib/utils";

interface XpProgressBarProps {
  totalXp: number;
  level: number;
  coins: number;
  xpLabel: string;
  coinsLabel: string;
  levelProgressLabel: string;
}

export function XpProgressBar({
  totalXp,
  level,
  coins,
  xpLabel,
  coinsLabel,
  levelProgressLabel,
}: XpProgressBarProps) {
  const progress = xpProgressInLevel(totalXp, level);

  return (
    <Card>
      <CardContent className="py-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {xpLabel}: <strong className="text-primary">{formatNumber(totalXp)}</strong>
          </span>
          <span className="text-gray-600">
            {coinsLabel}: <strong className="text-warning">{formatNumber(coins)}</strong>
          </span>
          <span className="text-gray-600">
            {levelProgressLabel} {level}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 text-right">{progress}%</p>
      </CardContent>
    </Card>
  );
}
