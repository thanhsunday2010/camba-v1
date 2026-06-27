"use client";

import {
  BookOpen,
  ClipboardCheck,
  FileText,
  Globe,
  Layers,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminContentTree, AdminMockTest, AdminPlacementTest } from "@/lib/admin/types";
import type { SuperAdminSection } from "@/components/admin/super-admin/super-admin-dashboard";

interface SuperAdminOverviewProps {
  content: AdminContentTree;
  pendingCount: number;
  placementTests: AdminPlacementTest[];
  mockTests: AdminMockTest[];
  onNavigate: (section: SuperAdminSection, panel?: string) => void;
}

export function SuperAdminOverview({
  content,
  pendingCount,
  placementTests,
  mockTests,
  onNavigate,
}: SuperAdminOverviewProps) {
  const published = content.exercises.filter((e) => e.status === "published").length;
  const draft = content.exercises.filter((e) => e.status === "draft").length;
  const pending = content.exercises.filter((e) => e.status === "pending_review").length;

  const stats = [
    { label: "Chương trình", value: content.programs.length },
    { label: "Bài học", value: content.lessons.length },
    { label: "Bài tập", value: content.exercises.length },
    { label: "Câu hỏi", value: content.questions.length },
    { label: "Placement test", value: placementTests.length },
    { label: "Mock test", value: mockTests.length },
  ];

  const quickLinks = [
    {
      section: "content" as const,
      panel: "tree",
      icon: Layers,
      title: "Quản lý nội dung",
      description: "Cây chương trình, bài học, bài tập và câu hỏi",
    },
    {
      section: "workflow" as const,
      icon: ClipboardCheck,
      title: "Duyệt nội dung",
      description: pendingCount > 0 ? `${pendingCount} bài chờ duyệt` : "Không có bài chờ duyệt",
    },
    {
      section: "assessments" as const,
      panel: "placement",
      icon: FileText,
      title: "Bài kiểm tra",
      description: "Placement test và mock test",
    },
    {
      section: "tools" as const,
      panel: "ai",
      icon: Sparkles,
      title: "Công cụ AI & Import",
      description: "Sinh câu hỏi AI, import/export nội dung",
    },
    {
      section: "site" as const,
      icon: Globe,
      title: "Nội dung trang web",
      description: "Chỉnh text UI theo locale",
    },
    {
      section: "platform" as const,
      icon: Wrench,
      title: "Nền tảng",
      description: "Người dùng, vai trò và cài đặt hệ thống",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trạng thái bài tập</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>Đã xuất bản: <strong className="text-gray-900">{published}</strong></span>
          <span>Nháp: <strong className="text-gray-900">{draft}</strong></span>
          <span>Chờ duyệt: <strong className="text-amber-700">{pending}</strong></span>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Truy cập nhanh
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.section}
                type="button"
                onClick={() => onNavigate(link.section, link.panel)}
                className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-left transition hover:border-violet-300 hover:shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold text-gray-900">{link.title}</span>
                  <span className="mt-0.5 block text-sm text-gray-500">{link.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Card className="border-violet-100 bg-violet-50/50">
        <CardContent className="flex items-start gap-3 p-4">
          <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
          <p className="text-sm text-violet-900">
            Bạn đang đăng nhập với quyền <strong>Super Admin</strong> — toàn quyền quản trị nội dung,
            bài kiểm tra, trang web và cài đặt nền tảng CAMBA.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
