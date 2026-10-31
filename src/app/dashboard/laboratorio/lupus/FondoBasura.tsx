'use client';
// Láminas del capítulo 2 («La basura nuclear»), con el mismo estilo de lámina
// médica que el resto: forma con degradado → sombra → estructuras → brillo.
//
// · `epidermis`: un corte de piel por capas (córnea en escamas, granulosa con
//   queratohialina, espinosa con sus puentes, basal con melanina y melanocitos,
//   membrana basal, y una dermis con colágeno, capilares, fibroblastos y un
//   folículo piloso). Los queratinocitos son fijos (capa `memo`) y solo se
//   repintan los que mueren: unos pocos en silencio (`apoNormal`), muchos con la
//   UV (`apoUV`) y más en el lupus (`apoMas`). Encima: la lupa de las burbujas
//   (`zoom`), el resplandor de la eferocitosis (`calma`), la balanza
//   muerte/limpieza y los retenes de la tolerancia. Macrófago, cuerpos
//   apoptóticos, nucleosomas y el linfocito son actores del motor.
// · `ciudad`: la analogía del resumen (basura ×3, camión una vez por semana,
//   la llamada a la policía = el interferón).

import { memo, type ReactNode } from 'react';
import { L } from '@/lib/data/lupus/colores';
import { ARTERIA_FINA, Tubo, VENA_FINA } from './Anatomia';
import { clamp, dibujar, easeBack, easeInOut, easeOut, tramo, v, type T } from './laminas';
import s from '@/styles/lupus.module.css';

const TAU = Math.PI * 2;
const hash = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const f1 = (n: number) => n.toFixed(1);

// ─── Degradados (una sola vez por lámina) ─────────────────────────────────────

const lineal = (id: string, a: string, b: string, y2 = 1, x2 = 0) => (
  <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
);
const linealClases = (id: string, a: string, b: string) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" className={a} /><stop offset="1" className={b} /></linearGradient>
);

