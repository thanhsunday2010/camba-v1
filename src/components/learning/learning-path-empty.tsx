import { LearningEmptyState } from "@/components/camba/empty-states";
import type { LucideIcon } from "lucide-react";

interface LearningPathEmptyProps {
  icon?: LucideIcon;
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
      <LearningEmptyState
        icon={icon}
        title={title}
        description={description}
        variant="feature"
        primaryAction={
          actionLabel && actionHref
            ? { label: actionLabel, href: actionHref }
            : undefined
        }
      />
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
