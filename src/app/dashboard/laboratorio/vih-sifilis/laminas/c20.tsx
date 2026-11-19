'use client';
// Capítulo 20 · Tratamiento de la sífilis y cierre

import type { Lamina } from '../Lienzo';
import { Bandera, Cerebro, Corazon, Cruz, Dendritica, Frasco, Hombre, Jeringa, Linfocito, P, Pastilla, Persona, Reloj, Sale, Termometro, Trazo, Treponema, TuboEnsayo, Txt, TXV, Virion, easeOut, hash, lerp, tramo } from '../Piezas';
import { Dolor, Sudor } from './ComunSifilis';

const FRASCO_AZUL: string[] = ['#2A8FE8', '#7FC4F8'];

// ─── 0 · La penicilina benzatínica ───────────────────────────────────────────
const Penicilina: Lamina = ({ p, reloj }) => {
  const CURVA: [number, number][] = [[900, 590], [930, 480], [960, 340], [990, 262], [1030, 270], [1100, 300], [1200, 340], [1300, 388], [1400, 440], [1480, 482]];
  return (
    <g>
      <Txt x={800} y={62} txt="tratamiento de la sífilis" t={42} p={p('tratamiento')} color={TXV.violeta} />
      <Txt x={800} y={108} txt="la elección vieja y conocida" t={24} p={p('vieja')} />
      <Bandera x={1330} y={160} txt="guía CDC 2021" color={P.esp[0]} p={p('cdc')} t={24} punta="no" />
      {/* una dosis, intramuscular */}
      <Txt x={400} y={200} txt="penicilina" t={64} p={p('penicilina')} color={TXV.verde} />
      <Sale p={p('hebenzatinica')} x={250} y={430}><Jeringa k={1.3} r={-30} liquido="#2FD79A" /></Sale>
      <Txt x={470} y={320} txt="G benzatínica" t={30} ancla="start" p={p('hebenzatinica')} />
      <Txt x={470} y={366} txt="2,4 millones de unidades" t={26} ancla="start" p={p('unidades')} />
      <Txt x={470} y={410} txt="intramuscular" t={26} ancla="start" p={p('intramuscular')} />
      <Txt x={470} y={462} txt="dosis única" t={36} ancla="start" p={p('unica')} color={TXV.verde} />
      {/* su vida media larga mantiene concentraciones que matan al treponema durante semanas */}
      <path d="M900,220 L900,600 L1500,600" fill="none" stroke="#7A5AC8" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={0.7 * tramo(p('vida'), 0, 0.5)} />
      <Trazo pts={CURVA} p={easeOut(p('vida'))} color="#2FD79A" w={11} />
      <line x1={900} y1={470} x2={1490} y2={470} stroke="#E5324C" strokeWidth={5} strokeDasharray="14 10" opacity={tramo(p('concentraciones'), 0, 0.5)} />
      <Txt x={1190} y={440} txt="concentración que mata al treponema" t={20} p={p('matan')} color={TXV.sangre} />
      <Txt x={1190} y={215} txt="vida media larga" t={26} p={p('larga')} color={TXV.verde} />
      <Sale p={p('troponema')} x={1420} y={300}><Treponema w={110} amp={10} vueltas={4} grosor={8} reloj={reloj} /></Sale>
      <Cruz x={1420} y={300} k={1.2} p={p('troponema')} />
      <Txt x={1200} y={642} txt="semanas" t={26} p={p('semanas')} />
      {/* según la etapa: una dosis, tres dosis o penicilina por la vena */}
      <Sale p={p('primaria')} x={270} y={790}><Jeringa k={0.42} r={-30} liquido="#2FD79A" /></Sale>
      <Txt x={270} y={870} txt="primaria y secundaria" t={22} p={p('primaria')} />
      <Txt x={270} y={906} txt="latente temprana" t={22} p={p('temprana')} />
      {[0, 1, 2].map((i) => <Sale key={i} p={[p('tardia'), p('tres'), p('dosis2')][i]} x={700 + i * 100} y={790}><Jeringa k={0.42} r={-30} liquido="#2FD79A" /></Sale>)}
      <Txt x={800} y={870} txt="latente tardía" t={22} p={p('tardia')} />
      <Txt x={800} y={906} txt="tres dosis, una por semana" t={22} p={p('semana2')} />
      <Sale p={p('neurosifilis')} x={1300} y={790}><Frasco k={0.42} tono={FRASCO_AZUL} /></Sale>
      <Txt x={1300} y={870} txt="neurosífilis" t={22} p={p('neurosifilis')} color={TXV.violeta} />
      <Txt x={1300} y={906} txt="penicilina G acuosa, por vena" t={22} p={p('vena')} />
      <Txt x={1300} y={942} txt="10 a 14 días" t={22} p={p('n10')} />
    </g>
  );
};

