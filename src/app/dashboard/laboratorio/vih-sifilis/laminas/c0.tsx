'use client';
// Capítulo 0 · Dos pacientes, una puerta (vistazo gratis)

import type { Lamina } from '../Lienzo';
import { Bandera, Capside, Cuerpo, Estacion, Flecha, Flota, Ganglio, Hombre, Jeringa, Linfocito, Lomas, Medallon, Nodo, Nube, P, Pastilla, Pulmones, Punto, Reloj, Sale, Sello, Signo, Termometro, Trazo, Treponema, Txt, TXV, Vagon, Via, Virion, clamp, easeOut, hash, lerp, tramo } from '../Piezas';

// ─── 0 · El paciente 1 ───────────────────────────────────────────────────────
const ElPaciente1: Lamina = ({ p, reloj }) => {
  const MX = 560, MY = 520, K = 1.2;
  const al = (lx: number, ly: number): [number, number] => [MX + K * lx, MY + K * ly];
  const erupcion = p('erupcion');
  return (
    <g>
      <Bandera x={MX} y={110} txt="paciente 1 · 30 años" color={P.cd4[0]} p={p('paciente')} t={30} punta="abajo" />
      <Sale p={p('varon')} x={MX} y={MY} k={K}>
        <Hombre barba rubor={p('fiebre')} triste={0.6} />
        {Array.from({ length: 18 }, (_, i) => {
          const q = tramo(erupcion, (i / 18) * 0.7, (i / 18) * 0.7 + 0.3);
          return q > 0 ? <circle key={i} cx={-150 + hash(i, 3) * 300} cy={214 + hash(i, 4) * 100} r={7.5 * easeOut(q)} fill="#E5324C" /> : null;
        })}
        {[[-3, 104], [6, 108], [20, 99]].map(([cx, cy], i) => <circle key={i} cx={cx - 14} cy={cy} r={5 * easeOut(p('ulceras'))} fill="#E5324C" />)}
      </Sale>
      <Nodo x={al(-80, 152)[0]} y={al(-80, 152)[1]} p={p('ganglios')} />
      <Nodo x={al(80, 152)[0]} y={al(80, 152)[1]} p={p('ganglios')} />
      <Nodo x={al(-176, 256)[0]} y={al(-176, 256)[1]} p={p('ganglios')} k={0.9} />
      <Nodo x={al(176, 256)[0]} y={al(176, 256)[1]} p={p('ganglios')} k={0.9} />
      <Sale p={p('fiebre')} x={140} y={480}><Flota x={0} y={0} rl={reloj} alto={6}><Termometro k={0.7} val={0.92} /></Flota></Sale>
      <Txt x={140} y={560} txt="38,9 °C" t={36} p={p('temp')} color={TXV.sangre} />
      <Bandera x={185} y={650} txt="erupción" color={P.sangre[0]} p={p('erupcion')} t={26} punta="der" />
      <Bandera x={185} y={735} txt="ganglios dolorosos" color={P.espiga[0]} p={p('ganglios')} t={26} punta="der" />
      <Bandera x={185} y={820} txt="úlceras en la boca" color={P.hla[0]} p={p('ulceras')} t={26} punta="der" />
      <Txt x={1090} y={225} txt="prueba de cuarta generación" t={34} p={p('prueba')} />
      <Txt x={1090} y={278} txt="positiva" t={42} p={p('prueba')} color={TXV.sangre} />
      <Signo x={1440} y={250} p={p('prueba')} />
      <Sale p={p('p24')} x={900} y={455} k={1.45}><Capside r={-14} enzimas={0} /></Sale>
      <Txt x={1190} y={430} txt="antígeno p24" t={34} p={p('p24')} />
      <Txt x={1190} y={483} txt="positivo" t={42} p={p('p24')} color={TXV.sangre} />
      <Signo x={1440} y={455} p={p('p24')} />
      <Bandera x={1180} y={560} txt="carga viral" color={P.virus[0]} p={p('carga')} t={28} punta="abajo" />
      <Txt x={1180} y={655} txt="5 800 000" t={104} p={p('carga')} color={TXV.virus} />
      <Nube x={1180} y={775} w={700} h={110} n={14} k={0.2} reloj={reloj} o={tramo(p('carga'), 0, 0.5)} sem={4} />
      <Txt x={1180} y={880} txt="copias de ARN por mililitro" t={30} p={p('carga')} />
    </g>
  );
};

