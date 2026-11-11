'use client';
// Capítulo 1 · Quién, desde dónde y en qué fases.

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Bacilo, Bandera, Cama, Envoltura, En, Figurita, Flecha, FLECHA, G, Hematie, Intestino, LineaTiempo, Neutrofilo, Pastilla, PildoraFlota, Pulmones, Rinon, Sale, Suero, Txt, TXT_FARMACO, V, Ventilador, clamp, easeOut, lerp, tramo, TXTC } from '../Piezas';

/** Hospital: cama con barandilla y el número de días. */
function Calendario({ x, y, k = 1, o = 1, dias = 0 }: { x: number; y: number; k?: number; o?: number; dias?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-62} y={-66} width={132} height={132} rx={18} fill={G.sombra} transform="translate(8,9)" />
      <rect x={-66} y={-70} width={132} height={132} rx={18} fill="#FFF7E8" />
      <rect x={-66} y={-70} width={132} height={40} rx={18} fill="#E5324C" /><rect x={-66} y={-48} width={132} height={18} fill="#E5324C" />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-48 + (i % 4) * 32} y={-18 + Math.floor(i / 4) * 26} width={20} height={16} rx={5} fill={i < dias * 12 ? '#E5324C' : '#D9CDE8'} />)}
    </En>
  );
}

/** Quién pone los números: una cifra que cambia de país, año, foco y cepa. */
const Porque: Lamina = ({ p }) => {
  const cifras: [string, string, string][] = [['pais', 'País', '#2F6FD8'], ['ano', 'Año', '#D9822B'], ['foco', 'Foco', '#B8237A'], ['cepa', 'Cepa', '#138A3A']];
  return (
    <g>
      <Sale p={p('mortalidad')} x={300} y={330}><circle r={92} fill="#B51D3B" /><circle cx={-8} cy={-8} r={82} fill="#E5324C" /><path d="M-52,8 L-24,8 L-12,-30 L10,38 L24,8 L52,8" fill="none" stroke="#FFF" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" /></Sale>
      <Txt x={300} y={470} txt="mortalidad alta" t={32} p={p('mortalidad')} color={TXTC.sangre} />
      <Sale p={p('estancia')} x={800} y={330}><Cama ancho={300} k={0.8} y={30} /><Calendario x={0} y={-90} k={0.55} dias={tramo(p('estancia'), 0.2, 1)} /></Sale>
      <Txt x={800} y={470} txt="hospitalización larga" t={32} p={p('estancia')} />
      <Sale p={p('secuelas')} x={1300} y={330}>
        <circle r={92} fill="#8A4FE0" /><circle cx={-8} cy={-8} r={80} fill="#B79BFF" />
        <path d="M-30,16 C-48,-4 -40,-36 -14,-40 C-10,-60 24,-62 30,-40 C54,-34 56,-2 38,12 C40,34 14,44 4,30 C-12,40 -34,34 -30,16 Z" fill="#6D3FD8" />
        <path d="M-6,-30 C-14,-10 -2,0 -8,18 M14,-34 C22,-14 8,-2 16,22" fill="none" stroke="#C9B3FF" strokeWidth={4} strokeLinecap="round" />
      </Sale>
      <Txt x={1300} y={470} txt="secuelas físicas y cognitivas" t={30} p={p('secuelas')} color={TXTC.violeta} />
      <Bandera x={800} y={640} txt="Ojo con los números: cambian según…" color="var(--cit-base)" p={p('varian')} t={30} punta="no" />
      {cifras.map(([n, txt, c], i) => (
        <Sale key={n} p={p(n)} x={300 + i * 335} y={810}>
          <rect x={-120} y={-52} width={240} height={104} rx={14} fill={G.sombra} transform="translate(7,8)" />
          <rect x={-120} y={-52} width={240} height={104} rx={14} fill={c} />
          <rect x={-112} y={-46} width={30} height={92} rx={10} fill="#FFF" opacity={0.18} />
          <text textAnchor="middle" dy="0.35em" style={{ fontSize: 40, fontWeight: 800 }} fill="#FFF">{txt}</text>
        </Sale>
      ))}
      <Txt x={800} y={925} txt="no son tasas universales ni cifras del Perú" t={26} p={p('universal')} />
    </g>
  );
};

