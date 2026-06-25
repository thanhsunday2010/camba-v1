-- SePay / VietQR subscription payment orders

CREATE TYPE payment_order_status AS ENUM ('pending', 'paid', 'expired', 'cancelled');

CREATE TABLE subscription_payment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_code TEXT NOT NULL UNIQUE,
  program subscription_program NOT NULL,
  tier subscription_tier NOT NULL CHECK (tier IN ('pro', 'vip')),
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),
  amount_vnd INT NOT NULL CHECK (amount_vnd > 0),
  status payment_order_status NOT NULL DEFAULT 'pending',
  sepay_transaction_id BIGINT UNIQUE,
  transfer_content TEXT,
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sepay_webhook_events (
  sepay_id BIGINT PRIMARY KEY,
  payload JSONB NOT NULL,
  order_code TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscription_payment_orders_user ON subscription_payment_orders(user_id);
CREATE INDEX idx_subscription_payment_orders_status ON subscription_payment_orders(status);
CREATE INDEX idx_subscription_payment_orders_pending ON subscription_payment_orders(status, expires_at)
  WHERE status = 'pending';

ALTER TABLE subscription_payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sepay_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own payment orders"
  ON subscription_payment_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own payment orders"
  ON subscription_payment_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);
