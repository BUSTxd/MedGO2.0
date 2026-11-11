'use client';
// Capítulo 8 · Cuatro especies, cuatro estrategias (y la ronda de fármacos).

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Bacilo, Bandera, Bazo, Cama, Cruz, En, Enterocito, Flecha, FLECHA, G, Hematie, Higado, Neutrofilo, Pastilla, PildoraFlota, Pulmones, Rinon, Sale, Tijera, TXT_FARMACO, TXTC, Txt, V, tramo } from '../Piezas';

type Tipo = 'ecoli' | 'kleb' | 'pseudo' | 'acineto';
/** Retrato de cada especie: lo que la distingue (fimbrias, cápsula, flagelo, cocobacilo de superficie). */
function Esp({ x, y, k = 1, tipo, reloj = 0, o = 1 }: { x: number; y: number; k?: number; tipo: Tipo; reloj?: number; o?: number }) {
  if (tipo === 'ecoli') return <Bacilo x={x} y={y} k={k} o={o} fimbrias={1} sombra />;
  if (tipo === 'kleb') return <Bacilo x={x} y={y} k={k} o={o} capsula={1} largo={100} alto={56} sombra />;
  if (tipo === 'pseudo') return <Bacilo x={x} y={y} k={k} o={o} flagelo={1} reloj={reloj} sombra />;
  return <Bacilo x={x} y={y} k={k} o={o} largo={72} alto={54} capsula={0.5} sombra />;
}

/** Bacteria dentro de una burbuja de color (para tarjetas). */
function Burbuja({ x, y, c = G.mucoso[2], R = 100, children, o = 1 }: { x: number; y: number; c?: string; R?: number; children?: ReactNode; o?: number }) {
  return <En x={x} y={y} o={o}><circle r={R} fill={c} opacity={0.65} />{children}</En>;
}

const Cuatro: Lamina = ({ p, reloj }) => {
  const e: [Tipo, string, number][] = [['ecoli', 'E. coli', 240], ['kleb', 'Klebsiella', 590], ['acineto', 'Acinetobacter', 940], ['pseudo', 'Pseudomonas', 1260]];
  const n = ['ecoli', 'kleb', 'acineto', 'pseudo'];
  return (
    <g>
      <Bandera x={800} y={80} txt="Cuatro especies, cuatro estrategias" color="var(--cit-base)" p={p('ecoli')} t={34} punta="no" />
      {e.map(([t, txt, x], i) => <g key={t}><Sale p={p(n[i])} x={x} y={350}><Burbuja x={0} y={0} R={120} /><Esp x={0} y={0} k={1.2} tipo={t} reloj={reloj} /></Sale><Txt x={x} y={520} txt={txt} t={30} p={p(n[i])} color={TXTC.patogeno} /></g>)}
      <rect x={120} y={640} width={950} height={12} rx={6} fill="#2FB98A" opacity={tramo(p('tres'), 0, 0.5)} />
      <Txt x={590} y={700} txt="cápsula · adhesión · hierro · adaptación" t={32} p={p('tres')} color={TXTC.mucoso} />
      <rect x={1150} y={640} width={220} height={12} rx={6} fill="#E5324C" opacity={tramo(p('una'), 0, 0.5)} />
      <Txt x={1260} y={700} txt="toxinas" t={32} p={p('una')} color={TXTC.sangre} />
    </g>
  );
};

const Ecoli: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('frecuente')} x={800} y={200} k={0.9}><Burbuja x={0} y={0} R={110} /><Esp x={0} y={0} k={1.2} tipo="ecoli" /></Sale>
      <Txt x={800} y={340} txt="la gramnegativa que más aparece en las bacteriemias" t={28} p={p('frecuente')} />
      <Sale p={p('expec')} x={420} y={520}><rect x={-110} y={-46} width={220} height={92} rx={22} fill="#D9822B" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 40, fontWeight: 800 }} fill="#FFF">ExPEC</text></Sale>
      <Txt x={420} y={600} txt="cepas extraintestinales" t={24} p={p('expec')} />
      <Sale p={p('upec')} x={230} y={760} k={0.55}><Rinon /></Sale><Txt x={230} y={850} txt="UPEC · uropatógenas" t={24} p={p('upec')} />
      <Sale p={p('sepec')} x={620} y={760}><rect x={-96} y={-46} width={192} height={92} rx={46} fill="#5E1030" /><Hematie x={-40} y={0} k={0.5} /><Esp x={30} y={0} k={0.55} tipo="ecoli" /></Sale><Txt x={620} y={850} txt="SEPEC · sepsis" t={24} p={p('sepec')} />
      <Sale p={p('epec')} x={1130} y={520}><rect x={-110} y={-46} width={220} height={92} rx={22} fill="#7A45E6" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 40, fontWeight: 800 }} fill="#FFF">EPEC</text></Sale>
      <Txt x={1130} y={600} txt="intestinales" t={24} p={p('epec')} />
      <Sale p={p('ehec')} x={1420} y={520}><rect x={-120} y={-46} width={240} height={92} rx={22} fill="#7A45E6" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 36, fontWeight: 800 }} fill="#FFF">EHEC / STEC</text></Sale>
      <Sale p={p('noEquivale')} x={880} y={760}><rect x={-60} y={-40} width={120} height={80} rx={16} fill="#FFD23F" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 56, fontWeight: 800 }} fill="#3B1A6E">≠</text></Sale>
      <Txt x={1220} y={760} txt="no se equiparan automáticamente con UPEC" t={24} p={p('noEquivale')} />
    </g>
  );
};

