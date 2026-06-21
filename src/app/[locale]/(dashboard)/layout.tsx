import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { fetchActiveProgramContext } from "@/actions/programs";
import { listPlacementTests } from "@/actions/placement";
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
  const placementTests = programContext?.programId
    ? await listPlacementTests(programContext.programId)
    : [];

  return (
    <CambridgeProgramTheme programSlug={programContext?.level?.slug}>
      <CelebrationProvider>
        <div className="min-h-screen bg-background">
          <DashboardNav user={user} placementTests={placementTests} />
          <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        </div>
      </CelebrationProvider>
    </CambridgeProgramTheme>
  );
}
