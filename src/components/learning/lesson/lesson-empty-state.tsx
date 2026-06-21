import { LearningPathEmpty } from "@/components/learning/learning-path-empty";
import { BookOpen } from "lucide-react";

interface LessonEmptyStateProps {
  labels: {
    emptyTitle: string;
    emptyDescription: string;
    backToPath: string;
  };
}

export function LessonEmptyState({ labels }: LessonEmptyStateProps) {
  return (
    <LearningPathEmpty
      icon={BookOpen}
      title={labels.emptyTitle}
      description={labels.emptyDescription}
      actionLabel={labels.backToPath}
      actionHref="/learning"
      className="py-8"
    />
  );
}
