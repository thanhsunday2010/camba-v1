/**
 * Map runtime CAMBA question types to Supabase question_type enum values.
 * Production DBs without migration 010 use `reading` instead of `reading_comprehension`.
 */

const DB_QUESTION_TYPE_ALIASES = {
  reading_comprehension: "reading",
};

export function resolveDbQuestionType(cambaQuestionType) {
  return DB_QUESTION_TYPE_ALIASES[cambaQuestionType] ?? cambaQuestionType;
}
