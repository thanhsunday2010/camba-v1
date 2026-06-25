import { AnalyticsEmptyState } from "@/components/camba/empty-states";
import type {
  AnalyticsEmptyStateMode,
  MockTestAnalyticsLabels,
} from "@/lib/mock-tests/mock-test-analytics-types";

interface AnalyticsEmptyStateProps {
  mode: AnalyticsEmptyStateMode;
  labels: Pick<
    MockTestAnalyticsLabels,
    | "noAttemptTitle"
    | "noAttemptMessage"
    | "noAttemptAction"
    | "insufficientMetadataTitle"
    | "insufficientMetadataMessage"
  >;
  actionHref?: string;
}

export function AnalyticsEmptyStatePanel({ mode, labels, actionHref }: AnalyticsEmptyStateProps) {
  const isNoAttempt = mode === "no-attempt";

  return (
    <AnalyticsEmptyState
      title={isNoAttempt ? labels.noAttemptTitle : labels.insufficientMetadataTitle}
      description={
        isNoAttempt ? labels.noAttemptMessage : labels.insufficientMetadataMessage
      }
      primaryAction={
        isNoAttempt && labels.noAttemptAction
          ? { label: labels.noAttemptAction, href: actionHref ?? "/mock-tests" }
          : undefined
      }
    />
  );
}

/** @deprecated Import AnalyticsEmptyStatePanel — kept for existing imports */
export { AnalyticsEmptyStatePanel as AnalyticsEmptyState };
