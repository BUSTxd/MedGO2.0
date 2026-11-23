'use client';
// Capítulo 1 · Sepsis, choque séptico y disfunción multiorgánica (vistazo gratis)

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Bandera, Barra, Bola, Cerebro, Corazon, Cruz, Diplococo, Domino, Flecha, Flota, Gota, Higado, Hombre, Manometro, Persona, PlaqAct, Pulmones, Respira, Rinon, S, Sale, Termometro, TuboEnsayo, Txt, Visto, clamp, easeOut, lerp, tramo } from '../Piezas';

/** Un órgano con su halo de alarma (rojo, late) o de calma (verde). */
const Organo = ({ x, y, alarma = 0, reloj, children }: { x: number; y: number; alarma?: number; reloj: number; children: ReactNode }) => (
  <g>
    <circle cx={x} cy={y} r={96 + 7 * Math.sin(reloj / 260)} fill={S.il1[1]} opacity={0.2 * clamp(alarma)} />
    <g transform={`translate(${x},${y})`}>{children}</g>
  </g>
);

// ─── 0 · No es «una infección grave» ─────────────────────────────────────────
const NoEsInfeccion: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="Sepsis-3 · 2016" color={S.il6[0]} p={p('sepsis3')} t={32} punta="no" />
    <Sale p={p('grave')} x={290} y={420} k={1.15}><Flota x={0} y={0} rl={reloj} alto={4}><Diplococo reloj={reloj} capsula={0.7} /></Flota></Sale>
    <Bandera x={290} y={600} txt="una infección grave" color={S.menin[0]} p={p('grave')} t={28} punta="no" />
    <Sale p={p('no')} x={290} y={420} k={1.8}><Cruz /></Sale>
    <Flecha a={[430, 430]} b={[610, 430]} p={tramo(p('microbio'), 0, 0.9)} color={S.menin[1]} w={8} />
    <Bandera x={290} y={260} txt="el microbio" color={S.menin[0]} p={p('microbio')} t={26} punta="abajo" />
    <Sale p={p('cuerpo')} x={800} y={430} k={1.6}><Respira reloj={reloj} periodo={1100} amp={0.04}><Manometro x={0} y={0} val={0.94} /></Respira></Sale>
    <Bandera x={800} y={640} txt="la respuesta del huésped" color={S.il1[0]} p={p('cuerpo')} t={28} punta="no" />
    <Bandera x={800} y={730} txt="desregulada" color={S.il1[0]} p={p('desregulada')} t={40} punta="no" />
    <Flecha a={[990, 430]} b={[1130, 430]} p={tramo(p('desregulada'), 0, 0.9)} color={S.il1[1]} w={8} />
    {[[1260, 280, <Cerebro key="c" k={0.5} />], [1450, 430, <Pulmones key="p" k={0.5} />], [1260, 600, <Rinon key="r" k={0.62} />]].map(([x, y, el], i) => (
      <Organo key={i} x={x as number} y={y as number} alarma={tramo(p('disfuncion'), i * 0.2, i * 0.2 + 0.5)} reloj={reloj}>{el as ReactNode}</Organo>
    ))}
    <Bandera x={1330} y={790} txt="disfunción orgánica" color={S.il1[0]} p={p('disfuncion')} t={40} punta="no" />
    <Txt x={800} y={920} txt="no importa tanto cuán grande es el microbio: importa lo que hace el cuerpo" t={28} p={p('importa')} />
  </g>
);

