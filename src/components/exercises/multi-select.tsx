"use client";

import { cn } from "@/lib/utils";
import type { PublicChoice, QuestionResult } from "@/types/learning";
import { Check } from "lucide-react";

interface MultiSelectProps {
  choices: PublicChoice[];
  selectedIds: string[];
  onToggle: (choiceId: string) => void;
  disabled?: boolean;
  showResult?: boolean;
  questionResult?: QuestionResult;
}

export function MultiSelect({
  choices,
  selectedIds,
  onToggle,
  disabled,
  showResult,
  questionResult,
}: MultiSelectProps) {
  const correctIds = new Set(questionResult?.correctChoiceIds ?? []);

  return (
    <div className="space-y-2">
      <p className="camba-caption text-muted mb-2">Chọn tất cả đáp án đúng</p>
      {choices.map((choice) => {
        const isSelected = selectedIds.includes(choice.id);
        const isCorrectChoice = correctIds.has(choice.id);
        const showCorrect = showResult && isCorrectChoice;
        const showWrong = showResult && isSelected && !isCorrectChoice;

        return (
          <button
            key={choice.id}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(choice.id)}
            className={cn(
              "w-full text-left px-4 py-3.5 rounded-lg border transition-colors flex items-center gap-3 min-h-[var(--touch-target-min)] camba-focus-ring",
              isSelected && !showResult && "border-program bg-program/5",
              !isSelected && !showResult && "border-border hover:border-program/30 hover:bg-[var(--surface-sunken)]",
              showCorrect && "border-success bg-success/10",
              showWrong && "border-error bg-error/10",
              disabled && "cursor-not-allowed opacity-70"
            )}
          >
            <span
              className={cn(
                "h-5 w-5 rounded border flex items-center justify-center shrink-0",
                isSelected ? "bg-primary border-primary text-white" : "border-gray-300"
              )}
            >
              {isSelected && <Check className="h-3 w-3" />}
            </span>
            <span className="text-sm text-gray-900">{choice.text}</span>
          </button>
        );
      })}
    </div>
  );
}
