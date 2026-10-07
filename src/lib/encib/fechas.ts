const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** Hoy en Lima como `YYYY-MM-DD` (el servidor de Vercel corre en UTC). */
function hoyEnLima(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date());
}

/** Días de calendario que faltan hasta `fecha` (negativo si ya pasó). */
export function diasHasta(fecha: string): number {
  const dia = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
  return Math.round((dia(fecha) - dia(hoyEnLima())) / 86_400_000);
}

/** `2026-10-23` → «23 de octubre». */
export function fechaLarga(fecha: string): string {
  return `${+fecha.slice(8, 10)} de ${MESES[+fecha.slice(5, 7) - 1]}`;
}
