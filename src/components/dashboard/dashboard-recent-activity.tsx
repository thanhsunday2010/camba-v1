import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { DashboardSlideItem, DashboardSlideStrip } from "@/components/dashboard/dashboard-slide-strip";
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
  bodyOnly?: boolean;
  variant?: "list" | "strip";
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

function ActivityCard({
  item,
  labels,
  compact,
}: {
  item: DashboardActivityItem;
  labels: DashboardRecentActivityProps["labels"];
  compact?: boolean;
}) {
  const Icon = KIND_ICONS[item.kind];
  const content = (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-white px-3 py-2.5 transition-colors hover:border-program/25 hover:bg-program-muted/20 h-full">
      <div className="camba-icon-box-sm shrink-0 bg-program-muted text-program">
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        {!compact && <p className="camba-caption text-muted">{kindLabel(item.kind, labels)}</p>}
        <p className="camba-body font-medium text-foreground truncate">{item.title}</p>
        {!compact && item.subtitle && (
          <p className="camba-caption text-muted mt-0.5 line-clamp-1">{item.subtitle}</p>
        )}
      </div>
      <time className="camba-caption text-muted shrink-0" dateTime={item.occurredAt}>
        {formatWhen(item.occurredAt)}
      </time>
    </div>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="block camba-focus-ring rounded-xl h-full">
        {content}
      </Link>
    );
  }

  return content;
}

export function DashboardRecentActivity({
  items,
  labels,
  maxVisible = 10,
  bodyOnly = false,
  variant = "list",
}: DashboardRecentActivityProps) {
  const visible = items.slice(0, maxVisible);
  const compact = variant === "strip";

  return (
    <section aria-labelledby={bodyOnly ? undefined : "recent-activity-heading"}>
      {!bodyOnly && (
        <SectionHeader
          titleId="recent-activity-heading"
          title={labels.title}
          description={labels.subtitle}
          icon={Activity}
        />
      )}

      {visible.length === 0 ? (
        <DashboardEmptyState
          icon={Activity}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          actionLabel={labels.emptyAction}
          actionHref="/learning"
        />
      ) : variant === "strip" ? (
        <DashboardSlideStrip label={labels.title}>
          {visible.map((item) => (
            <DashboardSlideItem key={item.id} className="w-[min(100%,15rem)]">
              <ActivityCard item={item} labels={labels} compact={compact} />
            </DashboardSlideItem>
          ))}
        </DashboardSlideStrip>
      ) : (
        <ol className="space-y-2" aria-label={labels.title}>
          {visible.map((item) => (
            <li key={item.id}>
              <ActivityCard item={item} labels={labels} compact={compact} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
