'use client';
// Capítulo 14 · Disfunción orgánica: riñón y cerebro

import type { Lamina } from '../Lienzo';
import { Bandera, Chip, Cerebro, Cruz, Cuerpo, Diplococo, Fibrina, Flecha, Hombre, Il1, Manometro, Microglia, Persona, Plaqueta, Respira, Rinon, S, Sale, Tnf, Txt, Vaso, easeOut, hash, lerp, tramo } from '../Piezas';

const corre = (reloj: number, i: number, n: number, periodo: number) => ((reloj / periodo + i / n) % 1);

/** Barra vertical con su cifra encima: crece con `q` (0-1). */
const BarraV = ({ x, base, v, esc, tono, q, txt }: { x: number; base: number; v: number; esc: number; tono: readonly string[]; q: number; txt: string }) => {
  const h = v * esc * easeOut(q);
  return (
    <g opacity={tramo(q, 0, 0.15)}>
      <rect x={x - 62} y={base - h + 8} width={124} height={h} rx={24} fill={tono[0]} />
      <rect x={x - 62} y={base - h} width={124} height={h} rx={24} fill={tono[1]} />
      <rect x={x - 42} y={base - h + 16} width={20} height={Math.max(0, h - 44)} rx={10} fill="#FFF" opacity={0.35} />
      <Txt x={x} y={base - h - 24} txt={txt} t={56} p={tramo(q, 0.3, 1)} color={tono[0]} />
    </g>
  );
};

// ─── 0 · El riñón avisa primero ──────────────────────────────────────────────
const RinonAvisa: Lamina = ({ p, reloj }) => {
  const base = 800;
  return (
    <g>
      <Bandera x={800} y={95} txt="¿quién avisa primero cuando falla un órgano?" color={S.il6[0]} p={p('avisa')} t={32} punta="no" />
      <Sale p={p('rinon')} x={800} y={480} k={1.35}><Respira reloj={reloj} amp={0.02}><Rinon palido={easeOut(p('filtrar')) * 0.7} /></Respira></Sale>
      <g opacity={tramo(p('filtrar'), 0.2, 0.8)}><Cruz x={800} y={480} k={1.3} /></g>
      <Bandera x={800} y={700} txt="el riñón" color={S.il1[0]} p={p('rinon')} t={34} punta="no" />
      <rect x={130} y={base} width={500} height={10} rx={5} fill={S.gris[1]} opacity={tramo(p('creatinina'), 0, 0.5)} />
      <rect x={970} y={base} width={500} height={10} rx={5} fill={S.gris[1]} opacity={tramo(p('diuresis'), 0, 0.5)} />
      <Bandera x={380} y={250} txt="creatinina (mg/dL)" color={S.tnf[0]} p={p('creatinina')} t={28} punta="no" />
      <Bandera x={1220} y={250} txt="diuresis (mL/kg/h)" color={S.c5a[0]} p={p('diuresis')} t={28} punta="no" />
      <BarraV x={250} base={base} v={1.9} esc={180} tono={S.il6} q={p('c19')} txt="1,9" />
      <BarraV x={510} base={base} v={2.1} esc={180} tono={S.lactato} q={p('c21')} txt="2,1" />
      <BarraV x={1090} base={base} v={0.2} esc={640} tono={S.il6} q={p('c02')} txt="0,2" />
      <BarraV x={1350} base={base} v={0.4} esc={640} tono={S.lactato} q={p('c04')} txt="0,4" />
      <line x1={950} y1={base - 0.5 * 640} x2={1490} y2={base - 0.5 * 640} stroke={S.gluco[1]} strokeWidth={8} strokeDasharray="30 22" strokeLinecap="round" opacity={tramo(p('esperable'), 0, 0.6)} />
      <Bandera x={1220} y={base - 0.5 * 640 - 55} txt="lo esperable: más de 0,5" color={S.gluco[0]} p={p('esperable')} t={26} punta="no" />
      <Sale p={p('joven')} x={250} y={880} k={1}><Chip x={0} y={0} txt="joven" color={S.il6[0]} t={30} /></Sale>
      <Sale p={p('joven')} x={1090} y={880} k={1}><Chip x={0} y={0} txt="joven" color={S.il6[0]} t={30} /></Sale>
      <Sale p={p('abuela')} x={510} y={880} k={1}><Chip x={0} y={0} txt="abuela" color={S.lactato[0]} t={30} /></Sale>
      <Sale p={p('abuela')} x={1350} y={880} k={1}><Chip x={0} y={0} txt="abuela" color={S.lactato[0]} t={30} /></Sale>
      <Bandera x={800} y={955} txt="dos riñones que dejaron de filtrar" color={S.il1[0]} p={p('filtrar')} t={32} punta="no" />
    </g>
  );
};

