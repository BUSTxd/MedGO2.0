'use client';
// Piezas del laboratorio «VIH y sífilis» (Patología, ACP14), en el estilo de las
// referencias de BUST (docs/vih-sifilis/ESTILO.md): infografía plana, colores de joya y sin
// contorno oscuro. Cada objeto lleva un tono oscuro de base, el cuerpo claro corrido y un
// brillo; los canales copian «membrana celular» (toros sobre tallos), el virus copia «virtus
// y celulas» (racimos verdes con puntos de espiga) y la hélice copia «medicamento
// interactuando con proteina del adn». Lienzo de 1600 × 1000, sin `filter`.
//
// Lo que ya existe en Citopenias, Vasculitis, Gramnegativas y Bilirrubina se reexporta tal
// cual (no se copia); aquí solo lo propio del tema.

import { type ReactNode } from 'react';
import vs from '@/styles/vihSifilis.module.css';
import { En, Sale, clamp, easeBack, easeOut, hash, lerp, tramo } from '../citopenias-autoinmunes/Piezas';

export { En, Sale, Flecha, Txt, Rotulo, Esfera, Macrofago, Linfocito, Plasmatica, IgG, Ganglio, Higado, Bazo, Medula, Cerebro, Frasco, TuboOrina, Jeringa, BolsaSangre, Pastilla, Termometro, Corazon, Chorro, Virus, Persona, Mano, Plaqueta, clamp, tramo, lerp, easeOut, easeBack, hash, blob, enBorde } from '../citopenias-autoinmunes/Piezas';
export { V, Bola, Bandera, Hematie, Vaso, Tarjeta, Cuerpo, Punto, LineaTiempo, Foco, Llamada, Pista, Pantalla, TxtPantalla, Manometro, Pulmones, Alveolos, CelEndo, Neutrofilo, Granuloma, CelGigante, Epitelioide, Paciente, Perfil, Microscopio } from '../vasculitis-anca/Piezas';
export { Barra, Lente, viaje, FLECHA, Cruz, Visto } from '../citopenias-autoinmunes/laminas/Comun';
export { Enzima, Viaja, Chip, Basal, mezcla, Union } from '../vasculitis-anca/Fisio';
export { Bacilo, Flota, Piso, Capas, Intestino, Figurita, Enterocito, Caliciforme, Cremallera, Corte, Gel, Retrato } from '../gramnegativas/Piezas';
export { Cerradura, Estacion, Via, Vagon, TuboEnsayo, Tira, Maquina, Flujo } from '../bilirrubina/Piezas';

type Tono = readonly string[];
type P2 = [number, number];

/** Paleta propia (oscuro → claro). Cada entidad conserva su color en todo el lab. */
export const P = {
  virus: ['#1B7A2E', '#46C84A', '#C9F59A'],
  espiga: ['#C77A0A', '#FFB62B', '#FFE49A'],
  cap: ['#C2620A', '#F5A21B', '#FFE01A'],
  arn: ['#B0123A', '#F0476A', '#FFC2CF'],
  adn: ['#0A4FC0', '#0A62E0', '#35C5FF'],
  hla: ['#7B1470', '#C42FB0', '#F59AE6'],
  dc: ['#7B1470', '#C42FB0', '#F59AE6'],
  cd4: ['#127CB5', '#3FB6E8', '#A3E3F7'],
  canal: ['#D98200', '#FFAE1A', '#FFE49A'],
  tallo: ['#B000C8', '#FF2DF0', '#FFB0FA'],
  copa: ['#6B1FB0', '#B04AE8', '#E0B8FF'],
  esp: ['#0A6F78', '#16B9BE', '#7FEDE8'],
  sangre: ['#B51D3B', '#E5324C', '#FF7A7F'],
  piel: ['#C94F80', '#E07A9E', '#F2A8C0'],
  piel2: ['#C77C4E', '#E8A06E', '#F7C9A2'],
  rt: ['#1E4FC0', '#3A6FE0', '#9DB8FF'],
  inte: ['#5A22A8', '#8A4FE8', '#D2B8FF'],
  prot: ['#C2620A', '#FF8A1E', '#FFC48A'],
  mapa: ['#C98A3C', '#E8B05A', '#F8D898'],
  menta: ['#1E8F5A', '#2FD79A', '#B6F5D8'],
  /** Interior de un corte (virión o célula): el azul marino de «medicamento entrando a celula cancerosa». */
  interior: '#2A0F6E',
  pelo: '#1C0B73',
  ojo: '#52106A',
  sombra: 'rgba(40,10,80,0.24)',
} as const;

/** Colores de TEXTO que se adaptan al tema (variables de `vihSifilis.module.css`). */
export const TXV = {
  virus: 'var(--vs-virus)', cd4: 'var(--vs-cd4)', cd8: 'var(--vs-cd8)', mac: 'var(--vs-mac)', dc: 'var(--vs-dc)', ab: 'var(--vs-ab)',
  adn: 'var(--vs-adn)', fx: 'var(--vs-fx)', esp: 'var(--vs-esp)', sangre: 'var(--vs-sangre)', tejido: 'var(--vs-tejido)',
  ambar: 'var(--vs-ambar)', violeta: 'var(--vs-violeta)', verde: 'var(--vs-verde)',
} as const;

// ─── El virión ───────────────────────────────────────────────────────────────

/** Radio del virión (para colocar cosas alrededor). */
export const RV = 120;

/** Una espícula: trímero con su tallo (gp41) y sus tres lóbulos (gp120); `glico` 0-1 pone el escudo de azúcares. Crece hacia −y. */
export function Espiga({ x = 0, y = 0, r = 0, k = 1, o = 1, crece = 1, glico = 0 }: { x?: number; y?: number; r?: number; k?: number; o?: number; crece?: number; glico?: number }) {
  if (crece <= 0.01) return null;
  const L = 34 * clamp(crece);
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      <rect x={-5.5} y={-L} width={11} height={L + 3} rx={5.5} fill={P.espiga[0]} />
      <rect x={-2.8} y={-L} width={4.6} height={L} rx={2.3} fill={P.espiga[1]} />
      <g transform={`translate(0,${-L})`}>
        <circle cx={-10} cy={-7} r={12.5} fill={P.espiga[0]} /><circle cx={10} cy={-7} r={12.5} fill={P.espiga[0]} /><circle cx={0} cy={-18} r={13} fill={P.espiga[0]} />
        <circle cx={-11} cy={-9} r={10} fill={P.espiga[1]} /><circle cx={9} cy={-9} r={10} fill={P.espiga[1]} /><circle cx={-1} cy={-20} r={10.5} fill={P.espiga[1]} />
        <circle cx={-14} cy={-12} r={3.4} fill={P.espiga[2]} /><circle cx={-4} cy={-24} r={3.4} fill={P.espiga[2]} /><circle cx={6} cy={-12} r={3} fill={P.espiga[2]} />
        {glico > 0.01 && [[-24, -4], [24, -4], [-20, -26], [20, -26], [0, -36], [-30, -16], [30, -16]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={6 * clamp(glico)} fill={P.hla[1]} opacity={0.95}><title>azúcar</title></circle>
        ))}
      </g>
    </En>
  );
}

