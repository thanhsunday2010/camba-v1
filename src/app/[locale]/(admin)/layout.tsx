import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { isAdmin } from "@/lib/auth/roles";
import { DashboardNav } from "@/components/layout/dashboard-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (!isAdmin(user.roles)) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={user} />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
