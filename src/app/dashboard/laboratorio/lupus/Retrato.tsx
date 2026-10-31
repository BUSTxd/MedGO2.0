'use client';
// La persona del laboratorio «Lupus»: un retrato de frente con estructura real
// (tercios de la cara, ojos a media cabeza, un ojo de ancho entre los dos ojos) y
// el volumen hecho con degradados recortados a la cara, como los órganos de
// `Anatomia.tsx`: sin `filter`, que se recalcularía en cada fotograma.
//
// Coordenadas: x = 0 en el eje de la cara, y las del lienzo (barbilla en y = 760).
// La mitad izquierda se dibuja y se refleja; la luz, que viene de arriba a la
// izquierda, rompe la simetría encima.

import { memo } from 'react';

export type Tez = { piel: [string, string, string]; pelo: [string, string, string]; iris: [string, string]; labio: [string, string]; ropa: [string, string] };
export type Peinado = 'largo' | 'corto' | 'recogido';

const TEZ_BASE: Tez = {
  piel: ['#F4D6BF', '#E7B99B', '#C48D70'], pelo: ['#54392C', '#33221B', '#1E1410'], iris: ['#8A5A36', '#3F2615'], labio: ['#CE8F86', '#B06E67'], ropa: ['#C5D2DC', '#8FA3B3'],
};

const CARA = 'M0,262 C90,262 155,330 160,440 C164,500 158,560 138,620 C122,668 75,738 40,755 C20,765 -20,765 -40,755 C-75,738 -122,668 -138,620 C-158,560 -164,500 -160,440 C-155,330 -90,262 0,262 Z';
const OJO = 'M-116,488 C-100,466 -66,460 -38,490 C-58,504 -96,506 -116,488 Z';
/** La cabeza se aprieta un poco a lo alto respecto a los ojos (la cara quedaba larga). */
const CABEZA = 'translate(0,486) scale(1,0.92) translate(0,-486)';
const CUELLO = 'M-62,690 L-68,790 C-78,824 -128,838 -176,858 C-214,874 -238,916 -246,990 L246,990 C238,916 214,874 176,858 C128,838 78,824 68,790 L62,690 Z';

/** Contorno a lápiz con el que entra el retrato (se dibuja con `k`). */
export const TRAZOS_RETRATO = [
  'M-160,440 C-164,500 -158,560 -138,620 C-122,668 -75,738 -40,755 C-20,765 20,765 40,755 C75,738 122,668 138,620 C158,560 164,500 160,440', OJO,
  'M-132,446 C-110,420 -70,416 -34,436',
  'M-14,470 C-16,520 -24,552 -36,592 C-30,604 -14,606 0,606 C14,606 30,604 36,592',
  'M-46,660 C-30,651 -16,644 -7,645 Q0,649 7,645 C16,644 30,651 46,660 C34,678 16,686 0,686 C-16,686 -34,678 -46,660 Z',
  'M-62,700 L-68,790 C-78,824 -128,838 -176,858', 'M62,700 L68,790 C78,824 128,838 176,858',
  'M0,206 C-90,206 -180,270 -186,420 C-192,560 -196,680 -190,800', 'M0,206 C90,206 180,270 186,420 C192,560 196,680 190,800',
  OJO.replace(/-(\d)/g, '$1'),
  'M132,446 C110,420 70,416 34,436',
];

