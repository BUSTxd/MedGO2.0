'use client';
// Capítulo 10 · El diagnóstico (el estilo de «análisis de una célula»: pantalla oscura con marco verde)

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Arn, Bandera, Bola, BolsaSangre, Cruz, Enzima, Flecha, Hombre, IgG, Letra, P, Pantalla, Persona, Reloj, Sale, Signo, Termometro, TuboEnsayo, Txt, TxtPantalla, TXV, Virion, Visto, easeOut, lerp, tramo } from '../Piezas';

/** La pantalla de laboratorio; sus hijos se dibujan en coordenadas del lienzo. */
function Pant({ q, children }: { q: number; children: ReactNode }) {
  return <Pantalla x={800} y={520} w={1440} h={860} p={q}><g transform="translate(-800,-520)">{children}</g></Pantalla>;
}

const Huella = ({ x, y, k = 1, o = 1, color = '#FFF' }: { x: number; y: number; k?: number; o?: number; color?: string }) => (
  <g transform={`translate(${x},${y}) scale(${k})`} opacity={o}>
    <ellipse cx={0} cy={26} rx={30} ry={42} fill={color} /><ellipse cx={0} cy={-18} rx={26} ry={22} fill={color} />
    {[[-26, -50, 9], [-10, -58, 9], [8, -58, 9], [24, -50, 9]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={color} />)}
  </g>
);

// ─── 0 · Dos preguntas, dos pruebas ──────────────────────────────────────────
const DosPruebas: Lamina = ({ p, reloj }) => (
  <g>
    <Pant q={p('preguntas')}>
      <TxtPantalla x={800} y={190} txt="dos preguntas, dos pruebas" t={40} p={p('preguntas')} />
      <Sale p={p('primera')} x={430} y={500}><TuboEnsayo k={1.3} reloj={reloj} color={P.sangre[1]} /></Sale>
      <TxtPantalla x={430} y={238} txt="¿el cuerpo reaccionó al virus?" t={30} p={p('primera')} />
      <Bandera x={430} y={760} txt="pruebas serológicas" color={P.cd4[0]} p={p('serologicas')} t={32} punta="no" />
      <Sale p={p('anticuerpos')} x={320} y={640}><IgG k={1.8} /></Sale>
      <TxtPantalla x={320} y={700} txt="anticuerpos" t={24} p={p('anticuerpos')} />
      <Sale p={p('p24')} x={540} y={640}><circle r={24} fill={P.cap[1]} /><Letra txt="p24" t={20} /></Sale>
      <TxtPantalla x={540} y={700} txt="antígeno p24" t={24} p={p('p24')} />
      <Huella x={430} y={880} k={0.5} o={tramo(p('huella'), 0, 0.5)} color={P.espiga[1]} />
      <TxtPantalla x={530} y={880} txt="la huella del virus" t={24} ancla="start" p={p('huella')} />
      <Sale p={p('segunda')} x={1170} y={500}><TuboEnsayo k={1.3} reloj={reloj} color={P.sangre[1]} /></Sale>
      <TxtPantalla x={1170} y={238} txt="¿está el virus ahí?" t={30} p={p('segunda')} />
      <Bandera x={1170} y={760} txt="pruebas virológicas" color={P.hla[0]} p={p('virologicas')} t={32} punta="no" />
      <Sale p={p('arn')} x={1060} y={640}><Arn x={-50} y={0} w={100} grosor={7} /></Sale>
      <TxtPantalla x={1060} y={700} txt="ARN" t={24} p={p('arn')} />
      <Sale p={p('adn')} x={1290} y={640}><g><path d="M-40,-14 Q-20,-34 0,-14 T40,-14" fill="none" stroke={P.adn[2]} strokeWidth={8} strokeLinecap="round" /><path d="M-40,14 Q-20,-6 0,14 T40,14" fill="none" stroke={P.adn[1]} strokeWidth={8} strokeLinecap="round" /></g></Sale>
      <TxtPantalla x={1290} y={700} txt="ADN" t={24} p={p('adn')} />
      <Virion x={1170} y={880} k={0.28} o={tramo(p('propio'), 0, 0.5)} reloj={reloj} />
      <TxtPantalla x={1270} y={880} txt="el propio virus" t={24} ancla="start" p={p('propio')} />
      <TxtPantalla x={800} y={560} txt="mira la huella" t={26} p={p('huella')} />
    </Pant>
  </g>
);

