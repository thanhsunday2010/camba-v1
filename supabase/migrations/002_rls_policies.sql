-- CAMBA Platform - Row Level Security Policies

-- =============================================================================
-- ENABLE RLS
-- =============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_test_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streak_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speaking_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_recommendations ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================
CREATE OR REPLACE FUNCTION public.has_role(check_role public.user_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = check_role
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT public.has_role('admin');
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
  SELECT public.has_role('teacher');
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_parent_of(student_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.parent_student_links
    WHERE parent_id = auth.uid()
      AND student_id = student_uuid
      AND status = 'active'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_teacher_of(student_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.class_students cs
    JOIN public.classes c ON c.id = cs.class_id
    WHERE cs.student_id = student_uuid
      AND c.teacher_id = auth.uid()
      AND c.is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- =============================================================================
-- PROFILES
-- =============================================================================
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Parents can view linked student profiles"
  ON public.profiles FOR SELECT
  USING (public.is_parent_of(id));

CREATE POLICY "Teachers can view their students profiles"
  ON public.profiles FOR SELECT
  USING (public.is_teacher_of(id));

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- =============================================================================
-- USER ROLES
-- =============================================================================
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin());

-- =============================================================================
-- CONTENT (Public read for published, admin write)
-- =============================================================================
CREATE POLICY "Anyone authenticated can view active programs"
  ON public.programs FOR SELECT
  TO authenticated
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage programs"
  ON public.programs FOR ALL
  USING (public.is_admin());

CREATE POLICY "Anyone authenticated can view active levels"
  ON public.levels FOR SELECT
  TO authenticated
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage levels"
  ON public.levels FOR ALL
  USING (public.is_admin());

CREATE POLICY "Anyone authenticated can view active skills"
  ON public.skills FOR SELECT
  TO authenticated
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage skills"
  ON public.skills FOR ALL
  USING (public.is_admin());

CREATE POLICY "Anyone authenticated can view active units"
  ON public.units FOR SELECT
  TO authenticated
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage units"
  ON public.units FOR ALL
  USING (public.is_admin());

CREATE POLICY "Anyone authenticated can view active lessons"
  ON public.lessons FOR SELECT
  TO authenticated
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage lessons"
  ON public.lessons FOR ALL
  USING (public.is_admin());

CREATE POLICY "Students can view published exercises"
  ON public.exercises FOR SELECT
  TO authenticated
  USING (
    (status = 'published' AND is_active = TRUE)
    OR public.is_admin()
    OR public.is_teacher()
  );

CREATE POLICY "Admins can manage exercises"
  ON public.exercises FOR ALL
  USING (public.is_admin());

CREATE POLICY "Authenticated can view questions of published exercises"
  ON public.questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.exercises e
      WHERE e.id = exercise_id
        AND (e.status = 'published' OR public.is_admin())
    )
  );

CREATE POLICY "Admins can manage questions"
  ON public.questions FOR ALL
  USING (public.is_admin());

CREATE POLICY "Authenticated can view choices"
  ON public.choices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.questions q
      JOIN public.exercises e ON e.id = q.exercise_id
      WHERE q.id = question_id
        AND (e.status = 'published' OR public.is_admin())
    )
  );

CREATE POLICY "Admins can manage choices"
  ON public.choices FOR ALL
  USING (public.is_admin());

CREATE POLICY "Authenticated can view question pairs"
  ON public.question_pairs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.questions q
      JOIN public.exercises e ON e.id = q.exercise_id
      WHERE q.id = question_id
        AND (e.status = 'published' OR public.is_admin())
    )
  );

CREATE POLICY "Admins can manage question pairs"
  ON public.question_pairs FOR ALL
  USING (public.is_admin());

CREATE POLICY "Anyone authenticated can view translations"
  ON public.content_translations FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Admins can manage translations"
  ON public.content_translations FOR ALL
  USING (public.is_admin());

