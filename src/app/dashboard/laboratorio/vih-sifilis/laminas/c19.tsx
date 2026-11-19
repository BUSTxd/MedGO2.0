'use client';
// Capítulo 19 · Serología de la sífilis

import type { Lamina } from '../Lienzo';
import { Bandera, Cruz, Flecha, IgG, P, Sale, Signo, Trazo, Treponema, TuboEnsayo, Txt, TXV, Visto, easeOut, tramo } from '../Piezas';
import { TarjetaRpr } from './ComunSifilis';

const AZUL: readonly string[] = ['#1E4FC0', '#3A6FE0', '#9DB8FF'];
const ROJO: readonly string[] = ['#B51D3B', '#E5324C', '#FF7A7F'];

// ─── 0 · Dos familias de pruebas ─────────────────────────────────────────────
const DosFamilias: Lamina = ({ p, reloj }) => {
  const GOTAS: [number, number][] = [[-120, -80], [-150, 10], [-110, 100], [120, -90], [150, 0], [110, 90], [0, -130], [0, 128]];
  return (
    <g>
      <Txt x={800} y={62} txt="serología de la sífilis" t={42} p={p('serologia')} color={TXV.violeta} />
      <Txt x={800} y={108} txt="la bacteria no se cultiva" t={24} p={p('cultiva')} color={TXV.ambar} />
      <g transform="translate(0,50)">
      {/* no treponémicas: anticuerpos contra la cardiolipina */}
      <Bandera x={400} y={190} txt="no treponémicas" color={P.rt[0]} p={p('notre')} t={32} punta="abajo" />
      <Bandera x={290} y={270} txt="RPR" color={P.rt[0]} p={p('rpr')} t={26} punta="no" />
      <Bandera x={510} y={270} txt="VDRL" color={P.rt[0]} p={p('vdrl')} t={26} punta="no" />
      <Sale p={p('danadas')} x={200} y={500}>
        <circle cx={5} cy={7} r={90} fill={P.sombra} /><circle r={90} fill="#8A4FE8" /><circle r={78} fill="#B04AE8" />
        <circle cx={-14} cy={6} r={34} fill="#5A22A8" />
        <circle r={90} fill="none" stroke="#FFF" strokeWidth={6} strokeDasharray="18 22" opacity={0.55} />
      </Sale>
      <Sale p={p('propia')} x={560} y={520}><Treponema w={150} amp={14} vueltas={4} grosor={10} r={-30} reloj={reloj} /></Sale>
      {GOTAS.slice(0, 4).map(([dx, dy], i) => <ellipse key={i} cx={200 + dx + Math.sin(reloj / 700 + i) * 6} cy={500 + dy} rx={13} ry={9} fill="#FFD23F" opacity={easeOut(tramo(p('liberan'), i * 0.12, i * 0.12 + 0.4))} />)}
      {GOTAS.slice(4, 8).map(([dx, dy], i) => <ellipse key={i} cx={560 + dx * 0.9 + Math.sin(reloj / 700 + i) * 6} cy={520 + dy * 0.9} rx={13} ry={9} fill="#FFD23F" opacity={easeOut(tramo(p('propia'), 0.4 + i * 0.12, 0.8 + i * 0.12))} />)}
      {[[360, 430, 20], [400, 570, -40], [450, 480, 10]].map(([x, y, r], i) => <IgG key={i} x={x} y={y} r={r} k={0.9} o={tramo(p('anticuerpos'), i * 0.12, i * 0.12 + 0.4)} tono={[...AZUL]} />)}
      <Txt x={200} y={625} txt="células dañadas" t={22} p={p('danadas')} />
      <Txt x={560} y={625} txt="y la propia bacteria" t={22} p={p('propia')} />
      <Txt x={400} y={690} txt="detectan anticuerpos" t={24} p={p('detectan')} />
      <Txt x={400} y={726} txt="contra la cardiolipina, un lípido" t={24} p={p('cardiolipina')} color={TXV.ambar} />
      <Txt x={400} y={782} txt="reagina" t={36} p={p('reagina')} color={TXV.violeta} />
      {/* treponémicas: anticuerpos específicos contra T. pallidum */}
      <Bandera x={1200} y={190} txt="treponémicas" color={P.sangre[0]} p={p('treponemicas')} t={32} punta="abajo" />
      {[['FTA-ABS', 'fta', 1010], ['TP-PA', 'tppa', 1150], ['EIA', 'eia', 1275], ['CIA', 'cia', 1385]].map(([txt, , x], i) => (
        <g key={i} opacity={[tramo(p('fta'), 0, 0.4), tramo(p('tppa'), 0, 0.4), tramo(p('eia'), 0, 0.4), tramo(p('cia'), 0, 0.4)][i]}>
          <Bandera x={x as number} y={270} txt={txt as string} color={P.sangre[0]} p={1} t={24} punta="no" />
        </g>
      ))}
      <Sale p={p('especificos')} x={1200} y={520}><Treponema w={420} amp={42} vueltas={6} grosor={18} reloj={reloj} /></Sale>
      {[[-150, -34], [-50, 40], [50, -40], [150, 36]].map(([dx, dy], i) => <IgG key={i} x={1200 + dx} y={520 + dy} r={dy < 0 ? 180 : 0} k={0.9} o={tramo(p('especificos'), 0.3 + i * 0.12, 0.7 + i * 0.12)} tono={[...ROJO]} />)}
      <Txt x={1200} y={690} txt="detectan anticuerpos" t={24} p={p('detectan2')} />
      <Txt x={1200} y={726} txt="específicos contra T. pallidum" t={24} p={p('especificos')} color={TXV.sangre} />
      <Txt x={1200} y={782} txt="treponema" t={36} p={p('treponema2')} color={TXV.esp} />
      </g>
    </g>
  );
};

