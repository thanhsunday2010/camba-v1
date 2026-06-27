import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  canAccess,
  canAccessAdminModule,
  USERS_MODULE_PERMISSIONS,
} from "@/lib/auth/admin-permissions";
import { AdminModuleHub } from "@/components/admin/shell/admin-module-hub";
import { GraduationCap, School, Link2, BarChart3 } from "lucide-react";
import type { AdminPermission } from "@/lib/auth/admin-permissions";

const USER_HUB_CARDS: {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: typeof GraduationCap;
  permission: AdminPermission;
}[] = [
  {
    id: "students",
    title: "Học sinh",
    description: "Danh sách và hồ sơ học sinh",
    href: "/admin/users/students",
    icon: GraduationCap,
    permission: "users.students",
  },
  {
    id: "teachers",
    title: "Giáo viên & Lớp",
    description: "Giáo viên, lớp học và bài tập đã giao",
    href: "/admin/users/teachers",
    icon: School,
    permission: "users.teachers",
  },
  {
    id: "parents",
    title: "Phụ huynh",
    description: "Liên kết phụ huynh – học sinh",
    href: "/admin/users/parents",
    icon: Link2,
    permission: "users.parents",
  },
  {
    id: "progress",
    title: "Tiến độ học tập",
    description: "Tra cứu tiến độ và lượt làm bài",
    href: "/admin/users/progress",
    icon: BarChart3,
    permission: "users.progress",
  },
];

export default async function AdminUsersHubPage() {
  const user = await getCurrentUser();
  if (!user || !canAccessAdminModule(user, USERS_MODULE_PERMISSIONS)) {
    redirect("/admin");
  }

  const cards = USER_HUB_CARDS.filter(
    (card) =>
      user.isSuperAdmin ||
      canAccess(user, "users.read") ||
      canAccess(user, card.permission)
  ).map(({ permission: _p, ...card }) => card);

  return (
    <AdminModuleHub
      title="Quản trị người dùng"
      description="Quản lý học sinh, giáo viên, phụ huynh và tiến độ học tập."
      cards={cards}
    />
  );
}
