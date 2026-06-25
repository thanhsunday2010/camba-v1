import type { PracticeLanguage, PracticeProgram, PracticeSkill } from "@/lib/ai-practice/practice-types";

export interface PracticeHistoryEntry {
  id: string;
  skill: PracticeSkill;
  overallScore: number;
  estimatedLevel: string;
  language: PracticeLanguage;
  level: string;
  program: PracticeProgram;
  promptPreview: string;
  createdAt: string;
  wordCount?: number;
  durationSeconds?: number;
}

export interface PracticeHistorySummary {
  totalSessions: number;
  averageScore: number | null;
  bestScore: number | null;
  sessionsThisWeek: number;
  recentEntries: PracticeHistoryEntry[];
}

export interface PracticeDashboardSummaries {
  writing: PracticeHistorySummary;
  speaking: PracticeHistorySummary;
}