// ─── 1 · Cómo se mide la disfunción: el SOFA ─────────────────────────────────
const Sofa: Lamina = ({ p, reloj }) => {
  const sistemas: [string, string, ReactNode][] = [
    ['resp', 'respiratorio', <Pulmones key="a" k={0.5} />],
    ['coag', 'coagulación', <PlaqAct key="b" k={2.6} />],
    ['higado', 'hígado', <Higado key="c" k={0.17} />],
    ['cardio', 'cardiovascular', <Corazon key="d" k={0.42} />],
    ['neuro', 'neurológico', <Cerebro key="e" k={0.48} />],
    ['rinon', 'riñón', <Rinon key="f" k={0.6} />],
  ];
  const sube = easeOut(p('sube'));
  return (
    <g>
      <Bandera x={800} y={95} txt="SOFA · seis sistemas" color={S.il6[0]} p={p('sofa')} t={34} punta="no" />
      {sistemas.map(([clave, nombre, icono], i) => {
        const x = 190 + i * 244, q = p(clave);
        return (
          <g key={clave}>
            <Sale p={q} x={x} y={400}>{icono}</Sale>
            <circle cx={x} cy={600} r={22} fill={S.gris[1]} opacity={tramo(q, 0, 0.2)} />
            <circle cx={x} cy={600} r={22 + 4 * Math.sin(reloj / 300 + i)} fill={S.lactato[1]} opacity={tramo(q, 0.3, 0.8) * 0.9} />
            <circle cx={x - 7} cy={593} r={6} fill="#FFF" opacity={0.6 * tramo(q, 0, 0.3)} />
            <Bandera x={x} y={690} txt={nombre} color={S.il6[0]} p={q} t={22} punta="no" />
          </g>
        );
      })}
      <path d="M180,850 L1420,850" stroke="var(--cit-texto-2)" strokeWidth={8} strokeLinecap="round" opacity={0.35 * tramo(p('numero'), 0, 0.4)} />
      {[0, 1, 2, 3, 4, 5, 6].map((n) => <g key={n} opacity={tramo(p('numero'), 0, 0.4)}><path d={`M${260 + n * 180},838 L${260 + n * 180},862`} stroke="var(--cit-texto-2)" strokeWidth={5} strokeLinecap="round" opacity={0.5} /><Txt x={260 + n * 180} y={900} txt={String(n)} t={24} fuerte={false} /></g>)}
      <Sale p={p('numero')} x={lerp(260, 620, sube)} y={820} k={1}><Bola R={26} tono={S.lactato as unknown as string[]} /></Sale>
      <Bandera x={620} y={775} txt="+2 puntos de golpe" color={S.il1[0]} p={p('sube')} t={30} punta="abajo" />
      <Bandera x={1250} y={800} txt="un termómetro de órganos" color={S.il6[0]} p={p('termo')} t={28} punta="no" />
    </g>
  );
};

// ─── 2 · qSOFA: una alarma, no un diagnóstico ────────────────────────────────
const QSofa: Lamina = ({ p, reloj }) => {
  const alarmas: { x: number; clave: string; icono: ReactNode; txt: string; enciende: number }[] = [
    { x: 330, clave: 'fr', icono: <Pulmones k={0.42} />, txt: 'respiración ≥ 22 /min', enciende: p('treinta') },
    { x: 800, clave: 'pas', icono: <Manometro x={0} y={-20} k={0.9} val={0.4} />, txt: 'presión sistólica ≤ 100', enciende: 0 },
    { x: 1270, clave: 'mente', icono: <Cerebro k={0.45} />, txt: 'mente alterada', enciende: p('desor') },
  ];
  return (
    <g>
      <Bandera x={800} y={95} txt="qSOFA · tres señales junto a la cama" color={S.il6[0]} p={p('kiu')} t={32} punta="no" />
      {alarmas.map((a, i) => (
        <g key={a.clave}>
          <Sale p={p(a.clave)} x={a.x} y={380}>
            <circle r={150 + 8 * Math.sin(reloj / 280 + i)} fill={S.il1[1]} opacity={0.22 * tramo(a.enciende, 0, 0.5)} />
            <Bola R={128} tono={(a.enciende > 0.3 ? S.il1 : S.gris) as unknown as string[]} />
            <g transform="translate(0,6)">{a.icono}</g>
          </Sale>
          <Bandera x={a.x} y={570} txt={a.txt} color={S.il6[0]} p={p(a.clave)} t={26} punta="no" />
        </g>
      ))}
      <Sale p={p('ciento8')} x={800} y={380} k={1.7}><Visto /></Sale>
      <Txt x={800} y={650} txt="se salva por poco: 108" t={28} p={p('ciento8')} color="var(--se-verde)" />
      <Bandera x={330} y={650} txt="la abuela: 30 /min" color={S.il1[0]} p={p('treinta')} t={26} punta="no" />
      <Bandera x={1270} y={650} txt="la abuela: desorientada" color={S.il1[0]} p={p('desor')} t={26} punta="no" />
      <Sale p={p('dos')} x={800} y={810} k={1}><text textAnchor="middle" fontSize={110} fontWeight={800} fill="var(--se-sangre)">2 de 3</text></Sale>
      <Bandera x={800} y={920} txt="es una alarma, no un diagnóstico" color={S.il1[0]} p={p('alarma')} t={32} punta="no" />
    </g>
  );
};

