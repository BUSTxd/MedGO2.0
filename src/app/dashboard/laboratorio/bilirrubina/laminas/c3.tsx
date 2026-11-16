'use client';
// Capítulo 3 · La entrada al hepatocito

import type { Lamina } from '../Lienzo';
import { Albumina, B, Bandera, Capas, Chip, Cruz, Flecha, Flujo, Hepatocito, Higado, Pastilla, Poro, Proteina, Reticulo, Sale, Tetrapirrol, Txt, TXB, Visto, clamp, easeOut, hash, lerp, tramo } from '../Piezas';

const OATP = ['#C77800', '#FFB21E', '#FFE08A'] as const;
const MRP3 = ['#B5245E', '#F25CA8', '#FFC2DE'] as const;

/** Sinusoide: plasma que corre de izquierda a derecha entre dos filas de endotelio con poros, y el espacio de Disse debajo. */
function Sinusoide({ y0 = 150, y1 = 330, reloj, poros = 1, disse = 1, o = 1, hematies = true }: { y0?: number; y1?: number; reloj: number; poros?: number; disse?: number; o?: number; hematies?: boolean }) {
  if (o <= 0.002) return null;
  const hueco = 26 * clamp(poros);
  return (
    <g opacity={o}>
      <rect x={-20} y={y0} width={1640} height={y1 - y0} fill="#7E1840" />
      <rect x={-20} y={y0} width={1640} height={(y1 - y0) * 0.3} fill="#5E1030" opacity={0.6} />
      {hematies && Array.from({ length: 7 }, (_, i) => {
        const X = ((hash(i, 5) * 1800 + reloj * 0.08) % 1800) - 100;
        return <g key={i} transform={`translate(${X.toFixed(1)},${(y0 + 40 + hash(i, 6) * (y1 - y0 - 80)).toFixed(1)}) scale(1,0.55)`}><circle r={34} fill="#9E0B2E" /><circle r={30} cx={-2} cy={-2} fill="#E3203F" /><circle r={13} fill="#9E0B2E" /></g>;
      })}
      {Array.from({ length: 9 }, (_, i) => {
        const x = -20 + i * 190;
        return <rect key={i} x={x + hueco / 2} y={y1 - 8} width={190 - hueco} height={22} rx={11} fill="#FF7480" />;
      })}
      <rect x={-20} y={y1 + 14} width={1640} height={46 * clamp(disse)} fill="#FFE6A8" opacity={0.55} />
    </g>
  );
}

const Llegar: Lamina = ({ p, reloj }) => {
  const baja = p('albumina'), suelta = p('suelta');
  const ay = lerp(230, 400, easeOut(baja));
  return (
    <g>
      <Sale p={p('higado')} x={1420} y={110} k={0.18}><Higado corte={false} /></Sale>
      <Bandera x={420} y={70} txt="tercera estación: el hígado" color="#C2307A" p={p('higado')} t={28} punta="no" />
      <Sinusoide reloj={reloj} poros={p('poros')} disse={p('disse')} o={tramo(p('sinusoides'), 0, 0.4)} />
      <Txt x={1300} y={300} txt="sinusoide con poros" t={26} p={p('poros')} color="#FFFFFF" />
      <Txt x={250} y={372} txt="espacio de Disse" t={22} p={p('disse')} color={TXB.ambar} />
      <Hepatocito x0={80} x1={1520} y0={410} y1={960} o={tramo(p('sinusoides'), 0, 0.4)} />
      <Txt x={800} y={890} txt="hepatocito" t={30} p={p('sinusoides')} color="#FFFFFF" />
      <Albumina x={800 + Math.sin(reloj / 900) * 30} y={ay - 30 * easeOut(suelta)} k={0.75} reloj={reloj} o={tramo(baja, 0, 0.3)} />
      <Tetrapirrol x={800 + lerp(0, 60, easeOut(suelta))} y={lerp(ay - 40, 470, easeOut(suelta))} k={0.28} plegada={1} tono={B.bilirrubina} vibra={reloj} o={tramo(baja, 0, 0.3)} />
      <Txt x={800} y={620} txt="suelta su carga" t={28} p={suelta} color="#FFFFFF" />
      <Txt x={800} y={670} txt="sin escolta" t={24} p={p('escolta')} color="#FFE08A" fuerte={false} />
    </g>
  );
};