// ─── 1 · Cinco generaciones ──────────────────────────────────────────────────
const CincoGeneraciones: Lamina = ({ p, reloj }) => {
  const G = [
    { x: 160, h: 130, t: P.cd4, q: p('g1'), txt: '1.ª', win: 220 },
    { x: 420, h: 220, t: P.esp, q: p('g2'), txt: '2.ª', win: 190 },
    { x: 680, h: 310, t: P.virus, q: p('g3'), txt: '3.ª', win: 150 },
    { x: 940, h: 400, t: P.espiga, q: p('g4'), txt: '4.ª', win: 100 },
    { x: 1200, h: 490, t: P.hla, q: p('g5'), txt: '5.ª', win: 70 },
  ];
  return (
    <g>
      <Txt x={800} y={100} txt="pruebas serológicas: cinco generaciones" t={40} p={p('cinco')} color={TXV.violeta} />
      <Txt x={800} y={150} txt="cada una abrió la ventana un poco antes" t={26} p={p('ventana')} />
      {G.map((g, i) => (
        <g key={i}>
          <Sale p={g.q} x={g.x + 120} y={930 - g.h / 2}>
            <rect x={-120} y={-g.h / 2} width={240} height={g.h} rx={22} fill={g.t[0]} /><rect x={-114} y={-g.h / 2 + 3} width={228} height={g.h - 10} rx={19} fill={g.t[1]} />
            <rect x={-96} y={-g.h / 2 + 14} width={110} height={9} rx={4.5} fill="#FFF" opacity={0.55} />
          </Sale>
          <Sale p={g.q} x={g.x + 120} y={930 - g.h + 40}><Letra txt={g.txt} t={46} /></Sale>
          <rect x={g.x + 10} y={930 - g.h - 45} width={g.win * easeOut(tramo(p('ventana'), 0, 1)) * easeOut(g.q)} height={14} rx={7} fill={P.sangre[1]} />
        </g>
      ))}
      <Sale p={p('g1')} x={280} y={640}><IgG k={1.4} /></Sale>
      <Sale p={p('g2')} x={540} y={540}><IgG k={1.4} tono={['#0E8A5F', '#2FD79A', '#B6F5D8']} /></Sale>
      <Txt x={410} y={590} txt="IgG" t={26} p={p('g1')} color={TXV.ab} />
      <Sale p={p('g3')} x={760} y={450}><IgG k={1.2} /><IgG x={46} k={1.2} tono={['#B07A00', '#F2B21C', '#FFE49A']} /></Sale>
      <Txt x={810} y={500} txt="IgM e IgG" t={26} p={p('g3')} />
      <Sale p={p('p24')} x={1040} y={360}><circle r={22} fill={P.cap[1]} /><Letra txt="p24" t={18} /></Sale>
      <Sale p={p('g4')} x={1080} y={360}><IgG x={30} k={1.2} /></Sale>
      <Txt x={1060} y={415} txt="p24 + anticuerpos" t={24} p={p('g4')} />
      <Txt x={1060} y={455} txt="detecta la infección aguda antes" t={20} p={p('aguda')} color={TXV.ambar} />
      <Sale p={p('g5')} x={1320} y={270}><circle r={22} fill={P.cap[1]} /><Letra txt="p24" t={18} /></Sale>
      <Bandera x={1250} y={190} txt="VIH-1" color={P.virus[0]} p={p('vih1')} t={26} punta="no" />
      <Bandera x={1410} y={190} txt="VIH-2" color={P.inte[0]} p={p('vih2')} t={26} punta="no" />
      <Txt x={1330} y={330} txt="distingue entre los dos" t={22} p={p('vih2')} />
    </g>
  );
};

