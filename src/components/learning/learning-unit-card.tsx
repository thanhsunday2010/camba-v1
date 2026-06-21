"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { LearningLockHint } from "@/components/learning/learning-lock-hint";
import {
  computeUnitCompletedLessonCount,
  computeUnitProgressPercent,
  getUnitVisualState,
  type UnitVisualState,
} from "@/lib/learning/path-ui-utils";
import type { CurriculumUnitGroup } from "@/lib/learning/pivot-units";
import { ChevronRight, Lock, Sparkles } from "lucide-react";

interface LearningUnitCardLabels {
  unitComingSoon: string;
  comingSoon: string;
  lockedHint: string;
  lockContinueLabel: string;
  stateLabels: Record<UnitVisualState, string>;
  continueHere: string;
}

interface LearningUnitCardProps {
  unit: CurriculumUnitGroup;
  expanded: boolean;
  onToggle: () => void;
  recommended?: boolean;
  continueLessonHref?: string | null;
  unitRef?: React.Ref<HTMLDivElement>;
  labels: LearningUnitCardLabels;
  className?: string;
}

const UNIT_STATE_STYLES: Record<UnitVisualState, string> = {
  "coming-soon": "bg-[var(--surface-sunken)] text-muted border-border",
  locked: "bg-[var(--surface-sunken)] text-[var(--status-locked)] border-[var(--status-locked)]/20",
  "not-started": "bg-program-muted text-program border-program/25",
  "in-progress": "bg-blue-50 text-[var(--status-in-progress)] border-[var(--status-in-progress)]/25",
  completed: "bg-success/10 text-success border-success/25",
  mastered: "bg-success/15 text-success border-success/35",
};

export function LearningUnitCard({
  unit,
  expanded,
  onToggle,
  recommended,
  continueLessonHref,
  unitRef,
  labels,
  className,
}: LearningUnitCardProps) {
  const t = useTranslations("learning");
  const unitState = getUnitVisualState(unit);
  const progress = computeUnitProgressPercent(unit);
  const completedCount = computeUnitCompletedLessonCount(unit);
  const isLocked = unitState === "locked";

  return (
    <div ref={unitRef} className={className}>
      <CambaCard
        variant="elevated"
        padding="none"
        className={cn(
          recommended && "ring-2 ring-[var(--status-recommended)]/30",
          !unit.hasContent && "border-dashed"
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          className="w-full text-left p-4 sm:p-5 camba-focus-ring rounded-t-2xl"
          aria-expanded={expanded}
        >
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                unit.hasContent
                  ? "camba-gradient-program text-white"
                  : "bg-[var(--surface-sunken)] text-muted"
              )}
            >
              {unit.hasContent ? unit.unitNumber || "·" : <Sparkles className="h-4 w-4" />}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="camba-h2 text-foreground truncate">{unit.title}</h3>
                {recommended && (
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--status-recommended)]">
                    {labels.continueHere}
                  </span>
                )}
              </div>
              <p className="camba-caption text-muted mt-1">
                {unit.hasContent ? (
                  <>
                    {t("unitProgressSummary", {
                      completed: completedCount,
                      total: unit.lessonCount,
                    })}
                    {unit.exerciseCount > 0 && (
                      <>
                        {" · "}
                        {t("unitExerciseCount", { count: unit.exerciseCount })}
                      </>
                    )}
                  </>
                ) : (
                  labels.unitComingSoon
                )}
              </p>
              <span
                className={cn(
                  "inline-flex mt-2 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
                  UNIT_STATE_STYLES[unitState]
                )}
              >
                {isLocked && <Lock className="h-3 w-3" />}
                {labels.stateLabels[unitState]}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              {unit.hasContent && (
                <span className="camba-stat text-lg text-program">{progress}%</span>
              )}
              <ChevronRight
                className={cn(
                  "h-5 w-5 text-muted transition-transform",
                  expanded && "rotate-90"
                )}
              />
            </div>
          </div>
          {unit.hasContent && (
            <div className="mt-3 h-2 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
              <div
                className="h-full camba-gradient-program rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          {!unit.hasContent && (
            <p className="camba-caption text-muted mt-3 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              {labels.comingSoon}
            </p>
          )}
        </button>
        {isLocked && (
          <div className="px-4 pb-4 sm:px-5 sm:pb-5">
            <LearningLockHint
              compact
              message={labels.lockedHint}
              continueHref={continueLessonHref ?? undefined}
              continueLabel={continueLessonHref ? labels.lockContinueLabel : undefined}
            />
          </div>
        )}
      </CambaCard>
    </div>
  );
}
