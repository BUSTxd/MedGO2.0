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
import { COLOR_ICONO, IconoOrgano, clamp, dibujar, easeBack, easeOut, tramo, v, type Icono, type T } from './laminas';
import FondoCausas from './FondoCausas';
import { FondoEular, FondoPruebas } from './FondoDiagnostico';
import { FondoCapas, FondoClases, FondoFullHouse } from './FondoNefritis';
import { FondoCebolla, FondoCoronaria, FondoPulmon, FondoTorax, FondoValva } from './FondoOrganos';
import { FondoBoca, FondoDiscoide, FondoManos, FondoTorso } from './FondoClinica';
import { FondoGlomeruloLupus, FondoSangreLupus, FondoVasoLupus } from './FondoHiper';
import { FondoGerminal, FondoSeleccion } from './FondoAdaptativa';
import { FondoEndosoma, FondoFirma, FondoRed } from './FondoInterferon';
import { FondoCiudad, FondoEpidermis } from './FondoBasura';
import type { Fondo } from '@/lib/data/lupus/tipos';
import { L } from '@/lib/data/lupus/colores';
import { INDICE } from '@/lib/data/lupus/indice';
import s from '@/styles/lupus.module.css';

// ─── Defs comunes ─────────────────────────────────────────────────────────────

const DefsFondo = memo(function DefsFondo() {
  return (
    <defs>
      <filter id="lp-suave" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7" /></filter>
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
  );
});

// ─── 1 · El nombre ────────────────────────────────────────────────────────────

const R_C = { x: 430, y: 520 };

