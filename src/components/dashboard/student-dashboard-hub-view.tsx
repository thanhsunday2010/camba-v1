"use client";

import { StudentPageShell } from "@/components/camba";
import { DashboardHubTabs, type DashboardHubTabLabels } from "@/components/dashboard/dashboard-hub-tabs";
import {
  StudentDashboardView,
  type StudentDashboardLabels,
} from "@/components/dashboard/student-dashboard-view";
import {
  AchievementsCollectionView,
  type AchievementsCollectionLabels,
} from "@/components/achievements/achievements-collection-view";
import { AchievementUnlockNotifier } from "@/components/achievements/achievement-unlock-toast";
import { StudentProfileView, type StudentProfileViewLabels } from "@/components/profile/student-profile-view";
import type { DashboardHubTab } from "@/lib/dashboard/dashboard-hub-routes";
import type { StudentDashboardData } from "@/lib/dashboard/student-dashboard-data";
import type { ResolvedAchievementViewModel } from "@/lib/achievements/achievement-types";
import type { StudentPortfolioViewModel } from "@/lib/profile/student-profile-types";
import type { AchievementItemLabels } from "@/lib/achievements/achievement-i18n";
import type { CertificationPortfolio } from "@/lib/profile/student-profile-types";

interface StudentDashboardHubViewProps {
  activeTab: DashboardHubTab;
  tabLabels: DashboardHubTabLabels;
  overview?: {
    userName: string;
    data: StudentDashboardData;
    labels: StudentDashboardLabels;
  };
  achievements?: {
    model: ResolvedAchievementViewModel;
    labels: AchievementsCollectionLabels;
    toastLabels: { unlocked: string; celebration: string };
  };
  profile?: {
    model: StudentPortfolioViewModel;
    labels: StudentProfileViewLabels;
    achievementItemLabels: AchievementItemLabels;
    resolveCertificationTitle: (entry: CertificationPortfolio["entries"][number]) => string;
    resolveGoalTitle: (goalKey: string) => string;
    resolveGoalDescription: (goalKey: string) => string;
  };
}

export function StudentDashboardHubView({
  activeTab,
  tabLabels,
  overview,
  achievements,
  profile,
}: StudentDashboardHubViewProps) {
  const useNarrowShell = activeTab !== "overview";

  return (
    <StudentPageShell narrow={useNarrowShell}>
      <DashboardHubTabs activeTab={activeTab} labels={tabLabels} />

      {activeTab === "overview" && overview && (
        <StudentDashboardView
          userName={overview.userName}
          data={overview.data}
          labels={overview.labels}
        />
      )}

      {activeTab === "achievements" && achievements && (
        <>
          <AchievementUnlockNotifier
            unlockedAchievements={achievements.model.unlocked}
            labels={achievements.toastLabels}
          />
          <AchievementsCollectionView model={achievements.model} labels={achievements.labels} />
        </>
      )}

      {activeTab === "profile" && profile && (
        <StudentProfileView
          model={profile.model}
          labels={profile.labels}
          achievementItemLabels={profile.achievementItemLabels}
          resolveCertificationTitle={profile.resolveCertificationTitle}
          resolveGoalTitle={profile.resolveGoalTitle}
          resolveGoalDescription={profile.resolveGoalDescription}
          hubMode
        />
      )}
    </StudentPageShell>
  );
}