// ─── 1 · Cómo se hace una no treponémica ─────────────────────────────────────
const ComoSeHace: Lamina = ({ p, reloj }) => {
  const FLOC = [1, 0.9, 0.75, 0.6, 0.45, 0.3, 0];
  return (
    <g>
      <Txt x={800} y={62} txt="cómo se hace una no treponémica" t={38} p={p('prueba')} color={TXV.violeta} />
      <g transform="translate(0,60)">
      {/* suero + antígeno de cardiolipina */}
      <Sale p={p('suero')} x={140} y={240}><TuboEnsayo k={0.32} color="#B5183F" nivel={0.7} reloj={reloj} /></Sale>
      <Txt x={140} y={345} txt="suero del paciente" t={20} p={p('suero')} />
      <Sale p={p('antigeno')} x={640} y={240}><TuboEnsayo k={0.32} color="#FFD23F" nivel={0.7} reloj={reloj} /></Sale>
      <Txt x={640} y={345} txt="antígeno de cardiolipina" t={20} p={p('antigeno')} />
      <Flecha a={[180, 215]} b={[300, 245]} c={[250, 170]} p={p('mezcla')} color="#B5183F" w={8} />
      <Flecha a={[600, 215]} b={[480, 245]} c={[530, 170]} p={p('mezcla')} color="#E0A800" w={8} />
      <TarjetaRpr x={390} y={260} r={100} flocula={easeOut(p('floculacion'))} o={tramo(p('mezcla'), 0, 0.4)} />
      <Txt x={390} y={395} txt="si hay reagina, flocula" t={24} p={p('reagina')} color={TXV.ambar} />
      <Signo x={500} y={190} k={0.9} p={p('positiva')} />
      {/* la dilución en serie */}
      {FLOC.map((f, i) => (
        <Sale key={i} p={[p('diluye'), p('otra'), p('cuatro'), p('ocho'), p('n16'), p('n32'), p('titulo')][i]} x={130 + i * 150} y={580}>
          <TarjetaRpr x={0} y={0} r={52} flocula={f} />
        </Sale>
      ))}
      {['1:1', '1:2', '1:4', '1:8', '1:16', '1:32', '1:64'].map((t, i) => (
        <Txt key={t} x={130 + i * 150} y={662} txt={t} t={24} p={[p('diluye'), p('otra'), p('cuatro'), p('ocho'), p('n16'), p('n32'), p('titulo')][i]} />
      ))}
      <circle cx={880} cy={580} r={68} fill="none" stroke="#FFB62B" strokeWidth={8} opacity={tramo(p('ultima'), 0, 0.5)} />
      <Txt x={880} y={480} txt="título = última dilución positiva" t={22} p={p('ultima')} color={TXV.ambar} />
      {/* de 1:32 a 1:128: cuatro veces */}
      <Txt x={1300} y={470} txt="de 1:32 a 1:128" t={24} p={p('pasar')} />
      <Sale p={p('n32b')} x={1200} y={570}><TarjetaRpr x={0} y={0} r={52} flocula={0.4} /></Sale>
      <Sale p={p('n128')} x={1420} y={570}><TarjetaRpr x={0} y={0} r={66} flocula={1} /></Sale>
      <Txt x={1200} y={660} txt="1:32" t={26} p={p('n32b')} />
      <Txt x={1420} y={668} txt="1:128" t={26} p={p('n128')} color={TXV.sangre} />
      <Flecha a={[1250, 540]} b={[1360, 540]} c={[1305, 490]} p={p('multiplicar')} color={P.espiga[1]} w={8} />
      <Txt x={1305} y={600} txt="×4" t={44} p={p('n4')} color={TXV.ambar} />
      <Txt x={1310} y={745} txt="dos diluciones más" t={26} p={p('diluciones')} color={TXV.violeta} />
      </g>
    </g>
  );
};

