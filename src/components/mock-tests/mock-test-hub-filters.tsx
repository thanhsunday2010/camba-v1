"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { MockTestCard } from "@/components/mock-tests/mock-test-card";
import { MockTestEmptyState } from "@/components/mock-tests/mock-test-empty-state";
import type {
  MockTestDisplayState,
  MockTestHubLabels,
  MockTestHubSummary,
} from "@/lib/mock-tests/mock-test-types";
import { filterHubSummariesByDisplayState } from "@/lib/mock-tests/mock-test-ui-utils";
import { ClipboardList } from "lucide-react";

interface MockTestHubFiltersProps {
  tests: MockTestHubSummary[];
  labels: MockTestHubLabels;
}

type HubFilter = "all" | MockTestDisplayState;

export function MockTestHubFilters({ tests, labels }: MockTestHubFiltersProps) {
  const [filter, setFilter] = useState<HubFilter>("all");

  const filtered = useMemo(
    () => filterHubSummariesByDisplayState(tests, filter),
    [tests, filter]
  );

  const filterOptions: { id: HubFilter; label: string }[] = [
    { id: "all", label: labels.filterAll },
    { id: "not-started", label: labels.filterNotStarted },
    { id: "completed", label: labels.filterCompleted },
    { id: "needs-review", label: labels.filterNeedsReview },
  ];

  if (tests.length === 0) {
    return (
      <MockTestEmptyState
        title={labels.emptyTitle}
        description={labels.emptyDescription}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={labels.filterAll}>
        {filterOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={filter === option.id}
            onClick={() => setFilter(option.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors camba-focus-ring",
              filter === option.id
                ? "bg-program text-white"
                : "bg-[var(--surface-sunken)] text-muted hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <MockTestEmptyState
          title={labels.emptyTitle}
          description={labels.emptyDescription}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((test) => (
            <MockTestCard key={test.id} test={test} labels={labels} />
          ))}
        </div>
      )}
    </div>
  );
}

interface MockTestHubHeroProps {
  title: string;
  subtitle: string;
  availableCount: string;
}

export function MockTestHubHero({ title, subtitle, availableCount }: MockTestHubHeroProps) {
  return (
    <div className="rounded-2xl border border-[var(--status-mock-test)]/20 bg-gradient-to-br from-[var(--status-mock-test)]/10 via-white to-program/5 p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="camba-icon-box-lg shrink-0 bg-[var(--status-mock-test)]/15 text-[var(--status-mock-test)]">
          <ClipboardList className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <h1 className="camba-display text-xl sm:text-2xl text-foreground">{title}</h1>
          <p className="camba-body text-muted mt-1">{subtitle}</p>
          <p className="camba-caption text-[var(--status-mock-test)] font-semibold mt-2">
            {availableCount}
          </p>
        </div>
      </div>
    </div>
  );
}
