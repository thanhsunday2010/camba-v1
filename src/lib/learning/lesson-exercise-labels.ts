/** Maps exercise_type to learning.lesson.exerciseTypes.* i18n key suffix */
export function getExerciseTypeMessageKey(exerciseType: string): string {
  const normalized = exerciseType.toLowerCase().replace(/-/g, "_");
  const keys: Record<string, string> = {
    writing: "writing",
    speaking: "speaking",
    listening: "listening",
    reading: "reading",
    reading_comprehension: "reading",
    vocabulary: "vocabulary",
    grammar: "grammar",
    gap_fill: "gapFill",
    matching: "matching",
    drag_drop: "matching",
    multiple_choice: "multipleChoice",
    multi_select: "multiSelect",
    sentence_ordering: "sentenceOrdering",
    image_selection: "multipleChoice",
  };
  return keys[normalized] ?? "default";
}
