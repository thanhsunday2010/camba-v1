"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber } from "@/lib/admin/analytics/format";
import type { FunnelStep } from "@/lib/admin/analytics/funnel";

const STEP_COLORS = ["#7c3aed", "#6366f1", "#4f46e5", "#f59e0b"];

interface DashboardFunnelChartProps {
  steps: FunnelStep[];
}

export function DashboardFunnelChart({ steps }: DashboardFunnelChartProps) {
  const chartData = steps.map((s) => ({
    name: s.label,
    count: s.count,
    rate: s.rateFromPrevious,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Phễu chuyển đổi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="-mx-2 overflow-x-auto sm:mx-0">
          <div className="min-w-[320px]">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) => formatCompactNumber(Number(v ?? 0))}
                  labelFormatter={(label, payload) => {
                    const rate = payload?.[0]?.payload?.rate;
                    return rate != null ? `${label} (${rate}% từ bước trước)` : label;
                  }}
                />
                <Bar dataKey="count" name="Số lượng" radius={[0, 4, 4, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={STEP_COLORS[i % STEP_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {steps.map((step) => (
            <div key={step.id} className="rounded-lg bg-gray-50 px-3 py-2 text-center">
              <p className="text-lg font-bold text-gray-900">
                {formatCompactNumber(step.count)}
              </p>
              <p className="text-xs text-gray-500">{step.label}</p>
              {step.rateFromPrevious != null && (
                <p className="text-xs text-violet-600">{step.rateFromPrevious}%</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
