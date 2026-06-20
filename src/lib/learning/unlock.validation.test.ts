import { describe, expect, it } from "vitest";
import {
  getEntryLessonIds,
  getLessonsUnlockedAfter,
  resolveNextUnlockLessonIds,
  getSortOrderSuccessorId,
} from "@/lib/learning/unlock";
import type { LessonUnlockNode } from "@/lib/learning/unlock";

const unitLessons: LessonUnlockNode[] = [
  {
    id: "lesson-1",
    unit_id: "unit-1",
    sort_order: 0,
    unlock_after_lesson_id: null,
  },
  {
    id: "lesson-2",
    unit_id: "unit-1",
    sort_order: 1,
    unlock_after_lesson_id: "lesson-1",
  },
  {
    id: "lesson-3",
    unit_id: "unit-1",
    sort_order: 2,
    unlock_after_lesson_id: null,
  },
];

describe("unlock model", () => {
  it("identifies entry lessons without prerequisites", () => {
    expect(getEntryLessonIds(unitLessons).sort()).toEqual(["lesson-1", "lesson-3"]);
  });

  it("unlocks explicit dependents via unlock_after_lesson_id", () => {
    expect(getLessonsUnlockedAfter("lesson-1", unitLessons)).toEqual(["lesson-2"]);
  });

  it("prefers explicit chain over sort_order fallback", () => {
    expect(resolveNextUnlockLessonIds("lesson-1", unitLessons)).toEqual(["lesson-2"]);
  });

  it("falls back to sort_order when no explicit dependents", () => {
    expect(resolveNextUnlockLessonIds("lesson-2", unitLessons)).toEqual(["lesson-3"]);
  });

  it("returns empty when no successor exists", () => {
    expect(getSortOrderSuccessorId("lesson-3", unitLessons)).toBeNull();
    expect(resolveNextUnlockLessonIds("lesson-3", unitLessons)).toEqual([]);
  });
});
