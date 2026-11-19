'use client';
// Capítulo 14 · Fallo y resistencia

import type { Lamina } from '../Lienzo';
import { Bandera, Bola, Cerrojo, Cruz, Flecha, Higado, Hombre, Intestino, Letra, Linfocito, P, Pastilla, Sale, Trazo, TuboEnsayo, Txt, TXV, Virion, Visto, easeOut, hash, lerp, tramo } from '../Piezas';

// ─── 0 · Fallo virológico, no solo inmunológico ──────────────────────────────
const FalloVirologico: Lamina = ({ p, reloj }) => (
  <g>
    <Sale p={p('caso')} x={240} y={330}><Hombre k={0.4} barba triste={0.7} /></Sale>
    <Txt x={240} y={470} txt="paciente 1" t={30} p={p('caso')} color={TXV.violeta} />
    <Txt x={240} y={515} txt="«no omití ninguna dosis»" t={24} p={p('omitio')} />
    {/* la curva baja y vuelve a subir */}
    <path d="M520,780 L520,200 M520,780 L1500,780" fill="none" stroke="var(--cit-texto-2)" strokeWidth={5} strokeLinecap="round" opacity={0.5 * tramo(p('sube'), 0, 0.5)} />
    <Trazo pts={[[530, 260], [640, 300], [760, 560], [880, 700], [1000, 690], [1150, 560], [1300, 400], [1460, 330]]} p={p('sube')} color={P.sangre[1]} w={13} />
    <Txt x={1380} y={280} txt="720 000" t={44} p={p('n720')} color={TXV.sangre} />
    <Txt x={1380} y={325} txt="copias/mL" t={22} p={p('n720')} />
    <Txt x={1000} y={830} txt="la carga viral sube" t={28} p={p('sube')} color={TXV.sangre} />
    <path d="M530,640 L1500,640" stroke={P.espiga[1]} strokeWidth={6} strokeDasharray="14 12" opacity={p('n1000')} />
    <Txt x={640} y={612} txt="1 000 copias/mL (OMS)" t={22} ancla="start" p={p('n1000')} color={TXV.ambar} />
    <path d="M530,720 L1500,720" stroke={P.virus[1]} strokeWidth={6} strokeDasharray="14 12" opacity={p('n200')} />
    <Txt x={1500} y={752} txt="200 copias/mL (HHS)" t={22} ancla="end" p={p('n200')} color={TXV.verde} />
    {/* hay que pensar en fallo virológico, no solo inmunológico */}
    <Bandera x={760} y={120} txt="el nombre correcto: fallo virológico" color={P.sangre[0]} p={p('virologico')} t={32} punta="no" />
    <Txt x={760} y={180} txt="primero, el nombre correcto" t={24} p={p('nombre')} />
    <Txt x={240} y={650} txt="no solo inmunológico" t={26} p={p('inmunologico')} color={TXV.cd4} />
    <Txt x={240} y={700} txt="CD4 85/µL" t={30} p={p('inmunologico')} color={TXV.cd4} />
    <Txt x={240} y={800} txt="la carga viral no se suprime" t={22} p={p('suprime')} />
    <Txt x={240} y={840} txt="o vuelve a subir con el tratamiento" t={22} p={p('vuelve')} />
    <Bandera x={680} y={900} txt="OMS: persistentemente > 1 000" color={P.cd4[0]} p={p('oms')} t={26} punta="no" />
    <Txt x={1160} y={900} txt="dos medidas, con tres meses de separación" t={22} p={p('persist')} />
    <Bandera x={1180} y={960} txt="HHS: no suprimir o no mantener < 200" color={P.hla[0]} p={p('hhs')} t={26} punta="no" />
  </g>
);