// ─── 2 · Cuándo fallan ───────────────────────────────────────────────────────
const CuandoFallan: Lamina = ({ p }) => {
  const tilt = -14 * (tramo(p('lupus'), 0, 0.5) * 0.34 + tramo(p('embarazo'), 0, 0.5) * 0.33 + tramo(p('infecciones'), 0, 0.5) * 0.33);
  return (
    <g>
      <Txt x={800} y={62} txt="cuándo fallan" t={44} p={p('fallan')} color={TXV.violeta} />
      {/* no treponémicas: falsos positivos */}
      <Bandera x={400} y={170} txt="no treponémicas" color={P.rt[0]} p={p('notre')} t={30} punta="no" />
      <Bandera x={400} y={240} txt="falsos positivos" color={P.sangre[0]} p={p('falsos')} t={28} punta="abajo" />
      <path d="M360,620 L440,620 L400,545 Z" fill="#7A5AC8" opacity={tramo(p('falsos'), 0, 0.4)} />
      <g transform={`rotate(${tilt} 400 535)`} opacity={tramo(p('falsos'), 0, 0.4)}>
        <rect x={130} y={521} width={540} height={28} rx={14} fill="#F2A33A" />
        <Sale p={p('lupus')} x={190} y={480}>
          <circle r={26} fill={P.piel2[1]} /><ellipse cx={-12} cy={8} rx={14} ry={8} fill="#E5324C" /><ellipse cx={12} cy={8} rx={14} ry={8} fill="#E5324C" /><rect x={-8} y={2} width={16} height={8} fill="#E5324C" />
          <circle cx={-9} cy={-8} r={3} fill="#5A22A8" /><circle cx={9} cy={-8} r={3} fill="#5A22A8" />
        </Sale>
        <Sale p={p('embarazo')} x={280} y={480}>
          <circle cy={-24} r={9} fill={P.piel2[1]} /><ellipse cy={2} rx={16} ry={22} fill="#16B9BE" /><circle cx={9} cy={8} r={13} fill="#F2A8C0" />
        </Sale>
        <Sale p={p('infecciones')} x={380} y={486}>
          <rect x={-28} y={-13} width={56} height={26} rx={13} fill="#46C84A" /><circle cx={-8} cy={-2} r={4} fill="#C9F59A" /><circle cx={10} cy={3} r={4} fill="#C9F59A" />
          <path d="M-28,0 q-10,-8 -18,0 M28,0 q10,-8 18,0" fill="none" stroke="#46C84A" strokeWidth={4} strokeLinecap="round" />
        </Sale>
        <Signo x={620} y={486} k={0.9} p={p('falsos')} />
      </g>
      <Txt x={400} y={690} txt="lupus y otras autoinmunes" t={24} p={p('lupus')} />
      <Txt x={400} y={728} txt="embarazo" t={24} p={p('embarazo')} />
      <Txt x={400} y={766} txt="otras infecciones" t={24} p={p('infecciones')} />
      <Txt x={400} y={820} txt="y falsos negativos: sífilis temprana" t={24} p={p('negativos')} color={TXV.ambar} />
      {/* el efecto prozona */}
      <Bandera x={1200} y={170} txt="efecto prozona" color={P.hla[0]} p={p('prosona')} t={30} punta="abajo" />
      <Sale p={p('prosona')} x={1010} y={350}>
        <TarjetaRpr x={0} y={0} r={90} flocula={0} />
      </Sale>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2, r = 54 + (i % 2) * 18;
        return <IgG key={i} x={1010 + Math.cos(a) * r} y={350 + Math.sin(a) * r} r={(a * 180) / Math.PI + 90} k={0.4} o={tramo(p('anticuerpos'), (i / 10) * 0.6, (i / 10) * 0.6 + 0.4)} tono={[...ROJO]} />;
      })}
      <Signo x={1085} y={275} k={0.8} mas={false} p={p('negativa2')} />
      <Txt x={1010} y={470} txt="demasiados anticuerpos" t={22} p={p('anticuerpos')} />
      <Txt x={1010} y={504} txt="impiden la floculación" t={22} p={p('impiden')} color={TXV.sangre} />
      <Txt x={1010} y={538} txt="la prueba sale negativa" t={22} p={p('negativa2')} />
      <Flecha a={[1110, 350]} b={[1290, 350]} p={p('diluir')} color={P.espiga[1]} w={9} />
      <Txt x={1200} y={312} txt="diluir el suero" t={22} p={p('diluir')} color={TXV.ambar} />
      <TarjetaRpr x={1390} y={350} r={90} flocula={easeOut(p('reaccion'))} o={tramo(p('aparece'), 0, 0.4)} />
      <Signo x={1465} y={275} k={0.8} p={p('reaccion')} />
      <Txt x={1390} y={470} txt="entonces aparece" t={22} p={p('aparece')} />
      <Txt x={1390} y={504} txt="la reacción" t={22} p={p('reaccion')} color={TXV.verde} />
      {/* treponémicas */}
      <Bandera x={1200} y={650} txt="treponémicas" color={P.sangre[0]} p={p('treponemicas')} t={30} punta="abajo" />
      <Txt x={1200} y={740} txt="menos falsos positivos" t={26} p={p('menos')} color={TXV.verde} />
      <Txt x={1200} y={790} txt="falsos negativos solo" t={24} p={p('pueden2')} />
      <Txt x={1200} y={826} txt="en la primaria muy temprana" t={24} p={p('primaria')} />
    </g>
  );
};

