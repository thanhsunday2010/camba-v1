"use client";

import type { ReactNode } from "react";
import type { PracticeSubmitMeta } from "@/lib/ai-practice/practice-enhancement-types";
import type { PracticeRetryContext } from "@/lib/ai-practice/practice-enhancement-types";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Button } from "@/components/ui/button";
import { ArrowUp, RotateCcw, Share2, Sparkles, Target, Trophy, Users } from "lucide-react";

interface PracticeEnhancementLabels {
  improvementTitle: string;
  scoreDelta: string;
  newPersonalBest: string;
  peerCompare: string;
  xpEarned: string;
  focusFixTitle: string;
  bestPhraseTitle: string;
  retrySamePrompt: string;
  retryHint: string;
  shareImprovement: string;
  shareCopied: string;
}

interface PracticeEnhancementCardsProps {
  meta: PracticeSubmitMeta;
  focusFix?: string;
  bestPhrase?: string;
  retryContext?: PracticeRetryContext | null;
  labels: PracticeEnhancementLabels;
  onRetry?: () => void;
}

export function PracticeEnhancementCards({
  meta,
  focusFix,
  bestPhrase,
  retryContext,
  labels,
  onRetry,
}: PracticeEnhancementCardsProps) {
  return (
    <div className="space-y-3">
      <CambaCard variant="elevated" padding="md" className="space-y-2 border-program/20">
        <p className="camba-caption font-semibold text-program uppercase tracking-wide flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          {labels.improvementTitle}
        </p>
        <div className="flex flex-wrap gap-2">
          {meta.scoreDelta != null && meta.scoreDelta !== 0 && (
            <Badge
              icon={<ArrowUp className={`h-3.5 w-3.5 ${meta.scoreDelta < 0 ? "rotate-180" : ""}`} />}
              text={labels.scoreDelta.replace("{delta}", String(meta.scoreDelta > 0 ? `+${meta.scoreDelta}` : meta.scoreDelta))}
              tone={meta.scoreDelta > 0 ? "success" : "warning"}
            />
          )}
          {meta.isNewPersonalBest && (
            <Badge icon={<Trophy className="h-3.5 w-3.5" />} text={labels.newPersonalBest} tone="program" />
          )}
          {meta.peerPercentile != null && (
            <Badge
              icon={<Users className="h-3.5 w-3.5" />}
              text={labels.peerCompare.replace("{percentile}", String(meta.peerPercentile))}
              tone="muted"
            />
          )}
          {meta.xpAwarded > 0 && (
            <Badge
              icon={<Sparkles className="h-3.5 w-3.5" />}
              text={labels.xpEarned.replace("{xp}", String(meta.xpAwarded))}
              tone="program"
            />
          )}
        </div>
      </CambaCard>

      {focusFix && (
        <CambaCard variant="lesson" padding="md" className="border-amber-200/60 bg-amber-50/40">
          <p className="camba-caption font-semibold text-foreground flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-amber-700" />
            {labels.focusFixTitle}
          </p>
          <p className="camba-body text-foreground/90">{focusFix}</p>
          {onRetry && (
            <p className="camba-caption text-muted mt-2">{labels.retryHint}</p>
          )}
        </CambaCard>
      )}

      {bestPhrase && (
        <CambaCard variant="lesson" padding="md" className="border-green-200/60 bg-green-50/30">
          <p className="camba-caption font-semibold text-foreground mb-1">{labels.bestPhraseTitle}</p>
          <p className="camba-body text-foreground/90 italic">&ldquo;{bestPhrase}&rdquo;</p>
        </CambaCard>
      )}

      {retryContext && retryContext.attemptNumber > 1 && (
        <CambaCard variant="lesson" padding="md" className="space-y-2">
          <p className="camba-caption font-medium text-muted">{labels.retrySamePrompt}</p>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-[var(--surface-sunken)] p-3">
              <p className="text-xs text-muted mb-1">
                Lần {retryContext.attemptNumber - 1} — {retryContext.previousScore}%
              </p>
              <p className="text-foreground/80 line-clamp-4">{retryContext.previousPreview}</p>
            </div>
            <div className="rounded-lg bg-program/5 border border-program/15 p-3">
              <p className="text-xs text-program mb-1">
                Lần {retryContext.attemptNumber} — {retryContext.currentScore}%
              </p>
              <p className="text-foreground/80 line-clamp-4">{retryContext.currentPreview}</p>
            </div>
          </div>
        </CambaCard>
      )}

      <div className="flex flex-wrap gap-2">
        {onRetry && (
          <Button type="button" variant="outline" onClick={onRetry} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {labels.retrySamePrompt}
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => {
            const text = [
              labels.improvementTitle,
              meta.isNewPersonalBest ? labels.newPersonalBest : "",
              meta.scoreDelta != null ? labels.scoreDelta.replace("{delta}", String(meta.scoreDelta)) : "",
            ]
              .filter(Boolean)
              .join(" · ");
            void navigator.clipboard?.writeText(text);
          }}
        >
          <Share2 className="h-4 w-4" />
          {labels.shareImprovement}
        </Button>
      </div>
    </div>
  );
}

function Badge({
  icon,
  text,
  tone,
}: {
  icon: ReactNode;
  text: string;
  tone: "success" | "warning" | "program" | "muted";
}) {
  const tones = {
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    program: "bg-program/10 text-program border-program/20",
    muted: "bg-[var(--surface-sunken)] text-muted border-border",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {icon}
      {text}
    </span>
  );
}

export function PracticeSentenceStarters({
  starters,
  label,
}: {
  starters: string[];
  label: string;
}) {
  if (starters.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-[var(--surface-sunken)] p-3 space-y-2">
      <p className="camba-caption font-medium text-muted">{label}</p>
      <ul className="space-y-1">
        {starters.map((starter) => (
          <li key={starter} className="camba-body text-foreground/90">
            • {starter}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PracticeSpeakingPhaseBar({
  phase,
  labels,
  onAdvance,
}: {
  phase: "listen" | "repeat" | "answer";
  labels: { listen: string; repeat: string; answer: string; nextPhase: string };
  onAdvance?: () => void;
}) {
  const steps = [
    { id: "listen" as const, label: labels.listen },
    { id: "repeat" as const, label: labels.repeat },
    { id: "answer" as const, label: labels.answer },
  ];
  const currentIndex = steps.findIndex((s) => s.id === phase);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex-1 rounded-lg px-2 py-2 text-center camba-caption font-medium ${
              index <= currentIndex
                ? "bg-program/15 text-program border border-program/25"
                : "bg-[var(--surface-sunken)] text-muted"
            }`}
          >
            {index + 1}. {step.label}
          </div>
        ))}
      </div>
      {phase !== "answer" && onAdvance && (
        <Button type="button" variant="outline" size="sm" onClick={onAdvance}>
          {labels.nextPhase}
        </Button>
      )}
    </div>
  );
}
