import type { AchievementIconName, AchievementRarity } from "@/lib/achievements/achievement-types";
import {
  Award,
  BookOpen,
  ClipboardList,
  Flame,
  GraduationCap,
  Map,
  Mic,
  PenLine,
  Sparkles,
  Star,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<AchievementIconName, LucideIcon> = {
  "book-open": BookOpen,
  map: Map,
  flame: Flame,
  "clipboard-list": ClipboardList,
  trophy: Trophy,
  award: Award,
  "pen-line": PenLine,
  mic: Mic,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  "graduation-cap": GraduationCap,
};

export const RARITY_STYLES: Record<
  AchievementRarity,
  { ring: string; bg: string; text: string; label: string }
> = {
  common: {
    ring: "ring-border/40",
    bg: "bg-[var(--surface-sunken)]",
    text: "text-muted",
    label: "common",
  },
  rare: {
    ring: "ring-program/25",
    bg: "bg-program-muted/40",
    text: "text-program",
    label: "rare",
  },
  epic: {
    ring: "ring-violet-400/30",
    bg: "bg-violet-50",
    text: "text-violet-700",
    label: "epic",
  },
  legendary: {
    ring: "ring-[var(--color-badge)]/35",
    bg: "bg-[var(--color-badge)]/10",
    text: "text-[var(--color-badge)]",
    label: "legendary",
  },
};

export function AchievementIcon({
  name,
  unlocked,
  className,
}: {
  name: AchievementIconName;
  unlocked?: boolean;
  className?: string;
}) {
  const Icon = ICON_MAP[name] ?? Award;
  return (
    <Icon
      className={cn("h-5 w-5", !unlocked && "opacity-70", className)}
      aria-hidden
    />
  );
}

export function AchievementRarityBadge({
  rarity,
  label,
  className,
}: {
  rarity: AchievementRarity;
  label: string;
  className?: string;
}) {
  const styles = RARITY_STYLES[rarity];
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 camba-caption font-semibold capitalize",
        styles.bg,
        styles.text,
        className
      )}
    >
      {label}
    </span>
  );
}
