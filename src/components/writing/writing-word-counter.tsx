"use client";

import { cn } from "@/lib/utils";
import type { WritingWordRange } from "@/lib/writing/writing-types";

type WritingWordCounterProps = {
  wordCount: number;
  characterCount: number;
  constraints?: WritingWordRange;
  className?: string;
};

export function WritingWordCounter({
  wordCount,
  characterCount,
  constraints,
  className,
}: WritingWordCounterProps) {
  const minWords = constraints?.minWords;
  const maxWords = constraints?.maxWords;

  let statusClass = "text-muted";
  if (maxWords != null && wordCount > maxWords) {
    statusClass = "text-error";
  } else if (minWords != null && wordCount > 0 && wordCount < minWords) {
    statusClass = "text-warning";
  } else if (wordCount > 0) {
    statusClass = "text-foreground";
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 camba-caption", className)}>
      <span className={statusClass}>
        Words: {wordCount}
        {maxWords != null ? ` / ${maxWords}` : ""}
      </span>
      <span className="text-muted">Characters: {characterCount}</span>
    </div>
  );
}
