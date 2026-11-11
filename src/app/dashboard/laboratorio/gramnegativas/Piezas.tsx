'use client';
// Piezas del laboratorio «Infecciones bacterianas por gramnegativas» (clase AI18), en el
// estilo de las referencias de BUST (infografía plana de colores saturados): formas
// redondeadas sin contorno; cada objeto lleva un tono más oscuro de base, el cuerpo claro,
// una media luna de sombra y un brillo; los iconos sueltos, una sombra dura desplazada
// hacia abajo a la derecha (referencia de los órganos). Lienzo de 1600 × 1000, sin `filter`.
//
// Lo que ya existe en Vasculitis, Citopenias y Fisio se reexporta tal cual (no se copia);
// aquí solo lo propio del tema: bacterias, intestino, moco, uniones, pacientes en UCI…

import { type ReactNode } from 'react';
import { En, clamp, easeBack, easeOut, hash, tramo } from '../vasculitis-anca/Piezas';

export { En, Sale, Flecha, Txt, Rotulo, IgG, Linfocito, Macrofago, Plasmatica, Plaqueta, Esfera, clamp, tramo, lerp, easeOut, easeBack, hash, blob } from '../vasculitis-anca/Piezas';
export { Barra, Lente, viaje, FLECHA, Cruz, Visto } from '../vasculitis-anca/Piezas';
export { V, Bola, Bandera, Tarjeta, Pantalla, TxtPantalla, Hematie, Neutrofilo, Eosinofilo, Vaso, Paciente, Perfil, Cuerpo, Punto, Rinon, Glomerulo, Pulmones, Corazon, LineaTiempo, Foco, Llamada, Pista, Manometro } from '../vasculitis-anca/Piezas';
export { Termometro, Frasco, Pastilla, Jeringa, BolsaSangre, Virus, Micoplasma, Higado, Cerebro, Bazo, Chorro } from '../citopenias-autoinmunes/Piezas';
export { Endo, Union, Basal, Intersticio, Pericito, Tijera, Enzima, Tnf, Il1, Chip, Viaja, Selectina, Fibrina, mezcla } from '../vasculitis-anca/Fisio';

/** Colores propios (oscuro → claro). Patógeno = coral; comensal = turquesa; grampositiva = violeta-azul. */
export const G = {
  patogeno: ['#A82E0B', '#F2703A', '#FFB48A'],
  comensal: ['#0A7F86', '#16B9BE', '#7FEDE8'],
  grampos: ['#3B2A9E', '#6D5AE0', '#B3A8FF'],
  epitelio: ['#5A1590', '#A32BC4', '#E26AE0'],
  mucoso: ['#3E9E85', '#8FDDBF', '#D3F7E8'],
  micro: '#FF8AD0',
  sombra: 'rgba(40,10,80,0.26)',
  cama: ['#6B49B8', '#9C82DD', '#E2D8F8'],
  azul: ['#1E56C6', '#3B82F0', '#BFDBFF'],
  amarillo: ['#E0A100', '#FFD23F', '#FFF0A8'],
  rosa: ['#C23A6E', '#F27BA0', '#FFB3C9'],
  toxina: ['#5E8A00', '#9AD21C', '#E2F59A'],
} as const;

/** Colores de TEXTO que se adaptan al tema (variables de `gramnegativas.module.css`): legibles en claro y en oscuro. */
export const TXTC = {
  patogeno: 'var(--gn-patogeno)', grampos: 'var(--gn-grampos)', epitelio: 'var(--gn-epitelio)', mucoso: 'var(--gn-mucoso)', amarillo: 'var(--gn-amarillo)', comensal: 'var(--gn-comensal)',
  sangre: 'var(--gn-sangre)', violeta: 'var(--gn-violeta)', ambar: 'var(--gn-ambar)', rosa: 'var(--gn-rosa)', verde: 'var(--gn-verde)',
} as const;

// ─── Bacterias ────────────────────────────────────────────────────────────────

/** Bacilo gramnegativo (o comensal/grampositivo según `tono`): membrana oscura, cuerpo claro, nucleoide de color y brillo.
 *  `fimbrias` 0-1 (pelitos), `flagelo` 0-1, `capsula` 0-1 (halo translúcido). */