/** El cono de la cápside (p24), con su patrón de hexágonos; `arn` y `enzimas` 0-1 muestran lo de adentro. Eje largo en x. */
export function Capside({ x = 0, y = 0, r = 0, k = 1, o = 1, arn = 0, enzimas = 0, rigida = 0, partido = 0 }: { x?: number; y?: number; r?: number; k?: number; o?: number; arn?: number; enzimas?: number; rigida?: number; partido?: number }) {
  const cono = 'M-46,-32 C-60,-32 -60,32 -46,32 L60,6 C68,3 68,-3 60,-6 Z';
  const pts: [number, number][] = [];
  for (let px = -36; px <= 54; px += 13) for (let py = -26; py <= 26; py += 12) {
    const alto = lerp(30, 4, (px + 46) / 106) - 5;
    if (Math.abs(py + (Math.round((px + 36) / 13) % 2 ? 6 : 0)) < alto) pts.push([px, py + (Math.round((px + 36) / 13) % 2 ? 6 : 0)]);
  }
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      <path d={cono} fill={P.sombra} transform="translate(5,7)" />
      <path d={cono} fill={P.cap[0]} />
      <path d={cono} fill={P.cap[1]} transform="translate(-2,-3) scale(0.95 0.9)" />
      {pts.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={3.4} fill={rigida > 0.5 ? P.cap[2] : P.cap[2]} opacity={0.75} />)}
      <path d="M-44,-22 Q-30,-31 -8,-24" fill="none" stroke="#FFF" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
      {partido > 0.01 && <path d={`M-10,-34 L${-4 + 10 * partido},0 L-10,34`} fill="none" stroke={P.interior} strokeWidth={5} strokeLinecap="round" opacity={0.7} />}
      {arn > 0.01 && (
        <g opacity={clamp(arn)}>
          <path d="M-36,-10 Q-24,-24 -12,-10 T14,-10 T42,-6" fill="none" stroke={P.arn[1]} strokeWidth={6.5} strokeLinecap="round" />
          <path d="M-36,10 Q-24,-4 -12,10 T14,10 T40,5" fill="none" stroke={P.arn[2]} strokeWidth={6.5} strokeLinecap="round" />
        </g>
      )}
      {enzimas > 0.01 && (
        <g opacity={clamp(enzimas)}>
          <circle cx={-26} cy={1} r={9} fill={P.rt[0]} /><circle cx={-28} cy={-1} r={6.5} fill={P.rt[1]} />
          <circle cx={4} cy={-3} r={8.5} fill={P.inte[0]} /><circle cx={2} cy={-5} r={6} fill={P.inte[1]} />
          <circle cx={30} cy={2} r={8} fill={P.prot[0]} /><circle cx={28} cy={0} r={5.5} fill={P.prot[1]} />
        </g>
      )}
    </En>
  );
}

/** El virión entero. `espigas`, `abre` (corte: se ve el interior), `matriz`, `capside`, `arn`, `enzimas` y `hla` van de 0 a 1. */
export function Virion({ x = 0, y = 0, k = 1, o = 1, r = 0, espigas = 1, glico = 0, abre = 0, matriz = 0, capside = 0, arn = 0, enzimas = 0, hla = 0, reloj = 0, tono = P.virus }: { x?: number; y?: number; k?: number; o?: number; r?: number; espigas?: number; glico?: number; abre?: number; matriz?: number; capside?: number; arn?: number; enzimas?: number; hla?: number; reloj?: number; tono?: readonly string[] }) {
  const N = 14;
  const R = RV;
  const mece = Math.sin(reloj / 900) * 1.2;
  return (
    <En x={x} y={y} k={k} o={o} r={r + mece}>
      {Array.from({ length: N }, (_, i) => (
        <g key={i} transform={`rotate(${(i / N) * 360 + 6})`}>
          <Espiga y={-R + 6} crece={easeOut(tramo(espigas, (i / N) * 0.4, (i / N) * 0.4 + 0.6))} glico={glico} />
        </g>
      ))}
      <circle cx={9} cy={11} r={R} fill={P.sombra} />
      <circle r={R} fill={tono[0]} />
      <circle cx={-4} cy={-5} r={R - 9} fill={tono[1]} />
      <path d={`M${-R * 0.78},${-R * 0.38} Q${-R * 0.62},${-R * 0.78} ${-R * 0.16},${-R * 0.86}`} fill="none" stroke={tono[2]} strokeWidth={10} strokeLinecap="round" opacity={0.8} />
      {hla > 0.01 && Array.from({ length: 7 }, (_, i) => {
        const a = ((i + 0.5) / 7) * Math.PI * 2 - 0.35;
        const q = easeOut(tramo(hla, i * 0.08, 0.5 + i * 0.08));
        return <g key={i} transform={`translate(${Math.cos(a) * (R - 8)},${Math.sin(a) * (R - 8)}) scale(${q})`}><circle r={9} fill={P.hla[0]} /><circle cx={-1.5} cy={-1.5} r={6.5} fill={P.hla[1]} /><circle cx={-3} cy={-3.5} r={2.4} fill="#FFF" opacity={0.8} /></g>;
      })}
      {abre > 0.01 && (
        <g opacity={tramo(abre, 0, 0.4)}>
          <circle r={R - 17} fill={P.interior} />
          {matriz > 0.01 && (
            <g opacity={tramo(matriz, 0, 0.5)}>
              <circle r={R - 30} fill="none" stroke={tono[1]} strokeWidth={9} strokeDasharray="2 13" strokeLinecap="round" />
              <circle r={R - 30} fill="none" stroke={tono[2]} strokeWidth={3} opacity={0.6} />
            </g>
          )}
          {capside > 0.01 && <Capside x={-6} y={4} r={-18} k={1.45 * (0.7 + 0.3 * easeBack(clamp(capside)))} o={tramo(capside, 0, 0.4)} arn={arn} enzimas={enzimas} />}
        </g>
      )}
    </En>
  );
}

/** Hebra de ARN: onda rosa con su cola. */
export function Arn({ x = 0, y = 0, w = 260, k = 1, o = 1, r = 0, p = 1, fase = 0, grosor = 8, tono = P.arn }: { x?: number; y?: number; w?: number; k?: number; o?: number; r?: number; p?: number; fase?: number; grosor?: number; tono?: readonly string[] }) {
  if (p <= 0.003) return null;
  const n = 36;
  let d = '';
  const m = Math.max(2, Math.round(n * clamp(p)));
  for (let i = 0; i <= m; i++) { const u = i / n; d += `${i ? ' L' : 'M'}${(u * w).toFixed(1)},${(Math.sin(u * Math.PI * 5 + fase) * 12).toFixed(1)}`; }
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <path d={d} fill="none" stroke={tono[0]} strokeWidth={grosor + 3} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={tono[1]} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" />
    </En>
  );
}

// ─── ADN ─────────────────────────────────────────────────────────────────────

/** La doble hélice de la referencia: hebras azul rey con peldaños azul cielo. `resalta`: [u0, u1] la tiñe de morado. */
export function Helice({ x = 0, y = 0, w = 640, amp = 44, vueltas = 3, fase = 0, k = 1, o = 1, r = 0, grosor = 15, resalta, p = 1 }: { x?: number; y?: number; w?: number; amp?: number; vueltas?: number; fase?: number; k?: number; o?: number; r?: number; grosor?: number; resalta?: [number, number]; p?: number }) {
  if (p <= 0.003) return null;
  const n = 72;
  const hasta = Math.max(2, Math.round(n * clamp(p)));
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n, th = fase + u * vueltas * Math.PI * 2;
    return { x: -w / 2 + u * w, a: amp * Math.sin(th), z: Math.cos(th), u };
  });
  const seg = (i: number, hebra: 1 | -1, delante: boolean) => {
    const a = pts[i], b = pts[i + 1];
    const z = hebra * (a.z + b.z) / 2;
    if ((z > 0) !== delante) return null;
    const rz = resalta && a.u >= resalta[0] && a.u <= resalta[1];
    return <line key={`${hebra}-${i}`} x1={a.x} y1={hebra * a.a} x2={b.x} y2={hebra * b.a} stroke={rz ? (delante ? '#C21FD8' : '#8A15A8') : delante ? P.adn[1] : P.adn[0]} strokeWidth={delante ? grosor : grosor * 0.78} strokeLinecap="round" />;
  };
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      {Array.from({ length: hasta }, (_, i) => seg(i, 1, false))}
      {Array.from({ length: hasta }, (_, i) => seg(i, -1, false))}
      {pts.slice(0, hasta + 1).filter((_, i) => i % 3 === 1).map((q, i) => <line key={i} x1={q.x} y1={q.a} x2={q.x} y2={-q.a} stroke={P.adn[2]} strokeWidth={9} strokeLinecap="round" opacity={0.9} />)}
      {Array.from({ length: hasta }, (_, i) => seg(i, 1, true))}
      {Array.from({ length: hasta }, (_, i) => seg(i, -1, true))}
    </En>
  );
}

