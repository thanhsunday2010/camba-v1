import { createAdminAnalyticsClient } from "@/lib/supabase/admin-analytics";
import {
  buildDateRange,
  computeDelta,
  formatDateLabel,
  rangeDays,
  toIsoDate,
  daysAgo,
} from "@/lib/admin/analytics/format";
import type {
  AdminDashboardStats,
  DashboardTimeRange,
  TimeSeriesPoint,
} from "@/lib/admin/analytics/types";

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function countByDate(rows: { created_at: string }[], dates: string[]): TimeSeriesPoint[] {
  const map = new Map<string, number>();
  for (const d of dates) map.set(d, 0);
  for (const row of rows) {
    const key = row.created_at.slice(0, 10);
    if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
  }
  return dates.map((date) => ({
    date,
    label: formatDateLabel(date),
    value: map.get(date) ?? 0,
  }));
}

function cumulativeSeries(newUsers: TimeSeriesPoint[], baseTotal: number): TimeSeriesPoint[] {
  let running = baseTotal;
  return newUsers.map((point) => {
    running += point.value;
    return { ...point, value: running };
  });
}

async function countProfilesBefore(isoDate: string): Promise<number> {
  const supabase = createAdminAnalyticsClient();
  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .lt("created_at", `${isoDate}T00:00:00.000Z`);
  return count ?? 0;
}

