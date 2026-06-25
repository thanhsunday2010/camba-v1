import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import type { PracticeProfile, PracticeSkill } from "@/lib/ai-practice/practice-types";
import type {
  PracticeDashboardSummaries,
  PracticeHistoryEntry,
  PracticeHistorySummary,
} from "@/lib/ai-practice/practice-history-types";
import type { Json } from "@/types/database";

const DEFAULT_RECENT_LIMIT = 8;

function asRecord(value: Json): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function truncatePrompt(text: string, maxLength = 96): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1)}…`;
}

function parsePracticeProfile(value: unknown): PracticeProfile | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (
    typeof row.language !== "string" ||
    typeof row.level !== "string" ||
    typeof row.program !== "string" ||
    typeof row.skill !== "string"
  ) {
    return null;
  }
  return {
    language: row.language as PracticeProfile["language"],
    level: row.level,
    program: row.program as PracticeProfile["program"],
    skill: row.skill as PracticeProfile["skill"],
  };
}

function parsePracticeHistoryEntry(
  skill: PracticeSkill,
  row: {
    id: string;
    created_at: string;
    input_data: Json;
    response_data: Json;
  }
): PracticeHistoryEntry | null {
  const input = asRecord(row.input_data);
  const response = asRecord(row.response_data);
  if (!input?.standalone || !response || typeof response.overallScore !== "number") {
    return null;
  }

  const profile = parsePracticeProfile(input.profile);
  if (!profile || profile.skill !== skill) return null;

  const prompt = typeof input.prompt === "string" ? input.prompt : "";

  return {
    id: row.id,
    skill,
    overallScore: Math.round(response.overallScore),
    estimatedLevel:
      typeof response.estimatedLevel === "string" ? response.estimatedLevel : profile.level,
    language: profile.language,
    level: profile.level,
    program: profile.program,
    promptPreview: truncatePrompt(prompt),
    createdAt: row.created_at,
    wordCount: typeof input.wordCount === "number" ? input.wordCount : undefined,
    durationSeconds:
      typeof input.durationSeconds === "number" ? input.durationSeconds : undefined,
  };
}

function buildSummary(
  entries: PracticeHistoryEntry[],
  recentLimit: number
): PracticeHistorySummary {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const scores = entries.map((entry) => entry.overallScore);
  const sessionsThisWeek = entries.filter(
    (entry) => new Date(entry.createdAt) >= weekStart
  ).length;

  return {
    totalSessions: entries.length,
    averageScore:
      scores.length > 0
        ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
        : null,
    bestScore: scores.length > 0 ? Math.max(...scores) : null,
    sessionsThisWeek,
    recentEntries: entries.slice(0, recentLimit),
  };
}

async function fetchStandalonePracticeEntries(
  userId: string,
  skill: PracticeSkill
): Promise<PracticeHistoryEntry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_feedback")
    .select("id, created_at, input_data, response_data")
    .eq("user_id", userId)
    .eq("feedback_type", skill)
    .order("created_at", { ascending: false })
    .limit(100);

  return (data ?? [])
    .map((row) => parsePracticeHistoryEntry(skill, row))
    .filter((entry): entry is PracticeHistoryEntry => entry != null);
}

export async function getPracticeHistorySummary(
  skill: PracticeSkill,
  recentLimit = DEFAULT_RECENT_LIMIT
): Promise<PracticeHistorySummary> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      totalSessions: 0,
      averageScore: null,
      bestScore: null,
      sessionsThisWeek: 0,
      recentEntries: [],
    };
  }

  const entries = await fetchStandalonePracticeEntries(user.id, skill);
  return buildSummary(entries, recentLimit);
}

export async function getPracticeDashboardSummaries(): Promise<PracticeDashboardSummaries> {
  const user = await getCurrentUser();
  const empty: PracticeHistorySummary = {
    totalSessions: 0,
    averageScore: null,
    bestScore: null,
    sessionsThisWeek: 0,
    recentEntries: [],
  };

  if (!user) {
    return { writing: empty, speaking: empty };
  }

  const [writingEntries, speakingEntries] = await Promise.all([
    fetchStandalonePracticeEntries(user.id, "writing"),
    fetchStandalonePracticeEntries(user.id, "speaking"),
  ]);

  return {
    writing: buildSummary(writingEntries, 3),
    speaking: buildSummary(speakingEntries, 3),
  };
}
