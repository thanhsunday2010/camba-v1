-- CAMBA Phase 6: Parent & Teacher helpers

-- Teachers can view gamification/streaks for their students
CREATE POLICY "Teachers can view student gamification"
  ON public.user_gamification FOR SELECT
  USING (public.is_teacher_of(user_id));

CREATE POLICY "Teachers can view student streaks"
  ON public.user_streaks FOR SELECT
  USING (public.is_teacher_of(user_id));

-- Parent invites student by email (creates pending link)
CREATE OR REPLACE FUNCTION public.invite_student_by_email(student_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  student_uuid UUID;
  link_id UUID;
BEGIN
  IF NOT public.has_role('parent') AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT id INTO student_uuid
  FROM public.profiles
  WHERE lower(email) = lower(trim(student_email));

  IF student_uuid IS NULL THEN
    RAISE EXCEPTION 'Student not found';
  END IF;

  IF student_uuid = auth.uid() THEN
    RAISE EXCEPTION 'Cannot link to yourself';
  END IF;

  INSERT INTO public.parent_student_links (parent_id, student_id, status)
  VALUES (auth.uid(), student_uuid, 'pending')
  ON CONFLICT (parent_id, student_id)
  DO UPDATE SET status = 'pending', invited_at = NOW()
  RETURNING id INTO link_id;

  RETURN jsonb_build_object('linkId', link_id, 'studentId', student_uuid);
END;
$$;

GRANT EXECUTE ON FUNCTION public.invite_student_by_email(TEXT) TO authenticated;

-- Student accepts or rejects parent link
CREATE OR REPLACE FUNCTION public.respond_to_parent_link(link_id UUID, accept BOOLEAN)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.parent_student_links
  SET
    status = CASE WHEN accept THEN 'active'::public.link_status ELSE 'revoked'::public.link_status END,
    accepted_at = CASE WHEN accept THEN NOW() ELSE accepted_at END
  WHERE id = link_id AND student_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Link not found';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.respond_to_parent_link(UUID, BOOLEAN) TO authenticated;

-- Student joins class by join code
CREATE OR REPLACE FUNCTION public.join_class_by_code(code TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  class_id UUID;
BEGIN
  SELECT id INTO class_id
  FROM public.classes
  WHERE lower(join_code) = lower(trim(code)) AND is_active = TRUE;

  IF class_id IS NULL THEN
    RAISE EXCEPTION 'Invalid join code';
  END IF;

  INSERT INTO public.class_students (class_id, student_id)
  VALUES (class_id, auth.uid())
  ON CONFLICT (class_id, student_id) DO NOTHING;

  RETURN class_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_class_by_code(TEXT) TO authenticated;

-- Students can view parent profile when a pending link exists
CREATE POLICY "Students can view inviting parent profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.parent_student_links psl
      WHERE psl.parent_id = profiles.id
        AND psl.student_id = auth.uid()
        AND psl.status = 'pending'
    )
  );