// ─── 1 · El paciente 1, ocho meses después ───────────────────────────────────
const MesesDespues: Lamina = ({ p, reloj }) => {
  const X0 = 140, X1 = 780, PX = (X1 - X0) / 8;
  const mx = (m: number) => X0 + m * PX;
  const carga: [number, number][] = [[mx(0), 270], [mx(0.7), 260], [mx(2), 560], [mx(3.5), 700], [mx(5), 730], [mx(6.2), 720], [mx(7), 560], [mx(8), 380]];
  const cd4: [number, number][] = [[mx(0), 420], [mx(1.5), 400], [mx(3), 380], [mx(5), 420], [mx(6.5), 560], [mx(8), 700]];
  const avance = 0.72 * p('tratamiento') + 0.28 * p('vuelve');
  return (
    <g>
      <path d={`M${X0 - 20},790 L${X1 + 30},790 M${X0 - 20},790 L${X0 - 20},220`} fill="none" stroke="var(--cit-texto-2)" strokeWidth={5} strokeLinecap="round" opacity={0.5} />
      {[0, 2, 4, 6, 8].map((m) => <Txt key={m} x={mx(m)} y={825} txt={m === 8 ? '8 meses' : String(m)} t={24} fuerte={false} p={m === 8 ? tramo(p('vuelve'), 0, 0.5) : 1} />)}
      <Trazo pts={carga} p={avance} color={P.sangre[1]} w={13} />
      <Trazo pts={cd4} p={avance} color={P.cd4[1]} w={13} />
      <Txt x={150} y={140} txt="carga viral" t={28} ancla="start" color={TXV.sangre} p={p('tratamiento')} />
      <Txt x={150} y={185} txt="CD4" t={28} ancla="start" color={TXV.cd4} p={p('tratamiento')} />
      <Sale p={p('tratamiento')} x={470} y={150}><Flota x={0} y={0} rl={reloj} alto={6}><Pastilla r={-30} k={1.2} /></Flota></Sale>
      <Txt x={470} y={225} txt="tratamiento" t={28} p={p('tratamiento')} />
      <Txt x={mx(8) + 24} y={380} txt="720 000" t={32} ancla="start" color={TXV.sangre} p={p('carga')} />
      <Txt x={mx(8) + 24} y={700} txt="CD4 85" t={32} ancla="start" color={TXV.cd4} p={p('cd4')} />
      <Sale p={p('adherencia')} x={200} y={915} k={0.8}><Sello ok /></Sale>
      <Txt x={250} y={915} txt="«no omití ni una dosis»" t={30} p={p('adherencia')} ancla="start" />
      <Bandera x={1130} y={185} txt="8 meses después" color={P.cd4[0]} p={p('vuelve')} t={26} punta="abajo" />
      <Sale p={p('vuelve')} x={1130} y={370} k={0.5}><Hombre barba triste={1} rubor={0.3} /></Sale>
      <Sale p={p('tos')} x={1420} y={370} k={0.85}><Pulmones infiltrados={p('saturacion')} /></Sale>
      <Bandera x={975} y={610} txt="pérdida de peso" color={P.espiga[0]} p={p('peso')} t={26} punta="no" ancla="izq" />
      <Bandera x={975} y={690} txt="tos seca" color={P.hla[0]} p={p('tos')} t={26} punta="no" ancla="izq" />
      <Bandera x={975} y={770} txt="falta de aire" color={P.rt[0]} p={p('aire')} t={26} punta="no" ancla="izq" />
      <Txt x={1430} y={640} txt="89 %" t={92} p={p('saturacion')} color={TXV.sangre} />
      <Txt x={1430} y={715} txt="saturación de oxígeno" t={28} p={p('saturacion')} />
      <Bandera x={1130} y={915} txt="¿cómo se llegó a una neumonía, con tratamiento?" color={P.hla[0]} p={p('pregunta')} t={28} punta="no" />
    </g>
  );
};