// ─── 1 · ¿Una dosis o tres? ──────────────────────────────────────────────────
const UnaOTres: Lamina = ({ p }) => {
  const aN = p('n249'), aV = p('vih');
  const tilt = lerp(8, 0, easeOut(p('inferior')));
  const h76 = 304 * easeOut(p('n76')), h70 = 280 * easeOut(p('n70'));
  return (
    <g>
      <Txt x={800} y={62} txt="¿una dosis o tres?" t={44} p={p('discute')} color={TXV.violeta} />
      <Txt x={800} y={108} txt="en la sífilis temprana" t={24} p={p('temprana')} />
      {/* el ensayo: 249 personas, la mayoría con VIH */}
      <Bandera x={400} y={170} txt="ensayo aleatorizado" color={P.esp[0]} p={p('ensayo')} t={26} punta="no" />
      <Txt x={620} y={170} txt="2025" t={28} p={p('n2025')} color={TXV.violeta} />
      {Array.from({ length: 249 }, (_, i) => {
        const col = i % 25, row = Math.floor(i / 25);
        const q = easeOut(tramo(aN, (i / 249) * 0.6, (i / 249) * 0.6 + 0.4));
        const v = tramo(aV, (Math.min(i, 151) / 152) * 0.7, (Math.min(i, 151) / 152) * 0.7 + 0.3);
        return <circle key={i} cx={110 + col * 24} cy={235 + row * 24} r={8 * q} fill={i < 152 && v > 0.5 ? '#8A4FE8' : '#16B9BE'} />;
      })}
      <Txt x={410} y={520} txt="249 personas con sífilis temprana" t={24} p={p('personas')} />
      <Txt x={410} y={558} txt="la mayoría con VIH (61 %)" t={22} p={p('vih')} color={TXV.violeta} />
      {/* la balanza: una dosis frente a tres */}
      <path d="M450,880 L520,880 L485,770 Z" fill="#7A5AC8" opacity={tramo(p('dosis'), 0, 0.4)} />
      <g transform={`rotate(${tilt} 485 770)`} opacity={tramo(p('dosis'), 0, 0.4)}>
        <rect x={185} y={758} width={600} height={24} rx={12} fill="#F2A33A" />
        <path d="M250,782 L190,860 M250,782 L310,860 M720,782 L660,860 M720,782 L780,860" fill="none" stroke="#7A5AC8" strokeWidth={4} strokeLinecap="round" />
        <ellipse cx={250} cy={862} rx={70} ry={12} fill="#7A5AC8" /><ellipse cx={720} cy={862} rx={70} ry={12} fill="#7A5AC8" />
        <Sale p={p('dosis')} x={250} y={818}><Jeringa k={0.3} r={-30} liquido="#2FD79A" /></Sale>
        {[0, 1, 2].map((i) => <Sale key={i} p={p('tres')} x={670 + i * 50} y={818}><Jeringa k={0.3} r={-30} liquido="#2FD79A" /></Sale>)}
      </g>
      <Txt x={250} y={925} txt="una dosis" t={26} p={p('dosis2')} />
      <Txt x={720} y={925} txt="tres dosis" t={26} p={p('tres2')} />
      {/* la respuesta serológica a los 6 meses */}
      <Txt x={1190} y={190} txt="respuesta serológica a los 6 meses" t={24} p={p('respuesta')} />
      <line x1={900} y1={620} x2={1500} y2={620} stroke="#7A5AC8" strokeWidth={4} strokeLinecap="round" opacity={0.7 * tramo(p('respuesta'), 0, 0.5)} />
      <rect x={1010} y={620 - h76} width={130} height={h76} rx={14} fill="#16B9BE" />
      <rect x={1290} y={620 - h70} width={130} height={h70} rx={14} fill="#8A4FE8" />
      <Txt x={1075} y={620 - h76 - 28} txt="76 %" t={32} p={p('n76')} color={TXV.esp} />
      <Txt x={1355} y={620 - h70 - 28} txt="70 %" t={32} p={p('n70')} color={TXV.violeta} />
      <Txt x={1075} y={662} txt="una dosis" t={22} p={p('dosis2')} />
      <Txt x={1355} y={662} txt="tres dosis" t={22} p={p('tres2')} />
      <Txt x={1190} y={750} txt="una dosis no fue inferior" t={30} p={p('inferior')} color={TXV.verde} />
      <Txt x={1190} y={794} txt="tampoco en personas con VIH" t={24} p={p('tampoco')} />
      <Bandera x={1190} y={900} txt="no evaluó sífilis tardía ni neurosífilis" color={P.espiga[0]} p={p('evaluo')} t={22} punta="no" />
    </g>
  );
};

