'use client';
// Piezas del laboratorio «Sepsis» (Patología, ACP13), en el estilo de las referencias de
// BUST (docs/sepsis/ESTILO.md): infografía plana, colores de joya y sin contorno oscuro. Cada
// objeto lleva un tono oscuro de base, el cuerpo claro corrido y un brillo. Lienzo de
// 1600 × 1000, sin `filter`; todo lo que se mueve es función de `reloj` (ms).
//
// Lo que ya existe en Citopenias, Vasculitis, Gramnegativas, Bilirrubina y VIH y sífilis se
// reexporta tal cual (no se copia); aquí solo lo propio de la sepsis.

import { type ReactNode } from 'react';
import { En, Txt, clamp, easeBack, easeOut, hash, lerp, tramo } from '../citopenias-autoinmunes/Piezas';
import { Bola } from '../vasculitis-anca/Piezas';
import { Letra } from '../vih-sifilis/Piezas';

export { En, Sale, Flecha, Txt, Rotulo, Esfera, Macrofago, Linfocito, Plasmatica, Ganglio, Higado, Bazo, Medula, Cerebro, Frasco, TuboOrina, Jeringa, BolsaSangre, Pastilla, Termometro, Corazon, Chorro, Virus, Persona, Mano, Pierna, Plaqueta, clamp, tramo, lerp, easeOut, easeBack, hash, blob, enBorde, TxCtx } from '../citopenias-autoinmunes/Piezas';
export { V, Bola, Bandera, Hematie, Neutrofilo, Net, C5a, CelEndo, Vaso, Tarjeta, Cuerpo, Punto, LineaTiempo, Foco, Llamada, Pista, Pantalla, TxtPantalla, Manometro, Pulmones, Alveolos, Rinon, Glomerulo, Paciente, Perfil, PiernaPurpura } from '../vasculitis-anca/Piezas';
export { Endo, Union, Basal, Intersticio, Luz, Pericito, NO, Enzima, Tallo, Selectina, VWF, WP, Histamina, Tnf, Il1, Nfkb, FT, PlaqAct, Fibrina, Liso, Heparan, Antitrombina, Tijera, Chip, Viaja, mezcla } from '../vasculitis-anca/Fisio';
export { Barra, Lente, viaje, FLECHA, Cruz, Visto, Membrana, Vesicula, Antigeno, Llama, Copo } from '../citopenias-autoinmunes/laminas/Comun';
export { Bacilo, Flota, Piso, Capas, Retrato, Suero, Ventilador, Cama, Envoltura, Gel, Cremallera, Figurita, Enterocito, Caliciforme, Intestino } from '../gramnegativas/Piezas';
export { Cerradura, Estacion, Via, Vagon, TuboEnsayo, Tira, Maquina, Flujo, Gota, Poro, Proteina, Reticulo } from '../bilirrubina/Piezas';
export { Hombre, Nodo, Reloj, Signo, Sello, Trazo, Cerrojo, Llave, Hla, Dendritica, Microglia, Diana, Tijeras, Puerta, Guardia, Letra, Recorte, Medallon, Goteo, Nube, Burbujas } from '../vih-sifilis/Piezas';

type Tono = readonly string[];
type P2 = [number, number];

/** Paleta propia (oscuro → claro). Cada entidad conserva su color en todo el lab. */
export const S = {
  menin: ['#C23A22', '#F26B4E', '#FFC0A8'],
  pseudo: ['#0B6E63', '#19B3A0', '#9CF0E0'],
  lps: ['#B07A00', '#F2B21E', '#FFE49A'],
  tnf: ['#C2540A', '#FF8A1E', '#FFC890'],
  il1: ['#A81830', '#E5324C', '#FF9AA4'],
  il6: ['#5A22A8', '#8A4FE8', '#D2B8FF'],
  c5a: ['#0A7F96', '#16B9D6', '#9DEBF8'],
  nfkb: ['#8AA000', '#D4E81E', '#F4FFA0'],
  endo: ['#C25A52', '#F09088', '#FFD0C8'],
  gluco: ['#1E8F5A', '#2FD79A', '#B6F5D8'],
  plaq: ['#7A3FB0', '#B58AE8', '#F2E6FF'],
  fibrina: ['#C9A66B', '#F0D9A8', '#FFF6E0'],
  net: ['#6B1FB0', '#B04AE8', '#E8CCFF'],
  no: ['#2E9FD8', '#7FD0F5', '#E0F6FF'],
  lactato: ['#B86A00', '#FFB02E', '#FFE08A'],
  linfo: ['#1E4FC0', '#4F7FF0', '#C0D4FF'],
  neutro: ['#8C7BC0', '#D8CFF0', '#FFFFFF'],
  sangre: ['#9E0B2E', '#E3203F', '#FF5D6C'],
  membrana: ['#B02FA0', '#E86AD2', '#FFB0F0'],
  cito: ['#C46AC0', '#E8A4E4', '#F9D8F6'],
  nucleo: ['#2A0F6E', '#4A2A9E', '#8A6BE0'],
  verde: ['#138A3A', '#3FD467', '#B5F5C4'],
  gris: ['#6E6478', '#9C92A8', '#D0C8DA'],
  sombra: 'rgba(40,10,80,0.22)',
} as const;