const Subtipos: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={90} txt="Subtipos de E. coli" color="var(--cit-base)" p={p('b2')} t={34} punta="no" />
      {[['b2', 'B2', 330], ['d', 'D', 640]].map(([n, txt, x]) => <g key={n as string}><Sale p={p(n as string)} x={x as number} y={400}><circle r={110} fill="#7A45E6" /><circle cx={-8} cy={-8} r={98} fill="#B79BFF" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 90, fontWeight: 800 }} fill="#2A0A48">{txt}</text></Sale></g>)}
      <Txt x={485} y={580} txt="filogrupos con más factores de virulencia" t={26} p={p('d')} />
      <Sale p={p('st131')} x={1130} y={400}>
        {Array.from({ length: 7 }, (_, i) => <Esp key={i} x={Math.cos(i * 0.9) * 90} y={Math.sin(i * 0.9) * 70} k={0.45} tipo="ecoli" />)}
        <circle r={150} fill="none" stroke="#E5324C" strokeWidth={8} strokeDasharray="22 14" />
      </Sale>
      <Txt x={1130} y={620} txt="clon ST131: expansión y resistencia" t={26} p={p('st131')} />
      <Sale p={p('ctxm')} x={1130} y={780}><Tijera k={2.4} /></Sale>
      <Txt x={1130} y={880} txt="BLEE CTX-M" t={30} p={p('ctxm')} color={TXTC.sangre} />
    </g>
  );
};

const Origen: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('urinaria')} x={230} y={300} k={0.8}><Rinon /></Sale>
      <Flecha a={[230, 440]} b={[230, 640]} p={p('urinaria')} color={FLECHA} w={9} />
      <Txt x={230} y={400} txt="urinaria ascendente" t={22} p={p('urinaria')} />
      <Sale p={p('transloca')} x={560} y={300} k={0.45}><Enterocito /></Sale>
      <Flecha a={[560, 440]} b={[560, 640]} p={p('transloca')} color={FLECHA} w={9} />
      <Txt x={560} y={400} txt="translocación intestinal" t={22} p={p('transloca')} />
      <Sale p={p('urinaria')} x={400} y={760}><rect x={-300} y={-50} width={600} height={100} rx={50} fill="#5E1030" /><rect x={-290} y={-44} width={580} height={88} rx={44} fill="#7E1840" /><Hematie x={-150} y={0} k={0.5} /><Hematie x={150} y={0} k={0.5} /></Sale>
      <Sale p={p('capsula')} x={1140} y={330}><Esp x={0} y={0} k={1.7} tipo="kleb" /></Sale>
      <Sale p={p('fimbrias')} x={1140} y={330}><Esp x={0} y={0} k={1.7} tipo="ecoli" /></Sale>
      <Txt x={1140} y={470} txt="cápsula · fimbrias tipo 1 y P" t={26} p={p('fimbrias')} />
      <Txt x={1000} y={560} txt="adhesinas Afa/Dr" t={26} p={p('afa')} color={TXTC.ambar} />
      <Sale p={p('pic')} x={1300} y={640} k={0.6}><Neutrofilo /></Sale><Txt x={1300} y={720} txt="Pic reduce la actividad de los leucocitos" t={22} p={p('pic')} />
      <Sale p={p('biopelicula')} x={1130} y={860}>{Array.from({ length: 9 }, (_, i) => <Esp key={i} x={-200 + (i % 5) * 100} y={(i < 5 ? -16 : 22)} k={0.4} tipo="ecoli" />)}<path d="M-260,40 Q0,70 260,40 L260,60 Q0,90 -260,60 Z" fill={G.mucoso[1]} opacity={0.7} /></Sale>
      <Txt x={1130} y={945} txt="polisacárido extracelular: biopelícula" t={22} p={p('biopelicula')} />
    </g>
  );
};

