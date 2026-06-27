export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "student" | "parent" | "teacher" | "admin";

export type ExerciseType =
  | "multiple_choice"
  | "multi_select"
  | "matching"
  | "drag_drop"
  | "gap_fill"
  | "sentence_ordering"
  | "listening"
  | "reading_comprehension"
  | "image_selection"
  | "writing"
  | "speaking"
  | "interactive";

/** Aligned with question_type enum after migration 010 */
export type QuestionType = ExerciseType;

export type MasteryLevelValue = 0 | 1 | 2 | 3 | 4;

export type ContentStatus = "draft" | "pending_review" | "published" | "archived";

export type LinkStatus = "pending" | "active" | "revoked";

export type LeagueTier =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "master"
  | "grandmaster"
  | "champion";

export type XpEventType =
  | "lesson_complete"
  | "daily_practice"
  | "exercise_complete"
  | "perfect_score"
  | "streak_bonus"
  | "mission_complete"
  | "mock_test_complete"
  | "placement_test_complete"
  | "badge_earned"
  | "admin_adjustment";

export type AiFeedbackType =
  | "writing"
  | "speaking"
  | "study_coach"
  | "question_generator"
  | "parent_intelligence";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          locale: string;
          timezone: string;
          date_of_birth: string | null;
          phone: string | null;
          is_active: boolean;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          avatar_url?: string | null;
          locale?: string;
          timezone?: string;
          date_of_birth?: string | null;
          phone?: string | null;
          is_active?: boolean;
          onboarding_completed?: boolean;
        };
        Update: {
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          locale?: string;
          timezone?: string;
          date_of_birth?: string | null;
          phone?: string | null;
          is_active?: boolean;
          onboarding_completed?: boolean;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: UserRole;
          assigned_at: string;
          assigned_by: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: UserRole;
          assigned_at?: string;
          assigned_by?: string | null;
        };
        Update: {
          role?: UserRole;
          assigned_by?: string | null;
        };
        Relationships: [];
      };
      programs: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon_url: string | null;
          cover_url: string | null;
          is_active: boolean;
          sort_order: number;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          icon_url?: string | null;
          cover_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          settings?: Json;
        };
        Update: {
          slug?: string;
          name?: string;
          description?: string | null;
          icon_url?: string | null;
          cover_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          settings?: Json;
        };
        Relationships: [];
      };
      program_settings: {
        Row: {
          id: string;
          program_id: string;
          key: string;
          value: Json;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          key: string;
          value?: Json;
          description?: string | null;
        };
        Update: {
          value?: Json;
          description?: string | null;
        };
        Relationships: [];
      };
      site_text_overrides: {
        Row: {
          id: string;
          locale: string;
          message_key: string;
          value: string;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          locale: string;
          message_key: string;
          value: string;
          updated_by?: string | null;
        };
        Update: {
          locale?: string;
          message_key?: string;
          value?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      levels: {
        Row: {
          id: string;
          program_id: string;
          slug: string;
          name: string;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          slug: string;
          name: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          metadata?: Json;
        };
        Update: {
          slug?: string;
          name?: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          metadata?: Json;
        };
        Relationships: [];
      };
      user_gamification: {
        Row: {
          id: string;
          user_id: string;
          total_xp: number;
          level: number;
          coins: number;
          current_program_id: string | null;
          current_level_id: string | null;
          shield_progress: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_xp?: number;
          level?: number;
          coins?: number;
          current_program_id?: string | null;
          current_level_id?: string | null;
          shield_progress?: Json;
        };
        Update: {
          total_xp?: number;
          level?: number;
          coins?: number;
          current_program_id?: string | null;
          current_level_id?: string | null;
          shield_progress?: Json;
        };
        Relationships: [];
      };
      user_streaks: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number;
          best_streak: number;
          last_activity_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_streak?: number;
          best_streak?: number;
          last_activity_date?: string | null;
        };
        Update: {
          current_streak?: number;
          best_streak?: number;
          last_activity_date?: string | null;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          level_id: string;
          slug: string;
          name: string;
          description: string | null;
          icon: string | null;
          sort_order: number;
          is_active: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          level_id: string;
          slug: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
          metadata?: Json;
        };
        Update: {
          slug?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          sort_order?: number;
          is_active?: boolean;
          metadata?: Json;
        };
        Relationships: [];
      };
      units: {
        Row: {
          id: string;
          skill_id: string;
          slug: string;
          title: string;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          unlock_after_unit_id: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          skill_id: string;
          slug: string;
          title: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          unlock_after_unit_id?: string | null;
          metadata?: Json;
        };
        Update: {
          slug?: string;
          title?: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          unlock_after_unit_id?: string | null;
          metadata?: Json;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          unit_id: string;
          slug: string;
          title: string;
          description: string | null;
          sort_order: number;
          estimated_minutes: number;
          is_active: boolean;
          unlock_after_lesson_id: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          unit_id: string;
          slug: string;
          title: string;
          description?: string | null;
          sort_order?: number;
          estimated_minutes?: number;
          is_active?: boolean;
          unlock_after_lesson_id?: string | null;
          metadata?: Json;
        };
        Update: {
          slug?: string;
          title?: string;
          description?: string | null;
          sort_order?: number;
          estimated_minutes?: number;
          is_active?: boolean;
          unlock_after_lesson_id?: string | null;
          metadata?: Json;
        };
        Relationships: [];
      };
      exercises: {
        Row: {
          id: string;
          lesson_id: string;
          slug: string;
          title: string;
          instructions: string | null;
          exercise_type: ExerciseType;
          content: Json;
          max_score: number;
          time_limit_seconds: number | null;
          sort_order: number;
          status: ContentStatus;
          is_active: boolean;
          metadata: Json;
          created_by: string | null;
          approved_by: string | null;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          slug: string;
          title: string;
          instructions?: string | null;
          exercise_type: ExerciseType;
          content?: Json;
          max_score?: number;
          time_limit_seconds?: number | null;
          sort_order?: number;
          status?: ContentStatus;
          is_active?: boolean;
          metadata?: Json;
          created_by?: string | null;
        };
        Update: {
          slug?: string;
          title?: string;
          instructions?: string | null;
          exercise_type?: ExerciseType;
          content?: Json;
          max_score?: number;
          time_limit_seconds?: number | null;
          sort_order?: number;
          status?: ContentStatus;
          is_active?: boolean;
          metadata?: Json;
          approved_by?: string | null;
          approved_at?: string | null;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          exercise_id: string;
          question_text: string;
          question_type: QuestionType;
          media_url: string | null;
          media_type: string | null;
          points: number;
          sort_order: number;
          content: Json;
          explanation: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          exercise_id: string;
          question_text: string;
          question_type: QuestionType;
          media_url?: string | null;
          media_type?: string | null;
          points?: number;
          sort_order?: number;
          content?: Json;
          explanation?: string | null;
        };
        Update: {
          question_text?: string;
          question_type?: ExerciseType;
          media_url?: string | null;
          media_type?: string | null;
          points?: number;
          sort_order?: number;
          content?: Json;
          explanation?: string | null;
        };
        Relationships: [];
      };
      choices: {
        Row: {
          id: string;
          question_id: string;
          text: string;
          is_correct: boolean;
          sort_order: number;
          media_url: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          question_id: string;
          text: string;
          is_correct?: boolean;
          sort_order?: number;
          media_url?: string | null;
          metadata?: Json;
        };
        Update: {
          text?: string;
          is_correct?: boolean;
          sort_order?: number;
          media_url?: string | null;
          metadata?: Json;
        };
        Relationships: [];
      };
      question_pairs: {
        Row: {
          id: string;
          question_id: string;
          left_text: string;
          right_text: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          question_id: string;
          left_text: string;
          right_text: string;
          sort_order?: number;
        };
        Update: {
          left_text?: string;
          right_text?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      exercise_attempts: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          lesson_id: string;
          score: number;
          max_score: number;
          accuracy_percent: number;
          time_spent_seconds: number;
          answers: Json;
          is_completed: boolean;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          lesson_id: string;
          score?: number;
          max_score?: number;
          accuracy_percent?: number;
          time_spent_seconds?: number;
          answers?: Json;
          is_completed?: boolean;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: {
          score?: number;
          max_score?: number;
          accuracy_percent?: number;
          time_spent_seconds?: number;
          answers?: Json;
          is_completed?: boolean;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      placement_tests: {
        Row: {
          id: string;
          program_id: string;
          title: string;
          description: string | null;
          question_count: number;
          time_limit_minutes: number | null;
          is_active: boolean;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          title: string;
          description?: string | null;
          question_count?: number;
          time_limit_minutes?: number | null;
          is_active?: boolean;
          settings?: Json;
        };
        Update: {
          title?: string;
          description?: string | null;
          question_count?: number;
          time_limit_minutes?: number | null;
          is_active?: boolean;
          settings?: Json;
        };
        Relationships: [];
      };
      placement_test_questions: {
        Row: {
          id: string;
          placement_test_id: string;
          question_id: string;
          sort_order: number;
          skill_weight: Json;
        };
        Insert: {
          id?: string;
          placement_test_id: string;
          question_id: string;
          sort_order?: number;
          skill_weight?: Json;
        };
        Update: {
          sort_order?: number;
          skill_weight?: Json;
        };
        Relationships: [];
      };
      placement_test_attempts: {
        Row: {
          id: string;
          user_id: string;
          placement_test_id: string;
          score: number;
          max_score: number;
          estimated_level_id: string | null;
          skill_breakdown: Json;
          answers: Json;
          time_spent_seconds: number;
          is_completed: boolean;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          placement_test_id: string;
          score?: number;
          max_score?: number;
          estimated_level_id?: string | null;
          skill_breakdown?: Json;
          answers?: Json;
          time_spent_seconds?: number;
          is_completed?: boolean;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: {
          score?: number;
          max_score?: number;
          estimated_level_id?: string | null;
          skill_breakdown?: Json;
          answers?: Json;
          time_spent_seconds?: number;
          is_completed?: boolean;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      xp_rules: {
        Row: {
          id: string;
          event_type: XpEventType;
          xp_amount: number;
          coin_amount: number;
          description: string | null;
          is_active: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_type: XpEventType;
          xp_amount?: number;
          coin_amount?: number;
          description?: string | null;
          is_active?: boolean;
          metadata?: Json;
        };
        Update: {
          xp_amount?: number;
          coin_amount?: number;
          description?: string | null;
          is_active?: boolean;
          metadata?: Json;
        };
        Relationships: [];
      };
      xp_logs: {
        Row: {
          id: string;
          user_id: string;
          event_type: XpEventType;
          xp_amount: number;
          coin_amount: number;
          reference_type: string | null;
          reference_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_type: XpEventType;
          xp_amount?: number;
          coin_amount?: number;
          reference_type?: string | null;
          reference_id?: string | null;
          metadata?: Json;
        };
        Update: {
          xp_amount?: number;
          coin_amount?: number;
          metadata?: Json;
        };
        Relationships: [];
      };
      badges: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon_url: string | null;
          criteria: Json;
          xp_reward: number;
          coin_reward: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          icon_url?: string | null;
          criteria?: Json;
          xp_reward?: number;
          coin_reward?: number;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          description?: string | null;
          is_active?: boolean;
          criteria?: Json;
        };
        Relationships: [];
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
          metadata: Json;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          earned_at?: string;
          metadata?: Json;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      streak_calendar: {
        Row: {
          id: string;
          user_id: string;
          activity_date: string;
          minutes_studied: number;
          xp_earned: number;
          lessons_completed: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_date: string;
          minutes_studied?: number;
          xp_earned?: number;
          lessons_completed?: number;
        };
        Update: {
          minutes_studied?: number;
          xp_earned?: number;
          lessons_completed?: number;
        };
        Relationships: [];
      };
      daily_missions: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          mission_type: string;
          target_value: number;
          xp_reward: number;
          coin_reward: number;
          is_active: boolean;
          metadata: Json;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          mission_type: string;
          target_value?: number;
          xp_reward?: number;
          coin_reward?: number;
          is_active?: boolean;
          metadata?: Json;
        };
        Update: {
          title?: string;
          is_active?: boolean;
        };
        Relationships: [];
      };
      user_daily_missions: {
        Row: {
          id: string;
          user_id: string;
          mission_id: string;
          mission_date: string;
          current_value: number;
          is_completed: boolean;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          mission_id: string;
          mission_date?: string;
          current_value?: number;
          is_completed?: boolean;
          completed_at?: string | null;
        };
        Update: {
          current_value?: number;
          is_completed?: boolean;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      leagues: {
        Row: {
          id: string;
          week_start: string;
          week_end: string;
          tier: LeagueTier;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          week_start: string;
          week_end: string;
          tier?: LeagueTier;
          is_active?: boolean;
        };
        Update: {
          is_active?: boolean;
        };
        Relationships: [];
      };
      league_rankings: {
        Row: {
          id: string;
          league_id: string;
          user_id: string;
          weekly_xp: number;
          rank: number | null;
          tier: LeagueTier;
          updated_at: string;
        };
        Insert: {
          id?: string;
          league_id: string;
          user_id: string;
          weekly_xp?: number;
          rank?: number | null;
          tier?: LeagueTier;
        };
        Update: {
          weekly_xp?: number;
          rank?: number | null;
          tier?: LeagueTier;
          updated_at?: string;
        };
        Relationships: [];
      };
      parent_student_links: {
        Row: {
          id: string;
          parent_id: string;
          student_id: string;
          status: LinkStatus;
          invited_at: string;
          accepted_at: string | null;
        };
        Insert: {
          id?: string;
          parent_id: string;
          student_id: string;
          status?: LinkStatus;
        };
        Update: {
          status?: LinkStatus;
          accepted_at?: string | null;
        };
        Relationships: [];
      };
      classes: {
        Row: {
          id: string;
          teacher_id: string;
          program_id: string | null;
          name: string;
          description: string | null;
          join_code: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          program_id?: string | null;
          name: string;
          description?: string | null;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          description?: string | null;
          program_id?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      class_students: {
        Row: {
          id: string;
          class_id: string;
          student_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          student_id: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      assignments: {
        Row: {
          id: string;
          class_id: string;
          teacher_id: string;
          title: string;
          description: string | null;
          lesson_id: string | null;
          mock_test_id: string | null;
          due_date: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          teacher_id: string;
          title: string;
          description?: string | null;
          lesson_id?: string | null;
          mock_test_id?: string | null;
          due_date?: string | null;
          is_active?: boolean;
        };
        Update: {
          title?: string;
          description?: string | null;
          due_date?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      mock_test_attempts: {
        Row: {
          id: string;
          user_id: string;
          mock_test_id: string;
          score: number;
          max_score: number;
          estimated_level_id: string | null;
          shield_estimate: Json;
          scale_score_estimate: number | null;
          skill_breakdown: Json;
          answers: Json;
          time_spent_seconds: number;
          is_completed: boolean;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          mock_test_id: string;
          score?: number;
          max_score?: number;
          estimated_level_id?: string | null;
          shield_estimate?: Json;
          scale_score_estimate?: number | null;
          skill_breakdown?: Json;
          answers?: Json;
          time_spent_seconds?: number;
          is_completed?: boolean;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: {
          score?: number;
          max_score?: number;
          is_completed?: boolean;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      mock_tests: {
        Row: {
          id: string;
          program_id: string;
          level_id: string | null;
          title: string;
          description: string | null;
          time_limit_minutes: number;
          total_score: number;
          is_active: boolean;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          level_id?: string | null;
          title: string;
          description?: string | null;
          time_limit_minutes?: number;
          total_score?: number;
          is_active?: boolean;
          settings?: Json;
        };
        Update: {
          title?: string;
          description?: string | null;
          level_id?: string | null;
          time_limit_minutes?: number;
          total_score?: number;
          is_active?: boolean;
          settings?: Json;
        };
        Relationships: [];
      };
      mock_test_sections: {
        Row: {
          id: string;
          mock_test_id: string;
          skill_id: string | null;
          title: string;
          sort_order: number;
          time_limit_minutes: number | null;
        };
        Insert: {
          id?: string;
          mock_test_id: string;
          skill_id?: string | null;
          title: string;
          sort_order?: number;
          time_limit_minutes?: number | null;
        };
        Update: {
          title?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      mock_test_questions: {
        Row: {
          id: string;
          mock_test_section_id: string;
          question_id: string;
          sort_order: number;
          points: number;
        };
        Insert: {
          id?: string;
          mock_test_section_id: string;
          question_id: string;
          sort_order?: number;
          points?: number;
        };
        Update: {
          sort_order?: number;
          points?: number;
        };
        Relationships: [];
      };
      writing_submissions: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string | null;
          prompt: string;
          content: string;
          word_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id?: string | null;
          prompt: string;
          content: string;
          word_count?: number;
        };
        Update: {
          content?: string;
          word_count?: number;
        };
        Relationships: [];
      };
      speaking_submissions: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string | null;
          prompt: string;
          audio_url: string;
          duration_seconds: number;
          transcript: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id?: string | null;
          prompt: string;
          audio_url: string;
          duration_seconds?: number;
          transcript?: string | null;
        };
        Update: {
          audio_url?: string;
          duration_seconds?: number;
          transcript?: string | null;
        };
        Relationships: [];
      };
      ai_feedback: {
        Row: {
          id: string;
          user_id: string;
          feedback_type: AiFeedbackType;
          reference_type: string;
          reference_id: string;
          model_version: string;
          input_data: Json;
          response_data: Json;
          estimated_level_id: string | null;
          shield_estimate: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          feedback_type: AiFeedbackType;
          reference_type: string;
          reference_id: string;
          model_version?: string;
          input_data?: Json;
          response_data?: Json;
          estimated_level_id?: string | null;
          shield_estimate?: Json;
        };
        Update: {
          response_data?: Json;
          estimated_level_id?: string | null;
        };
        Relationships: [];
      };
      learning_recommendations: {
        Row: {
          id: string;
          user_id: string;
          recommendation_type: string;
          title: string;
          description: string | null;
          reference_type: string | null;
          reference_id: string | null;
          priority: number;
          is_dismissed: boolean;
          expires_at: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recommendation_type: string;
          title: string;
          description?: string | null;
          reference_type?: string | null;
          reference_id?: string | null;
          priority?: number;
          is_dismissed?: boolean;
          expires_at?: string | null;
          metadata?: Json;
        };
        Update: {
          is_dismissed?: boolean;
          priority?: number;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          program_id: string;
          completion_percent: number;
          accuracy_percent: number;
          mastery_level: number;
          attempts_count: number;
          is_unlocked: boolean;
          last_attempt_at: string | null;
          mastered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          program_id: string;
          completion_percent?: number;
          accuracy_percent?: number;
          mastery_level?: number;
          attempts_count?: number;
          is_unlocked?: boolean;
          last_attempt_at?: string | null;
          mastered_at?: string | null;
        };
        Update: {
          program_id?: string;
          completion_percent?: number;
          accuracy_percent?: number;
          mastery_level?: number;
          attempts_count?: number;
          is_unlocked?: boolean;
          last_attempt_at?: string | null;
          mastered_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      has_role: {
        Args: { check_role: UserRole };
        Returns: boolean;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_teacher: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_parent_of: {
        Args: { student_uuid: string };
        Returns: boolean;
      };
      is_teacher_of: {
        Args: { student_uuid: string };
        Returns: boolean;
      };
      invite_student_by_email: {
        Args: { student_email: string };
        Returns: Json;
      };
      respond_to_parent_link: {
        Args: { link_id: string; accept: boolean };
        Returns: undefined;
      };
      join_class_by_code: {
        Args: { code: string };
        Returns: string;
      };
      ensure_user_bootstrap: {
        Args: { p_user_id?: string };
        Returns: undefined;
      };
      ensure_week_league: {
        Args: {
          p_week_start: string;
          p_week_end: string;
          p_tier: LeagueTier;
        };
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      exercise_type: ExerciseType;
      question_type: QuestionType;
      content_status: ContentStatus;
      league_tier: LeagueTier;
      xp_event_type: XpEventType;
      ai_feedback_type: AiFeedbackType;
      link_status: LinkStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserRoleRow = Database["public"]["Tables"]["user_roles"]["Row"];
export type Program = Database["public"]["Tables"]["programs"]["Row"];
export type Level = Database["public"]["Tables"]["levels"]["Row"];
export type UserGamification = Database["public"]["Tables"]["user_gamification"]["Row"];
export type UserStreak = Database["public"]["Tables"]["user_streaks"]["Row"];
export type LessonProgress = Database["public"]["Tables"]["lesson_progress"]["Row"];
