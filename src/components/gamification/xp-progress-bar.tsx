import { XPBar } from "@/components/camba/xp-bar";

interface XpProgressBarProps {
  totalXp: number;
  level: number;
  coins: number;
  xpLabel: string;
  coinsLabel: string;
  levelProgressLabel: string;
}

/** @deprecated Use XPBar from @/components/camba — kept for backward compatibility */
export function XpProgressBar(props: XpProgressBarProps) {
  return (
    <XPBar
      totalXp={props.totalXp}
      level={props.level}
      coins={props.coins}
      xpLabel={props.xpLabel}
      coinsLabel={props.coinsLabel}
      levelLabel={props.levelProgressLabel}
    />
  );
}