const Nutrientes: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Sale p={p('hierro')} x={400} y={400}><Esp x={0} y={0} k={2.2} tipo="ecoli" /></Sale>
      {[0, 1, 2].map((i) => <g key={i} opacity={tramo(p('hierro'), i * 0.12, 0.5 + i * 0.12)}><circle cx={200 + i * 150 + 8 * Math.sin(reloj / 300 + i)} cy={620} r={22} fill="#C46A00" /><text x={200 + i * 150} y={629} textAnchor="middle" style={{ fontSize: 20, fontWeight: 800 }} fill="#FFF">Fe</text></g>)}
      <Txt x={350} y={700} txt="roba hierro con sideróforos" t={26} p={p('hierro')} />
      <Sale p={p('tonb')} x={400} y={800}><rect x={-14} y={-36} width={28} height={72} rx={12} fill="#0A7F86" /></Sale><Txt x={520} y={800} txt="sistemas TonB" t={26} p={p('tonb')} ancla="start" />
      <Sale p={p('nana')} x={960} y={420}><path d="M0,-50 l44,25 v50 l-44,25 l-44,-25 v-50 z" fill="#FF7A9A" /><path d="M0,-50 l44,25 l-44,25 l-44,-25 z" fill="#FFC0D0" /></Sale>
      <Txt x={960} y={540} txt="ácido siálico (NanA)" t={26} p={p('nana')} />
      <Sale p={p('varia')} x={1330} y={400}>{[110, 60, 150].map((h, i) => <rect key={i} x={-90 + i * 70} y={100 - h} width={50} height={h} rx={12} fill={['#E5324C', '#FF7A8A', '#FFB3BC'][i]} />)}</Sale>
      <Txt x={1330} y={560} txt="hemolisina y fimbrias P: resultados distintos" t={22} p={p('varia')} />
      <Txt x={1330} y={594} txt="según cepa, foco y modelo" t={22} p={p('varia')} fuerte={false} />
      <Txt x={1130} y={820} txt="una asociación clínica no equivale a un requisito universal" t={28} p={p('noRequisito')} color={TXTC.violeta} />
    </g>
  );
};

const Perfiles: Lamina = ({ p }) => {
  const c: [string, string, number, ReactNode][] = [
    ['clasico', 'clásico', 250, <Esp key="a" x={0} y={0} k={1.4} tipo="kleb" />],
    ['hiper', 'hipervirulento', 640, <g key="b"><Higado k={0.7} /><circle cx={30} cy={-10} r={34} fill="#FFF7C8" /></g>],
    ['carba', 'resistente a carbapenémicos', 1030, <g key="c"><Pastilla k={1.1} r={-20} color={['#C2410C', '#F97316', '#FFC48A']} /><Cruz x={0} y={0} k={1.2} /></g>],
    ['conv', 'convergente', 1380, <g key="d"><Esp x={-30} y={0} k={1.3} tipo="kleb" /><Pastilla x={60} y={40} k={0.7} color={['#C2410C', '#F97316', '#FFC48A']} /><circle cx={80} cy={-60} r={22} fill="#E5324C" /><text x={80} y={-52} textAnchor="middle" style={{ fontSize: 28, fontWeight: 800 }} fill="#FFF">!</text></g>],
  ];
  return (
    <g>
      <Bandera x={800} y={90} txt="Klebsiella pneumoniae: cuatro perfiles" color="var(--cit-base)" p={p('clasico')} t={34} punta="no" />
      {c.map(([n, txt, x, ic]) => <g key={n}><Sale p={p(n)} x={x} y={400}><Burbuja x={0} y={0} R={130} />{ic}</Sale><Txt x={x} y={600} txt={txt} t={26} p={p(n)} /></g>)}
      <Txt x={640} y={680} txt="absceso hepático, incluso sin comorbilidad" t={22} p={p('hiper')} fuerte={false} />
      <Txt x={1380} y={680} txt="resistencia + hipervirulencia: el que más preocupa" t={22} p={p('conv')} color={TXTC.sangre} />
    </g>
  );
};