// ─── 2 · Alergia, embarazo y desabastecimiento ───────────────────────────────
const AlergiaEmbarazo: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={62} txt="alergia, embarazo y desabastecimiento" t={38} p={p('paciente')} color={TXV.violeta} />
    {/* alérgico a la penicilina, sin embarazo: doxiciclina */}
    <Sale p={p('alergico')} x={170} y={320}><Hombre k={0.4} piel={P.piel2} /></Sale>
    <Txt x={170} y={470} txt="alérgico a la penicilina" t={22} p={p('alergico')} />
    <Sale p={p('penicilina')} x={360} y={330}><Frasco k={0.45} tono={FRASCO_AZUL} /></Sale>
    <Cruz x={360} y={335} k={1.4} p={p('penicilina')} />
    <Txt x={170} y={510} txt="sin embarazo" t={22} p={p('embarazo')} color={TXV.ambar} />
    <Sale p={p('doxiciclina')} x={190} y={650}><Pastilla k={1.5} color={['#F2A33A', '#FFC85A']} /></Sale>
    <Txt x={340} y={610} txt="doxiciclina" t={32} ancla="start" p={p('doxiciclina')} color={TXV.ambar} />
    <Txt x={340} y={652} txt="100 mg" t={26} ancla="start" p={p('n100')} />
    <Txt x={340} y={690} txt="por vía oral" t={24} ancla="start" p={p('oral')} />
    <Sale p={p('horas')} x={140} y={800}><Reloj k={0.5} ang={lerp(0, 360, p('horas'))} /></Sale>
    <Txt x={240} y={800} txt="cada 12 horas" t={24} ancla="start" p={p('horas')} />
    <Txt x={190} y={880} txt="14 días" t={32} p={p('dias')} color={TXV.verde} />
    <Txt x={190} y={918} txt="sífilis temprana" t={20} p={p('temprana')} />
    <Txt x={460} y={880} txt="28 días" t={32} p={p('n28')} color={TXV.ambar} />
    <Txt x={460} y={918} txt="sífilis tardía" t={20} p={p('tardia')} />
    {/* en el embarazo: solo penicilina */}
    <Bandera x={1050} y={170} txt="embarazo" color={P.hla[0]} p={p('embarazo2')} t={30} punta="abajo" />
    <Sale p={p('embarazo2')} x={1050} y={360}><Persona quien="mujer" k={0.46} /></Sale>
    <Sale p={p('embarazo2')} x={1210} y={350}>
      <circle cx={4} cy={6} r={46} fill={P.sombra} /><circle r={46} fill="#F2A8C0" /><circle r={34} fill="#BFEAF5" />
      <circle cx={-6} cy={-6} r={12} fill={P.piel2[1]} /><ellipse cx={4} cy={12} rx={16} ry={11} fill={P.piel2[1]} />
    </Sale>
    <Bandera x={1050} y={560} txt="solo penicilina" color={P.sangre[0]} p={p('penicilina2')} t={28} punta="no" />
    <Txt x={1400} y={290} txt="si hay alergia:" t={24} p={p('alergia')} />
    <Txt x={1400} y={332} txt="se desensibiliza" t={28} p={p('desensibiliza')} color={TXV.verde} />
    <Sale p={p('desensibiliza')} x={1400} y={450}><Jeringa k={0.4} r={-30} liquido="#2FD79A" /></Sale>
    {/* el desabastecimiento */}
    <Txt x={1130} y={650} txt="un problema real" t={28} p={p('problema')} color={TXV.sangre} />
    {[0, 1, 2, 3, 4].map((i) => <Frasco key={i} x={930 + i * 90} y={752} k={0.42} tono={FRASCO_AZUL} o={tramo(p('benzatinica'), i * 0.1, i * 0.1 + 0.4) * (i < 2 ? 1 : 1 - 0.85 * easeOut(p('escaseado')))} />)}
    <Txt x={1130} y={840} txt="la benzatínica escasea" t={24} p={p('escaseado')} color={TXV.sangre} />
    <Txt x={1130} y={876} txt="en varios países" t={22} p={p('paises')} />
    <Sale p={p('doxiciclina2')} x={960} y={940}><Pastilla k={0.7} color={['#F2A33A', '#FFC85A']} /></Sale>
    <Txt x={1230} y={940} txt="se recurre a la doxiciclina" t={26} p={p('recurre')} color={TXV.ambar} />
  </g>
);

