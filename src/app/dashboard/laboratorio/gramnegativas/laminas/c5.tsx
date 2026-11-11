'use client';
// Capítulo 5 · Endotoxina y exotoxinas.

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Bacilo, Bandera, Cruz, En, Flecha, FLECHA, G, Macrofago, Pastilla, PildoraFlota, Sale, TXT_FARMACO, TXTC, Termometro, Txt, Vaso, clamp, easeOut, tramo } from '../Piezas';

/** Toxina proteica: una bolita verde con brillo. */
function Toxina({ x, y, k = 1, o = 1 }: { x: number; y: number; k?: number; o?: number }) {
  return <En x={x} y={y} k={k} o={o}><circle r={16} fill={G.toxina[0]} /><circle cx={-1} cy={-1} r={13} fill={G.toxina[1]} /><circle cx={-5} cy={-5} r={4.5} fill="#FFF" opacity={0.85} /></En>;
}

/** Molécula de LPS horizontal: lípido A (seis cadenas), núcleo (hexágonos) y antígeno O (cadena larga). */
function Lps({ x, y, k = 1, a = 1, n = 1, o = 1, largo = 1 }: { x: number; y: number; k?: number; a?: number; n?: number; o?: number; largo?: number }) {
  const hex = (cx: number, cy: number, r: number, c: string) => <path d={`M${cx},${cy - r} l${r * 0.87},${r * 0.5} v${r} l${-r * 0.87},${r * 0.5} l${-r * 0.87},${-r * 0.5} v${-r} z`} fill={c} />;
  return (
    <En x={x} y={y} k={k}>
      <g opacity={clamp(a)}>
        <rect x={-150} y={-50} width={110} height={100} rx={22} fill="#A82E0B" />
        {[-120, -90, -60].map((cx, i) => <g key={i}><path d={`M${cx},-50 q-14,-60 8,-110`} fill="none" stroke="#FFB48A" strokeWidth={9} strokeLinecap="round" /><path d={`M${cx},50 q14,60 -8,110`} fill="none" stroke="#FFB48A" strokeWidth={9} strokeLinecap="round" /></g>)}
        <circle cx={-96} cy={0} r={24} fill="#F2703A" /><circle cx={-102} cy={-6} r={7} fill="#FFF" opacity={0.7} />
      </g>
      <g opacity={clamp(n)}>
        {[0, 1, 2].map((i) => <g key={i}>{hex(-10 + i * 44, -14 + (i % 2) * 16, 22, ['#FFD23F', '#FF9F1C', '#FFD23F'][i])}</g>)}
        <circle cx={-34} cy={0} r={10} fill="#FF9F1C" />
      </g>
      <g opacity={clamp(o)}>
        {Array.from({ length: 6 }, (_, i) => <g key={i}>{hex(130 + i * 40 * largo, -26 + (i % 2) * 20 + Math.sin(i) * 6, 17, ['#5FE08A', '#2FB98A', '#5FE08A'][i % 3])}</g>)}
      </g>
    </En>
  );
}

const Dos: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="Dos familias de daño" color="var(--cit-base)" p={p('dos')} t={34} punta="no" />
      <Sale p={p('endo')} x={430} y={400}><Bacilo k={2.6} sombra /><Lps x={0} y={-150} k={0.5} /></Sale>
      <Bandera x={430} y={640} txt="Endotoxina" color={G.patogeno[0]} p={p('endo')} t={34} punta="no" />
      <Txt x={430} y={710} txt="el lipopolisacárido de la membrana externa" t={24} p={p('endo')} />
      <Sale p={p('exo')} x={1170} y={400}>
        {[[-100, -70], [80, -100], [110, 60], [-80, 80], [0, 0]].map(([cx, cy], i) => <Toxina key={i} x={cx} y={cy} k={2.2} />)}
      </Sale>
      <Bandera x={1170} y={640} txt="Exotoxinas" color={G.toxina[0]} p={p('exo')} t={34} punta="no" />
      <Txt x={1170} y={710} txt="proteínas con una actividad específica" t={24} p={p('exo')} />
      <Txt x={800} y={420} txt="≠" t={90} p={p('dos')} />
      <Txt x={800} y={900} txt="una gramnegativa puede dañar sin entrar a la sangre" t={30} p={p('sinsangre')} color={TXTC.sangre} />
    </g>
  );
};

