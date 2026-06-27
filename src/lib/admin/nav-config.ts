import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  ClipboardCheck,
  CreditCard,
  FileText,
  Globe,
  LayoutDashboard,
  Settings,
  Sparkles,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";
import type { AdminPermission } from "@/lib/auth/admin-permissions";
import {
  ASSESSMENTS_MODULE_PERMISSIONS,
  CONTENT_MODULE_PERMISSIONS,
  GAMIFICATION_MODULE_PERMISSIONS,
  SUBSCRIPTIONS_MODULE_PERMISSIONS,
  SYSTEM_MODULE_PERMISSIONS,
  TOOLS_MODULE_PERMISSIONS,
  USERS_MODULE_PERMISSIONS,
} from "@/lib/auth/admin-permissions";

export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  permissions: AdminPermission[];
  badgeKey?: "pendingReview" | "pendingOrders";
}

export interface AdminNavGroup {
  id: string;
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    id: "main",
    label: "",
    items: [
      {
        id: "overview",
        label: "Tổng quan",
        href: "/admin",
        icon: LayoutDashboard,
        permissions: ["dashboard.read"],
      },
    ],
  },
  {
    id: "content",
    label: "Học liệu",
    items: [
      {
        id: "content",
        label: "Nội dung",
        href: "/admin/content",
        icon: BookOpen,
        permissions: CONTENT_MODULE_PERMISSIONS,
      },
      {
        id: "assessments",
        label: "Bài kiểm tra",
        href: "/admin/assessments",
        icon: FileText,
        permissions: ASSESSMENTS_MODULE_PERMISSIONS,
      },
      {
        id: "tools",
        label: "AI & Công cụ",
        href: "/admin/tools",
        icon: Sparkles,
        permissions: TOOLS_MODULE_PERMISSIONS,
      },
    ],
  },
  {
    id: "platform",
    label: "Nền tảng",
    items: [
      {
        id: "users",
        label: "Người dùng",
        href: "/admin/users",
        icon: Users,
        permissions: USERS_MODULE_PERMISSIONS,
      },
      {
        id: "subscriptions",
        label: "Đăng ký & TT",
        href: "/admin/subscriptions",
        icon: CreditCard,
        permissions: SUBSCRIPTIONS_MODULE_PERMISSIONS,
      },
      {
        id: "gamification",
        label: "Gamification",
        href: "/admin/gamification",
        icon: Trophy,
        permissions: GAMIFICATION_MODULE_PERMISSIONS,
      },
      {
        id: "site",
        label: "Trang web",
        href: "/admin/site",
        icon: Globe,
        permissions: ["site.read"],
      },
    ],
  },
  {
    id: "system",
    label: "Hệ thống",
    items: [
      {
        id: "system",
        label: "Hệ thống",
        href: "/admin/system",
        icon: Settings,
        permissions: SYSTEM_MODULE_PERMISSIONS,
      },
    ],
  },
];

export interface AdminModuleCard {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  permissions: AdminPermission[];
  statLabel?: string;
  badgeKey?: "pendingReview" | "pendingOrders";
}

export const CONTENT_MODULE_CARDS: AdminModuleCard[] = [
  {
    id: "programs",
    title: "Chương trình & Cấp độ",
    description: "Quản lý program, level và program_settings",
    href: "/admin/content/programs",
    icon: BookOpen,
    permissions: ["content.programs", "content.read"],
  },
  {
    id: "tree",
    title: "Cây nội dung",
    description: "Skill, unit — duyệt và chỉnh sửa cấu trúc",
    href: "/admin/content/tree",
    icon: BookOpen,
    permissions: ["content.read"],
  },
  {
    id: "lessons",
    title: "Bài học",
    description: "Danh sách và soạn bài học",
    href: "/admin/content/lessons",
    icon: BookOpen,
    permissions: ["content.lessons", "content.read"],
  },
  {
    id: "exercises",
    title: "Bài tập & Câu hỏi",
    description: "Soạn bài tập và câu hỏi",
    href: "/admin/content/exercises",
    icon: ClipboardCheck,
    permissions: ["content.exercises", "content.read"],
  },
  {
    id: "question-bank",
    title: "Ngân hàng câu hỏi",
    description: "Tìm kiếm và tái sử dụng câu hỏi",
    href: "/admin/content/question-bank",
    icon: BookOpen,
    permissions: ["content.read"],
  },
  {
    id: "review",
    title: "Duyệt & Xuất bản",
    description: "Hàng chờ duyệt và xuất bản bài tập",
    href: "/admin/content/review",
    icon: ClipboardCheck,
    permissions: ["workflow.review"],
    badgeKey: "pendingReview",
  },
];

export const SYSTEM_MODULE_CARDS: AdminModuleCard[] = [
  {
    id: "admins",
    title: "Quản lý Admin",
    description: "Gán vai trò và quyền cho admin",
    href: "/admin/system/admins",
    icon: Users,
    permissions: ["users.admin"],
  },
  {
    id: "settings",
    title: "Cài đặt nền tảng",
    description: "Feature flags và cấu hình hệ thống",
    href: "/admin/system/settings",
    icon: Wrench,
    permissions: ["platform.settings"],
  },
  {
    id: "audit",
    title: "Nhật ký & Bảo mật",
    description: "Audit log thao tác admin",
    href: "/admin/system/audit",
    icon: Settings,
    permissions: ["audit.read"],
  },
];
