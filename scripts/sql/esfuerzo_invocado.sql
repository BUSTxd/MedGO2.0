-- Panel «Tu esfuerzo» del home: momento en que el alumno invocó la célula madre
-- (se habilita con racha >= 20). Null = aún no. Lo escribe /api/esfuerzo/invocar
-- con la service role; el home lo lee junto a full_name.
alter table public.profiles add column if not exists esfuerzo_invocado_at timestamptz;
comment on column public.profiles.esfuerzo_invocado_at is 'Momento en que el usuario invocó la célula madre del panel «Tu esfuerzo» (racha >= 20). Null = aún no.';
