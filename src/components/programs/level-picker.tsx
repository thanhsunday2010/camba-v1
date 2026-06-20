"use client";

import { useTransition } from "react";
import { selectLevel } from "@/actions/programs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Check } from "lucide-react";
import { useRouter } from "@/i18n/routing";

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
}

export function LevelPicker({
  levels,
  currentLevelId,
  labels,
  redirectToLearning = false,
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

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
        <p className="text-sm text-gray-500">{labels.subtitle}</p>
      </div>
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
