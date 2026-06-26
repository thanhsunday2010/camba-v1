import { createClient } from "@/lib/supabase/server";

export type LessonCompleteNextCtaKind = "next-lesson" | "next-skill" | "next-unit";

export type LessonCompleteNextCta = {
  kind: LessonCompleteNextCtaKind;
  id: string;
  title: string;
  skillName?: string;
  unitTitle?: string;
};

export type CurriculumLessonNode = {
  id: string;
  title: string;
  sortOrder: number;
  unitSlug: string;
  unitTitle: string;
  unitNumber: number;
  skillId: string;
  skillName: string;
  skillSortOrder: number;
};

function parseUnitNumber(slug: string): number {
  const match = slug.match(/^unit-(\d+)-/);
  return match ? parseInt(match[1], 10) : 0;
}

export function sortCurriculumLessonSequence(
  nodes: CurriculumLessonNode[]
): CurriculumLessonNode[] {
  return [...nodes].sort((a, b) => {
    if (a.unitNumber !== b.unitNumber) return a.unitNumber - b.unitNumber;
    if (a.skillSortOrder !== b.skillSortOrder) return a.skillSortOrder - b.skillSortOrder;
    return a.sortOrder - b.sortOrder;
  });
}

export function resolveLessonCompleteNextCta(
  currentLessonId: string,
  sequence: CurriculumLessonNode[]
): LessonCompleteNextCta | null {
  const ordered = sortCurriculumLessonSequence(sequence);
  const currentIndex = ordered.findIndex((lesson) => lesson.id === currentLessonId);
  if (currentIndex < 0 || currentIndex >= ordered.length - 1) {
    return null;
  }

  const current = ordered[currentIndex];
  const next = ordered[currentIndex + 1];

  let kind: LessonCompleteNextCtaKind;
  if (next.unitSlug === current.unitSlug && next.skillId === current.skillId) {
    kind = "next-lesson";
  } else if (next.unitSlug === current.unitSlug) {
    kind = "next-skill";
  } else {
    kind = "next-unit";
  }

  return {
    kind,
    id: next.id,
    title: next.title,
    skillName: kind === "next-skill" ? next.skillName : undefined,
    unitTitle: kind === "next-unit" ? next.unitTitle : undefined,
  };
}

export async function fetchCurriculumLessonSequence(
  levelId: string
): Promise<CurriculumLessonNode[]> {
  const supabase = await createClient();

  const { data: skills } = await supabase
    .from("skills")
    .select("id, name, sort_order")
    .eq("level_id", levelId)
    .eq("is_active", true)
    .order("sort_order");

  if (!skills?.length) return [];

  const skillIds = skills.map((skill) => skill.id);
  const skillOrder = new Map(skills.map((skill) => [skill.id, skill.sort_order]));
  const skillNames = new Map(skills.map((skill) => [skill.id, skill.name]));

  const { data: units } = await supabase
    .from("units")
    .select("id, slug, title, skill_id")
    .in("skill_id", skillIds)
    .eq("is_active", true);

  if (!units?.length) return [];

  const unitIds = units.map((unit) => unit.id);

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, title, sort_order, unit_id")
    .in("unit_id", unitIds)
    .eq("is_active", true);

  if (!lessons?.length) return [];

  const unitMeta = new Map(units.map((unit) => [unit.id, unit]));

  return lessons.map((lesson) => {
    const unit = unitMeta.get(lesson.unit_id);
    const skillId = unit?.skill_id ?? "";
    const unitSlug = unit?.slug ?? "";

    return {
      id: lesson.id,
      title: lesson.title,
      sortOrder: lesson.sort_order,
      unitSlug,
      unitTitle: unit?.title ?? "",
      unitNumber: parseUnitNumber(unitSlug),
      skillId,
      skillName: skillNames.get(skillId) ?? "",
      skillSortOrder: skillOrder.get(skillId) ?? 0,
    };
  });
}

export async function resolveLessonCompleteNextCtaForUser(
  levelId: string,
  currentLessonId: string
): Promise<LessonCompleteNextCta | null> {
  const sequence = await fetchCurriculumLessonSequence(levelId);
  return resolveLessonCompleteNextCta(currentLessonId, sequence);
}
