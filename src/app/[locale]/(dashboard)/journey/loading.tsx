import { LearningPathSkeleton } from "@/components/learning/learning-path-skeleton";
import { StudentPageShell } from "@/components/camba";

export default function JourneyLoading() {
  return (
    <StudentPageShell>
      <LearningPathSkeleton />
    </StudentPageShell>
  );
}
