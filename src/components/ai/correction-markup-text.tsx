"use client";

import { parseCorrectionMarkup } from "@/lib/ai/correction-markup";
import { cn } from "@/lib/utils";

type CorrectionMarkupTextProps = {
  text: string;
  className?: string;
};

export function CorrectionMarkupText({ text, className }: CorrectionMarkupTextProps) {
  const segments = parseCorrectionMarkup(text);

  return (
    <span className={cn("whitespace-pre-wrap leading-relaxed", className)}>
      {segments.map((segment, index) => {
        if (segment.type === "text") {
          return <span key={index}>{segment.value}</span>;
        }

        return (
          <span key={index} className="inline">
            <span className="text-red-600 line-through decoration-red-600/80">{segment.error}</span>
            <span className="text-green-800 font-semibold">{segment.correction}</span>
          </span>
        );
      })}
    </span>
  );
}
