"use client";

import { useTranslations } from "next-intl";
import { ListeningAudioPlayer } from "@/components/exercises/listening-audio-player";

type ReadingPassageContent = {
  title?: string;
  text?: string;
  wordCount?: number;
  imagePrompt?: string;
};

type ListeningScriptLine = {
  speaker?: string;
  text?: string;
};

type ListeningScriptContent = {
  title?: string;
  setting?: string;
  speakers?: Array<{ name?: string; role?: string }>;
  lines?: ListeningScriptLine[];
  audioNotes?: string;
};

interface ExerciseContextPanelProps {
  exerciseType?: string;
  content?: Record<string, unknown>;
  showListeningTranscript?: boolean;
  autoPlayListening?: boolean;
}

export function ExerciseContextPanel({
  exerciseType,
  content,
  showListeningTranscript = false,
  autoPlayListening = true,
}: ExerciseContextPanelProps) {
  const t = useTranslations("learning.lesson.contextPanel");

  if (!content) return null;

  const passage = content.passage as ReadingPassageContent | undefined;
  if (passage?.text) {
    return (
      <div className="rounded-xl border border-program/15 bg-program/5 p-4">
        <p className="camba-caption font-semibold uppercase tracking-wide text-program mb-2">
          {t("passage")}
        </p>
        {passage.title && (
          <h3 className="camba-body font-semibold text-foreground mb-2">{passage.title}</h3>
        )}
        <div className="camba-body text-foreground/90 whitespace-pre-line leading-relaxed">
          {passage.text}
        </div>
        {typeof passage.wordCount === "number" && passage.wordCount > 0 && (
          <p className="camba-caption text-muted mt-3">
            {passage.wordCount} {t("wordCount")}
          </p>
        )}
      </div>
    );
  }

  const script = content.script as ListeningScriptContent | undefined;
  const audioUrl = typeof content.audioUrl === "string" ? content.audioUrl : null;
  const isListening =
    exerciseType === "listening" || Boolean(script?.lines?.length && audioUrl);

  if (isListening && audioUrl) {
    return (
      <div className="space-y-4">
        <ListeningAudioPlayer
          audioUrl={audioUrl}
          title={script?.title}
          autoPlay={autoPlayListening}
        />
        {showListeningTranscript && script?.lines?.length ? (
          <div className="rounded-xl border border-border bg-[var(--surface-sunken)] p-4">
            <p className="camba-caption font-medium text-muted mb-2">{t("transcriptAfter")}</p>
            {script.setting && (
              <p className="camba-caption text-muted mb-2">{script.setting}</p>
            )}
            <div className="space-y-2">
              {script.lines.map((line, index) => (
                <p key={index} className="camba-body text-foreground/90 leading-relaxed">
                  {line.speaker && (
                    <span className="font-medium text-foreground">{line.speaker}: </span>
                  )}
                  {line.text}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <p className="camba-caption text-muted">{t("listeningHint")}</p>
        )}
      </div>
    );
  }

  if (script?.lines?.length && exerciseType === "listening") {
    return (
      <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
        <p className="camba-body text-foreground/90">{t("audioUnavailable")}</p>
      </div>
    );
  }

  return null;
}
