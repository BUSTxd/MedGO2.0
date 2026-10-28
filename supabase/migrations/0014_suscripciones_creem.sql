-- Suscripciones de Creem (merchant of record, pagos fuera del Perú) en la misma
-- tabla que las de Mercado Pago. `proveedor` dice de cuál es cada fila; los ids
-- de Mercado Pago dejan de ser obligatorios y cada proveedor exige el suyo.

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS proveedor text NOT NULL DEFAULT 'mercadopago';
ALTER TABLE public.subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_proveedor_check;
ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_proveedor_check CHECK (proveedor IN ('mercadopago','creem'));

ALTER TABLE public.subscriptions ALTER COLUMN mp_preapproval_id DROP NOT NULL;
ALTER TABLE public.subscriptions ALTER COLUMN mp_plan_id DROP NOT NULL;

ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS creem_subscription_id text UNIQUE;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS creem_customer_id text;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS creem_product_id text;

ALTER TABLE public.subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_id_del_proveedor;
ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_id_del_proveedor CHECK (
    (proveedor = 'mercadopago' AND mp_preapproval_id IS NOT NULL)
    OR (proveedor = 'creem' AND creem_subscription_id IS NOT NULL)
  );
