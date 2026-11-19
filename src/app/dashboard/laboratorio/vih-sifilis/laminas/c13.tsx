'use client';
// Capítulo 13 · Lo nuevo

import type { Lamina } from '../Lienzo';
import { Bandera, Bola, Capside, Cerrojo, Cruz, Espiga, Flecha, Helice, Hombre, IgG, Jeringa, Letra, Linfocito, P, Pastilla, Reloj, Sale, Tijeras, Txt, TXV, Virion, Visto, clamp, easeOut, lerp, tramo } from '../Piezas';

/** Rótulo con volumen, como la tarjeta de la referencia «presentación de nuevo medicamento»: verde con extrusión azul marino. */
function Rotulo3D({ x, y, txt, t = 100, p = 1 }: { x: number; y: number; txt: string; t?: number; p?: number }) {
  if (p <= 0.002) return null;
  const q = easeOut(clamp(p));
  return (
    <g opacity={tramo(p, 0, 0.5)} transform={`translate(${x},${y}) scale(${0.9 + 0.1 * q})`}>
      {Array.from({ length: 9 }, (_, i) => <text key={i} x={i * 1.6} y={i * 1.6} textAnchor="middle" dy="0.35em" style={{ fontSize: t, fontWeight: 900, fill: '#1C0B73', fontFamily: 'inherit' }}>{txt}</text>)}
      <text x={0} y={0} textAnchor="middle" dy="0.35em" style={{ fontSize: t, fontWeight: 900, fill: '#2FD79A', fontFamily: 'inherit' }}>{txt}</text>
      <text x={-2} y={-3} textAnchor="middle" dy="0.35em" style={{ fontSize: t, fontWeight: 900, fill: '#B6F5D8', fontFamily: 'inherit', opacity: 0.5 }}>{txt}</text>
      {[[-1, -0.9], [1, -0.7], [0.7, 0.8]].map(([a, b], i) => <polygon key={i} points="0,-16 4,-4 16,0 4,4 0,16 -4,4 -16,0 -4,-4" fill="#FFF" transform={`translate(${a * t * 1.9},${b * t * 0.55}) scale(${0.6 + 0.3 * Math.sin(i * 2)})`} opacity={0.8} />)}
    </g>
  );
}

const PERU = 'M-110,-300 L40,-340 L130,-260 L110,-120 L190,-20 L120,120 L60,300 L-20,340 L-110,200 L-190,40 L-150,-140 Z';

