import { cn } from "@/lib/utils";
import { ProgramBadge } from "@/components/camba/cambridge/program-badge";
import {
  LessonStatusPill,
  MasteryBadge,
} from "@/components/camba/primitives/lesson-status-pill";
import { ProgressRing } from "@/components/camba/progress-ring";
import { Button } from "@/components/ui/button";
import { SKILL_ICONS } from "@/lib/design/skill-icons";
import {
  getLessonDisplayState,
  lessonDisplayStateToVisualState,
} from "@/lib/learning/lesson-ui-utils";
import type {
  LessonDisplayState,
  LessonPageContext,
  LessonPageLabels,
  LessonPageProgress,
  ResolvedLessonProgress,
} from "@/lib/learning/lesson-page-types";
import { ArrowRight, BookOpen, Clock, Sparkles } from "lucide-react";

interface LessonHeroProps {
  title: string;
  description?: string | null;
  estimatedMinutes?: number | null;
  context: LessonPageContext;
  serverProgress: LessonPageProgress;
  resolvedProgress: ResolvedLessonProgress;
  masteryLabel: string;
  labels: Pick<
    LessonPageLabels,
    | "estimatedMinutes"
    | "unitLabel"
    | "exerciseCount"
    | "continueLesson"
    | "retryLesson"
    | "reviewLesson"
    | "heroContinueHint"
    | "stateLabels"
  >;
  isActiveExercise?: boolean;
  isReviewingLesson?: boolean;
  isCompleteMode?: boolean;
  onPrimaryAction?: () => void;
  className?: string;
}

function getPrimaryCta(
  displayState: LessonDisplayState,
  labels: LessonHeroProps["labels"],
  hasNextSuggested: boolean
): { label: string; show: boolean } {
  if (displayState === "completed" || displayState === "mastered") {
    return { label: labels.retryLesson, show: true };
  }
  if (displayState === "needs-review") {
    return { label: labels.reviewLesson, show: true };
  }
  if (hasNextSuggested) {
    return {
      label: displayState === "not-started" ? labels.continueLesson : labels.continueLesson,
      show: true,
    };
  }
  return { label: labels.continueLesson, show: false };
}

export function LessonHero({
  title,
  description,
  estimatedMinutes,
  context,
  serverProgress,
  resolvedProgress,
  masteryLabel,
  labels,
  isActiveExercise,
  isReviewingLesson,
  isCompleteMode,
  onPrimaryAction,
  className,
}: LessonHeroProps) {
  const SkillIcon = context.skillSlug ? SKILL_ICONS[context.skillSlug] : BookOpen;
  const displayState = getLessonDisplayState(
    serverProgress,
    resolvedProgress,
    serverProgress.isUnlocked
  );
  const visualState = lessonDisplayStateToVisualState(displayState);
  const stateLabel = labels.stateLabels[displayState];
  const hasNextSuggested = Boolean(resolvedProgress.nextSuggestedExerciseId);
  const primaryCta = getPrimaryCta(displayState, labels, hasNextSuggested);

  const metaParts: string[] = [];
  if (context.skillName) metaParts.push(context.skillName);
  if (context.unitTitle) metaParts.push(`${labels.unitLabel}: ${context.unitTitle}`);
  if (resolvedProgress.totalExercises > 0 && !isCompleteMode) {
    metaParts.push(labels.exerciseCount(resolvedProgress.totalExercises));
  }

  if (isCompleteMode) {
    return (
      <section
        className={cn(
          "rounded-2xl border border-border/80 bg-white/70 shadow-sm px-4 py-3 sm:px-5 sm:py-3.5",
          className
        )}
      >
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {context.programSlug && <ProgramBadge programSlug={context.programSlug} size="sm" />}
          {context.levelSlug && (
            <span className="rounded-full bg-program-muted border border-program/15 px-2 py-0.5 text-[10px] font-bold text-program uppercase">
              {context.levelSlug}
            </span>
          )}
          <LessonStatusPill state={visualState} label={stateLabel} />
        </div>
        <div className="mt-2 min-w-0">
          <h1 className="camba-h2 text-foreground truncate">{title}</h1>
          {metaParts.length > 0 && (
            <p className="camba-caption text-muted mt-0.5 flex items-center gap-1.5 truncate">
              {context.skillSlug && (
                <SkillIcon className="h-3.5 w-3.5 text-program shrink-0" />
              )}
              {metaParts.join(" · ")}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border-2 border-program/20 shadow-md camba-gradient-program-soft camba-hero-pattern",
        isActiveExercise && "opacity-95",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-20 blur-3xl camba-gradient-program"
        aria-hidden
      />
      <div className="relative p-5 sm:p-7 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {context.programSlug && <ProgramBadge programSlug={context.programSlug} size="sm" />}
          {context.levelSlug && (
            <span className="rounded-full bg-white/80 border border-program/20 px-2.5 py-0.5 text-xs font-bold text-program uppercase">
              {context.levelSlug}
            </span>
          )}
          <LessonStatusPill state={visualState} label={stateLabel} />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <h1 className="camba-display text-foreground">{title}</h1>
              {metaParts.length > 0 && (
                <p className="camba-caption text-muted mt-1 flex items-center gap-1.5 flex-wrap">
                  {context.skillSlug && (
                    <SkillIcon className="h-3.5 w-3.5 text-program shrink-0" />
                  )}
                  {metaParts.join(" · ")}
                </p>
              )}
              {description && (
                <p className="camba-body text-muted mt-2 leading-relaxed max-w-2xl">
                  {description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {typeof estimatedMinutes === "number" && estimatedMinutes > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 border border-border px-3 py-1 camba-caption text-muted">
                  <Clock className="h-3.5 w-3.5" />
                  {estimatedMinutes} {labels.estimatedMinutes}
                </span>
              )}
              <MasteryBadge
                level={
                  Math.min(4, Math.max(0, serverProgress.masteryLevel)) as
                    | 0
                    | 1
                    | 2
                    | 3
                    | 4
                }
                label={masteryLabel}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            <div className="flex items-center gap-3 rounded-2xl bg-white/70 border border-border px-4 py-3">
              <ProgressRing
                value={resolvedProgress.completionPercentResolved}
                size={52}
                strokeWidth={5}
                label={`${resolvedProgress.completionPercentResolved}%`}
              />
              <div>
                <p className="camba-caption text-muted">
                  {labels.exerciseCount(resolvedProgress.totalExercises)}
                </p>
                <p className="camba-stat text-lg text-program">
                  {resolvedProgress.completedCount}/{resolvedProgress.totalExercises}
                </p>
              </div>
            </div>

            {primaryCta.show &&
              onPrimaryAction &&
              !isActiveExercise &&
              !isReviewingLesson && (
              <Button
                variant="quest"
                size="lg"
                className="w-full sm:w-auto gap-2"
                onClick={onPrimaryAction}
              >
                {hasNextSuggested && displayState !== "completed" && (
                  <Sparkles className="h-4 w-4" />
                )}
                {primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {hasNextSuggested &&
          !resolvedProgress.isLessonCompleteResolved &&
          !isActiveExercise && (
            <p className="camba-caption text-muted">{labels.heroContinueHint}</p>
          )}
      </div>
    </section>
  );
}
