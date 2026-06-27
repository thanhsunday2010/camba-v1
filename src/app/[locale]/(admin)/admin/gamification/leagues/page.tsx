import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { getLeagueRankings, listLeagues } from "@/actions/admin/gamification";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";
import { AdminLeaguesClient } from "@/components/admin/gamification/admin-leagues-client";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ league?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "gamification.leagues")) redirect("/admin/gamification");

  const params = await searchParams;
  const leagues = await listLeagues();
  const selectedLeagueId = params.league ?? leagues[0]?.id ?? null;
  const rankings = selectedLeagueId ? await getLeagueRankings(selectedLeagueId) : [];

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Gamification › Giải đấu"
        title="Giải đấu tuần"
        description="Leagues và bảng xếp hạng XP tuần"
      />
      <AdminLeaguesClient
        leagues={leagues}
        rankings={rankings}
        selectedLeagueId={selectedLeagueId}
      />
    </div>
  );
}
