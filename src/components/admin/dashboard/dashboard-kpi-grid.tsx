"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCompactNumber, formatPercent, formatVnd } from "@/lib/admin/analytics/format";
import type { KpiDelta } from "@/lib/admin/analytics/types";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  delta: KpiDelta;
  format?: "number" | "vnd" | "percent";
  highlight?: boolean;
}

function formatValue(value: number, format: KpiCardProps["format"]) {
  if (format === "vnd") return formatVnd(value);
  if (format === "percent") return `${value.toFixed(1)}%`;
  return formatCompactNumber(value);
}

function KpiCard({ label, delta, format = "number", highlight }: KpiCardProps) {
  const TrendIcon =
    delta.trend === "up" ? TrendingUp : delta.trend === "down" ? TrendingDown : Minus;

  return (
    <Card className={cn(highlight && "border-violet-200 bg-violet-50/30")}>
      <CardContent className="p-4">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{formatValue(delta.value, format)}</p>
        <div className="mt-2 flex items-center gap-1 text-xs">
          <TrendIcon
            className={cn(
              "h-3.5 w-3.5",
              delta.trend === "up" && "text-emerald-600",
              delta.trend === "down" && "text-rose-600",
              delta.trend === "flat" && "text-gray-400"
            )}
          />
          <span
            className={cn(
              "font-medium",
              delta.trend === "up" && "text-emerald-600",
              delta.trend === "down" && "text-rose-600",
              delta.trend === "flat" && "text-gray-500"
            )}
          >
            {formatPercent(delta.changePercent)}
          </span>
          <span className="text-gray-400">vs kỳ trước</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardKpiGridProps {
  kpis: {
    totalUsers: KpiDelta;
    newUsers: KpiDelta;
    wau: KpiDelta;
    mau: KpiDelta;
    paidUsers: KpiDelta;
    revenueVnd: KpiDelta;
    paidOrders: KpiDelta;
    pendingOrders: number;
    conversionRate: KpiDelta;
  };
  canViewRevenue: boolean;
}

export function DashboardKpiGrid({ kpis, canViewRevenue }: DashboardKpiGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KpiCard label="Tổng người dùng" delta={kpis.totalUsers} />
      <KpiCard label="User mới" delta={kpis.newUsers} highlight />
      <KpiCard label="WAU (7 ngày)" delta={kpis.wau} />
      <KpiCard label="MAU (30 ngày)" delta={kpis.mau} />
      {canViewRevenue && (
        <>
          <KpiCard label="Doanh thu" delta={kpis.revenueVnd} format="vnd" highlight />
          <KpiCard label="Đơn thanh toán" delta={kpis.paidOrders} />
          <KpiCard label="User trả phí" delta={kpis.paidUsers} />
          <KpiCard label="Tỷ lệ chuyển đổi" delta={kpis.conversionRate} format="percent" />
        </>
      )}
      {kpis.pendingOrders > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-amber-800">Đơn chờ thanh toán</p>
            <p className="mt-1 text-2xl font-bold text-amber-900">{kpis.pendingOrders}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
