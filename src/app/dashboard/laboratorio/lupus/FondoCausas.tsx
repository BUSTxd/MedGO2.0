'use client';
// Lámina del capítulo 1 («¿Por qué aparece?»). Una cerradura con tres llaves
// (genes, hormonas, ambiente) que en el paso 0 está grande en el centro y desde
// el paso 1 queda a la izquierda (`panel`); cada llave asoma al empezar su
// apartado (0,5) y entra al terminarlo (1). A la derecha, lo de cada apartado:
// cromosoma 6 y gemelos, complemento temprano, balanza hormonal y cromosoma X,
// piel bajo la luz UV, el virus de Epstein-Barr, lo que tienen en común y el
// lupus por fármacos. Las células y moléculas (dendrítica, macrófago, C1q…) son
// actores del motor; aquí va lo demás.
//
// El mismo estilo que `Anatomia.tsx`: degradados por capas y sin `filter`. Metal,
// vidrio, piel y moléculas llevan su color fijo en los dos temas; los textos y lo
// que depende del fondo, por clase.

import { memo } from 'react';
import { L } from '@/lib/data/lupus/colores';
import { Tubo } from './Anatomia';
import { Figurita } from './Cuerpo';
import { clamp, dibujar, easeBack, easeInOut, easeOut, tramo, v, type T } from './laminas';
import s from '@/styles/lupus.module.css';

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** Valor fijo de 0 a 1 para repartir sin azar real (la lámina sale igual siempre). */
const fijo = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const f1 = (n: number) => n.toFixed(1);

// ─── Degradados ───────────────────────────────────────────────────────────────

const Defs = memo(function Defs() {
  return (
    <defs>
      {/* Acero */}
      <linearGradient id="ca-acero" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#F1F3F7" /><stop offset="0.45" stopColor="#CDD3DD" /><stop offset="0.7" stopColor="#E2E6EC" /><stop offset="1" stopColor="#9CA5B4" />
      </linearGradient>
      <linearGradient id="ca-placa" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#E4E8EE" /><stop offset="1" stopColor="#F7F8FA" />
      </linearGradient>
      <linearGradient id="ca-reflejo" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0.25" stopColor="#FFF" stopOpacity="0" /><stop offset="0.4" stopColor="#FFF" stopOpacity="0.55" /><stop offset="0.55" stopColor="#FFF" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="ca-laton" cx="0.38" cy="0.32" r="0.8">
        <stop offset="0" stopColor="#F7E3AE" /><stop offset="0.6" stopColor="#CFA655" /><stop offset="1" stopColor="#8C6A2C" />
      </radialGradient>
      <linearGradient id="ca-laton-l" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#A9823C" /><stop offset="0.4" stopColor="#F2DCA2" /><stop offset="1" stopColor="#8C6A2C" />
      </linearGradient>
      <linearGradient id="ca-laton-h" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#F2DCA2" /><stop offset="0.55" stopColor="#CFA655" /><stop offset="1" stopColor="#8C6A2C" />
      </linearGradient>
      {/* Cromosomas */}
      <linearGradient id="ca-crom-h" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#F2EDF9" /><stop offset="0.5" stopColor="#D7CCEB" /><stop offset="1" stopColor="#A997CC" />
      </linearGradient>
      <linearGradient id="ca-crom-x" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#EFE9F8" /><stop offset="0.55" stopColor="#CDBEE6" /><stop offset="1" stopColor="#9C87C4" />
      </linearGradient>
      {/* Sol */}
      <radialGradient id="ca-sol" cx="0.42" cy="0.4" r="0.65">
        <stop offset="0" stopColor="#FFF8D6" /><stop offset="0.5" stopColor="#FBD251" /><stop offset="1" stopColor="#EE9C22" />
      </radialGradient>
      <radialGradient id="ca-corona">
        <stop offset="0.42" stopColor="#FBC93A" stopOpacity="0.42" /><stop offset="1" stopColor="#FBC93A" stopOpacity="0" />
      </radialGradient>
      {/* Piel */}
      <linearGradient id="ca-epidermis" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="520" y2="736">
        <stop offset="0" stopColor="#FFF" stopOpacity="0.22" /><stop offset="1" stopColor="#7A4A36" stopOpacity="0.16" />
      </linearGradient>
      {/* Virus */}
      <radialGradient id="ca-envoltura" cx="0.4" cy="0.36" r="0.7">
        <stop offset="0" stopColor="#F5F0FB" /><stop offset="0.72" stopColor="#D9CBEE" /><stop offset="1" stopColor="#9E82C9" />
      </radialGradient>
      <radialGradient id="ca-tegumento">
        <stop offset="0.6" stopColor="#B59BDB" stopOpacity="0.6" /><stop offset="1" stopColor="#B59BDB" stopOpacity="0.15" />
      </radialGradient>
      <radialGradient id="ca-espicula" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#D9B8F5" /><stop offset="1" stopColor="#6E3DB0" />
      </radialGradient>
      {/* Cigarrillo */}
      <linearGradient id="ca-papel" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#FFF" /><stop offset="0.55" stopColor="#F0EFEA" /><stop offset="1" stopColor="#B9B7AE" />
      </linearGradient>
      <linearGradient id="ca-corcho" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#F0C186" /><stop offset="0.55" stopColor="#D9974F" /><stop offset="1" stopColor="#99642B" />
      </linearGradient>
      <radialGradient id="ca-brasa" cx="0.55" cy="0.5" r="0.6">
        <stop offset="0" stopColor="#FFE08A" /><stop offset="0.45" stopColor="#F2692B" /><stop offset="1" stopColor="#7E2410" />
      </radialGradient>
      <linearGradient id="ca-humo" x1="0" x2="0" y1="1" y2="0">
        <stop offset="0" stopColor="#8A93A6" stopOpacity="0.75" /><stop offset="1" stopColor="#8A93A6" stopOpacity="0" />
      </linearGradient>
      {/* Pico y cuarzo */}
      <linearGradient id="ca-mango" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#7E5430" /><stop offset="0.4" stopColor="#C4935E" /><stop offset="1" stopColor="#6E4726" />
      </linearGradient>
      <linearGradient id="ca-hierro" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#B4BCC9" /><stop offset="0.5" stopColor="#6E7789" /><stop offset="1" stopColor="#3F4656" />
      </linearGradient>
      {/* Frasco de vidrio ámbar */}
      <linearGradient id="ca-ambar" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#7A4514" /><stop offset="0.28" stopColor="#D08A36" /><stop offset="0.62" stopColor="#B26C22" /><stop offset="1" stopColor="#5E3410" />
      </linearGradient>
      <linearGradient id="ca-tapa" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#C9CED7" /><stop offset="0.4" stopColor="#FFF" /><stop offset="1" stopColor="#A2AAB7" />
      </linearGradient>
      {/* Proteína de la cadena de epítopos */}
      <linearGradient id="ca-segmento" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#FFF" stopOpacity="0.45" /><stop offset="0.5" stopColor="#FFF" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.16" />
      </linearGradient>
      <clipPath id="ca-c-cuerpo"><rect x={-112} y={-140} width={224} height={290} rx={30} /></clipPath>
      <clipPath id="ca-c-6p"><path d={CROMOSOMA6} /></clipPath>
      <clipPath id="ca-c-x"><path d={CROMOSOMA_X} /></clipPath>
    </defs>
  );
});

// ─── Cerradura ────────────────────────────────────────────────────────────────

const COL_LLAVE = ['#7B4FC9', '#C2385A', '#D9881E'];
const NOMBRES = ['Genes', 'Hormonas', 'Ambiente'];
const FILAS = [-70, 10, 90];

/** Llave de paletón: ojo con su arandela, cuello, caña con luz y dientes. */
const Llave = memo(function Llave({ c }: { c: string }) {
  return (
    <g>
      <circle r={20} fill={c} />
      <circle r={20} fill="#000" opacity={0.12} />
      <circle r={16.5} fill={c} />
      <circle r={9.5} fill="var(--campo)" />
      <circle r={9.5} fill="none" stroke="#000" strokeOpacity={0.28} strokeWidth={1.6} />
      <path d="M-13,-9 A16,16 0 0 1 4,-15" fill="none" stroke="#FFF" strokeWidth={2.4} strokeLinecap="round" opacity={0.6} />
      <rect x={18} y={-8} width={13} height={16} rx={3} fill={c} />
      <rect x={21} y={-8} width={2.4} height={16} fill="#000" opacity={0.18} />
      <rect x={26} y={-8} width={2.4} height={16} fill="#000" opacity={0.18} />
      <rect x={30} y={-5} width={84} height={10} rx={2.5} fill={c} />
      <rect x={30} y={-4} width={84} height={3} rx={1.5} fill="#FFF" opacity={0.42} />
      <rect x={30} y={2} width={84} height={3} rx={1.5} fill="#000" opacity={0.18} />
      {/* Paletón con sus cortes */}
      <path d="M78,5 L78,20 L84,20 L84,14 L90,14 L90,23 L97,23 L97,14 L103,14 L103,20 L110,20 L110,5 Z" fill={c} />
      <path d="M78,5 L78,20 L84,20 L84,14 L90,14 L90,23 L97,23 L97,14 L103,14 L103,20 L110,20 L110,5 Z" fill="#000" opacity={0.1} />
    </g>
  );
});

