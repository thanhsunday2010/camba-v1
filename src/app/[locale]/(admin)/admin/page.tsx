import { getTranslations } from "next-intl/server";
import { getAdminContentTree, getPendingReviewExercises } from "@/actions/admin/content";
import { getAdminAssessments } from "@/actions/admin/assessments";
import { CmsDashboard } from "@/components/admin/cms-dashboard";

export default async function AdminPage() {
  const t = await getTranslations("admin");
  const [content, pendingExercises, assessments] = await Promise.all([
    getAdminContentTree(),
    getPendingReviewExercises(),
    getAdminAssessments(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
      </div>
      <CmsDashboard
        content={content}
        pendingExercises={pendingExercises}
        placementTests={assessments.placementTests}
        mockTests={assessments.mockTests}
      />
    </div>
  );
}
