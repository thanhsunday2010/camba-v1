import type { KpiDelta } from "@/lib/admin/analytics/types";

export function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export function formatPercent(value: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function computeDelta(current: number, previous: number): KpiDelta {
  if (previous === 0) {
    return {
      value: current,
      previous,
      changePercent: current === 0 ? 0 : null,
      trend: current > previous ? "up" : current < previous ? "down" : "flat",
    };
  }
  const changePercent = ((current - previous) / previous) * 100;
  return {
    value: current,
    previous,
    changePercent,
    trend: changePercent > 0.5 ? "up" : changePercent < -0.5 ? "down" : "flat",
  };
}

export function formatDateLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}`;
}

export function daysAgo(n: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

export function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function rangeDays(timeRange: "7d" | "30d" | "90d"): number {
  if (timeRange === "7d") return 7;
  if (timeRange === "90d") return 90;
  return 30;
}

export function buildDateRange(days: number): string[] {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(toIsoDate(daysAgo(i)));
  }
  return dates;
}
