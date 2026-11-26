'use client';
// Capítulo 16 · Prevenir y lo nuevo en el VHB
//
// La vacuna como una esfera azul de HBsAg sin ADN que enseña a un linfocito B a hacer anti-HBs; el recién nacido con su reloj de 24 horas; la
// madre con su escudo de tenofovir sobre el calendario de trimestres; la bolsa de rituximab y las dos pruebas de antes; el bepirovirsen como una
// hebra antisentido que se pega al ARN viral y lo corta, con sus porcentajes en las dos barras de la referencia; lo que viene después; y la meta
// de 2030 frente a la distancia que falta.

import type { Lamina } from '../Lienzo';
import { Jeringa } from '../../citopenias-autoinmunes/Piezas';
import { Placenta, Tijera } from '../../bilirrubina/Piezas';
import { Sello } from '../../vih-sifilis/Piezas';
import { Anticuerpo, Busto, Capsula, Etiqueta, Flecha, Globo, Higado, Linfo, Reloj, Sale, Sombra, Subviral, TXH, TuboEnsayo, Txt, VirionB, H, clamp, easeBack, easeOut, hash, lerp, onda, tramo } from '../Piezas';
import { BarrasPct } from '../Clinica';
import { Calendario, Fact, Luz, Tacha, Tumor, Visto } from '../Extras';

type P2 = [number, number];

/** Un escudo con visto: la protección. */
function Escudo2({ x, y, k = 1, o = 1, tono = ['#1FA85A', '#3FD467'] }: { x: number; y: number; k?: number; o?: number; tono?: readonly string[] }) {
  if (o <= 0.003) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} opacity={o < 1 ? o : undefined}>
      <path d="M6,12 L58,-12 L58,36 C58,66 20,84 6,92 C-8,84 -46,66 -46,36 L-46,-12 Z" fill="#000" opacity={0.15} />
      <path d="M0,-62 L54,-38 L54,18 C54,52 16,70 0,78 C-16,70 -54,52 -54,18 L-54,-38 Z" fill={tono[0]} /><path d="M0,-52 L44,-32 L44,16 C44,44 14,60 0,66 C-14,60 -44,44 -44,16 L-44,-32 Z" fill={tono[1]} />
      <path d="M-18,4 L-4,20 L22,-14" fill="none" stroke="#FFF" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** Un anillo de porcentaje (donut). */
function Anillo({ x, y, R = 80, v, p, color, txt, sub }: { x: number; y: number; R?: number; v: number; p: number; color: string; txt: string; sub: string }) {
  if (p <= 0.003) return null;
  return (
    <g>
      <g transform={`translate(${x},${y}) rotate(-90)`} opacity={tramo(p, 0, 0.3)}>
        <circle r={R} fill="none" stroke="#FFF" strokeWidth={30} opacity={0.3} />
        <circle r={R} fill="none" stroke={color} strokeWidth={30} pathLength={1} strokeDasharray={`${(v * easeOut(clamp(p))).toFixed(3)} 1`} strokeLinecap="round" />
      </g>
      <Txt x={x} y={y} txt={txt} t={36} p={p} color={color} />
      <Txt x={x} y={y + R + 62} txt={sub} t={24} p={p} />
    </g>
  );
}