// ─── 2 · El sándwich de ELISA ────────────────────────────────────────────────
const Elisa: Lamina = ({ p, reloj }) => {
  const sus = easeOut(p('sustrato'));
  const col = easeOut(p('color'));
  return (
    <g>
      <Txt x={800} y={100} txt="así funciona una prueba ELISA: un sándwich" t={40} p={p('elisa')} color={TXV.violeta} />
      <Sale p={p('pocillo')} x={620} y={560}>
        <path d="M-210,-240 L210,-240 L150,260 Q150,300 110,300 L-110,300 Q-150,300 -150,260 Z" fill={P.sombra} transform="translate(9,10)" />
        <path d="M-210,-240 L210,-240 L150,260 Q150,300 110,300 L-110,300 Q-150,300 -150,260 Z" fill="#DCD6F5" />
        <path d="M-196,-226 L196,-226 L138,252 Q138,284 104,284 L-104,284 Q-138,284 -138,252 Z" fill="#F4F1FF" />
        <path d="M-196,-226 L196,-226 L170,-20 L-170,-20 Z" fill="#FFE27A" opacity={0.95 * col} />
        <path d="M-170,-20 L170,-20 L138,252 Q138,284 104,284 L-104,284 Q-138,284 -138,252 Z" fill="#FFB62B" opacity={0.7 * col} />
      </Sale>
      {/* abajo: los anticuerpos (o antígenos) que capturan lo que se busca */}
      {[-100, -50, 0, 50, 100].map((dx, i) => <g key={i} opacity={tramo(p('anticuerpos'), i * 0.1, i * 0.1 + 0.5)}><IgG x={620 + dx} y={500} k={0.85} /></g>)}
      <Txt x={620} y={645} txt="anticuerpos que capturan" t={24} p={p('capturan')} />
      {[-100, 0, 100].map((dx, i) => <g key={i} opacity={tramo(p('antigenos'), i * 0.15, i * 0.15 + 0.5)}><circle cx={620 + dx} cy={452 + (i % 2) * 18} r={20} fill={P.cap[1]} /><circle cx={620 + dx - 5} cy={446 + (i % 2) * 18} r={6} fill="#FFF" opacity={0.7} /></g>)}
      {/* un segundo anticuerpo con una enzima */}
      {[-100, 0, 100].map((dx, i) => <g key={i} opacity={tramo(p('segundo'), i * 0.12, i * 0.12 + 0.5)}><IgG x={620 + dx} y={398} k={0.85} r={180} tono={['#0E8A5F', '#2FD79A', '#B6F5D8']} /></g>)}
      {[-100, 0, 100].map((dx, i) => <g key={i} opacity={tramo(p('enzima'), i * 0.12, i * 0.12 + 0.5)}><Enzima x={620 + dx} y={352} k={0.75} tono={[...P.hla]} abre={0.5} r={90} /></g>)}
      <Txt x={880} y={300} txt="enzima" t={26} ancla="start" p={p('enzima')} color={TXV.dc} />
      <Txt x={880} y={350} txt="segundo anticuerpo" t={26} ancla="start" p={p('segundo')} color={TXV.ab} />
      <Txt x={880} y={400} txt="sustrato" t={26} ancla="start" p={p('sustrato')} color={TXV.ambar} />
      {/* el color cambia si se formó el sándwich */}
      <Txt x={620} y={880} txt="si se formó el sándwich, cambia de color" t={30} p={p('formo')} color={TXV.sangre} />
      {Array.from({ length: 5 }, (_, i) => <rect key={i} x={1180 + i * 62} y={420} width={52} height={150} rx={12} fill="#FFB62B" opacity={(0.18 + i * 0.2) * tramo(p('color2'), i * 0.1, i * 0.1 + 0.5)} />)}
      <Txt x={1300} y={620} txt="cuanto más color," t={28} p={p('color2')} />
      <Txt x={1300} y={665} txt="más había de lo que buscamos" t={26} p={p('color2')} color={TXV.sangre} />
    </g>
  );
};

