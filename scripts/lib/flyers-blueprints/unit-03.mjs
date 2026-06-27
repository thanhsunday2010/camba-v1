import {
  vocabularyBank,
  grammarReference,
  unit,
  passageMinhFestival,
  listeningScriptSchoolFestival,
  listeningScriptNationalParade,
  listeningAnswerKeys,
  writingChecks,
  speakingChecks,
  TOPIC,
} from "./shared/culture-and-festivals-content.mjs";
import { createFlyersFactory } from "./shared/exercise-helpers.mjs";
import { vocabularyLessons } from "./unit-03/vocabulary.mjs";
import { grammarLessons } from "./unit-03/grammar.mjs";
import { readingLessons } from "./unit-03/reading.mjs";
import { listeningLessons } from "./unit-03/listening.mjs";
import { writingLessons } from "./unit-03/writing.mjs";
import { speakingLessons } from "./unit-03/speaking.mjs";

const factory = createFlyersFactory();
const shared = {
  ...factory,
  topicTag: TOPIC,
  passageMinhFestival,
  listeningScriptSchoolFestival,
  listeningScriptNationalParade,
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
