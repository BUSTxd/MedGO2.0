'use client';
// Capítulo 11 · CID, púrpura y necrosis

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Bandera, Barra, Cerebro, Cuerpo, Diplococo, Fibrina, Plaqueta, PiernaPurpura, Pulmones, Rinon, S, Sale, Tijera, TuboEnsayo, Txt, Vaso, easeOut, lerp, mezcla, tramo } from '../Piezas';

const corre = (reloj: number, i: number, n: number, periodo: number) => ((reloj / periodo + i / n) % 1);

/** Corte de piel: epidermis, dermis (con un capilar) y subcutáneo. `necrosis` 0-1 la ennegrece; `ampollas` 0-1 levanta burbujas. */
const PielCorte = ({ x = 800, y = 520, w = 1300, necrosis = 0, ampollas = 0, children }: { x?: number; y?: number; w?: number; necrosis?: number; ampollas?: number; children?: ReactNode }) => {
  const n = easeOut(necrosis);
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-w / 2} y={110} width={w} height={190} fill="#FBE7A8" /><rect x={-w / 2} y={110} width={w} height={14} fill="#F2CE70" />
      {[[-420, 200, 70], [-120, 220, 60], [220, 190, 80], [500, 230, 64]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#FFF3C4" opacity={0.8} />)}
      <rect x={-w / 2} y={-60} width={w} height={170} fill="#F6B9A8" /><rect x={-w / 2} y={-60} width={w} height={12} fill="#E8957F" />
      <rect x={-w / 2} y={-130} width={w} height={70} fill={mezcla('#F4C9A6', '#1E0F18', n)} /><rect x={-w / 2} y={-132} width={w} height={14} fill={mezcla('#E8A98A', '#0A0508', n)} />
      {Array.from({ length: 8 }, (_, i) => <g key={i} opacity={tramo(ampollas, i * 0.08, i * 0.08 + 0.4)}><ellipse cx={-w / 2 + 120 + i * 165} cy={-146} rx={50} ry={34} fill="#FFE9C0" opacity={0.7} /><ellipse cx={-w / 2 + 108 + i * 165} cy={-158} rx={14} ry={7} fill="#FFF" opacity={0.7} /></g>)}
      <path d={`M${-w / 2},40 C${-w / 4},0 0,80 ${w / 4},30 S${w / 2},50 ${w / 2},40`} fill="none" stroke="#B02FA0" strokeWidth={46} strokeLinecap="round" />
      <path d={`M${-w / 2},40 C${-w / 4},0 0,80 ${w / 4},30 S${w / 2},50 ${w / 2},40`} fill="none" stroke="#7A1E3A" strokeWidth={34} strokeLinecap="round" />
      {children}
    </g>
  );
};

// ─── 0 · Qué es la CID ───────────────────────────────────────────────────────
const QueEsCid: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="¿cómo se llama todo esto junto?" color={S.il6[0]} p={p('coagulacion')} t={34} punta="no" />
    <Sale p={p('coagulacion')} x={420} y={540} k={0.85}><Cuerpo /></Sale>
    {[[420, 380], [370, 470], [470, 470], [420, 560], [380, 650], [460, 650], [420, 760]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={15 + 3 * Math.sin(reloj / 300 + i)} fill={S.fibrina[1]} opacity={tramo(p('trombina'), i * 0.08, i * 0.08 + 0.4)} />)}
    <Bandera x={420} y={900} txt="trombina en todo el cuerpo" color={S.tnf[0]} p={p('trombina')} t={26} punta="no" />
    <Sale p={p('sindrome')} x={1010} y={300} k={1}><text textAnchor="middle" fontSize={190} fontWeight={800} fill="var(--se-sangre)">CID</text></Sale>
    <Bandera x={1010} y={400} txt="coagulación intravascular diseminada" color={S.il1[0]} p={p('sindrome')} t={26} punta="no" />
    <Bandera x={1010} y={520} txt="un síndrome adquirido" color={S.il6[0]} p={p('adquirido')} t={30} punta="no" />
    <Bandera x={1010} y={620} txt="la trombina supera a los anticoagulantes fisiológicos" color={S.tnf[0]} p={p('anticoagulantes')} t={26} punta="no" />
    <Bandera x={1010} y={730} txt="no es una enfermedad en sí" color={S.il6[0]} p={p('enfermedad')} t={28} punta="no" />
    <Bandera x={1010} y={820} txt="siempre es consecuencia de otra" color={S.il6[0]} p={p('consecuencia')} t={28} punta="no" />
    <Bandera x={1010} y={930} txt="en el joven: la meningococemia" color={S.menin[0]} p={p('meningococemia')} t={30} punta="no" />
  </g>
);

