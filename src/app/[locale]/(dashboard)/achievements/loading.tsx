import { StudentPageShell } from "@/components/camba";
import { Skeleton } from "@/components/ui/skeleton";

export default function AchievementsLoading() {
  return (
    <StudentPageShell narrow>
      <div className="camba-section-stack gap-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-full max-w-xl" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      </div>
    </StudentPageShell>
  );
}
