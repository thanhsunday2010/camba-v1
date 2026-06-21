import { xpProgressInLevel } from "@/lib/gamification/constants";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Coins, Sparkles } from "lucide-react";

interface XPBarProps {
  totalXp: number;
  level: number;
  coins?: number;
  xpLabel: string;
  coinsLabel?: string;
  levelLabel: string;
  className?: string;
  showCoins?: boolean;
}

export function XPBar({
  totalXp,
  level,
  coins = 0,
  xpLabel,
  coinsLabel,
  levelLabel,
  className,
  showCoins = true,
}: XPBarProps) {
  const progress = xpProgressInLevel(totalXp, level);

  return (
    <div
      className={cn(
        "camba-card rounded-2xl p-4 sm:p-5 space-y-3 border border-border",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-1.5 text-muted">
          <Sparkles className="h-4 w-4 text-program" />
          <span>
            {xpLabel}:{" "}
            <strong className="text-program font-bold">{formatNumber(totalXp)}</strong>
          </span>
        </div>
        {showCoins && coinsLabel && (
          <div className="flex items-center gap-1.5 text-muted">
            <Coins className="h-4 w-4 text-warning" />
            <span>
              {coinsLabel}:{" "}
              <strong className="text-warning font-bold">{formatNumber(coins)}</strong>
            </span>
          </div>
        )}
        <span className="rounded-full bg-program-muted px-2.5 py-0.5 text-xs font-bold text-program">
          {levelLabel} {level}
        </span>
      </div>
      <Progress value={progress} max={100} className="h-2.5" />
      <p className="camba-caption text-muted text-right">{progress}%</p>
    </div>
  );
}
