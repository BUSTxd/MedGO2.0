import { sumarDias } from '@/lib/estudio/planificador';

/** «1 h 20 min», «45 min». */
export const duracion = (min: number) => {
  const h = Math.floor(min / 60), m = Math.round(min % 60);
  return h ? `${h} h${m ? ` ${m} min` : ''}` : `${m} min`;
};

/** «Hoy», «Mañana» o «Jueves 6 nov.». */
export function fechaLarga(f: string, hoy: string) {
  if (f === hoy) return 'Hoy';
  if (f === sumarDias(hoy, 1)) return 'Mañana';
  const d = new Date(`${f}T12:00:00Z`);
  return new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(d).replace(/^\w/, (c) => c.toUpperCase());
}
