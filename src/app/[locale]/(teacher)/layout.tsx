import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { isTeacher } from "@/lib/auth/roles";
import { TeacherNav } from "@/components/layout/teacher-nav";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (!isTeacher(user.roles)) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNav user={user} />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
