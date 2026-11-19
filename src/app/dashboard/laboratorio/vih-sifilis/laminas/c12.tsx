'use client';
// Capítulo 12 · El tratamiento antirretroviral: antes y ahora

import type { Lamina } from '../Lienzo';
import { Bandera, Bola, Canal, Correceptor, Cruz, Enzima, Escudo, Flota, Helice, Higado, Hueco, IgG, Letra, P, Pastilla, Reloj, Sale, Trazo, TuboEnsayo, Txt, TXV, Virion, easeOut, lerp, tramo } from '../Piezas';

/** Una pastilla con su nombre debajo. */
const Pasti = ({ x, y, k = 1.3, r = -30, tono, q, nombre, t = 22, ocultar = 0 }: { x: number; y: number; k?: number; r?: number; tono: readonly string[]; q: number; nombre?: string; t?: number; ocultar?: number }) => (
  <g>
    <Sale p={q} x={x} y={y}><Pastilla r={r} k={k} color={[...tono]} /></Sale>
    {nombre && <Txt x={x} y={y + 52 * k} txt={nombre} t={t} p={q * (1 - ocultar)} />}
  </g>
);

// ─── 0 · De un fármaco a tres ────────────────────────────────────────────────
const UnoATres: Lamina = ({ p, reloj }) => {
  const caida = easeOut(p('picada'));
  return (
    <g>
      <Txt x={800} y={90} txt="al principio, un solo fármaco" t={40} p={p('farmaco')} color={TXV.violeta} />
      {/* la línea de tiempo, de 1987 a hoy */}
      <rect x={160} y={760} width={1280} height={22} rx={11} fill={P.espiga[1]} opacity={0.4 * tramo(p('a1987'), 0, 0.5)} />
      <rect x={160} y={760} width={Math.max(0.1, 1280 * easeOut(p('a1996')) * 0.0 + 380 * easeOut(p('a1987')) + 760 * easeOut(p('combinar')))} height={22} rx={11} fill={P.espiga[1]} />
      <Sale p={p('a1987')} x={200} y={771}><Bola R={26} tono={[...P.espiga]} /></Sale>
      <Txt x={200} y={830} txt="1987" t={44} p={p('a1987')} color={TXV.ambar} />
      <Sale p={p('a1996')} x={640} y={771}><Bola R={26} tono={[...P.sangre]} /></Sale>
      <Txt x={640} y={830} txt="1996" t={44} p={p('a1996')} color={TXV.sangre} />
      <Txt x={1380} y={830} txt="hoy" t={44} p={p('muertes')} color={TXV.verde} />
      <Pasti x={170} y={570} k={1.5} tono={P.cap} q={p('azt')} nombre="zidovudina (AZT)" t={24} />
      <Txt x={170} y={700} txt="beneficio breve" t={24} p={p('benef')} color={TXV.sangre} />
      <Sale p={p('meses')} x={390} y={570}><Reloj k={0.6} ang={lerp(0, 720, p('meses'))} /></Sale>
      <Txt x={390} y={650} txt="el virus volvía a ser" t={20} p={p('resiste')} /><Txt x={390} y={678} txt="resistente en pocos meses" t={20} p={p('resiste')} />
      {/* 1996: la triple terapia */}
      <Pasti x={600} y={570} k={1.1} tono={P.rt} q={p('tres')} /><Pasti x={690} y={610} k={1.1} tono={P.hla} q={p('proteasa')} /><Pasti x={780} y={570} k={1.1} tono={P.prot} q={p('combinar')} />
      <Txt x={690} y={690} txt="combinar tres fármacos," t={22} p={p('proteasa')} /><Txt x={690} y={722} txt="con inhibidores de la proteasa" t={22} p={p('proteasa')} />
      {/* las muertes por sida caen en picada */}
      <path d="M900,180 L900,640 L1500,640" fill="none" stroke="var(--cit-texto-2)" strokeWidth={5} strokeLinecap="round" opacity={0.5 * tramo(p('muertes'), 0, 0.5)} />
      <Trazo pts={[[910, 600], [1010, 480], [1110, 300], [1190, 250], [1230, 330], [1290, 520], [1400, 590], [1490, 610]]} p={p('muertes')} color={P.sangre[1]} w={13} />
      <Txt x={1190} y={210} txt="muertes por sida" t={26} p={p('muertes')} color={TXV.sangre} />
      <Txt x={1380} y={470} txt="caen en picada" t={30} p={p('picada')} color={TXV.verde} />
      {/* resistir tres a la vez exige mutaciones simultáneas */}
      <Txt x={800} y={920} txt="resistir tres fármacos a la vez exige varias mutaciones simultáneas" t={26} p={p('resistir')} />
      {[0, 1, 2].map((i) => <Cruz key={i} x={1180 + i * 70} y={920} k={0.55} p={tramo(p('mutaciones'), i * 0.2, i * 0.2 + 0.5)} />)}
      <Txt x={1470} y={920} txt="improbables" t={26} p={p('improbables')} color={TXV.verde} />
    </g>
  );
};

