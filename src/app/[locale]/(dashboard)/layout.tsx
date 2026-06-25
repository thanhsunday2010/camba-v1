import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { fetchActiveProgramContext } from "@/actions/programs";
import { getUserGamification } from "@/lib/queries/user";
import { CambridgeProgramTheme, CelebrationProvider } from "@/components/camba";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const gamification = await getUserGamification(user.id);
  const programContext = await fetchActiveProgramContext(gamification);

  return (
    <CambridgeProgramTheme programSlug={programContext?.level?.slug}>
      <CelebrationProvider>
        <div className="min-h-screen bg-background camba-safe-x">
          <DashboardNav user={user} />
          <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6 camba-min-w-0">{children}</main>
        </div>
      </CelebrationProvider>
    </CambridgeProgramTheme>
  );
}
