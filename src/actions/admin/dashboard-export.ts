"use server";

import { requirePermission } from "@/actions/admin/_shared";
import { canAccess } from "@/lib/auth/admin-permissions";
import { getAdminDashboardStats } from "@/lib/admin/analytics/get-dashboard-stats";
import {
  buildDashboardCsv,
  dashboardCsvFilename,
} from "@/lib/admin/analytics/export-csv";
import type { DashboardTimeRange } from "@/lib/admin/analytics/types";

export async function exportDashboardCsv(
  timeRange: DashboardTimeRange = "30d"
): Promise<{ success: true; csv: string; filename: string } | { success: false; error: string }> {
  const user = await requirePermission("dashboard.export");

  const canViewRevenue = user.isSuperAdmin || canAccess(user, "subscriptions.read");
  const stats = await getAdminDashboardStats(timeRange, canViewRevenue);
  const csv = buildDashboardCsv(stats);

  return {
    success: true,
    csv,
    filename: dashboardCsvFilename(timeRange),
  };
}
