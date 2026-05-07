-- Subscriptions table for Mercado Pago preapprovals.
-- profiles.plan / plan_expires_at already exist (check: free | interno | residente).

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mp_preapproval_id text UNIQUE NOT NULL,
  mp_plan_id text NOT NULL,
  plan_key text NOT NULL CHECK (plan_key IN ('interno','residente')),
  status text NOT NULL CHECK (status IN ('pending','authorized','paused','cancelled')),
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'PEN',
  next_payment_date timestamptz,
  payer_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_mp_preapproval_id_idx ON public.subscriptions(mp_preapproval_id);
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_one_active_per_user_idx
  ON public.subscriptions(user_id) WHERE status IN ('authorized','pending');

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS subscriptions_set_updated_at ON public.subscriptions;
CREATE TRIGGER subscriptions_set_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS subs_select_own ON public.subscriptions;
CREATE POLICY subs_select_own ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);
-- No INSERT/UPDATE/DELETE policies: writes only via service role.