const Lps1: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('lipidoA')} x={800} y={470} k={1.6}><Lps x={0} y={0} a={1} n={p('nucleo')} o={p('antigenoO')} /></Sale>
      <Bandera x={380} y={230} txt="Lípido A" color={G.patogeno[0]} p={p('lipidoA')} t={32} punta="abajo" />
      <Txt x={380} y={300} txt="la parte endotóxica" t={24} p={p('lipidoA')} color={TXTC.patogeno} />
      <Bandera x={800} y={230} txt="Núcleo oligosacárido" color={G.amarillo[0]} p={p('nucleo')} t={30} punta="abajo" />
      <Bandera x={1220} y={230} txt="Antígeno O" color={G.mucoso[0]} p={p('antigenoO')} t={32} punta="abajo" />
      <Txt x={1220} y={300} txt="la cadena larga" t={24} p={p('antigenoO')} color={TXTC.mucoso} />
      <Sale p={p('los')} x={800} y={740} k={1.0}><Lps x={0} y={0} a={1} n={1} o={0} /></Sale>
      <Txt x={800} y={940} txt="LOS: sin la cadena O extensa" t={30} p={p('los')} />
    </g>
  );
};

const Tlr4: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Sale p={p('lbp')} x={250} y={420}><Lps x={0} y={0} k={0.6} /></Sale>
      <Sale p={p('lbp')} x={470} y={420}><rect x={-34} y={-44} width={68} height={88} rx={26} fill="#2F6FD8" /><rect x={-28} y={-38} width={56} height={76} rx={22} fill="#5AA8FF" /></Sale>
      <Txt x={470} y={500} txt="LBP" t={30} p={p('lbp')} color={TXTC.violeta} />
      <Flecha a={[540, 420]} b={[640, 420]} p={p('cd14')} color={FLECHA} w={9} />
      <Sale p={p('cd14')} x={710} y={420}><circle r={42} fill="#D9822B" /><circle r={32} fill="#FFC060" /></Sale>
      <Txt x={710} y={500} txt="CD14" t={30} p={p('cd14')} color={TXTC.ambar} />
      <Flecha a={[780, 420]} b={[880, 420]} p={p('tlr4')} color={FLECHA} w={9} />
      <Sale p={p('tlr4')} x={980} y={600}><Macrofago k={1.2} /></Sale>
      <Sale p={p('tlr4')} x={980} y={470}><rect x={-60} y={-30} width={46} height={80} rx={20} fill="#0A7F86" /><rect x={14} y={-30} width={46} height={80} rx={20} fill="#16B9BE" /><circle cx={0} cy={-40} r={16} fill="#FFD23F" /></Sale>
      <Txt x={980} y={380} txt="TLR4 / MD-2" t={30} p={p('tlr4')} color={TXTC.comensal} />
      {[0, 1, 2, 3, 4].map((i) => { const q = tramo(p('mediadores'), i * 0.1, 0.6 + i * 0.1); return <circle key={i} cx={1130 + i * 60} cy={620 - 190 * q + 6 * Math.sin(reloj / 300 + i)} r={13} fill={['#FFD23F', '#FF7A9A', '#5AA8FF', '#FF9F1C', '#B79BFF'][i]} opacity={tramo(q, 0, 0.3) * (1 - tramo(q, 0.9, 1))} />; })}
      <Txt x={1180} y={470} txt="mediadores inflamatorios" t={24} p={p('mediadores')} ancla="start" />
      <Txt x={800} y={880} txt="si se desregula: disfunción del endotelio y de los órganos" t={30} p={p('desregula')} color={TXTC.sangre} />
    </g>
  );
};

