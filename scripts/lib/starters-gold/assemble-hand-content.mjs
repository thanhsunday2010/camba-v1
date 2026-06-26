/**
 * Assemble gold units from HAND-AUTHORED content modules (not generators).
 */
import { createExerciseFactory } from "../exercise-factory.mjs";
import { lessonShell, addReviewFromCheck, cloneAsReview, findCheckExercise } from "../unit-assembler.mjs";
import { prepareGoldLesson0 } from "../starters-gold/lesson0-enhance.mjs";
import { createGoldExpander } from "../starters-blueprints/shared/expand-scaffold.mjs";

/** MCQ tuple: [question, correct, wrong1, wrong2, explanation, distractor1, distractor2, difficulty?] */
export function mcqFromTuple(t, skillTag, factory, diff = 1) {
  const [questionText, correct, w1, w2, explanation, d1, d2, difficultyRating] = t;
  return factory.buildMcq({
    questionText,
    skillTag,
    explanation,
    correct,
    wrong: [w1, w2],
    distractorNotes: [d1, d2],
    difficultyRating: difficultyRating ?? diff,
  });
}

export function buildPhaseExercise(factory, skillTag, slugBase, phaseKey, spec, titleBase) {
  const { buildExercise, buildMatching, buildGapFill, buildSentenceOrdering, buildReadingExercise, buildListeningExercise, buildWritingCheck, buildSpeakingCheck, exScores, orderingItems, orderingOrder, acceptableWord } = factory;

  const sortMap = { learn: 0, practice: 1, check: 2, apply: 3 };
  const sort = sortMap[phaseKey];
  const slug = `${slugBase}-${phaseKey}`;
  const title = `${phaseKey.charAt(0).toUpperCase() + phaseKey.slice(1)}: ${spec.label ?? titleBase ?? phaseKey}`;

  if (spec.type === "mcq") {
    return buildExercise({
      slug,
      title,
      instructions: spec.instructions ?? "Choose the best answer.",
      exerciseType: "multiple_choice",
      sortOrder: sort,
      qualityScores: phaseKey === "check" ? exScores(0.32) : undefined,
      questions: spec.tuples.map((t) => mcqFromTuple(t, skillTag, factory, phaseKey === "check" ? 2 : 1)),
    });
  }
  if (spec.type === "matching") {
    return buildExercise({
      slug,
      title,
      instructions: spec.instructions ?? "Match each item.",
      exerciseType: "matching",
      sortOrder: sort,
      questions: [
        buildMatching({
          questionText: spec.questionText,
          skillTag,
          explanation: spec.explanation,
          pairs: spec.pairs,
        }),
      ],
    });
  }
  if (spec.type === "gap_fill") {
    return buildExercise({
      slug,
      title,
      instructions: spec.instructions ?? "Complete the sentences.",
      exerciseType: "gap_fill",
      sortOrder: sort,
      qualityScores: phaseKey === "apply" ? exScores(0.36) : undefined,
      questions: [
        buildGapFill({
          questionText: spec.questionText,
          skillTag,
          explanation: spec.explanation,
          template: spec.template,
          correctAnswers: spec.correctAnswers,
          acceptableAnswers: spec.acceptableAnswers ?? spec.correctAnswers.map((a) => acceptableWord(a)),
          difficultyRating: spec.difficultyRating ?? (phaseKey === "apply" ? 2 : 1),
          points: spec.points,
        }),
      ],
    });
  }
  if (spec.type === "ordering") {
    return buildExercise({
      slug,
      title,
      instructions: spec.instructions ?? "Put the words in order.",
      exerciseType: "sentence_ordering",
      sortOrder: sort,
      questions: [
        buildSentenceOrdering({
          questionText: spec.questionText,
          skillTag,
          explanation: spec.explanation,
          items: orderingItems(spec.words),
          correctOrder: orderingOrder(spec.words.length),
        }),
      ],
    });
  }
  if (spec.type === "reading") {
    return buildReadingExercise({
      slug,
      title,
      instructions: spec.instructions ?? "Read and answer.",
      sortOrder: sort,
      passage: spec.passage,
      questions: spec.tuples.map((t) => mcqFromTuple(t, "reading", factory, phaseKey === "check" ? 2 : 1)),
      difficulty: phaseKey === "check" ? 0.28 : 0.22,
    });
  }
  if (spec.type === "listening") {
    return buildListeningExercise({
      slug,
      title,
      instructions: spec.instructions ?? "Listen and answer.",
      sortOrder: sort,
      script: spec.script,
      answerKey: spec.answerKey ?? [],
      audioUrl: spec.audioUrl,
      questions: spec.tuples.map((t) => mcqFromTuple(t, "listening", factory, phaseKey === "check" ? 2 : 1)),
    });
  }
  if (spec.type === "writing") {
    return buildWritingCheck({
      slug,
      title,
      instructions: spec.instructions ?? "Write your answers.",
      sortOrder: sort,
      taskDescription: spec.taskDescription,
      prompts: spec.prompts,
      minWords: spec.minWords ?? 5,
      modelAnswers: spec.modelAnswers,
      rubric: spec.rubric,
      successCriteria: spec.successCriteria,
      autoCheckKeywords: spec.autoCheckKeywords ?? [],
    });
  }
  if (spec.type === "speaking") {
    return buildSpeakingCheck({
      slug,
      title,
      instructions: spec.instructions ?? "Record your answers.",
      sortOrder: sort,
      prompt: spec.prompt,
      sceneDescription: spec.sceneDescription,
      followUpQuestions: spec.followUpQuestions,
      suggestedAnswers: spec.suggestedAnswers,
      assessmentCriteria: spec.assessmentCriteria,
    });
  }
  throw new Error(`Unknown phase type "${spec.type}" for ${slugBase}-${phaseKey}`);
}

