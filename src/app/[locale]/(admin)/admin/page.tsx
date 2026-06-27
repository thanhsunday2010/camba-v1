import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { getAdminDashboardStats } from "@/lib/admin/analytics/get-dashboard-stats";
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

  const params = await searchParams;
  const range = parseRange(params.range);
  const canViewRevenue =
    user.isSuperAdmin || canAccess(user, "subscriptions.read");

  const stats = await getAdminDashboardStats(range, canViewRevenue);

  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-gray-500">Đang tải...</div>}>
      <AdminDashboard stats={stats} user={user} />
    </Suspense>
  );
}
