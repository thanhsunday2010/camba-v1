-- CAMBA Platform - Seed Data
-- Cambridge English program structure (configurable, not hardcoded in app logic)

INSERT INTO public.programs (id, slug, name, description, sort_order, settings) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'cambridge-english', 'Cambridge English', 'Cambridge English Exam Preparation', 1, '{"assessment_type": "shield", "skills": ["reading", "listening", "speaking", "writing", "vocabulary", "grammar"]}');

INSERT INTO public.levels (id, program_id, slug, name, description, sort_order, metadata) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'pre-starters', 'Pre-Starters', 'Pre-A1 Young Learners', 0, '{"cefr": "pre-a1", "yle": true}'),
  ('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'starters', 'Starters', 'A1 Young Learners', 1, '{"cefr": "a1", "yle": true, "max_shields": 15}'),
  ('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'movers', 'Movers', 'A1 Young Learners', 2, '{"cefr": "a1", "yle": true, "max_shields": 15}'),
  ('b0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'flyers', 'Flyers', 'A2 Young Learners', 3, '{"cefr": "a2", "yle": true, "max_shields": 15}'),
  ('b0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001', 'ket', 'KET', 'A2 Key for Schools', 4, '{"cefr": "a2", "yle": false, "scale_min": 100, "scale_max": 150}'),
  ('b0000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000001', 'pet', 'PET', 'B1 Preliminary for Schools', 5, '{"cefr": "b1", "yle": false, "scale_min": 120, "scale_max": 170}');

INSERT INTO public.xp_rules (event_type, xp_amount, coin_amount, description) VALUES
  ('lesson_complete', 50, 10, 'Complete a lesson'),
  ('exercise_complete', 10, 2, 'Complete an exercise'),
  ('daily_practice', 25, 5, 'Daily practice session'),
  ('perfect_score', 100, 25, 'Achieve perfect score'),
  ('streak_bonus', 30, 10, 'Maintain learning streak'),
  ('mission_complete', 75, 15, 'Complete daily mission'),
  ('mock_test_complete', 200, 50, 'Complete mock test'),
  ('placement_test_complete', 150, 30, 'Complete placement test'),
  ('badge_earned', 50, 20, 'Earn a badge');

INSERT INTO public.badges (slug, name, description, criteria, xp_reward, coin_reward) VALUES
  ('streak-7', '7-Day Streak', 'Learn for 7 consecutive days', '{"type": "streak", "days": 7}', 100, 50),
  ('streak-30', '30-Day Streak', 'Learn for 30 consecutive days', '{"type": "streak", "days": 30}', 500, 200),
  ('reading-master', 'Reading Master', 'Master all reading lessons in a level', '{"type": "skill_master", "skill": "reading"}', 300, 100),
  ('listening-master', 'Listening Master', 'Master all listening lessons in a level', '{"type": "skill_master", "skill": "listening"}', 300, 100),
  ('vocabulary-master', 'Vocabulary Master', 'Master all vocabulary lessons in a level', '{"type": "skill_master", "skill": "vocabulary"}', 300, 100),
  ('mock-test-champion', 'Mock Test Champion', 'Score 90%+ on a mock test', '{"type": "mock_test_score", "min_percent": 90}', 400, 150);

INSERT INTO public.daily_missions (slug, title, description, mission_type, target_value, xp_reward, coin_reward) VALUES
  ('complete-2-lessons', 'Complete 2 Lessons', 'Finish 2 lessons today', 'lessons_completed', 2, 100, 20),
  ('earn-100-xp', 'Earn 100 XP', 'Earn at least 100 XP today', 'xp_earned', 100, 50, 10),
  ('practice-listening-10min', 'Practice Listening', 'Practice listening for 10 minutes', 'listening_minutes', 10, 75, 15);

INSERT INTO public.program_settings (program_id, key, value, description) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'mastery_unlock_threshold', '3', 'Mastery level required to unlock next lesson'),
  ('a0000000-0000-4000-8000-000000000001', 'placement_test_questions', '30', 'Number of placement test questions'),
  ('a0000000-0000-4000-8000-000000000001', 'shield_display', '{"reading": {"min": 0, "max": 15}, "listening": {"min": 0, "max": 15}, "speaking": {"min": 0, "max": 15}}', 'Shield progress display config');