// ─── 3 · El periodo ventana ──────────────────────────────────────────────────
const Ventana: Lamina = ({ p, reloj }) => {
  const dx = (d: number) => 260 + d * 20;
  const marca = (d: number, txt: string, tono: readonly string[], q: number, y: number) => (
    <g>
      <Sale p={q} x={dx(d)} y={430}><circle r={30} fill={tono[0]} /><circle cx={-2} cy={-2} r={25} fill={tono[1]} /></Sale>
      <path d={`M${dx(d)},460 L${dx(d)},${y - 30}`} stroke={tono[1]} strokeWidth={5} strokeDasharray="8 8" opacity={tramo(q, 0, 0.5)} />
      <Txt x={dx(d)} y={y} txt={txt} t={28} p={q} color="#FFF" />
    </g>
  );
  return (
    <g>
      <Pant q={p('ventana')}>
        <TxtPantalla x={800} y={190} txt="el periodo ventana: entre el contagio y la detección" t={34} p={p('intervalo')} />
        <rect x={260} y={420} width={940} height={20} rx={10} fill="#8F89B8" opacity={tramo(p('ventana'), 0, 0.5)} />
        {[0, 10, 20, 30, 45].map((d) => <TxtPantalla key={d} x={dx(d)} y={480} txt={String(d)} t={22} p={p('intervalo')} />)}
        <TxtPantalla x={730} y={520} txt="días desde el contagio" t={22} p={p('intervalo')} />
        {marca(10, 'ARN · día 10', P.arn, p('arn'), 300)}
        {marca(14, 'p24 · día 14', P.cap, p('p24'), 350)}
        {marca(20, 'IgM', P.espiga, p('igm'), 300)}
        {marca(32, 'IgG', P.virus, p('igg'), 350)}
        <Bandera x={400} y={660} txt="CDC: ácidos nucleicos" color={P.arn[0]} p={p('cdc')} t={24} punta="no" />
        <rect x={dx(10)} y={700} width={(33 - 10) * 20 * easeOut(p('r1'))} height={26} rx={13} fill={P.arn[1]} opacity={tramo(p('nat'), 0, 0.4)} />
        <TxtPantalla x={dx(10) + 230} y={745} txt="de 10 a 33 días" t={24} p={p('r1')} />
        <Bandera x={400} y={810} txt="antígeno y anticuerpo (laboratorio)" color={P.cap[0]} p={p('ag')} t={24} punta="no" />
        <rect x={dx(18)} y={850} width={(45 - 18) * 20 * easeOut(p('r2'))} height={26} rx={13} fill={P.cap[1]} opacity={tramo(p('ag'), 0, 0.4)} />
        <TxtPantalla x={dx(18) + 270} y={895} txt="de 18 a 45 días" t={24} p={p('r2')} />
      </Pant>
    </g>
  );
};

// ─── 4 · El algoritmo actual ─────────────────────────────────────────────────
const Algoritmo: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="el algoritmo actual" t={44} p={p('algoritmo')} color={TXV.violeta} />
    <Bandera x={800} y={230} txt="1. prueba de 4.ª generación" color={P.cd4[0]} p={p('cuarta')} t={34} punta="abajo" />
    <Flecha a={[700, 290]} b={[480, 450]} c={[560, 330]} p={p('reactiva')} color={P.sangre[1]} w={11} />
    <Txt x={540} y={360} txt="reactiva" t={30} ancla="end" p={p('reactiva')} color={TXV.sangre} />
    <Bandera x={420} y={520} txt="2. inmunoensayo de diferenciación" color={P.virus[0]} p={p('inmunoensayo')} t={28} punta="abajo" />
    <Bandera x={300} y={640} txt="VIH-1" color={P.virus[0]} p={p('vih1')} t={28} punta="no" />
    <Bandera x={540} y={640} txt="VIH-2" color={P.inte[0]} p={p('vih2')} t={28} punta="no" />
    <Flecha a={[900, 290]} b={[1120, 450]} c={[1040, 330]} p={p('negativo')} color={P.cap[1]} w={11} />
    <Txt x={1090} y={360} txt="negativa o indeterminada" t={28} ancla="start" p={p('negativo')} color={TXV.ambar} />
    <Bandera x={1200} y={520} txt="2. ácidos nucleicos del VIH-1" color={P.arn[0]} p={p('nucleicos')} t={28} punta="abajo" />
    <Txt x={1200} y={620} txt="resuelve la duda" t={30} p={p('duda')} color={TXV.verde} />
    {/* el Western blot ya no forma parte */}
    <Sale p={p('western')} x={800} y={800}>
      <rect x={-130} y={-54} width={260} height={108} rx={20} fill="#8F89B8" />
      {[-80, -40, 0, 40, 80].map((dx, i) => <rect key={i} x={dx - 9} y={-36 + (i % 2) * 10} width={18} height={60 - (i % 2) * 10} rx={6} fill="#4A4472" />)}
    </Sale>
    <Txt x={800} y={730} txt="Western blot" t={30} p={p('western')} />
    <Cruz x={800} y={800} k={1.6} p={p('forma')} />
    <Txt x={800} y={905} txt="ya no forma parte del algoritmo de los CDC" t={28} p={p('cdc')} color={TXV.sangre} />
  </g>
);

