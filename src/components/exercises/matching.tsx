"use client";

import { cn } from "@/lib/utils";

interface MatchingProps {
  pairs: { id: string; left_text: string }[];
  rightOptions: string[];
  matches: Record<string, string>;
  onMatch: (leftId: string, rightText: string) => void;
  disabled?: boolean;
  showResult?: boolean;
  correctPairs?: { leftId: string; rightText: string }[];
}

export function Matching({
  pairs,
  rightOptions,
  matches,
  onMatch,
  disabled,
  showResult,
  correctPairs,
}: MatchingProps) {
  return (
    <div className="space-y-4">
      {pairs.map((pair) => {
        const selected = matches[pair.id] ?? "";
        const expected = correctPairs?.find((p) => p.leftId === pair.id)?.rightText;
        const isCorrect = showResult && expected === selected;

        return (
          <div key={pair.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="sm:w-1/2 px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-900">
              {pair.left_text}
            </span>
            <select
              value={selected}
              disabled={disabled}
              onChange={(e) => onMatch(pair.id, e.target.value)}
              className={cn(
                "sm:w-1/2 h-10 rounded-lg border px-3 text-sm",
                showResult && isCorrect && "border-success bg-success/10",
                showResult && selected && !isCorrect && "border-error bg-error/10",
                !showResult && "border-gray-200"
              )}
            >
              <option value="">-- Chọn --</option>
              {rightOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}
