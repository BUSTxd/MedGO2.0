
import type { Zona } from './pasarela';

/** Los planes de antes (por tramo de Cayetano), que conservan quienes ya los pagan. */
export type PlanLegado = 'interno' | 'residente' | 'ufbi' | 'ufbi-anual';
/**
 * Los tres de ahora, para cualquier país, con todo incluido. Las claves son las de
 * los planes que ya existían en Mercado Pago y Creem, que se editaron en vez de
 * crear otros: `visitante` es Mensual, `especialista-24` es Ciclo y `residente-12`
 * es Anual. El alumno solo ve la etiqueta.
 */
export type PlanNuevo = 'visitante' | 'residente-12' | 'especialista-24';
export type PlanKey = PlanLegado | PlanNuevo;
export type ProfilePlan = 'free' | PlanKey;

/**
 * Los dos tramos de la carrera en Cayetano, que se cursan en facultades distintas:
 *  - `basico`   → 1.er año en UFBI (Ciencias Básicas): los 6 cursos del ciclo.
 *  - `medicina` → 2.º a 7.º año en la Facultad de Medicina Humana.
 *
 * Solo cuentan para los planes legados: uno de un tramo NUNCA abre el otro.
 * Los planes nuevos no tienen tramo (abren por `nivel`).
 */
export type Track = 'basico' | 'medicina';

/**
 * Lo que abre un plan nuevo. `base`: Preclínicos y la meta de su universidad.
 * `completo`: además las metas de examen (ENCIB…), la IA y los laboratorios.
 */
export type Nivel = 'base' | 'completo';

/**
 * Lo que pide un contenido para abrirse. `tramo` solo lo leen los planes
 * legados (abren lo de su tramo, como siempre); lo que no tiene tramo
 * (Preclínicos) solo lo abren los planes nuevos.
 */
export interface Requisito {
  tramo?: Track;
  nivel: Nivel;
}

export interface PlanCatalogEntry {
  key: PlanKey;
  label: string;
  /** La cuota que se cobra cada `durationDays`, en soles (Mercado Pago). La
   *  segunda pasarela (resto del mundo) añadirá aquí su precio en dólares. */
  amount: number;
  currency: 'PEN';
  durationDays: number;
  mpPlanIdEnv: string;
  /** Solo en los legados. */
  track?: Track;
  /** Solo en los nuevos: qué abren. */
  nivel?: Nivel;
  legado?: true;
  /** Se puede comprar hoy. Los nuevos, cuando existan sus planes en Mercado Pago. */
  aLaVenta: boolean;
  /** La cinta de la tarjeta («MÁS ELEGIDO»). */
  destacado?: string;
  /** Posición en las tarjetas de los planes nuevos. */
  orden?: number;
  /**
   * Compromiso mínimo en meses: nº de cobros consecutivos que el usuario acepta
   * antes de poder cancelar. Lo llevan los **mensuales** de los dos tramos; los
   * anuales no, porque ya cobran 12 meses por adelantado.
   *
   * Es un eje aparte de la cadencia (`durationDays`) y no se deduce del nombre
   * del plan: preguntarlo aquí es lo que evita repetir `planKey === 'interno'`
   * en el modal de compra, en Mi cuenta y en la ruta de cancelación —los tres
   * sitios donde ya se desincronizó una vez.
   */
  commitmentMonths?: number;
  /**
   * Precio fuera del Perú (Creem, merchant of record, en dólares). `meses` es
   * cada cuánto cobra (1, 6, 12 o 24), por adelantado; el id del producto va en
   * `productoEnv`. `europa` es el producto aparte para la zona Europa (ver
   * `zonaDePais`): allí Creem descuenta un IVA del 19-25 % de lo cobrado, así que
   * el precio sube para dejar lo mismo que Mercado Pago. Su id va escrito aquí
   * porque no es secreto y así no depende de una variable más en Vercel.
   */
  creem?: { usd: number; meses: number; productoEnv: string; europa?: { usd: number; producto: string } };
}

/** El precio en dólares de un plan con Creem, según la zona del visitante. */
export function usdCreem(plan: PlanCatalogEntry, zona: Zona): number {
  return (zona === 'europa' ? plan.creem?.europa?.usd : undefined) ?? plan.creem?.usd ?? 0;
}

