/**
 * Aviso diario de visita: mueve `profiles.last_visit_date` (la «Última visita»
 * del admin) y la racha. Sale del shell del dashboard, no solo del Inicio: quien
 * entra directo a una clase por un enlace también está visitando.
 *
 * Una vez por día (caché en localStorage) y una sola petición por carga aunque
 * lo pidan el shell y el Inicio a la vez.
 */
let enCurso: Promise<number | null> | null = null;

export function pingRacha(): Promise<number | null> {
  if (enCurso) return enCurso;
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
  try {
    const cached = localStorage.getItem('streak_value');
    if (localStorage.getItem('streak_ping_date') === today && cached) {
      return Promise.resolve(Number(cached));
    }
  } catch {}

  enCurso = fetch('/api/streak/ping', { method: 'POST' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data || typeof data.streak !== 'number') return null;
      try {
        localStorage.setItem('streak_ping_date', today);
        localStorage.setItem('streak_value', String(data.streak));
      } catch {}
      return data.streak as number;
    })
    .catch(() => null)
    .finally(() => { enCurso = null; });
  return enCurso;
}
