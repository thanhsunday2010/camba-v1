import { cn } from "@/lib/utils";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { LessonStatusPill, MasteryBadge } from "@/components/camba/primitives/lesson-status-pill";
import type { LessonVisualState } from "@/lib/design/status-tokens";
import type { LucideIcon } from "lucide-react";
import { ChevronRight, Lock } from "lucide-react";
import { Link } from "@/i18n/routing";

interface LessonCardProps {
  title: string;
  subtitle?: string;
  href?: string;
  state: LessonVisualState;
  stateLabel: string;
  masteryLevel?: number;
  masteryLabel?: string;
  icon?: LucideIcon;
  recommended?: boolean;
  className?: string;
}

export function LessonCard({
  title,
  subtitle,
  href,
  state,
  stateLabel,
  masteryLevel,
  masteryLabel,
  icon: Icon,
  recommended,
  className,
}: LessonCardProps) {
  const locked = state === "locked";
  const content = (
    <CambaCard
      variant="lesson"
      padding="md"
      interactive={!locked && !!href}
      className={cn(
        recommended && "ring-2 ring-[var(--status-recommended)]/30",
        locked && "opacity-60",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "camba-icon-box-md shrink-0",
            locked ? "bg-[var(--surface-sunken)] text-[var(--status-locked)]" : "bg-program-muted text-program"
          )}
        >
          {locked ? (
            <Lock className="h-5 w-5" />
          ) : Icon ? (
            <Icon className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="camba-h3 text-foreground truncate">{title}</p>
          {subtitle && <p className="camba-caption text-muted truncate mt-0.5">{subtitle}</p>}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <LessonStatusPill state={state} label={stateLabel} />
            {masteryLevel != null && masteryLabel && (
              <MasteryBadge level={masteryLevel as 0 | 1 | 2 | 3 | 4} label={masteryLabel} />
            )}
          </div>
        </div>
        {!locked && href && <ChevronRight className="h-5 w-5 text-muted shrink-0" />}
      </div>
    </CambaCard>
  );

  if (href && !locked) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

interface UnitCardProps {
  title: string;
  subtitle?: string;
  progress: number;
  progressLabel?: string;
  lessonCount?: number;
  expanded?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function UnitCard({
  title,
  subtitle,
  progress,
  progressLabel,
  lessonCount,
  expanded,
  onToggle,
  children,
  className,
}: UnitCardProps) {
  return (
    <CambaCard variant="elevated" padding="none" className={className}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-5 camba-focus-ring rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="camba-h2 text-foreground">{title}</h3>
            {subtitle && <p className="camba-caption text-muted mt-1">{subtitle}</p>}
            {lessonCount != null && (
              <p className="camba-caption text-program mt-1 font-semibold">
                {lessonCount} bài học
              </p>
            )}
          </div>
          <span className="camba-stat text-program text-xl">{progress}%</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
          <div
            className="h-full camba-gradient-program rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progressLabel && (
          <p className="camba-caption text-muted mt-1.5">{progressLabel}</p>
        )}
      </button>
      {expanded && children && (
        <div className="border-t border-border px-3 py-2 space-y-1">{children}</div>
      )}
    </CambaCard>
  );
}

interface SkillCardProps {
  skillLabel: string;
  progress: number;
  masteryLabel?: string;
  icon?: LucideIcon;
  className?: string;
}

export function SkillCard({
  skillLabel,
  progress,
  masteryLabel,
  icon: Icon,
  className,
}: SkillCardProps) {
  return (
    <CambaCard variant="stat" padding="md" className={className}>
      <div className="flex items-center gap-3 mb-3">
        {Icon && (
          <div className="camba-icon-box-sm bg-program-muted text-program">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div className="flex-1">
          <p className="camba-h3 text-foreground capitalize">{skillLabel}</p>
          {masteryLabel && <p className="camba-caption text-muted">{masteryLabel}</p>}
        </div>
        <span className="camba-stat text-lg text-program">{progress}%</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--surface-sunken)]">
        <div
          className="h-full rounded-full bg-program transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </CambaCard>
  );
}

interface MockTestCardProps {
  title: string;
  description?: string;
  bestScore?: number;
  attemptCount?: number;
  href: string;
  ctaLabel?: string;
  className?: string;
}

export function MockTestCard({
  title,
  description,
  bestScore,
  attemptCount,
  href,
  ctaLabel = "Bắt đầu thi",
  className,
}: MockTestCardProps) {
  return (
    <Link href={href}>
      <CambaCard variant="mockTest" padding="md" interactive className={className}>
        <h3 className="camba-h2 text-foreground">{title}</h3>
        {description && <p className="camba-body text-muted mt-1">{description}</p>}
        <div className="flex flex-wrap gap-3 mt-3 camba-caption text-muted">
          {bestScore != null && <span>Điểm cao nhất: {bestScore}%</span>}
          {attemptCount != null && <span>{attemptCount} lần thi</span>}
        </div>
        <span className="inline-flex mt-4 text-sm font-semibold text-[var(--status-mock-test)]">
          {ctaLabel} →
        </span>
      </CambaCard>
    </Link>
  );
}
