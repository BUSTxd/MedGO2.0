import type { Intento } from './planificador';

/**
 * Copia en este navegador de cada banqueo terminado (`examen_completado`), que
 * deja `trackEvent`. El planificador la junta con la del servidor:
 *  - lo que acabas de terminar cuenta al instante, sin volver a pedir el plan;
 *  - el admin también ve su avance (`/api/track` no guarda sus eventos);
 *  - si el evento no llegó al servidor (sin red), no se pierde.
 */
const CLAVE = 'medgo:intentos:v1';
const TOPE = 300;

export function leerIntentosLocales(): Intento[] {
  try {
    const raw = localStorage.getItem(CLAVE);
    const xs = raw ? (JSON.parse(raw) as Intento[]) : [];
    return Array.isArray(xs) ? xs : [];
  } catch {
    return [];
  }
}

export function registrarIntentoLocal(props: Record<string, unknown>) {
  const { examKey, score, total, tema, seccion, temas } = props;
  if (typeof examKey !== 'string' || typeof score !== 'number' || typeof total !== 'number') return;
  const nuevo: Intento = {
    key: examKey, fecha: new Date().toISOString(), score, total,
    ...(typeof tema === 'string' ? { tema } : {}),
    ...(typeof seccion === 'string' ? { seccion } : {}),
    ...(temas && typeof temas === 'object' ? { temas: temas as Intento['temas'] } : {}),
  };
  try {
    localStorage.setItem(CLAVE, JSON.stringify([...leerIntentosLocales(), nuevo].slice(-TOPE)));
    window.dispatchEvent(new Event('medgo:intento'));
  } catch { /* sin almacenamiento: queda el del servidor */ }
}

/**
 * Servidor + local sin contar dos veces el mismo intento: uno local es el mismo
 * que uno del servidor si coinciden clave, filtro y nota con menos de 2 min de diferencia.
 */
export function juntarIntentos(servidor: Intento[], locales: Intento[]): Intento[] {
  const mismo = (a: Intento, b: Intento) =>
    a.key === b.key && a.score === b.score && a.total === b.total && a.tema === b.tema && a.seccion === b.seccion
    && Math.abs(Date.parse(a.fecha) - Date.parse(b.fecha)) < 120_000;
  const extra = locales.filter((l) => !servidor.some((s) => mismo(s, l)));
  return [...servidor, ...extra].sort((a, b) => a.fecha.localeCompare(b.fecha));
}
