import { PLANES_NUEVOS, type PlanCatalogEntry } from '@/lib/plans';
import type { Pasarela } from '@/lib/pasarela';

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
  /** El precio grande de la tarjeta: «S/» + «29.90» + «mes», o «US$» + «99» + «año». */
  moneda: 'S/' | 'US$';
  importe: string;
  periodo: 'mes' | 'año' | '2 años';
  incluye: { texto: string; incluido: boolean }[];
}

/**
 * La tarjeta de un plan según quién cobra. Con Mercado Pago (Perú), cuota
 * mensual en soles con permanencia; con Creem (resto del mundo), dólares y el
 * periodo de la permanencia pagado por adelantado (Creem no tiene permanencia).
 */
export function ofertaDe(plan: PlanCatalogEntry, pasarela: Pasarela = 'mercadopago'): Oferta {
  const meses = plan.commitmentMonths ?? 0;
  const completo = plan.nivel === 'completo';
  const incluye = [
    ...INCLUYE_BASE.map((texto) => ({ texto, incluido: true })),
    ...INCLUYE_COMPLETO.map((texto) => ({ texto, incluido: completo })),
  ];
  if (pasarela === 'creem' && plan.creem) {
    const { usd, meses: cada } = plan.creem;
    return {
      plan,
      acceso: cada > 1 ? `${cada} meses pagados por adelantado` : 'Sin permanencia',
      tipo: cada === 12 ? 'pago anual' : cada === 24 ? 'pago cada 2 años' : 'cobro mensual',
      cobro: cada > 1
        ? `Equivale a US$ ${(usd / cada).toFixed(2)} al mes. Se renueva hasta que canceles.`
        : 'Se renueva cada mes hasta que canceles. Cancela cuando quieras.',
      moneda: 'US$',
      importe: soles(usd),
      periodo: cada === 12 ? 'año' : cada === 24 ? '2 años' : 'mes',
      incluye,
    };
  }
  return {
    plan,
    moneda: 'S/',
    importe: soles(plan.amount),
    periodo: 'mes',
    acceso: meses ? `Permanencia de ${meses} meses` : 'Sin permanencia',
    tipo: 'cobro mensual',
    cobro: meses
      ? `Se renueva cada mes hasta que canceles. Puedes cancelar desde el mes ${meses}.`
      : 'Se renueva cada mes hasta que canceles. Cancela cuando quieras.',
    incluye,
  };
}

/** Las tres tarjetas, en su orden (Residente, Especialista, Visitante), para una pasarela. */
export const ofertasPara = (pasarela: Pasarela = 'mercadopago'): Oferta[] =>
  PLANES_NUEVOS.map((p) => ofertaDe(p, pasarela));

/** Las de Mercado Pago (soles), para lo que se pinta sin saber el país. */
export const OFERTAS: Oferta[] = ofertasPara('mercadopago');
