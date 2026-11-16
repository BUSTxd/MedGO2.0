'use client';
// Escenas compartidas de los capítulos 8 a 11 de «Metabolismo de la bilirrubina» (la patología):
// grifos, depósito y tuberías de la metáfora de la bañera, el recién nacido de cuerpo entero (con el
// estilo del `Rostro` del capítulo 6), la incubadora y la lámpara, el hígado que cambia de color, las
// vías biliares con sus obstrucciones y el corte coronal del cerebro. Mismo estilo que `Piezas.tsx`:
// plano, saturado, sin contorno, tono oscuro de base + cuerpo claro + brillo, sombra en media luna y
// sin `filter`. Lienzo de 1600 × 1000.

import { useId, type ReactNode } from 'react';
import { B, En, Atomo, clamp, easeOut, hash, lerp, mezcla, tramo } from './Piezas';

type P2 = [number, number];
type Tono = readonly string[];

const METAL = ['#3E4A60', '#7F8DA8', '#C9D4E6', '#F2F6FC'] as const;
const sombra = B.sombra;

/** Punto de una poligonal (para que algo viaje por ella). */
export const porPuntos = (pts: P2[]) => (u: number): P2 => {
  const t = clamp(u) * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(t)), f = t - i;
  return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)];
};
export const linea = (pts: P2[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');

// ─── Grifo, llave, tubería y depósito (la metáfora de la bañera) ──────────────

/** Llave de cruz vista de frente: cuatro brazos con bola en la punta; `giro` en grados. */
function Cruceta({ giro, color }: { giro: number; color: Tono }) {
  return (
    <g transform={`rotate(${giro.toFixed(1)})`}>
      {[0, 90, 180, 270].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <rect x={-7} y={-46} width={14} height={40} rx={7} fill={color[0]} />
          <circle cy={-48} r={13} fill={color[0]} /><circle cx={-2} cy={-50} r={10} fill={color[1]} /><circle cx={-5} cy={-53} r={3.5} fill="#FFF" opacity={0.85} />
        </g>
      ))}
      <circle r={16} fill={color[0]} /><circle cx={-2} cy={-2} r={12} fill={color[1]} />
      <circle cx={-5} cy={-5} r={4} fill="#FFF" opacity={0.8} />
    </g>
  );
}

/** Grifo de pared: caño de metal con su cuello de cisne, llave de cruz arriba y el chorro de bilirrubina.
 *  `abre` 0-1 gira la llave y engrosa el chorro (0 = gotea). `largo`: hasta dónde cae el chorro.
 *  La salida del caño queda en (96, 92) locales. */
export function Grifo({ x, y, k = 1, o = 1, abre = 0.5, reloj = 0, largo = 260, llave = ['#B0123A', '#F0476A'] as Tono, chorro = B.bilirrubina as Tono }: { x: number; y: number; k?: number; o?: number; abre?: number; reloj?: number; largo?: number; llave?: Tono; chorro?: Tono }) {
  if (o <= 0.002) return null;
  const a = clamp(abre);
  const w = 6 + 30 * a;
  const sx = 96, sy = 100;
  // Bordes del chorro: ondulan con el reloj, se ensanchan un poco al caer.
  const n = 10;
  const izq = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, yy = sy + t * largo, ond = Math.sin(t * 9 - reloj / 90) * (1.5 + 3 * a) * t;
    return [sx - w / 2 - t * 4 * a + ond, yy] as P2;
  });
  const der = izq.map(([px, py], i) => [px + w + (i / n) * 8 * a, py] as P2).reverse();
  const cuerpoChorro = `${linea(izq)} ${der.map(([px, py]) => `L${px.toFixed(1)},${py.toFixed(1)}`).join(' ')} Z`;
  return (
    <En x={x} y={y} k={k} o={o}>
      {/* Chapa de la pared y tubo de entrada */}
      <rect x={-196} y={-30} width={60} height={60} rx={10} fill={METAL[0]} />
      <rect x={-188} y={-38} width={30} height={76} rx={14} fill={METAL[1]} />
      <rect x={-184} y={-32} width={8} height={56} rx={4} fill={METAL[3]} opacity={0.7} />
      {/* Cuerpo horizontal */}
      <rect x={-158} y={-26} width={190} height={56} rx={26} fill={METAL[0]} />
      <rect x={-158} y={-28} width={186} height={48} rx={22} fill={METAL[1]} />
      <rect x={-140} y={-20} width={150} height={9} rx={4.5} fill={METAL[3]} opacity={0.75} />
      {/* Cuello de cisne hasta la boquilla */}
      <path d={`M14,2 C70,2 ${sx},20 ${sx},${sy - 26}`} fill="none" stroke={METAL[0]} strokeWidth={48} strokeLinecap="round" />
      <path d={`M14,-2 C66,-2 ${sx - 4},16 ${sx - 4},${sy - 30}`} fill="none" stroke={METAL[1]} strokeWidth={36} strokeLinecap="round" />
      <path d={`M30,-12 C58,-12 ${sx - 12},2 ${sx - 14},${sy - 44}`} fill="none" stroke={METAL[3]} strokeWidth={7} strokeLinecap="round" opacity={0.7} />
      <rect x={sx - 30} y={sy - 28} width={60} height={26} rx={9} fill={METAL[0]} />
      <rect x={sx - 26} y={sy - 30} width={50} height={20} rx={8} fill={METAL[2]} />
      {/* Bonete, vástago y llave */}
      <rect x={-86} y={-66} width={58} height={42} rx={10} fill={METAL[0]} />
      <rect x={-86} y={-68} width={52} height={36} rx={9} fill={METAL[1]} />
      <rect x={-64} y={-98} width={14} height={36} rx={6} fill={METAL[0]} />
      <g transform="translate(-57,-108) scale(1,0.62)"><Cruceta giro={lerp(0, 270, easeOut(a)) + 45} color={llave} /></g>
      {/* Chorro, o gota a gota */}
      {a > 0.04 ? (
        <g>
          <path d={cuerpoChorro} fill={chorro[1]} opacity={0.95} />
          <path d={linea(izq.map(([px, py]) => [px + w * 0.25, py] as P2))} fill="none" stroke={chorro[2]} strokeWidth={Math.max(2, w * 0.18)} strokeLinecap="round" opacity={0.85} />
          {Array.from({ length: 5 }, (_, i) => {
            const u = (reloj / 700 + i / 5) % 1;
            return <circle key={i} cx={sx + Math.sin(i * 3.1) * w * 0.25} cy={sy + u * largo} r={2 + w * 0.12} fill="#FFF" opacity={0.55 * (1 - u)} />;
          })}
          {/* Salpicadura abajo */}
          {Array.from({ length: 6 }, (_, i) => {
            const u = (reloj / 520 + i / 6) % 1, dir = i % 2 ? 1 : -1;
            return <circle key={`s${i}`} cx={sx + dir * (10 + u * (30 + 40 * a)) * (0.6 + hash(i, 5))} cy={sy + largo - Math.sin(u * Math.PI) * (16 + 22 * a)} r={3 + 4 * a} fill={chorro[1]} opacity={1 - u} />;
          })}
        </g>
      ) : (
        Array.from({ length: 2 }, (_, i) => {
          const u = (reloj / 1300 + i / 2) % 1;
          return <path key={i} d="M0,-12 C6,-4 9,2 9,6 A9,9 0 0 1 -9,6 C-9,2 -6,-4 0,-12 Z" transform={`translate(${sx},${sy + 6 + u * u * largo})`} fill={chorro[1]} opacity={1 - tramo(u, 0.8, 1)} />;
        })
      )}
    </En>
  );
}

/** Llave de paso sobre una tubería horizontal: cuerpo hexagonal de bronce y volante de cuatro radios.
 *  `abre` 0-1 gira el volante. `roto` 0-1 lo tacha. Centro en (0, 0). */
