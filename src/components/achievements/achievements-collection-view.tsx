"use client";

import { useMemo, useState } from "react";
import { AchievementCard, type AchievementCardLabels } from "@/components/achievements/achievement-card";
import { AchievementDetailDialog, type AchievementDetailLabels } from "@/components/achievements/achievement-detail-dialog";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { PortfolioLink } from "@/components/profile/portfolio-link";
import type {
  AchievementCategory,
  AchievementRarity,
  ResolvedAchievementViewModel,
} from "@/lib/achievements/achievement-types";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";

export type AchievementsCollectionLabels = AchievementCardLabels &
  AchievementDetailLabels & {
    pageTitle: string;
    pageSubtitle: string;
    viewPortfolio?: string;
    filterAll: string;
    filterUnlocked: string;
    filterLocked: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
    resetFiltersAction: string;
    unlockedSummary: string;
    encouragement: string;
  };

type FilterStatus = "all" | "unlocked" | "locked";
type FilterCategory = AchievementCategory | "all";

interface AchievementsCollectionViewProps {
  model: ResolvedAchievementViewModel;
  labels: AchievementsCollectionLabels;
}

export function AchievementsCollectionView({
  model,
  labels,
}: AchievementsCollectionViewProps) {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("all");
  const [rarityFilter, setRarityFilter] = useState<AchievementRarity | "all">("all");
  const [selected, setSelected] = useState<ResolvedAchievementViewModel["achievements"][number] | null>(null);

  const filtered = useMemo(() => {
    return model.achievements.filter((a) => {
      if (statusFilter === "unlocked" && !a.unlocked) return false;
      if (statusFilter === "locked" && a.unlocked) return false;
      if (categoryFilter !== "all" && a.category !== categoryFilter) return false;
      if (rarityFilter !== "all" && a.rarity !== rarityFilter) return false;
      return true;
    });
  }, [model.achievements, statusFilter, categoryFilter, rarityFilter]);

  const categories: FilterCategory[] = [
    "all",
    "learning",
    "assessment",
    "writing",
    "speaking",
    "consistency",
    "journey",
    "certification",
  ];

  const rarities: (AchievementRarity | "all")[] = [
    "all",
    "common",
    "rare",
    "epic",
    "legendary",
  ];

  return (
    <div className="camba-section-stack gap-6 sm:gap-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-2 flex-1">
            <div className="flex items-center gap-2 text-[var(--color-badge)]">
              <Award className="h-6 w-6" aria-hidden />
              <span className="camba-caption font-bold uppercase tracking-wide">
                Cambridge Achievements
              </span>
            </div>
            <h1 className="camba-display text-foreground">{labels.pageTitle}</h1>
            <p className="camba-body text-muted max-w-2xl">{labels.pageSubtitle}</p>
            <p className="camba-caption font-semibold text-foreground">
              {labels.unlockedSummary
                .replace("{count}", String(model.unlockedCount))
                .replace("{total}", String(model.totalCount))}
            </p>
          </div>
          {labels.viewPortfolio && <PortfolioLink label={labels.viewPortfolio} />}
        </div>
      </header>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Status filter">
          {(["all", "unlocked", "locked"] as FilterStatus[]).map((filter) => (
            <FilterChip
              key={filter}
              active={statusFilter === filter}
              onClick={() => setStatusFilter(filter)}
              label={
                filter === "all"
                  ? labels.filterAll
                  : filter === "unlocked"
                    ? labels.filterUnlocked
                    : labels.filterLocked
              }
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Category filter">
          {categories.map((cat) => (
            <FilterChip
              key={cat}
              active={categoryFilter === cat}
              onClick={() => setCategoryFilter(cat)}
              label={cat === "all" ? labels.filterAll : labels.category[cat]}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Rarity filter">
          {rarities.map((rarity) => (
            <FilterChip
              key={rarity}
              active={rarityFilter === rarity}
              onClick={() => setRarityFilter(rarity)}
              label={rarity === "all" ? labels.filterAll : labels.rarity[rarity]}
            />
          ))}
        </div>
      </div>

      {model.unlockedCount === 0 && (
        <p className="camba-caption text-muted rounded-xl border border-dashed border-program/20 bg-program-muted/20 px-4 py-3">
          {labels.encouragement}
        </p>
      )}

      {filtered.length === 0 ? (
        <DashboardEmptyState
          icon={Award}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          actionLabel={labels.emptyAction}
          actionHref="/learning"
          secondaryActionLabel={labels.resetFiltersAction}
          onSecondaryAction={() => {
            setStatusFilter("all");
            setCategoryFilter("all");
            setRarityFilter("all");
          }}
        />
      ) : (
        <div
          className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label={labels.pageTitle}
        >
          {filtered.map((achievement) => (
              <div key={achievement.id} role="listitem">
                <AchievementCard
                  achievement={achievement}
                  title={achievement.title}
                  description={achievement.description}
                  labels={labels}
                  onClick={() => setSelected(achievement)}
                />
              </div>
            ))}
        </div>
      )}

      <AchievementDetailDialog
        achievement={selected}
        labels={labels}
        open={selected != null}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
            className={cn(
              "rounded-full px-3 py-2 camba-caption font-semibold transition-colors camba-focus-ring min-h-[var(--touch-target-min)] sm:min-h-0 sm:py-1.5 inline-flex items-center",
        active
          ? "bg-program text-white"
          : "bg-[var(--surface-sunken)] text-muted hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