// ─── 1 · Dos fenómenos a la vez ──────────────────────────────────────────────
const Paradoja: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="la CID tiene una paradoja" color={S.il6[0]} p={p('paradoja')} t={34} punta="no" />
    <path d="M800,180 L800,860" stroke="var(--cit-texto-2)" strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" opacity={0.4 * tramo(p('paradoja'), 0, 0.5)} />
    <Vaso x={400} y={470} largo={760} ancho={260} ang={0} reloj={reloj} flujo={4} o={tramo(p('microcirculacion'), 0, 0.5)}>
      {[-180, 0, 180].map((cx, i) => <g key={i} opacity={tramo(p('microtrombos'), i * 0.2, i * 0.2 + 0.5)}><Fibrina x={cx} y={0} w={170} rota={i * 30 - 30} /><Plaqueta x={cx - 30} y={-10} k={0.5} /></g>)}
    </Vaso>
    <Bandera x={400} y={300} txt="en la microcirculación" color={S.fibrina[0]} p={p('microcirculacion')} t={28} punta="no" />
    <Bandera x={400} y={680} txt="fibrina y microtrombos" color={S.fibrina[0]} p={p('microtrombos')} t={26} punta="no" />
    <Bandera x={400} y={760} txt="comprometen la perfusión" color={S.il1[0]} p={p('perfusion')} t={26} punta="no" />
    <Vaso x={1200} y={470} largo={700} ancho={260} ang={0} reloj={reloj} flujo={5} o={tramo(p('circulacion'), 0, 0.5)} />
    <Bandera x={1200} y={300} txt="en la circulación" color={S.il1[0]} p={p('circulacion')} t={28} punta="no" />
    <Bandera x={1200} y={680} txt="consumo de plaquetas y de factores" color={S.il1[0]} p={p('consumo')} t={26} punta="no" />
    {Array.from({ length: 6 }, (_, i) => { const u = corre(reloj, i, 6, 2600); return <circle key={i} cx={1000 + i * 80} cy={lerp(560, 780, u)} r={13} fill={S.sangre[1]} opacity={tramo(p('sangra'), 0, 0.4) * (1 - u * 0.5)} />; })}
    <Bandera x={1200} y={860} txt="se forman coágulos y se sangra, los dos a la vez" color={S.il1[0]} p={p('sangra')} t={26} punta="no" />
    <Bandera x={800} y={955} txt="se coagula de más y se sangra de más, con la misma causa" color={S.il6[0]} p={p('causa')} t={30} punta="no" />
  </g>
);

