'use client';
// Órganos del laboratorio «Lupus», dibujados como una lámina médica y no como un
// icono. Cada pieza sale de cuatro capas: forma base con degradado → sombra de
// volumen recortada a la forma (`clipPath`) → estructuras encima (surcos, vasos,
// fisuras) → brillo. Los vasos son tres trazos apilados (oscuro, medio, luz), que
// se leen como un tubo. Sin `filter`: un desenfoque se vuelve a calcular en cada
// fotograma de la animación, y un degradado no.
//
// Coordenadas: caja de 200 × 200 centrada en 0; `Organo` la deja en 100 × 100, la
// medida de los iconos de `laminas.tsx`. Los colores valen en los dos temas.

import { memo, type ReactNode } from 'react';

// ─── Degradados y recortes (una sola vez por lámina: `DefsAnatomia`) ──────────

export const CONTORNO = {
  corazon: 'M-42,-30 C-62,-32 -73,-14 -71,4 C-70,20 -63,31 -52,41 C-36,58 -2,82 30,92 C38,95 45,90 49,82 C63,58 73,30 69,4 C67,-14 56,-30 40,-34 C20,-40 -20,-40 -42,-30 Z',
  cerebro: 'M-80,-4 C-86,-36 -60,-74 -22,-80 C14,-86 58,-72 76,-38 C88,-14 86,12 70,24 C58,32 44,29 34,27 C18,24 6,31 -8,39 C-22,47 -44,45 -52,31 C-56,23 -54,15 -58,11 C-68,13 -78,9 -80,-4 Z',
  cerebelo: 'M20,30 C36,24 64,26 72,35 C80,46 68,64 47,64 C30,64 17,51 20,30 Z',
  rinon: 'M10,-86 C-30,-94 -70,-58 -72,-6 C-74,46 -36,90 6,86 C28,84 35,63 25,45 C17,30 15,18 15,2 C15,-16 19,-28 29,-43 C39,-61 35,-82 10,-86 Z',
  sinus: 'M12,-46 C-6,-40 -16,-20 -16,2 C-16,24 -6,42 12,48 C18,38 15,20 15,2 C15,-16 18,-34 12,-46 Z',
  pulmonD: 'M-13,-72 C-30,-86 -52,-68 -64,-36 C-78,0 -86,44 -82,72 C-80,84 -62,86 -44,78 C-26,70 -11,64 -9,50 C-7,30 -9,0 -9,-20 C-9,-42 -6,-58 -13,-72 Z',
  pulmonI: 'M13,-72 C30,-86 52,-68 64,-36 C78,0 86,44 82,72 C80,84 62,86 48,78 C40,74 34,72 31,63 C41,53 38,35 22,27 C14,23 11,10 11,-4 C11,-30 7,-58 13,-72 Z',
  femur: 'M-23,-98 L23,-98 C23,-70 27,-46 45,-26 C55,-14 53,-1 38,-1 C26,-1 16,-8 6,-14 Q0,-10 -6,-14 C-16,-8 -26,-1 -38,-1 C-53,-1 -55,-14 -45,-26 C-27,-46 -23,-70 -23,-98 Z',
  tibia: 'M-45,16 C-30,10 -14,12 -4,14 Q0,10 4,14 C14,12 30,10 45,16 C51,24 41,34 29,44 C21,54 19,74 19,98 L-19,98 C-19,74 -21,54 -29,44 C-41,34 -51,24 -45,16 Z',
};

