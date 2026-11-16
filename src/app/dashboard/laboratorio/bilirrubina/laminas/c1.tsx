'use client';
// Capítulo 1 · Del hemo a la bilirrubina (vistazo gratis)

import type { Lamina } from '../Lienzo';
import { Ave, B, PulmonesB, tijeretazo, Bandera, Bazo, Chip, CO, Enzima, Escudo, Flecha, Flota, Gota, Hematie, HematieRoto, Hierro, Higado, Macrofago, Medula, Moreton, Placenta, Radical, Sale, Tetrapirrol, Tijera, Txt, TXB, Vaso, Viaja, clamp, easeOut, hash, lerp, tramo } from '../Piezas';

/** Aro de porcentaje (el 80 % o el 20 %). */
function Aro({ x, y, R = 110, frac, p, color, txt }: { x: number; y: number; R?: number; frac: number; p: number; color: string; txt: string }) {
  if (p <= 0.002) return null;
  const a = easeOut(clamp(p)) * frac * Math.PI * 2;
  const fin = [x + Math.sin(a) * R, y - Math.cos(a) * R];
  return (
    <g opacity={tramo(p, 0, 0.3)}>
      <circle cx={x} cy={y} r={R} fill="none" stroke="var(--vas-suave)" strokeWidth={34} />
      <path d={`M${x},${y - R} A${R},${R} 0 ${a > Math.PI ? 1 : 0} 1 ${fin[0].toFixed(1)},${fin[1].toFixed(1)}`} fill="none" stroke={color} strokeWidth={34} strokeLinecap="round" />
      <text x={x} y={y} dy="0.35em" textAnchor="middle" style={{ fontSize: 50, fontWeight: 800, fill: 'var(--cit-texto)' }}>{txt}</text>
    </g>
  );
}

const Cuanta: Lamina = ({ p, reloj }) => {
  const mg = p('mg');
  const cifra = Math.round(lerp(0, 250, easeOut(mg)));
  // Un montón de bilirrubina que nunca para de llenarse.
  const n = Math.round(40 * clamp(mg));
  return (
    <g>
      <Bandera x={800} y={100} txt="¿cuánta fabricas cada día?" color="#C46A00" p={p('cuanta')} t={30} punta="no" />
      {Array.from({ length: n }, (_, i) => {
        const caida = ((reloj / 1600 + hash(i, 3)) % 1);
        const fila = Math.floor(i / 10), col = i % 10;
        return <circle key={i} cx={360 + col * 46 + (fila % 2) * 23} cy={lerp(240, 700 - fila * 40, Math.min(1, caida * 3))} r={20} fill={B.bilirrubina[i % 3 === 0 ? 0 : 1]} />;
      })}
      <Txt x={560} y={800} txt={`${cifra} a ${Math.round(lerp(0, 400, easeOut(mg)))} mg al día`} t={44} p={mg} color={TXB.ambar} />
      <Sale p={p('kilo')} x={1140} y={420} k={0.9}>
        <rect x={-120} y={-80} width={240} height={180} rx={36} fill="#3B2A7E" /><rect x={-120} y={-80} width={232} height={168} rx={34} fill="#6B4FD0" />
        <text dy="0.1em" textAnchor="middle" style={{ fontSize: 48, fontWeight: 800, fill: '#FFF' }}>≈ 4 mg</text>
        <text y={50} textAnchor="middle" style={{ fontSize: 26, fontWeight: 700, fill: '#E6DCFF' }}>por kilo</text>
      </Sale>
      <Sale p={p('hemo')} x={1140} y={760} k={0.55}><Tetrapirrol abre={0} fe={1} tono={B.hemo} vibra={reloj} /></Sale>
      <Txt x={1140} y={880} txt="casi toda sale del hemo" t={28} p={p('hemo')} color={TXB.hemo} />
    </g>
  );
};

