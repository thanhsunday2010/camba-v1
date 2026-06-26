import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ProgramBadge } from "@/components/camba/cambridge/program-badge";
import { LearningPathProgressSummary } from "@/components/learning/learning-path-progress-summary";
import { Button } from "@/components/ui/button";
import type { NextLessonContext } from "@/lib/queries/dashboard";
import { ArrowRight, Target } from "lucide-react";

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
  compact?: boolean;
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
  compact = false,
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
        "relative overflow-hidden rounded-2xl border border-program/20 shadow-sm camba-gradient-program-soft",
        !compact && "sm:rounded-3xl border-2 border-program/25 shadow-lg camba-hero-pattern",
        className
      )}
    >
      {!compact && (
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl camba-gradient-program"
          aria-hidden
        />
      )}
      <div className={cn("relative space-y-3", compact ? "p-4" : "p-5 sm:p-8 space-y-5")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <ProgramBadge programSlug={programSlug} size={compact ? "sm" : "md"} />
              <span className="rounded-full bg-white/80 border border-program/20 px-2 py-0.5 text-[10px] font-bold text-program uppercase">
                {levelSlug}
              </span>
            </div>
            <div>
              <h1 className={cn(compact ? "camba-h2" : "camba-display", "text-foreground")}>
                {labels.title}
              </h1>
              <p className="camba-caption text-muted">{levelName}</p>
            </div>
          </div>
          {lessonHref && (
            <Link href={lessonHref} className="shrink-0 w-full sm:w-auto">
              <Button
                variant="quest"
                size={compact ? "default" : "lg"}
                className="w-full sm:w-auto gap-2"
              >
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
          compact={compact}
        />

        <div
          className={cn(
            "flex items-start gap-2.5 rounded-xl bg-white/60 border border-program/15",
            compact ? "px-3 py-2.5" : "rounded-2xl px-4 py-3 gap-3"
          )}
        >
          <div className="camba-icon-box-sm bg-program-muted text-program shrink-0">
            <Target className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="camba-caption font-semibold text-program uppercase tracking-wide">
              {labels.currentObjective}
            </p>
            <p className="camba-caption sm:camba-body text-foreground mt-0.5 leading-snug line-clamp-2">
              {objectiveText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
