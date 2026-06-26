"use client";

import { useState } from "react";
import { LearningUnitCard } from "@/components/learning/learning-unit-card";
import { getUnitVisualState } from "@/lib/learning/path-ui-utils";
import type { CurriculumUnitGroup } from "@/lib/learning/pivot-units";
import type { UnitVisualState } from "@/lib/learning/path-ui-utils";
import { ChevronDown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LearningLockedUnitsDropdownProps {
  units: CurriculumUnitGroup[];
  title: string;
  subtitle: string;
  continueLessonHref?: string | null;
  labels: {
    unitComingSoon: string;
    comingSoon: string;
    lockedHint: string;
    lockContinueLabel: string;
    stateLabels: Record<UnitVisualState, string>;
    continueHere: string;
  };
}

export function LearningLockedUnitsDropdown({
  units,
  title,
  subtitle,
  continueLessonHref,
  labels,
}: LearningLockedUnitsDropdownProps) {
  const [open, setOpen] = useState(false);

  if (units.length === 0) return null;

  return (
    <div className="rounded-2xl border border-dashed border-[var(--status-locked)]/30 bg-[var(--surface-sunken)]/30">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-3 p-4 text-left camba-focus-ring rounded-2xl"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="camba-body font-semibold text-foreground inline-flex items-center gap-2">
            <Lock className="h-4 w-4 text-[var(--status-locked)] shrink-0" aria-hidden />
            {title.replace("{count}", String(units.length))}
          </p>
          <p className="camba-caption text-muted mt-0.5">{subtitle}</p>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted transition-transform shrink-0 mt-0.5",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      {open && (
        <div className="space-y-2 px-3 pb-3 border-t border-border/40 pt-2">
          {units.map((unit) => (
            <LearningUnitCard
              key={unit.slug}
              unit={unit}
              expanded={false}
              onToggle={() => {}}
              continueLessonHref={continueLessonHref}
              labels={labels}
              compact
              previewOnly
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function partitionUnitsByAccess(units: CurriculumUnitGroup[]) {
  const accessible: CurriculumUnitGroup[] = [];
  const locked: CurriculumUnitGroup[] = [];

  for (const unit of units) {
    const state = getUnitVisualState(unit);
    if (state === "locked" || state === "coming-soon") {
      locked.push(unit);
    } else {
      accessible.push(unit);
    }
  }

  return { accessible, locked };
}