/** IgG en miniatura: dos Fab, bisagra y Fc. */
function Y({ x, y, ang, k, c }: { x: number; y: number; ang: number; k: number; c: string }) {
  return (
    <g transform={`translate(${f1(x)},${f1(y)}) rotate(${ang.toFixed(0)}) scale(${k.toFixed(2)})`}>
      <path d="M0,11 L0,1.5 M0,1.5 L-7.5,-9 M0,1.5 L7.5,-9" stroke={c} strokeWidth={4.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M0,10.5 L0,3 M-1,0.5 L-7.5,-8.5 M1,0.5 L7.5,-8.5" stroke="#FFF" strokeWidth={1.1} strokeLinecap="round" fill="none" opacity={0.42} />
      <circle cx={-7.6} cy={-9.4} r={1.7} fill="#FFF" opacity={0.8} />
      <circle cx={7.6} cy={-9.4} r={1.7} fill="#FFF" opacity={0.8} />
    </g>
  );
}

const CuerpoCandado = memo(function CuerpoCandado() {
  return (
    <g>
      <rect x={-112} y={-140} width={224} height={290} rx={30} fill="url(#ca-acero)" stroke="#7E8798" strokeWidth={3.5} />
      <rect x={-102} y={-130} width={204} height={270} rx={23} fill="none" stroke="#FFF" strokeWidth={2} opacity={0.7} />
      <g clipPath="url(#ca-c-cuerpo)"><rect x={-112} y={-140} width={224} height={290} fill="url(#ca-reflejo)" /></g>
      {/* Tornillos de las esquinas */}
      {[[-90, -118], [90, -118], [-90, 128], [90, 128]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${25 + i * 40})`}>
          <circle r={6.5} fill="#8C95A5" />
          <circle cx={-0.8} cy={-0.8} r={5.4} fill="#D8DDE5" />
          <rect x={-4.4} y={-0.9} width={8.8} height={1.8} rx={0.9} fill="#6E7789" />
        </g>
      ))}
    </g>
  );
});

function Cerradura({ t, reloj }: { t: T; reloj: number }) {
  const ca = v(t, 'candado');
  if (ca <= 0.001) return null;
  const pa = easeInOut(v(t, 'panel'));
  const x = lerp(800, 215, pa), y = lerp(545, 520, pa), k = lerp(1.4, 0.9, pa);
  // El arco sube recto y luego gira sobre su pata larga, que nunca sale del cuerpo. Al
  // cerrar, lo mismo al revés: primero vuelve a su sitio y luego baja.
  const ab = v(t, 'abierta'), sube = easeInOut(tramo(ab, 0, 0.45)), gira = easeInOut(tramo(ab, 0.4, 1));
  const foco = v(t, 'foco'), an = v(t, 'anticuerpos'), salen = v(t, 'salen');
  const llaves = [v(t, 'llave1'), v(t, 'llave2'), v(t, 'llave3')];
  const ni = v(t, 'ninguna'), tr = v(t, 'tresllaves');
  return (
    <g opacity={ca}>
      {/* Autoanticuerpos que salen al abrirse (solo con la cerradura grande) */}
      {an > 0.001 && salen < 0.999 && Array.from({ length: 11 }, (_, i) => {
        const ang = (-170 + i * 16) * (Math.PI / 180);
        const q = easeOut(tramo(an, i * 0.03, 0.6 + i * 0.03));
        if (q <= 0) return null;
        // Nacen pequeños dentro del arco abierto, flotan y, al irse, siguen hacia afuera y se apagan.
        const fuera = tramo(salen, (10 - i) * 0.03, 0.7 + (10 - i) * 0.03);
        const r = 30 + 310 * q + 170 * easeInOut(fuera) + Math.sin(reloj / 620 + i * 1.7) * 7 * q;
        const op = tramo(q, 0, 0.22) * (1 - fuera);
        return op > 0.001 ? <g key={i} opacity={op}><Y x={x + Math.cos(ang) * r} y={y - 200 * k + Math.sin(ang) * r * 0.75} ang={(ang * 180) / Math.PI + 90} k={2.4 * (0.45 + 0.55 * q)} c={L.ana} /></g> : null;
      })}
      <g transform={`translate(${x},${y}) scale(${k * (0.85 + 0.15 * easeBack(ca))})`}>
        {/* Las llaves van detrás del cuerpo: lo que entra queda tapado. */}
        {llaves.map((q, i) => {
          if (q <= 0.001) return null;
          // En espera, fuera del ojo de la cerradura; a la izquierda (panel), más cerca para no salirse del lienzo.
          const espera = lerp(-290, -205, pa);
          const lx = q <= 0.5 ? espera : lerp(espera, -150, easeInOut((q - 0.5) / 0.5));
          return <g key={i} opacity={Math.min(1, q * 2)} transform={`translate(${lx},${FILAS[i]})`}><Llave c={COL_LLAVE[i]} /></g>;
        })}
        {/* Arco: tubo de acero con su luz */}
        <g transform={`rotate(${-24 * gira} -70 -140) translate(0 ${-40 * sube})`}>
          <path d="M-70,-72 L-70,-190 A70,70 0 0 1 70,-190 L70,-122" fill="none" stroke="#6E7789" strokeWidth={28} />
          <path d="M-70,-72 L-70,-190 A70,70 0 0 1 70,-190 L70,-122" fill="none" stroke="#C4CAD5" strokeWidth={22} />
          <path d="M-75,-100 L-75,-190 A75,75 0 0 1 56,-240" fill="none" stroke="#FFF" strokeWidth={6} strokeLinecap="round" opacity={0.75} />
          <path d="M77,-124 L77,-186" fill="none" stroke="#7E8798" strokeWidth={5} opacity={0.55} />
          <rect x={56} y={-132} width={28} height={8} fill="#6E7789" />
          <path d="M57,-126 L83,-126 M57,-118 L83,-118" stroke="#6E7789" strokeWidth={2.4} />
        </g>
        <CuerpoCandado />
        {/* Boca del arco: los dos agujeros en el cuerpo */}
        <rect x={-88} y={-146} width={36} height={12} rx={4} fill="#7E8798" />
        <rect x={52} y={-146} width={36} height={12} rx={4} fill="#7E8798" />
        {FILAS.map((fy, i) => {
          const h = clamp(1 - Math.abs(foco - (i + 1)));
          const dentro = llaves[i] >= 0.999;
          return (
            <g key={i}>
              {/* Placa rehundida, con la cerradura de latón */}
              <rect x={-96} y={fy - 33} width={192} height={64} rx={13} fill="url(#ca-placa)" stroke="#9CA5B4" strokeWidth={1.4} />
              {h > 0.001 && <rect x={-96} y={fy - 33} width={192} height={64} rx={13} fill={COL_LLAVE[i]} opacity={0.16 * h} />}
              <circle cx={-64} cy={fy - 1} r={21} fill="url(#ca-laton)" stroke="#8C6A2C" strokeWidth={1.2} />
              <circle cx={-64} cy={fy - 1} r={17} fill="none" stroke="#FFF" strokeWidth={1} opacity={0.4} />
              <circle cx={-64} cy={fy - 6} r={7.5} fill="#2E2A24" />
              <path d={`M${-68},${fy - 2} L${-60},${fy - 2} L${-58},${fy + 12} L${-70},${fy + 12} Z`} fill="#2E2A24" />
              <text x={-34} y={fy} dy="0.35em" className={s.candadoTxt} style={dentro || h > 0.5 ? { fill: COL_LLAVE[i] } : undefined}>{NOMBRES[i]}</text>
            </g>
          );
        })}
      </g>
      {/* Rótulos del paso 0 (cerradura grande) */}
      {ni > 0.001 && (
        <g opacity={ni * (1 - tramo(an, 0.2, 0.5))} transform={`translate(800,850)`}>
          <rect x={-170} y={-28} width={340} height={56} rx={28} className={s.chip} />
          <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>Ninguna basta sola</text>
        </g>
      )}
      {an > 0.3 && <text x={800} y={858} textAnchor="middle" className={`${s.significado} ${s.textoLupus}`} opacity={tramo(an, 0.3, 0.6) * (1 - pa)}>se pierde la tolerancia → autoanticuerpos</text>}
      {tr > 0.001 && (
        <g opacity={tr * (1 - pa)} transform={`translate(800,930) scale(${0.85 + 0.15 * easeBack(tr)})`}>
          <text textAnchor="middle" className={s.lSub}>una cerradura con tres llaves: genes · hormonas · ambiente</text>
        </g>
      )}
    </g>
  );
}

// ─── 1 · Genes ────────────────────────────────────────────────────────────────

/** Cromosoma 6 como en un cariotipo: brazo corto, centrómero estrecho y brazo largo. */
const CROMOSOMA6 = 'M462,218 L586,218 C596,218 600,228 604,232 C608,228 612,218 622,218 L958,218 C986,218 986,262 958,262 L622,262 C612,262 608,252 604,248 C600,252 596,262 586,262 L462,262 C434,262 434,218 462,218 Z';
/** Bandas G: [x, ancho, oscuridad]. */
const BANDAS_6: [number, number, number][] = [
  [452, 12, 0.75], [472, 8, 0.4], [488, 18, 0.85], [570, 10, 0.55], [588, 8, 0.35],
  [626, 22, 0.8], [656, 9, 0.35], [672, 26, 0.9], [706, 10, 0.45], [724, 16, 0.7], [748, 8, 0.3], [764, 28, 0.85], [800, 10, 0.4],
  [818, 20, 0.75], [846, 8, 0.35], [860, 24, 0.85], [892, 12, 0.5], [912, 18, 0.7], [938, 10, 0.45], [954, 14, 0.6],
];

const Cromosoma6 = memo(function Cromosoma6() {
  return (
    <g>
      <path d={CROMOSOMA6} fill="url(#ca-crom-h)" stroke="#6E5A96" strokeWidth={2} />
      <g clipPath="url(#ca-c-6p)">
        {BANDAS_6.map(([x, w, o]) => <rect key={x} x={x} y={216} width={w} height={48} fill="#4E3D78" opacity={o * 0.72} />)}
        <rect x={516} y={216} width={40} height={48} fill={L.mecanismo} />
        <rect x={430} y={221} width={560} height={7} fill="#FFF" opacity={0.42} />
        <rect x={430} y={252} width={560} height={11} fill="#2E2348" opacity={0.2} />
      </g>
      <text x={440} y={176} className={s.lEtiquetaMayus}>Cromosoma 6</text>
      <text x={520} y={206} textAnchor="middle" className={s.lSubChico}>brazo corto</text>
      <text x={800} y={206} textAnchor="middle" className={s.lSubChico}>brazo largo</text>
    </g>
  );
});

/** Mapa de la región HLA: clase II, clase III y clase I, en su orden en el cromosoma. */
const MAPA_HLA = [
  { n: 'DP', x: 440, w: 66, c: 2 }, { n: 'DQ', x: 510, w: 66, c: 2 }, { n: 'DR', x: 580, w: 72, c: 1 },
  { n: 'C4 · C2', x: 658, w: 110, c: 0 }, { n: 'B', x: 774, w: 62, c: 3 }, { n: 'C', x: 840, w: 62, c: 3 }, { n: 'A', x: 906, w: 74, c: 3 },
];

function RegionHla({ k }: { k: number }) {
  return (
    <g opacity={k}>
      <path d="M516,264 L440,316 M556,264 L980,316" className={s.guia} />
      {MAPA_HLA.map((g) => (
        <g key={g.n}>
          <rect x={g.x} y={316} width={g.w} height={36} rx={6} className={g.c === 1 ? undefined : g.c === 0 ? s.hlaC3 : s.hlaGen} fill={g.c === 1 ? L.mecanismo : undefined} />
          <rect x={g.x + 2} y={318} width={g.w - 4} height={10} rx={4} fill="#FFF" opacity={g.c === 1 ? 0.3 : 0.18} />
          <text x={g.x + g.w / 2} y={334} textAnchor="middle" dy="0.35em" className={g.c === 1 ? s.hlaTxtBlanco : s.hlaTxt}>{g.n}</text>
        </g>
      ))}
      <path d="M440,362 L440,370 L652,370 L652,362" className={s.guiaLlave} />
      <path d="M658,362 L658,370 L768,370 L768,362" className={s.guiaLlave} />
      <path d="M774,362 L774,370 L980,370 L980,362" className={s.guiaLlave} />
      <text x={500} y={392} textAnchor="middle" className={s.lSubChico}>clase II</text>
      <text x={713} y={392} textAnchor="middle" className={s.lSubChico}>clase III</text>
      <text x={877} y={392} textAnchor="middle" className={s.lSubChico}>clase I</text>
    </g>
  );
}

function Genes({ t }: { t: T }) {
  const hl = v(t, 'hla'), ge = v(t, 'gemelos'), ci = v(t, 'cien');
  const X0 = 1090, ESC = 4; // 100 % = 400 px
  return (
    <g>
      {hl > 0.001 && (
        <g opacity={tramo(hl, 0, 0.4)}>
          <Cromosoma6 />
          <RegionHla k={tramo(hl, 0.12, 0.5)} />
          <text x={714} y={306} textAnchor="middle" className={s.lEtiqueta}>región HLA (MHC)</text>
          {hl > 0.5 && (
            <g opacity={tramo(hl, 0.5, 1)}>
              {['HLA-DR2', 'HLA-DR3'].map((n, i) => (
                <g key={n} transform={`translate(${i ? 702 : 530},${438}) scale(${0.85 + 0.15 * easeBack(tramo(hl, 0.5 + i * 0.15, 0.85 + i * 0.15))})`}>
                  <rect x={-78} y={-24} width={156} height={48} rx={24} fill={L.mecanismo} />
                  <rect x={-70} y={-20} width={140} height={14} rx={7} fill="#FFF" opacity={0.22} />
                  <text textAnchor="middle" dy="0.35em" className={s.chipTxtBlanco}>{n}</text>
                </g>
              ))}
              <path d="M616,352 L616,402 M530,402 L702,402 M530,402 L530,414 M702,402 L702,414" className={s.guiaLlave} />
            </g>
          )}
        </g>
      )}
      {ge > 0.001 && (
        <g opacity={ge}>
          <text x={X0} y={176} className={s.lEtiquetaMayus}>Riesgo compartido</text>
          {/* Un hermano se parece; un gemelo idéntico es la misma copia */}
          <g transform="translate(1036,244) scale(0.46)"><Figurita mujer c={L.causas} /></g>
          <g transform="translate(1068,244) scale(0.46)"><Figurita mujer={false} c="#B58A5C" /></g>
          <g transform="translate(1036,324) scale(0.46)"><Figurita mujer c={L.causas} /></g>
          <g transform="translate(1068,324) scale(0.46)"><Figurita mujer c={L.causas} /></g>
          <text x={X0} y={222} className={s.lEtiqueta}>Hermano</text>
          <rect x={X0} y={234} width={4 * ESC * easeOut(ge)} height={26} rx={6} fill={L.causas} />
          <text x={X0 + 30} y={247} dy="0.35em" className={s.lSub}>≈ 2–5 %</text>
          <text x={X0} y={302} className={s.lEtiqueta}>Gemelo idéntico</text>
          <rect x={X0} y={314} width={50 * ESC * easeOut(ge)} height={26} rx={6} fill={L.causas} opacity={0.35} />
          <rect x={X0} y={314} width={25 * ESC * easeOut(ge)} height={26} rx={6} fill={L.causas} />
          <text x={X0 + 50 * ESC + 14} y={327} dy="0.35em" className={s.lSub}>≈ 25–50 %</text>
          {ci > 0.001 && (
            <g opacity={ci}>
              <line x1={X0 + 100 * ESC} y1={200} x2={X0 + 100 * ESC} y2={350} className={s.lineaCien} />
              <text x={X0 + 100 * ESC} y={190} textAnchor="middle" className={s.lEtiqueta}>100 %</text>
              <text x={X0} y={396} className={s.lSub}>nunca llega al 100 %: los genes no lo son todo</text>
            </g>
          )}
        </g>
      )}
    </g>
  );
}

// ─── 2 · Complemento temprano ─────────────────────────────────────────────────

function Complemento({ t }: { t: T }) {
  const ti = v(t, 'tituloC'), du = v(t, 'duda'), pu = v(t, 'pues'), fa = v(t, 'faltan'), ri = v(t, 'riesgoC1q'), li = v(t, 'limpieza');
  return (
    <g>
      {ti > 0.001 && (
        <g opacity={ti}>
          <text x={690} y={176} textAnchor="middle" className={s.tituloSeccion}>Déficit de complemento temprano</text>
        </g>
      )}
      {du > 0.001 && (
        <g opacity={du} transform={`translate(${1275},${250}) scale(${0.85 + 0.15 * easeBack(du)})`}>
          <rect x={-270} y={-46} width={540} height={92} rx={30} className={s.burbuja} />
          <path d="M-270,10 L-310,26 L-262,30 Z" className={s.burbuja} />
          <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>¿Menos complemento = menos inflamación?</text>
          {pu > 0.001 && <line x1={-240} y1={0} x2={-240 + 480 * easeOut(pu)} y2={0} className={s.tachadoRojo} />}
        </g>
      )}
      {pu > 0.001 && (
        <g opacity={pu}>
          <text x={1275} y={340} textAnchor="middle" className={s.lEtiquetaVerde}>No: el complemento temprano LIMPIA</text>
        </g>
      )}
      {fa > 0.001 && (
        <g opacity={fa}>
          {[560, 690, 820].map((x, i) => {
            const q = easeOut(tramo(fa, i * 0.15, 0.55 + i * 0.15));
            return <path key={x} d={`M${x - 34 * q},${270 - 34 * q} L${x + 34 * q},${270 + 34 * q} M${x + 34 * q},${270 - 34 * q} L${x - 34 * q},${270 + 34 * q}`} className={s.cruz} />;
          })}
          <text x={690} y={372} textAnchor="middle" className={s.lEtiquetaRoja}>déficit genético</text>
        </g>
      )}
      {ri > 0.001 && (
        <g opacity={ri} transform={`translate(1275,430) scale(${0.85 + 0.15 * easeBack(ri)})`}>
          <rect x={-255} y={-30} width={510} height={60} rx={30} className={s.chipPista} />
          <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>Déficit de C1q: más del 90 % hace lupus</text>
        </g>
      )}
      {li > 0.001 && (
        <g>
          <text x={1080} y={898} textAnchor="middle" className={s.lSub} opacity={tramo(li, 0, 0.5)}>¿Por qué un déficit de complemento da autoinmunidad?</text>
          <text x={1080} y={958} textAnchor="middle" className={s.respuesta} opacity={tramo(li, 0.5, 1)}>Por la limpieza.</text>
        </g>
      )}
    </g>
  );
}

// ─── 3 · Hormonas ─────────────────────────────────────────────────────────────

const BAL = { x: 1060, y: 400, l: 230 };

/** Cromosoma X: brazo corto arriba, largo abajo, dos cromátidas unidas en el centrómero. */
const CROMOSOMA_X = 'M-4,-2 C-12,-18 -26,-34 -28,-44 C-30,-54 -14,-58 -10,-48 C-6,-36 -2,-22 0,-10 C2,-22 6,-36 10,-48 C14,-58 30,-54 28,-44 C26,-34 12,-18 4,-2 C12,16 28,52 30,68 C32,80 16,84 12,72 C8,56 2,26 0,10 C-2,26 -8,56 -12,72 C-16,84 -32,80 -30,68 C-28,52 -12,16 -4,-2 Z';
const BANDAS_X: [number, number, number][] = [[-50, 5, 0.5], [-30, 6, 0.75], [-18, 4, 0.4], [14, 7, 0.75], [26, 5, 0.4], [38, 8, 0.8], [52, 5, 0.45], [62, 7, 0.75]];

function CromosomaX({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d={CROMOSOMA_X} fill="url(#ca-crom-x)" stroke="#6E5A96" strokeWidth={1.8} />
      <g clipPath="url(#ca-c-x)">
        {BANDAS_X.map(([by, h, o]) => <rect key={by} x={-40} y={by} width={80} height={h} fill="#4E3D78" opacity={o * 0.6} />)}
        {/* TLR7, en el brazo corto: el gen que escapa a la inactivación */}
        <rect x={-40} y={-42} width={80} height={8} fill="#E8B21E" />
      </g>
      <circle r={5} fill="#4E3D78" />
    </g>
  );
}

/** Esteroide: los cuatro anillos (tres hexágonos y un pentágono). Estradiol: anillo A
 *  aromático y dos OH; testosterona: una cetona y un OH. */
function Esteroide({ tipo, c }: { tipo: 'e' | 't'; c: string }) {
  const r = 10, h = r * 0.866;
  const hex = (cx: number, cy: number) => `M${f1(cx)},${f1(cy - r)} L${f1(cx + h)},${f1(cy - r / 2)} L${f1(cx + h)},${f1(cy + r / 2)} L${f1(cx)},${f1(cy + r)} L${f1(cx - h)},${f1(cy + r / 2)} L${f1(cx - h)},${f1(cy - r / 2)} Z`;
  const A = [-24, 7.5], B = [-24 + 2 * h, 7.5], C = [-24 + 3 * h, 7.5 - 1.5 * r];
  const dx = C[0] + h, dy = C[1] - r / 2;
  const D = `M${f1(dx)},${f1(dy)} L${f1(dx + 9.5)},${f1(dy - 3)} L${f1(dx + 15)},${f1(dy + 5)} L${f1(dx + 9.5)},${f1(dy + 13)} L${f1(dx)},${f1(dy + r)} Z`;
  return (
    <g>
      <path d={`${hex(A[0], A[1])} ${hex(B[0], B[1])} ${hex(C[0], C[1])} ${D}`} fill={c} fillOpacity={0.14} stroke={c} strokeWidth={2.3} strokeLinejoin="round" />
      {tipo === 'e' && <circle cx={A[0]} cy={A[1]} r={r * 0.52} fill="none" stroke={c} strokeWidth={1.7} />}
      {tipo === 'e'
        ? <path d={`M${f1(A[0] - h)},${f1(A[1] + r / 2)} L${f1(A[0] - h - 7)},${f1(A[1] + r / 2 + 4)}`} stroke={c} strokeWidth={2.2} />
        : <path d={`M${f1(A[0] - h)},${f1(A[1] + r / 2 - 1)} L${f1(A[0] - h - 7)},${f1(A[1] + r / 2 + 3)} M${f1(A[0] - h + 1)},${f1(A[1] + r / 2 + 1.5)} L${f1(A[0] - h - 6)},${f1(A[1] + r / 2 + 5.5)}`} stroke={c} strokeWidth={1.8} />}
      <path d={`M${f1(dx + 9.5)},${f1(dy - 3)} L${f1(dx + 12)},${f1(dy - 10)}`} stroke={c} strokeWidth={2.2} />
      <circle cx={dx + 13} cy={dy - 12} r={2.8} fill={c} />
      <circle cx={A[0] - h - 8.5} cy={A[1] + r / 2 + 5} r={2.8} fill={c} />
    </g>
  );
}

function Hormonas({ t }: { t: T }) {
  const nu = v(t, 'nueve'), ba = v(t, 'balanza'), te = v(t, 'testo'), oj = v(t, 'ojo'), xx = v(t, 'xx');
  const ang = (-10 * easeInOut(ba) * Math.PI) / 180;
  const izq = { x: BAL.x - Math.cos(ang) * BAL.l, y: BAL.y - Math.sin(ang) * BAL.l };
  const der = { x: BAL.x + Math.cos(ang) * BAL.l, y: BAL.y + Math.sin(ang) * BAL.l };
  const plato = (p: { x: number; y: number }, n: number, col: string, tipo: 'e' | 't', k: number) => (
    <g>
      <circle cx={p.x} cy={p.y} r={6} fill="url(#ca-laton)" />
      <path d={`M${p.x},${p.y} L${p.x - 70},${p.y + 106} M${p.x},${p.y} L${p.x + 70},${p.y + 106} M${p.x},${p.y} L${p.x},${p.y + 112}`} fill="none" stroke="#8C6A2C" strokeWidth={2} strokeDasharray="5 3" />
      {/* Moléculas encima del platillo */}
      {Array.from({ length: n }, (_, i) => (
        <g key={i} transform={`translate(${p.x - (n - 1) * 26 + i * 52},${p.y + 94 - (i % 2) * 6}) scale(${(n > 1 ? 0.92 : 1.2) * k})`}><Esteroide tipo={tipo} c={col} /></g>
      ))}
      <path d={`M${p.x - 84},${p.y + 108} C${p.x - 60},${p.y + 150} ${p.x + 60},${p.y + 150} ${p.x + 84},${p.y + 108} Z`} fill="url(#ca-laton-h)" stroke="#8C6A2C" strokeWidth={1.4} />
      <ellipse cx={p.x} cy={p.y + 108} rx={84} ry={6} fill="#F7E3AE" stroke="#8C6A2C" strokeWidth={1.2} />
    </g>
  );
  return (
    <g>
      {nu > 0.001 && (
        <g>
          <text x={720} y={182} className={s.razonChica} opacity={tramo(nu, 0, 0.5)}><tspan style={{ fill: L.mujer }}>9</tspan><tspan className={s.razonSep}> : </tspan><tspan style={{ fill: L.varon }}>1</tspan></text>
          <text x={850} y={174} className={s.significado} opacity={tramo(nu, 0.5, 1)}>y empieza en la edad reproductiva</text>
        </g>
      )}
      {ba > 0.001 && (
        <g opacity={tramo(ba, 0, 0.4)}>
          {/* Peana escalonada, columna y fiel */}
          <path d={`M${BAL.x - 84},655 L${BAL.x + 84},655 L${BAL.x + 72},640 L${BAL.x - 72},640 Z`} fill="url(#ca-laton-h)" stroke="#8C6A2C" strokeWidth={1.4} />
          <path d={`M${BAL.x - 44},640 C${BAL.x - 30},622 ${BAL.x - 14},620 ${BAL.x - 9},600 L${BAL.x + 9},600 C${BAL.x + 14},620 ${BAL.x + 30},622 ${BAL.x + 44},640 Z`} fill="url(#ca-laton-l)" stroke="#8C6A2C" strokeWidth={1.2} />
          <rect x={BAL.x - 8} y={BAL.y} width={16} height={204} fill="url(#ca-laton-l)" stroke="#8C6A2C" strokeWidth={1.2} />
          {[470, 530].map((y) => <rect key={y} x={BAL.x - 12} y={y} width={24} height={7} rx={3} fill="url(#ca-laton-h)" stroke="#8C6A2C" strokeWidth={1} />)}
          <line x1={izq.x} y1={izq.y} x2={der.x} y2={der.y} stroke="#8C6A2C" strokeWidth={12} strokeLinecap="round" />
          <line x1={izq.x} y1={izq.y - 1.5} x2={der.x} y2={der.y - 1.5} stroke="#E8CE8F" strokeWidth={6} strokeLinecap="round" />
          <circle cx={BAL.x} cy={BAL.y} r={16} fill="url(#ca-laton)" stroke="#8C6A2C" strokeWidth={1.4} />
          <circle cx={BAL.x} cy={BAL.y} r={5} fill="#8C6A2C" />
          {plato(izq, 3, L.mujer, 'e', 1)}
          {plato(der, 1, L.varon, 't', te)}
          <text x={izq.x} y={izq.y + 186} textAnchor="middle" className={s.significado}>Estrógenos</text>
          <text x={izq.x - 40} y={izq.y + 218} textAnchor="middle" className={s.lSub}>más supervivencia y activación</text>
          <text x={izq.x - 40} y={izq.y + 246} textAnchor="middle" className={s.lSub}>de los linfocitos B autorreactivos</text>
          {te > 0.001 && (
            <g opacity={te}>
              <text x={der.x} y={der.y + 186} textAnchor="middle" className={s.significado}>Testosterona</text>
              <text x={der.x} y={der.y + 218} textAnchor="middle" className={s.lSub}>relativamente supresora</text>
            </g>
          )}
        </g>
      )}
      {oj > 0.001 && (
        <g opacity={oj} transform="translate(900,820)">
          <rect x={-240} y={-28} width={480} height={56} rx={28} className={s.chip} />
          <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>Pero las hormonas no lo explican todo</text>
        </g>
      )}
      {xx > 0.001 && (
        <g opacity={xx} transform={`translate(0,${20 * (1 - easeOut(xx))})`}>
          <CromosomaX x={1330} y={780} />
          <CromosomaX x={1440} y={780} />
          <path d="M1362,742 C1372,722 1398,722 1408,742" className={s.guia} />
          <text x={1385} y={716} textAnchor="middle" className={s.lEtiquetaTlr}>TLR7</text>
          <text x={1385} y={896} textAnchor="middle" className={s.lEtiqueta}>genes inmunes del X (p. ej., TLR7)</text>
          <text x={1385} y={926} textAnchor="middle" className={s.lSub}>escapan a la inactivación → dosis doble</text>
        </g>
      )}
    </g>
  );
}

// ─── 4 · Luz ultravioleta ─────────────────────────────────────────────────────

const PIEL = { x0: 700, x1: 1560 };
type Cel = { x: number; y: number; w: number; h: number; apo: boolean; capa: 'granulosa' | 'espinosa' | 'basal'; d: string };

/** Contorno poligonal de un queratinocito: los vecinos encajan sin ser rectángulos. */
function poligono(w: number, h: number, i: number, picos: number): string {
  const pts = Array.from({ length: picos }, (_, j) => {
    const a = (j / picos) * Math.PI * 2 + Math.PI / picos;
    const c = Math.cos(a), sn = Math.sin(a);
    const m = 1 / Math.max(Math.abs(c) / (w / 2), Math.abs(sn) / (h / 2));
    const q = 0.92 + 0.1 * fijo(i * 13 + j, 2);
    return `${f1(c * m * q)},${f1(sn * m * q)}`;
  });
  return `M${pts.join(' L')} Z`;
}

const CELULAS_PIEL: Cel[] = (() => {
  const out: Cel[] = [];
  let n = 0;
  const fila = (y: number, w: number, h: number, capa: Cel['capa'], apo: number[], off = 0) => {
    for (let x = PIEL.x0 + off, i = 0; x + w <= PIEL.x1 + 4; x += w + 4, i++) { n++; out.push({ x, y, w, h, apo: apo.includes(i), capa, d: poligono(w, h, n, capa === 'basal' ? 8 : 6) }); }
  };
  fila(528, 62, 22, 'granulosa', [], 10);
  fila(556, 70, 56, 'espinosa', [2, 6, 10], 0);
  fila(618, 70, 56, 'espinosa', [4, 8], 34);
  fila(680, 48, 52, 'basal', [], 4);
  return out;
})();

const ONDA_BASAL = (() => {
  const p: string[] = [];
  for (let x = PIEL.x0; x <= PIEL.x1; x += 8) p.push(`${x},${f1(736 + Math.sin((x - PIEL.x0) / 26) * 4)}`);
  return `M${p.join(' L')}`;
})();

/** Lo que no cambia: capas, dermis con colágeno, capilares y fibroblastos. */
const PielFija = memo(function PielFija() {
  return (
    <g>
      {/* Capa córnea: láminas sin núcleo, que se descaman */}
      <rect x={PIEL.x0} y={502} width={PIEL.x1 - PIEL.x0} height={24} rx={4} className={s.cornea} />
      {[507, 513, 519].map((y, i) => (
        <path key={y} d={`M${PIEL.x0 + 4},${y} ${Array.from({ length: 34 }, (_, j) => `Q${PIEL.x0 + 13 + j * 25},${y + (j % 2 ? 2.5 : -2.5)} ${PIEL.x0 + 25 + j * 25},${y}`).join(' ')}`} className={s.laminaCornea} opacity={1 - i * 0.2} />
      ))}
      {[[790, 498], [1040, 497], [1310, 498]].map(([x, y], i) => <path key={i} d={`M${x},${y} q24,-6 50,1 q-22,6 -50,-1 Z`} className={s.cornea} />)}
      {/* Dermis */}
      <path d={`${ONDA_BASAL} L${PIEL.x1},826 L${PIEL.x0},826 Z`} className={s.dermis} />
      {Array.from({ length: 22 }, (_, i) => (
        <path key={i} d={`M${PIEL.x0 + 10 + fijo(i, 1) * 800},${752 + fijo(i, 2) * 64} q${18 + fijo(i, 3) * 26},${-8 + fijo(i, 4) * 16} ${50 + fijo(i, 5) * 34},${-4 + fijo(i, 6) * 8}`} className={s.colageno} />
      ))}
      {[[812, 1], [1128, -1], [1420, 1]].map(([x, l], i) => <Tubo key={i} d={`M${x - 22},826 C${x - 22},772 ${x - 12},754 ${x},754 C${x + 12},754 ${x + 22},772 ${x + 22},826`} w={5 + l * 0.4} tono={['#8E2A2C', '#C95A50', '#F2B2A4']} />)}
      {[[920, 776, 8], [1020, 806, -12], [1240, 782, 14], [1340, 808, -6], [1510, 780, 10]].map(([x, y, a], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${a})`}>
          <path d="M-26,0 C-12,-6 12,-6 26,0 C12,6 -12,6 -26,0 Z" className={s.fibroblasto} />
          <ellipse rx={8} ry={2.6} className={s.nucleoFibro} />
        </g>
      ))}
      <path d={ONDA_BASAL} className={s.membranaBasal} />
      {/* Capas, a un lado */}
      <g className={s.etiquetaCapaUv}>
        <text x={PIEL.x0 - 12} y={514} dy="0.35em" textAnchor="end">capa córnea</text>
        <text x={PIEL.x0 - 12} y={539} dy="0.35em" textAnchor="end">granulosa</text>
        <text x={PIEL.x0 - 12} y={616} dy="0.35em" textAnchor="end">espinosa</text>
        <text x={PIEL.x0 - 12} y={706} dy="0.35em" textAnchor="end">basal</text>
        <text x={PIEL.x0 - 12} y={784} dy="0.35em" textAnchor="end">dermis</text>
      </g>
    </g>
  );
});

