import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface LeagueRankingItem {
  userId: string;
  fullName: string;
  weeklyXp: number;
  rank: number | null;
}

interface LeagueBoardProps {
  rankings: LeagueRankingItem[];
  userRank: { rank: number | null; weeklyXp: number; tier: string } | null;
  tier: string;
  title: string;
  yourRankLabel: string;
  xpLabel: string;
  emptyText: string;
}

const tierLabels: Record<string, string> = {
  bronze: "Đồng",
  silver: "Bạc",
  gold: "Vàng",
  platinum: "Bạch kim",
  diamond: "Kim cương",
  master: "Cao thủ",
  grandmaster: "Đại cao thủ",
  champion: "Quán quân",
};

export function LeagueBoard({
  rankings,
  userRank,
  tier,
  title,
  yourRankLabel,
  xpLabel,
  emptyText,
}: LeagueBoardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4 text-warning" />
            {title}
          </CardTitle>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-warning/10 text-warning">
            {tierLabels[tier] ?? tier}
          </span>
        </div>
        {userRank && (
          <p className="text-sm text-gray-500">
            {yourRankLabel}: #{userRank.rank ?? "—"} • {formatNumber(userRank.weeklyXp)} {xpLabel}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {rankings.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">{emptyText}</p>
        ) : (
          <div className="space-y-2">
            {rankings.map((r, i) => (
              <div
                key={r.userId}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-bold w-6 text-center ${
                      i < 3 ? "text-warning" : "text-gray-400"
                    }`}
                  >
                    {r.rank ?? i + 1}
                  </span>
                  <span className="text-sm text-gray-900 truncate max-w-[140px]">
                    {r.fullName || "Học sinh"}
                  </span>
                </div>
                <span className="text-sm font-medium text-primary">
                  {formatNumber(r.weeklyXp)} XP
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
