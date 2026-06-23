import {
  vocabularyBank,
  grammarReference,
  unit,
  passageMinhFuturePlans,
  listeningScriptCareerTalk,
  listeningScriptScholarshipInfo,
  listeningAnswerKeys,
  writingChecks,
  speakingChecks,
  TOPIC,
} from "./shared/education-and-future-plans-content.mjs";
import { createPetFactory } from "./shared/exercise-helpers.mjs";
import { vocabularyLessons } from "./unit-01/vocabulary.mjs";
import { grammarLessons } from "./unit-01/grammar.mjs";
import { readingLessons } from "./unit-01/reading.mjs";
import { listeningLessons } from "./unit-01/listening.mjs";
import { writingLessons } from "./unit-01/writing.mjs";
import { speakingLessons } from "./unit-01/speaking.mjs";

const factory = createPetFactory();
const shared = {
  ...factory,
  topicTag: TOPIC,
  passageMinhFuturePlans,
  listeningScriptCareerTalk,
  listeningScriptScholarshipInfo,
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
