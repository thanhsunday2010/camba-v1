import {
  vocabularyBank,
  grammarReference,
  unit,
  passageMinhTV,
  listeningScriptTVChoices,
  listeningScriptCinemaNight,
  listeningAnswerKeys,
  writingChecks,
  speakingChecks,
  TOPIC,
} from "./shared/media-and-entertainment-content.mjs";
import { createFlyersFactory } from "./shared/exercise-helpers.mjs";
import { vocabularyLessons } from "./unit-04/vocabulary.mjs";
import { grammarLessons } from "./unit-04/grammar.mjs";
import { readingLessons } from "./unit-04/reading.mjs";
import { listeningLessons } from "./unit-04/listening.mjs";
import { writingLessons } from "./unit-04/writing.mjs";
import { speakingLessons } from "./unit-04/speaking.mjs";

const factory = createFlyersFactory();
const shared = {
  ...factory,
  topicTag: TOPIC,
  passageMinhTV,
  listeningScriptTVChoices,
  listeningScriptCinemaNight,
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