/** Colores de TEXTO que se adaptan al tema (variables de `sepsis.module.css`). */
export const TXS = {
  menin: 'var(--se-menin)', pseudo: 'var(--se-pseudo)', lps: 'var(--se-lps)', tnf: 'var(--se-tnf)', il1: 'var(--se-il1)',
  il6: 'var(--se-il6)', c5a: 'var(--se-c5a)', nfkb: 'var(--se-nfkb)', endo: 'var(--se-endo)', gluco: 'var(--se-gluco)',
  plaq: 'var(--se-plaq)', fibrina: 'var(--se-fibrina)', net: 'var(--se-net)', no: 'var(--se-no)', lactato: 'var(--se-lactato)',
  linfo: 'var(--se-linfo)', sangre: 'var(--se-sangre)', verde: 'var(--se-verde)', violeta: 'var(--se-violeta)', ambar: 'var(--se-ambar)',
} as const;

// ─── Movimiento continuo ─────────────────────────────────────────────────────

/** Latido 0-1 con dos golpes («lub-dub»): `reloj` en ms. */
export function latido(reloj: number, bpm = 70, fase = 0): number {
  const t = (((reloj / 1000) * (bpm / 60) + fase) % 1 + 1) % 1;
  const pico = (c: number, a: number) => Math.exp(-((t - c) ** 2) / (2 * a * a));
  return clamp(pico(0.12, 0.045) + 0.6 * pico(0.38, 0.055));
}

/** Onda lenta 0-1 (respiración, ondulación): periodo en ms. */
export const respira = (reloj: number, periodo = 3200, fase = 0) => 0.5 + 0.5 * Math.sin((reloj / periodo) * Math.PI * 2 + fase);

/** Los hijos laten (escala) alrededor de su origen. */
export function Late({ x = 0, y = 0, k = 1, o = 1, r = 0, reloj, bpm = 70, fuerza = 1, fase = 0, children }: { x?: number; y?: number; k?: number; o?: number; r?: number; reloj: number; bpm?: number; fuerza?: number; fase?: number; children: ReactNode }) {
  return <En x={x} y={y} r={r} k={k * (1 + 0.055 * fuerza * latido(reloj, bpm, fase))} o={o}>{children}</En>;
}

/** Los hijos respiran (escala suave). */
export function Respira({ x = 0, y = 0, k = 1, o = 1, r = 0, reloj, periodo = 3200, fase = 0, amp = 0.03, children }: { x?: number; y?: number; k?: number; o?: number; r?: number; reloj: number; periodo?: number; fase?: number; amp?: number; children: ReactNode }) {
  return <En x={x} y={y} r={r} k={k * (1 + amp * (respira(reloj, periodo, fase) - 0.5) * 2)} o={o}>{children}</En>;
}

// ─── El microbio ─────────────────────────────────────────────────────────────

/** Meningococo: dos granos de café enfrentados (diplococo). `capsula` 0-1: halo polisacárido; `pili` 0-1: largo de los pili, que ondulan. */
export function Diplococo({ x = 0, y = 0, r = 0, k = 1, o = 1, capsula = 0, pili = 1, reloj = 0, tono = S.menin as Tono, fase = 0 }: { x?: number; y?: number; r?: number; k?: number; o?: number; capsula?: number; pili?: number; reloj?: number; tono?: Tono; fase?: number }) {
  const t = reloj / 1000 + fase;
  const resp = 1 + 0.018 * Math.sin(t * 1.9);
  const pelos = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 + 0.2;
    const px = Math.cos(a) * 66, py = Math.sin(a) * 38;
    const largo = (20 + hash(i, 5) * 22) * pili;
    const ox = Math.cos(a), oy = Math.sin(a), w = Math.sin(t * 2.4 + i * 1.7) * 7 * pili;
    return `M${px.toFixed(1)},${py.toFixed(1)} Q${(px + ox * largo * 0.5 - oy * w).toFixed(1)},${(py + oy * largo * 0.5 + ox * w).toFixed(1)} ${(px + ox * largo).toFixed(1)},${(py + oy * largo).toFixed(1)}`;
  });
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      {capsula > 0.01 && <g opacity={clamp(capsula)}>
        <rect x={-106} y={-72} width={212} height={144} rx={72} fill={tono[2]} opacity={0.42} />
        <rect x={-106} y={-72} width={212} height={144} rx={72} fill="none" stroke={tono[1]} strokeWidth={5} strokeDasharray="2 10" strokeLinecap="round" opacity={0.7} />
      </g>}
      {pili > 0.01 && <g fill="none" stroke={tono[1]} strokeWidth={4} strokeLinecap="round" opacity={0.85}>
        {pelos.map((d, i) => <path key={i} d={d} />)}
      </g>}
      <g transform={`scale(${resp.toFixed(4)})`}>
        {[-1, 1].map((s) => (
          <g key={s} transform={`translate(${s * 33},0)`}>
            <ellipse rx={39} ry={34} fill={tono[0]} />
            <ellipse cx={-s * 3} cy={-3} rx={34} ry={29} fill={tono[1]} />
            <ellipse cx={-s * 15} cy={-15} rx={9} ry={5.5} fill="#FFF" opacity={0.7} transform={`rotate(${-s * 25} ${-s * 15} -15)`} />
          </g>
        ))}
        <path d="M0,-30 Q-3,0 0,30" fill="none" stroke={tono[0]} strokeWidth={5} strokeLinecap="round" />
      </g>
    </En>
  );
}

