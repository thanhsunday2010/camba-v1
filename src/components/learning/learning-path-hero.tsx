import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ProgramBadge } from "@/components/camba/cambridge/program-badge";
import { LearningPathProgressSummary } from "@/components/learning/learning-path-progress-summary";
import { Button } from "@/components/ui/button";
import type { NextLessonContext } from "@/lib/queries/dashboard";
import { ArrowRight, Map, Target } from "lucide-react";

export interface LearningPathHeroLabels {
  title: string;
  subtitle: string;
  currentObjective: string;
  continueLesson: string;
  startLearning: string;
  viewAllUnits: string;
  minutes: string;
  levelProgress: string;
  units: string;
  lessons: string;
  recommendedReason: string;
}

interface LearningPathHeroProps {
  programSlug?: string | null;
  levelName: string;
  levelSlug: string;
  levelProgressPercent: number;
  unitCount: number;
  unitsWithContent: number;
  lessonCount: number;
  nextLesson: NextLessonContext | null;
  objectiveText: string;
  labels: LearningPathHeroLabels;
  className?: string;
}

export function LearningPathHero({
  programSlug,
  levelName,
  levelSlug,
  levelProgressPercent,
  unitCount,
  unitsWithContent,
  lessonCount,
  nextLesson,
  objectiveText,
  labels,
  className,
}: LearningPathHeroProps) {
  const lessonHref = nextLesson ? `/learning/lesson/${nextLesson.id}` : undefined;
  const ctaLabel = nextLesson
    ? nextLesson.completionPercent > 0
      ? labels.continueLesson
      : labels.startLearning
    : labels.startLearning;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border-2 border-program/25 shadow-lg camba-gradient-program-soft camba-hero-pattern",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl camba-gradient-program"
        aria-hidden
      />
      <div className="relative p-5 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <ProgramBadge programSlug={programSlug} size="md" />
              <span className="rounded-full bg-white/80 border border-program/20 px-2.5 py-0.5 text-xs font-bold text-program uppercase">
                {levelSlug}
              </span>
            </div>
            <div>
              <h1 className="camba-display text-foreground">{labels.title}</h1>
              <p className="camba-body text-muted mt-1">{levelName}</p>
              <p className="camba-caption text-muted mt-0.5">{labels.subtitle}</p>
            </div>
          </div>
          {lessonHref && (
            <Link href={lessonHref} className="shrink-0 w-full sm:w-auto">
              <Button variant="quest" size="lg" className="w-full sm:w-auto gap-2">
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        <LearningPathProgressSummary
          levelProgressPercent={levelProgressPercent}
          unitCount={unitCount}
          unitsWithContent={unitsWithContent}
          lessonCount={lessonCount}
          labels={{
            levelProgress: labels.levelProgress,
            units: labels.units,
            lessons: labels.lessons,
          }}
        />

        <div className="flex items-start gap-3 rounded-2xl bg-white/60 border border-program/15 px-4 py-3">
          <div className="camba-icon-box-sm bg-program-muted text-program shrink-0">
            <Target className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="camba-caption font-semibold text-program uppercase tracking-wide">
              {labels.currentObjective}
            </p>
            <p className="camba-body text-foreground mt-0.5 leading-snug">{objectiveText}</p>
            {nextLesson && (
              <p className="camba-caption text-muted mt-1 flex items-center gap-1">
                <Map className="h-3.5 w-3.5 shrink-0" />
                {labels.recommendedReason}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