export function Llave({ x, y, k = 1, o = 1, abre = 1, color = ['#7A2A9A', '#B05AE0'] as Tono, roto = 0 }: { x: number; y: number; k?: number; o?: number; abre?: number; color?: Tono; roto?: number }) {
  if (o <= 0.002) return null;
  const giro = lerp(0, 300, easeOut(clamp(abre)));
  return (
    <En x={x} y={y} k={k} o={o}>
      <ellipse cx={6} cy={58} rx={70} ry={10} fill={sombra} />
      <path d="M-52,-30 L52,-30 L66,0 L52,34 L-52,34 L-66,0 Z" fill="#9A6A10" />
      <path d="M-50,-32 L48,-32 L60,-4 L48,26 L-50,26 L-62,-4 Z" fill="#E0A82A" />
      <path d="M-40,-24 L36,-24" stroke="#FFE08A" strokeWidth={6} strokeLinecap="round" opacity={0.85} />
      <rect x={-14} y={-74} width={28} height={46} rx={8} fill="#9A6A10" />
      <rect x={-12} y={-76} width={22} height={42} rx={7} fill="#E0A82A" />
      <g transform="translate(0,-88) scale(1,0.5)">
        <g transform={`rotate(${giro.toFixed(1)})`}>
          <circle r={56} fill="none" stroke={color[0]} strokeWidth={16} />
          <circle r={56} fill="none" stroke={color[1]} strokeWidth={9} />
          {[0, 90, 180, 270].map((r) => <rect key={r} x={-5} y={-52} width={10} height={52} rx={5} fill={color[0]} transform={`rotate(${r})`} />)}
          <circle r={14} fill={color[0]} /><circle cx={-3} cy={-3} r={8} fill={color[1]} />
        </g>
      </g>
      {roto > 0.01 && <g opacity={clamp(roto)} stroke="#E3203F" strokeWidth={12} strokeLinecap="round"><path d="M-48,-60 L48,30" /><path d="M48,-60 L-48,30" /></g>}
    </En>
  );
}

/** Tubería de metal por una poligonal, con el líquido que corre dentro (`flujo` 0-1: cuánto pasa). */
export function Tubo({ pts, w = 46, reloj = 0, flujo = 1, tono = B.bilirrubina as Tono, o = 1, vel = 0.00012, sem = 1 }: { pts: P2[]; w?: number; reloj?: number; flujo?: number; tono?: Tono; o?: number; vel?: number; sem?: number }) {
  if (o <= 0.002) return null;
  const d = linea(pts);
  const f = clamp(flujo);
  const camino = porPuntos(pts);
  const n = Math.round(2 + 10 * f);
  return (
    <g opacity={o}>
      <path d={d} fill="none" stroke={sombra} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" transform="translate(7,9)" />
      <path d={d} fill="none" stroke={METAL[0]} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={METAL[1]} strokeWidth={w * 0.74} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={mezcla(METAL[1], tono[0], 0.25 + 0.5 * f)} strokeWidth={w * 0.42} strokeLinecap="round" strokeLinejoin="round" />
      {Array.from({ length: n }, (_, i) => {
        const u = (i / n + reloj * vel * (0.4 + 0.6 * f) + hash(i, sem) * 0.03) % 1;
        const [px, py] = camino(u);
        return <circle key={i} cx={px} cy={py} r={w * 0.17} fill={tono[1]} opacity={tramo(Math.min(u, 1 - u), 0, 0.05)} />;
      })}
      <path d={d} fill="none" stroke={METAL[3]} strokeWidth={w * 0.1} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} transform={`translate(0,${-w * 0.22})`} />
    </g>
  );
}

/** Depósito de vidrio (la sangre) con su nivel de bilirrubina: superficie que ondula, burbujas y marcas. Centro arriba en (x, y). */
export function Deposito({ x, y, w = 320, h = 360, nivel = 0.4, reloj = 0, o = 1, tono = B.bilirrubina as Tono, marca }: { x: number; y: number; w?: number; h?: number; nivel?: number; reloj?: number; o?: number; tono?: Tono; marca?: number }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  if (o <= 0.002) return null;
  const W = w / 2, top = y, bot = y + h;
  const yl = bot - 14 - (h - 40) * clamp(nivel);
  const ola = (dy: number) => Array.from({ length: 13 }, (_, i) => `L${(x - W + 14 + (i * (w - 28)) / 12).toFixed(1)},${(yl + dy + Math.sin(i * 1.1 + reloj / 380) * 6).toFixed(1)}`).join(' ');
  return (
    <g opacity={o}>
      <clipPath id={`dep-${id}`}><rect x={x - W + 12} y={top} width={w - 24} height={h - 12} rx={40} /></clipPath>
      <rect x={x - W + 10} y={top + 12} width={w} height={h} rx={48} fill={sombra} />
      <rect x={x - W} y={top} width={w} height={h} rx={48} fill="#BFD8EA" opacity={0.55} />
      <g clipPath={`url(#dep-${id})`}>
        <path d={`M${x - W},${bot} L${x - W + 14},${yl} ${ola(0)} L${x + W},${bot} Z`} fill={tono[0]} />
        <path d={`M${x - W},${bot} L${x - W + 14},${yl + 8} ${ola(8)} L${x + W},${bot} Z`} fill={tono[1]} />
        {Array.from({ length: 7 }, (_, i) => {
          const u = (reloj / 2200 + hash(i, 9)) % 1;
          return <circle key={i} cx={x - W + 40 + hash(i, 8) * (w - 80)} cy={lerp(bot - 20, yl + 14, u)} r={4 + hash(i, 7) * 6} fill={tono[2]} opacity={0.7 * (1 - u)} />;
        })}
      </g>
      {/* Marcas de nivel y la raya del «normal» */}
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={x + W - 46} y={bot - 40 - i * ((h - 80) / 5)} width={i % 5 ? 18 : 30} height={5} rx={2.5} fill="#5A7A96" opacity={0.6} />)}
      {marca !== undefined && <path d={`M${x - W - 16},${bot - 14 - (h - 40) * marca} L${x + W + 16},${bot - 14 - (h - 40) * marca}`} stroke="#18A34A" strokeWidth={6} strokeDasharray="14 10" strokeLinecap="round" />}
      <rect x={x - W + 22} y={top + 30} width={16} height={h - 70} rx={8} fill="#FFFFFF" opacity={0.6} />
      <rect x={x - W - 8} y={top - 10} width={w + 16} height={24} rx={12} fill="#5A7A96" />
      <rect x={x - W - 8} y={top - 12} width={w + 10} height={16} rx={8} fill="#8FB0CC" />
    </g>
  );
}

// ─── Recién nacido, incubadora y lámpara ──────────────────────────────────────

const PIEL_BEBE = ['#C86A5A', '#F2B0A0', '#FFDCCB'];
const PIEL_ICT = ['#B98612', '#F2CE48', '#FFF1A6'];

