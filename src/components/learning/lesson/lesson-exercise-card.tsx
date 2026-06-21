"use client";

import { cn } from "@/lib/utils";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { LessonStatusPill } from "@/components/camba/primitives/lesson-status-pill";
import {
  exerciseUiStateToVisualState,
  resolveExerciseDisplayState,
} from "@/lib/learning/lesson-ui-utils";
import type {
  LessonExerciseListLabels,
  LessonExerciseSummary,
} from "@/lib/learning/lesson-page-types";
import { SKILL_ICONS } from "@/lib/design/skill-icons";
import {
  CheckCircle2,
  Circle,
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
  isSuggested?: boolean;
  suggestedLabel?: string;
  labels: LessonExerciseListLabels;
  onSelect: () => void;
  className?: string;
}

function getExerciseIcon(type: string) {
  if (type === "writing") return PenLine;
  if (type === "speaking") return Mic;
  return Circle;
}

function getExerciseSubtitle(
  summary: LessonExerciseSummary,
  labels: LessonExerciseListLabels
): string {
  if (summary.exerciseType === "writing") return labels.writingAi;
  if (summary.exerciseType === "speaking") return labels.speakingAi;
  if (summary.questionCount > 0) {
    return labels.questionCount.replace("{count}", String(summary.questionCount));
  }
  return summary.exerciseType;
}

function getCtaLabel(
  state: ReturnType<typeof resolveExerciseDisplayState>,
  labels: LessonExerciseListLabels
): string {
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
  isSuggested,
  suggestedLabel,
  labels,
  onSelect,
  className,
}: LessonExerciseCardProps) {
  const displayState = resolveExerciseDisplayState(summary, sessionCompletedIds);
  const visualState = exerciseUiStateToVisualState(displayState);
  const Icon = getExerciseIcon(summary.exerciseType);
  const SkillTypeIcon = SKILL_ICONS[summary.exerciseType] ?? Icon;
  const cta = getCtaLabel(displayState, labels);
  const stateLabel = getStateLabel(displayState, labels);
  const isDone = displayState === "completed" || displayState === "needs_review";
  const needsReview = displayState === "needs_review";

  return (
    <CambaCard
      variant="lesson"
      padding="md"
      interactive
      className={cn(
        isSuggested && "ring-2 ring-[var(--status-recommended)]/35 shadow-md",
        needsReview && "ring-1 ring-[var(--status-needs-review)]/25",
        className
      )}
      onClick={onSelect}
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
        >
          {isDone ? (
            needsReview ? (
              <RefreshCw className="h-5 w-5" />
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )
          ) : displayState === "in_progress" ? (
            <PlayCircle className="h-5 w-5" />
          ) : (
            <SkillTypeIcon className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="camba-h3 text-foreground truncate">{summary.title}</p>
            {isSuggested && suggestedLabel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--status-recommended)]">
                <Sparkles className="h-3 w-3" />
                {suggestedLabel}
              </span>
            )}
          </div>
          <p className="camba-caption text-muted mt-0.5 truncate">
            {getExerciseSubtitle(summary, labels)}
            {summary.latestAttempt?.accuracyPercent != null &&
              summary.latestAttempt.accuracyPercent > 0 && (
                <>
                  {" · "}
                  {labels.latestScore.replace(
                    "{score}",
                    String(Math.round(summary.latestAttempt.accuracyPercent))
                  )}
                </>
              )}
          </p>
          <div className="mt-2">
            <LessonStatusPill state={visualState} label={stateLabel} />
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant={isDone ? "outline" : "default"}
          className="shrink-0 self-center"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {cta}
        </Button>
      </div>
    </CambaCard>
  );
}
