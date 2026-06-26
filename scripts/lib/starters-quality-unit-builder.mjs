/**
 * Build full-quality Starters units (18 lessons × 5 exercises) from unit specs.
 * Gold standard pattern: unit-01-family-and-friends.json
 */

import { loadCurriculumMap } from "./curriculum-map.mjs";
import { getCurriculumUnit } from "./curriculum-map.mjs";
import { createExerciseFactory } from "./exercise-factory.mjs";
import {
  expandUnitStructure,
  lessonShell,
  addReviewFromCheck,
  padLessonToFiveExercises,
} from "./unit-assembler.mjs";
import { validateUnitStructure } from "./validate-unit-structure.mjs";

const LEVEL = "starters";

function buildFivePhaseLesson({
  factory,
  slugBase,
  skillTag,
  phaseDefs,
  topicTag,
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

  const phases = [
    { key: "learn", sort: 0, title: "Learn" },
    { key: "practice", sort: 1, title: "Practice" },
    { key: "check", sort: 2, title: "Check" },
    { key: "apply", sort: 3, title: "Apply" },
    { key: "review", sort: 4, title: "Review" },
  ];

  const exercises = [];
  for (const phase of phases) {
    const def = phaseDefs[phase.key];
    if (!def) continue;

    if (phase.key === "review" && def.cloneCheck) {
      const check = exercises.find((e) => e.sortOrder === 2);
      if (check) {
        const review = structuredClone(check);
        review.slug = review.slug.replace("-check", "-review");
        review.title = review.title.replace(/^Check:/, "Review:");
        review.sortOrder = 4;
        exercises.push(review);
        continue;
      }
    }

    const slug = `${slugBase}-${phase.key}`;
    const title = `${phase.title}: ${def.label ?? def.title ?? slugBase}`;

    if (def.type === "mcq") {
      exercises.push(
        buildExercise({
          slug,
          title,
          instructions: def.instructions ?? "Read each sentence. Choose the best answer.",
          exerciseType: "multiple_choice",
          sortOrder: phase.sort,
          qualityScores: phase.key === "check" ? exScores(0.32) : undefined,
          questions: def.questions.map((q) =>
            buildMcq({ skillTag, topicTag, ...q })
          ),
        })
      );
    } else if (def.type === "matching") {
      exercises.push(
        buildExercise({
          slug,
          title,
          instructions: def.instructions ?? "Match each item correctly.",
          exerciseType: "matching",
          sortOrder: phase.sort,
          questions: [
            buildMatching({
              questionText: def.questionText ?? "Match the items.",
              skillTag,
              explanation: def.explanation,
              pairs: def.pairs,
            }),
          ],
        })
      );
    } else if (def.type === "gap_fill") {
      exercises.push(
        buildExercise({
          slug,
          title,
          instructions: def.instructions ?? "Complete the sentences.",
          exerciseType: "gap_fill",
          sortOrder: phase.sort,
          qualityScores: phase.key === "apply" ? exScores(0.36) : undefined,
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
        })
      );
    } else if (def.type === "sentence_ordering") {
      exercises.push(
        buildExercise({
          slug,
          title,
          instructions: def.instructions ?? "Put the words in order.",
          exerciseType: "sentence_ordering",
          sortOrder: phase.sort,
          questions: [
            buildSentenceOrdering({
              questionText: def.questionText ?? "Order the words.",
              skillTag,
              explanation: def.explanation,
              items: orderingItems(def.words),
              correctOrder: orderingOrder(def.words.length),
            }),
          ],
        })
      );
    } else if (def.type === "reading") {
      exercises.push(
        buildReadingExercise({
          slug,
          title,
          instructions: def.instructions ?? "Read the passage. Answer the questions.",
          sortOrder: phase.sort,
          passage: def.passage,
          questions: def.questions.map((q) => buildMcq({ skillTag: "reading", topicTag, ...q })),
          difficulty: phase.key === "check" ? 0.28 : 0.22,
        })
      );
    } else if (def.type === "listening") {
      exercises.push(
        buildListeningExercise({
          slug,
          title,
          instructions: def.instructions ?? "Listen and answer.",
          sortOrder: phase.sort,
          script: def.script,
          answerKey: def.answerKey ?? [],
          audioUrl: def.audioUrl,
          questions: def.questions.map((q) =>
            buildMcq({ skillTag: "listening", topicTag, ...q })
          ),
        })
      );
    } else if (def.type === "writing") {
      exercises.push(
        buildWritingCheck({
          slug,
          title,
          instructions: def.instructions ?? "Write short answers.",
          sortOrder: phase.sort,
          taskDescription: def.taskDescription,
          prompts: def.prompts,
          minWords: def.minWords ?? 5,
          modelAnswers: def.modelAnswers,
          rubric: def.rubric,
          successCriteria: def.successCriteria,
          autoCheckKeywords: def.autoCheckKeywords ?? [],
        })
      );
    } else if (def.type === "speaking") {
      exercises.push(
        buildSpeakingCheck({
          slug,
          title,
          instructions: def.instructions ?? "Record your answers.",
          sortOrder: phase.sort,
          prompt: def.prompt,
          sceneDescription: def.sceneDescription,
          followUpQuestions: def.followUpQuestions,
          suggestedAnswers: def.suggestedAnswers,
          assessmentCriteria: def.assessmentCriteria,
        })
      );
    }
  }

  return exercises.slice(0, 5);
}

function buildSkillLessons(factory, spec, skill, skillIndex, unitNumber) {
  const skillSpec = spec.skills[skill];
  if (!skillSpec || skillSpec.length !== 3) {
    throw new Error(`Unit ${unitNumber} skill "${skill}" needs exactly 3 lesson specs`);
  }

  return skillSpec.map((lessonSpec, lessonIndex) => {
    const slugBase = lessonSpec.slug ?? `${skill}-${spec.topic}-l${lessonIndex + 1}`;
    const exercises =
      lessonIndex === 0 && lessonSpec.useBase && lessonSpec.baseExercises
        ? padLessonToFiveExercises(lessonSpec.baseExercises, LEVEL)
        : buildFivePhaseLesson({
            factory,
            slugBase,
            skillTag: skill,
            topicTag: spec.topic,
            phaseDefs: lessonSpec.phases,
          });

    return lessonShell({
      level: LEVEL,
      unitNumber,
      slug: lessonSpec.slug ?? slugBase,
      skill,
      lessonIndex,
      skillIndex,
      title: lessonSpec.title,
      learningObjective: lessonSpec.learningObjective,
      estimatedMinutes: lessonSpec.estimatedMinutes ?? 12 + lessonIndex * 3,
      exercises,
    });
  });
}

export function buildStartersUnitFromSpec(spec, unitNumber) {
  const curriculumUnit = getCurriculumUnit(LEVEL, unitNumber);
  const factory = createExerciseFactory(LEVEL, spec.topic);
  const padded = String(unitNumber).padStart(2, "0");

  const allLessons = [];
  const skillOrder = [
    "vocabulary",
    "grammar",
    "reading",
    "listening",
    "writing",
    "speaking",
  ];

  for (let skillIndex = 0; skillIndex < skillOrder.length; skillIndex++) {
    const skill = skillOrder[skillIndex];
    const lessons = buildSkillLessons(
      factory,
      spec,
      skill,
      skillIndex,
      unitNumber
    );

    for (const lesson of lessons) {
      if (skill === "listening") {
        for (const ex of lesson.exercises) {
          if (ex.exerciseType === "listening" && ex.sortOrder >= 2 && !ex.content?.audioUrl) {
            ex.content = ex.content ?? {};
            ex.content.audioUrl = `/audio/listening/starters/unit-${padded}/${ex.slug}.mp3`;
          }
        }
      }
    }

    allLessons.push(...lessons);
  }

  const map = loadCurriculumMap();

  return {
    meta: {
      version: "1.0.0",
      contentType: "unit-seed",
      copyright:
        "Original content by CAMBA. Not affiliated with or endorsed by Cambridge University Press & Assessment. Inspired by YLE Pre-A1 task formats only.",
      program: "cambridge-english",
      level: LEVEL,
      cefr: "pre-a1",
      unitNumber,
      unitSlug: spec.topic,
      unitTitle: curriculumUnit.title,
      targetAge: "7-9",
      curriculumMapVersion: map.version,
      contentReview: {
        reviewThreshold: 0.75,
        defaultFlagBelowThreshold: true,
        scoreScale: "0-1",
      },
    },
    unit: {
      learningObjectives: spec.learningObjectives,
      grammarFocus: curriculumUnit.grammar,
      readingSkillFocus: curriculumUnit.readingSkill,
      listeningSkillFocus: curriculumUnit.listeningSkill,
    },
    vocabularyBank: spec.vocabularyBank,
    grammarReference: spec.grammarReference,
    lessons: allLessons,
  };
}

export function validateAndBuild(spec, unitNumber) {
  const content = buildStartersUnitFromSpec(spec, unitNumber);
  validateUnitStructure(content);
  return content;
}
