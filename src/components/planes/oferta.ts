import { PLANES_NUEVOS, mesesDe, periodoDe, usdCreem, type PlanCatalogEntry } from '@/lib/plans';
import type { Pasarela, Zona } from '@/lib/pasarela';

/**
 * El texto de las tarjetas de los planes, compartido por el selector de
 * `/estudio` (`ElegirPlan`) y la landing. Los números salen de `PLANS`: aquí
 * solo va cómo se cuentan.
 */

/** Lo que trae cualquier plan. Solo lo que existe: lo que aún no está, se dice. */
export const INCLUYE = [
  'Preclínicos: todo el temario (resúmenes y práctica, en camino)',
  'Tu universidad como meta (hoy, Cayetano)',
  'Metas de examen: ENCIB, y pronto USMLE Step 1',
  'Laboratorio virtual con sus animaciones',
  // Sin lanzar (IA_ABIERTA): venderla como incluida sería anunciar algo que no existe.
  'MedGO IA, tu tutor (muy pronto)',
];

/** «29.90», «39.90»: los céntimos sólo cuando los hay (como en el resto de la web). */
export const soles = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

export interface Oferta {
  plan: PlanCatalogEntry;
  /** «Cancela cuando quieras»: no hay un mínimo de meses antes de poder cancelar. */
  acceso: string;
  /** «cobro mensual» o «cobro cada 6 meses». */
  tipo: string;
  /** Cada cuánto se renueva. */
  cobro: string;
  /**
   * El precio grande de la tarjeta, siempre por mes: «S/» + «13.32» + «mes». En
   * los planes de varios meses es lo que equivale al mes; lo que se cobra va en `total`.
   */
  moneda: 'S/' | 'US$';
  importe: string;
  periodo: string;
  /** Lo que se cobra de verdad, debajo del precio: «S/ 79.90 cada 6 meses». `null` en el mensual. */
  total: string | null;
  incluye: { texto: string; incluido: boolean }[];
}

/**
 * La tarjeta de un plan según quién cobra: soles con Mercado Pago (Perú) o dólares
 * con Creem (resto del mundo). En los dos casos el periodo se paga por adelantado
 * y se renueva solo hasta que el alumno cancela, sin permanencia.
 */
export function ofertaDe(plan: PlanCatalogEntry, pasarela: Pasarela = 'mercadopago', zona: Zona = 'general'): Oferta {
  const enDolares = pasarela === 'creem' && !!plan.creem;
  const cada = enDolares ? plan.creem!.meses : mesesDe(plan);
  const precio = enDolares ? usdCreem(plan, zona) : plan.amount;
  const moneda = enDolares ? 'US$' : 'S/';
  return {
    plan,
    moneda,
    importe: cada === 1 ? soles(precio) : (precio / cada).toFixed(2),
    periodo: 'mes',
    total: cada === 1 ? null : `${moneda} ${soles(precio)} cada ${periodoDe(cada)}`,
    acceso: 'Cancela cuando quieras',
    tipo: cada === 1 ? 'cobro mensual' : `cobro cada ${cada} meses`,
    cobro: `Se renueva cada ${periodoDe(cada)} hasta que canceles.`,
    incluye: INCLUYE.map((texto) => ({ texto, incluido: true })),
  };
}

/** Las tres tarjetas, en su orden (Mensual, Ciclo, Anual), para una pasarela. */
export const ofertasPara = (pasarela: Pasarela = 'mercadopago', zona: Zona = 'general'): Oferta[] =>
  PLANES_NUEVOS.map((p) => ofertaDe(p, pasarela, zona));

/** Las de Mercado Pago (soles), para lo que se pinta sin saber el país. */
export const OFERTAS: Oferta[] = ofertasPara('mercadopago');
