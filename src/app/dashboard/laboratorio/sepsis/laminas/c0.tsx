'use client';
// Capítulo 0 · Dos pacientes, una pregunta (vistazo gratis)

import type { Lamina } from '../Lienzo';
import { Alveolos, Bacilo, Bandera, Barra, Cerebro, Corazon, Cuerpo, Diana, Diplococo, Endo, Estacion, Fibrina, Flecha, Flota, Hematie, Hombre, Late, Linfocito, Llama, Manometro, Nfkb, Persona, Pierna, Puerta, Pulmones, Respira, Rinon, S, Sale, Termometro, Tlr4, Tnf, Txt, Vagon, Vaso, Via, clamp, easeOut, hash, lerp, tramo } from '../Piezas';

// ─── 0 · El joven de las manchas ─────────────────────────────────────────────
const ElJoven: Lamina = ({ p, reloj }) => {
  const fiebre = p('fiebre'), cabeza = p('cabeza');
  const baja = clamp(p('aprieta') * 1.4);
  return (
    <g>
      <Sale p={p('joven')} x={360} y={540} k={0.95}><Hombre rubor={fiebre} triste={0.35 * fiebre} /></Sale>
      <Bandera x={360} y={150} txt="19 años · sano" color={S.il6[0]} p={p('joven')} t={30} punta="abajo" />
      {[[-150, -150, -28], [150, -150, 28], [0, -250, 0]].map(([dx, dy, r], i) => (
        <g key={i} opacity={tramo(cabeza, i * 0.15, i * 0.15 + 0.5) * (0.65 + 0.35 * Math.sin(reloj / 140 + i))} transform={`translate(${360 + dx},${540 + dy}) rotate(${r})`}>
          <path d="M-6,-34 L8,-8 L-4,-8 L8,22" fill="none" stroke="#FF3B3B" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      <Bandera x={130} y={810} txt="dolor de cabeza intenso" color={S.il1[0]} p={cabeza} t={24} punta="der" ancla="izq" />
      <Bandera x={130} y={890} txt="músculos molidos" color={S.tnf[0]} p={p('musculos')} t={24} punta="der" ancla="izq" />
      <Sale p={p('manchas')} x={1240} y={560} k={0.78}><Pierna p={p('manchas')} /></Sale>
      <g opacity={tramo(p('aprieta'), 0, 0.3)}>
        <circle cx={1200} cy={lerp(380, 480, easeOut(baja))} r={46} fill="#F2B697" /><circle cx={1195} cy={lerp(372, 472, easeOut(baja))} r={36} fill="#FBD2BC" />
        <ellipse cx={1186} cy={lerp(362, 462, easeOut(baja))} rx={12} ry={6} fill="#FFF" opacity={0.6} />
      </g>
      <Bandera x={1240} y={130} txt="petequias: no se borran al apretar" color={S.il1[0]} p={p('manchas')} t={26} punta="abajo" />
      <Flota x={660} y={310} rl={reloj} alto={6}><Termometro k={0.55} val={lerp(0.3, 0.93, p('temp'))} /></Flota>
      <Bandera x={660} y={540} txt="39,2 °C" color={S.il1[0]} p={p('temp')} t={26} punta="no" />
      <Sale p={p('fc')} x={600} y={680} k={0.5}><Late reloj={reloj} bpm={118} fuerza={1.4}><Corazon /></Late></Sale>
      <Bandera x={600} y={785} txt="118 /min" color={S.il1[0]} p={p('fc')} t={24} punta="no" />
      <Sale p={p('fr')} x={745} y={685} k={0.46}><Respira reloj={reloj} periodo={1500} amp={0.06}><Pulmones /></Respira></Sale>
      <Bandera x={745} y={785} txt="24 /min" color={S.c5a[0]} p={p('fr')} t={24} punta="no" />
      <Sale p={p('pa')} x={895} y={690} k={0.8}><Manometro x={0} y={0} val={0.48} /></Sale>
      <Bandera x={895} y={810} txt="112/70" color={S.nfkb[0]} p={p('pa')} t={24} punta="no" />
      <Txt x={1240} y={860} txt="despierto, sin rigidez de nuca" t={26} p={p('despierto')} />
      <Bandera x={800} y={950} txt="parece estable… pero las manchas no se borran" color={S.menin[0]} p={p('final')} t={30} punta="no" />
    </g>
  );
};

// ─── 1 · La abuela que no reconoce a su familia ──────────────────────────────
const LaAbuela: Lamina = ({ p, reloj }) => {
  const tos = p('tos');
  return (
    <g>
      <Sale p={p('abuela')} x={360} y={560} k={0.85}><Persona quien="mujer" /></Sale>
      <Bandera x={360} y={150} txt="76 años · hipertensa" color={S.nucleo[1]} p={p('abuela')} t={30} punta="abajo" />
      {[0, 1, 2].map((i) => {
        const u = ((reloj / 1600 + i / 3) % 1);
        return <circle key={i} cx={440 + u * 150} cy={480 - u * 70 + i * 10} r={10 + u * 22} fill={S.gris[1]} opacity={tramo(tos, 0, 0.3) * 0.75 * (1 - u)} />;
      })}
      <Bandera x={130} y={810} txt="tos con flema y falta de aire" color={S.c5a[0]} p={tos} t={24} punta="der" ancla="izq" />
      {['z', 'Z', 'z'].map((z, i) => {
        const u = ((reloj / 2200 + i / 3) % 1);
        return <text key={i} x={470 + i * 26 + u * 30} y={300 - u * 90} fontSize={30 + i * 10} fontWeight={800} fill="var(--se-violeta)" opacity={tramo(p('adormilada'), 0, 0.3) * (1 - u)}>{z}</text>;
      })}
      <Sale p={p('desorienta')} x={230} y={290} k={1}><text x={0} y={0} textAnchor="middle" fontSize={92} fontWeight={800} fill="var(--se-ambar)">?</text></Sale>
      <Bandera x={360} y={950} txt="adormilada · no sabe dónde está" color={S.il6[0]} p={p('adormilada')} t={26} punta="no" />
      <Flota x={660} y={310} rl={reloj} alto={6}><Termometro k={0.55} val={lerp(0.2, 0.34, p('temp'))} /></Flota>
      <Bandera x={660} y={540} txt="35,8 °C" color={S.c5a[0]} p={p('temp')} t={26} punta="no" />
      <Sale p={p('pa')} x={600} y={690} k={0.8}><Manometro x={0} y={0} val={0.4} /></Sale>
      <Bandera x={600} y={810} txt="108/66" color={S.nfkb[0]} p={p('pa')} t={24} punta="no" />
      <Sale p={p('fc')} x={760} y={690} k={0.46}><Late reloj={reloj} bpm={112} fuerza={1.4}><Corazon /></Late></Sale>
      <Bandera x={760} y={790} txt="112 /min" color={S.il1[0]} p={p('fc')} t={24} punta="no" />
      <Sale p={p('pulmon')} x={1130} y={430} k={0.95}><Respira reloj={reloj} periodo={1300} amp={0.05}><Pulmones infiltrados={0.5 * p('crepitantes') + 0.2} /></Respira></Sale>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const u = ((reloj / 1100 + hash(i, 3)) % 1);
        return <circle key={i} cx={1130 + (hash(i, 1) - 0.5) * 220} cy={400 + (hash(i, 2) - 0.4) * 190} r={4 + u * 9} fill="none" stroke="#FFF" strokeWidth={3} opacity={tramo(p('crepitantes'), 0, 0.4) * (1 - u)} />;
      })}
      <Bandera x={1130} y={650} txt="crepitantes en los dos pulmones" color={S.c5a[0]} p={p('crepitantes')} t={24} punta="no" />
      <Bandera x={1130} y={725} txt="30 respiraciones /min" color={S.c5a[0]} p={p('fr')} t={24} punta="no" />
      <Barra x={900} y={850} w={560} h={40} val={0.86} color={S.c5a[1]} txt="saturación de O₂" valor="86 %" p={p('sat')} />
      <Txt x={1130} y={950} txt="ni rastro de fiebre… y aun así, algo grave" t={26} p={p('final')} />
    </g>
  );
};

