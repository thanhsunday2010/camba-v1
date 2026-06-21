"use client";

import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { LessonStatusPill, MasteryBadge } from "@/components/camba/primitives/lesson-status-pill";
import type { ReviewReasonKey } from "@/lib/learning/path-ui-utils";
import type { LessonWithProgress } from "@/types/learning";
import { RefreshCw } from "lucide-react";

interface LearningReviewCardProps {
  lesson: LessonWithProgress;
  reason: string;
  skillName?: string;
  unitTitle?: string;
  masteryLabel: string;
  minutesLabel: string;
  stateLabel: string;
  ctaLabel: string;
  className?: string;
}

export function LearningReviewCard({
  lesson,
  reason,
  skillName,
  unitTitle,
  masteryLabel,
  minutesLabel,
  stateLabel,
  ctaLabel,
  className,
}: LearningReviewCardProps) {
  const mastery = lesson.progress?.mastery_level ?? 0;
  const meta = [skillName, unitTitle, `${lesson.estimated_minutes} ${minutesLabel}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link href={`/learning/lesson/${lesson.id}`}>
      <CambaCard
        variant="lesson"
        padding="md"
        interactive
        className={cn("border-orange-100/80 bg-orange-50/30", className)}
      >
        <div className="flex items-start gap-3">
          <div className="camba-icon-box-md shrink-0 bg-orange-100 text-[var(--status-needs-review)]">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="camba-h3 text-foreground truncate">{lesson.title}</p>
            {meta && <p className="camba-caption text-muted mt-0.5 truncate">{meta}</p>}
            <p className="camba-caption text-[var(--status-needs-review)] mt-1 leading-snug">
              {reason}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <LessonStatusPill state="needs-review" label={stateLabel} />
              {lesson.progress && (
                <MasteryBadge
                  level={mastery as 0 | 1 | 2 | 3 | 4}
                  label={masteryLabel}
                />
              )}
            </div>
          </div>
          <span className="shrink-0 self-center text-xs font-bold text-[var(--status-needs-review)]">
            {ctaLabel} →
          </span>
        </div>
      </CambaCard>
    </Link>
  );
}

export type { ReviewReasonKey };
