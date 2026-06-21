import { SectionHeader } from "@/components/camba/section-header";
import { StreakCard } from "@/components/camba/gamification/badge-streak-cards";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { cn } from "@/lib/utils";
import { todayDateString } from "@/lib/gamification/constants";
import { CalendarDays, Flame } from "lucide-react";

interface LearningStreakSectionProps {
  days: { activity_date: string; xp_earned: number; lessons_completed: number }[];
  currentStreak: number;
  bestStreak: number;
  labels: {
    title: string;
    subtitle: string;
    currentStreak: string;
    bestStreak: string;
    days: string;
    encouragement: string;
    calendarLabel: string;
    todayLabel: string;
    noStreakYet: string;
  };
}

export function LearningStreakSection({
  days,
  currentStreak,
  bestStreak,
  labels,
}: LearningStreakSectionProps) {
  const today = todayDateString();
  const activityMap = new Map(days.map((d) => [d.activity_date, d]));
  const cells: { date: string; active: boolean; intensity: number; isToday: boolean }[] = [];

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
      isToday: dateStr === today,
    });
  }

  const activeDays = cells.filter((c) => c.active).length;

  return (
    <section aria-labelledby="learning-streak-heading">
      <SectionHeader title={labels.title} description={labels.subtitle} icon={Flame} />

      <div className="grid gap-4 md:grid-cols-[minmax(0,240px)_1fr]">
        <StreakCard
          currentStreak={currentStreak}
          bestStreak={bestStreak}
          currentLabel={labels.currentStreak}
          bestLabel={labels.bestStreak}
          daysLabel={labels.days}
          encouragement={
            currentStreak > 0
              ? labels.encouragement
              : currentStreak === 0
                ? labels.noStreakYet
                : undefined
          }
          className={cn(currentStreak >= 3 && "ring-2 ring-[var(--color-streak)]/25 camba-streak-glow")}
        />

        <CambaCard variant="default" padding="md">
          <div className="flex items-center justify-between mb-3 gap-2">
            <p className="camba-caption text-muted font-semibold flex items-center gap-1.5 min-w-0">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span className="truncate">{labels.calendarLabel}</span>
            </p>
            <span className="camba-caption text-muted shrink-0">
              {activeDays}/35 {labels.days}
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5" role="img" aria-label={labels.calendarLabel}>
            {cells.map((cell) => (
              <div
                key={cell.date}
                title={cell.isToday ? labels.todayLabel : cell.date}
                className={cn(
                  "aspect-square rounded-md transition-all duration-200",
                  !cell.active && !cell.isToday && "bg-[var(--surface-sunken)]",
                  cell.intensity === 1 && "bg-program/30",
                  cell.intensity === 2 && "bg-program/60",
                  cell.intensity >= 3 && "camba-gradient-program shadow-sm",
                  cell.isToday && "ring-2 ring-program ring-offset-1",
                  cell.isToday && !cell.active && "bg-program-muted"
                )}
              />
            ))}
          </div>
        </CambaCard>
      </div>
    </section>
  );
}