const Ochenta: Lamina = ({ p, reloj }) => {
  const viejo = p('viejos');
  // Un hematíe viejo que viaja del vaso al macrófago del bazo, una y otra vez.
  const u = (reloj / 5200) % 1;
  return (
    <g>
      <Vaso x={800} y={190} largo={1900} ancho={200} ang={-4} reloj={reloj} flujo={14} pared={34} o={tramo(viejo, 0, 0.4)} />
      <Aro x={200} y={500} frac={0.8} p={p('ochenta')} color="#E3203F" txt="80 %" />
      <Txt x={200} y={660} txt="hematíes viejos" t={28} p={p('ochenta')} color={TXB.hemo} />
      <Txt x={800} y={340} txt="viven unos 120 días" t={30} p={p('dias')} />
      {viejo > 0.3 && <Hematie x={lerp(760, 470, easeOut(u))} y={lerp(250, 560, easeOut(u))} k={0.7 * (1 - 0.6 * tramo(u, 0.75, 1))} o={1 - tramo(u, 0.85, 1)} r={u * 200} />}
      <Sale p={p('bazo')} x={500} y={620} k={0.48}><Bazo corte={false} /></Sale>
      <Sale p={p('macrofago')} x={560} y={620} k={0.42}><Macrofago /></Sale>
      <Txt x={500} y={790} txt="bazo" t={30} p={p('bazo')} />
      <Txt x={560} y={840} txt="macrófagos que los atrapan" t={24} p={p('macrofago')} fuerte={false} />
      <Sale p={p('higado')} x={940} y={620} k={0.4}><Higado corte={false} /></Sale>
      <Txt x={940} y={790} txt="hígado" t={30} p={p('higado')} />
      <Txt x={940} y={835} txt="células de Kupffer" t={24} p={p('kupffer')} fuerte={false} />
      <Sale p={p('medula')} x={1340} y={620} k={0.42}><Medula /></Sale>
      <Txt x={1340} y={790} txt="médula ósea" t={30} p={p('medula')} />
    </g>
  );
};

const Veinte: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Aro x={200} y={300} R={90} frac={0.2} p={p('veinte')} color="#F07A1E" txt="20 %" />
      <Txt x={200} y={440} txt="otras proteínas con hemo" t={26} p={p('veinte')} />
      <Sale p={p('mioglobina')} x={560} y={300}>
        {Array.from({ length: 5 }, (_, i) => <rect key={i} x={-130} y={-80 + i * 34} width={260} height={26} rx={13} fill={i % 2 ? '#C2185B' : '#E8476A'} />)}
        <Tetrapirrol x={0} y={0} k={0.3} abre={0} fe={1} tono={B.hemo} vibra={reloj} />
      </Sale>
      <Txt x={560} y={440} txt="mioglobina del músculo" t={28} p={p('mioglobina')} />
      <Sale p={p('citocromos')} x={920} y={300}>
        <Flota x={0} y={0} rl={reloj} k={0.9}><Tetrapirrol k={0.45} abre={0} fe={1} tono={B.hemo} /></Flota>
      </Sale>
      <Chip x={920} y={410} txt="citocromos · P450" color="#8A2A9A" p={p('citocromos')} t={24} />
      <Sale p={p('catalasas')} x={1280} y={300}>
        <Flota x={0} y={0} rl={reloj} fase={1.4} k={0.9}><Tetrapirrol k={0.45} abre={0} fe={1} tono={B.hemo} /></Flota>
      </Sale>
      <Chip x={1280} y={410} txt="catalasas" color="#C46A00" p={p('catalasas')} t={24} />
      <Sale p={p('medula')} x={800} y={720} k={0.85}>
        <Medula w={860} h={300} />
        {[-220, -60, 110, 260].map((dx, i) => {
          const q = tramo(p('ineficaz'), i * 0.15, 0.5 + i * 0.15);
          return q < 1 ? <Hematie key={i} x={dx} y={Math.sin(reloj / 500 + i) * 14} k={0.55} o={1 - q} /> : null;
        })}
        {[-220, -60, 110, 260].map((dx, i) => <HematieRoto key={`r${i}`} x={dx} y={Math.sin(reloj / 500 + i) * 14} k={0.55} p={tramo(p('ineficaz'), i * 0.15, 0.5 + i * 0.15)} />)}
      </Sale>
      <Bandera x={800} y={920} txt="eritropoyesis ineficaz: mueren sin salir de la médula" color="#B5480A" p={p('ineficaz')} t={24} punta="no" />
    </g>
  );
};

