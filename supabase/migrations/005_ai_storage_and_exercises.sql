-- CAMBA Phase 4: AI Storage bucket for speaking audio

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'speaking-audio',
  'speaking-audio',
  true,
  10485760,
  ARRAY['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own speaking audio"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'speaking-audio'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can read own speaking audio"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'speaking-audio'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public read speaking audio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'speaking-audio');

-- Sample AI writing and speaking exercises for Flyers Reading lesson 2
INSERT INTO public.exercises (id, lesson_id, slug, title, instructions, exercise_type, content, status, sort_order) VALUES
  ('f0000000-0000-4000-8000-000000000010', 'e0000000-0000-4000-8000-000000000002', 'writing-1', 'Writing: Describe Your Day', 'Write about your typical day at school.', 'writing', '{"prompt": "Write about your typical day at school. Include what time you wake up, what you eat for breakfast, and what subjects you study.", "minWords": 40, "maxWords": 120, "targetLevel": "Flyers"}', 'published', 0),
  ('f0000000-0000-4000-8000-000000000011', 'e0000000-0000-4000-8000-000000000002', 'speaking-1', 'Speaking: Introduce Yourself', 'Record yourself introducing your family.', 'speaking', '{"prompt": "Introduce yourself and your family. Say how old you are, where you live, and what your family members do.", "maxDurationSeconds": 60, "targetLevel": "Flyers"}', 'published', 1);
