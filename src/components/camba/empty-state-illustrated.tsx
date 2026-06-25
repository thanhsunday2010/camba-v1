import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/camba/empty-states";
import type { LucideIcon } from "lucide-react";

interface EmptyStateIllustratedProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

/** @deprecated Use EmptyState variant="compact" from @/components/camba/empty-states */
export function EmptyStateIllustrated({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateIllustratedProps) {
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      variant="compact"
      primaryAction={
        actionLabel
          ? { label: actionLabel, href: actionHref, onClick: onAction }
          : undefined
      }
      className={cn(className)}
    />
  );
}