const Vesiculas: Lamina = ({ p, reloj }) => {
  const vs = p('vesiculas');
  return (
    <g>
      <Sale p={p('lisis')} x={330} y={420}>
        <circle r={110} fill={G.patogeno[1]} opacity={0.25} />
        {Array.from({ length: 10 }, (_, i) => <g key={i} transform={`rotate(${i * 36})`}><rect x={70 + 50 * p('lisis')} y={-10} width={50} height={20} rx={10} fill={G.patogeno[2]} /></g>)}
      </Sale>
      <Txt x={330} y={600} txt="lisis: la bacteria se rompe" t={28} p={p('lisis')} />
      <Sale p={p('vesiculas')} x={800} y={420}><Bacilo k={2} /></Sale>
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={900 + 80 * i * vs + 6 * Math.sin(reloj / 300 + i)} cy={340 + 40 * i * vs * (i % 2 ? 1 : -1)} r={16} fill={G.patogeno[2]} opacity={tramo(vs, i * 0.1, 0.4 + i * 0.1)} />)}
      <Txt x={800} y={600} txt="vesículas de la bacteria viva" t={28} p={p('vesiculas')} />
      <Txt x={1220} y={250} txt="actúan a distancia" t={26} p={p('distancia')} color={TXTC.sangre} />
      <Flecha a={[1100, 300]} b={[1400, 330]} p={p('distancia')} color={FLECHA} w={9} />
      <g opacity={tramo(p('potencia'), 0, 0.4)}>
        <rect x={420} y={760} width={760} height={34} rx={17} fill="url(#gn-pot)" />
        <defs><linearGradient id="gn-pot" x1="0" x2="1"><stop offset="0" stopColor="#FFD23F" /><stop offset="1" stopColor="#E5324C" /></linearGradient></defs>
        <circle cx={420 + 760 * easeOut(clamp(p('potencia')))} cy={777} r={22} fill="#3B1A6E" />
      </g>
      <Txt x={800} y={840} txt="no todos los LPS tienen la misma potencia: depende del lípido A" t={26} p={p('potencia')} />
    </g>
  );
};

const Exotoxinas: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="Proteínas con un blanco específico" color="var(--cit-base)" p={p('proteinas')} t={34} punta="no" />
      <Sale p={p('membrana')} x={290} y={470}>
        <rect x={-150} y={-30} width={300} height={60} rx={30} fill={G.epitelio[1]} />
        <circle cx={0} cy={0} r={26} fill="#1B0A3D" /><circle cx={0} cy={0} r={26} fill="none" stroke="#FFD23F" strokeWidth={6} />
        <Toxina x={0} y={-110} k={1.6} />
      </Sale>
      <Txt x={290} y={640} txt="la membrana" t={30} p={p('membrana')} />
      <Sale p={p('citoesqueleto')} x={800} y={470}>
        {[-80, -40, 0, 40, 80].map((dx, i) => <path key={i} d={`M${dx},-90 q${(i % 2 ? 24 : -24) * p('citoesqueleto')},90 ${dx * 0.1},180`} fill="none" stroke="#FFD23F" strokeWidth={10} strokeLinecap="round" />)}
        <Toxina x={0} y={-130} k={1.6} />
      </Sale>
      <Txt x={800} y={640} txt="el citoesqueleto" t={30} p={p('citoesqueleto')} />
      <Sale p={p('sintesis')} x={1310} y={470}>
        <ellipse cx={0} cy={-26} rx={50} ry={34} fill="#7A45E6" /><ellipse cx={0} cy={20} rx={66} ry={42} fill="#B79BFF" />
        <Cruz x={0} y={0} k={1.8} p={1} />
        <Toxina x={0} y={-130} k={1.6} />
      </Sale>
      <Txt x={1310} y={640} txt="la síntesis de proteínas" t={30} p={p('sintesis')} />
    </g>
  );
};