// ─── 0 · La vacuna: solo el HBsAg ───────────────────────────────────────────
const Vacuna: Lamina = ({ p, reloj }) => {
  const vacuna = p('vacuna'), solo = p('solo'), hbsag = p('hbsag'), sinadn = p('sinadn'), ensena = p('ensena'), linfocitos = p('linfocitos'), antihbs = p('antihbs'), nacer = p('nacer'), primeras = p('primeras'), horas = p('horas'), tres = p('tres'), protege = p('protege'), anos = p('anos'), vida = p('vida'), proteina = p('proteina'), cancer = p('cancer');
  return (
    <g>
      <Globo x={640} y={90} txt="¿qué lleva la vacuna contra el virus B?" t={34} p={vacuna} colaX={0} />
      <Sale p={vacuna} x={230} y={400} k={1.3}><Jeringa /></Sale>
      <Txt x={230} y={560} txt="solo" t={30} p={solo} color={TXH.b} />
      <Sale p={hbsag} x={430 + 60 * Math.sin(reloj / 900)} y={330}><circle r={46} fill="#1B36A8" /><circle cx={-3} cy={-3} r={40} fill="#4F7FF0" /><circle cx={-14} cy={-16} r={9} fill="#FFF" opacity={0.7} />{Array.from({ length: 12 }, (_, i) => <line key={i} x1={Math.cos(i * 0.52) * 46} y1={Math.sin(i * 0.52) * 46} x2={Math.cos(i * 0.52) * 64} y2={Math.sin(i * 0.52) * 64} stroke="#2F55E0" strokeWidth={6} strokeLinecap="round" />)}</Sale>
      <Etiqueta x={450} y={450} txt="HBsAg" color="#2F55E0" p={hbsag} t={28} punta="no" />
      <Txt x={450} y={510} txt="sin ADN" t={26} p={sinadn} color={TXH.b} /><Tacha x={450} y={560} r={30} p={sinadn} />
      <Linfo x={760} y={400} k={1.2} reloj={reloj} tono={H.ac} activo={easeOut(ensena)} o={tramo(linfocitos, 0, 0.4)} />
      <Etiqueta x={760} y={270} txt="linfocito B" color="#6A9A00" p={linfocitos} t={26} punta="no" />
      <Txt x={760} y={540} txt="le enseña a fabricar" t={24} p={ensena} color={TXH.ac} />
      {[0, 1, 2].map((i) => <Anticuerpo key={i} x={880 + i * 70 + 10 * Math.sin(reloj / 500 + i)} y={560 + 14 * Math.sin(reloj / 600 + i)} k={0.9} r={i * 30 - 30} o={tramo(antihbs, i * 0.15, i * 0.15 + 0.4)} />)}
      <Etiqueta x={880} y={640} txt="anti-HBs" color="#6A9A00" p={antihbs} t={28} punta="no" />
      {/* se da al nacer, en las primeras 24 horas, y 2 o 3 dosis más */}
      <Sombra><Sale p={nacer} x={1170} y={330} k={0.28}><Busto quien="p2" reloj={reloj} fase={1.5} sueno={0.7} sonrisa={0.5} /></Sale></Sombra>
      <Etiqueta x={1170} y={440} txt="una dosis al nacer" color="#1FA85A" p={nacer} t={26} punta="no" />
      <Reloj x={1400} y={330} k={0.9} ang={(reloj / 30) % 360} o={tramo(primeras, 0, 0.4)} />
      <Etiqueta x={1400} y={440} txt="en las primeras" color="#6A35A0" p={primeras} t={24} punta="no" /><Txt x={1400} y={490} txt="24 horas" t={30} p={horas} color={TXH.d} />
      {[0, 1, 2].map((i) => <Calendario key={i} x={1130 + i * 150} y={650} k={0.42} o={tramo(tres, i * 0.2, i * 0.2 + 0.4)} n={String(i + 2)} unidad="dosis" />)}
      <Txt x={1280} y={740} txt="y 2 o 3 dosis más" t={24} p={tres} color={TXH.hep} />
      <Escudo2 x={420} y={780} k={0.9} o={tramo(protege, 0, 0.4)} />
      <Txt x={640} y={760} txt="protege por lo menos 20 años" t={26} p={anos} ancla="start" color={TXH.c} />
      <Txt x={640} y={805} txt="y probablemente de por vida" t={26} p={vida} ancla="start" color={TXH.c} />
      <Tumor x={1160} y={880} k={0.38} reloj={reloj} o={tramo(cancer, 0, 0.4)} /><Tacha x={1160} y={880} r={34} p={cancer} />
      <Txt x={1380} y={870} txt="una proteína que previene" t={24} p={proteina} color={TXH.hep} /><Txt x={1380} y={910} txt="un cáncer" t={28} p={cancer} color={TXH.hep} />
    </g>
  );
};

