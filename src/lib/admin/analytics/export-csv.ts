import type { AdminDashboardStats } from "@/lib/admin/analytics/types";
import { formatVnd } from "@/lib/admin/analytics/format";

function escapeCsv(value: string | number): string {
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function row(cells: (string | number)[]): string {
  return cells.map(escapeCsv).join(",");
}

export function buildDashboardCsv(stats: AdminDashboardStats): string {
  const lines: string[] = [];

  lines.push("CAMBA Admin Dashboard Export");
  lines.push(`Generated,${stats.generatedAt}`);
  lines.push(`Time range,${stats.timeRange}`);
  lines.push("");

  lines.push("KPI,Value,Previous,Change %");
  const kpiEntries: [string, AdminDashboardStats["kpis"][keyof AdminDashboardStats["kpis"]]][] = [
    ["Total users", stats.kpis.totalUsers],
    ["New users", stats.kpis.newUsers],
    ["WAU", stats.kpis.wau],
    ["MAU", stats.kpis.mau],
    ["Paid users", stats.kpis.paidUsers],
    ["Conversion %", stats.kpis.conversionRate],
  ];
  if (stats.canViewRevenue) {
    kpiEntries.push(["Revenue VND", stats.kpis.revenueVnd]);
    kpiEntries.push(["Paid orders", stats.kpis.paidOrders]);
  }
  for (const [label, kpi] of kpiEntries) {
    if (typeof kpi === "number") continue;
    lines.push(
      row([
        label,
        kpi.value,
        kpi.previous,
        kpi.changePercent != null ? kpi.changePercent : "",
      ])
    );
  }
  lines.push("");

  lines.push("Date,New users,Cumulative users");
  for (let i = 0; i < stats.userGrowth.newUsers.length; i++) {
    const nu = stats.userGrowth.newUsers[i];
    const cu = stats.userGrowth.cumulative[i];
    lines.push(row([nu.date, nu.value, cu?.value ?? ""]));
  }
  lines.push("");

  if (stats.canViewRevenue) {
    lines.push("Date,Pro VND,VIP VND,Total VND");
    for (const r of stats.revenue) {
      lines.push(row([r.date, r.pro, r.vip, r.total]));
    }
    lines.push("");
  }

  lines.push("Date,DAU,WAU,MAU");
  for (const a of stats.activeUsers) {
    lines.push(row([a.date, a.dau, a.wau, a.mau]));
  }
  lines.push("");

  lines.push("Tier,Count");
  for (const s of stats.subscriptionMix) {
    lines.push(row([s.label, s.count]));
  }
  lines.push("");

  lines.push("Operations");
  lines.push(row(["Pending review", stats.operations.pendingReview]));
  lines.push(row(["Pending orders", stats.operations.pendingOrders]));
  lines.push(row(["New users today", stats.operations.newUsersToday]));
  lines.push(row(["AI calls today", stats.operations.aiCallsToday]));
  lines.push(row(["DAU today", stats.operations.dauToday]));

  return lines.join("\n");
}

export function dashboardCsvFilename(timeRange: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `camba-admin-dashboard-${timeRange}-${date}.csv`;
}

export { formatVnd };
