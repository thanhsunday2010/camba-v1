import {
  vocabularyBank,
  grammarReference,
  unit,
  passageMaiToysAndRain,
  listeningScriptMaiToys,
  listeningScriptAnnaWeather,
  listeningAnswerKeys,
  writingChecks,
  speakingChecks,
  TOPIC,
} from "./shared/toys-and-weather-content.mjs";
import { createStartersFactory } from "./shared/exercise-helpers.mjs";
import { vocabularyLessons } from "./unit-05/vocabulary.mjs";
import { grammarLessons } from "./unit-05/grammar.mjs";
import { readingLessons } from "./unit-05/reading.mjs";
import { listeningLessons } from "./unit-05/listening.mjs";
import { writingLessons } from "./unit-05/writing.mjs";
import { speakingLessons } from "./unit-05/speaking.mjs";

const factory = createStartersFactory();
const shared = {
  ...factory,
  topicTag: TOPIC,
  passageMaiToysAndRain,
  listeningScriptMaiToys,
  listeningScriptAnnaWeather,
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
