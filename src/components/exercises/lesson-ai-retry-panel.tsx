"use client";

import type { LessonRetryContext } from "@/lib/learning/lesson-ai-retry";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Button } from "@/components/ui/button";
import { ArrowUp, RotateCcw, Target } from "lucide-react";

export interface LessonAiRetryLabels {
  retrySamePrompt: string;
  retryHint: string;
  scoreDelta: string;
  focusFixTitle: string;
  attemptPrevious: string;
  attemptCurrent: string;
}

interface LessonAiRetryPanelProps {
  scoreDelta: number | null;
  retryContext: LessonRetryContext | null;
  focusFix?: string;
  labels: LessonAiRetryLabels;
  onRetry: () => void;
}

export function LessonAiRetryPanel({
  scoreDelta,
  retryContext,
  focusFix,
  labels,
  onRetry,
}: LessonAiRetryPanelProps) {
  const deltaText =
    scoreDelta != null && scoreDelta !== 0
      ? labels.scoreDelta.replace(
          "{delta}",
          scoreDelta > 0 ? `+${scoreDelta}` : String(scoreDelta)
        )
      : null;

  return (
    <div className="space-y-3">
      {deltaText && (
        <CambaCard variant="elevated" padding="md" className="border-program/20">
          <p
            className={`camba-body font-medium flex items-center gap-2 ${
              (scoreDelta ?? 0) > 0 ? "text-success" : "text-warning"
            }`}
          >
            <ArrowUp className={`h-4 w-4 ${(scoreDelta ?? 0) < 0 ? "rotate-180" : ""}`} />
            {deltaText}
          </p>
        </CambaCard>
      )}

      {focusFix && (
        <CambaCard variant="lesson" padding="md" className="border-amber-200/60 bg-amber-50/40">
          <p className="camba-caption font-semibold text-foreground flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-amber-700" />
            {labels.focusFixTitle}
          </p>
          <p className="camba-body text-foreground/90">{focusFix}</p>
          <p className="camba-caption text-muted mt-2">{labels.retryHint}</p>
        </CambaCard>
      )}

      {retryContext && retryContext.attemptNumber > 1 && (
        <CambaCard variant="lesson" padding="md" className="space-y-2">
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-[var(--surface-sunken)] p-3">
              <p className="text-xs text-muted mb-1">
                {labels.attemptPrevious.replace("{n}", String(retryContext.attemptNumber - 1))} —{" "}
                {retryContext.previousScore}%
              </p>
              <p className="text-foreground/80 line-clamp-4">{retryContext.previousPreview}</p>
            </div>
            <div className="rounded-lg bg-program/5 border border-program/15 p-3">
              <p className="text-xs text-program mb-1">
                {labels.attemptCurrent.replace("{n}", String(retryContext.attemptNumber))} —{" "}
                {retryContext.currentScore}%
              </p>
              <p className="text-foreground/80 line-clamp-4">{retryContext.currentPreview}</p>
            </div>
          </div>
        </CambaCard>
      )}

      <Button type="button" variant="outline" onClick={onRetry} className="gap-2">
        <RotateCcw className="h-4 w-4" />
        {labels.retrySamePrompt}
      </Button>
    </div>
  );
}
