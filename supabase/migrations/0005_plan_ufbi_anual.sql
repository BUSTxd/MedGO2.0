-- Plan anual del tramo básico ('ufbi-anual'), el análogo de 'residente' en
-- Medicina. Los dos CHECK que enumeran planes hay que ampliarlos a mano: sin
-- esto el webhook de Mercado Pago falla al escribir la suscripción y el perfil
-- se queda en 'free' aunque el cobro haya pasado.

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_plan_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_plan_check
  CHECK (plan IN ('free','interno','residente','ufbi','ufbi-anual'));

ALTER TABLE public.subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_plan_key_check;
ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_plan_key_check
  CHECK (plan_key IN ('interno','residente','ufbi','ufbi-anual'));
