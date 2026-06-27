import {
  vocabularyBank,
  grammarReference,
  unit,
  passageMaiGettingDressed,
  listeningScriptGettingDressed,
  listeningScriptClothesShopping,
  listeningAnswerKeys,
  writingChecks,
  speakingChecks,
  TOPIC,
} from "./shared/colours-and-clothes-content.mjs";
import { createStartersFactory } from "./shared/exercise-helpers.mjs";
import { vocabularyLessons } from "./unit-03/vocabulary.mjs";
import { grammarLessons } from "./unit-03/grammar.mjs";
import { readingLessons } from "./unit-03/reading.mjs";
import { listeningLessons } from "./unit-03/listening.mjs";
import { writingLessons } from "./unit-03/writing.mjs";
import { speakingLessons } from "./unit-03/speaking.mjs";

const factory = createStartersFactory();
const shared = {
  ...factory,
  topicTag: TOPIC,
  passageMaiGettingDressed,
  listeningScriptGettingDressed,
  listeningScriptClothesShopping,
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