export function Bacilo({ x = 0, y = 0, r = 0, k = 1, o = 1, tono = G.patogeno as readonly string[], largo = 112, alto = 46, fimbrias = 0, flagelo = 0, capsula = 0, sombra = false, reloj = 0 }: { x?: number; y?: number; r?: number; k?: number; o?: number; tono?: readonly string[]; largo?: number; alto?: number; fimbrias?: number; flagelo?: number; capsula?: number; sombra?: boolean; reloj?: number }) {
  const L = largo / 2, H = alto / 2;
  const pelos = Math.round(14 * clamp(fimbrias));
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      {capsula > 0.01 && <rect x={-L - 16 * capsula} y={-H - 16 * capsula} width={largo + 32 * capsula} height={alto + 32 * capsula} rx={H + 16 * capsula} fill={tono[2]} opacity={0.38 * clamp(capsula)} />}
      {flagelo > 0.01 && <path d={`M${L - 6},2 ${Array.from({ length: 9 }, (_, i) => `Q${(L + 10 + i * 18).toFixed(1)},${(Math.sin(i * 1.7 + reloj / 260) * 16 * (i % 2 ? 1 : -1)).toFixed(1)} ${(L + 18 + i * 18 + 10).toFixed(1)},${(Math.sin(i * 1.7 + reloj / 260 + 1) * 6).toFixed(1)}`).join(' ')}`} fill="none" stroke={tono[1]} strokeWidth={5} strokeLinecap="round" strokeDasharray={`${easeOut(clamp(flagelo)) * 260} 400`} />}
      {Array.from({ length: pelos }, (_, i) => {
        const lado = i % 2 ? 1 : -1, px = -L + 14 + (i >> 1) * ((largo - 28) / Math.max(1, (pelos >> 1) - 1)), len = 20 + hash(i, 5) * 12;
        return <path key={i} d={`M${px.toFixed(1)},${lado * (H - 2)} q${(hash(i, 6) * 12 - 6).toFixed(1)},${lado * len * 0.6} ${(hash(i, 7) * 14 - 7).toFixed(1)},${lado * len}`} fill="none" stroke={tono[1]} strokeWidth={3} strokeLinecap="round" opacity={clamp(fimbrias)} />;
      })}
      {sombra && <rect x={-L + 7} y={-H + 8} width={largo} height={alto} rx={H} fill={G.sombra} />}
      <rect x={-L} y={-H} width={largo} height={alto} rx={H} fill={tono[0]} />
      <rect x={-L + 3} y={-H + 1} width={largo - 8} height={alto - 7} rx={H - 3} fill={tono[1]} />
      <circle cx={L * 0.12} cy={H * 0.08} r={H * 0.5} fill={tono[0]} /><circle cx={L * 0.08} cy={H * 0.03} r={H * 0.34} fill={tono[2]} />
      <path d={`M${-L + H * 0.7},${-H * 0.5} Q${-L + H},${-H * 0.82} ${-L * 0.35},${-H * 0.78}`} fill="none" stroke={tono[2]} strokeWidth={Math.max(4, H * 0.18)} strokeLinecap="round" opacity={0.9} />
    </En>
  );
}

/** Sombra de piso (elipse suave) para objetos que se apoyan. */
export function Piso({ x, y, w = 200, o = 1 }: { x: number; y: number; w?: number; o?: number }) {
  return <ellipse cx={x} cy={y} rx={w / 2} ry={w * 0.09} fill={G.sombra} opacity={o} />;
}

/** El icono flota solo, con su sombra en el suelo. `rl`: el reloj de la lámina (ms). */
export function Flota({ x, y, k = 1, o = 1, rl, fase = 0, alto = 70, children }: { x: number; y: number; k?: number; o?: number; rl: number; fase?: number; alto?: number; children: ReactNode }) {
  const s = Math.sin(rl / 700 + fase);
  return (
    <g opacity={o}>
      <ellipse cx={x} cy={y + alto} rx={52 * k * (1 - 0.08 * s)} ry={9 * k} fill={G.sombra} />
      <En x={x} y={y - 9 * s} k={k}>{children}</En>
    </g>
  );
}

// ─── Terreno: capas festoneadas (referencia «membrana celular») ──────────────

/** Banda con el borde de arriba en nubes, de x0 a x0 + w, que baja hasta `fondo`. */
function banda(x0: number, w: number, y: number, fondo: number, r: number, sem: number) {
  const n = Math.max(2, Math.round(w / (r * 1.7))), paso = w / n;
  let d = `M${x0},${fondo} L${x0},${y}`;
  for (let i = 0; i < n; i++) {
    const rr = r * (0.75 + hash(i, sem) * 0.6), xa = x0 + i * paso;
    d += ` Q${(xa + paso / 2).toFixed(1)},${(y - rr * 1.5).toFixed(1)} ${(xa + paso).toFixed(1)},${y}`;
  }
  return `${d} L${x0 + w},${fondo} Z`;
}

