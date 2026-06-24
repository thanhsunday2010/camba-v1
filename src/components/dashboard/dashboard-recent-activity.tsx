import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import type { DashboardActivityItem } from "@/lib/dashboard/recent-activity";
import { Activity, Award, BookOpen, ClipboardList } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DashboardRecentActivityProps {
  items: DashboardActivityItem[];
  labels: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
    kindLesson: string;
    kindMock: string;
    kindBadge: string;
  };
  maxVisible?: number;
}

const KIND_ICONS: Record<DashboardActivityItem["kind"], LucideIcon> = {
  lesson: BookOpen,
  mock_test: ClipboardList,
  badge: Award,
  achievement: Award,
};

function formatWhen(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function kindLabel(kind: DashboardActivityItem["kind"], labels: DashboardRecentActivityProps["labels"]) {
  switch (kind) {
    case "lesson":
      return labels.kindLesson;
    case "mock_test":
      return labels.kindMock;
    case "badge":
    case "achievement":
      return labels.kindBadge;
  }
}

export function DashboardRecentActivity({
  items,
  labels,
  maxVisible = 10,
}: DashboardRecentActivityProps) {
  const visible = items.slice(0, maxVisible);

  return (
    <section aria-labelledby="recent-activity-heading">
      <SectionHeader
        titleId="recent-activity-heading"
        title={labels.title}
        description={labels.subtitle}
        icon={Activity}
      />

      {visible.length === 0 ? (
        <DashboardEmptyState
          icon={Activity}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          actionLabel={labels.emptyAction}
          actionHref="/learning"
        />
      ) : (
        <ol className="space-y-2" aria-label={labels.title}>
          {visible.map((item) => {
            const Icon = KIND_ICONS[item.kind];
            const content = (
              <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-white px-4 py-3 transition-colors hover:border-program/25 hover:bg-program-muted/20">
                <div className="camba-icon-box-sm shrink-0 bg-program-muted text-program">
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="camba-caption text-muted">{kindLabel(item.kind, labels)}</p>
                  <p className="camba-body font-medium text-foreground truncate">{item.title}</p>
                  {item.subtitle && (
                    <p className="camba-caption text-muted mt-0.5">{item.subtitle}</p>
                  )}
                </div>
                <time
                  className="camba-caption text-muted shrink-0"
                  dateTime={item.occurredAt}
                >
                  {formatWhen(item.occurredAt)}
                </time>
              </div>
            );

            return (
              <li key={item.id}>
                {item.href ? (
                  <Link href={item.href} className="block camba-focus-ring rounded-xl">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