// ─── 1 · La causa más frecuente ──────────────────────────────────────────────
const CausaFrecuente: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="la causa más frecuente del fallo: la adherencia imperfecta" t={34} p={p('fallo')} color={TXV.violeta} />
    {/* el pastillero: una dosis olvidada que nadie ve */}
    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
      <g key={i} opacity={tramo(p('adherencia'), (i / 7) * 0.5, (i / 7) * 0.5 + 0.4)}>
        <rect x={120 + i * 118} y={200} width={100} height={150} rx={22} fill="#DCD6F5" /><rect x={128 + i * 118} y={208} width={84} height={134} rx={18} fill="#F4F1FF" />
        <Letra x={170 + i * 118} y={236} txt={d} t={28} color="#3A2A6A" />
        {i !== 3 && <Pastilla x={170 + i * 118} y={290} k={0.55} r={-30} color={[...P.virus]} />}
        {i === 3 && <Pastilla x={170 + i * 118} y={290} k={0.55} r={-30} color={[...P.virus]} o={1} />}
      </g>
    ))}
    <circle cx={120 + 3 * 118 + 50} cy={278} r={64 * easeOut(p('imperfecta'))} fill="none" stroke={P.sangre[1]} strokeWidth={8} />
    <Txt x={500} y={410} txt="una dosis olvidada que nadie ve" t={30} p={p('nadie')} color={TXV.sangre} />
    <Txt x={500} y={455} txt="a veces el paciente cree que cumple" t={24} p={p('cree')} />
    <Txt x={500} y={500} txt="y a veces se esconde" t={24} p={p('mentir')} />
    <Sale p={p('pregunta')} x={1250} y={300}><Hombre k={0.3} piel={P.piel2} /></Sale>
    <Visto x={1250} y={470} k={0.7} p={p('juzgar')} />
    <Txt x={1250} y={540} txt="se pregunta sin juzgar" t={26} p={p('juzgar')} color={TXV.verde} />
    {/* las barreras */}
    <Txt x={800} y={620} txt="se buscan las barreras" t={32} p={p('barreras')} color={TXV.violeta} />
    {[['efectos adversos', 'efectos', P.sangre], ['depresión', 'depresion', P.inte], ['alcohol', 'alcohol', P.cap], ['falta de dinero', 'dinero', P.espiga], ['falta de comida', 'comida', P.virus], ['miedo a que otros se enteren', 'miedo', P.hla]].map(([n, id, tono], i) => (
      <Bandera key={id as string} x={300 + (i % 3) * 500} y={710 + Math.floor(i / 3) * 80} txt={n as string} color={(tono as readonly string[])[0]} p={[p('efectos'), p('depresion'), p('alcohol'), p('dinero'), p('comida'), p('miedo')][i]} t={24} punta="no" />
    ))}
    <Txt x={800} y={900} txt="mientras no se resuelvan, cambiar el esquema no sirve de nada" t={30} p={p('mientras')} color={TXV.sangre} />
    <Cruz x={180} y={900} k={0.8} p={p('cambiar')} />
  </g>
);

// ─── 2 · Interacciones y absorción ───────────────────────────────────────────
const InteraccionesAbsorcion: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="otra posibilidad: que el fármaco no llegue a la sangre" t={34} p={p('posibilidad')} color={TXV.violeta} />
    <Sale p={p('induce')} x={330} y={410}><Higado k={0.6} /></Sale>
    <Txt x={330} y={230} txt="inductores de las enzimas del hígado" t={24} p={p('enzimas')} />
    {[['rifampicina', 'rifampicina', P.cap], ['carbamazepina', 'carbamazepina', P.hla], ['hierba de San Juan', 'hierba', P.espiga]].map(([n, id, tono], i) => (
      <Sale key={id as string} p={[p('rifampicina'), p('carbamazepina'), p('hierba')][i]} x={130 + i * 200} y={640}><Pastilla r={-30 + i * 25} k={1.0} color={[...(tono as readonly string[])]} /></Sale>
    ))}
    <Txt x={130} y={700} txt="rifampicina" t={20} p={p('rifampicina')} /><Txt x={330} y={700} txt="carbamazepina" t={20} p={p('carbamazepina')} /><Txt x={530} y={700} txt="hierba de San Juan" t={20} p={p('hierba')} />
    <Trazo pts={[[640, 420], [720, 470], [800, 540], [880, 600]]} p={p('bajan')} color={P.sangre[1]} w={12} />
    <Txt x={760} y={370} txt="bajan los niveles del antirretroviral" t={24} p={p('bajan')} color={TXV.sangre} />
    {/* el calcio, el hierro y el magnesio atrapan al dolutegravir */}
    <Sale p={p('dolute')} x={1130} y={420}><Pastilla r={20} k={1.8} color={[...P.hla]} /></Sale>
    {[['Ca', 'calcio', -120, -90, P.espiga], ['Fe', 'hierro', 120, -80, P.sangre], ['Mg', 'magnesio', 0, 110, P.virus]].map(([n, id, dx, dy, tono], i) => (
      <Sale key={n as string} p={[p('calcio'), p('hierro'), p('magnesio')][i]} x={1130 + (dx as number)} y={420 + (dy as number)}><Bola R={34} tono={[...(tono as readonly string[])]} /><Letra txt={n as string} t={28} /></Sale>
    ))}
    <Txt x={1130} y={600} txt="lo atrapan en el intestino" t={24} p={p('atrapan')} color={TXV.sangre} />
    {/* vómitos o diarrea */}
    <Sale p={p('vomitos')} x={1000} y={790}><Intestino k={0.9} /></Sale>
    <Txt x={1160} y={760} txt="vómitos" t={26} ancla="start" p={p('vomitos')} /><Txt x={1160} y={805} txt="diarrea" t={26} ancla="start" p={p('diarrea')} />
    <Txt x={1000} y={978} txt="parte del fármaco se pierde antes de absorberse" t={22} p={p('pierda')} color={TXV.sangre} />
  </g>
);

