-- CAMBA Platform - Initial Schema Migration
-- Generic multi-program learning platform architecture

-- =============================================================================
-- EXTENSIONS
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================================================
-- ENUMS
-- =============================================================================
CREATE TYPE public.user_role AS ENUM ('student', 'parent', 'teacher', 'admin');

CREATE TYPE public.exercise_type AS ENUM (
  'multiple_choice',
  'multi_select',
  'matching',
  'drag_drop',
  'gap_fill',
  'sentence_ordering',
  'listening',
  'reading_comprehension',
  'image_selection',
  'writing',
  'speaking',
  'interactive'
);

CREATE TYPE public.question_type AS ENUM (
  'multiple_choice',
  'multi_select',
  'matching',
  'drag_drop',
  'gap_fill',
  'sentence_ordering',
  'listening',
  'reading',
  'image_selection',
  'writing',
  'speaking',
  'interactive'
);

CREATE TYPE public.mastery_level AS ENUM ('0', '1', '2', '3', '4');

CREATE TYPE public.content_status AS ENUM ('draft', 'pending_review', 'published', 'archived');

CREATE TYPE public.ai_feedback_type AS ENUM (
  'writing',
  'speaking',
  'study_coach',
  'question_generator',
  'parent_intelligence'
);

CREATE TYPE public.league_tier AS ENUM (
  'bronze',
  'silver',
  'gold',
  'platinum',
  'diamond',
  'master',
  'grandmaster',
  'champion'
);

CREATE TYPE public.xp_event_type AS ENUM (
  'lesson_complete',
  'daily_practice',
  'perfect_score',
  'streak_bonus',
  'mission_complete',
  'mock_test_complete',
  'placement_test_complete',
  'badge_earned',
  'admin_adjustment'
);

CREATE TYPE public.link_status AS ENUM ('pending', 'active', 'revoked');

-- =============================================================================
-- UTILITY FUNCTIONS
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');

  INSERT INTO public.user_gamification (user_id)
  VALUES (NEW.id);

  INSERT INTO public.user_streaks (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =============================================================================
-- PROFILES & ROLES
-- =============================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  locale TEXT NOT NULL DEFAULT 'vi',
  timezone TEXT NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
  date_of_birth DATE,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.user_role NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_by UUID REFERENCES public.profiles(id),
  UNIQUE (user_id, role)
);

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- =============================================================================
-- MULTI-PROGRAM CONTENT HIERARCHY
-- Program -> Level -> Skill -> Unit -> Lesson -> Exercise
-- =============================================================================
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  cover_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (program_id, slug)
);

CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_id UUID NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (level_id, slug)
);

CREATE TABLE public.units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  unlock_after_unit_id UUID REFERENCES public.units(id),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (skill_id, slug)
);

CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  estimated_minutes INTEGER NOT NULL DEFAULT 15,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  unlock_after_lesson_id UUID REFERENCES public.lessons(id),
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (unit_id, slug)
);

CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  instructions TEXT,
  exercise_type public.exercise_type NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  max_score INTEGER NOT NULL DEFAULT 100,
  time_limit_seconds INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'draft',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (lesson_id, slug)
);

CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type public.question_type NOT NULL,
  media_url TEXT,
  media_type TEXT,
  points INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  content JSONB NOT NULL DEFAULT '{}',
  explanation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.choices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  media_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE public.question_pairs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  left_text TEXT NOT NULL,
  right_text TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- =============================================================================
-- CONTENT TRANSLATIONS & PROGRAM SETTINGS
-- =============================================================================
CREATE TABLE public.content_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  locale TEXT NOT NULL,
  field_name TEXT NOT NULL,
  translated_value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (entity_type, entity_id, locale, field_name)
);

CREATE INDEX idx_content_translations_entity ON public.content_translations(entity_type, entity_id);

CREATE TABLE public.program_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (program_id, key)
);

-- =============================================================================
-- LEARNING PROGRESS & MASTERY
-- =============================================================================
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completion_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  accuracy_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  mastery_level SMALLINT NOT NULL DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 4),
  attempts_count INTEGER NOT NULL DEFAULT 0,
  is_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
  last_attempt_at TIMESTAMPTZ,
  mastered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

CREATE TABLE public.exercise_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  score NUMERIC(8,2) NOT NULL DEFAULT 0,
  max_score NUMERIC(8,2) NOT NULL DEFAULT 100,
  accuracy_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '{}',
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_exercise_attempts_user ON public.exercise_attempts(user_id);
CREATE INDEX idx_exercise_attempts_exercise ON public.exercise_attempts(exercise_id);
CREATE INDEX idx_lesson_progress_user ON public.lesson_progress(user_id);