// ─── 0 · El primer inhibidor de la cápside ───────────────────────────────────
const InhibidorCapside: Lamina = ({ p, reloj }) => {
  const pega = easeOut(p('pega'));
  const des = easeOut(p('desordena'));
  const mal = easeOut(p('malforma'));
  return (
    <g>
      <Rotulo3D x={800} y={130} txt="lenacapavir" t={110} p={p('lena')} />
      <Txt x={800} y={230} txt="el primer inhibidor de la cápside" t={34} p={p('inhibidor')} color={TXV.violeta} />
      <Sale p={p('capside')} x={460} y={560}><Capside k={4.4} r={-12} arn={1} /></Sale>
      {/* las moléculas se pegan entre las subunidades de p24 */}
      {[[-90, -40], [-30, -70], [30, -80], [90, -50], [-60, 20], [10, 10], [70, 10], [-20, 60], [50, 50]].map(([x, y], i) => <circle key={i} cx={460 + x * 1.9} cy={560 + y * 1.5} r={13 * pega * easeOut(tramo(p('subunidades'), (i / 9) * 0.6, (i / 9) * 0.6 + 0.4))} fill={P.hla[1]} />)}
      <Txt x={460} y={800} txt="se pega entre las subunidades de p24" t={26} p={p('subunidades')} color={TXV.dc} />
      <Txt x={460} y={845} txt="y la deja demasiado rígida" t={26} p={p('rigidas')} color={TXV.sangre} />
      {/* bloquea la entrada al núcleo, desordena el ensamblaje, malforma la cápside */}
      <Sale p={p('entrada')} x={1000} y={400}>
        <rect x={-20} y={-90} width={40} height={70} rx={18} fill="#8A4A00" /><rect x={-20} y={20} width={40} height={70} rx={18} fill="#8A4A00" />
      </Sale>
      <Cruz x={1000} y={400} k={1.2} p={p('nucleo')} />
      <Txt x={1170} y={400} txt="no entra al núcleo" t={28} ancla="start" p={p('nucleo')} color={TXV.sangre} />
      {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={1000 + Math.cos(i * 0.8) * 120 * des + (i - 4) * 14} cy={600 + Math.sin(i * 1.3) * 70 * des} r={20} fill={P.cap[1]} opacity={tramo(p('ensamblaje'), 0, 0.4)} />)}
      <Cruz x={1000} y={600} k={0.9} p={p('ensamblaje')} />
      <Txt x={1170} y={600} txt="desordena el ensamblaje" t={28} ancla="start" p={p('desordena')} color={TXV.sangre} />
      <Sale p={p('malforma')} x={1000} y={790}><g transform={`rotate(${20 * mal}) scale(${1 - 0.2 * mal},${1 + 0.1 * mal})`}><Capside k={1.4} r={-30 * mal} /></g></Sale>
      <Txt x={1170} y={790} txt="malforma la cápside" t={28} ancla="start" p={p('malforma')} color={TXV.sangre} />
      {/* como tratamiento: una inyección cada seis meses */}
      <Txt x={1150} y={930} txt="2022: para virus multirresistentes" t={24} p={p('multi')} color={TXV.ambar} />
      <Sale p={p('inyeccion')} x={330} y={930}><Jeringa k={0.55} r={-40} /></Sale>
      <Txt x={450} y={930} txt="cada seis meses, junto con otros fármacos" t={24} ancla="start" p={p('seis')} />
      <Txt x={1150} y={880} txt="tratamiento aprobado en 2022" t={24} p={p('a2022')} />
    </g>
  );
};

// ─── 1 · Dos inyecciones al año para prevenir ────────────────────────────────
const DosInyecciones: Lamina = ({ p, reloj }) => {
  const MES = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  return (
    <g>
      <Txt x={800} y={90} txt="la prevención: dos inyecciones al año" t={40} p={p('prevencion')} color={TXV.violeta} />
      {MES.map((m, i) => (
        <g key={i} opacity={tramo(p('inyectado'), (i / 12) * 0.6, (i / 12) * 0.6 + 0.4)}>
          <rect x={120 + (i % 6) * 100} y={200 + Math.floor(i / 6) * 90} width={86} height={72} rx={14} fill={i === 0 || i === 6 ? P.hla[1] : '#DCD6F5'} />
          <Letra x={120 + (i % 6) * 100 + 43} y={200 + Math.floor(i / 6) * 90 + 36} txt={m} t={30} color={i === 0 || i === 6 ? '#FFF' : '#3A2A6A'} />
        </g>
      ))}
      <Sale p={p('lena')} x={163} y={150}><Jeringa k={0.4} r={-30} /></Sale>
      <Sale p={p('seis')} x={663} y={290}><Jeringa k={0.4} r={-30} /></Sale>
      <Txt x={360} y={420} txt="lenacapavir cada seis meses" t={26} p={p('meses')} />
      {/* PURPOSE 1: ninguna infección entre 2 134 mujeres */}
      <Bandera x={300} y={520} txt="PURPOSE 1" color={P.cd4[0]} p={p('purpose1')} t={30} punta="no" />
      <Txt x={300} y={600} txt="mujeres jóvenes de África" t={22} p={p('mujeres')} />
      <Txt x={300} y={720} txt="0" t={150} p={p('infeccion')} color={TXV.verde} />
      <Txt x={300} y={820} txt="infecciones" t={30} p={p('hubo')} color={TXV.verde} />
      <Txt x={300} y={870} txt="entre 2 134 participantes" t={24} p={p('part')} />
      {/* PURPOSE 2: 0,10 frente a 2,37 por 100 personas-año */}
      <Bandera x={1130} y={150} txt="PURPOSE 2" color={P.hla[0]} p={p('purpose2')} t={30} punta="no" />
      <Txt x={1130} y={215} txt="3 265 personas" t={26} p={p('n3265')} />
      <rect x={900} y={560 - 300 * 1.0 * easeOut(p('redujo'))} width={130} height={300 * easeOut(p('redujo'))} rx={14} fill={P.sangre[1]} />
      <rect x={1160} y={560 - 300 * 0.042 * easeOut(p('redujo')) - 8} width={130} height={300 * 0.042 * easeOut(p('redujo')) + 8} rx={14} fill={P.virus[1]} opacity={tramo(p('redujo'), 0, 0.4)} />
      <Txt x={965} y={610} txt="2,37" t={40} p={p('redujo')} color={TXV.sangre} /><Txt x={1225} y={610} txt="0,10" t={40} p={p('redujo')} color={TXV.verde} />
      <Txt x={1095} y={660} txt="por 100 personas-año" t={24} p={p('redujo')} />
      <Txt x={1130} y={760} txt="96 %" t={110} p={p('n96')} color={TXV.verde} />
      <Txt x={1130} y={840} txt="menos infecciones" t={30} p={p('n96')} />
      <Bandera x={900} y={930} txt="FDA: junio de 2025" color={P.rt[0]} p={p('fda')} t={26} punta="no" />
      <Bandera x={1250} y={930} txt="OMS: 14 de julio de 2025" color={P.virus[0]} p={p('oms')} t={26} punta="no" />
      <Txt x={1130} y={975} txt="como una opción adicional" t={22} p={p('opcion')} />
    </g>
  );
};