/** Lipopolisacárido anclado en la membrana externa (y = 0) y creciendo hacia arriba: seis colas de lípido A (abajo, en la membrana),
 *  núcleo de azúcares y cadena O (`cadena` 0 = lipooligosacárido del meningococo). `resalta` 0-1 ilumina el lípido A. */
export function Lps({ x = 0, y = 0, k = 1, o = 1, r = 0, cadena = 1, resalta = 0, reloj = 0, fase = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; cadena?: number; resalta?: number; reloj?: number; fase?: number }) {
  const n = Math.round(10 * clamp(cadena));
  const t = reloj / 800 + fase;
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      {resalta > 0.01 && <ellipse cx={0} cy={26} rx={38} ry={50} fill={S.lps[2]} opacity={0.5 * clamp(resalta)} />}
      {[-15, -9, -3, 3, 9, 15].map((dx, i) => (
        <path key={i} d={`M${dx},4 q${dx > 0 ? 3 : -3},24 ${dx * 0.4},52`} fill="none" stroke={S.lps[1]} strokeWidth={4.6} strokeLinecap="round" />
      ))}
      <rect x={-22} y={-12} width={20} height={20} rx={7} fill={S.lps[0]} /><rect x={2} y={-12} width={20} height={20} rx={7} fill={S.lps[0]} />
      <rect x={-21} y={-13} width={18} height={17} rx={6} fill={S.lps[1]} /><rect x={3} y={-13} width={18} height={17} rx={6} fill={S.lps[1]} />
      <circle cx={-14} cy={-8} r={3} fill="#FFF" opacity={0.7} />
      {[0, 1, 2].map((i) => <Bola key={i} x={Math.sin(t + i) * 2.5} y={-30 - i * 21} R={11} tono={['#C2620A', '#F5A21B', '#FFE49A']} />)}
      {Array.from({ length: n }, (_, i) => (
        <Bola key={`o${i}`} x={Math.sin(t * 1.3 + i * 0.8) * (4 + i * 0.9)} y={-92 - i * 15} R={7.5} tono={i % 2 ? ['#C77A0A', '#FFD23F', '#FFF0A8'] : ['#B07A00', '#F2B21E', '#FFE49A']} />
      ))}
    </En>
  );
}

// ─── Reconocimiento y señal ──────────────────────────────────────────────────

/** Membrana viva: doble capa de cabezas magenta con colas que ondula sola. y = línea media. */
export function MembranaViva({ x = 800, y = 700, w = 1700, k = 1, o = 1, reloj = 0, amp = 9, fase = 0 }: { x?: number; y?: number; w?: number; k?: number; o?: number; reloj?: number; amp?: number; fase?: number }) {
  const n = Math.round(w / 40);
  const onda = (i: number, f: number) => amp * Math.sin(i * 0.5 + reloj / 750 + fase + f);
  return (
    <En x={x} y={y} k={k} o={o}>
      <g transform={`translate(${-w / 2},0)`}>
        {Array.from({ length: n }, (_, i) => {
          const px = 20 + i * 40, ya = -34 + onda(i, 0), yb = 34 + onda(i, 0.9);
          return (
            <g key={i}>
              <path d={`M${px - 5},${ya + 12} q-3,${(yb - ya) / 2 - 12} 0,${(yb - ya) / 2 - 8} M${px + 5},${ya + 12} q3,${(yb - ya) / 2 - 12} 0,${(yb - ya) / 2 - 8}`} fill="none" stroke={S.membrana[2]} strokeWidth={3.4} strokeLinecap="round" opacity={0.8} />
              <path d={`M${px - 5},${yb - 12} q-3,${-(yb - ya) / 2 + 12} 0,${-(yb - ya) / 2 + 8} M${px + 5},${yb - 12} q3,${-(yb - ya) / 2 + 12} 0,${-(yb - ya) / 2 + 8}`} fill="none" stroke={S.membrana[2]} strokeWidth={3.4} strokeLinecap="round" opacity={0.8} />
              <circle cx={px} cy={ya} r={16} fill={S.membrana[0]} /><circle cx={px - 1.5} cy={ya - 1.5} r={14} fill={S.membrana[1]} /><circle cx={px - 5} cy={ya - 6} r={3.4} fill="#FFF" opacity={0.7} />
              <circle cx={px} cy={yb} r={16} fill={S.membrana[0]} /><circle cx={px - 1.5} cy={yb - 1.5} r={14} fill={S.membrana[1]} /><circle cx={px - 5} cy={yb - 6} r={3.4} fill="#FFF" opacity={0.7} />
            </g>
          );
        })}
      </g>
    </En>
  );
}

