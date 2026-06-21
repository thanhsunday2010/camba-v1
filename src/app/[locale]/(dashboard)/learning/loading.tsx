import { LearningPathSkeleton } from "@/components/learning/learning-path-skeleton";
import { StudentPageShell } from "@/components/camba";

export default function LearningLoading() {
  return (
    <StudentPageShell>
      <LearningPathSkeleton />
    </StudentPageShell>
  );
}