export function buildPhasedLesson(factory, skillTag, slugBase, spec) {
  const phases = [
    ["learn", 0],
    ["practice", 1],
    ["check", 2],
    ["apply", 3],
  ];
  const exercises = [];

  for (const [key] of phases) {
    const p = spec[key];
    if (!p) continue;
    exercises.push(buildPhaseExercise(factory, skillTag, slugBase, key, p, spec.title));
  }

  const check = findCheckExercise(exercises);
  if (check) exercises.push(cloneAsReview(structuredClone(check)));

  if (exercises.length !== 5) {
    throw new Error(`Lesson ${slugBase} has ${exercises.length} exercises; need 5`);
  }
  return exercises;
}

export function buildOnePhase(factory, skillTag, slugBase, phaseKey, spec) {
  return buildPhaseExercise(factory, skillTag, slugBase, phaseKey, spec, spec.label ?? phaseKey);
}

export function createBlueprintFromHandContent(unitNumber, handContent) {
  const topic = handContent.topic;
  const factory = createExerciseFactory("starters", topic);
  const padded = String(unitNumber).padStart(2, "0");

  const lesson0Extra = {};
  for (const [skill, phases] of Object.entries(handContent.lesson0ExtraSpecs ?? {})) {
    lesson0Extra[skill] = {};
    for (const phaseKey of ["learn", "practice", "check", "apply"]) {
      if (phases[phaseKey]) {
        lesson0Extra[skill][phaseKey] = buildOnePhase(
          factory,
          skill,
          `${skill}-${topic}-l0`,
          phaseKey,
          phases[phaseKey]
        );
      }
    }
  }

  const builders = {};
  for (const skill of Object.keys(handContent.lessons)) {
    builders[skill] = (lessonIndex, skillIndex, original) => {
      const spec = handContent.lessons[skill][lessonIndex];
      if (!spec) throw new Error(`Missing ${skill} L${lessonIndex}`);
      const slugBase = spec.slug ?? `${skill}-${topic}-l${lessonIndex + 1}`;
      const exercises = buildPhasedLesson(factory, skill, slugBase, spec);

      if (skill === "listening") {
        for (const ex of exercises) {
          if (ex.exerciseType === "listening" && ex.sortOrder >= 2 && !ex.content?.audioUrl) {
            ex.content = ex.content ?? {};
            ex.content.audioUrl = `/audio/listening/starters/unit-${padded}/${ex.slug}.mp3`;
          }
        }
      }

      return lessonShell({
        level: "starters",
        unitNumber,
        slug: spec.slug ?? slugBase,
        skill,
        lessonIndex,
        skillIndex,
        title: spec.title,
        learningObjective: spec.learningObjective,
        estimatedMinutes: spec.estimatedMinutes ?? 14 + lessonIndex * 3,
        exercises,
      });
    };
  }

  return createGoldExpander(unitNumber, {
    lesson0Extra,
    builders,
  });
}

export function expandFromHandContent(unitNumber, handContent, original) {
  const expandUnit = createBlueprintFromHandContent(unitNumber, handContent);
  return expandUnit(original);
}