// ─── 3 · Bacteriemia no es sepsis ────────────────────────────────────────────
const Bacteriemia: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={420} y={95} txt="bacteriemia" color={S.menin[0]} p={p('bacteriemia')} t={36} punta="no" />
    <Sale p={p('bacterias')} x={420} y={380} k={1.9}><Gota tono={S.sangre as unknown as string[]} /></Sale>
    {[[-24, 8], [20, 40], [-4, -34]].map(([dx, dy], i) => <Diplococo key={i} x={420 + dx * 1.7} y={400 + dy * 1.7 + Math.sin(reloj / 500 + i) * 5} k={0.34} r={i * 40} reloj={reloj} fase={i} pili={0.5} o={tramo(p('bacterias'), 0.2 + i * 0.15, 0.6 + i * 0.15)} />)}
    <Bandera x={420} y={560} txt="bacterias en la sangre" color={S.menin[0]} p={p('bacterias')} t={26} punta="no" />
    <Sale p={p('ninguno')} x={300} y={720} k={0.7}><Rinon /></Sale>
    <Sale p={p('ninguno')} x={540} y={720} k={0.6}><Cerebro /></Sale>
    <g transform="translate(320,650)" opacity={tramo(p('ninguno'), 0.3, 0.8)}><Visto k={0.9} /></g>
    <Bandera x={420} y={850} txt="sin disfunción de ningún órgano" color={S.gluco[0]} p={p('ninguno')} t={26} punta="no" />
    <path d="M800,180 L800,830" stroke="var(--cit-texto-2)" strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" opacity={0.4 * tramo(p('alreves'), 0, 0.5)} />
    <Bandera x={1180} y={95} txt="sepsis" color={S.il1[0]} p={p('alreves')} t={36} punta="no" />
    <Sale p={p('negativos')} x={1180} y={380} k={1.1}><TuboEnsayo color="#FFE9B8" nivel={0.55} reloj={reloj} /></Sale>
    <Sale p={p('negativos')} x={1300} y={300} k={1.6}><Cruz /></Sale>
    <Bandera x={1180} y={600} txt="hemocultivos negativos" color={S.il1[0]} p={p('negativos')} t={26} punta="no" />
    {[[1050, 730, <Rinon key="r" k={0.6} />], [1180, 730, <Pulmones key="p" k={0.42} />], [1320, 730, <Cerebro key="c" k={0.5} />]].map(([x, y, el], i) => (
      <Organo key={i} x={x as number} y={y as number} alarma={tramo(p('alreves'), 0.3 + i * 0.15, 0.8 + i * 0.15)} reloj={reloj}>{el as ReactNode}</Organo>
    ))}
    <Bandera x={1180} y={850} txt="con los órganos fallando" color={S.il1[0]} p={p('negativos')} t={26} punta="no" />
    <Bandera x={420} y={950} txt="un microbio en la sangre es un dato" color={S.menin[0]} p={p('dato')} t={28} punta="no" />
    <Bandera x={1180} y={950} txt="la disfunción es el diagnóstico" color={S.il1[0]} p={p('diagnostico')} t={28} punta="no" />
  </g>
);

