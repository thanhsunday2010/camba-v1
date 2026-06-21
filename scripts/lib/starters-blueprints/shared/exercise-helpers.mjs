/**
 * Shared helpers for gold Starters blueprints.
 */
import { createExerciseFactory } from "../exercise-factory.mjs";
import {
  lessonShell,
  addReviewFromCheck,
  cloneAsReview,
  findCheckExercise,
} from "../unit-assembler.mjs";

export function factoryFor(topicTag) {
  return createExerciseFactory("starters", topicTag);
}

export { lessonShell, addReviewFromCheck, cloneAsReview, findCheckExercise };

export function fivePhase({
  factory,
  slugBase,
  skillTag,
  labels,
  learn,
  practice,
  check,
  apply,
}) {
  const {
    buildExercise,
    buildMcq,
    buildMatching,
    buildGapFill,
    buildSentenceOrdering,
    buildReadingExercise,
    buildListeningExercise,
    buildWritingCheck,
    buildSpeakingCheck,
    exScores,
    orderingItems,
    orderingOrder,
    acceptableWord,
  } = factory;

  const mk = (phase, sort, def) => {
    if (!def) return null;
    const slug = `${slugBase}-${phase}`;
    const title = `${labels[phase]}: ${def.title ?? labels[phase]}`;
    if (def.type === "mcq") {
      return buildExercise({
        slug,
        title,
        instructions: def.instructions ?? "Read each sentence. Choose the best answer.",
        exerciseType: "multiple_choice",
        sortOrder: sort,
        qualityScores: phase === "check" ? exScores(0.32) : undefined,
        questions: def.questions.map((q) => buildMcq({ skillTag, ...q })),
      });
    }
    if (def.type === "matching") {
      return buildExercise({
        slug,
        title,
        instructions: def.instructions ?? "Match each item correctly.",
        exerciseType: "matching",
        sortOrder: sort,
        questions: [
          buildMatching({
            questionText: def.questionText ?? "Match the items.",
            skillTag,
            explanation: def.explanation,
            pairs: def.pairs,
          }),
        ],
      });
    }
    if (def.type === "gap_fill") {
      return buildExercise({
        slug,
        title,
        instructions: def.instructions ?? "Complete the sentences.",
        exerciseType: "gap_fill",
        sortOrder: sort,
        qualityScores: phase === "apply" ? exScores(0.36) : undefined,
        questions: [
          buildGapFill({
            questionText: def.questionText ?? "Fill in the blanks.",
            skillTag,
            explanation: def.explanation,
            template: def.template,
            correctAnswers: def.correctAnswers,
            acceptableAnswers:
              def.acceptableAnswers ??
              def.correctAnswers.map((a) => acceptableWord(a)),
            difficultyRating: def.difficultyRating ?? 1,
            points: def.points,
          }),
        ],
      });
    }
    if (def.type === "sentence_ordering") {
      return buildExercise({
        slug,
        title,
        instructions: def.instructions ?? "Put the words in order.",
        exerciseType: "sentence_ordering",
        sortOrder: sort,
        questions: def.items.map((item) =>
          buildSentenceOrdering({
            questionText: item.questionText,
            skillTag,
            explanation: item.explanation,
            items: orderingItems(item.words),
            correctOrder: orderingOrder(item.words.length),
            difficultyRating: item.difficultyRating ?? 2,
          })
        ),
      });
    }
    if (def.type === "reading") {
      return buildReadingExercise({
        slug,
        title,
        instructions: def.instructions ?? "Read the passage. Answer the questions.",
        sortOrder: sort,
        passage: def.passage,
        questions: def.questions.map((q) =>
          buildMcq({ skillTag: "reading", ...q })
        ),
        difficulty: phase === "check" ? 0.28 : 0.22,
      });
    }
    if (def.type === "listening") {
      return buildListeningExercise({
        slug,
        title,
        instructions: def.instructions ?? "Listen and answer.",
        sortOrder: sort,
        script: def.script,
        answerKey: def.answerKey ?? [],
        audioUrl: def.audioUrl,
        questions: def.questions.map((q) =>
          buildMcq({ skillTag: "listening", ...q })
        ),
      });
    }
    if (def.type === "writing") {
      return buildWritingCheck({
        slug,
        title,
        instructions: def.instructions ?? "Write short answers.",
        sortOrder: sort,
        ...def,
      });
    }
    if (def.type === "speaking") {
      return buildSpeakingCheck({
        slug,
        title,
        instructions: def.instructions ?? "Record your answers.",
        sortOrder: sort,
        ...def,
      });
    }
    throw new Error(`Unknown exercise type: ${def.type}`);
  };

  const exercises = [];
  for (const [phase, sort] of [
    ["learn", 0],
    ["practice", 1],
    ["check", 2],
    ["apply", 3],
  ]) {
    const ex = mk(phase, sort, { title: labels[phase], ...{ learn, practice, check, apply }[phase] });
    if (ex) exercises.push(ex);
  }
  const checkEx = findCheckExercise(exercises);
  if (checkEx) {
    let review = cloneAsReview(structuredClone(checkEx));
    exercises.push(review);
  }
  return exercises;
}
