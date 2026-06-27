"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { DashboardKpiGrid } from "@/components/admin/dashboard/dashboard-kpi-grid";
import { DashboardCharts } from "@/components/admin/dashboard/dashboard-charts";
import {
  DashboardContentSummaryPanel,
  DashboardOpsPanel,
} from "@/components/admin/dashboard/dashboard-ops-panel";
import type { AdminDashboardStats, DashboardTimeRange } from "@/lib/admin/analytics/types";
import type { AuthUser } from "@/types";

const RANGES: { id: DashboardTimeRange; label: string }[] = [
  { id: "7d", label: "7 ngày" },
  { id: "30d", label: "30 ngày" },
  { id: "90d", label: "90 ngày" },
];

interface AdminDashboardProps {
  stats: AdminDashboardStats;
  user: AuthUser;
}

export function AdminDashboard({ stats, user }: AdminDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeRange = (searchParams.get("range") as DashboardTimeRange) || stats.timeRange;

  function setRange(range: DashboardTimeRange) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    router.push(`/admin?${params.toString()}`);
  }

  const roleLabel = user.isSuperAdmin
    ? "Super Admin"
    : "Admin";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">Bảng điều khiển</p>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan Camba</h1>
          <p className="mt-1 text-sm text-gray-500">
            Thống kê tăng trưởng và vận hành nền tảng
          </p>
        </div>
        <div className="flex rounded-xl bg-gray-100 p-1">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                activeRange === r.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-violet-100 bg-violet-50/50 px-4 py-3 text-sm text-violet-900">
        Bạn đang đăng nhập với quyền <strong>{roleLabel}</strong>.
        Cập nhật lúc{" "}
        {new Date(stats.generatedAt).toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
        })}
        .
      </div>

      <DashboardKpiGrid kpis={stats.kpis} canViewRevenue={stats.canViewRevenue} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardCharts stats={stats} />
        </div>
        <div className="space-y-4">
          <DashboardOpsPanel operations={stats.operations} />
          <DashboardContentSummaryPanel content={stats.content} />
        </div>
      </div>
    </div>
  );
}
