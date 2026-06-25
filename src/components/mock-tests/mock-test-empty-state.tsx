import { MockEmptyState } from "@/components/camba/empty-states";

interface MockTestEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function MockTestEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  secondaryActionLabel,
  onSecondaryAction,
}: MockTestEmptyStateProps) {
  return (
    <MockEmptyState
      title={title}
      description={description}
      variant="feature"
      primaryAction={
        actionLabel && actionHref
          ? { label: actionLabel, href: actionHref }
          : actionLabel
            ? { label: actionLabel, href: "/mock-tests" }
            : undefined
      }
      secondaryAction={
        secondaryActionLabel
          ? { label: secondaryActionLabel, onClick: onSecondaryAction }
          : undefined
      }
    />
  );
}