// ─── 2 · El paciente 2 ───────────────────────────────────────────────────────
const ElPaciente2: Lamina = ({ p, reloj }) => {
  const v = p('varon');
  return (
    <g>
      <Sale p={v} x={330} y={520} k={1.15}>
        <Cuerpo>
          <Nodo x={-62} y={58} p={p('ganglios')} />
          <Nodo x={62} y={58} p={p('ganglios')} />
          <Punto x={0} y={88} p={p('ulcera')} />
        </Cuerpo>
      </Sale>
      <Bandera x={330} y={90} txt="paciente 2 · 27 años" color={P.hla[0]} p={v} t={30} punta="abajo" />
      <Flecha a={[360, 623]} b={[805, 300]} c={[560, 480]} p={tramo(p('ulcera'), 0.1, 0.9)} color={P.espiga[1]} w={7} cabeza={false} />
      <Sale p={p('ulcera')} x={955} y={270}>
        <Medallon id="ulc" R={150}>
          <rect x={-160} y={-160} width={320} height={320} fill="#F2A8C0" />
          <ellipse cx={0} cy={6} rx={112} ry={92} fill="#E04A6E" />
          <ellipse cx={0} cy={6} rx={92} ry={74} fill="#B5183F" />
          <ellipse cx={-3} cy={4} rx={76} ry={58} fill="#F9C9D2" />
          <path d="M-66,-28 Q-38,-58 6,-60" fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" opacity={0.6} />
          <path d="M-112,98 L112,98 M-112,88 L-112,108 M112,88 L112,108" fill="none" stroke="#FFF" strokeWidth={6} strokeLinecap="round" opacity={0.85} />
        </Medallon>
      </Sale>
      <Txt x={955} y={470} txt="única, 12 mm, base limpia y dura, no duele" t={26} p={p('ulcera')} />
      <Txt x={1010} y={535} txt="RPR 1:32" t={50} ancla="end" p={p('rpr')} color={TXV.violeta} />
      <Signo x={1052} y={537} p={p('rpr')} />
      <Txt x={1094} y={537} txt="reactiva" t={32} ancla="start" p={p('rpr')} color={TXV.sangre} />
      <Txt x={1010} y={610} txt="VIH, 4.ª generación" t={34} ancla="end" p={p('vih')} />
      <Signo x={1052} y={612} mas={false} p={p('vih')} />
      <Txt x={1094} y={612} txt="negativa" t={32} ancla="start" p={p('vih')} color={TXV.verde} />
      <Sale p={p('penicilina')} x={640} y={805} k={1.1}><Flota x={0} y={0} rl={reloj} alto={5}><Jeringa r={-35} /></Flota></Sale>
      <Txt x={640} y={925} txt="penicilina" t={30} p={p('penicilina')} />
      <Sale p={p('cinco')} x={860} y={800}><Reloj ang={lerp(0, 1800, easeOut(p('cinco')))} /></Sale>
      <Txt x={860} y={925} txt="5 horas" t={30} p={p('cinco')} />
      <Sale p={p('fiebre')} x={1080} y={835}><Termometro k={0.45} val={0.97} /></Sale>
      <Txt x={1080} y={925} txt="39,2 °C" t={30} p={p('fiebre')} color={TXV.sangre} />
      <Txt x={1380} y={840} txt="¿una alergia?" t={58} p={p('alergia')} color={TXV.ambar} />
    </g>
  );
};

