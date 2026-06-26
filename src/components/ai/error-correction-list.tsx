"use client";

import { parseErrorCorrectionLine } from "@/lib/ai/correction-markup";
import { cn } from "@/lib/utils";

type ErrorCorrectionListProps = {
  items: string[];
  className?: string;
};

export function ErrorCorrectionList({ items, className }: ErrorCorrectionListProps) {
  if (items.length === 0) return null;

  return (
    <ul className={cn("space-y-1.5", className)}>
      {items.map((item, index) => {
        const pair = parseErrorCorrectionLine(item);

        if (!pair) {
          return (
            <li key={index} className="text-sm text-foreground/90">
              • {item}
            </li>
          );
        }

        return (
          <li key={index} className="text-sm flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span className="text-red-600 line-through decoration-red-600/80">{pair.error}</span>
            <span className="text-muted" aria-hidden>
              →
            </span>
            <span className="text-green-800 font-semibold">{pair.correction}</span>
          </li>
        );
      })}
    </ul>
  );
}
