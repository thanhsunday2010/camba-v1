import type { PracticeSkill } from "@/lib/ai-practice/practice-types";

export type PracticeMode = "standard" | "micro" | "roleplay";

export type WritingStep = "outline" | "draft";

export type SpeakingPhase = "listen" | "repeat" | "answer";

export interface PracticeAttemptRecord {
  attemptNumber: number;
  overallScore: number;
  preview: string;
  submittedAt: string;
  /** Speaking subscores when available */
  pronunciationScore?: number;
  fluencyScore?: number;
  grammarScore?: number;
  vocabularyScore?: number;
}

export interface PracticeSubmitMeta {
  peerPercentile: number | null;
  scoreDelta: number | null;
  isNewPersonalBest: boolean;
  previousBestScore: number | null;
  xpAwarded: number;
  streakUpdated: boolean;
}

export interface PracticeSkillAverages {
  overall: number | null;
  pronunciation?: number | null;
  fluency?: number | null;
  grammar?: number | null;
  vocabulary?: number | null;
  coherence?: number | null;
}

export interface PracticeHeatmapDay {
  date: string;
  count: number;
}

export interface PracticeProgressViewModel {
  skill: PracticeSkill;
  skillAverages: PracticeSkillAverages;
  personalBest: number | null;
  sessionsThisWeek: number;
  heatmap: PracticeHeatmapDay[];
  recurringErrors: string[];
  weeklySummary: string;
  scoreTrend: "up" | "down" | "stable";
}

export interface PracticeRetryContext {
  previousScore: number;
  previousPreview: string;
  currentScore: number;
  currentPreview: string;
  attemptNumber: number;
}