const Seis: Lamina = ({ p }) => {
  const ficha = (n: string, x: number, y: number, txt: string, sub: string, dib: ReactNode) => (
    <g key={n}><Sale p={p(n)} x={x} y={y}>{dib}</Sale><Txt x={x} y={y + 100} txt={txt} t={28} p={p(n)} /><Txt x={x} y={y + 138} txt={sub} t={22} p={p(n)} fuerte={false} /></g>
  );
  return (
    <g>
      {ficha('shiga', 290, 250, 'Shiga (Gb3)', 'frena la síntesis de proteínas', <><ellipse cy={-18} rx={40} ry={26} fill="#7A45E6" /><ellipse cy={14} rx={54} ry={34} fill="#B79BFF" /><Toxina x={64} y={-40} k={1.3} /></>)}
      {ficha('exou', 800, 250, 'ExoU', 'fosfolipasa: rompe membranas', <><rect x={-70} y={-12} width={140} height={24} rx={12} fill={G.epitelio[1]} /><path d="M-10,-12 l20,0 l-8,24 l-20,0 z" fill="#1B0A3D" /><Toxina x={0} y={-50} k={1.3} /></>)}
      {ficha('exost', 1310, 250, 'ExoS y ExoT', 'alteran la actina (T3SS)', <>{[-40, 0, 40].map((dx, i) => <path key={i} d={`M${dx},-50 q${i % 2 ? 18 : -18},50 0,100`} fill="none" stroke="#FFD23F" strokeWidth={9} strokeLinecap="round" />)}</>)}
      {ficha('exla', 290, 640, 'ExlA y LasB', 'necrosis; degrada matriz y cadherinas', <><rect x={-70} y={-12} width={140} height={24} rx={12} fill="#E5324C" /><Toxina x={-30} y={-46} k={1.2} /><Toxina x={30} y={-46} k={1.2} /></>)}
      {ficha('zot', 800, 640, 'ZOT', 'abre las uniones estrechas', <><rect x={-60} y={-50} width={44} height={100} rx={16} fill={G.epitelio[1]} /><rect x={16} y={-50} width={44} height={100} rx={16} fill={G.epitelio[1]} /><Toxina x={0} y={-8} k={1.3} /></>)}
      {ficha('tcd', 1310, 640, 'TcdA / TcdB', 'comparación grampositiva', <><Bacilo tono={G.grampos} k={0.9} /><Toxina x={50} y={-46} k={1.2} /></>)}
    </g>
  );
};

const Tabla: Lamina = ({ p }) => {
  const filas: [string, string, string, string, ReactNode, ReactNode][] = [
    ['naturaleza', 'Naturaleza', 'lipopolisacárido', 'proteína', <circle key="a" r={14} fill="#F2703A" />, <Toxina key="b" x={0} y={0} />],
    ['productores', 'Productores', 'solo gramnegativas', 'gramnegativas y grampositivas', <Bacilo key="a" k={0.4} />, <Bacilo key="b" k={0.4} tono={G.grampos} />],
    ['accion', 'Acción', 'activa la inmunidad innata', 'daña un blanco específico', <circle key="a" r={14} fill="#E5324C" />, <circle key="b" r={14} fill="#16B9BE" />],
    ['calor', 'Calor', 'termoestable', 'muchas, termolábiles', <Termometro key="a" k={0.16} val={0.9} />, <Termometro key="b" k={0.16} val={0.3} />],
    ['neutraliza', 'Neutralización', 'sin antitoxina clásica', 'toxoides y antitoxinas', <Cruz key="a" k={0.9} />, <Pastilla key="b" k={0.4} />],
  ];
  return (
    <g>
      <Bandera x={560} y={110} txt="Endotoxina" color={G.patogeno[0]} p={p('naturaleza')} t={30} punta="no" />
      <Bandera x={1130} y={110} txt="Exotoxinas" color={G.toxina[0]} p={p('naturaleza')} t={30} punta="no" />
      {filas.map(([n, tit, a, b, ia, ib], i) => (
        <g key={n}>
          <Txt x={110} y={250 + i * 150} txt={tit} t={28} p={p(n)} ancla="start" />
          <Sale p={p(n)} x={430} y={250 + i * 150}>{ia}</Sale><Txt x={470} y={250 + i * 150} txt={a} t={24} p={p(n)} ancla="start" fuerte={false} />
          <Sale p={p(n)} x={990} y={250 + i * 150}>{ib}</Sale><Txt x={1030} y={250 + i * 150} txt={b} t={24} p={p(n)} ancla="start" fuerte={false} />
        </g>
      ))}
    </g>
  );
};