const Capsula: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('capsula')} x={520} y={440}><circle r={190} fill={G.patogeno[2]} opacity={0.35} /><Esp x={0} y={0} k={2} tipo="kleb" /></Sale>
      <Txt x={520} y={690} txt="la cápsula: su arma" t={30} p={p('capsula')} color={TXTC.patogeno} />
      <Sale p={p('fago')} x={140} y={440} k={0.9}><Neutrofilo /></Sale>
      <Cruz x={290} y={440} k={1.2} p={p('fago')} />
      <Txt x={150} y={560} txt="fagocitosis" t={22} p={p('fago')} />
      <Sale p={p('opsono')} x={290} y={250}><circle r={20} fill="#FFD23F" /><text y={7} textAnchor="middle" style={{ fontSize: 18, fontWeight: 800 }} fill="#3B1A6E">C3b</text></Sale>
      <Txt x={290} y={200} txt="opsonización" t={22} p={p('opsono')} />
      <Sale p={p('comp')} x={520} y={190}><circle r={28} fill="#E0338A" /><circle r={16} fill="#FFD0F0" /></Sale><Cruz x={520} y={190} k={1} p={p('comp')} /><Txt x={520} y={140} txt="complemento" t={22} p={p('comp')} />
      <Sale p={p('sidero')} x={1130} y={300}>{[0, 1, 2].map((i) => <g key={i}><circle cx={-60 + i * 60} cy={0} r={22} fill="#C46A00" /><text x={-60 + i * 60} y={7} textAnchor="middle" style={{ fontSize: 18, fontWeight: 800 }} fill="#FFF">Fe</text></g>)}</Sale>
      <Txt x={1130} y={370} txt="los sideróforos captan hierro" t={26} p={p('sidero')} />
      <Sale p={p('hif')} x={1130} y={560} k={0.8}><Pulmones /></Sale>
      <Txt x={1130} y={720} txt="interacción con HIF-1α: diseminación" t={24} p={p('hif')} />
      <Sale p={p('noSinonimo')} x={1130} y={870}><rect x={-60} y={-36} width={120} height={72} rx={16} fill="#FFD23F" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 50, fontWeight: 800 }} fill="#3B1A6E">≠</text></Sale>
      <Txt x={1350} y={870} txt="hipermucoviscosidad e hipervirulencia" t={20} p={p('noSinonimo')} ancla="end" />
    </g>
  );
};

const Nicho: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={90} txt="Especificidad del nicho" color="var(--cit-base)" p={p('gltA')} t={34} punta="no" />
      <Sale p={p('gltA')} x={300} y={400}><rect x={-80} y={-40} width={160} height={80} rx={20} fill="#7A45E6" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 40, fontWeight: 800 }} fill="#FFF">GltA</text></Sale>
      <Txt x={300} y={500} txt="citrato sintasa" t={24} p={p('gltA')} />
      <Sale p={p('higado')} x={760} y={380} k={0.9}><Higado /></Sale><Sale p={p('higado')} x={1020} y={400} k={0.7}><Bazo /></Sale>
      <Txt x={880} y={560} txt="importa en hígado y bazo (modelo)" t={24} p={p('higado')} />
      <Sale p={p('sangre')} x={1360} y={400}><rect x={-120} y={-50} width={240} height={100} rx={50} fill="#5E1030" /><Hematie x={-50} y={0} k={0.55} /><Esp x={50} y={0} k={0.5} tipo="kleb" /></Sale>
      <Txt x={1360} y={500} txt="no es imprescindible en sangre" t={24} p={p('sangre')} />
      <Sale p={p('sinExo')} x={800} y={760}><Esp x={0} y={0} k={1.6} tipo="kleb" /><Cruz x={140} y={0} k={1.3} /></Sale>
      <Txt x={800} y={880} txt="sin exotoxinas potentes: destacan cápsula, adhesión, hierro y metabolismo" t={26} p={p('sinExo')} />
    </g>
  );
};

const Humedo: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Sale p={p('humedo')} x={320} y={380}><path d="M0,-130 C60,-50 90,10 90,52 C90,110 50,140 0,140 C-50,140 -90,110 -90,52 C-90,10 -60,-50 0,-130 Z" fill="#2E78F2" /><path d="M0,-118 C52,-46 80,10 80,52 C80,100 46,128 0,128 C-46,128 -80,100 -80,52 C-80,10 -52,-46 0,-118 Z" fill="#5AA8FF" /><Esp x={0} y={40} k={0.9} tipo="pseudo" reloj={reloj} /></Sale>
      <Txt x={320} y={590} txt="nichos húmedos" t={28} p={p('humedo')} />
      <Sale p={p('neumonia')} x={730} y={400} k={0.9}><Pulmones infiltrados={1} /></Sale>
      <Txt x={730} y={600} txt="infección sanitaria y neumonía" t={26} p={p('neumonia')} />
      <Sale p={p('quemadura')} x={1100} y={400}><path d="M0,-90 C50,-30 70,10 30,60 C10,80 -10,80 -30,60 C-70,10 -50,-30 0,-90 Z" fill="#FF7A3D" /><path d="M0,-40 C26,0 30,30 0,50 C-30,30 -26,0 0,-40 Z" fill="#FFD23F" /></Sale>
      <Txt x={1100} y={600} txt="quemaduras, heridas y tejidos blandos" t={26} p={p('quemadura')} />
      <Sale p={p('ectima')} x={1400} y={400}><circle r={96} fill="#F6CDB8" /><circle r={58} fill="#2A0A48" /><circle r={36} fill="#7E1840" /><circle r={96} fill="none" stroke="#E5324C" strokeWidth={10} opacity={0.7} /></Sale>
      <Txt x={1400} y={600} txt="ectima gangrenoso" t={26} p={p('ectima')} color={TXTC.sangre} />
      <Txt x={1400} y={640} txt="en inmunocomprometidos" t={22} p={p('ectima')} fuerte={false} />
    </g>
  );
};

