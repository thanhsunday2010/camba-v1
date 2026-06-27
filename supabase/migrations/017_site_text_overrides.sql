-- UI copy overrides for next-intl message keys (admin-editable site text)

CREATE TABLE public.site_text_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  locale TEXT NOT NULL,
  message_key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (locale, message_key)
);

CREATE INDEX idx_site_text_overrides_locale ON public.site_text_overrides(locale);

ALTER TABLE public.site_text_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site text overrides"
  ON public.site_text_overrides FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage site text overrides"
  ON public.site_text_overrides FOR ALL
  USING (public.is_admin());

CREATE TRIGGER set_site_text_overrides_updated_at
  BEFORE UPDATE ON public.site_text_overrides
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
