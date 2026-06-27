import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess, getAdminFallbackPath } from "@/lib/auth/admin-permissions";
import { getAdminDashboardStats } from "@/lib/admin/analytics/get-dashboard-stats";
import { getConversionFunnel } from "@/lib/admin/analytics/funnel";
import { AdminDashboard } from "@/components/admin/dashboard/admin-dashboard";
import type { DashboardTimeRange } from "@/lib/admin/analytics/types";

function parseRange(value: string | undefined): DashboardTimeRange {
  if (value === "7d" || value === "90d") return value;
  return "30d";
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!canAccess(user, "dashboard.read")) redirect(getAdminFallbackPath(user));

  const params = await searchParams;
  const range = parseRange(params.range);
  const canViewRevenue =
    user.isSuperAdmin || canAccess(user, "subscriptions.read");

  const [stats, funnel] = await Promise.all([
    getAdminDashboardStats(range, canViewRevenue),
    getConversionFunnel(),
  ]);

  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-gray-500">Đang tải...</div>}>
      <AdminDashboard stats={stats} funnel={funnel} user={user} />
    </Suspense>
  );
}
