'use client';
// Láminas de fondo del laboratorio «Lupus» (lienzo de 1600 × 1000). Como los
// tejidos de «Hipersensibilidad», cada lámina lee sus parámetros (0–1) del
// motor, que los anima con la acción `tejido` a la par que la voz, y un `reloj`
// acumulado para lo que se mueve solo (hematíes que fluyen, el pulso de
// «empieza aquí»). Las del capítulo 0 son infografías: el nombre y el rostro,
// el vaso al que llegan los complejos, la curva de brotes, nueve a uno con la
// edad de inicio, el cuerpo con sus órganos y la ruta del laboratorio.
//
// Lo que no depende de parámetros va en capas `memo` sin props (no se vuelve a
// pintar en cada fotograma). Colores de texto y trazos por clase
// (`lupus.module.css`), con su versión oscura; los rellenos de órganos e
// iconos son saturados y valen en los dos temas.

import { memo, type ReactNode } from 'react';
import { IconoOrgano, clamp, dibujar, easeBack, easeOut, tramo, v, type Icono, type T } from './laminas';
import { DefsAnatomia, Globulo } from './Anatomia';
import { ARTICULACIONES, Articulaciones, CX, CorazonEn, Figurita, PulmonesEn, RinonesEn, Silueta, Sistema, Vasos } from './Cuerpo';
import { PACIENTES_TEZ, Retrato, TRAZOS_RETRATO } from './Retrato';
import FondoCausas from './FondoCausas';
import { FondoEular, FondoPruebas } from './FondoDiagnostico';
import { FondoCapas, FondoClases, FondoFullHouse } from './FondoNefritis';
import { FondoCebolla, FondoCoronaria, FondoPulmon, FondoTorax, FondoValva } from './FondoOrganos';
import { FondoBoca, FondoDiscoide, FondoManos, FondoTorso } from './FondoClinica';
import { FondoGlomeruloLupus, FondoSangreLupus, FondoVasoLupus } from './FondoHiper';
import { FondoCircuito, FondoEfectoras, FondoFreno, FondoGerminal, FondoIntersticio, FondoPeriferia, FondoPuente, FondoSeleccion } from './FondoAdaptativa';
import { FondoCirculo, FondoEndosoma, FondoEspacio, FondoFirma, FondoRed } from './FondoInterferon';
import { FondoCiudad, FondoEpidermis } from './FondoBasura';
import type { Fondo } from '@/lib/data/lupus/tipos';
import { L } from '@/lib/data/lupus/colores';
import { INDICE } from '@/lib/data/lupus/indice';
import s from '@/styles/lupus.module.css';

// ─── Defs comunes ─────────────────────────────────────────────────────────────

const DefsFondo = memo(function DefsFondo() {
  return (
    <>
    <DefsAnatomia />
    <defs>
      <radialGradient id="lp-malar">
        <stop offset="0" stopColor={L.eritema} stopOpacity={0.62} /><stop offset="0.6" stopColor={L.eritema} stopOpacity={0.42} /><stop offset="1" stopColor={L.eritema} stopOpacity={0} />
      </radialGradient>
      <filter id="lp-halo" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14" /></filter>
      <linearGradient id="lp-espectro" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" className={s.stopLeve} />
        <stop offset="100%" stopColor={L.lupus} />
      </linearGradient>
      <linearGradient id="lp-ruta" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor={L.causas} />
        <stop offset="30%" stopColor={L.mecanismo} />
        <stop offset="60%" stopColor={L.dano} />
        <stop offset="82%" stopColor={L.diagnostico} />
        <stop offset="100%" stopColor={L.tratamiento} />
      </linearGradient>
      <radialGradient id="lp-inflama">
        <stop offset="0%" stopColor="#E5484D" stopOpacity={0.45} />
        <stop offset="100%" stopColor="#E5484D" stopOpacity={0} />
      </radialGradient>
    </defs>
    </>
  );
});

// ─── 1 · El nombre ────────────────────────────────────────────────────────────

const R_C = { x: 430, y: 520 };

const MORDIDAS: [number, number, number][] = [[338, 548, -20], [366, 582, 10], [522, 546, 25], [494, 584, -15], [356, 522, 40]];
const ORGANOS_RAYO: { i: Icono; x: number; y: number; txt: string }[] = [
  { i: 'cerebro', x: 150, y: 250, txt: 'Cerebro' },
  { i: 'corazon', x: 100, y: 520, txt: 'Corazón' },
  { i: 'articulacion', x: 150, y: 800, txt: 'Articulaciones' },
  { i: 'pulmon', x: 710, y: 250, txt: 'Pulmón' },
  { i: 'rinon', x: 740, y: 520, txt: 'Riñón' },
  { i: 'sangre', x: 710, y: 800, txt: 'Sangre' },
];

