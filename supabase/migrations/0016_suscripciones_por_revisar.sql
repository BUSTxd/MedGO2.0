-- Qué suscripciones de Mercado Pago revisa el cron diario (api/cron/suscripciones).
--
-- Solo las que pueden tener un cobro sin reflejar: alumno con el plan ya
-- vencido (o sin fecha) y suscripción viva. Un alumno con el periodo pagado por
-- delante no tiene nada que revisar: así el cron crece con los cobros
-- problemáticos del día, no con el total de suscriptores.
--
-- Una fila por alumno (su suscripción viva más reciente), las vencidas hace
-- menos primero: son las de una renovación reciente, las que más importan si
-- el cron no llega a todas. `p_todas` devuelve todas (auditoría).
-- Solo la ejecuta el service role.

create or replace function public.suscripciones_mp_por_revisar(p_todas boolean default false)
returns table (
  id uuid,
  user_id uuid,
  plan_key text,
  status text,
  next_payment_date timestamptz,
  mp_preapproval_id text,
  created_at timestamptz,
  vence timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select * from (
    select distinct on (s.user_id)
      s.id, s.user_id, s.plan_key, s.status, s.next_payment_date,
      s.mp_preapproval_id, s.created_at, p.plan_expires_at as vence
    from public.subscriptions s
    left join public.profiles p on p.id = s.user_id
    where s.proveedor = 'mercadopago'
      and s.mp_preapproval_id is not null
      and s.status <> 'cancelled'
      and (p_todas or p.plan_expires_at is null or p.plan_expires_at < now())
    order by s.user_id, s.created_at desc
  ) t
  order by t.vence desc nulls last;
$$;

revoke execute on function public.suscripciones_mp_por_revisar(boolean) from public, anon, authenticated;
grant execute on function public.suscripciones_mp_por_revisar(boolean) to service_role;