/** Pila de bandas festoneadas (la de arriba es la más lejana). `bandas`: [alto desde la anterior, color, radio]. */
export function Capas({ x = 800, y = 0, w = 1700, fondo = 400, bandas, sem = 1, o = 1 }: { x?: number; y?: number; w?: number; fondo?: number; bandas: [number, string, number][]; sem?: number; o?: number }) {
  let yy = y;
  return (
    <En x={x} y={0} o={o}>
      {bandas.map(([dy, color, r], i) => { yy += dy; return <path key={i} d={banda(-w / 2, w, yy, y + fondo, r, sem + i)} fill={color} />; })}
    </En>
  );
}

// ─── Intestino ────────────────────────────────────────────────────────────────

/** Icono del intestino (referencia de los órganos): una «U» de luz crema rodeada de nubecitas naranja, rojas y magenta,
 *  con sombra dura. `lesion` 0-1 abre erosiones rojas en la luz (mucositis). */
export function Intestino({ x = 0, y = 0, k = 1, o = 1, lesion = 0 }: { x?: number; y?: number; k?: number; o?: number; lesion?: number }) {
  const pts: [number, number, number][] = [];
  for (let yy = -110; yy <= 30; yy += 22) pts.push([-72, yy, 180]);
  for (let a = 180; a >= 0; a -= 16) pts.push([Math.cos((a * Math.PI) / 180) * 72, 30 + Math.sin(((180 - a) * Math.PI) / 180) * 72, a]);
  for (let yy = 30; yy >= -110; yy -= 22) pts.push([72, yy, 0]);
  const col = ['#FF7A3D', '#E0338A', '#C2185B', '#FF9F1C'];
  const luz = 'M-72,-110 L-72,30 A72,72 0 0 0 72,30 L72,-110';
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d={luz} fill="none" stroke={G.sombra} strokeWidth={96} strokeLinecap="round" transform="translate(10,12)" />
      {pts.map(([px, py, a], i) => {
        const rad = ((a === 180 ? 180 : a === 0 ? 0 : a) * Math.PI) / 180;
        const nx = a === 180 ? -1 : a === 0 ? 1 : Math.cos(rad), ny = a === 180 || a === 0 ? 0 : Math.sin(((180 - a) * Math.PI) / 180);
        return (
          <g key={i}>
            <circle cx={px + nx * 44} cy={py + ny * 44} r={17} fill={col[i % 4]} />
            <circle cx={px - nx * 40} cy={py - ny * 40} r={14} fill={col[(i + 2) % 4]} />
          </g>
        );
      })}
      <path d={luz} fill="none" stroke="#7A2A8A" strokeWidth={38} strokeLinecap="round" />
      <path d={luz} fill="none" stroke="#FFF1B8" strokeWidth={26} strokeLinecap="round" />
      <path d="M-76,-100 L-76,24" fill="none" stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" opacity={0.7} />
      {lesion > 0.01 && [[-72, -20, 16], [-60, 60, 14], [0, 98, 18], [64, 52, 15], [72, -40, 16]].map(([cx, cy, rr], i) => {
        const q = tramo(lesion, i * 0.14, 0.45 + i * 0.14);
        return q > 0 ? <g key={i}><circle cx={cx} cy={cy} r={rr * q} fill="#E5324C" /><circle cx={cx - 3} cy={cy - 3} r={rr * 0.4 * q} fill="#FFB3BB" /></g> : null;
      })}
    </En>
  );
}

// ─── Personas y hospital ─────────────────────────────────────────────────────

/** Retrato plano en la línea de las referencias de pacientes: cara de puntos y cejas gruesas, sin contorno.
 *  `ella`: calva, de rosa, con camiseta marino (quimioterapia). `el`: mayor, pelo y bigote blancos, bata verde.
 *  `tubo` 0-1: tubo endotraqueal con su sujeción. `triste` 0-1 baja las cejas. */
