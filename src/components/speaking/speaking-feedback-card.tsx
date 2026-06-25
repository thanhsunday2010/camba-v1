"use client";

import type { SpeakingBandScore } from "@/lib/cambridge-assessment/cambridge-speaking-ai-contracts";
import type { SpeakingQuestionEvaluationSummary } from "@/lib/speaking/speaking-evaluation-types";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { AnimatedSection, AnimatedCounter } from "@/components/camba/motion";
import { SpeakingDimensionBreakdown } from "@/components/speaking/speaking-dimension-breakdown";
import { SpeakingTranscriptCard } from "@/components/speaking/speaking-transcript-card";
import { AlertCircle, Star } from "lucide-react";

type SpeakingFeedbackCardProps = {
  evaluation: SpeakingQuestionEvaluationSummary;
  className?: string;
};

function formatBandScore(band: SpeakingBandScore): string {
  if (band.model === "yle_shields") {
    return `${band.shields}/${band.maxShields} shields`;
  }
  if (band.model === "cambridge_scale") {
    return band.cefrBand
      ? `Scale ${band.scaleScore} (${band.cefrBand.toUpperCase()})`
      : `Scale ${band.scaleScore}`;
  }
  return `${band.percent}%`;
}

export function SpeakingFeedbackCard({ evaluation, className }: SpeakingFeedbackCardProps) {
  if (evaluation.status === "failed") {
    return (
      <CambaCard variant="default" padding="md" className={className}>
        <div className="flex items-start gap-2 text-warning">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="camba-body">AI evaluation could not be completed. Your recording was saved.</p>
        </div>
      </CambaCard>
    );
  }

  return (
    <AnimatedSection>
    <CambaCard variant="default" padding="md" className={`space-y-4 ${className ?? ""}`}>
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 text-program" />
        <p className="camba-h4 text-foreground">Speaking evaluation</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="rounded-xl bg-program/5 px-4 py-2">
          <p className="camba-caption text-muted">Overall score</p>
          <p className="camba-h3 text-program">
            <AnimatedCounter value={evaluation.overallScore} format={(v) => `${Math.round(v)}/100`} />
          </p>
        </div>
        <div className="rounded-xl bg-[var(--surface-sunken)]/60 px-4 py-2">
          <p className="camba-caption text-muted">Band</p>
          <p className="camba-body font-medium text-foreground">
            {formatBandScore(evaluation.bandScore)}
          </p>
        </div>
      </div>

      {evaluation.transcript && (
        <SpeakingTranscriptCard transcript={evaluation.transcript} />
      )}

      <SpeakingDimensionBreakdown dimensions={evaluation.dimensions} />

      {evaluation.strengths.length > 0 && (
        <div className="space-y-1">
          <p className="camba-caption font-medium text-muted">Strengths</p>
          <ul className="list-disc list-inside space-y-0.5 camba-body text-foreground/90">
            {evaluation.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {evaluation.weaknesses.length > 0 && (
        <div className="space-y-1">
          <p className="camba-caption font-medium text-muted">Areas to improve</p>
          <ul className="list-disc list-inside space-y-0.5 camba-body text-foreground/90">
            {evaluation.weaknesses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-1">
        <p className="camba-caption font-medium text-muted">Feedback</p>
        <p className="camba-body text-foreground/90">{evaluation.feedback}</p>
      </div>
    </CambaCard>
    </AnimatedSection>
  );
}
