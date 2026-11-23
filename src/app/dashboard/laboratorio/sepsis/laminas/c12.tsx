'use client';
// Capítulo 12 · El choque: vasoplejía, catecolaminas y corazón

import type { Lamina } from '../Lienzo';
import { Bandera, Barra, Chip, Corazon, Cruz, Enzima, Jeringa, Late, Manometro, NO, Proteina, S, Sale, Txt, easeOut, hash, lerp, tramo } from '../Piezas';

const corre = (reloj: number, i: number, n: number, periodo: number) => ((reloj / periodo + i / n) % 1);

/** Corte de una arteriola: la pared de músculo liso se relaja (adelgaza) y la luz se abre. */
const Arteriola = ({ x, y, k = 1, relaja = 0, reloj = 0 }: { x: number; y: number; k?: number; relaja?: number; reloj?: number }) => {
  const r = easeOut(relaja), pared = lerp(78, 26, r), luz = lerp(52, 134, r);
  return (
    <g transform={`translate(${x},${y}) scale(${k})`}>
      <circle r={luz + pared + 12} fill="#7A1E3A" /><circle r={luz + pared} fill="#B02FA0" /><circle r={luz + pared - 6} fill="#E8A4E4" />
      {Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * (luz + pared * 0.5)} cy={Math.sin(a) * (luz + pared * 0.5)} r={8 + (1 - r) * 5} fill="#B02FA0" opacity={0.55} />; })}
      <circle r={luz} fill="#5E1030" />
      {[[-30, -20], [20, 30], [40, -30]].map(([cx, cy], i) => <circle key={i} cx={(cx * luz) / 80 + Math.sin(reloj / 700 + i) * 6} cy={(cy * luz) / 80} r={16} fill={S.sangre[1]} />)}
    </g>
  );
};

