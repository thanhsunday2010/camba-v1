"use client";

import type { PracticeProgressViewModel } from "@/lib/ai-practice/practice-enhancement-types";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface PracticeProgressPanelProps {
  progress: PracticeProgressViewModel;
  labels: {
    title: string;
    overall: string;
    personalBest: string;
    thisWeek: string;
    heatmap: string;
    recurringErrors: string;
    weeklySummary: string;
    trendUp: string;
    trendDown: string;
    trendStable: string;
    pronunciation?: string;
    fluency?: string;
    grammar?: string;
    vocabulary?: string;
    coherence?: string;
  };
}

export function PracticeProgressPanel({ progress, labels }: PracticeProgressPanelProps) {
  const { skillAverages, heatmap, recurringErrors, scoreTrend } = progress;
  const maxHeat = Math.max(1, ...heatmap.map((d) => d.count));

  const trendIcon =
    scoreTrend === "up" ? (
      <TrendingUp className="h-4 w-4 text-success" />
    ) : scoreTrend === "down" ? (
      <TrendingDown className="h-4 w-4 text-error" />
    ) : (
      <Minus className="h-4 w-4 text-muted" />
    );

  const trendLabel =
    scoreTrend === "up"
      ? labels.trendUp
      : scoreTrend === "down"
        ? labels.trendDown
        : labels.trendStable;

  const radarItems =
    progress.skill === "speaking"
      ? [
          { label: labels.pronunciation ?? "Phát âm", value: skillAverages.pronunciation },
          { label: labels.fluency ?? "Trôi chảy", value: skillAverages.fluency },
          { label: labels.grammar ?? "Ngữ pháp", value: skillAverages.grammar },
          { label: labels.vocabulary ?? "Từ vựng", value: skillAverages.vocabulary },
        ]
      : [
          { label: labels.grammar ?? "Ngữ pháp", value: skillAverages.grammar },
          { label: labels.vocabulary ?? "Từ vựng", value: skillAverages.vocabulary },
          { label: labels.coherence ?? "Mạch lạc", value: skillAverages.coherence },
          { label: labels.overall, value: skillAverages.overall },
        ];

  return (
    <CambaCard variant="lesson" padding="md" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="camba-h3 text-foreground">{labels.title}</h3>
        <span className="inline-flex items-center gap-1.5 camba-caption text-muted">
          {trendIcon}
          {trendLabel}
        </span>
      </div>

      <p className="camba-caption text-muted">{progress.weeklySummary || labels.weeklySummary}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatChip label={labels.overall} value={skillAverages.overall} />
        <StatChip label={labels.personalBest} value={progress.personalBest} />
        <StatChip label={labels.thisWeek} value={progress.sessionsThisWeek} suffix="" />
      </div>

      <div className="space-y-2">
        <p className="camba-caption font-medium text-muted">{labels.title} — skills</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {radarItems.map((item) => (
            <SkillBar key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="camba-caption font-medium text-muted">{labels.heatmap}</p>
        <div className="flex flex-wrap gap-1">
          {heatmap.map((day) => (
            <div
              key={day.date}
              title={`${day.date}: ${day.count}`}
              className="h-3 w-3 rounded-sm"
              style={{
                backgroundColor:
                  day.count === 0
                    ? "var(--surface-sunken)"
                    : `color-mix(in srgb, var(--program) ${Math.round((day.count / maxHeat) * 100)}%, transparent)`,
              }}
            />
          ))}
        </div>
      </div>

      {recurringErrors.length > 0 && (
        <div className="rounded-lg bg-amber-50/80 border border-amber-200/60 p-3">
          <p className="camba-caption font-medium text-foreground mb-1">{labels.recurringErrors}</p>
          <ul className="space-y-0.5">
            {recurringErrors.map((error) => (
              <li key={error} className="camba-caption text-muted">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </CambaCard>
  );
}

function StatChip({
  label,
  value,
  suffix = "%",
}: {
  label: string;
  value: number | null;
  suffix?: string;
}) {
  return (
    <div className="rounded-lg bg-[var(--surface-sunken)] p-2.5 text-center">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-lg font-bold text-program">
        {value == null ? "—" : `${value}${suffix}`}
      </p>
    </div>
  );
}

function SkillBar({ label, value }: { label: string; value: number | null | undefined }) {
  const pct = value ?? 0;
  return (
    <div>
      <div className="flex justify-between camba-caption text-muted mb-1">
        <span>{label}</span>
        <span>{value == null ? "—" : `${value}%`}</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
        <div className="h-full bg-program rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