/** Queratinocito sano. La basal lleva su caperuza de melanina encima del núcleo. */
const Sana = memo(function Sana({ c, i }: { c: Cel; i: number }) {
  const conNucleo = c.capa !== 'granulosa';
  return (
    <g>
      <path d={c.d} className={c.capa === 'espinosa' ? s.queratinocitoEsp : s.queratinocito} />
      {!conNucleo && Array.from({ length: 7 }, (_, j) => <circle key={j} cx={-c.w * 0.36 + j * c.w * 0.12} cy={(j % 2 ? 2.4 : -2.6) + fijo(i, j) * 2} r={1.4} className={s.granuloQh} />)}
      {conNucleo && (
        <g>
          <ellipse rx={c.w * 0.2} ry={c.h * 0.23} className={s.nucleoQueratinocito} />
          <circle cx={-1.5} cy={-1} r={1.7} className={s.nucleoBasal} />
          <circle cx={3.6} cy={3} r={1.1} className={s.nucleoBasal} />
          {c.capa === 'basal' && Array.from({ length: 5 }, (_, j) => <circle key={j} cx={-6 + j * 3} cy={-c.h * 0.32 + (j % 2)} r={1.3} fill="#5E3A24" opacity={0.8} />)}
        </g>
      )}
    </g>
  );
});