// ─── 3 · Dos algoritmos ──────────────────────────────────────────────────────
const DosAlgoritmos: Lamina = ({ p }) => (
  <g>
    <Txt x={800} y={62} txt="dos caminos" t={44} p={p('caminos')} color={TXV.violeta} />
    <Txt x={800} y={108} txt="el orden en que se piden las pruebas" t={24} p={p('orden')} />
    {/* el algoritmo tradicional */}
    <Bandera x={400} y={200} txt="tradicional" color={P.hla[0]} p={p('tradicional')} t={32} punta="no" />
    <Txt x={400} y={282} txt="primero" t={22} p={p('primero')} color={TXV.ambar} />
    <Bandera x={400} y={330} txt="no treponémica" color={P.rt[0]} p={p('notre')} t={28} punta="no" />
    <Flecha a={[400, 362]} b={[400, 462]} p={p('reactiva')} color={P.espiga[1]} w={9} />
    <Txt x={430} y={400} txt="si es reactiva," t={22} ancla="start" p={p('reactiva')} />
    <Txt x={430} y={432} txt="se confirma con…" t={22} ancla="start" p={p('confirma')} />
    <Bandera x={400} y={500} txt="treponémica" color={P.sangre[0]} p={p('treponemica')} t={28} punta="no" />
    {/* el algoritmo reverso */}
    <Bandera x={1150} y={200} txt="reverso" color={P.hla[0]} p={p('reverso')} t={32} punta="no" />
    <Txt x={1150} y={282} txt="primero" t={22} p={p('primero2')} color={TXV.ambar} />
    <Bandera x={1150} y={330} txt="treponémica automatizada" color={P.sangre[0]} p={p('automatizada')} t={26} punta="no" />
    <Flecha a={[1150, 362]} b={[1150, 462]} p={p('reactiva2')} color={P.espiga[1]} w={9} />
    <Txt x={1180} y={412} txt="si es reactiva" t={22} ancla="start" p={p('reactiva2')} />
    <Bandera x={1150} y={500} txt="no treponémica cuantitativa" color={P.rt[0]} p={p('cuantitativa')} t={26} punta="no" />
    <Flecha a={[1150, 532]} b={[1150, 632]} p={p('coinciden')} color={P.espiga[1]} w={9} />
    <Txt x={1180} y={582} txt="si no coinciden" t={22} ancla="start" p={p('coinciden')} color={TXV.sangre} />
    <Bandera x={1150} y={670} txt="segunda treponémica" color={P.sangre[0]} p={p('segunda')} t={26} punta="no" />
    <Txt x={1150} y={722} txt="una distinta a la primera" t={22} p={p('distinta')} />
    <Bandera x={1150} y={780} txt="TP-PA" color={P.sangre[0]} p={p('tppa')} t={28} punta="no" />
    {/* los CDC aceptan ambos */}
    <Txt x={800} y={865} txt="en sus recomendaciones de laboratorio" t={24} p={p('recomendaciones')} />
    <Bandera x={640} y={930} txt="CDC" color={P.esp[0]} p={p('cdc')} t={30} punta="no" />
    <Txt x={760} y={930} txt="2024" t={32} p={p('n2024')} color={TXV.violeta} />
    <Txt x={940} y={930} txt="aceptan ambos" t={30} ancla="start" p={p('aceptan')} color={TXV.verde} />
    <Visto x={1220} y={930} k={1.1} p={p('algoritmos')} />
  </g>
);

