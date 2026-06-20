-- CAMBA Phase 9: Secure speaking audio storage (private bucket, no public read)

UPDATE storage.buckets
SET public = false
WHERE id = 'speaking-audio';

DROP POLICY IF EXISTS "Public read speaking audio" ON storage.objects;

-- Teachers and parents can read linked students' speaking audio
CREATE POLICY "Teachers can read student speaking audio"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'speaking-audio'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id::text = (storage.foldername(name))[1]
      AND public.is_teacher_of(p.id)
    )
  );

CREATE POLICY "Parents can read linked student speaking audio"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'speaking-audio'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id::text = (storage.foldername(name))[1]
      AND public.is_parent_of(p.id)
    )
  );

CREATE POLICY "Admins can read speaking audio"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'speaking-audio'
    AND public.is_admin()
  );
