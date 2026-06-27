"use client";

import { useState } from "react";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { formatNumber } from "@/lib/utils";
import type { DashboardLeaderboardsView } from "@/lib/gamification/leaderboard-types";
import { cn } from "@/lib/utils";
import { Award, Calendar, Flame, Medal, Trophy, Users } from "lucide-react";

export type DashboardLeaderboardsLabels = {
  sectionTitle: string;
  sectionSubtitle: string;
  weeklyLeague: string;
  monthlyBoard: string;
  allTimeBoard: string;
  levelBoard: string;
  streakBoard: string;
  bestStreakBoard: string;
  yourRank: string;
  empty: string;
  xpUnit: string;
  streakUnit: string;
  tierLabel: string;
  promoteHint: string;
  maxTierHint: string;
  weeklyMeta: string;
  monthlyMeta: string;
  allTimeMeta: string;
  levelMeta: string;
  streakMeta: string;
  bestStreakMeta: string;
  tierNames: Record<string, string>;
};

type LeaderboardTab =
  | "weekly"
  | "monthly"
  | "allTime"
  | "level"
  | "streak"
  | "bestStreak";

interface DashboardLeaderboardsSectionProps {
  leaderboards: DashboardLeaderboardsView;
  labels: DashboardLeaderboardsLabels;
}

export function DashboardLeaderboardsSection({
  leaderboards,
  labels,
}: DashboardLeaderboardsSectionProps) {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("weekly");

  const tabs: { id: LeaderboardTab; label: string; icon: typeof Trophy }[] = [
    { id: "weekly", label: labels.weeklyLeague, icon: Trophy },
    { id: "monthly", label: labels.monthlyBoard, icon: Calendar },
    { id: "allTime", label: labels.allTimeBoard, icon: Medal },
    { id: "level", label: labels.levelBoard, icon: Users },
    { id: "streak", label: labels.streakBoard, icon: Flame },
    { id: "bestStreak", label: labels.bestStreakBoard, icon: Award },
  ];

  const activeBoard = resolveActiveBoard(activeTab, leaderboards, labels);

  return (
    <section aria-labelledby="leaderboards-heading" className="space-y-3">
      <div>
        <h2 id="leaderboards-heading" className="camba-h3 text-foreground">
          {labels.sectionTitle}
        </h2>
        <p className="camba-caption text-muted mt-0.5">{labels.sectionSubtitle}</p>
      </div>

      <CambaCard variant="default" padding="md" className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 camba-caption font-semibold transition-colors camba-focus-ring",
                  activeTab === tab.id
                    ? "bg-program text-white shadow-sm"
                    : "bg-[var(--surface-sunken)] text-muted hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeBoard.meta && (
          <p className="camba-caption text-muted">{activeBoard.meta}</p>
        )}

        {activeBoard.userRank != null && (
          <p className="camba-caption font-medium text-program">
            {labels.yourRank}: #{activeBoard.userRank} · {formatNumber(activeBoard.userScore)}{" "}
            {activeBoard.scoreUnit}
          </p>
        )}

        <LeaderboardList
          entries={activeBoard.entries}
          scoreUnit={activeBoard.scoreUnit}
          emptyText={labels.empty}
        />
      </CambaCard>
    </section>
  );
}

function resolveActiveBoard(
  tab: LeaderboardTab,
  leaderboards: DashboardLeaderboardsView,
  labels: DashboardLeaderboardsLabels
) {
  switch (tab) {
    case "weekly":
      return {
        entries: leaderboards.weeklyLeague.entries,
        userRank: leaderboards.weeklyLeague.userRank,
        userScore: leaderboards.weeklyLeague.userScore,
        scoreUnit: labels.xpUnit,
        meta: buildWeeklyMeta(leaderboards, labels),
      };
    case "monthly":
      return {
        entries: leaderboards.monthlyBoard.entries,
        userRank: leaderboards.monthlyBoard.userRank,
        userScore: leaderboards.monthlyBoard.userScore,
        scoreUnit: labels.xpUnit,
        meta: labels.monthlyMeta,
      };
    case "allTime":
      return {
        entries: leaderboards.allTimeBoard.entries,
        userRank: leaderboards.allTimeBoard.userRank,
        userScore: leaderboards.allTimeBoard.userScore,
        scoreUnit: labels.xpUnit,
        meta: labels.allTimeMeta,
      };
    case "level":
      return {
        entries: leaderboards.levelBoard.entries,
        userRank: leaderboards.levelBoard.userRank,
        userScore: leaderboards.levelBoard.userScore,
        scoreUnit: labels.xpUnit,
        meta: leaderboards.levelBoard.levelName
          ? labels.levelMeta.replace("{level}", leaderboards.levelBoard.levelName)
          : labels.levelMeta.replace("{level}", "—"),
      };
    case "streak":
      return {
        entries: leaderboards.streakBoard.entries,
        userRank: leaderboards.streakBoard.userRank,
        userScore: leaderboards.streakBoard.userScore,
        scoreUnit: labels.streakUnit,
        meta: labels.streakMeta,
      };
    case "bestStreak":
      return {
        entries: leaderboards.bestStreakBoard.entries,
        userRank: leaderboards.bestStreakBoard.userRank,
        userScore: leaderboards.bestStreakBoard.userScore,
        scoreUnit: labels.streakUnit,
        meta: labels.bestStreakMeta,
      };
  }
}

function buildWeeklyMeta(
  leaderboards: DashboardLeaderboardsView,
  labels: DashboardLeaderboardsLabels
): string {
  const tierName =
    labels.tierNames[leaderboards.weeklyLeague.tier] ?? leaderboards.weeklyLeague.tier;

  if (leaderboards.weeklyLeague.nextTier && leaderboards.weeklyLeague.xpToNextTier != null) {
    const nextName =
      labels.tierNames[leaderboards.weeklyLeague.nextTier] ?? leaderboards.weeklyLeague.nextTier;
    return labels.promoteHint
      .replace("{tier}", tierName)
      .replace("{nextTier}", nextName)
      .replace("{xp}", String(leaderboards.weeklyLeague.xpToNextTier));
  }

  return `${labels.weeklyMeta} · ${labels.maxTierHint.replace("{tier}", tierName)}`;
}

function LeaderboardList({
  entries,
  scoreUnit,
  emptyText,
}: {
  entries: DashboardLeaderboardsView["monthlyBoard"]["entries"];
  scoreUnit: string;
  emptyText: string;
}) {
  if (entries.length === 0) {
    return <p className="camba-body text-muted text-center py-6">{emptyText}</p>;
  }

  return (
    <ol className="space-y-1.5">
      {entries.map((entry) => (
        <li
          key={entry.userId}
          className={cn(
            "flex items-center justify-between gap-3 rounded-xl px-3 py-2",
            entry.isCurrentUser ? "bg-program/8 border border-program/15" : "bg-[var(--surface-sunken)]/50"
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={cn(
                "w-6 text-center camba-caption font-bold shrink-0",
                entry.rank <= 3 ? "text-warning" : "text-muted"
              )}
            >
              {entry.rank}
            </span>
            <span
              className={cn(
                "camba-body truncate",
                entry.isCurrentUser ? "font-semibold text-program" : "text-foreground"
              )}
            >
              {entry.fullName}
            </span>
          </div>
          <span className="camba-caption font-semibold text-foreground shrink-0">
            {formatNumber(entry.score)} {scoreUnit}
          </span>
        </li>
      ))}
    </ol>
  );
}