// ─── 3 · Lo nuevo (y lo que no hay) ──────────────────────────────────────────
const LoNuevo: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={62} txt="lo nuevo… y lo que no hay" t={42} p={p('farmaco')} color={TXV.violeta} />
    <Bandera x={800} y={150} txt="ningún fármaco nuevo aprobado" color={P.sangre[0]} p={p('ninguno')} t={32} punta="no" />
    {/* la vitrina */}
    <rect x={120} y={392} width={1360} height={22} rx={11} fill="#F2A33A" opacity={tramo(p('cefixima'), 0, 0.4)} />
    <rect x={120} y={414} width={1360} height={10} rx={5} fill="#B7731A" opacity={tramo(p('cefixima'), 0, 0.4)} />
    <Sale p={p('cefixima')} x={330} y={340}><Pastilla k={1.1} color={['#16B9BE', '#7FEDE8']} /></Sale>
    <Txt x={330} y={462} txt="cefixima oral" t={26} p={p('cefixima')} />
    <Txt x={330} y={500} txt="ensayo en EE. UU. y Perú" t={20} p={p('peru')} />
    <Txt x={330} y={534} txt="el RPR cae como con penicilina" t={20} p={p('parecida')} />
    <Txt x={330} y={568} txt="datos preliminares" t={20} p={p('preliminares')} color={TXV.ambar} />
    <Txt x={330} y={602} txt="sin resultado final" t={20} p={p('final')} />
    <Sale p={p('linesolid')} x={800} y={340}><Pastilla k={1.1} color={['#8A4FE8', '#C9A8FF']} /></Sale>
    <Txt x={800} y={462} txt="linezolid" t={26} p={p('linesolid')} />
    <Txt x={800} y={500} txt="resultó inferior" t={22} p={p('inferior')} color={TXV.sangre} />
    <Sale p={p('vacuna')} x={1270} y={330}><Frasco k={0.55} tono={['#46C84A', '#C9F59A']} /></Sale>
    <Cruz x={1270} y={340} k={1.5} p={p('aprobada')} />
    <Txt x={1270} y={462} txt="vacuna" t={26} p={p('vacuna')} />
    <Txt x={1270} y={500} txt="ninguna aprobada" t={22} p={p('aprobada')} color={TXV.sangre} />
    {/* doxi-PEP: doxiciclina después de la exposición */}
    <Bandera x={800} y={670} txt="doxi-PEP · CDC 2024" color={P.menta[0]} p={p('prevencion')} t={30} punta="abajo" />
    <Sale p={p('doxiciclina')} x={190} y={790}><Pastilla k={1.3} color={['#F2A33A', '#FFC85A']} /></Sale>
    <Txt x={330} y={770} txt="doxiciclina 200 mg" t={28} ancla="start" p={p('doxiciclina')} color={TXV.ambar} />
    <Txt x={330} y={810} txt="después de la exposición" t={24} ancla="start" p={p('despues')} />
    <Sale p={p('exposicion')} x={190} y={900}><Reloj k={0.42} ang={lerp(0, 360, p('exposicion'))} /></Sale>
    <Txt x={330} y={905} txt="dentro de 72 horas" t={24} ancla="start" p={p('exposicion')} />
    <Sale p={p('hombres')} x={900} y={780}><Hombre k={0.22} barba /></Sale>
    <Txt x={900} y={862} txt="hombres que tienen" t={20} p={p('hombres')} />
    <Txt x={900} y={888} txt="sexo con hombres" t={20} p={p('hombres')} />
    <Sale p={p('transgenero')} x={1250} y={775}><Persona quien="mujer" k={0.3} /></Sale>
    <Txt x={1250} y={918} txt="mujeres transgénero" t={20} p={p('transgenero')} />
    <Txt x={1130} y={945} txt="con una infección bacteriana en el último año" t={22} p={p('bacteriana')} color={TXV.ambar} />
  </g>
);

