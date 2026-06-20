"use client";

import { useState, useTransition } from "react";
import type { PlacementTestData, UserAnswer } from "@/types/learning";
import { QuestionRenderer } from "@/components/exercises/exercise-player";
import { submitPlacementTest } from "@/actions/placement";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/routing";
import { ChevronLeft, ChevronRight, Shield, Trophy } from "lucide-react";

interface PlacementTestPlayerProps {
  test: PlacementTestData;
  levelNames: Record<string, string>;
  maxShields: number;
  labels: {
    complete: string;
    totalScore: string;
    cambridgeScore: string;
    suggestedLevel: string;
    suggestedLevelNote: string;
    skillBreakdown: string;
    shields: string;
    overallShields: string;
    goToSettings: string;
    backToList: string;
    previous: string;
    next: string;
    submit: string;
    submitting: string;
    questionOf: string;
  };
}

export function PlacementTestPlayer({
  test,
  levelNames,
  maxShields,
  labels,
}: PlacementTestPlayerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [startTime] = useState(Date.now());
  const [result, setResult] = useState<{
    accuracyPercent: number;
    cambridgeScaleScore: number;
    suggestedLevelId: string | null;
    skillBreakdown: Record<string, number>;
    shieldEstimate: Record<string, number>;
    overallShields: number;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const questions = test.questions;
  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  function handleSubmit() {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    startTransition(async () => {
      const response = await submitPlacementTest(test.id, answers, timeSpent);
      if (response.success && response.data) {
        setResult(response.data);
      }
    });
  }

  if (result) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <Trophy className="h-12 w-12 text-warning mx-auto mb-2" />
          <CardTitle>{labels.complete}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">{result.accuracyPercent}%</p>
              <p className="text-sm text-gray-500 mt-1">{labels.totalScore}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{result.cambridgeScaleScore}</p>
              <p className="text-sm text-gray-500 mt-1">{labels.cambridgeScore}</p>
            </div>
          </div>

          {result.suggestedLevelId && levelNames[result.suggestedLevelId] && (
            <div className="bg-primary/5 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">{labels.suggestedLevel}</p>
              <p className="text-xl font-bold text-primary">
                {levelNames[result.suggestedLevelId]}
              </p>
              <p className="text-xs text-gray-500 mt-2">{labels.suggestedLevelNote}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">{labels.skillBreakdown}</p>
            <div className="space-y-2">
              {Object.entries(result.skillBreakdown).map(([skill, percent]) => (
                <div key={skill} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{skill}</span>
                  <span className="font-medium">{percent}%</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" />
              {labels.shields}
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(result.shieldEstimate).map(([skill, shield]) => (
                <span
                  key={skill}
                  className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full capitalize"
                >
                  {skill}: {shield}/{maxShields}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {labels.overallShields}:{" "}
              <span className="font-semibold text-primary">
                {result.overallShields}/{maxShields}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button className="w-full" onClick={() => router.push("/settings")}>
              {labels.goToSettings}
            </Button>
            <Button className="w-full" variant="outline" onClick={() => router.push("/placement-test")}>
              {labels.backToList}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{test.title}</CardTitle>
        {test.description && (
          <p className="text-sm text-gray-500">{test.description}</p>
        )}
        <div className="flex gap-1 mt-3">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i <= currentIndex ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {labels.questionOf
            .replace("{current}", String(currentIndex + 1))
            .replace("{total}", String(questions.length))}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-base font-medium text-gray-900">
          {currentQuestion.question_text}
        </p>

        <QuestionRenderer
          question={currentQuestion}
          answer={answers[currentQuestion.id]}
          onAnswer={(answer) =>
            setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }))
          }
        />

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            {labels.previous}
          </Button>

          {isLast ? (
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? labels.submitting : labels.submit}
            </Button>
          ) : (
            <Button onClick={() => setCurrentIndex((i) => i + 1)}>
              {labels.next}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