export function Retrato({ x = 0, y = 0, k = 1, o = 1, quien, tubo = 0, triste = 0 }: { x?: number; y?: number; k?: number; o?: number; quien: 'ella' | 'el'; tubo?: number; triste?: number }) {
  const ella = quien === 'ella';
  const piel = ella ? ['#D4577E', '#F27BA0', '#FFB3C9'] : ['#B9576F', '#DD6E8A', '#F29AB0'];
  const ropa = ella ? ['#141466', '#2E2EB0'] : ['#1E7F8C', '#52B8C4'];
  const pelo = '#ECE8FA', oscuro = '#2A1250';
  const ceja = -12 * clamp(triste);
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M-170,250 C-170,160 -100,118 -40,110 L40,110 C100,118 170,160 170,250 Z" fill={ropa[1]} />
      <path d="M-170,250 C-170,190 -150,160 -122,140 C-112,190 -106,220 -104,250 Z" fill={ropa[0]} />
      <path d="M170,250 C170,190 150,160 122,140 C112,190 106,220 104,250 Z" fill={ropa[0]} />
      <rect x={-34} y={50} width={68} height={70} rx={20} fill={piel[0]} />
      <circle cx={-92} cy={-4} r={20} fill={piel[0]} /><circle cx={92} cy={-4} r={20} fill={piel[0]} />
      <path d="M-90,-30 C-92,-130 -40,-160 0,-160 C42,-160 92,-130 90,-30 C90,50 52,92 0,94 C-52,92 -90,50 -90,-30 Z" fill={piel[1]} />
      <path d="M90,-30 C90,50 52,92 0,94 C34,78 62,40 58,-30 C56,-80 46,-120 26,-154 C66,-140 92,-100 90,-30 Z" fill={piel[0]} opacity={0.55} />
      {!ella && (
        <>
          <path d="M-92,-30 C-104,-120 -62,-170 0,-170 C62,-170 104,-120 92,-30 C84,-76 62,-104 30,-118 C0,-100 -50,-100 -92,-30 Z" fill={pelo} />
          <path d="M-30,44 C-18,34 18,34 30,44 C20,60 -20,60 -30,44 Z" fill={pelo} />
          <path d="M-70,-52 Q-48,-62 -26,-54 M26,-54 Q48,-62 70,-52" fill="none" stroke={pelo} strokeWidth={11} strokeLinecap="round" />
          <path d="M-60,22 Q-52,30 -44,22 M44,22 Q52,30 60,22" fill="none" stroke={piel[0]} strokeWidth={4} strokeLinecap="round" />
        </>
      )}
      {[-38, 38].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={-12} r={13} fill={oscuro} />
          {ella && <path d={`M${cx - 18},4 Q${cx},14 ${cx + 18},4`} fill="none" stroke="#A23AA6" strokeWidth={7} strokeLinecap="round" opacity={0.8} />}
          {ella && <path d={`M${cx - 22},${-46 + (cx > 0 ? ceja : 0)} Q${cx},${-56} ${cx + 22},${-46 + (cx < 0 ? ceja : 0)}`} fill="none" stroke="#B0466C" strokeWidth={9} strokeLinecap="round" />}
        </g>
      ))}
      <ellipse cx={0} cy={18} rx={13} ry={10} fill={piel[0]} />
      {!ella && <path d="M-22,52 Q0,46 22,52" fill="none" stroke="#B33A5E" strokeWidth={6} strokeLinecap="round" opacity={1 - clamp(tubo)} />}
      {ella && <path d="M-20,52 Q0,46 20,52" fill="none" stroke="#B5445E" strokeWidth={7} strokeLinecap="round" />}
      <path d="M-64,-60 Q-50,-84 -22,-92" fill="none" stroke={piel[2]} strokeWidth={8} strokeLinecap="round" opacity={0.8} />
      {tubo > 0.01 && (
        <g opacity={tramo(tubo, 0, 0.4)}>
          <path d="M-14,52 L58,56 Q120,60 150,100 L150,140" fill="none" stroke="#9CD7F2" strokeWidth={17} strokeLinecap="round" strokeDasharray={`${easeOut(clamp(tubo)) * 330} 400`} />
          <path d="M-14,52 L58,56 Q120,60 150,100 L150,140" fill="none" stroke="#DFF5FF" strokeWidth={7} strokeLinecap="round" strokeDasharray={`${easeOut(clamp(tubo)) * 330} 400`} />
          <rect x={-8} y={42} width={22} height={20} rx={6} fill="#FFD23F" />
        </g>
      )}
    </En>
  );
}