/** Lo que depende del tema va por clase en los `stop`; el metal y la pintura, fijos. */
const DefsComunes = memo(function DefsComunes() {
  return (
    <defs>
      {lineal('bn-t-neutro', '#2B3652', '#46577F', 0, 1)}
      {lineal('bn-t-alerta', '#8A1E3C', '#C2385A', 0, 1)}
      {lineal('bn-t-calma', '#0F5F44', '#1F9A6A', 0, 1)}
      <linearGradient id="bn-acero" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#EEF1F6" /><stop offset="0.45" stopColor="#A9B2C2" /><stop offset="0.7" stopColor="#D5DAE3" /><stop offset="1" stopColor="#6E7789" />
      </linearGradient>
      <linearGradient id="bn-laton" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8A6420" /><stop offset="0.35" stopColor="#F2D388" /><stop offset="0.65" stopColor="#D0A44A" /><stop offset="1" stopColor="#7A5618" />
      </linearGradient>
      <radialGradient id="bn-pomo" cx="0.36" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#FFF0C4" /><stop offset="0.5" stopColor="#D8AC52" /><stop offset="1" stopColor="#6E4C14" />
      </radialGradient>
      <radialGradient id="bn-chispa">
        <stop offset="0" stopColor="#FFFBE0" /><stop offset="0.35" stopColor="#FFD54A" stopOpacity="0.85" /><stop offset="1" stopColor="#FF9A1E" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
});

const DefsPiel = memo(function DefsPiel() {
  return (
    <defs>
      {linealClases('bn-aire', s.bnAire1, s.bnAire2)}
      {linealClases('bn-epi', s.bnEpi1, s.bnEpi2)}
      {linealClases('bn-dermis', s.bnDe1, s.bnDe2)}
      {linealClases('bn-kc', s.bnKc1, s.bnKc2)}
      {linealClases('bn-gr', s.bnGr1, s.bnGr2)}
      {linealClases('bn-ba', s.bnBa1, s.bnBa2)}
      {linealClases('bn-co', s.bnCo1, s.bnCo2)}
      {lineal('bn-apo', '#EFA6B2', '#BC5F74')}
      <radialGradient id="bn-nuc" cx="0.38" cy="0.32" r="0.8">
        <stop offset="0" stopColor="#C4AEDD" /><stop offset="0.7" stopColor="#8467B5" /><stop offset="1" stopColor="#5E4390" />
      </radialGradient>
      <radialGradient id="bn-nucb" cx="0.38" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#9C80C6" /><stop offset="1" stopColor="#4E3380" />
      </radialGradient>
      <radialGradient id="bn-frag" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#7A5AB4" /><stop offset="1" stopColor="#2F1C5E" />
      </radialGradient>
      <linearGradient id="bn-uv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7B3FD0" stopOpacity="0.3" /><stop offset="1" stopColor="#7B3FD0" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="bn-haz" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#B98CF5" stopOpacity="0.55" /><stop offset="1" stopColor="#B98CF5" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="bn-sol" cx="0.42" cy="0.4" r="0.65">
        <stop offset="0" stopColor="#FFF6C8" /><stop offset="0.65" stopColor="#FFC93E" /><stop offset="1" stopColor="#F09A1C" />
      </radialGradient>
      <radialGradient id="bn-lente" cx="0.4" cy="0.34" r="0.75">
        <stop offset="0" className={s.bnLente1} /><stop offset="1" className={s.bnLente2} />
      </radialGradient>
      <radialGradient id="bn-calma">
        <stop offset="0" stopColor="#3CC48E" stopOpacity="0.32" /><stop offset="0.7" stopColor="#1F9A6A" stopOpacity="0.14" /><stop offset="1" stopColor="#1F9A6A" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="bn-mac" cx="0.38" cy="0.32" r="0.8">
        <stop offset="0" stopColor="#F6C79A" /><stop offset="1" stopColor="#C97B3E" />
      </radialGradient>
      <linearGradient id="bn-camino" gradientUnits="userSpaceOnUse" x1="1110" y1="0" x2="1230" y2="0">
        <stop offset="0" className={s.bnCamino} stopOpacity="0" /><stop offset="1" className={s.bnCamino} stopOpacity="1" />
      </linearGradient>
    </defs>
  );
});

// ─── Epidermis ────────────────────────────────────────────────────────────────

const yMb = (x: number) => 538 + 16 * Math.sin(x / 95);

/** Contorno de un queratinocito: polígono blando e irregular, nunca dos iguales. */
function celda(w: number, h: number, sem: number) {
  const n = 10;
  const pts = Array.from({ length: n }, (_, j) => {
    const a = (j / n) * TAU + 0.3, ca = Math.cos(a), sa = Math.sin(a);
    const q = 1 + (hash(sem, j) - 0.5) * 0.13;
    return [Math.sign(ca) * Math.abs(ca) ** 0.62 * (w / 2) * q, Math.sign(sa) * Math.abs(sa) ** 0.62 * (h / 2) * q];
  });
  const medio = (p: number[], q: number[]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const ini = medio(pts[n - 1], pts[0]);
  return `M${f1(ini[0])},${f1(ini[1])} ${pts.map((p, j) => { const m = medio(p, pts[(j + 1) % n]); return `Q${f1(p[0])},${f1(p[1])} ${f1(m[0])},${f1(m[1])}`; }).join(' ')} Z`;
}

type Kc = { i: number; x: number; y: number; w: number; h: number; capa: 'granulosa' | 'espinosa' | 'basal'; d: string };
const KC: Kc[] = (() => {
  const out: Kc[] = [];
  let i = 0;
  const fila = (y: number, w: number, h: number, capa: Kc['capa'], off: number) => {
    for (let x = 40 + off; x < 1570; x += w + 5) {
      const cy = capa === 'basal' ? yMb(x + w / 2) - 34 : y;
      out.push({ i, x, y: cy, w, h, capa, d: celda(w + 4, h + 4, i) });
      i++;
    }
  };
  fila(176, 112, 30, 'granulosa', 0);
  fila(238, 96, 60, 'espinosa', 30);
  fila(303, 96, 60, 'espinosa', 78);
  fila(368, 96, 60, 'espinosa', 22);
  fila(433, 96, 60, 'espinosa', 70);
  fila(497, 52, 58, 'basal', 10);
  return out;
})();
const espinosas = KC.filter((c) => c.capa === 'espinosa');
/** El folículo tapa lo que tiene debajo: ahí no muere nadie que se pueda ver. */
const bajoFoliculo = (c: Kc) => c.x + c.w / 2 > 70 && c.x + c.w / 2 < 220;
const elegir = (n: number, semilla: number, excluir: Set<number>) => {
  const out: number[] = [];
  for (let j = 0; out.length < n && j < 400; j++) {
    const c = espinosas[Math.floor(hash(j, semilla) * espinosas.length)];
    if (!excluir.has(c.i) && !out.includes(c.i) && !bajoFoliculo(c)) out.push(c.i);
  }
  return out;
};
const APO_NORMAL = elegir(2, 3, new Set());
const APO_UV = elegir(13, 7, new Set(APO_NORMAL));
const APO_MAS = elegir(9, 11, new Set([...APO_NORMAL, ...APO_UV]));
/** El queratinocito al que apunta la lupa. */
const LUPA_DE = KC.find((c) => c.i === APO_UV[0])!;

/** Los puentes entre células (desmosomas) y la melanina: un solo trazo por capa. */
const PUENTES = espinosas.map((c) => {
  const cx = c.x + c.w / 2;
  return Array.from({ length: 16 }, (_, j) => {
    const a = (j / 16) * TAU + hash(c.i, j) * 0.2, ca = Math.cos(a), sa = Math.sin(a);
    const x = Math.sign(ca) * Math.abs(ca) ** 0.62 * (c.w / 2), y = Math.sign(sa) * Math.abs(sa) ** 0.62 * (c.h / 2);
    return `M${f1(cx + x - ca * 2)},${f1(c.y + y - sa * 2)}l${f1(ca * 7)},${f1(sa * 7)}`;
  }).join('');
}).join('');
const MELANINA = KC.filter((c) => c.capa === 'basal').map((c) => {
  const cx = c.x + c.w / 2;
  return Array.from({ length: 7 }, (_, j) => `M${f1(cx - 12 + hash(c.i, j) * 24)},${f1(c.y - 21 + hash(c.i, j + 9) * 9)}h0`).join('');
}).join('');

const Cornea = memo(function Cornea() {
  return (
    <g>
      {/* Escamas que ya se desprenden */}
      {[[330, 92, -7], [620, 88, 5], [905, 92, -4], [1215, 87, 7], [1420, 93, -5]].map(([x, y, a], j) => (
        <path key={j} d="M-56,0 Q0,-9 56,0 Q0,9 -56,0 Z" transform={`translate(${x},${y}) rotate(${a})`} fill="url(#bn-co)" className={s.bnEscamaFilo} opacity={0.8} />
      ))}
      {[106, 118, 130, 142, 154].map((y, j) => Array.from({ length: 17 }, (_, n) => (
        <path key={`${y}-${n}`} d="M-62,0 Q0,-10 62,0 Q0,10 -62,0 Z" transform={`translate(${n * 104 - 30 + j * 37},${y + (hash(n, j) - 0.5) * 3})`} fill="url(#bn-co)" className={s.bnEscamaFilo} />
      )))}
    </g>
  );
});

const Dermis = memo(function Dermis() {
  const asa = (x: number) => {
    const t = yMb(x) + 16;
    return { sube: `M${x - 15},662 C${x - 17},620 ${x - 15},${t + 18} ${x},${t}`, baja: `M${x},${t} C${x + 15},${t + 18} ${x + 17},620 ${x + 15},662` };
  };
  return (
    <g>
      {/* Haces de colágeno entrecruzados: gruesos y claros debajo, finos y oscuros encima */}
      {Array.from({ length: 10 }, (_, j) => {
        const y = 625 + j * 40, o = hash(j, 21) * 200;
        return <path key={j} d={`M-30,${y} C${160 + o},${y - 22} ${360 + o},${y + 24} ${620 + o},${y} S${1120 + o},${y - 24} ${1280 + o},${y} S1640,${y + 18} 1660,${y}`} className={s.colageno} strokeWidth={9 + (j % 3) * 4} />;
      })}
      {Array.from({ length: 12 }, (_, j) => {
        const x = -80 + j * 150, y = 640 + hash(j, 8) * 200;
        return <path key={j} d={`M${x},${y} C${x + 60},${y + 40} ${x + 90},${y + 110} ${x + 180},${y + 150}`} className={s.colageno} strokeWidth={6} opacity={0.65} />;
      })}
      {Array.from({ length: 9 }, (_, j) => {
        const y = 650 + j * 40, o = hash(j, 31) * 300;
        return <path key={j} d={`M-30,${y} C${200 + o},${y + 14} ${420 + o},${y - 18} ${700 + o},${y + 6} S1300,${y - 12} 1660,${y + 8}`} className={s.elastina} />;
      })}
      {/* Fibroblastos: un huso con su núcleo */}
      {Array.from({ length: 13 }, (_, j) => {
        const x = 280 + hash(j, 2) * 1240, y = 690 + hash(j, 4) * 290, a = (hash(j, 6) - 0.5) * 44;
        return (
          <g key={j} transform={`translate(${x.toFixed(0)},${y.toFixed(0)}) rotate(${a.toFixed(0)})`}>
            <path d="M-38,0 C-20,-7 -10,-8 0,-7 C12,-8 22,-6 38,0 C22,6 12,8 0,7 C-10,8 -20,7 -38,0 Z" className={s.fibroblasto} />
            <ellipse rx={10} ry={4.2} className={s.nucleoFibro} />
          </g>
        );
      })}
      {/* Plexo subpapilar: de él suben las asas capilares a cada papila */}
      <g opacity={0.72}>
        <Tubo d="M-20,672 C200,650 400,690 640,664 S1120,690 1620,660" w={13} tono={VENA_FINA} />
        <Tubo d="M-20,658 C220,636 420,676 640,650 S1120,676 1620,646" w={10} tono={ARTERIA_FINA} />
        {[240, 390, 540, 690, 840, 990, 1140, 1290, 1440].map((x) => {
          const a = asa(x);
          return (
            <g key={x}>
              <Tubo d={a.baja} w={8} tono={VENA_FINA} cap="round" />
              <Tubo d={a.sube} w={8} tono={ARTERIA_FINA} cap="round" />
            </g>
          );
        })}
      </g>
    </g>
  );
});

/** Pelo con su vaina, el bulbo, la glándula sebácea y el músculo erector. */
const Foliculo = memo(function Foliculo() {
  const eje = 'M170,178 C164,330 148,560 128,800';
  return (
    <g>
      <path d="M128,700 C150,650 212,600 268,574" className={s.erector} />
      <g>
        {[[214, 628, 40, 32], [254, 662, 34, 30], [204, 684, 36, 30]].map(([x, y, rx, ry], j) => (
          <g key={j}>
            <ellipse cx={x} cy={y} rx={rx} ry={ry} className={s.sebacea} />
            {Array.from({ length: 8 }, (_, n) => { const a = (n / 8) * TAU + j; return <circle key={n} cx={x + Math.cos(a) * rx * 0.58} cy={y + Math.sin(a) * ry * 0.58} r={7.5} className={s.sebocito} />; })}
          </g>
        ))}
      </g>
      <path d={eje} className={s.vainaExterna} />
      <path d={eje} className={s.vainaInterna} />
      <ellipse cx={126} cy={812} rx={54} ry={62} fill="url(#bn-ba)" className={s.bnEscamaFilo} />
      <ellipse cx={124} cy={838} rx={25} ry={30} className={s.papilaPelo} />
      {Array.from({ length: 16 }, (_, j) => <circle key={j} cx={92 + hash(j, 5) * 66} cy={770 + hash(j, 7) * 40} r={2.6} className={s.melanina} />)}
    </g>
  );
});

const Pelo = memo(function Pelo() {
  return (
    <g>
      <path d="M186,-14 C176,120 150,560 127,790" className={s.pelo} />
      <path d="M183,-14 C173,120 147,560 124,790" className={s.peloBrillo} />
    </g>
  );
});

const EpidermisFija = memo(function EpidermisFija() {
  const mb = Array.from({ length: 83 }, (_, j) => { const x = j * 20 - 20; return `${x},${yMb(x).toFixed(1)}`; }).join(' L');
  return (
    <g>
      <rect x={-40} y={-40} width={1680} height={190} fill="url(#bn-aire)" />
      <rect x={-40} y={540} width={1680} height={500} fill="url(#bn-dermis)" />
      <Dermis />
      <path d={`M-20,150 L1620,150 L1620,${yMb(1620).toFixed(1)} L${mb.split(' L').reverse().join(' L')} Z`} fill="url(#bn-epi)" />
      <path d={`M${mb}`} className={s.membranaBasalFondo} />
      <path d={`M${mb}`} className={s.membranaBasal} />
      <path d={PUENTES} className={s.puentes} />
      {KC.map((c) => <KcSano key={c.i} c={c} />)}
      <path d={MELANINA} className={s.melaninaNube} />
      {/* Melanocitos: pálidos, entre las basales, con sus prolongaciones */}
      {[420, 1020].map((x) => {
        const y = yMb(x) - 30;
        return (
          <g key={x} transform={`translate(${x},${y.toFixed(1)})`}>
            <path d="M0,0 C-10,-30 -30,-48 -52,-60 M0,0 C4,-34 10,-56 26,-76 M0,0 C14,-22 36,-36 62,-44" className={s.melanocitoRama} />
            <path d="M-13,-14 C-4,-22 12,-20 15,-8 C19,6 12,22 0,23 C-12,24 -18,6 -13,-14 Z" className={s.melanocito} />
            <ellipse cx={1} cy={5} rx={7} ry={11} className={s.nucleoMelanocito} />
            <path d="M-20,-29 h0 M-34,-44 h0 M6,-34 h0 M16,-56 h0 M26,-26 h0 M44,-36 h0" className={s.melaninaNube} />
          </g>
        );
      })}
      <Foliculo />
      <Cornea />
      <Pelo />
    </g>
  );
});

/** Un queratinocito sano: cuerpo con degradado, núcleo con su nucléolo y un filo de luz. */
function KcSano({ c }: { c: Kc }) {
  const cx = c.x + c.w / 2, cy = c.y;
  if (c.capa === 'granulosa') {
    return (
      <g transform={`translate(${cx},${cy})`}>
        <path d={c.d} fill="url(#bn-gr)" className={s.kcFilo} />
        <ellipse rx={14} ry={7} className={s.nucleoGranulosa} />
        {[-40, -28, -19, 21, 30, 42].map((x, j) => <circle key={x} cx={x} cy={(j % 3) * 4 - 4} r={2.2 + (j % 2)} className={s.granuloQh} />)}
      </g>
    );
  }
  const basal = c.capa === 'basal';
  return (
    <g transform={`translate(${cx},${cy})`}>
      <path d={c.d} fill={basal ? 'url(#bn-ba)' : 'url(#bn-kc)'} className={s.kcFilo} />
      <ellipse rx={basal ? 12 : 17} ry={basal ? 16 : 13} cy={basal ? 5 : 0} fill={basal ? 'url(#bn-nucb)' : 'url(#bn-nuc)'} />
      <circle cx={basal ? -3 : -4} cy={basal ? 2 : -3} r={basal ? 2.2 : 2.8} className={s.nucleolo} />
    </g>
  );
}

/** El que muere: se retrae dejando un halo, se oscurece, le salen burbujas y el núcleo se parte. */
function KcMuriendo({ c, k }: { c: Kc; k: number }) {
  const cx = c.x + c.w / 2, cy = c.y;
  const esc = 1 - 0.34 * easeOut(k);
  const r = Math.min(c.w, c.h);
  return (
    <g transform={`translate(${cx},${cy})`}>
      <path d={c.d} transform="scale(1.03)" className={s.huecoQueratinocito} opacity={tramo(k, 0, 0.3)} />
      <g transform={`scale(${esc.toFixed(3)})`}>
        {k > 0.25 && Array.from({ length: 7 }, (_, j) => {
          const a = (j / 7) * TAU + 0.4, rb = (6 + (j % 3) * 2.2) * tramo(k, 0.25 + j * 0.05, 0.6 + j * 0.05);
          const x = Math.cos(a) * c.w * 0.5, y = Math.sin(a) * c.h * 0.54;
          return rb > 0.3 ? (
            <g key={j}>
              <circle cx={x} cy={y} r={rb} className={s.blebPiel} />
              <circle cx={x - rb * 0.3} cy={y - rb * 0.32} r={rb * 0.26} className={s.reflejo} />
            </g>
          ) : null;
        })}
        <path d={c.d} fill="url(#bn-kc)" />
        <path d={c.d} fill="url(#bn-apo)" stroke="#9A4A60" strokeWidth={1.4} opacity={tramo(k, 0.05, 0.5)} />
        {k < 0.5
          ? <ellipse rx={17 * (1 - k * 0.8)} ry={13 * (1 - k * 0.8)} fill="url(#bn-frag)" />
          : [[-0.22, -0.2, 0.16], [0.24, -0.1, 0.13], [0, 0.24, 0.15], [-0.32, 0.26, 0.08]].map(([x, y, q], j) => (
              <g key={j} opacity={tramo(k, 0.5, 0.7)}>
                <circle cx={x * c.w * 0.62} cy={y * c.h * 0.9} r={q * r} fill="url(#bn-frag)" />
                <circle cx={x * c.w * 0.62 - q * r * 0.3} cy={y * c.h * 0.9 - q * r * 0.34} r={q * r * 0.26} className={s.reflejo} />
              </g>
            ))}
      </g>
    </g>
  );
}

/** Las capas se rotulan como en un atlas: regla a la derecha y un banderín por capa. */
const CAPAS: [string, number, number, number][] = [['Capa córnea', 100, 160, 130], ['Granulosa', 163, 194, 178], ['Espinosa', 206, 464, 335], ['Basal', 472, 552, 512], ['Dermis', 566, 985, 962]];

function RotulosCapas({ k }: { k: number }) {
  return (
    <g>
      {CAPAS.map(([txt, a, b, y], j) => {
        const q = tramo(k, j * 0.12, 0.4 + j * 0.12), w = txt.length * 10.2 + 28, fin = 1574;
        return q > 0.001 ? (
          <g key={txt} opacity={q}>
            <path d={`M1582,${a} H1592 V${b} H1582`} className={s.reglaCapa} {...dibujar(q)} />
            <g transform={`translate(${(1 - easeOut(q)) * 24},0)`}>
              <path d={`M${fin - w},${y - 15} H${fin - 8} L${fin},${y} L${fin - 8},${y + 15} H${fin - w} Z`} className={s.chipCapa} />
              <text x={fin - 14} y={y} dy="0.35em" textAnchor="end" className={s.etiquetaCapa}>{txt}</text>
            </g>
          </g>
        ) : null;
      })}
    </g>
  );
}

/** Lupa de verdad: aro de acero, cristal con reflejo y mango. */
function Lupa({ k }: { k: number }) {
  const cx = 1250, cy = 745, R = 180;
  const b = tramo(k, 0, 0.5), a = tramo(k, 0.5, 1);
  const burbujas = Array.from({ length: 8 }, (_, j) => {
    const ang = (j / 8) * TAU - 0.3;
    const grande = j % 2 === 0;
    return { x: Math.cos(ang) * 104, y: Math.sin(ang) * 104, r: (grande ? 41 : 27) * easeOut(tramo(b, j * 0.07, 0.5 + j * 0.06)), grande, j };
  });
  const rotulos = [
    { t: 'ADN fragmentado', x: cx - R - 22, y: cy - 110, fin: 'end' as const, px: cx - 96, py: cy - 74 },
    { t: 'nucleosomas', x: cx - R - 22, y: cy + 120, fin: 'end' as const, px: cx - 110, py: cy + 60 },
    { t: 'Ro', x: cx + R + 22, y: cy - 120, fin: 'start' as const, px: cx + 74, py: cy - 88 },
    { t: 'Sm', x: cx + R + 22, y: cy + 56, fin: 'start' as const, px: cx + 112, py: cy + 56 },
  ];
  const lx = LUPA_DE.x + LUPA_DE.w / 2, ly = LUPA_DE.y;
  return (
    <g opacity={tramo(k, 0, 0.15)}>
      <line x1={lx} y1={ly + 30} x2={cx - R * 0.42} y2={cy - R * 0.9} className={s.hiloLupa} />
      <circle cx={lx} cy={ly} r={38} className={s.anilloLupaL} />
      {/* Mango */}
      <g transform={`translate(${cx},${cy}) rotate(45)`}>
        <rect x={R + 2} y={-11} width={30} height={22} fill="url(#bn-acero)" stroke="#5C6577" strokeWidth={1.5} />
        <rect x={R + 30} y={-15} width={74} height={30} rx={13} fill="#2F3648" stroke="#191D2A" strokeWidth={1.5} />
        <rect x={R + 36} y={-11} width={62} height={6} rx={3} fill="#FFF" opacity={0.2} />
      </g>
      <circle cx={cx} cy={cy} r={R + 8} fill="none" stroke="url(#bn-acero)" strokeWidth={17} />
      <circle cx={cx} cy={cy} r={R + 16} fill="none" stroke="#5C6577" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={R} fill="url(#bn-lente)" stroke="#5C6577" strokeWidth={1.5} />
      <g transform={`translate(${cx},${cy})`}>
        {burbujas.map((u) => u.r > 0.5 && (
          <g key={u.j}>
            <circle cx={u.x} cy={u.y} r={u.r} className={s.bleb} />
            <path d={`M${f1(u.x - u.r * 0.72)},${f1(u.y - u.r * 0.2)} A${f1(u.r * 0.76)},${f1(u.r * 0.76)} 0 0 1 ${f1(u.x - u.r * 0.1)},${f1(u.y - u.r * 0.76)}`} fill="none" stroke="#FFF" strokeWidth={u.r * 0.1} strokeLinecap="round" opacity={0.75} />
            {a > 0 && (u.grande
              ? <g opacity={tramo(a, u.j * 0.05, 0.4 + u.j * 0.05)}>
                  {u.j % 4 === 0
                    ? [[-12, -6], [10, 4], [-2, 14]].map(([x, y], n) => (
                        <g key={n} transform={`translate(${u.x + x},${u.y + y})`}>
                          <circle r={8.5} fill={L.histona} />
                          <circle cx={-2.5} cy={-3} r={2.4} fill="#FFF" opacity={0.55} />
                          <path d="M-11.5,-2 A12,8 0 0 1 11,-3 M-11,3 A12,8 0 0 0 11.5,2" fill="none" stroke={L.adn} strokeWidth={3} strokeLinecap="round" />
                        </g>
                      ))
                    : <g>
                        <path d={`M${u.x - 24},${u.y - 8} q8,-12 16,0 t16,0 t14,3 M${u.x - 24},${u.y - 2} q8,12 16,0 t16,0 t14,-3`} fill="none" stroke={L.adn} strokeWidth={3} strokeLinecap="round" />
                        <path d={`M${u.x - 18},${u.y + 15} q8,-10 14,0 t14,0 M${u.x - 18},${u.y + 21} q8,8 14,0 t14,0`} fill="none" stroke={L.adn} strokeWidth={2.6} strokeLinecap="round" />
                      </g>}
                </g>
              : <g opacity={tramo(a, u.j * 0.05, 0.4 + u.j * 0.05)}>{[[-7, -5], [7, 3], [0, 10]].map(([x, y], n) => (
                  <g key={n}>
                    <circle cx={u.x + x} cy={u.y + y} r={5.2} fill={u.j % 4 === 1 ? L.rnp : '#1F8F8A'} />
                    <circle cx={u.x + x - 1.5} cy={u.y + y - 1.8} r={1.5} fill="#FFF" opacity={0.7} />
                  </g>
                ))}</g>)}
          </g>
        ))}
        <path d="M-78,-8 C-80,-58 -30,-82 6,-78 C50,-74 82,-40 78,4 C74,50 36,80 -6,78 C-50,76 -76,40 -78,-8 Z" fill="url(#bn-apo)" stroke="#9A4A60" strokeWidth={2} />
        <path d="M-58,-26 C-46,-54 -20,-64 4,-62" fill="none" stroke="#FFF" strokeWidth={5} strokeLinecap="round" opacity={0.4} />
        {[[-26, -16, 17], [17, -10, 14], [-4, 24, 16], [27, 28, 9]].map(([x, y, r], n) => (
          <g key={n}>
            <circle cx={x} cy={y} r={r} fill="url(#bn-frag)" />
            <circle cx={x - r * 0.3} cy={y - r * 0.34} r={r * 0.26} fill="#FFF" opacity={0.4} />
          </g>
        ))}
      </g>
      {/* Reflejo del cristal, por encima de todo */}
      <path d={`M${cx - R * 0.82},${cy - R * 0.28} A${R * 0.87},${R * 0.87} 0 0 1 ${cx - R * 0.2},${cy - R * 0.84}`} fill="none" stroke="#FFF" strokeWidth={13} strokeLinecap="round" opacity={0.5} />
      {a > 0 && rotulos.map((r, n) => (
        <g key={r.t} opacity={tramo(a, 0.1 + n * 0.15, 0.35 + n * 0.15)}>
          <line x1={r.fin === 'end' ? r.x + 8 : r.x - 8} y1={r.y - 6} x2={r.px} y2={r.py} className={s.guia} />
          <text x={r.x} y={r.y} textAnchor={r.fin} className={`${s.lEtiqueta} ${s.conHalo}`}>{r.t}</text>
        </g>
      ))}
      <text x={cx - 60} y={cy + R + 56} textAnchor="middle" className={`${s.lSub} ${s.conHalo}`} opacity={tramo(k, 0.2, 0.5)}>queratinocito en apoptosis: burbujas en la superficie</text>
    </g>
  );
}

// ─── Letreros: franja inclinada con medallón, como un rótulo de vídeo ─────────

type Tono = 'neutro' | 'alerta' | 'calma';
const ICONOS: Record<string, ReactNode> = {
  luna: <path d="M5,-13 A14,14 0 1 0 13,7 A11,11 0 0 1 5,-13 Z" fill="#FFF" />,
  reloj: <g fill="none" stroke="#FFF" strokeWidth={3.2} strokeLinecap="round"><circle r={13} /><path d="M0,-7 V0 L6,4" /></g>,
  escudo: <g fill="none" stroke="#FFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M0,-15 L12,-10 V1 C12,8 6,12 0,15 C-6,12 -12,8 -12,1 V-10 Z" /><path d="M-5,0 L-1,4 L6,-4" /></g>,
  alerta: <g fill="none" stroke="#FFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M0,-14 L14,11 H-14 Z" /><path d="M0,-4 V3 M0,7.5 V7.6" /></g>,
  check: <path d="M-11,1 L-3,9 L12,-9" fill="none" stroke="#FFF" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />,
  hoja: <g fill="none" stroke="#FFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M-12,12 C-14,-6 0,-14 14,-14 C14,2 6,14 -12,12 Z" /><path d="M-12,12 L4,-3" /></g>,
};

function Letrero({ x, y, w, txt, k, tono = 'neutro', icono }: { x: number; y: number; w: number; txt: string; k: number; tono?: Tono; icono: keyof typeof ICONOS }) {
  if (k <= 0.001) return null;
  const e = easeOut(tramo(k, 0, 0.8)), W = w * e, x0 = -w / 2, h = 54;
  const franja = (dx: number, dy: number) => `M${x0 + 26 + dx},${-h / 2 + dy} H${x0 + 14 + W + dx} L${x0 + W + dx},${h / 2 + dy} H${x0 + 26 + dx} Z`;
  return (
    <g opacity={tramo(k, 0, 0.25)} transform={`translate(${x},${y})`}>
      <path d={franja(9, 8)} fill={`url(#bn-t-${tono})`} opacity={0.32} />
      <path d={franja(0, 0)} fill={`url(#bn-t-${tono})`} />
      <path d={`M${x0 + 40},${-h / 2 + 5} H${x0 + 10 + W} `} stroke="#FFF" strokeWidth={1.6} opacity={0.3} />
      <text x={x0 + 54 + (w - 54) / 2} dy="0.35em" textAnchor="middle" className={s.letreroTxt} opacity={tramo(k, 0.45, 1)}>{txt}</text>
      <g transform={`translate(${x0 + 26},0) scale(${0.6 + 0.4 * easeBack(tramo(k, 0, 0.6))})`}>
        <circle r={38} fill="#FFF" stroke={`url(#bn-t-${tono})`} strokeWidth={1.5} />
        <circle r={31} fill={`url(#bn-t-${tono})`} />
        {ICONOS[icono]}
      </g>
    </g>
  );
}

// ─── La balanza ───────────────────────────────────────────────────────────────

const MONTON: [number, number][] = [[-38, -13], [0, -13], [38, -13], [-19, -37], [19, -37], [0, -60], [-52, -37], [52, -37], [-30, -60], [30, -60]];

function MiniApo({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {[0.5, 1.7, 2.9, 4.1, 5.3].map((a) => <circle key={a} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={r * 0.38} className={s.blebPiel} />)}
      <circle r={r} fill="url(#bn-apo)" stroke="#9A4A60" strokeWidth={1} />
      <circle cx={-r * 0.3} cy={-r * 0.1} r={r * 0.3} fill="#3B2570" />
      <circle cx={r * 0.32} cy={r * 0.25} r={r * 0.22} fill="#3B2570" />
      <circle cx={-r * 0.3} cy={-r * 0.5} r={r * 0.16} fill="#FFF" opacity={0.5} />
    </g>
  );
}

function MiniMac({ x, y, k }: { x: number; y: number; k: number }) {
  return (
    <g transform={`translate(${x},${y})`} opacity={k}>
      <path d="M-26,3 C-30,-14 -18,-27 -3,-25 C8,-32 25,-22 25,-7 C33,3 22,20 8,19 C-3,27 -22,20 -26,3 Z" fill="url(#bn-mac)" stroke="#9A5A26" strokeWidth={1.2} />
      <path d="M-11,-7 C-2,-14 10,-10 9,0 C8,9 -6,10 -11,3 C-13,0 -13,-4 -11,-7 Z" fill="#8A5428" opacity={0.75} />
      <ellipse cx={-14} cy={-14} rx={7} ry={3.4} fill="#FFF" opacity={0.45} transform="rotate(-32 -14 -14)" />
    </g>
  );
}

function Platillo({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <g>
      {[-54, 54].map((dx) => <line key={dx} x1={x} y1={y - 116} x2={x + dx} y2={y} className={s.cadenaBalanza} />)}
      <g transform={`translate(${x},${y})`}>
        {children}
        <path d="M-70,0 C-54,30 54,30 70,0 Z" fill="url(#bn-laton)" stroke="#6E4C14" strokeWidth={1.2} />
        <ellipse rx={70} ry={6} fill="#F2D388" stroke="#6E4C14" strokeWidth={1} />
      </g>
    </g>
  );
}

function Balanza({ k, muerte, lenta, reloj }: { k: number; muerte: number; lenta: number; reloj: number }) {
  const m = easeOut(muerte), l = easeOut(lenta);
  const cx = 1330, cy = 650, B = 170;
  const angulo = 11 * (0.55 * m + 0.45 * l) + Math.sin(reloj / 900) * 0.5 * (m + l) * 0.5;
  const rad = (angulo * Math.PI) / 180;
  const lx = cx - B * Math.cos(rad), ly = cy + B * Math.sin(rad), rx = cx + B * Math.cos(rad), ry = cy - B * Math.sin(rad);
  const P = 118;
  return (
    <g opacity={k}>
      <text x={cx} y={582} textAnchor="middle" className={`${s.lEtiquetaMayus} ${s.conHalo}`}>El balance</text>
      {/* Base y columna */}
      <ellipse cx={cx} cy={930} rx={96} ry={10} className={s.sombraSuave} />
      <path d={`M${cx - 88},928 L${cx - 72},904 H${cx + 72} L${cx + 88},928 Z`} fill="url(#bn-laton)" stroke="#6E4C14" strokeWidth={1.2} />
      <path d={`M${cx - 42},904 C${cx - 26},892 ${cx - 16},880 ${cx - 11},858 H${cx + 11} C${cx + 16},880 ${cx + 26},892 ${cx + 42},904 Z`} fill="url(#bn-laton)" stroke="#6E4C14" strokeWidth={1} />
      <rect x={cx - 9} y={cy} width={18} height={212} fill="url(#bn-acero)" stroke="#5C6577" strokeWidth={1} />
      {[700, 780, 852].map((y) => <rect key={y} x={cx - 14} y={y} width={28} height={9} rx={3} fill="url(#bn-laton)" stroke="#6E4C14" strokeWidth={0.8} />)}
      {/* Escala y aguja: dice hacia dónde se va el balance */}
      <path d={`M${cx - 52},${cy - 22} A62,62 0 0 1 ${cx + 52},${cy - 22}`} className={s.escalaBalanza} />
      {[-40, -20, 0, 20, 40].map((a) => <line key={a} x1={cx + Math.sin((a * Math.PI) / 180) * 58} y1={cy + 12 - Math.cos((a * Math.PI) / 180) * 58} x2={cx + Math.sin((a * Math.PI) / 180) * 68} y2={cy + 12 - Math.cos((a * Math.PI) / 180) * 68} className={s.marcaBalanza} />)}
      <path d={`M${cx - 3.5},${cy} L${cx},${cy - 60} L${cx + 3.5},${cy} Z`} fill="#C2385A" transform={`rotate(${-angulo * 3.2} ${cx} ${cy})`} />
      {/* Brazo */}
      <g transform={`rotate(${-angulo} ${cx} ${cy})`}>
        <path d={`M${cx - B - 7},${cy - 3} C${cx - 90},${cy - 7} ${cx - 40},${cy - 12} ${cx},${cy - 14} C${cx + 40},${cy - 12} ${cx + 90},${cy - 7} ${cx + B + 7},${cy - 3} V${cy + 3} C${cx + 90},${cy + 7} ${cx + 40},${cy + 12} ${cx},${cy + 14} C${cx - 40},${cy + 12} ${cx - 90},${cy + 7} ${cx - B - 7},${cy + 3} Z`} fill="url(#bn-acero)" stroke="#5C6577" strokeWidth={1.1} />
        <path d={`M${cx - B + 6},${cy - 1.5} L${cx + B - 6},${cy - 1.5}`} stroke="#FFF" strokeWidth={1.5} opacity={0.65} />
      </g>
      {/* Platillo de la muerte celular: el montón crece */}
      <Platillo x={lx} y={ly + P}>
        {MONTON.map(([x, y], j) => {
          const q = j < 3 ? 1 : easeBack(tramo(muerte, (j - 3) * 0.09, 0.32 + (j - 3) * 0.09));
          return q > 0.01 ? <g key={j} transform={`translate(${x},${y}) scale(${q.toFixed(3)})`}><MiniApo x={0} y={0} r={12.5} /></g> : null;
        })}
      </Platillo>
      {/* Platillo de la limpieza: los macrófagos no dan abasto */}
      <Platillo x={rx} y={ry + P}>
        <MiniMac x={-28} y={-20} k={1 - 0.8 * l} />
        <MiniMac x={28} y={-20} k={1 - 0.8 * tramo(lenta, 0, 0.6)} />
        <MiniMac x={0} y={-22} k={1} />
      </Platillo>
      <circle cx={lx} cy={ly} r={7} fill="url(#bn-pomo)" stroke="#6E4C14" strokeWidth={0.8} />
      <circle cx={rx} cy={ry} r={7} fill="url(#bn-pomo)" stroke="#6E4C14" strokeWidth={0.8} />
      <circle cx={cx} cy={cy} r={15} fill="url(#bn-pomo)" stroke="#6E4C14" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={5} fill="#6E4C14" />
      {/* Rótulos que cuelgan con cada platillo */}
      <g transform={`translate(${lx},${ly + P + 50})`}>
        <text textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>muerte celular</text>
        <g opacity={muerte}>
          <path d="M-36,26 L-28,14 L-20,26 Z" fill="#E5484D" />
          <text x={-12} y={27} className={s.lEtiquetaRoja}>más</text>
        </g>
      </g>
      <g transform={`translate(${rx - 8},${ry + P + 50})`}>
        <text textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>limpieza</text>
        <g opacity={lenta}>
          <path d="M-60,14 L-52,26 L-44,14 Z" fill="#E5484D" />
          <text x={-37} y={27} className={s.lEtiquetaRoja}>más lenta</text>
        </g>
      </g>
    </g>
  );
}

// ─── La tolerancia: tres retenes en el camino del linfocito ───────────────────

const RETENES = [1250, 1385, 1520];
const NOMBRES = ['Médula ósea', 'Timo', 'Periferia'];

const MEDALLONES: ReactNode[] = [
  // Hueso largo abierto, con la médula roja dentro
  <g key="m" transform="rotate(32)">
    <path d="M-16,-30 C-23,-24 -18,-15 -9,-12 L-9,12 C-18,15 -23,24 -16,30 C-8,35 8,35 16,30 C23,24 18,15 9,12 L9,-12 C18,-15 23,-24 16,-30 C8,-35 -8,-35 -16,-30 Z" fill="#EFE2C6" stroke="#A28F68" strokeWidth={1.2} />
    <path d="M-4.5,-24 C-9,-20 -8,-14 -5,-10 L-5,10 C-8,14 -9,20 -4.5,24 H4.5 C9,20 8,14 5,10 L5,-10 C8,-14 9,-20 4.5,-24 Z" fill="#B8433E" />
    {[[-1, -19], [2, -8], [-2, 2], [1.5, 12], [-2, 20]].map(([x, y], j) => <circle key={j} cx={x} cy={y} r={1.6} fill="#F2B8AC" />)}
  </g>,
  // Timo: dos lóbulos con sus lobulillos
  <g key="t">
    {[1, -1].map((l) => (
      <g key={l} transform={`scale(${l},1)`}>
        <path d="M2,-27 C17,-31 25,-10 23,8 C21,22 11,29 3,21 C1,6 1,-12 2,-27 Z" fill="#E6A99F" stroke="#A9655C" strokeWidth={1.2} />
        <path d="M5,-14 C12,-14 17,-11 21,-7 M4,0 C11,0 17,2 23,6 M5,12 C10,12 14,14 17,18" fill="none" stroke="#A9655C" strokeWidth={1.1} opacity={0.75} />
      </g>
    ))}
  </g>,
  // Ganglio: la judía con sus folículos y el vaso que entra por el hilio
  <g key="g">
    <path d="M-28,-6 C-30,-23 -8,-31 11,-25 C30,-19 33,10 19,22 C5,32 -21,28 -25,12 C-14,10 -13,-3 -28,-6 Z" fill="#D7B7D6" stroke="#8C6490" strokeWidth={1.2} />
    {[[-5, -16, 6.5], [10, -14, 6], [18, 0, 6], [10, 14, 6], [-6, 16, 6]].map(([x, y, r], j) => <circle key={j} cx={x} cy={y} r={r} fill="#9C74A6" />)}
    <path d="M-40,2 C-32,2 -26,2 -20,3" fill="none" stroke="#B8433E" strokeWidth={3} strokeLinecap="round" />
  </g>,
];

function Reten({ x, abre, reloj, i }: { x: number; abre: number; reloj: number; i: number }) {
  const px = x + 44, py = 708;
  const luz = abre > 0.5 ? (Math.sin(reloj / 170 + i) > 0 ? '#FFB020' : '#7A5416') : '#3CC48E';
  return (
    <g>
      {/* Poste con base rayada */}
      <rect x={px - 5} y={py} width={10} height={76} fill="url(#bn-acero)" stroke="#5C6577" strokeWidth={0.8} />
      <rect x={px - 15} y={772} width={30} height={19} fill="#2F3648" stroke="#191D2A" strokeWidth={1} />
      {[0, 1, 2].map((n) => <path key={n} d={`M${px - 13 + n * 10},789 l8,-15 h4 l-8,15 Z`} fill="#F2C230" />)}
      {/* Barrera a franjas: pivota en el poste y se levanta al debilitarse */}
      <g transform={`rotate(${64 * abre} ${px} ${py})`}>
        <rect x={px + 7} y={py - 9} width={22} height={18} rx={2} fill="#3A4256" />
        <rect x={px - 112} y={py - 6} width={120} height={12} rx={3} fill="#F5F6F8" stroke="#8E2838" strokeWidth={1} />
        {[0, 1, 2, 3, 4].map((n) => <path key={n} d={`M${px - 106 + n * 24},${py - 5.4} h12 l-5,10.8 h-12 Z`} fill="#D93A4A" />)}
        <circle cx={px - 106} cy={py} r={4} fill="#FF6A6A" />
      </g>
      <circle cx={px} cy={py} r={9} fill="url(#bn-pomo)" stroke="#6E4C14" strokeWidth={0.9} />
      {/* Baliza */}
      <rect x={px - 4} y={py - 22} width={8} height={12} fill="#3A4256" />
      <circle cx={px} cy={py - 27} r={8} fill={luz} stroke="#2F3648" strokeWidth={1.4} />
      <circle cx={px - 2.4} cy={py - 29.5} r={2.2} fill="#FFF" opacity={0.7} />
    </g>
  );
}

function Tolerancia({ k, debil, reloj }: { k: number; debil: number; reloj: number }) {
  return (
    <g opacity={k}>
      <g transform="translate(1385,590)">
        <text textAnchor="middle" className={`${s.lEtiquetaMayus} ${s.conHalo}`}>Tolerancia</text>
        <path d="M-122,-6 H-72 M72,-6 H122" className={s.ornamento} />
      </g>
      {/* El camino que tendría que cerrarle el paso al linfocito */}
      <rect x={1110} y={708} width={460} height={82} fill="url(#bn-camino)" />
      <path d="M1180,708 H1570 M1180,790 H1570" className={s.bordeCamino} />
      <path d="M1200,749 H1570" className={s.lineaCamino} />
      {RETENES.map((x, j) => {
        const abre = easeOut(tramo(debil, j * 0.15, 0.6 + j * 0.15));
        return (
          <g key={x}>
            <Reten x={x} abre={abre} reloj={reloj} i={j} />
            <line x1={x} y1={794} x2={x} y2={812} className={s.guia} />
            <g transform={`translate(${x},${852})`}>
              <circle r={41} fill="url(#bn-acero)" stroke="#5C6577" strokeWidth={1} />
              <circle r={35} className={s.medallonFondo} />
              {MEDALLONES[j]}
            </g>
            <text x={x} y={916} textAnchor="middle" className={`${s.etiquetaReten} ${s.conHalo}`}>{NOMBRES[j]}</text>
          </g>
        );
      })}
      {debil > 0.001 && (
        <g opacity={debil}>
          {/* Un sello, no otra caja */}
          <g transform={`translate(1252,958) rotate(-4) scale(${1.25 - 0.25 * easeOut(debil)})`}>
            <rect x={-92} y={-20} width={184} height={40} className={s.selloRojo} />
            <rect x={-87} y={-15} width={174} height={30} className={s.selloRojoFino} />
            <text textAnchor="middle" dy="0.36em" className={s.selloTxt}>DEBILITADA</text>
          </g>
          <text x={1362} y={952} className={s.lSubChico}>por los genes</text>
          <text x={1362} y={976} className={s.lSubChico}>y las hormonas</text>
        </g>
      )}
    </g>
  );
}

function Chispa({ k, reloj }: { k: number; reloj: number }) {
  const lat = 0.85 + 0.15 * Math.sin(reloj / 120);
  return (
    <g opacity={k} transform="translate(1090,670)">
      <circle r={150 * lat * easeOut(k)} fill="url(#bn-chispa)" />
      <g transform={`scale(${(0.6 + 0.4 * easeBack(k)) * lat}) rotate(${reloj / 60})`}>
        {Array.from({ length: 12 }, (_, j) => {
          const a = (j / 12) * 360, l = j % 2 ? 100 : 78;
          return <path key={j} d={`M-5,-60 L0,${-l} L5,-60 Z`} transform={`rotate(${a})`} fill={j % 2 ? '#FFC93E' : '#FF9A1E'} />;
        })}
      </g>
      <text y={-108} textAnchor="middle" className={`${s.significado} ${s.textoLupus} ${s.conHalo}`}>la chispa</text>
    </g>
  );
}

export function FondoEpidermis({ t, reloj }: { t: T; reloj: number }) {
  const ca = v(t, 'capas'), an = v(t, 'apoNormal'), uv = v(t, 'uv'), au = v(t, 'apoUV'), am = v(t, 'apoMas');
  const zo = v(t, 'zoom'), ca2 = v(t, 'calma'), ch = v(t, 'chispa'), em = v(t, 'empaqueta');
  const apo = new Map<number, number>();
  APO_NORMAL.forEach((i, j) => apo.set(i, tramo(an, j * 0.3, 0.7 + j * 0.3)));
  APO_UV.forEach((i, j) => apo.set(i, tramo(au, j * 0.04, 0.5 + j * 0.04)));
  APO_MAS.forEach((i, j) => apo.set(i, tramo(am, j * 0.05, 0.5 + j * 0.05)));
  return (
    <g>
      <DefsComunes />
      <DefsPiel />
      <EpidermisFija />
      {/* Encima de los fijos, los que están muriendo (tapan al sano de debajo). */}
      {KC.filter((c) => (apo.get(c.i) ?? 0) > 0.001).map((c) => <KcMuriendo key={c.i} c={c} k={apo.get(c.i)!} />)}
      {uv > 0.001 && (
        <g opacity={uv}>
          <rect x={-40} y={0} width={1680} height={480} fill="url(#bn-uv)" />
          {Array.from({ length: 11 }, (_, j) => {
            const x0 = 280 + j * 118, x1 = x0 + 90, y1 = 290;
            const n = 16, pts = Array.from({ length: n + 1 }, (_, q) => { const f = q / n; return `${(x0 + 90 * f + (q % 2 ? 6 : -6)).toFixed(0)},${(-10 + (y1 + 10) * f).toFixed(0)}`; });
            const q = tramo(uv, j * 0.04, 0.6 + j * 0.04);
            return (
              <g key={j}>
                <path d={`M${x0 - 13},-10 L${x0 + 13},-10 L${x1 + 4},${y1} L${x1 - 4},${y1} Z`} fill="url(#bn-haz)" opacity={q} />
                <path d={`M${pts.join(' L')}`} className={s.rayoUv} {...dibujar(q)} />
                <path d={`M${pts.join(' L')}`} className={s.rayoUvNucleo} {...dibujar(q)} />
                {q > 0.95 && <path d={`M${x1 - 11},${y1} H${x1 + 11} M${x1},${y1 - 11} V${y1 + 11} M${x1 - 7},${y1 - 7} L${x1 + 7},${y1 + 7} M${x1 + 7},${y1 - 7} L${x1 - 7},${y1 + 7}`} className={s.danoUv} opacity={0.65 + 0.35 * Math.sin(reloj / 150 + j)} />}
              </g>
            );
          })}
          <g transform="translate(262,44)">
            {Array.from({ length: 12 }, (_, j) => <line key={j} x1={0} y1={-31} x2={0} y2={-42} stroke="#F09A1C" strokeWidth={4} strokeLinecap="round" transform={`rotate(${j * 30 + reloj / 90})`} />)}
            <circle r={26} fill="url(#bn-sol)" />
          </g>
          <text x={316} y={54} className={s.lEtiquetaUv}>Luz UV</text>
        </g>
      )}
      {ca > 0.001 && <RotulosCapas k={ca} />}
      <Letrero x={800} y={725} w={640} txt="Muerte programada: silenciosa y ordenada" k={v(t, 'silencio')} icono="luna" />
      <Letrero x={800} y={815} w={640} txt="El problema: lo que pasa después" k={v(t, 'despues')} tono="alerta" icono="reloj" />
      <Letrero x={560} y={700} w={620} txt="En una persona sana: sin consecuencias" k={v(t, 'sano')} tono="calma" icono="escudo" />
      {em > 0.001 && (
        <g opacity={em} transform="translate(520,0)">
          <path d="M-296,782 V852" className={s.filoLupus} />
          <text x={-276} y={806} className={`${s.significado} ${s.conHalo}`}>La célula que muere empaqueta su núcleo</text>
          <text x={-276} y={846} className={`${s.significado} ${s.textoLupus} ${s.conHalo}`}>y lo muestra hacia afuera</text>
        </g>
      )}
      {zo > 0.001 && <Lupa k={zo} />}
      {ca2 > 0.001 && (
        <g opacity={ca2}>
          <ellipse cx={560} cy={740} rx={215} ry={190} fill="url(#bn-calma)" />
          {[0, 1, 2].map((j) => {
            const f = ((reloj / 2600 + j / 3) % 1);
            return <ellipse key={j} cx={560} cy={740} rx={120 + f * 95} ry={106 + f * 84} className={s.ondaCalma} opacity={(1 - f) * 0.7} />;
          })}
          <Letrero x={560} y={960} w={560} txt="Eferocitosis: calma la inflamación" k={ca2} tono="calma" icono="hoja" />
        </g>
      )}
      <Letrero x={1190} y={960} w={590} txt="Limpieza rápida, silenciosa, sin alarma" k={v(t, 'sinAlarma')} tono="calma" icono="check" />
      <Letrero x={385} y={606} w={510} txt="En el lupus, la limpieza falla" k={v(t, 'falla')} tono="alerta" icono="alerta" />
      {v(t, 'medidor') > 0.001 && <Balanza k={v(t, 'medidor')} muerte={v(t, 'muerte')} lenta={v(t, 'lenta')} reloj={reloj} />}
      <Letrero x={640} y={960} w={880} txt="Evento central: más muerte celular + limpieza más lenta" k={v(t, 'central')} tono="alerta" icono="alerta" />
      {v(t, 'tolerancia') > 0.001 && <Tolerancia k={v(t, 'tolerancia')} debil={v(t, 'debil')} reloj={reloj} />}
      {ch > 0.001 && <Chispa k={ch} reloj={reloj} />}
    </g>
  );
}

// ─── Ciudad ───────────────────────────────────────────────────────────────────

const DefsCiudad = memo(function DefsCiudad() {
  return (
    <defs>
      <linearGradient id="bn-cielo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" className={s.cielo1} /><stop offset="0.65" className={s.cielo2} /><stop offset="1" className={s.cielo3} />
      </linearGradient>
      {linealClases('bn-asfalto', s.asfalto1, s.asfalto2)}
      {linealClases('bn-acera', s.acera1, s.acera2)}
      {lineal('bn-verde', '#55A85A', '#2C7234')}
      {lineal('bn-verdeosc', '#3E8E44', '#1E5A28')}
      {lineal('bn-cabina', '#FBFCFE', '#C7CEDB')}
      {lineal('bn-cristal', '#BFE0F2', '#5C87A6')}
      {lineal('bn-policia', '#FAFBFD', '#D5DBE6')}
      {lineal('bn-azul', '#2F62B8', '#173A7A')}
      {lineal('bn-placa', '#22427E', '#142A56')}
      {lineal('bn-papel', '#FFFFFF', '#E8EAF0')}
      {lineal('bn-copa', '#7DB46C', '#3C7F4E')}
      {lineal('bn-carton', '#D9B27C', '#A77F4C')}
      {[['#5B6658', '#2B332B'], ['#4D5462', '#22262F'], ['#44524B', '#1F2A25']].map(([a, b], j) => (
        <radialGradient key={j} id={`bn-bolsa${j}`} cx="0.36" cy="0.28" r="0.85"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></radialGradient>
      ))}
      <radialGradient id="bn-sirena-azul"><stop offset="0" stopColor="#6FB0FF" stopOpacity="0.85" /><stop offset="1" stopColor="#2F6FD0" stopOpacity="0" /></radialGradient>
      <radialGradient id="bn-sirena-roja"><stop offset="0" stopColor="#FF8A8A" stopOpacity="0.85" /><stop offset="1" stopColor="#E5484D" stopOpacity="0" /></radialGradient>
      <radialGradient id="bn-astro" cx="0.42" cy="0.4" r="0.62"><stop offset="0" className={s.astro1} /><stop offset="1" className={s.astro2} /></radialGradient>
      <radialGradient id="bn-halo"><stop offset="0.4" className={s.astro1} stopOpacity="0.55" /><stop offset="1" className={s.astro1} stopOpacity="0" /></radialGradient>
    </defs>
  );
});

type Ed = [x: number, y: number, w: number, color: string, techo: 'tanque' | 'antena' | 'caseta' | 'aire' | 'nada', tienda: string | null];
const EDIFICIOS: Ed[] = [
  [-30, 300, 150, '#B7654F', 'aire', null],
  [128, 250, 112, '#7A8FA8', 'antena', null],
  [248, 372, 170, '#D6B478', 'tanque', '#C2385A'],
  [426, 285, 120, '#5F8F8B', 'caseta', null],
  [554, 205, 140, '#C98F6B', 'antena', '#2F6FD0'],
  [702, 330, 160, '#8E9DB8', 'tanque', null],
  [870, 270, 120, '#B7654F', 'aire', '#3E8E41'],
  [998, 350, 150, '#DDBE8C', 'caseta', null],
  [1156, 225, 130, '#6B8BA3', 'antena', '#D9881E'],
  [1294, 310, 170, '#B88A7A', 'tanque', null],
  [1472, 255, 170, '#7F9C8E', 'aire', '#7B4FC9'],
];

function Edificio({ e, i }: { e: Ed; i: number }) {
  const [x, y, w, color, techo, tienda] = e;
  const base = 552, cols = Math.floor((w - 24) / 34), filas = Math.floor((base - y - 26) / 46);
  const mx = x + (w - (cols * 34 - 14)) / 2;
  let vidrio = '', luz = '', alfeizar = '';
  for (let f = 0; f < filas; f++) for (let c = 0; c < cols; c++) {
    const wx = mx + c * 34, wy = y + 20 + f * 46;
    const trazo = `M${wx},${wy}h20v28h-20z`;
    if (hash(i * 13 + f, c) > 0.68) luz += trazo; else vidrio += trazo;
    alfeizar += `M${wx - 2},${wy + 30}h24`;
  }
  return (
    <g>
      {techo === 'tanque' && (
        <g transform={`translate(${x + w * 0.68},${y})`}>
          <path d="M-14,0 L-10,-14 M14,0 L10,-14 M-12,-7 L12,-7" stroke="#4A4F5C" strokeWidth={2.5} fill="none" />
          <rect x={-18} y={-44} width={36} height={30} fill="#8A6A4E" /><path d="M-20,-44 L0,-58 L20,-44 Z" fill="#5E4836" />
          {[-9, 0, 9].map((d) => <line key={d} x1={d} y1={-44} x2={d} y2={-14} stroke="#5E4836" strokeWidth={1.2} />)}
        </g>
      )}
      {techo === 'antena' && <path d={`M${x + w * 0.3},${y} V${y - 58} M${x + w * 0.3 - 12},${y - 42} H${x + w * 0.3 + 12} M${x + w * 0.3 - 8},${y - 28} H${x + w * 0.3 + 8}`} stroke="#4A4F5C" strokeWidth={2.4} fill="none" />}
      {techo === 'caseta' && <g><rect x={x + w * 0.56} y={y - 26} width={40} height={26} fill={color} /><rect x={x + w * 0.56} y={y - 26} width={40} height={26} fill="#000" opacity={0.2} /><rect x={x + w * 0.56 + 13} y={y - 18} width={14} height={18} fill="#3A4256" /></g>}
      {techo === 'aire' && [0.22, 0.58].map((f) => <g key={f}><rect x={x + w * f} y={y - 20} width={34} height={20} fill="#AEB5C2" stroke="#6E7789" strokeWidth={1} /><circle cx={x + w * f + 17} cy={y - 10} r={6.5} fill="none" stroke="#6E7789" strokeWidth={1.6} /></g>)}
      <rect x={x} y={y} width={w} height={620 - y} fill={color} />
      <rect x={x} y={y} width={9} height={620 - y} fill="#FFF" opacity={0.13} />
      <rect x={x + w - 15} y={y} width={15} height={620 - y} fill="#000" opacity={0.16} />
      {/* Cornisa */}
      <rect x={x - 5} y={y - 3} width={w + 10} height={10} fill={color} /><rect x={x - 5} y={y - 3} width={w + 10} height={10} fill="#000" opacity={0.26} /><rect x={x - 5} y={y - 3} width={w + 10} height={3} fill="#FFF" opacity={0.3} />
      {/* Ventanas */}
      <path d={vidrio} className={s.ventana} />
      <path d={alfeizar} stroke="#FFF" strokeWidth={2} opacity={0.42} />
      <path d={luz} className={s.ventanaLuz} data-luz="" />
      {/* Planta baja: zócalo, puerta y, en algunos, tienda con toldo */}
      <rect x={x} y={base} width={w} height={68} fill="#000" opacity={0.2} />
      <rect x={x + w * 0.1} y={base + 16} width={Math.min(36, w * 0.28)} height={52} fill="#2F3648" /><rect x={x + w * 0.1 + 4} y={base + 21} width={Math.min(28, w * 0.2)} height={20} fill="#6B86A0" />
      {tienda && (
        <g>
          <rect x={x + w * 0.42} y={base + 22} width={w * 0.5} height={38} fill="#BFD6E6" stroke="#2F3648" strokeWidth={1.6} />
          <path d={Array.from({ length: Math.floor((w * 0.56) / 16) }, (_, n) => n % 2 ? '' : `M${x + w * 0.39 + n * 16},${base + 4}h16l3,18h-16z`).join('')} fill={tienda} />
          <path d={Array.from({ length: Math.floor((w * 0.56) / 16) }, (_, n) => n % 2 ? `M${x + w * 0.39 + n * 16},${base + 4}h16l3,18h-16z` : '').join('')} fill="#F7F8FB" />
        </g>
      )}
    </g>
  );
}

const SKYLINE = 'M-40,620 V330 H30 V270 H90 V340 H170 V230 H240 V190 H290 V300 H380 V250 H460 V210 H530 V320 H610 V170 H660 V140 H700 V260 H800 V300 H860 V215 H950 V280 H1040 V240 H1100 V320 H1180 V160 H1250 V260 H1340 V300 H1420 V205 H1500 V280 H1570 V230 H1640 V620 Z';

function Arbol({ x, k = 1 }: { x: number; k?: number }) {
  return (
    <g transform={`translate(${x},622) scale(${k})`}>
      <ellipse cx={4} cy={1} rx={38} ry={7} fill="#000" opacity={0.18} />
      <path d="M-6,0 C-4,-30 -4,-50 -6,-74 H6 C4,-50 4,-30 6,0 Z" fill="#6E4F37" />
      {[[0, -116, 44], [-30, -92, 32], [30, -92, 34], [0, -84, 36]].map(([cx, cy, r], j) => <circle key={j} cx={cx} cy={cy} r={r} fill="url(#bn-copa)" />)}
      {[[-14, -130, 11], [18, -112, 9], [-28, -100, 8]].map(([cx, cy, r], j) => <circle key={j} cx={cx} cy={cy} r={r} fill="#FFF" opacity={0.14} />)}
    </g>
  );
}

function Farola({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x},620 V430 C${x},404 ${x + 18},396 ${x + 38},396`} fill="none" stroke="#3A4256" strokeWidth={6} strokeLinecap="round" />
      <rect x={x - 7} y={604} width={14} height={18} fill="#2F3648" />
      <path d={`M${x + 28},393 H${x + 58} L${x + 53},406 H${x + 33} Z`} fill="#2F3648" />
      <ellipse cx={x + 43} cy={408} rx={10} ry={3.6} className={s.ventanaLuz} data-luz="" />
    </g>
  );
}

const CiudadFija = memo(function CiudadFija() {
  const tablas = Array.from({ length: 34 }, (_, j) => `M${j * 50 - 20},754V800`).join('');
  return (
    <g>
      <rect x={-40} y={-40} width={1680} height={680} fill="url(#bn-cielo)" />
      <circle cx={1216} cy={126} r={62} fill="url(#bn-astro)" />
      <circle cx={1216} cy={126} r={130} fill="url(#bn-halo)" />
      {[[210, 112, 1], [730, 76, 1.3], [1450, 150, 0.9]].map(([x, y, k], j) => (
        <g key={j} transform={`translate(${x},${y}) scale(${k})`} className={s.nube}>
          <ellipse cx={0} cy={6} rx={84} ry={15} /><circle cx={-32} cy={-6} r={21} /><circle cx={6} cy={-14} r={28} /><circle cx={40} cy={-3} r={18} />
        </g>
      ))}
      <path d={SKYLINE} className={s.lejos} />
      <g className={s.ciudadEdificios}>
        {EDIFICIOS.map((e, j) => <Edificio key={j} e={e} i={j} />)}
      </g>
      {/* Acera de atrás, calle y acera de delante */}
      <rect x={-40} y={620} width={1680} height={18} fill="url(#bn-acera)" />
      <rect x={-40} y={636} width={1680} height={8} className={s.bordillo} />
      <rect x={-40} y={644} width={1680} height={110} fill="url(#bn-asfalto)" />
      <path d="M-40,654 H1640 M-40,744 H1640" className={s.bordeCalle} />
      {Array.from({ length: 17 }, (_, j) => <rect key={j} x={j * 100} y={696} width={58} height={6} rx={2} className={s.lineaCalle} />)}
      <ellipse cx={704} cy={724} rx={34} ry={7} className={s.alcantarilla} /><path d="M680,724 H728 M686,720 H722 M686,728 H722" className={s.alcantarillaRaya} />
      <rect x={-40} y={754} width={1680} height={10} className={s.bordillo} />
      <rect x={-40} y={764} width={1680} height={276} className={s.suelo} />
      <path d={tablas} className={s.junta} />
      <path d="M-40,800 H1640" className={s.junta} />
      <Arbol x={682} k={0.95} /><Arbol x={1290} k={1.1} /><Arbol x={60} k={0.9} />
      <Farola x={830} /><Farola x={1248} />
    </g>
  );
});

function Bolsa({ x, y, k, tono }: { x: number; y: number; k: number; tono: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${0.5 + 0.5 * easeBack(k)})`} opacity={Math.min(1, k * 2)}>
      <path d="M-29,1 C-38,-24 -24,-45 -5,-47 L5,-47 C24,-45 38,-24 29,1 C14,6 -14,6 -29,1 Z" fill={`url(#bn-bolsa${tono})`} />
      <path d="M-14,-38 C-22,-26 -24,-12 -20,-3 M8,-40 C12,-28 12,-16 10,-4" fill="none" stroke="#000" strokeWidth={1.6} opacity={0.35} />
      <path d="M-20,-30 C-24,-22 -25,-15 -24,-9" fill="none" stroke="#FFF" strokeWidth={3.5} strokeLinecap="round" opacity={0.28} />
      <path d="M-5,-47 C-8,-52 -11,-58 -9,-60 C-4,-58 -2,-55 0,-53 C2,-55 4,-58 9,-60 C11,-58 8,-52 5,-47 Z" fill={`url(#bn-bolsa${tono})`} />
      <path d="M-5,-47 H5" stroke="#E8C54A" strokeWidth={2.4} strokeLinecap="round" />
    </g>
  );
}

