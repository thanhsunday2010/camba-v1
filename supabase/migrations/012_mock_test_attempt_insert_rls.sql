-- Explicit INSERT policy for mock_test_attempts (matches exercise_attempts pattern).

DROP POLICY IF EXISTS "Users can create own mock test attempts" ON public.mock_test_attempts;

CREATE POLICY "Users can create own mock test attempts"
  ON public.mock_test_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