// ─── Membrana y receptores (referencia «membrana celular») ──────────────────

/** Un canal: toro sobre un tallo, como en «membrana celular». Mira hacia −y. */
export function Canal({ x = 0, y = 0, k = 1, o = 1, r = 0, tono = P.canal as Tono, tallo = P.tallo as Tono, alto = 80, hueco = P.interior as string, abierto = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; tono?: Tono; tallo?: Tono; alto?: number; hueco?: string; abierto?: number }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <rect x={-9} y={-alto} width={18} height={alto + 6} rx={9} fill={tallo[0]} />
      <rect x={-5} y={-alto} width={7} height={alto} rx={3.5} fill={tallo[1]} />
      <g transform={`translate(0,${-alto})`}>
        <ellipse cx={3} cy={4} rx={46} ry={22} fill={P.sombra} />
        <ellipse rx={46} ry={22} fill={tono[0]} />
        <ellipse cy={-3} rx={46} ry={20} fill={tono[1]} />
        <ellipse cy={-1} rx={26 + 4 * abierto} ry={9 + 2 * abierto} fill={hueco} />
        <ellipse cx={26} cy={-12} rx={9} ry={3.4} fill="#FFF" opacity={0.85} transform="rotate(-8 26 -12)" />
      </g>
    </En>
  );
}

/** CD4: un toro azul sobre un tallo (la «puerta» donde se une la gp120). */
export function ReceptorCD4({ x = 0, y = 0, k = 1, o = 1, r = 0, alto = 80, ocupado = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; alto?: number; ocupado?: number }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <Canal tono={P.cd4 as Tono} tallo={['#0B5F8F', '#127CB5', '#A3E3F7']} alto={alto} hueco={ocupado > 0.5 ? P.espiga[1] : P.interior} />
    </En>
  );
}

/** Un correceptor (CCR5 o CXCR4): siete hélices en una copa. Mira hacia −y. */
export function Correceptor({ x = 0, y = 0, k = 1, o = 1, r = 0, tipo = 'ccr5', alto = 70, abierto = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; tipo?: 'ccr5' | 'cxcr4'; alto?: number; abierto?: number }) {
  const c = tipo === 'ccr5' ? P.copa : (['#0A6F78', '#16B9BE', '#7FEDE8'] as const);
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <rect x={-30} y={-alto} width={60} height={alto + 6} rx={14} fill={P.sombra} transform="translate(3,3)" />
      {[-24, -16, -8, 0, 8, 16, 24].map((dx, i) => (
        <rect key={i} x={dx - 3.6} y={-alto - (i % 2 ? 0 : 6) - 4 * abierto * (i % 2 ? 1 : -1)} width={7.2} height={alto + (i % 2 ? 6 : 12)} rx={3.6} fill={i % 2 ? c[1] : c[0]} />
      ))}
      <path d={`M-28,${-alto - 10} Q0,${-alto - 24 - 8 * abierto} 28,${-alto - 10}`} fill="none" stroke={c[2]} strokeWidth={7} strokeLinecap="round" />
    </En>
  );
}

/** Paisaje de lomas festoneadas en capas (como la membrana de la referencia): cada banda [dy, color, radio] se apila bajando. */
export function Lomas({ x = 800, y, w = 1900, fondo = 1100, bandas, sem = 1, o = 1 }: { x?: number; y: number; w?: number; fondo?: number; bandas: [dy: number, color: string, r: number][]; sem?: number; o?: number }) {
  let yy = y;
  return (
    <En x={x} y={0} o={o}>
      {bandas.map(([dy, color, rad], i) => {
        yy += dy;
        let d = `M${-w / 2},${fondo} L${-w / 2},${yy}`;
        let xx = -w / 2, j = 0;
        while (xx < w / 2) {
          const rr = rad * (0.75 + 0.55 * hash(j, sem + i));
          d += ` a${rr.toFixed(1)},${rr.toFixed(1)} 0 0 1 ${(2 * rr).toFixed(1)},0`;
          xx += 2 * rr; j++;
        }
        return <path key={i} d={`${d} L${xx.toFixed(1)},${fondo} Z`} fill={color} />;
      })}
    </En>
  );
}

// ─── Personas ────────────────────────────────────────────────────────────────

/** Busto de la referencia «diseño de hombre adulto»: plano, sin contorno, piel de un color que no es de piel. */
export function Hombre({ x = 0, y = 0, k = 1, o = 1, piel = P.piel as Tono, pelo = 'var(--vs-pelo)', ropa = ['#0F8F86', '#3FC0B8'] as Tono, barba = false, triste = 0, rubor = 0, pelon = 0, boca = 0 }: { x?: number; y?: number; k?: number; o?: number; piel?: Tono; pelo?: string; ropa?: Tono; barba?: boolean; triste?: number; rubor?: number; pelon?: number; boca?: number }) {
  const cejas = (lado: 1 | -1) => <rect x={lado * 46 - 30} y={-42} width={60} height={15} rx={7.5} fill={pelo} transform={`rotate(${lado * triste * 13} ${lado * 46} -34)`} />;
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M-212,330 C-212,252 -150,206 -78,190 L78,190 C150,206 212,252 212,330 Z" fill={ropa[0]} />
      <path d="M-198,330 C-198,262 -140,214 -70,200 L70,200 C140,214 198,262 198,330 Z" fill={ropa[1]} />
      <path d="M-52,118 L-52,196 Q0,238 52,196 L52,118 Z" fill={piel[0]} />
      <path d="M-52,142 Q0,172 52,142 L52,118 L-52,118 Z" fill="rgba(60,0,50,0.22)" />
      {[-1, 1].map((l) => <g key={l}><circle cx={l * 113} cy={8} r={27} fill={piel[1]} /><circle cx={l * 113} cy={8} r={14} fill="#B0206F" /></g>)}
      <ellipse rx={112} ry={134} fill={piel[0]} />
      <ellipse cx={-5} cy={-4} rx={106} ry={128} fill={piel[1]} />
      {rubor > 0.01 && [-1, 1].map((l) => <ellipse key={l} cx={l * 62} cy={34} rx={30} ry={20} fill="#FF4D6A" opacity={0.55 * clamp(rubor)} />)}
      {pelon < 0.99 && (
        <g opacity={1 - pelon}>
          <path d="M-124,-30 C-134,-146 -72,-196 6,-190 C92,-190 138,-134 124,-30 C102,-84 42,-104 -20,-96 C-70,-90 -108,-68 -124,-30 Z" fill={pelo} />
          <path d="M28,-186 C52,-210 86,-206 92,-186 C70,-190 50,-184 28,-186 Z" fill={pelo} />
        </g>
      )}
      {cejas(-1)}{cejas(1)}
      {[-1, 1].map((l) => <g key={l}><circle cx={l * 46} cy={-6} r={22} fill={P.ojo} /><circle cx={l * 46 - 7} cy={-14} r={6} fill="#FFF" opacity={0.85} /></g>)}
      <circle cy={42} r={15} fill={piel[0]} />
      {barba && <path d="M-110,18 C-112,100 -60,138 0,140 C60,138 112,100 110,18 C92,70 62,84 40,84 L-40,84 C-62,84 -92,70 -110,18 Z" fill={pelo} />}
      {barba
        ? <rect x={-30} y={96 - boca * 6} width={60} height={14 + boca * 12} rx={8 + boca * 4} fill="#B01472" />
        : <path d={`M-30,${100 + triste * 6} Q0,${92 + boca * 18 - triste * 8} 30,${100 + triste * 6}`} fill="none" stroke="#A31472" strokeWidth={9} strokeLinecap="round" />}
    </En>
  );
}

