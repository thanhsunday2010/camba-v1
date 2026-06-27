-- Streak restore: spend XP to recover a broken streak within 7 days

ALTER TYPE public.xp_event_type ADD VALUE IF NOT EXISTS 'streak_restore';

ALTER TABLE public.user_streaks
  ADD COLUMN IF NOT EXISTS pending_restore_streak INTEGER,
  ADD COLUMN IF NOT EXISTS restore_available_until DATE,
  ADD COLUMN IF NOT EXISTS restore_anchor_date DATE;
