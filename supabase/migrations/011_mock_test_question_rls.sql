-- CAMBA M1.3 fix: students must read questions linked to active mock tests.
-- Mock-bank exercises stay off the lesson path (lesson is_active = false) but questions
-- must be readable for /mock-tests take flow.

DROP POLICY IF EXISTS "Authenticated can view questions in active mock tests" ON public.questions;
CREATE POLICY "Authenticated can view questions in active mock tests"
  ON public.questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.mock_test_questions mtq
      INNER JOIN public.mock_test_sections mts ON mts.id = mtq.mock_test_section_id
      INNER JOIN public.mock_tests mt ON mt.id = mts.mock_test_id
      WHERE mtq.question_id = questions.id
        AND mt.is_active = TRUE
    )
  );

DROP POLICY IF EXISTS "Authenticated can view choices for mock test questions" ON public.choices;
CREATE POLICY "Authenticated can view choices for mock test questions"
  ON public.choices FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.mock_test_questions mtq
      INNER JOIN public.mock_test_sections mts ON mts.id = mtq.mock_test_section_id
      INNER JOIN public.mock_tests mt ON mt.id = mts.mock_test_id
      WHERE mtq.question_id = choices.question_id
        AND mt.is_active = TRUE
    )
  );

DROP POLICY IF EXISTS "Authenticated can view pairs for mock test questions" ON public.question_pairs;
CREATE POLICY "Authenticated can view pairs for mock test questions"
  ON public.question_pairs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.mock_test_questions mtq
      INNER JOIN public.mock_test_sections mts ON mts.id = mtq.mock_test_section_id
      INNER JOIN public.mock_tests mt ON mt.id = mts.mock_test_id
      WHERE mtq.question_id = question_pairs.question_id
        AND mt.is_active = TRUE
    )
  );
