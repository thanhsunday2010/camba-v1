-- Daily admin analytics snapshots for historical charts

CREATE TABLE IF NOT EXISTS public.admin_daily_snapshots (
  snapshot_date DATE PRIMARY KEY,
  metrics JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_daily_snapshots_created
  ON public.admin_daily_snapshots(created_at DESC);

ALTER TABLE public.admin_daily_snapshots ENABLE ROW LEVEL SECURITY;

-- No user policies — service role only (admin analytics client)

COMMENT ON TABLE public.admin_daily_snapshots IS
  'Daily KPI snapshot written by /api/cron/admin-snapshot for admin dashboard history';