// ─── Mapa y animales ─────────────────────────────────────────────────────────

const AFRICA: P2[] = [[70, 50], [110, 34], [160, 30], [205, 40], [235, 55], [252, 66], [262, 92], [278, 128], [300, 150], [332, 172], [312, 196], [288, 222], [272, 252], [262, 282], [244, 308], [222, 332], [190, 348], [160, 334], [150, 300], [138, 262], [146, 232], [136, 206], [112, 192], [92, 196], [62, 184], [36, 166], [14, 138], [16, 108], [30, 82], [50, 60]];

/** África en tres capas (sombra, tierra y luz). Caja de unos 340 × 360. */
export function Africa({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  const d = `M${AFRICA.map(([a, b]) => `${a},${b}`).join(' L')} Z`;
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d={d} fill={P.sombra} transform="translate(8,10)" strokeLinejoin="round" stroke={P.sombra} strokeWidth={10} />
      <path d={d} fill={P.mapa[0]} stroke={P.mapa[0]} strokeWidth={12} strokeLinejoin="round" />
      <path d={d} fill={P.mapa[1]} stroke={P.mapa[1]} strokeWidth={6} strokeLinejoin="round" transform="translate(172,190) scale(0.94) translate(-172,-190)" />
      <path d="M60,76 Q110,52 170,58 Q220,62 244,84" fill="none" stroke={P.mapa[2]} strokeWidth={8} strokeLinecap="round" opacity={0.85} />
    </En>
  );
}

/** Cabeza de simio, plana: chimpancé, gorila o mangabey. */
export function Simio({ x = 0, y = 0, k = 1, o = 1, quien = 'chimpance' }: { x?: number; y?: number; k?: number; o?: number; quien?: 'chimpance' | 'gorila' | 'mangabey' }) {
  const c = quien === 'gorila' ? ['#2A2438', '#4A4260', '#7C7494'] : quien === 'mangabey' ? ['#7E8294', '#AEB2C2', '#E2E5EE'] : ['#6B3F1C', '#A06A33', '#D9A66B'];
  const cara = quien === 'gorila' ? ['#5A5070', '#7C7494'] : quien === 'mangabey' ? ['#FFF4EC', '#FFFFFF'] : ['#E8C39A', '#F6DDBF'];
  return (
    <En x={x} y={y} k={k} o={o}>
      <circle cx={-66} cy={-4} r={24} fill={c[0]} /><circle cx={-66} cy={-4} r={14} fill={cara[0]} />
      <circle cx={66} cy={-4} r={24} fill={c[0]} /><circle cx={66} cy={-4} r={14} fill={cara[0]} />
      <ellipse rx={68} ry={72} fill={c[0]} /><ellipse cx={-3} cy={-4} rx={63} ry={67} fill={c[1]} />
      {quien === 'gorila' && <path d="M-40,-66 Q0,-104 40,-66 Q0,-80 -40,-66 Z" fill={c[0]} />}
      <ellipse cy={14} rx={44} ry={42} fill={cara[0]} /><ellipse cx={-2} cy={11} rx={40} ry={38} fill={cara[1]} />
      <circle cx={-22} cy={-12} r={7} fill="#1A0B24" /><circle cx={22} cy={-12} r={7} fill="#1A0B24" />
      <circle cx={-24} cy={-14} r={2.4} fill="#FFF" /><circle cx={20} cy={-14} r={2.4} fill="#FFF" />
      <ellipse cy={22} rx={17} ry={11} fill={c[1]} opacity={0.35} />
      <circle cx={-6} cy={22} r={2.6} fill="#1A0B24" /><circle cx={6} cy={22} r={2.6} fill="#1A0B24" />
      <path d="M-14,42 Q0,50 14,42" fill="none" stroke="#1A0B24" strokeWidth={4} strokeLinecap="round" />
      <path d="M-40,-44 Q-24,-58 -4,-50" fill="none" stroke="#FFF" strokeWidth={5} strokeLinecap="round" opacity={0.5} />
    </En>
  );
}

// ─── Instrumentos ────────────────────────────────────────────────────────────

/** Reloj de pared: `ang` es el giro de la manecilla larga (grados). */
export function Reloj({ x = 0, y = 0, k = 1, o = 1, ang = 0, tono = ['#6A35A0', '#9358F0', '#F4EAFF'] as Tono }: { x?: number; y?: number; k?: number; o?: number; ang?: number; tono?: Tono }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <circle cx={6} cy={8} r={62} fill={P.sombra} />
      <circle r={62} fill={tono[0]} /><circle cx={-2} cy={-3} r={55} fill={tono[2]} />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-2.2} y={-50} width={4.4} height={i % 3 ? 7 : 12} rx={2.2} fill={tono[0]} transform={`rotate(${i * 30})`} />)}
      <rect x={-3.2} y={-40} width={6.4} height={42} rx={3.2} fill={tono[1]} transform={`rotate(${ang})`} />
      <rect x={-3.8} y={-28} width={7.6} height={30} rx={3.8} fill={tono[0]} transform={`rotate(${ang / 12})`} />
      <circle r={7} fill={tono[0]} />
    </En>
  );
}

/** Marca de «sí» o «no» sobre un círculo de color. */
export function Sello({ x = 0, y = 0, k = 1, o = 1, ok = true, p = 1 }: { x?: number; y?: number; k?: number; o?: number; ok?: boolean; p?: number }) {
  if (p <= 0.01) return null;
  const c = ok ? ['#0E8A4A', '#23C46A'] : ['#B01034', '#F0334F'];
  return (
    <En x={x} y={y} k={k * (0.6 + 0.4 * easeBack(clamp(p)))} o={tramo(p, 0, 0.4) * o}>
      <circle cx={3} cy={4} r={26} fill={P.sombra} /><circle r={26} fill={c[0]} /><circle cx={-1} cy={-1} r={23} fill={c[1]} />
      {ok
        ? <path d="M-11,1 L-3,10 L12,-9" fill="none" stroke="#FFF" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M-9,-9 L9,9 M9,-9 L-9,9" fill="none" stroke="#FFF" strokeWidth={7} strokeLinecap="round" />}
    </En>
  );
}

/** Un chorrito de partículas verdes (el «goteo» de virus de la referencia): n puntos que caen de a a b con la fase del reloj. */
export function Goteo({ a, b, reloj, n = 10, R = 6, p = 1, tono = P.virus as Tono, vel = 0.0009 }: { a: P2; b: P2; reloj: number; n?: number; R?: number; p?: number; tono?: Tono; vel?: number }) {
  if (p <= 0.003) return null;
  return (
    <g opacity={clamp(p)}>
      {Array.from({ length: n }, (_, i) => {
        const u = (reloj * vel + hash(i, 5)) % 1;
        const px = lerp(a[0], b[0], u) + (hash(i, 6) - 0.5) * 70, py = lerp(a[1], b[1], u);
        return <circle key={i} cx={px} cy={py} r={R * (0.7 + hash(i, 7) * 0.7)} fill={i % 3 ? tono[1] : tono[2]} opacity={tramo(u, 0, 0.12) * (1 - tramo(u, 0.85, 1))} />;
      })}
    </g>
  );
}

/** Una nube de virus que flota (los racimos de la referencia): n viriones pequeños. */
export function Nube({ x = 800, y = 500, w = 1400, h = 700, n = 12, reloj = 0, k = 0.3, o = 1, sem = 1 }: { x?: number; y?: number; w?: number; h?: number; n?: number; reloj?: number; k?: number; o?: number; sem?: number }) {
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const px = x - w / 2 + hash(i, sem) * w + Math.sin(reloj / 1300 + i * 2.1) * 18;
        const py = y - h / 2 + hash(i, sem + 3) * h + Math.cos(reloj / 1100 + i * 1.7) * 16;
        return <Virion key={i} x={px} y={py} k={k * (0.6 + 0.8 * hash(i, sem + 7))} r={hash(i, sem + 9) * 360} reloj={reloj + i * 300} />;
      })}
    </g>
  );
}