// ─── 1 · Menos toxicidad y menos pastillas ───────────────────────────────────
const MenosToxicidad: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="los primeros esquemas eran tóxicos" t={40} p={p('seguros')} color={TXV.violeta} />
    <Pasti x={260} y={290} k={1.4} tono={P.sangre} q={p('didanosina')} nombre="didanosina" t={26} />
    <Pasti x={520} y={290} k={1.4} tono={P.sangre} q={p('estavudina')} nombre="estavudina" t={26} />
    <Cruz x={390} y={290} k={1.3} p={p('usan')} />
    <Txt x={390} y={440} txt="ya no se usan, aunque el resumen todavía los menciona" t={22} p={p('resumen')} color={TXV.sangre} />
    {/* dañaban las mitocondrias */}
    {[0, 1, 2].map((i) => <Sale key={i} p={tramo(p('mitocondrias'), i * 0.15, i * 0.15 + 0.5)} x={200 + i * 120} y={560}><ellipse rx={44} ry={26} fill="#B0206F" /><ellipse cx={-3} cy={-3} rx={38} ry={20} fill="#E058A8" /><path d="M-24,0 Q-12,-14 0,0 T24,0" fill="none" stroke="#7A1250" strokeWidth={5} strokeLinecap="round" /></Sale>)}
    <Txt x={320} y={640} txt="dañaban las mitocondrias" t={28} p={p('mitocondrias')} color={TXV.sangre} />
    <Bandera x={200} y={730} txt="neuropatía" color={P.hla[0]} p={p('neuropatia')} t={26} punta="no" />
    <Bandera x={440} y={730} txt="pancreatitis" color={P.cap[0]} p={p('pancreatitis')} t={26} punta="no" />
    <Bandera x={320} y={810} txt="pérdida de grasa en cara y piernas" color={P.inte[0]} p={p('grasa')} t={26} punta="no" />
    {/* luego, las pastillas únicas y el dolutegravir */}
    <Txt x={1160} y={150} txt="después, las pastillas únicas" t={32} p={p('unicas')} color={TXV.violeta} />
    <Pasti x={1000} y={330} k={1.6} tono={P.rt} q={p('efavirenz')} nombre="efavirenz" t={26} />
    <Bandera x={1300} y={230} txt="desde 2013" color={P.hla[0]} p={p('a2013')} t={30} punta="no" />
    <Pasti x={1300} y={340} k={1.9} tono={P.hla} q={p('dolutegravir')} nombre="dolutegravir" t={28} r={20} />
    <Sale p={p('barrera')} x={1300} y={560}><Escudo k={0.5} id="esc12" /></Sale>
    <Txt x={1300} y={680} txt="más barrera a la resistencia" t={26} p={p('barrera')} color={TXV.verde} />
    <Txt x={1160} y={760} txt="menos pastillas" t={32} p={p('menos2')} color={TXV.verde} />
    <Txt x={1160} y={810} txt="menos toxicidad" t={32} p={p('toxicidad')} color={TXV.verde} />
  </g>
);