/** Cara del recién nacido (derecha, centrada en 0,0): la del `Rostro` del capítulo 6 con gorrito, mejillas y mechón. */
function CaraBebe({ piel, ojos, llora, antifaz, gorro, reloj, dormido }: { piel: string[]; ojos: number; llora: number; antifaz: number; gorro: boolean; reloj: number; dormido: boolean }) {
  const parpadeo = !dormido && (reloj % 3800) < 140 ? 0.15 : 1;
  const ll = clamp(llora);
  return (
    <g>
      <circle cx={-80} cy={10} r={17} fill={piel[1]} /><circle cx={80} cy={10} r={17} fill={piel[1]} />
      <circle cx={-78} cy={10} r={8} fill={piel[0]} /><circle cx={78} cy={10} r={8} fill={piel[0]} />
      <circle r={82} fill={piel[0]} />
      <circle cx={-4} cy={-5} r={77} fill={piel[1]} />
      <path d="M-56,-40 Q-44,-64 -14,-70" fill="none" stroke={piel[2]} strokeWidth={10} strokeLinecap="round" opacity={0.75} />
      {gorro ? (
        <g>
          {/* Cúpula algo mayor que la cabeza (r 82): la tapa entera, sin que asome la piel */}
          <path d="M-90,-18 A92,92 0 0 1 90,-18 C46,-40 -46,-40 -90,-18 Z" fill="#4A84D0" />
          <path d="M-86,-20 A86,86 0 0 1 80,-30 C40,-44 -40,-44 -86,-20 Z" fill="#7FB8F0" />
          {[-56, -26, 4, 34, 62].map((xx) => <path key={xx} d={`M${xx},${-80 + Math.abs(xx) * 0.32} L${xx + 6},-42`} stroke="#A8D2FF" strokeWidth={5} strokeLinecap="round" opacity={0.75} />)}
          {/* Vuelta tejida del borde */}
          <path d="M-92,-20 C-46,-44 46,-44 92,-20 L92,0 C46,-24 -46,-24 -92,0 Z" fill="#3A6EC0" />
          <path d="M-92,-16 C-46,-40 46,-40 92,-16" fill="none" stroke="#7FB8F0" strokeWidth={4} opacity={0.8} />
          {[-70, -42, -14, 14, 42, 70].map((xx) => <path key={`v${xx}`} d={`M${xx},${-26 - (1 - (xx / 92) ** 2) * 14} l0,14`} stroke="#5A8ADA" strokeWidth={4} strokeLinecap="round" />)}
          <path d="M-50,-62 Q-34,-76 -10,-80" fill="none" stroke="#C8E2FF" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
          <circle cy={-100} r={17} fill="#DDE8F6" /><circle cx={-3} cy={-103} r={14} fill="#FFFFFF" /><circle cx={-7} cy={-107} r={5} fill="#E6F2FF" />
        </g>
      ) : (
        <path d="M-8,-78 C-18,-98 4,-112 20,-100 C10,-98 6,-90 10,-82" fill="none" stroke="#5A3A1A" strokeWidth={7} strokeLinecap="round" />
      )}
      {/* Cejas finitas (con gorro quedan bajo la vuelta) */}
      {!gorro && <path d={`M-48,${-24 - ll * 4} Q-34,${-32 + ll * 4} -20,${-26 + ll * 6}`} fill="none" stroke="#7A4A2A" strokeWidth={4} strokeLinecap="round" />}
      {!gorro && <path d={`M20,${-26 + ll * 6} Q34,${-32 + ll * 4} 48,${-24 - ll * 4}`} fill="none" stroke="#7A4A2A" strokeWidth={4} strokeLinecap="round" />}
      {/* Ojos: dormido (arcos), abiertos (macizos) o apretados al llorar */}
      {antifaz > 0.01 ? (
        <g opacity={clamp(antifaz)}>
          <path d="M-84,-8 L84,-8" stroke="#2A3A7A" strokeWidth={14} />
          <rect x={-66} y={-22} width={132} height={36} rx={18} fill="#1E2A60" />
          <rect x={-58} y={-18} width={56} height={26} rx={13} fill="#34478E" /><rect x={2} y={-18} width={56} height={26} rx={13} fill="#34478E" />
          <path d="M-50,-12 L-20,-12" stroke="#7F95E0" strokeWidth={4} strokeLinecap="round" />
        </g>
      ) : ll > 0.4 ? (
        <g stroke="#3A1250" strokeWidth={6} strokeLinecap="round" fill="none"><path d="M-48,-8 L-26,0 L-48,8" /><path d="M48,-8 L26,0 L48,8" /></g>
      ) : ojos > 0.5 ? (
        [-34, 34].map((ex) => <g key={ex}><ellipse cx={ex} cy={-2} rx={11} ry={11 * parpadeo} fill="#3A1250" /><circle cx={ex - 3} cy={-6} r={3.5} fill="#FFF" opacity={parpadeo > 0.5 ? 1 : 0} /></g>)
      ) : (
        <g stroke="#3A1250" strokeWidth={5} strokeLinecap="round" fill="none"><path d="M-48,-2 Q-34,10 -20,-2" /><path d="M20,-2 Q34,10 48,-2" /></g>
      )}
      {[-50, 50].map((ex) => <ellipse key={ex} cx={ex} cy={28} rx={15} ry={11} fill="#FF7E9E" opacity={0.5} />)}
      <ellipse cx={0} cy={20} rx={9} ry={7} fill={piel[0]} />
      {ll > 0.4
        ? <g><ellipse cx={0} cy={48} rx={16 + 6 * ll} ry={13 + 6 * ll} fill="#6A1A3A" /><ellipse cx={0} cy={56 + 3 * ll} rx={10} ry={5} fill="#FF7E9E" /></g>
        : <path d="M-12,44 Q0,52 12,44" fill="none" stroke={piel[0]} strokeWidth={5} strokeLinecap="round" />}
    </g>
  );
}

/** Recién nacido acostado de lado (cabeza a la izquierda, cara al frente), de cuerpo entero.
 *  `amarillo` 0-1 tiñe la piel; `flojo` 0-1 lo deja con brazos y piernas abiertos y caídos (hipotonía);
 *  `arco` 0-1 lo arquea hacia atrás con la cabeza extendida (opistótonos); `llora` 0-1 abre la boca;
 *  `antifaz` le pone el antifaz de la fototerapia; sin `ropa` queda solo con el pañal. Ocupa x −270…340. */
