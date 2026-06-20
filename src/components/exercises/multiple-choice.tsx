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
              "w-full text-left px-4 py-3 rounded-lg border transition-colors",
              isSelected && !showResult && "border-primary bg-primary/5",
              !isSelected && !showResult && "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
              showCorrect && "border-success bg-success/10",
              showWrong && "border-error bg-error/10",
              disabled && "cursor-not-allowed opacity-70"
            )}
          >
            <span className="text-sm text-gray-900">{choice.text}</span>
          </button>
        );
      })}
    </div>
  );
}