export const DefsAnatomia = memo(function DefsAnatomia() {
  return (
    <defs>
      {/* Miocardio y aurículas */}
      <radialGradient id="an-mio" cx="0.36" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#CC7468" /><stop offset="0.5" stopColor="#AE4D47" /><stop offset="1" stopColor="#6F2629" />
      </radialGradient>
      <radialGradient id="an-auri" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#C4726C" /><stop offset="1" stopColor="#84363A" />
      </radialGradient>
      <radialGradient id="an-sombra" cx="0.34" cy="0.28" r="0.9">
        <stop offset="0.55" stopColor="#2A0E14" stopOpacity="0" /><stop offset="1" stopColor="#2A0E14" stopOpacity="0.5" />
      </radialGradient>
      <radialGradient id="an-brillo">
        <stop offset="0" stopColor="#FFF" stopOpacity="0.5" /><stop offset="1" stopColor="#FFF" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="an-grasa">
        <stop offset="0" stopColor="#F2DDA6" stopOpacity="0.95" /><stop offset="1" stopColor="#E7C987" stopOpacity="0" />
      </radialGradient>
      {/* Cerebro */}
      <radialGradient id="an-cortex" cx="0.38" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#F0CFC4" /><stop offset="0.6" stopColor="#DFA79D" /><stop offset="1" stopColor="#B8767A" />
      </radialGradient>
      <radialGradient id="an-cerebelo" cx="0.4" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#E3B3AA" /><stop offset="1" stopColor="#A9676E" />
      </radialGradient>
      <linearGradient id="an-tronco" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#E9C9BC" /><stop offset="1" stopColor="#B98A84" />
      </linearGradient>
      {/* Riñón */}
      <radialGradient id="an-corteza" cx="0.3" cy="0.4" r="0.85">
        <stop offset="0" stopColor="#C97A68" /><stop offset="0.7" stopColor="#A9574C" /><stop offset="1" stopColor="#7B3634" />
      </radialGradient>
      <linearGradient id="an-piramide" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#7E3433" /><stop offset="1" stopColor="#A5514B" />
      </linearGradient>
      <radialGradient id="an-sinus" cx="0.7" cy="0.5" r="0.8">
        <stop offset="0" stopColor="#F4E2BE" /><stop offset="1" stopColor="#E0BE88" />
      </radialGradient>
      {/* Pulmón */}
      <radialGradient id="an-pulmon" cx="0.42" cy="0.32" r="0.85">
        <stop offset="0" stopColor="#F1C3B8" /><stop offset="0.6" stopColor="#DD9C93" /><stop offset="1" stopColor="#B26A6E" />
      </radialGradient>
      {/* Hueso y cartílago */}
      <linearGradient id="an-hueso" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#F8F1E0" /><stop offset="0.55" stopColor="#EEE1C6" /><stop offset="1" stopColor="#C9B38E" />
      </linearGradient>
      <linearGradient id="an-cartilago" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#E4F1F4" /><stop offset="1" stopColor="#B6D3DC" />
      </linearGradient>
      <radialGradient id="an-capsula" cx="0.5" cy="0.5" r="0.55">
        <stop offset="0" stopColor="#E9A49C" stopOpacity="0.1" /><stop offset="0.75" stopColor="#E08A84" stopOpacity="0.22" /><stop offset="1" stopColor="#C8605E" stopOpacity="0.55" />
      </radialGradient>
      {/* Sangre */}
      <radialGradient id="an-plasma" cx="0.45" cy="0.4" r="0.7">
        <stop offset="0" stopColor="#F7D9BE" /><stop offset="1" stopColor="#E3A98A" />
      </radialGradient>
      <radialGradient id="an-hematie">
        <stop offset="0" stopColor="#A4282C" /><stop offset="0.34" stopColor="#B7302F" /><stop offset="0.72" stopColor="#D44C42" /><stop offset="1" stopColor="#9E2529" />
      </radialGradient>
      <radialGradient id="an-leuco" cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#F5F0F7" /><stop offset="1" stopColor="#CFC3DC" />
      </radialGradient>
      <radialGradient id="an-nucleo-leuco" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#8E6DB8" /><stop offset="1" stopColor="#4F3580" />
      </radialGradient>
      <clipPath id="an-c-corazon"><path d={CONTORNO.corazon} /></clipPath>
      <clipPath id="an-c-cerebro"><path d={CONTORNO.cerebro} /></clipPath>
      <clipPath id="an-c-cerebelo"><path d={CONTORNO.cerebelo} /></clipPath>
      <clipPath id="an-c-rinon"><path d={CONTORNO.rinon} /></clipPath>
      <clipPath id="an-c-pulmond"><path d={CONTORNO.pulmonD} /></clipPath>
      <clipPath id="an-c-pulmoni"><path d={CONTORNO.pulmonI} /></clipPath>
      <clipPath id="an-c-femur"><path d={CONTORNO.femur} /></clipPath>
      <clipPath id="an-c-tibia"><path d={CONTORNO.tibia} /></clipPath>
      <clipPath id="an-c-gota"><circle r={88} /></clipPath>
      <clipPath id="an-c-disco"><circle r={46} /></clipPath>
    </defs>
  );
});

// ─── Piezas repetidas ─────────────────────────────────────────────────────────

type Tono = readonly [string, string, string];
export const ARTERIA: Tono = ['#7E2428', '#B8433E', '#E58C7C'];
export const VENA: Tono = ['#2C3F6E', '#4D6AA3', '#9CB4DA'];
export const ARTERIA_FINA: Tono = ['#8E2A2C', '#C24B44', '#EEA79A'];
export const VENA_FINA: Tono = ['#34477A', '#5C79B2', '#B4C8E6'];

/** Vaso como tubo: tres trazos apilados, con la luz corrida hacia arriba a la izquierda. */
export function Tubo({ d, w, tono, cap = 'butt' }: { d: string; w: number; tono: Tono; cap?: 'butt' | 'round' }) {
  const base = { d, fill: 'none', strokeLinecap: cap, strokeLinejoin: 'round' as const };
  return (
    <g>
      <path {...base} stroke={tono[0]} strokeWidth={w} />
      <path {...base} stroke={tono[1]} strokeWidth={w * 0.76} />
      <path {...base} stroke={tono[2]} strokeWidth={w * 0.24} opacity={0.55} transform={`translate(${-w * 0.14},${-w * 0.08})`} />
    </g>
  );
}

/** La boca abierta de un vaso cortado. */
function Corte({ x, y, rx, ry, tono, rot = 0 }: { x: number; y: number; rx: number; ry: number; tono: Tono; rot?: number }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      <ellipse rx={rx} ry={ry} fill={tono[1]} stroke={tono[0]} strokeWidth={1} />
      <ellipse rx={rx * 0.66} ry={ry * 0.62} fill="#3A1418" opacity={0.85} />
    </g>
  );
}

function Lineas({ d, c, w, o = 1 }: { d: string; c: string; w: number; o?: number }) {
  return <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={o} />;
}

// ─── Corazón: vista anterior ──────────────────────────────────────────────────

