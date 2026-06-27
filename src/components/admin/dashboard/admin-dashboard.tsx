"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { DashboardKpiGrid } from "@/components/admin/dashboard/dashboard-kpi-grid";
import { DashboardCharts } from "@/components/admin/dashboard/dashboard-charts";
import { DashboardFunnelChart } from "@/components/admin/dashboard/dashboard-funnel-chart";
import { DashboardExportButton } from "@/components/admin/dashboard/dashboard-export-button";
import {
  DashboardContentSummaryPanel,
  DashboardOpsPanel,
} from "@/components/admin/dashboard/dashboard-ops-panel";
import { canAccess } from "@/lib/auth/admin-permissions";
import type { AdminDashboardStats, DashboardTimeRange } from "@/lib/admin/analytics/types";
import type { FunnelStep } from "@/lib/admin/analytics/funnel";
import type { AuthUser } from "@/types";

const RANGES: { id: DashboardTimeRange; labelKey: DashboardTimeRange }[] = [
  { id: "7d", labelKey: "7d" },
  { id: "30d", labelKey: "30d" },
  { id: "90d", labelKey: "90d" },
];

interface AdminDashboardProps {
  stats: AdminDashboardStats;
  funnel: FunnelStep[];
  user: AuthUser;
}

export function AdminDashboard({ stats, funnel, user }: AdminDashboardProps) {
  const t = useTranslations("admin.dashboard");
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeRange = (searchParams.get("range") as DashboardTimeRange) || stats.timeRange;

  function setRange(range: DashboardTimeRange) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    router.push(`/admin?${params.toString()}`);
  }

  const roleLabel = user.isSuperAdmin ? t("roleSuperAdmin") : t("roleAdmin");
  const canExport = user.isSuperAdmin || canAccess(user, "dashboard.export");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
            {t("eyebrow")}
          </p>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="mt-1 text-sm text-gray-500">{t("subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {canExport && <DashboardExportButton timeRange={activeRange} />}
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
                {t(`range.${r.labelKey}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-violet-100 bg-violet-50/50 px-4 py-3 text-sm text-violet-900">
        {t("sessionBanner", {
          role: roleLabel,
          time: new Date(stats.generatedAt).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
          }),
        })}
      </div>

      <DashboardKpiGrid kpis={stats.kpis} canViewRevenue={stats.canViewRevenue} />

      <DashboardFunnelChart steps={funnel} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
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