export const PLANS: Record<PlanKey, PlanCatalogEntry> = {
  interno: {
    key: 'interno',
    label: 'Interno',
    amount: 14,
    currency: 'PEN',
    durationDays: 30,
    mpPlanIdEnv: 'MP_PLAN_INTERNO_ID',
    track: 'medicina',
    commitmentMonths: 3,
    legado: true,
    aLaVenta: false,
  },
  residente: {
    key: 'residente',
    label: 'Residente',
    amount: 142.80,
    currency: 'PEN',
    durationDays: 365,
    mpPlanIdEnv: 'MP_PLAN_RESIDENTE_ID',
    track: 'medicina',
    legado: true,
    aLaVenta: false,
  },
  ufbi: {
    key: 'ufbi',
    label: 'UFBI',
    amount: 19.70,
    currency: 'PEN',
    durationDays: 30,
    mpPlanIdEnv: 'MP_PLAN_UFBI_ID',
    track: 'basico',
    commitmentMonths: 3,
    legado: true,
    aLaVenta: false,
  },
  // Anual del tramo básico — el análogo de `residente` en Medicina. 189 son
  // exactamente el 80 % de 12 × 19.70 (236.40), de ahí el «20 % de descuento»
  // de la tarjeta: si se toca uno de los dos importes hay que rehacer el otro.
  'ufbi-anual': {
    key: 'ufbi-anual',
    label: 'UFBI Anual',
    amount: 189,
    currency: 'PEN',
    durationDays: 365,
    mpPlanIdEnv: 'MP_PLAN_UFBI_ANUAL_ID',
    track: 'basico',
    legado: true,
    aLaVenta: false,
  },
  // Los tres a la venta (decisión de BUST, 2026-11-02): todos abren lo mismo, solo
  // cambia cada cuánto se cobra, y los tres se renuevan solos hasta que el alumno
  // cancela, sin permanencia. Un ciclo de Cayetano dura de 3,4 a 4,3 meses: 6 meses
  // lo cubren entero, y es lo más cercano que deja elegir el panel de MP. Los importes
  // tienen que ser los del plan de MP, que es lo que se cobra de verdad (se editan en
  // su panel o con `actualizar-planes.mjs`). Dos ciclos cuestan más que el anual a propósito.
  visitante: {
    key: 'visitante',
    label: 'Mensual',
    amount: 22.90,
    currency: 'PEN',
    durationDays: 30,
    mpPlanIdEnv: 'MP_PLAN_VISITANTE_ID',
    creem: { usd: 6.99, meses: 1, productoEnv: 'CREEM_PRODUCT_VISITANTE_ID', europa: { usd: 8.99, producto: 'prod_6swHt8CrNUyKBA5StIW1aB' } },
    nivel: 'completo',
    aLaVenta: true,
    orden: 1,
  },
  'especialista-24': {
    key: 'especialista-24',
    label: 'Ciclo',
    amount: 79.90,
    currency: 'PEN',
    durationDays: 180,
    mpPlanIdEnv: 'MP_PLAN_ESPECIALISTA_24_ID',
    creem: { usd: 23.99, meses: 6, productoEnv: 'CREEM_PRODUCT_ESPECIALISTA_24_ID', europa: { usd: 28.99, producto: 'prod_1ozJdwsE6SxcRJGqx46Olr' } },
    nivel: 'completo',
    aLaVenta: true,
    destacado: 'PARA TU CICLO',
    orden: 2,
  },
  'residente-12': {
    key: 'residente-12',
    label: 'Anual',
    amount: 129.90,
    currency: 'PEN',
    durationDays: 365,
    mpPlanIdEnv: 'MP_PLAN_RESIDENTE_12_ID',
    creem: { usd: 38.99, meses: 12, productoEnv: 'CREEM_PRODUCT_RESIDENTE_12_ID', europa: { usd: 46.99, producto: 'prod_1mcFDD4T9O9rroP87TMPRy' } },
    nivel: 'completo',
    aLaVenta: true,
    orden: 3,
  },
};

export function isPlanKey(value: string): value is PlanKey {
  return Object.prototype.hasOwnProperty.call(PLANS, value);
}

/** Los planes a la venta en el orden de sus tarjetas (Mensual, Ciclo, Anual). */
export const PLANES_NUEVOS: PlanCatalogEntry[] = (Object.values(PLANS) as PlanCatalogEntry[])
  .filter((p) => p.aLaVenta)
  .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

/** Cuántos meses cubre cada cobro de un plan: 30 días → 1, 150 → 5, 365 → 12. */
export const mesesDe = (p: Pick<PlanCatalogEntry, 'durationDays'>) => Math.round(p.durationDays / 30);

/** Cómo se lee un periodo de `meses` en un precio: «mes», «5 meses», «año», «2 años». */
export function periodoDe(meses: number): string {
  if (meses === 1) return 'mes';
  if (meses % 12 === 0) return meses === 12 ? 'año' : `${meses / 12} años`;
  return `${meses} meses`;
}