function Nombre({ t }: { t: T }) {
  const ti = easeOut(v(t, 'titulo')), sp = v(t, 'separa');
  const titulo = ti * (1 - tramo(sp, 0, 0.6));
  const col = tramo(sp, 0.35, 1);
  const ro = v(t, 'rostro'), mo = v(t, 'mordida'), er = v(t, 'eritema'), si = v(t, 'sistemico'), ra = v(t, 'rayos');
  const filas = [
    { txt: 'Lupus', y: 260, k: v(t, 'lupus'), sig: '«lobo», en latín', sig2: 'lesiones de la cara que parecían mordeduras', clase: s.palabraLupus },
    { txt: 'eritematoso', y: 490, k: er, sig: 'rojo, inflamado', sig2: '', clase: s.palabra },
    { txt: 'sistémico', y: 720, k: ra, sig: 'no se queda en la piel', sig2: 'puede tocar cualquier órgano', clase: s.palabra },
  ];
  return (
    <g>
      {/* Título de entrada, centrado */}
      {titulo > 0.001 && (
        <g opacity={titulo} transform={`translate(800,${500 - 20 * (1 - ti)})`}>
          <text y={-120} textAnchor="middle" className={`${s.tituloGrande} ${s.palabraLupus}`}>Lupus</text>
          <text y={10} textAnchor="middle" className={s.tituloGrande}>eritematoso</text>
          <text y={140} textAnchor="middle" className={s.tituloGrande}>sistémico</text>
          <text y={230} textAnchor="middle" className={s.lSub}>una enfermedad autoinmune que puede tocar cualquier órgano</text>
        </g>
      )}

      {/* Rayos del «sistémico», detrás del rostro */}
      {ra > 0.001 && ORGANOS_RAYO.map((o, j) => {
        const k = tramo(ra, j * 0.1, 0.45 + j * 0.1);
        const ang = Math.atan2(o.y - R_C.y, o.x - R_C.x);
        const x0 = R_C.x + Math.cos(ang) * 200, y0 = R_C.y + Math.sin(ang) * 250;
        const x1 = o.x - Math.cos(ang) * 46, y1 = o.y - Math.sin(ang) * 46;
        return (
          <g key={o.i} opacity={Math.min(1, k * 1.5)}>
            <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * easeOut(k)} y2={y0 + (y1 - y0) * easeOut(k)} className={s.rayo} />
            {k > 0.6 && (
              <g opacity={tramo(k, 0.6, 1)}>
                <circle cx={o.x} cy={o.y} r={44} className={s.discoIcono} />
                <IconoOrgano i={o.i} x={o.x} y={o.y} k={0.62 * (0.8 + 0.2 * easeBack(tramo(k, 0.6, 1)))} />
                <text x={o.x} y={o.y + 70} textAnchor="middle" className={s.lEtiqueta}>{o.txt}</text>
              </g>
            )}
          </g>
        );
      })}

      {/* Rostro: entra a lápiz y se le pone el color encima */}
      {ro > 0.001 && (
        <g transform={`translate(${R_C.x},0)`}>
          {ro < 0.999 && <g transform="translate(0,486) scale(1,0.92) translate(0,-486)" opacity={1 - tramo(ro, 0.55, 1)}>{TRAZOS_RETRATO.map((d, j) => <path key={j} d={d} className={s.rostro} {...dibujar(tramo(ro, j * 0.03, 0.55 + j * 0.03))} />)}</g>}
          <g opacity={tramo(ro, 0.32, 0.92)}><Retrato /></g>
          {/* Mordidas: lo que describían en la Edad Media */}
          {mo > 0.001 && (
            <g opacity={mo * (1 - 0.9 * er)} transform={`translate(${-R_C.x},0)`}>
              {MORDIDAS.map(([x, y, a], j) => (
                <g key={j} transform={`translate(${x},${y}) rotate(${a}) scale(${0.6 + 0.4 * tramo(mo, j * 0.12, 0.5 + j * 0.12)})`}>
                  <path d="M-16,0 Q0,-14 16,0" className={s.mordida} />
                  <path d="M-11,6 Q0,-4 11,6" className={s.mordida} opacity={0.6} />
                </g>
              ))}
            </g>
          )}
          {/* Eritema malar en alas de mariposa: mejillas y dorso de la nariz, sin tocar los surcos nasogenianos */}
          {er > 0.001 && (
            <g opacity={er}>
              <ellipse cx={-76} cy={544} rx={66} ry={38} fill="url(#lp-malar)" transform="rotate(-14 -76 544)" />
              <ellipse cx={76} cy={544} rx={66} ry={38} fill="url(#lp-malar)" transform="rotate(14 76 544)" />
              <ellipse cx={0} cy={528} rx={21} ry={26} fill="url(#lp-malar)" />
            </g>
          )}
          {er > 0.5 && (
            <g opacity={tramo(er, 0.5, 1)}>
              <line x1={-96} y1={566} x2={-158} y2={640} className={s.guiaClara} />
              <g transform="translate(-200,664)">
                <rect x={-88} y={-22} width={176} height={44} rx={22} className={s.chip} />
                <text textAnchor="middle" dy="0.35em" className={s.lEtiqueta}>eritema malar</text>
              </g>
            </g>
          )}
        </g>
      )}

      {/* Las tres palabras, en columna, con lo que significan */}
      {col > 0.001 && filas.map((f, j) => {
        const resalta = j === 2 ? si : 0;
        return (
          <g key={f.txt} opacity={col} transform={`translate(${880 - 90 * (1 - easeOut(col))},0)`}>
            <text x={0} y={f.y} className={`${s.palabraCol} ${j === 0 ? s.palabraLupus : ''} ${resalta > 0.5 ? s.palabraLupus : ''}`} style={resalta ? { fontSize: 76 * (1 + 0.1 * resalta) } : undefined}>{f.txt}</text>
            {j === 2 && resalta > 0.001 && <line x1={0} y1={f.y + 16} x2={390 * easeOut(resalta)} y2={f.y + 16} className={s.subrayado} />}
            {f.k > 0.001 && (
              <g opacity={f.k} transform={`translate(${16 * (1 - easeOut(f.k))},0)`}>
                <text x={4} y={f.y + 58} className={s.significado}>{f.sig}</text>
                {f.sig2 && <text x={4} y={f.y + 92} className={s.lSub}>{f.sig2}</text>}
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

// ─── 2 · Contra el propio núcleo: el vaso al que llegan los complejos ─────────

const VASO = { x0: 1070, x1: 1350 };
const hashV = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

/** Una pared del vaso, de la luz hacia afuera (`l` = 1 crece a la derecha):
 *  endotelio → lámina elástica interna → media con su músculo liso en corte → adventicia. */
const Pared = memo(function Pared({ x, l }: { x: number; l: 1 | -1 }) {
  const ondas = Array.from({ length: 27 }, (_, i) => `${i ? 'L' : 'M'}${(x + l * (15 + (i % 2) * 3.4)).toFixed(1)},${-20 + i * 40}`).join(' ');
  return (
    <g>
      {/* Adventicia: tejido conectivo con fibras y algún fibroblasto */}
      <rect x={l > 0 ? x + 58 : x - 98} y={-20} width={40} height={1040} className={s.adventicia} />
      {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${x + l * 60},${i * 48 - 10} C${x + l * 72},${i * 48 + 10} ${x + l * 86},${i * 48 - 8} ${x + l * 97},${i * 48 + 14}`} className={s.fibraAdv} />)}
      {/* Media: músculo liso, células en huso con su núcleo en bastón */}
      <rect x={l > 0 ? x + 18 : x - 58} y={-20} width={40} height={1040} className={s.mediaVaso} />
      {Array.from({ length: 44 }, (_, i) => {
        const col = i % 2, y = i * 24 + (col ? 6 : -6) - 10;
        return (
          <g key={i} transform={`translate(${x + l * (28 + col * 19)},${y}) rotate(${l * (col ? 7 : -7)})`}>
            <path d="M-19,0 C-10,-5.6 10,-5.6 19,0 C10,5.6 -10,5.6 -19,0 Z" className={s.fibraLisa} />
            <ellipse rx={7.4} ry={2.2} className={s.nucleoLiso} />
          </g>
        );
      })}
      {/* Lámina elástica interna, ondulada */}
      <path d={ondas} className={s.elastica} />
      {/* Endotelio: células planas, el núcleo abombado hacia la luz */}
      <rect x={l > 0 ? x : x - 14} y={-20} width={14} height={1040} className={s.endotelioBase} />
      {Array.from({ length: 13 }, (_, i) => {
        const y = 28 + i * 80 + (l > 0 ? 38 : 0);
        return (
          <g key={i}>
            <path d={`M${x + l * 14},${y - 40} L${x},${y - 40}`} className={s.uniones} />
            <ellipse cx={x + l * 1.5} cy={y} rx={6.2} ry={19} className={s.endotelio} />
          </g>
        );
      })}
    </g>
  );
});

const VasoFijo = memo(function VasoFijo() {
  return (
    <g>
      <defs>
        <linearGradient id="lp-luz" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" className={s.luzStop2} /><stop offset="0.5" className={s.luzStop1} /><stop offset="1" className={s.luzStop2} />
        </linearGradient>
      </defs>
      <rect x={VASO.x0} y={-20} width={VASO.x1 - VASO.x0} height={1040} fill="url(#lp-luz)" />
      <Pared x={VASO.x0} l={-1} />
      <Pared x={VASO.x1} l={1} />
      <text x={1490} y={64} textAnchor="middle" className={s.lEtiquetaMayus}>Tejido</text>
      <text x={430} y={64} textAnchor="middle" className={s.lEtiquetaMayus}>Célula del propio cuerpo</text>
    </g>
  );
});

/** Lo que circula: hematíes, algún leucocito y plaquetas, a la velocidad de la sangre. */
function Nucleo({ t, reloj }: { t: T; reloj: number }) {
  const de = v(t, 'deposito'), inf = v(t, 'inflama');
  const baja = (i: number, vel: number) => ((i * 137 + reloj * vel) % 1180) - 90;
  return (
    <g>
      {inf > 0.001 && <ellipse cx={VASO.x1 + 110} cy={500} rx={190 * (0.7 + 0.3 * inf)} ry={420} fill="url(#lp-inflama)" opacity={inf} />}
      <VasoFijo />
      {Array.from({ length: 5 }, (_, i) => (
        <g key={`p${i}`} transform={`translate(${VASO.x0 + 40 + hashV(i, 4) * 200},${baja(i + 3, 0.09).toFixed(1)}) rotate(${i * 60})`}>
          <path d="M-8,-1 C-5,-7 4,-7 8,-3 C9,1 4,7 -1,5 C-5,5 -9,3 -8,-1 Z" className={s.plaqueta} />
        </g>
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i} transform={`scale(0.5)`}>
          <Globulo x={(VASO.x0 + 50 + hashV(i, 1) * 180) * 2} y={baja(i, 0.07) * 2} r={52} rot={(i * 47) % 180} ky={0.62 + hashV(i, 2) * 0.32} />
        </g>
      ))}
      <g transform={`translate(${VASO.x0 + 200},${baja(4, 0.05).toFixed(1)})`}>
        <circle r={36} className={s.leucoVaso} />
        <path d="M-16,-8 C-10,-20 6,-16 4,-6 C14,-12 22,2 10,8 C14,18 -2,22 -6,12 C-14,18 -24,6 -16,-8 Z" className={s.nucleoLeuco} />
      </g>
      {de > 0.001 && (
        <g>
          {Array.from({ length: 26 }, (_, i) => {
            const y = [330, 650][i % 2] + ((i * 37) % 120) - 60;
            const k = tramo(de, (i / 26) * 0.6, (i / 26) * 0.6 + 0.4);
            return k > 0 ? <circle key={i} cx={VASO.x1 + 3 + ((i * 13) % 18)} cy={y} r={5 * k} className={s.deposito} /> : null;
          })}
          <text x={VASO.x1 + 110} y={500} className={s.lEtiqueta} opacity={de}>depósitos</text>
          <text x={VASO.x1 + 110} y={528} className={s.lSub} opacity={de}>en la pared</text>
        </g>
      )}
      <g transform={`translate(${(VASO.x0 + VASO.x1) / 2},58)`}>
        <rect x={-92} y={-20} width={184} height={40} rx={20} className={s.chip} />
        <text textAnchor="middle" dy="0.35em" className={s.lEtiquetaMayus}>Vaso pequeño</text>
      </g>
      {inf > 0.3 && <text x={1490} y={860} textAnchor="middle" className={s.lEtiquetaRoja} opacity={tramo(inf, 0.3, 1)}>inflamación</text>}
    </g>
  );
}

// ─── 3 · Brotes y remisiones ──────────────────────────────────────────────────

const G = { x0: 200, x1: 1420, base: 540 };
const PICOS = [
  { c: 0.5, h: 230, icono: 'articulacion' as Icono, txt: 'Articulaciones', chip: 470, param: 'brote1' },
  { c: 0.66, h: 165, icono: 'fiebre' as Icono, txt: 'Fiebre', chip: 760, param: 'brote2' },
  { c: 0.78, h: 285, icono: 'cara' as Icono, txt: 'Erupción en la cara', chip: 1060, param: 'brote3' },
  { c: 0.92, h: 205, icono: 'orina' as Icono, txt: 'Orina con espuma', chip: 1360, param: 'brote4' },
];
const yCurva = (f: number) => {
  let y = G.base - 26 - 7 * Math.sin(f * 37) - 4 * Math.sin(f * 91);
  for (const p of PICOS) y -= p.h * Math.exp(-(((f - p.c) / 0.028) ** 2));
  return y;
};
const xCurva = (f: number) => G.x0 + f * (G.x1 - G.x0);
const N_CURVA = 360;
const PUNTOS_CURVA = Array.from({ length: N_CURVA + 1 }, (_, i) => [xCurva(i / N_CURVA), yCurva(i / N_CURVA)] as const);

const EjesBrotes = memo(function EjesBrotes() {
  return (
    <g>
      <line x1={G.x0} y1={G.base} x2={G.x0} y2={170} className={s.eje} />
      <line x1={G.x0} y1={G.base} x2={G.x1 + 20} y2={G.base} className={s.eje} />
      <path d={`M${G.x1 + 20},${G.base - 7} L${G.x1 + 34},${G.base} L${G.x1 + 20},${G.base + 7}`} className={s.eje} />
      <text x={G.x0 - 18} y={360} textAnchor="middle" transform={`rotate(-90 ${G.x0 - 18} 360)`} className={s.lEtiquetaMayus}>actividad</text>
      <text x={G.x1 + 20} y={G.base + 34} textAnchor="end" className={s.lSub}>tiempo: meses a años</text>
    </g>
  );
});

function Brotes({ t }: { t: T }) {
  const cu = v(t, 'curva'), re = v(t, 'remision'), es = v(t, 'espectro'), gr = v(t, 'grave'), li = v(t, 'libro'), su = v(t, 'su');
  const n = Math.max(1, Math.round(cu * N_CURVA));
  const pts = PUNTOS_CURVA.slice(0, n + 1);
  const linea = `M${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L')}`;
  const [xf, yf] = pts[pts.length - 1];
  return (
    <g>
      {re > 0.001 && (
        <g opacity={re}>
          <rect x={xCurva(0.02)} y={250} width={xCurva(0.43) - xCurva(0.02)} height={G.base - 250} className={s.bandaRemision} />
          <text x={(xCurva(0.02) + xCurva(0.43)) / 2} y={286} textAnchor="middle" className={s.lEtiquetaVerde}>remisión</text>
          <text x={(xCurva(0.02) + xCurva(0.43)) / 2} y={314} textAnchor="middle" className={s.lSub}>meses en los que está bien</text>
        </g>
      )}
      {PICOS.map((p) => {
        const k = v(t, p.param);
        return k > 0.001 ? <rect key={p.param} x={xCurva(p.c - 0.035)} y={200} width={xCurva(0.07) - G.x0} height={G.base - 200} className={s.bandaBrote} opacity={k} /> : null;
      })}
      <EjesBrotes />
      {cu > 0.001 && (
        <g>
          <path d={`${linea} L${xf.toFixed(1)},${G.base} L${G.x0},${G.base} Z`} className={s.areaCurva} />
          <path d={linea} className={s.curva} />
          {cu < 0.999 && <circle cx={xf} cy={yf} r={9} className={s.puntaCurva} />}
        </g>
      )}
      {PICOS.map((p) => {
        const k = v(t, p.param);
        if (k <= 0.001) return null;
        const px = xCurva(p.c), py = yCurva(p.c);
        const w = p.txt.length * 12.5 + 84;
        return (
          <g key={p.param} opacity={k}>
            <line x1={p.chip} y1={142} x2={px} y2={py - 12} className={s.guia} />
            <circle cx={px} cy={py} r={8} fill={L.lupus} />
            <g transform={`translate(${p.chip},${112}) scale(${0.85 + 0.15 * easeBack(k)})`}>
              <rect x={-w / 2} y={-30} width={w} height={60} rx={30} className={s.chip} />
              <IconoOrgano i={p.icono} x={-w / 2 + 32} y={0} k={0.4} />
              <text x={-w / 2 + 62} y={1} dy="0.35em" className={s.chipTxt}>{p.txt}</text>
            </g>
          </g>
        );
      })}
      {PICOS.some((p) => v(t, p.param) > 0.5) && (
        <text x={xCurva(0.7)} y={G.base + 34} textAnchor="middle" className={s.lEtiquetaRoja} opacity={v(t, 'brote1')}>brotes</text>
      )}

      {/* Espectro: de leve a agresivo */}
      {es > 0.001 && (
        <g opacity={tramo(es, 0, 0.3)}>
          <text x={300} y={640} className={s.lEtiquetaMayus}>espectro</text>
          <rect x={300} y={660} width={1000} height={24} rx={12} className={s.rielEspectro} />
          <rect x={300} y={660} width={1000 * easeOut(es)} height={24} rx={12} fill="url(#lp-espectro)" />
          <text x={300} y={724} className={s.significado}>leve</text>
          <text x={300} y={754} className={s.lSub}>síntomas leves toda la vida</text>
          {gr > 0.001 && (
            <g opacity={gr}>
              <text x={1300} y={724} textAnchor="end" className={`${s.significado} ${s.textoLupus}`}>agresivo</text>
              <text x={1300} y={754} textAnchor="end" className={s.lSub}>riñón o cerebro, en poco tiempo</text>
              <IconoOrgano i="rinon" x={1352} y={672} k={0.42 * (0.8 + 0.2 * easeBack(gr))} />
              <IconoOrgano i="cerebro" x={1420} y={672} k={0.42 * (0.8 + 0.2 * easeBack(gr))} />
            </g>
          )}
        </g>
      )}

      {/* «No el lupus de los libros: su lupus» */}
      {li > 0.001 && (
        <g opacity={tramo(li, 0, 0.4)}>
          <text x={560} y={880} textAnchor="middle" className={s.libro}>el lupus de los libros</text>
          <line x1={400} y1={872} x2={400 + 320 * easeOut(tramo(li, 0.3, 1))} y2={872} className={s.tachado} />
        </g>
      )}
      {su > 0.001 && (
        <g opacity={su} transform={`translate(1060,884) scale(${0.85 + 0.15 * easeBack(su)})`}>
          <text textAnchor="middle" className={s.suLupus}>su lupus</text>
        </g>
      )}
    </g>
  );
}

// ─── 4 · A quién le da ────────────────────────────────────────────────────────

function Persona({ x, y, mujer, k }: { x: number; y: number; mujer: boolean; k: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${0.6 + 0.4 * easeBack(k)})`} opacity={Math.min(1, k * 1.4)}>
      <Figurita mujer={mujer} c={mujer ? L.mujer : L.varon} />
    </g>
  );
}

const H_ = { x0: 880, x1: 1480, base: 640, alto: 320 };
const MUJERES = [0.02, 0.05, 0.18, 0.55, 0.85, 1, 0.92, 0.75, 0.58, 0.38, 0.25, 0.16, 0.1, 0.06, 0.03, 0.02];
const VARONES = [0.01, 0.03, 0.06, 0.12, 0.18, 0.24, 0.3, 0.34, 0.38, 0.4, 0.38, 0.33, 0.27, 0.2, 0.12, 0.06];
const xEdad = (a: number) => H_.x0 + (a / 80) * (H_.x1 - H_.x0);
const CURVA_VARON = `M${VARONES.map((h, i) => `${xEdad(i * 5 + 2.5).toFixed(1)},${(H_.base - h * H_.alto).toFixed(1)}`).join(' L')}`;

const EjesEdad = memo(function EjesEdad() {
  return (
    <g>
      <line x1={H_.x0 - 10} y1={H_.base} x2={H_.x1 + 10} y2={H_.base} className={s.eje} />
      {[0, 20, 40, 60, 80].map((a) => (
        <g key={a}>
          <line x1={xEdad(a)} y1={H_.base} x2={xEdad(a)} y2={H_.base + 8} className={s.eje} />
          <text x={xEdad(a)} y={H_.base + 32} textAnchor="middle" className={s.lSub}>{a}</text>
        </g>
      ))}
      <text x={(H_.x0 + H_.x1) / 2} y={H_.base + 70} textAnchor="middle" className={s.lEtiquetaMayus}>edad de inicio (años)</text>
    </g>
  );
});

function Quien({ t, reloj }: { t: T; reloj: number }) {
  const fi = v(t, 'figuras'), ra = v(t, 'razon'), ed = v(t, 'edad'), ba = v(t, 'banda'), va = v(t, 'varon'), pi = v(t, 'pista');
  const bw = (H_.x1 - H_.x0) / MUJERES.length;
  const brillo = tramo(pi, 0, 0.5) * (1 - 0.6 * tramo(pi, 0.5, 1)) * (0.6 + 0.4 * Math.sin(reloj / 260));
  return (
    <g>
      <text x={130} y={150} className={s.lEtiquetaMayus}>¿A quién le da?</text>
      {Array.from({ length: 10 }, (_, i) => {
        const k = tramo(fi, i * 0.08, i * 0.08 + 0.28);
        return k > 0 ? <Persona key={i} x={160 + i * 60} y={300} mujer={i < 9} k={k} /> : null;
      })}
      {ra > 0.001 && (
        <g opacity={ra} transform={`translate(430,520) scale(${0.85 + 0.15 * easeBack(ra)})`}>
          <text x={-70} textAnchor="middle" className={s.razon} style={{ fill: L.mujer }}>9</text>
          <text textAnchor="middle" className={`${s.razon} ${s.razonSep}`}>:</text>
          <text x={70} textAnchor="middle" className={s.razon} style={{ fill: L.varon }}>1</text>
          <text y={60} textAnchor="middle" className={s.significado}>mujeres por cada hombre</text>
        </g>
      )}
      {ba > 0.001 && <text x={430} y={650} textAnchor="middle" className={s.lSub} opacity={ba}>sobre todo en edad fértil</text>}

      {/* Edad de inicio */}
      {ed > 0.001 && (
        <g>
          {ba > 0.001 && (
            <g opacity={ba}>
              <rect x={xEdad(15)} y={270} width={xEdad(44) - xEdad(15)} height={H_.base - 270} className={s.bandaEdad} />
              {brillo > 0.001 && <rect x={xEdad(15)} y={270} width={xEdad(44) - xEdad(15)} height={H_.base - 270} className={s.bandaEdadBorde} opacity={brillo} />}
              <text x={(xEdad(15) + xEdad(44)) / 2} y={254} textAnchor="middle" className={`${s.significado} ${s.textoLupus}`}>15 a 44 años</text>
            </g>
          )}
          {MUJERES.map((h, i) => {
            const k = easeOut(tramo(ed, i * 0.03, i * 0.03 + 0.5));
            return <rect key={i} x={H_.x0 + i * bw + 3} y={H_.base - h * H_.alto * k} width={bw - 6} height={h * H_.alto * k} rx={4} fill={L.mujer} opacity={0.82} />;
          })}
          <EjesEdad />
          <g transform={`translate(${H_.x1 - 110},290)`} opacity={tramo(ed, 0.3, 0.8)}>
            <rect width={18} height={18} rx={4} fill={L.mujer} />
            <text x={28} y={9} dy="0.35em" className={s.lSub}>mujeres</text>
          </g>
        </g>
      )}
      {va > 0.001 && (
        <g>
          <path d={CURVA_VARON} className={s.curvaVaron} {...dibujar(va)} style={{ stroke: L.varon }} />
          <g opacity={tramo(va, 0.6, 1)}>
            <text x={xEdad(58)} y={H_.base - 0.42 * H_.alto - 16} className={s.lEtiqueta} style={{ fill: L.varon }}>varón</text>
            <text x={xEdad(58)} y={H_.base - 0.42 * H_.alto + 12} className={s.lSub}>más tarde, más disperso</text>
          </g>
        </g>
      )}
      {pi > 0.5 && (
        <g opacity={tramo(pi, 0.5, 1)} transform={`translate(1180,160) scale(${0.85 + 0.15 * easeBack(tramo(pi, 0.5, 1))})`}>
          <rect x={-250} y={-32} width={500} height={64} rx={32} className={s.chipPista} />
          <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>Pista: las hormonas → capítulo 1</text>
        </g>
      )}
    </g>
  );
}

// ─── 5 · El gran imitador ─────────────────────────────────────────────────────

/** Los órganos, en el orden en que la voz los nombra. */
const ORGANOS: { txt: string; lado: 'izq' | 'der'; ly: number; ax: number; ay: number }[] = [
  { txt: 'Piel', lado: 'izq', ly: 215, ax: 318, ay: 246 },
  { txt: 'Articulaciones', lado: 'izq', ly: 470, ax: 214, ay: 530 },
  { txt: 'Riñón', lado: 'izq', ly: 400, ax: 338, ay: 432 },
  { txt: 'Sangre', lado: 'der', ly: 520, ax: 440, ay: 540 },
  { txt: 'Corazón', lado: 'der', ly: 350, ax: 434, ay: 346 },
  { txt: 'Pulmón', lado: 'izq', ly: 300, ax: 346, ay: 312 },
  { txt: 'Sistema nervioso', lado: 'der', ly: 130, ax: 436, ay: 130 },
];

/** Orden de pintado (índices de ORGANOS): piel, pulmón, vasos, riñón, corazón, articulaciones, SNC. */
const ORDEN_DIBUJO = [0, 5, 3, 2, 4, 1, 6];

function OrganoCuerpo({ i, k, pulso }: { i: number; k: number; pulso: number }) {
  // Fantasma hasta que se enciende; luego su color.
  const capa = (n: ReactNode) => <g>{k < 0.999 && <g className={s.organoFantasma}>{n}</g>}{k > 0.001 && <g opacity={k}>{n}</g>}</g>;
  const halo = pulso > 0.001 ? (cx: number, cy: number, r: number) => <circle cx={cx} cy={cy} r={r * (1 + 0.15 * pulso)} className={s.haloOrgano} opacity={pulso} /> : () => null;
  switch (i) {
    case 0:
      return k > 0.001 ? <g opacity={k}><Silueta2 />{halo(CX, 112, 40)}</g> : null;
    case 1:
      return (
        <g>
          {ARTICULACIONES.flatMap(([x, y, q], j) => [-1, 1].map((l) => <g key={`${j}${l}`}>{halo(CX + x * l, y, 100 * q + 6)}</g>))}
          {capa(<Articulaciones />)}
        </g>
      );
    case 2:
      return capa(<RinonesEn />);
    case 3:
      return <g>{halo(CX + 15, 500, 30)}{capa(<Vasos />)}</g>;
    case 4:
      return <g>{halo(CX + 16, 334, 42)}{capa(<CorazonEn />)}</g>;
    case 5:
      return capa(<PulmonesEn />);
    case 6:
      return <g>{halo(CX, 130, 50)}{capa(<Sistema />)}</g>;
  }
  return null;
}

/** El contorno encendido cuando entra «piel». */
const Silueta2 = memo(function Silueta2() {
  return <g className={s.pielEncendida}><Silueta /></g>;
});

const PACIENTES: { titulo: string; sub: string; sintomas: string; etiquetas: { t: string; i: Icono }[]; organos: number[]; param: string; tono: string; fondo: string }[] = [
  { titulo: 'Paciente 1', sub: '20 años', sintomas: 'dolor de muñecas · caída del cabello', etiquetas: [{ t: 'Articulaciones', i: 'articulacion' }, { t: 'Piel', i: 'piel' }], organos: [0, 1], param: 'paciente1', tono: '#C2385A', fondo: s.panelP1 },
  { titulo: 'Paciente 2', sub: '', sintomas: 'anemia · moretones', etiquetas: [{ t: 'Sangre', i: 'sangre' }], organos: [3], param: 'paciente2', tono: '#7B4FC9', fondo: s.panelP2 },
  { titulo: 'Paciente 3', sub: '', sintomas: 'convulsiones', etiquetas: [{ t: 'Sistema nervioso', i: 'cerebro' }], organos: [6], param: 'paciente3', tono: '#3E8E6A', fondo: s.panelP3 },
];

/** La foto de cada paciente, que no cambia nunca. */
const Foto = memo(function Foto({ j, y }: { j: number; y: number }) {
  return (
    <g>
      <clipPath id={`lp-foto-${j}`}><rect x={840} y={y} width={156} height={205} rx={22} /></clipPath>
      <g clipPath={`url(#lp-foto-${j})`}>
        <rect x={840} y={y} width={156} height={205} className={PACIENTES[j].fondo} />
        <g transform={`translate(918,${y + 16}) scale(0.34) translate(0,-226)`}><Retrato id={`pac-${j}`} {...PACIENTES_TEZ[j]} /></g>
      </g>
    </g>
  );
});

function Imitador({ t }: { t: T }) {
  const cu = v(t, 'cuerpo'), og = v(t, 'organos'), tr = v(t, 'tres'), pe = v(t, 'pensar');
  const ps = PACIENTES.map((p) => v(t, p.param));
  // Pulso en los órganos del paciente que acaba de entrar (hasta que entra el siguiente).
  const pulso = (i: number) => PACIENTES.reduce((m, p, j) => (p.organos.includes(i) ? Math.max(m, ps[j] * (1 - (ps[j + 1] ?? 0)) * (1 - tr)) : m), 0);
  return (
    <g>
      {cu > 0.001 && (
        <g opacity={cu}>
          <Silueta />
          {/* De atrás hacia delante: el pulmón no tapa al corazón. */}
          {ORDEN_DIBUJO.map((i) => <OrganoCuerpo key={ORGANOS[i].txt} i={i} k={clamp(og - i)} pulso={pulso(i)} />)}
          {ORGANOS.map((o, i) => {
            const k = clamp(og - i);
            if (k <= 0.001) return null;
            const lx = o.lado === 'izq' ? 160 : 640;
            return (
              <g key={`r${o.txt}`} opacity={k}>
                <line x1={o.lado === 'izq' ? lx + 12 : lx - 12} y1={o.ly} x2={o.ax} y2={o.ay} className={s.guia} />
                <text x={lx} y={o.ly} dy="0.35em" textAnchor={o.lado === 'izq' ? 'end' : 'start'} className={s.lEtiqueta}>{o.txt}</text>
              </g>
            );
          })}
        </g>
      )}

      {PACIENTES.map((p, j) => {
        const k = ps[j];
        if (k <= 0.001) return null;
        const y = 120 + j * 245;
        return (
          <g key={p.titulo} opacity={k} transform={`translate(${40 * (1 - easeOut(k))},0)`}>
            {/* Sombra en una capa aparte: sin `filter` */}
            <rect x={844} y={y + 8} width={680} height={205} rx={24} className={s.tarjetaSombra} />
            <rect x={840} y={y} width={680} height={205} rx={22} className={s.tarjetaPaciente} />
            <Foto j={j} y={y} />
            <rect x={840} y={y} width={680} height={205} rx={22} className={s.tarjetaFilo} />
            <text x={1022} y={y + 50} className={s.tarjetaEyebrow} style={{ fill: p.tono }}>{p.titulo}{p.sub && <tspan className={s.tarjetaEdad}> · {p.sub}</tspan>}</text>
            <text x={1022} y={y + 94} className={s.tarjetaSintoma}>{p.sintomas}</text>
            <line x1={1022} y1={y + 118} x2={1490} y2={y + 118} className={s.tarjetaLinea} />
            {p.etiquetas.map((e, n) => {
              const x0 = p.etiquetas.slice(0, n).reduce((a, o) => a + o.t.length * 10.4 + 74, 1022);
              const w = e.t.length * 10.4 + 60;
              return (
                <g key={e.t} transform={`translate(${x0},${y + 138})`}>
                  <rect width={w} height={44} rx={22} className={s.etiquetaOrgano} />
                  <IconoOrgano i={e.i} x={24} y={22} k={0.34} />
                  <text x={46} y={22} dy="0.35em" className={s.etiquetaOrganoTxt}>{e.t}</text>
                </g>
              );
            })}
            {tr > 0.001 && (
              <g opacity={tr} transform={`translate(1432,${y + 152}) rotate(-10) scale(${(1.3 - 0.3 * easeOut(tr)) * 0.85})`}>
                <rect x={-82} y={-30} width={164} height={60} rx={10} className={s.sello} />
                <text textAnchor="middle" dy="0.35em" className={s.selloTxt}>LUPUS</text>
              </g>
            )}
          </g>
        );
      })}
      {pe > 0.001 && (
        <g>
          <text x={1180} y={905} textAnchor="middle" className={s.significado} opacity={tramo(pe, 0, 0.5)}>Por eso el diagnóstico es difícil…</text>
          <text x={1180} y={950} textAnchor="middle" className={`${s.significado} ${s.textoLupus}`} opacity={tramo(pe, 0.5, 1)}>…y por eso hay que pensar en él.</text>
        </g>
      )}
    </g>
  );
}

// ─── 6 · La ruta ──────────────────────────────────────────────────────────────

const CAMINO = 'M110,900 C300,900 280,700 420,690 C560,680 560,520 680,500 C800,480 840,640 980,640 C1120,640 1100,420 1230,400 C1360,380 1380,240 1480,200';
const nombre = (n: number, solo: boolean) => (solo ? INDICE[n]?.nombre : INDICE[n]?.nombreCorto) ?? '';

type Parada = { x: number; y: number; num: string; titulo: string; caps: number[]; color: string; param: string; lado: 'arriba' | 'abajo'; dx?: number };
const PARADAS: Parada[] = [
  { x: 420, y: 690, num: '1', titulo: 'Causas', caps: [1], color: L.causas, param: 'causas', lado: 'abajo' },
  { x: 680, y: 500, num: '2–4', titulo: 'Mecanismo', caps: [2, 3, 4], color: L.mecanismo, param: 'mecanismo', lado: 'arriba' },
  { x: 980, y: 640, num: '5–9', titulo: 'Daño, órgano por órgano', caps: [5, 6, 7, 8, 9], color: L.dano, param: 'dano', lado: 'abajo' },
  { x: 1230, y: 400, num: '10', titulo: 'Diagnóstico', caps: [10], color: L.diagnostico, param: 'final', lado: 'abajo' },
  { x: 1480, y: 200, num: '11', titulo: 'Tratamiento', caps: [11], color: L.tratamiento, param: 'final', lado: 'arriba', dx: -60 },
];

export function Ruta({ t, reloj }: { t: T; reloj: number }) {
  const ca = v(t, 'camino'), ri = v(t, 'rinon'), to = v(t, 'todo'), aq = v(t, 'aqui');
  return (
    <g>
      <mask id="lp-mascara-ruta">
        <path d={CAMINO} fill="none" stroke="#fff" strokeWidth={60} strokeLinecap="round" {...dibujar(ca)} />
      </mask>
      <g mask="url(#lp-mascara-ruta)">
        <path d={CAMINO} className={s.rutaBase} />
        {to > 0.001 && <path d={CAMINO} className={s.rutaColor} opacity={to} />}
        <path d={CAMINO} className={s.rutaLinea} />
      </g>
      {/* Salida: este capítulo */}
      <g opacity={tramo(ca, 0, 0.15)}>
        <circle cx={110} cy={900} r={24} fill={L.queEs} />
        <path d="M100,900 L107,908 L121,892" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <text x={90} y={952} className={s.lSub}>0 · ¿Qué es el lupus?</text>
      </g>
      {PARADAS.map((p) => {
        const k = v(t, p.param);
        if (k <= 0.001) return null;
        const x = p.x + (p.dx ?? 0);
        const lineas = p.caps.map((n) => `${n} · ${nombre(n, p.caps.length === 1)}`);
        const y0 = p.lado === 'abajo' ? p.y + 78 : p.y - 62 - lineas.length * 28;
        return (
          <g key={p.titulo} opacity={k}>
            {to > 0.001 && <circle cx={p.x} cy={p.y} r={56} fill={p.color} opacity={0.18 * to} filter="url(#lp-halo)" />}
            <g transform={`translate(${p.x},${p.y}) scale(${0.6 + 0.4 * easeBack(k)})`}>
              <circle r={38} fill={p.color} />
              <circle r={38} className={s.paradaAro} />
              <text textAnchor="middle" dy="0.35em" className={s.paradaNum}>{p.num}</text>
            </g>
            <text x={x} y={y0} textAnchor="middle" className={s.paradaTitulo} style={{ fill: p.color }}>{p.titulo}</text>
            {lineas.map((l, j) => {
              const esRinon = p.caps[j] === 9;
              return (
                <g key={l}>
                  {esRinon && ri > 0.001 && <IconoOrgano i="rinon" x={x - l.length * 4.9 - 22} y={y0 + 28 + j * 28 - 6} k={0.28 * (0.8 + 0.2 * easeBack(ri))} />}
                  <text x={x} y={y0 + 30 + j * 28} textAnchor="middle" className={esRinon && ri > 0.5 ? s.paradaCapRinon : s.paradaCap}>{l}</text>
                </g>
              );
            })}
          </g>
        );
      })}
      {aq > 0.001 && (
        <g opacity={aq}>
          <circle cx={420} cy={690} r={48 + 10 * (0.5 + 0.5 * Math.sin(reloj / 280))} className={s.pulsoAqui} />
          <g transform={`translate(420,606) scale(${0.85 + 0.15 * easeBack(aq)})`}>
            <rect x={-118} y={-26} width={236} height={52} rx={26} className={s.chipAqui} />
            <text textAnchor="middle" dy="0.35em" className={s.chipAquiTxt}>Empecemos</text>
          </g>
        </g>
      )}
    </g>
  );
}

// ─── Registro ─────────────────────────────────────────────────────────────────

const FONDOS: Record<Fondo, (p: { t: T; reloj: number }) => ReactNode> = {
  blanco: () => null,
  nombre: ({ t }) => <Nombre t={t} />,
  nucleo: ({ t, reloj }) => <Nucleo t={t} reloj={reloj} />,
  brotes: ({ t }) => <Brotes t={t} />,
  quien: ({ t, reloj }) => <Quien t={t} reloj={reloj} />,
  imitador: ({ t }) => <Imitador t={t} />,
  ruta: ({ t, reloj }) => <Ruta t={t} reloj={reloj} />,
  causas: ({ t, reloj }) => <FondoCausas t={t} reloj={reloj} />,
  epidermis: ({ t, reloj }) => <FondoEpidermis t={t} reloj={reloj} />,
  ciudad: ({ t, reloj }) => <FondoCiudad t={t} reloj={reloj} />,
  'endosoma': ({ t, reloj }) => <FondoEndosoma t={t} reloj={reloj} />,
  'espacio': ({ t, reloj }) => <FondoEspacio t={t} reloj={reloj} />,
  'circulo': ({ t, reloj }) => <FondoCirculo t={t} reloj={reloj} />,
  'firma': ({ t, reloj }) => <FondoFirma t={t} reloj={reloj} />,
  'red': ({ t, reloj }) => <FondoRed t={t} reloj={reloj} />,
  'seleccion': ({ t, reloj }) => <FondoSeleccion t={t} />,
  'germinal': ({ t, reloj }) => <FondoGerminal t={t} reloj={reloj} />,
  'periferia': ({ t, reloj }) => <FondoPeriferia t={t} reloj={reloj} />,
  'efectoras': ({ t, reloj }) => <FondoEfectoras t={t} reloj={reloj} />,
  'freno': ({ t, reloj }) => <FondoFreno t={t} reloj={reloj} />,
  'intersticio': ({ t, reloj }) => <FondoIntersticio t={t} reloj={reloj} />,
  'circuito': ({ t, reloj }) => <FondoCircuito t={t} reloj={reloj} />,
  'puente': ({ t }) => <FondoPuente t={t} />,
  'h-vaso': ({ t, reloj }) => <FondoVasoLupus t={t} reloj={reloj} />,
  'h-sangre': ({ t, reloj }) => <FondoSangreLupus t={t} reloj={reloj} />,
  'h-glomerulo': ({ t, reloj }) => <FondoGlomeruloLupus t={t} reloj={reloj} />,
  'manos': ({ t, reloj }) => <FondoManos t={t} />,
  'boca': ({ t, reloj }) => <FondoBoca t={t} />,
  'torso': ({ t, reloj }) => <FondoTorso t={t} />,
  'discoide': ({ t, reloj }) => <FondoDiscoide t={t} />,
  'valva': ({ t, reloj }) => <FondoValva t={t} />,
  'coronaria': ({ t, reloj }) => <FondoCoronaria t={t} />,
  'torax': ({ t, reloj }) => <FondoTorax t={t} />,
  'cebolla': ({ t, reloj }) => <FondoCebolla t={t} />,
  'pulmon': ({ t, reloj }) => <FondoPulmon t={t} />,
  'capas': ({ t, reloj }) => <FondoCapas t={t} />,
  'fullhouse': ({ t, reloj }) => <FondoFullHouse t={t} />,
  'clases': ({ t, reloj }) => <FondoClases t={t} />,
  'pruebas': ({ t, reloj }) => <FondoPruebas t={t} />,
  'eular': ({ t, reloj }) => <FondoEular t={t} />,
};

export const FondoDe = memo(function FondoDe({ f, t, reloj }: { f: Fondo; t: T; reloj: number }) {
  return (
    <g className={s.fondo}>
      <DefsFondo />
      {FONDOS[f]({ t, reloj })}
    </g>
  );
});
