import { StudentPageShell } from "@/components/camba";
import { SkeletonShimmer } from "@/components/camba/motion";

export default function ProfileLoading() {
  return (
    <StudentPageShell narrow>
      <div className="camba-section-stack gap-6">
        <SkeletonShimmer className="h-48 rounded-3xl" />
        <SkeletonShimmer className="h-40 rounded-2xl" />
        <SkeletonShimmer className="h-32 rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonShimmer className="h-36 rounded-2xl" />
          <SkeletonShimmer className="h-36 rounded-2xl" />
        </div>
      </div>
    </StudentPageShell>
  );
}
