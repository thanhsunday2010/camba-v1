import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { fetchActiveProgramContext } from "@/actions/programs";
import { listPlacementTests } from "@/actions/placement";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const programContext = await fetchActiveProgramContext();
  const placementTests = programContext?.programId
    ? await listPlacementTests(programContext.programId)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={user} placementTests={placementTests} />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
