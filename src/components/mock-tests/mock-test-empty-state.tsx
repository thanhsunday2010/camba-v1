import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { FileQuestion } from "lucide-react";

interface MockTestEmptyStateProps {
  title: string;
  description: string;
}

export function MockTestEmptyState({ title, description }: MockTestEmptyStateProps) {
  return (
    <DashboardEmptyState
      icon={FileQuestion}
      title={title}
      description={description}
    />
  );
}
