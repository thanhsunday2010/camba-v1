"use client";

import { Link } from "@/i18n/routing";
import type { MockTestSummary } from "@/types/learning";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileQuestion, Trophy } from "lucide-react";

interface MockTestListProps {
  tests: MockTestSummary[];
  labels: {
    start: string;
    retake: string;
    questions: string;
    minutes: string;
    bestScore: string;
    attempts: string;
    noTests: string;
    noTestsDesc: string;
    level: string;
  };
}

export function MockTestList({ tests, labels }: MockTestListProps) {
  if (tests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-2">
          <FileQuestion className="h-10 w-10 text-gray-300 mx-auto" />
          <p className="font-medium text-gray-900">{labels.noTests}</p>
          <p className="text-sm text-gray-500">{labels.noTestsDesc}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tests.map((test) => (
        <Card key={test.id} className="hover:border-primary/40 transition-colors">
          <CardHeader>
            <CardTitle className="text-base">{test.title}</CardTitle>
            {test.description && (
              <p className="text-sm text-gray-500">{test.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              {test.levelName && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {labels.level}: {test.levelName}
                </span>
              )}
              <span className="flex items-center gap-1">
                <FileQuestion className="h-3.5 w-3.5" />
                {test.questionCount} {labels.questions}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {test.timeLimitMinutes} {labels.minutes}
              </span>
            </div>

            {test.bestScorePercent !== null && (
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-warning" />
                <span>
                  {labels.bestScore}: <strong>{test.bestScorePercent}%</strong>
                </span>
                <span className="text-gray-400">•</span>
                <span>{test.attemptCount} {labels.attempts}</span>
              </div>
            )}

            <Link href={`/mock-tests/${test.id}`}>
              <Button className="w-full">
                {test.attemptCount > 0 ? labels.retake : labels.start}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
