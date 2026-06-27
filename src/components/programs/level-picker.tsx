"use client";

import { useTransition } from "react";
import { selectLevel } from "@/actions/programs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Check } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface LevelOption {
  id: string;
  slug: string;
  name: string;
  description: string | null;
}

interface LevelPickerProps {
  levels: LevelOption[];
  currentLevelId?: string | null;
  labels: {
    title: string;
    subtitle: string;
    select: string;
    selecting: string;
    current: string;
    startLearning: string;
  };
  redirectToLearning?: boolean;
  /** Hide title block when wrapped in a parent card */
  showHeader?: boolean;
  /** Compact pill row instead of large cards */
  compact?: boolean;
}

export function LevelPicker({
  levels,
  currentLevelId,
  labels,
  redirectToLearning = false,
  showHeader = true,
  compact = false,
}: LevelPickerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSelect(levelId: string) {
    startTransition(async () => {
      const result = await selectLevel(levelId);
      if (result.success) {
        if (redirectToLearning) {
          router.push("/learning");
        } else {
          router.refresh();
        }
      }
    });
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {showHeader && (
          <div>
            <h2 className="text-base font-semibold text-gray-900">{labels.title}</h2>
            <p className="text-sm text-gray-500">{labels.subtitle}</p>
          </div>
        )}
        <div
          className="flex flex-wrap gap-2"
          role="listbox"
          aria-label={labels.title}
        >
          {levels.map((level) => {
            const isCurrent = level.id === currentLevelId;
            return (
              <button
                key={level.id}
                type="button"
                role="option"
                aria-selected={isCurrent}
                disabled={isPending || isCurrent}
                onClick={() => handleSelect(level.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold camba-focus-ring transition-all min-h-9",
                  isCurrent
                    ? "camba-gradient-program text-white shadow-sm ring-2 ring-program/20"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-program/30 hover:text-gray-900"
                )}
              >
                {isCurrent && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />}
                <span>{level.name}</span>
              </button>
            );
          })}
        </div>
        {isPending && (
          <p className="text-xs text-gray-500 animate-pulse">{labels.selecting}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showHeader && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
          <p className="text-sm text-gray-500">{labels.subtitle}</p>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {levels.map((level) => {
          const isCurrent = level.id === currentLevelId;
          return (
            <Card
              key={level.id}
              className={isCurrent ? "border-primary ring-1 ring-primary/20" : ""}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary shrink-0" />
                  {level.name}
                  {isCurrent && (
                    <span className="text-xs font-normal text-primary flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      {labels.current}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {level.description && (
                  <p className="text-sm text-gray-500">{level.description}</p>
                )}
                <Button
                  className="w-full"
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isPending || isCurrent}
                  onClick={() => handleSelect(level.id)}
                >
                  {isPending
                    ? labels.selecting
                    : isCurrent
                      ? labels.current
                      : currentLevelId
                        ? labels.select
                        : labels.startLearning}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