/** El sol: núcleo con degradado, corona y rayos afilados que se abren. */
const Sol = memo(function Sol({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={r * 2.2} fill="url(#ca-corona)" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * 360, largo = i % 2 ? 1.58 : 1.82;
        return <path key={i} transform={`rotate(${a})`} d={`M${f1(-r * 0.09)},${f1(-r * 1.12)} L0,${f1(-r * largo)} L${f1(r * 0.09)},${f1(-r * 1.12)} Z`} fill={i % 2 ? '#F8BE36' : '#EE9C22'} />;
      })}
      <circle r={r} fill="url(#ca-sol)" stroke="#E08A1C" strokeWidth={1.4} />
      <ellipse cx={-r * 0.3} cy={-r * 0.36} rx={r * 0.36} ry={r * 0.22} fill="#FFF" opacity={0.42} transform={`rotate(-30 ${-r * 0.3} ${-r * 0.36})`} />
    </g>
  );
});

/** Onda electromagnética entre dos puntos, con su longitud de onda en px. */
function onda(x0: number, y0: number, x1: number, y1: number, lambda: number, amp: number): string {
  const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l;
  const n = Math.round(l / 4);
  return Array.from({ length: n + 1 }, (_, i) => {
    const f = i / n, o = Math.sin((f * l * Math.PI * 2) / lambda) * amp * Math.min(1, f * 12);
    return `${i ? 'L' : 'M'}${f1(x0 + dx * f + nx * o)},${f1(y0 + dy * f + ny * o)}`;
  }).join(' ');
}

