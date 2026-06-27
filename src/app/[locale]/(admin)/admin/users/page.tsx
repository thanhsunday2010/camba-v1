import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { AdminModuleHub } from "@/components/admin/shell/admin-module-hub";
import { GraduationCap, School, Link2, BarChart3 } from "lucide-react";

export default async function AdminUsersHubPage() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "users.read")) redirect("/admin");

  return (
    <AdminModuleHub
      title="Quản trị người dùng"
      description="Quản lý học sinh, giáo viên, phụ huynh và tiến độ học tập."
      cards={[
        {
          id: "students",
          title: "Học sinh",
          description: "Danh sách và hồ sơ học sinh",
          href: "/admin/users/students",
          icon: GraduationCap,
        },
        {
          id: "teachers",
          title: "Giáo viên & Lớp",
          description: "Giáo viên, lớp học và bài tập đã giao",
          href: "/admin/users/teachers",
          icon: School,
        },
        {
          id: "parents",
          title: "Phụ huynh",
          description: "Liên kết phụ huynh – học sinh",
          href: "/admin/users/parents",
          icon: Link2,
        },
        {
          id: "progress",
          title: "Tiến độ học tập",
          description: "Tra cứu tiến độ và lượt làm bài",
          href: "/admin/users/progress",
          icon: BarChart3,
        },
      ]}
    />
  );
}