/** Hemoglobina: cuatro globinas (bolas rojas) con su hemo; `desarma` las separa. */
function Hemoglobina({ desarma, reloj }: { desarma: number; reloj: number }) {
  const d = easeOut(clamp(desarma)) * 70;
  return (
    <g>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => (
        <g key={i} transform={`translate(${sx * (40 + d)},${sy * (40 + d) + Math.sin(reloj / 400 + i) * 3})`}>
          <circle r={50} fill="#9E0B2E" /><circle cx={-4} cy={-4} r={44} fill="#E3203F" /><circle cx={-18} cy={-20} r={9} fill="#FFF" opacity={0.85} />
        </g>
      ))}
    </g>
  );
}

const Desarmar: Lamina = ({ p, reloj }) => {
  const des = p('desarma');
  return (
    <g>
      <Sale p={p('macrofago')} x={800} y={500} k={2.3}><Macrofago /></Sale>
      <Bandera x={800} y={90} txt="primera estación: el macrófago" color="#D7263D" p={p('macrofago')} t={28} punta="no" />
      <Sale p={p('macrofago') * (1 - tramo(p('globina'), 0.3, 1))} x={800} y={480} k={0.85}><Hemoglobina desarma={des} reloj={reloj} /></Sale>
      <Viaja a={[760, 460]} b={[330, 760]} q={p('globina')}>
        {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={i * 30 - 90} cy={Math.sin(reloj / 300 + i) * 10} r={13} fill={['#E3203F', '#F07A1E', '#FFB21E', '#2FC45A', '#2E78F2', '#8A5AF0', '#F25CA8'][i]} />)}
      </Viaja>
      <Txt x={330} y={860} txt="globina → aminoácidos" t={28} p={p('aminoacidos')} />
      <Viaja a={[820, 460]} b={[1260, 760]} q={p('hierro')}>
        <g transform={`rotate(${(reloj / 10) % 360})`}><path d="M-60,0 A60,60 0 1 1 0,60" fill="none" stroke="#F07A1E" strokeWidth={9} strokeLinecap="round" opacity={p('recicla')} /></g>
        <Hierro k={1.3} />
      </Viaja>
      <Txt x={1260} y={860} txt="hierro → se recicla" t={28} p={p('recicla')} color={TXB.ambar} />
      <Sale p={p('anillo')} x={800} y={500} k={0.75}><Tetrapirrol abre={0} fe={0} tono={B.hemo} vibra={reloj} /></Sale>
      <Bandera x={800} y={700} txt="queda el anillo de hemo" color="#9E0B2E" p={p('anillo')} t={26} punta="no" />
    </g>
  );
};

/** El tetrapirrol que pasa de un color a otro: dos capas fundidas. */
function Cambia({ x, y, k, abre, de, a, q, reloj, plegada = 0 }: { x: number; y: number; k: number; abre: number; de: readonly string[]; a: readonly string[]; q: number; reloj: number; plegada?: number }) {
  return (
    <g>
      <Tetrapirrol x={x} y={y} k={k} abre={abre} tono={de} o={1 - q} vibra={reloj} plegada={plegada} />
      <Tetrapirrol x={x} y={y} k={k} abre={abre} tono={a} o={q} vibra={reloj} plegada={plegada} />
    </g>
  );
}