const RAYOS_UVB = [820, 980, 1140, 1300, 1450].map((x, i) => onda(590, 276 + i * 3, x, 610 + (i % 2) * 40, 26, 6));
const RAYOS_UVA = [900, 1220].map((x, i) => onda(596, 262 + i * 8, x, 790, 54, 7));

/** Lo que se suelta de la célula que muere: ADN, nucleosoma y la proteína Ro. */
function Antigeno({ tipo }: { tipo: number }) {
  if (tipo === 0) {
    return (
      <g>
        <path d="M-11,-5 C-5,-5 -5,5 0,5 C5,5 5,-5 11,-5" fill="none" stroke={L.adn} strokeWidth={2.4} strokeLinecap="round" />
        <path d="M-11,5 C-5,5 -5,-5 0,-5 C5,-5 5,5 11,5" fill="none" stroke={L.adn} strokeWidth={2.4} strokeLinecap="round" opacity={0.55} />
      </g>
    );
  }
  if (tipo === 1) {
    return (
      <g>
        <ellipse rx={7.5} ry={6} fill={L.histona} />
        <path d="M-10,-2 C-6,-9 6,-9 9,-2 C10,5 -6,8 -9,2" fill="none" stroke={L.adn} strokeWidth={2} strokeLinecap="round" />
      </g>
    );
  }
  return (
    <g fill={L.rnp}>
      <circle cx={-3.5} cy={-2} r={5} /><circle cx={4} cy={-3} r={4} /><circle cx={1} cy={4} r={4.6} />
      <circle cx={-5} cy={-4} r={1.6} fill="#FFF" opacity={0.6} />
    </g>
  );
}