async function fetchActiveUserIds(since: Date, until?: Date): Promise<Set<string>> {
  const supabase = createAdminAnalyticsClient();
  const sinceIso = since.toISOString();
  const untilIso = until?.toISOString() ?? new Date().toISOString();
  const ids = new Set<string>();

  const queries = [
    supabase
      .from("exercise_attempts")
      .select("user_id, started_at")
      .gte("started_at", sinceIso)
      .lte("started_at", untilIso),
    supabase
      .from("lesson_progress")
      .select("user_id, updated_at")
      .gte("updated_at", sinceIso)
      .lte("updated_at", untilIso),
    supabase
      .from("mock_test_attempts")
      .select("user_id, started_at")
      .gte("started_at", sinceIso)
      .lte("started_at", untilIso),
    supabase
      .from("xp_logs")
      .select("user_id, created_at")
      .gte("created_at", sinceIso)
      .lte("created_at", untilIso),
    supabase
      .from("ai_usage_daily")
      .select("user_id, usage_date")
      .gte("usage_date", toIsoDate(since))
      .lte("usage_date", toIsoDate(until ?? new Date())),
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

export async function getAdminDashboardStats(
  timeRange: DashboardTimeRange = "30d",
  canViewRevenue = true
): Promise<AdminDashboardStats> {
  const supabase = createAdminAnalyticsClient();
  const days = rangeDays(timeRange);
  const dates = buildDateRange(days);
  const periodStart = daysAgo(days - 1);
  const prevPeriodStart = daysAgo(days * 2 - 1);
  const prevPeriodEnd = daysAgo(days);

  const today = toIsoDate(new Date());
  const todayStart = startOfDay(new Date());

  const [
    { count: totalUsers },
    { data: newProfiles },
    { data: prevNewProfiles },
    { data: paidOrders },
    { data: prevPaidOrders },
    { data: subscriptions },
    { count: pendingOrders },
    { count: pendingReview },
    { count: newUsersToday },
    { data: exercises },
    { count: programsCount },
    { count: lessonsCount },
    { count: exercisesCount },
    { count: questionsCount },
    { count: placementCount },
    { count: mockCount },
    { data: aiToday },
    { data: exerciseAttempts },
    { data: mockAttempts },
    { data: lessonProgress },
    { data: aiDaily },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase
      .from("profiles")
      .select("created_at")
      .gte("created_at", periodStart.toISOString()),
    supabase
      .from("profiles")
      .select("created_at")
      .gte("created_at", prevPeriodStart.toISOString())
      .lt("created_at", periodStart.toISOString()),
    supabase
      .from("subscription_payment_orders")
      .select("amount_vnd, tier, paid_at, status")
      .eq("status", "paid")
      .gte("paid_at", periodStart.toISOString()),
    supabase
      .from("subscription_payment_orders")
      .select("amount_vnd, paid_at, status")
      .eq("status", "paid")
      .gte("paid_at", prevPeriodStart.toISOString())
      .lt("paid_at", periodStart.toISOString()),
    supabase
      .from("user_subscriptions")
      .select("tier, program, status")
      .eq("program", "cambridge")
      .eq("status", "active"),
    supabase
      .from("subscription_payment_orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("exercises")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending_review"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", `${today}T00:00:00.000Z`),
    supabase.from("exercises").select("status"),
    supabase.from("programs").select("id", { count: "exact", head: true }),
    supabase.from("lessons").select("id", { count: "exact", head: true }),
    supabase.from("exercises").select("id", { count: "exact", head: true }),
    supabase.from("questions").select("id", { count: "exact", head: true }),
    supabase.from("placement_tests").select("id", { count: "exact", head: true }),
    supabase.from("mock_tests").select("id", { count: "exact", head: true }),
    supabase
      .from("ai_usage_daily")
      .select("ai_call_count")
      .eq("usage_date", today),
    supabase
      .from("exercise_attempts")
      .select("started_at")
      .gte("started_at", periodStart.toISOString()),
    supabase
      .from("mock_test_attempts")
      .select("started_at")
      .gte("started_at", periodStart.toISOString()),
    supabase
      .from("lesson_progress")
      .select("updated_at, completion_percent, mastered_at")
      .gte("updated_at", periodStart.toISOString())
      .or("completion_percent.gte.100,mastered_at.not.is.null"),
    supabase
      .from("ai_usage_daily")
      .select("usage_date, ai_call_count")
      .gte("usage_date", toIsoDate(periodStart)),
  ]);

  const newUsersSeries = countByDate(newProfiles ?? [], dates);
  const baseBefore = await countProfilesBefore(dates[0] ?? today);
  const cumulative = cumulativeSeries(newUsersSeries, Math.max(0, baseBefore));

  const newUsersCurrent = (newProfiles ?? []).length;
  const newUsersPrevious = (prevNewProfiles ?? []).length;

  type PaidOrder = { amount_vnd: number; tier: string; paid_at: string | null; status: string };
  type SubscriptionRow = { tier: string; program: string; status: string };
  type AiDailyRow = { usage_date: string; ai_call_count: number };
  type AiTodayRow = { ai_call_count: number };

  const revenueCurrent = ((paidOrders ?? []) as PaidOrder[]).reduce(
    (s, o) => s + (o.amount_vnd ?? 0),
    0
  );
  const revenuePrevious = ((prevPaidOrders ?? []) as PaidOrder[]).reduce(
    (s, o) => s + (o.amount_vnd ?? 0),
    0
  );

  const paidUsers = ((subscriptions ?? []) as SubscriptionRow[]).filter(
    (s) => s.tier === "pro" || s.tier === "vip"
  ).length;
  const totalUsersVal = totalUsers ?? 0;

  const [wauSet, prevWauSet, mauSet, prevMauSet, dauTodaySet] = await Promise.all([
    fetchActiveUserIds(daysAgo(6), new Date()),
    fetchActiveUserIds(daysAgo(13), daysAgo(7)),
    fetchActiveUserIds(daysAgo(29), new Date()),
    fetchActiveUserIds(daysAgo(59), daysAgo(30)),
    fetchActiveUserIds(todayStart, new Date()),
  ]);

  const tierLabels: Record<string, string> = {
    free: "Free",
    pro: "Pro",
    vip: "VIP",
  };
  const tierCounts = { free: 0, pro: 0, vip: 0 };
  for (const sub of (subscriptions ?? []) as SubscriptionRow[]) {
    if (sub.tier in tierCounts) tierCounts[sub.tier as keyof typeof tierCounts]++;
  }
  const freeEstimate = Math.max(0, totalUsersVal - tierCounts.pro - tierCounts.vip);
  tierCounts.free = freeEstimate;

  const revenueByDate = new Map<string, { pro: number; vip: number }>();
  for (const d of dates) revenueByDate.set(d, { pro: 0, vip: 0 });
  for (const order of (paidOrders ?? []) as PaidOrder[]) {
    if (!order.paid_at) continue;
    const key = order.paid_at.slice(0, 10);
    if (!revenueByDate.has(key)) continue;
    const bucket = revenueByDate.get(key)!;
    if (order.tier === "vip") bucket.vip += order.amount_vnd;
    else bucket.pro += order.amount_vnd;
  }

  const aiByDate = new Map<string, number>();
  for (const d of dates) aiByDate.set(d, 0);
  for (const row of (aiDaily ?? []) as AiDailyRow[]) {
    if (aiByDate.has(row.usage_date)) {
      aiByDate.set(row.usage_date, (aiByDate.get(row.usage_date) ?? 0) + row.ai_call_count);
    }
  }

  const learningActivity = dates.map((date) => ({
    date,
    label: formatDateLabel(date),
    exercises: ((exerciseAttempts ?? []) as { started_at: string }[]).filter((r) =>
      r.started_at.startsWith(date)
    ).length,
    mocks: ((mockAttempts ?? []) as { started_at: string }[]).filter((r) =>
      r.started_at.startsWith(date)
    ).length,
    lessons: ((lessonProgress ?? []) as { updated_at: string }[]).filter((r) =>
      r.updated_at.startsWith(date)
    ).length,
    aiCalls: aiByDate.get(date) ?? 0,
  }));

  const activeSampleDates = dates.slice(-14);
  const activeUsersDetailed = await Promise.all(
    activeSampleDates.map(async (date) => {
      const dayStart = new Date(`${date}T00:00:00.000Z`);
      const dayEnd = new Date(`${date}T23:59:59.999Z`);
      const daysFromEnd = dates.length - 1 - activeSampleDates.indexOf(date);
      const wauStart = daysAgo(6 + daysFromEnd);
      const mauStart = daysAgo(29 + daysFromEnd);
      const [dau, wau, mau] = await Promise.all([
        fetchActiveUserIds(dayStart, dayEnd),
        fetchActiveUserIds(wauStart, dayEnd),
        fetchActiveUserIds(mauStart, dayEnd),
      ]);
      return {
        date,
        label: formatDateLabel(date),
        dau: dau.size,
        wau: wau.size,
        mau: mau.size,
      };
    })
  );

  const publishedExercises = ((exercises ?? []) as { status: string }[]).filter(
    (e) => e.status === "published"
  ).length;

  return {
    timeRange,
    generatedAt: new Date().toISOString(),
    kpis: {
      totalUsers: computeDelta(totalUsersVal, totalUsersVal - newUsersCurrent),
      newUsers: computeDelta(newUsersCurrent, newUsersPrevious),
      wau: computeDelta(wauSet.size, prevWauSet.size),
      mau: computeDelta(mauSet.size, prevMauSet.size),
      paidUsers: computeDelta(paidUsers, paidUsers),
      revenueVnd: computeDelta(revenueCurrent, revenuePrevious),
      paidOrders: computeDelta((paidOrders ?? []).length, (prevPaidOrders ?? []).length),
      pendingOrders: pendingOrders ?? 0,
      conversionRate: computeDelta(
        totalUsersVal > 0 ? (paidUsers / totalUsersVal) * 100 : 0,
        totalUsersVal > 0 ? (paidUsers / totalUsersVal) * 100 : 0
      ),
    },
    userGrowth: {
      cumulative,
      newUsers: newUsersSeries,
    },
    revenue: dates.map((date) => {
      const bucket = revenueByDate.get(date) ?? { pro: 0, vip: 0 };
      return {
        date,
        label: formatDateLabel(date),
        pro: bucket.pro,
        vip: bucket.vip,
        total: bucket.pro + bucket.vip,
      };
    }),
    activeUsers: activeUsersDetailed,
    subscriptionMix: (["free", "pro", "vip"] as const).map((tier) => ({
      tier,
      label: tierLabels[tier],
      count: tierCounts[tier],
    })),
    learningActivity,
    operations: {
      pendingReview: pendingReview ?? 0,
      pendingOrders: pendingOrders ?? 0,
      newUsersToday: newUsersToday ?? 0,
      aiCallsToday: ((aiToday ?? []) as AiTodayRow[]).reduce((s, r) => s + r.ai_call_count, 0),
      dauToday: dauTodaySet.size,
    },
    content: {
      programs: programsCount ?? 0,
      lessons: lessonsCount ?? 0,
      exercises: exercisesCount ?? 0,
      questions: questionsCount ?? 0,
      placementTests: placementCount ?? 0,
      mockTests: mockCount ?? 0,
      publishedExercises,
      pendingExercises: pendingReview ?? 0,
    },
    canViewRevenue,
  };
}