/** Multitud de siluetas; las vulnerables se marcan con un halo. */
const Vulnerables: Lamina = ({ p }) => {
  const filas = 4, cols = 11;
  const marcadas: [string, number][] = [['mayores', 9], ['criticos', 14], ['inmuno', 22], ['trasplante', 30], ['cancer', 38]];
  const dic: Record<number, string> = Object.fromEntries(marcadas.map(([n, i]) => [i, n]));
  return (
    <g>
      {Array.from({ length: filas * cols }, (_, i) => {
        const c = i % cols, f = Math.floor(i / cols);
        const x = 160 + c * 128 + (f % 2 ? 54 : 0) + (i % 3) * 6, y = 260 + f * 150 + (i % 5) * 4;
        const n = dic[i];
        return <Figurita key={i} x={x} y={y} k={0.9} ropa={i} marca={n ? p(n) : 0} />;
      })}
      <Bandera x={800} y={80} txt="Quién es vulnerable" color="var(--cit-base)" p={p('mayores')} t={34} punta="no" />
      {[['mayores', 'Mayores', 190], ['criticos', 'Pacientes críticos', 450], ['inmuno', 'Inmunosuprimidos', 740], ['trasplante', 'Trasplantados', 1010], ['cancer', 'Cáncer hematológico', 1300]].map(([n, txt, x]) => (
        <Bandera key={n as string} x={x as number} y={900} txt={txt as string} color={['#2F6FD8', '#D9822B', '#B8237A', '#138A3A', '#7A1F6E'][['mayores', 'criticos', 'inmuno', 'trasplante', 'cancer'].indexOf(n as string)]} p={p(n as string)} t={22} punta="no" />
      ))}
      <Txt x={800} y={830} txt="todos comparten una mucosa dañada" t={30} p={p('mucosa')} color={TXTC.rosa} />
    </g>
  );
};

const Exposicion: Lamina = ({ p, reloj }) => {
  const items: [string, string, number][] = [['dispositivos', 'Dispositivos invasivos', 250], ['cirugia', 'Cirugía', 560], ['estancia', 'Estancia larga', 860], ['ventilacion', 'Ventilación mecánica', 1160], ['antibioticos', 'Antibióticos', 1440]];
  return (
    <g>
      <Bandera x={800} y={80} txt="Lo que suma el hospital" color="var(--cit-base)" p={p('dispositivos')} t={34} punta="no" />
      <Sale p={p('dispositivos')} x={250} y={360}><Suero k={0.68} gota={reloj / 800} /></Sale>
      <Sale p={p('cirugia')} x={560} y={420}>
        <g transform="rotate(-28)"><rect x={-110} y={-14} width={150} height={28} rx={14} fill="#AAB6C3" /><path d="M40,-14 L130,0 L40,14 Z" fill="#E9EEF3" /><rect x={-110} y={-14} width={150} height={9} rx={4} fill="#FFF" opacity={0.7} /></g>
      </Sale>
      <Sale p={p('estancia')} x={860} y={440}><Cama ancho={320} k={0.9} /><Calendario x={0} y={-130} k={0.5} dias={1} /></Sale>
      <Sale p={p('ventilacion')} x={1160} y={440}><Ventilador reloj={reloj} k={1} /></Sale>
      <Sale p={p('antibioticos')} x={1440} y={420}>
        <Pastilla k={1.2} color={['#1E56C6', '#3B82F0', '#BFDBFF']} r={-25} />
        <Pastilla x={20} y={84} k={0.9} r={35} color={['#C2410C', '#F97316', '#FFC48A']} />
      </Sale>
      {items.map(([n, txt, x]) => <Txt key={n} x={x} y={690} txt={txt} t={26} p={p(n)} />)}
      <Txt x={800} y={800} txt="favorecen la infección y seleccionan resistencia" t={32} p={p('antibioticos')} color={TXTC.sangre} />
    </g>
  );
};

