-- CAMBA Phase 7: Second program (IELTS skeleton)

INSERT INTO public.programs (id, slug, name, description, sort_order, settings) VALUES
  (
    'a0000000-0000-4000-8000-000000000002',
    'ielts',
    'IELTS',
    'International English Language Testing System preparation',
    2,
    '{"assessment_type": "band", "skills": ["reading", "listening", "speaking", "writing"]}'
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.levels (id, program_id, slug, name, description, sort_order, metadata) VALUES
  ('b0000000-0000-4000-8000-000000000101', 'a0000000-0000-4000-8000-000000000002', 'band-4', 'Band 4', 'IELTS Band 4 target', 0, '{"band": 4}'),
  ('b0000000-0000-4000-8000-000000000102', 'a0000000-0000-4000-8000-000000000002', 'band-5', 'Band 5', 'IELTS Band 5 target', 1, '{"band": 5}'),
  ('b0000000-0000-4000-8000-000000000103', 'a0000000-0000-4000-8000-000000000002', 'band-6', 'Band 6', 'IELTS Band 6 target', 2, '{"band": 6}')
ON CONFLICT (program_id, slug) DO NOTHING;

INSERT INTO public.program_settings (program_id, key, value, description) VALUES
  ('a0000000-0000-4000-8000-000000000002', 'mastery_unlock_threshold', '3', 'Mastery level required to unlock next lesson'),
  ('a0000000-0000-4000-8000-000000000002', 'placement_test_questions', '30', 'Number of placement test questions')
ON CONFLICT (program_id, key) DO NOTHING;
