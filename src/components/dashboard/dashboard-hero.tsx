import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { DashboardStatsStrip } from "@/components/dashboard/dashboard-stats-strip";
import { ProgramProgressHeroCard } from "@/components/dashboard/program-progress-hero-card";
import { ProgramBadge } from "@/components/camba/cambridge/program-badge";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import type { NextLessonContext } from "@/lib/queries/dashboard";

export interface DashboardHeroLabels {
  greeting: string;
  continueLesson: string;
  startLearning: string;
  minutes: string;
  recommendedReason: string;
  shieldLabel: string;
  levelLabel: string;
  stats: {
    xp: string;
    level: string;
    coins: string;
    streak: string;
    xpToday: string;
    lessonsToday: string;
    days: string;
  };
}

interface DashboardHeroProps {
  studentName: string;
  encouragement: string;
  programName?: string;
  levelName?: string;
  programSlug?: string | null;
  totalXp: number;
  level: number;
  coins: number;
  streak: number;
  xpToday: number;
  lessonsToday: number;
  levelProgressPercent: number;
  shieldFilledSegments: number;
  nextLesson: NextLessonContext | null;
  skillLabel?: string;
  labels: DashboardHeroLabels;
  className?: string;
}

export function DashboardHero({
  studentName,
  encouragement,
  programName,
  levelName,
  programSlug,
  totalXp,
  level,
  coins,
  streak,
  xpToday,
  lessonsToday,
  levelProgressPercent,
  shieldFilledSegments,
  nextLesson,
  skillLabel,
  labels,
  className,
}: DashboardHeroProps) {
  const lessonHref = nextLesson ? `/learning/lesson/${nextLesson.id}` : "/learning";
  const ctaLabel = nextLesson ? labels.continueLesson : labels.startLearning;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border-2 border-program/25 shadow-lg camba-gradient-program-soft camba-hero-pattern camba-scale-in",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl camba-gradient-program"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/40 to-transparent"
        aria-hidden
      />

      <div className="relative p-4 sm:p-6 lg:p-8">
        {/* Mobile-first: CTA is visually first via order */}
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[1fr_260px] lg:items-start lg:gap-8">
          <div className="flex flex-col gap-5 min-w-0">
            <header className="space-y-3 order-2 lg:order-none">
              <div className="flex flex-wrap items-center gap-2">
                <ProgramBadge programSlug={programSlug} />
                {(programName || levelName) && (
                  <span className="camba-caption font-semibold text-program">
                    {programName}
                    {levelName ? ` · ${levelName}` : ""}
                  </span>
                )}
              </div>
              <div>
                <p className="camba-caption uppercase tracking-wider text-muted font-semibold">
                  {labels.greeting}
                </p>
                <h1 className="camba-display text-foreground mt-0.5">{studentName}</h1>
              </div>
              <p className="camba-body text-foreground/90 font-medium leading-relaxed max-w-xl rounded-xl bg-white/50 px-3 py-2.5 border border-white/60 backdrop-blur-sm">
                {encouragement}
              </p>
            </header>

            <Link
              href={lessonHref}
              className="order-1 lg:order-none block group camba-focus-ring rounded-2xl"
            >
              <article className="relative overflow-hidden rounded-2xl border-2 border-program/35 bg-white p-4 sm:p-5 shadow-xl transition-all duration-200 group-hover:shadow-2xl group-hover:-translate-y-1 group-active:scale-[0.99]">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.08] camba-gradient-program"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-20 camba-gradient-program blur-xl"
                  aria-hidden
                />
                <div className="relative flex flex-col gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl camba-gradient-program text-white shadow-lg ring-4 ring-program/15">
                      <BookOpen className="h-7 w-7" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="camba-caption uppercase tracking-wide text-program font-bold">
                        {ctaLabel}
                      </p>
                      {nextLesson ? (
                        <>
                          <h2 className="camba-h2 text-foreground mt-0.5 line-clamp-2">
                            {nextLesson.title}
                          </h2>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 camba-caption text-muted">
                            {nextLesson.unitTitle && <span>{nextLesson.unitTitle}</span>}
                            {skillLabel && <span>· {skillLabel}</span>}
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {nextLesson.estimated_minutes} {labels.minutes}
                            </span>
                          </div>
                        </>
                      ) : (
                        <p className="camba-body text-muted mt-1">{labels.startLearning}</p>
                      )}
                    </div>
                  </div>
                  {nextLesson && (
                    <p className="camba-caption text-program font-medium">
                      ✦ {labels.recommendedReason}
                    </p>
                  )}
                  <span className="flex w-full items-center justify-center gap-2 rounded-xl h-12 sm:h-13 text-base font-semibold camba-gradient-program text-white shadow-md group-hover:brightness-105 transition-all">
                    {ctaLabel}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </article>
            </Link>

            <DashboardStatsStrip
              totalXp={totalXp}
              level={level}
              coins={coins}
              streak={streak}
              xpToday={xpToday}
              lessonsToday={lessonsToday}
              levelProgressPercent={levelProgressPercent}
              labels={labels.stats}
              compact
              showLevelBar
              className="order-3 lg:order-none"
            />
          </div>

          <ProgramProgressHeroCard
            programSlug={programSlug}
            programName={programName}
            levelName={levelName}
            shieldFilledSegments={shieldFilledSegments}
            levelProgressPercent={levelProgressPercent}
            shieldLabel={labels.shieldLabel}
            levelLabel={labels.levelLabel}
            className="order-4 lg:order-none lg:sticky lg:top-20"
          />
        </div>
      </div>
    </section>
  );
}
