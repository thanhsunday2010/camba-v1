"use client";

import { cn } from "@/lib/utils";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { LessonStatusPill } from "@/components/camba/primitives/lesson-status-pill";
import {
  exerciseUiStateToVisualState,
  resolveExerciseDisplayState,
} from "@/lib/learning/lesson-ui-utils";
import { getExerciseTypeMessageKey } from "@/lib/learning/lesson-exercise-labels";
import type {
  LessonExerciseListLabels,
  LessonExerciseSummary,
} from "@/lib/learning/lesson-page-types";
import { useLessonI18nFormatters } from "@/lib/learning/use-lesson-i18n-formatters";
import { SKILL_ICONS } from "@/lib/design/skill-icons";
import {
  CheckCircle2,
  Mic,
  PenLine,
  PlayCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LessonExerciseCardProps {
  summary: LessonExerciseSummary;
  sessionCompletedIds: Set<string>;
  sessionAccuracyByExerciseId?: ReadonlyMap<string, number>;
  isSuggested?: boolean;
  suggestedLabel?: string;
  labels: LessonExerciseListLabels;
  onSelect: () => void;
  className?: string;
}

function getExerciseIcon(type: string) {
  if (type === "writing") return PenLine;
  if (type === "speaking") return Mic;
  return PlayCircle;
}

function getExerciseTypeLabel(
  summary: LessonExerciseSummary,
  labels: LessonExerciseListLabels
): string {
  const key = getExerciseTypeMessageKey(summary.exerciseType);
  return labels.exerciseTypeLabels[key] ?? labels.exerciseTypeLabels.default ?? summary.exerciseType;
}

function getExerciseSubtitle(
  summary: LessonExerciseSummary,
  labels: LessonExerciseListLabels,
  fmt: ReturnType<typeof useLessonI18nFormatters>
): string {
  const typeLabel = getExerciseTypeLabel(summary, labels);
  if (summary.exerciseType === "writing") return labels.writingAi;
  if (summary.exerciseType === "speaking") return labels.speakingAi;
  if (summary.questionCount > 0) {
    return `${typeLabel} · ${fmt.questionCount(summary.questionCount)}`;
  }
  return typeLabel;
}

function getCtaLabel(
  state: ReturnType<typeof resolveExerciseDisplayState>,
  labels: LessonExerciseListLabels,
  isSuggested: boolean
): string {
  if (isSuggested && state === "available") return labels.continueExercise;
  switch (state) {
    case "in_progress":
      return labels.continueExercise;
    case "completed":
      return labels.retryExercise;
    case "needs_review":
      return labels.reviewExercise;
    default:
      return labels.startExercise;
  }
}

function getStateLabel(
  state: ReturnType<typeof resolveExerciseDisplayState>,
  labels: LessonExerciseListLabels
): string {
  switch (state) {
    case "in_progress":
      return labels.inProgress;
    case "completed":
      return labels.completed;
    case "needs_review":
      return labels.needsReview;
    default:
      return labels.available;
  }
}

export function LessonExerciseCard({
  summary,
  sessionCompletedIds,
  sessionAccuracyByExerciseId,
  isSuggested,
  suggestedLabel,
  labels,
  onSelect,
  className,
}: LessonExerciseCardProps) {
  const fmt = useLessonI18nFormatters();
  const displayState = resolveExerciseDisplayState(
    summary,
    sessionCompletedIds,
    sessionAccuracyByExerciseId
  );
  const visualState = exerciseUiStateToVisualState(displayState);
  const SkillTypeIcon = SKILL_ICONS[summary.exerciseType] ?? getExerciseIcon(summary.exerciseType);
  const cta = getCtaLabel(displayState, labels, Boolean(isSuggested));
  const stateLabel = getStateLabel(displayState, labels);
  const isDone = displayState === "completed" || displayState === "needs_review";
  const needsReview = displayState === "needs_review";
  const typeBadge = getExerciseTypeLabel(summary, labels);

  return (
    <CambaCard
      variant="lesson"
      padding="md"
      className={cn(
        isSuggested && "ring-2 ring-[var(--status-recommended)]/35 shadow-md",
        needsReview && "ring-1 ring-[var(--status-needs-review)]/25",
        isDone && !needsReview && "bg-success/[0.02]",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "camba-icon-box-md shrink-0",
            needsReview
              ? "bg-orange-100 text-[var(--status-needs-review)]"
              : isDone
                ? "bg-success/10 text-success"
                : displayState === "in_progress"
                  ? "bg-blue-50 text-[var(--status-in-progress)]"
                  : "bg-program-muted text-program"
          )}
          aria-hidden
        >
          {isDone ? (
            needsReview ? (
              <RefreshCw className="h-5 w-5" />
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )
          ) : (
            <SkillTypeIcon className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="camba-h3 text-foreground">{summary.title}</p>
            {isSuggested && suggestedLabel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--status-recommended)]">
                <Sparkles className="h-3 w-3" aria-hidden />
                {suggestedLabel}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="inline-flex rounded-full bg-[var(--surface-sunken)] px-2 py-0.5 camba-caption text-muted font-medium">
              {typeBadge}
            </span>
            <p className="camba-caption text-muted truncate">
              {getExerciseSubtitle(summary, labels, fmt)}
              {summary.latestAttempt?.accuracyPercent != null &&
                summary.latestAttempt.accuracyPercent > 0 && (
                  <>
                    {" · "}
                    {fmt.latestScore(Math.round(summary.latestAttempt.accuracyPercent))}
                  </>
                )}
            </p>
          </div>
          <div className="mt-2">
            <LessonStatusPill state={visualState} label={stateLabel} />
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant={isDone ? "outline" : isSuggested ? "quest" : "default"}
          className="shrink-0 self-center"
          onClick={onSelect}
          aria-label={`${cta}: ${summary.title}`}
        >
          {cta}
        </Button>
      </div>
    </CambaCard>
  );
}
