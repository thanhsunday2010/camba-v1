/**
 * Starters exercise factory — re-exports shared factory with level defaults.
 * Blueprints should prefer: createExerciseFactory("starters", topicTag)
 */

import { createExerciseFactory } from "./exercise-factory.mjs";

export const LEVEL = "starters";
export const TOPIC = "family-and-friends";

const factory = createExerciseFactory(LEVEL, TOPIC);

export const {
  buildMcq,
  buildMatching,
  buildGapFill,
  buildSentenceOrdering,
  buildExercise,
  buildPassage,
  buildListeningScript,
  buildVocabWord,
  buildGrammarRef,
  buildReadingExercise,
  buildListeningExercise,
  buildWritingCheck,
  buildSpeakingCheck,
  acceptableWord,
  orderingItems,
  orderingOrder,
  qScores,
  exScores,
} = factory;

export { createExerciseFactory };