/** La membrana del hepatocito de lado (referencia): bandas festoneadas de magenta a violeta. */
function Membrana({ y = 440, o = 1 }: { y?: number; o?: number }) {
  return <Capas x={800} y={y} w={1700} fondo={260} bandas={[[0, '#F25CA8', 22], [40, '#D23AD8', 26], [52, '#9A2AC8', 28], [56, '#6A1A98', 30]]} sem={3} o={o} />;
}

const Cruzar: Lamina = ({ p, reloj }) => {
  const u = (reloj / 3600) % 1;
  return (
    <g>
      <Bandera x={800} y={80} txt="¿cómo cruza la membrana?" color="#C2307A" p={p('membrana')} t={30} punta="no" />
      <Membrana o={tramo(p('membrana'), 0, 0.4)} />
      <Txt x={800} y={900} txt="dentro del hepatocito" t={24} p={p('membrana')} color="#FFFFFF" fuerte={false} />
      {p('difusion') > 0.05 && <Tetrapirrol x={380 + Math.sin(u * 6) * 20} y={lerp(240, 780, u)} k={0.3} plegada={1} tono={B.bilirrubina} o={tramo(Math.min(u, 1 - u), 0, 0.08) * p('difusion')} />}
      <Txt x={380} y={190} txt="difusión pasiva" t={28} p={p('difusion')} color={TXB.ambar} />
      <Txt x={380} y={230} txt="(aún se discute cuánto)" t={22} p={p('discute')} fuerte={false} />
      {[1000, 1300].map((x, i) => <Poro key={x} x={x} y={440} k={1.1} tono={OATP} o={tramo(p('oatp'), i * 0.2, 0.6 + i * 0.2)} bombea={reloj + i * 300} />)}
      <Chip x={1000} y={350} txt="OATP1B1" color="#C77800" p={p('oatp')} t={22} />
      <Chip x={1300} y={350} txt="OATP1B3" color="#C77800" p={tramo(p('oatp'), 0.2, 1)} t={22} />
      {p('conjugada') > 0.05 && [0, 1].map((i) => {
        const v = (reloj / 3000 + i * 0.5) % 1;
        return <Tetrapirrol key={i} x={i ? 1300 : 1000} y={lerp(200, 700, v)} k={0.24} colitas={2} tono={B.conjugada} o={tramo(Math.min(v, 1 - v), 0, 0.1) * p('conjugada')} />;
      })}
      <Txt x={1150} y={760} txt="sobre todo la conjugada que vuelve" t={24} p={p('conjugada')} color="#FFFFFF" />
      <Bandera x={800} y={960} txt="dos puertas para una misma entrada" color="#5B2FB0" p={p('puertas')} t={24} punta="no" />
    </g>
  );
};

const Chaperonas: Lamina = ({ p, reloj }) => {
  const lleva = p('reticulo');
  const x = lerp(520, 1080, easeOut(lleva));
  return (
    <g>
      <Hepatocito x0={40} x1={1560} y0={60} y1={960} nucleo={false} />
      <Bandera x={800} y={130} txt="las chaperonas" color="#2E78F2" p={p('chaperonas')} t={30} punta="no" />
      <Reticulo x={1220} y={560} w={520} n={4} reloj={reloj} o={tramo(lleva, 0, 0.4)} />
      <Txt x={1220} y={740} txt="retículo endoplasmático" t={24} p={lleva} color="#FFFFFF" />
      <Proteina x={x} y={470} k={1.3} reloj={reloj} o={tramo(p('ligandina'), 0, 0.4)} />
      <Tetrapirrol x={x - 10} y={400 + Math.sin(reloj / 600) * 5 + (1 - easeOut(p('sujetan'))) * -60} k={0.3} plegada={1} tono={B.bilirrubina} vibra={reloj} />
      <Txt x={520} y={620} txt="ligandina" t={30} p={p('ligandina')} color="#FFFFFF" />
      <Txt x={520} y={660} txt="una glutatión S-transferasa" t={22} p={p('ligandina')} color="#FFE6F4" fuerte={false} />
      <Proteina x={240} y={330} k={0.9} reloj={reloj} fase={2} tono={['#138A3A', '#3FD467', '#B5F5C4']} o={tramo(p('fabp'), 0, 0.4)} />
      <Txt x={240} y={440} txt="FABP" t={28} p={p('fabp')} color="#FFFFFF" />
      <Txt x={800} y={860} txt="la sujetan: no precipita ni vuelve a salir" t={28} p={p('sujetan')} color="#FFFFFF" />
    </g>
  );
};