// ─── 2 · Dos puertas de entrada ──────────────────────────────────────────────
const DosPuertas: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Bandera x={420} y={80} txt="la sangre del joven" color={S.menin[0]} p={p('sangre')} t={30} punta="no" />
      <Bandera x={1180} y={80} txt="el pulmón de la abuela" color={S.c5a[0]} p={p('pulmon')} t={30} punta="no" />
      <Sale p={p('puertas')} x={420} y={250} k={0.5}><Puerta abre={p('puertas')} /></Sale>
      <Sale p={p('puertas')} x={1180} y={250} k={0.5}><Puerta abre={p('puertas')} /></Sale>
      <Vaso x={420} y={520} largo={900} ancho={290} ang={0} reloj={reloj} flujo={8} o={tramo(p('sangre'), 0, 0.5)}>
        {[[-130, -40], [60, 40], [200, -30], [-30, 50]].map(([cx, cy], i) => (
          <Diplococo key={i} x={cx} y={cy + Math.sin(reloj / 600 + i) * 7} k={0.62} r={i * 25} reloj={reloj} fase={i} pili={0.8} o={tramo(p('diplococos'), i * 0.15, i * 0.15 + 0.5)} />
        ))}
      </Vaso>
      <Bandera x={420} y={700} txt="diplococos gramnegativos" color={S.menin[0]} p={p('diplococos')} t={26} punta="no" />
      <Bandera x={420} y={775} txt="Neisseria meningitidis" color={S.menin[0]} p={p('menin')} t={30} punta="no" />
      <Sale p={p('pulmon')} x={1180} y={540} k={0.85}><Alveolos /></Sale>
      {[[-70, -30], [60, -70], [-10, 60], [90, 30]].map(([cx, cy], i) => (
        <Bacilo key={i} x={1180 + cx + Math.sin(reloj / 500 + i * 2) * 8} y={540 + cy} k={0.55} r={-30 + i * 40} tono={S.pseudo as unknown as readonly string[]} reloj={reloj} flagelo={0.6} o={tramo(p('neumonia'), i * 0.15, i * 0.15 + 0.5)} />
      ))}
      <Bandera x={1180} y={775} txt="neumonía bacteriana" color={S.c5a[0]} p={p('neumonia')} t={30} punta="no" />
      <Txt x={800} y={870} txt="nada en común… y van al mismo lugar" t={28} p={p('nada')} />
      <Flecha a={[560, 935]} b={[740, 945]} c={[640, 975]} p={tramo(p('lugar'), 0, 0.7)} color={S.il6[1]} w={8} />
      <Flecha a={[1040, 935]} b={[860, 945]} c={[960, 975]} p={tramo(p('lugar'), 0, 0.7)} color={S.il6[1]} w={8} />
      <Sale p={p('lugar')} x={800} y={945} k={0.5}><Diana /></Sale>
    </g>
  );
};

