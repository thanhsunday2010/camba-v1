import { describe, expect, it } from "vitest";
import moversPracticeTest1 from "../../../data/mock-tests/movers/movers-practice-test-1.json";
import startersPracticeTest1 from "../../../data/mock-tests/starters/starters-practice-test-1.json";
import {
  analyzeMockManifestQuality,
  GAP_FILL_RATIO_WARNING_THRESHOLD,
  MIN_DISTINCT_TASK_TYPES,
} from "@/lib/mock-tests/mock-manifest-quality";
import type { YleMockManifest } from "@/lib/mock-blueprints/yle-mock-manifest-types";

function manifestWithQuestions(
  questions: YleMockManifest["questions"],
  parts: YleMockManifest["parts"] = []
): YleMockManifest {
  return {
    metadata: {
      manifestId: "test-manifest",
      manifestVersion: "1.0.0",
      stableSlug: "test-manifest",
      blueprintId: "yle-starters-practice-v1",
      blueprintVersion: "1.0.0",
      levelSlug: "starters",
      title: "Test",
      description: "Test",
      formKind: "practice",
      levelId: "02000000-0000-4000-8000-000000000001",
      timeLimitMinutes: 30,
      totalScore: questions.length,
      status: "published",
      seedIds: {
        mockTestId: "02000001-0000-4000-8000-000000000099",
        containerUnitId: "u",
        containerLessonId: "l",
        containerExerciseId: "e",
        sectionIds: { listening: "s1" },
        questionIds: Object.fromEntries(questions.map((q) => [q.questionRef, q.questionRef])),
      },
    },
    sections: [
      {
        sectionSlug: "listening",
        title: "Listening",
        sortOrder: 0,
        skillSlug: "listening",
        timeLimitMinutes: 10,
        partSlugs: ["listening-part-1"],
        questionRefs: questions.map((q) => q.questionRef),
      },
    ],
    parts,
    questions,
    coverageAchieved: {
      distinctTopics: [],
      distinctGrammarPatterns: [],
      subskillsRepresented: [],
      difficultyCounts: { easy: 0, medium: 0, hard: 0 },
    },
  };
}

describe("mock manifest quality warnings", () => {
  it("warns when listening has no audio", () => {
    const manifest = manifestWithQuestions(
      [
        {
          questionRef: "l1",
          sectionSlug: "listening",
          partSlug: "listening-part-1",
          cambaQuestionType: "multiple_choice",
          blueprintQuestionType: "mcq_single",
          questionText: "Q?",
          points: 1,
          sortOrder: 0,
          difficulty: "easy",
          topicTag: "animals",
          skillTag: "listening",
          choices: [
            { text: "a", isCorrect: true, sortOrder: 0 },
            { text: "b", isCorrect: false, sortOrder: 1 },
          ],
        },
      ],
      [
        {
          partSlug: "listening-part-1",
          sectionSlug: "listening",
          partNumber: 1,
          title: "Listening",
          instructions: "Read the script.",
          contextType: "listening",
          passage: { title: "Script", text: "Hello world." },
        },
      ]
    );

    const codes = analyzeMockManifestQuality(manifest).map((i) => i.code);
    expect(codes).toContain("LISTENING_WITHOUT_AUDIO");
  });

  it("warns on excessive gap_fill ratio", () => {
    const questions = Array.from({ length: 10 }, (_, i) => ({
      questionRef: `g${i}`,
      sectionSlug: "listening",
      partSlug: "p",
      cambaQuestionType: "gap_fill" as const,
      blueprintQuestionType: "gap_fill" as const,
      questionText: "Fill",
      points: 1,
      sortOrder: i,
      difficulty: "easy" as const,
      topicTag: `topic-${i}`,
      skillTag: "listening",
      content: { template: "a [0] b", correctAnswers: ["x"] },
    }));

    const issues = analyzeMockManifestQuality(manifestWithQuestions(questions));
    const gapIssue = issues.find((i) => i.code === "EXCESSIVE_GAP_FILL");
    expect(gapIssue).toBeDefined();
    expect(gapIssue?.severity).toBe("warning");
    expect(GAP_FILL_RATIO_WARNING_THRESHOLD).toBe(0.55);
  });

  it("warns on thin task variety", () => {
    const questions = Array.from({ length: 6 }, (_, i) => ({
      questionRef: `m${i}`,
      sectionSlug: "listening",
      partSlug: "p",
      cambaQuestionType: "multiple_choice" as const,
      blueprintQuestionType: "mcq_single" as const,
      questionText: "Q?",
      points: 1,
      sortOrder: i,
      difficulty: "easy" as const,
      topicTag: `topic-${i}`,
      skillTag: "listening",
      choices: [
        { text: "a", isCorrect: true, sortOrder: 0 },
        { text: "b", isCorrect: false, sortOrder: 1 },
      ],
    }));

    const issues = analyzeMockManifestQuality(manifestWithQuestions(questions));
    expect(issues.some((i) => i.code === "THIN_TASK_VARIETY")).toBe(true);
    expect(MIN_DISTINCT_TASK_TYPES).toBe(3);
  });

  it("returns only warnings for starters T1 quality analysis", () => {
    const issues = analyzeMockManifestQuality(startersPracticeTest1 as YleMockManifest);
    expect(issues.every((i) => i.severity === "warning")).toBe(true);
  });

  it("reduces gap_fill dominance in rebalanced movers T1", () => {
    const manifest = moversPracticeTest1 as YleMockManifest;
    const gapCount = manifest.questions.filter((q) => q.cambaQuestionType === "gap_fill").length;
    const ratio = gapCount / manifest.questions.length;
    expect(ratio).toBeLessThanOrEqual(GAP_FILL_RATIO_WARNING_THRESHOLD);
  });
});
