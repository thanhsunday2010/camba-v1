import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Award, Lock } from "lucide-react";

export interface BadgeItem {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  earned: boolean;
  earnedAt: string | null;
}

interface BadgeGridProps {
  badges: BadgeItem[];
  title: string;
  emptyText: string;
}

export function BadgeGrid({ badges, title, emptyText }: BadgeGridProps) {
  if (badges.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">{emptyText}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={cn(
                "flex flex-col items-center text-center p-3 rounded-lg border",
                badge.earned
                  ? "border-warning/30 bg-warning/5"
                  : "border-gray-200 bg-gray-50 opacity-60"
              )}
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center mb-2",
                  badge.earned ? "bg-warning/20 text-warning" : "bg-gray-200 text-gray-400"
                )}
              >
                {badge.earned ? (
                  <Award className="h-5 w-5" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
              </div>
              <p className="text-xs font-medium text-gray-900 line-clamp-2">{badge.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
