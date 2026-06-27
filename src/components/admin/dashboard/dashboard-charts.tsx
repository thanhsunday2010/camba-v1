"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber, formatVnd } from "@/lib/admin/analytics/format";
import type { AdminDashboardStats } from "@/lib/admin/analytics/types";

const TIER_COLORS = { Free: "#9ca3af", Pro: "#7c3aed", VIP: "#f59e0b" };

interface DashboardChartsProps {
  stats: AdminDashboardStats;
}

export function DashboardCharts({ stats }: DashboardChartsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tăng trưởng người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="-mx-2 overflow-x-auto sm:mx-0">
              <div className="min-w-[300px]">
                <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={stats.userGrowth.cumulative}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatCompactNumber(Number(v ?? 0))} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Tổng user"
                  stroke="#7c3aed"
                  fill="#ede9fe"
                  strokeWidth={2}
                />
                </AreaChart>
              </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Đăng ký mới theo ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="-mx-2 overflow-x-auto sm:mx-0">
              <div className="min-w-[300px]">
                <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.userGrowth.newUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" name="User mới" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
              </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.canViewRevenue && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Doanh thu (Pro / VIP)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <Tooltip formatter={(v) => formatVnd(Number(v ?? 0))} />
                <Legend />
                <Bar dataKey="pro" name="Pro" stackId="a" fill="#7c3aed" />
                <Bar dataKey="vip" name="VIP" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Người dùng active (14 ngày gần nhất)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={stats.activeUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="dau" name="DAU" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="wau" name="WAU" stroke="#7c3aed" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="mau" name="MAU" stroke="#4f46e5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Phân bổ gói</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={stats.subscriptionMix}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {stats.subscriptionMix.map((entry) => (
                    <Cell
                      key={entry.tier}
                      fill={TIER_COLORS[entry.label as keyof typeof TIER_COLORS] ?? "#9ca3af"}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCompactNumber(Number(v ?? 0))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Hoạt động học tập</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.learningActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="exercises" name="Bài tập" fill="#7c3aed" radius={[2, 2, 0, 0]} />
              <Bar dataKey="mocks" name="Mock test" fill="#6366f1" radius={[2, 2, 0, 0]} />
              <Bar dataKey="lessons" name="Bài học" fill="#a78bfa" radius={[2, 2, 0, 0]} />
              <Bar dataKey="aiCalls" name="Lượt AI" fill="#f59e0b" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