const FIBRAS = [
  'M-40,-8 C-22,14 4,40 26,74', 'M-48,10 C-30,30 -6,54 16,78', 'M-30,-22 C-10,4 14,30 36,66', 'M-54,24 C-40,40 -22,56 -4,70',
  'M26,-26 C28,6 34,40 42,70', 'M38,-26 C44,4 48,36 48,64', 'M50,-20 C56,6 58,30 54,54', 'M-14,-28 C2,-4 20,20 34,48',
];

export const Corazon = memo(function Corazon() {
  return (
    <g transform="translate(0,6) scale(0.92)">
      {/* Lo que queda detrás: venas pulmonares, cava inferior, rama derecha de la pulmonar */}
      <Tubo d="M58,-28 L92,-36" w={11} tono={['#6E2E36', '#A9525A', '#E0A0A4']} />
      <Tubo d="M60,-14 L92,-14" w={11} tono={['#6E2E36', '#A9525A', '#E0A0A4']} />
      <Tubo d="M-60,-22 L-90,-28" w={11} tono={['#6E2E36', '#A9525A', '#E0A0A4']} />
      <Tubo d="M-62,-8 L-90,-6" w={11} tono={['#6E2E36', '#A9525A', '#E0A0A4']} />
      <Tubo d="M-48,34 L-52,66" w={22} tono={VENA} />
      <Corte x={-52} y={66} rx={11} ry={4} tono={VENA} />
      <Tubo d="M22,-62 C4,-66 -34,-64 -74,-60" w={15} tono={VENA} />
      <Corte x={-74} y={-60} rx={4} ry={7.5} tono={VENA} rot={6} />
      {/* Cava superior */}
      <Tubo d="M-37,-24 C-37,-50 -38,-76 -38,-104" w={24} tono={VENA} />
      <Corte x={-38} y={-104} rx={12} ry={4.5} tono={VENA} />
      {/* Cayado de la aorta con sus tres ramas */}
      <Tubo d="M-8,-86 C-11,-96 -13,-104 -15,-114" w={11} tono={ARTERIA} />
      <Corte x={-15} y={-114} rx={5.5} ry={2.2} tono={ARTERIA} rot={-10} />
      <Tubo d="M7,-90 L9,-116" w={9.5} tono={ARTERIA} />
      <Corte x={9} y={-116} rx={4.7} ry={2} tono={ARTERIA} rot={4} />
      <Tubo d="M23,-85 C27,-96 30,-104 35,-114" w={10.5} tono={ARTERIA} />
      <Corte x={35} y={-114} rx={5.2} ry={2.2} tono={ARTERIA} rot={18} />
      <Tubo d="M-13,-26 C-19,-56 -19,-80 3,-86 C24,-92 44,-78 50,-46" w={27} tono={ARTERIA} />
      {/* Cuerpo: aurícula derecha y ventrículos */}
      <path d={CONTORNO.corazon} fill="url(#an-mio)" />
      <g clipPath="url(#an-c-corazon)">
        {/* Aurícula derecha, separada por el surco */}
        <path d="M-42,-32 C-64,-34 -76,-12 -72,6 C-70,18 -66,26 -58,34 C-50,24 -42,6 -38,-8 C-34,-20 -30,-30 -42,-32 Z" fill="url(#an-auri)" />
        {/* Fibras oblicuas del miocardio */}
        {FIBRAS.map((d, i) => <Lineas key={i} d={d} c="#5C1E22" w={1.5} o={0.18} />)}
        {FIBRAS.map((d, i) => <Lineas key={i} d={d} c="#F1B9A8" w={0.9} o={0.2} />)}
        {/* Grasa en los surcos */}
        <ellipse cx={-30} cy={-12} rx={18} ry={32} fill="url(#an-grasa)" transform="rotate(28 -30 -12)" />
        <ellipse cx={13} cy={0} rx={12} ry={40} fill="url(#an-grasa)" transform="rotate(-6 13 0)" />
        <ellipse cx={22} cy={60} rx={8} ry={26} fill="url(#an-grasa)" opacity={0.7} transform="rotate(-14 22 60)" />
        <path d={CONTORNO.corazon} fill="url(#an-sombra)" />
      </g>
      {/* Tronco de la pulmonar, por delante de la aorta */}
      <Tubo d="M14,-24 C14,-44 20,-58 32,-66 C50,-72 66,-72 84,-68" w={21} tono={VENA} />
      <Corte x={84} y={-68} rx={4.4} ry={9} tono={VENA} rot={-8} />
      {/* Infundíbulo: la pulmonar nace del ventrículo, sin esquina */}
      <path d="M-1,-34 C4,-24 26,-24 30,-34 C31,-18 25,-4 14,6 C5,-4 -1,-18 -1,-34 Z" fill="url(#an-mio)" />
      {/* Orejuelas */}
      <path d="M-44,-30 C-38,-44 -22,-42 -12,-34 C-8,-30 -11,-26 -15,-27 C-14,-20 -20,-18 -24,-22 C-26,-14 -34,-14 -36,-20 C-40,-16 -46,-22 -44,-30 Z" fill="url(#an-auri)" stroke="#6F2C30" strokeWidth={0.8} />
      <path d="M34,-34 C44,-44 62,-40 64,-26 C62,-22 58,-23 56,-26 C56,-19 49,-17 46,-22 C43,-16 36,-18 35,-24 C32,-26 32,-31 34,-34 Z" fill="url(#an-auri)" stroke="#6F2C30" strokeWidth={0.8} />
      {/* Coronarias y venas cardíacas */}
      <Tubo d="M8,-24 C3,-2 4,22 12,44 C17,60 24,76 32,88" w={3.4} tono={VENA_FINA} cap="round" />
      <Tubo d="M13,-24 C8,-2 9,22 17,44 C22,60 28,74 36,86" w={4} tono={ARTERIA_FINA} cap="round" />
      <Tubo d="M11,10 C22,18 36,22 52,20" w={2.5} tono={ARTERIA_FINA} cap="round" />
      <Tubo d="M14,34 C24,40 36,42 48,44" w={2.2} tono={ARTERIA_FINA} cap="round" />
      <Tubo d="M-12,-24 C-28,-14 -42,2 -46,20 C-48,32 -44,44 -36,52" w={4} tono={ARTERIA_FINA} cap="round" />
      <Tubo d="M-44,28 C-28,44 -12,56 8,68" w={2.4} tono={ARTERIA_FINA} cap="round" />
      <Tubo d="M-30,-6 C-20,6 -12,18 -6,32" w={2.1} tono={ARTERIA_FINA} cap="round" />
      {/* Brillo húmedo */}
      <ellipse cx={-14} cy={6} rx={26} ry={15} fill="url(#an-brillo)" transform="rotate(38 -14 6)" />
      <ellipse cx={42} cy={8} rx={12} ry={20} fill="url(#an-brillo)" opacity={0.6} transform="rotate(-10 42 8)" />
    </g>
  );
});