/** Receptor TLR4/MD-2: toro naranja sobre un tallo magenta (como los receptores de «membrana celular»), con su bolsillo MD-2 y,
 *  debajo de la membrana, el dominio TIR (la cola) que se ilumina al activarse. La base está en y = 0 (la membrana). */
export function Tlr4({ x = 0, y = 0, k = 1, o = 1, r = 0, activo = 0, md2 = 1, reloj = 0, cola = true }: { x?: number; y?: number; k?: number; o?: number; r?: number; activo?: number; md2?: number; reloj?: number; cola?: boolean }) {
  const a = clamp(activo);
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      {cola && <path d={`M-5,16 q-14,22 4,36 q18,14 0,34`} fill="none" stroke={a > 0.05 ? S.lps[1] : S.gris[1]} strokeWidth={9} strokeLinecap="round" opacity={0.95} />}
      {cola && a > 0.05 && <circle cx={-1} cy={86} r={11 + 4 * Math.sin(reloj / 260)} fill={S.lps[2]} opacity={0.55 * a} />}
      <rect x={-8} y={-62} width={16} height={74} rx={8} fill="#B000C8" /><rect x={-6} y={-62} width={12} height={72} rx={6} fill="#FF2DF0" /><rect x={-4} y={-58} width={3} height={60} rx={1.5} fill="#FFB0FA" opacity={0.7} />
      <ellipse cx={0} cy={-84} rx={50} ry={28} fill="#C77800" /><ellipse cx={-1} cy={-86} rx={46} ry={25} fill="#FFAE1A" />
      <ellipse cx={0} cy={-84} rx={24} ry={9.5} fill="#2A0F6E" /><ellipse cx={-14} cy={-98} rx={14} ry={4.4} fill="#FFF" opacity={0.65} />
      {md2 > 0.01 && <g opacity={md2}><circle cx={44} cy={-72} r={17} fill={S.il6[0]} /><circle cx={42} cy={-74} r={14.5} fill={S.il6[1]} /><circle cx={37} cy={-80} r={4} fill="#FFF" opacity={0.7} /></g>}
      {a > 0.05 && <ellipse cx={0} cy={-84} rx={62 + 5 * Math.sin(reloj / 300)} ry={38 + 3 * Math.sin(reloj / 300)} fill="none" stroke={S.lps[2]} strokeWidth={5} opacity={0.75 * a} />}
    </En>
  );
}

/** Proteína LBP (azul, con su hendidura) y CD14 (copa verde azulada): los dos relevos que llevan el LPS al TLR4. */
export function Lbp({ x = 0, y = 0, k = 1, o = 1, r = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <path d="M-34,0 q0,-30 34,-30 q34,0 34,30 q0,26 -34,26 q-34,0 -34,-26 Z" fill="#2347B0" /><path d="M-31,-3 q0,-27 31,-27 q31,0 31,27 q0,22 -31,22 q-31,0 -31,-22 Z" fill="#4F7FF0" />
      <path d="M-10,-22 q10,12 20,0" fill="none" stroke="#14307C" strokeWidth={6} strokeLinecap="round" />
      <ellipse cx={-17} cy={-18} rx={9} ry={4.2} fill="#FFF" opacity={0.65} />
    </En>
  );
}
export function Cd14({ x = 0, y = 0, k = 1, o = 1, r = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <path d="M-30,-26 q-4,52 30,52 q34,0 30,-52" fill="none" stroke="#0A6F78" strokeWidth={22} strokeLinecap="round" />
      <path d="M-30,-26 q-4,50 30,50 q34,0 30,-50" fill="none" stroke="#16B9BE" strokeWidth={17} strokeLinecap="round" />
      <path d="M-24,-18 q-2,18 8,28" fill="none" stroke="#7FEDE8" strokeWidth={5} strokeLinecap="round" opacity={0.85} />
    </En>
  );
}

/** Interleucina 6: hexágono violeta (como TNF-α es el trébol rojo y la IL-1 el trío naranja). */
export function Il6({ x = 0, y = 0, k = 1, o = 1, r = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number }) {
  const hex = (R: number) => Array.from({ length: 6 }, (_, i) => `${(Math.cos((i / 6) * Math.PI * 2 + 0.3) * R).toFixed(1)},${(Math.sin((i / 6) * Math.PI * 2 + 0.3) * R).toFixed(1)}`).join(' ');
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <polygon points={hex(17)} fill={S.il6[0]} /><polygon points={hex(14.5)} fill={S.il6[1]} transform="translate(-1,-1)" />
      <circle cx={-5} cy={-6} r={3} fill="#FFF" opacity={0.75} />
    </En>
  );
}