function Defs({ id, tez }: { id: string; tez: Tez }) {
  const { piel, pelo, iris, labio, ropa } = tez;
  return (
    <defs>
      <linearGradient id={`${id}-piel`} x1="0" x2="1" y1="0" y2="0.35">
        <stop offset="0" stopColor={piel[1]} /><stop offset="0.34" stopColor={piel[0]} /><stop offset="0.68" stopColor={piel[1]} /><stop offset="1" stopColor={piel[2]} />
      </linearGradient>
      <linearGradient id={`${id}-cuello`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor={piel[1]} /><stop offset="0.45" stopColor={piel[1]} /><stop offset="1" stopColor={piel[2]} />
      </linearGradient>
      {/* Contorno de la cara: gira y se oscurece hacia los bordes */}
      <radialGradient id={`${id}-borde`} cx="0.45" cy="0.42" r="0.62">
        <stop offset="0.62" stopColor={piel[2]} stopOpacity="0" /><stop offset="1" stopColor={piel[2]} stopOpacity="0.85" />
      </radialGradient>
      <linearGradient id={`${id}-frente`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#3A2016" stopOpacity="0.5" /><stop offset="1" stopColor="#3A2016" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${id}-sombra`}>
        <stop offset="0" stopColor="#6E3A28" stopOpacity="0.5" /><stop offset="1" stopColor="#6E3A28" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-luz`}>
        <stop offset="0" stopColor="#FFF4E8" stopOpacity="0.75" /><stop offset="1" stopColor="#FFF4E8" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-rubor`}>
        <stop offset="0" stopColor="#D9786E" stopOpacity="0.17" /><stop offset="1" stopColor="#D9786E" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-pelo`} x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor={pelo[0]} /><stop offset="0.5" stopColor={pelo[1]} /><stop offset="1" stopColor={pelo[2]} />
      </linearGradient>
      <radialGradient id={`${id}-iris`}>
        <stop offset="0.25" stopColor={iris[0]} /><stop offset="1" stopColor={iris[1]} />
      </radialGradient>
      <linearGradient id={`${id}-labio`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor={labio[0]} /><stop offset="1" stopColor={labio[1]} />
      </linearGradient>
      {/* La ropa y los hombros se funden abajo: un busto, no un corte recto. */}
      <linearGradient id={`${id}-ropa`} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="830" y2="980">
        <stop offset="0" stopColor={ropa[0]} /><stop offset="0.55" stopColor={ropa[1]} /><stop offset="1" stopColor={ropa[1]} stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${id}-hombro`} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="700" y2="980">
        <stop offset="0" stopColor="#fff" /><stop offset="0.82" stopColor="#fff" /><stop offset="1" stopColor="#000" />
      </linearGradient>
      {/* Sobre otro cuerpo, el cuello se funde con él en vez de acabar en una línea. */}
      <linearGradient id={`${id}-cuello-funde`} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="730" y2="825">
        <stop offset="0" stopColor={piel[1]} /><stop offset="1" stopColor={piel[1]} stopOpacity="0" />
      </linearGradient>
      <mask id={`${id}-funde`}><rect x={-300} y={200} width={600} height={800} fill={`url(#${id}-hombro)`} /></mask>
      <clipPath id={`${id}-c-cara`}><path d={CARA} /></clipPath>
      <clipPath id={`${id}-c-ojo`}><path d={OJO} /></clipPath>
      <clipPath id={`${id}-c-cuello`}><path d={CUELLO} /></clipPath>
    </defs>
  );
}

