/**
 * Helpers for building gold-standard 3-lesson skill blocks (Learn→Review phases).
 */

export function mcqLessonSet({
  buildMcq,
  skillTag,
  topicTag,
  items,
}) {
  return items.map((item) =>
    buildMcq({
      skillTag,
      topicTag,
      ...item,
    })
  );
}

export function standardLesson({
  slug,
  title,
  learningObjective,
  estimatedMinutes = 18,
  exercises,
}) {
  return {
    slug,
    title,
    learningObjective,
    estimatedMinutes,
    exercises,
  };
}

export function learnMcqExercise({
  buildExercise,
  slug,
  title,
  instructions,
  questions,
}) {
  return buildExercise({
    slug,
    title: title.startsWith("Learn:") ? title : `Learn: ${title}`,
    instructions,
    exerciseType: "multiple_choice",
    sortOrder: 0,
    questions,
  });
}

export function practiceExercise({
  buildExercise,
  slug,
  title,
  exerciseType,
  instructions,
  questions,
  content,
}) {
  return buildExercise({
    slug,
    title: title.startsWith("Practice:") ? title : `Practice: ${title}`,
    instructions,
    exerciseType,
    sortOrder: 1,
    questions,
    ...(content ? { content } : {}),
  });
}

export function checkMcqExercise({
  buildExercise,
  slug,
  title,
  instructions,
  questions,
}) {
  return buildExercise({
    slug,
    title: title.startsWith("Check:") ? title : `Check: ${title}`,
    instructions,
    exerciseType: "multiple_choice",
    sortOrder: 2,
    questions,
  });
}

export function applyExercise({
  buildExercise,
  slug,
  title,
  exerciseType,
  instructions,
  questions,
  content,
}) {
  return buildExercise({
    slug,
    title: title.startsWith("Apply:") ? title : `Apply: ${title}`,
    instructions,
    exerciseType,
    sortOrder: 3,
    questions,
    ...(content ? { content } : {}),
  });
}
