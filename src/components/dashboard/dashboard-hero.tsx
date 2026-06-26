"use client";

import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import { ProgramBadge } from "@/components/camba/cambridge/program-badge";
import { AnimatedCounter, AnimatedProgress } from "@/components/camba/motion";
import { Flame, Sparkles, Zap } from "lucide-react";

export interface DashboardHeroLabels {
  welcomeBack: string;
  progressingThrough: string;
  currentStreak: string;
  days: string;
  xp: string;
  level: string;
  cefrEstimate: string;
}

interface DashboardHeroProps {
  studentName: string;
  programName?: string;
  levelName?: string;
  programSlug?: string | null;
  totalXp: number;
  level: number;
  streak: number;
  cefrEstimate?: string | null;
  levelProgressPercent: number;
  labels: DashboardHeroLabels;
  /** When true, hides XP/level cards and extra copy (Profile tab owns full stats). */
  compact?: boolean;
  className?: string;
}

export function DashboardHero({
  studentName,
  programName,
  levelName,
  programSlug,
  totalXp,
  level,
  streak,
  cefrEstimate,
  levelProgressPercent,
  labels,
  compact = false,
  className,
}: DashboardHeroProps) {
  const programLine =
    !compact && (levelName || programName)
      ? labels.progressingThrough.replace("{level}", levelName ?? programName ?? "")
      : null;

  const greeting = labels.welcomeBack.replace("{name}", studentName);
  const streakLine = labels.currentStreak.replace("{count}", String(streak));

  return (
    <section
      aria-labelledby="dashboard-hero-heading"
      className={cn(
        "relative overflow-hidden rounded-2xl border border-program/20 bg-gradient-to-br from-program-muted/50 via-white to-white shadow-sm camba-hero-pattern",
        compact ? "sm:rounded-3xl" : "rounded-3xl shadow-md",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-15 blur-3xl camba-gradient-program"
        aria-hidden
      />

      <div className={cn("relative", compact ? "p-4 sm:p-5" : "p-5 sm:p-7 lg:p-8")}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <header className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <ProgramBadge programSlug={programSlug} />
              {cefrEstimate && (
                <span className="inline-flex rounded-full bg-white/80 px-2.5 py-0.5 camba-caption font-semibold text-program border border-program/15">
                  {labels.cefrEstimate}: {cefrEstimate}
                </span>
              )}
            </div>
            <h1
              id="dashboard-hero-heading"
              className={cn("text-foreground", compact ? "camba-h2" : "camba-display mt-0.5")}
            >
              {greeting}
            </h1>
            {compact && levelName && (
              <p className="camba-caption text-muted">
                {labels.progressingThrough.replace("{level}", levelName)}
              </p>
            )}
            {compact && (
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-0.5 camba-caption font-semibold text-muted border border-border/60">
                  <Flame className="h-3.5 w-3.5 text-[var(--color-streak)]" aria-hidden />
                  {streakLine}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-0.5 camba-caption font-semibold text-muted border border-border/60">
                  <Zap className="h-3.5 w-3.5 text-[var(--color-xp)]" aria-hidden />
                  {labels.xp}: {formatNumber(totalXp)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-0.5 camba-caption font-semibold text-muted border border-border/60">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--color-level-up)]" aria-hidden />
                  {labels.level} {level}
                </span>
              </div>
            )}
            {compact && (
              <AnimatedProgress
                className="max-w-xs"
                percent={levelProgressPercent}
                ariaLabel={`${labels.level} ${levelProgressPercent}%`}
              />
            )}
            {programLine && (
              <p className="camba-body text-foreground/85 font-medium leading-relaxed max-w-xl">
                {programLine}
              </p>
            )}
            {!compact && (
              <p className="camba-caption text-muted flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-[var(--color-streak)]" aria-hidden />
                {streakLine}
              </p>
            )}
          </header>

          {!compact && (
            <div className="grid grid-cols-2 gap-3 w-full sm:flex sm:w-auto sm:gap-4 shrink-0">
              <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm min-w-0">
                <p className="camba-caption text-muted flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-[var(--color-xp)]" aria-hidden />
                  {labels.xp}
                </p>
                <p className="camba-stat text-foreground mt-0.5">
                  <AnimatedCounter value={totalXp} format={formatNumber} />
                </p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm min-w-0">
                <p className="camba-caption text-muted flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--color-level-up)]" aria-hidden />
                  {labels.level}
                </p>
                <p className="camba-stat text-foreground mt-0.5">{level}</p>
                <AnimatedProgress
                  className="mt-2"
                  percent={levelProgressPercent}
                  ariaLabel={`${labels.level} ${levelProgressPercent}%`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
