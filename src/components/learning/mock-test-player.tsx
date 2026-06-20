"use client";

import { useMemo, useState, useTransition } from "react";
import type { MockTestData, UserAnswer } from "@/types/learning";
import { QuestionRenderer } from "@/components/exercises/exercise-player";
import { submitMockTest } from "@/actions/mock-tests";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@/i18n/routing";
import { ChevronLeft, ChevronRight, Shield, Trophy } from "lucide-react";

interface MockTestPlayerProps {
  test: MockTestData;
  labels: {
    section: string;
    question: string;
    of: string;
    previous: string;
    next: string;
    submit: string;
    submitting: string;
    complete: string;
    totalScore: string;
    skillBreakdown: string;
    shields: string;
    backToList: string;
  };
}

export function MockTestPlayer({ test, labels }: MockTestPlayerProps) {
  const router = useRouter();
  const flatQuestions = useMemo(
    () => test.sections.flatMap((s) => s.questions),
    [test.sections]
  );

  const sectionForIndex = useMemo(() => {
    return flatQuestions.map((q) =>
      test.sections.find((s) => s.id === q.sectionId)
    );
  }, [flatQuestions, test.sections]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [startTime] = useState(Date.now());
  const [result, setResult] = useState<{
    accuracyPercent: number;
    skillBreakdown: Record<string, number>;
    shieldEstimate: Record<string, number>;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentQuestion = flatQuestions[currentIndex];
  const currentSection = sectionForIndex[currentIndex];
  const isLast = currentIndex === flatQuestions.length - 1;

  function handleSubmit() {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    startTransition(async () => {
      const response = await submitMockTest(test.id, answers, timeSpent);
      if (response.success && response.data) {
        setResult({
          accuracyPercent: response.data.accuracyPercent,
          skillBreakdown: response.data.skillBreakdown,
          shieldEstimate: response.data.shieldEstimate,
        });
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
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">{result.accuracyPercent}%</p>
            <p className="text-sm text-gray-500 mt-1">{labels.totalScore}</p>
          </div>

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
                  {skill}: {shield}/15
                </span>
              ))}
            </div>
          </div>

          <Button className="w-full" onClick={() => router.push("/mock-tests")}>
            {labels.backToList}
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

        <div className="flex gap-1 mt-3 flex-wrap">
          {test.sections.map((section) => {
            const sectionQuestionIds = new Set(section.questions.map((q) => q.id));
            const answeredInSection = flatQuestions.filter(
              (q, i) => sectionQuestionIds.has(q.id) && i <= currentIndex
            ).length;
            const isActive = currentSection?.id === section.id;

            return (
              <span
                key={section.id}
                className={`text-xs px-2 py-1 rounded-full ${
                  isActive
                    ? "bg-primary text-white"
                    : answeredInSection > 0
                      ? "bg-primary/20 text-primary"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {section.title}
              </span>
            );
          })}
        </div>

        <p className="text-xs text-gray-500 mt-2">
          {labels.section}: {currentSection?.title} • {labels.question}{" "}
          {currentIndex + 1} {labels.of} {flatQuestions.length}
        </p>

        <div className="flex gap-1 mt-2">
          {flatQuestions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i <= currentIndex ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
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