const IdaVuelta: Lamina = ({ p, reloj }) => (
  <g>
    <Sinusoide reloj={reloj} y0={60} y1={250} />
    <Membrana y={330} />
    <Bandera x={800} y={560} txt="una puerta de ida y vuelta" color="#C2307A" p={p('ida')} t={30} punta="no" />
    {[0, 1, 2, 3].map((i) => {
      const u = (reloj / 2800 + i / 4) % 1;
      const vuelve = i % 2 === 1 && p('vuelve') > 0.1;
      const y = vuelve ? lerp(700, 140, u) : lerp(140, 700, u);
      const atrapada = !vuelve && p('retiene') > 0.1 && u > 0.7;
      return <Tetrapirrol key={i} x={280 + i * 340} y={atrapada ? 700 : y} k={0.26} plegada={1} tono={B.bilirrubina} o={tramo(Math.min(u, 1 - u), 0, 0.08) * tramo(p('ida'), 0, 0.4)} />;
    })}
    <Flecha a={[160, 200]} b={[160, 640]} p={p('ida')} color="var(--cit-flecha)" w={8} />
    <Flecha a={[1460, 640]} b={[1460, 200]} p={p('vuelve')} color="#E3203F" w={8} />
    <Txt x={1300} y={460} txt="parte vuelve a la sangre" t={24} p={p('vuelve')} color="#FFFFFF" />
    {[0, 1, 2].map((i) => <Proteina key={i} x={420 + i * 380} y={800} k={0.75} reloj={reloj} fase={i} o={tramo(p('retiene'), i * 0.2, 0.6 + i * 0.2)} />)}
    <Txt x={800} y={920} txt="la retiene su unión a las proteínas del citosol" t={26} p={p('citosol')} />
  </g>
);

/** Tres hepatocitos en fila, de la entrada del lobulillo al centro. */
function Fila({ tinte = [0.6, 0.3, 0.15] }: { tinte?: number[] }) {
  return (
    <g>
      {[[80, 520], [570, 1030], [1080, 1520]].map(([a, b], i) => <Hepatocito key={i} x0={a} x1={b} y0={440} y1={860} tinte={tinte[i]} sem={i + 3} />)}
    </g>
  );
}

const Salto: Lamina = ({ p, reloj }) => {
  const sal = p('mrp3'), rec = p('recapta');
  // La conjugada sale del primero, viaja por la sinusoide y entra al tercero.
  const camino = (u: number): [number, number] => u < 0.25 ? [300, lerp(500, 260, u / 0.25)] : u < 0.75 ? [lerp(300, 1300, (u - 0.25) / 0.5), 230 + Math.sin(u * 20) * 12] : [1300, lerp(260, 560, (u - 0.75) / 0.25)];
  return (
    <g>
      <Sinusoide reloj={reloj} y0={120} y1={330} />
      <Flecha a={[120, 90]} b={[1480, 90]} p={p('pasan')} color="var(--cit-flecha)" w={7} />
      <Txt x={800} y={60} txt="sangre: de la entrada del lobulillo al centro" t={22} p={p('pasan')} fuerte={false} />
      <Fila tinte={[0.6 * p('periportales'), 0.3, 0.15]} />
      <Txt x={300} y={900} txt="periportal: recibe más" t={24} p={p('periportales')} />
      <Txt x={1300} y={900} txt="centrolobulillar" t={24} p={p('centro')} />
      <Poro x={300} y={420} k={0.8} tono={MRP3} r={180} o={tramo(sal, 0, 0.4)} bombea={reloj} tallo={40} />
      <Chip x={420} y={400} txt="MRP3" color="#B5245E" p={sal} t={22} />
      <Poro x={1300} y={420} k={0.8} tono={OATP} o={tramo(rec, 0, 0.4)} bombea={reloj + 300} tallo={40} />
      <Chip x={1180} y={400} txt="OATP1B" color="#C77800" p={rec} t={22} />
      {sal > 0.1 && Array.from({ length: 4 }, (_, i) => {
        const u = ((reloj / 5000) + i / 4) % 1;
        if (rec < 0.1 && u > 0.7) return null;
        const [x, y] = camino(u);
        return <Tetrapirrol key={i} x={x} y={y} k={0.2} colitas={2} tono={B.conjugada} />;
      })}
      <Bandera x={800} y={960} txt="así se reparte la carga" color="#C2307A" p={p('reparte')} t={24} punta="no" />
    </g>
  );
};