/** Lo que va igual a los dos lados de la cara. */
function Mitad({ id }: { id: string }) {
  return (
    <g>
      {/* Órbita y párpado */}
      <ellipse cx={-76} cy={470} rx={64} ry={36} fill={`url(#${id}-sombra)`} opacity={0.62} />
      <ellipse cx={-30} cy={474} rx={18} ry={34} fill={`url(#${id}-sombra)`} opacity={0.5} />
      <path d={OJO} fill="#F6F0EA" />
      <g clipPath={`url(#${id}-c-ojo)`}>
        <circle cx={-76} cy={484} r={18} fill={`url(#${id}-iris)`} />
        <circle cx={-76} cy={484} r={18} fill="none" stroke="#2A170D" strokeWidth={1.6} opacity={0.75} />
        <circle cx={-76} cy={484} r={7.6} fill="#120A06" />
        {/* Sombra del párpado sobre el ojo */}
        <path d="M-120,470 L-34,470 L-34,484 C-60,472 -96,472 -120,490 Z" fill="#4A2A1C" opacity={0.3} />
      </g>
      <circle cx={-82} cy={478} r={3.6} fill="#FFF" opacity={0.92} />
      <circle cx={-70} cy={490} r={1.6} fill="#FFF" opacity={0.5} />
      <circle cx={-41} cy={490} r={2.2} fill="#D9958C" opacity={0.8} />
      {/* Línea de pestañas (más gruesa fuera) y pliegue */}
      <path d="M-122,491 C-104,461 -64,453 -36,491 C-62,468 -98,470 -116,489 L-128,484 Z" fill="#23140E" />
      <path d="M-116,466 C-96,448 -64,444 -44,464" fill="none" stroke="#8A5A44" strokeWidth={2.2} strokeLinecap="round" opacity={0.6} />
      <path d="M-112,497 C-92,511 -60,509 -41,495" fill="none" stroke="#9E6650" strokeWidth={1.5} strokeLinecap="round" opacity={0.55} />
      {/* Ceja */}
      <path d="M-132,450 C-112,428 -72,422 -36,438 C-35,442 -36,445 -39,445 C-72,434 -106,438 -128,455 Z" fill="#4A3024" opacity={0.74} />
      {/* Ala de la nariz y orificio */}
      <path d="M-33,596 C-40,586 -36,572 -26,570" fill="none" stroke="#A36F56" strokeWidth={1.8} strokeLinecap="round" opacity={0.26} />
      <path d="M-22,602 C-16,596 -8,598 -6,604 C-11,607 -18,607 -22,602 Z" fill="#5E3324" opacity={0.62} />
      {/* Surco nasogeniano: el eritema malar lo respeta */}
      <path d="M-38,606 C-50,622 -56,636 -59,650" fill="none" stroke="#A36F56" strokeWidth={2.4} strokeLinecap="round" opacity={0.2} />
    </g>
  );
}

function PeloDetras({ id, peinado }: { id: string; peinado: Peinado }) {
  if (peinado === 'recogido') return <circle cx={0} cy={196} r={70} fill={`url(#${id}-pelo)`} />;
  if (peinado === 'corto') return <path d="M-178,350 C-196,460 -198,600 -170,690 C-150,720 -110,716 -90,690 L90,690 C110,716 150,720 170,690 C198,600 196,460 178,350 C150,240 70,200 0,200 C-70,200 -150,240 -178,350 Z" fill={`url(#${id}-pelo)`} />;
  return <path d="M-178,340 C-204,460 -212,640 -196,810 C-190,846 -172,876 -152,858 C-142,872 -120,866 -108,850 L108,850 C120,866 142,872 152,858 C172,876 190,846 196,810 C212,640 204,460 178,340 C150,240 70,200 0,200 C-70,200 -150,240 -178,340 Z" fill={`url(#${id}-pelo)`} />;
}

function PeloDelante({ id, peinado }: { id: string; peinado: Peinado }) {
  const mechones = [
    'M-8,214 C-70,222 -140,276 -160,392', 'M-14,226 C-70,240 -126,292 -150,410', 'M-20,250 C-70,262 -120,316 -146,410',
    'M8,214 C70,222 140,276 160,392', 'M14,226 C70,240 126,292 150,410', 'M20,250 C70,262 120,316 146,410',
  ];
  const lados = peinado === 'recogido'
    ? 'M0,204 C-80,202 -160,256 -168,380 C-172,410 -170,430 -164,452 C-156,400 -96,306 0,286 C96,306 156,400 164,452 C170,430 172,410 168,380 C160,256 80,202 0,204 Z'
    : 'M0,204 C-86,202 -170,256 -180,380 C-188,460 -186,560 -170,640 C-164,580 -164,500 -158,444 C-150,384 -92,302 0,286 C92,302 150,384 158,444 C164,500 164,580 170,640 C186,560 188,460 180,380 C170,256 86,202 0,204 Z';
  return (
    <g>
      <path d={lados} fill={`url(#${id}-pelo)`} />
      <path d="M0,206 L0,286" stroke="#150D09" strokeWidth={2} opacity={0.55} />
      {mechones.map((d, i) => <path key={i} d={d} fill="none" stroke={i % 3 === 0 ? '#8A6450' : '#6E4C3A'} strokeWidth={i % 3 === 0 ? 3 : 2} strokeLinecap="round" opacity={0.45} />)}
      {peinado === 'largo' && [
        'M-176,470 C-186,580 -190,680 -182,790', 'M-168,520 C-176,620 -180,700 -170,810', 'M176,470 C186,580 190,680 182,790', 'M168,520 C176,620 180,700 170,810',
      ].map((d, i) => <path key={i} d={d} fill="none" stroke="#6E4C3A" strokeWidth={2.4} strokeLinecap="round" opacity={0.42} />)}
      <ellipse cx={-92} cy={272} rx={52} ry={18} fill={`url(#${id}-luz)`} opacity={0.34} transform="rotate(-32 -92 272)" />
    </g>
  );
}

