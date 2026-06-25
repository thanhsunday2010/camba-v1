-- Persist phone on signup and support phone lookup for auth flows.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    NULLIF(NEW.raw_user_meta_data->>'phone', '')
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

CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles (phone)
  WHERE phone IS NOT NULL;
