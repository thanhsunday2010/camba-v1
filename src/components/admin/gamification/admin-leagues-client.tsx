"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminLeagueRankingRow, AdminLeagueRow } from "@/lib/admin/gamification/types";

const TIER_LABELS: Record<string, string> = {
  bronze: "Đồng",
  silver: "Bạc",
  gold: "Vàng",
  platinum: "Bạch kim",
  diamond: "Kim cương",
  master: "Master",
  grandmaster: "Grandmaster",
  champion: "Champion",
};

interface AdminLeaguesClientProps {
  leagues: AdminLeagueRow[];
  rankings: AdminLeagueRankingRow[];
  selectedLeagueId: string | null;
}

export function AdminLeaguesClient({
  leagues,
  rankings,
  selectedLeagueId,
}: AdminLeaguesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function selectLeague(leagueId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("league", leagueId);
    startTransition(() => router.push(`/admin/gamification/leagues?${params.toString()}`));
  }

  const selected = leagues.find((l) => l.id === selectedLeagueId) ?? leagues[0];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Giải đấu theo tuần</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-gray-600">
                  <th className="px-4 py-3 font-medium">Tuần</th>
                  <th className="px-4 py-3 font-medium">Hạng</th>
                  <th className="px-4 py-3 font-medium">Người chơi</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {leagues.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      Chưa có giải đấu
                    </td>
                  </tr>
                ) : (
                  leagues.map((l) => (
                    <tr
                      key={l.id}
                      className={`border-b last:border-0 ${selected?.id === l.id ? "bg-violet-50" : ""}`}
                    >
                      <td className="px-4 py-3 text-xs">
                        {new Date(l.weekStart).toLocaleDateString("vi-VN")} –{" "}
                        {new Date(l.weekEnd).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{TIER_LABELS[l.tier] ?? l.tier}</Badge>
                      </td>
                      <td className="px-4 py-3">{l.participantCount}</td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant={selected?.id === l.id ? "default" : "outline"}
                          disabled={isPending}
                          onClick={() => selectLeague(l.id)}
                        >
                          Xem BXH
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Bảng xếp hạng — {TIER_LABELS[selected.tier] ?? selected.tier} (
              {new Date(selected.weekStart).toLocaleDateString("vi-VN")})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-gray-600">
                    <th className="px-4 py-3 font-medium">#</th>
                    <th className="px-4 py-3 font-medium">Học sinh</th>
                    <th className="px-4 py-3 font-medium">XP tuần</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                        Chưa có người tham gia
                      </td>
                    </tr>
                  ) : (
                    rankings.map((r) => (
                      <tr key={r.userId} className="border-b last:border-0">
                        <td className="px-4 py-3 font-medium">{r.rank ?? "—"}</td>
                        <td className="px-4 py-3">
                          <div>{r.userName}</div>
                          <div className="text-xs text-gray-500">{r.userEmail}</div>
                        </td>
                        <td className="px-4 py-3">{r.weeklyXp.toLocaleString("vi-VN")}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
