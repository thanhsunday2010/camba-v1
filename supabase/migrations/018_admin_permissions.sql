-- Admin permission system: Super Admin flag, role templates, assignments, audit

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS public.admin_role_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_vi TEXT NOT NULL,
  description_vi TEXT,
  is_system BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_template_permissions (
  template_id UUID NOT NULL REFERENCES public.admin_role_templates(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  PRIMARY KEY (template_id, permission)
);

CREATE TABLE IF NOT EXISTS public.admin_assignments (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.admin_role_templates(id),
  granted_by UUID REFERENCES public.profiles(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS public.admin_permission_overrides (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  granted BOOLEAN NOT NULL,
  PRIMARY KEY (user_id, permission)
);

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created ON public.admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_actor ON public.admin_audit_logs(actor_id);

ALTER TABLE public.admin_role_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_template_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permission_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read role templates" ON public.admin_role_templates;
CREATE POLICY "Admins read role templates"
  ON public.admin_role_templates FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins read template permissions" ON public.admin_template_permissions;
CREATE POLICY "Admins read template permissions"
  ON public.admin_template_permissions FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins read own assignment" ON public.admin_assignments;
CREATE POLICY "Admins read own assignment"
  ON public.admin_assignments FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Super admins manage assignments" ON public.admin_assignments;
CREATE POLICY "Super admins manage assignments"
  ON public.admin_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_super_admin = TRUE
    )
  );

DROP POLICY IF EXISTS "Admins read own overrides" ON public.admin_permission_overrides;
CREATE POLICY "Admins read own overrides"
  ON public.admin_permission_overrides FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Super admins manage overrides" ON public.admin_permission_overrides;
CREATE POLICY "Super admins manage overrides"
  ON public.admin_permission_overrides FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_super_admin = TRUE
    )
  );

DROP POLICY IF EXISTS "Super admins read audit logs" ON public.admin_audit_logs;
CREATE POLICY "Super admins read audit logs"
  ON public.admin_audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_super_admin = TRUE
    )
  );

DROP POLICY IF EXISTS "Admins insert audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admins insert audit logs"
  ON public.admin_audit_logs FOR INSERT
  WITH CHECK (public.is_admin());

-- Seed system role templates
INSERT INTO public.admin_role_templates (slug, name_vi, description_vi) VALUES
  ('content_lead', 'Trưởng nhóm nội dung', 'Toàn quyền nội dung và duyệt xuất bản'),
  ('content_editor', 'Biên tập nội dung', 'Soạn và sửa nội dung, không xuất bản'),
  ('reviewer', 'Biên tập viên duyệt', 'Duyệt bài chờ review'),
  ('assessment_admin', 'Quản lý bài kiểm tra', 'Placement và mock test'),
  ('user_support', 'Hỗ trợ người dùng', 'Xem và hỗ trợ user, gán role end-user'),
  ('finance_admin', 'Tài chính', 'Gói đăng ký và thanh toán'),
  ('site_admin', 'Quản trị trang', 'Chỉnh text UI và hiển thị'),
  ('gamification_admin', 'Gamification', 'XP, huy hiệu, nhiệm vụ, giải đấu')
ON CONFLICT (slug) DO NOTHING;

-- Helper to seed permissions for a template slug
CREATE OR REPLACE FUNCTION public._seed_template_perms(p_slug TEXT, p_perms TEXT[])
RETURNS void LANGUAGE plpgsql AS $$
DECLARE v_id UUID;
DECLARE p TEXT;
BEGIN
  SELECT id INTO v_id FROM public.admin_role_templates WHERE slug = p_slug;
  IF v_id IS NULL THEN RETURN; END IF;
  FOREACH p IN ARRAY p_perms LOOP
    INSERT INTO public.admin_template_permissions (template_id, permission)
    VALUES (v_id, p) ON CONFLICT DO NOTHING;
  END LOOP;
END;
$$;

SELECT public._seed_template_perms('content_lead', ARRAY[
  'dashboard.read', 'content.read', 'content.write', 'content.delete',
  'content.programs', 'content.lessons', 'content.exercises', 'content.translations',
  'workflow.review', 'workflow.publish', 'assessments.read', 'tools.bulk', 'tools.ai'
]);

SELECT public._seed_template_perms('content_editor', ARRAY[
  'dashboard.read', 'content.read', 'content.write',
  'content.programs', 'content.lessons', 'content.exercises', 'content.translations',
  'tools.ai'
]);

SELECT public._seed_template_perms('reviewer', ARRAY[
  'dashboard.read', 'content.read', 'workflow.review'
]);

SELECT public._seed_template_perms('assessment_admin', ARRAY[
  'dashboard.read', 'content.read', 'assessments.read', 'assessments.write'
]);

SELECT public._seed_template_perms('user_support', ARRAY[
  'dashboard.read', 'users.read', 'users.students', 'users.teachers',
  'users.parents', 'users.progress', 'users.roles'
]);

SELECT public._seed_template_perms('finance_admin', ARRAY[
  'dashboard.read', 'users.read', 'subscriptions.read', 'subscriptions.plans',
  'subscriptions.orders', 'subscriptions.webhooks', 'subscriptions.manage'
]);

SELECT public._seed_template_perms('site_admin', ARRAY[
  'dashboard.read', 'site.read', 'site.write'
]);

SELECT public._seed_template_perms('gamification_admin', ARRAY[
  'dashboard.read', 'gamification.read', 'gamification.manage',
  'gamification.xp', 'gamification.badges', 'gamification.missions', 'gamification.leagues'
]);

DROP FUNCTION public._seed_template_perms(TEXT, TEXT[]);

-- Existing admin users become Super Admin
UPDATE public.profiles p
SET is_super_admin = TRUE
WHERE EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = p.id AND ur.role = 'admin'
);

-- Assign content_lead template to non-super admins (future); super admins need no row
