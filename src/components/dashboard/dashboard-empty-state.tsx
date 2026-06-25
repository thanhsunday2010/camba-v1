import type { LucideIcon } from "lucide-react";
import { FeatureEmptyState } from "@/components/camba/empty-states";

interface DashboardEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

/** @deprecated Use FeatureEmptyState from @/components/camba/empty-states */
export function DashboardEmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
  className,
}: DashboardEmptyStateProps) {
  return (
    <FeatureEmptyState
      icon={icon}
      title={title}
      description={description}
      primaryAction={
        actionLabel && actionHref
          ? { label: actionLabel, href: actionHref }
          : undefined
      }
      secondaryAction={
        secondaryActionLabel
          ? {
              label: secondaryActionLabel,
              href: secondaryActionHref,
              onClick: onSecondaryAction,
            }
          : undefined
      }
      className={className}
    />
  );
}
