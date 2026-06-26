import { SectionHeader } from "@/components/camba/section-header";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { DashboardSlideStrip } from "@/components/dashboard/dashboard-slide-strip";
import type { WeeklyProgressStats } from "@/lib/dashboard/student-dashboard-data";
import { BarChart3, BookOpen, FileText, Mic, PenLine, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DashboardWeeklyProgressProps {
  stats: WeeklyProgressStats;
  labels: {
    title: string;
    subtitle: string;
    xpEarned: string;
    lessonsCompleted: string;
    mockTestsCompleted: string;
    writingTasksCompleted: string;
    speakingTasksCompleted: string;
    emptyNote: string;
  };
  variant?: "grid" | "strip";
}

function StatTile({
  icon: Icon,
  label,
  value,
  iconClassName,
  compact,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  iconClassName: string;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "rounded-xl border border-border/60 bg-white px-3 py-2.5 flex items-center gap-2.5 min-w-[9.5rem] h-full"
          : "rounded-xl border border-border/60 bg-white px-3 py-3 flex items-center gap-3 min-w-0"
      }
    >
      <div className={`camba-icon-box-sm shrink-0 ${iconClassName}`}>
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="camba-caption text-muted truncate">{label}</p>
        <p className="camba-stat text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function DashboardWeeklyProgress({
  stats,
  labels,
  variant = "grid",
}: DashboardWeeklyProgressProps) {
  const hasActivity =
    stats.xpEarned > 0 ||
    stats.lessonsCompleted > 0 ||
    stats.mockTestsCompleted > 0 ||
    stats.writingTasksCompleted > 0 ||
    stats.speakingTasksCompleted > 0;

  const tiles = [
    {
      icon: Zap,
      label: labels.xpEarned,
      value: stats.xpEarned,
      iconClassName: "bg-[var(--color-xp)]/12 text-[var(--color-xp)]",
    },
    {
      icon: BookOpen,
      label: labels.lessonsCompleted,
      value: stats.lessonsCompleted,
      iconClassName: "bg-program-muted text-program",
    },
    {
      icon: FileText,
      label: labels.mockTestsCompleted,
      value: stats.mockTestsCompleted,
      iconClassName: "bg-[var(--status-mock-test)]/12 text-[var(--status-mock-test)]",
    },
    {
      icon: PenLine,
      label: labels.writingTasksCompleted,
      value: stats.writingTasksCompleted,
      iconClassName: "bg-[var(--status-writing)]/12 text-[var(--status-writing)]",
    },
    {
      icon: Mic,
      label: labels.speakingTasksCompleted,
      value: stats.speakingTasksCompleted,
      iconClassName: "bg-[var(--status-speaking)]/12 text-[var(--status-speaking)]",
    },
  ];

  const tileNodes = tiles.map((tile) => (
    <StatTile key={tile.label} {...tile} compact={variant === "strip"} />
  ));

  if (variant === "strip") {
    return (
      <div className="space-y-2">
        <p className="camba-caption font-semibold text-foreground">{labels.title}</p>
        {!hasActivity && <p className="camba-caption text-muted">{labels.emptyNote}</p>}
        <DashboardSlideStrip label={labels.title}>{tileNodes}</DashboardSlideStrip>
      </div>
    );
  }

  return (
    <section aria-labelledby="weekly-progress-heading">
      <SectionHeader
        titleId="weekly-progress-heading"
        title={labels.title}
        description={labels.subtitle}
        icon={BarChart3}
      />

      <CambaCard variant="default" padding="md">
        {!hasActivity && <p className="camba-caption text-muted mb-3">{labels.emptyNote}</p>}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">{tileNodes}</div>
      </CambaCard>
    </section>
  );
}