/** Soporte de suero (referencia): poste azul con gancho, bolsa de contorno cian y una gota que cae. */
export function Suero({ x = 0, y = 0, k = 1, o = 1, gota = 0, color = '#BFE9FF' }: { x?: number; y?: number; k?: number; o?: number; gota?: number; color?: string }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M0,-240 L0,230 M0,230 L-70,282 M0,230 L70,282 M0,230 L0,290" stroke={G.sombra} strokeWidth={14} strokeLinecap="round" transform="translate(8,8)" fill="none" />
      <path d="M0,-240 L0,230 M0,230 L-70,282 M0,230 L70,282 M0,230 L0,290" stroke="#2E6FE0" strokeWidth={12} strokeLinecap="round" fill="none" />
      <path d="M0,-240 C0,-262 40,-266 50,-250" fill="none" stroke="#2E6FE0" strokeWidth={12} strokeLinecap="round" />
      <path d="M-44,-210 C-44,-236 44,-236 44,-210 L44,-110 C44,-84 20,-74 0,-70 C-20,-74 -44,-84 -44,-110 Z" fill="#6FC8EA" />
      <path d="M-38,-206 C-38,-228 38,-228 38,-206 L38,-112 C38,-90 18,-80 0,-77 C-18,-80 -38,-90 -38,-112 Z" fill={color} />
      <path d="M-26,-196 L-26,-120" stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" opacity={0.8} />
      <rect x={-6} y={-72} width={12} height={22} rx={5} fill="#6FC8EA" />
      {gota > 0.01 && <circle cx={0} cy={-40 + 70 * (gota % 1)} r={7} fill="#6FC8EA" opacity={1 - 0.5 * (gota % 1)} />}
    </En>
  );
}

/** Respirador: caja violeta con pantalla de onda y la manguera corrugada que sale hacia el paciente. */
export function Ventilador({ x = 0, y = 0, k = 1, o = 1, reloj = 0, manguera = true }: { x?: number; y?: number; k?: number; o?: number; reloj?: number; manguera?: boolean }) {
  const onda = Array.from({ length: 24 }, (_, i) => `${i === 0 ? 'M' : 'L'}${-70 + i * 6.2},${(Math.sin((i + reloj / 120) * 0.55) * 16).toFixed(1)}`).join(' ');
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-92} y={-62} width={190} height={150} rx={20} fill={G.sombra} />
      <rect x={-100} y={-70} width={190} height={150} rx={20} fill="#3B2A7E" />
      <rect x={-100} y={-70} width={190} height={120} rx={20} fill="#5A47B8" />
      <rect x={-82} y={-52} width={154} height={70} rx={10} fill="#1B1245" />
      <path d={onda} transform="translate(-5,-16)" fill="none" stroke="#5FE08A" strokeWidth={4} strokeLinecap="round" />
      <circle cx={-62} cy={52} r={13} fill="#FFD23F" /><circle cx={-24} cy={52} r={13} fill="#FF7A9A" /><circle cx={14} cy={52} r={13} fill="#7AD0FF" />
      <circle cx={-66} cy={48} r={4} fill="#FFF" opacity={0.7} />
      {manguera && (
        <>
          <path d="M90,10 C160,10 170,-60 230,-60" fill="none" stroke="#7FB4E8" strokeWidth={20} strokeLinecap="round" />
          <path d="M90,10 C160,10 170,-60 230,-60" fill="none" stroke="#CFE8FF" strokeWidth={8} strokeLinecap="round" strokeDasharray="4 8" />
        </>
      )}
    </En>
  );
}

/** Cama de hospital vista de lado (referencia del cuarto): colchón lila, sábana clara, cabecera y barandilla. */
export function Cama({ x = 0, y = 0, k = 1, o = 1, ancho = 520 }: { x?: number; y?: number; k?: number; o?: number; ancho?: number }) {
  const W = ancho / 2;
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-W + 10} y={26} width={ancho} height={52} rx={14} fill={G.sombra} />
      <rect x={-W} y={-60} width={30} height={150} rx={12} fill={G.cama[0]} />
      <rect x={-W} y={-4} width={ancho} height={74} rx={16} fill={G.cama[0]} />
      <rect x={-W + 8} y={-34} width={ancho - 16} height={50} rx={20} fill={G.cama[2]} />
      <rect x={-W + 8} y={-34} width={ancho - 16} height={22} rx={11} fill="#FFFFFF" opacity={0.6} />
      <rect x={-W + 30} y={-4} width={ancho - 60} height={20} rx={8} fill={G.cama[1]} />
      <path d={`M${-W + 60},-20 L${-W + 60},40 M${W - 60},-20 L${W - 60},40`} stroke={G.cama[2]} strokeWidth={8} strokeLinecap="round" opacity={0} />
      <circle cx={-W + 50} cy={84} r={14} fill="#3B2A7E" /><circle cx={W - 50} cy={84} r={14} fill="#3B2A7E" />
    </En>
  );
}

/** Figurita de la referencia de la multitud: cabeza calva con dos puntos, ropa azul o turquesa, sobre su disco amarillo.
 *  `marca` 0-1 la rodea de un halo magenta (como el cuerpo de la referencia de esquematización). */