CREATE POLICY "Anyone authenticated can view program settings"
  ON public.program_settings FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Admins can manage program settings"
  ON public.program_settings FOR ALL
  USING (public.is_admin());

-- =============================================================================
-- LEARNING PROGRESS
-- =============================================================================
CREATE POLICY "Users can view own lesson progress"
  ON public.lesson_progress FOR SELECT
  USING (auth.uid() = user_id OR public.is_parent_of(user_id) OR public.is_teacher_of(user_id) OR public.is_admin());

CREATE POLICY "Users can manage own lesson progress"
  ON public.lesson_progress FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own exercise attempts"
  ON public.exercise_attempts FOR SELECT
  USING (auth.uid() = user_id OR public.is_parent_of(user_id) OR public.is_teacher_of(user_id) OR public.is_admin());

CREATE POLICY "Users can create own exercise attempts"
  ON public.exercise_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercise attempts"
  ON public.exercise_attempts FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================================================
-- PLACEMENT & MOCK TESTS
-- =============================================================================
CREATE POLICY "Authenticated can view active placement tests"
  ON public.placement_tests FOR SELECT
  TO authenticated
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage placement tests"
  ON public.placement_tests FOR ALL
  USING (public.is_admin());

CREATE POLICY "Authenticated can view placement test questions"
  ON public.placement_test_questions FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Admins can manage placement test questions"
  ON public.placement_test_questions FOR ALL
  USING (public.is_admin());

CREATE POLICY "Users can view own placement attempts"
  ON public.placement_test_attempts FOR SELECT
  USING (auth.uid() = user_id OR public.is_parent_of(user_id) OR public.is_admin());

CREATE POLICY "Users can manage own placement attempts"
  ON public.placement_test_attempts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated can view active mock tests"
  ON public.mock_tests FOR SELECT
  TO authenticated
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage mock tests"
  ON public.mock_tests FOR ALL
  USING (public.is_admin());

CREATE POLICY "Authenticated can view mock test sections"
  ON public.mock_test_sections FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Admins can manage mock test sections"
  ON public.mock_test_sections FOR ALL
  USING (public.is_admin());

CREATE POLICY "Authenticated can view mock test questions"
  ON public.mock_test_questions FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Admins can manage mock test questions"
  ON public.mock_test_questions FOR ALL
  USING (public.is_admin());

CREATE POLICY "Users can view own mock test attempts"
  ON public.mock_test_attempts FOR SELECT
  USING (auth.uid() = user_id OR public.is_parent_of(user_id) OR public.is_teacher_of(user_id) OR public.is_admin());

CREATE POLICY "Users can manage own mock test attempts"
  ON public.mock_test_attempts FOR ALL
  USING (auth.uid() = user_id);

-- =============================================================================
-- GAMIFICATION
-- =============================================================================
CREATE POLICY "Users can view own gamification"
  ON public.user_gamification FOR SELECT
  USING (auth.uid() = user_id OR public.is_parent_of(user_id) OR public.is_admin());

CREATE POLICY "System updates gamification via service role"
  ON public.user_gamification FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Anyone can view xp rules"
  ON public.xp_rules FOR SELECT
  TO authenticated
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage xp rules"
  ON public.xp_rules FOR ALL
  USING (public.is_admin());

CREATE POLICY "Users can view own xp logs"
  ON public.xp_logs FOR SELECT
  USING (auth.uid() = user_id OR public.is_parent_of(user_id) OR public.is_admin());

CREATE POLICY "Users can view badges"
  ON public.badges FOR SELECT
  TO authenticated
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage badges"
  ON public.badges FOR ALL
  USING (public.is_admin());

CREATE POLICY "Users can view own badges"
  ON public.user_badges FOR SELECT
  USING (auth.uid() = user_id OR public.is_parent_of(user_id) OR public.is_admin());

