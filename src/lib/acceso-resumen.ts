import { SILABOS } from '@/lib/data/silabos';
import { cursoEsGratis, requiredPlanDeCurso, tieneAccesoA } from '@/lib/acceso';
import type { PlanState } from '@/lib/plans';

/**
 * ¿Quién puede descargar un resumen (PDF o HTML)?
 *
 * El candado de la página de clase es sólo un velo: el archivo lo entregan
 * `/api/resumen` y `/api/resumen-html`, y ahí es donde se decide. La regla es
 * la misma que la de la página: si la clase es libre, cualquier cuenta; si no,
 * el plan del tramo del curso.
 *
 * `LIBRE` calca la condición de cada `cursos/<slug>/[id]/page.tsx`. Si una
 * página cambia qué clases abre, hay que cambiarla aquí también: si no, o el
 * resumen de una clase libre da 403, o el de una de pago se descarga sin plan.
 */

interface Act {
  id: string;
  tipo: string;
  gratis?: boolean;
  premium?: boolean;
  examen?: { free?: boolean };
  resumen?: { opciones?: { id: string }[] };
  propuestos?: { tipo?: string; claseId?: string; opciones?: { id: string }[] };
}

/**
 * De pago aunque su clase sea libre. Las prácticas de Parasitología/Artrópodos
 * son LAB (página abierta) pero su PDF siempre pidió plan: es lo que se vende.
 */
const SIEMPRE_DE_PAGO = new Set([
  'practica-8', 'practica-9', 'practica-10',
  'practica-11', 'practica-12', 'practica-13',
]);

const esTipo = (...tipos: string[]) => (a: Act) => tipos.includes(a.tipo);
const examenLibre = (a: Act) => a.examen?.free === true;

const LIBRE: Record<string, (a: Act) => boolean> = {
  'microbiologia':         esTipo('LAB'),
  'farmacologia':          esTipo('LAB'),
  'hematologia':           esTipo('LAB'),
  'quimica-organica':      esTipo('LAB'),
  'biologia-celular':      esTipo('LAB'),
  'cardiovascular':        esTipo('LAB-HISTO', 'LAB-ANAT'),
  'excretor':              (a) => esTipo('LAB-HISTO', 'LAB-ANAT')(a) || examenLibre(a),
  'neurologia':            (a) => esTipo('LAB-ANAT', 'LAB-HISTO', 'TALLER-FIS', 'AULA-VIRTUAL', 'ICONOGRAFIA', 'REV-VIRTUAL')(a) || examenLibre(a),
  'aparato-locomotor':     esTipo('ANATOMIA', 'HISTOLOGIA'),
  'digestivo':             esTipo('ANATOMIA', 'HISTOLOGIA'),
  'endocrino-reproductor': esTipo('ANATOMIA', 'HISTOLOGIA', 'TALLER'),
  'inmunologia':           (a) => a.tipo === 'LAB' || !!a.gratis,
  'patologia':             (a) => a.tipo === 'LAB' || examenLibre(a),
  'epidemiologia':         examenLibre,
  'fisica-medicina':       () => false,
};

function claseLibre(curso: string, a: Act): boolean {
  // Curso gratis: todo abierto salvo lo marcado `premium` (Epidemiología T2-T4).
  if (cursoEsGratis(curso) && !a.premium) return true;
  return LIBRE[curso]?.(a) ?? false;
}

/** Los ids con que la tarjeta pide el archivo: opciones, o el id de la clase. */
function idsDeResumen(a: Act): string[] {
  const ids: string[] = [];
  if (a.resumen) ids.push(...(a.resumen.opciones?.map((o) => o.id) ?? [a.id]));
  if (a.propuestos) {
    ids.push(...(a.propuestos.opciones?.map((o) => o.id) ?? [a.propuestos.claseId ?? `${a.id}-prop`]));
  }
  return ids;
}

interface Destino { curso: string; libre: boolean; porPrefijo?: boolean }

let INDICE: Map<string, Destino> | null = null;

function indice(): Map<string, Destino> {
  if (INDICE) return INDICE;
  const m = new Map<string, Destino>();
  for (const [curso, semanas] of Object.entries(SILABOS)) {
    for (const semana of semanas) {
      for (const act of semana.actividades as unknown as Act[]) {
        const libre = claseLibre(curso, act);
        for (const id of idsDeResumen(act)) {
          const prev = m.get(id);
          // Un mismo PDF compartido por varias clases: basta con que una sea libre.
          m.set(id, { curso, libre: libre || !!prev?.libre });
        }
      }
    }
  }
  INDICE = m;
  return m;
}

/** Id suelto sin clase en el sílabo (p. ej. un PDF de banqueo): curso por prefijo. */
const CURSO_POR_PREFIJO: [string, string][] = [
  ['far-', 'farmacologia'], ['hem-', 'hematologia'], ['qor-', 'quimica-organica'],
  ['fis-', 'fisica-medicina'], ['bcm-', 'biologia-celular'], ['loc-', 'aparato-locomotor'],
  ['dig-', 'digestivo'], ['exc-', 'excretor'], ['inm-', 'inmunologia'],
  ['pat-', 'patologia'], ['epi-', 'epidemiologia'],
  ['clase-', 'microbiologia'], ['practica-', 'microbiologia'],
];

export function destinoDeResumen(id: string): Destino {
  const hit = indice().get(id);
  if (hit) return SIEMPRE_DE_PAGO.has(id) ? { ...hit, libre: false } : hit;
  const curso = CURSO_POR_PREFIJO.find(([p]) => id.startsWith(p))?.[1];
  // Sin clase conocida: se exige el plan (bloquear de más es el fallo seguro).
  return { curso: curso ?? 'medicina-desconocido', libre: false, porPrefijo: true };
}

export function puedeVerResumen(estado: Pick<PlanState, 'plan' | 'isActive' | 'allAccess'>, id: string): boolean {
  const { curso, libre } = destinoDeResumen(id);
  return libre || tieneAccesoA(estado, requiredPlanDeCurso(curso));
}
