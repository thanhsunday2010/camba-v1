import type { SkillProgressRow } from "@/lib/queries/dashboard";

export interface EncouragementInput {
  programName?: string;
  skills: SkillProgressRow[];
  streak: number;
  missionsCompleted: number;
  missionsTotal: number;
  hasNextLesson: boolean;
}

export interface EncouragementMessages {
  program: string;
  topSkill: string;
  weakSkill: string;
  streak: string;
  missions: string;
  default: string;
  start: string;
}

function pickSkillExtremes(skills: SkillProgressRow[]) {
  const active = skills.filter((s) => s.progressPercent > 0);
  if (active.length === 0) return { top: null, weak: null };

  const sorted = [...active].sort((a, b) => b.progressPercent - a.progressPercent);
  return {
    top: sorted[0],
    weak: sorted[sorted.length - 1],
  };
}

/** Pick the most relevant Vietnamese encouragement line for the hero */
export function pickHeroEncouragement(
  input: EncouragementInput,
  messages: EncouragementMessages,
  skillLabels: Record<string, string>
): string {
  const { programName, skills, streak, missionsCompleted, missionsTotal, hasNextLesson } = input;

  if (missionsTotal > 0 && missionsCompleted === missionsTotal) {
    return messages.missions
      .replace("{done}", String(missionsCompleted))
      .replace("{total}", String(missionsTotal));
  }

  if (streak >= 3) {
    return messages.streak.replace("{streak}", String(streak));
  }

  const { top, weak } = pickSkillExtremes(skills);

  if (top && top.progressPercent >= 60) {
    const label = skillLabels[top.slug] ?? top.name;
    return messages.topSkill.replace("{skill}", label);
  }

  if (weak && weak.progressPercent > 0 && weak.progressPercent < 40) {
    const label = skillLabels[weak.slug] ?? weak.name;
    return messages.weakSkill.replace("{skill}", label);
  }

  if (programName) {
    return messages.program.replace("{program}", programName);
  }

  if (!hasNextLesson) {
    return messages.start;
  }

  return messages.default;
}

export function getTodayActivity(
  calendar: { activity_date: string; xp_earned: number; lessons_completed: number }[],
  today: string
) {
  const entry = calendar.find((d) => d.activity_date === today);
  return {
    xpToday: entry?.xp_earned ?? 0,
    lessonsToday: entry?.lessons_completed ?? 0,
  };
}
