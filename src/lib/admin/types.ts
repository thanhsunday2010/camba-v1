import type { ContentStatus, ExerciseType, QuestionType } from "@/types/database";

export type AdminEntityType =
  | "program"
  | "level"
  | "skill"
  | "unit"
  | "lesson"
  | "exercise"
  | "question";

export interface AdminProgram {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  cover_url: string | null;
  sort_order: number;
  is_active: boolean;
  settings: Record<string, unknown>;
}

export interface AdminLevel {
  id: string;
  program_id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface AdminSkill {
  id: string;
  level_id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface AdminUnit {
  id: string;
  skill_id: string;
  title: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  unlock_after_unit_id: string | null;
}

export interface AdminLesson {
  id: string;
  unit_id: string;
  title: string;
  slug: string;
  description: string | null;
  sort_order: number;
  estimated_minutes: number;
  is_active: boolean;
  unlock_after_lesson_id: string | null;
}

export interface AdminExercise {
  id: string;
  lesson_id: string;
  title: string;
  slug: string;
  instructions: string | null;
  exercise_type: ExerciseType;
  content: Record<string, unknown>;
  max_score: number;
  time_limit_seconds: number | null;
  sort_order: number;
  status: ContentStatus;
  is_active: boolean;
}

export interface AdminChoice {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  sort_order: number;
}

export interface AdminQuestionPair {
  id: string;
  question_id: string;
  left_text: string;
  right_text: string;
  sort_order: number;
}

export interface AdminQuestion {
  id: string;
  exercise_id: string;
  question_text: string;
  question_type: QuestionType;
  media_url: string | null;
  points: number;
  sort_order: number;
  content: Record<string, unknown>;
  explanation: string | null;
  choices?: AdminChoice[];
  pairs?: AdminQuestionPair[];
}

export interface AdminContentTree {
  programs: AdminProgram[];
  levels: AdminLevel[];
  skills: AdminSkill[];
  units: AdminUnit[];
  lessons: AdminLesson[];
  exercises: AdminExercise[];
  questions: AdminQuestion[];
}

export interface AdminPlacementTest {
  id: string;
  program_id: string;
  title: string;
  description: string | null;
  question_count: number;
  time_limit_minutes: number | null;
  is_active: boolean;
  settings: Record<string, unknown>;
  questions: {
    id: string;
    question_id: string;
    sort_order: number;
    skill_weight: Record<string, number>;
    question_text: string;
  }[];
}

export interface AdminMockTest {
  id: string;
  program_id: string;
  level_id: string | null;
  title: string;
  description: string | null;
  time_limit_minutes: number;
  total_score: number;
  is_active: boolean;
  settings: Record<string, unknown>;
  sections: {
    id: string;
    title: string;
    skill_id: string | null;
    sort_order: number;
    time_limit_minutes: number | null;
    questions: {
      id: string;
      question_id: string;
      sort_order: number;
      points: number;
      question_text: string;
    }[];
  }[];
}

export interface BulkExportBundle {
  version: 1;
  exportedAt: string;
  programs: AdminProgram[];
  levels: AdminLevel[];
  skills: AdminSkill[];
  units: AdminUnit[];
  lessons: AdminLesson[];
  exercises: AdminExercise[];
  questions: Omit<AdminQuestion, "choices" | "pairs">[];
  choices: AdminChoice[];
  question_pairs: AdminQuestionPair[];
  placement_tests: Omit<AdminPlacementTest, "questions">[];
  placement_test_questions: {
    id: string;
    placement_test_id: string;
    question_id: string;
    sort_order: number;
    skill_weight: Record<string, number>;
  }[];
  mock_tests: Omit<AdminMockTest, "sections">[];
  mock_test_sections: {
    id: string;
    mock_test_id: string;
    title: string;
    skill_id: string | null;
    sort_order: number;
    time_limit_minutes: number | null;
  }[];
  mock_test_questions: {
    id: string;
    mock_test_section_id: string;
    question_id: string;
    sort_order: number;
    points: number;
  }[];
}
