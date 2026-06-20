import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StreakCalendarProps {
  days: { activity_date: string; xp_earned: number; lessons_completed: number }[];
  currentStreak: number;
  bestStreak: number;
  title: string;
  currentLabel: string;
  bestLabel: string;
  daysLabel: string;
}

export function StreakCalendar({
  days,
  currentStreak,
  bestStreak,
  title,
  currentLabel,
  bestLabel,
  daysLabel,
}: StreakCalendarProps) {
  const activityMap = new Map(days.map((d) => [d.activity_date, d]));
  const cells: { date: string; active: boolean; intensity: number }[] = [];

  for (let i = 34; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const activity = activityMap.get(dateStr);
    const xp = activity?.xp_earned ?? 0;
    cells.push({
      date: dateStr,
      active: !!activity,
      intensity: xp > 100 ? 3 : xp > 50 ? 2 : xp > 0 ? 1 : 0,
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <div className="flex gap-4 text-sm">
            <span className="text-gray-600">
              {currentLabel}: <strong className="text-primary">{currentStreak}</strong> {daysLabel}
            </span>
            <span className="text-gray-600">
              {bestLabel}: <strong>{bestStreak}</strong>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell) => (
            <div
              key={cell.date}
              title={cell.date}
              className={cn(
                "aspect-square rounded-sm",
                !cell.active && "bg-gray-100",
                cell.intensity === 1 && "bg-primary/30",
                cell.intensity === 2 && "bg-primary/60",
                cell.intensity >= 3 && "bg-primary"
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
