import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { isParent } from "@/lib/auth/roles";
import { ParentNav } from "@/components/layout/parent-nav";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (!isParent(user.roles)) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <ParentNav user={user} />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
