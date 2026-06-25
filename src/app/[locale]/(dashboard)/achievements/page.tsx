import { getTranslations } from "next-intl/server";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { StudentPageShell } from "@/components/camba";
import { getAchievementViewModel } from "@/lib/achievements/achievement-view-model";
import {
  AchievementsCollectionView,
  type AchievementsCollectionLabels,
} from "@/components/achievements/achievements-collection-view";
import {
  buildSharedAchievementLabels,
  resolveAchievementViewModel,
} from "@/lib/achievements/achievement-i18n";
import { AchievementUnlockNotifier } from "@/components/achievements/achievement-unlock-toast";

export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  const user = await requireCurrentUser();

  const [t, model] = await Promise.all([
    getTranslations("achievements"),
    getAchievementViewModel(user.id),
  ]);

  const shared = buildSharedAchievementLabels(t);
  const items = shared.itemLabels;
  const resolvedModel = resolveAchievementViewModel(model, items);

  const labels: AchievementsCollectionLabels = {
    pageTitle: t("pageTitle"),
    pageSubtitle: t("pageSubtitle"),
    viewPortfolio: t("viewPortfolio"),
    filterAll: t("filterAll"),
    filterUnlocked: t("filterUnlocked"),
    filterLocked: t("filterLocked"),
    emptyTitle: t("emptyTitle"),
    emptyDescription: t("emptyDescription"),
    emptyAction: t("emptyAction"),
    resetFiltersAction: t("resetFiltersAction"),
    unlockedSummary: t("unlockedSummary"),
    encouragement: t("encouragement"),
    ...shared,
  };

  return (
    <StudentPageShell narrow>
      <AchievementUnlockNotifier
        unlockedAchievements={resolvedModel.unlocked}
        labels={{
          unlocked: t("toastUnlocked"),
          celebration: t("toastCelebration"),
        }}
      />
      <AchievementsCollectionView
        model={resolvedModel}
        labels={labels}
      />
    </StudentPageShell>
  );
}
