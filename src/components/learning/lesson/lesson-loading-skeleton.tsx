import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard, SkeletonList } from "@/components/camba/feedback/skeletons";
import { StudentPageShell } from "@/components/camba";

export function LessonLoadingSkeleton() {
  return (
    <StudentPageShell narrow>
      <div className="camba-section-stack animate-pulse">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40 rounded" />
          <Skeleton className="h-4 w-56 rounded" />
        </div>
        <Skeleton className="h-52 sm:h-48 w-full rounded-3xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="space-y-2 pt-1">
          <Skeleton className="h-6 w-52 rounded" />
          <Skeleton className="h-4 w-72 rounded" />
        </div>
        <SkeletonList count={4} />
        <SkeletonCard className="h-24" />
      </div>
    </StudentPageShell>
  );
}
