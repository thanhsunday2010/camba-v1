-- Idempotent student bootstrap for OAuth and legacy accounts missing profile rows.

CREATE OR REPLACE FUNCTION public.ensure_user_bootstrap(p_user_id UUID DEFAULT auth.uid())
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user auth.users%ROWTYPE;
BEGIN
  IF p_user_id IS NULL OR p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized bootstrap request';
  END IF;

  SELECT * INTO v_user FROM auth.users WHERE id = p_user_id;
  IF NOT FOUND THEN
    RETURN;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, avatar_url, phone)
  VALUES (
    v_user.id,
    COALESCE(v_user.email, ''),
    COALESCE(
      v_user.raw_user_meta_data->>'full_name',
      v_user.raw_user_meta_data->>'name',
      ''
    ),
    COALESCE(
      v_user.raw_user_meta_data->>'avatar_url',
      v_user.raw_user_meta_data->>'picture',
      NULL
    ),
    NULLIF(v_user.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(NULLIF(EXCLUDED.email, ''), profiles.email),
    full_name = CASE
      WHEN EXCLUDED.full_name <> '' THEN EXCLUDED.full_name
      ELSE profiles.full_name
    END,
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    phone = COALESCE(EXCLUDED.phone, profiles.phone);

  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, 'student')
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.user_gamification (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_streaks (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_user_bootstrap(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ensure_user_bootstrap(UUID) TO authenticated;
