-- Step 2/2: XP rule + league bootstrap (run after 015 is committed).

INSERT INTO public.xp_rules (event_type, xp_amount, coin_amount, description)
VALUES ('exercise_complete', 10, 2, 'Complete an exercise')
ON CONFLICT (event_type) DO UPDATE SET
  xp_amount = EXCLUDED.xp_amount,
  coin_amount = EXCLUDED.coin_amount,
  description = EXCLUDED.description,
  is_active = TRUE;

CREATE OR REPLACE FUNCTION public.ensure_week_league(
  p_week_start DATE,
  p_week_end DATE,
  p_tier public.league_tier
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_league_id UUID;
BEGIN
  SELECT id INTO v_league_id
  FROM public.leagues
  WHERE week_start = p_week_start AND tier = p_tier;

  IF v_league_id IS NOT NULL THEN
    RETURN v_league_id;
  END IF;

  INSERT INTO public.leagues (week_start, week_end, tier, is_active)
  VALUES (p_week_start, p_week_end, p_tier, TRUE)
  ON CONFLICT (week_start, tier) DO NOTHING;

  SELECT id INTO v_league_id
  FROM public.leagues
  WHERE week_start = p_week_start AND tier = p_tier;

  RETURN v_league_id;
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_week_league(DATE, DATE, public.league_tier) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_week_league(DATE, DATE, public.league_tier) TO authenticated;