// ─── Cerebro: vista lateral ───────────────────────────────────────────────────

const SURCOS = [
  'M-30,-76 C-22,-64 -36,-58 -28,-48 C-22,-40 -34,-34 -26,-24', 'M-56,-58 C-46,-52 -54,-44 -44,-38 C-36,-32 -50,-26 -42,-16',
  'M-72,-32 C-62,-32 -66,-22 -58,-18', 'M-10,-74 C-2,-66 -16,-56 -8,-48 C-2,-40 -14,-32 -8,-22', 'M-76,-8 C-66,-14 -60,-4 -50,-8',
  'M30,-76 C24,-64 36,-58 28,-46 C22,-38 34,-30 26,-20', 'M50,-62 C42,-52 54,-46 46,-34 C40,-26 50,-18 44,-10',
  'M68,-38 C60,-32 68,-22 60,-14 C56,-8 64,0 56,6', 'M-44,-74 C-38,-66 -46,-62 -40,-54', 'M-66,-46 C-58,-46 -60,-38 -54,-34',
  'M-46,21 C-30,15 -16,19 -2,11 C8,7 18,9 30,3', 'M-42,33 C-26,27 -14,33 -2,25 C6,21 14,23 22,19',
  'M72,2 C62,8 54,4 46,12 C42,18 36,16 30,22', 'M-20,-16 C-28,-10 -36,-16 -44,-8', 'M36,-8 C28,-2 20,-10 12,-2', 'M58,16 C50,22 44,18 38,24',
  'M16,-68 C12,-60 20,-54 15,-46', 'M-36,-2 C-30,-4 -26,-8 -20,-4',
  'M-18,-70 C-22,-62 -16,-58 -20,-52', 'M-62,-24 C-54,-28 -50,-20 -44,-22', 'M-52,-6 C-46,-12 -40,-6 -34,-10', 'M-18,-38 C-12,-34 -14,-28 -8,-30',
  'M40,-70 C36,-62 42,-56 38,-50', 'M58,-48 C54,-42 60,-38 56,-30', 'M38,-34 C32,-30 36,-24 30,-22', 'M72,-16 C66,-14 70,-6 64,-2',
  'M18,-36 C24,-32 20,-26 24,-22', 'M-28,-58 C-34,-54 -30,-48 -36,-44', 'M50,2 C44,0 42,6 36,4', 'M-24,26 C-18,22 -12,26 -6,22', 'M-34,38 C-28,36 -24,40 -18,36', 'M6,-30 C0,-26 2,-20 -4,-18',
];

