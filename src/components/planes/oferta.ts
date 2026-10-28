import { PLANES_NUEVOS, type PlanCatalogEntry } from '@/lib/plans';

/**
 * El texto de las tarjetas de los planes nuevos, compartido por el selector de
 * `/estudio` (`ElegirPlan`) y la landing. Los números salen de `PLANS`: aquí
 * solo va cómo se cuentan.
 */

/** Lo que trae cualquier plan (nivel base). */
export const INCLUYE_BASE = [
  'Preclínicos: todo el temario, con resúmenes y banqueos',
  'Tu universidad como meta (hoy, Cayetano)',
  'Tu plan de estudio hasta el día del examen',
];

/** Lo que solo traen Residente y Especialista (nivel completo). */
export const INCLUYE_COMPLETO = [
  'Metas de examen: ENCIB, y pronto USMLE Step 1',
  'Laboratorio virtual con sus animaciones',
  // Sin lanzar (IA_ABIERTA): venderla como incluida sería anunciar algo que no existe.
  'MedGO IA, tu tutor (muy pronto)',
];

/** «29.90», «39.90»: los céntimos sólo cuando los hay (como en el resto de la web). */
export const soles = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

export interface Oferta {
  plan: PlanCatalogEntry;
  /** «Permanencia de 12 meses» o «Sin permanencia». */
  acceso: string;
  /** «cobro mensual». */
  tipo: string;
  /** Cómo se renueva. Todos se cobran cada mes hasta que el alumno cancela: la
   *  permanencia solo dice desde cuándo puede cancelar, no cuándo termina. */
  cobro: string;
  incluye: { texto: string; incluido: boolean }[];
}

export function ofertaDe(plan: PlanCatalogEntry): Oferta {
  const meses = plan.commitmentMonths ?? 0;
  const completo = plan.nivel === 'completo';
  return {
    plan,
    acceso: meses ? `Permanencia de ${meses} meses` : 'Sin permanencia',
    tipo: 'cobro mensual',
    cobro: meses
      ? `Se renueva cada mes hasta que canceles. Puedes cancelar desde el mes ${meses}.`
      : 'Se renueva cada mes hasta que canceles. Cancela cuando quieras.',
    incluye: [
      ...INCLUYE_BASE.map((texto) => ({ texto, incluido: true })),
      ...INCLUYE_COMPLETO.map((texto) => ({ texto, incluido: completo })),
    ],
  };
}

/** Las tres tarjetas, en su orden: Residente, Especialista, Visitante. */
export const OFERTAS: Oferta[] = PLANES_NUEVOS.map(ofertaDe);