// ─── 4 · La dinámica en el tiempo ────────────────────────────────────────────
const Dinamica: Lamina = ({ p }) => {
  const ROJO_PTS: [number, number][] = [[180, 740], [250, 738], [290, 700], [330, 590], [380, 460], [440, 350], [520, 290], [620, 272], [900, 270], [1200, 270], [1440, 270]];
  const AZUL_PTS: [number, number][] = [[180, 740], [320, 738], [360, 700], [410, 610], [470, 490], [540, 390], [620, 322], [700, 300], [780, 308], [880, 338], [1000, 396], [1120, 456], [1240, 514], [1340, 562], [1440, 604]];
  const fr = Math.min(1, 0.3 * easeOut(p('positivizan')) + 0.3 * easeOut(p('alcanzan')) + 0.25 * easeOut(p('secundaria')) + 0.15 * easeOut(p('vida')));
  const fa = Math.min(1, 0.25 * easeOut(p('aparecen2')) + 0.3 * easeOut(p('llegan')) + 0.25 * easeOut(p('latente2')) + 0.2 * easeOut(p('bajan')));
  return (
    <g>
      <Txt x={800} y={62} txt="la dinámica en el tiempo" t={42} p={p('momento')} color={TXV.violeta} />
      <path d="M160,230 L160,760 L1460,760" fill="none" stroke="#7A5AC8" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
      <Txt x={170} y={206} txt="reactividad" t={20} ancla="start" />
      <Trazo pts={ROJO_PTS} p={fr} color="#E5324C" w={11} />
      <Trazo pts={AZUL_PTS} p={fa} color="#3A6FE0" w={11} />
      <Bandera x={1300} y={236} txt="treponémicas" color={P.sangre[0]} p={p('positivizan')} t={24} punta="no" />
      <Bandera x={1310} y={640} txt="no treponémicas" color={P.rt[0]} p={p('notre')} t={24} punta="no" />
      <Txt x={270} y={796} txt="semana 2–3" t={20} p={p('semana')} />
      <Txt x={400} y={832} txt="semana 3–4" t={20} p={p('semana2')} />
      <Txt x={640} y={796} txt="secundaria" t={22} p={p('secundaria')} />
      <Txt x={900} y={796} txt="latente" t={22} p={p('latente')} />
      <Txt x={1250} y={796} txt="años" t={22} p={p('anos')} />
      <Txt x={960} y={238} txt="casi 100 % de sensibilidad" t={22} p={p('n100')} color={TXV.sangre} />
      <Txt x={1150} y={312} txt="reactivas de por vida" t={22} p={p('vida')} color={TXV.sangre} />
      <circle cx={700} cy={300} r={12} fill="#FFF" opacity={tramo(p('pico'), 0, 0.4)} /><circle cx={700} cy={300} r={7} fill="#3A6FE0" opacity={tramo(p('pico'), 0, 0.4)} />
      <Txt x={700} y={340} txt="pico" t={22} p={p('pico')} color={TXV.violeta} />
      <Txt x={1190} y={560} txt="descenso lento" t={22} p={p('bajan')} />
      <Cruz x={180} y={915} k={0.9} p={p('sirven')} />
      <Txt x={640} y={900} txt="las treponémicas no valoran la curación" t={24} p={p('curacion')} />
      <Txt x={640} y={942} txt="ni la reinfección" t={24} p={p('reinfeccion')} />
      <Visto x={1100} y={920} k={0.9} p={p('notre2')} />
      <Txt x={1290} y={920} txt="las no treponémicas, sí" t={26} p={p('notre2')} color={TXV.verde} />
    </g>
  );
};