/** Mensajero genérico: estrella de `n` puntas (IL-8, IL-12, IL-18, interferón…) en el tono que se le dé. */
export function Chispa({ x = 0, y = 0, k = 1, o = 1, r = 0, tono = S.il6 as Tono, n = 4, reloj = 0, fase = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; tono?: Tono; n?: number; reloj?: number; fase?: number }) {
  const R = 18 * (1 + 0.12 * Math.sin(reloj / 260 + fase));
  const pts = Array.from({ length: n * 2 }, (_, i) => { const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? R * 0.42 : R; return `${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`; }).join(' ');
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <polygon points={pts} fill={tono[0]} /><polygon points={pts} fill={tono[1]} transform="translate(-1.2,-1.2) scale(0.9)" />
      <circle cx={-3} cy={-4} r={2.4} fill="#FFF" opacity={0.8} />
    </En>
  );
}

/** Corte de una célula (monocito): membrana magenta que ondula, citoplasma rosa y núcleo índigo con poros en su arco superior.
 *  Origen en el centro de la célula; los hijos van en coordenadas locales. */
export function CelulaCorte({ x = 800, y = 520, w = 1200, h = 760, k = 1, o = 1, reloj = 0, nucleo = true, nucleoY = 190, nucleoR = 190, children }: { x?: number; y?: number; w?: number; h?: number; k?: number; o?: number; reloj?: number; nucleo?: boolean; nucleoY?: number; nucleoR?: number; children?: ReactNode }) {
  const rx = w / 2, ry = h / 2;
  const t = reloj / 1000;
  const puntos = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2, f = 1 + 0.012 * Math.sin(a * 5 + t * 1.6) + 0.008 * Math.sin(a * 3 - t * 1.1);
    return [Math.cos(a) * rx * f, Math.sin(a) * ry * f];
  });
  let d = '';
  puntos.forEach(([px, py], i) => {
    const [qx, qy] = puntos[(i + 1) % puntos.length];
    d += i === 0 ? `M${((px + qx) / 2).toFixed(1)},${((py + qy) / 2).toFixed(1)}` : ` Q${px.toFixed(1)},${py.toFixed(1)} ${((px + qx) / 2).toFixed(1)},${((py + qy) / 2).toFixed(1)}`;
  });
  d += ` Q${puntos[0][0].toFixed(1)},${puntos[0][1].toFixed(1)} ${((puntos[0][0] + puntos[1][0]) / 2).toFixed(1)},${((puntos[0][1] + puntos[1][1]) / 2).toFixed(1)} Z`;
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d={d} fill={S.membrana[0]} transform="scale(1.03)" />
      <path d={d} fill={S.cito[1]} opacity={0.96} />
      <path d={d} fill="none" stroke={S.membrana[1]} strokeWidth={9} />
      <ellipse cx={-rx * 0.5} cy={-ry * 0.55} rx={rx * 0.28} ry={ry * 0.07} fill="#FFF" opacity={0.28} transform={`rotate(-18 ${-rx * 0.5} ${-ry * 0.55})`} />
      {nucleo && <g>
        <circle cx={0} cy={nucleoY} r={nucleoR + 14} fill={S.cito[0]} opacity={0.6} />
        <circle cx={0} cy={nucleoY} r={nucleoR} fill={S.nucleo[0]} /><circle cx={-6} cy={nucleoY - 6} r={nucleoR - 14} fill={S.nucleo[1]} />
        {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={(hash(i, 8) - 0.5) * nucleoR * 1.2} cy={nucleoY + (hash(i, 9) - 0.3) * nucleoR * 0.9} r={5 + hash(i, 10) * 8} fill={S.nucleo[2]} opacity={0.45} />)}
        {[-0.62, 0, 0.62].map((a, i) => <g key={i} transform={`translate(${Math.sin(a) * (nucleoR + 4)},${nucleoY - Math.cos(a) * (nucleoR + 4)}) rotate(${(a * 180) / Math.PI})`}><rect x={-15} y={-9} width={30} height={18} rx={9} fill={S.cito[1]} /><rect x={-11} y={-4} width={22} height={8} rx={4} fill={S.nucleo[2]} opacity={0.9} /></g>)}
      </g>}
      {children}
    </En>
  );
}

/** Fosfato (esfera verde con su P) y marca de ubiquitina (píldora violeta). */
export function Fosfato({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <Bola R={15} tono={S.verde as unknown as string[]} /><Letra x={0} y={6} txt="P" t={18} />
    </En>
  );
}
export function Ubi({ x = 0, y = 0, k = 1, o = 1, r = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <rect x={-17} y={-11} width={34} height={22} rx={11} fill={S.il6[0]} /><rect x={-16} y={-12} width={32} height={20} rx={10} fill={S.il6[1]} />
      <Letra x={0} y={5} txt="Ub" t={14} /><ellipse cx={-8} cy={-8} rx={5} ry={2.4} fill="#FFF" opacity={0.6} />
    </En>
  );
}

