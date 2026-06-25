-- Subscription tiers and daily AI usage tracking

CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'vip');
CREATE TYPE subscription_program AS ENUM ('cambridge', 'speaking_writing');

CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  program subscription_program NOT NULL,
  tier subscription_tier NOT NULL DEFAULT 'free',
  billing_period TEXT CHECK (billing_period IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, program)
);

CREATE TABLE ai_usage_daily (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL,
  ai_call_count INT NOT NULL DEFAULT 0 CHECK (ai_call_count >= 0),
  PRIMARY KEY (user_id, usage_date)
);

CREATE INDEX idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX idx_ai_usage_daily_date ON ai_usage_daily(usage_date);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_daily ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own subscriptions"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users read own ai usage"
  ON ai_usage_daily FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own ai usage"
  ON ai_usage_daily FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own ai usage"
  ON ai_usage_daily FOR UPDATE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION increment_ai_usage_if_allowed(
  p_user_id UUID,
  p_usage_date DATE,
  p_daily_limit INT
)
RETURNS TABLE(allowed BOOLEAN, new_count INT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT;
BEGIN
  INSERT INTO ai_usage_daily (user_id, usage_date, ai_call_count)
  VALUES (p_user_id, p_usage_date, 0)
  ON CONFLICT (user_id, usage_date) DO NOTHING;

  SELECT ai_call_count INTO v_count
  FROM ai_usage_daily
  WHERE user_id = p_user_id AND usage_date = p_usage_date
  FOR UPDATE;

  IF v_count >= p_daily_limit THEN
    RETURN QUERY SELECT false, v_count;
    RETURN;
  END IF;

  UPDATE ai_usage_daily
  SET ai_call_count = ai_call_count + 1
  WHERE user_id = p_user_id AND usage_date = p_usage_date;

  RETURN QUERY SELECT true, v_count + 1;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_ai_usage_if_allowed(UUID, DATE, INT) TO authenticated;