// ─── 2 · Plaquetas: 58 000 ───────────────────────────────────────────────────
const Plaquetas58: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="el laboratorio del joven, cuatro horas después" color={S.il6[0]} p={p('laboratorio')} t={32} punta="no" />
    <Barra x={300} y={300} w={1000} h={64} val={165 / 200} color={S.plaq[1]} txt="plaquetas al ingreso" valor="165 000 /µL" p={p('c165')} />
    <Barra x={300} y={470} w={1000} h={64} val={58 / 200} color={S.il1[1]} txt="plaquetas cuatro horas después" valor="58 000 /µL" p={p('c58')} />
    {Array.from({ length: 12 }, (_, i) => <g key={i} opacity={i < 4 ? 1 : 1 - tramo(p('consumieron'), i * 0.06, i * 0.06 + 0.4)} transform={`translate(${220 + i * 112},${690 + Math.sin(reloj / 500 + i) * 6})`}><Plaqueta k={1} /></g>)}
    <Bandera x={800} y={820} txt="se consumieron en los microtrombos" color={S.plaq[0]} p={p('consumieron')} t={28} punta="no" />
    <Bandera x={420} y={900} txt="se destruyen o se secuestran" color={S.il1[0]} p={p('destruyen')} t={26} punta="no" />
    <Bandera x={1180} y={900} txt="cayeron a poco más de un tercio" color={S.il1[0]} p={p('cayeron')} t={30} punta="no" />
  </g>
);

// ─── 3 · TP 23 s, TTPa 52 s ──────────────────────────────────────────────────
const TpTtpa: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="¿y la coagulación?  Los dos tiempos, alargados" color={S.il6[0]} p={p('coagulacion')} t={32} punta="no" />
    <Sale p={p('protrombina')} x={400} y={390} k={1.25}><TuboEnsayo color="#FFE9B8" nivel={0.7} reloj={reloj} /></Sale>
    <Bandera x={400} y={630} txt="tiempo de protrombina" color={S.lps[0]} p={p('protrombina')} t={26} punta="no" />
    <Txt x={400} y={750} txt="23 s" t={110} p={p('s23')} color="var(--se-sangre)" />
    <Bandera x={400} y={835} txt="vía extrínseca y común" color={S.lps[0]} p={p('extrinseca')} t={24} punta="no" />
    <Sale p={p('tromboplastina')} x={1200} y={390} k={1.25}><TuboEnsayo color="#FFD0C8" nivel={0.7} reloj={reloj} /></Sale>
    <Bandera x={1200} y={630} txt="tromboplastina parcial activada" color={S.il6[0]} p={p('tromboplastina')} t={26} punta="no" />
    <Txt x={1200} y={750} txt="52 s" t={110} p={p('s52')} color="var(--se-sangre)" />
    <Bandera x={1200} y={835} txt="vía intrínseca y común" color={S.il6[0]} p={p('intrinseca')} t={24} punta="no" />
    <Bandera x={800} y={290} txt="alargados" color={S.il1[0]} p={p('alargados')} t={36} punta="no" />
    <Bandera x={800} y={430} txt="faltan factores" color={S.il1[0]} p={p('faltan')} t={36} punta="no" />
    <Bandera x={800} y={550} txt="se gastaron fabricando fibrina" color={S.fibrina[0]} p={p('gastaron')} t={26} punta="no" />
    <Bandera x={800} y={955} txt="se agotó la munición" color={S.il1[0]} p={p('municion')} t={38} punta="no" />
  </g>
);