export function Figurita({ x = 0, y = 0, k = 1, o = 1, ropa = 0, marca = 0, grande = 1 }: { x?: number; y?: number; k?: number; o?: number; ropa?: number; marca?: number; grande?: number }) {
  const rop = [['#1E7FD0', '#3FB4E0'], ['#1BA79A', '#55E0C0'], ['#2B5FD0', '#2FA3D8'], ['#0F6FC0', '#74D6F0']][ropa % 4];
  const piel = ropa % 5 === 3 ? '#9C5A3C' : '#FFB48A';
  return (
    <En x={x} y={y} k={k * grande} o={o}>
      <ellipse cx={0} cy={44} rx={40} ry={12} fill="#FFE08A" />
      {marca > 0.01 && <g opacity={clamp(marca)}><circle cy={-4} r={64} fill="#E040C8" opacity={0.28} /><circle cy={-4} r={64} fill="none" stroke="#E040C8" strokeWidth={6} /></g>}
      <rect x={-17} y={14} width={13} height={30} rx={5} fill="#2A7FB8" /><rect x={4} y={14} width={13} height={30} rx={5} fill="#2A7FB8" />
      <rect x={-22} y={-14} width={44} height={42} rx={14} fill={rop[0]} /><rect x={-22} y={-14} width={44} height={36} rx={14} fill={rop[1]} />
      <rect x={-33} y={-8} width={12} height={34} rx={6} fill={piel} /><rect x={21} y={-8} width={12} height={34} rx={6} fill={piel} />
      <circle cy={-34} r={21} fill={piel} />
      <circle cx={-7} cy={-34} r={3} fill="#22105E" /><circle cx={7} cy={-34} r={3} fill="#22105E" />
    </En>
  );
}

// ─── Moco y epitelio ─────────────────────────────────────────────────────────

/** Enterocito columnar: núcleo oscuro en la base y microvellosidades rosas arriba. `muere` 0-1 lo apaga y lo achica. */
export function Enterocito({ x = 0, y = 0, k = 1, o = 1, muere = 0, micro = 1, w = 108 }: { x?: number; y?: number; k?: number; o?: number; muere?: number; micro?: number; w?: number }) {
  const m = clamp(muere), W = w / 2, c = ['#5A1590', '#A32BC4', '#E26AE0'];
  const c1 = m > 0.01 ? ['#4A2A6A', '#7C5A9A', '#B49ACB'] : c;
  return (
    <En x={x} y={y} k={k * (1 - 0.1 * m)} o={o}>
      {micro > 0.01 && Array.from({ length: 6 }, (_, i) => <rect key={i} x={-W + 8 + i * ((w - 22) / 5)} y={-120 * 1} width={9} height={36 * micro} rx={4.5} fill={G.micro} opacity={1 - 0.6 * m} />)}
      <rect x={-W + 7} y={-84} width={w} height={178} rx={28} fill={G.sombra} />
      <rect x={-W} y={-90} width={w} height={184} rx={28} fill={c1[0]} />
      <rect x={-W} y={-90} width={w - 8} height={176} rx={26} fill={c1[1]} />
      <path d={`M${-W + 12},-70 Q${-W + 6},-30 ${-W + 14},10`} fill="none" stroke={c1[2]} strokeWidth={8} strokeLinecap="round" opacity={0.85} />
      <ellipse cx={0} cy={44} rx={31} ry={25} fill="#3A0F5E" /><ellipse cx={-6} cy={38} rx={19} ry={14} fill="#6B2A9C" /><circle cx={-12} cy={32} r={4.5} fill="#C79BFF" />
      {m > 0.01 && [[-20, -30, 9], [18, -10, 8], [-8, 8, 7]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r * m} fill="#2A0A48" opacity={0.7} />)}
    </En>
  );
}

/** Célula caliciforme: copa con gránulos de mucina; `libera` 0-1 saca hebras de moco hacia arriba. */
export function Caliciforme({ x = 0, y = 0, k = 1, o = 1, libera = 0, granulos = 1 }: { x?: number; y?: number; k?: number; o?: number; libera?: number; granulos?: number }) {
  const cuerpo = 'M-46,-86 C-46,-34 -20,-14 -14,22 L-14,92 L14,92 L14,22 C20,-14 46,-34 46,-86 Z';
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d={cuerpo} fill={G.sombra} transform="translate(7,7)" />
      {libera > 0.01 && [-26, 0, 26].map((dx, i) => {
        const q = tramo(libera, i * 0.15, 0.6 + i * 0.15);
        return <path key={i} d={`M${dx},-80 C${dx - 16},${-120 - 40 * q} ${dx + 16},${-150 - 60 * q} ${dx},${-190 * q - 80}`} fill="none" stroke={G.mucoso[1]} strokeWidth={9} strokeLinecap="round" opacity={0.9 * q} />;
      })}
      <path d={cuerpo} fill={G.epitelio[0]} />
      <path d="M-42,-86 C-42,-36 -18,-16 -10,22 L-10,86 L10,86 L10,22 C18,-16 42,-36 42,-86 Z" fill={G.epitelio[1]} />
      {granulos > 0.01 && [[-24, -70, 11], [2, -76, 12], [26, -66, 10], [-14, -44, 11], [12, -44, 10], [-2, -16, 9]].map(([cx, cy, r], i) => <g key={i} opacity={clamp(granulos)}><circle cx={cx} cy={cy} r={r} fill={G.mucoso[1]} /><circle cx={cx - 3} cy={cy - 3} r={r * 0.35} fill="#FFF" opacity={0.85} /></g>)}
      <ellipse cx={0} cy={66} rx={14} ry={18} fill="#3A0F5E" />
    </En>
  );
}

