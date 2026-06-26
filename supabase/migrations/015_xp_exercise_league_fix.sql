-- Step 1/2: Add enum value only. Must commit before 016 (PostgreSQL rule).
-- In SQL Editor: run this file alone, then run 016_xp_exercise_league_rules.sql.

ALTER TYPE public.xp_event_type ADD VALUE IF NOT EXISTS 'exercise_complete';