// ─── 2 · El esquema de hoy: OMS y HHS ────────────────────────────────────────
const EsquemaHoy: Lamina = ({ p, reloj }) => {
  const une = easeOut(p('sola'));
  return (
    <g>
      <Bandera x={400} y={130} txt="OMS: primera línea" color={P.cd4[0]} p={p('oms')} t={36} punta="no" />
      <Pasti x={lerp(210, 400, une)} y={330} k={1.6} tono={P.rt} q={p('tenofovir')} nombre="tenofovir 300 mg" t={22} ocultar={une} />
      <Pasti x={lerp(400, 400, une)} y={330} k={1.6} tono={P.esp} q={p('lamivudina')} nombre="lamivudina 300 mg" t={22} ocultar={une} />
      <Pasti x={lerp(590, 400, une)} y={330} k={1.6} tono={P.hla} q={p('dolutegravir')} nombre="dolutegravir 50 mg" t={22} ocultar={une} />
      <Sale p={p('tld')} x={400} y={560}><Flota x={0} y={0} rl={reloj} alto={6}><Pastilla r={-20} k={2.8} color={[...P.virus]} /></Flota></Sale>
      <Txt x={400} y={700} txt="TLD: una sola pastilla al día" t={34} p={p('tld')} color={TXV.verde} />
      {/* HHS: pastillas únicas recomendadas */}
      <Bandera x={1150} y={130} txt="HHS (Estados Unidos)" color={P.hla[0]} p={p('hhs')} t={36} punta="no" />
      <Pasti x={950} y={330} k={1.5} tono={P.cap} q={p('bictegravir')} nombre="BIC/TAF/FTC" t={24} />
      <Pasti x={1250} y={330} k={1.5} tono={P.espiga} q={p('dtg')} nombre="DTG/3TC" t={24} />
      <Txt x={1100} y={430} txt="TAF/FTC: tenofovir alafenamida y emtricitabina" t={20} p={p('ftc')} />
      {/* la actualización de septiembre de 2026 */}
      <Bandera x={1100} y={560} txt="actualización de septiembre de 2026" color={P.sangre[0]} p={p('sept')} t={28} punta="no" />
      <Txt x={1100} y={640} txt="DTG/3TC para empezar" t={34} p={p('empezar')} color={TXV.ambar} />
      <Txt x={1100} y={690} txt="sin importar la carga viral inicial" t={28} p={p('carga')} />
      <Cruz x={940} y={800} k={0.8} p={p('hepatitis')} />
      <Txt x={1000} y={800} txt="siempre que no haya hepatitis B" t={26} ancla="start" p={p('hepatitis')} color={TXV.sangre} />
      <Cruz x={940} y={860} k={0.8} p={p('resistencia')} />
      <Txt x={1000} y={860} txt="ni resistencia" t={26} ancla="start" p={p('resistencia')} color={TXV.sangre} />
    </g>
  );
};

// ─── 3 · En el Perú ──────────────────────────────────────────────────────────
const EnPeru: Lamina = ({ p, reloj }) => (
  <g>
    <Sale p={p('peru')} x={380} y={520}>
      <path d="M-110,-300 L40,-340 L130,-260 L110,-120 L190,-20 L120,120 L60,300 L-20,340 L-110,200 L-190,40 L-150,-140 Z" fill={P.sombra} transform="translate(10,12)" />
      <path d="M-110,-300 L40,-340 L130,-260 L110,-120 L190,-20 L120,120 L60,300 L-20,340 L-110,200 L-190,40 L-150,-140 Z" fill={P.sangre[1]} />
      <path d="M-90,-270 L30,-300 L100,-240" fill="none" stroke="#FFF" strokeWidth={9} strokeLinecap="round" opacity={0.6} />
    </Sale>
    <Txt x={380} y={900} txt="Perú" t={44} p={p('peru')} color={TXV.sangre} />
    <Bandera x={1130} y={130} txt="NTS 169-MINSA/2020" color={P.hla[0]} p={p('n169')} t={34} punta="no" />
    <Txt x={1130} y={190} txt="la norma técnica de salud" t={24} p={p('norma')} />
    <Txt x={1130} y={235} txt="el Minsa mantiene" t={24} p={p('minsa')} />
    <Pasti x={900} y={360} k={1.7} tono={P.hla} q={p('dolutegravir')} nombre="dolutegravir: primera elección" t={22} r={20} />
    <Sale p={p('fija')} x={1180} y={340}><Pastilla r={-30} k={1.3} color={[...P.rt]} /></Sale>
    <Sale p={p('analogos')} x={1300} y={340}><Pastilla r={30} k={1.3} color={[...P.esp]} /></Sale>
    <Txt x={1240} y={420} txt="combinación fija con dos análogos" t={22} p={p('analogos')} />
    <Bandera x={1130} y={560} txt="octubre de 2026: el Minsa actualiza la lista" color={P.sangre[0]} p={p('octubre')} t={26} punta="no" />
    <Txt x={1130} y={620} txt="lista complementaria de medicamentos" t={22} p={p('lista')} />
    <Bandera x={950} y={700} txt="TAF/FTC" color={P.cd4[0]} p={p('taf')} t={26} punta="no" />
    <Txt x={1210} y={700} txt="problemas renales u óseos" t={22} ancla="start" p={p('rinon')} />
    <Bandera x={950} y={770} txt="darunavir/ritonavir" color={P.prot[0]} p={p('darunavir')} t={26} punta="no" />
    <Txt x={1210} y={770} txt="fallo de primera línea" t={22} ancla="start" p={p('fallo')} />
    <Bandera x={950} y={840} txt="TDF/FTC/DTG" color={P.virus[0]} p={p('gestantes')} t={26} punta="no" />
    <Txt x={1210} y={840} txt="extendido a gestantes" t={22} ancla="start" p={p('gestantes')} />
  </g>
);

