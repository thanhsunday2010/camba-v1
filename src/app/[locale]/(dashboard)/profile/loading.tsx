import { StudentPageShell } from "@/components/camba";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <StudentPageShell narrow>
      <div className="camba-section-stack gap-6">
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      </div>
    </StudentPageShell>
  );
}