// ─── 2 · En el Perú ──────────────────────────────────────────────────────────
const EnPeru: Lamina = ({ p, reloj }) => (
  <g>
    <Sale p={p('peru')} x={350} y={520}>
      <path d={PERU} fill={P.sombra} transform="translate(10,12)" /><path d={PERU} fill={P.sangre[1]} /><path d="M-90,-270 L30,-300 L100,-240" fill="none" stroke="#FFF" strokeWidth={9} strokeLinecap="round" opacity={0.6} />
    </Sale>
    <Sale p={p('participo')} x={330} y={330}><Bola R={26} tono={[...P.virus]} /><Letra txt="1" t={28} /></Sale>
    <Sale p={p('registro')} x={420} y={560}><Bola R={26} tono={[...P.espiga]} /><Letra txt="2" t={28} /></Sale>
    <Txt x={350} y={900} txt="Perú" t={44} p={p('peru')} color={TXV.sangre} />
    <Bandera x={1110} y={170} txt="un sitio del ensayo PURPOSE 2" color={P.virus[0]} p={p('purpose')} t={28} punta="no" />
    <Txt x={1110} y={230} txt="el país participó" t={24} p={p('participo')} />
    <Bandera x={1110} y={330} txt="todavía no está disponible" color={P.sangre[0]} p={p('disponible')} t={30} punta="no" />
    <Txt x={1110} y={390} txt="el registro sigue en evaluación" t={26} p={p('evaluacion')} />
    <Txt x={1110} y={450} txt="quedó fuera del acuerdo de genéricos de bajo costo" t={24} p={p('genericos')} color={TXV.ambar} />
    <Txt x={1110} y={495} txt="unos US$ 40 al año" t={24} p={p('costo')} />
    <Bandera x={1110} y={590} txt="OPS: Fondo Rotatorio" color={P.cd4[0]} p={p('rotatorio')} t={28} punta="no" />
    <Txt x={1110} y={650} txt="acceso para 14 países, entre ellos el Perú" t={26} p={p('n14')} color={TXV.verde} />
    <Txt x={1110} y={760} txt="mientras tanto: la PrEP oral" t={30} p={p('mientras')} color={TXV.violeta} />
    <Sale p={p('prep')} x={1110} y={850}><Pastilla r={-30} k={1.5} color={[...P.rt]} /></Sale>
    <Txt x={1110} y={930} txt="datos de prensa de 2026: por confirmar" t={20} p={p('ops')} color={TXV.sangre} />
  </g>
);