// ─── 1 · Cortar el paso de madre a hijo ─────────────────────────────────────
const MadreHijo: Lamina = ({ p, reloj }) => {
  const corta = p('corta'), recien = p('recien'), madre = p('madre'), hbsag = p('hbsag'), vacuna = p('vacuna'), nacer = p('nacer'), inmunoglobulina = p('inmunoglobulina'), oms = p('oms'), tenofovir = p('tenofovir'), embarazo = p('embarazo'), adn = p('adn'), doscientos = p('doscientos'), todas = p('todas'), segundo = p('segundo'), proteger = p('proteger');
  return (
    <g>
      <Globo x={640} y={90} txt="¿cómo se corta el paso de madre a hijo?" t={34} p={corta} colaX={0} />
      <Sombra><Sale p={madre} x={230} y={330} k={0.45}><Busto quien="madre" reloj={reloj} fase={0.8} /></Sale></Sombra>
      <Fact x={380} y={250} R={44} tono={H.b} txt="HBsAg" t={20} p={hbsag} />
      <Etiqueta x={230} y={460} txt="madre con HBsAg positivo" color="#2F55E0" p={hbsag} t={24} punta="no" />
      <Placenta x={560} y={340} k={0.8} o={tramo(recien, 0, 0.4)} reloj={reloj} />
      <Sombra><Sale p={recien} x={870} y={330} k={0.28}><Busto quien="p2" reloj={reloj} fase={1.5} sueno={0.6} /></Sale></Sombra>
      <Etiqueta x={870} y={440} txt="el recién nacido" color="#1FA85A" p={recien} t={26} punta="no" />
      <Sale p={vacuna} x={1060} y={330} k={0.7}><Jeringa /></Sale><Txt x={1060} y={430} txt="la vacuna" t={24} p={vacuna} color={TXH.c} /><Txt x={1060} y={470} txt="al nacer" t={24} p={nacer} color={TXH.c} />
      <Sale p={inmunoglobulina} x={1260} y={330}><rect x={-34} y={-30} width={68} height={86} rx={14} fill="#F4F0FA" /><rect x={-34} y={-30} width={68} height={26} rx={10} fill="#8A4FE8" /><g transform="translate(0,16) scale(0.7)"><path d="M0,0 L-18,-26 M0,0 L18,-26 M0,0 L0,30" stroke="#6A9A00" strokeWidth={9} strokeLinecap="round" /></g></Sale>
      <Etiqueta x={1260} y={440} txt="inmunoglobulina" color="#6A9A00" p={inmunoglobulina} t={24} punta="no" />
      {/* la OMS: tenofovir en el embarazo */}
      <Etiqueta x={450} y={600} txt="OMS 2024" color="#0A7F78" p={oms} t={30} punta="no" />
      <Sale p={tenofovir} x={230} y={720}><Capsula k={1.5} reloj={reloj} /></Sale>
      <Txt x={380} y={700} txt="tenofovir en el embarazo" t={26} p={embarazo} ancla="start" color={TXH.d} />
      <Fact x={330} y={840} R={46} tono={H.adn} txt="ADN" t={22} p={adn} /><Txt x={400} y={825} txt="≥ 200 000 UI/mL" t={26} p={doscientos} ancla="start" color={TXH.b} /><Txt x={400} y={865} txt="o HBeAg positivo" t={24} p={doscientos} ancla="start" color={TXH.gris} />
      {/* los trimestres */}
      {[0, 1, 2].map((i) => {
        const on = i >= 1 ? todas : 0;
        return (
          <g key={i} opacity={tramo(todas, i * 0.1, i * 0.1 + 0.4)}>
            <rect x={940 + i * 190 + 4} y={620 + 7} width={170} height={150} rx={18} fill="#000" opacity={0.14} /><rect x={940 + i * 190} y={620} width={170} height={150} rx={18} fill={i >= 1 ? '#D8F8E4' : '#FFF8F0'} />
            <text x={940 + i * 190 + 85} y={680} textAnchor="middle" style={{ fontSize: 34, fontWeight: 800, fill: '#7A1230', fontFamily: 'inherit' }}>{i + 1}.º</text>
            <text x={940 + i * 190 + 85} y={718} textAnchor="middle" style={{ fontSize: 20, fontWeight: 700, fill: '#B23A5E', fontFamily: 'inherit' }}>trimestre</text>
            {i >= 1 && <g transform={`translate(${940 + i * 190 + 85},750) scale(0.5)`} opacity={tramo(on, 0, 1)}><Capsula k={1} reloj={reloj} /></g>}
          </g>
        );
      })}
      <Txt x={1130} y={830} txt="a todas las gestantes HBsAg positivas" t={24} p={todas} color={TXH.c} /><Txt x={1130} y={870} txt="desde el segundo trimestre" t={24} p={segundo} color={TXH.c} />
      <Txt x={800} y={965} txt="proteger al bebé empieza en el embarazo" t={34} p={proteger} color={TXH.hep} />
    </g>
  );
};

