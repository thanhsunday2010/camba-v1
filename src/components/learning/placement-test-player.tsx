"use client";

import { useState, useTransition } from "react";
import type { PlacementTestData, UserAnswer } from "@/types/learning";
import { QuestionRenderer } from "@/components/exercises/exercise-player";
import { submitPlacementTest } from "@/actions/placement";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/routing";
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react";

interface PlacementTestPlayerProps {
  test: PlacementTestData;
  levelNames: Record<string, string>;
}

export function PlacementTestPlayer({ test, levelNames }: PlacementTestPlayerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [startTime] = useState(Date.now());
  const [result, setResult] = useState<{
    score: number;
    levelId: string | null;
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
        setResult({
          score: response.data.score,
          levelId: response.data.estimatedLevelId,
        });
      }
    });
  }

  if (result) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <Trophy className="h-12 w-12 text-warning mx-auto mb-2" />
          <CardTitle>Hoàn thành kiểm tra trình độ!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div>
            <p className="text-4xl font-bold text-primary">{result.score}%</p>
            <p className="text-sm text-gray-500 mt-1">Điểm tổng</p>
          </div>
          {result.levelId && levelNames[result.levelId] && (
            <div className="bg-primary/5 rounded-lg p-4">
              <p className="text-sm text-gray-600">Trình độ ước tính</p>
              <p className="text-xl font-bold text-primary">
                {levelNames[result.levelId]}
              </p>
            </div>
          )}
          <Button className="w-full" onClick={() => router.push("/learning")}>
            Xem lộ trình học
          </Button>
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
          Câu {currentIndex + 1}/{questions.length}
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
            Trước
          </Button>

          {isLast ? (
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Đang xử lý..." : "Hoàn thành"}
            </Button>
          ) : (
            <Button onClick={() => setCurrentIndex((i) => i + 1)}>
              Tiếp
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
