import { createClient } from "@/lib/supabase/server";
import type { PracticeSkill } from "@/lib/ai-practice/practice-types";
import type {
  PracticeHeatmapDay,
  PracticeProgressViewModel,
  PracticeSkillAverages,
  PracticeSubmitMeta,
} from "@/lib/ai-practice/practice-enhancement-types";
import { extractRecurringErrors } from "@/lib/ai-practice/practice-recurring-errors";
import type { Json } from "@/types/database";
import { onStandalonePracticeCompleted } from "@/lib/ai-practice/practice-gamification";

function asRecord(value: Json): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
}

function buildHeatmap(dates: string[], days = 28): PracticeHeatmapDay[] {
  const counts = new Map<string, number>();
  for (const iso of dates) {
    const day = iso.slice(0, 10);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }

  const result: PracticeHeatmapDay[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, count: counts.get(key) ?? 0 });
  }
  return result;
}

function buildWeeklySummary(
  skill: PracticeSkill,
  sessionsThisWeek: number,
  avgScore: number | null,
  recurringErrors: string[]
): string {
  const skillLabel = skill === "writing" ? "Writing" : "Speaking";
  const scorePart =
    avgScore != null ? `Điểm trung bình tuần này: ${avgScore}%.` : "Chưa có điểm tuần này.";
  const errorPart =
    recurringErrors.length > 0
      ? ` Lỗi hay gặp: ${recurringErrors.slice(0, 2).join(", ")}.`
      : "";
  return `${skillLabel}: ${sessionsThisWeek} lượt luyện tuần này. ${scorePart}${errorPart}`;
}

export async function computePeerPercentile(
  skill: PracticeSkill,
  level: string,
  score: number
): Promise<number | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_feedback")
    .select("response_data, input_data")
    .eq("feedback_type", skill)
    .order("created_at", { ascending: false })
    .limit(500);

  const peerScores: number[] = [];
  for (const row of data ?? []) {
    const input = asRecord(row.input_data);
    const response = asRecord(row.response_data);
    if (!input?.standalone || typeof response?.overallScore !== "number") continue;
    const profile = input.profile as Record<string, unknown> | undefined;
    if (profile?.level !== level) continue;
    peerScores.push(response.overallScore);
  }

  if (peerScores.length < 5) return null;
  const below = peerScores.filter((s) => s < score).length;
  return Math.round((below / peerScores.length) * 100);
}

export async function buildPracticeSubmitMeta(
  userId: string,
  skill: PracticeSkill,
  level: string,
  score: number,
  previousBest: number | null,
  previousAttemptScore: number | null,
  durationSeconds: number
): Promise<PracticeSubmitMeta> {
  const [peerPercentile, gamification] = await Promise.all([
    computePeerPercentile(skill, level, score),
    onStandalonePracticeCompleted(userId, skill, score, durationSeconds),
  ]);

  const isNewPersonalBest = previousBest == null || score > previousBest;

  return {
    peerPercentile,
    scoreDelta:
      previousAttemptScore != null ? score - previousAttemptScore : null,
    isNewPersonalBest,
    previousBestScore: previousBest,
    xpAwarded: gamification.totalXpAwarded,
    streakUpdated: gamification.streakUpdated,
  };
}

export async function getPracticeProgressViewModel(
  userId: string,
  skill: PracticeSkill
): Promise<PracticeProgressViewModel> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_feedback")
    .select("created_at, response_data, input_data")
    .eq("user_id", userId)
    .eq("feedback_type", skill)
    .order("created_at", { ascending: false })
    .limit(60);

  const rows = (data ?? []).filter((row) => {
    const input = asRecord(row.input_data);
    return input?.standalone === true;
  });

  const scores: number[] = [];
  const highlightsList: string[][] = [];
  const dates: string[] = [];
  const pronunciation: number[] = [];
  const fluency: number[] = [];
  const grammar: number[] = [];
  const vocabulary: number[] = [];
  const coherence: number[] = [];

  for (const row of rows) {
    const response = asRecord(row.response_data);
    if (!response || typeof response.overallScore !== "number") continue;
    scores.push(response.overallScore);
    dates.push(row.created_at);
    if (Array.isArray(response.errorHighlights)) {
      highlightsList.push(response.errorHighlights as string[]);
    }
    if (skill === "speaking") {
      if (typeof response.pronunciationScore === "number") pronunciation.push(response.pronunciationScore);
      if (typeof response.fluencyScore === "number") fluency.push(response.fluencyScore);
      if (typeof response.grammarScore === "number") grammar.push(response.grammarScore);
      if (typeof response.vocabularyScore === "number") vocabulary.push(response.vocabularyScore);
    } else {
      if (typeof response.grammarScore === "number") grammar.push(response.grammarScore);
      if (typeof response.vocabularyScore === "number") vocabulary.push(response.vocabularyScore);
      if (typeof response.coherenceScore === "number") coherence.push(response.coherenceScore);
    }
  }

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);
  const weekScores = scores.filter((_, i) => new Date(dates[i] ?? 0) >= weekStart);
  const sessionsThisWeek = dates.filter((d) => new Date(d) >= weekStart).length;

  const skillAverages: PracticeSkillAverages = {
    overall: average(scores.slice(0, 10)),
    pronunciation: average(pronunciation.slice(0, 10)),
    fluency: average(fluency.slice(0, 10)),
    grammar: average(grammar.slice(0, 10)),
    vocabulary: average(vocabulary.slice(0, 10)),
    coherence: average(coherence.slice(0, 10)),
  };

  let scoreTrend: PracticeProgressViewModel["scoreTrend"] = "stable";
  if (scores.length >= 4) {
    const recent = average(scores.slice(0, 2)) ?? 0;
    const older = average(scores.slice(2, 4)) ?? 0;
    if (recent > older + 3) scoreTrend = "up";
    else if (recent < older - 3) scoreTrend = "down";
  }

  const recurringErrors = extractRecurringErrors(highlightsList.slice(0, 20));

  return {
    skill,
    skillAverages,
    personalBest: scores.length > 0 ? Math.max(...scores) : null,
    sessionsThisWeek,
    heatmap: buildHeatmap(dates),
    recurringErrors,
    weeklySummary: buildWeeklySummary(
      skill,
      sessionsThisWeek,
      average(weekScores),
      recurringErrors
    ),
    scoreTrend,
  };
}

export async function fetchRecurringErrorsForUser(
  userId: string,
  skill: PracticeSkill
): Promise<string[]> {
  const vm = await getPracticeProgressViewModel(userId, skill);
  return vm.recurringErrors;
}