/** Proteasoma: barril de cuatro anillos con una tapa a cada lado. `traga` 0-1 abre la boca. */
export function Proteasoma({ x = 0, y = 0, k = 1, o = 1, r = 0, traga = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; traga?: number }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <rect x={-60} y={-42} width={120} height={84} rx={20} fill="#0A6F78" />
      <rect x={-57} y={-45} width={114} height={80} rx={19} fill="#16B9BE" />
      {[-24, -8, 8, 24].map((dx) => <rect key={dx} x={dx - 2.5} y={-38} width={5} height={70} rx={2.5} fill="#0A6F78" opacity={0.55} />)}
      <rect x={-80} y={-34} width={30} height={68} rx={14} fill="#7A3FB0" /><rect x={50} y={-34} width={30} height={68} rx={14} fill="#7A3FB0" />
      <rect x={-78} y={-36} width={26} height={64} rx={12} fill="#B58AE8" /><rect x={52} y={-36} width={26} height={64} rx={12} fill="#B58AE8" />
      <ellipse cx={-66} cy={-14} rx={4} ry={14} fill="#FFF" opacity={0.5} />
      <ellipse cx={-80} cy={0} rx={7 + 6 * clamp(traga)} ry={14 + 6 * clamp(traga)} fill="#2A0F6E" />
      <ellipse cx={-30} cy={-30} rx={16} ry={4.4} fill="#FFF" opacity={0.5} />
    </En>
  );
}

/** Inflamasoma: rueda de siete pétalos coral (NLRP3) alrededor de un disco ámbar (ASC). `monta` 0-1: los pétalos llegan y encajan;
 *  `activo` 0-1: se enciende y gira. */
export function Inflamasoma({ x = 0, y = 0, k = 1, o = 1, monta = 1, activo = 0, reloj = 0 }: { x?: number; y?: number; k?: number; o?: number; monta?: number; activo?: number; reloj?: number }) {
  const m = clamp(monta), a = clamp(activo);
  const giro = a * (reloj / 22);
  return (
    <En x={x} y={y} k={k} o={o}>
      {a > 0.05 && <circle r={150 + 8 * Math.sin(reloj / 280)} fill={S.lps[2]} opacity={0.35 * a} />}
      <g transform={`rotate(${giro.toFixed(1)})`}>
        {Array.from({ length: 7 }, (_, i) => {
          const ang = (i / 7) * 360, q = tramo(m, i / 14, i / 14 + 0.5), rad = lerp(260, 74, easeOut(q));
          return (
            <g key={i} transform={`rotate(${ang}) translate(0,${-rad})`} opacity={clamp(q * 2)}>
              <rect x={-22} y={-34} width={44} height={68} rx={22} fill={S.menin[0]} /><rect x={-20} y={-36} width={40} height={64} rx={20} fill={S.menin[1]} />
              <ellipse cx={-7} cy={-22} rx={5} ry={9} fill="#FFF" opacity={0.55} />
            </g>
          );
        })}
      </g>
      <circle r={54} fill={S.lps[0]} /><circle cx={-3} cy={-3} r={49} fill={S.lps[1]} /><circle cx={-17} cy={-19} r={9} fill="#FFF" opacity={0.65} />
      <Letra x={0} y={9} txt="ASC" t={26} />
    </En>
  );
}

/** Célula que muere por apoptosis: p 0-1 la esfera se encoge y se parte en cuerpos índigo de tamaños distintos («muerte celular»). */
export function Apoptosis({ x = 0, y = 0, k = 1, o = 1, p = 1, R = 60, tono = S.linfo as Tono }: { x?: number; y?: number; k?: number; o?: number; p?: number; R?: number; tono?: Tono }) {
  const q = clamp(p);
  return (
    <En x={x} y={y} k={k} o={o}>
      {q < 0.55 && <g opacity={1 - tramo(q, 0.3, 0.55)}>
        <circle r={R * (1 - 0.22 * q)} fill={tono[0]} /><circle cx={-3} cy={-3} r={R * (1 - 0.22 * q) - 6} fill={tono[1]} /><circle cx={-R * 0.35} cy={-R * 0.4} r={R * 0.14} fill="#FFF" opacity={0.7} />
      </g>}
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2 + hash(i, 3), d = R * 0.9 * tramo(q, 0.35, 1) * (0.5 + hash(i, 4));
        const rr = R * (0.12 + hash(i, 5) * 0.2) * tramo(q, 0.3, 0.6);
        return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={rr} fill={S.nucleo[1]} opacity={0.95} />;
      })}
    </En>
  );
}

// ─── Equilibrios ─────────────────────────────────────────────────────────────