export function Bebe({ x = 0, y = 0, k = 1, o = 1, amarillo = 0, flojo = 0, arco = 0, llora = 0, ojos = 0, antifaz = 0, ropa = true, reloj = 0, cateter = 0 }: { x?: number; y?: number; k?: number; o?: number; amarillo?: number; flojo?: number; arco?: number; llora?: number; ojos?: number; antifaz?: number; ropa?: boolean; reloj?: number; cateter?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  if (o <= 0.002) return null;
  const am = clamp(amarillo), f = clamp(flojo), a = clamp(arco);
  const piel = [0, 1, 2].map((i) => mezcla(PIEL_BEBE[i], PIEL_ICT[i], am));
  const resp = Math.sin(reloj / 650) * 3 * (1 - 0.7 * a);
  const tiembla = a > 0.3 ? Math.sin(reloj / 55) * 2 * a : 0;
  // Pose de cada miembro: normal (flexionado), flojo (abierto y caído), arco (extendido y rígido).
  const pose = (n: P2, fl: P2, ar: P2): P2 => [lerp(lerp(n[0], fl[0], f), ar[0], a), lerp(lerp(n[1], fl[1], f), ar[1], a)];
  const lomo = -70 * a; // el tronco se levanta por el medio
  const cab: P2 = [-200 + 12 * a, lerp(-8, 30, a)];
  const giroCab = -78 + lerp(0, -38, a) + 10 * f;
  const ropaT = ['#3F6FD0', '#7FA8F0', '#B8D2FF'];
  const miembro = (pts: P2[], ancho: number, key: string) => (
    <g key={key}>
      <path d={linea(pts)} fill="none" stroke={piel[0]} strokeWidth={ancho} strokeLinecap="round" strokeLinejoin="round" />
      <path d={linea(pts)} fill="none" stroke={piel[1]} strokeWidth={ancho - 9} strokeLinecap="round" strokeLinejoin="round" transform="translate(-2,-2)" />
    </g>
  );
  const brazo = (s: number) => {
    const hombro: P2 = [-74, s * 46 + lomo * 0.35];
    const codo = pose([-10, s * 104], [-70, s * 150], [10, s * 70]);
    const mano = pose([-96, s * 96], [-60, s * 214], [86, s * 86]);
    return { pts: [hombro, codo, mano] as P2[], mano };
  };
  const pierna = (s: number) => {
    const cadera: P2 = [128, s * 40 + lomo * 0.2];
    const rodilla = pose([214, s * 92], [196, s * 150], [236, s * 44]);
    const pie = pose([168, s * 140], [282, s * 182], [344, s * 52]);
    return { pts: [cadera, rodilla, pie] as P2[], pie };
  };
  // Espina del tronco (cuadrática de la cadera al hombro): puntos y normales; el contorno sale de ahí.
  const h = 70 + resp * 0.5;
  const espina = Array.from({ length: 15 }, (_, i) => {
    const t = i / 14, mt = 1 - t;
    const sx = mt * mt * -92 + 2 * mt * t * 30 + t * t * 150, sy = 2 * mt * t * lomo * 2;
    const dx = 2 * mt * (30 + 92) + 2 * t * (150 - 30), dy = 2 * mt * lomo * 2 - 2 * t * lomo * 2;
    const L = Math.hypot(dx, dy) || 1;
    return [sx, sy, dy / L, -dx / L] as [number, number, number, number];
  });
  const arriba = espina.map(([sx, sy, nx, ny]) => [sx + nx * h, sy + ny * h] as P2);
  const abajo = espina.map(([sx, sy, nx, ny]) => [sx - nx * h, sy - ny * h] as P2).reverse();
  const troncoD = `${linea(arriba)} A${h},${h} 0 0 1 ${abajo[0][0].toFixed(1)},${abajo[0][1].toFixed(1)} ${abajo.slice(1).map(([px, py]) => `L${px.toFixed(1)},${py.toFixed(1)}`).join(" ")} A${h},${h} 0 0 1 ${arriba[0][0].toFixed(1)},${arriba[0][1].toFixed(1)} Z`;
  const cintura: P2 = [espina[10][0], espina[10][1]];
  const giroCintura = (Math.atan2(espina[10][2], -espina[10][3]) * 180) / Math.PI;
  return (
    <En x={x} y={y + resp * 0.3} k={k} o={o}>
      <g transform={`translate(${tiembla},0)`}>
        {/* Miembros de atrás (lado de arriba) */}
        {(() => { const b = brazo(-1); return <g>{miembro(b.pts, 40, 'ba')}<circle cx={b.mano[0]} cy={b.mano[1]} r={19} fill={piel[0]} /><circle cx={b.mano[0] - 2} cy={b.mano[1] - 2} r={15} fill={piel[1]} /></g>; })()}
        {(() => { const l = pierna(-1); return <g>{miembro(l.pts, 48, 'pa')}<ellipse cx={l.pie[0] + 6} cy={l.pie[1]} rx={26} ry={17} fill={piel[0]} /><ellipse cx={l.pie[0] + 4} cy={l.pie[1] - 2} rx={21} ry={13} fill={piel[1]} /></g>; })()}
        {/* Tronco: una sola forma rellena (body o piel). El pañal, su cintura, las cintas y los broches se recortan
            con esa misma forma, así que respiran y se arquean juntos: nada se desfasa. */}
        <clipPath id={`bebe-tronco-${uid}`}><path d={troncoD} /></clipPath>
        <path d={troncoD} fill={sombra} transform="translate(6,9)" />
        <path d={troncoD} fill={ropa ? ropaT[0] : piel[0]} />
        <g clipPath={`url(#bebe-tronco-${uid})`}>
          <path d={troncoD} fill={ropa ? ropaT[1] : piel[1]} transform="translate(-4,-7)" />
          {/* Brillo a lo largo del lomo de arriba */}
          <path d={linea(espina.slice(2, 9).map(([sx, sy, nx, ny]) => [sx + nx * (h - 20), sy + ny * (h - 20)] as P2))} fill="none" stroke={ropa ? ropaT[2] : piel[2]} strokeWidth={9} strokeLinecap="round" opacity={0.6} />
          {/* Pañal: todo lo que queda a la derecha de la cintura */}
          <path d={`M${cintura[0] - 8},-200 L400,-200 L400,200 L${cintura[0] - 8},200 Z`} fill="#F4F7FC" transform={`rotate(${giroCintura} ${cintura[0]} ${cintura[1]})`} />
          <path d={`M${cintura[0] + 40},-200 L400,-200 L400,200 L${cintura[0] + 40},200 Z`} fill="#FFFFFF" transform={`rotate(${giroCintura} ${cintura[0]} ${cintura[1]})`} opacity={0.9} />
          <rect x={cintura[0] - 8} y={-200} width={16} height={400} fill="#D3DEEE" transform={`rotate(${giroCintura} ${cintura[0]} ${cintura[1]})`} />
          {/* Sombra en media luna del pañal, abajo */}
          <path d={linea(espina.slice(10).map(([sx, sy, nx, ny]) => [sx - nx * (h - 6), sy - ny * (h - 6)] as P2))} fill="none" stroke="#C9D6EA" strokeWidth={16} strokeLinecap="round" />
          {/* Cintas del pañal, arriba y abajo */}
          {[1, -1].map((s) => {
            const [sx, sy] = espina[11];
            return <rect key={s} x={-16} y={-s * (h - 20) - 11} width={32} height={22} rx={8} fill="#7FC4F5" transform={`translate(${sx},${sy}) rotate(${giroCintura})`} />;
          })}
          {/* Broches del body sobre la línea del medio */}
          {ropa && [3, 5, 7].map((i) => <circle key={i} cx={espina[i][0]} cy={espina[i][1] - 34} r={7} fill={ropaT[2]} opacity={0.85} />)}
          {!ropa && <ellipse cx={espina[6][0]} cy={espina[6][1] + 6} rx={10} ry={8} fill={piel[0]} opacity={0.7} />}
        </g>
        {cateter > 0.01 && <g opacity={clamp(cateter)}><circle cx={espina[6][0]} cy={espina[6][1] + 8} r={12} fill="#FFFFFF" /><circle cx={espina[6][0]} cy={espina[6][1] + 8} r={6} fill="#C8123A" /></g>}
        {/* Miembros de delante (lado de abajo) */}
        {(() => { const l = pierna(1); return <g>{miembro(l.pts, 50, 'pd')}<ellipse cx={l.pie[0] + 6} cy={l.pie[1]} rx={27} ry={18} fill={piel[0]} /><ellipse cx={l.pie[0] + 4} cy={l.pie[1] - 2} rx={22} ry={14} fill={piel[1]} /></g>; })()}
        {(() => { const b = brazo(1); return <g>{miembro(b.pts, 42, 'bd')}<circle cx={b.mano[0]} cy={b.mano[1]} r={20} fill={piel[0]} /><circle cx={b.mano[0] - 2} cy={b.mano[1] - 2} r={16} fill={piel[1]} /></g>; })()}
        {ropa && <g><circle cx={-74} cy={-46 + lomo * 0.35} r={28} fill={ropaT[1]} /><circle cx={-74} cy={46 + lomo * 0.35} r={30} fill={ropaT[1]} /></g>}
        {/* Cabeza */}
        <g transform={`translate(${cab[0]},${cab[1]}) rotate(${giroCab.toFixed(1)}) scale(1.28)`}>
          <CaraBebe piel={piel} ojos={ojos} llora={llora} antifaz={antifaz} gorro={ropa && antifaz < 0.5} reloj={reloj} dormido={ojos < 0.5} />
        </g>
        {/* Llanto agudo: ondas que salen de la boca */}
        {llora > 0.4 && [0, 1, 2].map((i) => {
          const u = (reloj / 500 + i / 3) % 1;
          return <path key={i} d={`M${cab[0] + 70 + u * 70},${cab[1] - 60 - u * 40} q18,22 0,44`} fill="none" stroke="#E3203F" strokeWidth={6} strokeLinecap="round" opacity={(1 - u) * clamp(llora)} transform={`rotate(-30 ${cab[0] + 70} ${cab[1] - 60})`} />;
        })}
      </g>
    </En>
  );
}

/**
 * Retrato del recién nacido para la portada de los casos clínicos («Recién nacido»): de frente,
 * envuelto en su manta y con la piel algo amarilla. Copia las referencias de BUST «paciente calvo
 * preocupado» y «hombre adulto»: cabeza grande, sombra en media luna de un solo tono, iris violeta
 * con la pupila oscura arriba, brillos en pastilla, orejas con media luna interior y la manta
 * turquesa con su lado oscuro. Centrado en el origen; ocupa unos 300 × 380.
 */
export function BebeRetrato({ amarillo = 0.55 }: { amarillo?: number }) {
  const piel = [0, 1, 2].map((i) => mezcla(PIEL_BEBE[i], PIEL_ICT[i], clamp(amarillo)));
  const manta = ['#0B6E78', '#2FB3AC', '#8FE3DA'];
  return (
    <g>
      <ellipse cx={0} cy={252} rx={140} ry={17} fill={sombra} />
      {/* La manta entera: capucha alrededor de la cara y un fardo que se estrecha hacia los pies.
          El tono claro corrido a la izquierda deja la media luna de sombra a la derecha. */}
      <path d="M0,-176 C116,-176 156,-82 146,24 C138,134 84,234 0,240 C-84,234 -138,134 -146,24 C-156,-82 -116,-176 0,-176 Z" fill={manta[0]} />
      <path d="M-8,-170 C100,-170 138,-82 130,20 C122,124 74,220 -6,226 C-82,220 -132,128 -140,22 C-148,-80 -112,-170 -8,-170 Z" fill={manta[1]} />
      <path d="M-104,-120 Q-82,-148 -46,-158" fill="none" stroke={manta[2]} strokeWidth={14} strokeLinecap="round" opacity={0.75} />
      {/* El borde de la capucha, por detrás de la cara */}
      <circle cx={0} cy={-40} r={106} fill={manta[0]} />
      {/* Cabeza: tono oscuro debajo y el claro corrido a la izquierda = media luna de sombra a la derecha */}
      <circle cx={0} cy={-40} r={94} fill={piel[0]} />
      <circle cx={-10} cy={-45} r={85} fill={piel[1]} />
      {/* Brillos en pastilla, como la referencia */}
      <path d="M-56,-100 L-32,-114" stroke={piel[2]} strokeWidth={15} strokeLinecap="round" opacity={0.85} />
      <path d="M-70,-72 L-67,-62" stroke={piel[2]} strokeWidth={11} strokeLinecap="round" opacity={0.7} />
      {/* Rizo de pelo en la frente */}
      <path d="M-10,-118 C-24,-142 8,-156 22,-136 C10,-138 4,-130 8,-120" fill="none" stroke="#4A2A16" strokeWidth={8} strokeLinecap="round" />
      {/* Cejas finitas, un poco levantadas */}
      <path d="M-62,-80 Q-46,-90 -28,-82" fill="none" stroke={piel[0]} strokeWidth={7} strokeLinecap="round" />
      <path d="M22,-82 Q40,-90 56,-80" fill="none" stroke={piel[0]} strokeWidth={7} strokeLinecap="round" />
      {/* Ojos: iris violeta y pupila oscura mirando arriba */}
      {[-44, 40].map((ex) => (
        <g key={ex}>
          <circle cx={ex} cy={-48} r={19} fill="#B44CF0" />
          <circle cx={ex + 4} cy={-53} r={12} fill="#4E0D66" />
          <circle cx={ex + 8} cy={-57} r={4} fill="#FFFFFF" opacity={0.9} />
        </g>
      ))}
      {/* Mejillas, nariz y boca */}
      {[-70, 64].map((cx) => <ellipse key={cx} cx={cx} cy={-8} rx={20} ry={13} fill="#FF6F92" opacity={0.42} />)}
      <ellipse cx={-2} cy={-18} rx={12} ry={9} fill={piel[0]} />
      <ellipse cx={-2} cy={14} rx={14} ry={10} fill="#A8155A" />
      <ellipse cx={-2} cy={19} rx={8} ry={4} fill="#FF8FB0" />
      {/* La solapa que cruza el pecho, de la izquierda a la derecha, con su canto claro */}
      <path d="M-138,40 C-70,72 40,52 140,6 C142,40 140,64 136,84 C60,120 -40,138 -126,116 C-132,92 -136,66 -138,40 Z" fill={manta[0]} opacity={0.5} />
      <path d="M-138,40 C-70,72 40,52 140,6" fill="none" stroke={manta[2]} strokeWidth={9} strokeLinecap="round" opacity={0.85} />
      {/* La otra solapa, de abajo, y un puñito que asoma por el borde */}
      <path d="M118,120 C60,170 -10,196 -70,204" fill="none" stroke={manta[0]} strokeWidth={8} strokeLinecap="round" opacity={0.55} />
      <circle cx={46} cy={66} r={21} fill={piel[0]} /><circle cx={43} cy={63} r={17} fill={piel[1]} />
      <path d="M35,57 Q43,53 51,57" fill="none" stroke={piel[0]} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

/** Incubadora: cúpula transparente con dos ventanillas, colchón y base con ruedas. Colchón a y = 0; ocupa x ±330. */
export function Incubadora({ x, y, k = 1, o = 1, children, luz = 0 }: { x: number; y: number; k?: number; o?: number; children?: ReactNode; luz?: number }) {
  if (o <= 0.002) return null;
  return (
    <En x={x} y={y} k={k} o={o}>
      <ellipse cx={10} cy={330} rx={330} ry={22} fill={sombra} />
      {/* Cúpula, de fondo */}
      <path d="M-320,30 L-320,-150 Q-320,-250 -220,-250 L220,-250 Q320,-250 320,-150 L320,30 Z" fill="#9FD0F0" opacity={0.22} />
      {luz > 0.01 && <path d="M-300,30 L-300,-150 Q-300,-232 -220,-232 L220,-232 Q300,-232 300,-150 L300,30 Z" fill="#4F8BFF" opacity={0.16 * clamp(luz)} />}
      {/* Colchón */}
      <rect x={-300} y={20} width={600} height={56} rx={26} fill="#C9B8F0" />
      <rect x={-300} y={14} width={596} height={44} rx={22} fill="#EDE6FF" />
      {children}
      {/* Cúpula, por delante: reflejos y ventanillas */}
      <path d="M-320,30 L-320,-150 Q-320,-250 -220,-250 L220,-250 Q320,-250 320,-150 L320,30" fill="none" stroke="#7FB8E0" strokeWidth={10} strokeLinejoin="round" opacity={0.85} />
      <path d="M-290,-120 Q-288,-216 -200,-224" fill="none" stroke="#FFFFFF" strokeWidth={12} strokeLinecap="round" opacity={0.55} />
      <path d="M150,-224 L230,-224" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.45} />
      {[-200, 200].map((cx) => <g key={cx}><circle cx={cx} cy={-60} r={42} fill="none" stroke="#7FB8E0" strokeWidth={8} opacity={0.8} /><circle cx={cx} cy={-60} r={42} fill="#FFFFFF" opacity={0.08} /></g>)}
      {/* Base */}
      <rect x={-330} y={74} width={660} height={130} rx={30} fill="#6A4AB0" />
      <rect x={-330} y={70} width={652} height={118} rx={28} fill="#8C6AD8" />
      <rect x={-130} y={104} width={260} height={56} rx={12} fill="#6A4AB0" />
      <rect x={-118} y={114} width={130} height={10} rx={5} fill="#C9B8F0" /><rect x={-118} y={134} width={90} height={10} rx={5} fill="#C9B8F0" />
      <circle cx={80} cy={130} r={14} fill="#46E07A" />
      <rect x={-270} y={200} width={26} height={100} rx={10} fill="#5A6478" /><rect x={244} y={200} width={26} height={100} rx={10} fill="#5A6478" />
      {[-257, 257].map((cx) => <g key={cx}><circle cx={cx} cy={306} r={22} fill="#2A1250" /><circle cx={cx} cy={306} r={8} fill="#B79BFF" /></g>)}
    </En>
  );
}

/** Lámpara de fototerapia: cabezal con su fila de LED azules y un cono de luz que baña lo de abajo. Cabezal en (0, 0). */
export function LamparaFoto({ x, y, k = 1, o = 1, luz = 1, reloj = 0, alto = 330, ancho = 300 }: { x: number; y: number; k?: number; o?: number; luz?: number; reloj?: number; alto?: number; ancho?: number }) {
  if (o <= 0.002) return null;
  const l = clamp(luz);
  return (
    <En x={x} y={y} k={k} o={o}>
      {l > 0.01 && (
        <g>
          <path d={`M-170,30 L170,30 L${ancho},${alto} L${-ancho},${alto} Z`} fill="#4F8BFF" opacity={0.18 * l} />
          <path d={`M-120,30 L120,30 L${ancho * 0.66},${alto} L${-ancho * 0.66},${alto} Z`} fill="#7FB0FF" opacity={0.18 * l} />
          {Array.from({ length: 6 }, (_, i) => {
            const u = (reloj / 1600 + i / 6) % 1, x0 = -150 + i * 60;
            return <circle key={i} cx={lerp(x0, x0 * (ancho / 160), u)} cy={lerp(40, alto, u)} r={5} fill="#BFD6FF" opacity={l * Math.sin(u * Math.PI) * 0.9} />;
          })}
        </g>
      )}
      <rect x={-14} y={-260} width={28} height={230} rx={12} fill="#5A6478" />
      <rect x={-8} y={-256} width={8} height={220} rx={4} fill="#9AA8BC" />
      <rect x={-200} y={-40} width={400} height={78} rx={30} fill="#2A3A7A" />
      <rect x={-200} y={-46} width={392} height={66} rx={28} fill="#3F56A8" />
      <rect x={-176} y={10} width={352} height={24} rx={12} fill="#1A2450" />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-152 + i * 38} cy={22} r={9} fill={mezcla('#2A3A7A', '#9CC4FF', l)} />)}
      <rect x={-180} y={-34} width={150} height={10} rx={5} fill="#8FA8F0" opacity={0.6} />
    </En>
  );
}

