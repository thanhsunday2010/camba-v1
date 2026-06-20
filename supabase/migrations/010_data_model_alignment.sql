-- CAMBA Phase 10: Data model alignment
-- Aligns question_type enum, scopes lesson_progress by program, documents shield scale

-- =============================================================================
-- 1. question_type: add reading_comprehension (align with exercise_type)
-- =============================================================================
ALTER TYPE public.question_type ADD VALUE IF NOT EXISTS 'reading_comprehension';

UPDATE public.questions
SET question_type = 'reading_comprehension'
WHERE question_type = 'reading';

-- =============================================================================
-- 2. lesson_progress: scope by program_id
-- =============================================================================
ALTER TABLE public.lesson_progress
  ADD COLUMN IF NOT EXISTS program_id UUID REFERENCES public.programs(id);

UPDATE public.lesson_progress lp
SET program_id = p.id
FROM public.lessons l
JOIN public.units u ON u.id = l.unit_id
JOIN public.skills s ON s.id = u.skill_id
JOIN public.levels lv ON lv.id = s.level_id
JOIN public.programs p ON p.id = lv.program_id
WHERE lp.lesson_id = l.id
  AND lp.program_id IS NULL;

DELETE FROM public.lesson_progress WHERE program_id IS NULL;

ALTER TABLE public.lesson_progress
  ALTER COLUMN program_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_lesson_progress_program
  ON public.lesson_progress(program_id);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_program
  ON public.lesson_progress(user_id, program_id);

-- =============================================================================
-- 3. program_settings: canonical shield scale (0–15)
-- =============================================================================
INSERT INTO public.program_settings (program_id, key, value, description)
SELECT
  p.id,
  'shield_scale_max',
  '15'::jsonb,
  'Maximum shield value per skill (Cambridge 0–15 scale)'
FROM public.programs p
WHERE NOT EXISTS (
  SELECT 1 FROM public.program_settings ps
  WHERE ps.program_id = p.id AND ps.key = 'shield_scale_max'
);

COMMENT ON COLUMN public.user_gamification.shield_progress IS
  'Per-skill shield values on 0–shield_scale_max scale (default 15). Keys are skill slugs.';