const LaTijera: Lamina = ({ p, reloj }) => {
  const corta = p('corta'), verde = p('biliverdina');
  return (
    <g>
      <Bandera x={800} y={90} txt="hemo oxigenasa: la tijera" color="#0C9E9A" p={p('tijera')} t={30} punta="no" />
      <rect x={180} y={560} width={1240} height={90} rx={45} fill={B.re[1]} opacity={0.22 * p('reticulo')} />
      <Txt x={300} y={605} txt="retículo endoplasmático" t={22} p={p('reticulo')} color={TXB.violeta} fuerte={false} />
      <Sale p={Math.max(p('tijera'), 0.001)} x={800} y={420} k={1}>
        <Cambia x={0} y={0} k={1} abre={corta} de={B.hemo} a={B.biliverdina} q={verde} reloj={reloj} />
      </Sale>
      {!(p('hierro') > 0) && <Hierro x={800} y={420} k={0.95} o={p('tijera')} />}
      <Viaja a={[800, 420]} b={[1250, 330]} q={p('hierro')}><Hierro k={1.1} /></Viaja>
      <Txt x={1250} y={410} txt="hierro" t={28} p={p('hierro')} color={TXB.ambar} />
      <Sale p={p('tijera')} x={800 - 130} y={300 - 30 * (1 - corta)} k={1.3}><Tijera r={20} corta={corta < 0.99 ? tijeretazo(reloj, 1100) : 1} color="#0C9E9A" /></Sale>
      <Viaja a={[180, 250]} b={[470, 340]} q={p('oxigeno')}><Chip x={0} y={0} txt="O₂" color="#B0123A" t={30} /></Viaja>
      <Viaja a={[180, 360]} b={[470, 430]} q={p('nadph')}><Chip x={0} y={0} txt="NADPH" color="#5A2DB0" t={26} /></Viaja>
      {[0, 1, 2].map((i) => {
        const u = (reloj / 2600 + i / 3) % 1;
        return p('co') > 0.02 ? <CO key={i} x={1000 + Math.sin(u * 6 + i) * 40} y={lerp(380, 140, u)} k={1.3} o={p('co') * (1 - u)} r={u * 90} /> : null;
      })}
      <Txt x={1230} y={170} txt="monóxido de carbono" t={26} p={p('co')} />
      <Txt x={800} y={690} txt="biliverdina, verde" t={30} p={verde} color={TXB.verde} />
      <Chip x={620} y={760} txt="HO-1: se induce con el estrés" color="#C2185B" p={p('versiones')} t={24} />
      <Chip x={1000} y={830} txt="HO-2: trabaja siempre" color="#2E78F2" p={tramo(p('versiones'), 0.3, 1)} t={24} />
    </g>
  );
};

const FabricaCO: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Bandera x={800} y={90} txt="la única fábrica de CO conocida" color="#3A3F58" p={p('unica')} t={30} punta="no" />
      <Sale p={p('co')} x={330} y={480} k={0.75}><Tetrapirrol abre={1} tono={B.biliverdina} vibra={reloj} /></Sale>
      <Txt x={330} y={600} txt="del hemo que se abre…" t={26} p={p('co')} fuerte={false} />
      {Array.from({ length: 7 }, (_, i) => {
        const u = (reloj / 3400 + i / 7) % 1;
        return <CO key={i} x={lerp(420, 1080, u)} y={480 + Math.sin(u * 9 + i) * 50} k={0.95} o={p('co') * tramo(Math.min(u, 1 - u), 0, 0.1)} r={u * 180} />;
      })}
      <Sale p={p('exhalas')} x={1230} y={500} k={0.95}><PulmonesB reloj={reloj} /></Sale>
      {/* El CO sale por la tráquea con cada espiración. */}
      {p('exhalas') > 0.05 && Array.from({ length: 4 }, (_, i) => {
        const u = (reloj / 2600 + i / 4) % 1;
        return <CO key={`x${i}`} x={1230 + Math.sin(u * 7 + i) * 24} y={lerp(300, 120, u)} k={0.8} r={u * 140} o={p('exhalas') * tramo(Math.min(u, 1 - u), 0, 0.12)} />;
      })}
      <Txt x={1450} y={210} txt="lo exhalas" t={30} p={p('exhalas')} />
      <Txt x={800} y={800} txt="en el recién nacido, el CO exhalado estima cuánto hemo se rompe" t={28} p={p('recien')} />
      <Bandera x={800} y={880} txt="es decir: cuánta hemólisis hay" color="#C2185B" p={p('hemolisis')} t={26} punta="no" />
    </g>
  );
};