// ─── Hígado y vías biliares ───────────────────────────────────────────────────

const HIGADO = 'M-300,-60 C-250,-190 -50,-215 120,-180 C240,-155 330,-130 330,-70 C330,10 190,70 80,110 C-10,145 -140,190 -205,135 C-280,75 -335,0 -300,-60 Z';
export const TONO_HIGADO = {
  normal: ['#7E2A1E', '#A8432E', '#CC6A4E', '#F2B9A0'],
  negro: ['#140C18', '#2E2034', '#4A3A52', '#8A7A96'],
  colestasis: ['#5E5A10', '#8E8A22', '#B8B440', '#E6E2A0'],
  inflamado: ['#8A1A1A', '#C8382E', '#E8705A', '#FFC0A8'],
} as const;

/** Hígado de frente con sus dos lóbulos, el ligamento falciforme y el brillo. `tono` cambia el color;
 *  `granos` 0-1 le pone pigmento oscuro en grumos; `nodulos` 0-1 lo vuelve cirrótico; `focos` 0-1 manchas inflamadas. Ocupa x ±330, y −210…170. */
export function HigadoB({ x = 0, y = 0, k = 1, o = 1, tono = TONO_HIGADO.normal as Tono, granos = 0, nodulos = 0, focos = 0, reloj = 0 }: { x?: number; y?: number; k?: number; o?: number; tono?: Tono; granos?: number; nodulos?: number; focos?: number; reloj?: number }) {
  if (o <= 0.002) return null;
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d={HIGADO} fill={sombra} transform="translate(12,16)" />
      <path d={HIGADO} fill={tono[0]} />
      <path d={HIGADO} fill={tono[1]} transform="translate(-6,-8) scale(0.965)" />
      {/* Media luna de sombra abajo */}
      <path d="M-205,135 C-140,190 -10,145 80,110 C190,70 330,10 330,-70 C300,-10 180,40 60,70 C-40,100 -150,130 -205,135 Z" fill={tono[0]} opacity={0.55} />
      {/* Ligamento falciforme: separa el lóbulo derecho (grande) del izquierdo */}
      <path d="M96,-182 C66,-90 46,-20 70,104" fill="none" stroke={tono[0]} strokeWidth={9} strokeLinecap="round" />
      <path d="M-262,-74 C-214,-156 -90,-186 30,-172" fill="none" stroke={tono[3]} strokeWidth={15} strokeLinecap="round" opacity={0.55} />
      <path d="M150,-160 C220,-146 290,-124 304,-90" fill="none" stroke={tono[3]} strokeWidth={9} strokeLinecap="round" opacity={0.4} />
      {nodulos > 0.01 && Array.from({ length: 26 }, (_, i) => {
        const cx = -250 + hash(i, 61) * 520, cy = -140 + hash(i, 62) * 230;
        const dentro = cy < 120 - (cx + 250) * 0.18 && cy > -170 + Math.abs(cx) * 0.05;
        return dentro ? <g key={i} opacity={clamp(nodulos)}><circle cx={cx + 4} cy={cy + 4} r={16 + hash(i, 63) * 10} fill={tono[0]} /><circle cx={cx} cy={cy} r={14 + hash(i, 63) * 9} fill={tono[2]} /></g> : null;
      })}
      {granos > 0.01 && Array.from({ length: 34 }, (_, i) => {
        const cx = -240 + hash(i, 71) * 500, cy = -130 + hash(i, 72) * 210;
        const dentro = cy < 110 - (cx + 250) * 0.18;
        return dentro ? <circle key={i} cx={cx} cy={cy} r={4 + hash(i, 73) * 7} fill="#0A0610" opacity={clamp(granos) * 0.8} /> : null;
      })}
      {focos > 0.01 && [[-170, -40], [-60, 30], [20, -110], [180, -80], [-120, 80], [240, -30]].map(([cx, cy], i) => {
        const late = 1 + Math.sin(reloj / 400 + i) * 0.1;
        return <g key={i} opacity={tramo(focos, i * 0.1, 0.5 + i * 0.1)}><circle cx={cx} cy={cy} r={30 * late} fill="#FF5A4A" opacity={0.35} /><circle cx={cx} cy={cy} r={15} fill="#E3203F" /></g>;
      })}
    </En>
  );
}

