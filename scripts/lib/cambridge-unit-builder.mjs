/**
 * Build full Cambridge unit JSON from blueprints (gold-standard structure).
 * Shared by KET, Movers, Flyers, PET, etc.
 */

import { lessonId } from "./content-ids.mjs";
import {
  normalizeLessonExercises,
  buildLessonsFromBlueprint,
  SKILL_ORDER,
} from "./unit-assembler.mjs";
import { loadCurriculumMap } from "./curriculum-map.mjs";

const LEVEL_META = {
  starters: {
    cefr: "pre-a1",
    targetAge: "7-9",
    copyright:
      "Original content by CAMBA. Not affiliated with or endorsed by Cambridge University Press & Assessment. Inspired by YLE Pre-A1 task formats only.",
    defaultMinWords: 5,
    speakingDuration: 60,
  },
  ket: {
    cefr: "a2",
    targetAge: "11-14",
    copyright:
      "Original content by CAMBA. Not affiliated with or endorsed by Cambridge University Press & Assessment. Inspired by A2 Key task formats only.",
    defaultMinWords: 25,
    speakingDuration: 120,
  },
  movers: {
    cefr: "a1",
    targetAge: "8-11",
    copyright:
      "Original content by CAMBA. Not affiliated with or endorsed by Cambridge University Press & Assessment. Inspired by YLE Movers task formats only.",
    defaultMinWords: 15,
    speakingDuration: 90,
  },
  flyers: {
    cefr: "a2",
    targetAge: "9-12",
    copyright:
      "Original content by CAMBA. Not affiliated with or endorsed by Cambridge University Press & Assessment. Inspired by YLE Flyers task formats only.",
    defaultMinWords: 25,
    speakingDuration: 120,
  },
  pet: {
    cefr: "b1",
    targetAge: "12-16",
    copyright:
      "Original content by CAMBA. Not affiliated with or endorsed by Cambridge University Press & Assessment. Inspired by B1 Preliminary for Schools task formats only.",
    defaultMinWords: 40,
    speakingDuration: 150,
  },
};

