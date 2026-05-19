-- Cierra un agujero de seguridad: la policy RLS "own profile" en profiles es ALL,
-- permitiendo que un usuario autenticado haga UPDATE de su propio plan y
-- plan_expires_at vía supabase-js, escalando a Interno/Residente sin pagar.
--
-- En vez de partir la policy (lo cual requiere referencias OLD que RLS UPDATE no
-- soporta), usamos un trigger BEFORE UPDATE que bloquea cambios a esas columnas
-- cuando el rol que ejecuta NO es service_role. El backend usa SUPABASE_SERVICE_ROLE_KEY,
-- así que sus updates siguen pasando.

CREATE OR REPLACE FUNCTION public.profiles_protect_plan_columns()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF current_user IN ('service_role', 'postgres', 'supabase_admin', 'supabase_auth_admin') THEN
    RETURN NEW;
  END IF;
  IF NEW.plan IS DISTINCT FROM OLD.plan THEN
    RAISE EXCEPTION 'plan no puede modificarse directamente; usar la pasarela de pagos';
  END IF;
  IF NEW.plan_expires_at IS DISTINCT FROM OLD.plan_expires_at THEN
    RAISE EXCEPTION 'plan_expires_at no puede modificarse directamente; usar la pasarela de pagos';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS profiles_protect_plan_columns_trigger ON public.profiles;
CREATE TRIGGER profiles_protect_plan_columns_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.profiles_protect_plan_columns();
