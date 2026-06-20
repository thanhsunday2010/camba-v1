export const MAX_LEVEL = 100;
export const XP_PER_LEVEL = 500;

export const LEAGUE_TIER_THRESHOLDS = [
  { tier: "bronze" as const, minWeeklyXp: 0 },
  { tier: "silver" as const, minWeeklyXp: 200 },
  { tier: "gold" as const, minWeeklyXp: 500 },
  { tier: "platinum" as const, minWeeklyXp: 1000 },
  { tier: "diamond" as const, minWeeklyXp: 2000 },
  { tier: "master" as const, minWeeklyXp: 3500 },
  { tier: "grandmaster" as const, minWeeklyXp: 5000 },
  { tier: "champion" as const, minWeeklyXp: 7500 },
];

export function calculateLevelFromXp(totalXp: number): number {
  return Math.min(MAX_LEVEL, Math.floor(totalXp / XP_PER_LEVEL) + 1);
}

export function xpForNextLevel(currentLevel: number): number {
  if (currentLevel >= MAX_LEVEL) return 0;
  return currentLevel * XP_PER_LEVEL;
}

export function xpProgressInLevel(totalXp: number, level: number): number {
  if (level >= MAX_LEVEL) return 100;
  const xpAtLevelStart = (level - 1) * XP_PER_LEVEL;
  const xpInLevel = totalXp - xpAtLevelStart;
  return Math.round((xpInLevel / XP_PER_LEVEL) * 100);
}

export function getWeekBounds(date = new Date()): { weekStart: string; weekEnd: string } {
  const d = new Date(date);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    weekStart: monday.toISOString().split("T")[0],
    weekEnd: sunday.toISOString().split("T")[0],
  };
}

export function getTierFromWeeklyXp(weeklyXp: number): string {
  let tier = "bronze";
  for (const t of LEAGUE_TIER_THRESHOLDS) {
    if (weeklyXp >= t.minWeeklyXp) tier = t.tier;
  }
  return tier;
}

export function todayDateString(timezone = "Asia/Ho_Chi_Minh"): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(new Date());
}