// ─── 4 · Huecos 0 y 1: la entrada ────────────────────────────────────────────
const Entrada: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="ahora llenemos los huecos del ciclo" t={38} p={p('llenemos')} color={TXV.violeta} />
    <Hueco x={300} y={250} k={1.3} p={p('huecos')} lleno={p('maraviroc')} tono={P.copa} />
    <Hueco x={520} y={250} k={1.3} p={p('huecos')} lleno={p('enfuvirtida')} tono={P.espiga} />
    <Txt x={410} y={355} txt="los primeros huecos: la entrada" t={26} p={p('entrada')} />
    {/* la membrana con CD4 y CCR5 */}
    <rect x={1060} y={160} width={90} height={780} rx={45} fill={P.sangre[1]} opacity={0.9} /><rect x={1080} y={170} width={30} height={760} rx={15} fill="#FF9AA8" opacity={0.7} />
    <Canal x={1070} y={420} r={-90} k={1.0} alto={110} tono={P.cd4} tallo={['#0B5F8F', '#127CB5', '#A3E3F7']} hueco={P.interior} />
    <Sale p={p('ccr5')} x={1070} y={620}><Correceptor r={-90} k={1.3} /></Sale>
    <Virion x={430} y={560} k={1.1} reloj={reloj} />
    {/* maraviroc: antagonista de CCR5, solo sirve con virus R5 */}
    <Pasti x={900} y={650} k={1.2} tono={P.copa} q={p('maraviroc')} nombre="maraviroc" t={22} />
    <Cruz x={960} y={620} k={0.7} p={p('ccr5')} />
    <Txt x={760} y={800} txt="solo sirve con virus R5" t={26} p={p('r5')} color={TXV.ambar} />
    {/* enfuvirtida: un péptido que se une a la gp41 e impide la fusión */}
    {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={660 + i * 22} cy={470 - i * 14} r={9 * easeOut(tramo(p('enfuvirtida'), i * 0.1, i * 0.1 + 0.4))} fill={P.espiga[1]} />)}
    <Txt x={700} y={410} txt="enfuvirtida" t={22} p={p('enfuvirtida')} />
    <Txt x={700} y={880} txt="un péptido que se une a la gp41" t={22} p={p('gp41')} />
    <Txt x={700} y={925} txt="e impide la fusión" t={22} p={p('fusion')} color={TXV.sangre} />
    {/* para virus muy resistentes */}
    <Txt x={690} y={190} txt="para virus muy resistentes" t={26} p={p('resistentes')} color={TXV.sangre} />
    <Pasti x={690} y={265} k={0.9} tono={P.cap} q={p('fostemsavir')} nombre="fostemsavir (gp120)" t={20} />
    <Sale p={p('ibalizumab')} x={960} y={400}><IgG k={1.5} r={90} /></Sale>
    <Txt x={900} y={330} txt="ibalizumab: anticuerpo contra el CD4" t={22} p={p('cd4')} />
  </g>
);