/** Cremallera entre dos células (uniones estrechas y adherentes): dientes alternos de las dos células. `cierre` 0 → abierta, 1 → cerrada. */
export function Cremallera({ x = 0, y = 0, h = 160, cierre = 1, o = 1, k = 1 }: { x?: number; y?: number; h?: number; cierre?: number; o?: number; k?: number }) {
  const n = Math.max(3, Math.round(h / 22)), paso = h / n, s = (1 - clamp(cierre)) * 18;
  return (
    <En x={x} y={y} o={o} k={k}>
      {Array.from({ length: n }, (_, j) => (
        <g key={j}>
          <rect x={-26 - s} y={-h / 2 + j * paso} width={28} height={11} rx={5.5} fill="#2A0A48" />
          <rect x={-2 + s} y={-h / 2 + j * paso + paso / 2} width={28} height={11} rx={5.5} fill="#FF8AD0" />
        </g>
      ))}
    </En>
  );
}

/** Gel de moco: rectángulo translúcido con hebras onduladas. */
export function Gel({ x, y, w, h, o = 1, tono = G.mucoso as readonly string[], hebras = 9, denso = false, sem = 1 }: { x: number; y: number; w: number; h: number; o?: number; tono?: readonly string[]; hebras?: number; denso?: boolean; sem?: number }) {
  if (o <= 0.002) return null;
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={h} rx={denso ? 8 : 22} fill={tono[1]} opacity={denso ? 0.62 : 0.34} />
      {Array.from({ length: hebras }, (_, i) => {
        const hx = x + (w / hebras) * (i + 0.5) + (hash(i, sem) - 0.5) * 30;
        return <path key={i} d={`M${hx.toFixed(1)},${y + 6} q${denso ? 6 : 18},${(h * 0.25).toFixed(1)} 0,${(h * 0.5).toFixed(1)} q${denso ? -6 : -18},${(h * 0.25).toFixed(1)} 0,${(h * 0.45).toFixed(1)}`} fill="none" stroke={tono[2]} strokeWidth={denso ? 6 : 4} strokeLinecap="round" opacity={0.85} />;
      })}
    </g>
  );
}

/** Corte del epitelio intestinal: enterocitos con caliciformes cada cuatro, la lámina propia festoneada debajo y, encima, el moco
 *  en sus dos capas (interna densa, externa laxa). `y` es el centro de las células. */
export function Corte({ y = 660, n = 12, moco = 1, interna = 1, externa = 1, libera = 0, micro = 1, o = 1 }: { y?: number; n?: number; moco?: number; interna?: number; externa?: number; libera?: number; micro?: number; o?: number }) {
  const sup = y - 90 - 34 * micro;
  return (
    <g opacity={o}>
      <Capas y={y + 70} fondo={1000} bandas={[[0, '#6E1FA3', 26], [60, '#8B2BB8', 30], [70, '#5A1590', 34]]} sem={5} />
      {Array.from({ length: n }, (_, i) => {
        const x = 100 + i * ((1400) / (n - 1)) + 0;
        return i % 4 === 3 ? <Caliciforme key={i} x={x} y={y} libera={libera} k={0.98} /> : <Enterocito key={i} x={x} y={y} micro={micro} w={104} />;
      })}
      <Gel x={20} y={sup - 100 * clamp(interna)} w={1560} h={100 * clamp(interna)} o={clamp(moco)} denso sem={3} hebras={16} />
      <Gel x={20} y={sup - 100 * clamp(interna) - 190 * clamp(externa)} w={1560} h={190 * clamp(externa)} o={clamp(moco)} hebras={14} sem={7} />
    </g>
  );
}

// ─── Envoltura bacteriana ────────────────────────────────────────────────────

