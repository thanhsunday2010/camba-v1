import { describe, expect, it } from "vitest";
import { pivotSkillsToCurriculumUnits } from "./pivot-units";
import type { Skill } from "@/types/learning";

describe("pivotSkillsToCurriculumUnits", () => {
  it("groups units by slug across skills", () => {
    const skills: Skill[] = [
      {
        id: "s1",
        level_id: "l1",
        slug: "vocabulary",
        name: "Vocabulary",
        description: null,
        icon: null,
        sort_order: 0,
        units: [
          {
            id: "u1",
            skill_id: "s1",
            slug: "unit-1-family",
            title: "Unit 1: Family",
            description: null,
            sort_order: 0,
            unlock_after_unit_id: null,
            lessons: [
              {
                id: "lesson-1",
                unit_id: "u1",
                slug: "l1",
                title: "Vocab lesson",
                description: null,
                sort_order: 0,
                estimated_minutes: 10,
                unlock_after_lesson_id: null,
              },
            ],
          },
          {
            id: "u2",
            skill_id: "s1",
            slug: "unit-2-numbers",
            title: "Unit 2: Numbers",
            description: null,
            sort_order: 1,
            unlock_after_unit_id: null,
            lessons: [],
          },
        ],
      },
      {
        id: "s2",
        level_id: "l1",
        slug: "grammar",
        name: "Grammar",
        description: null,
        icon: null,
        sort_order: 1,
        units: [
          {
            id: "u3",
            skill_id: "s2",
            slug: "unit-1-family",
            title: "Unit 1: Family",
            description: null,
            sort_order: 0,
            unlock_after_unit_id: null,
            lessons: [],
          },
        ],
      },
    ];

    const result = pivotSkillsToCurriculumUnits(skills);

    expect(result).toHaveLength(2);
    expect(result[0].slug).toBe("unit-1-family");
    expect(result[0].hasContent).toBe(true);
    expect(result[0].lessonCount).toBe(1);
    expect(result[0].entries).toHaveLength(2);
    expect(result[1].slug).toBe("unit-2-numbers");
    expect(result[1].hasContent).toBe(false);
  });
});