/** Balanza de dos platos. `inclina` −1 (izquierda abajo) … 1 (derecha abajo). `izq` y `der` van sobre cada plato. */
export function Balanza({ x = 800, y = 520, k = 1, o = 1, inclina = 0, izq, der, reloj = 0 }: { x?: number; y?: number; k?: number; o?: number; inclina?: number; izq?: ReactNode; der?: ReactNode; reloj?: number }) {
  const a = clamp(inclina, -1, 1) * 13 + 0.6 * Math.sin(reloj / 900);
  const L = 250, rad = (a * Math.PI) / 180;
  const ex = Math.cos(rad) * L, ey = Math.sin(rad) * L;
  const plato = (px: number, py: number, hijos: ReactNode) => (
    <g transform={`translate(${px.toFixed(1)},${(py + 168).toFixed(1)})`}>
      <path d="M-98,-168 L-104,0 M98,-168 L104,0" fill="none" stroke="#C9A66B" strokeWidth={4} strokeLinecap="round" />
      <path d="M-122,0 Q0,86 122,0 Z" fill="#7A3FB0" /><path d="M-118,-3 Q0,76 118,-3 Z" fill="#B58AE8" /><path d="M-100,6 Q-60,34 -20,34" fill="none" stroke="#FFF" strokeWidth={5} strokeLinecap="round" opacity={0.5} />
      <g transform="translate(0,-8)">{hijos}</g>
    </g>
  );
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M-70,300 L70,300 L0,-70 Z" fill="#6B1FB0" /><path d="M-56,296 L56,296 L0,-52 Z" fill="#8A4FE8" />
      <rect x={-L - 18} y={-12} width={2 * L + 36} height={26} rx={13} fill="#C99300" transform={`rotate(${a.toFixed(2)})`} /><rect x={-L - 14} y={-14} width={2 * L + 28} height={20} rx={10} fill="#FFD23F" transform={`rotate(${a.toFixed(2)})`} />
      <circle cx={0} cy={0} r={22} fill="#C99300" /><circle cx={-2} cy={-2} r={18} fill="#FFD23F" /><circle cx={-8} cy={-8} r={4.4} fill="#FFF" opacity={0.7} />
      {plato(-ex, -ey, izq)}
      {plato(ex, ey, der)}
    </En>
  );
}

/** Ficha de dominó con su icono; `cae` 0-1 la tumba hacia la derecha. */
export function Domino({ x = 0, y = 0, k = 1, o = 1, cae = 0, tono = S.il6 as Tono, children }: { x?: number; y?: number; k?: number; o?: number; cae?: number; tono?: Tono; children?: ReactNode }) {
  const c = easeOut(clamp(cae));
  return (
    <En x={x} y={y} k={k} o={o}>
      <g transform={`translate(140,158) rotate(${(c * 72).toFixed(1)}) translate(-140,-158)`}>
        <rect x={-6} y={-6} width={152} height={176} rx={26} fill={tono[0]} /><rect x={-8} y={-10} width={148} height={168} rx={24} fill={tono[1]} />
        <path d="M2,76 L130,76" stroke={tono[0]} strokeWidth={5} strokeLinecap="round" opacity={0.55} />
        <rect x={4} y={-4} width={46} height={8} rx={4} fill="#FFF" opacity={0.45} />
        <g transform="translate(66,40)">{children}</g>
      </g>
    </En>
  );
}

// ─── Utilidades de composición ───────────────────────────────────────────────

/** Interpola un punto sobre una polilínea (0-1). */
export function sobre(pts: P2[], u: number): P2 {
  const q = clamp(u) * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(q)), f = q - i;
  return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)];
}


// ─── Metabolismo (capítulo 13) ───────────────────────────────────────────────

/** Mitocondria en corte: membrana externa, crestas y electrones que corren por ellas. `dano` 0-1 la apaga (gris, electrones quietos). */
export function Mitocondria({ x = 0, y = 0, k = 1, o = 1, r = 0, dano = 0, reloj = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; dano?: number; reloj?: number }) {
  const d = clamp(dano);
  const cristas = [-150, -90, -30, 30, 90, 150];
  const bez = (t: number, cx: number, s: number): P2 => {
    const u = 1 - t, p0: P2 = [cx, -112 * s], p1: P2 = [cx - 14, -70 * s], p2: P2 = [cx + 14, -30 * s], p3: P2 = [cx, 10 * s];
    return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
  };
  const resp = 1 + 0.018 * Math.sin(reloj / 700) * (1 - d);
  return (
    <En x={x} y={y} r={r} k={k * resp} o={o}>
      <ellipse cx={0} cy={9} rx={250} ry={140} fill="#9A4F12" />
      <ellipse cx={0} cy={0} rx={250} ry={140} fill="#EE9A44" />
      <ellipse cx={0} cy={0} rx={228} ry={118} fill="#FCD9A0" />
      {cristas.map((cx, i) => {
        const s = i % 2 === 0 ? 1 : -1;
        const dd = `M${cx},${-112 * s} C${cx - 14},${-70 * s} ${cx + 14},${-30 * s} ${cx},${10 * s}`;
        const e = bez(((reloj / 1500 + i * 0.17) % 1), cx, s);
        return (
          <g key={i}>
            <path d={dd} fill="none" stroke="#C97420" strokeWidth={26} strokeLinecap="round" />
            <path d={dd} fill="none" stroke="#F0A04A" strokeWidth={14} strokeLinecap="round" />
            {[0.25, 0.55, 0.85].map((t, j) => { const q = bez(t, cx, s); return <circle key={j} cx={q[0] + (j % 2 ? 11 : -11)} cy={q[1]} r={7} fill="#8A3A10" opacity={0.75} />; })}
            <circle cx={e[0]} cy={e[1]} r={8} fill="#FFF3B0" opacity={1 - d} />
          </g>
        );
      })}
      <ellipse cx={0} cy={0} rx={250} ry={140} fill="#7C7488" opacity={0.62 * d} />
      <ellipse cx={-110} cy={-86} rx={70} ry={11} fill="#FFFFFF" opacity={0.5} transform="rotate(-14 -110 -86)" />
    </En>
  );
}

