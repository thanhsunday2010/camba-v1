import { describe, expect, it } from "vitest";
import startersPracticeTest1 from "../../../data/mock-tests/starters/starters-practice-test-1.json";
import { analyzeQuestionIntelligenceMetadata } from "@/lib/learning/question-metadata-validation";
import type { YleMockManifest } from "@/lib/mock-blueprints/yle-mock-manifest-types";

describe("question intelligence metadata validation", () => {
  it("warns on unknown grammar and vocab tags", () => {
    const manifest: YleMockManifest = {
      metadata: {
        manifestId: "test",
        manifestVersion: "1",
        blueprintId: "yle-starters-practice-v1",
        blueprintVersion: "1",
        levelSlug: "starters",
        title: "Test",
        description: null,
        formKind: "practice",
        levelId: "b0000000-0000-4000-8000-000000000002",
        timeLimitMinutes: 30,
        totalScore: 1,
        status: "published",
      },
      sections: [
        {
          sectionSlug: "reading-writing",
          title: "RW",
          sortOrder: 0,
          skillSlug: "reading",
          timeLimitMinutes: 10,
          partSlugs: ["rw"],
          questionRefs: ["q1"],
        },
      ],
      questions: [
        {
          questionRef: "q1",
          partSlug: "rw",
          sectionSlug: "reading-writing",
          sortOrder: 0,
          points: 1,
          blueprintQuestionType: "mcq_single",
          cambaQuestionType: "multiple_choice",
          difficulty: "easy",
          topicTag: "family",
          skillTag: "reading",
          grammarTags: ["not_real_grammar"],
          vocabularyTopics: ["not_real_vocab"],
          questionText: "Pick one",
          choices: [
            { text: "a", isCorrect: true, sortOrder: 0 },
            { text: "b", isCorrect: false, sortOrder: 1 },
          ],
        },
      ],
    };

    const issues = analyzeQuestionIntelligenceMetadata(manifest);
    expect(issues.some((i) => i.code === "UNKNOWN_GRAMMAR_TAG")).toBe(true);
    expect(issues.some((i) => i.code === "UNKNOWN_VOCAB_TOPIC")).toBe(true);
    expect(issues.every((i) => i.severity === "warning")).toBe(true);
  });

  it("starters practice test 1 is fully tagged with zero metadata warnings (M1.5.2)", () => {
    const issues = analyzeQuestionIntelligenceMetadata(
      startersPracticeTest1 as YleMockManifest
    );
    expect(issues).toHaveLength(0);
  });
});