/** Vesícula biliar (fondo abajo, cuello arriba hacia el cístico) con piedras o sin ellas. `grande` la distiende.
 *  `piedras`: lista de [x, y, r]; `tonoPiedra` negro o pardo. Centro en (0,0); fondo hacia +y. */
export function VesiculaB({ x = 0, y = 0, k = 1, o = 1, r = 0, grande = 0, piedras = [], tonoPiedra = ['#120A16', '#2E2234'] as Tono, bilis = B.bilis as Tono, reloj = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; grande?: number; piedras?: [number, number, number][]; tonoPiedra?: Tono; bilis?: Tono; reloj?: number }) {
  if (o <= 0.002) return null;
  const g = 1 + 0.5 * easeOut(clamp(grande));
  const late = 1 + Math.sin(reloj / 900) * 0.015;
  const d = 'M0,-100 C-30,-100 -78,-40 -78,40 C-78,110 -40,140 0,140 C40,140 78,110 78,40 C78,-40 30,-100 0,-100 Z';
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <g transform={`scale(${(g * late).toFixed(3)})`}>
        <path d={d} fill={sombra} transform="translate(8,10)" />
        <path d={d} fill={bilis[0]} />
        <path d={d} fill={bilis[1]} transform="translate(-4,-5) scale(0.93)" />
        <path d="M-50,-10 Q-58,40 -40,86" fill="none" stroke={bilis[2]} strokeWidth={10} strokeLinecap="round" opacity={0.7} />
        {piedras.map(([px, py, pr], i) => <Piedra key={i} x={px} y={py} R={pr} tono={tonoPiedra} sem={i} />)}
      </g>
    </En>
  );
}