function Parasol() {
  return (
    <g>
      <path d="M-4,-20 L8,20" stroke="#8C6A2C" strokeWidth={2.6} strokeLinecap="round" />
      <path d="M-26,-12 C-22,-30 14,-34 24,-20 C14,-22 8,-18 2,-15 C-6,-18 -18,-18 -26,-12 Z" fill="#E5684D" />
      <path d="M2,-15 C4,-22 10,-27 16,-27 C12,-24 14,-20 24,-20 C14,-22 8,-18 2,-15 Z" fill="#FFF" opacity={0.75} />
      <path d="M-26,20 Q0,12 26,20" stroke="#D9B46A" strokeWidth={4} strokeLinecap="round" fill="none" />
    </g>
  );
}

function Protector() {
  return (
    <g>
      <rect x={-12} y={-22} width={24} height={8} rx={2} fill="#2F6FD0" />
      <path d="M-16,-14 L16,-14 L19,24 L-19,24 Z" fill="#F4F8FC" stroke="#8FA6C4" strokeWidth={1.4} />
      <path d="M-17,0 L17,0 L18,14 L-18,14 Z" fill="#1F9A6A" />
      <text y={7} textAnchor="middle" dy="0.35em" className={s.tuboTxt}>50+</text>
    </g>
  );
}

function Uv({ t }: { t: T }) {
  const so = v(t, 'sol'), ra = v(t, 'rayos'), ap = v(t, 'apoptosisUV'), an = v(t, 'antigenosUV'), pl = v(t, 'playa'), fp = v(t, 'fps');
  const apos = CELULAS_PIEL.filter((c) => c.apo);
  return (
    <g>
      {so > 0.001 && (
        <g opacity={so}>
          <Sol x={540} y={240} r={52 * (0.8 + 0.2 * easeBack(so))} />
          <text x={540} y={362} textAnchor="middle" className={s.lEtiqueta}>Luz ultravioleta</text>
          <PielFija />
          {CELULAS_PIEL.map((c, i) => {
            const k = c.apo ? easeOut(ap) : 0;
            const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
            return (
              <g key={i} transform={`translate(${cx},${cy}) scale(${1 - 0.35 * k})`}>
                {k <= 0.5 && <Sana c={c} i={i} />}
                {k > 0.5 && (
                  <g>
                    {/* «Célula de quemadura solar»: encogida, con halo y el núcleo roto */}
                    <ellipse rx={c.w * 0.6} ry={c.h * 0.66} className={s.haloApo} />
                    <path d={c.d} className={s.queratinocitoApo} />
                    {[[-8, -5, 5], [6, -2, 4.5], [-1, 8, 4]].map(([x, y, r], j) => <g key={j}><circle cx={x} cy={y} r={r} className={s.nucleoPicnotico} /><circle cx={x - 1.3} cy={y - 1.3} r={r * 0.3} fill="#FFF" opacity={0.45} /></g>)}
                  </g>
                )}
                {k > 0.2 && [0, 1, 2, 3, 4].map((j) => {
                  const a = (j / 5) * Math.PI * 2 + 0.5;
                  return <circle key={j} cx={Math.cos(a) * c.w * 0.55} cy={Math.sin(a) * c.h * 0.6} r={6 * tramo(k, 0.2 + j * 0.1, 0.7 + j * 0.06)} className={s.blebPiel} />;
                })}
              </g>
            );
          })}
          <rect x={PIEL.x0} y={526} width={PIEL.x1 - PIEL.x0} height={210} fill="url(#ca-epidermis)" />
        </g>
      )}
      {ra > 0.001 && (
        <g opacity={1 - 0.72 * tramo(an, 0, 0.3)}>
          {RAYOS_UVB.map((d, i) => {
            const q = tramo(ra, i * 0.1, 0.6 + i * 0.1);
            return q > 0 ? <path key={i} d={d} className={s.rayoUv} {...dibujar(q)} /> : null;
          })}
          {RAYOS_UVA.map((d, i) => {
            const q = tramo(ra, 0.1 + i * 0.1, 0.8 + i * 0.1);
            return q > 0 ? <path key={i} d={d} className={s.rayoUva} {...dibujar(q)} /> : null;
          })}
        </g>
      )}
      {ra > 0.5 && (
        <g opacity={tramo(ra, 0.5, 1)}>
          <text x={760} y={330} className={s.lEtiquetaUv}>UVB</text>
          <text x={700} y={276} className={s.lEtiquetaUva}>UVA, más profunda</text>
        </g>
      )}
      {an > 0.001 && (
        <g>
          {apos.flatMap((c, i) => [0, 1, 2].map((j) => {
            const q = easeOut(tramo(an, (i * 3 + j) * 0.025, 0.5 + (i * 3 + j) * 0.025));
            if (q <= 0) return null;
            return (
              <g key={`${i}-${j}`} opacity={Math.min(1, q * 2)} transform={`translate(${c.x + c.w / 2 + (j - 1) * 22},${c.y - 18 - 70 * q - j * 8}) rotate(${(i * 40 + j * 70) * q})`}>
                <Antigeno tipo={j} />
              </g>
            );
          }))}
          <g opacity={tramo(an, 0.4, 0.8)} transform="translate(1130,404)">
            <rect x={-250} y={-26} width={500} height={52} rx={26} className={s.chip} />
            <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>ADN · nucleosomas · Ro al descubierto</text>
          </g>
        </g>
      )}
      {pl > 0.001 && (
        <g opacity={pl} transform="translate(1130,880)">
          <rect x={-340} y={-30} width={680} height={60} rx={30} className={s.chip} />
          <g transform="translate(-300,2) scale(0.8)"><Parasol /></g>
          <text x={20} textAnchor="middle" dy="0.35em" className={s.chipTxt}>Una tarde de playa → brote cutáneo y sistémico</text>
        </g>
      )}
      {fp > 0.001 && (
        <g opacity={fp} transform={`translate(1130,950) scale(${0.85 + 0.15 * easeBack(fp)})`}>
          <rect x={-340} y={-30} width={680} height={60} rx={30} className={s.chipVerde} />
          <g transform="translate(-302,2) scale(0.72)"><Protector /></g>
          <text x={20} textAnchor="middle" dy="0.35em" className={s.chipTxt}>Protector solar FPS 50+: parte del tratamiento</text>
        </g>
      )}
    </g>
  );
}

// ─── 5 · Virus de Epstein-Barr ────────────────────────────────────────────────

/** Herpesvirus en corte: glucoproteínas en la envoltura, tegumento, cápside
 *  icosaédrica con sus capsómeros y el ADN de doble cadena enrollado dentro. */
const Virus = memo(function Virus({ x, y, r }: { x: number; y: number; r: number }) {
  const rc = r * 0.6;
  const vert = Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; return [Math.cos(a) * rc, Math.sin(a) * rc]; });
  const centro: [number, number] = [0, 0];
  // Caras del icosaedro visto de frente: seis triángulos con tonos distintos.
  const caras = vert.map((p, i) => ({ d: `M${f1(p[0])},${f1(p[1])} L${f1(vert[(i + 1) % 6][0])},${f1(vert[(i + 1) % 6][1])} L${centro[0]},${centro[1]} Z`, o: [0.5, 0.26, 0.14, 0.2, 0.36, 0.6][i] }));
  const hex = vert.map((p) => `${f1(p[0])},${f1(p[1])}`).join(' ');
  const capsomeros = caras.flatMap((_, i) => {
    const a = vert[i], b = vert[(i + 1) % 6];
    return [[0.33, 0.33], [0.6, 0.2], [0.2, 0.6], [0.46, 0.46]].map(([u, w]) => ({ x: a[0] * u + b[0] * w, y: a[1] * u + b[1] * w }));
  });
  const adn = Array.from({ length: 5 }, (_, i) => {
    const q = rc * (0.2 + i * 0.09);
    return `M${f1(-q)},${f1((i - 2) * rc * 0.12)} C${f1(-q * 0.5)},${f1((i - 2) * rc * 0.12 - rc * 0.28)} ${f1(q * 0.5)},${f1((i - 2) * rc * 0.12 + rc * 0.28)} ${f1(q)},${f1((i - 2) * rc * 0.12)}`;
  }).join(' ');
  return (
    <g transform={`translate(${x},${y})`}>
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * 360 + (i % 2) * 2, largo = r * (i % 3 ? 0.17 : 0.24);
        return (
          <g key={i} transform={`rotate(${a}) translate(0,${f1(-r)})`}>
            <line x1={0} y1={0} x2={0} y2={f1(-largo)} stroke="#6E3DB0" strokeWidth={Math.max(1.3, r * 0.024)} />
            <ellipse cy={-largo} rx={r * 0.058} ry={r * 0.042} fill="url(#ca-espicula)" />
          </g>
        );
      })}
      <circle r={r} fill="url(#ca-envoltura)" stroke="#6E3DB0" strokeWidth={Math.max(1.6, r * 0.03)} />
      <circle r={r * 0.94} fill="none" stroke="#8E6CC4" strokeWidth={Math.max(0.8, r * 0.012)} strokeDasharray="2 2.6" />
      {/* Tegumento: la capa de proteínas entre la envoltura y la cápside */}
      <circle r={r * 0.82} fill="url(#ca-tegumento)" />
      {Array.from({ length: 34 }, (_, i) => {
        const a = i * 2.39996, q = r * (0.68 + fijo(i, 3) * 0.2);
        return <circle key={i} cx={Math.cos(a) * q} cy={Math.sin(a) * q} r={Math.max(0.8, r * 0.016)} fill="#6E4FA6" opacity={0.55} />;
      })}
      <polygon points={hex} fill="#EDE5F8" stroke="#4E3380" strokeWidth={Math.max(1.6, r * 0.028)} strokeLinejoin="round" />
      <path d={adn} fill="none" stroke="#2F6FD0" strokeWidth={Math.max(1.2, r * 0.026)} strokeLinecap="round" opacity={0.8} />
      {caras.map((c, i) => <path key={i} d={c.d} fill="#5E3DA0" opacity={c.o * 0.55} stroke="#4E3380" strokeWidth={Math.max(0.6, r * 0.01)} />)}
      {capsomeros.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={Math.max(0.9, r * 0.024)} fill="#FFF" opacity={0.65} />)}
      <ellipse cx={-r * 0.42} cy={-r * 0.6} rx={r * 0.26} ry={r * 0.1} fill="#FFF" opacity={0.5} transform={`rotate(-36 ${-r * 0.42} ${-r * 0.6})`} />
    </g>
  );
});