// ─── 5 · Hueco 2: transcriptasa inversa ──────────────────────────────────────
const TranscriptasaFarmacos: Lamina = ({ p, reloj }) => {
  const cad = easeOut(p('cadena'));
  return (
    <g>
      <Hueco x={160} y={170} k={1.1} p={p('hueco')} lleno={p('analogos')} tono={P.rt} />
      <Txt x={260} y={160} txt="tercer hueco: la transcriptasa inversa" t={26} ancla="start" p={p('rt')} color={TXV.violeta} />
      {/* los análogos imitan a los nucleósidos naturales y terminan la cadena */}
      <Sale p={p('rt')} x={430} y={470}><Enzima k={3.4} tono={[...P.rt]} abre={0.5} r={-30} /></Sale>
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={230 + i * 54} cy={640} r={17} fill={P.adn[1]} opacity={tramo(p('imitan'), 0, 0.5)} />)}
      <circle cx={230 + 7 * 54} cy={640} r={19 * easeOut(p('incorporan'))} fill={P.sangre[1]} />
      <Txt x={640} y={700} txt="sin el grupo 3'-OH" t={26} p={p('hidroxilo')} color={TXV.sangre} />
      <Cruz x={230 + 8 * 54 + 10} y={640} k={0.8} p={cad} />
      <Txt x={420} y={780} txt="la cadena no puede crecer" t={28} p={p('cadena')} color={TXV.sangre} />
      <Txt x={420} y={250} txt="análogos de nucleósidos" t={28} p={p('analogos')} />
      {[['tenofovir', 'tenofovir', 0], ['lamivudina', 'abacavir', 1], ['abacavir', 'abacavir', 2], ['zidovudina', 'abacavir', 3]].map(([n, id, i]) => (
        <Txt key={n as string} x={170 + (i as number) * 150} y={300} txt={n as string} t={20} p={[p('tenofovir'), p('imitan'), p('abacavir'), p('incorporan')][i as number]} fuerte={false} />
      ))}
      {/* los no análogos se pegan en un sitio aparte y cambian la forma */}
      <Txt x={1150} y={250} txt="no análogos" t={30} p={p('noanalogos')} color={TXV.violeta} />
      <Sale p={p('efavirenz')} x={1150} y={480}><Enzima k={3.0} tono={[...P.rt]} abre={0.8 - 0.65 * easeOut(p('cambian'))} r={-30} /></Sale>
      <Pasti x={1290} y={380} k={0.9} tono={P.cap} q={p('nevirapina')} nombre="" />
      <Txt x={1150} y={330} txt="efavirenz · nevirapina · rilpivirina" t={22} p={p('rilpivirina')} />
      <Txt x={1150} y={640} txt="un sitio aparte (alostérico)" t={24} p={p('alosterico')} />
      <Txt x={1150} y={680} txt="y la enzima cambia de forma" t={24} p={p('cambian')} color={TXV.ambar} />
      {/* abacavir: hipersensibilidad ligada a HLA-B*57:01 */}
      <Bandera x={420} y={880} txt="advertencia" color={P.sangre[0]} p={p('advertencia')} t={28} punta="no" />
      <Txt x={640} y={880} txt="abacavir: hipersensibilidad" t={26} ancla="start" p={p('hiper')} />
      <Sale p={p('b5701')} x={1180} y={860}><TuboEnsayo k={0.6} reloj={reloj} color={P.hla[1]} /></Sale>
      <Bandera x={1180} y={940} txt="HLA-B*57:01" color={P.hla[0]} p={p('b5701')} t={24} punta="no" />
      <Txt x={1330} y={870} txt="se busca antes de usarlo" t={22} ancla="start" p={p('busca')} color={TXV.verde} />
    </g>
  );
};

