import { Suspense } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { getAdminContentTree, getPendingReviewExercises } from "@/actions/admin/content";
import { getAdminAssessments } from "@/actions/admin/assessments";
import { SuperAdminDashboard } from "@/components/admin/super-admin/super-admin-dashboard";
import { getSiteTextOverrideRows } from "@/lib/site-copy/overrides";

export default async function AdminPage() {
  const t = await getTranslations("superAdmin");
  const locale = await getLocale();
  const [content, pendingExercises, assessments, siteCopyOverrides] = await Promise.all([
    getAdminContentTree(),
    getPendingReviewExercises(),
    getAdminAssessments(),
    getSiteTextOverrideRows(locale),
  ]);
  const baseMessages = (await import(`@/i18n/messages/${locale}.json`)).default;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">Super Admin</p>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("subtitle")}</p>
      </div>
      <Suspense fallback={<div className="py-12 text-center text-sm text-gray-500">Đang tải...</div>}>
        <SuperAdminDashboard
          content={content}
          pendingExercises={pendingExercises}
          placementTests={assessments.placementTests}
          mockTests={assessments.mockTests}
          siteCopyLocale={locale}
          siteCopyBaseMessages={baseMessages}
          siteCopyOverrides={siteCopyOverrides}
        />
      </Suspense>
    </div>
  );
}