// ─── 4 · Jarisch-Herxheimer ──────────────────────────────────────────────────
const JarischHerxheimer: Lamina = ({ p, reloj }) => {
  const fiebre = easeOut(p('fiebre'));
  const ant = easeOut(p('antigenos')), cit = easeOut(p('citocinas')), burst = easeOut(p('libera'));
  return (
    <g>
      <Txt x={800} y={62} txt="cinco horas después de la penicilina" t={38} p={p('cinco')} color={TXV.violeta} />
      <Bandera x={800} y={118} txt="reacción de Jarisch-Herxheimer" color={P.hla[0]} p={p('jarrish')} t={26} punta="no" />
      {/* el paciente 2, con fiebre */}
      <Sale p={p('fiebre')} x={230} y={360}><Hombre k={0.5} piel={P.piel2} rubor={0.7 * fiebre} triste={0.6} /></Sale>
      <Termometro x={470} y={470} k={0.42} val={lerp(0.35, 0.92, fiebre)} o={tramo(p('fiebre'), 0, 0.4)} />
      <Txt x={470} y={570} txt="39,2 °C" t={30} p={p('n39')} color={TXV.sangre} />
      {/* lo que siente */}
      <path d="M640,252 l12,-14 l12,14 l12,-14 l12,14 l12,-14" fill="none" stroke="#3A6FE0" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={tramo(p('escalofrios'), 0, 0.4)} />
      <Txt x={730} y={252} txt="escalofríos" t={24} ancla="start" p={p('escalofrios')} />
      <Dolor x={662} y={310} p={p('cefalea')} k={0.6} />
      <Txt x={730} y={310} txt="cefalea" t={24} ancla="start" p={p('cefalea')} />
      <Dolor x={662} y={370} p={p('mialgias')} k={0.6} />
      <Txt x={730} y={370} txt="mialgias" t={24} ancla="start" p={p('mialgias')} />
      <Sale p={p('taquicardia')} x={662} y={432}><g transform={`scale(${1 + 0.14 * Math.abs(Math.sin(reloj / 140))})`}><Corazon k={0.16} /></g></Sale>
      <Txt x={730} y={430} txt="taquicardia" t={24} ancla="start" p={p('taquicardia')} />
      {[[-12, -6], [10, 6], [-4, 14]].map(([dx, dy], i) => <circle key={i} cx={662 + dx} cy={490 + dy} r={8} fill="#E5324C" opacity={tramo(p('rojas'), i * 0.12, i * 0.12 + 0.4)} />)}
      <Txt x={730} y={490} txt="más eritema" t={24} ancla="start" p={p('rojas')} />
      {/* no es alergia */}
      <Bandera x={1290} y={190} txt="no es alergia" color={P.menta[0]} p={p('alergia')} t={28} punta="abajo" />
      <Cruz x={1100} y={262} k={0.5} p={p('falta')} /><Txt x={1140} y={262} txt="falta de aire" t={24} ancla="start" p={p('falta')} />
      <Cruz x={1100} y={322} k={0.5} p={p('hinchazon')} /><Txt x={1140} y={322} txt="hinchazón de la cara" t={24} ancla="start" p={p('hinchazon')} />
      <Cruz x={1100} y={382} k={0.5} p={p('urticaria')} /><Txt x={1140} y={382} txt="urticaria" t={24} ancla="start" p={p('urticaria')} />
      <Cruz x={1100} y={442} k={0.5} p={p('silbidos')} /><Txt x={1140} y={442} txt="silbidos en el pecho" t={24} ancla="start" p={p('silbidos')} />
      {/* la causa: muchos treponemas destruidos */}
      <Txt x={440} y={640} txt="la penicilina destruye muchos treponemas…" t={22} p={p('destruye')} />
      {Array.from({ length: 6 }, (_, i) => <Treponema key={i} x={300 + (i % 3) * 140} y={720 + Math.floor(i / 3) * 70} w={90} amp={9} vueltas={3} grosor={7} r={hash(i, 3) * 60 - 30} reloj={reloj + i * 200} o={easeOut(tramo(p('treponemas'), i * 0.1, i * 0.1 + 0.4)) * (1 - 0.75 * burst)} />)}
      {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2, r = 40 + 100 * ant; return <circle key={i} cx={440 + Math.cos(a) * r * 1.4} cy={755 + Math.sin(a) * r * 0.75} r={8 * ant} fill="#FFD23F" />; })}
      {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2 + 0.4, r = 40 + 100 * cit; return <circle key={i} cx={440 + Math.cos(a) * r * 1.4} cy={755 + Math.sin(a) * r * 0.75} r={8 * cit} fill="#E5324C" />; })}
      <Txt x={300} y={905} txt="libera antígenos" t={24} p={p('antigenos')} color={TXV.ambar} />
      <Txt x={590} y={905} txt="y citocinas" t={24} p={p('citocinas')} color={TXV.sangre} />
      {/* se resuelve con soporte; no se suspende el tratamiento */}
      <Sale p={p('resuelve')} x={960} y={690}><Reloj k={0.7} ang={lerp(0, 720, p('n24'))} /></Sale>
      <Txt x={1090} y={680} txt="se resuelve en" t={24} ancla="start" p={p('resuelve')} />
      <Txt x={1090} y={722} txt="unas 24 horas" t={32} ancla="start" p={p('n24')} color={TXV.verde} />
      <Sale p={p('antipireticos')} x={960} y={830}><Pastilla k={0.6} color={['#16B9BE', '#7FEDE8']} /></Sale>
      <Txt x={1090} y={826} txt="antipiréticos" t={24} ancla="start" p={p('antipireticos')} />
      <Sudor x={960} y={895} k={1.3} o={tramo(p('hidratacion'), 0, 0.4)} />
      <Txt x={1090} y={896} txt="hidratación" t={24} ancla="start" p={p('hidratacion')} />
      <Txt x={1250} y={960} txt="suspender el tratamiento" t={24} p={p('suspender')} />
      <Cruz x={1040} y={960} k={0.7} p={p('tratamiento')} />
    </g>
  );
};

