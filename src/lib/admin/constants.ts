import type { ExerciseType, QuestionType } from "@/types/database";

export const EXERCISE_TYPE_OPTIONS: { value: ExerciseType; label: string }[] = [
  { value: "multiple_choice", label: "Trắc nghiệm" },
  { value: "multi_select", label: "Chọn nhiều" },
  { value: "gap_fill", label: "Điền từ" },
  { value: "matching", label: "Nối cặp" },
  { value: "sentence_ordering", label: "Sắp xếp câu" },
  { value: "drag_drop", label: "Kéo thả" },
  { value: "listening", label: "Nghe" },
  { value: "reading_comprehension", label: "Đọc hiểu" },
  { value: "image_selection", label: "Chọn hình" },
  { value: "writing", label: "Bài viết" },
  { value: "speaking", label: "Bài nói" },
  { value: "interactive", label: "Tương tác" },
];

export const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: "multiple_choice", label: "Trắc nghiệm" },
  { value: "multi_select", label: "Chọn nhiều" },
  { value: "gap_fill", label: "Điền từ" },
  { value: "matching", label: "Nối cặp" },
  { value: "sentence_ordering", label: "Sắp xếp câu" },
  { value: "listening", label: "Nghe" },
  { value: "reading_comprehension", label: "Đọc hiểu" },
  { value: "writing", label: "Bài viết" },
  { value: "speaking", label: "Bài nói" },
];

export const QUESTION_BANK_METADATA_KEY = "is_question_bank";

export function isQuestionBankExercise(metadata: Record<string, unknown> | null | undefined): boolean {
  return metadata?.[QUESTION_BANK_METADATA_KEY] === true;
}