// ─── 2 · Antes de la quimioterapia o del rituximab ──────────────────────────
const AntesQuimio: Lamina = ({ p, reloj }) => {
  const quimio = p('quimio'), rituximab = p('rituximab'), previo = p('previo'), buscan = p('buscan'), hbsag = p('hbsag'), antihbc = p('antihbc'), quien = p('quien'), reactivarlo = p('reactivarlo'), previene = p('previene'), analogo = p('analogo'), tenofovir = p('tenofovir'), dure = p('dure'), despues = p('despues'), prueba = p('prueba'), brote = p('brote');
  return (
    <g>
      <Etiqueta x={400} y={110} txt="antes de la quimioterapia" color="#8A4FE8" p={quimio} t={30} punta="no" />
      <Sale p={quimio} x={250} y={260}><Capsula k={1.5} reloj={reloj} /></Sale>
      {/* la bolsa de rituximab */}
      <g opacity={tramo(rituximab, 0, 0.4)} transform="translate(560,280)">
        <rect x={-50} y={-70} width={100} height={150} rx={26} fill="#000" opacity={0.15} transform="translate(5,7)" /><rect x={-50} y={-70} width={100} height={150} rx={26} fill="#DCEBFF" /><rect x={-44} y={-20} width={88} height={94} rx={22} fill="#8A4FE8" opacity={0.6} /><rect x={-14} y={-100} width={28} height={36} rx={8} fill="#B8C4D8" />
        <path d="M0,80 L0,150" stroke="#B8C4D8" strokeWidth={8} strokeLinecap="round" />{[0, 1].map((i) => <circle key={i} cx={0} cy={110 + ((reloj / 500 + i * 0.5) % 1) * 36} r={6} fill="#8A4FE8" />)}
      </g>
      <Txt x={560} y={400} txt="o de rituximab" t={26} p={rituximab} color={TXH.d} />
      <Etiqueta x={450} y={520} txt="hay un paso previo" color="#B8237A" p={previo} t={32} punta="no" />
      {/* se buscan HBsAg y anti-HBc */}
      <Sale p={buscan} x={230} y={680}><TuboEnsayo x={0} y={0} k={0.7} color="#E3203F" nivel={0.7} reloj={reloj} /></Sale>
      <Luz x={420} y={640} on={hbsag} col="#4F7FF0" signo="+" q={hbsag} reloj={reloj} /><Txt x={480} y={640} txt="HBsAg" t={28} p={hbsag} ancla="start" color={TXH.b} />
      <Luz x={420} y={760} on={antihbc} col="#10B5A8" signo="+" q={antihbc} reloj={reloj} /><Txt x={480} y={760} txt="anti-HBc" t={28} p={antihbc} ancla="start" color={TXH.cd8} />
      {/* quien tiene el virus puede reactivarlo */}
      <Txt x={1130} y={190} txt="quien tiene el virus," t={28} p={quien} color={TXH.hep} />
      <Txt x={1130} y={235} txt="aun solo con anti-HBc," t={26} p={quien} color={TXH.hep} />
      <VirionB x={1000 + 8 * Math.sin(reloj / 70 * reactivarlo)} y={380} k={0.75} reloj={reloj} o={tramo(quien, 0.3, 0.8)} />
      <Etiqueta x={1340} y={380} txt="puede reactivarlo" color="#E5324C" p={reactivarlo} t={28} punta="no" />
      <Flecha a={[1090, 380]} b={[1150, 380]} p={tramo(reactivarlo, 0, 0.8)} color="#E5324C" w={8} />
      {/* se previene con un análogo mientras dure y un tiempo después */}
      <Etiqueta x={1130} y={540} txt="se previene con un análogo" color="#1FA85A" p={previene} t={28} punta="no" />
      <Sale p={analogo} x={900} y={640}><Capsula k={1.5} reloj={reloj} /></Sale>
      <Txt x={1090} y={640} txt="entecavir o tenofovir" t={26} p={tenofovir} ancla="start" color={TXH.c} />
      <rect x={900} y={740} width={300 * easeOut(dure)} height={30} rx={15} fill="#8A4FE8" /><rect x={1200} y={740} width={160 * easeOut(despues)} height={30} rx={15} fill="#1FA85A" />
      <Txt x={1050} y={800} txt="mientras dure el tratamiento" t={22} p={dure} color={TXH.d} /><Txt x={1280} y={840} txt="y un tiempo después" t={22} p={despues} color={TXH.c} />
      <Etiqueta x={800} y={930} txt="una prueba antes" color="#1FA85A" p={prueba} t={36} punta="no" />
      <Txt x={1190} y={935} txt="evita un brote después" t={36} p={brote} color={TXH.hep} />
    </g>
  );
};

