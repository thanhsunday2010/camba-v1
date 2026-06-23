import {
  vocabularyBank,
  grammarReference,
  unit,
  passageMaiFamily,
  listeningScriptAtHome,
  listeningScriptAtSchool,
  listeningAnswerKeys,
  writingChecks,
  speakingChecks,
  TOPIC,
} from "./shared/family-and-friends-content.mjs";
import { createStartersFactory } from "./shared/exercise-helpers.mjs";
import { vocabularyLessons } from "./unit-01/vocabulary.mjs";
import { grammarLessons } from "./unit-01/grammar.mjs";
import { readingLessons } from "./unit-01/reading.mjs";
import { listeningLessons } from "./unit-01/listening.mjs";
import { writingLessons } from "./unit-01/writing.mjs";
import { speakingLessons } from "./unit-01/speaking.mjs";

const factory = createStartersFactory();
const shared = {
  ...factory,
  topicTag: TOPIC,
  passageMaiFamily,
  listeningScriptAtHome,
  listeningScriptAtSchool,
  listeningAnswerKeys,
  writingChecks,
  speakingChecks,
};

export default {
  vocabularyBank,
  grammarReference,
  unit,
  lessons: {
    vocabulary: vocabularyLessons(shared),
    grammar: grammarLessons(shared),
    reading: readingLessons(shared),
    listening: listeningLessons(shared),
    writing: writingLessons(shared),
    speaking: speakingLessons(shared),
  },
};
