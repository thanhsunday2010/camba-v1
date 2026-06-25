"use client";

import { cn } from "@/lib/utils";
import type { PublicChoice } from "@/types/learning";
import type { QuestionResult } from "@/types/learning";

interface MultipleChoiceProps {
  choices: PublicChoice[];
  selectedId: string | null;
  onSelect: (choiceId: string) => void;
  disabled?: boolean;
  showResult?: boolean;
  questionResult?: QuestionResult;
}

export function MultipleChoice({
  choices,
  selectedId,
  onSelect,
  disabled,
  showResult,
  questionResult,
}: MultipleChoiceProps) {
  return (
    <div className="space-y-2">
      {choices.map((choice) => {
        const isSelected = selectedId === choice.id;
        const isCorrectChoice = questionResult?.correctChoiceId === choice.id;
        const showCorrect =
          showResult && (isCorrectChoice || (isSelected && questionResult?.isCorrect));
        const showWrong = showResult && isSelected && questionResult && !questionResult.isCorrect;

        return (
          <button
            key={choice.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(choice.id)}
            className={cn(
              "w-full text-left px-4 py-3.5 rounded-lg border transition-colors min-h-[var(--touch-target-min)] camba-focus-ring",
              isSelected && !showResult && "border-program bg-program/5",
              !isSelected && !showResult && "border-border hover:border-program/30 hover:bg-[var(--surface-sunken)]",
              showCorrect && "border-success bg-success/10",
              showWrong && "border-error bg-error/10",
              disabled && "cursor-not-allowed opacity-70"
            )}
          >
            <span className="camba-body text-foreground">{choice.text}</span>
          </button>
        );
      })}
    </div>
  );
}
