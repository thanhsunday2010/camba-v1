import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import {
  getEntryLessonIds,
  getLessonsUnlockedAfter,
  type LessonUnlockNode,
} from "@/lib/learning/unlock";

export type LevelLessonNode = LessonUnlockNode & {
  skill_sort_order: number;
  unit_sort_order: number;
};

/** First lesson in a level: Unit 1, Vocabulary skill (sequential path entry). */
export async function getFirstLessonIdForLevel(
  supabase: SupabaseClient<Database>,
  levelId: string
): Promise<string | null> {
  const { data: skill } = await supabase
    .from("skills")
    .select("id")
    .eq("level_id", levelId)
    .eq("slug", "vocabulary")
    .eq("is_active", true)
    .maybeSingle();

  if (!skill) return null;

  const { data: unit } = await supabase
    .from("units")
    .select("id")
    .eq("skill_id", skill.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!unit) return null;

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id")
    .eq("unit_id", unit.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  return lesson?.id ?? null;
}

export async function fetchLevelLessonUnlockNodes(
  supabase: SupabaseClient<Database>,
  levelId: string
): Promise<LevelLessonNode[]> {
  const { data: skills } = await supabase
    .from("skills")
    .select("id, sort_order")
    .eq("level_id", levelId)
    .eq("is_active", true)
    .order("sort_order");

  if (!skills?.length) return [];

  const skillIds = skills.map((s) => s.id);
  const skillOrder = new Map(skills.map((s) => [s.id, s.sort_order]));

  const { data: units } = await supabase
    .from("units")
    .select("id, skill_id, sort_order")
    .in("skill_id", skillIds)
    .eq("is_active", true)
    .order("sort_order");

  if (!units?.length) return [];

  const unitIds = units.map((u) => u.id);
  const unitOrder = new Map(units.map((u) => [u.id, u.sort_order]));
  const unitSkill = new Map(units.map((u) => [u.id, u.skill_id]));

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, unit_id, sort_order, unlock_after_lesson_id")
    .in("unit_id", unitIds)
    .eq("is_active", true)
    .order("sort_order");

  return (lessons ?? []).map((lesson) => ({
    id: lesson.id,
    unit_id: lesson.unit_id,
    sort_order: lesson.sort_order,
    unlock_after_lesson_id: lesson.unlock_after_lesson_id,
    skill_sort_order: skillOrder.get(unitSkill.get(lesson.unit_id) ?? "") ?? 0,
    unit_sort_order: unitOrder.get(lesson.unit_id) ?? 0,
  }));
}

/** Lessons to unlock after completing a lesson anywhere in the level. */
export function resolveNextUnlockLessonIdsInLevel(
  completedLessonId: string,
  levelLessons: LevelLessonNode[]
): string[] {
  return getLessonsUnlockedAfter(completedLessonId, levelLessons);
}

export function getSequentialEntryLessonIds(levelLessons: LevelLessonNode[]): string[] {
  const first = [...levelLessons].sort((a, b) => {
    if (a.unit_sort_order !== b.unit_sort_order) {
      return a.unit_sort_order - b.unit_sort_order;
    }
    if (a.skill_sort_order !== b.skill_sort_order) {
      return a.skill_sort_order - b.skill_sort_order;
    }
    return a.sort_order - b.sort_order;
  })[0];

  if (first) return [first.id];

  return getEntryLessonIds(levelLessons);
}
