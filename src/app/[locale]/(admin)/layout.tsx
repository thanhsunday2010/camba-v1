import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccessAdmin } from "@/lib/auth/roles";
import { getPendingReviewExercises } from "@/actions/admin/content";
import { AdminShell } from "@/components/admin/shell/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (!canAccessAdmin(user)) redirect("/dashboard");

  let pendingReview = 0;
  try {
    const pending = await getPendingReviewExercises();
    pendingReview = pending.length;
  } catch {
    pendingReview = 0;
  }

  return (
    <AdminShell user={user} pendingReview={pendingReview}>
      {children}
    </AdminShell>
  );
}
