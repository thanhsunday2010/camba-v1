import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

export interface DailyMissionItem {
  id: string;
  title: string;
  description: string | null;
  currentValue: number;
  targetValue: number;
  isCompleted: boolean;
  xpReward: number;
  coinReward: number;
}

interface DailyMissionsProps {
  missions: DailyMissionItem[];
  title: string;
  emptyText: string;
}

export function DailyMissions({ missions, title, emptyText }: DailyMissionsProps) {
  if (missions.length === 0) {
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
      <CardContent className="space-y-3">
        {missions.map((mission) => {
          const progress = Math.min(
            100,
            Math.round((mission.currentValue / mission.targetValue) * 100)
          );

          return (
            <div key={mission.id} className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  {mission.isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{mission.title}</p>
                    {mission.description && (
                      <p className="text-xs text-gray-500">{mission.description}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-primary font-medium shrink-0">
                  +{mission.xpReward} XP
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    mission.isCompleted ? "bg-success" : "bg-primary"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 text-right">
                {mission.currentValue}/{mission.targetValue}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
