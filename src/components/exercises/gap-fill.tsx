"use client";

import { Input } from "@/components/ui/input";

interface GapFillProps {
  template: string;
  answers: string[];
  onChange: (index: number, value: string) => void;
  disabled?: boolean;
  showResult?: boolean;
  correctAnswers?: string[];
}

export function GapFill({
  template,
  answers,
  onChange,
  disabled,
  showResult,
  correctAnswers,
}: GapFillProps) {
  const parts = template.split(/(\[\d+\])/);
  let gapIndex = 0;

  return (
    <div className="text-base leading-loose text-gray-900">
      {parts.map((part, i) => {
        const gapMatch = part.match(/\[(\d+)\]/);
        if (gapMatch) {
          const idx = gapIndex++;
          const isCorrect =
            showResult &&
            correctAnswers &&
            correctAnswers[idx]?.toLowerCase().trim() ===
              answers[idx]?.toLowerCase().trim();

          return (
            <Input
              key={i}
              value={answers[idx] ?? ""}
              onChange={(e) => onChange(idx, e.target.value)}
              disabled={disabled}
              className={`inline-block w-32 mx-1 h-8 text-center ${
                showResult
                  ? isCorrect
                    ? "border-success bg-success/10"
                    : "border-error bg-error/10"
                  : ""
              }`}
            />
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
}
