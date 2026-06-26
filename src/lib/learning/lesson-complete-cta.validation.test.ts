import { describe, expect, it } from "vitest";
import {
  resolveLessonCompleteNextCta,
  sortCurriculumLessonSequence,
  type CurriculumLessonNode,
} from "@/lib/learning/lesson-complete-cta";

function node(
  id: string,
  overrides: Partial<CurriculumLessonNode> = {}
): CurriculumLessonNode {
  return {
    id,
    title: id,
    sortOrder: 0,
    unitSlug: "unit-01-a",
    unitTitle: "Unit 1",
    unitNumber: 1,
    skillId: "skill-vocab",
    skillName: "Vocabulary",
    skillSortOrder: 0,
    ...overrides,
  };
}

describe("resolveLessonCompleteNextCta", () => {
  const sequence: CurriculumLessonNode[] = [
    node("v1", { sortOrder: 0, skillId: "skill-vocab", skillSortOrder: 0 }),
    node("v2", { sortOrder: 1, skillId: "skill-vocab", skillSortOrder: 0 }),
    node("g1", {
      sortOrder: 0,
      skillId: "skill-grammar",
      skillName: "Grammar",
      skillSortOrder: 1,
    }),
    node("s-last", {
      sortOrder: 2,
      skillId: "skill-speaking",
      skillName: "Speaking",
      skillSortOrder: 5,
    }),
    node("u2-v1", {
      sortOrder: 0,
      unitSlug: "unit-02-b",
      unitTitle: "Unit 2",
      unitNumber: 2,
      skillId: "skill-vocab",
      skillSortOrder: 0,
    }),
  ];

  it("returns next-lesson within the same skill", () => {
    const result = resolveLessonCompleteNextCta("v1", sequence);
    expect(result?.kind).toBe("next-lesson");
    expect(result?.id).toBe("v2");
  });

  it("returns next-skill at the end of a skill block", () => {
    const result = resolveLessonCompleteNextCta("v2", sequence);
    expect(result?.kind).toBe("next-skill");
    expect(result?.id).toBe("g1");
    expect(result?.skillName).toBe("Grammar");
  });

  it("returns next-unit after the final lesson in a unit", () => {
    const result = resolveLessonCompleteNextCta("s-last", sequence);
    expect(result?.kind).toBe("next-unit");
    expect(result?.id).toBe("u2-v1");
    expect(result?.unitTitle).toBe("Unit 2");
  });

  it("sorts by unit number, skill order, then lesson order", () => {
    const unsorted = [sequence[2], sequence[0], sequence[4], sequence[1]];
    const ordered = sortCurriculumLessonSequence(unsorted).map((item) => item.id);
    expect(ordered).toEqual(["v1", "v2", "g1", "u2-v1"]);
  });
});