const Errores: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="Tres errores que evitar" color="var(--cit-base)" p={p('ambas')} t={34} punta="no" />
      <Sale p={p('ambas')} x={290} y={400}><Bacilo k={1.6} sombra /><Lps x={0} y={-120} k={0.35} /><Toxina x={120} y={70} k={1.4} /><Toxina x={-110} y={90} k={1.4} /></Sale>
      <Txt x={290} y={590} txt="1 · una gramnegativa puede usar ambas" t={26} p={p('ambas')} />
      <Sale p={p('distancia')} x={800} y={400}>
        <Bacilo x={-150} y={0} k={1.1} flagelo={0} />
        <Flecha a={[-80, 0]} b={[110, 0]} p={1} color={FLECHA} w={9} />
        <circle cx={170} cy={0} r={50} fill="#C23A6E" /><circle cx={166} cy={-4} r={40} fill="#F27BA0" />
        <Toxina x={0} y={-60} k={1.2} />
      </Sale>
      <Txt x={800} y={590} txt="2 · una exotoxina puede actuar a distancia" t={26} p={p('distancia')} />
      <Sale p={p('entero')} x={1310} y={400}>
        <path d="M-50,-90 L-50,40 C-50,100 50,100 50,40 L50,-90" fill="none" stroke="#7A2A8A" strokeWidth={40} strokeLinecap="round" /><path d="M-50,-90 L-50,40 C-50,100 50,100 50,40 L50,-90" fill="none" stroke="#FFF1B8" strokeWidth={26} strokeLinecap="round" />
        <Cruz x={0} y={-10} k={2.6} />
      </Sale>
      <Txt x={1310} y={590} txt="3 · «entero» no significa «endotoxina»" t={26} p={p('entero')} />
      <Txt x={1310} y={630} txt="es el sitio de acción" t={22} p={p('entero')} fuerte={false} />
    </g>
  );
};

const SinExotoxinas: Lamina = ({ p, reloj }) => {
  const barras = (x: number, titulo: string, h: number, c: string, n: string) => (
    <g key={n}><rect x={x} y={780 - h} width={90} height={h} rx={14} fill={c} opacity={tramo(p(n), 0, 0.4)} /><Txt x={x + 45} y={820} txt={titulo} t={22} p={p(n)} /></g>
  );
  return (
    <g>
      <Vaso x={800} y={250} largo={1700} ancho={200} ang={0} reloj={reloj} flujo={10} o={tramo(p('kleb'), 0, 0.5)}>
        <Bacilo x={-340} y={-10} r={20} k={0.7} capsula={1} o={tramo(p('kleb'), 0.2, 0.8)} /><Bacilo x={-220} y={20} r={-20} k={0.7} capsula={1} o={tramo(p('kleb'), 0.4, 1)} />
        <Bacilo x={220} y={-10} r={30} k={0.7} capsula={0.6} o={tramo(p('acineto'), 0.2, 0.8)} /><Bacilo x={340} y={20} r={-10} k={0.7} capsula={0.6} o={tramo(p('acineto'), 0.4, 1)} />
      </Vaso>
      <Txt x={400} y={410} txt="Klebsiella" t={30} p={p('kleb')} color={TXTC.patogeno} /><Txt x={1200} y={410} txt="Acinetobacter" t={30} p={p('acineto')} color={TXTC.patogeno} />
      <Txt x={800} y={480} txt="sin exotoxinas potentes, también hay bacteriemia" t={28} p={p('kleb')} />
      <Sale p={p('tlr4')} x={330} y={640}><rect x={-80} y={-30} width={60} height={80} rx={22} fill="#0A7F86" /><rect x={20} y={-30} width={60} height={80} rx={22} fill="#16B9BE" opacity={0.35} /><Cruz x={50} y={10} k={1.2} p={1} /></Sale>
      <Txt x={330} y={730} txt="modelo con A. baumannii: TLR4 alterado" t={24} p={p('tlr4')} />
      {barras(620, 'lesión', 60, '#E5324C', 'menos')}{barras(740, 'mortalidad', 70, '#FF7A8A', 'menos')}{barras(900, 'carga', 200, '#B79BFF', 'carga')}
      <Txt x={1100} y={640} txt="menos lesión y mortalidad…" t={24} p={p('menos')} ancla="start" />
      <Txt x={1100} y={680} txt="…sin relación simple con la carga" t={24} p={p('carga')} ancla="start" />
      <Bandera x={800} y={940} txt="Observación experimental: no es una indicación clínica" color="#4B1FA0" p={p('noclinica')} t={26} punta="no" />
    </g>
  );
};

