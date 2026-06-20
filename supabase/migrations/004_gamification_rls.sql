-- CAMBA Phase 3: Gamification RLS policies

CREATE POLICY "Users can insert own xp logs"
  ON public.xp_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON public.user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);
