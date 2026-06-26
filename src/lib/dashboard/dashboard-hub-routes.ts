export type DashboardHubTab = "overview" | "achievements" | "profile";

export const DASHBOARD_HUB_PATH = "/dashboard";

export function dashboardHubHref(tab: DashboardHubTab = "overview"): string {
  if (tab === "overview") return DASHBOARD_HUB_PATH;
  return `${DASHBOARD_HUB_PATH}?tab=${tab}`;
}

export function parseDashboardHubTab(value: string | string[] | undefined): DashboardHubTab {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "achievements" || raw === "profile") return raw;
  return "overview";
}