// ─── 3 · Lo nuevo: bepirovirsen ─────────────────────────────────────────────
const Bepirovirsen: Lamina = ({ p, reloj }) => {
  const bepi = p('bepi'), oligo = p('oligo'), une = p('une'), arn = p('arn'), destruye = p('destruye'), fda = p('fda'), fecha = p('fecha'), buel = p('buel'), cura = p('cura'), placebo = p('placebo'), adultos = p('adultos'), cirrosis = p('cirrosis'), suprimidos = p('suprimidos'), hbsag = p('hbsag'), tresmil = p('tresmil'), primer = p('primer');
  return (
    <g>
      <Etiqueta x={330} y={110} txt="bepirovirsen" color="#2F55E0" p={bepi} t={36} punta="no" />
      {/* una hebra antisentido que se pega al ARN viral y lo destruye */}
      <path d="M120,330 C150,290 180,370 210,330 S270,290 300,330 S360,370 390,330 S450,290 480,330" fill="none" stroke="#FF8A1E" strokeWidth={12} strokeLinecap="round" opacity={tramo(arn, 0, 0.4)} />
      <Txt x={300} y={250} txt="ARN del virus B" t={24} p={arn} color={TXH.a} />
      <path d={`M120,${lerp(250, 372, easeOut(une))} C150,${lerp(210, 332, easeOut(une))} 180,${lerp(290, 412, easeOut(une))} 210,${lerp(250, 372, easeOut(une))} S270,${lerp(210, 332, easeOut(une))} 300,${lerp(250, 372, easeOut(une))} S360,${lerp(290, 412, easeOut(une))} 390,${lerp(250, 372, easeOut(une))} S450,${lerp(210, 332, easeOut(une))} 480,${lerp(250, 372, easeOut(une))}`} fill="none" stroke="#3FD467" strokeWidth={12} strokeLinecap="round" opacity={tramo(oligo, 0, 0.4)} />
      <Txt x={300} y={470} txt="oligonucleótido antisentido" t={24} p={oligo} color={TXH.c} />
      <Sale p={destruye} x={640} y={350}><Tijera /></Sale>
      <Txt x={300} y={520} txt="se une a los ARN y los destruye" t={24} p={destruye} color={TXH.sangre} />
      {/* la FDA lo aprobó */}
      <Sale p={fda} x={860} y={300}><Sello ok /></Sale>
      <Etiqueta x={860} y={400} txt="aprobado por la FDA" color="#0A7F78" p={fda} t={26} punta="no" />
      <Txt x={860} y={455} txt="20 de octubre de 2026" t={26} p={fecha} color={TXH.hep} />
      {/* B-Well 1 y 2: cura funcional */}
      <Etiqueta x={1380} y={200} txt="B-Well 1 y 2" color="#8A4FE8" p={buel} t={28} punta="no" />
      <BarrasPct x={1380} y={520} w={420} h={460} a={0.2} b={0.01} pa={cura} pb={placebo} colA="#E6DDF2" colB="#1FA85A" txtA="bepirovirsen" txtB="placebo" valA="20 % y 19 %" valB="0 %" titulo="cura funcional" pt={cura} />
      {/* para quién */}
      <Sombra><Sale p={adultos} x={250} y={700} k={0.32}><Busto quien="p1" reloj={reloj} fase={0.4} /></Sale></Sombra>
      <Txt x={250} y={800} txt="adultos" t={24} p={adultos} color={TXH.b} />
      <Sale p={cirrosis} x={480} y={700} k={0.34}><Higado corte={false} /></Sale><Tacha x={480} y={700} r={46} p={cirrosis} /><Txt x={480} y={800} txt="sin cirrosis" t={24} p={cirrosis} color={TXH.hep} />
      <Sale p={suprimidos} x={720} y={700}><Capsula k={1.5} reloj={reloj} /></Sale><Visto x={820} y={690} k={0.7} p={suprimidos} /><Txt x={730} y={800} txt="ya suprimidos con análogos" t={22} p={suprimidos} color={TXH.c} />
      <Fact x={930} y={700} R={46} tono={H.b} txt="HBsAg" t={20} p={hbsag} /><Txt x={990} y={700} txt="≤ 3 000" t={28} p={tresmil} ancla="start" color={TXH.b} />
      <Txt x={800} y={950} txt="un primer paso hacia la cura funcional" t={36} p={primer} color={TXH.hep} />
    </g>
  );
};

