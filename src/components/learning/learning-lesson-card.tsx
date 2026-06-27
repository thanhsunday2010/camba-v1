"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import {
  LessonStatusPill,
  MasteryBadge,
} from "@/components/camba/primitives/lesson-status-pill";
import { LearningLockHint } from "@/components/learning/learning-lock-hint";
import { getLessonPresentation } from "@/lib/learning/path-ui-utils";
import { isLessonUnlockedFromProgress } from "@/lib/learning/unlock";
import { useLessonUnlockBypass } from "@/components/learning/lesson-unlock-bypass-context";
import type { LessonVisualState } from "@/lib/design/status-tokens";
import type { LessonWithProgress } from "@/types/learning";
import { ChevronRight, Lock, RefreshCw, Sparkles } from "lucide-react";

interface LearningLessonCardLabels {
  minutes: string;
  lockedHint: string;
  lockContinueLabel: string;
  stateLabels: Record<LessonVisualState, string>;
  ctaStart: string;
  ctaContinue: string;
  ctaReview: string;
  recommended: string;
  needsReview: string;
}

interface LearningLessonCardProps {
  lesson: LessonWithProgress;
  masteryLabels: Record<number, string>;
  recommendedLessonId?: string | null;
  continueLessonHref?: string | null;
  suppressReviewBadge?: boolean;
  labels: LearningLessonCardLabels;
  skillName?: string;
  className?: string;
  variant?: "default" | "compact";
}

export function LearningLessonCard({
  lesson,
  masteryLabels,
  recommendedLessonId,
  continueLessonHref,
  suppressReviewBadge,
  labels,
  skillName,
  className,
  variant = "default",
}: LearningLessonCardProps) {
  const t = useTranslations("learning");
  const lessonUnlockBypass = useLessonUnlockBypass();
  const presentation = getLessonPresentation(lesson, {
    recommendedLessonId,
    stateLabels: labels.stateLabels,
    ctaStart: labels.ctaStart,
    ctaContinue: labels.ctaContinue,
    ctaReview: labels.ctaReview,
    bypassUnlock: lessonUnlockBypass,
  });
  const { state, stateLabel, cta } = presentation;
  const unlocked =
    lessonUnlockBypass || isLessonUnlockedFromProgress(lesson.progress);
  const mastery = lesson.progress?.mastery_level ?? 0;
  const completion = lesson.progress?.completion_percent ?? 0;
  const exerciseCount = lesson.exercise_count ?? 0;
  const recommended = state === "recommended";
  const needsReview = state === "needs-review";

  const metaParts: string[] = [];
  if (skillName) metaParts.push(skillName);
  metaParts.push(`${lesson.estimated_minutes} ${labels.minutes}`);
  if (exerciseCount > 0) {
    metaParts.push(t("lessonExerciseCount", { count: exerciseCount }));
  }
  if (completion > 0) metaParts.push(`${completion}%`);

  const compact = variant === "compact";

  const card = (
    <CambaCard
      variant="lesson"
      padding={compact ? "sm" : "md"}
      interactive={unlocked}
      className={cn(
        "h-full",
        recommended && "ring-2 ring-[var(--status-recommended)]/40 shadow-md",
        needsReview && "ring-1 ring-[var(--status-needs-review)]/25",
        state === "locked" && "opacity-90",
        compact && "shadow-sm",
        className
      )}
    >
      <div className={cn("flex gap-2.5", compact ? "flex-col" : "items-start gap-3")}>
        {!compact && (
        <div
          className={cn(
            "camba-icon-box-md shrink-0",
            unlocked
              ? needsReview
                ? "bg-orange-100 text-[var(--status-needs-review)]"
                : "bg-program-muted text-program"
              : "bg-[var(--surface-sunken)] text-[var(--status-locked)]"
          )}
        >
          {!unlocked ? (
            <Lock className="h-5 w-5" />
          ) : needsReview ? (
            <RefreshCw className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {compact && !unlocked && (
              <Lock className="h-3.5 w-3.5 text-[var(--status-locked)] shrink-0" aria-hidden />
            )}
            <p className={cn("text-foreground truncate", compact ? "camba-caption font-semibold leading-snug" : "camba-h3")}>
              {lesson.title}
            </p>
            {recommended && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--status-recommended)]">
                {!compact && <Sparkles className="h-3 w-3" />}
                {labels.recommended}
              </span>
            )}
            {needsReview && !suppressReviewBadge && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--status-needs-review)]">
                {labels.needsReview}
              </span>
            )}
          </div>
          <p className="camba-caption text-muted mt-0.5 truncate">{metaParts.join(" · ")}</p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            <LessonStatusPill state={state} label={stateLabel} />
            {lesson.progress && !compact && (
              <MasteryBadge
                level={mastery as 0 | 1 | 2 | 3 | 4}
                label={masteryLabels[mastery] ?? masteryLabels[0]}
              />
            )}
          </div>
          {!unlocked && !compact && (
            <LearningLockHint
              compact
              message={labels.lockedHint}
              continueHref={continueLessonHref ?? undefined}
              continueLabel={continueLessonHref ? labels.lockContinueLabel : undefined}
              className="mt-2"
            />
          )}
        </div>
        {unlocked && cta && !compact && (
          <span
            className={cn(
              "shrink-0 self-center text-xs font-bold hidden sm:inline",
              needsReview ? "text-[var(--status-needs-review)]" : "text-program"
            )}
          >
            {cta} →
          </span>
        )}
      </div>
    </CambaCard>
  );

  if (unlocked) {
    return <Link href={`/learning/lesson/${lesson.id}`}>{card}</Link>;
  }

  return card;
}
