import { CambaCard } from "@/components/camba/primitives/camba-card";
import { SectionHeader } from "@/components/camba/section-header";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

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
    <div>
      <SectionHeader title={title} icon={CalendarDays} />
      <CambaCard variant="default" padding="md">
        <div className="flex flex-wrap gap-4 camba-caption text-muted mb-4">
          <span>
            {currentLabel}:{" "}
            <strong className="text-[var(--color-streak)]">{currentStreak}</strong> {daysLabel}
          </span>
          <span>
            {bestLabel}: <strong className="text-foreground">{bestStreak}</strong> {daysLabel}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1.5" role="img" aria-label={title}>
          {cells.map((cell) => (
            <div
              key={cell.date}
              title={cell.date}
              className={cn(
                "aspect-square rounded-md transition-colors",
                !cell.active && "bg-[var(--surface-sunken)]",
                cell.intensity === 1 && "bg-program/25",
                cell.intensity === 2 && "bg-program/55",
                cell.intensity >= 3 && "camba-gradient-program"
              )}
            />
          ))}
        </div>
      </CambaCard>
    </div>
  );
}
