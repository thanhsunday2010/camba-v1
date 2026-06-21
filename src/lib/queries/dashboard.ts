import { createClient } from "@/lib/supabase/server";
import { fetchUserLessonProgress } from "@/lib/learning/lesson-progress-db";
import { getNextUnlockedLessonFast } from "@/lib/queries/learning";
import { SHIELD_SEGMENTS } from "@/lib/design/cambridge-programs";

export interface SkillProgressRow {
  slug: string;
  name: string;
  progressPercent: number;
}

export interface NextLessonContext {
  id: string;
  title: string;
  estimated_minutes: number;
  unitTitle: string | null;
  skillSlug: string | null;
  skillName: string | null;
  completionPercent: number;
  masteryLevel: number;
}

/** Aggregate lesson completion by skill for dashboard snapshot */
export async function getSkillProgressSnapshot(
  userId: string,
  levelId: string
): Promise<SkillProgressRow[]> {
  const supabase = await createClient();

  const { data: level } = await supabase
    .from("levels")
    .select("program_id")
    .eq("id", levelId)
    .single();

  if (!level) return [];

  const { data: skills } = await supabase
    .from("skills")
    .select("id, slug, name")
    .eq("level_id", levelId)
    .eq("is_active", true)
    .order("sort_order");

  if (!skills?.length) return [];

  const skillIds = skills.map((s) => s.id);

  const { data: units } = await supabase
    .from("units")
    .select("id, skill_id")
    .in("skill_id", skillIds)
    .eq("is_active", true);

  const unitIds = units?.map((u) => u.id) ?? [];
  if (!unitIds.length) {
    return skills.map((s) => ({ slug: s.slug, name: s.name, progressPercent: 0 }));
  }

  const unitToSkill = new Map(units!.map((u) => [u.id, u.skill_id]));

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, unit_id")
    .in("unit_id", unitIds)
    .eq("is_active", true);

  if (!lessons?.length) {
    return skills.map((s) => ({ slug: s.slug, name: s.name, progressPercent: 0 }));
  }

  const progressList = await fetchUserLessonProgress(supabase, userId, level.program_id);
  const progressMap = new Map(progressList.map((p) => [p.lesson_id, p]));

  const totals = new Map<string, { sum: number; count: number }>();

  for (const skill of skills) {
    totals.set(skill.id, { sum: 0, count: 0 });
  }

  for (const lesson of lessons) {
    const skillId = unitToSkill.get(lesson.unit_id);
    if (!skillId) continue;
    const bucket = totals.get(skillId);
    if (!bucket) continue;
    bucket.count += 1;
    const progress = progressMap.get(lesson.id);
    bucket.sum += Number(progress?.completion_percent ?? 0);
  }

  return skills.map((skill) => {
    const bucket = totals.get(skill.id)!;
    const progressPercent =
      bucket.count > 0 ? Math.round(bucket.sum / bucket.count) : 0;
    return { slug: skill.slug, name: skill.name, progressPercent };
  });
}

/** Map stored shield values (0–5 per skill) to filled crest segments */
export function computeShieldFilledSegments(
  shieldProgress: Record<string, number> | null | undefined
): number {
  const values = Object.values(shieldProgress ?? {}).filter((v) => typeof v === "number");
  if (values.length === 0) return 0;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.min(SHIELD_SEGMENTS, Math.max(0, Math.round(avg)));
}

/** Next unlocked lesson with unit / skill context for dashboard panels */
export async function getNextLessonContext(
  userId: string,
  levelId: string
): Promise<NextLessonContext | null> {
  const lesson = await getNextUnlockedLessonFast(userId, levelId);
  if (!lesson) return null;

  const supabase = await createClient();

  const { data: unit } = await supabase
    .from("units")
    .select("title, skill_id")
    .eq("id", lesson.unit_id)
    .maybeSingle();

  let skillSlug: string | null = null;
  let skillName: string | null = null;

  if (unit?.skill_id) {
    const { data: skill } = await supabase
      .from("skills")
      .select("slug, name")
      .eq("id", unit.skill_id)
      .maybeSingle();
    skillSlug = skill?.slug ?? null;
    skillName = skill?.name ?? null;
  }

  return {
    id: lesson.id,
    title: lesson.title,
    estimated_minutes: lesson.estimated_minutes,
    unitTitle: unit?.title ?? null,
    skillSlug,
    skillName,
    completionPercent: Number(lesson.progress?.completion_percent ?? 0),
    masteryLevel: lesson.progress?.mastery_level ?? 0,
  };
}