// ─── 3 · La pregunta ─────────────────────────────────────────────────────────
const LaPregunta: Lamina = ({ p, reloj }) => {
  const resp = p('respuesta');
  return (
    <g>
      <Sale p={p('infeccion')} x={760} y={530} k={0.82}><Cuerpo /></Sale>
      <Sale p={p('infeccion')} x={190} y={420} k={0.62}><Flota x={0} y={0} rl={reloj} alto={4}><Diplococo reloj={reloj} capsula={1} /></Flota></Sale>
      <Bandera x={190} y={300} txt="el microbio" color={S.menin[0]} p={p('infeccion')} t={28} punta="abajo" />
      <path d="M270,450 C400,450 480,480 610,490" fill="none" stroke={S.menin[1]} strokeWidth={6} strokeLinecap="round" strokeDasharray="2 16" opacity={tramo(p('infeccion'), 0.4, 1)} />
      {[
        { x: 1190, y: 270, nombre: 'la piel', clave: 'piel', pieza: <Pierna k={0.22} p={1} /> },
        { x: 1290, y: 500, nombre: 'el riñón', clave: 'rinon', pieza: <Rinon k={0.55} /> },
        { x: 1170, y: 720, nombre: 'el cerebro', clave: 'cerebro', pieza: <Cerebro k={0.55} /> },
      ].map((o, i) => (
        <g key={i}>
          <Sale p={p(o.clave)} x={o.x} y={o.y}>
            <circle r={96 + 6 * Math.sin(reloj / 300 + i)} fill={S.il1[1]} opacity={0.22 * tramo(resp, 0, 0.5)} />
            {o.pieza}
          </Sale>
          <Bandera x={o.x} y={o.y + 120} txt={o.nombre} color={S.il1[0]} p={p(o.clave)} t={26} punta="no" />
        </g>
      ))}
      <Sale p={p('toco')} x={500} y={250} k={1}><text textAnchor="middle" fontSize={110} fontWeight={800} fill="var(--se-ambar)">?</text></Sale>
      <Bandera x={800} y={90} txt="¿cómo se dañan órganos que el microbio no tocó?" color={S.il6[0]} p={p('pregunta')} t={32} punta="no" />
      <Flecha a={[850, 420]} b={[1070, 300]} c={[960, 340]} p={tramo(resp, 0, 0.8)} color={S.il1[1]} w={9} />
      <Flecha a={[860, 520]} b={[1160, 520]} p={tramo(resp, 0.1, 0.9)} color={S.il1[1]} w={9} />
      <Flecha a={[840, 600]} b={[1010, 700]} c={[930, 620]} p={tramo(resp, 0.2, 1)} color={S.il1[1]} w={9} />
      <Sale p={p('desborda')} x={760} y={440} k={0.75}><Respira reloj={reloj} periodo={900} amp={0.1}><Llama /></Respira></Sale>
      <Bandera x={800} y={955} txt="el daño lo hace, sobre todo, la respuesta del propio cuerpo" color={S.il1[0]} p={resp} t={28} punta="no" />
    </g>
  );
};