function Contenedor() {
  return (
    <g>
      <ellipse cx={204} cy={623} rx={68} ry={7} fill="#000" opacity={0.25} />
      {/* Lo que asoma: ya no cierra */}
      <path d="M152,526 C162,500 188,512 200,498 C214,488 240,504 256,526 Z" fill="url(#bn-bolsa1)" />
      <path d="M144,528 H264 L254,614 H154 Z" fill="url(#bn-verde)" stroke="#1E5A28" strokeWidth={1.6} />
      {[164, 186, 208, 230, 248].map((x) => <path key={x} d={`M${x},532 L${x + (204 - x) * 0.08},610`} stroke="#1E5A28" strokeWidth={2.4} opacity={0.5} />)}
      <rect x={140} y={524} width={128} height={8} rx={3} fill="#2C7234" stroke="#1E5A28" strokeWidth={1} />
      <path d="M268,524 L320,484 L326,490 L276,532 Z" fill="url(#bn-verdeosc)" stroke="#1E5A28" strokeWidth={1.2} />
      {[166, 242].map((x) => <g key={x}><circle cx={x} cy={616} r={7} fill="#20252E" /><circle cx={x} cy={616} r={2.5} fill="#A9B0BE" /></g>)}
      <path d="M186,560 h36 M186,572 h36" stroke="#FFF" strokeWidth={3} opacity={0.45} strokeLinecap="round" />
    </g>
  );
}

