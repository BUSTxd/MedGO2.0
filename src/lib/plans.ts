
/** Los planes de antes (por tramo de Cayetano), que conservan quienes ya los pagan. */
export type PlanLegado = 'interno' | 'residente' | 'ufbi' | 'ufbi-anual';
/** Los tres de ahora, para cualquier país: Visitante (mensual), Residente (12 cuotas) y Especialista (24 cuotas). */
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
  // Los tres nuevos se cobran cada mes; lo que cambia es la permanencia
  // (`commitmentMonths`), como las cuotas de SanarFlix. Las cuotas guardan su
  // proporción: Residente ≈ 77 % y Especialista ≈ 72 % de Visitante.
  visitante: {
    key: 'visitante',
    label: 'Visitante',
    amount: 39.90,
    currency: 'PEN',
    durationDays: 30,
    mpPlanIdEnv: 'MP_PLAN_VISITANTE_ID',
    nivel: 'base',
    aLaVenta: true,
    orden: 3,
  },
  'residente-12': {
    key: 'residente-12',
    label: 'Residente',
    amount: 29.90,
    currency: 'PEN',
    durationDays: 30,
    mpPlanIdEnv: 'MP_PLAN_RESIDENTE_12_ID',
    commitmentMonths: 12,
    nivel: 'completo',
    aLaVenta: true,
    destacado: 'MÁS ELEGIDO',
    orden: 1,
  },
  'especialista-24': {
    key: 'especialista-24',
    label: 'Especialista',
    amount: 27.90,
    currency: 'PEN',
    durationDays: 30,
    mpPlanIdEnv: 'MP_PLAN_ESPECIALISTA_24_ID',
    commitmentMonths: 24,
    nivel: 'completo',
    aLaVenta: true,
    orden: 2,
  },
};

export function isPlanKey(value: string): value is PlanKey {
  return Object.prototype.hasOwnProperty.call(PLANS, value);
}

/** Los planes nuevos en el orden de sus tarjetas (Residente, Especialista, Visitante). */
export const PLANES_NUEVOS: PlanCatalogEntry[] = (Object.values(PLANS) as PlanCatalogEntry[])
  .filter((p) => !p.legado)
  .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

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