/** Canal de potasio en la membrana: dos mitades de proteína con una compuerta que se abre. */
const CanalK = ({ abre = 0 }: { abre?: number }) => {
  const g = lerp(10, 70, easeOut(abre));
  return (
    <g>
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${s * (g / 2 + 34)},0)`}>
          <rect x={-34} y={-78} width={68} height={166} rx={30} fill="#8E1B9C" />
          <rect x={-34} y={-86} width={68} height={160} rx={30} fill="#D23AD8" />
          <ellipse cx={-12 * s} cy={-48} rx={9} ry={26} fill="#FFFFFF" opacity={0.55} />
        </g>
      ))}
      <rect x={-g / 2 + 2} y={-70} width={Math.max(0, g - 4)} height={140} rx={8} fill={S.no[1]} opacity={0.25 * easeOut(abre)} />
    </g>
  );
};

// ─── 0 · Vasoplejía ──────────────────────────────────────────────────────────
const Vasoplejia: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="¿por qué en el choque los vasos dejan de apretar?" color={S.il6[0]} p={p('vasos')} t={32} punta="no" />
    <Sale p={p('vasos')} x={430} y={500} k={1.15}><Arteriola x={0} y={0} relaja={0} reloj={reloj} /></Sale>
    <Bandera x={430} y={740} txt="tono normal" color={S.gluco[0]} p={p('vasos')} t={28} punta="no" />
    <Sale p={p('relaja')} x={1170} y={500} k={1.15}><Arteriola x={0} y={0} relaja={p('relaja')} reloj={reloj} /></Sale>
    <Bandera x={1170} y={740} txt="vasoplejía" color={S.il1[0]} p={p('vasoplejia')} t={32} punta="no" />
    <Bandera x={800} y={300} txt="pérdida del tono vascular" color={S.il1[0]} p={p('tono')} t={30} punta="no" />
    <Bandera x={800} y={400} txt="el músculo liso se relaja" color={S.il1[0]} p={p('musculo')} t={26} punta="no" />
    <Bandera x={800} y={480} txt="y deja de responder a lo que lo contrae" color={S.il1[0]} p={p('responder')} t={26} punta="no" />
    <Sale p={p('goma')} x={800} y={640} k={1}><g><rect x={-130} y={-24} width={260} height={48} rx={24} fill={S.membrana[0]} /><rect x={-126} y={-28} width={252} height={40} rx={20} fill={S.membrana[1]} transform={`rotate(${Math.sin(reloj / 400) * 3})`} /></g></Sale>
    <Bandera x={800} y={720} txt="como una goma que se ablanda" color={S.membrana[0]} p={p('goma')} t={26} punta="no" />
    <Bandera x={800} y={930} txt="sin tono, la presión no se sostiene" color={S.il1[0]} p={p('sostiene')} t={34} punta="no" />
  </g>
);

// ─── 1 · Óxido nítrico ───────────────────────────────────────────────────────
const OxidoNitricoL: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="primer responsable: el óxido nítrico" color={S.no[0]} p={p('no')} t={32} punta="no" />
    <Sale p={p('inos')} x={280} y={420} k={3}><Enzima /></Sale>
    <Bandera x={280} y={560} txt="iNOS" color={S.no[0]} p={p('inos')} t={36} punta="no" />
    <Bandera x={280} y={260} txt="encendida por NF-κB e IL-1" color={S.nfkb[0]} p={p('il1')} t={24} punta="no" />
    {Array.from({ length: 12 }, (_, i) => { const u = corre(reloj, i, 12, 2600); return <g key={i} opacity={tramo(p('fabrica'), 0, 0.4) * (1 - u * 0.3)} transform={`translate(${lerp(400, 760, u)},${420 + Math.sin(i * 2 + u * 6) * 90})`}><NO k={1.5} /></g>; })}
    <Bandera x={580} y={620} txt="óxido nítrico en cantidades enormes" color={S.no[0]} p={p('fabrica')} t={24} punta="no" />
    <Sale p={p('entra')} x={1050} y={420} k={1}><g><ellipse rx={220} ry={150} fill="#B02FA0" /><ellipse cx={-4} cy={-4} rx={210} ry={140} fill="#E8A4E4" /><ellipse cx={20} cy={30} rx={70} ry={48} fill={S.nucleo[1]} /></g></Sale>
    <Bandera x={1050} y={640} txt="entra en la célula muscular" color={S.endo[0]} p={p('entra')} t={26} punta="no" />
    <Sale p={p('enzima')} x={1000} y={380} k={1.4}><Enzima r={20} /></Sale>
    <Sale p={p('gmp')} x={1130} y={430} k={1}><Chip x={0} y={0} txt="GMP cíclico ↑" color={S.il6[0]} t={26} /></Sale>
    <Bandera x={1050} y={760} txt="el GMP cíclico relaja el músculo liso" color={S.il6[0]} p={p('relaja')} t={26} punta="no" />
    <Bandera x={800} y={930} txt="un gas que apaga el músculo" color={S.no[0]} p={p('gas')} t={34} punta="no" />
  </g>
);

// ─── 2 · Compuertas de potasio ───────────────────────────────────────────────
const Compuertas: Lamina = ({ p, reloj }) => {
  const sale = easeOut(p('sale'));
  return (
    <g>
      <Bandera x={800} y={95} txt="una segunda vía, más sutil" color={S.il6[0]} p={p('segunda')} t={32} punta="no" />
      <rect x={0} y={520} width={1600} height={90} fill={S.membrana[0]} opacity={0.5} />
      {[400, 800, 1200].map((x, i) => <g key={i}><Sale p={p('canales')} x={x} y={565} k={1.35}><CanalK abre={p('potasio')} /></Sale></g>)}
      <Sale p={p('acidosis')} x={250} y={260} k={1}><Chip x={0} y={0} txt="acidosis" color={S.il1[0]} t={26} /></Sale>
      <Sale p={p('lactato')} x={530} y={260} k={1}><Chip x={0} y={0} txt="lactato" color={S.lactato[0]} t={26} /></Sale>
      <Sale p={p('atp')} x={800} y={260} k={1}><Chip x={0} y={0} txt="ATP ↓" color={S.lps[0]} t={26} /></Sale>
      {Array.from({ length: 9 }, (_, i) => { const u = corre(reloj, i, 9, 2400); return <g key={i} opacity={tramo(p('potasio'), 0, 0.3) * sale * (1 - u * 0.5)} transform={`translate(${[400, 800, 1200][i % 3] + (hash(i, 2) - 0.5) * 40},${lerp(560, 330, u)})`}><circle r={27} fill={S.no[1]} /><circle cx={-8} cy={-9} r={7} fill="#FFF" opacity={0.5} /><text y={10} textAnchor="middle" fontSize={27} fontWeight={800} fill="#FFF">K⁺</text></g>; })}
      <Bandera x={400} y={420} txt="canales de potasio sensibles al ATP" color={S.no[0]} p={p('potasio')} t={24} punta="no" />
      <Bandera x={1180} y={420} txt="el potasio sale: la célula se hiperpolariza" color={S.il6[0]} p={p('hiperpolariza')} t={24} punta="no" />
      {Array.from({ length: 5 }, (_, i) => <g key={i} opacity={tramo(p('calcio'), 0, 0.4)} transform={`translate(${300 + i * 250},${760})`}><circle r={34} fill={S.lps[1]} /><circle cx={-10} cy={-11} r={8} fill="#FFF" opacity={0.5} /><text y={9} textAnchor="middle" fontSize={24} fontWeight={800} fill="#FFF">Ca²⁺</text><g opacity={tramo(p('calcio'), 0.4, 1)}><Cruz x={0} y={-62} k={0.8} /></g></g>)}
      <Bandera x={800} y={850} txt="el calcio ya no entra: el músculo no se contrae" color={S.lps[0]} p={p('contrae')} t={26} punta="no" />
      <Bandera x={420} y={940} txt="puertas que se abren cuando la célula sufre" color={S.il6[0]} p={p('puertas')} t={26} punta="no" />
      <Bandera x={1180} y={940} txt="y al abrirse, el vaso se afloja" color={S.il1[0]} p={p('afloja')} t={30} punta="no" />
    </g>
  );
};

// ─── 3 · La vasopresina se agota ─────────────────────────────────────────────
const Vasopresina: Lamina = ({ p, reloj }) => {
  const sube = easeOut(p('sube')), cae = easeOut(p('caen'));
  const y0 = 800, y1 = y0 - 400 * sube, necesita = 470;
  const pts = [[180, y0], [420, y1], [700, y1 - 20 * sube], [1000, y1 + 250 * cae], [1420, y1 + 310 * cae]];
  return (
    <g>
      <Bandera x={800} y={95} txt="¿y las hormonas que sostienen la presión?  Una se acaba" color={S.il6[0]} p={p('hormonas')} t={30} punta="no" />
      <path d="M150,830 L150,260 M150,830 L1520,830" stroke="var(--cit-texto-2)" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.45 * tramo(p('vasopresina'), 0, 0.4)} />
      <line x1={150} y1={necesita} x2={1500} y2={necesita} stroke={S.gluco[1]} strokeWidth={8} strokeDasharray="30 22" strokeLinecap="round" opacity={0.9 * tramo(p('menos'), 0, 0.6)} />
      <Bandera x={1260} y={necesita - 55} txt="lo que el cuerpo necesita" color={S.gluco[0]} p={p('menos')} t={24} punta="no" />
      <polyline points={pts.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke={S.il6[1]} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" opacity={tramo(p('vasopresina'), 0, 0.4)} />
      <circle cx={pts[4][0]} cy={pts[4][1]} r={18 + 3 * Math.sin(reloj / 300)} fill={S.il6[0]} opacity={tramo(p('caen'), 0.3, 1)} />
      <Sale p={p('vasopresina')} x={330} y={215} k={1.2}><Chip x={0} y={0} txt="vasopresina" color={S.il6[0]} t={32} /></Sale>
      <Bandera x={600} y={320} txt="sube al principio" color={S.gluco[0]} p={p('sube')} t={26} punta="no" />
      <Bandera x={1000} y={905} txt="cuando el choque se establece…" color={S.il1[0]} p={p('establece')} t={26} punta="no" />
      <Bandera x={1210} y={585} txt="…sus niveles caen de forma relativa" color={S.il1[0]} p={p('caen')} t={26} punta="no" />
      <Bandera x={800} y={965} txt="el cuerpo se queda sin uno de sus apoyos" color={S.il1[0]} p={p('apoyos')} t={34} punta="no" />
    </g>
  );
};

// ─── 4 · Catecolaminas que no alcanzan ───────────────────────────────────────
const Catecolaminas: Lamina = ({ p, reloj }) => {
  const des = easeOut(p('desensibilizan')), inte = easeOut(p('internalizan'));
  return (
    <g>
      <Bandera x={800} y={95} txt="¿por qué no bastan la adrenalina y la noradrenalina?" color={S.il6[0]} p={p('catecolaminas')} t={30} punta="no" />
      <rect x={0} y={560} width={1600} height={100} fill={S.membrana[0]} opacity={0.5} />
      {[330, 650, 970, 1290].map((x, i) => (
        <g key={i} transform={`translate(${x},${i < 2 ? 560 : 560 + 150 * inte})`} opacity={i < 2 ? 1 : 1 - 0.5 * des}>
          <g opacity={tramo(p('primero'), 0, 0.4)}><Proteina k={1.2} reloj={reloj} fase={i} /></g>
        </g>
      ))}
      <Bandera x={650} y={470} txt="receptores α1" color={S.il6[0]} p={p('alfa')} t={26} punta="no" />
      <Bandera x={1130} y={470} txt="se desensibilizan y se internalizan" color={S.il1[0]} p={p('internalizan')} t={24} punta="no" />
      {Array.from({ length: 5 }, (_, i) => { const u = corre(reloj, i, 5, 3000); return <g key={i} opacity={tramo(p('segundo'), 0, 0.4) * (1 - tramo(p('oxidan'), i * 0.1, i * 0.1 + 0.5))} transform={`translate(${lerp(260, 1400, u)},${300 + Math.sin(i * 2 + u * 5) * 40})`}><circle r={20} fill={S.tnf[1]} /><text y={7} textAnchor="middle" fontSize={16} fontWeight={800} fill="#FFF">NA</text></g>; })}
      <Bandera x={800} y={330} txt="las especies reactivas de oxígeno y el peroxinitrito las oxidan" color={S.verde[0]} p={p('ros')} t={24} punta="no" />
      <Bandera x={800} y={830} txt="menos receptores y menos hormona útil" color={S.il1[0]} p={p('menos')} t={28} punta="no" />
      <Bandera x={800} y={920} txt="se necesita más cantidad para el mismo efecto" color={S.il6[0]} p={p('cantidad')} t={28} punta="no" />
    </g>
  );
};

// ─── 5 · La PAM del joven ────────────────────────────────────────────────────
const PamJoven: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="¿cuánto vale la presión del joven?  78 sobre 42" color={S.il6[0]} p={p('presion')} t={32} punta="no" />
    <Sale p={p('media')} x={460} y={470} k={2.2}><Manometro x={0} y={0} val={0.36} /></Sale>
    <Bandera x={460} y={700} txt="PAM = (sistólica + 2 × diastólica) / 3" color={S.il6[0]} p={p('media')} t={24} punta="no" />
    <Txt x={460} y={830} txt="54 mmHg" t={92} p={p('c54')} color="var(--se-sangre)" />
    <Bandera x={460} y={910} txt="por debajo de la meta de 65" color={S.il1[0]} p={p('meta')} t={28} punta="no" />
    <Bandera x={1150} y={250} txt="hipotensión franca" color={S.il1[0]} p={p('hipotension')} t={30} punta="no" />
    <Bandera x={1150} y={330} txt="vasodilatación · fuga capilar · disfunción del miocardio" color={S.il1[0]} p={p('vasodilatacion')} t={22} punta="no" />
    <Bandera x={1150} y={420} txt="no mejora con los líquidos" color={S.c5a[0]} p={p('liquidos')} t={26} punta="no" />
    <Sale p={p('norepinefrina')} x={1100} y={600} k={1.6} r={-35}><Jeringa liquido="#FFC02E" /></Sale>
    <Bandera x={1150} y={760} txt="necesita norepinefrina" color={S.tnf[0]} p={p('norepinefrina')} t={30} punta="no" />
    <Bandera x={1150} y={850} txt="actúa sobre los receptores α1" color={S.il6[0]} p={p('actua')} t={26} punta="no" />
    <Bandera x={1150} y={930} txt="y vuelve a contraer el músculo liso" color={S.il6[0]} p={p('contraer')} t={26} punta="no" />
  </g>
);

// ─── 6 · Miocardiopatía séptica ──────────────────────────────────────────────
const Miocardiopatia: Lamina = ({ p, reloj }) => {
  const dil = easeOut(p('ventriculo')), cae = easeOut(p('cae'));
  return (
    <g>
      <Bandera x={800} y={95} txt="miocardiopatía séptica" color={S.il6[0]} p={p('miocardiopatia')} t={36} punta="no" />
      <Sale p={p('corazon')} x={400} y={520} k={1.3 * (1 + 0.16 * dil)}><Late reloj={reloj} bpm={90} fuerza={1.2 - 0.9 * easeOut(p('contrae'))}><Corazon /></Late></Sale>
      <Bandera x={400} y={810} txt="el corazón" color={S.il1[0]} p={p('corazon')} t={30} punta="no" />
      <Bandera x={400} y={890} txt="el ventrículo se dilata" color={S.il1[0]} p={p('ventriculo')} t={26} punta="no" />
      <Sale p={p('no')} x={930} y={250} k={1.8}><NO /></Sale>
      <Bandera x={1190} y={250} txt="óxido nítrico y peroxinitrito" color={S.no[0]} p={p('peroxinitrito')} t={26} punta="no" />
      <Sale p={p('beta')} x={1130} y={390} k={1.2}><Chip x={0} y={0} txt="respuesta β-adrenérgica" color={S.il6[0]} t={28} /></Sale>
      <g opacity={tramo(p('beta'), 0.4, 1)}><Cruz x={1385} y={390} k={0.8} /></g>
      <Bandera x={1130} y={475} txt="la apagan" color={S.il1[0]} p={p('beta')} t={26} punta="no" />
      <Sale p={p('mitocondrias')} x={1130} y={610} k={1.6}><g><ellipse rx={90} ry={46} fill="#7A4A1E" /><ellipse cx={-3} cy={-3} rx={84} ry={40} fill="#B08A5A" />{[-48, -16, 16, 48].map((cx, i) => <path key={i} d={`M${cx},-34 q16,34 0,68`} fill="none" stroke="#5A3410" strokeWidth={6} strokeLinecap="round" />)}</g></Sale>
      <Bandera x={1130} y={725} txt="y dañan sus mitocondrias" color={S.lps[0]} p={p('mitocondrias')} t={26} punta="no" />
      <Barra x={900} y={810} w={420} h={36} val={lerp(0.62, 0.28, cae)} color={S.il1[1]} txt="fracción de eyección" valor={cae > 0.5 ? 'baja' : 'normal'} p={p('eyeccion')} />
      <Bandera x={1000} y={965} txt="la misma molécula que afloja los vasos debilita la bomba" color={S.il6[0]} p={p('molecula')} t={26} punta="no" />
    </g>
  );
};

// ─── 7 · Un corazón que hiberna ──────────────────────────────────────────────
const Hibernacion: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="¿es como un infarto?  No" color={S.il6[0]} p={p('infarto')} t={34} punta="no" />
    <Sale p={p('infarto')} x={420} y={460} k={1.4}><g><Corazon /><circle cx={30} cy={40} r={70} fill="#1E0F18" opacity={0.55} /></g></Sale>
    <Bandera x={420} y={740} txt="infarto: mueren los miocitos" color={S.il1[0]} p={p('miocitos')} t={26} punta="no" />
    <Sale p={p('masiva')} x={1180} y={460} k={1.4}><Late reloj={reloj} bpm={50} fuerza={0.35}><g opacity={0.55}><Corazon /></g></Late></Sale>
    <Bandera x={1180} y={740} txt="aquí no hay muerte masiva" color={S.gluco[0]} p={p('masiva')} t={26} punta="no" />
    <Bandera x={1180} y={815} txt="una depresión funcional: como si hibernara" color={S.il6[0]} p={p('depresion')} t={24} punta="no" />
    <Sale p={p('sobreviven')} x={1180} y={215} k={1}><text textAnchor="middle" fontSize={64} fontWeight={800} fill="var(--se-verde)">↻ pocos días</text></Sale>
    <Bandera x={1180} y={895} txt="en quienes sobreviven se recupera" color={S.gluco[0]} p={p('dias')} t={26} punta="no" />
    <Bandera x={420} y={830} txt="las fibras siguen ahí" color={S.il6[0]} p={p('fibras')} t={26} punta="no" />
    <Bandera x={800} y={975} txt="un corazón apagado, no destruido" color={S.il6[0]} p={p('apagado')} t={36} punta="no" />
  </g>
);

const LAMINAS: Lamina[] = [Vasoplejia, OxidoNitricoL, Compuertas, Vasopresina, Catecolaminas, PamJoven, Miocardiopatia, Hibernacion];
export default LAMINAS;