/** Cuatro bolsas al empezar, doce al final: tres veces más. Se pintan de atrás hacia delante. */
const BOLSAS: { x: number; y: number; n: number }[] = [
  [346, 618], [420, 618], [492, 618], [278, 618], [312, 618], [384, 618], [456, 618], [528, 618], [330, 582], [404, 582], [476, 582], [370, 546],
].map(([x, y], n) => ({ x, y, n })).sort((a, b) => a.y - b.y || a.x - b.x);

function Basura({ ca, ba, reloj }: { ca: number; ba: number; reloj: number }) {
  const extra = tramo(ba, 0.45, 0.9);
  return (
    <g>
      <Contenedor />
      {extra > 0.01 && (
        <g opacity={extra}>
          <path d="M556,618 L552,578 L598,574 L604,616 Z" fill="url(#bn-carton)" stroke="#7E5C30" strokeWidth={1.2} />
          <path d="M552,578 L536,566 L580,558 L598,574 Z" fill="#E6C592" stroke="#7E5C30" strokeWidth={1.2} />
          <path d="M574,576 L578,617" stroke="#C8A06C" strokeWidth={5} />
          <g transform="translate(248,612) rotate(-68)"><rect x={-9} y={-16} width={18} height={30} rx={3} fill="#C2385A" /><rect x={-9} y={-11} width={18} height={6} fill="#FFF" opacity={0.6} /></g>
        </g>
      )}
      {BOLSAS.map((b) => {
        const k = b.n < 4 ? Math.min(1, ca * 2) : tramo(ba, (b.n - 4) * 0.08, 0.32 + (b.n - 4) * 0.08);
        return k > 0.001 ? <Bolsa key={b.n} x={b.x} y={b.y} k={k} tono={b.n % 3} /> : null;
      })}
      {ba > 0.2 && (
        <g opacity={tramo(ba, 0.2, 0.7)}>
          {/* Mal olor y moscas */}
          {[0, 1, 2, 3, 4, 5].map((j) => {
            const f = (reloj / 2400 + j / 6) % 1;
            return <path key={j} d={`M${300 + (j % 3) * 95 + (j > 2 ? 28 : 0)},${500 - f * 56} q-13,-14 0,-28 t0,-28`} className={s.olor} opacity={Math.sin(f * Math.PI) * 0.8} />;
          })}
          {Array.from({ length: 8 }, (_, j) => (
            <g key={j} transform={`translate(${(395 + Math.sin(reloj / (230 + j * 41) + j * 2) * (70 + j * 13)).toFixed(1)},${(500 + Math.cos(reloj / (190 + j * 33) + j) * (28 + j * 5)).toFixed(1)})`}>
              <ellipse rx={2.6} ry={1.8} className={s.mosca} />
              <path d={`M-1,-1 L-5,${Math.sin(reloj / 20 + j) > 0 ? -5 : -2} M1,-1 L5,${Math.sin(reloj / 20 + j) > 0 ? -5 : -2}`} className={s.moscaAla} />
            </g>
          ))}
        </g>
      )}
    </g>
  );
}