const Cerebro = memo(function Cerebro() {
  return (
    <g transform="translate(2,-6) scale(0.98)">
      {/* Tronco encefálico */}
      <path d="M-6,36 C-10,46 -8,56 1,63 C2,75 5,88 8,102 L20,102 C20,88 22,74 26,61 C30,50 28,40 22,32 Z" fill="url(#an-tronco)" stroke="#A67A74" strokeWidth={1} />
      <Lineas d="M-4,52 C4,56 16,56 26,50 M1,62 C8,65 18,65 25,60 M8,74 L10,100 M16,74 L15,100" c="#A67A74" w={1} o={0.7} />
      {/* Cerebelo */}
      <path d={CONTORNO.cerebelo} fill="url(#an-cerebelo)" />
      <g clipPath="url(#an-c-cerebelo)">
        {Array.from({ length: 10 }, (_, i) => <Lineas key={i} d={`M12,${28 + i * 4.2} C32,${22 + i * 5} 58,${24 + i * 5} 80,${34 + i * 3.4}`} c="#7E4A52" w={1.15} o={0.8} />)}
        {Array.from({ length: 10 }, (_, i) => <Lineas key={i} d={`M12,${29.3 + i * 4.2} C32,${23.3 + i * 5} 58,${25.3 + i * 5} 80,${35.3 + i * 3.4}`} c="#F4CFC4" w={0.6} o={0.55} />)}
      </g>
      {/* Hemisferio */}
      <path d={CONTORNO.cerebro} fill="url(#an-cortex)" stroke="#A9686E" strokeWidth={1.2} />
      <g clipPath="url(#an-c-cerebro)">
        {/* Volumen de cada circunvolución: una banda clara al lado de cada surco */}
        {SURCOS.map((d, i) => <Lineas key={`l${i}`} d={d} c="#F8E2D8" w={3.6} o={0.5} />)}
        {SURCOS.map((d, i) => <g key={i} transform="translate(0.9,0.9)"><Lineas d={d} c="#8E4E56" w={1.8} /></g>)}
        {/* Cisura lateral y surco central, más hondos */}
        <g transform="translate(0.9,0.9)"><Lineas d="M-62,7 C-38,-1 -10,-5 16,-13 C22,-15 28,-13 36,-19" c="#6E3640" w={3.4} /></g>
        <g transform="translate(0.9,0.9)"><Lineas d="M10,-80 C6,-62 16,-52 8,-40 C2,-30 8,-22 2,-10" c="#6E3640" w={2.8} /></g>
        <Lineas d="M-62,5 C-38,-3 -10,-7 16,-15 C22,-17 28,-15 36,-21" c="#F8E2D8" w={1.4} o={0.65} />
        {/* Arterias de la superficie */}
        <Lineas d="M-30,10 C-16,4 2,-2 14,-10 C24,-22 22,-40 30,-54 M14,-10 C22,-6 34,-6 46,2 M-6,0 C-10,-16 -18,-28 -14,-46" c="#B8505A" w={1.05} o={0.65} />
        <path d={CONTORNO.cerebro} fill="url(#an-sombra)" opacity={0.75} />
      </g>
      <ellipse cx={-30} cy={-46} rx={30} ry={18} fill="url(#an-brillo)" opacity={0.75} transform="rotate(-25 -30 -46)" />
    </g>
  );
});

/** El cerebro de frente, para el cuerpo (de frente el perfil no encaja). */
export const CerebroFrontal = memo(function CerebroFrontal() {
  const lado = (
    <g>
      <path d="M-2,-70 C-30,-76 -68,-54 -74,-14 C-78,14 -64,42 -40,48 C-24,52 -12,44 -2,34 Z" fill="url(#an-cortex)" stroke="#A9686E" strokeWidth={1.4} />
      <Lineas d="M-12,-66 C-22,-56 -8,-48 -18,-38 C-26,-30 -12,-22 -22,-12 M-36,-62 C-30,-52 -42,-46 -34,-36 C-28,-28 -42,-22 -34,-12 M-58,-44 C-50,-38 -60,-30 -52,-22 C-46,-16 -58,-10 -50,-2 M-68,-12 C-58,-8 -66,2 -58,8 M-14,0 C-24,6 -14,14 -24,20 M-40,4 C-32,10 -44,16 -36,24 M-58,18 C-50,22 -56,30 -46,34 M-16,28 C-22,32 -18,38 -26,40" c="#8E4E56" w={2.2} />
    </g>
  );
  return (
    <g>
      {lado}
      <g transform="scale(-1,1)">{lado}</g>
      <path d="M-12,34 C-8,48 -8,62 -7,84 L7,84 C8,62 8,48 12,34 Z" fill="url(#an-tronco)" stroke="#A67A74" strokeWidth={1} />
      <ellipse cx={-30} cy={-38} rx={26} ry={18} fill="url(#an-brillo)" opacity={0.6} />
    </g>
  );
});

// ─── Riñón: corte coronal ─────────────────────────────────────────────────────

const C_SINUS = { x: 14, y: 2 };
const PIRAMIDES = [-142, -112, -82, -180, 142, 112, 82].map((a) => {
  const r = (a * Math.PI) / 180;
  const u = [Math.cos(r), Math.sin(r)], n = [-u[1], u[0]];
  const base = Math.abs(Math.abs(a) - 90) < 12 ? 66 : 62, apice = 28;
  const P = (dist: number, lado: number) => `${(C_SINUS.x + u[0] * dist + n[0] * lado).toFixed(1)},${(C_SINUS.y + u[1] * dist + n[1] * lado).toFixed(1)}`;
  return {
    d: `M${P(apice, 0)} L${P(base, -15)} Q${P(base + 6, 0)} ${P(base, 15)} Z`,
    rayas: [-9, -3.5, 3.5, 9].map((l) => `M${P(apice + 7, l * 0.25)} L${P(base - 2, l)}`).join(' '),
    papila: P(apice, 0),
  };
});

