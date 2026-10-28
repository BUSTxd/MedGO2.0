-- Los tres planes nuevos para cualquier país: Visitante (mensual), Residente
-- (12 cuotas) y Especialista (24 cuotas). Los cuatro de antes siguen valiendo
-- para quienes ya los pagan. Igual que en 0005: sin ampliar los dos CHECK, el
-- webhook de Mercado Pago falla al escribir la suscripción y el perfil se queda
-- en 'free' aunque el cobro haya pasado.

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_plan_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_plan_check
  CHECK (plan IN ('free','interno','residente','ufbi','ufbi-anual','visitante','residente-12','especialista-24'));

ALTER TABLE public.subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_plan_key_check;
ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_plan_key_check
  CHECK (plan_key IN ('interno','residente','ufbi','ufbi-anual','visitante','residente-12','especialista-24'));