const T3ss: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('t3ss')} x={800} y={170}><Esp x={0} y={0} k={1.7} tipo="pseudo" /><rect x={-6} y={26} width={12} height={150} rx={6} fill="#2A0A48" /><rect x={-3} y={26} width={6} height={150} rx={3} fill="#FFD23F" /></Sale>
      <Txt x={800} y={380} txt="el sistema de secreción tipo 3 inyecta efectores" t={26} p={p('t3ss')} />
      <rect x={160} y={400} width={1280} height={200} rx={90} fill={G.epitelio[1]} opacity={tramo(p('t3ss'), 0.4, 1)} />
      <Sale p={p('exou')} x={440} y={500}><circle r={32} fill={G.toxina[1]} /><path d="M-70,50 l140,0" stroke="#FFF" strokeWidth={6} strokeDasharray="10 8" /></Sale>
      <Txt x={440} y={680} txt="ExoU: fosfolipasa, daña membranas" t={26} p={p('exou')} />
      <Sale p={p('exos')} x={1100} y={500}>{[-60, -20, 20, 60].map((dx, i) => <path key={i} d={`M${dx},-50 q${i % 2 ? 18 : -18},50 0,100`} fill="none" stroke="#FFD23F" strokeWidth={9} strokeLinecap="round" />)}</Sale>
      <Txt x={1100} y={680} txt="ExoS y ExoT: alteran la actina" t={26} p={p('exos')} />
      <Sale p={p('rara')} x={770} y={500}><rect x={-60} y={-36} width={120} height={72} rx={16} fill="#FFD23F" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 50, fontWeight: 800 }} fill="#3B1A6E">≠</text></Sale>
      <Txt x={800} y={830} txt="ExoU y ExoS rara vez coinciden en la misma cepa" t={28} p={p('rara')} color={TXTC.violeta} />
    </g>
  );
};

const SinT3: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={90} txt="También daña sin ese sistema" color="var(--cit-base)" p={p('exla')} t={32} punta="no" />
      <Sale p={p('exla')} x={420} y={380}><circle r={70} fill={G.toxina[1]} /><circle cx={-18} cy={-18} r={22} fill="#FFF" opacity={0.7} /></Sale>
      <Txt x={420} y={500} txt="ExlA" t={34} p={p('exla')} color={TXTC.verde} />
      <Sale p={p('necrosis')} x={420} y={640}><circle r={70} fill="#3A1A10" /><circle r={46} fill="#7E1840" /></Sale>
      <Txt x={420} y={760} txt="necrosis: rompe barreras vasculares" t={26} p={p('necrosis')} />
      <Sale p={p('lasb')} x={1160} y={380}><Tijera k={2.8} /></Sale>
      <Txt x={1160} y={500} txt="LasB (sistema tipo 2)" t={34} p={p('lasb')} color={TXTC.verde} />
      <Sale p={p('cadherinas')} x={1160} y={650}>{[0, 1, 2].map((i) => <rect key={i} x={-90} y={-40 + i * 40} width={180} height={12} rx={6} fill="#FFD23F" opacity={1 - 0.2 * i} />)}</Sale>
      <Txt x={1160} y={790} txt="degrada la matriz y las cadherinas del endotelio" t={26} p={p('cadherinas')} />
    </g>
  );
};