export const Rinon = memo(function Rinon() {
  return (
    <g transform="translate(-6,-2)">
      <path d={CONTORNO.rinon} fill="url(#an-corteza)" stroke="#6B2E2E" strokeWidth={1.4} />
      <g clipPath="url(#an-c-rinon)">
        {/* Punteado de la corteza (glomérulos) */}
        {Array.from({ length: 70 }, (_, i) => {
          const a = i * 2.39996, r = 58 + ((i * 13) % 20);
          return <circle key={i} cx={C_SINUS.x - 6 + Math.cos(a) * r} cy={C_SINUS.y + Math.sin(a) * r * 1.2} r={0.9} fill="#F0B8A4" opacity={0.65} />;
        })}
        {PIRAMIDES.map((p, i) => (
          <g key={i}>
            <path d={p.d} fill="url(#an-piramide)" stroke="#5E2425" strokeWidth={0.8} />
            <Lineas d={p.rayas} c="#D98E7C" w={0.75} o={0.75} />
          </g>
        ))}
        {/* Arterias interlobares, entre las pirámides */}
        <Lineas d="M14,-6 C-2,-22 -14,-34 -26,-48 M14,-4 C-8,-10 -26,-18 -44,-26 M14,4 C-8,10 -26,18 -44,28 M14,8 C-2,24 -12,38 -24,52 M14,-10 C10,-30 6,-46 0,-66 M14,12 C10,32 6,50 0,68" c="#D85A4E" w={1.5} />
        {/* Seno renal: cálices y pelvis */}
        {PIRAMIDES.map((p, i) => <Lineas key={i} d={`M28,4 L${p.papila}`} c="#E9CC98" w={7.5} />)}
        {PIRAMIDES.map((p, i) => <Lineas key={i} d={`M28,4 L${p.papila}`} c="#F6E5C4" w={4} />)}
        <path d={CONTORNO.sinus} fill="url(#an-sinus)" opacity={0.55} />
      </g>
      {/* Pelvis y uréter */}
      <path d="M6,-8 C16,-14 28,-8 36,4 C42,14 45,20 46,30 L38,32 C36,22 30,18 20,14 C10,12 2,0 6,-8 Z" fill="url(#an-sinus)" stroke="#BE9A64" strokeWidth={0.9} />
      <Tubo d="M42,28 C46,50 42,74 46,102" w={7.5} tono={['#BE9A64', '#E8CD9C', '#FBF0D8']} />
      {/* Vena y arteria renales, en el hilio */}
      <Tubo d="M18,-2 C42,-4 66,-8 98,-8" w={12} tono={VENA} />
      <Corte x={98} y={-8} rx={3} ry={6} tono={VENA} />
      <Tubo d="M14,-20 C38,-24 66,-30 98,-32" w={9} tono={ARTERIA} />
      <Corte x={98} y={-32} rx={2.3} ry={4.5} tono={ARTERIA} />
      <ellipse cx={-40} cy={-40} rx={16} ry={26} fill="url(#an-brillo)" opacity={0.42} transform="rotate(24 -40 -40)" />
    </g>
  );
});

// ─── Pulmones, tráquea y árbol bronquial ──────────────────────────────────────

/** Bronquios: bifurcaciones fijas (determinista), en trazo cada vez más fino. */
function ramas(x: number, y: number, ang: number, largo: number, nivel: number, sale: string[][]): void {
  if (nivel > 4) return;
  const a = (ang * Math.PI) / 180;
  const x1 = x + Math.sin(a) * largo, y1 = y + Math.cos(a) * largo;
  (sale[nivel] ??= []).push(`M${x.toFixed(1)},${y.toFixed(1)} L${x1.toFixed(1)},${y1.toFixed(1)}`);
  const abre = 24 + nivel * 3;
  ramas(x1, y1, ang - abre, largo * 0.74, nivel + 1, sale);
  ramas(x1, y1, ang + abre, largo * 0.74, nivel + 1, sale);
}
const arbol = (x: number, y: number, ang: number, largo: number) => { const s: string[][] = []; ramas(x, y, ang, largo, 0, s); return s.map((n) => n.join(' ')); };
const BRONQUIOS_D = arbol(-32, -16, -16, 24);
const BRONQUIOS_D2 = arbol(-30, -14, -52, 18);
const BRONQUIOS_D3 = arbol(-30, -18, -142, 16);
const BRONQUIOS_I = arbol(32, -16, 12, 22);
const BRONQUIOS_I2 = arbol(30, -14, 52, 15);
const BRONQUIOS_I3 = arbol(30, -18, 146, 16);
const ANCHO_BRONQUIO = [3.4, 2.4, 1.7, 1.2, 0.85];

const MOTEADO = Array.from({ length: 90 }, (_, i) => {
  const a = i * 2.39996, r = Math.sqrt((i + 0.5) / 90) * 66;
  return { x: Math.cos(a) * r * 0.62, y: Math.sin(a) * r * 1.25 + 8, r: 0.8 + ((i * 7) % 5) * 0.28 };
});

