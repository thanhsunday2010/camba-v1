"use client";

import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/camba/progress-ring";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import type { LessonChromeLabels } from "@/lib/learning/lesson-page-types";

interface LessonActiveExerciseHeaderProps {
  lessonTitle: string;
  exerciseTitle: string;
  position: number;
  total: number;
  completionPercent: number;
  labels: LessonChromeLabels;
  onBackToList: () => void;
  className?: string;
}

export function LessonActiveExerciseHeader({
  lessonTitle,
  exerciseTitle,
  position,
  total,
  completionPercent,
  labels,
  onBackToList,
  className,
}: LessonActiveExerciseHeaderProps) {
  const positionLabel = labels.exercisePosition(position, total);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white/90 px-4 py-3 sm:px-5 space-y-3",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 -ml-2 text-program font-semibold"
          onClick={onBackToList}
        >
          <ArrowLeft className="h-4 w-4" />
          {labels.backToList}
        </Button>
        <div className="flex items-center gap-2">
          <ProgressRing value={completionPercent} size={40} strokeWidth={4} />
          <span className="camba-caption text-muted hidden sm:inline">
            {labels.lessonProgressShort(completionPercent)}
          </span>
        </div>
      </div>
      <div className="min-w-0">
        <p className="camba-caption text-muted truncate">{lessonTitle}</p>
        <p className="camba-h3 text-foreground truncate">{exerciseTitle}</p>
        <p className="camba-caption text-program font-semibold mt-0.5">{positionLabel}</p>
      </div>
    </div>
  );
}