// ─── 4 · Choque séptico ──────────────────────────────────────────────────────
const Choque: Lamina = ({ p, reloj }) => {
  const circulos: { r: number; color: readonly string[]; txt: string; clave: string; ty: number }[] = [
    { r: 310, color: S.menin, txt: 'infección', clave: 'peor', ty: -250 },
    { r: 225, color: S.il1, txt: 'sepsis', clave: 'peor', ty: -150 },
    { r: 120, color: S.il6, txt: 'choque séptico', clave: 'choque', ty: 6 },
  ];
  return (
    <g>
      <Sale p={p('peor')} x={420} y={520}>
        {circulos.map((c, i) => <g key={i} opacity={tramo(p(c.clave), i === 2 ? 0 : i * 0.2, i === 2 ? 0.5 : 0.6 + i * 0.2)}><circle r={c.r + 5 * Math.sin(reloj / 400 + i)} fill={c.color[1]} opacity={0.24} /><circle r={c.r + 5 * Math.sin(reloj / 400 + i)} fill="none" stroke={c.color[1]} strokeWidth={7} /></g>)}
      </Sale>
      {circulos.map((c, i) => <Bandera key={i} x={420} y={520 + c.ty} txt={c.txt} color={c.color[0]} p={p(c.clave)} t={i === 2 ? 28 : 26} punta="no" />)}
      <Bandera x={420} y={900} txt="mortalidad hospitalaria > 40 %" color={S.il1[0]} p={p('mortalidad')} t={26} punta="no" />
      <Barra x={1000} y={170} w={440} h={36} val={0.4} color={S.il1[1]} txt="mortalidad" valor="> 40 %" p={p('cuarenta')} />
      <Sale p={p('vaso')} x={1030} y={420} k={1.15}><Manometro x={0} y={0} val={0.5} /></Sale>
      <Bandera x={1030} y={560} txt="vasopresores para sostener" color={S.nfkb[0]} p={p('vaso')} t={24} punta="no" />
      <Bandera x={1030} y={625} txt="PAM ≥ 65 mmHg" color={S.nfkb[0]} p={p('pam')} t={30} punta="no" />
      <Txt x={1230} y={470} txt="y" t={60} p={p('dos')} />
      <Sale p={p('lactato')} x={1400} y={430} k={1.1}><Gota tono={S.lactato as unknown as string[]} /></Sale>
      <Bandera x={1400} y={560} txt="lactato" color={S.lactato[0]} p={p('lactato')} t={26} punta="no" />
      <Bandera x={1400} y={625} txt="> 2 mmol/L" color={S.lactato[0]} p={p('dosmmol')} t={30} punta="no" />
      <Bandera x={1210} y={780} txt="aun con líquidos adecuados" color={S.c5a[0]} p={p('liquidos')} t={26} punta="no" />
      <Bandera x={1210} y={880} txt="las dos a la vez, no una sola" color={S.il6[0]} p={p('ambas')} t={32} punta="no" />
    </g>
  );
};