/** Piedra (cálculo) facetada: polígono irregular con su cara clara y un brillo. */
export function Piedra({ x = 0, y = 0, R = 20, tono, sem = 1, o = 1, rot = 0 }: { x?: number; y?: number; R?: number; tono: Tono; sem?: number; o?: number; rot?: number }) {
  if (o <= 0.002) return null;
  const n = 7;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + hash(sem, 3), r = R * (0.8 + 0.35 * hash(i, sem + 11));
    return [Math.cos(a) * r, Math.sin(a) * r] as P2;
  });
  const d = `${linea(pts)} Z`;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`} opacity={o}>
      <path d={d} fill={sombra} transform={`translate(${R * 0.18},${R * 0.22})`} />
      <path d={d} fill={tono[0]} />
      <path d={d} fill={tono[1]} transform={`translate(${-R * 0.1},${-R * 0.12}) scale(0.8)`} />
      <circle cx={-R * 0.35} cy={-R * 0.35} r={R * 0.16} fill="#FFFFFF" opacity={0.45} />
    </g>
  );
}

/** Conducto biliar dibujado por un camino SVG: pared verde oscura, luz verde y brillo. `p` lo traza. */
export function Conducto({ d, w, p = 1, o = 1, tono = B.bilis as Tono }: { d: string; w: number; p?: number; o?: number; tono?: Tono }) {
  if (o <= 0.002) return null;
  const da = `${easeOut(clamp(p)) * 1400} 1600`;
  return (
    <g opacity={o} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={sombra} strokeWidth={w} strokeDasharray={da} transform="translate(5,7)" />
      <path d={d} stroke={tono[0]} strokeWidth={w} strokeDasharray={da} />
      <path d={d} stroke={tono[1]} strokeWidth={w * 0.62} strokeDasharray={da} />
      <path d={d} stroke={tono[2]} strokeWidth={w * 0.14} strokeDasharray={da} opacity={0.8} transform={`translate(${-w * 0.14},${-w * 0.1})`} />
    </g>
  );
}

// Vías biliares de frente (las del capítulo 5): hígado arriba a la izquierda, hilio, hepático común, cístico a la
// vesícula, colédoco que baja detrás de la cabeza del páncreas hasta la ampolla, en la «C» del duodeno.
export const VB = {
  hilio: [560, 410] as P2,
  union: [620, 560] as P2,
  ampolla: [790, 770] as P2,
  intra: ['M250,230 C340,280 460,340 560,410', 'M360,160 C420,240 500,330 560,410', 'M540,170 C550,260 556,340 560,410', 'M660,190 C640,270 600,350 560,410', 'M690,280 C650,320 600,370 560,410'],
  hepatico: 'M560,410 C580,470 600,520 620,560',
  cistico: 'M620,560 C590,575 540,560 500,555',
  coledoco: 'M620,560 C650,640 720,700 790,770',
  duodeno: 'M1040,560 C900,560 780,580 760,660 C740,760 740,860 820,900 C900,940 1010,920 1070,860',
  pancreas: 'M800,700 C830,640 920,630 1000,640 C1120,600 1280,560 1440,560 C1500,560 1520,600 1490,630 C1420,680 1260,690 1120,710 C1040,720 1000,800 940,830 C880,860 790,800 800,700 Z',
  ruta: [[360, 160], [460, 290], [560, 410], [590, 490], [620, 560], [690, 660], [790, 770]] as P2[],
};

/** Las vías biliares completas, con lo que puede taparlas. Cada opción va de 0 a 1:
 *  `calculo` (piedra en el colédoco), `tumor` (cabeza del páncreas), `grande` (vesícula distendida),
 *  `colangio` (tumor en el hilio), `atresia` (conductos convertidos en cordones), `fluye` (bilis que corre).
 *  `piedrasVes` y `piedrasCond`: cálculos negros en la vesícula y pardos en los conductos. */
export function ViasBiliares({ o = 1, reloj = 0, tonoHigado = TONO_HIGADO.normal as Tono, calculo = 0, tumor = 0, grande = 0, colangio = 0, atresia = 0, fluye = 1, piedrasVes = 0, piedrasCond = 0, higado = 1, pancreas = 1, dilata = 0, sinVias = 0 }: { o?: number; reloj?: number; tonoHigado?: Tono; calculo?: number; tumor?: number; grande?: number; colangio?: number; atresia?: number; fluye?: number; piedrasVes?: number; piedrasCond?: number; higado?: number; pancreas?: number; dilata?: number; sinVias?: number }) {
  if (o <= 0.002) return null;
  const at = clamp(atresia);
  const tonoCond: Tono = at > 0.5 ? ['#7A6A5A', '#B8A890', '#E0D4C0'] : B.bilis;
  const ancho = (w: number) => w * (1 + 0.5 * clamp(dilata)) * (1 - 0.55 * at);
  // Hasta dónde llega la bilis: un cálculo o un tumor la paran en el colédoco; el colangio, en el hilio.
  const tope = colangio > 0.5 || at > 0.5 ? 2 : calculo > 0.5 || tumor > 0.5 ? 5 : VB.ruta.length - 1;
  const ruta = VB.ruta.slice(0, tope + 1);
  const camino = porPuntos(ruta);
  const n = Math.round(4 + 8 * clamp(fluye));
  return (
    <g opacity={o}>
      {/* Páncreas con el Wirsung, y el tumor de la cabeza */}
      {pancreas > 0.01 && (
        <g opacity={pancreas}>
          <path d={VB.pancreas} fill="#C98A2A" />
          <path d={VB.pancreas} fill="#F2C060" transform="translate(-3,-4)" />
          {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={860 + i * 38} cy={690 - i * 6 + Math.sin(i * 1.7) * 14} r={14} fill="#FFE0A0" opacity={0.45} />)}
          <path d={`M1470,595 C1300,620 1120,650 1000,690 C900,720 840,750 ${VB.ampolla[0]},${VB.ampolla[1]}`} fill="none" stroke="#E0A030" strokeWidth={8} strokeLinecap="round" />
        </g>
      )}
      {tumor > 0.01 && (
        <g opacity={tramo(tumor, 0, 0.4)} transform={`translate(840,770) scale(${(0.5 + 0.5 * easeOut(clamp(tumor))).toFixed(3)})`}>
          {Array.from({ length: 7 }, (_, i) => {
            const a = (i / 7) * Math.PI * 2;
            return <circle key={i} cx={Math.cos(a) * 46} cy={Math.sin(a) * 40} r={44 + Math.sin(reloj / 500 + i) * 2} fill="#8A1A5A" />;
          })}
          {Array.from({ length: 7 }, (_, i) => {
            const a = (i / 7) * Math.PI * 2;
            return <circle key={`c${i}`} cx={Math.cos(a) * 42 - 4} cy={Math.sin(a) * 36 - 4} r={38} fill="#C8387A" />;
          })}
          <circle cx={-20} cy={-26} r={12} fill="#FF9AC8" opacity={0.8} />
        </g>
      )}
      {/* Hígado */}
      {higado > 0.01 && <HigadoB x={440} y={260} k={0.86} tono={tonoHigado} o={higado} />}
      {/* Árbol biliar */}
      {VB.intra.map((d, i) => <Conducto key={i} d={d} w={ancho(10 + (i % 2) * 4)} tono={tonoCond} />)}
      <Conducto d={VB.hepatico} w={ancho(26)} tono={tonoCond} o={1 - clamp(sinVias)} />
      <Conducto d={VB.cistico} w={ancho(18)} tono={tonoCond} o={1 - clamp(sinVias)} />
      <VesiculaB x={440} y={560} r={-20} k={0.85} o={1 - clamp(sinVias)} grande={grande} reloj={reloj} bilis={at > 0.5 ? ['#A89880', '#D8CCB8', '#F2EADC'] : B.bilis}
        piedras={piedrasVes > 0.01 ? ([[-24, 40, 22], [20, 70, 18], [-10, 96, 20], [26, 20, 15], [-34, 80, 14]] as [number, number, number][]).slice(0, Math.ceil(5 * clamp(piedrasVes))) : []} />
      <Conducto d={VB.coledoco} w={ancho(30)} tono={tonoCond} o={1 - clamp(sinVias)} />
      {/* Duodeno en «C» con la ampolla */}
      <g>
        <path d={VB.duodeno} fill="none" stroke="#B5245E" strokeWidth={96} strokeLinecap="round" />
        <path d={VB.duodeno} fill="none" stroke="#F27BA0" strokeWidth={74} strokeLinecap="round" />
        <path d={VB.duodeno} fill="none" stroke="#FFD0DE" strokeWidth={26} strokeLinecap="round" opacity={0.8} />
        <ellipse cx={1060} cy={560} rx={22} ry={52} fill="#B5245E" /><ellipse cx={1064} cy={560} rx={12} ry={36} fill="#7A1A44" />
        <circle cx={VB.ampolla[0]} cy={VB.ampolla[1]} r={16} fill="#7A2A4A" /><circle cx={VB.ampolla[0] - 4} cy={VB.ampolla[1] - 4} r={7} fill="#FFC0D0" />
      </g>
      {/* Lo que tapa */}
      {calculo > 0.01 && <Piedra x={700} y={672} R={26 * easeOut(clamp(calculo))} tono={['#7A4A10', '#C8902A']} sem={4} rot={20} />}
      {colangio > 0.01 && (
        <g opacity={tramo(colangio, 0, 0.4)}>
          {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={566 + Math.cos(i) * 24} cy={420 + Math.sin(i * 1.3) * 22} r={22 * easeOut(clamp(colangio))} fill={i % 2 ? '#8A1A5A' : '#C8387A'} />)}
        </g>
      )}
      {piedrasCond > 0.01 && ([[600, 500, 16], [650, 615, 18], [740, 718, 15], [560, 412, 13]] as [number, number, number][]).slice(0, Math.ceil(4 * clamp(piedrasCond))).map(([px, py, pr], i) => (
        <Piedra key={i} x={px} y={py} R={pr} tono={['#5E3210', '#9A5A26']} sem={i + 20} />
      ))}
      {/* La bilis que corre (hasta donde puede) */}
      {fluye > 0.01 && at < 0.5 && Array.from({ length: n }, (_, i) => {
        const u = (i / n + reloj * 0.00008) % 1;
        const [px, py] = camino(u);
        return <g key={i} opacity={tramo(Math.min(u, 1 - u), 0, 0.06)}><circle cx={px} cy={py} r={7} fill={B.conjugada[0]} /><circle cx={px - 1} cy={py - 1} r={5} fill={B.conjugada[1]} /></g>;
      })}
    </g>
  );
}

// ─── Cerebro en corte coronal ─────────────────────────────────────────────────

/** Corte coronal del encéfalo: corteza en rosa con sus surcos, sustancia blanca, ventrículos, núcleos de la base,
 *  tálamo, hipocampo, tronco y cerebelo. `tinte` (por núcleo, 0-1) los pinta de amarillo bilirrubina:
 *  globo, subtalamico, hipocampo, tronco (oculomotores y auditivos), cerebelo. Ocupa x ±330, y −260…330. */
export const NUCLEOS_CORTE: Record<string, P2[]> = {
  globo: [[-96, 20], [96, 20]],
  subtalamico: [[-46, 92], [46, 92]],
  hipocampo: [[-170, 112], [170, 112]],
  tronco: [[0, 200], [0, 240]],
  cerebelo: [[-150, 270], [150, 270]],
};
export function CorteCerebro({ x = 0, y = 0, k = 1, o = 1, tinte = {}, reloj = 0 }: { x?: number; y?: number; k?: number; o?: number; tinte?: Record<string, number>; reloj?: number }) {
  if (o <= 0.002) return null;
  const T = (n: string) => clamp(tinte[n] ?? 0);
  const am = (n: string, base: string) => mezcla(base, B.bilirrubina[1], T(n));
  const amOsc = (n: string, base: string) => mezcla(base, B.bilirrubina[0], T(n));
  const late = (i: number) => 1 + Math.sin(reloj / 600 + i) * 0.04;
  const hemi = 'M0,-250 C-120,-262 -300,-210 -322,-60 C-338,60 -290,150 -210,180 C-150,200 -90,170 -40,150 L0,150 Z';
  return (
    <En x={x} y={y} k={k} o={o}>
      {/* Cerebelo y tronco, detrás */}
      {[-1, 1].map((s) => (
        <g key={`cb${s}`} transform={`scale(${s},1)`}>
          <ellipse cx={150} cy={268} rx={150} ry={74} fill="#9A3A6A" />
          <ellipse cx={146} cy={262} rx={140} ry={64} fill={am('cerebelo', '#D86A9A')} />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${40 + i * 6},${236 + i * 14} Q150,${222 + i * 16} ${270 - i * 10},${244 + i * 12}`} fill="none" stroke={amOsc('cerebelo', '#9A3A6A')} strokeWidth={4} strokeLinecap="round" opacity={0.7} />)}
        </g>
      ))}
      <path d="M-56,140 C-60,220 -46,300 -40,340 L40,340 C46,300 60,220 56,140 Z" fill="#B04A7A" />
      <path d="M-48,140 C-52,220 -40,300 -34,336 L34,336 C40,300 52,220 48,140 Z" fill={am('tronco', '#E07AA8')} />
      {NUCLEOS_CORTE.tronco.map(([nx, ny], i) => <g key={`t${i}`}><circle cx={nx - 18} cy={ny} r={11 * late(i)} fill={amOsc('tronco', '#B04A7A')} /><circle cx={nx + 18} cy={ny} r={11 * late(i + 1)} fill={amOsc('tronco', '#B04A7A')} /></g>)}
      {/* Hemisferios: corteza (rosa) y sustancia blanca */}
      {[-1, 1].map((s) => (
        <g key={`h${s}`} transform={`scale(${s},1)`}>
          <path d={hemi} fill={sombra} transform="translate(-10,12)" />
          <path d={hemi} fill="#B8457A" />
          <path d={hemi} fill="#E886B0" transform="translate(2,-4) scale(0.98)" />
          <path d="M-6,-220 C-110,-226 -264,-180 -280,-56 C-292,40 -256,120 -196,146 C-150,164 -96,140 -50,124 L-6,124 Z" fill="#FBEFF4" />
          {/* Surcos de la corteza */}
          {['M-80,-238 C-90,-210 -86,-196 -70,-190', 'M-190,-204 C-180,-180 -170,-170 -150,-168', 'M-282,-110 C-256,-104 -240,-96 -232,-80', 'M-318,0 C-292,0 -276,8 -268,22', 'M-276,120 C-256,104 -244,96 -228,96', 'M-130,184 C-128,164 -120,154 -104,148'].map((d, i) => <path key={i} d={d} fill="none" stroke="#B8457A" strokeWidth={8} strokeLinecap="round" />)}
          {/* Cisura lateral (silvio) */}
          <path d="M-310,40 C-260,46 -220,50 -190,64" fill="none" stroke="#B8457A" strokeWidth={10} strokeLinecap="round" />
          {/* Ventrículo lateral */}
          <path d="M-14,-90 C-40,-96 -70,-80 -76,-56 C-60,-60 -34,-62 -14,-50 Z" fill="#5A7AD0" />
          {/* Caudado, putamen y globo pálido (núcleo lenticular) */}
          <ellipse cx={-62} cy={-44} rx={26} ry={30} fill="#D9A0BE" />
          <path d="M-150,-30 C-170,10 -160,70 -130,86 C-118,40 -110,0 -120,-40 Z" fill="#D9A0BE" />
          <path d={`M-120,-40 C-110,0 -118,40 -130,86 C-96,70 -76,40 -74,10 C-80,-10 -96,-30 -120,-40 Z`} fill={am('globo', '#C88AB0')} transform={`translate(-100,20) scale(${late(1)}) translate(100,-20)`} />
          {/* Tálamo y núcleo subtalámico */}
          <ellipse cx={-44} cy={40} rx={38} ry={44} fill="#D9A0BE" />
          <ellipse cx={-46} cy={92} rx={20 * late(2)} ry={12 * late(2)} fill={am('subtalamico', '#B8709A')} />
          {/* Hipocampo, en la cara medial del lóbulo temporal */}
          <path d="M-210,112 C-196,92 -160,92 -140,104 C-150,124 -176,132 -200,128 Z" fill={am('hipocampo', '#C88AB0')} transform={`translate(-170,112) scale(${late(3)}) translate(170,-112)`} />
          <path d="M-200,112 C-186,104 -164,104 -150,110" fill="none" stroke={amOsc('hipocampo', '#9A4A7A')} strokeWidth={4} strokeLinecap="round" />
        </g>
      ))}
      {/* Tercer ventrículo y cuerpo calloso */}
      <path d="M-70,-110 C-30,-124 30,-124 70,-110 L70,-96 C30,-108 -30,-108 -70,-96 Z" fill="#F2D4E2" />
      <rect x={-6} y={-40} width={12} height={110} rx={6} fill="#5A7AD0" />
      <path d="M-200,-170 Q-150,-200 -90,-206" fill="none" stroke="#FFFFFF" strokeWidth={12} strokeLinecap="round" opacity={0.5} />
    </En>
  );
}