export const Pulmones = memo(function Pulmones() {
  const superficie = (id: string, cx: number) => (
    <g clipPath={`url(#${id})`}>
      {MOTEADO.map((m, i) => <circle key={i} cx={cx + m.x} cy={m.y} r={m.r} fill="#8E4E54" opacity={0.2} />)}
    </g>
  );
  const arbolDe = (ns: string[], k: string) => ns.map((d, i) => <Lineas key={`${k}${i}`} d={d} c="#F9E7DC" w={ANCHO_BRONQUIO[i]} o={0.9} />);
  return (
    <g transform="translate(0,4) scale(0.96)">
      <path d={CONTORNO.pulmonD} fill="url(#an-pulmon)" stroke="#9C5A5E" strokeWidth={1.2} />
      <path d={CONTORNO.pulmonI} fill="url(#an-pulmon)" stroke="#9C5A5E" strokeWidth={1.2} />
      {superficie('an-c-pulmond', -46)}
      {superficie('an-c-pulmoni', 50)}
      <g clipPath="url(#an-c-pulmond)">
        {arbolDe(BRONQUIOS_D, 'a')}{arbolDe(BRONQUIOS_D2, 'b')}{arbolDe(BRONQUIOS_D3, 'e')}
        {/* Cisuras: la horizontal y la oblicua del pulmón derecho */}
        <Lineas d="M-9,-8 C-30,-6 -52,-2 -76,10" c="#7E4048" w={1.6} />
        <Lineas d="M-76,14 C-58,28 -36,48 -18,70" c="#7E4048" w={1.9} />
        <path d={CONTORNO.pulmonD} fill="url(#an-sombra)" opacity={0.62} />
      </g>
      <g clipPath="url(#an-c-pulmoni)">
        {arbolDe(BRONQUIOS_I, 'c')}{arbolDe(BRONQUIOS_I2, 'd')}{arbolDe(BRONQUIOS_I3, 'f')}
        {/* Cisura oblicua del izquierdo */}
        <Lineas d="M72,-6 C58,14 46,40 40,70" c="#7E4048" w={1.9} />
        <path d={CONTORNO.pulmonI} fill="url(#an-sombra)" opacity={0.62} />
      </g>
      {/* Tráquea con sus anillos y bronquios principales */}
      <path d="M-8,-104 L8,-104 L8,-54 C14,-46 24,-34 35,-21 L31,-15 C20,-27 10,-37 0,-44 C-10,-37 -22,-26 -33,-13 L-37,-19 C-26,-33 -14,-46 -8,-54 Z" fill="#EEDFCF" stroke="#A58F7C" strokeWidth={1} />
      {Array.from({ length: 11 }, (_, i) => <Lineas key={i} d={`M-8,${-100 + i * 5} Q0,${-97 + i * 5} 8,${-100 + i * 5}`} c="#A58F7C" w={1.5} />)}
      <Lineas d="M-3,-103 L-3,-54" c="#FFF" w={2.2} o={0.5} />
      <ellipse cx={-48} cy={-28} rx={13} ry={24} fill="url(#an-brillo)" opacity={0.7} transform="rotate(18 -48 -28)" />
      <ellipse cx={46} cy={-30} rx={10} ry={22} fill="url(#an-brillo)" opacity={0.55} transform="rotate(-18 46 -30)" />
    </g>
  );
});

// ─── Articulación: rodilla en corte ───────────────────────────────────────────

export const Articulacion = memo(function Articulacion() {
  return (
    <g>
      {/* Peroné */}
      <path d="M44,38 C52,35 60,42 57,51 L49,100 L39,100 L42,52 C40,46 40,41 44,38 Z" fill="url(#an-hueso)" stroke="#AD9670" strokeWidth={1} />
      {/* Cápsula sinovial, por detrás de los huesos */}
      <path d="M-36,-54 C-78,-38 -84,36 -32,54 L32,54 C84,36 78,-38 36,-54 Z" fill="url(#an-capsula)" stroke="#C8605E" strokeWidth={1.5} strokeOpacity={0.7} />
      {/* Fémur y tibia */}
      <path d={CONTORNO.femur} fill="url(#an-hueso)" stroke="#AD9670" strokeWidth={1.2} />
      <path d={CONTORNO.tibia} fill="url(#an-hueso)" stroke="#AD9670" strokeWidth={1.2} />
      <g clipPath="url(#an-c-femur)">
        {/* Hueso esponjoso (trabéculas) y canal medular */}
        {Array.from({ length: 14 }, (_, i) => <Lineas key={i} d={`M${-48 + i * 7},2 C${-40 + i * 6},-18 ${-14 + i * 2},-34 ${-9 + i * 1.4},-60`} c="#BFA87F" w={0.75} o={0.7} />)}
        <path d="M-10,-100 L10,-100 L8,-58 C4,-52 -4,-52 -8,-58 Z" fill="#E4C795" />
      </g>
      <g clipPath="url(#an-c-tibia)">
        {Array.from({ length: 14 }, (_, i) => <Lineas key={i} d={`M${-48 + i * 7},12 C${-40 + i * 6},30 ${-14 + i * 2},42 ${-9 + i * 1.4},64`} c="#BFA87F" w={0.75} o={0.7} />)}
        <path d="M-10,100 L10,100 L8,64 C4,58 -4,58 -8,64 Z" fill="#E4C795" />
      </g>
      {/* Cartílago articular */}
      <path d="M-50,-14 C-55,-2 -47,4 -38,4 C-26,4 -16,-3 -6,-9 Q0,-5 6,-9 C16,-3 26,4 38,4 C47,4 55,-2 50,-14 C50,-5 44,-1 38,-1 C26,-1 16,-8 6,-14 Q0,-10 -6,-14 C-16,-8 -26,-1 -38,-1 C-44,-1 -50,-5 -50,-14 Z" fill="url(#an-cartilago)" stroke="#8FB2BE" strokeWidth={0.7} />
      <path d="M-45,16 C-30,10 -14,12 -4,14 Q0,10 4,14 C14,12 30,10 45,16 C47,18 47,20 46,22 C30,16 14,17 4,19 Q0,16 -4,19 C-14,17 -30,16 -46,22 C-47,20 -47,18 -45,16 Z" fill="url(#an-cartilago)" stroke="#8FB2BE" strokeWidth={0.7} />
      {/* Meniscos y ligamentos cruzados */}
      <path d="M-53,8 C-42,4 -30,6 -20,10 C-30,12 -42,14 -51,18 C-55,15 -55,11 -53,8 Z" fill="#E9DDC4" stroke="#B5A482" strokeWidth={0.8} />
      <path d="M53,8 C42,4 30,6 20,10 C30,12 42,14 51,18 C55,15 55,11 53,8 Z" fill="#E9DDC4" stroke="#B5A482" strokeWidth={0.8} />
      <Lineas d="M-5,-10 L6,14" c="#D7B69A" w={3.4} />
      <Lineas d="M6,-10 L-5,14" c="#C49C80" w={3.4} />
      {/* Ligamentos colaterales */}
      <Lineas d="M-55,-26 C-60,-6 -58,18 -46,44" c="#DCC6A6" w={4.2} />
      <Lineas d="M55,-26 C60,-6 62,12 54,38" c="#DCC6A6" w={3.6} />
      <Lineas d="M-55,-26 C-60,-6 -58,18 -46,44" c="#F7EAD2" w={1.4} o={0.8} />
      <Lineas d="M55,-26 C60,-6 62,12 54,38" c="#F7EAD2" w={1.2} o={0.8} />
    </g>
  );
});