/** *Treponema pallidum*: un sacacorchos delgado que gira con el reloj (los flagelos internos lo hacen avanzar). */
export function Treponema({ x = 0, y = 0, w = 300, k = 1, o = 1, r = 0, reloj = 0, fase = 0, amp = 15, vueltas = 6, grosor = 10, tono = P.esp as Tono }: { x?: number; y?: number; w?: number; k?: number; o?: number; r?: number; reloj?: number; fase?: number; amp?: number; vueltas?: number; grosor?: number; tono?: Tono }) {
  const n = 56;
  let d = '';
  for (let i = 0; i <= n; i++) {
    const u = i / n, th = u * vueltas * Math.PI * 2 - reloj / 240 + fase;
    d += `${i ? ' L' : 'M'}${(-w / 2 + u * w).toFixed(1)},${(Math.sin(th) * amp * (0.55 + 0.45 * Math.sin(u * Math.PI))).toFixed(1)}`;
  }
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <path d={d} fill="none" stroke={P.sombra} strokeWidth={grosor + 4} strokeLinecap="round" strokeLinejoin="round" transform="translate(5,7)" />
      <path d={d} fill="none" stroke={tono[0]} strokeWidth={grosor + 3} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={tono[1]} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={tono[2]} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} transform="translate(-1,-3)" />
    </En>
  );
}

/** Signo «+» en un círculo rojo (resultado positivo) o «−» en uno verde (negativo). */
export function Signo({ x = 0, y = 0, k = 1, o = 1, mas = true, p = 1 }: { x?: number; y?: number; k?: number; o?: number; mas?: boolean; p?: number }) {
  if (p <= 0.01) return null;
  const c = mas ? P.sangre : (['#0E8A4A', '#23C46A', '#9BF0BC'] as const);
  return (
    <En x={x} y={y} k={k * (0.6 + 0.4 * easeBack(clamp(p)))} o={tramo(p, 0, 0.4) * o}>
      <circle cx={3} cy={4} r={28} fill={P.sombra} /><circle r={28} fill={c[0]} /><circle cx={-1.5} cy={-1.5} r={25} fill={c[1]} />
      <path d={mas ? 'M-13,0 L13,0 M0,-13 L0,13' : 'M-13,0 L13,0'} fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" />
    </En>
  );
}

/** Medallón de zoom, como los de «ejemplo para esquematizar»: disco oscuro con un aro ámbar grueso. `id` único por lámina. */
export function Medallon({ x = 0, y = 0, R = 150, id, children, o = 1, aro = '#F2A33A', fondo = '#241062' }: { x?: number; y?: number; R?: number; id: string; children?: ReactNode; o?: number; aro?: string; fondo?: string }) {
  return (
    <En x={x} y={y} o={o}>
      <circle cx={7} cy={9} r={R + 14} fill={P.sombra} />
      <circle r={R + 14} fill={aro} />
      <circle r={R} fill={fondo} />
      <clipPath id={`md-${id}`}><circle r={R} /></clipPath>
      <g clipPath={`url(#md-${id})`}>{children}</g>
      <path d={`M${-R * 0.8},${-R * 0.4} Q${-R * 0.62},${-R * 0.8} ${-R * 0.2},${-R * 0.92}`} fill="none" stroke="#FFF" strokeWidth={9} strokeLinecap="round" opacity={0.16} />
    </En>
  );
}

/** Texto dentro de un grupo ya colocado (sin el ajuste a los bordes de `Txt`): la letra de una bola, la cifra de un icono. */
export function Letra({ x = 0, y = 0, txt, t = 30, color = '#FFF' }: { x?: number; y?: number; txt: string; t?: number; color?: string }) {
  return <text x={x} y={y} dy="0.35em" textAnchor="middle" className={vs.letra} style={{ fontSize: t, fill: color }}>{txt}</text>;
}

/** Una polilínea que se va dibujando: `p` es la fracción del recorrido. */
export function Trazo({ pts, p, color, w = 10, o = 1 }: { pts: [number, number][]; p: number; color: string; w?: number; o?: number }) {
  if (p <= 0.004) return null;
  const lon = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = lon.reduce((a, b) => a + b, 0);
  let falta = total * clamp(p), d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < lon.length && falta > 0; i++) {
    const f = Math.min(1, falta / lon[i]);
    d += ` L${(pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f).toFixed(1)},${(pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f).toFixed(1)}`;
    falta -= lon[i];
  }
  return <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={o < 1 ? o : undefined} />;
}

/** Un anillo amarillo con centro naranja: un ganglio marcado (como en las referencias). */
export function Nodo({ x, y, p = 1, k = 1 }: { x: number; y: number; p?: number; k?: number }) {
  return (
    <Sale p={p} x={x} y={y} k={k}>
      <circle r={20} fill="#FFD21C" /><circle r={11} fill="#FF8A1E" /><circle cx={-4} cy={-5} r={3.6} fill="#FFF" opacity={0.8} />
    </Sale>
  );
}

/** Un escudo en tres capas; `rotura` 0-1 lo parte en cuatro trozos que se separan y giran (el sistema inmunitario que se desarma). */
export function Escudo({ x = 0, y = 0, k = 1, o = 1, rotura = 0, id = 'esc', tono = P.rt as Tono }: { x?: number; y?: number; k?: number; o?: number; rotura?: number; id?: string; tono?: Tono }) {
  const cuerpo = 'M0,-100 C34,-78 66,-72 78,-68 L78,8 C78,56 38,90 0,110 C-38,90 -78,56 -78,8 L-78,-68 C-66,-72 -34,-78 0,-100 Z';
  const dentro = 'M0,-84 C28,-66 56,-60 64,-57 L64,6 C64,46 32,74 0,92 C-32,74 -64,46 -64,6 L-64,-57 C-56,-60 -28,-66 0,-84 Z';
  const q = easeOut(clamp(rotura));
  const trozos: { rect: [number, number, number, number]; dx: number; dy: number; giro: number }[] = [
    { rect: [-100, -120, 100, 130], dx: -1, dy: -0.6, giro: -14 },
    { rect: [0, -120, 100, 130], dx: 1, dy: -0.8, giro: 12 },
    { rect: [-100, 10, 100, 120], dx: -0.7, dy: 1, giro: 9 },
    { rect: [0, 10, 100, 120], dx: 0.8, dy: 1.1, giro: -11 },
  ];
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d={cuerpo} fill={P.sombra} transform={`translate(8,10) scale(${1 - 0.1 * q})`} opacity={1 - q} />
      {trozos.map((t, i) => (
        <g key={i} transform={`translate(${(t.dx * 24 * q).toFixed(1)},${(t.dy * 24 * q).toFixed(1)}) rotate(${(t.giro * 0.7 * q).toFixed(1)})`}>
          <clipPath id={`${id}-${i}`}><rect x={t.rect[0]} y={t.rect[1]} width={t.rect[2]} height={t.rect[3]} /></clipPath>
          <g clipPath={`url(#${id}-${i})`}>
            <path d={cuerpo} fill={tono[0]} />
            <path d={dentro} fill={tono[1]} />
            <path d="M-50,-46 Q-20,-62 6,-60" fill="none" stroke="#FFF" strokeWidth={9} strokeLinecap="round" opacity={0.7} />
            <path d="M0,-40 L0,62 M-34,10 L34,10" fill="none" stroke={tono[2]} strokeWidth={14} strokeLinecap="round" opacity={0.85} />
          </g>
        </g>
      ))}
    </En>
  );
}