const Farmacos: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Sale p={p('polimixina')} x={250} y={330}><Pastilla k={1.2} r={-20} color={['#1E56C6', '#3B82F0', '#BFDBFF']} /><circle cx={-30} cy={-50} r={16} fill="#5AA8FF" /><text x={-30} y={-44} textAnchor="middle" style={{ fontSize: 22, fontWeight: 800 }} fill="#FFF">+</text></Sale>
      <Txt x={250} y={430} txt="polimixinas (colistina)" t={26} p={p('polimixina')} />
      <Flecha a={[360, 330]} b={[540, 430]} p={p('lipidoA')} color={FLECHA} w={9} />
      <Sale p={p('lipidoA')} x={640} y={470}><Lps x={0} y={0} k={0.62} /><circle cx={-60} cy={-6} r={20} fill="#1B0A3D" /><text x={-60} y={2} textAnchor="middle" style={{ fontSize: 30, fontWeight: 800 }} fill="#FFD23F">−</text></Sale>
      <Txt x={640} y={580} txt="se une al lípido A, de carga negativa" t={24} p={p('lipidoA')} />
      <Txt x={640} y={620} txt="y desorganiza la membrana externa" t={22} p={p('lipidoA')} fuerte={false} />
      <Txt x={1130} y={470} txt="resistencia: modifica el lípido A" t={26} p={p('resistencia')} ancla="start" />
      <Txt x={1130} y={510} txt="y se une menos" t={24} p={p('resistencia')} ancla="start" fuerte={false} />
      <Sale p={p('lisis')} x={1380} y={560}>
        <circle r={60} fill={G.patogeno[1]} opacity={0.3} />{Array.from({ length: 8 }, (_, i) => <g key={i} transform={`rotate(${i * 45})`}><rect x={40 + 30 * p('lisis')} y={-8} width={34} height={16} rx={8} fill={G.patogeno[2]} /></g>)}
      </Sale>
      <Txt x={1380} y={660} txt="los bactericidas liberan endotoxina" t={22} p={p('lisis')} />
      <Sale p={p('eritoran')} x={330} y={760}><rect x={-60} y={-30} width={46} height={80} rx={20} fill="#0A7F86" /><rect x={14} y={-30} width={46} height={80} rx={20} fill="#16B9BE" /><Pastilla x={0} y={-60} k={0.5} /></Sale>
      <Txt x={330} y={860} txt="eritoran (anti-TLR4)" t={24} p={p('eritoran')} />
      <Cruz x={560} y={760} k={1.6} p={p('ensayos')} />
      <Txt x={650} y={760} txt="sin beneficio en mortalidad en ensayos de sepsis" t={24} p={p('ensayos')} ancla="start" color={TXTC.sangre} />
      <Sale p={p('toxoide')} x={260} y={920}><rect x={-60} y={-26} width={120} height={52} rx={14} fill="#138A3A" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 24, fontWeight: 800 }} fill="#FFF">toxoide</text></Sale>
      <Txt x={350} y={920} txt="hay para algunas exotoxinas; para la endotoxina, no" t={24} p={p('toxoide')} ancla="start" />
      <PildoraFlota x={1400} y={300} k={1.1} rl={reloj} p={p('farmaco')} />
      <Bandera x={1400} y={430} txt={TXT_FARMACO} color="#2F6FD8" p={p('farmaco')} t={22} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Dos, Lps1, Tlr4, Vesiculas, Exotoxinas, Seis, Tabla, Errores, SinExotoxinas, Farmacos];
export default LAMINAS;