const Rotor: Lamina = ({ p, reloj }) => {
  const falla = p('fallan'), sangre = p('sangre');
  const n = Math.round(14 * sangre);
  return (
    <g>
      <Sinusoide reloj={reloj} y0={120} y1={330} />
      <Bandera x={800} y={60} txt="síndrome de Rotor" color="#C2307A" p={p('rotor')} t={30} punta="no" />
      <Fila tinte={[0.5, 0.3, 0.15]} />
      <Poro x={300} y={420} k={0.8} tono={MRP3} r={180} bombea={reloj} tallo={40} o={tramo(p('rotor'), 0, 0.3)} />
      {[800, 1300].map((x, i) => <Poro key={x} x={x} y={420} k={0.8} tono={OATP} roto={tramo(falla, i * 0.3, 0.6 + i * 0.3)} tallo={40} o={tramo(p('rotor'), 0, 0.3)} />)}
      <Txt x={1050} y={520} txt="fallan OATP1B1 y 1B3 a la vez" t={24} p={falla} color="#FFFFFF" />
      {Array.from({ length: n }, (_, i) => {
        const X = ((hash(i, 9) * 1700 + reloj * 0.07) % 1700) - 50;
        return <Tetrapirrol key={i} x={X} y={170 + hash(i, 10) * 130} k={0.16} colitas={2} tono={B.conjugada} />;
      })}
      <Txt x={800} y={900} txt="hiperbilirrubinemia conjugada leve" t={28} p={p('leve')} color={TXB.limon} />
      <Visto x={560} y={950} k={0.9} o={p('benigna')} />
      <Txt x={680} y={950} txt="benigna" t={24} p={p('benigna')} ancla="start" />
      <Sale p={p('color')} x={1200} y={950} k={0.14}><Higado corte={false} /></Sale>
      <Txt x={1290} y={950} txt="hígado de color normal" t={22} p={p('color')} ancla="start" fuerte={false} />
    </g>
  );
};

const Farmacos: Lamina = ({ p, reloj }) => {
  const sube = p('sube');
  return (
    <g>
      <Bandera x={800} y={80} txt="la puerta se puede bloquear" color="#C2307A" p={p('bloquear')} t={30} punta="no" />
      <Membrana y={460} o={tramo(p('bloquear'), 0, 0.4)} />
      <Poro x={800} y={460} k={1.5} tono={OATP} bombea={reloj} o={tramo(p('bloquear'), 0, 0.4)} />
      <Sale p={p('rifampicina')} x={800} y={lerp(240, 420, easeOut(p('rifampicina')))} k={1.1}><Pastilla r={90} /></Sale>
      <Txt x={1120} y={300} txt="rifampicina" t={30} p={p('rifampicina')} color={TXB.rosa} />
      <Cruz x={980} y={430} k={1} o={p('rifampicina')} />
      {/* El nivel en sangre sube. */}
      <g opacity={tramo(sube, 0, 0.3)}>
        <rect x={180} y={160} width={80} height={300} rx={40} fill="var(--vas-suave)" />
        <rect x={180} y={460 - 300 * (0.3 + 0.55 * easeOut(sube))} width={80} height={300 * (0.3 + 0.55 * easeOut(sube))} rx={40} fill={B.bilirrubina[1]} />
      </g>
      <Txt x={220} y={510} txt="sube" t={28} p={sube} color={TXB.ambar} />
      <Visto x={1300} y={720} k={1.1} o={p('sano')} />
      <Txt x={1300} y={790} txt="sin daño del hígado" t={26} p={p('sano')} />
      <Flujo camino={(u) => [lerp(200, 1400, u), 900 + Math.sin(u * 12) * 10]} reloj={reloj} n={8} tono={B.bilirrubina} o={p('transformar')} />
      <Bandera x={800} y={960} txt="ahora toca transformarla" color="#8A4FE0" p={p('transformar')} t={24} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Llegar, Cruzar, Chaperonas, IdaVuelta, Salto, Rotor, Farmacos];
export default LAMINAS;