// ─── 4 · Fibrinógeno y dímero D ──────────────────────────────────────────────
const FibrinogenoDimero: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="¿y el fibrinógeno?" color={S.il6[0]} p={p('fibrinogeno')} t={34} punta="no" />
    <Barra x={150} y={250} w={700} h={64} val={95 / 400} color={S.fibrina[1]} txt="fibrinógeno (normal: 200 a 400)" valor="95 mg/dL" p={p('c95')} />
    <Bandera x={470} y={395} txt="muy bajo: se consumió al formar fibrina" color={S.fibrina[0]} p={p('consumio')} t={26} punta="no" />
    <Bandera x={470} y={465} txt="y quizá el hígado fabrica menos" color={S.lps[0]} p={p('higado')} t={26} punta="no" />
    <Fibrina x={420} y={720} w={440} rota={Math.sin(reloj / 800) * 2} />
    <Sale p={p('plasmina')} x={420} y={600} k={3} r={-20}><Tijera color={S.il1[0]} corta={0.6} /></Sale>
    <Bandera x={420} y={840} txt="la plasmina la corta" color={S.il1[0]} p={p('plasmina')} t={26} punta="no" />
    <Txt x={1230} y={540} txt="dímero D" t={110} p={p('dimero')} color="var(--se-fibrina)" />
    <Bandera x={1230} y={630} txt="marcadamente elevado" color={S.il1[0]} p={p('elevado')} t={28} punta="no" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={1040 + (i % 4) * 90} y={705 + Math.floor(i / 4) * 70 + Math.sin(reloj / 400 + i) * 5} width={60} height={26} rx={13} fill={S.fibrina[0]} opacity={tramo(p('restos'), i * 0.08, i * 0.08 + 0.4)} />)}
    <Bandera x={1230} y={840} txt="restos de la fibrina estabilizada" color={S.fibrina[0]} p={p('restos')} t={26} punta="no" />
    <Bandera x={800} y={905} txt="hubo coagulación y hubo fibrinólisis" color={S.il6[0]} p={p('fibrinolisis')} t={30} punta="no" />
    <Bandera x={800} y={962} txt="mucha de las dos" color={S.il6[0]} p={p('mucha')} t={32} punta="no" />
  </g>
);

// ─── 5 · De petequia a púrpura ───────────────────────────────────────────────
const Purpura: Lamina = ({ p, reloj }) => (
  <g>
    <Sale p={p('piel')} x={420} y={520} k={0.9}><PiernaPurpura p={0.25 * p('petequias') + 0.3 * p('equimosis') + 0.45 * p('purpura')} /></Sale>
    <Bandera x={420} y={140} txt="la piel de las piernas" color={S.il1[0]} p={p('piel')} t={30} punta="abajo" />
    <Bandera x={950} y={250} txt="más vasos trombosados" color={S.fibrina[0]} p={p('trombosados')} t={28} punta="no" />
    <Bandera x={950} y={340} txt="más eritrocitos fuera de ellos" color={S.il1[0]} p={p('eritrocitos')} t={28} punta="no" />
    <Bandera x={1250} y={470} txt="las petequias crecen" color={S.il1[0]} p={p('crecen')} t={30} punta="no" />
    <Bandera x={1250} y={560} txt="se funden en equimosis" color={S.il1[0]} p={p('equimosis')} t={28} punta="no" />
    <Bandera x={1250} y={650} txt="y en placas de púrpura irregulares" color={S.il1[0]} p={p('purpura')} t={28} punta="no" />
    <Bandera x={1050} y={780} txt="dolorosas y duras al tacto" color={S.il6[0]} p={p('dolorosas')} t={28} punta="no" />
    <Bandera x={1050} y={900} txt="de un punto rojo a una mancha que avanza" color={S.il1[0]} p={p('avanza')} t={30} punta="no" />
  </g>
);

