import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard, SkeletonList } from "@/components/camba/feedback/skeletons";

export function LearningPathSkeleton() {
  return (
    <div className="camba-section-stack">
      <Skeleton className="h-44 w-full rounded-3xl" />
      <div className="hidden md:block">
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-28 shrink-0 rounded-2xl" />
        ))}
      </div>
      <SkeletonList count={4} />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-5 w-40 rounded" />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