/** Un caracol de perfil mirando a la derecha: «lenti» = lento. */
export function Caracol({ x = 0, y = 0, k = 1, o = 1, reloj = 0 }: { x?: number; y?: number; k?: number; o?: number; reloj?: number }) {
  const esp = Array.from({ length: 41 }, (_, i) => {
    const t = (i / 40) * Math.PI * 4.2;
    const r = 5 + 5.2 * t;
    return `${i ? 'L' : 'M'}${(-18 + Math.cos(t + 0.6) * r).toFixed(1)},${(2 + Math.sin(t + 0.6) * r).toFixed(1)}`;
  }).join(' ');
  const ant = Math.sin(reloj / 700) * 5;
  return (
    <En x={x} y={y} k={k} o={o}>
      <ellipse cx={16} cy={88} rx={118} ry={14} fill={P.sombra} />
      <path d="M-96,66 Q-96,84 -64,84 L84,84 Q112,84 112,62 Q112,40 100,28" fill="none" stroke={P.menta[0]} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-92,62 Q-92,76 -64,76 L84,76 Q104,76 104,60 Q104,44 94,32" fill="none" stroke={P.menta[1]} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M96,22 L${92 + ant},-32`} fill="none" stroke={P.menta[0]} strokeWidth={9} strokeLinecap="round" />
      <path d={`M114,28 L${130 - ant},-22`} fill="none" stroke={P.menta[0]} strokeWidth={9} strokeLinecap="round" />
      <circle cx={92 + ant} cy={-34} r={11} fill={P.menta[1]} /><circle cx={130 - ant} cy={-24} r={11} fill={P.menta[1]} />
      <circle cx={95 + ant} cy={-34} r={4.4} fill="#1A0B3A" /><circle cx={133 - ant} cy={-24} r={4.4} fill="#1A0B3A" />
      <circle cx={-18} cy={2} r={72} fill={P.espiga[0]} />
      <circle cx={-22} cy={-2} r={64} fill={P.espiga[1]} />
      <path d={esp} fill="none" stroke={P.espiga[0]} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-62,-30 Q-40,-60 -4,-60" fill="none" stroke="#FFF" strokeWidth={9} strokeLinecap="round" opacity={0.7} />
    </En>
  );
}

/** Un globo terráqueo plano (océano, tierras y brillo). */
export function Mundo({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <circle cx={7} cy={9} r={78} fill={P.sombra} />
      <circle r={78} fill="#1F46C8" /><circle cx={-3} cy={-3} r={72} fill="#3A7CF0" />
      <clipPath id="mundo-rec"><circle r={72} /></clipPath>
      <g clipPath="url(#mundo-rec)">
        <path d="M-58,-44 C-42,-66 -20,-66 -10,-50 C-4,-38 -16,-30 -22,-18 C-26,-6 -20,2 -24,12 C-28,26 -36,34 -42,48 C-48,54 -56,50 -54,38 C-52,24 -44,14 -48,2 C-52,-12 -66,-26 -58,-44 Z" fill="#35D08A" />
        <path d="M16,-56 C30,-64 46,-58 48,-44 C50,-32 40,-26 36,-16 C42,-6 46,10 38,26 C32,40 22,48 14,40 C10,28 14,14 8,2 C2,-8 4,-24 10,-36 C12,-44 12,-52 16,-56 Z" fill="#35D08A" />
        <path d="M-52,-34 C-38,-52 -22,-54 -14,-44" fill="none" stroke="#B6F5D8" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
      </g>
      <path d="M-56,-30 Q-44,-58 -12,-66" fill="none" stroke="#FFF" strokeWidth={9} strokeLinecap="round" opacity={0.55} />
    </En>
  );
}

/** Una llave: el origen es la punta y el cuerpo se extiende hacia −x. `forma` 1 punta redonda, 2 punta cuadrada. */
export function Llave({ x = 0, y = 0, k = 1, o = 1, r = 0, forma = 1, tono = P.canal as Tono }: { x?: number; y?: number; k?: number; o?: number; r?: number; forma?: 1 | 2; tono?: Tono }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <g transform="translate(4,5)" opacity={0.3}>
        <rect x={-96} y={-7} width={96} height={14} rx={7} fill="#000" />
        <circle cx={-112} cy={0} r={26} fill="#000" />
      </g>
      <rect x={-98} y={-7.5} width={98} height={15} rx={7.5} fill={tono[0]} />
      <rect x={-98} y={-7.5} width={98} height={9} rx={4.5} fill={tono[1]} />
      {forma === 1 ? <circle cx={-6} cy={0} r={12} fill={tono[0]} /> : <rect x={-20} y={-13} width={24} height={26} rx={4} fill={tono[0]} />}
      {forma === 1 ? <circle cx={-8} cy={-2} r={8.5} fill={tono[1]} /> : <rect x={-17} y={-10} width={18} height={18} rx={3} fill={tono[1]} />}
      <circle cx={-114} cy={0} r={27} fill={tono[0]} />
      <circle cx={-116} cy={-2} r={22} fill={tono[1]} />
      <circle cx={-118} cy={0} r={9.5} fill={P.interior} />
      <path d="M-134,-14 Q-124,-26 -108,-22" fill="none" stroke="#FFF" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
    </En>
  );
}

/** Un candado cuyo ojo de cerradura tiene forma (1 redondo, 2 cuadrado), para que la llave de su misma forma encaje. */
export function Cerrojo({ x = 0, y = 0, k = 1, o = 1, forma = 1, tono = P.rt as Tono }: { x?: number; y?: number; k?: number; o?: number; forma?: 1 | 2; tono?: Tono }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M-36,-24 L-36,-62 A36,36 0 0 1 36,-62 L36,-24" fill="none" stroke={P.sombra} strokeWidth={20} strokeLinecap="round" transform="translate(6,8)" />
      <path d="M-36,-24 L-36,-62 A36,36 0 0 1 36,-62 L36,-24" fill="none" stroke="#7A7F9C" strokeWidth={18} strokeLinecap="round" />
      <path d="M-36,-24 L-36,-62 A36,36 0 0 1 36,-62" fill="none" stroke="#C9CDE4" strokeWidth={7} strokeLinecap="round" />
      <rect x={-72} y={-28} width={144} height={118} rx={20} fill={P.sombra} transform="translate(8,9)" />
      <rect x={-72} y={-28} width={144} height={118} rx={20} fill={tono[0]} />
      <rect x={-72} y={-28} width={136} height={108} rx={18} fill={tono[1]} />
      <path d="M-56,-10 Q-40,-20 -8,-20" fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
      {forma === 1 ? <circle cx={0} cy={22} r={14} fill={P.interior} /> : <rect x={-14} y={8} width={28} height={28} rx={4} fill={P.interior} />}
      <rect x={-6} y={30} width={12} height={32} rx={5} fill={P.interior} />
    </En>
  );
}

