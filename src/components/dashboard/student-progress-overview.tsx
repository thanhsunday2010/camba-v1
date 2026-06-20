"use client";

import type { StudentProgressSummary } from "@/lib/queries/parent";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, Trophy } from "lucide-react";

interface StudentProgressOverviewProps {
  studentName: string;
  progress: StudentProgressSummary;
  levelName?: string;
  labels: {
    xp: string;
    level: string;
    streak: string;
    coins: string;
    currentLevel: string;
    days: string;
    notStarted: string;
    lessonsCompleted: string;
    lessonsInProgress: string;
    averageAccuracy: string;
    recentMockTests: string;
    noMockTests: string;
  };
}

export function StudentProgressOverview({
  studentName,
  progress,
  levelName,
  labels,
}: StudentProgressOverviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{studentName}</h1>
      </div>

      <StatsCards
        gamification={progress.gamification}
        streak={progress.streak?.current_streak ?? 0}
        levelName={levelName}
        labels={{
          xp: labels.xp,
          level: labels.level,
          streak: labels.streak,
          coins: labels.coins,
          currentLevel: labels.currentLevel,
          days: labels.days,
          notStarted: labels.notStarted,
        }}
      />

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {labels.lessonsCompleted}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{progress.lessonsCompleted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Target className="h-4 w-4" />
              {labels.lessonsInProgress}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{progress.lessonsInProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              {labels.averageAccuracy}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{progress.averageAccuracy}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{labels.recentMockTests}</CardTitle>
        </CardHeader>
        <CardContent>
          {progress.recentMockTests.length === 0 ? (
            <p className="text-sm text-gray-500">{labels.noMockTests}</p>
          ) : (
            <div className="space-y-2">
              {progress.recentMockTests.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-sm font-medium">{test.testTitle}</span>
                  <span className="text-sm text-primary font-semibold">
                    {test.scorePercent}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