// ─── 3 · El paciente 2, tres meses después ───────────────────────────────────
const TresMeses: Lamina = ({ p }) => {
  const manchas = p('manchas'), palmas = p('palmas');
  const Pie = () => (
    <g>
      <ellipse cx={0} cy={20} rx={52} ry={92} fill="#F2A878" /><ellipse cx={-3} cy={16} rx={46} ry={84} fill="#F7C29A" />
      {[[-34, -92, 15], [-14, -102, 15], [8, -102, 14], [28, -94, 13], [44, -78, 11]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#F2A878" />)}
    </g>
  );
  const Palma = () => (
    <g>
      <rect x={-52} y={-8} width={104} height={110} rx={34} fill="#F2A878" /><rect x={-48} y={-12} width={96} height={104} rx={32} fill="#F7C29A" />
      {[-40, -14, 12, 38].map((dx, i) => <rect key={i} x={dx - 11} y={-96 - (i === 1 || i === 2 ? 14 : 0)} width={22} height={96 + (i === 1 || i === 2 ? 14 : 0)} rx={11} fill="#F7C29A" />)}
      <rect x={-92} y={14} width={26} height={74} rx={13} fill="#F7C29A" transform="rotate(32 -80 52)" />
    </g>
  );
  const Cobre = ({ n, q, sem }: { n: number; q: number; sem: number }) => (
    <g>{Array.from({ length: n }, (_, i) => <circle key={i} cx={-44 + hash(i, sem) * 88} cy={-66 + hash(i, sem + 1) * 150} r={8.5 * easeOut(tramo(q, i / n * 0.7, i / n * 0.7 + 0.3))} fill="#B8451E" />)}</g>
  );
  return (
    <g>
      <Txt x={330} y={118} txt="la úlcera desapareció" t={34} p={p('desaparecio')} color={TXV.ambar} />
      <Sale p={p('controles')} x={110} y={190} k={0.75}><Sello ok={false} /></Sale>
      <Txt x={330} y={190} txt="no volvió a los controles" t={30} p={p('controles')} />
      <Sale p={1} x={330} y={540} k={1.0}>
        <Hombre piel={P.piel} pelo="#3A1B8E" ropa={['#6A35A0', '#9358F0']} triste={0.5} />
        {Array.from({ length: 16 }, (_, i) => {
          const q = tramo(manchas, (i / 16) * 0.7, (i / 16) * 0.7 + 0.3);
          return q > 0 ? <circle key={i} cx={-150 + hash(i, 8) * 300} cy={214 + hash(i, 9) * 100} r={8 * easeOut(q)} fill="#B8451E" /> : null;
        })}
        {[[-72, -148, 26], [14, -166, 22], [74, -138, 24], [102, -96, 17]].map(([cx, cy, r], i) => <ellipse key={i} cx={cx} cy={cy} rx={r * easeOut(p('cabello'))} ry={r * 0.78 * easeOut(p('cabello'))} fill={P.piel[1]} />)}
        {[[-22, 98], [6, 104], [26, 96]].map(([cx, cy], i) => <rect key={i} x={cx - 13} y={cy - 5} width={26 * easeOut(p('placas'))} height={10} rx={5} fill="#F4F4FA" />)}
      </Sale>
      <Bandera x={330} y={900} txt="manchas cobrizas" color="#B8451E" p={manchas} t={26} punta="no" />
      <Sale p={palmas} x={880} y={290}><Medallon id="pal" R={135}><rect x={-140} y={-140} width={280} height={280} fill="#3A1A80" /><g transform="translate(0,16) scale(0.9)"><Palma /><Cobre n={9} q={palmas} sem={2} /></g></Medallon></Sale>
      <Txt x={880} y={470} txt="palmas" t={30} p={palmas} />
      <Sale p={p('plantas')} x={1160} y={290}><Medallon id="pla" R={135}><rect x={-140} y={-140} width={280} height={280} fill="#3A1A80" /><g transform="translate(0,24) scale(0.95)"><Pie /><Cobre n={9} q={p('plantas')} sem={5} /></g></Medallon></Sale>
      <Txt x={1160} y={470} txt="plantas" t={30} p={p('plantas')} />
      <Bandera x={1440} y={300} txt="placas blancas" color={P.hla[0]} p={p('placas')} t={24} punta="no" />
      <Bandera x={1440} y={375} txt="alopecia" color={P.rt[0]} p={p('cabello')} t={24} punta="no" />
      <Txt x={1090} y={565} txt="RPR" t={40} p={p('rpr')} color={TXV.violeta} />
      <rect x={900} y={880 - 130 * easeOut(p('rpr'))} width={140} height={130 * easeOut(p('rpr'))} rx={10} fill={P.hla[1]} />
      <rect x={1180} y={880 - 300 * easeOut(tramo(p('rpr'), 0.3, 1))} width={140} height={300 * easeOut(tramo(p('rpr'), 0.3, 1))} rx={10} fill={P.hla[0]} />
      <Txt x={970} y={915} txt="1:32" t={32} p={p('rpr')} />
      <Txt x={1250} y={915} txt="1:128" t={32} p={p('rpr')} />
      <Flecha a={[1060, 800]} b={[1160, 700]} c={[1130, 790]} p={tramo(p('rpr'), 0.5, 1)} color="var(--cit-flecha)" w={7} />
      <Txt x={1110} y={650} txt="×4" t={48} p={tramo(p('rpr'), 0.6, 1)} color={TXV.sangre} />
      <Bandera x={1130} y={965} txt="la bacteria seguía viajando" color={P.esp[0]} p={p('viajaba')} t={26} punta="no" />
    </g>
  );
};

// ─── 4 · ¿Por qué van juntos? ────────────────────────────────────────────────
const PorQueJuntos: Lamina = ({ p, reloj }) => {
  const q = easeOut(p('cd4'));
  return (
    <g>
      <rect x={0} y={640} width={1600} height={380} fill="rgba(150,90,220,0.22)" />
      <Lomas x={360} y={560} w={900} fondo={1100} bandas={[[0, '#F58AD0', 46], [60, '#E22BC4', 52], [70, '#8A15A8', 58], [90, '#5A1590', 62]]} sem={3} o={tramo(p('puerta'), 0, 0.5)} />
      <Lomas x={1240} y={560} w={900} fondo={1100} bandas={[[0, '#F58AD0', 46], [60, '#E22BC4', 52], [70, '#8A15A8', 58], [90, '#5A1590', 62]]} sem={7} o={tramo(p('puerta'), 0, 0.5)} />
      <g opacity={tramo(p('ulcera'), 0, 0.5)}>
        <path d="M-84,0 C-60,70 -40,120 0,150 C40,120 60,70 84,0 C40,20 -40,20 -84,0 Z" fill="#B5183F" transform="translate(800,570)" />
        <path d="M-62,12 C-42,70 -22,112 0,134 C22,112 42,70 62,12 C22,28 -22,28 -62,12 Z" fill="#F9C9D2" transform="translate(800,570)" />
      </g>
      <Sale p={p('virus')} x={250} y={330} k={0.75}><Virion reloj={reloj} /></Sale>
      <Sale p={p('espiro')} x={1340} y={340}><Treponema w={340} reloj={reloj} /></Sale>
      <Flecha a={[330, 410]} b={[740, 560]} c={[480, 400]} p={tramo(p('virus'), 0.4, 1)} color={P.virus[1]} w={7} />
      <Flecha a={[1280, 400]} b={[860, 560]} c={[1100, 390]} p={tramo(p('espiro'), 0.4, 1)} color={P.esp[1]} w={7} />
      {[[660, 860], [800, 880], [940, 850]].map(([cx, cy], i) => <Linfocito key={i} x={cx + (800 - cx) * 0.25 * q} y={lerp(cy, 720, q) + Math.sin(reloj / 400 + i) * 5} k={0.62} o={tramo(p('cd4'), 0, 0.3)} />)}
      <Flecha a={[800, 800]} b={[800, 735]} p={tramo(p('cd4'), 0.4, 1)} color={P.cd4[1]} w={7} />
      <Bandera x={800} y={110} txt="una puerta que comparten" color={P.virus[0]} p={p('puerta')} t={34} punta="no" />
      <Txt x={800} y={215} txt="contacto por la piel y las mucosas" t={30} p={p('contacto')} />
      <Bandera x={800} y={500} txt="úlcera genital" color={P.sangre[0]} p={p('ulcera')} t={26} punta="abajo" />
      <Bandera x={800} y={955} txt="más riesgo de adquirir la otra infección" color={P.sangre[1]} p={p('riesgo')} t={28} punta="no" />
    </g>
  );
};

// ─── 5 · El recorrido del lab (también es la portada) ────────────────────────
const ESTACIONES = [
  { x: 210, nombre: '1 · el virus', color: '#2FA84F' },
  { x: 510, nombre: '2 · la célula', color: '#2E78F2' },
  { x: 800, nombre: '3 · la inmunidad', color: '#C42FB0' },
  { x: 1090, nombre: '4 · el tratamiento', color: '#E0A100' },
  { x: 1390, nombre: '5 · la espiroqueta', color: '#0C9E9A' },
];

const Recorrido: Lamina = ({ p, reloj }) => {
  const tren = p('tren');
  const luces = [p('e1'), p('e2'), p('e3'), p('e4'), p('e5')];
  const hasta = luces.reduce((a, v) => a + easeOut(clamp(v)), 0);
  const xs = ESTACIONES.map((e) => e.x);
  const i = Math.min(4, Math.floor(hasta));
  const xv = hasta <= 1 ? lerp(60, xs[0], hasta) : hasta >= 5 ? xs[4] : lerp(xs[i - 1], xs[i], hasta - i);
  const iconos = [
    <Virion key="v" k={0.34} reloj={reloj} />,
    <g key="c"><Linfocito k={0.7} /><circle cx={44} cy={-44} r={13} fill={P.canal[1]} /></g>,
    <Ganglio key="g" k={0.8} />,
    <g key="d"><Pastilla x={-26} y={8} k={0.9} r={-30} /><Termometro x={40} y={22} k={0.34} val={0.7} /></g>,
    <Treponema key="t" w={150} amp={11} grosor={8} reloj={reloj} />,
  ];
  return (
    <g>
      <Bandera x={800} y={110} txt="el recorrido del laboratorio" color="#6D3FD8" p={p('tren')} t={34} punta="no" />
      <Via x0={60} x1={1540} y={690} tramos={ESTACIONES.map((e) => e.color)} p={tren} />
      {ESTACIONES.map((e, j) => (
        <g key={j}>
          <Estacion x={e.x} y={500} color={e.color} p={luces[j]} luz={Math.sin(reloj / 500 + j) * 0.3 + 0.7 * clamp(luces[j])}>{iconos[j]}</Estacion>
          <Bandera x={e.x} y={290} txt={e.nombre} color={e.color} p={luces[j]} t={22} punta="abajo" />
        </g>
      ))}
      <Vagon x={xv} y={650 + Math.sin(reloj / 160) * 2} k={0.7} o={tramo(tren, 0, 0.3)} reloj={reloj} tono={['#2A8A3E', '#46C84A', '#C9F59A']} />
      <Bandera x={800} y={880} txt="empecemos" color="#2FA84F" p={p('empecemos')} t={32} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [ElPaciente1, MesesDespues, ElPaciente2, TresMeses, PorQueJuntos, Recorrido];
export default LAMINAS;
