import {
  vocabularyBank,
  grammarReference,
  unit,
  passageMinhHoliday,
  listeningScriptPackingPlans,
  listeningScriptHolidayStory,
  listeningAnswerKeys,
  writingChecks,
  speakingChecks,
  TOPIC,
} from "./shared/holidays-and-travel-content.mjs";
import { createMoversFactory } from "./shared/exercise-helpers.mjs";
import { vocabularyLessons } from "./unit-05/vocabulary.mjs";
import { grammarLessons } from "./unit-05/grammar.mjs";
import { readingLessons } from "./unit-05/reading.mjs";
import { listeningLessons } from "./unit-05/listening.mjs";
import { writingLessons } from "./unit-05/writing.mjs";
import { speakingLessons } from "./unit-05/speaking.mjs";

const factory = createMoversFactory();
const shared = {
  ...factory,
  topicTag: TOPIC,
  passageMinhHoliday,
  listeningScriptPackingPlans,
  listeningScriptHolidayStory,
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