/** Señal de obra, con su poste en la acera: «basura × 3». */
function SenalBasura({ k }: { k: number }) {
  if (k <= 0.001) return null;
  const e = easeBack(k);
  return (
    <g opacity={tramo(k, 0, 0.4)}>
      <rect x={636} y={500} width={9} height={122} fill="url(#bn-acero)" />
      <g transform={`translate(640,448) scale(${0.6 + 0.4 * e}) rotate(${(1 - k) * 18})`}>
        <path d="M0,-92 L92,0 L0,92 L-92,0 Z" fill="#20252E" />
        <path d="M0,-84 L84,0 L0,84 L-84,0 Z" fill="#F2C230" />
        <path d="M0,-72 L72,0 L0,72 L-72,0 Z" fill="none" stroke="#20252E" strokeWidth={2.5} />
        <text y={-16} textAnchor="middle" className={s.senalChico}>basura</text>
        <text y={30} textAnchor="middle" className={s.senalGrande}>× 3</text>
      </g>
    </g>
  );
}

/** Calendario de la semana: un solo día con recolección. */
function Calendario({ k }: { k: number }) {
  if (k <= 0.001) return null;
  const dias = ['L', 'M', 'M', 'J', 'V', 'S', 'D'], W = 372, H = 148, celda0 = -W / 2 + 18, paso = (W - 36) / 7;
  return (
    <g opacity={tramo(k, 0, 0.5)} transform={`translate(1036,${444 - (1 - easeOut(k)) * 24}) rotate(-1.4)`}>
      <path d={`M${-W / 2 + 6},${H / 2 + 7} H${W / 2 + 7} V${-H / 2 + 8}`} fill="none" stroke="#000" strokeWidth={8} opacity={0.2} />
      <rect x={-W / 2} y={-H / 2} width={W} height={H} fill="url(#bn-papel)" stroke="#AEB5C2" strokeWidth={1} />
      <rect x={-W / 2} y={-H / 2} width={W} height={50} fill="url(#bn-verde)" />
      <text y={-H / 2 + 26} dy="0.35em" textAnchor="middle" className={s.calendarioTit}>pasa una vez por semana</text>
      {[-110, -54, 54, 110].map((x) => <g key={x}><rect x={x - 3.5} y={-H / 2 - 12} width={7} height={22} rx={3.5} fill="url(#bn-acero)" stroke="#5C6577" strokeWidth={0.7} /></g>)}
      {dias.map((d, j) => {
        const toca = j === 2, x = celda0 + j * paso + paso / 2, y = 25, q = tramo(k, 0.5 + j * 0.05, 0.7 + j * 0.05);
        return (
          <g key={j} opacity={q}>
            <rect x={x - 21} y={y - 36} width={42} height={70} fill={toca ? '#E0F3E2' : '#F3F4F8'} stroke={toca ? '#2C7234' : '#CDD2DC'} strokeWidth={toca ? 2.5 : 1} />
            <text x={x} y={y - 19} dy="0.35em" textAnchor="middle" className={s.calendarioDia}>{d}</text>
            {toca
              ? <g transform={`translate(${x},${y + 12}) scale(0.5)`}><path d="M-26,8 V-10 H10 V8 Z M10,8 V-6 H20 L28,2 V8 Z" fill="#2C7234" /><circle cx={-16} cy={10} r={6} fill="#20252E" /><circle cx={18} cy={10} r={6} fill="#20252E" /></g>
              : <path d={`M${x - 7},${y + 5} L${x + 7},${y + 19} M${x + 7},${y + 5} L${x - 7},${y + 19}`} stroke="#C7CCD6" strokeWidth={2.2} strokeLinecap="round" />}
          </g>
        );
      })}
    </g>
  );
}

