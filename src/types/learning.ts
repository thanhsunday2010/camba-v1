import type { ContentStatus, ExerciseType } from "./database";

export interface Choice {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  sort_order: number;
  media_url: string | null;
}

/** Client-safe choice without answer key */
export type PublicChoice = Omit<Choice, "is_correct">;

export interface QuestionPair {
  id: string;
  question_id: string;
  left_text: string;
  right_text: string;
  sort_order: number;
}

/** Client-safe pair without answer key */
export type PublicQuestionPair = Omit<QuestionPair, "right_text">;

export interface Question {
  id: string;
  exercise_id: string;
  question_text: string;
  question_type: ExerciseType;
  media_url: string | null;
  media_type: string | null;
  points: number;
  sort_order: number;
  content: Record<string, unknown>;
  explanation: string | null;
  choices?: Choice[];
  pairs?: QuestionPair[];
}

/** Client-safe question without answer keys in choices, pairs, or content */
export type PublicQuestion = Omit<Question, "choices" | "pairs" | "content"> & {
  choices?: PublicChoice[];
  pairs?: PublicQuestionPair[];
  content: Record<string, unknown>;
  matchingOptions?: string[];
};

export interface Exercise {
  id: string;
  lesson_id: string;
  slug: string;
  title: string;
  instructions: string | null;
  exercise_type: ExerciseType;
  content: Record<string, unknown>;
  max_score: number;
  time_limit_seconds: number | null;
  sort_order: number;
  status: ContentStatus;
  questions?: PublicQuestion[];
}

export interface Lesson {
  id: string;
  unit_id: string;
  slug: string;
  title: string;
  description: string | null;
  sort_order: number;
  estimated_minutes: number;
  unlock_after_lesson_id: string | null;
  exercises?: Exercise[];
}

export interface Unit {
  id: string;
  skill_id: string;
  slug: string;
  title: string;
  description: string | null;
  sort_order: number;
  unlock_after_unit_id: string | null;
  lessons?: LessonWithProgress[];
}

export interface Skill {
  id: string;
  level_id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  units?: Unit[];
}

export interface LessonWithProgress extends Lesson {
  progress?: {
    completion_percent: number;
    accuracy_percent: number;
    mastery_level: number;
    is_unlocked: boolean;
    attempts_count: number;
  };
}

export interface LearningPath {
  program: { id: string; name: string; slug: string };
  level: { id: string; name: string; slug: string };
  skills: Skill[];
}

export type UserAnswer =
  | { type: "single"; choiceId: string }
  | { type: "multi"; choiceIds: string[] }
  | { type: "matching"; pairs: { leftId: string; rightText: string }[] }
  | { type: "gap_fill"; answers: string[] }
  | { type: "sentence_ordering"; order: string[] }
  | { type: "text"; text: string };

export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  explanation: string | null;
  correctChoiceId?: string;
  correctChoiceIds?: string[];
  correctPairs?: { leftId: string; rightText: string }[];
  correctAnswers?: string[];
  correctOrder?: string[];
}

export interface ExerciseResult {
  score: number;
  maxScore: number;
  accuracyPercent: number;
  questionResults: QuestionResult[];
}

export interface PlacementQuestion extends PublicQuestion {
  skill_weight?: Record<string, number>;
}

export interface PlacementTestData {
  id: string;
  title: string;
  description: string | null;
  question_count: number;
  time_limit_minutes: number | null;
  questions: PlacementQuestion[];
}

export interface MockTestQuestion extends PublicQuestion {
  sectionId: string;
  mockPoints: number;
}

export interface MockTestSection {
  id: string;
  title: string;
  sortOrder: number;
  timeLimitMinutes: number | null;
  skillSlug: string | null;
  skillName: string | null;
  questions: MockTestQuestion[];
}

export interface MockTestData {
  id: string;
  title: string;
  description: string | null;
  timeLimitMinutes: number;
  totalScore: number;
  levelId: string | null;
  levelName: string | null;
  sections: MockTestSection[];
}

export interface MockTestSummary {
  id: string;
  title: string;
  description: string | null;
  timeLimitMinutes: number;
  levelName: string | null;
  questionCount: number;
  bestScorePercent: number | null;
  attemptCount: number;
}

export interface MockTestResult {
  score: number;
  maxScore: number;
  accuracyPercent: number;
  skillBreakdown: Record<string, number>;
  shieldEstimate: Record<string, number>;
}
