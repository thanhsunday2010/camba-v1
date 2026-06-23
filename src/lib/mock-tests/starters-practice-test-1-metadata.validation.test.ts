import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { analyzeQuestionIntelligenceMetadata } from "@/lib/learning/question-metadata-validation";
import { analyzeContentCoverage } from "@/lib/learning/content-coverage";
import { buildMockTestSkillAnalyticsFromAttempt } from "@/lib/mock-tests/mock-test-skill-analytics-builder";
import { extractManifestQuestionMetadata } from "@/lib/learning/question-metadata";
import type { YleMockManifest } from "@/lib/mock-blueprints/yle-mock-manifest-types";
import type { QuestionResult } from "@/types/learning";

const MANIFEST_PATH = resolve(
  process.cwd(),
  "data/mock-tests/starters/starters-practice-test-1.json"
);

function loadManifest(): YleMockManifest {
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as YleMockManifest;
}

describe("starters practice test 1 metadata (M1.5.2)", () => {
  it("has zero intelligence metadata warnings", () => {
    const issues = analyzeQuestionIntelligenceMetadata(loadManifest());
    const metadataCodes = issues.map((i) => i.code);
    expect(metadataCodes).not.toContain("GRAMMAR_TAG_MISSING");
    expect(metadataCodes).not.toContain("VOCAB_TOPIC_MISSING");
    expect(metadataCodes).not.toContain("UNKNOWN_GRAMMAR_TAG");
    expect(metadataCodes).not.toContain("UNKNOWN_VOCAB_TOPIC");
    expect(issues).toHaveLength(0);
  });

  it("tags all 20 questions with grammar and vocabulary", () => {
    const report = analyzeContentCoverage(loadManifest());
    expect(report.totalQuestions).toBe(20);
    expect(report.taggedGrammarQuestions).toBe(20);
    expect(report.taggedVocabQuestions).toBe(20);
    expect(report.untaggedGrammarQuestionRefs).toHaveLength(0);
    expect(report.untaggedVocabQuestionRefs).toHaveLength(0);
  });

  it("keeps top grammar tag at or below 30% of questions", () => {
    const report = analyzeContentCoverage(loadManifest());
    const maxGrammar = Math.max(...Object.values(report.grammarCoverage));
    expect(maxGrammar).toBeLessThanOrEqual(6);
  });

  it("produces meaningful analytics for a mixed attempt", () => {
    const manifest = loadManifest();
    const questions = manifest.questions.map((q) => ({
      id: q.questionRef,
      content: {
        grammarTags: q.grammarTags,
        vocabularyTopics: q.vocabularyTopics,
      },
    }));

    const weakGrammarRefs = new Set([
      "listen-05",
      "listen-07",
      "rw-04",
      "rw-11",
      "rw-12",
    ]);
    const questionResults: QuestionResult[] = manifest.questions.map((q) => {
      const weak = weakGrammarRefs.has(q.questionRef);
      return {
        questionId: q.questionRef,
        isCorrect: !weak,
        pointsEarned: weak ? 0 : 1,
        maxPoints: 1,
        explanation: null,
      };
    });

    const analytics = buildMockTestSkillAnalyticsFromAttempt(questions, questionResults);
    expect(analytics.hasData).toBe(true);
    expect(analytics.grammarBreakdown.length).toBeGreaterThan(0);
    expect(analytics.vocabularyBreakdown.length).toBeGreaterThan(0);
    expect(
      analytics.grammarStrengths.length +
        analytics.grammarWeaknesses.length +
        analytics.vocabularyStrengths.length +
        analytics.vocabularyWeaknesses.length
    ).toBeGreaterThan(0);

    const meta = extractManifestQuestionMetadata(manifest.questions[0]!);
    expect(meta.grammarTags.length).toBeGreaterThan(0);
    expect(meta.vocabularyTopics.length).toBeGreaterThan(0);
  });
});