// ─── 6 · Hueco 4: integrasa ──────────────────────────────────────────────────
const IntegrasaFarmacos: Lamina = ({ p, reloj }) => (
  <g>
    <Hueco x={160} y={170} k={1.1} p={p('hueco')} lleno={p('bloquean')} tono={P.hla} />
    <Txt x={260} y={160} txt="hueco de la integrasa" t={28} ancla="start" p={p('integrasa')} color={TXV.violeta} />
    <Sale p={p('inhibidores')} x={500} y={400}><Enzima k={3.2} tono={[...P.hla]} abre={0.5} r={90} /></Sale>
    <Helice x={500} y={640} w={620} amp={36} vueltas={3} p={p('pega')} fase={reloj / 2000} />
    <Pasti x={500} y={520} k={1.0} tono={P.cap} q={p('bloquean')} />
    <Cruz x={500} y={520} k={0.9} p={p('bloquean')} />
    <Txt x={500} y={760} txt="bloquean la transferencia de hebra" t={26} p={p('pega')} color={TXV.sangre} />
    <Pasti x={230} y={300} k={0.9} tono={P.hla} q={p('ralte')} nombre="raltegravir" t={20} />
    <Pasti x={360} y={300} k={0.9} tono={P.hla} q={p('dolute')} nombre="dolutegravir" t={20} />
    <Pasti x={490} y={300} k={0.9} tono={P.hla} q={p('bicte')} nombre="bictegravir" t={20} />
    <Sale p={p('barrera')} x={820} y={330}><Escudo k={0.5} id="esc126" /></Sale>
    <Txt x={820} y={440} txt="barrera alta a la resistencia" t={22} p={p('barrera')} color={TXV.verde} />
    {/* el calcio, el hierro y el magnesio los quelan */}
    <Txt x={1230} y={170} txt="detalles prácticos" t={30} p={p('detalles')} color={TXV.violeta} />
    <Pasti x={1230} y={440} k={1.4} tono={P.hla} q={p('detalles')} />
    {[['Ca', 'calcio', -110, -80, P.espiga], ['Fe', 'hierro', 110, -70, P.sangre], ['Mg', 'magnesio', 0, 100, P.virus]].map(([n, id, dx, dy, tono], i) => (
      <Sale key={n as string} p={[p('calcio'), p('hierro'), p('magnesio')][i]} x={1230 + (dx as number)} y={440 + (dy as number)}><Bola R={34} tono={[...(tono as readonly string[])]} /><Letra txt={n as string} t={28} /></Sale>
    ))}
    <Txt x={1230} y={600} txt="se atrapan en el intestino" t={24} p={p('atrapan')} color={TXV.sangre} />
    <Sale p={p('separan')} x={1050} y={760}><Reloj k={0.6} ang={lerp(0, 720, p('separan'))} /></Sale>
    <Txt x={1140} y={760} txt="separar las tomas" t={26} ancla="start" p={p('separan')} />
    <Pasti x={1020} y={900} k={1.0} tono={P.cap} q={p('rifampicina')} nombre="rifampicina" t={20} />
    <Txt x={1150} y={900} txt="el dolutegravir, dos veces al día" t={24} ancla="start" p={p('veces')} color={TXV.ambar} />
  </g>
);

// ─── 7 · Hueco 7: proteasa ───────────────────────────────────────────────────
const ProteasaFarmacos: Lamina = ({ p, reloj }) => (
  <g>
    <Hueco x={160} y={170} k={1.1} p={p('hueco')} lleno={p('impiden')} tono={P.prot} />
    <Txt x={260} y={160} txt="el último hueco: la proteasa" t={28} ancla="start" p={p('proteasa')} color={TXV.violeta} />
    <Pasti x={230} y={330} k={1.0} tono={P.prot} q={p('darunavir')} nombre="darunavir" t={20} />
    <Pasti x={380} y={330} k={1.0} tono={P.prot} q={p('atazanavir')} nombre="atazanavir" t={20} />
    <Pasti x={530} y={330} k={1.0} tono={P.prot} q={p('lopinavir')} nombre="lopinavir" t={20} />
    <Txt x={380} y={410} txt="inhibidores de la proteasa" t={24} p={p('inhibidores')} />
    <Sale p={p('impiden')} x={330} y={560}><Tijeras2 /></Sale>
    <Cruz x={330} y={560} k={1.2} p={p('impiden')} />
    <Txt x={330} y={680} txt="impiden que corte las poliproteínas" t={24} p={p('poliproteinas')} />
    <Sale p={p('inmaduros')} x={330} y={810}><circle r={80} fill={P.virus[0]} /><circle r={72} fill={P.virus[1]} /><circle r={52} fill={P.interior} />{Array.from({ length: 16 }, (_, i) => <circle key={i} cx={Math.cos(i * 0.39) * 62} cy={Math.sin(i * 0.39) * 62} r={7} fill={P.cap[1]} />)}</Sale>
    <Txt x={510} y={810} txt="viriones inmaduros: no pueden infectar" t={22} ancla="start" p={p('inmaduros')} color={TXV.sangre} />
    {/* el ritonavir potencia a los demás: inhibe la enzima del hígado */}
    <Sale p={p('higado')} x={1130} y={400}><Higado k={1.5} /></Sale>
    <Pasti x={950} y={250} k={1.0} tono={P.sangre} q={p('ritonavir')} nombre="ritonavir (o cobicistat)" t={20} />
    <Txt x={1130} y={190} txt="el potenciador" t={28} p={p('potenciador')} color={TXV.ambar} />
    <Txt x={1130} y={612} txt="inhibe una enzima del hígado (CYP3A4)" t={24} p={p('higado')} />
    <Trazo pts={[[900, 820], [1000, 780], [1100, 700], [1220, 660], [1400, 650]]} p={p('duran')} color={P.virus[1]} w={12} />
    <Txt x={1130} y={650} txt="los fármacos duran más en la sangre" t={22} p={p('duran')} color={TXV.verde} />
    <Txt x={1130} y={900} txt="la misma enzima metaboliza muchísimos medicamentos" t={22} p={p('metaboliza')} />
    <Txt x={1130} y={945} txt="muchas interacciones" t={32} p={p('interacciones')} color={TXV.sangre} />
  </g>
);

