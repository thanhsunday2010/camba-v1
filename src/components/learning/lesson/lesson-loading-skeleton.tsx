import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard, SkeletonList } from "@/components/camba/feedback/skeletons";
import { StudentPageShell } from "@/components/camba";

export function LessonLoadingSkeleton() {
  return (
    <StudentPageShell narrow>
      <div className="camba-section-stack">
        <Skeleton className="h-5 w-36 rounded" />
        <Skeleton className="h-4 w-56 rounded" />
        <Skeleton className="h-44 w-full rounded-3xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-4 w-64 rounded" />
        </div>
        <SkeletonList count={3} />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </StudentPageShell>
  );
}