const Reductasa: Lamina = ({ p, reloj }) => {
  const q = p('bilirrubina');
  return (
    <g>
      <Bandera x={800} y={90} txt="biliverdina reductasa" color="#8A5AF0" p={p('reductasa')} t={30} punta="no" />
      <Sale p={Math.max(p('reductasa'), 0.001)} x={560} y={430} k={0.95}>
        <Cambia x={0} y={0} k={1} abre={1} de={B.biliverdina} a={B.bilirrubina} q={q} reloj={reloj} plegada={0.3 * q} />
      </Sale>
      <Sale p={p('reductasa')} x={560} y={250} k={2.4}><Enzima tono={B.re as unknown as string[]} abre={0.4 + Math.sin(reloj / 300) * 0.3} r={90} /></Sale>
      <Viaja a={[200, 250]} b={[460, 300]} q={p('nadph')}><Chip x={0} y={0} txt="NADPH" color="#5A2DB0" t={24} /></Viaja>
      <Txt x={560} y={600} txt={q > 0.5 ? 'bilirrubina, amarilla' : 'biliverdina, verde'} t={32} p={p('reductasa')} color={q > 0.5 ? TXB.ambar : TXB.verde} />
      <Flecha a={[760, 430]} b={[960, 430]} p={p('moreton')} color="var(--cit-flecha)" w={8} />
      <Sale p={p('moreton')} x={1220} y={430} k={0.6}><Moreton fase={1 + tramo(p('moreton'), 0.2, 1)} reloj={reloj} /></Sale>
      <Txt x={1220} y={620} txt="lo mismo que en un moretón" t={28} p={p('moreton')} />
      <Txt x={800} y={820} txt="de verde, a amarillo" t={34} p={p('amarillo')} color={TXB.ambar} />
    </g>
  );
};

const PorQue: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Bandera x={800} y={90} txt="¿por qué tomarse la molestia?" color="#6D3FD8" p={p('pregunta')} t={30} punta="no" />
      <Sale p={p('soluble')} x={260} y={330} k={0.45}><Tetrapirrol abre={1} tono={B.biliverdina} vibra={reloj} /></Sale>
      {[0, 1, 2].map((i) => <Gota key={i} x={190 + i * 70} y={460 + Math.sin(reloj / 500 + i) * 8} k={0.32} tono={['#1E7FD0', '#3FB4E0', '#BFE9FF']} o={p('soluble')} />)}
      <Txt x={260} y={560} txt="la biliverdina ya es soluble" t={26} p={p('soluble')} />
      <Sale p={p('aves')} x={620} y={360} k={1}><Ave reloj={reloj} /></Sale>
      <Txt x={620} y={560} txt="aves y anfibios la eliminan tal cual" t={24} p={p('aves')} fuerte={false} />
      <Txt x={800} y={650} txt="hay dos hipótesis" t={30} p={p('hipotesis')} />
      <Flota x={1030} y={330} rl={reloj} k={0.85} o={tramo(p('antiox'), 0, 0.4)}><Escudo /></Flota>
      {[0, 1].map((i) => <Radical key={i} x={930 + Math.sin(reloj / 400 + i * 2) * 20} y={250 + i * 140} k={0.7} o={p('antiox') * 0.8} reloj={reloj} fase={i} />)}
      <Txt x={1030} y={520} txt="1 · antioxidante potente" t={26} p={p('antiox')} />
      <Sale p={p('placenta')} x={1360} y={340} k={1}><Placenta reloj={reloj} /></Sale>
      <Txt x={1360} y={520} txt="2 · cruza la placenta" t={26} p={p('placenta')} />
      <Txt x={1360} y={560} txt="y la elimina la madre" t={22} p={p('madre')} fuerte={false} />
      <Sale p={p('viajar')} x={800} y={820} k={0.55}><Tetrapirrol abre={1} plegada={0.6} tono={B.bilirrubina} vibra={reloj} /></Sale>
      <Bandera x={800} y={940} txt="la bilirrubina, lista para viajar" color="#C46A00" p={p('viajar')} t={26} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Cuanta, Ochenta, Veinte, Desarmar, LaTijera, FabricaCO, Reductasa, PorQue];
export default LAMINAS;
