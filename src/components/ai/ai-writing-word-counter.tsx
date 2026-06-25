"use client";

import { cn } from "@/lib/utils";
import { AI_WRITING_MAX_WORDS, countWords } from "@/lib/ai/ai-input-limits";

type AiWritingWordCounterProps = {
  text: string;
  maxWords?: number;
  minWords?: number;
  className?: string;
  label?: string;
};

export function AiWritingWordCounter({
  text,
  maxWords = AI_WRITING_MAX_WORDS,
  minWords,
  className,
  label = "Số từ",
}: AiWritingWordCounterProps) {
  const wordCount = countWords(text);
  const atLimit = wordCount >= maxWords;
  const belowMin = minWords != null && wordCount > 0 && wordCount < minWords;

  return (
    <p
      className={cn(
        "text-xs",
        atLimit ? "text-error font-semibold" : belowMin ? "text-amber-700" : "text-muted",
        className
      )}
      aria-live="polite"
    >
      {label}: {wordCount} / {maxWords}
      {minWords != null ? ` (tối thiểu ${minWords})` : ""}
    </p>
  );
}