/** Unas tijeras pequeñas (la proteasa). */
function Tijeras2() {
  return (
    <g>
      {[-1, 1].map((l) => <g key={l} transform={'rotate(' + l * 26 + ')'}><rect x={-7} y={-80} width={14} height={80} rx={7} fill={P.prot[0]} /><circle cx={l * 15} cy={36} r={17} fill={P.prot[0]} /><circle cx={l * 15} cy={36} r={8} fill={P.interior} /></g>)}
      <circle r={8} fill={P.prot[1]} />
    </g>
  );
}

// ─── 8 · Prevención: PrEP y PEP ──────────────────────────────────────────────
const Prevencion: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="el tratamiento también sirve para prevenir" t={38} p={p('previene')} color={TXV.violeta} />
    <Bandera x={420} y={210} txt="PrEP: profilaxis preexposición" color={P.cd4[0]} p={p('prep')} t={30} punta="no" />
    <Sale p={p('tenofovir')} x={420} y={430}><Escudo k={1.0} id="esc128" /></Sale>
    <Pasti x={300} y={650} k={1.1} tono={P.rt} q={p('tenofovir')} nombre="tenofovir" t={20} />
    <Pasti x={540} y={650} k={1.1} tono={P.esp} q={p('emtricitabina')} nombre="emtricitabina" t={20} />
    <Txt x={420} y={740} txt="antes de una posible exposición" t={26} p={p('exposicion')} color={TXV.ambar} />
    <Txt x={420} y={780} txt="para evitar la infección" t={24} p={p('antes')} />
    <Bandera x={1150} y={210} txt="PEP: profilaxis posexposición" color={P.sangre[0]} p={p('pep')} t={30} punta="no" />
    {Array.from({ length: 28 }, (_, i) => <circle key={i} cx={910 + (i % 14) * 44} cy={330 + Math.floor(i / 14) * 50} r={16 * easeOut(tramo(p('n28'), (i / 28) * 0.8, (i / 28) * 0.8 + 0.2))} fill={P.virus[1]} />)}
    <Txt x={1150} y={440} txt="durante 28 días" t={30} p={p('n28')} color={TXV.verde} />
    <Pasti x={960} y={560} k={1.0} tono={P.rt} q={p('tres')} /><Pasti x={1100} y={560} k={1.0} tono={P.hla} q={p('tres')} /><Pasti x={1240} y={560} k={1.0} tono={P.prot} q={p('tres')} />
    <Txt x={1100} y={630} txt="tres fármacos" t={26} p={p('tres')} />
    <Sale p={p('antes2')} x={960} y={780}><Reloj k={0.8} ang={lerp(0, 1080, p('n72'))} /></Sale>
    <Txt x={1090} y={750} txt="lo antes posible" t={28} ancla="start" p={p('antes2')} />
    <Txt x={1090} y={800} txt="siempre dentro de las primeras 72 horas" t={26} ancla="start" p={p('n72')} color={TXV.sangre} />
    <Txt x={260} y={880} txt="ambas están en las guías de la OMS" t={22} p={p('oms')} />
    <Txt x={260} y={915} txt="y de los CDC" t={22} p={p('cdc')} />
    <Bandera x={720} y={880} txt="Perú: el Minsa ofrece PrEP oral" color={P.sangre[0]} p={p('peru')} t={26} punta="no" />
    <Txt x={720} y={930} txt="en establecimientos seleccionados" t={22} p={p('establecimientos')} />
  </g>
);

const LAMINAS: Lamina[] = [UnoATres, MenosToxicidad, EsquemaHoy, EnPeru, Entrada, TranscriptasaFarmacos, IntegrasaFarmacos, ProteasaFarmacos, Prevencion];
export default LAMINAS;