const Persistir: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('superficies')} x={420} y={420}><Cama ancho={420} k={1} /></Sale>
      {[0, 1, 2, 3].map((i) => <Esp key={i} x={300 + i * 70} y={330 + (i % 2) * 20} k={0.45 * tramo(p('superficies'), i * 0.1, 0.5)} tipo="acineto" />)}
      <Txt x={420} y={570} txt="persiste en superficies y equipos" t={26} p={p('superficies')} />
      <Sale p={p('biopelicula')} x={420} y={700}><path d="M-200,0 Q-100,-50 0,0 T200,0 L200,60 Q100,100 0,60 T-200,60 Z" fill={G.mucoso[1]} opacity={0.8} />{[-120, -40, 40, 120].map((cx, i) => <Esp key={i} x={cx} y={10 + (i % 2) * 20} k={0.38} tipo="acineto" />)}</Sale>
      <Txt x={420} y={830} txt="forma biopelículas" t={26} p={p('biopelicula')} />
      <Sale p={p('sangre')} x={1170} y={420}><rect x={-200} y={-60} width={400} height={120} rx={60} fill="#5E1030" /><rect x={-190} y={-52} width={380} height={104} rx={52} fill="#7E1840" /><Hematie x={-100} y={0} k={0.55} /><Esp x={30} y={-6} k={0.5} tipo="acineto" /><Esp x={110} y={20} k={0.5} tipo="acineto" /></Sale>
      <Txt x={1170} y={560} txt="en la sangre: menos adhesión, más dispersión" t={26} p={p('sangre')} />
      <Sale p={p('mltb')} x={1170} y={720}><circle r={60} fill="#FFF7E8" /><circle r={46} fill="none" stroke="#D9822B" strokeWidth={10} strokeDasharray="30 12" /></Sale>
      <Txt x={1170} y={830} txt="MltB remodela la pared: resiste el estrés y el suero" t={24} p={p('mltb')} />
    </g>
  );
};

const Evadir: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('capsula')} x={330} y={380}><circle r={150} fill={G.patogeno[2]} opacity={0.35} /><Esp x={0} y={0} k={1.8} tipo="acineto" /></Sale>
      <Txt x={330} y={570} txt="cápsula" t={30} p={p('capsula')} />
      <Sale p={p('plasminogeno')} x={720} y={380}><circle r={56} fill="#2F6FD8" /><circle r={44} fill="#5AA8FF" /></Sale>
      <Txt x={720} y={480} txt="une plasminógeno: resiste al complemento" t={24} p={p('plasminogeno')} />
      <Sale p={p('hierro')} x={1150} y={380}>{[0, 1, 2].map((i) => <g key={i}><circle cx={-70 + i * 70} cy={0} r={26} fill="#C46A00" /><text x={-70 + i * 70} y={8} textAnchor="middle" style={{ fontSize: 22, fontWeight: 800 }} fill="#FFF">Fe</text></g>)}</Sale>
      <Txt x={1150} y={480} txt="hierro: feoB, fepA y pntB" t={26} p={p('hierro')} />
      <Sale p={p('parecido')} x={800} y={760}><Esp x={-260} y={0} k={1} tipo="acineto" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 80, fontWeight: 800 }} fill="#FFD23F">≈</text><Esp x={140} y={0} k={1} tipo="kleb" /><Esp x={300} y={0} k={1} tipo="ecoli" /></Sale>
      <Txt x={800} y={880} txt="más parecida a Klebsiella y E. coli que a Pseudomonas: sin exotoxinas potentes" t={26} p={p('parecido')} />
    </g>
  );
};

const Otras: Lamina = ({ p }) => {
  const c: [string, string, number, number][] = [['serratia', 'Serratia marcescens', 330, 300], ['citrobacter', 'Citrobacter freundii', 800, 300], ['proteus', 'Proteus mirabilis', 1270, 300], ['enterobacter', 'complejo Enterobacter cloacae', 330, 600], ['kpc', 'complejo K. pneumoniae', 800, 600], ['acb', 'complejo A. calcoaceticus–baumannii', 1270, 600]];
  return (
    <g>
      <Bandera x={800} y={90} txt="Y hay más" color="var(--cit-base)" p={p('serratia')} t={34} punta="no" />
      {c.map(([n, txt, x, y], i) => <g key={n}><Sale p={p(n)} x={x} y={y}><Burbuja x={0} y={0} R={80} /><Esp x={0} y={0} k={0.9} tipo={(['ecoli', 'kleb', 'pseudo', 'ecoli', 'kleb', 'acineto'] as Tipo[])[i]} /></Sale><Txt x={x} y={y + 120} txt={txt} t={24} p={p(n)} /></g>)}
      <Txt x={800} y={880} txt="no atribuir todo el complejo a A. baumannii" t={30} p={p('noTodo')} color={TXTC.violeta} />
    </g>
  );
};