/** Péptido plegado igual en el virus y en lo propio: lo que confunde al anticuerpo. */
function Peptido({ x, y, c }: { x: number; y: number; c: string }) {
  const pts: [number, number][] = [[-34, 12], [-24, -4], [-10, -12], [4, -6], [10, 8], [24, 12], [34, -2]];
  return (
    <g transform={`translate(${x},${y})`}>
      <path d={`M${pts.map(([a, b]) => `${a},${b}`).join(' L')}`} fill="none" stroke={c} strokeWidth={3} strokeLinejoin="round" opacity={0.65} />
      {pts.map(([a, b], i) => <g key={i}><circle cx={a} cy={b} r={6.6} fill={c} /><circle cx={a - 2} cy={b - 2} r={2} fill="#FFF" opacity={0.6} /></g>)}
    </g>
  );
}

function Ebv({ t }: { t: T }) {
  const vi = v(t, 'virus'), mi = v(t, 'mimetismo'), ep = v(t, 'epitopos');
  const cadena = (y: number, k0: number, paso: number) => Array.from({ length: 6 }, (_, j) => {
    const x = 800 + j * 113;
    const q = tramo(ep, k0 + j * paso, k0 + j * paso + 0.06);
    return (
      <g key={j}>
        <rect x={x} y={y} width={105} height={34} rx={17} className={s.segmento} />
        {/* Cada segmento, una hélice de la proteína */}
        <path d={`M${x + 12},${y + 17} ${Array.from({ length: 8 }, (_, n) => `q5.5,${n % 2 ? 13 : -13} 11,0`).join(' ')}`} fill="none" stroke={q > 0 ? '#FFF' : 'var(--texto-2)'} strokeWidth={2} opacity={0.5} />
        {q > 0 && <rect x={x} y={y} width={105} height={34} rx={17} fill={L.ana} opacity={q * 0.82} />}
        <rect x={x} y={y} width={105} height={34} rx={17} fill="url(#ca-segmento)" />
        {q > 0 && <Y x={x + 52} y={y - 18} ang={180} k={2 * (0.6 + 0.4 * easeBack(q))} c={L.ana} />}
      </g>
    );
  });
  return (
    <g>
      {vi > 0.001 && (
        <g opacity={vi}>
          <Virus x={520} y={320} r={78 * (0.85 + 0.15 * easeBack(vi))} />
          <text x={520} y={460} textAnchor="middle" className={s.lEtiqueta}>Virus de Epstein-Barr</text>
        </g>
      )}
      {mi > 0.001 && (
        <g opacity={mi}>
          <text x={1080} y={170} textAnchor="middle" className={s.tituloSeccion}>Mimetismo molecular</text>
          {[880, 1280].map((x) => <circle key={x} cx={x} cy={300} r={60} className={s.haloMimetismo} />)}
          <text x={880} y={226} textAnchor="middle" className={s.lSub}>del virus</text>
          <text x={1280} y={226} textAnchor="middle" className={s.lSub}>propia</text>
          <text x={1080} y={312} textAnchor="middle" className={s.parecido}>≈</text>
          <text x={1080} y={350} textAnchor="middle" className={s.lSub}>misma forma</text>
          <g opacity={0.95}>
            <Peptido x={1010} y={392} c="#8A4FCF" />
            <Peptido x={1150} y={392} c={L.rnp} />
          </g>
        </g>
      )}
      {ep > 0.001 && (
        <g opacity={tramo(ep, 0, 0.08)}>
          <text x={800} y={586} className={s.lEtiquetaMayus}>Propagación de epítopos</text>
          {cadena(650, 0, 0.09)}
          <text x={800} y={758} className={s.lSub} opacity={tramo(ep, 0.55, 0.62)}>…y a otras moléculas</text>
          <g opacity={tramo(ep, 0.55, 0.62)}>{cadena(820, 0.62, 0.06)}</g>
        </g>
      )}
    </g>
  );
}

// ─── 6 · Tabaco, sílice y lo que tienen en común ──────────────────────────────

