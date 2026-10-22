/**
 * Las piezas del dashboard que la interfaz de estudio también sirve, con su ruta
 * en /estudio. La usan las tarjetas del Laboratorio (servidor) y el marco de cada
 * laboratorio (cliente), que reconduce los enlaces internos que aún apuntan al
 * dashboard («← Laboratorio virtual», los niveles de Investigación…).
 */
const MAPA: [string, string][] = [
  ['/dashboard/laboratorio', '/estudio/laboratorio'],
  ['/dashboard/investigacion', '/estudio/laboratorio/investigacion'],
  ['/dashboard/cursos/fisica-medicina/modulo', '/estudio/laboratorio/fisica'],
  ['/dashboard/cuenta', '/estudio/cuenta'],
];

/** `/dashboard/...` → `/estudio/...`, o `null` si esa ruta no vive en la interfaz de estudio. */
export function rutaEnEstudio(href: string): string | null {
  for (const [de, a] of MAPA) {
    if (href === de || href.startsWith(`${de}/`) || href.startsWith(`${de}?`)) return a + href.slice(de.length);
  }
  return null;
}

/** El último curso/clase abierto en la interfaz (para «Estudiar» y «Mi progreso» desde el Laboratorio). */
const CLAVE_ULTIMA = 'medgo-estudio-ultima';
export function recordarUltima(ruta: string) {
  try { localStorage.setItem(CLAVE_ULTIMA, ruta); } catch { /* sin almacenamiento */ }
}
export function ultimaClase(): string {
  try { return localStorage.getItem(CLAVE_ULTIMA) || '/estudio'; } catch { return '/estudio'; }
}
