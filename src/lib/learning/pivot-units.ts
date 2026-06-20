import type { LessonWithProgress, Skill } from "@/types/learning";

export interface CurriculumUnitEntry {
  skillSlug: string;
  skillName: string;
  skillSortOrder: number;
  lessons: LessonWithProgress[];
}

export interface CurriculumUnitGroup {
  slug: string;
  title: string;
  sortOrder: number;
  unitNumber: number;
  entries: CurriculumUnitEntry[];
  lessonCount: number;
  hasContent: boolean;
}

function parseUnitNumber(slug: string, metadata?: Record<string, unknown>): number {
  const fromMeta = metadata?.unitNumber;
  if (typeof fromMeta === "number") return fromMeta;
  const match = slug.match(/^unit-(\d+)-/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Pivot skill → units[] into curriculum unit groups (one row per thematic unit).
 * Matches cambridge-curriculum-map.json and bootstrap-curriculum unit shells.
 */
export function pivotSkillsToCurriculumUnits(skills: Skill[]): CurriculumUnitGroup[] {
  const groupMap = new Map<string, CurriculumUnitGroup>();

  for (const skill of skills) {
    for (const unit of skill.units ?? []) {
      const metadata = unit as { metadata?: Record<string, unknown> };
      const unitNumber = parseUnitNumber(unit.slug, metadata.metadata);
      const key = unit.slug;

      if (!groupMap.has(key)) {
        groupMap.set(key, {
          slug: unit.slug,
          title: unit.title,
          sortOrder: unit.sort_order,
          unitNumber,
          entries: [],
          lessonCount: 0,
          hasContent: false,
        });
      }

      const group = groupMap.get(key)!;
      const lessons = unit.lessons ?? [];

      group.entries.push({
        skillSlug: skill.slug,
        skillName: skill.name,
        skillSortOrder: skill.sort_order,
        lessons,
      });

      group.lessonCount += lessons.length;
      if (lessons.length > 0) group.hasContent = true;
    }
  }

  return [...groupMap.values()]
    .map((group) => ({
      ...group,
      entries: [...group.entries].sort((a, b) => a.skillSortOrder - b.skillSortOrder),
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.unitNumber - b.unitNumber);
}