// ─── 5 · Después del tratamiento ─────────────────────────────────────────────
const Despues: Lamina = ({ p }) => {
  const Y = (k: number) => 690 - k * 62.9;
  const BASE: [number, number][] = [[180, Y(5)], [330, Y(5)]];
  const TALLO: [number, number][] = [[330, Y(5)], [450, Y(4)], [600, Y(3)]];
  const VERDE: [number, number][] = [[600, Y(3)], [720, Y(2)], [840, Y(1)], [950, Y(0)], [1040, 722]];
  const AMBAR: [number, number][] = [[600, Y(3)], [720, Y(2)], [840, Y(1.4)], [950, Y(1.3)], [1040, Y(1.3)]];
  const ROJA: [number, number][] = [[330, Y(5)], [450, Y(5.4)], [600, Y(5.9)], [720, Y(6.3)], [840, Y(6.7)], [950, Y(7)], [1040, Y(7)]];
  return (
    <g>
      <Txt x={800} y={62} txt="¿funcionó el tratamiento?" t={42} p={p('funciono')} color={TXV.violeta} />
      <Txt x={800} y={108} txt="se sigue el título de la no treponémica" t={24} p={p('notre')} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
        <g key={k}>
          <line x1={170} y1={Y(k)} x2={1060} y2={Y(k)} stroke="#7A5AC8" strokeWidth={2} opacity={0.2} />
          <Txt x={150} y={Y(k)} txt={`1:${2 ** k}`} t={18} ancla="end" />
        </g>
      ))}
      <line x1={170} y1={722} x2={1060} y2={722} stroke="#7A5AC8" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      <rect x={560} y={245} width={240} height={477} fill="#7A5AC8" opacity={0.13 * tramo(p('meses'), 0, 0.5)} />
      <Txt x={680} y={228} txt="6 a 12 meses" t={22} p={p('meses')} />
      <Trazo pts={BASE} p={easeOut(p('titulo'))} color="#B7AEDB" w={10} />
      <Txt x={250} y={Y(5) - 36} txt="título inicial 1:32" t={20} p={p('titulo')} />
      <line x1={330} y1={240} x2={330} y2={722} stroke="#FFB62B" strokeWidth={5} strokeDasharray="12 10" opacity={tramo(p('tratamiento'), 0, 0.5)} />
      <Txt x={330} y={222} txt="tratamiento" t={22} p={p('tratamiento')} color={TXV.ambar} />
      <Trazo pts={TALLO} p={easeOut(p('bajar'))} color="#7A5AC8" w={11} />
      <Txt x={590} y={612} txt="al menos 4 veces" t={22} p={p('n4')} color={TXV.verde} />
      <Trazo pts={VERDE} p={easeOut(p('negativiza'))} color="#2FD79A" w={11} />
      <Trazo pts={AMBAR} p={easeOut(p('estanca'))} color="#FFB62B" w={11} />
      <Trazo pts={ROJA} p={easeOut(p('sube'))} color="#E5324C" w={11} />
      <Txt x={1085} y={745} txt="serorreversión: se negativiza" t={22} ancla="start" p={p('reversion')} color={TXV.verde} />
      <Txt x={1085} y={585} txt="baja y se estanca" t={22} ancla="start" p={p('estanca')} />
      <Txt x={1085} y={619} txt="en un nivel bajo (1:1 a 1:4)" t={22} ancla="start" p={p('nivel')} />
      <Txt x={1085} y={653} txt="cicatriz serológica" t={26} ancla="start" p={p('cicatriz')} color={TXV.ambar} />
      <Txt x={1085} y={687} txt="sin reinfección ni fracaso" t={20} ancla="start" p={p('reinfeccion')} />
      <Txt x={1085} y={250} txt="aumento de 4 veces" t={26} ancla="start" p={p('cambio')} color={TXV.sangre} />
      <Txt x={1085} y={286} txt="1:32 → 1:128" t={26} ancla="start" p={p('sube')} color={TXV.sangre} />
      <Txt x={800} y={870} txt="paciente 2: de 1:32 a 1:128" t={28} p={p('paciente')} />
      <Txt x={800} y={915} txt="la infección sigue activa" t={26} p={p('infeccion')} color={TXV.sangre} />
      <Txt x={800} y={958} txt="o hubo una nueva exposición" t={26} p={p('nueva')} color={TXV.ambar} />
    </g>
  );
};

const LAMINAS: Lamina[] = [DosFamilias, ComoSeHace, CuandoFallan, DosAlgoritmos, Dinamica, Despues];
export default LAMINAS;
