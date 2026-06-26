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
  compact?: boolean;
  /** Locked-unit preview inside dropdown — no expand toggle */
  previewOnly?: boolean;
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
  compact = false,
  previewOnly = false,
}: LearningUnitCardProps) {
  const unitState = getUnitVisualState(unit);
  const progress = computeUnitProgressPercent(unit);
  const completedCount = computeUnitCompletedLessonCount(unit);
  const isLocked = unitState === "locked";

  return (
    <div ref={unitRef} className={className}>
      <CambaCard
        variant={compact ? "default" : "elevated"}
        padding="none"
        className={cn(
          recommended && "ring-2 ring-[var(--status-recommended)]/30",
          !unit.hasContent && "border-dashed"
        )}
      >
        {previewOnly ? (
          <div className={cn("p-3", compact && "p-3")}>
            <UnitCardBody
              unit={unit}
              labels={labels}
              isLocked={isLocked}
              progress={progress}
              completedCount={completedCount}
              unitState={unitState}
              recommended={false}
              compact={compact}
              previewOnly
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "w-full text-left camba-focus-ring rounded-t-2xl",
              compact ? "p-3 sm:p-4" : "p-4 sm:p-5"
            )}
            aria-expanded={expanded}
          >
            <UnitCardBody
              unit={unit}
              labels={labels}
              isLocked={isLocked}
              progress={progress}
              completedCount={completedCount}
              unitState={unitState}
              recommended={recommended}
              compact={compact}
              expanded={expanded}
              previewOnly={false}
            />
          </button>
        )}
        {isLocked && !previewOnly && (
          <div className={cn("px-3 pb-3 sm:px-4 sm:pb-4", compact && "px-3 pb-3")}>
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

function UnitCardBody({
  unit,
  labels,
  isLocked,
  progress,
  completedCount,
  unitState,
  recommended,
  compact,
  expanded,
  previewOnly = false,
}: {
  unit: CurriculumUnitGroup;
  labels: LearningUnitCardLabels;
  isLocked: boolean;
  progress: number;
  completedCount: number;
  unitState: UnitVisualState;
  recommended?: boolean;
  compact?: boolean;
  expanded?: boolean;
  previewOnly?: boolean;
}) {
  const t = useTranslations("learning");

  return (
    <>
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg font-bold",
            compact ? "h-8 w-8 text-xs" : "h-10 w-10 rounded-xl text-sm",
            unit.hasContent
              ? "camba-gradient-program text-white"
              : "bg-[var(--surface-sunken)] text-muted"
          )}
        >
          {unit.hasContent ? unit.unitNumber || "·" : <Sparkles className="h-3.5 w-3.5" />}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className={cn("text-foreground truncate", compact ? "camba-body font-semibold" : "camba-h2")}>
              {unit.title}
            </h3>
            {recommended && (
              <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[var(--status-recommended)]">
                {labels.continueHere}
              </span>
            )}
          </div>
          <p className="camba-caption text-muted mt-0.5">
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
              "inline-flex mt-1.5 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
              UNIT_STATE_STYLES[unitState]
            )}
          >
            {isLocked && <Lock className="h-3 w-3" />}
            {labels.stateLabels[unitState]}
          </span>
        </div>
        {!previewOnly && (
          <div className="flex flex-col items-end gap-0.5 shrink-0">
            {unit.hasContent && (
              <span className={cn("camba-stat text-program", compact ? "text-base" : "text-lg")}>
                {progress}%
              </span>
            )}
            <ChevronRight
              className={cn(
                "h-4 w-4 text-muted transition-transform",
                expanded && "rotate-90"
              )}
            />
          </div>
        )}
      </div>
      {unit.hasContent && (
        <div className="mt-2 h-1.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
          <div
            className="h-full camba-gradient-program rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {!unit.hasContent && (
        <p className="camba-caption text-muted mt-2 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5" />
          {labels.comingSoon}
        </p>
      )}
    </>
  );
}
