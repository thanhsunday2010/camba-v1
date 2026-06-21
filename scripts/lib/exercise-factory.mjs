/**
 * Level-agnostic exercise and question builders.
 * Use createExerciseFactory(level, topicTag) for unit-specific authoring.
 */

export function qScores(difficulty = 0.2) {
  return {
    quality: 0.92,
    difficulty,
    curriculumAlignment: 0.96,
    needsReview: false,
  };
}

export function exScores(difficulty = 0.22) {
  return {
    quality: 0.93,
    difficulty,
    curriculumAlignment: 0.97,
    needsReview: false,
  };
}

export function createExerciseFactory(level, topicTag) {
  function buildMcq({
    questionText,
    skillTag,
    topicTag: topic = topicTag,
    explanation,
    correct,
    wrong,
    distractorNotes = [],
    difficultyRating = 1,
    assessmentType,
    points = 1,
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
      topicTag: topic,
      levelTag: level,
      difficultyRating,
      points,
      explanation,
      qualityScores: qScores(difficultyRating === 2 ? 0.3 : 0.2),
      ...(assessmentType ? { assessmentType } : {}),
      choices,
    };
  }

  function buildMatching({
    questionText,
    skillTag,
    topicTag: topic = topicTag,
    explanation,
    pairs,
    difficultyRating = 1,
    points,
  }) {
    return {
      questionText,
      questionType: "matching",
      skillTag,
      topicTag: topic,
      levelTag: level,
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
    topicTag: topic = topicTag,
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
      topicTag: topic,
      levelTag: level,
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
    topicTag: topic = topicTag,
    explanation,
    items,
    correctOrder,
    difficultyRating = 2,
    points = 2,
  }) {
    return {
      questionText,
      questionType: "sentence_ordering",
      skillTag,
      topicTag: topic,
      levelTag: level,
      difficultyRating,
      points,
      explanation,
      qualityScores: qScores(0.3),
      content: { items, correctOrder },
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

  function buildPassage({ title, text, imagePrompt, wordCount }) {
    const wc =
      wordCount ?? text.split(/\s+/).filter(Boolean).length;
    return { title, text, wordCount: wc, imagePrompt };
  }

  function buildListeningScript({
    title,
    setting,
    speakers,
    lines,
    audioNotes,
  }) {
    return { title, setting, speakers, lines, audioNotes };
  }

  function buildVocabWord({
    word,
    ipa,
    partOfSpeech,
    vietnameseMeaning,
    exampleSentence,
    difficulty = 1,
    topic = topicTag,
  }) {
    return {
      word,
      ipa,
      partOfSpeech,
      vietnameseMeaning,
      exampleSentence,
      difficulty,
      topic,
      programLevel: level,
      qualityScores: {
        quality: 0.93,
        difficulty: difficulty * 0.1,
        curriculumAlignment: 0.97,
        needsReview: false,
      },
    };
  }

  function buildGrammarRef({
    structure,
    explanation,
    examples,
    commonMistakes,
    topic = topicTag,
  }) {
    return {
      structure,
      explanation,
      examples,
      commonMistakes,
      programLevel: level,
      topic,
    };
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
    title,
    instructions,
    sortOrder,
    taskDescription,
    prompts,
    minWords = 5,
    modelAnswers,
    rubric,
    successCriteria,
    autoCheckKeywords = [],
    topic = topicTag,
  }) {
    const defaultMinWords = level === "ket" || level === "pet" ? 25 : 5;
    const resolvedMin = minWords ?? defaultMinWords;
    return buildExercise({
      slug,
      title,
      instructions,
      exerciseType: "writing",
      sortOrder,
      content: {
        taskDescription,
        prompts,
        expectedLength:
          level === "ket" || level === "pet"
            ? "Short paragraph"
            : "Short answers; 1–5 words each",
        minWords: resolvedMin,
        targetLevel: level,
        successCriteria,
        modelAnswer: { answers: modelAnswers },
        rubric,
      },
      questions: [
        {
          questionText: "Write your answers to the prompts in the task.",
          questionType: "writing",
          skillTag: "writing",
          topicTag: topic,
          levelTag: level,
          difficultyRating: 2,
          points: level === "ket" || level === "pet" ? 10 : 6,
          explanation:
            "Chấp nhận câu trả lời đáp ứng tiêu chí. Model answer cho thấy phạm vi mong đợi.",
          qualityScores: qScores(0.38),
          content: {
            rubricRef: slug,
            autoCheckKeywords,
            minimumWords: resolvedMin,
          },
        },
      ],
      qualityScores: exScores(0.35),
    });
  }

  function buildSpeakingCheck({
    slug,
    title,
    instructions,
    sortOrder,
    prompt,
    pictureDescription,
    followUpQuestions,
    suggestedAnswers,
    assessmentCriteria,
    maxDurationSeconds = 60,
    topic = topicTag,
  }) {
    return buildExercise({
      slug,
      title,
      instructions,
      exerciseType: "speaking",
      sortOrder,
      content: {
        prompt,
        pictureDescription,
        followUpQuestions,
        suggestedAnswers,
        assessmentCriteria,
        maxDurationSeconds,
        targetLevel: level,
      },
      questions: [
        {
          questionText: "Record your answers to the follow-up questions.",
          questionType: "speaking",
          skillTag: "speaking",
          topicTag: topic,
          levelTag: level,
          difficultyRating: 2,
          points: 5,
          explanation:
            "Chấm tổng thể theo tiêu chí. Trả lời ngắn vẫn được điểm một phần nếu dùng đúng từ vựng.",
          qualityScores: qScores(0.36),
          content: {
            assessmentCriteriaRef: slug,
            minimumResponses: 3,
            maxDurationSeconds,
          },
        },
      ],
      qualityScores: exScores(0.32),
    });
  }

  function acceptableWord(word) {
    const cap = word.charAt(0).toUpperCase() + word.slice(1);
    return word === cap ? [[word]] : [[word, cap]];
  }

  function orderingItems(words) {
    return words.map((text, i) => ({ id: `w${i + 1}`, text }));
  }

  function orderingOrder(count) {
    return Array.from({ length: count }, (_, i) => `w${i + 1}`);
  }

  return {
    level,
    topicTag,
    buildMcq,
    buildMatching,
    buildGapFill,
    buildSentenceOrdering,
    buildExercise,
    buildPassage,
    buildListeningScript,
    buildVocabWord,
    buildGrammarRef,
    buildReadingExercise,
    buildListeningExercise,
    buildWritingCheck,
    buildSpeakingCheck,
    acceptableWord,
    orderingItems,
    orderingOrder,
    qScores,
    exScores,
  };
}