function Rueda({ cx, cy, r, giro }: { cx: number; cy: number; r: number; giro: number }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle r={r} fill="#1D2028" />
      <circle r={r - 3} fill="none" stroke="#3C414D" strokeWidth={1.4} />
      <circle r={r * 0.54} fill="url(#bn-acero)" stroke="#5C6577" strokeWidth={1} />
      <g transform={`rotate(${giro})`}>
        {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={Math.cos((a * Math.PI) / 180) * r * 0.34} cy={Math.sin((a * Math.PI) / 180) * r * 0.34} r={r * 0.07} fill="#4A5263" />)}
      </g>
      <circle r={r * 0.14} fill="#4A5263" />
    </g>
  );
}

/** Camión recolector de lado, con la cabina hacia la basura. */
function Camion({ x, y, giro, reloj }: { x: number; y: number; giro: number; reloj: number }) {
  const baliza = Math.sin(reloj / 200) > 0;
  return (
    <g transform={`translate(${x},${y})`}>
      <ellipse cx={0} cy={18} rx={170} ry={9} fill="#000" opacity={0.28} />
      {/* Chasis */}
      <rect x={-156} y={-8} width={310} height={11} fill="#262A33" />
      {/* Caja compactadora */}
      <path d="M-62,-14 V-104 C-62,-114 -52,-120 -42,-120 H118 C138,-120 152,-104 152,-84 V-14 Z" fill="url(#bn-verde)" stroke="#1E5A28" strokeWidth={1.6} />
      {[-30, 10, 50, 90].map((vx) => <path key={vx} d={`M${vx},-118 V-16`} stroke="#1E5A28" strokeWidth={3} opacity={0.42} />)}
      <path d="M-56,-112 H128" stroke="#FFF" strokeWidth={3} opacity={0.3} strokeLinecap="round" />
      <path d="M-62,-36 H152 V-14 H-62 Z" fill="#245F2C" />
      {[-52, -20, 12, 44, 76, 108, 136].map((vx) => <path key={vx} d={`M${vx},-14 l12,-22 h13 l-12,22 Z`} fill="#F2C230" />)}
      <text x={46} y={-70} textAnchor="middle" className={s.camionTxt}>RECOLECTOR</text>
      {/* Tolva trasera con la pala */}
      <path d="M152,-104 L188,-74 V-16 H152 Z" fill="url(#bn-verdeosc)" stroke="#1E5A28" strokeWidth={1.6} />
      <path d="M160,-82 L180,-66 V-34 H160 Z" fill="#14351A" />
      <path d="M186,-52 H200 M186,-30 H200 M198,-60 V-22" stroke="#6E7789" strokeWidth={3.5} fill="none" />
      <circle cx={186} cy={-92} r={5.5} fill="#E5484D" /><circle cx={186} cy={-14} r={4} fill="#FFB020" />
      {/* Escape */}
      <path d="M-68,-14 V-126 L-60,-136" stroke="#5C6577" strokeWidth={6} fill="none" strokeLinecap="round" />
      {/* Cabina */}
      <path d="M-66,-10 V-104 H-112 C-124,-104 -130,-96 -136,-86 L-154,-54 C-158,-48 -160,-44 -160,-36 V-10 Z" fill="url(#bn-cabina)" stroke="#8A93A6" strokeWidth={1.6} />
      <path d="M-76,-94 H-110 C-118,-94 -122,-90 -126,-84 L-142,-56 H-76 Z" fill="url(#bn-cristal)" stroke="#47566A" strokeWidth={1.4} />
      <path d="M-122,-84 L-104,-58 M-110,-90 L-92,-60" stroke="#FFF" strokeWidth={3} opacity={0.35} />
      {/* El conductor, de perfil */}
      <circle cx={-94} cy={-74} r={8} fill="#E2B08E" /><path d="M-103,-77 C-103,-86 -86,-87 -85,-77 Z" fill="#E8B21E" /><path d="M-106,-56 C-106,-66 -84,-66 -82,-56 Z" fill="#2F6FD0" />
      <path d="M-76,-50 V-16 M-146,-50 H-76" stroke="#AEB5C2" strokeWidth={1.6} fill="none" />
      <rect x={-104} y={-44} width={18} height={5} rx={2.5} fill="#6E7789" />
      <rect x={-162} y={-20} width={26} height={12} rx={2} fill="#6E7789" />
      <path d="M-158,-36 C-162,-36 -163,-30 -161,-27 H-150 V-36 Z" fill="#FFE9A8" stroke="#A98A3A" strokeWidth={0.9} />
      <path d="M-134,-90 L-142,-88 V-72" stroke="#3A4256" strokeWidth={2.2} fill="none" /><rect x={-147} y={-74} width={8} height={14} rx={2} fill="#3A4256" />
      {/* Baliza del techo */}
      <rect x={-100} y={-110} width={22} height={7} rx={2} fill="#3A4256" />
      <path d="M-98,-110 C-98,-118 -80,-118 -80,-110 Z" fill={baliza ? '#FFB020' : '#9A6A16'} />
      <Rueda cx={-108} cy={-2} r={25} giro={giro} />
      <Rueda cx={62} cy={-2} r={25} giro={giro} />
      <Rueda cx={118} cy={-2} r={25} giro={giro} />
    </g>
  );
}