// ─── 3 · Resistencia y barrera genética ──────────────────────────────────────
const Resistencia: Lamina = ({ p, reloj }) => {
  const TON = [P.virus, P.esp, P.inte, P.hla, P.rt, P.cap] as const;
  const gana = easeOut(p('gana'));
  return (
    <g>
      <Txt x={800} y={90} txt="la resistencia sale del mismo error de la transcriptasa" t={34} p={p('resistencia')} color={TXV.violeta} />
      <Txt x={800} y={140} txt="el error de la transcriptasa inversa" t={22} p={p('error')} />
      {/* la nube de variantes: con poco fármaco gana la que resiste */}
      {Array.from({ length: 16 }, (_, i) => {
        const x = 150 + (i % 4) * 130 + (hash(i, 2) - 0.5) * 40, y = 280 + Math.floor(i / 4) * 120 + (hash(i, 3) - 0.5) * 30;
        const res = i === 5;
        return <Virion key={i} x={x} y={y} k={res ? 0.34 + 0.12 * gana : 0.28} tono={res ? P.espiga : TON[i % 6]} o={tramo(p('nube'), (i / 16) * 0.6, (i / 16) * 0.6 + 0.4) * (res ? 1 : 1 - 0.85 * gana)} reloj={reloj + i * 100} />;
      })}
      <Txt x={340} y={780} txt="una nube de variantes" t={26} p={p('nube')} />
      <circle cx={150 + 1 * 130} cy={280 + 120} r={70 * easeOut(p('resiste'))} fill="none" stroke={P.espiga[1]} strokeWidth={8} />
      <Txt x={340} y={820} txt="siempre hay alguna que resiste" t={24} p={p('variante')} color={TXV.ambar} />
      <Sale p={p('nivel')} x={760} y={405}><Pastilla r={-30} k={1.0} color={[...P.rt]} o={0.5} /></Sale>
      <Txt x={760} y={480} txt="con la concentración del fármaco baja," t={22} p={p('gana')} color={TXV.sangre} /><Txt x={760} y={514} txt="gana la que resiste" t={22} p={p('gana')} color={TXV.sangre} />
      <Txt x={760} y={550} txt="y se multiplica" t={24} p={p('multiplica')} />
      {/* mutaciones con nombre propio */}
      <Bandera x={1150} y={230} txt="M184V: lamivudina y emtricitabina" color={P.esp[0]} p={p('m184v')} t={24} punta="no" />
      <Bandera x={1150} y={310} txt="K103N: efavirenz y nevirapina" color={P.cap[0]} p={p('k103n')} t={24} punta="no" />
      <Bandera x={1150} y={390} txt="K65R: tenofovir" color={P.rt[0]} p={p('k65r')} t={24} punta="no" />
      <Txt x={1150} y={170} txt="mutaciones con nombre propio" t={26} p={p('mutaciones')} color={TXV.violeta} />
      {/* la barrera genética: cuántas mutaciones necesita el virus */}
      <Bandera x={1100} y={500} txt="barrera genética" color={P.hla[0]} p={p('barrera')} t={30} punta="no" />
      <Txt x={1100} y={555} txt="cuántas mutaciones necesita el virus" t={22} p={p('cuantas')} />
      <Sale p={p('baja')} x={950} y={680}><Cerrojo k={0.5} /></Sale>
      <Txt x={950} y={780} txt="baja: con una basta" t={22} p={p('basta')} color={TXV.sangre} />
      <Txt x={950} y={815} txt="lamivudina, efavirenz" t={20} p={p('baja')} />
      {[1250, 1350, 1450].map((x, i) => <Sale key={x} p={tramo(p('alta'), i * 0.2, i * 0.2 + 0.5)} x={x} y={680}><Cerrojo k={0.4} tono={P.virus} /></Sale>)}
      <Txt x={1350} y={780} txt="alta: varias" t={22} p={p('varias')} color={TXV.verde} />
      <Txt x={1350} y={815} txt="dolutegravir, bictegravir, darunavir potenciado" t={18} p={p('alta')} />
    </g>
  );
};