// ─── 3 · Acción prolongada para tratar ───────────────────────────────────────
const AccionProlongada: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="tratamientos de acción prolongada" t={40} p={p('tratamientos')} color={TXV.violeta} />
    <Sale p={p('pastilla')} x={260} y={330}><Pastilla r={-30} k={2.0} color={[...P.virus]} /></Sale>
    <Txt x={260} y={430} txt="una pastilla diaria" t={26} p={p('pastilla')} />
    <Flecha a={[380, 330]} b={[560, 330]} p={p('gravir')} color="var(--cit-flecha)" w={12} />
    <Sale p={p('gravir')} x={700} y={310}><Jeringa k={0.7} r={-40} /></Sale>
    <Sale p={p('rilpivirina')} x={860} y={310}><Jeringa k={0.7} r={-40} liquido="#B04AE8" /></Sale>
    <Txt x={700} y={410} txt="cabotegravir" t={26} p={p('gravir')} /><Txt x={860} y={410} txt="rilpivirina" t={26} p={p('rilpivirina')} />
    <Txt x={780} y={470} txt="inyección intramuscular" t={26} p={p('inyeccion')} color={TXV.violeta} />
    <Txt x={780} y={515} txt="cada uno o dos meses" t={30} p={p('meses')} color={TXV.ambar} />
    <Bandera x={1250} y={250} txt="OMS 2025: cambio" color={P.sangre[0]} p={p('oms')} t={32} punta="no" />
    <Txt x={1250} y={330} txt="para personas que cambian de tratamiento" t={22} p={p('cambio')} />
    <Visto x={1060} y={430} k={0.7} p={p('suprimida')} /><Txt x={1110} y={430} txt="con la carga viral suprimida" t={24} ancla="start" p={p('carga')} />
    <Cruz x={1060} y={510} k={0.7} p={p('hepatitis')} /><Txt x={1110} y={510} txt="sin hepatitis B activa" t={24} ancla="start" p={p('hepatitis')} />
    <Visto x={1060} y={590} k={0.7} p={p('cuesta')} /><Txt x={1110} y={580} txt="a quienes les cuesta" t={22} ancla="start" p={p('quienes')} /><Txt x={1110} y={610} txt="tomar el tratamiento oral" t={22} ancla="start" p={p('quienes')} />
    <Txt x={800} y={760} txt="una idea poderosa" t={36} p={p('idea')} color={TXV.violeta} />
    <Sale p={p('recordar')} x={500} y={860}><Pastilla r={-30} k={1.4} color={[...P.virus]} /></Sale>
    <Cruz x={500} y={860} k={1.1} p={p('recordar')} />
    <Txt x={620} y={860} txt="dejar de recordar una pastilla todos los días" t={28} ancla="start" p={p('dias')} color={TXV.verde} />
  </g>
);