/** Una medalla dorada con su cinta (el Nobel). */
export function Medalla({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  const estrella = Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 17 : 38; return `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; }).join(' ') + ' Z';
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M-46,-140 L-6,-140 L34,-40 L-8,-40 Z" fill="#2A4FC0" /><path d="M46,-140 L6,-140 L-34,-40 L8,-40 Z" fill="#E5324C" />
      <circle cx={6} cy={8} r={72} fill={P.sombra} />
      <circle r={72} fill="#C98A00" /><circle cx={-2} cy={-3} r={65} fill="#FFC21A" /><circle r={52} fill="#FFE27A" />
      <path d={estrella} fill="#E0A100" />
      <path d="M-50,-26 Q-34,-52 -4,-56" fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" opacity={0.8} />
    </En>
  );
}

/** Una corchea: una nota musical. */
export function Nota({ x = 0, y = 0, k = 1, o = 1, r = 0, color = P.hla[1] }: { x?: number; y?: number; k?: number; o?: number; r?: number; color?: string }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <rect x={6} y={-44} width={6} height={56} rx={3} fill={color} />
      <path d="M10,-44 Q38,-38 32,-12 Q26,-26 10,-28 Z" fill={color} />
      <ellipse cx={-2} cy={12} rx={14} ry={10} fill={color} transform="rotate(-20 -2 12)" />
      <ellipse cx={-6} cy={9} rx={5} ry={3} fill="#FFF" opacity={0.55} transform="rotate(-20 -6 9)" />
    </En>
  );
}

/** Un receptor HLA de la célula (tallo y dos lóbulos magenta), que el virión se lleva al brotar. Mira hacia −y. */
export function Hla({ x = 0, y = 0, k = 1, o = 1, r = 0, tono = P.hla as Tono }: { x?: number; y?: number; k?: number; o?: number; r?: number; tono?: Tono }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <rect x={-4.5} y={-18} width={9} height={22} rx={4.5} fill={tono[0]} />
      <ellipse cx={-7} cy={-22} rx={9} ry={6.5} fill={tono[0]} /><ellipse cx={8} cy={-22} rx={9} ry={6.5} fill={tono[0]} />
      <ellipse cx={-8} cy={-24} rx={6.5} ry={4.4} fill={tono[1]} /><ellipse cx={7} cy={-24} rx={6.5} ry={4.4} fill={tono[1]} />
      <circle cx={-10} cy={-26} r={2} fill="#FFF" opacity={0.8} />
    </En>
  );
}

/** El sol (desecación): disco con rayos que giran despacio. */
export function Sol({ x = 0, y = 0, k = 1, o = 1, reloj = 0 }: { x?: number; y?: number; k?: number; o?: number; reloj?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <g transform={`rotate(${(reloj / 60) % 360})`}>
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-5} y={-66} width={10} height={i % 2 ? 18 : 28} rx={5} fill={P.espiga[1]} transform={`rotate(${i * 30})`} />)}
      </g>
      <circle cx={4} cy={5} r={40} fill={P.sombra} />
      <circle r={40} fill="#F59A0A" /><circle cx={-2} cy={-2} r={34} fill="#FFD21C" /><circle cx={-12} cy={-12} r={9} fill="#FFF" opacity={0.8} />
    </En>
  );
}

/** Burbujas de jabón: cuatro esferas translúcidas con su brillo. */
export function Burbujas({ x = 0, y = 0, k = 1, o = 1, reloj = 0 }: { x?: number; y?: number; k?: number; o?: number; reloj?: number }) {
  const bs: [number, number, number][] = [[-22, 8, 34], [26, -14, 26], [30, 34, 20], [-6, -40, 16]];
  return (
    <En x={x} y={y} k={k} o={o}>
      {bs.map(([bx, by, R], i) => (
        <g key={i} transform={`translate(${bx},${by + Math.sin(reloj / 500 + i * 1.7) * 4})`}>
          <circle r={R} fill="#7FD8FF" opacity={0.55} /><circle r={R - 4} fill="#CFF1FF" opacity={0.55} />
          <path d={`M${-R * 0.6},${-R * 0.2} Q${-R * 0.5},${-R * 0.7} ${R * 0.1},${-R * 0.75}`} fill="none" stroke="#FFF" strokeWidth={Math.max(3, R * 0.2)} strokeLinecap="round" opacity={0.9} />
        </g>
      ))}
    </En>
  );
}

/** Una diana: anillos rojos y blancos (el blanco de un fármaco). */
export function Diana({ x = 0, y = 0, k = 1, o = 1, p = 1 }: { x?: number; y?: number; k?: number; o?: number; p?: number }) {
  if (p <= 0.01) return null;
  return (
    <En x={x} y={y} k={k * (0.6 + 0.4 * easeBack(clamp(p)))} o={tramo(p, 0, 0.4) * o}>
      <circle cx={3} cy={4} r={36} fill={P.sombra} />
      <circle r={36} fill="#E5324C" /><circle r={28} fill="#FFF" /><circle r={20} fill="#E5324C" /><circle r={12} fill="#FFF" /><circle r={6} fill="#E5324C" />
    </En>
  );
}

/** Unas tijeras (la proteasa corta): `abre` 0-1 separa las hojas. */
export function Tijeras({ x = 0, y = 0, k = 1, o = 1, r = 0, abre = 0.5, tono = P.prot as Tono }: { x?: number; y?: number; k?: number; o?: number; r?: number; abre?: number; tono?: Tono }) {
  const a = 8 + 22 * clamp(abre);
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      {[-1, 1].map((l) => (
        <g key={l} transform={`rotate(${l * a})`}>
          <rect x={-6} y={-78} width={12} height={78} rx={6} fill={tono[0]} />
          <rect x={-3} y={-78} width={5} height={70} rx={2.5} fill="#E8ECF8" />
          <circle cx={l * 15} cy={34} r={16} fill={tono[0]} /><circle cx={l * 15} cy={34} r={8} fill={P.interior} />
        </g>
      ))}
      <circle r={7} fill={tono[1]} />
    </En>
  );
}

/** Una célula dendrítica: cuerpo redondo con brazos que se afinan (como las ramas de un árbol). */
export function Dendritica({ x = 0, y = 0, k = 1, o = 1, r = 0, tono = P.dc as Tono, brazos = 7 }: { x?: number; y?: number; k?: number; o?: number; r?: number; tono?: Tono; brazos?: number }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      {Array.from({ length: brazos }, (_, i) => {
        const a = (i / brazos) * 360 + 14, L = 70 + hash(i, 2) * 26;
        return (
          <g key={i} transform={`rotate(${a})`}>
            <path d={`M-13,-24 L-5,${-L} Q0,${-L - 14} 5,${-L} L13,-24 Z`} fill={tono[0]} />
            <path d={`M-9,-26 L-3,${-L + 4} Q0,${-L - 6} 3,${-L + 4} L9,-26 Z`} fill={tono[1]} />
          </g>
        );
      })}
      <circle r={46} fill={tono[0]} /><circle cx={-3} cy={-3} r={41} fill={tono[1]} />
      <circle cx={6} cy={6} r={22} fill="#4B1A6E" /><circle cx={5} cy={4} r={17} fill="#7B34B0" />
      <path d="M-30,-18 Q-22,-34 -6,-36" fill="none" stroke="#FFF" strokeWidth={7} strokeLinecap="round" opacity={0.8} />
    </En>
  );
}

/** La microglía: un cuerpo pequeño con ramas finas que se bifurcan (turquesa). */
export function Microglia({ x = 0, y = 0, k = 1, o = 1, r = 0, tono = P.esp as Tono }: { x?: number; y?: number; k?: number; o?: number; r?: number; tono?: Tono }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      {[0, 70, 140, 215, 290].map((a) => (
        <g key={a} transform={`rotate(${a})`} fill="none" strokeLinecap="round">
          <path d="M0,-18 L0,-64 M0,-44 L-22,-80 M0,-52 L20,-84" stroke={tono[0]} strokeWidth={11} />
          <path d="M0,-18 L0,-64 M0,-44 L-22,-80 M0,-52 L20,-84" stroke={tono[1]} strokeWidth={6} />
        </g>
      ))}
      <circle r={30} fill={tono[0]} /><circle cx={-2} cy={-2} r={26} fill={tono[1]} /><circle cx={3} cy={3} r={13} fill="#0A4C55" />
      <circle cx={-10} cy={-11} r={6} fill="#FFF" opacity={0.75} />
    </En>
  );
}

/** El hueco con forma de cerradura que queda al final de cada estación del ciclo: vacío (`lleno` 0) o relleno por un fármaco (`lleno` 1, con su `tono`). */
export function Hueco({ x = 0, y = 0, k = 1, o = 1, p = 1, lleno = 0, tono = P.canal as Tono, brilla = 0 }: { x?: number; y?: number; k?: number; o?: number; p?: number; lleno?: number; tono?: Tono; brilla?: number }) {
  if (p <= 0.01) return null;
  const llen = easeOut(clamp(lleno));
  const forma = 'M0,-52 A30,30 0 1 1 -0.1,-52 Z M-15,-6 L15,-6 L26,60 L-26,60 Z';
  return (
    <En x={x} y={y} k={k * (0.6 + 0.4 * easeBack(clamp(p)))} o={tramo(p, 0, 0.4) * o}>
      <path d={forma} fill={P.sombra} transform="translate(5,6)" />
      <path d={forma} fill={P.interior} />
      <path d={forma} fill="none" stroke={P.espiga[1]} strokeWidth={6} strokeDasharray="10 9" strokeLinecap="round" opacity={1 - llen * 0.7 + 0.25 * brilla} />
      {llen > 0.01 && (
        <g opacity={llen}>
          <path d={forma} fill={tono[0]} /><path d={forma} fill={tono[1]} transform="translate(-2,-2) scale(0.93)" />
          <circle cx={-10} cy={-62} r={8} fill="#FFF" opacity={0.7} />
        </g>
      )}
    </En>
  );
}

/** Una puerta con su marco: `abre` 0-1 la hace girar sobre su bisagra (izquierda) y deja ver el interior. */
export function Puerta({ x = 0, y = 0, k = 1, o = 1, abre = 0, tono = P.inte as Tono, interior = P.interior as string }: { x?: number; y?: number; k?: number; o?: number; abre?: number; tono?: Tono; interior?: string }) {
  const a = easeOut(clamp(abre));
  const w = 260 * (1 - 0.82 * a);
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-150} y={-222} width={300} height={444} rx={34} fill={P.sombra} transform="translate(8,9)" />
      <rect x={-150} y={-222} width={300} height={444} rx={34} fill={tono[0]} />
      <rect x={-130} y={-202} width={260} height={404} rx={24} fill={interior} />
      <g opacity={0.9}>
        <circle cx={0} cy={-20} r={60} fill={P.cd4[1]} opacity={0.35 * a} /><circle cx={30} cy={60} r={40} fill={P.cd4[2]} opacity={0.25 * a} />
      </g>
      <rect x={-130} y={-202} width={w} height={404} rx={24} fill={tono[1]} />
      <rect x={-130 + 8} y={-190} width={Math.max(0, w - 16)} height={30} rx={12} fill="#FFF" opacity={0.25} />
    </En>
  );
}

/** Un guardia: la defensa de la célula (factor de restricción). Casco, ojos serios, escudo y lanza. */
export function Guardia({ x = 0, y = 0, k = 1, o = 1, r = 0, tono = P.inte as Tono, serio = 1 }: { x?: number; y?: number; k?: number; o?: number; r?: number; tono?: Tono; serio?: number }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <ellipse cx={6} cy={64} rx={54} ry={9} fill={P.sombra} />
      <rect x={52} y={-70} width={7} height={140} rx={3.5} fill="#8A86A8" />
      <path d="M44,-70 L56,-98 L68,-70 Z" fill="#E8ECF8" />
      <circle r={52} fill={tono[0]} /><circle cx={-3} cy={-3} r={47} fill={tono[1]} />
      <path d="M-52,-6 A52,52 0 0 1 52,-6 L40,-14 Q0,-30 -40,-14 Z" fill={tono[0]} />
      <path d="M-4,-58 Q4,-86 22,-80 Q10,-70 8,-56 Z" fill={P.sangre[1]} />
      <circle cx={-18} cy={8} r={10} fill="#FFF" /><circle cx={18} cy={8} r={10} fill="#FFF" />
      <circle cx={-17} cy={9} r={5} fill="#1A0B3A" /><circle cx={19} cy={9} r={5} fill="#1A0B3A" />
      <path d={`M-30,${-2 + (1 - serio) * 4} L-8,${4 - (1 - serio) * 2} M30,${-2 + (1 - serio) * 4} L8,${4 - (1 - serio) * 2}`} fill="none" stroke={tono[0]} strokeWidth={6} strokeLinecap="round" />
      <path d="M-14,32 L14,32" fill="none" stroke={tono[0]} strokeWidth={5} strokeLinecap="round" />
      <path d="M-64,-4 L-30,-14 L-30,42 Q-30,64 -47,74 Q-64,64 -64,42 Z" fill="#E5324C" />
      <path d="M-58,2 L-36,-4 L-36,40 Q-36,58 -47,66 Q-58,58 -58,40 Z" fill="#FF7A7F" />
      <path d="M-47,6 L-47,52 M-58,28 L-36,28" fill="none" stroke="#FFF" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
    </En>
  );
}

export const HILLS: [number, string, number][] = [[0, '#C23AAE', 40], [70, '#9A1E98', 46], [80, '#6B1470', 52]];
export const ROSAS = ['#F9D0E1', '#F5B8D2', '#EFA0C4', '#E588B6', '#D970A8', '#C95A98', '#B84588'];

/** Epitelio escamoso estratificado: filas de células aplanadas arriba y redondeadas abajo. */
export function Escamoso({ x0, x1, y, filas = 7, o = 1 }: { x0: number; x1: number; y: number; filas?: number; o?: number }) {
  const n = Math.floor((x1 - x0) / 58);
  return (
    <g opacity={o}>
      {Array.from({ length: filas }, (_, f) => {
        const ry = f < 3 ? 10 + f * 2 : 17, yy = y + f * 27;
        return Array.from({ length: n }, (_, i) => {
          const cx = x0 + 30 + i * 58 + (f % 2) * 29;
          return (
            <g key={`${f}-${i}`}>
              <ellipse cx={cx} cy={yy} rx={34} ry={ry + 2} fill={ROSAS[Math.min(6, f)]} />
              <ellipse cx={cx - 2} cy={yy - 1} rx={30} ry={ry - 2} fill={ROSAS[Math.max(0, f - 1)]} />
              <circle cx={cx + 2} cy={yy} r={5} fill="#7B2A78" opacity={f < 2 ? 0.2 : 0.7} />
            </g>
          );
        });
      })}
    </g>
  );
}


/** Contenedor para dibujar dentro de un recorte circular o rectangular (para cortes y zooms). */
export function Recorte({ id, children, x = 0, y = 0, w, h, R, o = 1 }: { id: string; children: ReactNode; x?: number; y?: number; w?: number; h?: number; R?: number; o?: number }) {
  return (
    <g opacity={o}>
      <clipPath id={`rc-${id}`}>{R ? <circle cx={x} cy={y} r={R} /> : <rect x={x} y={y} width={w ?? 100} height={h ?? 100} />}</clipPath>
      <g clipPath={`url(#rc-${id})`}>{children}</g>
    </g>
  );
}