const Blee: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Sale p={p('blee')} x={330} y={400}><Esp x={0} y={0} k={1.8} tipo="ecoli" /></Sale>
      <Txt x={330} y={540} txt="E. coli con BLEE" t={30} p={p('blee')} color={TXTC.patogeno} />
      <Sale p={p('hidroliza')} x={800} y={400}><rect x={-44} y={-44} width={88} height={88} rx={16} fill="#FFB21E" /><rect x={-24} y={-24} width={48} height={48} rx={10} fill="#FFE08A" /></Sale>
      <Sale p={p('hidroliza')} x={800} y={400} k={2.4}><Tijera corta={p('hidroliza')} /></Sale>
      <Txt x={800} y={560} txt="hidroliza penicilinas y cefalosporinas de 3.ª generación" t={24} p={p('hidroliza')} />
      <Sale p={p('inhibidor')} x={1230} y={380}><path d="M0,-70 C28,-52 56,-48 62,-46 C62,10 44,52 0,76 C-44,52 -62,10 -62,-46 C-56,-48 -28,-52 0,-70 Z" fill="#2F6FD8" /></Sale>
      <Txt x={1230} y={500} txt="clavulanato · tazobactam" t={24} p={p('inhibidor')} /><Txt x={1230} y={536} txt="la frenan, con límites" t={22} p={p('inhibidor')} fuerte={false} />
      <Sale p={p('carbapenem')} x={800} y={760}><Pastilla k={1.3} color={['#138A3A', '#3FD467', '#B5F5C4']} /><path d="M-70,-70 C-30,-100 30,-100 70,-70 L70,0" fill="none" stroke="#2F6FD8" strokeWidth={10} strokeLinecap="round" /></Sale>
      <Txt x={800} y={870} txt="los carbapenémicos resisten esa hidrólisis" t={28} p={p('carbapenem')} color={TXTC.verde} />
      <PildoraFlota x={1430} y={780} k={1.1} rl={reloj} p={p('farmaco')} />
      <Bandera x={1430} y={920} txt={TXT_FARMACO} color="#2F6FD8" p={p('farmaco')} t={22} punta="no" />
    </g>
  );
};

const Kpc: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('kpc')} x={400} y={360}><Tijera k={2.6} /></Sale>
      <Txt x={400} y={470} txt="KPC: carbapenemasa de serina" t={28} p={p('kpc')} />
      <Sale p={p('avibactam')} x={400} y={620}><path d="M0,-70 C28,-52 56,-48 62,-46 C62,10 44,52 0,76 C-44,52 -62,10 -62,-46 C-56,-48 -28,-52 0,-70 Z" fill="#138A3A" /></Sale>
      <Txt x={400} y={740} txt="se inhibe con avibactam" t={28} p={p('avibactam')} color={TXTC.verde} />
      <Sale p={p('zinc')} x={1130} y={360}><Tijera k={2.6} /><circle cx={70} cy={-60} r={26} fill="#7F93A8" /><text x={70} y={-52} textAnchor="middle" style={{ fontSize: 22, fontWeight: 800 }} fill="#FFF">Zn</text></Sale>
      <Txt x={1130} y={470} txt="metalo-β-lactamasas: NDM y VIM" t={28} p={p('ndm')} />
      <Sale p={p('ndm')} x={1130} y={620}><path d="M0,-70 C28,-52 56,-48 62,-46 C62,10 44,52 0,76 C-44,52 -62,10 -62,-46 C-56,-48 -28,-52 0,-70 Z" fill="#138A3A" opacity={0.35} /><Cruz x={0} y={0} k={1.6} /></Sale>
      <Txt x={1130} y={740} txt="el avibactam no las inhibe" t={28} p={p('ndm')} color={TXTC.sangre} />
      <Sale p={p('convergente')} x={800} y={880}><rect x={-300} y={-34} width={600} height={68} rx={20} fill="#E0338A" /></Sale>
      <Txt x={800} y={880} txt="por eso el perfil convergente preocupa tanto" t={26} p={p('convergente')} color="#FFF" />
    </g>
  );
};