// ─── 6 · Necrosis y púrpura fulminante ───────────────────────────────────────
const Necrosis: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="¿y si la oclusión se sostiene? El endotelio muere" color={S.il1[0]} p={p('oclusion')} t={32} punta="no" />
    <PielCorte necrosis={p('necrosa')} ampollas={p('ampollas')}>
      {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${-250 + i * 150},${28 + (i % 2) * 22})`} opacity={tramo(p('meningococo'), i * 0.1, i * 0.1 + 0.4)}><Diplococo k={0.34} reloj={reloj} fase={i} pili={tramo(p('pili'), 0, 1)} r={i * 30} /></g>)}
    </PielCorte>
    <Bandera x={170} y={380} txt="epidermis" color={S.endo[0]} p={p('epidermis')} t={24} punta="no" />
    <Bandera x={170} y={520} txt="dermis" color={S.endo[0]} p={p('dermis')} t={24} punta="no" />
    <Bandera x={170} y={700} txt="tejido subcutáneo" color={S.lps[0]} p={p('subcutaneo')} t={24} punta="no" />
    <Bandera x={1300} y={340} txt="ampollas hemorrágicas" color={S.il1[0]} p={p('ampollas')} t={24} punta="no" />
    <Bandera x={1300} y={420} txt="escaras negras" color={S.gris[0]} p={p('escaras')} t={24} punta="no" />
    <Bandera x={800} y={800} txt="el meningococo se adhiere con sus pili al endotelio de los capilares y se multiplica allí" color={S.menin[0]} p={p('capilares')} t={24} punta="no" />
    <Bandera x={800} y={900} txt="la piel, sin riego, se necrosa" color={S.il1[0]} p={p('necrosa')} t={28} punta="no" />
    <Bandera x={800} y={970} txt="es la púrpura fulminante" color={S.il1[0]} p={p('fulminante')} t={34} punta="no" />
  </g>
);

// ─── 7 · Lesión orgánica ─────────────────────────────────────────────────────
const LesionOrganica: Lamina = ({ p, reloj }) => {
  const orgs: { x: number; clave: string; el: ReactNode; txt: string }[] = [
    { x: 250, clave: 'rinon', el: <Rinon k={0.95} />, txt: 'riñón' },
    { x: 560, clave: 'pulmon', el: <Pulmones k={0.75} />, txt: 'pulmón' },
    { x: 870, clave: 'cerebro', el: <Cerebro k={0.85} />, txt: 'cerebro' },
  ];
  return (
    <g>
      <Bandera x={800} y={95} txt="¿y solo la piel?  No" color={S.il1[0]} p={p('solo')} t={34} punta="no" />
      {orgs.map((o) => (
        <g key={o.clave}>
          <Sale p={p(o.clave)} x={o.x} y={340}>{o.el}</Sale>
          {[[-46, 24], [34, -36], [26, 56]].map(([dx, dy], j) => <circle key={j} cx={o.x + dx} cy={340 + dy} r={13} fill={S.fibrina[1]} opacity={tramo(p('microtrombos'), j * 0.15, j * 0.15 + 0.4) * tramo(p(o.clave), 0, 0.6)} />)}
          <Bandera x={o.x} y={510} txt={o.txt} color={S.il1[0]} p={p(o.clave)} t={28} punta="no" />
        </g>
      ))}
      <Sale p={p('suprarrenales')} x={1280} y={350} k={0.95}><Rinon /></Sale>
      <g opacity={tramo(p('suprarrenales'), 0, 0.5)}><ellipse cx={1280} cy={215} rx={70} ry={32} fill={S.lps[1]} /><ellipse cx={1280} cy={215} rx={70} ry={32} fill={S.il1[1]} opacity={tramo(p('hemorragia'), 0, 1) * 0.85} /></g>
      <Bandera x={1280} y={510} txt="suprarrenales: hemorragia" color={S.il1[0]} p={p('hemorragia')} t={26} punta="no" />
      <Bandera x={1280} y={585} txt="síndrome de Waterhouse-Friderichsen" color={S.il1[0]} p={p('waterhouse')} t={24} punta="no" />
      <Bandera x={560} y={595} txt="microtrombos en los órganos" color={S.fibrina[0]} p={p('microtrombos')} t={26} punta="no" />
      <Sale p={p('hemocultivos')} x={240} y={790} k={0.8}><TuboEnsayo color="#FFE9B8" nivel={0.55} reloj={reloj} /></Sale>
      <Bandera x={400} y={965} txt="a las 48 h: hemocultivos negativos" color={S.c5a[0]} p={p('hemocultivos')} t={24} punta="no" />
      <Bandera x={1040} y={770} txt="¿ya estaba curado?  No: la lesión renal y la necrosis seguían" color={S.il1[0]} p={p('lesion')} t={26} punta="no" />
      <Bandera x={1040} y={880} txt="el microbio se fue; el daño se quedó" color={S.il6[0]} p={p('dano')} t={34} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [QueEsCid, Paradoja, Plaquetas58, TpTtpa, FibrinogenoDimero, Purpura, Necrosis, LesionOrganica];
export default LAMINAS;