// ─── 4 · El mapa (también es la portada) ─────────────────────────────────────
const ESTACIONES = [
  { x: 150, nombre: 'reconocer', color: '#2FA84F' },
  { x: 345, nombre: 'la señal', color: '#5B4BE8' },
  { x: 540, nombre: 'mensajeros', color: '#E8721E' },
  { x: 735, nombre: 'endotelio', color: '#0C9E9A' },
  { x: 930, nombre: 'coagulación', color: '#2E78F2' },
  { x: 1125, nombre: 'el choque', color: '#19A8C2' },
  { x: 1320, nombre: 'microcirculación', color: '#F2546B' },
  { x: 1515, nombre: 'los órganos', color: '#0E9E6A' },
];

const Mapa: Lamina = ({ p, reloj }) => {
  const tren = p('tren');
  const luces = [p('e1'), p('e2'), p('e3'), p('e4'), p('e5'), p('e6'), p('e7'), p('e8')];
  const hasta = luces.reduce((a, v) => a + easeOut(clamp(v)), 0);
  const xs = ESTACIONES.map((e) => e.x);
  const i = Math.min(7, Math.floor(hasta));
  const xv = hasta <= 1 ? lerp(60, xs[0], hasta) : hasta >= 8 ? xs[7] : lerp(xs[i - 1], xs[i], hasta - i);
  const iconos = [
    <Tlr4 key="a" k={0.42} y={30} cola={false} reloj={reloj} />,
    <Nfkb key="b" k={1.5} />,
    <Tnf key="c" k={1.3} />,
    <Endo key="d" w={150} h={52} y={22} gluco={1} />,
    <Fibrina key="e" w={120} />,
    <Manometro key="f" x={0} y={8} k={0.62} val={0.3} />,
    <Hematie key="g" k={1.15} />,
    <Rinon key="h" k={0.42} />,
  ];
  return (
    <g>
      <Bandera x={800} y={110} txt="el recorrido del laboratorio" color="#6D3FD8" p={p('tren')} t={34} punta="no" />
      <Via x0={40} x1={1560} y={640} tramos={ESTACIONES.map((e) => e.color)} p={tren} />
      {ESTACIONES.map((e, j) => (
        <g key={j}>
          <Estacion x={e.x} y={470} color={e.color} p={luces[j]} luz={Math.sin(reloj / 500 + j) * 0.3 + 0.7 * clamp(luces[j])}>{iconos[j]}</Estacion>
          <Bandera x={e.x} y={j % 2 ? 765 : 330} txt={`${j + 1} · ${e.nombre}`} color={e.color} p={luces[j]} t={22} punta={j % 2 ? 'no' : 'abajo'} />
        </g>
      ))}
      <Vagon x={xv} y={612 + Math.sin(reloj / 160) * 2} k={0.62} o={tramo(tren, 0, 0.3)} reloj={reloj} tono={['#B02FA0', '#E86AD2', '#FFB0F0']} />
      <Sale p={p('defensas')} x={800} y={870} k={0.7}><Linfocito /></Sale>
      <Bandera x={800} y={940} txt="9 · las defensas que se apagan · empecemos" color="#6D3FD8" p={p('empecemos')} t={30} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [ElJoven, LaAbuela, DosPuertas, LaPregunta, Mapa];
export default LAMINAS;