CREATE POLICY "Users can view own streaks"
  ON public.user_streaks FOR SELECT
  USING (auth.uid() = user_id OR public.is_parent_of(user_id) OR public.is_admin());

CREATE POLICY "Users can update own streaks"
  ON public.user_streaks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own streak calendar"
  ON public.streak_calendar FOR SELECT
  USING (auth.uid() = user_id OR public.is_parent_of(user_id) OR public.is_admin());

CREATE POLICY "Users can manage own streak calendar"
  ON public.streak_calendar FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view daily missions"
  ON public.daily_missions FOR SELECT
  TO authenticated
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage daily missions"
  ON public.daily_missions FOR ALL
  USING (public.is_admin());

CREATE POLICY "Users can view own daily missions"
  ON public.user_daily_missions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own daily missions"
  ON public.user_daily_missions FOR ALL
  USING (auth.uid() = user_id);

-- =============================================================================
-- LEAGUES
-- =============================================================================
CREATE POLICY "Anyone can view leagues"
  ON public.leagues FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Admins can manage leagues"
  ON public.leagues FOR ALL
  USING (public.is_admin());

CREATE POLICY "Anyone can view league rankings"
  ON public.league_rankings FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Users can update own league ranking"
  ON public.league_rankings FOR ALL
  USING (auth.uid() = user_id OR public.is_admin());

-- =============================================================================
-- AI SUBMISSIONS
-- =============================================================================
CREATE POLICY "Users can view own writing submissions"
  ON public.writing_submissions FOR SELECT
  USING (auth.uid() = user_id OR public.is_parent_of(user_id) OR public.is_teacher_of(user_id) OR public.is_admin());

CREATE POLICY "Users can create own writing submissions"
  ON public.writing_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own speaking submissions"
  ON public.speaking_submissions FOR SELECT
  USING (auth.uid() = user_id OR public.is_parent_of(user_id) OR public.is_teacher_of(user_id) OR public.is_admin());

CREATE POLICY "Users can create own speaking submissions"
  ON public.speaking_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own ai feedback"
  ON public.ai_feedback FOR SELECT
  USING (auth.uid() = user_id OR public.is_parent_of(user_id) OR public.is_admin());

CREATE POLICY "Users can create own ai feedback records"
  ON public.ai_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- =============================================================================
-- RELATIONSHIPS
-- =============================================================================
CREATE POLICY "Parents can view own links"
  ON public.parent_student_links FOR SELECT
  USING (auth.uid() = parent_id OR auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Parents can create links"
  ON public.parent_student_links FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Students can update link status"
  ON public.parent_student_links FOR UPDATE
  USING (auth.uid() = student_id OR auth.uid() = parent_id OR public.is_admin());

CREATE POLICY "Teachers can view own classes"
  ON public.classes FOR SELECT
  USING (auth.uid() = teacher_id OR public.is_admin());

CREATE POLICY "Teachers can manage own classes"
  ON public.classes FOR ALL
  USING (auth.uid() = teacher_id OR public.is_admin());

CREATE POLICY "Students can view their classes"
  ON public.class_students FOR SELECT
  USING (
    auth.uid() = student_id
    OR EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.teacher_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "Students can join classes"
  ON public.class_students FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can manage class students"
  ON public.class_students FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.teacher_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "Teachers can view own assignments"
  ON public.assignments FOR SELECT
  USING (
    auth.uid() = teacher_id
    OR EXISTS (
      SELECT 1 FROM public.class_students cs
      WHERE cs.class_id = assignments.class_id AND cs.student_id = auth.uid()
    )
    OR public.is_admin()
  );

CREATE POLICY "Teachers can manage own assignments"
  ON public.assignments FOR ALL
  USING (auth.uid() = teacher_id OR public.is_admin());

-- =============================================================================
-- RECOMMENDATIONS
-- =============================================================================
CREATE POLICY "Users can view own recommendations"
  ON public.learning_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON public.learning_recommendations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert recommendations"
  ON public.learning_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());