// ─── 4 · Qué se hace ─────────────────────────────────────────────────────────
const QueSeHace: Lamina = ({ p, reloj }) => (
  <g>
    {[['1', 'confirmar el fallo', 'confirma', P.sangre, 200], ['2', 'reforzar la adherencia', 'refuerza', P.virus, 340], ['3', 'pedir un genotipo, con el tratamiento puesto', 'genotipo', P.hla, 480]].map(([n, txt, id, tono, y], i) => (
      <g key={n as string}>
        <Sale p={[p('confirma'), p('refuerza'), p('genotipo')][i]} x={200} y={y as number}><Bola R={42} tono={[...(tono as readonly string[])]} /><Letra txt={n as string} t={42} /></Sale>
        <Txt x={290} y={y as number} txt={txt as string} t={34} ancla="start" p={[p('confirma'), p('refuerza'), p('genotipo')][i]} />
      </g>
    ))}
    <Sale p={p('pide')} x={1250} y={330}><TuboEnsayo k={1.3} reloj={reloj} color={P.sangre[1]} /></Sale>
    {/* si se suspende, las variantes resistentes desaparecen de la sangre y no se ven */}
    <Txt x={400} y={620} txt="si se suspende el tratamiento" t={28} p={p('suspende')} color={TXV.sangre} />
    {[0, 1, 2, 3].map((i) => <Virion key={i} x={260 + i * 110} y={720} k={0.26} tono={i === 1 ? P.espiga : P.virus} o={i === 1 ? 1 - easeOut(p('desaparecen')) : 1 - 0.0 * i} reloj={reloj + i * 200} />)}
    <Txt x={400} y={800} txt="las variantes resistentes desaparecen de la sangre" t={24} p={p('variantes')} />
    <Txt x={400} y={845} txt="y el genotipo no las ve" t={26} p={p('desaparecen')} color={TXV.sangre} />
    {/* el nuevo esquema: al menos dos fármacos plenamente activos */}
    <Bandera x={1180} y={600} txt="el nuevo esquema" color={P.cd4[0]} p={p('nuevo')} t={30} punta="no" />
    <Pastilla x={1050} y={720} k={1.3} r={-30} color={[...P.rt]} o={tramo(p('activos'), 0, 0.5)} /><Pastilla x={1180} y={720} k={1.3} r={30} color={[...P.hla]} o={tramo(p('activos'), 0.2, 0.7)} /><Pastilla x={1310} y={720} k={1.3} r={-20} color={[...P.prot]} o={tramo(p('tres'), 0, 0.5)} />
    <Txt x={1180} y={800} txt="al menos dos plenamente activos" t={24} p={p('activos')} />
    <Txt x={1180} y={840} txt="de preferencia tres" t={26} p={p('tres')} color={TXV.verde} />
    <Bandera x={1150} y={930} txt="Perú: darunavir/ritonavir para el fallo de primera línea" color={P.sangre[0]} p={p('peru')} t={24} punta="no" />
  </g>
);

