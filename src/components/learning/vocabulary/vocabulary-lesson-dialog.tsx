"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { VocabularyWord } from "@/lib/learning/vocabulary-bank";
import {
  useVocabularyPronunciation,
  type VocabularyPronunciationLocale,
} from "@/lib/speech/use-vocabulary-pronunciation";
import { cn } from "@/lib/utils";
import { Loader2, Volume2 } from "lucide-react";

export type VocabularyLessonDialogLabels = {
  title: string;
  description: string;
  colIndex: string;
  colWord: string;
  colExample: string;
  colIpa: string;
  colPronunciation: string;
  pronounceUs: string;
  pronounceUk: string;
  exampleMissing: string;
  unsupportedSpeech: string;
};

interface VocabularyLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  words: VocabularyWord[];
  lessonTitle: string;
  labels: VocabularyLessonDialogLabels;
}

function PronounceButton({
  locale,
  text,
  label,
  speakingKey,
  onSpeak,
  disabled,
}: {
  locale: VocabularyPronunciationLocale;
  text: string;
  label: string;
  speakingKey: string | null;
  onSpeak: (text: string, locale: VocabularyPronunciationLocale) => void;
  disabled?: boolean;
}) {
  const key = `${locale}:${text.trim()}`;
  const isActive = speakingKey === key;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "h-9 w-9 shrink-0 camba-focus-ring",
        isActive && "text-program bg-program/10"
      )}
      aria-label={label}
      title={label}
      disabled={disabled || !text.trim()}
      onClick={() => onSpeak(text, locale)}
    >
      {isActive ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <Volume2 className="h-4 w-4" aria-hidden />
      )}
    </Button>
  );
}

export function VocabularyLessonDialog({
  open,
  onOpenChange,
  words,
  lessonTitle,
  labels,
}: VocabularyLessonDialogProps) {
  const { speak, speakingKey, isSupported } = useVocabularyPronunciation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(96vw,56rem)] max-h-[min(88vh,720px)] overflow-hidden flex flex-col gap-4 p-4 sm:p-6">
        <DialogHeader className="space-y-1 pr-8">
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>
            {labels.description.replace("{lesson}", lessonTitle)}
          </DialogDescription>
        </DialogHeader>

        {!isSupported && (
          <p className="camba-caption text-warning rounded-lg border border-warning/20 bg-warning/5 px-3 py-2">
            {labels.unsupportedSpeech}
          </p>
        )}

        <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-border/70">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-[var(--surface-sunken)]/95 backdrop-blur-sm">
              <tr className="border-b border-border/70">
                <th className="px-3 py-2.5 camba-caption font-semibold text-muted w-12">
                  {labels.colIndex}
                </th>
                <th className="px-3 py-2.5 camba-caption font-semibold text-muted min-w-[140px]">
                  {labels.colWord}
                </th>
                <th className="px-3 py-2.5 camba-caption font-semibold text-muted min-w-[220px]">
                  {labels.colExample}
                </th>
                <th className="px-3 py-2.5 camba-caption font-semibold text-muted w-28">
                  {labels.colIpa}
                </th>
                <th className="px-3 py-2.5 camba-caption font-semibold text-muted w-28 text-center">
                  {labels.colPronunciation}
                </th>
              </tr>
            </thead>
            <tbody>
              {words.map((entry, index) => (
                <tr
                  key={`${entry.word}-${index}`}
                  className="border-b border-border/50 align-top hover:bg-[var(--surface-sunken)]/40"
                >
                  <td className="px-3 py-3 camba-caption text-muted tabular-nums">{index + 1}</td>
                  <td className="px-3 py-3">
                    <p className="camba-body font-semibold text-foreground">{entry.word}</p>
                    {entry.partOfSpeech && (
                      <p className="camba-caption text-muted italic">{entry.partOfSpeech}</p>
                    )}
                    <p className="camba-body text-foreground/85 mt-1">{entry.vietnameseMeaning}</p>
                  </td>
                  <td className="px-3 py-3">
                    {entry.exampleSentence ? (
                      <>
                        <p className="camba-body text-foreground/90">{entry.exampleSentence}</p>
                        <p className="camba-caption text-muted mt-1">
                          {entry.exampleTranslation || labels.exampleMissing}
                        </p>
                      </>
                    ) : (
                      <span className="camba-caption text-muted">{labels.exampleMissing}</span>
                    )}
                  </td>
                  <td className="px-3 py-3 camba-caption text-foreground/80 font-mono text-sm">
                    {entry.ipa || "—"}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex flex-col items-center gap-0.5">
                        <PronounceButton
                          locale="en-US"
                          text={entry.word}
                          label={labels.pronounceUs.replace("{word}", entry.word)}
                          speakingKey={speakingKey}
                          onSpeak={speak}
                          disabled={!isSupported}
                        />
                        <span className="text-[10px] font-semibold text-muted uppercase">US</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <PronounceButton
                          locale="en-GB"
                          text={entry.word}
                          label={labels.pronounceUk.replace("{word}", entry.word)}
                          speakingKey={speakingKey}
                          onSpeak={speak}
                          disabled={!isSupported}
                        />
                        <span className="text-[10px] font-semibold text-muted uppercase">UK</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
