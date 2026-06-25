"use client";

import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import { ProgramBadge } from "@/components/camba/cambridge/program-badge";
import { PortfolioLink } from "@/components/profile/portfolio-link";
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
  viewPortfolio?: string;
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
  className,
}: DashboardHeroProps) {
  const programLine =
    levelName || programName
      ? labels.progressingThrough.replace(
          "{level}",
          levelName ?? programName ?? ""
        )
      : null;

  const greeting = labels.welcomeBack.replace("{name}", studentName);
  const streakLine = labels.currentStreak.replace("{count}", String(streak));

  return (
    <section
      aria-labelledby="dashboard-hero-heading"
      className={cn(
        "relative overflow-hidden rounded-3xl border border-program/20 bg-gradient-to-br from-program-muted/50 via-white to-white shadow-md camba-hero-pattern",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-15 blur-3xl camba-gradient-program"
        aria-hidden
      />

      <div className="relative p-5 sm:p-7 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <header className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <ProgramBadge programSlug={programSlug} />
              {cefrEstimate && (
                <span className="inline-flex rounded-full bg-white/80 px-2.5 py-0.5 camba-caption font-semibold text-program border border-program/15">
                  {labels.cefrEstimate}: {cefrEstimate}
                </span>
              )}
            </div>
            <div>
              <h1 id="dashboard-hero-heading" className="camba-display text-foreground mt-0.5">
                {greeting}
              </h1>
            </div>
            {programLine && (
              <p className="camba-body text-foreground/85 font-medium leading-relaxed max-w-xl">
                {programLine}
              </p>
            )}
            <p className="camba-caption text-muted flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-[var(--color-streak)]" aria-hidden />
              {streakLine}
            </p>
          </header>

          <div className="flex shrink-0 flex-col items-stretch gap-3 w-full sm:w-auto sm:items-end">
            {labels.viewPortfolio && (
              <PortfolioLink label={labels.viewPortfolio} className="self-start sm:self-end" />
            )}
            <div className="grid grid-cols-2 gap-3 w-full sm:flex sm:w-auto sm:gap-4">
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
          </div>
        </div>
      </div>
    </section>
  );
}
