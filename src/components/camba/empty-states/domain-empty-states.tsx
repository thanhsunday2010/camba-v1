import {
  Award,
  BookOpen,
  ClipboardList,
  FileQuestion,
  Lightbulb,
  Route,
  Target,
} from "lucide-react";
import type { EmptyStateProps } from "@/components/camba/empty-states/empty-state";
import { EmptyState, FeatureEmptyState, InlineEmptyState } from "@/components/camba/empty-states/empty-state";

type DomainEmptyProps = Omit<EmptyStateProps, "icon"> & { icon?: EmptyStateProps["icon"] };

export function LearningEmptyState({ icon = BookOpen, ...props }: DomainEmptyProps) {
  return <EmptyState icon={icon} {...props} />;
}

export function MockEmptyState(props: DomainEmptyProps) {
  return <EmptyState icon={FileQuestion} {...props} />;
}

export function AchievementEmptyState({
  icon = Award,
  variant = "feature",
  ...props
}: DomainEmptyProps) {
  return <EmptyState icon={icon} variant={variant} {...props} />;
}

export function AnalyticsEmptyState(
  props: Omit<DomainEmptyProps, "variant"> & { variant?: "minimal" | "compact" }
) {
  return (
    <EmptyState
      icon={Lightbulb}
      variant={props.variant ?? "minimal"}
      {...props}
    />
  );
}

export function PortfolioEmptyState(props: DomainEmptyProps) {
  return <FeatureEmptyState icon={Route} {...props} />;
}

export function PortfolioInlineEmptyState(props: DomainEmptyProps) {
  return <InlineEmptyState icon={Target} {...props} />;
}

export function MockHubEmptyState(props: DomainEmptyProps) {
  return <FeatureEmptyState icon={ClipboardList} {...props} />;
}
