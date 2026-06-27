import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber } from "@/lib/admin/analytics/format";
import type { DashboardContentSummary, DashboardOperations } from "@/lib/admin/analytics/types";

interface DashboardOpsPanelProps {
  operations: DashboardOperations;
}

export function DashboardOpsPanel({ operations }: DashboardOpsPanelProps) {
  const items = [
    {
      label: "Bài chờ duyệt",
      value: operations.pendingReview,
      href: "/admin/content/review",
      highlight: operations.pendingReview > 0,
    },
    {
      label: "Đơn thanh toán chờ",
      value: operations.pendingOrders,
      href: "/admin/subscriptions/orders",
      highlight: operations.pendingOrders > 0,
    },
    {
      label: "Đăng ký mới hôm nay",
      value: operations.newUsersToday,
      href: "/admin/users/students",
    },
    {
      label: "Active hôm nay (DAU)",
      value: operations.dauToday,
      href: "/admin/users/progress",
    },
    {
      label: "Lượt AI hôm nay",
      value: operations.aiCallsToday,
      href: "/admin/tools/ai-limits",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Vận hành hôm nay</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm transition hover:border-violet-200 hover:bg-violet-50/50"
          >
            <span className="text-gray-600">{item.label}</span>
            <span
              className={
                item.highlight
                  ? "font-bold text-amber-700"
                  : "font-semibold text-gray-900"
              }
            >
              {formatCompactNumber(item.value)}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

interface DashboardContentSummaryProps {
  content: DashboardContentSummary;
}

export function DashboardContentSummaryPanel({ content }: DashboardContentSummaryProps) {
  const stats = [
    { label: "Chương trình", value: content.programs },
    { label: "Bài học", value: content.lessons },
    { label: "Bài tập", value: content.exercises },
    { label: "Câu hỏi", value: content.questions },
    { label: "Đã xuất bản", value: content.publishedExercises },
    { label: "Chờ duyệt", value: content.pendingExercises },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Học liệu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg bg-gray-50 px-2 py-2 text-center">
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
        <Link
          href="/admin/content"
          className="mt-3 block text-center text-sm font-medium text-violet-600 hover:underline"
        >
          Quản lý nội dung →
        </Link>
      </CardContent>
    </Card>
  );
}
