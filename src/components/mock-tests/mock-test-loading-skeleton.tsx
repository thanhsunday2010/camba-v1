import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard, SkeletonList } from "@/components/camba/feedback/skeletons";
import { StudentPageShell } from "@/components/camba";

export function MockTestLoadingSkeleton({ variant = "hub" }: { variant?: "hub" | "detail" }) {
  return (
    <StudentPageShell narrow>
      <div className="camba-section-stack animate-pulse">
        <Skeleton className="h-5 w-36 rounded" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        {variant === "hub" && (
          <>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <SkeletonCard className="h-48" />
              <SkeletonCard className="h-48" />
            </div>
          </>
        )}
        {variant === "detail" && (
          <>
            <Skeleton className="h-12 w-full rounded-xl" />
            <SkeletonList count={3} />
            <SkeletonCard className="h-64" />
          </>
        )}
      </div>
    </StudentPageShell>
  );
}
