"use client";

import { Link } from "@/i18n/routing";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Button } from "@/components/ui/button";
import { PracticeHistoryPanel, type PracticeHistoryLabels } from "@/components/ai-practice/practice-history-panel";
import type { PracticeHistorySummary } from "@/lib/ai-practice/practice-history-types";
import { DashboardSlideItem, DashboardSlideStrip } from "@/components/dashboard/dashboard-slide-strip";
import { Mic, PenLine, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type DashboardAiPracticeLabels = {
  title: string;
  subtitle: string;
  writingTitle: string;
  writingDesc: string;
  speakingTitle: string;
  speakingDesc: string;
  start: string;
  aiBadge: string;
};

interface DashboardAiPracticeSectionProps {
  labels: DashboardAiPracticeLabels;
  writingSummary: PracticeHistorySummary;
  speakingSummary: PracticeHistorySummary;
  historyLabels: PracticeHistoryLabels;
  variant?: "default" | "strip";
}

function PracticeTile({
  href,
  skill,
  icon: Icon,
  title,
  description,
  startLabel,
  summary,
  historyLabels,
  compact,
}: {
  href: string;
  skill: "writing" | "speaking";
  icon: typeof PenLine;
  title: string;
  description?: string;
  startLabel: string;
  summary: PracticeHistorySummary;
  historyLabels: PracticeHistoryLabels;
  compact?: boolean;
}) {
  return (
    <CambaCard
      variant="lesson"
      padding={compact ? "sm" : "md"}
      className={cn("h-full flex flex-col", compact && "min-h-[8.5rem]")}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="rounded-xl bg-program/10 p-2 shrink-0">
          <Icon className="h-5 w-5 text-program" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground leading-snug">{title}</h3>
          {!compact && description ? (
            <p className="text-sm text-muted mt-1 line-clamp-2">{description}</p>
          ) : null}
        </div>
      </div>
      <Link href={href} className="mt-3 block">
        <Button size={compact ? "sm" : "default"} className="w-full">
          {startLabel}
        </Button>
      </Link>
      {!compact ? (
        <PracticeHistoryPanel skill={skill} summary={summary} labels={historyLabels} compact />
      ) : summary.totalSessions > 0 ? (
        <p className="camba-caption text-muted mt-2">
          {historyLabels.totalSessionsCompact.replace("{count}", String(summary.totalSessions))}
          {summary.averageScore != null
            ? ` · ${historyLabels.averageScoreCompact.replace("{score}", String(Math.round(summary.averageScore)))}`
            : ""}
        </p>
      ) : null}
    </CambaCard>
  );
}

export function DashboardAiPracticeSection({
  labels,
  writingSummary,
  speakingSummary,
  historyLabels,
  variant = "default",
}: DashboardAiPracticeSectionProps) {
  const compact = variant === "strip";

  const writingTile = (
    <PracticeTile
      href="/practice/writing"
      skill="writing"
      icon={PenLine}
      title={labels.writingTitle}
      description={labels.writingDesc}
      startLabel={labels.start}
      summary={writingSummary}
      historyLabels={historyLabels}
      compact={compact}
    />
  );

  const speakingTile = (
    <PracticeTile
      href="/practice/speaking"
      skill="speaking"
      icon={Mic}
      title={labels.speakingTitle}
      description={labels.speakingDesc}
      startLabel={labels.start}
      summary={speakingSummary}
      historyLabels={historyLabels}
      compact={compact}
    />
  );

  return (
    <section className="space-y-3" aria-labelledby="ai-practice-heading">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-program shrink-0" aria-hidden />
        <h2 id="ai-practice-heading" className="camba-h3 text-foreground">
          {labels.title}
        </h2>
        <span className="text-[10px] font-bold uppercase tracking-wide bg-program/10 text-program px-2 py-0.5 rounded-full">
          {labels.aiBadge}
        </span>
      </div>

      {variant === "strip" ? (
        <DashboardSlideStrip label={labels.title}>
          <DashboardSlideItem className="w-[min(100%,16.5rem)]">{writingTile}</DashboardSlideItem>
          <DashboardSlideItem className="w-[min(100%,16.5rem)]">{speakingTile}</DashboardSlideItem>
        </DashboardSlideStrip>
      ) : (
        <>
          <p className="camba-body text-muted">{labels.subtitle}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {writingTile}
            {speakingTile}
          </div>
        </>
      )}
    </section>
  );
}