// ─── 4 · Menos fármacos, menos pastillas ─────────────────────────────────────
const MenosPastillas: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="una tendencia clara: menos fármacos, menos pastillas" t={36} p={p('tendencia')} color={TXV.violeta} />
    {[0, 1, 2].map((i) => <Sale key={i} p={tramo(p('menos'), i * 0.2, i * 0.2 + 0.5)} x={200 + i * 100} y={260}><Pastilla r={-30 + i * 20} k={1.1} color={[...[P.rt, P.hla, P.prot][i]]} /></Sale>)}
    <Txt x={300} y={340} txt="tres fármacos" t={24} p={p('menos')} />
    <Flecha a={[430, 260]} b={[560, 260]} p={p('pastillas')} color="var(--cit-flecha)" w={10} />
    <Sale p={p('pastillas')} x={700} y={260}><Pastilla r={-30} k={1.5} color={[...P.virus]} /></Sale>
    <Txt x={700} y={340} txt="dos fármacos en una pastilla" t={24} p={p('pastillas')} color={TXV.verde} />
    {/* la línea de tiempo de 2026 */}
    <rect x={160} y={520} width={1280} height={24} rx={12} fill="#B7AEDB" opacity={tramo(p('a2026'), 0, 0.5)} />
    <rect x={160} y={520} width={Math.max(0.1, 1280 * (0.72 * easeOut(p('abril')) + 0.0))} height={24} rx={12} fill={P.virus[1]} />
    <Sale p={p('a2026')} x={160} y={532}><Bola R={22} tono={[...P.espiga]} /></Sale><Txt x={160} y={600} txt="2026" t={34} p={p('a2026')} color={TXV.ambar} />
    <Bandera x={420} y={470} txt="FDA 21-04" color={P.cd4[0]} p={p('abril')} t={24} punta="abajo" />
    <Sale p={p('doravirina')} x={420} y={410}><Pastilla r={-30} k={1.1} color={[...P.cap]} /></Sale>
    <Txt x={420} y={650} txt="doravirina + islatravir" t={26} p={p('islatravir')} />
    <Bandera x={900} y={470} txt="FDA 27-08" color={P.hla[0]} p={p('agosto')} t={24} punta="abajo" />
    <Sale p={p('victegravir')} x={900} y={410}><Pastilla r={30} k={1.1} color={[...P.hla]} /></Sale>
    <Txt x={900} y={650} txt="bictegravir + lenacapavir" t={26} p={p('lenacapavir')} />
    <Txt x={660} y={720} txt="una pastilla diaria para adultos con carga viral suprimida" t={24} p={p('adultos')} />
    {/* en camino: islatravir con lenacapavir, una vez por semana */}
    <Sale p={p('viene')} x={1300} y={420}><Pastilla r={-30} k={1.6} color={[...P.esp]} /></Sale>
    <Bandera x={1300} y={560} txt="islatravir + lenacapavir" color={P.esp[0]} p={p('islatravir2')} t={26} punta="no" />
    <Txt x={1300} y={620} txt="una vez por semana" t={30} p={p('semana')} color={TXV.ambar} />
    <Txt x={1020} y={820} txt="ensayos de fase 3: ISLEND-1 e ISLEND-2" t={26} p={p('ensayos')} />
    <Txt x={1020} y={865} txt="cumplieron su objetivo a las 48 semanas" t={24} p={p('n48')} color={TXV.verde} />
    <Txt x={1020} y={925} txt="todavía sin aprobación" t={30} p={p('aprobada')} color={TXV.sangre} />
  </g>
);

// ─── 5 · Anticuerpos ampliamente neutralizantes ──────────────────────────────
const Anticuerpos: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="anticuerpos ampliamente neutralizantes" t={40} p={p('ampliamente')} color={TXV.violeta} />
    <Txt x={800} y={145} txt="hasta ahora usamos fármacos" t={24} p={p('usamos')} />
    <Sale p={p('espicula')} x={420} y={600}><Espiga k={5} /></Sale>
    <Txt x={420} y={240} txt="reconocen zonas de la espícula que casi no cambian" t={24} p={p('reconocen')} />
    {[[-70, -150, 'sitio de unión a CD4'], [70, -150, 'asa V3 y sus glicanos'], [0, -230, 'vértice V2'], [0, 40, 'región proximal a la membrana']].map(([dx, dy, n], i) => (
      <g key={i}>
        <circle cx={420 + (dx as number)} cy={600 + (dy as number) * 1.0 - 40} r={26 * easeOut(tramo(p('sitio'), i * 0.15, i * 0.15 + 0.5))} fill="none" stroke={P.espiga[1]} strokeWidth={7} />
      </g>
    ))}
    <Txt x={420} y={900} txt="sitio de unión a CD4, asa V3, vértice V2, región proximal a la membrana" t={20} p={p('cd4')} />
    <Sale p={p('anticuerpos')} x={760} y={420}><IgG k={2.6} r={-90} tono={['#B07A00', '#F2B21C', '#FFE49A']} /></Sale>
    <Txt x={1130} y={200} txt="ensayos AMP: un solo anticuerpo (VRC01)" t={26} p={p('ensayos')} />
    <Sale p={p('protegio')} x={1020} y={360}><Virion k={0.5} reloj={reloj} /></Sale>
    <Visto x={1020} y={470} k={0.8} p={p('sensibles')} /><Txt x={1080} y={470} txt="protegió contra los virus sensibles" t={22} ancla="start" p={p('sensibles')} color={TXV.verde} />
    <Sale p={p('contra')} x={1020} y={600}><Virion k={0.5} reloj={reloj} tono={P.inte} /></Sale>
    <Cruz x={1020} y={710} k={0.8} p={p('todos')} /><Txt x={1080} y={710} txt="no contra todos" t={22} ancla="start" p={p('todos')} color={TXV.sangre} />
    <Txt x={1130} y={800} txt="se estudian combinaciones" t={26} p={p('estudian')} />
    <Txt x={1130} y={845} txt="y versiones que duren meses" t={26} p={p('versiones')} color={TXV.ambar} />
    <Bandera x={1130} y={930} txt="experimentales" color={P.sangre[0]} p={p('experimentales')} t={30} punta="no" />
  </g>
);

