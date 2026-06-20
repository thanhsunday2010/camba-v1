"use client";

import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface SentenceOrderingProps {
  items: { id: string; text: string }[];
  order: string[];
  onReorder: (newOrder: string[]) => void;
  disabled?: boolean;
  showResult?: boolean;
  correctOrder?: string[];
}

export function SentenceOrdering({
  items,
  order,
  onReorder,
  disabled,
  showResult,
  correctOrder,
}: SentenceOrderingProps) {
  const orderedItems = order
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean) as { id: string; text: string }[];

  function moveItem(fromIndex: number, direction: "up" | "down") {
    const newOrder = [...order];
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= newOrder.length) return;
    [newOrder[fromIndex], newOrder[toIndex]] = [newOrder[toIndex], newOrder[fromIndex]];
    onReorder(newOrder);
  }

  return (
    <div className="space-y-2">
      {orderedItems.map((item, index) => {
        const isCorrect = showResult && correctOrder?.[index] === item.id;

        return (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-lg border",
              showResult && isCorrect && "border-success bg-success/10",
              showResult && !isCorrect && "border-error bg-error/10",
              !showResult && "border-gray-200 bg-white"
            )}
          >
            {!disabled && !showResult && (
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, "down")}
                  disabled={index === orderedItems.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                >
                  ▼
                </button>
              </div>
            )}
            <GripVertical className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="text-sm text-gray-900 flex-1">{item.text}</span>
          </div>
        );
      })}
    </div>
  );
}
