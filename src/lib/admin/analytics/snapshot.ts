import { createAdminAnalyticsClient } from "@/lib/supabase/admin-analytics";
import { getAdminDashboardStats } from "@/lib/admin/analytics/get-dashboard-stats";
import { toIsoDate } from "@/lib/admin/analytics/format";

export interface DailySnapshotMetrics {
  totalUsers: number;
  wau: number;
  mau: number;
  dauToday: number;
  revenueVnd30d: number;
  paidUsers: number;
  newUsers30d: number;
  aiCallsToday: number;
  pendingOrders: number;
  pendingReview: number;
}

export interface DailySnapshotRow {
  snapshotDate: string;
  metrics: DailySnapshotMetrics;
  createdAt: string;
}

export async function buildDailySnapshotMetrics(): Promise<DailySnapshotMetrics> {
  const stats = await getAdminDashboardStats("30d", true);
  return {
    totalUsers: stats.kpis.totalUsers.value,
    wau: stats.kpis.wau.value,
    mau: stats.kpis.mau.value,
    dauToday: stats.operations.dauToday,
    revenueVnd30d: stats.kpis.revenueVnd.value,
    paidUsers: stats.kpis.paidUsers.value,
    newUsers30d: stats.kpis.newUsers.value,
    aiCallsToday: stats.operations.aiCallsToday,
    pendingOrders: stats.operations.pendingOrders,
    pendingReview: stats.operations.pendingReview,
  };
}

export async function saveDailySnapshot(): Promise<{ saved: boolean; date: string }> {
  const supabase = createAdminAnalyticsClient();
  const date = toIsoDate(new Date());
  const metrics = await buildDailySnapshotMetrics();

  const { error } = await supabase.from("admin_daily_snapshots").upsert(
    { snapshot_date: date, metrics },
    { onConflict: "snapshot_date" }
  );

  if (error) throw new Error(error.message);
  return { saved: true, date };
}

export async function listDailySnapshots(limit = 30): Promise<DailySnapshotRow[]> {
  const supabase = createAdminAnalyticsClient();
  const { data } = (await supabase
    .from("admin_daily_snapshots")
    .select("snapshot_date, metrics, created_at")
    .order("snapshot_date", { ascending: false })
    .limit(limit)) as {
    data: { snapshot_date: string; metrics: DailySnapshotMetrics; created_at: string }[] | null;
  };

  return (data ?? []).map((row) => ({
    snapshotDate: row.snapshot_date,
    metrics: row.metrics,
    createdAt: row.created_at,
  }));
}