/** Patrulla de lado, con la sirena encendida y los destellos en la calle. */
function Patrulla({ x, y, destello, giro }: { x: number; y: number; destello: number; giro: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx={-14} cy={-78} r={70 + 26 * destello} fill="url(#bn-sirena-azul)" opacity={destello} />
      <circle cx={14} cy={-78} r={70 + 26 * (1 - destello)} fill="url(#bn-sirena-roja)" opacity={1 - destello} />
      <ellipse cx={0} cy={15} rx={122} ry={7} fill="#000" opacity={0.28} />
      <path d="M-114,-3 C-120,-20 -112,-30 -92,-34 L-58,-38 L-32,-66 C-28,-70 -22,-72 -16,-72 H46 C54,-72 60,-68 66,-62 L88,-38 L104,-34 C116,-30 120,-18 116,-3 Z" fill="url(#bn-policia)" stroke="#8A93A6" strokeWidth={1.4} />
      {/* Puertas azules con el rótulo */}
      <path d="M-114,-3 C-117,-12 -116,-20 -110,-26 H116 C119,-18 118,-10 116,-3 Z" fill="url(#bn-azul)" />
      <path d="M-110,-26 H116" stroke="#FFF" strokeWidth={3} />
      <text x={2} y={-9} textAnchor="middle" className={s.patrullaTxt}>POLICÍA</text>
      {/* Lunas */}
      <path d="M-46,-38 L-27,-60 C-24,-63 -20,-64 -16,-64 H6 V-38 Z" fill="url(#bn-cristal)" stroke="#47566A" strokeWidth={1} />
      <path d="M14,-38 V-64 H44 C50,-64 54,-61 58,-57 L76,-38 Z" fill="url(#bn-cristal)" stroke="#47566A" strokeWidth={1} />
      <path d="M-20,-58 L-34,-42 M36,-60 L22,-42" stroke="#FFF" strokeWidth={3} opacity={0.35} />
      {/* Faros y sirena */}
      <path d="M-113,-22 C-117,-16 -117,-12 -116,-8 H-104 V-22 Z" fill="#FFE9A8" stroke="#A98A3A" strokeWidth={0.8} />
      <rect x={110} y={-24} width={8} height={12} rx={2} fill="#E5484D" />
      <rect x={-32} y={-78} width={64} height={6} rx={2} fill="#262A33" />
      <rect x={-30} y={-90} width={29} height={12} rx={3} fill="#2F6FD0" opacity={0.35 + 0.65 * destello} />
      <rect x={1} y={-90} width={29} height={12} rx={3} fill="#E5484D" opacity={0.35 + 0.65 * (1 - destello)} />
      <Rueda cx={-74} cy={-2} r={20} giro={giro} />
      <Rueda cx={76} cy={-2} r={20} giro={giro} />
    </g>
  );
}

