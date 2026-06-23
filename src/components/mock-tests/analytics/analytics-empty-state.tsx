import { Sparkles } from "lucide-react";
import type {
  AnalyticsEmptyStateMode,
  MockTestAnalyticsLabels,
} from "@/lib/mock-tests/mock-test-analytics-types";

interface AnalyticsEmptyStateProps {
  mode: AnalyticsEmptyStateMode;
  labels: Pick<
    MockTestAnalyticsLabels,
    "noAttemptMessage" | "insufficientMetadataMessage"
  >;
}

export function AnalyticsEmptyState({ mode, labels }: AnalyticsEmptyStateProps) {
  const message =
    mode === "no-attempt"
      ? labels.noAttemptMessage
      : labels.insufficientMetadataMessage;

  return (
    <div
      className="rounded-xl border border-dashed border-border bg-[var(--surface-sunken)]/40 px-4 py-5 text-center"
      role="status"
    >
      <Sparkles className="h-5 w-5 text-muted mx-auto mb-2 opacity-70" aria-hidden />
      <p className="camba-caption text-muted">{message}</p>
    </div>
  );
}
