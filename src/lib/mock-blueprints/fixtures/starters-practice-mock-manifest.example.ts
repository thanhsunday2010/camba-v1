import type { YleMockManifestFixture } from "@/lib/mock-blueprints/yle-mock-manifest-types";
import { STARTERS_PRACTICE_MOCK_BLUEPRINT } from "@/lib/mock-blueprints/yle-mock-blueprints";
import { YLE_LEVEL_IDS } from "@/lib/mock-blueprints/yle-coverage";

/**
 * Small illustrative manifest — NOT a production mock bank.
 * Demonstrates M1.1 manifest contract + validation against Starters blueprint.
 */
export const STARTERS_PRACTICE_MOCK_MANIFEST_EXAMPLE: YleMockManifestFixture = {
  _fixtureNote:
    "M1.1 example fixture only. M1.2 will add importer from manifest → mock_tests tables.",
  metadata: {
    manifestId: "starters-practice-mini-001",
    manifestVersion: "1.0.0",
    blueprintId: STARTERS_PRACTICE_MOCK_BLUEPRINT.blueprintId,
    blueprintVersion: STARTERS_PRACTICE_MOCK_BLUEPRINT.blueprintVersion,
    levelSlug: "starters",
    title: "Starters Mini Practice (Example)",
    description: "Two-item example for manifest validation — not for student release.",
    formKind: "practice",
    levelId: YLE_LEVEL_IDS.starters,
    timeLimitMinutes: 10,
    totalScore: 2,
    status: "draft",
    authoringNotes: "Replace with full form in M1.2 generation pipeline.",
  },
  sections: [
    {
      sectionSlug: "listening",
      title: "Listening",
      sortOrder: 1,
      skillSlug: "listening",
      timeLimitMinutes: 5,
      partSlugs: ["listening-part-1-link"],
      questionRefs: ["q-listen-01"],
    },
    {
      sectionSlug: "reading-writing",
      title: "Reading & Writing",
      sortOrder: 2,
      skillSlug: "reading",
      timeLimitMinutes: 5,
      partSlugs: ["rw-part-1-match-words"],
      questionRefs: ["q-rw-01"],
    },
  ],
  questions: [
    {
      questionRef: "q-listen-01",
      partSlug: "listening-part-1-link",
      sectionSlug: "listening",
      sortOrder: 1,
      points: 1,
      blueprintQuestionType: "matching",
      cambaQuestionType: "matching",
      difficulty: "easy",
      topicTag: "family",
      skillTag: "listening",
      questionText: "Match the name to the person in the picture.",
      payload: {
        question_type: "matching",
        pairs: [],
        points: 1,
      },
    },
    {
      questionRef: "q-rw-01",
      partSlug: "rw-part-1-match-words",
      sectionSlug: "reading-writing",
      sortOrder: 1,
      points: 1,
      blueprintQuestionType: "mcq_image",
      cambaQuestionType: "image_selection",
      difficulty: "easy",
      topicTag: "toys",
      skillTag: "reading",
      questionText: "Which picture shows a ball?",
      payload: {
        question_type: "image_selection",
        choices: [],
        points: 1,
      },
    },
  ],
  coverageAchieved: {
    distinctTopics: ["family", "toys"],
    distinctGrammarPatterns: ["verb be"],
    subskillsRepresented: ["vocabulary recognition"],
    difficultyCounts: { easy: 2 },
  },
};