// ─── 6 · ¿Y la cura? ─────────────────────────────────────────────────────────
const Cura: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="la gran pregunta: ¿y la cura?" t={44} p={p('pregunta')} color={TXV.violeta} />
    <Sale p={p('curar')} x={800} y={470}><Linfocito tono="gris" k={2.6} /></Sale>
    <Helice x={800} y={470} w={170} amp={20} vueltas={1.4} p={p('provirus')} grosor={9} resalta={[0, 1] as [number, number]} fase={reloj / 2000} />
    <Txt x={800} y={470} txt="?" t={150} p={p('curar')} color="#FFF" />
    {/* el camino conocido: trasplantes con CCR5Δ32 */}
    <Txt x={330} y={190} txt="trasplantes de células madre" t={26} p={p('trasplantes')} />
    <Txt x={330} y={235} txt="de donantes con dos copias de CCR5Δ32" t={22} p={p('copias')} />
    <Sale p={p('pacientes')} x={230} y={380}><Hombre k={0.22} piel={P.piel2} /></Sale><Sale p={p('pacientes')} x={430} y={380}><Hombre k={0.22} piel={P.piel2} pelo="#3A1B8E" /></Sale>
    <Txt x={330} y={480} txt="Berlín y Londres" t={24} p={p('pacientes')} />
    <Txt x={330} y={530} txt="con un cáncer de base" t={24} p={p('cancer')} color={TXV.ambar} />
    <Cruz x={330} y={640} k={1.0} p={p('riesgoso')} />
    <Txt x={330} y={720} txt="demasiado riesgoso para el resto" t={26} p={p('riesgoso')} color={TXV.sangre} />
    <Txt x={330} y={290} txt="un puñado de personas" t={22} p={p('punado')} />
    {/* lo que se investiga */}
    <Txt x={1230} y={190} txt="en investigación" t={30} p={p('investigacion')} color={TXV.violeta} />
    <Sale p={p('despertar')} x={1130} y={350}><Reloj k={0.7} ang={lerp(0, 720, p('despertar'))} /></Sale>
    <Txt x={1130} y={450} txt="despertar al provirus para eliminarlo" t={22} p={p('provirus')} />
    <Sale p={p('dormido')} x={1130} y={600}><Cerrojo k={0.5} /></Sale>
    <Txt x={1130} y={700} txt="dejarlo dormido para siempre" t={22} p={p('dormido')} />
    <Sale p={p('cortarlo')} x={1130} y={820}><Tijeras k={0.8} abre={0.7} r={90} /></Sale>
    <Txt x={1240} y={900} txt="cortarlo con edición genética" t={22} p={p('edicion')} />
    <Bandera x={800} y={900} txt="el reservorio sigue siendo el gran obstáculo" color={P.sangre[0]} p={p('reservorio')} t={26} punta="no" />
  </g>
);

const LAMINAS: Lamina[] = [InhibidorCapside, DosInyecciones, EnPeru, AccionProlongada, MenosPastillas, Anticuerpos, Cura];
export default LAMINAS;