// ─── 5 · Lactantes menores de 18 meses ───────────────────────────────────────
const Lactante: Lamina = ({ p, reloj }) => {
  const cruza = easeOut(p('atraviesan'));
  return (
    <g>
      <Sale p={p('madre')} x={330} y={470}><Persona quien="mujer" k={0.46} /></Sale>
      <Txt x={330} y={650} txt="madre con VIH" t={28} p={p('madre')} color={TXV.violeta} />
      <Sale p={p('lactante')} x={1230} y={500}>
        <circle r={110} fill="#D970A8" /><circle cx={-3} cy={-3} r={104} fill="#F2A8C0" />
        <circle cx={-34} cy={-6} r={13} fill={P.interior} /><circle cx={34} cy={-6} r={13} fill={P.interior} /><path d="M-18,40 Q0,56 18,40" fill="none" stroke="#B0206F" strokeWidth={8} strokeLinecap="round" />
        <path d="M-10,-110 Q0,-146 22,-118" fill="none" stroke={P.pelo} strokeWidth={9} strokeLinecap="round" />
      </Sale>
      <Txt x={1230} y={650} txt="lactante" t={28} p={p('lactante')} color={TXV.violeta} />
      <Txt x={780} y={260} txt="los anticuerpos de la madre" t={28} p={p('anticuerpos')} color={TXV.ab} />
      {[0, 1, 2, 3].map((i) => <IgG key={i} x={lerp(520, 1090, easeOut(tramo(cruza, i * 0.1, i * 0.1 + 0.7)))} y={400 + (i % 2) * 70 + i * 10} r={-90} k={1.3} o={tramo(p('atraviesan'), i * 0.1, i * 0.1 + 0.3)} tono={['#0E8A5F', '#2FD79A', '#B6F5D8']} />)}
      <Sale p={p('placenta')} x={800} y={520}><ellipse rx={70} ry={150} fill={P.sangre[0]} /><ellipse cx={-6} cy={-4} rx={62} ry={140} fill={P.sangre[1]} opacity={0.8} /></Sale>
      <Txt x={800} y={700} txt="atraviesan la placenta" t={26} p={p('placenta')} color={TXV.sangre} />
      <Txt x={800} y={780} txt="y pueden quedarse en la sangre del bebé" t={26} p={p('quedarse')} />
      <Bandera x={1230} y={310} txt="hasta los 18 meses" color={P.hla[0]} p={p('meses')} t={28} punta="no" />
      <Sale p={p('positiva')} x={1230} y={820}><Signo k={1} mas /></Sale>
      <Txt x={760} y={860} txt="una serología positiva podría ser de la madre" t={28} ancla="end" p={p('serologia')} color={TXV.ambar} />
      <Txt x={1380} y={820} txt="¿del niño?" t={26} ancla="start" p={p('positiva')} />
      <Txt x={760} y={930} txt="una prueba de ácidos nucleicos positiva sí diagnostica" t={28} ancla="end" p={p('nucleicos')} color={TXV.verde} />
      <Visto x={800} y={930} k={0.9} p={p('diagnosticar')} />
      <Txt x={1180} y={930} txt="detecta el virus propio del bebé" t={22} ancla="start" p={p('virus')} />
    </g>
  );
};