/** Corte de la envoltura gramnegativa, de arriba abajo: membrana externa (con LPS y porinas), periplasma con peptidoglucano y
 *  membrana interna. `lps`, `porinas`, `pg` 0-1 aparecen cada uno. Ancho aproximado 720. */
export function Envoltura({ x = 0, y = 0, k = 1, o = 1, lps = 1, porinas = 1, pg = 1 }: { x?: number; y?: number; k?: number; o?: number; lps?: number; porinas?: number; pg?: number }) {
  const N = 17;
  return (
    <En x={x} y={y} k={k} o={o}>
      {/* membrana externa */}
      {Array.from({ length: N }, (_, i) => <g key={i}><circle cx={-352 + i * 44} cy={-60} r={17} fill={G.patogeno[1]} /><circle cx={-352 + i * 44} cy={-14} r={17} fill={G.patogeno[0]} /><circle cx={-357 + i * 44} cy={-65} r={4.5} fill="#FFF" opacity={0.7} /></g>)}
      {/* LPS: cadenas con hexágonos hacia afuera */}
      {lps > 0.01 && Array.from({ length: 8 }, (_, i) => {
        const cx = -330 + i * 92, q = tramo(lps, i * 0.05, 0.55 + i * 0.05), alto = (70 + hash(i, 3) * 40) * q;
        return <g key={i} opacity={q}><path d={`M${cx},-78 q12,${-alto * 0.5} -6,${-alto}`} fill="none" stroke="#FFB48A" strokeWidth={5} strokeLinecap="round" />{[0.45, 0.75, 1].map((f, j) => <circle key={j} cx={cx + (j % 2 ? 6 : -4) - f * 2} cy={-78 - alto * f} r={7} fill={['#FFD23F', '#FF9F1C', '#FFD23F'][j]} />)}</g>;
      })}
      {/* porinas */}
      {porinas > 0.01 && [-206, 62, 270].map((cx, i) => {
        const q = tramo(porinas, i * 0.18, 0.5 + i * 0.18);
        return <g key={i} opacity={q}><rect x={cx - 24} y={-86} width={48} height={96} rx={20} fill="#2A0A48" /><rect x={cx - 17} y={-80} width={34} height={84} rx={14} fill="#120430" /><rect x={cx - 11} y={-76} width={8} height={70} rx={4} fill="#5B3C9A" opacity={0.8} /></g>;
      })}
      {/* periplasma y peptidoglucano */}
      <rect x={-380} y={16} width={760} height={64} fill="#F2E7B8" opacity={0.18} />
      {pg > 0.01 && <path d={`M-370,50 ${Array.from({ length: 34 }, (_, i) => `L${-370 + (i + 1) * 22},${i % 2 ? 36 : 64}`).join(' ')}`} fill="none" stroke="#FFD23F" strokeWidth={7} strokeLinecap="round" strokeDasharray={`${easeOut(clamp(pg)) * 900} 1200`} />}
      {/* membrana interna */}
      {Array.from({ length: N }, (_, i) => <g key={i}><circle cx={-352 + i * 44} cy={102} r={17} fill={G.epitelio[1]} /><circle cx={-352 + i * 44} cy={148} r={17} fill={G.epitelio[0]} /></g>)}
    </En>
  );
}

// ─── Marcas del lab ──────────────────────────────────────────────────────────

/** Rótulo «Caso ilustrativo»: los dos pacientes de los capítulos 0 y 9 no vienen de la clase. */
export const TXT_CASO = 'Caso ilustrativo';
export const TXT_FARMACO = 'Repaso de Farmacología';

/** Píldora que flota con un halo de color: la marca de los pasos de fármacos. */
export function PildoraFlota({ x, y, k = 1, rl, p = 1, color = G.azul as readonly string[], fase = 0 }: { x: number; y: number; k?: number; rl: number; p?: number; color?: readonly string[]; fase?: number }) {
  if (p <= 0.002) return null;
  return (
    <Flota x={x} y={y} k={k * (0.7 + 0.3 * easeBack(clamp(p)))} o={tramo(p, 0, 0.4)} rl={rl} fase={fase} alto={64 * k}>
      <circle r={56} fill={color[1]} opacity={0.16} />
      <g transform="rotate(-35)">
        <rect x={-50} y={-22} width={100} height={44} rx={22} fill={color[0]} />
        <rect x={-50} y={-22} width={50} height={44} rx={22} fill={color[2]} />
        <rect x={-6} y={-22} width={56} height={44} rx={22} fill={color[1]} />
        <rect x={-40} y={-15} width={34} height={8} rx={4} fill="#FFF" opacity={0.7} />
      </g>
    </Flota>
  );
}