const Reservorios: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="Dónde viven" color="var(--cit-base)" p={p('intestino')} t={34} punta="no" />
      <Sale p={p('intestino')} x={300} y={390} k={1.1}><Intestino /></Sale>
      <Bacilo x={170} y={620} r={-20} k={0.8 * p('ecoli')} /><Bacilo x={330} y={640} r={25} k={0.8 * p('kleb')} capsula={1} tono={G.patogeno} />
      <Txt x={170} y={700} txt="E. coli" t={28} p={p('ecoli')} color={TXTC.patogeno} /><Txt x={330} y={710} txt="Klebsiella" t={28} p={p('kleb')} color={TXTC.patogeno} />
      <Txt x={300} y={780} txt="el intestino" t={30} p={p('intestino')} />
      <Sale p={p('agua')} x={800} y={380}>
        <path d="M0,-130 C60,-50 90,10 90,52 C90,110 50,140 0,140 C-50,140 -90,110 -90,52 C-90,10 -60,-50 0,-130 Z" fill="#2E78F2" />
        <path d="M0,-118 C52,-46 80,10 80,52 C80,100 46,128 0,128 C-46,128 -80,100 -80,52 C-80,10 -52,-46 0,-118 Z" fill="#5AA8FF" />
        <path d="M-40,40 Q-48,80 -22,104" fill="none" stroke="#DDEEFF" strokeWidth={10} strokeLinecap="round" />
      </Sale>
      <Bacilo x={800} y={420} r={20} k={0.6 * p('pseudo')} flagelo={p('pseudo')} reloj={reloj} />
      <Txt x={800} y={590} txt="Pseudomonas" t={28} p={p('pseudo')} color={TXTC.patogeno} />
      <Txt x={800} y={780} txt="agua y nichos húmedos" t={30} p={p('agua')} />
      <Sale p={p('equipos')} x={1290} y={390}>
        <Cama ancho={380} k={0.9} />
        <rect x={-190} y={-86} width={240} height={14} rx={7} fill={G.cama[0]} />
      </Sale>
      <Bacilo x={1230} y={310} r={10} k={0.6 * p('acineto')} capsula={0.6} />
      <Bacilo x={1330} y={324} r={-14} k={0.6 * p('acineto')} capsula={0.6} />
      <Txt x={1290} y={590} txt="Acinetobacter" t={28} p={p('acineto')} color={TXTC.patogeno} />
      <Txt x={1290} y={780} txt="superficies y equipos" t={30} p={p('equipos')} />
    </g>
  );
};

const Fases: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="Tres fases de una bacteriemia" color="var(--cit-base)" p={p('fase1')} t={34} punta="no" />
      <LineaTiempo x={800} y={470} w={1400} p={p('fase1')} t={26} tramos={[{ txt: '1 · Colonización', color: G.comensal[0], p: p('fase1') }, { txt: '2 · Diseminación', color: G.amarillo[0], p: p('fase2') }, { txt: '3 · Supervivencia', color: G.rosa[0], p: p('fase3') }]} />
      {/* 1: adhesión */}
      <Sale p={p('adhesion')} x={330} y={700}>
        <ellipse cx={0} cy={60} rx={160} ry={34} fill={G.epitelio[1]} /><ellipse cx={0} cy={48} rx={154} ry={28} fill={G.epitelio[2]} />
        <Bacilo x={-30} y={4} r={-8} k={0.8} fimbrias={p('adhesion')} />
      </Sale>
      <Txt x={330} y={850} txt="se adhiere y toma nutrientes" t={24} p={p('adhesion')} />
      {/* 2: cruza */}
      <Sale p={p('cruza')} x={800} y={700}>
        <rect x={-160} y={30} width={150} height={60} rx={20} fill={G.epitelio[1]} /><rect x={10} y={30} width={150} height={60} rx={20} fill={G.epitelio[1]} />
        <Bacilo x={0} y={20 - 70 * p('cruza')} r={90} k={0.8} />
      </Sale>
      <Txt x={800} y={850} txt="cruza epitelio y endotelio" t={24} p={p('cruza')} />
      {/* 3: sangre */}
      <Sale p={p('sobrevive')} x={1270} y={700}>
        <rect x={-170} y={-60} width={340} height={120} rx={60} fill="#5E1030" /><rect x={-162} y={-54} width={324} height={102} rx={51} fill="#7E1840" />
        {[-100, 0, 100].map((dx, i) => <Hematie key={i} x={dx} y={i % 2 ? 14 : -16} k={0.5} />)}
        <Bacilo x={-40} y={0} k={0.7} capsula={1} /><Bacilo x={60} y={-10} r={20} k={0.7} capsula={1} />
        <Neutrofilo x={120} y={20} k={0.4} />
      </Sale>
      <Txt x={1270} y={850} txt="resiste complemento y fagocitos" t={24} p={p('sobrevive')} />
      <Flecha a={[460, 640]} b={[640, 640]} p={p('fase2')} color={FLECHA} w={7} /><Flecha a={[930, 640]} b={[1100, 640]} p={p('fase3')} color={FLECHA} w={7} />
    </g>
  );
};

