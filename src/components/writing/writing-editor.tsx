"use client";

import { useEffect, useRef } from "react";
import { WritingWordCounter } from "@/components/writing/writing-word-counter";
import type { WritingConstraints } from "@/lib/writing/writing-types";
import { buildWritingResponse } from "@/lib/writing/writing-utils";
import { cn } from "@/lib/utils";

type WritingEditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  constraints?: WritingConstraints;
  placeholder?: string;
  className?: string;
};

export function WritingEditor({
  value,
  onChange,
  disabled,
  constraints,
  placeholder = "Write your answer here…",
  className,
}: WritingEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const response = buildWritingResponse(value);
  const maxChars =
    constraints?.maxCharacters ??
    (constraints?.maxWords != null ? constraints.maxWords * 8 : undefined);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(160, el.scrollHeight)}px`;
  }, [value]);

  return (
    <div className={cn("space-y-2", className)}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        rows={6}
        maxLength={maxChars}
        className={cn(
          "w-full min-h-[10rem] rounded-xl border border-border bg-white px-3 py-3",
          "camba-body camba-input-mobile text-foreground placeholder:text-muted/70",
          "focus:outline-none focus:ring-2 focus:ring-program/30 resize-y scroll-mb-24",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      />
      <WritingWordCounter
        wordCount={response.wordCount}
        characterCount={response.characterCount}
        constraints={constraints}
      />
    </div>
  );
}