const Pseudo: Lamina = ({ p, reloj }) => {
  const pills: [string, string, number, string[]][] = [['betalact', 'β-lactámicos antipseudomónicos', 220, ['#1E56C6', '#3B82F0', '#BFDBFF']], ['amino', 'aminoglucósidos', 560, ['#C2410C', '#F97316', '#FFC48A']], ['fluoro', 'fluoroquinolonas', 900, ['#138A3A', '#3FD467', '#B5F5C4']], ['polimixina', 'polimixinas', 1240, ['#7E1840', '#C2364E', '#FFC0C5']]];
  return (
    <g>
      <Sale p={p('betalact')} x={1480} y={330}><Esp x={0} y={0} k={1.3} tipo="pseudo" reloj={reloj} /></Sale>
      {pills.map(([n, txt, x, c]) => <g key={n}><Sale p={p(n)} x={x} y={280}><Pastilla k={1.1} r={-15} color={c} /></Sale><Txt x={x} y={370} txt={txt} t={22} p={p(n)} /></g>)}
      <Sale p={p('eflujo')} x={300} y={640}><rect x={-60} y={-50} width={120} height={100} rx={26} fill="#0A7F86" /><rect x={-26} y={-60} width={52} height={120} rx={20} fill="#16B9BE" /><path d="M0,-90 l0,-60 m-20,20 l20,-20 l20,20" stroke="#E5324C" strokeWidth={9} fill="none" strokeLinecap="round" /></Sale>
      <Txt x={300} y={780} txt="bombas de eflujo (MexAB-OprM)" t={24} p={p('eflujo')} />
      <Sale p={p('ampc')} x={800} y={640}><Tijera k={2.4} /></Sale>
      <Txt x={800} y={780} txt="cefalosporinasa AmpC" t={24} p={p('ampc')} />
      <Sale p={p('porina')} x={1300} y={640}><rect x={-30} y={-60} width={60} height={120} rx={26} fill="#2A0A48" /></Sale>
      <Cruz x={1300} y={640} k={1.6} p={p('porina')} />
      <Txt x={1300} y={780} txt="pérdida de porinas" t={24} p={p('porina')} />
      <Txt x={800} y={900} txt="resiste por tres frentes" t={32} p={p('eflujo')} color={TXTC.sangre} />
    </g>
  );
};

const Acineto: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Sale p={p('carba')} x={400} y={370}><Pastilla k={1.6} r={-20} color={['#138A3A', '#3FD467', '#B5F5C4']} /></Sale>
      <Txt x={400} y={480} txt="carbapenémicos" t={30} p={p('carba')} />
      <Sale p={p('sulbactam')} x={800} y={370}><Pastilla k={1.6} r={20} color={['#1E56C6', '#3B82F0', '#BFDBFF']} /></Sale>
      <Txt x={800} y={480} txt="sulbactam" t={30} p={p('sulbactam')} />
      <Sale p={p('oxa')} x={1230} y={370}><Esp x={0} y={0} k={1.6} tipo="acineto" /><circle cx={70} cy={-60} r={28} fill="#E5324C" /><text x={70} y={-50} textAnchor="middle" style={{ fontSize: 22, fontWeight: 800 }} fill="#FFF">OXA</text></Sale>
      <Txt x={1230} y={480} txt="con carbapenemasa OXA…" t={26} p={p('oxa')} />
      <Sale p={p('polimixina')} x={1230} y={700}><Pastilla k={1.6} color={['#7E1840', '#C2364E', '#FFC0C5']} /></Sale>
      <Txt x={1230} y={810} txt="…las polimixinas" t={30} p={p('polimixina')} />
      <PildoraFlota x={400} y={760} k={1.2} rl={reloj} p={p('carba')} />
      <Bandera x={400} y={900} txt={TXT_FARMACO} color="#2F6FD8" p={p('carba')} t={24} punta="no" />
    </g>
  );
};

const Examen: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Bandera x={800} y={90} txt="Pregunta de examen" color={V.sangre[0]} p={p('pregunta')} t={36} punta="no" />
      <Txt x={800} y={190} txt="¿cuál usa las toxinas como estrategia principal?" t={32} p={p('toxinas')} />
      <Sale p={p('pseudo')} x={360} y={420}><Burbuja x={0} y={0} R={130} /><Esp x={0} y={0} k={1.5} tipo="pseudo" reloj={reloj} /></Sale>
      <Txt x={360} y={600} txt="Pseudomonas: ExoU, ExoS, ExlA, LasB" t={26} p={p('pseudo')} color={TXTC.sangre} />
      <Txt x={1090} y={320} txt="¿y cuáles se apoyan en…?" t={30} p={p('otras')} />
      {[['capsula', 'cápsula', 860], ['hierro', 'hierro', 1090], ['adaptacion', 'adaptación', 1330]].map(([n, txt, x]) => <Txt key={n as string} x={x as number} y={400} txt={txt as string} t={34} p={p(n as string)} color={TXTC.mucoso} />)}
      {[['ecoli', 880], ['kleb', 1100], ['acineto', 1320]].map(([t, x]) => <Sale key={t as string} p={p('adaptacion')} x={x as number} y={560}><Burbuja x={0} y={0} R={90} /><Esp x={0} y={0} k={1} tipo={t as Tipo} /></Sale>)}
      <Txt x={1100} y={700} txt="E. coli · Klebsiella · Acinetobacter" t={28} p={p('adaptacion')} color={TXTC.patogeno} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Cuatro, Ecoli, Subtipos, Origen, Nutrientes, Perfiles, Capsula, Nicho, Humedo, T3ss, SinT3, Persistir, Evadir, Otras, Blee, Kpc, Pseudo, Acineto, Examen];
export default LAMINAS;
