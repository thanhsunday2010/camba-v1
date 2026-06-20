"use client";

import { useState, useTransition } from "react";
import { getStudyCoachPlan } from "@/actions/ai/study-coach";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2, Sparkles } from "lucide-react";
import type { StudyCoachResponse } from "@/types/ai";

interface StudyCoachCardProps {
  initialPlan: StudyCoachResponse | null;
  labels: {
    title: string;
    subtitle: string;
    generate: string;
    generating: string;
    dailyRecommendations: string;
    motivation: string;
    strengths: string;
    weaknesses: string;
    weeklyPlan: string;
  };
}

export function StudyCoachCard({ initialPlan, labels }: StudyCoachCardProps) {
  const [plan, setPlan] = useState<StudyCoachResponse | null>(initialPlan);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      const result = await getStudyCoachPlan();
      if (result.success && result.data) {
        setPlan(result.data);
      } else {
        setError(result.error ?? "Error");
      }
    });
  }

  return (
    <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="h-5 w-5 text-accent" />
          {labels.title}
        </CardTitle>
        <p className="text-sm text-gray-500">{labels.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!plan ? (
          <Button onClick={handleGenerate} disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                {labels.generating}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {labels.generate}
              </>
            )}
          </Button>
        ) : (
          <>
            <p className="text-sm text-gray-700 bg-white/60 rounded-lg p-3 italic">
              &ldquo;{plan.motivationMessage}&rdquo;
            </p>

            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">{labels.dailyRecommendations}</p>
              <ul className="space-y-1">
                {plan.dailyRecommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-accent">→</span> {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">{labels.strengths}</p>
                {plan.strengths.map((s, i) => (
                  <p key={i} className="text-xs text-success">+ {s}</p>
                ))}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">{labels.weaknesses}</p>
                {plan.weaknesses.map((w, i) => (
                  <p key={i} className="text-xs text-error">− {w}</p>
                ))}
              </div>
            </div>

            <Button onClick={handleGenerate} variant="outline" size="sm" disabled={isPending}>
              {isPending ? labels.generating : labels.generate}
            </Button>
          </>
        )}

        {error && (
          <p className="text-sm text-error">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}
