-- CAMBA Sample Content for Phase 2
-- Flyers level: Reading + Vocabulary skills with lessons and exercises

-- Skills for Flyers level
INSERT INTO public.skills (id, level_id, slug, name, description, sort_order) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000004', 'reading', 'Reading', 'Reading comprehension skills', 0),
  ('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000004', 'vocabulary', 'Vocabulary', 'Vocabulary building', 1),
  ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000004', 'grammar', 'Grammar', 'Grammar practice', 2);

-- Units
INSERT INTO public.units (id, skill_id, slug, title, sort_order) VALUES
  ('d0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'unit-1', 'Unit 1: Daily Life', 0),
  ('d0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000001', 'unit-2', 'Unit 2: School', 1),
  ('d0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000002', 'unit-1', 'Unit 1: Animals', 0),
  ('d0000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-000000000003', 'unit-1', 'Unit 1: Present Tenses', 0);

-- Lessons
INSERT INTO public.lessons (id, unit_id, slug, title, description, sort_order, estimated_minutes) VALUES
  ('e0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'lesson-1', 'Lesson 1: My Morning Routine', 'Read about daily morning activities', 0, 15),
  ('e0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000001', 'lesson-2', 'Lesson 2: At the Park', 'Reading about a day at the park', 1, 15),
  ('e0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000003', 'lesson-1', 'Lesson 1: Wild Animals', 'Learn animal vocabulary', 0, 10),
  ('e0000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-000000000004', 'lesson-1', 'Lesson 1: Present Simple', 'Practice present simple tense', 0, 15);

-- Set unlock chain
UPDATE public.lessons SET unlock_after_lesson_id = 'e0000000-0000-4000-8000-000000000001' WHERE id = 'e0000000-0000-4000-8000-000000000002';

-- Exercises
INSERT INTO public.exercises (id, lesson_id, slug, title, instructions, exercise_type, status, sort_order) VALUES
  ('f0000000-0000-4000-8000-000000000001', 'e0000000-0000-4000-8000-000000000001', 'quiz-1', 'Reading Quiz', 'Read the text and answer the questions.', 'multiple_choice', 'published', 0),
  ('f0000000-0000-4000-8000-000000000002', 'e0000000-0000-4000-8000-000000000001', 'gap-fill-1', 'Fill in the Blanks', 'Complete the sentences with the correct words.', 'gap_fill', 'published', 1),
  ('f0000000-0000-4000-8000-000000000003', 'e0000000-0000-4000-8000-000000000003', 'vocab-quiz', 'Animal Vocabulary', 'Choose the correct word for each definition.', 'multiple_choice', 'published', 0),
  ('f0000000-0000-4000-8000-000000000004', 'e0000000-0000-4000-8000-000000000004', 'grammar-quiz', 'Present Simple Quiz', 'Choose the correct form of the verb.', 'multiple_choice', 'published', 0);

-- Questions for Reading Quiz
INSERT INTO public.questions (id, exercise_id, question_text, question_type, points, sort_order, explanation) VALUES
  ('q0000000-0000-4000-8000-000000000001', 'f0000000-0000-4000-8000-000000000001', 'What time does Tom wake up?', 'multiple_choice', 1, 0, 'Tom wakes up at 7 o''clock every morning.'),
  ('q0000000-0000-4000-8000-000000000002', 'f0000000-0000-4000-8000-000000000001', 'What does Tom eat for breakfast?', 'multiple_choice', 1, 1, 'Tom usually eats cereal and drinks orange juice.'),
  ('q0000000-0000-4000-8000-000000000003', 'f0000000-0000-4000-8000-000000000001', 'How does Tom go to school?', 'multiple_choice', 1, 2, 'Tom rides his bicycle to school.');

INSERT INTO public.choices (question_id, text, is_correct, sort_order) VALUES
  ('q0000000-0000-4000-8000-000000000001', '6 o''clock', false, 0),
  ('q0000000-0000-4000-8000-000000000001', '7 o''clock', true, 1),
  ('q0000000-0000-4000-8000-000000000001', '8 o''clock', false, 2),
  ('q0000000-0000-4000-8000-000000000002', 'Toast and tea', false, 0),
  ('q0000000-0000-4000-8000-000000000002', 'Cereal and orange juice', true, 1),
  ('q0000000-0000-4000-8000-000000000002', 'Eggs and bacon', false, 2),
  ('q0000000-0000-4000-8000-000000000003', 'By bus', false, 0),
  ('q0000000-0000-4000-8000-000000000003', 'By bicycle', true, 1),
  ('q0000000-0000-4000-8000-000000000003', 'On foot', false, 2);

-- Gap fill question
INSERT INTO public.questions (id, exercise_id, question_text, question_type, points, sort_order, content, explanation) VALUES
  ('q0000000-0000-4000-8000-000000000004', 'f0000000-0000-4000-8000-000000000002', 'Complete the sentences about Tom''s morning.', 'gap_fill', 2, 0,
   '{"template": "Tom [0] up at 7 o''clock. He [1] breakfast at 7:30.", "correctAnswers": ["wakes", "eats"]}',
   'wake up = wakes (present simple, third person). eat = eats.');

-- Vocabulary questions
INSERT INTO public.questions (id, exercise_id, question_text, question_type, points, sort_order, explanation) VALUES
  ('q0000000-0000-4000-8000-000000000005', 'f0000000-0000-4000-8000-000000000003', 'A large animal with a trunk', 'multiple_choice', 1, 0, 'An elephant has a long trunk.'),
  ('q0000000-0000-4000-8000-000000000006', 'f0000000-0000-4000-8000-000000000003', 'The king of the jungle', 'multiple_choice', 1, 1, 'The lion is often called the king of the jungle.');

INSERT INTO public.choices (question_id, text, is_correct, sort_order) VALUES
  ('q0000000-0000-4000-8000-000000000005', 'Giraffe', false, 0),
  ('q0000000-0000-4000-8000-000000000005', 'Elephant', true, 1),
  ('q0000000-0000-4000-8000-000000000005', 'Monkey', false, 2),
  ('q0000000-0000-4000-8000-000000000006', 'Tiger', false, 0),
  ('q0000000-0000-4000-8000-000000000006', 'Lion', true, 1),
  ('q0000000-0000-4000-8000-000000000006', 'Bear', false, 2);

-- Grammar questions
INSERT INTO public.questions (id, exercise_id, question_text, question_type, points, sort_order, explanation) VALUES
  ('q0000000-0000-4000-8000-000000000007', 'f0000000-0000-4000-8000-000000000004', 'She _____ to school every day.', 'multiple_choice', 1, 0, 'Third person singular: go → goes'),
  ('q0000000-0000-4000-8000-000000000008', 'f0000000-0000-4000-8000-000000000004', 'They _____ football on Saturdays.', 'multiple_choice', 1, 1, 'Plural subject: play (no -s)');

INSERT INTO public.choices (question_id, text, is_correct, sort_order) VALUES
  ('q0000000-0000-4000-8000-000000000007', 'go', false, 0),
  ('q0000000-0000-4000-8000-000000000007', 'goes', true, 1),
  ('q0000000-0000-4000-8000-000000000007', 'going', false, 2),
  ('q0000000-0000-4000-8000-000000000008', 'plays', false, 0),
  ('q0000000-0000-4000-8000-000000000008', 'play', true, 1),
  ('q0000000-0000-4000-8000-000000000008', 'playing', false, 2);

-- Placement Test
INSERT INTO public.placement_tests (id, program_id, title, description, question_count, time_limit_minutes) VALUES
  ('p0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'Cambridge English Placement Test', 'Discover your Cambridge English level', 8, 30);

-- Placement test questions (mix of reading, vocabulary, grammar)
INSERT INTO public.placement_test_questions (placement_test_id, question_id, sort_order, skill_weight) VALUES
  ('p0000000-0000-4000-8000-000000000001', 'q0000000-0000-4000-8000-000000000001', 0, '{"reading": 1}'),
  ('p0000000-0000-4000-8000-000000000001', 'q0000000-0000-4000-8000-000000000002', 1, '{"reading": 1}'),
  ('p0000000-0000-4000-8000-000000000001', 'q0000000-0000-4000-8000-000000000003', 2, '{"reading": 1}'),
  ('p0000000-0000-4000-8000-000000000001', 'q0000000-0000-4000-8000-000000000005', 3, '{"vocabulary": 1}'),
  ('p0000000-0000-4000-8000-000000000001', 'q0000000-0000-4000-8000-000000000006', 4, '{"vocabulary": 1}'),
  ('p0000000-0000-4000-8000-000000000001', 'q0000000-0000-4000-8000-000000000007', 5, '{"grammar": 1}'),
  ('p0000000-0000-4000-8000-000000000001', 'q0000000-0000-4000-8000-000000000008', 6, '{"grammar": 1}'),
  ('p0000000-0000-4000-8000-000000000001', 'q0000000-0000-4000-8000-000000000004', 7, '{"grammar": 1, "reading": 0.5}');