// ─── 4 · Más allá: ARN de interferencia y cápside ───────────────────────────
const MasAlla: Lamina = ({ p, reloj }) => {
  const viene = p('viene'), estudio = p('estudio'), interferencia = p('interferencia'), degrada = p('degrada'), reduce = p('reduce'), hbsag = p('hbsag'), moduladores = p('moduladores'), capside = p('capside'), inmuno = p('inmuno'), despertar = p('despertar'), agotados = p('agotados'), investigacion = p('investigacion'), indicacion = p('indicacion'), ciencia = p('ciencia');
  const lab = (x: number, y: number, q: number) => (
    <g opacity={tramo(q, 0, 0.4)} transform={`translate(${x},${y})`}><path d="M-14,-40 L14,-40 L14,-8 L40,40 Q44,52 32,52 L-32,52 Q-44,52 -40,40 L-14,-8 Z" fill="#CFEFFF" opacity={0.7} /><path d="M-24,22 L24,22 L36,44 L-36,44 Z" fill="#8A4FE8" opacity={0.7} /></g>
  );
  return (
    <g>
      <Globo x={640} y={90} txt="¿y qué viene después?" t={34} p={viene} colaX={0} />
      <Etiqueta x={1100} y={110} txt="en estudio" color="#0A7F78" p={estudio} t={32} punta="no" />
      {/* siRNA */}
      <Etiqueta x={280} y={230} txt="ARN de interferencia" color="#2F55E0" p={interferencia} t={26} punta="no" />
      <path d="M120,360 C150,320 180,400 210,360 S270,320 300,360 S360,400 390,360 S450,320 480,360" fill="none" stroke="#FF8A1E" strokeWidth={10} strokeLinecap="round" opacity={(1 - 0.6 * degrada) * tramo(interferencia, 0, 0.4)} />
      <Sale p={degrada} x={300} y={440}><Tijera /></Sale>
      <Txt x={300} y={520} txt="degrada los ARN virales" t={24} p={degrada} color={TXH.a} />
      <Fact x={150} y={620} R={44} tono={H.b} txt="HBsAg" t={20} p={hbsag} /><Txt x={220} y={620} txt="se reduce" t={26} p={reduce} ancla="start" color={TXH.b} />
      {/* moduladores de cápside */}
      <Etiqueta x={800} y={230} txt="moduladores de la cápside" color="#1B36A8" p={moduladores} t={26} punta="no" />
      <VirionB x={800} y={400} k={1.0} reloj={reloj} env={0} capside={capside} adn={0} o={tramo(capside, 0, 0.4)} />
      <Txt x={800} y={520} txt="alteran el ensamblaje de la cápside" t={24} p={capside} color={TXH.b} />
      {lab(800, 640, moduladores)}
      {/* inmunoterapias: despertar a los linfocitos agotados */}
      <Etiqueta x={1320} y={230} txt="inmunoterapias" color="#0A7F78" p={inmuno} t={26} punta="no" />
      <Linfo x={1320} y={400} k={1.2} reloj={reloj} agotado={1 - easeOut(despertar)} activo={easeOut(despertar)} o={tramo(inmuno, 0, 0.4)} />
      <Txt x={1320} y={520} txt="despiertan a los linfocitos" t={24} p={despertar} color={TXH.cd8} /><Txt x={1320} y={560} txt="agotados" t={24} p={agotados} color={TXH.cd8} />
      <Etiqueta x={800} y={780} txt="tratamientos en investigación" color="#E8841E" p={investigacion} t={30} punta="no" />
      <Txt x={800} y={850} txt="no son una indicación para un paciente" t={28} p={indicacion} color={TXH.sangre} /><Tacha x={330} y={850} r={30} p={indicacion} />
      <Txt x={800} y={950} txt="la ciencia sigue avanzando" t={38} p={ciencia} color={TXH.hep} />
    </g>
  );
};