// ─── 1 · No es una tubería sin agua ──────────────────────────────────────────
const NoEsTuberia: Lamina = ({ p, reloj }) => (
  <g>
    <Bandera x={800} y={95} txt="¿falla el riñón solo porque llega poca sangre?" color={S.il6[0]} p={p('poca')} t={32} punta="no" />
    <g opacity={tramo(p('poca'), 0, 0.5)}>
      <rect x={150} y={348} width={440} height={96} rx={18} fill="#4C566E" /><rect x={150} y={340} width={440} height={92} rx={18} fill="#8C9AB8" />
      <rect x={168} y={352} width={380} height={16} rx={8} fill="#FFF" opacity={0.4} />
      <rect x={128} y={322} width={44} height={140} rx={14} fill="#5C6A88" /><rect x={568} y={322} width={44} height={140} rx={14} fill="#5C6A88" />
      <rect x={176} y={376} width={364} height={38} rx={19} fill="#2A2F44" />
      {[0, 1].map((i) => <circle key={i} cx={260 + i * 110 + Math.sin(reloj / 400 + i) * 8} cy={395} r={12} fill={S.sangre[1]} />)}
      {[0, 1].map((i) => { const u = corre(reloj, i, 2, 2400); return <circle key={i} cx={612} cy={lerp(470, 560, u)} r={10} fill={S.sangre[1]} opacity={1 - u} />; })}
    </g>
    <Bandera x={370} y={540} txt="poca sangre" color={S.sangre[0]} p={p('poca')} t={28} punta="no" />
    <g opacity={tramo(p('siempre'), 0.2, 0.8)}><Cruz x={370} y={392} k={1.9} /></g>
    <Bandera x={370} y={620} txt="no siempre" color={S.il1[0]} p={p('siempre')} t={30} punta="no" />
    <Sale p={p('flujo')} x={1090} y={430} k={1.5}><Respira reloj={reloj} amp={0.02}><Rinon palido={tramo(p('lesion'), 0, 1) * 0.55} /></Respira></Sale>
    <Flecha a={[760, 430]} b={[930, 430]} p={tramo(p('flujo'), 0, 0.8)} color={S.sangre[1]} w={28 + 22 * easeOut(p('aumentado'))} />
    <Bandera x={1090} y={175} txt="lesión renal séptica" color={S.il1[0]} p={p('lesion')} t={34} punta="no" />
    <Bandera x={900} y={665} txt="flujo renal normal" color={S.sangre[0]} p={p('flujo')} t={26} punta="no" />
    <Bandera x={1250} y={665} txt="…y hasta aumentado" color={S.sangre[0]} p={p('aumentado')} t={26} punta="no" />
    <Sale p={p('inflamacion')} x={250} y={770} k={1.6}><g><g transform="translate(-34,0)"><Tnf /></g><g transform="translate(40,10)"><Il1 /></g></g></Sale>
    <Bandera x={250} y={880} txt="inflamación" color={S.il1[0]} p={p('inflamacion')} t={28} punta="no" />
    <g opacity={tramo(p('micro'), 0, 0.5)}>
      <path d="M560,800 C650,720 740,880 830,790 S1000,740 1060,800" fill="none" stroke="#C25A52" strokeWidth={46} strokeLinecap="round" opacity={0.85} />
      <path d="M560,800 C650,720 740,880 830,790 S1000,740 1060,800" fill="none" stroke="#F09088" strokeWidth={34} strokeLinecap="round" />
      <path d="M545,740 C650,650 740,810 840,720 S1010,690 1075,745" fill="none" stroke={S.sangre[1]} strokeWidth={10} strokeLinecap="round" opacity={0.9} />
      <path d="M545,865 C650,950 760,900 850,880 S1010,900 1075,858" fill="none" stroke={S.sangre[1]} strokeWidth={10} strokeLinecap="round" opacity={0.9} />
    </g>
    <g opacity={tramo(p('tubulos'), 0, 0.5)}><Fibrina x={760} y={745} w={120} rota={10} /></g>
    <Bandera x={810} y={905} txt="microcirculación alrededor de los túbulos" color={S.sangre[0]} p={p('micro')} t={24} punta="no" />
    {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${1230 + i * 92},${790 + (i % 2) * 12})`} opacity={tramo(p('dano'), 0, 0.5)}><rect x={-38} y={-34} width={76} height={76} rx={22} fill={S.endo[0]} /><rect x={-38} y={-40} width={76} height={76} rx={22} fill={i === 1 ? S.gris[0] : S.endo[1]} /><circle cx={4} cy={-2} r={13} fill={S.nucleo[1]} />{i === 1 && <path d="M-22,-24 l16,22 l-10,12 l18,24" fill="none" stroke="#1E0F18" strokeWidth={6} strokeLinecap="round" />}</g>)}
    <Bandera x={1340} y={885} txt="daño directo a las células tubulares" color={S.endo[0]} p={p('tubulares')} t={24} punta="no" />
    <Bandera x={800} y={975} txt="no es una simple tubería sin agua" color={S.il6[0]} p={p('tuberia')} t={32} punta="no" />
  </g>
);

// ─── 2 · Varios golpes a la vez ──────────────────────────────────────────────
const Golpes: Lamina = ({ p, reloj }) => {
  const g = tramo(p('golpes'), 0, 1);
  const impacto = (x: number, y: number, i: number) => <g key={i} transform={`translate(${x},${y}) rotate(${i * 40 + reloj / 40})`} opacity={g * (0.6 + 0.4 * Math.sin(reloj / 120 + i))}>{[0, 1, 2, 3, 4, 5, 6, 7].map((j) => <path key={j} d="M0,-44 L8,-84 L-8,-84 z" fill={S.il1[1]} transform={`rotate(${j * 45})`} />)}</g>;
  return (
    <g>
      <Bandera x={800} y={95} txt="¿qué más le pasa al riñón?  Sumemos las causas" color={S.il6[0]} p={p('causas')} t={32} punta="no" />
      <Sale p={p('causas')} x={800} y={520} k={1.75}><Respira reloj={reloj} amp={0.02}><Rinon palido={g * 0.5} /></Respira></Sale>
      {impacto(740, 450, 0)}{impacto(880, 440, 1)}{impacto(730, 600, 2)}{impacto(890, 610, 3)}
      <Sale p={p('presion')} x={250} y={290} k={0.85}><Manometro x={0} y={0} val={0.2} /></Sale>
      <Bandera x={300} y={430} txt="baja la presión de perfusión" color={S.il1[0]} p={p('presion')} t={24} punta="no" />
      <Sale p={p('raa')} x={330} y={505} k={1}><Chip x={0} y={0} txt="renina-angiotensina-aldosterona" color={S.il6[0]} t={22} /></Sale>
      <Sale p={p('adh')} x={330} y={565} k={1}><Chip x={0} y={0} txt="ADH" color={S.c5a[0]} t={26} /></Sale>
      <Bandera x={330} y={635} txt="retienen agua y sodio" color={S.c5a[0]} p={p('retienen')} t={24} punta="no" />
      <Flecha a={[520, 520]} b={[680, 500]} p={tramo(p('retienen'), 0, 1)} color={S.il1[1]} w={14} />
      <Vaso x={1290} y={300} largo={560} ancho={60} ang={0} reloj={reloj} flujo={p('tapan') > 0.02 ? 0 : 3} pared={40} o={tramo(p('microtrombos'), 0, 0.5)}>
        <g opacity={tramo(p('tapan'), 0, 0.6)}><Fibrina x={30} y={0} w={170} /><Plaqueta x={-30} y={-6} k={0.55} /><Plaqueta x={90} y={8} k={0.5} /></g>
      </Vaso>
      <Bandera x={1290} y={450} txt="los microtrombos tapan capilares" color={S.fibrina[0]} p={p('tapan')} t={24} punta="no" />
      <Flecha a={[1140, 420]} b={[960, 480]} p={tramo(p('tapan'), 0, 1)} color={S.il1[1]} w={14} />
      <Sale p={p('citocinas')} x={1130} y={730} k={1.5}><g><g transform="translate(-40,0)"><Tnf /></g><g transform="translate(34,8)"><Il1 /></g></g></Sale>
      <g opacity={tramo(p('tubulo'), 0, 0.5)} transform="translate(1380,740)"><rect x={-50} y={-44} width={100} height={100} rx={28} fill={S.endo[0]} /><rect x={-50} y={-50} width={100} height={100} rx={28} fill={S.gris[0]} /><circle cx={5} cy={-2} r={17} fill={S.nucleo[1]} /><path d="M-30,-36 l20,28 l-12,16 l22,30" fill="none" stroke="#1E0F18" strokeWidth={7} strokeLinecap="round" /></g>
      <Flecha a={[1200, 700]} b={[1320, 730]} p={tramo(p('tubulo'), 0, 1)} color={S.il1[1]} w={10} />
      <Bandera x={1270} y={870} txt="las citocinas dañan el túbulo" color={S.il1[0]} p={p('tubulo')} t={24} punta="no" />
      <g opacity={tramo(p('flujo'), 0, 0.5)}>{[[110, 740, 12], [110, 800, 34], [110, 860, 8]].map(([x, y, w], i) => <Flecha key={i} a={[x as number, y as number]} b={[560, 640 + i * 20]} p={1} color={S.sangre[1]} w={w as number} />)}</g>
      <Bandera x={330} y={925} txt="el flujo dentro del riñón se reparte mal" color={S.sangre[0]} p={p('reparte')} t={24} punta="no" />
      <Bandera x={900} y={960} txt="varios golpes a la vez" color={S.il1[0]} p={p('golpes')} t={38} punta="no" />
    </g>
  );
};

// ─── 3 · El cerebro sufre por lo que pasa en el resto del cuerpo ─────────────
const CerebroSufre: Lamina = ({ p, reloj }) => {
  const niebla = tramo(p('encefalopatia'), 0, 1);
  const burbuja = (y: number, clave: string, glifo: string, txt: string, color: readonly string[]) => (
    <g>
      <Sale p={p(clave)} x={1030} y={y} k={1}><g><circle cy={7} r={70} fill={color[0]} /><circle r={70} fill={color[1]} /><ellipse cx={-26} cy={-38} rx={22} ry={8} fill="#FFF" opacity={0.55} transform="rotate(-25 -26 -38)" /><text y={22} textAnchor="middle" fontSize={glifo.length > 2 ? 50 : 76} fontWeight={800} fill="#FFF">{glifo}</text></g></Sale>
      <Bandera x={1290} y={y} txt={txt} color={color[0]} p={p(clave)} t={32} punta="no" />
    </g>
  );
  return (
    <g>
      <Bandera x={800} y={95} txt="¿y el cerebro?  Encefalopatía asociada a la sepsis" color={S.il6[0]} p={p('cerebro')} t={32} punta="no" />
      <Sale p={p('cerebro')} x={440} y={470} k={1.9}><Respira reloj={reloj} amp={0.018}><Cerebro /></Respira></Sale>
      {[[300, 400, 150], [520, 480, 170], [400, 560, 160], [560, 360, 120]].map(([cx, cy, r], i) => <ellipse key={i} cx={(cx as number) + Math.sin(reloj / 1700 + i) * 40} cy={cy as number} rx={(r as number) * 1.2} ry={(r as number) * 0.7} fill="#9C92B8" opacity={0.34 * niebla} />)}
      {burbuja(290, 'confusion', '¿?', 'confusión', S.il6)}
      {burbuja(450, 'somnolencia', 'z z z', 'somnolencia', S.c5a)}
      {burbuja(610, 'delirio', '@', 'delirio', S.tnf)}
      <Sale p={p('abuela')} x={1100} y={790} k={0.3}><Persona quien="mujer" palidez={0.4} /></Sale>
      <Bandera x={1100} y={935} txt="no sabía dónde estaba" color={S.lactato[0]} p={p('abuela')} t={22} punta="no" />
      <Sale p={p('joven')} x={1400} y={790} k={0.3}><Persona quien="hombre" /></Sale>
      <Bandera x={1400} y={935} txt="ahora, somnoliento" color={S.il6[0]} p={p('somnoliento')} t={22} punta="no" />
      <Sale p={p('microbio')} x={200} y={790} k={0.8}><Diplococo reloj={reloj} pili={0.5} /></Sale>
      <g opacity={tramo(p('microbio'), 0.3, 1)}><Cruz x={200} y={790} k={1.4} /></g>
      <Bandera x={290} y={900} txt="el microbio no tiene que llegar" color={S.menin[0]} p={p('microbio')} t={22} punta="no" />
      <Sale p={p('cuerpo')} x={640} y={790} k={0.3}><Cuerpo /></Sale>
      <Flecha a={[640, 690]} b={[580, 610]} p={tramo(p('cuerpo'), 0, 1)} color={S.il1[1]} w={14} />
      <Bandera x={700} y={935} txt="sufre por el resto del cuerpo" color={S.il1[0]} p={p('sufre')} t={22} punta="no" />
    </g>
  );
};

// ─── 4 · Por qué se nubla el cerebro ─────────────────────────────────────────
const SeNubla: Lamina = ({ p, reloj }) => {
  const act = easeOut(p('barrera'));
  return (
    <g>
      <Bandera x={800} y={95} txt="¿por qué se nubla el cerebro?" color={S.il6[0]} p={p('nubla')} t={34} punta="no" />
      <Vaso x={560} y={270} largo={920} ancho={110} ang={0} reloj={reloj} flujo={4} pared={46} o={tramo(p('citocinas'), 0, 0.5)} />
      {Array.from({ length: 6 }, (_, i) => { const u = corre(reloj, i, 6, 3600); return <g key={i} opacity={tramo(p('citocinas'), 0, 0.4)} transform={`translate(${lerp(140, 980, u)},${255 + Math.sin(i * 2 + u * 6) * 26})`}>{i % 2 ? <Il1 /> : <Tnf />}</g>; })}
      <Bandera x={560} y={170} txt="citocinas en la sangre" color={S.il1[0]} p={p('citocinas')} t={26} punta="no" />
      {Array.from({ length: 7 }, (_, i) => <g key={i} opacity={tramo(p('barrera'), 0, 0.4)} transform={`translate(${180 + i * 125},455)`}><rect x={-46} y={-30} width={92} height={64} rx={26} fill={S.verde[0]} /><rect x={-46} y={-36} width={92} height={64} rx={26} fill={S.verde[1]} /><ellipse cx={-16} cy={-22} rx={14} ry={5} fill="#FFF" opacity={0.5} /></g>)}
      <g opacity={tramo(p('barrera'), 0, 0.4)}>{Array.from({ length: 8 }, (_, i) => <rect key={i} x={118 + i * 125} y={382} width={16} height={26} rx={6} fill={act > 0.5 ? S.il1[1] : S.gluco[1]} />)}</g>
      <Bandera x={560} y={560} txt="barrera hematoencefálica activada" color={S.gluco[0]} p={p('barrera')} t={26} punta="no" />
      <Sale p={p('microglia')} x={1200} y={430} k={1.9}><Respira reloj={reloj} amp={0.03}><Microglia /></Respira></Sale>
      <Flecha a={[1000, 290]} b={[1130, 370]} p={tramo(p('microglia'), 0, 0.8)} color={S.il1[1]} w={9} />
      <Bandera x={1200} y={600} txt="microglía" color={S.net[0]} p={p('microglia')} t={30} punta="no" />
      <Bandera x={1200} y={685} txt="las células de defensa del cerebro" color={S.net[0]} p={p('defensa')} t={24} punta="no" />
      <Vaso x={420} y={800} largo={640} ancho={50} ang={0} reloj={reloj} flujo={p('altera') > 0.02 ? 1 : 4} pared={36} o={tramo(p('cerebral'), 0, 0.5)}>
        <g opacity={tramo(p('altera'), 0, 0.6)}><Fibrina x={40} y={0} w={120} /></g>
      </Vaso>
      <Bandera x={420} y={900} txt="la microcirculación cerebral se altera" color={S.sangre[0]} p={p('altera')} t={24} punta="no" />
      <Sale p={p('hipoxemia')} x={900} y={790} k={1}><Chip x={0} y={0} txt="hipoxemia" color={S.no[0]} t={28} /></Sale>
      <Sale p={p('acidosis')} x={1110} y={860} k={1}><Chip x={0} y={0} txt="acidosis" color={S.il1[0]} t={28} /></Sale>
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={1290 + (i % 3) * 52 + Math.sin(reloj / 500 + i) * 5} cy={790 + Math.floor(i / 3) * 52} r={16} fill={S.gris[1]} opacity={tramo(p('desechos'), i * 0.08, i * 0.08 + 0.4)} />)}
      <Bandera x={1340} y={900} txt="desechos que el riñón ya no elimina" color={S.gris[0]} p={p('desechos')} t={22} punta="no" />
      <Sale p={p('rinon')} x={1490} y={760} k={0.5}><Rinon palido={0.6} /></Sale>
      <Bandera x={800} y={975} txt="todo llega al cerebro a la vez" color={S.il1[0]} p={p('todo')} t={34} punta="no" />
    </g>
  );
};

// ─── 5 · Después del alta ────────────────────────────────────────────────────
const Alta: Lamina = ({ p, reloj }) => {
  const marcha = easeOut(p('salio'));
  return (
    <g>
      <Bandera x={800} y={95} txt="¿y después?  Secuelas físicas y cognitivas" color={S.il6[0]} p={p('despues')} t={32} punta="no" />
      <path d="M60,830 C420,790 760,880 1540,740" fill="none" stroke="#D3C8E0" strokeWidth={130} strokeLinecap="round" opacity={tramo(p('sobreviven'), 0, 0.6)} />
      <path d="M60,830 C420,790 760,880 1540,740" fill="none" stroke="#FFFFFF" strokeWidth={9} strokeDasharray="44 40" strokeDashoffset={-reloj / 30} strokeLinecap="round" opacity={0.75 * tramo(p('sobreviven'), 0, 0.6)} />
      <Bandera x={760} y={330} txt="quienes sobreviven" color={S.gluco[0]} p={p('sobreviven')} t={28} punta="no" />
      <g opacity={tramo(p('hospital'), 0, 0.5)} transform="translate(210,560)"><rect x={-150} y={-16} width={300} height={274} rx={18} fill="#8C7AA8" /><rect x={-150} y={-30} width={300} height={274} rx={18} fill="#EEE6F8" />{[-90, 0, 90].flatMap((x) => [20, 90].map((y) => <rect key={`${x}-${y}`} x={x - 28} y={y} width={56} height={46} rx={10} fill="#9CD6F2" />))}<rect x={-34} y={150} width={68} height={94} rx={30} fill="#7A5CA8" /><circle cx={0} cy={-60} r={42} fill={S.il1[0]} /><circle cy={-64} r={42} fill={S.il1[1]} /><path d="M-9,-90 h18 v18 h18 v18 h-18 v18 h-18 v-18 h-18 v-18 h18 z" fill="#FFF" /></g>
      <Bandera x={210} y={880} txt="el hospital" color={S.il6[0]} p={p('hospital')} t={26} punta="no" />
      <Sale p={p('salio')} x={lerp(330, 650, marcha)} y={700} k={0.45}><Hombre /></Sale>
      <Sale p={p('lesion')} x={960} y={620} k={1.1}><Respira reloj={reloj} amp={0.03}><Rinon palido={0.5} /></Respira></Sale>
      <Bandera x={960} y={750} txt="lesión renal aguda" color={S.il1[0]} p={p('lesion')} t={26} punta="no" />
      <g opacity={tramo(p('necrosis'), 0, 0.5)} transform="translate(1240,640)"><circle r={78} fill={S.il6[0]} opacity={0.5} /><circle r={62} fill="#7A1E3A" /><circle r={46} fill="#1E0F18" /><ellipse cx={-18} cy={-22} rx={22} ry={8} fill="#FFF" opacity={0.25} transform="rotate(-30 -18 -22)" /></g>
      <Bandera x={1240} y={750} txt="necrosis de la piel" color={S.il6[0]} p={p('necrosis')} t={26} punta="no" />
      <Bandera x={1100} y={440} txt="dos huellas del choque" color={S.il1[0]} p={p('huellas')} t={30} punta="no" />
      <g opacity={tramo(p('fisicas'), 0, 0.5)} transform="translate(1100,250) rotate(-12)"><rect x={-90} y={-8} width={180} height={16} rx={8} fill={S.gris[0]} /><circle cx={-92} r={36} fill={S.gris[1]} /><circle cx={92} r={36} fill={S.gris[1]} /></g>
      <Bandera x={1100} y={345} txt="físicas" color={S.gris[0]} p={p('fisicas')} t={26} punta="no" />
      <Sale p={p('cognitivas')} x={1380} y={250} k={0.8}><Cerebro /></Sale>
      <Bandera x={1380} y={345} txt="cognitivas" color={S.il6[0]} p={p('cognitivas')} t={26} punta="no" />
      <Bandera x={420} y={175} txt="pero salió" color={S.gluco[0]} p={p('pero')} t={38} punta="no" />
      <Bandera x={800} y={965} txt="la sepsis no termina el día del alta" color={S.il1[0]} p={p('alta')} t={36} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [RinonAvisa, NoEsTuberia, Golpes, CerebroSufre, SeNubla, Alta];
export default LAMINAS;