// ─── 6 · Otros usos de la prueba de ácidos nucleicos ─────────────────────────
const OtrosUsos: Lamina = ({ p, reloj }) => (
  <g>
    <Sale p={p('nat')} x={800} y={480}><TuboEnsayo k={1.6} reloj={reloj} color={P.arn[1]} /></Sale>
    <Txt x={800} y={640} txt="ácidos nucleicos" t={34} p={p('nat')} color={TXV.sangre} />
    <Sale p={p('sospecha')} x={300} y={280}><Termometro k={0.6} val={0.9} /></Sale>
    <Txt x={300} y={390} txt="sospecha de infección aguda" t={26} p={p('sospecha')} />
    <Txt x={300} y={430} txt="antes de la seroconversión" t={22} p={p('sospecha')} color={TXV.ambar} />
    <Sale p={p('indeterminada')} x={1300} y={300}><Bola R={60} tono={[...P.hla]} /><Letra txt="?" t={70} /></Sale>
    <Txt x={1300} y={410} txt="serología indeterminada" t={26} p={p('indeterminada')} />
    <Sale p={p('donantes')} x={300} y={700}><BolsaSangre k={0.9} /></Sale>
    <Txt x={300} y={905} txt="donantes de sangre" t={26} p={p('donantes')} />
    <Sale p={p('cuantitativa')} x={1300} y={740}><Termometro k={0.55} val={0.4} /></Sale>
    <Txt x={1300} y={880} txt="versión cuantitativa: la carga viral" t={26} p={p('cuantitativa')} />
    <Txt x={800} y={790} txt="al diagnosticar también se piden:" t={28} p={p('recuento')} />
    <Bandera x={560} y={860} txt="recuento de CD4" color={P.cd4[0]} p={p('recuento')} t={28} punta="no" />
    <Bandera x={880} y={860} txt="genotipo de resistencia" color={P.sangre[0]} p={p('genotipo')} t={28} punta="no" />
  </g>
);

// ─── 7 · El paciente 2 y la ventana ──────────────────────────────────────────
const Paciente2: Lamina = ({ p, reloj }) => {
  const sx = (s: number) => 200 + s * 105;
  return (
    <g>
      <Sale p={p('caso')} x={280} y={300}><Hombre k={0.4} piel={P.piel2} /></Sale>
      <Txt x={280} y={430} txt="paciente 2" t={30} p={p('caso')} color={TXV.violeta} />
      <rect x={sx(0)} y={640} width={sx(13) - sx(0)} height={22} rx={11} fill="#B7AEDB" opacity={tramo(p('exposicion'), 0, 0.5)} />
      {[0, 6, 12].map((s) => <Txt key={s} x={sx(s)} y={700} txt={s === 12 ? '3 meses' : `${s} sem`} t={24} p={p('exposicion')} fuerte={false} />)}
      <Sale p={p('exposicion')} x={sx(0)} y={640}><Bola R={26} tono={[...P.sangre]} /></Sale>
      <Bandera x={sx(0) + 40} y={560} txt="exposición" color={P.sangre[0]} p={p('exposicion')} t={26} punta="no" />
      <rect x={sx(5)} y={625} width={sx(7.3) - sx(5)} height={52} rx={14} fill={P.espiga[1]} opacity={0.55 * tramo(p('final'), 0, 0.5)} />
      <Txt x={sx(6)} y={590} txt="final de la ventana" t={24} p={p('final')} color={TXV.ambar} />
      <Sale p={p('negativa')} x={sx(6)} y={640}><Bola R={30} tono={[...P.virus]} /></Sale>
      <Signo x={sx(6)} y={500} mas={false} p={p('negativa')} />
      <Txt x={sx(6)} y={455} txt="4.ª generación negativa" t={26} p={p('cuarta')} />
      <Txt x={sx(6) + 20} y={790} txt="a las seis semanas" t={28} p={p('seis')} />
      <Txt x={800} y={170} txt="descarta el VIH en ese momento..." t={36} p={p('descarta')} color={TXV.verde} />
      <Txt x={800} y={225} txt="no para siempre" t={36} p={p('siempre')} color={TXV.sangre} />
      <Sale p={p('repetir')} x={sx(12)} y={640}><Bola R={30} tono={[...P.espiga]} /></Sale>
      <Sale p={p('repetir')} x={sx(12)} y={500}><Reloj k={0.6} ang={lerp(0, 720, p('meses'))} /></Sale>
      <Bandera x={sx(12) - 40} y={800} txt="repetir la prueba a los tres meses" color={P.espiga[0]} p={p('repetir')} t={26} punta="no" />
      <Txt x={sx(12) - 40} y={865} txt="en una persona con sífilis (CDC)" t={24} p={p('cifilis')} />
      <Txt x={560} y={940} txt="guía de los CDC" t={22} p={p('cdc')} />
    </g>
  );
};

const LAMINAS: Lamina[] = [DosPruebas, CincoGeneraciones, Elisa, Ventana, Algoritmo, Lactante, OtrosUsos, Paciente2];
export default LAMINAS;