const Puertas: Lamina = ({ p }) => {
  const sitios: [string, string, number, number, ReactNode][] = [
    ['intestino', 'Intestino', 330, 300, <Intestino key="i" k={0.55} />],
    ['urinario', 'Tracto urinario', 800, 300, <Rinon key="r" k={0.9} />],
    ['pulmon', 'Pulmón', 1270, 300, <Pulmones key="p" k={0.7} />],
  ];
  return (
    <g>
      <Bandera x={800} y={80} txt="Cuatro puertas de entrada" color="var(--cit-base)" p={p('intestino')} t={34} punta="no" />
      {sitios.map(([n, txt, x, y, ic]) => (
        <g key={n}><Sale p={p(n)} x={x} y={y + 30}>{ic}</Sale><Txt x={x} y={y + 200} txt={txt} t={30} p={p(n)} /></g>
      ))}
      <Sale p={p('piel')} x={800} y={650}>
        <rect x={-260} y={-40} width={520} height={34} rx={17} fill="#F6CDB8" /><rect x={-260} y={-8} width={520} height={46} rx={20} fill="#E9A58A" />
        <rect x={-34} y={-90} width={22} height={140} rx={10} fill="#AAB6C3" /><rect x={-44} y={-100} width={42} height={16} rx={8} fill="#7F93A8" />
      </Sale>
      <Txt x={800} y={730} txt="piel, tejidos blandos y dispositivos" t={30} p={p('piel')} />
      {[['intestino', 330, 'E. coli · Klebsiella'], ['urinario', 800, 'E. coli · Proteus · Klebsiella'], ['pulmon', 1270, 'Klebsiella · Pseudomonas · Acinetobacter']].map(([n, x, txt]) => <Txt key={n as string} x={x as number} y={540} txt={txt as string} t={22} p={p(n as string)} fuerte={false} color={TXTC.patogeno} />)}
      <Txt x={800} y={780} txt="Pseudomonas · Acinetobacter · Serratia" t={22} p={p('piel')} fuerte={false} color={TXTC.patogeno} />
      <Bandera x={800} y={900} txt="Colonizar el pulmón o el intestino no es sobrevivir en la sangre" color={V.violeta[0]} p={p('distinto')} t={28} />
    </g>
  );
};

const Membranas: Lamina = ({ p, reloj }) => {
  const beta = easeOut(clamp(p('betalactamico')));
  const vanco = easeOut(clamp(p('vanco')));
  // El β-lactámico baja por la porina de la derecha (x ≈ 923) y pasa al periplasma; la vancomicina se queda arriba.
  const bx = beta < 0.5 ? lerp(1300, 983, beta * 2) : 983, by = beta < 0.5 ? lerp(190, 330, beta * 2) : lerp(330, 560, (beta - 0.5) * 2);
  return (
    <g>
      <Sale p={p('envoltura')} x={700} y={500} k={1.05}><Envoltura lps={p('externa')} porinas={p('porinas')} pg={p('envoltura')} /></Sale>
      <Txt x={30} y={430} txt="membrana externa" t={20} p={p('externa')} ancla="start" />
      <Txt x={30} y={610} txt="membrana interna" t={20} p={p('envoltura')} ancla="start" />
      <En x={bx} y={by} o={tramo(p('betalactamico'), 0, 0.3)}>
        <rect x={-22} y={-22} width={44} height={44} rx={9} fill="#FFB21E" /><rect x={-12} y={-12} width={24} height={24} rx={5} fill="#FFE08A" /><circle cx={-4} cy={-4} r={4} fill="#FFF" opacity={0.8} />
      </En>
      <Txt x={1250} y={140} txt="β-lactámico: pequeño, entra por la porina" t={24} p={p('betalactamico')} color={TXTC.ambar} />
      <En x={765} y={lerp(110, 215, vanco)} o={tramo(p('vanco'), 0, 0.3)}>
        {[[-34, -10, 38], [20, -18, 34], [4, 26, 36], [-30, 28, 24]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={['#4B1FA0', '#7A45E6', '#B79BFF', '#6D3FD8'][i]} />)}
      </En>
      <Txt x={765} y={60} txt="vancomicina: demasiado grande" t={24} p={p('vanco')} color={TXTC.violeta} />
      <Txt x={850} y={215} txt="no cruza" t={26} p={p('bloqueada')} color={TXTC.rosa} ancla="start" />
      <Bandera x={700} y={830} txt="Cubre gramnegativas… o no" color={V.violeta[0]} p={p('bloqueada')} t={30} punta="no" />
      <Txt x={700} y={915} txt="el antibiótico es factor de riesgo… y herramienta" t={28} p={p('herramienta')} />
      <PildoraFlota x={1400} y={640} k={1.3} rl={reloj} p={p('riesgo')} />
      <Bandera x={1400} y={800} txt={TXT_FARMACO} color="#2F6FD8" p={p('riesgo')} t={24} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Porque, Vulnerables, Exposicion, Reservorios, Fases, Puertas, Membranas];
export default LAMINAS;