/** Glucosa: anillo hexagonal con sus tres grupos hidroxilo. */
export function Glucosa({ x = 0, y = 0, k = 1, o = 1, r = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number }) {
  const pts = Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i + Math.PI / 6; return [Math.cos(a) * 58, Math.sin(a) * 58] as P2; });
  const d = 'M' + pts.map((q) => q.join(',')).join(' L') + ' Z';
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      <g transform="translate(0,8)"><path d={d} fill="#1E4FA0" strokeLinejoin="round" stroke="#1E4FA0" strokeWidth={14} /></g>
      <path d={d} fill="#3F7FE0" strokeLinejoin="round" stroke="#3F7FE0" strokeWidth={14} />
      <path d="M-20,-10 L0,-30 L22,-10 L22,18 L0,38 L-20,18 Z" fill="#7FB0FF" opacity={0.55} />
      {[[-1, -1], [1, -1], [0, 1.15]].map(([sx, sy], i) => <g key={i}><path d={`M${sx * 46},${sy * 46} L${sx * 78},${sy * 78}`} stroke="#3F7FE0" strokeWidth={8} strokeLinecap="round" /><circle cx={sx * 84} cy={sy * 84} r={13} fill="#FF6B7A" /></g>)}
      <ellipse cx={-26} cy={-34} rx={18} ry={6} fill="#FFF" opacity={0.6} transform="rotate(-30 -26 -34)" />
    </En>
  );
}

/** Moneda de energía (ATP): disco dorado con su borde interior y su brillo. */
export function Moneda({ x = 0, y = 0, k = 1, o = 1, txt = 'ATP', tono = S.lps as Tono }: { x?: number; y?: number; k?: number; o?: number; txt?: string; tono?: Tono }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <circle cx={0} cy={6} r={46} fill={tono[0]} /><circle r={46} fill={tono[1]} />
      <circle r={35} fill="none" stroke={tono[2]} strokeWidth={4} opacity={0.85} />
      <text y={10} textAnchor="middle" fontSize={27} fontWeight={800} fill="#FFF">{txt}</text>
      <ellipse cx={-17} cy={-27} rx={13} ry={5} fill="#FFF" opacity={0.65} transform="rotate(-24 -17 -27)" />
    </En>
  );
}

/** Vela que se consume (`gasto` 0-1): el cuerpo que se gasta para seguir adelante. La llama titila con `reloj`. */
export function Vela({ x = 0, y = 0, k = 1, o = 1, gasto = 0, reloj = 0 }: { x?: number; y?: number; k?: number; o?: number; gasto?: number; reloj?: number }) {
  const g = clamp(gasto), h = 280 * (1 - 0.72 * g);
  const f = 1 + 0.09 * Math.sin(reloj / 90) + 0.05 * Math.sin(reloj / 53), inc = Math.sin(reloj / 170) * 3;
  return (
    <En x={x} y={y} k={k} o={o}>
      <ellipse cx={0} cy={4} rx={96} ry={16} fill="#8E8070" /><ellipse cx={0} cy={0} rx={96} ry={14} fill="#B8A890" />
      <rect x={-48} y={-h} width={96} height={h} rx={14} fill="#D9C7A8" />
      <rect x={-48} y={-h} width={96} height={h} rx={14} fill="#F4E6CC" />
      <rect x={-38} y={-h + 6} width={20} height={h - 14} rx={10} fill="#FFFFFF" opacity={0.5} />
      <path d={`M-48,${-h + 14} q-10,26 0,44 q10,-18 0,-44 z`} fill="#F4E6CC" />
      <path d={`M48,${-h + 30} q12,40 0,62 q-12,-24 0,-62 z`} fill="#F4E6CC" />
      <rect x={-3.5} y={-h - 24} width={7} height={26} rx={3.5} fill="#3A2A2A" />
      <g transform={`translate(${inc.toFixed(1)},${-h - 26}) scale(${(1 / f).toFixed(3)},${f.toFixed(3)})`}>
        <path d="M0,-70 C34,-34 30,2 0,12 C-30,2 -34,-34 0,-70 Z" fill="#FF8A1E" />
        <path d="M0,-44 C18,-22 16,-2 0,6 C-16,-2 -18,-22 0,-44 Z" fill="#FFE066" />
      </g>
    </En>
  );
}