type Props = { id?: string; tez?: Tez; peinado?: Peinado; soloCabeza?: boolean };

/** El retrato completo (x = 0 en el eje de la cara). */
export const Retrato = memo(function Retrato({ id = 'rt', tez = TEZ_BASE, peinado = 'largo', soloCabeza = false }: Props) {
  return (
    <g>
      <Defs id={id} tez={tez} />
      <g transform={CABEZA}><PeloDetras id={id} peinado={peinado} /></g>
      {soloCabeza ? (
        <g>
          <path d="M-62,690 L-68,830 L68,830 L62,690 Z" fill={`url(#${id}-cuello-funde)`} />
          <ellipse cx={8} cy={742} rx={80} ry={56} fill={`url(#${id}-sombra)`} opacity={0.95} />
        </g>
      ) : (
      <g mask={`url(#${id}-funde)`}>
        <path d={CUELLO} fill={`url(#${id}-cuello)`} />
        <g clipPath={`url(#${id}-c-cuello)`}>
          {/* Sombra de la barbilla sobre el cuello */}
          <ellipse cx={8} cy={742} rx={92} ry={60} fill={`url(#${id}-sombra)`} opacity={0.95} />
          <path d="M-22,862 C-52,850 -84,850 -106,856 M22,862 C52,850 84,850 106,856" fill="none" stroke="#A36F56" strokeWidth={3} strokeLinecap="round" opacity={0.42} />
          <ellipse cx={0} cy={872} rx={13} ry={10} fill={`url(#${id}-sombra)`} opacity={0.8} />
          {/* Blusa de cuello en V */}
          <path d="M-250,850 L-112,834 C-88,886 -34,924 0,946 C34,924 88,886 112,834 L250,850 L250,990 L-250,990 Z" fill={`url(#${id}-ropa)`} />
          <path d="M-112,834 C-88,886 -34,924 0,946 C34,924 88,886 112,834" fill="none" stroke="#6E8496" strokeWidth={2.4} opacity={0.5} />
        </g>
      </g>
      )}
      {/* Cara */}
      <g transform={CABEZA}>
      <path d={CARA} fill={`url(#${id}-piel)`} />
      <g clipPath={`url(#${id}-c-cara)`}>
        <path d={CARA} fill={`url(#${id}-borde)`} />
        <rect x={-170} y={250} width={340} height={130} fill={`url(#${id}-frente)`} />
        <ellipse cx={-28} cy={378} rx={92} ry={50} fill={`url(#${id}-luz)`} opacity={0.62} />
        <ellipse cx={-98} cy={562} rx={44} ry={38} fill={`url(#${id}-rubor)`} />
        <ellipse cx={98} cy={562} rx={44} ry={38} fill={`url(#${id}-rubor)`} />
        <ellipse cx={-106} cy={534} rx={40} ry={22} fill={`url(#${id}-luz)`} opacity={0.55} transform="rotate(-22 -106 534)" />
        <ellipse cx={100} cy={534} rx={30} ry={16} fill={`url(#${id}-luz)`} opacity={0.22} transform="rotate(22 100 534)" />
        {/* Hueco bajo el pómulo */}
        <ellipse cx={126} cy={640} rx={36} ry={70} fill={`url(#${id}-sombra)`} opacity={0.5} transform="rotate(20 126 640)" />
        <ellipse cx={-130} cy={640} rx={26} ry={66} fill={`url(#${id}-sombra)`} opacity={0.32} transform="rotate(-20 -130 640)" />
        {/* Nariz: dorso con luz, un costado en sombra */}
        <path d="M14,472 C12,520 22,558 38,590 C30,602 16,600 10,590 C8,550 6,510 8,472 Z" fill={`url(#${id}-sombra)`} opacity={0.72} />
        <ellipse cx={-4} cy={516} rx={7} ry={42} fill={`url(#${id}-luz)`} opacity={0.55} />
        <ellipse cx={-3} cy={570} rx={15} ry={13} fill={`url(#${id}-luz)`} opacity={0.82} />
        <ellipse cx={0} cy={612} rx={20} ry={10} fill={`url(#${id}-sombra)`} opacity={0.6} />
        {/* Filtrum, bajo el labio y barbilla */}
        <path d="M-7,614 L-8,638 M7,614 L8,638" stroke="#A36F56" strokeWidth={1.8} strokeLinecap="round" opacity={0.25} />
        <ellipse cx={0} cy={700} rx={30} ry={8} fill={`url(#${id}-sombra)`} opacity={0.62} />
        <ellipse cx={-6} cy={734} rx={26} ry={13} fill={`url(#${id}-luz)`} opacity={0.42} />
      </g>
      <Mitad id={id} />
      <g transform="scale(-1,1)"><Mitad id={id} /></g>
      {/* Punta de la nariz */}
      <path d="M-26,602 Q-12,611 0,607 Q12,611 26,602" fill="none" stroke="#8E5A44" strokeWidth={2} strokeLinecap="round" opacity={0.6} />
      {/* Boca */}
      <path d="M-46,660 C-30,651 -16,644 -7,645 Q0,649 7,645 C16,644 30,651 46,660 C26,663 12,661 0,664 C-12,661 -26,663 -46,660 Z" fill={tez.labio[1]} />
      <path d="M-46,660 C-26,663 -12,661 0,664 C12,661 26,663 46,660 C34,678 16,686 0,686 C-16,686 -34,678 -46,660 Z" fill={`url(#${id}-labio)`} />
      <path d="M-46,660 C-26,665 -12,663 0,665 C12,663 26,665 46,660" fill="none" stroke="#6E3A36" strokeWidth={1.8} strokeLinecap="round" opacity={0.7} />
      <ellipse cx={-6} cy={673} rx={15} ry={5} fill="#FFF" opacity={0.2} />
      <PeloDelante id={id} peinado={peinado} />
      </g>
    </g>
  );
});

/** Tres mujeres distintas, para las tarjetas de «el gran imitador». */
export const PACIENTES_TEZ: { tez: Tez; peinado: Peinado }[] = [
  { tez: TEZ_BASE, peinado: 'largo' },
  { tez: { ...TEZ_BASE, piel: ['#E9C2A2', '#D3A07E', '#A9745A'], pelo: ['#2E2522', '#1D1715', '#100C0B'], iris: ['#5E3C22', '#2C1A0E'], ropa: ['#D9CEDC', '#A493AE'] }, peinado: 'corto' },
  { tez: { ...TEZ_BASE, piel: ['#F7DFCD', '#EBC6AC', '#CC9C80'], pelo: ['#7A4E30', '#58351F', '#3A2213'], iris: ['#7E8A5A', '#3E4A28'], ropa: ['#D8DFC8', '#A3B08C'] }, peinado: 'recogido' },
];