-- =============================================================================
-- PLACEMENT TESTS
-- =============================================================================
CREATE TABLE public.placement_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  question_count INTEGER NOT NULL DEFAULT 30,
  time_limit_minutes INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.placement_test_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  placement_test_id UUID NOT NULL REFERENCES public.placement_tests(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  skill_weight JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE public.placement_test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  placement_test_id UUID NOT NULL REFERENCES public.placement_tests(id) ON DELETE CASCADE,
  score NUMERIC(8,2) NOT NULL DEFAULT 0,
  max_score NUMERIC(8,2) NOT NULL DEFAULT 100,
  estimated_level_id UUID REFERENCES public.levels(id),
  skill_breakdown JSONB NOT NULL DEFAULT '{}',
  answers JSONB NOT NULL DEFAULT '{}',
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- =============================================================================
-- MOCK TESTS
-- =============================================================================
CREATE TABLE public.mock_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  level_id UUID REFERENCES public.levels(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  time_limit_minutes INTEGER NOT NULL DEFAULT 60,
  total_score INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.mock_test_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mock_test_id UUID NOT NULL REFERENCES public.mock_tests(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  time_limit_minutes INTEGER
);

CREATE TABLE public.mock_test_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mock_test_section_id UUID NOT NULL REFERENCES public.mock_test_sections(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE public.mock_test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mock_test_id UUID NOT NULL REFERENCES public.mock_tests(id) ON DELETE CASCADE,
  score NUMERIC(8,2) NOT NULL DEFAULT 0,
  max_score NUMERIC(8,2) NOT NULL DEFAULT 100,
  estimated_level_id UUID REFERENCES public.levels(id),
  shield_estimate JSONB NOT NULL DEFAULT '{}',
  scale_score_estimate INTEGER,
  skill_breakdown JSONB NOT NULL DEFAULT '{}',
  answers JSONB NOT NULL DEFAULT '{}',
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_mock_test_attempts_user ON public.mock_test_attempts(user_id);

-- =============================================================================
-- GAMIFICATION
-- =============================================================================
CREATE TABLE public.user_gamification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  coins INTEGER NOT NULL DEFAULT 0,
  current_program_id UUID REFERENCES public.programs(id),
  current_level_id UUID REFERENCES public.levels(id),
  shield_progress JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.xp_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type public.xp_event_type NOT NULL UNIQUE,
  xp_amount INTEGER NOT NULL DEFAULT 0,
  coin_amount INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.xp_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type public.xp_event_type NOT NULL,
  xp_amount INTEGER NOT NULL DEFAULT 0,
  coin_amount INTEGER NOT NULL DEFAULT 0,
  reference_type TEXT,
  reference_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_xp_logs_user ON public.xp_logs(user_id);
CREATE INDEX idx_xp_logs_created ON public.xp_logs(created_at DESC);

CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  criteria JSONB NOT NULL DEFAULT '{}',
  xp_reward INTEGER NOT NULL DEFAULT 0,
  coin_reward INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}',
  UNIQUE (user_id, badge_id)
);

CREATE TABLE public.user_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.streak_calendar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  minutes_studied INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, activity_date)
);

CREATE TABLE public.daily_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  mission_type TEXT NOT NULL,
  target_value INTEGER NOT NULL DEFAULT 1,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  coin_reward INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE public.user_daily_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES public.daily_missions(id) ON DELETE CASCADE,
  mission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  current_value INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE (user_id, mission_id, mission_date)
);

-- =============================================================================
-- LEAGUES
-- =============================================================================
CREATE TABLE public.leagues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  tier public.league_tier NOT NULL DEFAULT 'bronze',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (week_start, tier)
);

CREATE TABLE public.league_rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  weekly_xp INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  tier public.league_tier NOT NULL DEFAULT 'bronze',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (league_id, user_id)
);

CREATE INDEX idx_league_rankings_league ON public.league_rankings(league_id, weekly_xp DESC);

-- =============================================================================
-- AI SUBMISSIONS & FEEDBACK
-- =============================================================================
CREATE TABLE public.writing_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.speaking_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  transcript TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.ai_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  feedback_type public.ai_feedback_type NOT NULL,
  reference_type TEXT NOT NULL,
  reference_id UUID NOT NULL,
  model_version TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
  input_data JSONB NOT NULL DEFAULT '{}',
  response_data JSONB NOT NULL DEFAULT '{}',
  estimated_level_id UUID REFERENCES public.levels(id),
  shield_estimate JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_feedback_user ON public.ai_feedback(user_id);
CREATE INDEX idx_ai_feedback_reference ON public.ai_feedback(reference_type, reference_id);

-- =============================================================================
-- RELATIONSHIPS: PARENT, TEACHER, CLASSES
-- =============================================================================
CREATE TABLE public.parent_student_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status public.link_status NOT NULL DEFAULT 'pending',
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE (parent_id, student_id),
  CHECK (parent_id != student_id)
);

CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  join_code TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(4), 'hex'),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.class_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (class_id, student_id)
);

CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  mock_test_id UUID REFERENCES public.mock_tests(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- ADAPTIVE LEARNING & RECOMMENDATIONS
-- =============================================================================
CREATE TABLE public.learning_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  reference_type TEXT,
  reference_id UUID,
  priority INTEGER NOT NULL DEFAULT 0,
  is_dismissed BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_learning_recommendations_user ON public.learning_recommendations(user_id, is_dismissed);

-- =============================================================================
-- TRIGGERS
-- =============================================================================
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER programs_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER levels_updated_at
  BEFORE UPDATE ON public.levels
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER units_updated_at
  BEFORE UPDATE ON public.units
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER exercises_updated_at
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER user_gamification_updated_at
  BEFORE UPDATE ON public.user_gamification
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER user_streaks_updated_at
  BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