/**
 * Lo que se le ofrece a quien choca con un contenido que pide `required`: el
 * propio plan mientras siga a la venta; si es un legado retirado, los planes
 * nuevos desde su cuota más baja (`nombre: null`, «Desde S/ …/mes»). Lo leen
 * los avisos del dashboard, que siguen declarando la clave legada de su tramo.
 */
export function ofertaPara(required: PlanKey): {
  nombre: string | null;
  amount: number;
  unidad: 'mes' | 'año';
} {
  const p = PLANS[required];
  if (p.aLaVenta) return { nombre: p.label, amount: p.amount, unidad: p.durationDays === 30 ? 'mes' : 'año' };
  return { nombre: null, amount: Math.min(...PLANES_NUEVOS.map((n) => n.amount)), unidad: 'mes' };
}

export function getPlan(planKey: string): (PlanCatalogEntry & { mpPlanId: string }) | null {
  if (!isPlanKey(planKey)) return null;
  const entry = PLANS[planKey];
  const mpPlanId = process.env[entry.mpPlanIdEnv];
  if (!mpPlanId) return null;
  return { ...entry, mpPlanId };
}

/**
 * Fecha a partir de la cual una suscripción se puede cancelar, o `null` si el
 * plan no tiene compromiso. Se cuenta en **meses calendario** desde la primera
 * autorización (`setMonth +N`), no en 90 días, para que coincida con N ciclos
 * de cobro reales.
 *
 * Vive aquí y no en cada consumidor a propósito: el botón de Mi cuenta y el
 * guard de `api/subscriptions/cancel` tienen que dar exactamente la misma
 * fecha, o el botón se habilita antes de que la API acepte cancelar.
 */
export function unlockDateFor(planKey: PlanKey, createdAt: string | Date): Date | null {
  const months = PLANS[planKey].commitmentMonths;
  if (!months) return null;
  const d = new Date(createdAt);
  d.setMonth(d.getMonth() + months);
  return d;
}

export interface PlanState {
  plan: ProfilePlan;
  isActive: boolean;
  expiresAt: Date | null;
  /** El admin ve todo sin importar el tramo. Ver `getUserPlanState`. */
  allAccess?: boolean;
}



/**
 * Jerarquía de los legados *dentro de un mismo tramo*. Solo tiene sentido
 * comparar rangos de planes que comparten `track` — para decidir acceso usa
 * `planUnlocks()`.
 */
export function planRank(plan: ProfilePlan): number {
  if (plan === 'free') return 0;
  // Los anuales son el escalón alto de su tramo: 'residente' en medicina,
  // 'ufbi-anual' en básico. Abren lo mismo que su mensual y algo más.
  if (plan === 'residente' || plan === 'ufbi-anual') return 2;
  return 1; // interno y ufbi: primer escalón de su respectivo tramo
}

const RANGO_NIVEL: Record<Nivel, number> = { base: 1, completo: 2 };

/**
 * El requisito que expresa una clave de plan. Una clave legada (`'interno'`,
 * `'ufbi'`) es «lo base de su tramo»: así las páginas del dashboard que
 * declaran el mensual de su tramo siguen funcionando sin tocarlas.
 */
export function requisitoDe(required: PlanKey | Requisito): Requisito {
  if (typeof required !== 'string') return required;
  const p = PLANS[required];
  return p.legado ? { tramo: p.track, nivel: 'base' } : { nivel: p.nivel ?? 'base' };
}

/**
 * ¿El plan que tiene el usuario da acceso a contenido que exige `required`?
 *
 *  - **Plan nuevo**: por nivel (`completo` abre lo `base`). El tramo no importa.
 *  - **Plan legado**: la regla de siempre. Abre lo de su tramo (base o
 *    completo: ya tenían sus laboratorios, y los de Facultad el ENCIB) y nunca
 *    lo del otro tramo ni lo que no tiene tramo (Preclínicos).
 */
export function planUnlocks(plan: ProfilePlan, required: PlanKey | Requisito): boolean {
  if (plan === 'free') return false;
  const p = PLANS[plan];
  // Un legado que exige un legado: además, anual ≥ mensual dentro del tramo.
  if (p.legado && typeof required === 'string' && PLANS[required].legado) {
    return p.track === PLANS[required].track && planRank(plan) >= planRank(required);
  }
  const req = requisitoDe(required);
  if (p.legado) return !!req.tramo && req.tramo === p.track;
  return RANGO_NIVEL[p.nivel ?? 'base'] >= RANGO_NIVEL[req.nivel];
}
