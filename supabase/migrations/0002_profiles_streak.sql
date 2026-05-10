-- Streak fields on profiles. Tracked in America/Lima time.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_visit_date date,
  ADD COLUMN IF NOT EXISTS current_streak integer NOT NULL DEFAULT 0;
