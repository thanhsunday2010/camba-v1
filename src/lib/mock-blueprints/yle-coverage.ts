import type {
  YleLevelSlug,
  YleMockCoverageRules,
  YleMockDifficultyPolicy,
  YleMockLevelMetadata,
} from "@/lib/mock-blueprints/yle-mock-blueprint-types";

/** Curriculum map version aligned in M1.1 — update when map bumps. */
export const YLE_CURRICULUM_MAP_VERSION = "1.2.0";

/** Stable seed level IDs — mirror scripts/lib/curriculum-map.mjs LEVEL_IDS. */
export const YLE_LEVEL_IDS: Record<YleLevelSlug, string> = {
  starters: "b0000000-0000-4000-8000-000000000002",
  movers: "b0000000-0000-4000-8000-000000000003",
  flyers: "b0000000-0000-4000-8000-000000000004",
};

export const YLE_LEVEL_METADATA: Record<YleLevelSlug, YleMockLevelMetadata> = {
  starters: {
    slug: "starters",
    displayTitle: "Cambridge Starters",
    examName: "Cambridge English Qualifications – Pre A1 Starters",
    cefrBand: "pre-a1",
    examFamily: "cambridge-yle",
    targetAgeBand: "7–9",
    description:
      "Practice mock blueprint for Pre A1 Starters — recognition-heavy listening and reading & writing.",
    curriculumMapVersion: YLE_CURRICULUM_MAP_VERSION,
    levelId: YLE_LEVEL_IDS.starters,
    recommendedDurationMinutes: 45,
    recommendedTotalQuestions: 25,
    recommendedTotalScore: 25,
  },
  movers: {
    slug: "movers",
    displayTitle: "Cambridge Movers",
    examName: "Cambridge English Qualifications – A1 Movers",
    cefrBand: "a1",
    examFamily: "cambridge-yle",
    targetAgeBand: "8–11",
    description:
      "Practice mock blueprint for A1 Movers — short texts, dialogues, and expanded listening tasks.",
    curriculumMapVersion: YLE_CURRICULUM_MAP_VERSION,
    levelId: YLE_LEVEL_IDS.movers,
    recommendedDurationMinutes: 55,
    recommendedTotalQuestions: 35,
    recommendedTotalScore: 35,
  },
  flyers: {
    slug: "flyers",
    displayTitle: "Cambridge Flyers",
    examName: "Cambridge English Qualifications – A2 Flyers",
    cefrBand: "a2",
    examFamily: "cambridge-yle",
    targetAgeBand: "9–12",
    description:
      "Practice mock blueprint for A2 Flyers — longer texts, inference, and cohesive completion tasks.",
    curriculumMapVersion: YLE_CURRICULUM_MAP_VERSION,
    levelId: YLE_LEVEL_IDS.flyers,
    recommendedDurationMinutes: 65,
    recommendedTotalQuestions: 40,
    recommendedTotalScore: 40,
  },
};

/**
 * Topic anchors per level — subset of curriculum map `vocabularyScope.themes`.
 * Full list lives in data/curriculum/cambridge-curriculum-map.json.
 */
export const YLE_TOPIC_ANCHORS: Record<YleLevelSlug, string[]> = {
  starters: [
    "Animals",
    "Family and friends",
    "Food and drink",
    "The home",
    "School",
    "Toys",
    "Transport",
    "Weather",
    "Colours",
    "Clothes",
  ],
  movers: [
    "Health",
    "Hobbies and free time",
    "Holidays",
    "Shopping",
    "Jobs",
    "Technology (basic)",
    "The world around us",
    "Sports and leisure",
    "Food and drink",
    "Transport",
  ],
  flyers: [
    "Environment and nature",
    "Culture and festivals",
    "Media and entertainment",
    "Feelings and opinions",
    "Travel and geography",
    "Rules and responsibilities",
    "Science and discovery (age-appropriate)",
    "School",
    "Sports and leisure",
    "Family and friends",
  ],
};