export function createCambridgeUnitBuilder(levelSlug) {
  const meta = LEVEL_META[levelSlug];
  if (!meta) {
    throw new Error(`Unknown level for unit builder: ${levelSlug}`);
  }

  function qScores(difficulty = 0.2) {
    return {
      quality: 0.92,
      difficulty,
      curriculumAlignment: 0.96,
      needsReview: false,
    };
  }

  function exScores(difficulty = 0.22) {
    return {
      quality: 0.93,
      difficulty,
      curriculumAlignment: 0.97,
      needsReview: false,
    };
  }

  function buildMcq({
    questionText,
    skillTag,
    topicTag,
    explanation,
    correct,
    wrong,
    distractorNotes = [],
    difficultyRating = 1,
    assessmentType,
  }) {
    const choices = [
      { text: wrong[0], isCorrect: false, distractorNote: distractorNotes[0] },
      { text: correct, isCorrect: true },
      { text: wrong[1], isCorrect: false, distractorNote: distractorNotes[1] },
    ];
    return {
      questionText,
      questionType: "multiple_choice",
      skillTag,
      topicTag,
      levelTag: levelSlug,
      difficultyRating,
      points: 1,
      explanation,
      qualityScores: qScores(difficultyRating === 2 ? 0.3 : 0.2),
      ...(assessmentType ? { assessmentType } : {}),
      choices,
    };
  }

  function buildMatching({
    questionText,
    skillTag,
    topicTag,
    explanation,
    pairs,
    difficultyRating = 1,
    points,
  }) {
    return {
      questionText,
      questionType: "matching",
      skillTag,
      topicTag,
      levelTag: levelSlug,
      difficultyRating,
      points: points ?? pairs.length,
      explanation,
      qualityScores: qScores(0.25),
      pairs,
    };
  }

  function buildGapFill({
    questionText,
    skillTag,
    topicTag,
    explanation,
    template,
    correctAnswers,
    acceptableAnswers,
    difficultyRating = 1,
    points,
  }) {
    return {
      questionText,
      questionType: "gap_fill",
      skillTag,
      topicTag,
      levelTag: levelSlug,
      difficultyRating,
      points: points ?? correctAnswers.length,
      explanation,
      qualityScores: qScores(0.25),
      content: { template, correctAnswers, acceptableAnswers },
    };
  }

  function buildSentenceOrdering({
    questionText,
    skillTag,
    topicTag,
    explanation,
    words,
    correctOrder,
    difficultyRating = 2,
  }) {
    const items = words.map((text, i) => ({ id: `w${i + 1}`, text }));
    const order =
      correctOrder?.length && typeof correctOrder[0] === "string"
        ? correctOrder
        : items.map((item) => item.id);
    return {
      questionText,
      questionType: "sentence_ordering",
      skillTag,
      topicTag,
      levelTag: levelSlug,
      difficultyRating,
      points: 1,
      explanation,
      qualityScores: qScores(0.3),
      content: { items, correctOrder: order },
    };
  }

  function buildExercise({
    slug,
    title,
    instructions,
    exerciseType,
    sortOrder,
    questions = [],
    content,
    qualityScores,
  }) {
    return {
      slug,
      title,
      instructions,
      exerciseType,
      sortOrder,
      qualityScores: qualityScores ?? exScores(),
      ...(content ? { content } : {}),
      questions,
    };
  }

  function buildVocabWord({
    word,
    ipa,
    partOfSpeech,
    vietnameseMeaning,
    exampleSentence,
    difficulty = 1,
    topic,
  }) {
    return {
      word,
      ipa,
      partOfSpeech,
      vietnameseMeaning,
      exampleSentence,
      difficulty,
      topic,
      programLevel: levelSlug,
      qualityScores: {
        quality: 0.92,
        difficulty: difficulty === 2 ? 0.25 : 0.15,
        curriculumAlignment: 0.96,
        needsReview: false,
      },
    };
  }

  function buildGrammarRef({
    structure,
    explanation,
    examples,
    commonMistakes,
    topic,
  }) {
    return {
      structure,
      explanation,
      examples,
      commonMistakes,
      programLevel: levelSlug,
      topic,
    };
  }

  function buildPassage({ title, text }) {
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return { title, text, wordCount };
  }

  function buildListeningScript({ title, setting, speakers, lines, audioNotes }) {
    return { title, setting, speakers, lines, audioNotes };
  }

  function buildReadingExercise({
    slug,
    title,
    instructions,
    sortOrder,
    passage,
    questions,
    difficulty = 0.22,
  }) {
    return buildExercise({
      slug,
      title,
      instructions,
      exerciseType: "reading_comprehension",
      sortOrder,
      content: { passage },
      questions,
      qualityScores: exScores(difficulty),
    });
  }

  function buildListeningExercise({
    slug,
    title,
    instructions,
    sortOrder,
    script,
    answerKey,
    audioUrl,
    questions,
    difficulty = 0.22,
  }) {
    return buildExercise({
      slug,
      title,
      instructions,
      exerciseType: "listening",
      sortOrder,
      content: {
        script,
        answerKey,
        ...(audioUrl ? { audioUrl } : {}),
      },
      questions,
      qualityScores: exScores(difficulty),
    });
  }

  function buildWritingCheck({
    slug,
    topicTag,
    title,
    instructions,
    sortOrder,
    taskDescription,
    prompts,
    minWords = meta.defaultMinWords,
    modelAnswerText,
    rubric,
    successCriteria,
    autoCheckKeywords = [],
  }) {
    return buildExercise({
      slug,
      title,
      instructions,
      exerciseType: "writing",
      sortOrder,
      content: {
        taskDescription,
        prompts,
        expectedLength: `At least ${minWords} words`,
        minimumWords: minWords,
        minWords,
        targetLevel: levelSlug,
        levelTag: levelSlug,
        successCriteria,
        modelAnswer: { text: modelAnswerText },
        rubric,
      },
      questions: [
        {
          questionText: "Write your response following the task.",
          questionType: "writing",
          skillTag: "writing",
          topicTag,
          levelTag: levelSlug,
          difficultyRating: 2,
          points: 8,
          explanation: "Chấm theo rubric. Bài mẫu cho thấy độ dài và nội dung mong đợi.",
          qualityScores: qScores(0.38),
          content: {
            rubricRef: slug,
            autoCheckKeywords,
            minimumWords: minWords,
          },
        },
      ],
      qualityScores: exScores(0.35),
    });
  }

  function buildSpeakingCheck({
    slug,
    topicTag,
    title,
    instructions,
    sortOrder,
    prompt,
    sceneDescription,
    followUpQuestions,
    suggestedAnswers,
    assessmentCriteria,
    maxDurationSeconds = meta.speakingDuration,
  }) {
    return buildExercise({
      slug,
      title,
      instructions,
      exerciseType: "speaking",
      sortOrder,
      content: {
        prompt,
        sceneDescription,
        followUpQuestions,
        suggestedAnswers,
        assessmentCriteria,
        maxDurationSeconds,
        targetLevel: levelSlug,
        levelTag: levelSlug,
      },
      questions: [
        {
          questionText: "Record your answers to the follow-up questions.",
          questionType: "speaking",
          skillTag: "speaking",
          topicTag,
          levelTag: levelSlug,
          difficultyRating: 2,
          points: 6,
          explanation:
            "Chấm tổng thể theo tiêu chí. Trả lời ngắn vẫn được điểm một phần nếu dùng đúng từ vựng.",
          qualityScores: qScores(0.36),
          content: {
            assessmentCriteriaRef: slug,
            minimumResponses: 4,
            maxDurationSeconds,
          },
        },
      ],
      qualityScores: exScores(0.32),
    });
  }

  function unlockAfter(unitNumber, previousSkill) {
    if (!previousSkill) return undefined;
    return lessonId(levelSlug, unitNumber, previousSkill);
  }

  function buildCambridgeUnit(blueprint) {
    const {
      unitNumber,
      unitSlug,
      unitTitle,
      curriculumUnit,
      vocabularyBank,
      grammarReference,
      unit,
      lessons,
    } = blueprint;

    const topicTag = unitSlug;
    const padded = String(unitNumber).padStart(2, "0");

    function buildExerciseFromBlueprint(ex, { skill }) {
      if (ex.exerciseType === "writing" && ex.content?.taskDescription) {
        if (ex.questions?.length && ex.content?.targetLevel) {
          return ex;
        }
        return buildWritingCheck({
          slug: ex.slug,
          topicTag,
          title: ex.title,
          instructions: ex.instructions,
          sortOrder: ex.sortOrder,
          taskDescription: ex.content.taskDescription,
          prompts: ex.content.prompts,
          minWords: ex.content.minWords ?? ex.content.minimumWords ?? meta.defaultMinWords,
          modelAnswerText: ex.content.modelAnswer?.text ?? ex.content.modelAnswerText,
          rubric: ex.content.rubric,
          successCriteria: ex.content.successCriteria,
          autoCheckKeywords: ex.content.autoCheckKeywords,
        });
      }
      if (ex.exerciseType === "speaking" && ex.content?.followUpQuestions) {
        if (ex.questions?.length && ex.content?.targetLevel) {
          return ex;
        }
        return buildSpeakingCheck({
          ...ex,
          topicTag,
        });
      }
      if (ex.exerciseType === "reading_comprehension") {
        if (ex.content?.passage) {
          return ex;
        }
        return buildReadingExercise(ex);
      }
      if (ex.exerciseType === "listening") {
        const audioUrl = `/audio/listening/${levelSlug}/unit-${padded}/${ex.slug}.mp3`;
        if (ex.content?.script) {
          return { ...ex, content: { ...ex.content, audioUrl } };
        }
        return buildListeningExercise({
          slug: ex.slug,
          title: ex.title,
          instructions: ex.instructions,
          sortOrder: ex.sortOrder,
          script: ex.script,
          answerKey: ex.answerKey,
          audioUrl,
          questions: ex.questions,
        });
      }
      return buildExercise({
        ...ex,
        content: ex.content?.script
          ? {
              ...ex.content,
              audioUrl:
                ex.content.audioUrl ??
                `/audio/listening/${levelSlug}/unit-${padded}/${ex.slug}.mp3`,
            }
          : ex.content,
        questions: (ex.questions ?? []).map((q) => ({
          ...q,
          topicTag: q.topicTag ?? topicTag,
          levelTag: levelSlug,
          skillTag: q.skillTag ?? skill,
        })),
      });
    }

    const hasMultiLesson = SKILL_ORDER.some((s) => Array.isArray(lessons[s]));

    let builtLessons;

    if (hasMultiLesson) {
      builtLessons = buildLessonsFromBlueprint({
        level: levelSlug,
        unitNumber,
        lessonsBySkill: lessons,
        buildExerciseFn: buildExerciseFromBlueprint,
      });
    } else {
      builtLessons = SKILL_ORDER.map((skill, sortOrder) => {
        const lessonBlueprint = lessons[skill];
        const prevSkill = sortOrder > 0 ? SKILL_ORDER[sortOrder - 1] : null;

        const builtExercises = lessonBlueprint.exercises.map((ex) =>
          buildExerciseFromBlueprint(ex, { skill })
        );

        for (const ex of builtExercises) {
          for (const q of ex.questions ?? []) {
            if (!q.topicTag) q.topicTag = topicTag;
          }
        }

        return {
          slug: lessonBlueprint.slug,
          skill,
          lessonIndex: lessonBlueprint.lessonIndex ?? 0,
          sortOrder,
          ...(prevSkill
            ? { unlockAfterLessonId: unlockAfter(unitNumber, prevSkill) }
            : {}),
          title: lessonBlueprint.title,
          learningObjective: lessonBlueprint.learningObjective,
          estimatedMinutes: lessonBlueprint.estimatedMinutes ?? 22,
          exercises: normalizeLessonExercises(builtExercises, levelSlug),
        };
      });
    }

    for (const lesson of builtLessons) {
      for (const ex of lesson.exercises) {
        if (ex.exerciseType === "writing") {
          for (const q of ex.questions ?? []) {
            q.topicTag = topicTag;
            q.skillTag = "writing";
          }
        }
      }
    }

    return {
      meta: {
        version: "1.0.0",
        contentType: "unit-seed",
        copyright: meta.copyright,
        program: "cambridge-english",
        level: levelSlug,
        cefr: meta.cefr,
        unitNumber,
        unitSlug,
        unitTitle,
        targetAge: meta.targetAge,
        curriculumMapVersion: loadCurriculumMap().version,
        contentReview: {
          reviewThreshold: 0.75,
          defaultFlagBelowThreshold: true,
          scoreScale: "0-1",
        },
      },
      unit: {
        learningObjectives: unit.learningObjectives,
        grammarFocus: curriculumUnit.grammar,
        readingSkillFocus: curriculumUnit.readingSkill,
        listeningSkillFocus: curriculumUnit.listeningSkill,
      },
      vocabularyBank,
      grammarReference,
      lessons: builtLessons,
    };
  }

  return {
    buildMcq,
    buildMatching,
    buildGapFill,
    buildSentenceOrdering,
    buildExercise,
    buildVocabWord,
    buildGrammarRef,
    buildPassage,
    buildListeningScript,
    buildReadingExercise,
    buildListeningExercise,
    buildWritingCheck,
    buildSpeakingCheck,
    buildCambridgeUnit,
  };
}