const Cigarrillo = memo(function Cigarrillo({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y}) rotate(-6)`}>
      {/* Humo que sube y se deshace */}
      <path d="M-95,-22 C-112,-44 -78,-60 -96,-84 C-108,-100 -84,-108 -90,-124 C-82,-110 -96,-100 -84,-84 C-66,-60 -100,-44 -86,-22 Z" fill="url(#ca-humo)" />
      <path d="M-80,-20 C-92,-38 -64,-50 -78,-70 C-84,-80 -70,-88 -74,-98 C-66,-88 -76,-78 -68,-70 C-54,-50 -82,-38 -72,-20 Z" fill="url(#ca-humo)" opacity={0.7} />
      {/* Papel, con la unión y su sombra */}
      <rect x={-90} y={-14} width={150} height={28} fill="url(#ca-papel)" />
      <path d="M-60,-14 L-60,14 M-20,-14 L-20,14 M20,-14 L20,14" stroke="#B9B7AE" strokeWidth={0.7} opacity={0.6} />
      {/* Filtro de corcho, moteado */}
      <rect x={60} y={-14} width={46} height={28} rx={3} fill="url(#ca-corcho)" />
      {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={63 + fijo(i, 1) * 40} cy={-11 + fijo(i, 2) * 22} r={0.9} fill="#7E4E1F" opacity={0.55} />)}
      <rect x={58} y={-14} width={4} height={28} fill="#E8C66A" />
      <rect x={103} y={-13} width={3} height={26} rx={1.5} fill="#8C5E2C" />
      {/* Brasa y ceniza */}
      <path d="M-90,-14 C-98,-14 -102,-8 -102,0 C-102,8 -98,14 -90,14 Z" fill="url(#ca-brasa)" />
      <path d="M-97,-12 C-103,-8 -106,-2 -105,3 C-102,0 -100,-6 -96,-8 Z" fill="#8A8F99" />
      <circle cx={-100} cy={7} r={1.6} fill="#FFD08A" />
    </g>
  );
});

/** Sílice: cristales de cuarzo y el pico que levanta el polvo. */
const Silice = memo(function Silice({ x, y }: { x: number; y: number }) {
  const cristal = (cx: number, base: number, w: number, h: number, inc: number) => (
    <g transform={`translate(${cx},${base}) rotate(${inc})`}>
      <path d={`M${-w},0 L${-w},${-h} L0,${-h - w * 1.4} L${w * 0.2},${-h - w * 0.7} L${w * 0.2},0 Z`} fill="#EEF3F8" stroke="#8E9AAC" strokeWidth={1.1} strokeLinejoin="round" />
      <path d={`M${w * 0.2},0 L${w * 0.2},${-h - w * 0.7} L0,${-h - w * 1.4} L${w},${-h} L${w},0 Z`} fill="#BCC8D6" stroke="#8E9AAC" strokeWidth={1.1} strokeLinejoin="round" />
      <path d={`M${-w * 0.55},${-h * 0.15} L${-w * 0.55},${-h * 0.85}`} stroke="#FFF" strokeWidth={2} strokeLinecap="round" opacity={0.9} />
    </g>
  );
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Pico de minero */}
      <g transform="translate(26,-10) rotate(26)">
        <rect x={-4.5} y={-46} width={9} height={100} rx={3} fill="url(#ca-mango)" />
        <path d="M-58,-30 C-34,-58 34,-58 58,-30 C34,-44 -34,-44 -58,-30 Z" fill="url(#ca-hierro)" stroke="#2E3440" strokeWidth={1} />
        <rect x={-8} y={-54} width={16} height={18} rx={3} fill="#4A5263" />
      </g>
      {/* Cuarzo */}
      <ellipse cx={-26} cy={54} rx={50} ry={8} fill="#8A93A6" opacity={0.3} />
      {cristal(-48, 52, 12, 34, -14)}
      {cristal(-6, 52, 11, 26, 16)}
      {cristal(-26, 54, 15, 48, 0)}
      {/* Polvo de sílice en el aire */}
      {Array.from({ length: 26 }, (_, i) => <circle key={i} cx={-74 + fijo(i, 1) * 140} cy={-22 + fijo(i, 2) * 74} r={0.9 + fijo(i, 3) * 1.8} className={s.polvo} opacity={0.75} />)}
    </g>
  );
});

const ICONOS_X = [560, 820, 1080, 1340];

function Comun({ t }: { t: T }) {
  const ta = v(t, 'tabaco'), si = v(t, 'silice'), co = v(t, 'comun'), ex = v(t, 'expuesto');
  if (ta <= 0.001) return null;
  const rotulos = [['Luz UV', ''], ['Epstein-Barr', ''], ['Tabaco', 'más riesgo e inflamación'], ['Sílice', 'minería, construcción']];
  return (
    <g>
      <g opacity={0.72 * ta}><Sol x={ICONOS_X[0]} y={290} r={34} /></g>
      <g opacity={0.72 * ta}><Virus x={ICONOS_X[1]} y={290} r={44} /></g>
      <g opacity={ta}><Cigarrillo x={ICONOS_X[2]} y={300} /></g>
      <g opacity={si}><Silice x={ICONOS_X[3]} y={290} /></g>
      {rotulos.map(([a, b], i) => {
        const op = i < 2 ? 0.7 * ta : i === 2 ? ta : si;
        return (
          <g key={a} opacity={op}>
            <text x={ICONOS_X[i]} y={392} textAnchor="middle" className={s.lEtiqueta}>{a}</text>
            {b && <text x={ICONOS_X[i]} y={420} textAnchor="middle" className={s.lSub}>{b}</text>}
          </g>
        );
      })}
      {co > 0.001 && (
        <g>
          {ICONOS_X.map((x, i) => <path key={x} d={`M${x},440 C${x},500 950,480 950,520`} className={s.flechaComun} {...dibujar(tramo(co, i * 0.08, 0.5 + i * 0.08))} />)}
          <g opacity={tramo(co, 0.4, 0.8)} transform="translate(950,566)">
            <rect x={-360} y={-38} width={720} height={76} rx={20} className={s.cajaComun} />
            <text textAnchor="middle" dy="0.35em" className={s.significado}>daño celular · muerte celular · activación inmune</text>
          </g>
        </g>
      )}
      {ex > 0.001 && (
        <g>
          {[740, 1160].map((x, i) => (
            <g key={x}>
              <path d={`M950,606 C950,650 ${x},640 ${x},690`} className={s.flechaComun} {...dibujar(tramo(ex, i * 0.15, 0.5 + i * 0.15))} />
              <g opacity={tramo(ex, 0.35 + i * 0.15, 0.7 + i * 0.15)} transform={`translate(${x},745)`}>
                <rect x={-190} y={-50} width={380} height={100} rx={20} className={s.cajaResultado} />
                <text y={-12} textAnchor="middle" dy="0.35em" className={s.chipTxt}>{i ? 'un sistema inmune más' : 'más material nuclear'}</text>
                <text y={20} textAnchor="middle" dy="0.35em" className={s.chipTxt}>{i ? 'dispuesto a verlo' : 'expuesto'}</text>
              </g>
            </g>
          ))}
        </g>
      )}
    </g>
  );
}

// ─── 7 · Lupus por fármacos ───────────────────────────────────────────────────

/** Frasco de farmacia: vidrio ámbar, tapa estriada, etiqueta y las pastillas dentro. */
function Frasco({ x, y, c, nombre, sub, k, tachado }: { x: number; y: number; c: string; nombre: string; sub: string; k: number; tachado: number }) {
  return (
    <g opacity={k * (1 - 0.6 * tachado)} transform={`translate(${x},${y}) scale(${0.85 + 0.15 * easeBack(k)})`}>
      {/* Pastillas sueltas al pie */}
      <ellipse cx={-30} cy={68} rx={40} ry={5} fill="#000" opacity={0.08} />
      {/* Cuerpo de vidrio */}
      <path d="M-30,-62 L-30,-54 C-48,-50 -52,-40 -52,-26 L-52,52 C-52,62 -44,66 -36,66 L36,66 C44,66 52,62 52,52 L52,-26 C52,-40 48,-50 30,-54 L30,-62 Z" fill="url(#ca-ambar)" stroke="#4A2A0C" strokeWidth={1.2} />
      {/* Pastillas vistas a través del vidrio */}
      {[[-30, 44], [-12, 54], [10, 48], [30, 54], [-20, 30], [20, 34]].map(([px, py], i) => (
        <g key={i} transform={`translate(${px},${py}) rotate(${i * 42})`}>
          <rect x={-11} y={-5} width={22} height={10} rx={5} fill="#F7EFE2" opacity={0.82} />
          <rect x={0} y={-5} width={11} height={10} rx={5} fill={c} opacity={0.7} />
        </g>
      ))}
      {/* Etiqueta */}
      <rect x={-52} y={-26} width={104} height={50} fill="#FBFAF6" />
      <rect x={-52} y={-26} width={104} height={13} fill={c} />
      <path d="M-40,-3 L40,-3 M-40,6 L24,6 M-40,15 L32,15" stroke="#8E94A0" strokeWidth={2.2} strokeLinecap="round" opacity={0.75} />
      <rect x={-52} y={-26} width={22} height={50} fill="#000" opacity={0.08} />
      <rect x={32} y={-26} width={20} height={50} fill="#000" opacity={0.14} />
      {/* Luz sobre el vidrio */}
      <path d="M-40,-40 C-44,-32 -44,-28 -44,-26 M-44,28 L-44,52" stroke="#FFF" strokeWidth={4.5} strokeLinecap="round" opacity={0.5} />
      {/* Tapa estriada */}
      <rect x={-36} y={-92} width={72} height={32} rx={5} fill="url(#ca-tapa)" stroke="#858E9C" strokeWidth={1.2} />
      {Array.from({ length: 11 }, (_, i) => <line key={i} x1={-31 + i * 6.2} y1={-90} x2={-31 + i * 6.2} y2={-62} stroke="#858E9C" strokeWidth={1.1} opacity={0.65} />)}
      <text y={104} textAnchor="middle" className={s.lEtiqueta}>{nombre}</text>
      <text y={132} textAnchor="middle" className={s.lSub}>{sub}</text>
      {tachado > 0.001 && <path d={`M${-58 * tachado},${-80 * tachado} L${58 * tachado},${60 * tachado}`} className={s.cruz} />}
    </g>
  );
}

const TRUCOS = [
  ['Anticuerpos antihistona', 'anti-ADNdc casi siempre negativo'],
  ['Casi nunca riñón ni SNC', 'artritis, serositis, fiebre'],
  ['Remite al suspenderlo', 'en semanas a meses'],
];

function Farmacos({ t }: { t: T }) {
  const ti = v(t, 'tituloF'), fr = v(t, 'frascos'), tr = v(t, 'trucos'), re = v(t, 'retira'), rc = v(t, 'receta');
  return (
    <g>
      {ti > 0.001 && (
        <g opacity={ti}>
          <text x={880} y={176} textAnchor="middle" className={s.tituloSeccion}>Lupus inducido por fármacos</text>
          <g transform="translate(1235,166)">
            <rect x={-56} y={-20} width={112} height={40} rx={20} fill={L.causas} />
            <text textAnchor="middle" dy="0.35em" className={s.chipTxtBlanco}>examen</text>
          </g>
        </g>
      )}
      {fr > 0.001 && <Frasco x={520} y={420} c="#2F6FD0" nombre="Procainamida" sub="antiarrítmico" k={tramo(fr, 0, 0.5)} tachado={re} />}
      {fr > 0.5 && <Frasco x={730} y={420} c="#1F9A6A" nombre="Hidralazina" sub="antihipertensivo" k={tramo(fr, 0.5, 1)} tachado={re} />}
      {fr > 0.5 && (
        <g opacity={tramo(fr, 0.6, 1) * (1 - re)}>
          <path d="M640,590 C660,650 740,660 790,660" className={s.flechaComun} />
          <text x={600} y={716} textAnchor="middle" className={s.lSub}>alteran la regulación inmune</text>
        </g>
      )}
      {TRUCOS.map(([a, b], i) => {
        const k = clamp(tr - i);
        if (k <= 0.001) return null;
        const y = 400 + i * 120;
        const brilla = i === 2 ? re : 0;
        return (
          <g key={a} opacity={k} transform={`translate(${30 * (1 - easeOut(k))},0)`}>
            <rect x={1150} y={y - 48} width={410} height={96} rx={18} className={brilla > 0.5 ? s.tarjetaVerde : s.tarjeta} />
            <circle cx={1194} cy={y} r={20} fill={L.causas} />
            <text x={1194} y={y} textAnchor="middle" dy="0.35em" className={s.chipTxtBlanco}>{i + 1}</text>
            <text x={1230} y={y - 12} dy="0.35em" className={s.chipTxt}>{a}</text>
            <text x={1230} y={y + 18} dy="0.35em" className={s.lSubChico}>{b}</text>
          </g>
        );
      })}
      {rc > 0.001 && (
        <g opacity={rc} transform={`translate(880,900) scale(${0.85 + 0.15 * easeBack(rc)})`}>
          <rect x={-420} y={-30} width={840} height={60} rx={30} className={s.chipPista} />
          <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>Lupus súbito en un señor mayor e hipertenso → revisa su receta</text>
        </g>
      )}
    </g>
  );
}

export default function FondoCausas({ t, reloj }: { t: T; reloj: number }) {
  return (
    <g>
      <Defs />
      <Genes t={t} />
      <Complemento t={t} />
      <Hormonas t={t} />
      <Uv t={t} />
      <Ebv t={t} />
      <Comun t={t} />
      <Farmacos t={t} />
      <Cerradura t={t} reloj={reloj} />
    </g>
  );
}