export function buildDefaultDifficultyPolicy(level: YleLevelSlug): YleMockDifficultyPolicy {
  switch (level) {
    case "starters":
      return {
        distribution: { easy: 0.5, medium: 0.4, hard: 0.1 },
        notes: "Starters mocks should feel encouraging — mostly recognition tasks.",
        progressionRules: [
          "Place easiest listening items in Part 1–2.",
          "Avoid more than 2 hard items in a row.",
          "End each section with medium items, not hard clusters.",
        ],
      };
    case "movers":
      return {
        distribution: { easy: 0.35, medium: 0.45, hard: 0.2 },
        notes: "Movers allows short inference and past-time markers.",
        progressionRules: [
          "Warm up with picture/word matching.",
          "Place story completion after dialogue MCQs.",
          "Cap hard items at 30% per section.",
        ],
      };
    case "flyers":
      return {
        distribution: { easy: 0.25, medium: 0.5, hard: 0.25 },
        notes: "Flyers includes inference and cohesive text completion.",
        progressionRules: [
          "Do not front-load all gap-fill hard items.",
          "Balance topics across sections.",
          "Reading parts should climb from detail → inference.",
        ],
      };
  }
}

export function buildDefaultCoverageRules(level: YleLevelSlug): YleMockCoverageRules {
  const topics = YLE_TOPIC_ANCHORS[level];
  return {
    topicCoverage: {
      minDistinctTopics: level === "starters" ? 5 : level === "movers" ? 6 : 7,
      maxSharePerTopic: 0.25,
      recommendedTopics: topics,
      sourceRef: "curriculum-map.vocabularyScope.themes",
    },
    grammarCoverage: {
      minDistinctPatterns: level === "starters" ? 4 : level === "movers" ? 6 : 8,
      recommendedPatterns: [],
      sourceRef: "curriculum-map.grammarScope.structures",
    },
    skillCoverage: {
      subskills:
        level === "starters"
          ? [
              "identifying detail",
              "following simple descriptions",
              "vocabulary recognition",
              "instruction-following",
            ]
          : level === "movers"
            ? [
                "identifying detail",
                "following short dialogues",
                "basic matching from context",
                "short reading comprehension",
                "simple completion patterns",
              ]
            : [
                "main idea and detail",
                "inference from context",
                "cohesive gap completion",
                "dialogue response selection",
                "chronological story understanding",
              ],
      minSubskillsRepresented: level === "starters" ? 3 : 4,
      sourceRef: "curriculum-map.readingSkills|listeningSkills",
    },
    repetitionGuardrails: {
      maxDuplicateStems: 0,
      maxSameCorrectAnswerPattern: 3,
      notes:
        "Avoid repeating the same stem template or correct-position pattern within one mock form.",
    },
  };
}

/** Lesson blueprint paths mock authoring may reuse for item pools (audit M1.1). */
export const YLE_LESSON_BLUEPRINT_REFS: Record<
  YleLevelSlug,
  { blueprintPath: string; generatedContentPath: string; reuseNotes: string }
> = {
  starters: {
    blueprintPath: "scripts/lib/starters-blueprints/",
    generatedContentPath: "data/content/starters/",
    reuseNotes:
      "Reuse vocabularyBank, passages, listening scripts from unit blueprints — do not duplicate topic lists.",
  },
  movers: {
    blueprintPath: "scripts/lib/movers-blueprints/",
    generatedContentPath: "data/content/movers/",
    reuseNotes: "U1 gold modular blueprint available; extend unit map before pooling U2–U10.",
  },
  flyers: {
    blueprintPath: "scripts/lib/flyers-blueprints/",
    generatedContentPath: "data/content/flyers/",
    reuseNotes: "U1 gold modular blueprint available; 12-unit curriculum map for topic spread.",
  },
};
