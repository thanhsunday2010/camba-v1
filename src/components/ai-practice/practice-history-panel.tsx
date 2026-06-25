"use client";

import { CambaCard } from "@/components/camba/primitives/camba-card";
import {
  getLanguageLabel,
  getLevelLabel,
} from "@/lib/ai-practice/practice-config";
import type { PracticeHistorySummary } from "@/lib/ai-practice/practice-history-types";
import type { PracticeSkill } from "@/lib/ai-practice/practice-types";
import { BarChart3, CalendarDays, Star, Target } from "lucide-react";

export interface PracticeHistoryLabels {
  title: string;
  subtitle: string;
  statTotal: string;
  statAverage: string;
  statBest: string;
  statThisWeek: string;
  totalSessionsCompact: string;
  averageScoreCompact: string;
  recentTitle: string;
  emptyTitle: string;
  emptyDescription: string;
  score: string;
  estimatedLevel: string;
  words: string;
  duration: string;
  programs: Record<string, string>;
  noScore: string;
}

interface PracticeHistoryPanelProps {
  skill: PracticeSkill;
  summary: PracticeHistorySummary;
  labels: PracticeHistoryLabels;
  compact?: boolean;
}

function scoreTone(score: number): string {
  if (score >= 75) return "text-success bg-success/10";
  if (score >= 50) return "text-warning bg-warning/10";
  return "text-error bg-error/10";
}

function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-[var(--surface-sunken)] p-3">
      <div className="flex items-center gap-2 text-muted mb-1">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function PracticeHistoryPanel({
  skill,
  summary,
  labels,
  compact = false,
}: PracticeHistoryPanelProps) {
  const locale =
    typeof document !== "undefined" && document.documentElement.lang
      ? document.documentElement.lang
      : "vi";

  const programLabel = (programId: string) =>
    labels.programs[programId] ?? programId;

  if (compact) {
    if (summary.totalSessions === 0) return null;

    return (
      <p className="text-xs text-muted mt-3">
        {labels.totalSessionsCompact.replace("{count}", String(summary.totalSessions))}
        {summary.averageScore != null &&
          ` · ${labels.averageScoreCompact.replace("{score}", String(summary.averageScore))}`}
      </p>
    );
  }

  return (
    <section className="space-y-4" aria-labelledby={`practice-history-${skill}`}>
      <div>
        <h2 id={`practice-history-${skill}`} className="camba-h3 text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-program" />
          {labels.title}
        </h2>
        <p className="camba-body text-muted mt-1">{labels.subtitle}</p>
      </div>

      {summary.totalSessions === 0 ? (
        <CambaCard variant="lesson" padding="md" className="text-center py-8">
          <p className="font-medium text-foreground">{labels.emptyTitle}</p>
          <p className="text-sm text-muted mt-2">{labels.emptyDescription}</p>
        </CambaCard>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile icon={Target} label={labels.statTotal} value={String(summary.totalSessions)} />
            <StatTile
              icon={BarChart3}
              label={labels.statAverage}
              value={
                summary.averageScore != null ? `${summary.averageScore}%` : labels.noScore
              }
            />
            <StatTile
              icon={Star}
              label={labels.statBest}
              value={summary.bestScore != null ? `${summary.bestScore}%` : labels.noScore}
            />
            <StatTile
              icon={CalendarDays}
              label={labels.statThisWeek}
              value={String(summary.sessionsThisWeek)}
            />
          </div>

          <CambaCard variant="lesson" padding="md" className="space-y-3">
            <h3 className="font-semibold text-foreground">{labels.recentTitle}</h3>
            <ul className="space-y-3">
              {summary.recentEntries.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-xl border border-border p-3 bg-white space-y-2"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground line-clamp-2">
                        {entry.promptPreview || "—"}
                      </p>
                      <p className="text-xs text-muted mt-1">
                        {formatDate(entry.createdAt, locale)}
                        {" · "}
                        {getLanguageLabel(entry.language)}
                        {" · "}
                        {getLevelLabel(entry.language, entry.level)}
                        {" · "}
                        {programLabel(entry.program)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${scoreTone(entry.overallScore)}`}
                    >
                      {labels.score.replace("{score}", String(entry.overallScore))}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted">
                    <span>
                      {labels.estimatedLevel}: {entry.estimatedLevel}
                    </span>
                    {entry.wordCount != null && (
                      <span>{labels.words.replace("{count}", String(entry.wordCount))}</span>
                    )}
                    {entry.durationSeconds != null && (
                      <span>
                        {labels.duration.replace("{seconds}", String(entry.durationSeconds))}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CambaCard>
        </>
      )}
    </section>
  );
}
