import { describe, expect, it } from "vitest";
import {
  CAMBRIDGE_EXAM_BLUEPRINT_REGISTRY,
  CAMBRIDGE_TASK_TAXONOMY,
  getTasksForLevel,
  WRITING_DIMENSION_ORDER,
  SPEAKING_DIMENSION_ORDER,
} from "@/lib/cambridge-assessment";

const LEVELS = ["starters", "movers", "flyers", "ket", "pet"] as const;

describe("M2.0 Cambridge assessment architecture", () => {
  it("defines blueprints for all five exam levels", () => {
    for (const level of LEVELS) {
      const bp = CAMBRIDGE_EXAM_BLUEPRINT_REGISTRY[level];
      expect(bp.level).toBe(level);
      expect(bp.papers.length).toBeGreaterThan(0);
      expect(bp.totals.maxScore).toBeGreaterThan(0);
    }
  });

  it("includes writing and speaking AI parts in every level blueprint", () => {
    for (const level of LEVELS) {
      const bp = CAMBRIDGE_EXAM_BLUEPRINT_REGISTRY[level];
      const aiParts = bp.papers.flatMap((p) => p.parts).filter((part) => part.aiEvaluated);
      expect(aiParts.some((p) => p.skill === "writing" || p.skill === "speaking")).toBe(true);
    }
  });

  it("marks AI tasks as not auto-scored in taxonomy", () => {
    const aiTasks = Object.values(CAMBRIDGE_TASK_TAXONOMY).filter((t) => t.aiRequired);
    expect(aiTasks.length).toBeGreaterThan(0);
    expect(aiTasks.every((t) => !t.autoScored)).toBe(true);
  });

  it("exposes task types for each level", () => {
    for (const level of LEVELS) {
      expect(getTasksForLevel(level).length).toBeGreaterThan(5);
    }
  });

  it("defines five writing and five speaking evaluation dimensions", () => {
    expect(WRITING_DIMENSION_ORDER).toHaveLength(5);
    expect(SPEAKING_DIMENSION_ORDER).toHaveLength(5);
  });
});