/** Rostro de frente, en trazo fino (se dibuja con `k`). */
const TRAZOS_ROSTRO = [
  // contorno, orejas y cuello
  'M430,250 C540,250 605,340 605,470 C605,600 540,720 430,760 C320,720 255,600 255,470 C255,340 320,250 430,250 Z',
  'M256,462 C236,458 234,522 262,530', 'M604,462 C624,458 626,522 598,530',
  'M375,742 L370,830 C330,836 292,852 268,900', 'M485,742 L490,830 C530,836 568,852 592,900',
  // cejas, ojos, nariz, surcos nasogenianos y boca
  'M340,438 Q375,422 408,436', 'M452,436 Q485,422 520,438',
  'M350,470 Q375,452 400,470 Q375,484 350,470 Z', 'M460,470 Q485,452 510,470 Q485,484 460,470 Z',
  'M430,478 L419,574 Q430,586 443,577', 'M410,580 Q402,588 412,592', 'M450,580 Q458,588 448,592',
  'M402,588 Q378,610 380,642', 'M458,588 Q482,610 480,642',
  'M404,660 Q430,670 456,660', 'M410,662 Q430,680 450,662',
];
const PELO = 'M250,486 C228,318 322,212 434,214 C562,216 640,318 612,486 C600,380 540,318 430,316 C324,318 266,380 250,486 Z';
const ALA_IZQ = 'M427,522 C400,505 368,506 340,516 C312,527 300,556 306,585 C313,611 340,619 365,609 C385,599 401,586 413,576 C421,566 425,546 427,522 Z';
const ALA_DER = 'M433,522 C460,505 492,506 520,516 C548,527 560,556 554,585 C547,611 520,619 495,609 C475,599 459,586 447,576 C439,566 435,546 433,522 Z';
const MORDIDAS: [number, number, number][] = [[342, 556, -20], [366, 588, 10], [520, 552, 25], [494, 590, -15], [356, 528, 40]];
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

      {/* Rostro */}
      {ro > 0.001 && (
        <g>
          <path d={PELO} className={s.pelo} opacity={tramo(ro, 0.5, 1)} />
          {TRAZOS_ROSTRO.map((d, j) => <path key={j} d={d} className={s.rostro} {...dibujar(tramo(ro, j * 0.03, 0.55 + j * 0.03))} />)}
          {/* Mordidas: lo que describían en la Edad Media */}
          {mo > 0.001 && (
            <g opacity={mo * (1 - 0.9 * er)}>
              {MORDIDAS.map(([x, y, a], j) => (
                <g key={j} transform={`translate(${x},${y}) rotate(${a}) scale(${0.6 + 0.4 * tramo(mo, j * 0.12, 0.5 + j * 0.12)})`}>
                  <path d="M-16,0 Q0,-14 16,0" className={s.mordida} />
                  <path d="M-11,6 Q0,-4 11,6" className={s.mordida} opacity={0.6} />
                </g>
              ))}
            </g>
          )}
          {/* Eritema malar en alas de mariposa (respeta los surcos nasogenianos) */}
          {er > 0.001 && (
            <g opacity={er} filter="url(#lp-suave)">
              <path d={ALA_IZQ} fill={L.eritema} opacity={0.62} />
              <path d={ALA_DER} fill={L.eritema} opacity={0.62} />
              <ellipse cx={430} cy={524} rx={14} ry={26} fill={L.eritema} opacity={0.5} />
            </g>
          )}
          {er > 0.5 && (
            <g opacity={tramo(er, 0.5, 1)}>
              <line x1={300} y1={600} x2={262} y2={660} className={s.guia} />
              <text x={256} y={684} textAnchor="end" className={s.lEtiqueta}>eritema malar</text>
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

const VasoFijo = memo(function VasoFijo() {
  const endo = Array.from({ length: 9 }, (_, i) => 40 + i * 118);
  return (
    <g>
      <rect x={VASO.x0} y={-20} width={VASO.x1 - VASO.x0} height={1040} className={s.luzVaso} />
      {[VASO.x0, VASO.x1].map((x, k) => (
        <g key={x}>
          <rect x={k ? x : x - 22} y={-20} width={22} height={1040} className={s.paredVaso} />
          {endo.map((y, j) => <ellipse key={j} cx={k ? x - 5 : x + 5} cy={y + (k ? 50 : 0)} rx={6} ry={30} className={s.endotelio} />)}
        </g>
      ))}
      <text x={1470} y={64} textAnchor="middle" className={s.lEtiquetaMayus}>Tejido</text>
      <text x={430} y={64} textAnchor="middle" className={s.lEtiquetaMayus}>Célula del propio cuerpo</text>
    </g>
  );
});

function Nucleo({ t, reloj }: { t: T; reloj: number }) {
  const de = v(t, 'deposito'), inf = v(t, 'inflama');
  const hem = Array.from({ length: 9 }, (_, i) => {
    const y = ((i * 137 + reloj * 0.07) % 1180) - 90;
    return { x: VASO.x0 + 60 + ((i * 53) % 160), y, rot: (i * 47) % 180 };
  });
  return (
    <g>
      {inf > 0.001 && <ellipse cx={VASO.x1 + 90} cy={500} rx={190 * (0.7 + 0.3 * inf)} ry={420} fill="url(#lp-inflama)" opacity={inf} />}
      <VasoFijo />
      {hem.map((h, i) => (
        <g key={i} transform={`translate(${h.x.toFixed(1)},${h.y.toFixed(1)}) rotate(${h.rot})`}>
          <ellipse rx={28} ry={24} className={s.hematie} />
          <ellipse rx={13} ry={10} className={s.hematieCentro} />
        </g>
      ))}
      {de > 0.001 && (
        <g>
          {Array.from({ length: 26 }, (_, i) => {
            const y = [330, 650][i % 2] + ((i * 37) % 120) - 60;
            const k = tramo(de, (i / 26) * 0.6, (i / 26) * 0.6 + 0.4);
            return k > 0 ? <circle key={i} cx={VASO.x1 - 8 + ((i * 13) % 14)} cy={y} r={5 * k} className={s.deposito} /> : null;
          })}
          <text x={VASO.x1 + 40} y={500} className={s.lEtiqueta} opacity={de}>depósitos</text>
          <text x={VASO.x1 + 40} y={528} className={s.lSub} opacity={de}>en la pared</text>
        </g>
      )}
      <g transform={`translate(${(VASO.x0 + VASO.x1) / 2},58)`}>
        <rect x={-92} y={-20} width={184} height={40} rx={20} className={s.chip} />
        <text textAnchor="middle" dy="0.35em" className={s.lEtiquetaMayus}>Vaso pequeño</text>
      </g>
      {inf > 0.3 && <text x={1470} y={860} textAnchor="middle" className={s.lEtiquetaRoja} opacity={tramo(inf, 0.3, 1)}>inflamación</text>}
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
  const c = mujer ? L.mujer : L.varon;
  return (
    <g transform={`translate(${x},${y}) scale(${0.6 + 0.4 * easeBack(k)})`} opacity={Math.min(1, k * 1.4)}>
      <circle cy={-46} r={15} fill={c} />
      {mujer
        ? <path d="M-11,-28 L11,-28 L24,22 L-24,22 Z" fill={c} />
        : <rect x={-15} y={-28} width={30} height={46} rx={7} fill={c} />}
      <path d={mujer ? 'M-8,22 L-8,52 M8,22 L8,52' : 'M-8,18 L-8,52 M8,18 L8,52'} stroke={c} strokeWidth={8} strokeLinecap="round" />
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

const B = { x: 400 };
const CuerpoFijo = memo(function CuerpoFijo() {
  return (
    <g>
      <g className={s.cuerpoSil}>
        <ellipse cx={B.x} cy={140} rx={48} ry={58} />
        <rect x={B.x - 18} y={190} width={36} height={40} />
        <path d="M318,232 C350,222 450,222 482,232 C505,240 512,262 510,300 L500,420 C496,470 498,520 505,560 L295,560 C302,520 304,470 300,420 L290,300 C288,262 295,240 318,232 Z" />
      </g>
      <g className={s.cuerpoMiembro}>
        <polyline points="312,250 282,420 262,585" />
        <polyline points="488,250 518,420 538,585" />
        <polyline points="350,555 345,760 342,925" />
        <polyline points="450,555 455,760 458,925" />
      </g>
      <g className={s.cuerpoSil}>
        <circle cx={258} cy={606} r={18} />
        <circle cx={542} cy={606} r={18} />
        <ellipse cx={334} cy={944} rx={30} ry={14} />
        <ellipse cx={466} cy={944} rx={30} ry={14} />
      </g>
    </g>
  );
});

/** Los órganos, en el orden en que la voz los nombra. */
const ORGANOS: { txt: string; lado: 'izq' | 'der'; ly: number; ax: number; ay: number }[] = [
  { txt: 'Piel', lado: 'izq', ly: 260, ax: 300, ay: 270 },
  { txt: 'Articulaciones', lado: 'izq', ly: 600, ax: 262, ay: 590 },
  { txt: 'Riñón', lado: 'izq', ly: 440, ax: 360, ay: 432 },
  { txt: 'Sangre', lado: 'der', ly: 520, ax: 415, ay: 510 },
  { txt: 'Corazón', lado: 'izq', ly: 340, ax: 412, ay: 326 },
  { txt: 'Pulmón', lado: 'der', ly: 290, ax: 452, ay: 300 },
  { txt: 'Sistema nervioso', lado: 'der', ly: 130, ax: 440, ay: 130 },
];

/** Orden de pintado (índices de ORGANOS): piel, pulmón, vasos, riñón, corazón, articulaciones, SNC. */
const ORDEN_DIBUJO = [0, 5, 3, 2, 4, 1, 6];

function Organo({ i, k, pulso }: { i: number; k: number; pulso: number }) {
  // Fantasma gris hasta que se enciende; luego su color.
  const fant = (n: ReactNode) => <g className={s.organoFantasma}>{n}</g>;
  const vivo = (n: ReactNode) => <g opacity={k}>{n}</g>;
  const capa = (n: ReactNode) => <g>{k < 0.999 && fant(n)}{k > 0.001 && vivo(n)}</g>;
  const halo = pulso > 0.001 ? (cx: number, cy: number, r: number) => <circle cx={cx} cy={cy} r={r * (1 + 0.15 * pulso)} className={s.haloOrgano} opacity={pulso} /> : () => null;
  switch (i) {
    case 0:
      return k > 0.001 ? (
        <g opacity={k}>
          <g className={s.pielBrillo}>
            <ellipse cx={B.x} cy={140} rx={48} ry={58} />
            <path d="M318,232 C350,222 450,222 482,232 C505,240 512,262 510,300 L500,420 C496,470 498,520 505,560 L295,560 C302,520 304,470 300,420 L290,300 C288,262 295,240 318,232 Z" />
          </g>
          {halo(B.x, 112, 40)}
        </g>
      ) : null;
    case 1:
      return (
        <g>
          {[[262, 590], [538, 590], [282, 420], [518, 420], [345, 760], [455, 760]].map(([x, y], j) => (
            <g key={j}>
              {halo(x, y, 22)}
              {capa(<circle cx={x} cy={y} r={15} fill="none" stroke={COLOR_ICONO.articulacion} strokeWidth={7} />)}
            </g>
          ))}
        </g>
      );
    case 2:
      return <g>{capa(<><IconoOrgano i="rinon" x={366} y={432} k={0.36} /><g transform="translate(800,0) scale(-1,1)"><IconoOrgano i="rinon" x={366} y={432} k={0.36} /></g></>)}</g>;
    case 3:
      return (
        <g>
          {halo(B.x + 15, 500, 30)}
          {capa(<path d="M412,330 L404,540 M404,540 L350,600 L346,900 M404,540 L452,600 L456,900 M412,300 L330,260 L284,420 L262,580 M412,300 L470,260 L516,420 L538,580" className={s.vasos} />)}
        </g>
      );
    case 4:
      return <g>{halo(412, 326, 28)}{capa(<IconoOrgano i="corazon" x={412} y={326} k={0.42} />)}</g>;
    case 5:
      return <g>{capa(<IconoOrgano i="pulmon" x={B.x} y={300} k={1.15} color="#EFA9BA" />)}</g>;
    case 6:
      return (
        <g>
          {halo(B.x, 130, 46)}
          {capa(<><IconoOrgano i="cerebro" x={B.x} y={128} k={0.66} /><line x1={B.x} y1={182} x2={B.x} y2={540} stroke={COLOR_ICONO.cerebro} strokeWidth={6} strokeLinecap="round" /></>)}
        </g>
      );
  }
  return null;
}

const PACIENTES = [
  { titulo: 'Paciente 1 · 20 años', sintomas: 'dolor de muñecas · caída del cabello', etiquetas: ['Articulaciones', 'Piel'], organos: [0, 1], param: 'paciente1' },
  { titulo: 'Paciente 2', sintomas: 'anemia · moretones', etiquetas: ['Sangre'], organos: [3], param: 'paciente2' },
  { titulo: 'Paciente 3', sintomas: 'convulsiones', etiquetas: ['Sistema nervioso'], organos: [6], param: 'paciente3' },
];

function Imitador({ t }: { t: T }) {
  const cu = v(t, 'cuerpo'), og = v(t, 'organos'), tr = v(t, 'tres'), pe = v(t, 'pensar');
  const ps = PACIENTES.map((p) => v(t, p.param));
  // Pulso en los órganos del paciente que acaba de entrar (hasta que entra el siguiente).
  const pulso = (i: number) => PACIENTES.reduce((m, p, j) => (p.organos.includes(i) ? Math.max(m, ps[j] * (1 - (ps[j + 1] ?? 0)) * (1 - tr)) : m), 0);
  return (
    <g>
      {cu > 0.001 && (
        <g opacity={cu}>
          <CuerpoFijo />
          {/* De atrás hacia delante: el pulmón no tapa al corazón. */}
          {ORDEN_DIBUJO.map((i) => <Organo key={ORGANOS[i].txt} i={i} k={clamp(og - i)} pulso={pulso(i)} />)}
          {ORGANOS.map((o, i) => {
            const k = clamp(og - i);
            if (k <= 0.001) return null;
            const lx = o.lado === 'izq' ? 170 : 630;
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
            <rect x={840} y={y} width={680} height={205} rx={22} className={s.tarjeta} />
            <circle cx={920} cy={y + 102} r={50} className={s.discoIcono} />
            <Persona x={920} y={y + 116} mujer k={1} />
            <text x={1000} y={y + 66} className={s.tarjetaTitulo}>{p.titulo}</text>
            <text x={1000} y={y + 106} className={s.significado}>{p.sintomas}</text>
            {p.etiquetas.map((e, n) => (
              <g key={e} transform={`translate(${1000 + n * 200},${y + 150})`}>
                <rect width={e.length * 11 + 30} height={34} rx={17} className={s.etiquetaOrgano} />
                <text x={15} y={17} dy="0.35em" className={s.etiquetaOrganoTxt}>{e}</text>
              </g>
            ))}
            {tr > 0.001 && (
              <g opacity={tr} transform={`translate(1420,${y + 152}) rotate(-10) scale(${(1.3 - 0.3 * easeOut(tr)) * 0.85})`}>
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
  'firma': ({ t, reloj }) => <FondoFirma t={t} />,
  'red': ({ t, reloj }) => <FondoRed t={t} reloj={reloj} />,
  'seleccion': ({ t, reloj }) => <FondoSeleccion t={t} />,
  'germinal': ({ t, reloj }) => <FondoGerminal t={t} />,
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