// ─── Muestras: suero, orina y heces ───────────────────────────────────────────

/** Tubo de sangre centrifugada: glóbulos abajo y el suero arriba con el color pedido. */
export function TuboSuero({ x = 0, y = 0, k = 1, o = 1, suero = '#FFC21E', tapa = '#E3203F' }: { x?: number; y?: number; k?: number; o?: number; suero?: string; tapa?: string }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-34} y={-120} width={68} height={250} rx={32} fill={sombra} transform="translate(7,8)" />
      <rect x={-34} y={-120} width={68} height={250} rx={32} fill="#DCEAF4" />
      <rect x={-26} y={30} width={52} height={92} rx={24} fill="#9E0B2E" />
      <rect x={-26} y={30} width={44} height={84} rx={22} fill="#C8122F" />
      <rect x={-26} y={-60} width={52} height={96} rx={6} fill={suero} />
      <rect x={-20} y={-100} width={10} height={210} rx={5} fill="#FFF" opacity={0.6} />
      <rect x={-42} y={-150} width={84} height={40} rx={12} fill={tapa} />
      <rect x={-42} y={-150} width={84} height={14} rx={7} fill="#FFFFFF" opacity={0.25} />
    </En>
  );
}

/** Frasco de orina con el color pedido (pajizo, ámbar o «coca-cola»). */
export function FrascoOrina({ x = 0, y = 0, k = 1, o = 1, color = '#F6D64A', espuma = 0 }: { x?: number; y?: number; k?: number; o?: number; color?: string; espuma?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-62} y={-80} width={124} height={170} rx={26} fill={sombra} transform="translate(8,9)" />
      <rect x={-62} y={-80} width={124} height={170} rx={26} fill="#E2EEF6" />
      <rect x={-52} y={-30} width={104} height={110} rx={20} fill={color} />
      {espuma > 0.01 && <path d="M-52,-30 Q-36,-46 -20,-32 Q-4,-48 12,-32 Q28,-48 52,-30 Z" fill="#FFF4C8" opacity={clamp(espuma)} />}
      <rect x={-44} y={-64} width={12} height={130} rx={6} fill="#FFF" opacity={0.55} />
      <rect x={-70} y={-110} width={140} height={36} rx={10} fill="#F2B21E" />
      <rect x={-70} y={-110} width={140} height={12} rx={6} fill="#FFFFFF" opacity={0.3} />
    </En>
  );
}

/** Deposición sobre su recipiente: marrón normal, oscura (prehepática) o acólica (blanca grisácea). */
export function Heces({ x = 0, y = 0, k = 1, o = 1, color = '#8A4A1C' }: { x?: number; y?: number; k?: number; o?: number; color?: string }) {
  const osc = mezcla(color, '#000000', 0.3), cla = mezcla(color, '#FFFFFF', 0.3);
  return (
    <En x={x} y={y} k={k} o={o}>
      <ellipse cx={6} cy={60} rx={110} ry={16} fill={sombra} />
      <path d="M-100,20 L100,20 L80,60 L-80,60 Z" fill="#9AA8BC" /><rect x={-104} y={10} width={208} height={18} rx={9} fill="#C9D4E6" />
      <path d="M-70,14 C-80,-14 -50,-24 -30,-18 C-36,-44 -4,-58 14,-40 C24,-62 60,-52 56,-26 C80,-24 84,4 66,14 Z" fill={osc} />
      <path d="M-62,8 C-70,-14 -46,-18 -28,-12 C-32,-36 -4,-48 12,-32 C22,-52 52,-44 50,-22 C70,-20 72,0 58,8 Z" fill={color} />
      <path d="M-40,-10 Q-30,-22 -14,-20" fill="none" stroke={cla} strokeWidth={6} strokeLinecap="round" />
    </En>
  );
}

/** Indicador que sube o baja: flecha gruesa con su rótulo (para un análisis). */
export function Sube({ x, y, sube, p = 1, color }: { x: number; y: number; sube: boolean; p?: number; color?: string }) {
  if (p <= 0.002) return null;
  const c = color ?? (sube ? '#E3203F' : '#2E78F2');
  const q = easeOut(clamp(p * 1.3));
  return (
    <En x={x} y={y} o={tramo(p, 0, 0.4)}>
      <g transform={`translate(0,${(sube ? 1 : -1) * (1 - q) * 20}) ${sube ? '' : 'rotate(180)'}`}>
        <path d="M-12,30 L-12,-4 L-28,-4 L0,-34 L28,-4 L12,-4 L12,30 Z" fill={mezcla(c, '#000000', 0.25)} transform="translate(3,4)" />
        <path d="M-12,30 L-12,-4 L-28,-4 L0,-34 L28,-4 L12,-4 L12,30 Z" fill={c} />
      </g>
    </En>
  );
}

/** Átomo de calcio (para el bilirrubinato cálcico). */
export function Calcio({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <Atomo R={22} tono={['#7A8AA8', '#E6ECF6', '#FFFFFF']} />
      <text dy="0.36em" textAnchor="middle" style={{ fontSize: 15, fontWeight: 800, fill: '#3A4A68' }}>Ca²⁺</text>
    </En>
  );
}