// ─── Sangre: la luz de un vaso por dentro ─────────────────────────────────────

export function Globulo({ x, y, r, rot, ky = 0.8 }: { x: number; y: number; r: number; rot: number; ky?: number }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(1,${ky})`}>
      <circle r={r} fill="url(#an-hematie)" stroke="#7E1E22" strokeWidth={0.6} />
      <path d={`M${-r * 0.74},${-r * 0.34} A${r * 0.82},${r * 0.82} 0 0 1 ${r * 0.28},${-r * 0.76}`} fill="none" stroke="#F4A99A" strokeWidth={r * 0.13} strokeLinecap="round" opacity={0.75} />
    </g>
  );
}

const GLOBULOS: [number, number, number, number, number][] = [
  [-44, -44, 23, -18, 0.78], [10, -60, 21, 30, 0.72], [58, -28, 22, 62, 0.8], [-66, 14, 20, 70, 0.68],
  [-22, 4, 25, 10, 0.86], [54, 34, 21, -24, 0.78], [-34, 58, 21, 30, 0.74], [22, 66, 19, 8, 0.66],
];

const Sangre = memo(function Sangre() {
  return (
    <g>
      <circle r={92} fill="#8C4A42" />
      <circle r={88} fill="url(#an-plasma)" />
      <g clipPath="url(#an-c-gota)">
        {GLOBULOS.map(([x, y, r, a, k], i) => <Globulo key={i} x={x} y={y} r={r} rot={a} ky={k} />)}
        {/* Leucocito con núcleo lobulado */}
        <circle cx={26} cy={-6} r={25} fill="url(#an-leuco)" stroke="#A796BA" strokeWidth={1} />
        {Array.from({ length: 16 }, (_, i) => { const a = i * 2.39996, r = 8 + (i % 4) * 4; return <circle key={i} cx={26 + Math.cos(a) * r * 1.2} cy={-6 + Math.sin(a) * r * 1.2} r={0.9} fill="#B7A5CC" />; })}
        <path d="M14,-14 C20,-22 30,-18 28,-10 C36,-14 42,-4 34,1 C40,8 28,14 24,6 C18,12 8,6 14,-1 C8,-4 8,-12 14,-14 Z" fill="url(#an-nucleo-leuco)" />
        {/* Plaquetas */}
        {[[-8, -24], [-58, -14], [40, -52], [-6, 44], [64, 8]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y}) rotate(${i * 50})`}>
            <path d="M-6,-1 C-4,-5 3,-5 6,-2 C7,1 3,5 -1,4 C-4,4 -7,2 -6,-1 Z" fill="#E0C07A" stroke="#B3924C" strokeWidth={0.6} />
            <circle cx={-1} cy={0} r={1} fill="#9E7C3E" /><circle cx={2.4} cy={0.8} r={0.8} fill="#9E7C3E" />
          </g>
        ))}
        <ellipse cx={-34} cy={-50} rx={46} ry={24} fill="url(#an-brillo)" opacity={0.3} transform="rotate(-30 -34 -50)" />
        <circle r={88} fill="url(#an-sombra)" opacity={0.75} />
      </g>
    </g>
  );
});

// ─── Registro ─────────────────────────────────────────────────────────────────

const PIEZAS = { corazon: Corazon, cerebro: Cerebro, rinon: Rinon, pulmon: Pulmones, articulacion: Articulacion, sangre: Sangre } as const;
export type PiezaAnatomica = keyof typeof PIEZAS;
export const esPieza = (i: string): i is PiezaAnatomica => i in PIEZAS;

/** Un órgano en la caja de 100 × 100 de los iconos. */
export function Organo({ i }: { i: PiezaAnatomica }): ReactNode {
  const P = PIEZAS[i];
  return <g transform="scale(0.5)"><P /></g>;
}