/** Alguien, en una ventana encendida, con el teléfono en la mano. */
function Vecina({ k }: { k: number }) {
  return (
    <g opacity={k} transform="translate(1394,380)">
      <rect x={-24} y={-32} width={48} height={62} fill="#FFE6A0" stroke="#5E4836" strokeWidth={3} />
      <circle cx={-2} cy={-8} r={9} fill="#6E4F37" />
      <path d="M-16,30 C-16,10 12,8 14,30 Z" fill="#7B4FC9" />
      <path d="M8,14 L12,-4" stroke="#7B4FC9" strokeWidth={6} strokeLinecap="round" />
      <rect x={8} y={-14} width={7} height={13} rx={2} fill="#20252E" />
      <rect x={-30} y={30} width={60} height={5} fill="#FFF" opacity={0.7} />
    </g>
  );
}

function Llamada({ k, pulso }: { k: number; pulso: number }) {
  return (
    <g opacity={k}>
      <Vecina k={1} />
      {/* Globo de cómic: el texto sale de la ventana */}
      <g transform={`translate(1408,262) scale(${0.7 + 0.3 * easeBack(k)})`}>
        <path d="M-168,-30 C-168,-54 -138,-58 -112,-58 H112 C140,-58 168,-54 168,-30 V-4 C168,22 140,26 112,26 H30 L4,66 L0,26 H-112 C-138,26 -168,22 -168,-4 Z" fill="#FFF" stroke="#20252E" strokeWidth={3} strokeLinejoin="round" />
        <g transform="translate(-136,-16) rotate(-12)">
          <path d="M-12,-11 C-14,-4 -10,8 2,14 C6,16 12,14 13,10 L8,5 L3,7 C0,5 -3,1 -4,-3 L0,-6 L-5,-13 C-8,-14 -11,-13 -12,-11 Z" fill="#2F6FD0" />
        </g>
        <text x={22} y={-16} dy="0.35em" textAnchor="middle" className={s.globoTxt}>alguien llama a la policía</text>
      </g>
      {/* La señal baja hasta la patrulla */}
      {[0, 1, 2].map((j) => {
        const f = (pulso + j / 3) % 1;
        return <path key={j} d={`M${1394 + f * 40 - 26},${440 + f * 160} q26,18 52,0`} className={s.ondaLlamada} opacity={(1 - f) * tramo(k, j * 0.2, 0.5 + j * 0.2)} />;
      })}
    </g>
  );
}

// Iconos de las placas: lo de la ciudad a un lado, lo del cuerpo al otro.
const IconoCiudad: Record<string, ReactNode> = {
  Basura: <g transform="translate(0,16) scale(0.62)"><path d="M-29,1 C-38,-24 -24,-45 -5,-47 L5,-47 C24,-45 38,-24 29,1 C14,6 -14,6 -29,1 Z" fill="url(#bn-bolsa0)" /><path d="M-5,-47 C-8,-52 -11,-58 -9,-60 C-4,-58 -2,-55 0,-53 C2,-55 4,-58 9,-60 C11,-58 8,-52 5,-47 Z" fill="url(#bn-bolsa0)" /></g>,
  Camión: <g transform="scale(0.72)"><path d="M-8,10 V-14 H26 V10 Z" fill="url(#bn-verde)" /><path d="M-8,10 V-7 H-20 L-28,2 V10 Z" fill="url(#bn-cabina)" stroke="#6E7789" strokeWidth={1} /><circle cx={-16} cy={12} r={6} fill="#20252E" /><circle cx={16} cy={12} r={6} fill="#20252E" /></g>,
  Policía: <g transform="scale(0.72)"><path d="M-30,10 C-32,2 -28,-2 -22,-3 L-12,-5 L-2,-15 H14 L24,-4 C30,-3 32,4 30,10 Z" fill="url(#bn-azul)" /><rect x={-6} y={-21} width={8} height={6} fill="#2F6FD0" /><rect x={2} y={-21} width={8} height={6} fill="#E5484D" /><circle cx={-17} cy={12} r={6} fill="#20252E" /><circle cx={17} cy={12} r={6} fill="#20252E" /></g>,
};
const IconoCuerpo: Record<string, ReactNode> = {
  Basura: <g><circle r={15} fill="#B9A0E6" stroke="#7B4FC9" strokeWidth={1.4} /><path d="M-20,-5 C-12,-20 12,-20 15,-4 C18,10 -10,16 -15,3 C-18,-7 6,-14 20,-2" fill="none" stroke="#2F6FD0" strokeWidth={3.4} strokeLinecap="round" /></g>,
  Camión: <g transform="scale(0.85)"><path d="M-26,3 C-30,-14 -18,-27 -3,-25 C8,-32 25,-22 25,-7 C33,3 22,20 8,19 C-3,27 -22,20 -26,3 Z" fill="#E9A367" stroke="#9A5A26" strokeWidth={1.2} /><path d="M-11,-7 C-2,-14 10,-10 9,0 C8,9 -6,10 -11,3 C-13,0 -13,-4 -11,-7 Z" fill="#8A5428" /></g>,
  Policía: <g><circle r={20} fill="#BBD3EE" stroke="#4E7DB5" strokeWidth={1.4} /><circle cx={2} cy={1} r={14} fill="#3F6AA8" /><circle cx={-3} cy={-4} r={3.4} fill="#FFF" opacity={0.45} /></g>,
};

/** Placa esmaltada de calle: esquinas cortadas, filete interior y tornillos. */
function Placa({ x, k, tit, sub, color }: { x: number; k: number; tit: string; sub: string; color: string }) {
  if (k <= 0.001) return null;
  const W = 470, H = 102, c = 16;
  const contorno = (w: number, h: number, q: number) => `M${-w / 2 + q},${-h / 2} H${w / 2 - q} L${w / 2},${-h / 2 + q} V${h / 2 - q} L${w / 2 - q},${h / 2} H${-w / 2 + q} L${-w / 2},${h / 2 - q} V${-h / 2 + q} Z`;
  return (
    <g opacity={tramo(k, 0, 0.5)} transform={`translate(${x},${862 + (1 - easeOut(k)) * 30})`}>
      <path d={contorno(W, H, c)} transform="translate(5,7)" fill="#000" opacity={0.22} />
      <path d={contorno(W, H, c)} fill="url(#bn-placa)" />
      <path d={contorno(W - 12, H - 12, c - 3)} fill="none" stroke="#FFF" strokeWidth={1.6} opacity={0.75} />
      <path d={`M${-W / 2 + 70},${H / 2 - 7} H${W / 2 - 70}`} stroke={color} strokeWidth={5} />
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], j) => <g key={j} transform={`translate(${a * (W / 2 - 14)},${b * (H / 2 - 14)})`}><circle r={3.4} fill="url(#bn-acero)" stroke="#20252E" strokeWidth={0.6} /><path d="M-2,0 H2" stroke="#3A4256" strokeWidth={0.9} /></g>)}
      <g transform={`translate(${-W / 2 + 56},0)`}>
        <circle r={32} fill="#FFF" />
        {IconoCiudad[tit]}
      </g>
      <g transform={`translate(${W / 2 - 56},0)`}>
        <circle r={32} fill="#FFF" />
        {IconoCuerpo[tit]}
      </g>
      <text y={-14} dy="0.35em" textAnchor="middle" className={s.placaTit}>{tit}</text>
      <text y={16} dy="0.35em" textAnchor="middle" className={s.placaSub}>{sub}</text>
    </g>
  );
}

export function FondoCiudad({ t, reloj }: { t: T; reloj: number }) {
  const ca = v(t, 'calle'), ba = v(t, 'basura'), cm = v(t, 'camion'), po = v(t, 'policia'), im = v(t, 'inmune'), it = v(t, 'interferon');
  const destello = 0.5 + 0.5 * Math.sin(reloj / 140);
  const avanceC = easeInOut(cm), xCamion = 1780 - 700 * avanceC;
  const avanceP = easeOut(po), xPatrulla = 1760 - 285 * avanceP;
  return (
    <g opacity={ca}>
      <DefsComunes />
      <DefsCiudad />
      <CiudadFija />
      <Basura ca={ca} ba={ba} reloj={reloj} />
      <SenalBasura k={tramo(ba, 0.6, 1)} />
      <Calendario k={cm} />
      {po > 0.001 && <Llamada k={po} pulso={(reloj / 1100) % 1} />}
      {cm > 0.001 && <Camion x={xCamion} y={724} giro={-avanceC * 900} reloj={reloj} />}
      {po > 0.001 && <Patrulla x={xPatrulla} y={708} destello={destello} giro={-avanceP * 720} />}
      {im > 0.001 && [
        ['Basura', 'ADN y nucleosomas expuestos', 280, '#E8B21E'],
        ['Camión', 'macrófagos con C1q', 800, '#55A85A'],
        ['Policía', 'el sistema inmune', 1320, '#6FB0FF'],
      ].map(([a, b, x, c], j) => (
        <Placa key={a as string} x={x as number} k={tramo(im, j * 0.25, 0.4 + j * 0.25)} tit={a as string} sub={b as string} color={c as string} />
      ))}
      {it > 0.001 && (
        <g>
          <g opacity={tramo(it, 0, 0.5)}>
            <g transform="translate(372,960) rotate(-12) scale(1.5)">
              <path d="M-12,-11 C-14,-4 -10,8 2,14 C6,16 12,14 13,10 L8,5 L3,7 C0,5 -3,1 -4,-3 L0,-6 L-5,-13 C-8,-14 -11,-13 -12,-11 Z" fill="#7B4FC9" />
            </g>
            {[0, 1].map((j) => <path key={j} d={`M${396 + j * 10},${936 - j * 8} a${22 + j * 12},${22 + j * 12} 0 0 1 ${20 + j * 10},${20 + j * 10}`} className={s.ondaInterferon} opacity={0.5 + 0.5 * Math.sin(reloj / 170 - j)} />)}
            <text x={606} y={972} textAnchor="end" className={s.significado}>La llamada:</text>
          </g>
          <g opacity={tramo(it, 0.5, 1)} transform={`translate(626,974) scale(${clamp(0.85 + 0.15 * easeBack(tramo(it, 0.5, 1)))})`}>
            <text className={s.respuestaMorada}>el interferón</text>
            <text x={360} className={s.lSub}>→ capítulo 3</text>
          </g>
        </g>
      )}
    </g>
  );
}
