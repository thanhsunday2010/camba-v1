import { createAdminAnalyticsClient } from "@/lib/supabase/admin-analytics";
import { daysAgo } from "@/lib/admin/analytics/format";

export interface FunnelStep {
  id: string;
  label: string;
  count: number;
  rateFromPrevious: number | null;
}

async function fetchActiveUserIdsSince(since: Date): Promise<Set<string>> {
  const supabase = createAdminAnalyticsClient();
  const sinceIso = since.toISOString();
  const ids = new Set<string>();

  const queries = [
    supabase.from("exercise_attempts").select("user_id").gte("started_at", sinceIso),
    supabase.from("lesson_progress").select("user_id").gte("updated_at", sinceIso),
    supabase.from("mock_test_attempts").select("user_id").gte("started_at", sinceIso),
    supabase.from("xp_logs").select("user_id").gte("created_at", sinceIso),
  ] as const;

  const results = await Promise.all(queries.map((q) => q));
  for (const { data } of results) {
    for (const row of data ?? []) {
      const uid = (row as { user_id: string }).user_id;
      if (uid) ids.add(uid);
    }
  }
  return ids;
}

export async function getConversionFunnel(): Promise<FunnelStep[]> {
  const supabase = createAdminAnalyticsClient();

  const [
    { count: totalUsers },
    active7d,
    { data: paidSubs },
    { data: paidOrders },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_active", true),
    fetchActiveUserIdsSince(daysAgo(6)),
    supabase
      .from("user_subscriptions")
      .select("user_id, tier")
      .eq("program", "cambridge")
      .eq("status", "active")
      .in("tier", ["pro", "vip"]),
    supabase
      .from("subscription_payment_orders")
      .select("user_id")
      .eq("status", "paid"),
  ]);

  const signups = totalUsers ?? 0;
  const activeCount = active7d.size;
  const paidUserIds = new Set(
    ((paidSubs ?? []) as { user_id: string }[]).map((s) => s.user_id)
  );
  const paidCount = paidUserIds.size;

  const orderCountByUser = new Map<string, number>();
  for (const row of (paidOrders ?? []) as { user_id: string }[]) {
    orderCountByUser.set(row.user_id, (orderCountByUser.get(row.user_id) ?? 0) + 1);
  }
  const renewedCount = [...orderCountByUser.values()].filter((n) => n >= 2).length;

  function rate(current: number, previous: number): number | null {
    if (previous <= 0) return null;
    return Math.round((current / previous) * 1000) / 10;
  }

  const steps: FunnelStep[] = [
    { id: "signup", label: "Đăng ký", count: signups, rateFromPrevious: null },
    {
      id: "active7d",
      label: "Active 7 ngày",
      count: activeCount,
      rateFromPrevious: rate(activeCount, signups),
    },
    {
      id: "paid",
      label: "Pro / VIP",
      count: paidCount,
      rateFromPrevious: rate(paidCount, activeCount),
    },
    {
      id: "renewed",
      label: "Gia hạn (≥2 đơn)",
      count: renewedCount,
      rateFromPrevious: rate(renewedCount, paidCount),
    },
  ];

  return steps;
}
