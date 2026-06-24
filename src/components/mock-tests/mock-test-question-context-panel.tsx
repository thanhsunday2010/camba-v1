"use client";

import type { MockTestContextPanelLabels } from "@/lib/mock-tests/mock-test-types";
import type { MockTestQuestionContextView } from "@/lib/mock-tests/mock-test-context";
import { ListeningAudioPlayer } from "@/components/exercises/listening-audio-player";
import { cn } from "@/lib/utils";

interface MockTestQuestionContextPanelProps {
  context: MockTestQuestionContextView;
  labels: MockTestContextPanelLabels;
  showTranscript?: boolean;
  className?: string;
}

function partBadgeLabel(
  context: MockTestQuestionContextView,
  labels: MockTestContextPanelLabels
): string | null {
  const number = context.partNumber != null ? ` ${context.partNumber}` : "";
  const title = context.partTitle?.trim();

  switch (context.contextType) {
    case "listening":
      return title ?? labels.listeningPart.replace("{part}", String(context.partNumber ?? ""));
    case "reading":
      return title ?? labels.readingPart.replace("{part}", String(context.partNumber ?? ""));
    case "dialogue":
      return title ?? labels.dialoguePart.replace("{part}", String(context.partNumber ?? ""));
    case "general":
      return title ?? labels.generalPart.replace("{part}", String(context.partNumber ?? ""));
    default:
      return title ?? (context.partNumber != null ? `Part${number}` : null);
  }
}

export function MockTestQuestionContextPanel({
  context,
  labels,
  showTranscript = false,
  className,
}: MockTestQuestionContextPanelProps) {
  if (!context.hasContextPanel) return null;

  const badge = partBadgeLabel(context, labels);
  const audioLabels = {
    play: labels.audioPlay,
    pause: labels.audioPause,
    replay: labels.audioReplay,
    loading: labels.audioLoading,
    error: labels.audioError,
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--status-mock-test)]/15 bg-[var(--surface-sunken)]/60 p-3 sm:p-4 space-y-3",
        className
      )}
    >
      {badge && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-[var(--status-mock-test)]/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--status-mock-test)]">
            {badge}
          </span>
          {!context.startsNewPartGroup && context.groupKey && (
            <span className="camba-caption text-muted text-[11px]">{labels.partContinues}</span>
          )}
        </div>
      )}

      {context.instructions && (
        <div>
          <p className="camba-caption font-semibold uppercase tracking-wide text-muted mb-1">
            {labels.instructions}
          </p>
          <p className="camba-body text-foreground/90 leading-relaxed">{context.instructions}</p>
        </div>
      )}

      {context.audio?.src && (
        <div className="space-y-2">
          <ListeningAudioPlayer
            audioUrl={context.audio.src}
            title={context.audio.caption ?? undefined}
            autoPlay={false}
            transcriptFallback={context.audio.transcript ?? null}
            labels={audioLabels}
          />
          {showTranscript && context.audio.transcript && (
            <div className="rounded-lg border border-border/60 bg-background/60 p-3">
              <p className="camba-caption font-medium text-muted mb-1">{labels.transcript}</p>
              <p className="camba-body text-foreground/90 whitespace-pre-line leading-relaxed">
                {context.audio.transcript}
              </p>
            </div>
          )}
          {!showTranscript && context.contextType === "listening" && !context.audio.transcript && (
            <p className="camba-caption text-muted">{labels.listeningHint}</p>
          )}
        </div>
      )}

      {context.passageText && (
        <div className="rounded-lg border border-border/50 bg-background/70 p-3 sm:p-4">
          <p className="camba-caption font-semibold uppercase tracking-wide text-muted mb-2">
            {labels.passage}
          </p>
          {context.passageTitle && (
            <h3 className="camba-body font-semibold text-foreground mb-2">{context.passageTitle}</h3>
          )}
          <div className="camba-body text-foreground/90 whitespace-pre-line leading-relaxed">
            {context.passageText}
          </div>
        </div>
      )}

      {context.note && (
        <p className="camba-caption text-muted border-t border-border/40 pt-2">{context.note}</p>
      )}
    </div>
  );
}