// ─── 5 · Disfunción multiorgánica: fichas de dominó ──────────────────────────
const Multiorganica: Lamina = ({ p }) => {
  const fichas: { clave: string; el: ReactNode; nombre: string }[] = [
    { clave: 'pulmon', el: <Pulmones k={0.3} />, nombre: 'pulmón' },
    { clave: 'rinon', el: <Rinon k={0.38} />, nombre: 'riñón' },
    { clave: 'cerebro', el: <Cerebro k={0.34} />, nombre: 'cerebro' },
    { clave: 'domino', el: <Corazon k={0.26} />, nombre: 'y los demás' },
  ];
  const cae = p('empujon');
  return (
    <g>
      <Bandera x={800} y={95} txt="disfunción multiorgánica" color={S.il6[0]} p={p('cadena')} t={36} punta="no" />
      {fichas.map((f, i) => (
        <g key={f.clave}>
          <Sale p={p(f.clave)} x={330 + i * 215} y={380}><Domino x={-70} y={-80} cae={tramo(cae, i * 0.26, i * 0.26 + 0.42)} tono={i === 3 ? S.gris : S.il1}>{f.el}</Domino></Sale>
          <Bandera x={330 + i * 215} y={620} txt={f.nombre} color={S.il1[0]} p={p(f.clave)} t={26} punta="no" />
        </g>
      ))}
      <Flecha a={[110, 380]} b={[250, 380]} p={tramo(cae, 0, 0.3)} color={S.il1[1]} w={12} />
      <Bandera x={110} y={470} txt="el empujón" color={S.il1[0]} p={p('empujon')} t={24} punta="no" />
      <Bandera x={1150} y={200} txt="cada órgano arrastra al siguiente" color={S.il1[0]} p={p('domino')} t={28} punta="no" />
      <Txt x={800} y={850} txt="dos o más órganos fallando de forma progresiva" t={30} p={p('cadena')} />
      <Txt x={800} y={920} txt="el primer empujón decide cuántas fichas caen" t={30} p={p('empujon')} />
    </g>
  );
};

// ─── 6 · Los dos pacientes en la escala ──────────────────────────────────────
const Escala: Lamina = ({ p, reloj }) => {
  const escalon = (x: number, y: number, w: number, color: readonly string[], q: number) => (
    <g opacity={tramo(q, 0, 0.5)}>
      <rect x={x} y={y} width={w} height={1000 - y} fill={color[0]} /><rect x={x} y={y} width={w} height={22} fill={color[1]} /><rect x={x + 8} y={y + 4} width={w * 0.4} height={6} rx={3} fill="#FFF" opacity={0.4} />
    </g>
  );
  return (
    <g>
      {escalon(100, 780, 440, S.menin, p('donde'))}
      {escalon(540, 640, 440, S.il1, p('sepsis'))}
      {escalon(980, 500, 440, S.il6, p('choque'))}
      <Bandera x={320} y={840} txt="infección" color={S.menin[0]} p={p('donde')} t={26} punta="no" />
      <Bandera x={760} y={700} txt="sepsis" color={S.il1[0]} p={p('sepsis')} t={28} punta="no" />
      <Bandera x={1200} y={560} txt="choque séptico" color={S.il6[0]} p={p('choque')} t={28} punta="no" />
      <Sale p={p('joven')} x={1200} y={400} k={0.3}><Respira reloj={reloj} periodo={1200}><Hombre rubor={0.4} triste={0.5} /></Respira></Sale>
      <Bandera x={1200} y={290} txt="el joven" color={S.il6[0]} p={p('joven')} t={24} punta="abajo" />
      <Bandera x={1430} y={150} txt="78/42 pese a los líquidos" color={S.nfkb[0]} p={p('pa')} t={22} punta="no" />
      <Bandera x={1430} y={215} txt="norepinefrina" color={S.il1[0]} p={p('noradr')} t={22} punta="no" />
      <Bandera x={1430} y={280} txt="lactato 5,2" color={S.lactato[0]} p={p('lactato')} t={22} punta="no" />
      <Sale p={p('abuela')} x={760} y={530} k={0.3}><Persona quien="mujer" /></Sale>
      <Bandera x={760} y={410} txt="la abuela" color={S.il1[0]} p={p('abuela')} t={24} punta="abajo" />
      <Bandera x={420} y={150} txt="PaO₂/FiO₂ 180" color={S.c5a[0]} p={p('indice')} t={22} punta="no" />
      <Bandera x={420} y={215} txt="creatinina 2,1" color={S.tnf[0]} p={p('creat')} t={22} punta="no" />
      <Bandera x={420} y={280} txt="desorientada" color={S.il6[0]} p={p('desor')} t={22} punta="no" />
      <Bandera x={800} y={95} txt="tres órganos fallando: pulmón, riñón y cerebro" color={S.il1[0]} p={p('tres')} t={28} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [NoEsInfeccion, Sofa, QSofa, Bacteriemia, Choque, Multiorganica, Escala];
export default LAMINAS;
