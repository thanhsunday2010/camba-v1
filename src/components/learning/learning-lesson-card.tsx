"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import {
  LessonStatusPill,
  MasteryBadge,
} from "@/components/camba/primitives/lesson-status-pill";
import { getLessonVisualState } from "@/lib/learning/path-ui-utils";
import { isLessonUnlockedFromProgress } from "@/lib/learning/unlock";
import type { LessonVisualState } from "@/lib/design/status-tokens";
import type { LessonWithProgress } from "@/types/learning";
import { ChevronRight, Lock, Sparkles } from "lucide-react";

interface LearningLessonCardLabels {
  minutes: string;
  lockedDesc: string;
  stateLabels: Record<LessonVisualState, string>;
  ctaStart: string;
  ctaContinue: string;
  ctaReview: string;
  recommended: string;
}

interface LearningLessonCardProps {
  lesson: LessonWithProgress;
  masteryLabels: Record<number, string>;
  recommendedLessonId?: string | null;
  labels: LearningLessonCardLabels;
  skillName?: string;
  className?: string;
}

function ctaForState(
  state: LessonVisualState,
  completion: number,
  labels: LearningLessonCardLabels
): string | null {
  switch (state) {
    case "locked":
      return null;
    case "in-progress":
      return labels.ctaContinue;
    case "recommended":
      return completion > 0 ? labels.ctaContinue : labels.ctaStart;
    case "completed":
    case "mastered":
      return labels.ctaReview;
    default:
      return labels.ctaStart;
  }
}

export function LearningLessonCard({
  lesson,
  masteryLabels,
  recommendedLessonId,
  labels,
  skillName,
  className,
}: LearningLessonCardProps) {
  const t = useTranslations("learning");
  const state = getLessonVisualState(lesson, recommendedLessonId);
  const unlocked = isLessonUnlockedFromProgress(lesson.progress);
  const mastery = lesson.progress?.mastery_level ?? 0;
  const completion = lesson.progress?.completion_percent ?? 0;
  const exerciseCount = lesson.exercise_count ?? 0;
  const cta = ctaForState(state, completion, labels);
  const recommended = state === "recommended";

  const metaParts: string[] = [];
  if (skillName) metaParts.push(skillName);
  metaParts.push(`${lesson.estimated_minutes} ${labels.minutes}`);
  if (exerciseCount > 0) {
    metaParts.push(t("lessonExerciseCount", { count: exerciseCount }));
  }
  if (completion > 0) metaParts.push(`${completion}%`);

  const card = (
    <CambaCard
      variant="lesson"
      padding="md"
      interactive={unlocked}
      className={cn(
        recommended && "ring-2 ring-[var(--status-recommended)]/40 shadow-md",
        state === "locked" && "opacity-75",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "camba-icon-box-md shrink-0",
            unlocked ? "bg-program-muted text-program" : "bg-[var(--surface-sunken)] text-[var(--status-locked)]"
          )}
        >
          {unlocked ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <Lock className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="camba-h3 text-foreground truncate">{lesson.title}</p>
            {recommended && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--status-recommended)]">
                <Sparkles className="h-3 w-3" />
                {labels.recommended}
              </span>
            )}
          </div>
          <p className="camba-caption text-muted mt-0.5 truncate">{metaParts.join(" · ")}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <LessonStatusPill state={state} label={labels.stateLabels[state]} />
            {lesson.progress && (
              <MasteryBadge
                level={mastery as 0 | 1 | 2 | 3 | 4}
                label={masteryLabels[mastery] ?? masteryLabels[0]}
              />
            )}
          </div>
          {!unlocked && (
            <p className="camba-caption text-muted mt-2 leading-snug">{labels.lockedDesc}</p>
          )}
        </div>
        {unlocked && cta && (
          <span className="shrink-0 self-center text-xs font-bold text-program">{cta} →</span>
        )}
      </div>
    </CambaCard>
  );

  if (unlocked) {
    return <Link href={`/learning/lesson/${lesson.id}`}>{card}</Link>;
  }

  return card;
}