// ─── 5 · El reservorio y la inflamación persistente ──────────────────────────
const ReservorioInflamacion: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="aunque el tratamiento funcione, no apaga todo" t={36} p={p('aunque')} color={TXV.violeta} />
    <Bandera x={1250} y={170} txt="carga viral indetectable" color={P.virus[0]} p={p('indetectable')} t={28} punta="no" />
    <Sale p={p('galt')} x={340} y={470}><Intestino k={1.7} /></Sale>
    <Bandera x={340} y={230} txt="GALT" color={P.rt[0]} p={p('galt')} t={30} punta="no" />
    {Array.from({ length: 14 }, (_, i) => <Sale key={i} p={tramo(p('reservorio'), (i / 14) * 0.6, (i / 14) * 0.6 + 0.4)} x={640 + (hash(i, 1) - 0.5) * 220 + 80} y={470 + (hash(i, 2) - 0.5) * 300}><Linfocito k={0.34} tono={i % 4 === 0 ? 'gris' : 't'} o={1 - 0.0 * easeOut(p('cd4'))} /></Sale>)}
    <Txt x={800} y={650} txt="mantiene replicación y reservorio" t={24} p={p('reservorio')} color={TXV.ambar} />
    <Txt x={800} y={695} txt="pérdida de CD4 de la mucosa" t={24} p={p('cd4')} color={TXV.sangre} />
    {/* la mucosa sigue dejando pasar bacterias hacia la sangre */}
    <Txt x={1000} y={330} txt="la mucosa sigue dejando pasar bacterias" t={24} p={p('mucosa')} ancla="start" />
    {Array.from({ length: 6 }, (_, i) => {
      const u = ((reloj / 2600 + i / 6) % 1) * easeOut(p('bacterias'));
      return <g key={i} transform={`translate(${920 + i * 90},${lerp(440, 640, u)})`} opacity={easeOut(p('bacterias')) * (1 - 0.3 * u)}><rect x={-30} y={-12} width={60} height={24} rx={12} fill={P.esp[0]} /><rect x={-26} y={-9} width={50} height={16} rx={8} fill={P.esp[1]} /></g>;
    })}
    <rect x={820} y={700} width={720} height={70} rx={30} fill={P.sangre[0]} opacity={0.85 * tramo(p('sangre'), 0, 0.5)} /><rect x={820} y={708} width={720} height={54} rx={26} fill={P.sangre[1]} opacity={0.85 * tramo(p('sangre'), 0, 0.5)} />
    <Txt x={1180} y={735} txt="sangre" t={30} p={p('sangre')} color="#FFF" />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d="M0,0 Q10,-22 0,-44 Q-10,-22 0,0" fill={P.sangre[1]} transform={`translate(${880 + i * 80},${830}) scale(${easeOut(p('inflamacion')) * (0.8 + 0.3 * Math.sin(reloj / 200 + i))})`} />)}
    <Txt x={1180} y={900} txt="la inflamación persiste, incluso con la carga viral indetectable" t={26} p={p('persiste')} color={TXV.sangre} />
    <Txt x={400} y={850} txt="el tratamiento frena al virus" t={26} p={p('frena')} color={TXV.verde} />
    <Txt x={400} y={895} txt="pero no repara todo el daño" t={26} p={p('repara')} color={TXV.sangre} />
  </g>
);

// ─── 6 · Entonces, ¿qué le pasó al paciente? ─────────────────────────────────
const QueLePaso: Lamina = ({ p, reloj }) => {
  const RAMAS = [
    { x: 230, txt: 'adherencia', q: p('verificar'), tono: P.virus },
    { x: 560, txt: 'interacciones y absorción', q: p('interacciones'), tono: P.cap },
    { x: 960, txt: 'resistencia: carga viral y genotipo', q: p('genotipo'), tono: P.hla },
    { x: 1330, txt: 'reservorio e inflamación', q: p('carga'), tono: P.rt },
  ];
  return (
    <g>
      <Sale p={p('paciente')} x={800} y={200}><Hombre k={0.3} barba triste={0.7} /></Sale>
      <Txt x={800} y={330} txt="¿qué le pasó a nuestro paciente?" t={34} p={p('paciente')} color={TXV.violeta} />
      <Txt x={800} y={380} txt="no se sabe con un solo dato" t={24} p={p('sabemos')} />
      {RAMAS.map((r, i) => (
        <g key={r.txt}>
          <Flecha a={[800, 410]} b={[r.x, 520]} c={[(800 + r.x) / 2, 430]} p={r.q} color={r.tono[1]} w={9} />
          <Bandera x={r.x} y={570} txt={r.txt} color={r.tono[0]} p={r.q} t={22} punta="no" />
        </g>
      ))}
      <Txt x={230} y={640} txt="sin juzgar" t={22} p={p('juzgar')} />
      <Txt x={560} y={640} txt="se revisan" t={22} p={p('revisar')} />
      <Txt x={960} y={640} txt="carga viral de control" t={22} p={p('pedir')} />
      <Txt x={960} y={680} txt="y genotipo" t={22} p={p('control')} />
      <Txt x={800} y={780} txt="mientras tanto, se trata lo urgente" t={32} p={p('tratar')} color={TXV.sangre} />
      <Sale p={p('neumonia')} x={520} y={890}><Pastilla r={-30} k={1.3} color={[...P.rt]} /></Sale>
      <Txt x={640} y={890} txt="la neumonía por Pneumocystis" t={26} ancla="start" p={p('neumonia')} />
      <Txt x={640} y={935} txt="y su profilaxis" t={24} ancla="start" p={p('profilaxis')} color={TXV.ambar} />
      <Txt x={1340} y={890} txt="del contagio al sida y al fallo:" t={24} p={p('recorriste')} />
      <Txt x={1340} y={930} txt="recorriste todo el camino" t={26} p={p('contagio')} color={TXV.verde} />
    </g>
  );
};

const LAMINAS: Lamina[] = [FalloVirologico, CausaFrecuente, InteraccionesAbsorcion, Resistencia, QueSeHace, ReservorioInflamacion, QueLePaso];
export default LAMINAS;