// ─── 5 · La meta de 2030 ────────────────────────────────────────────────────
const Meta2030: Lamina = ({ p, reloj }) => {
  const meta = p('meta'), eliminar = p('eliminar'), a2030 = p('a2030'), reducir = p('reducir'), n90 = p('n90'), n65 = p('n65'), muertes = p('muertes'), diagnosticar = p('diagnosticar'), d90 = p('d90'), tratar = p('tratar'), t80 = p('t80'), a2024 = p('a2024'), c43 = p('c43'), distancia = p('distancia'), recorrer = p('recorrer');
  return (
    <g>
      <Globo x={640} y={90} txt="¿hay una meta mundial?" t={34} p={meta} colaX={0} />
      <Txt x={800} y={178} txt="eliminar la hepatitis viral como amenaza de salud pública" t={26} p={eliminar} color={TXH.c} />
      <Etiqueta x={1370} y={140} txt="2030" color="#1FA85A" p={a2030} t={44} punta="no" />
      <Anillo x={190} y={400} R={78} v={0.9} p={n90} color="#2F55E0" txt="−90 %" sub="nuevas infecciones" />
      <Anillo x={470} y={400} R={78} v={0.65} p={n65} color="#E5324C" txt="−65 %" sub={muertes > 0.5 ? "las muertes" : "muertes"} />
      <Anillo x={750} y={400} R={78} v={0.9} p={d90} color="#8A4FE8" txt="90 %" sub="diagnosticados" />
      <Anillo x={1030} y={400} R={78} v={0.8} p={t80} color="#1FA85A" txt="80 %" sub="tratados" />
      <Txt x={330} y={262} txt="reducir" t={30} p={reducir} color={TXH.hep} /><Txt x={750} y={262} txt="diagnosticar" t={30} p={diagnosticar} color={TXH.hep} /><Txt x={1030} y={262} txt="tratar" t={30} p={tratar} color={TXH.hep} />
      {/* la distancia: 80 % de meta frente a 4,3 % en 2024 */}
      <BarrasPct x={1370} y={620} w={420} h={480} a={0.8} b={0.043} pa={tramo(a2024, 0, 1)} pb={c43} colA="#E6DDF2" colB="#1FA85A" txtA="meta" txtB="2024" valA="80 %" valB="4,3 %" titulo="B crónicos tratados" pt={a2024} />
      <Txt x={500} y={600} txt="en 2024, solo el 4,3 %" t={32} p={a2024} color={TXH.sangre} />
      <Txt x={500} y={650} txt="de los B crónicos recibía tratamiento" t={26} p={c43} color={TXH.hep} />
      <Flecha a={[250, 780]} b={[1050, 780]} p={tramo(recorrer, 0, 1)} color="#1FA85A" w={12} />
      <Txt x={650} y={740} txt="la distancia es enorme," t={34} p={distancia} color={TXH.hep} />
      <Txt x={650} y={880} txt="pero se puede recorrer" t={38} p={recorrer} color={TXH.c} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Vacuna, MadreHijo, AntesQuimio, Bepirovirsen, MasAlla, Meta2030];
export default LAMINAS;
