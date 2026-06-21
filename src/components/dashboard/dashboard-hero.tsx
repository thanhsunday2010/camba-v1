import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { DashboardStatsStrip } from "@/components/dashboard/dashboard-stats-strip";
import { ProgramProgressHeroCard } from "@/components/dashboard/program-progress-hero-card";
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
        "relative overflow-hidden rounded-3xl border-2 border-program/20 camba-gradient-program-soft",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-25 blur-3xl camba-gradient-program"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full opacity-15 blur-2xl camba-gradient-program"
        aria-hidden
      />

      <div className="relative grid gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_280px] lg:items-start">
        <div className="space-y-5 min-w-0">
          <header className="space-y-2">
            <p className="camba-caption uppercase tracking-wider text-program font-bold">
              {labels.greeting.replace("{name}", studentName)}
            </p>
            <h1 className="camba-display text-foreground">{studentName}</h1>
            <p className="camba-body text-foreground/90 font-medium leading-relaxed max-w-xl">
              {encouragement}
            </p>
          </header>

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
          />

          <Link href={lessonHref} className="block group camba-focus-ring rounded-2xl">
            <article className="relative overflow-hidden rounded-2xl border-2 border-program/30 bg-white p-4 sm:p-5 shadow-lg transition-all duration-200 group-hover:shadow-xl group-hover:-translate-y-0.5">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.06] camba-gradient-program"
                aria-hidden
              />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl camba-gradient-program text-white shadow-lg">
                    <BookOpen className="h-7 w-7" />
                  </div>
                  <div className="min-w-0">
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
                        <p className="camba-caption text-program/80 mt-1.5">
                          {labels.recommendedReason}
                        </p>
                      </>
                    ) : (
                      <p className="camba-body text-muted mt-1">{labels.startLearning}</p>
                    )}
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg h-12 px-8 text-base font-medium camba-gradient-program text-white shadow-md group-hover:scale-[1.02] transition-transform">
                  {ctaLabel}
                  <ArrowRight className="h-5 w-5" />
                </span>
              </div>
            </article>
          </Link>
        </div>

        <ProgramProgressHeroCard
          programSlug={programSlug}
          programName={programName}
          levelName={levelName}
          shieldFilledSegments={shieldFilledSegments}
          levelProgressPercent={levelProgressPercent}
          shieldLabel={labels.shieldLabel}
          levelLabel={labels.levelLabel}
          className="lg:sticky lg:top-20"
        />
      </div>
    </section>
  );
}
