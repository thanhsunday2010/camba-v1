import { AlertCircle } from "lucide-react";
import { EmptyState } from "@/components/camba/empty-states/empty-state";
import type { EmptyStateAction } from "@/components/camba/empty-states/empty-state";

interface ErrorRecoveryStateProps {
  title: string;
  description: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
}

/** Distinct from empty states — used when data failed to load. */
export function ErrorRecoveryState({
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: ErrorRecoveryStateProps) {
  return (
    <EmptyState
      icon={AlertCircle}
      title={title}
      description={description}
      variant="compact"
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      className={className}
    />
  );
}
