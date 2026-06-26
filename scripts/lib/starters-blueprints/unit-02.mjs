import {
  vocabularyBank,
  grammarReference,
  unit,
  passageMaiWeek,
  listeningScriptMaiAtSchool,
  listeningScriptBirthdayParty,
  listeningAnswerKeys,
  writingChecks,
  speakingChecks,
  TOPIC,
} from "./shared/numbers-and-time-content.mjs";
import { createStartersFactory } from "./shared/exercise-helpers.mjs";
import { vocabularyLessons } from "./unit-02/vocabulary.mjs";
import { grammarLessons } from "./unit-02/grammar.mjs";
import { readingLessons } from "./unit-02/reading.mjs";
import { listeningLessons } from "./unit-02/listening.mjs";
import { writingLessons } from "./unit-02/writing.mjs";
import { speakingLessons } from "./unit-02/speaking.mjs";

const factory = createStartersFactory();
const shared = {
  ...factory,
  topicTag: TOPIC,
  passageMaiWeek,
  listeningScriptMaiAtSchool,
  listeningScriptBirthdayParty,
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
