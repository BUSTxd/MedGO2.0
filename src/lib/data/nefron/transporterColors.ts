// Color característico de cada transportador (para identificarlo de un vistazo en la
// vista celular). Agrupados por función/cargo principal pero con tonos distinguibles.
// Si un id no está en el mapa, se usa el azul base de la app.

const FALLBACK = '#3b9edd';

export const TRANSPORTER_COLORS: Record<string, string> = {
  // Bombas Na⁺/K⁺-ATPasa (motor basolateral) — índigo
  'nak-tcp': '#4f46e5',
  'nak-tal': '#4f46e5',
  'nak-tcd': '#4f46e5',
  'nak-ccd': '#4f46e5',

  // Túbulo proximal
  nhe3: '#f97316', // intercambiador Na⁺/H⁺ — naranja
  sglt2: '#16a34a', // Na⁺-glucosa — verde
  sglt1: '#15803d', // Na⁺-glucosa (S3) — verde oscuro
  napi: '#0d9488', // Na⁺-fosfato — teal
  nbce1: '#2563eb', // Na⁺-HCO₃⁻ — azul
  glut2: '#eab308', // glucosa basolateral — ámbar
  oat3: '#0891b2', // aniones orgánicos (capta) — cian
  oat4: '#06b6d4', // aniones orgánicos (secreta) — cian claro
  oct2: '#be123c', // cationes orgánicos (capta) — rosa fuerte
  mate1: '#e11d48', // cationes orgánicos (secreta) — rosa

  // Acuaporinas (agua) — celeste
  'aqp1-tcp': '#38bdf8',
  'aqp1-asa': '#38bdf8',
  'aqp2-ccd': '#0ea5e9',
  'aqp2-med': '#0ea5e9',
  aqp34: '#7dd3fc',

  // Asa ascendente gruesa (TAL)
  nkcc2: '#9333ea', // Na⁺-K⁺-2Cl⁻ — púrpura
  'romk-tal': '#a855f7', // K⁺ — violeta
  'clckb-tal': '#22c55e', // Cl⁻ basolateral — verde
  'paracel-tal': '#d97706', // vía paracelular (claudinas) — ámbar

  // Túbulo distal (TCD)
  ncc: '#db2777', // Na⁺-Cl⁻ (tiazidas) — magenta
  trpv5: '#ec4899', // Ca²⁺ — rosa
  trpm6: '#14b8a6', // Mg²⁺ — verde azulado
  ncx1: '#fb923c', // Na⁺/Ca²⁺ — naranja claro

  // Colector cortical
  enac: '#ef4444', // canal de Na⁺ (amilorida) — rojo
  'romk-ccd': '#a855f7', // K⁺ — violeta
  bk: '#c026d3', // K⁺ por flujo — fucsia
  mr: '#64748b', // receptor mineralocorticoide — gris
  'h-atpasa': '#dc2626', // bomba de H⁺ — rojo intenso
  'hk-atpasa': '#b91c1c', // H⁺/K⁺-ATPasa — rojo oscuro
  'hatpasa-baso': '#dc2626', // H⁺-ATPasa basolateral (β) — rojo intenso
  ae1: '#1d4ed8', // Cl⁻/HCO₃⁻ — azul
  pendrina: '#3b82f6', // Cl⁻/HCO₃⁻ (β) — azul claro

  // Colector medular
  uta1: '#94a3b8', // urea — pizarra
  uta3: '#cbd5e1', // urea basolateral — pizarra claro
};

export function transporterColor(id: string): string {
  return TRANSPORTER_COLORS[id] ?? FALLBACK;
}
