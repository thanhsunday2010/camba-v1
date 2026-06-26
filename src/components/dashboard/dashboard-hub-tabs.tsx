"use client";

import { AppTabs } from "@/components/camba/primitives/app-tabs";
import { useRouter } from "@/i18n/routing";
import {
  dashboardHubHref,
  type DashboardHubTab,
} from "@/lib/dashboard/dashboard-hub-routes";

export type DashboardHubTabLabels = {
  overview: string;
  achievements: string;
  profile: string;
};

interface DashboardHubTabsProps {
  activeTab: DashboardHubTab;
  labels: DashboardHubTabLabels;
}

export function DashboardHubTabs({ activeTab, labels }: DashboardHubTabsProps) {
  const router = useRouter();

  const tabs = [
    { id: "overview", label: labels.overview },
    { id: "achievements", label: labels.achievements },
    { id: "profile", label: labels.profile },
  ] as const;

  return (
    <AppTabs
      tabs={[...tabs]}
      activeId={activeTab}
      onChange={(id) => {
        router.replace(dashboardHubHref(id as DashboardHubTab));
      }}
      className="mb-4 sm:mb-5"
    />
  );
}