// ─── 5 · Dos pacientes, una puerta ───────────────────────────────────────────
const UnaPuerta: Lamina = ({ p, reloj }) => {
  const entra = easeOut(p('entrada'));
  const GOTAS: [number, number][] = [[770, 0], [800, 0.15], [830, 0.3]];
  return (
    <g>
      <Txt x={800} y={62} txt="dos pacientes, una puerta" t={44} p={p('pacientes')} color={TXV.violeta} />
      <Sale p={p('pacientes')} x={150} y={340}><Hombre k={0.3} barba piel={P.piel2} /></Sale>
      <Sale p={p('pacientes')} x={1450} y={340}><Hombre k={0.3} /></Sale>
      <Txt x={150} y={474} txt="paciente 1" t={22} p={p('pacientes')} />
      <Txt x={1450} y={474} txt="paciente 2" t={22} p={p('pacientes')} />
      {/* la barrera, con la úlcera como puerta */}
      <g opacity={tramo(p('puerta'), 0, 0.4)}>
        <rect x={400} y={404} width={800} height={236} rx={14} fill={P.piel[1]} />
        <rect x={400} y={360} width={330} height={48} rx={14} fill="#F7C9D8" />
        <rect x={870} y={360} width={330} height={48} rx={14} fill="#F7C9D8" />
        <path d="M730,360 L870,360 L846,436 Q800,470 754,436 Z" fill="#B5183F" />
        <path d="M748,372 L852,372 L836,428 Q800,452 764,428 Z" fill="#F9C9D2" />
      </g>
      <Txt x={800} y={160} txt="la úlcera sifilítica rompe la barrera" t={28} p={p('rompe')} color={TXV.sangre} />
      <Txt x={540} y={340} txt="piel" t={22} p={p('piel')} />
      <Txt x={1060} y={340} txt="y mucosa" t={22} p={p('mucosa')} />
      {[[520, 520], [650, 570], [980, 560], [1090, 520]].map(([x, y], i) => <Sale key={i} p={p('cd4')} x={x} y={y}><Linfocito k={0.42} /></Sale>)}
      {[[760, 545], [850, 575]].map(([x, y], i) => <Sale key={i} p={p('dendriticas')} x={x} y={y}><Dendritica k={0.4} /></Sale>)}
      <Txt x={585} y={620} txt="linfocitos CD4" t={22} p={p('cd4')} />
      <Txt x={805} y={635} txt="células dendríticas" t={22} p={p('dendriticas')} />
      <Txt x={1030} y={620} txt="listas para infectarse" t={22} p={p('listas')} color={TXV.ambar} />
      {GOTAS.map(([x, d], i) => <Virion key={i} x={x} y={lerp(230, 470, easeOut(tramo(entra, d, d + 0.7)))} k={0.22} reloj={reloj} o={tramo(p('vih'), d, d + 0.4)} />)}
      <Txt x={800} y={700} txt="facilita la entrada del VIH" t={30} p={p('facilita')} color={TXV.sangre} />
      {/* y a la inversa */}
      <Txt x={800} y={752} txt="y a la inversa…" t={26} p={p('inversa')} />
      <Txt x={300} y={800} txt="el VIH puede cambiar la sífilis" t={22} p={p('cambiar')} />
      <path d="M-110,-10 C-100,-70 -50,-90 -20,-70 C10,-100 70,-85 90,-40 C130,-30 130,30 95,52 C100,90 40,100 10,80 C-20,105 -80,95 -90,55 C-130,40 -130,10 -110,-10 Z" transform="translate(300,865) scale(0.42)" fill="#B5183F" opacity={tramo(p('atipicas'), 0, 0.4)} />
      <Txt x={300} y={935} txt="lesiones atípicas" t={22} p={p('atipicas')} />
      <Sale p={p('nervioso')} x={800} y={850}><Cerebro k={0.4} /></Sale>
      <Txt x={800} y={935} txt="más compromiso neurológico" t={22} p={p('nervioso')} />
      <Sale p={p('mismo')} x={1250} y={810}><TuboEnsayo k={0.2} color="#B5183F" nivel={0.7} reloj={reloj} /></Sale>
      <Sale p={p('estudiarse')} x={1340} y={810}><TuboEnsayo k={0.2} color="#8A4FE8" nivel={0.7} reloj={reloj} /></Sale>
      <Txt x={1300} y={880} txt="el mismo tratamiento" t={22} p={p('mismo')} color={TXV.verde} />
      <Txt x={1300} y={925} txt="y se estudia la otra infección" t={22} p={p('estudiarse')} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Penicilina, UnaOTres, AlergiaEmbarazo, LoNuevo, JarischHerxheimer, UnaPuerta];
export default LAMINAS;
