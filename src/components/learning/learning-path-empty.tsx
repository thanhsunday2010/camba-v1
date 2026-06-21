import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import type { LucideIcon } from "lucide-react";

interface LearningPathEmptyProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  children?: React.ReactNode;
  className?: string;
}

export function LearningPathEmpty({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  children,
  className,
}: LearningPathEmptyProps) {
  return (
    <div className={className}>
      <DashboardEmptyState
        icon={icon}
        title={title}
        description={description}
        actionLabel={actionLabel}
        actionHref={actionHref}
      />
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
