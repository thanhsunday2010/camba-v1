import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { isSuperAdmin } from "@/lib/auth/roles";
import { SuperAdminNav } from "@/components/layout/super-admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (!isSuperAdmin(user.roles)) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminNav user={user} />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
