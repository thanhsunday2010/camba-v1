"use client";

import { useTransition } from "react";
import { selectProgram } from "@/actions/programs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Check } from "lucide-react";

interface ProgramOption {
  id: string;
  slug: string;
  name: string;
  description: string | null;
}

interface ProgramPickerProps {
  programs: ProgramOption[];
  currentProgramId?: string | null;
  labels: {
    title: string;
    subtitle: string;
    select: string;
    selecting: string;
    current: string;
  };
  onSelected?: () => void;
}

export function ProgramPicker({
  programs,
  currentProgramId,
  labels,
  onSelected,
}: ProgramPickerProps) {
  const [isPending, startTransition] = useTransition();

  function handleSelect(programId: string) {
    startTransition(async () => {
      await selectProgram(programId);
      onSelected?.();
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
        <p className="text-sm text-gray-500">{labels.subtitle}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {programs.map((program) => {
          const isCurrent = program.id === currentProgramId;
          return (
            <Card
              key={program.id}
              className={isCurrent ? "border-primary ring-1 ring-primary/20" : ""}
            >
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  {program.name}
                  {isCurrent && (
                    <span className="text-xs font-normal text-primary flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      {labels.current}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {program.description && (
                  <p className="text-sm text-gray-500">{program.description}</p>
                )}
                <Button
                  className="w-full"
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isPending || isCurrent}
                  onClick={() => handleSelect(program.id)}
                >
                  {isPending ? labels.selecting : isCurrent ? labels.current : labels.select}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
