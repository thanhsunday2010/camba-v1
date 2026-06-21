import { cn } from "@/lib/utils";
import { ProgramBadge } from "@/components/camba/cambridge/program-badge";
import { MasteryBadge } from "@/components/camba/primitives/lesson-status-pill";
import { SKILL_ICONS } from "@/lib/design/skill-icons";
import type { LessonPageContext, LessonPageProgress } from "@/lib/learning/lesson-page-types";
import { Clock } from "lucide-react";

interface LessonHeroProps {
  title: string;
  description?: string | null;
  estimatedMinutes?: number | null;
  context: LessonPageContext;
  progress: LessonPageProgress;
  masteryLabel: string;
  labels: {
    estimatedMinutes: string;
    skillLabel: string;
    unitLabel: string;
  };
  className?: string;
}

export function LessonHero({
  title,
  description,
  estimatedMinutes,
  context,
  progress,
  masteryLabel,
  labels,
  className,
}: LessonHeroProps) {
  const SkillIcon = context.skillSlug ? SKILL_ICONS[context.skillSlug] : null;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border-2 border-program/20 shadow-md camba-gradient-program-soft camba-hero-pattern",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-20 blur-3xl camba-gradient-program"
        aria-hidden
      />
      <div className="relative p-5 sm:p-7 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {context.programSlug && <ProgramBadge programSlug={context.programSlug} size="sm" />}
          {context.levelSlug && (
            <span className="rounded-full bg-white/80 border border-program/20 px-2.5 py-0.5 text-xs font-bold text-program uppercase">
              {context.levelSlug}
            </span>
          )}
          {context.skillName && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 border border-border px-2.5 py-0.5 text-xs font-semibold text-foreground capitalize">
              {SkillIcon && <SkillIcon className="h-3.5 w-3.5 text-program" />}
              {context.skillName}
            </span>
          )}
        </div>

        <div>
          <h1 className="camba-display text-foreground">{title}</h1>
          {context.unitTitle && (
            <p className="camba-caption text-muted mt-1">
              {labels.unitLabel}: {context.unitTitle}
            </p>
          )}
          {description && (
            <p className="camba-body text-muted mt-2 leading-relaxed max-w-2xl">{description}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {typeof estimatedMinutes === "number" && estimatedMinutes > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 border border-border px-3 py-1 camba-caption text-muted">
              <Clock className="h-3.5 w-3.5" />
              {estimatedMinutes} {labels.estimatedMinutes}
            </span>
          )}
          <MasteryBadge
            level={Math.min(4, Math.max(0, progress.masteryLevel)) as 0 | 1 | 2 | 3 | 4}
            label={masteryLabel}
          />
        </div>
      </div>
    </section>
  );
}
