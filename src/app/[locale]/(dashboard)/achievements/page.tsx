import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { StudentPageShell } from "@/components/camba";
import { getAchievementViewModel } from "@/lib/achievements/achievement-view-model";
import {
  AchievementsCollectionView,
  type AchievementsCollectionLabels,
} from "@/components/achievements/achievements-collection-view";
import {
  buildSharedAchievementLabels,
  resolveAchievementText,
} from "@/lib/achievements/achievement-i18n";
import { AchievementUnlockNotifier } from "@/components/achievements/achievement-unlock-toast";

export default async function AchievementsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [t, model] = await Promise.all([
    getTranslations("achievements"),
    getAchievementViewModel(user.id),
  ]);

  const shared = buildSharedAchievementLabels(t);
  const items = shared.itemLabels;
  const resolveText = (achievement: Parameters<typeof resolveAchievementText>[0]) =>
    resolveAchievementText(achievement, items);

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
        unlockedAchievements={model.unlocked}
        resolveTitle={(a) => resolveText(a).title}
        labels={{
          unlocked: t("toastUnlocked"),
          celebration: t("toastCelebration"),
        }}
      />
      <AchievementsCollectionView
        model={model}
        labels={labels}
        resolveText={resolveText}
      />
    </StudentPageShell>
  );
}
