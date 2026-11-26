'use client';
// Capítulo 4 · Cómo se lesiona: patrones
//
// Cuadros de histología «vistos por el ocular» (referencia «E. coli bajo el microscopio»: luz crema, viñeteado y grano), cuatro estados de la
// célula en medallones de aro naranja (referencia «cuatro órganos»), la regla de grado y estadio con la tabla de estadios de la referencia
// «esquematización de la enfermedad» y un hígado que no alcanza. Las células respiran, los linfocitos se arrastran, la bilis gotea.

import type { Lamina } from '../Lienzo';
import { Busto, Etiqueta, Flecha, Globo, Higado, Levita, Linfo, Llama, Medallon, Nota, Reloj, Sale, Sombra, TXH, Toro, Txt, H, clamp, easeOut, hash, lerp, onda, tramo } from '../Piezas';
import { Colageno, Hepatocito, Kupffer, Lobulillo, Triada } from '../Higado';
import { BarraLab, Estadios, Ocular } from '../Clinica';

type P2 = [number, number];

/** El cilindro de tejido de una biopsia y la aguja que lo saca. `p` 0-1: la aguja entra y el cilindro aparece. */
function Biopsia({ x, y, k = 1, p = 1 }: { x: number; y: number; k?: number; p?: number }) {
  const q = easeOut(clamp(p));
  if (p <= 0.003) return null;
  return (
    <g transform={`translate(${x},${y}) rotate(-24) scale(${k})`} opacity={tramo(p, 0, 0.3)}>
      <rect x={-26} y={-138} width={68} height={300} rx={34} fill="#000" opacity={0.16} />
      <rect x={-34} y={-150} width={68} height={300} rx={34} fill="#C9456B" />
      <rect x={-30} y={-146} width={60} height={292} rx={30} fill="#F29AB4" />
      <rect x={-21} y={-128} width={10} height={250} rx={5} fill="#FFF" opacity={0.45} />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-12 + (i % 3) * 13} cy={-104 + i * 25} r={7} fill="#7A3FB0" opacity={0.85} />)}
      <g transform={`translate(0,${(-(1 - q) * 150).toFixed(1)})`}>
        <rect x={-12} y={-340} width={24} height={196} rx={6} fill="#8A97AD" />
        <rect x={-9} y={-336} width={7} height={188} rx={3} fill="#E6EDF7" opacity={0.85} />
        <rect x={-24} y={-364} width={48} height={32} rx={11} fill="#4A5C7C" />
      </g>
    </g>
  );
}

// ─── 0 · Los ladrillos de la lesión ─────────────────────────────────────────
const Ladrillos: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), balon = p('balon'), apop = p('apop'), councilman = p('councilman'), necrosis = p('necrosis'), inflamacion = p('inflamacion'), regeneracion = p('regeneracion'), fibrosis = p('fibrosis'), ladrillos = p('ladrillos');
  const X = [290, 640, 990, 1340], R = 150, Y = 390;
  const sep = 56 * easeOut(regeneracion);
  return (
    <g>
      <Globo x={800} y={110} txt="¿de qué maneras puede enfermar un hepatocito?" t={36} p={pregunta} colaX={0} />
      <Sale p={balon} x={X[0]} y={Y}>
        <Medallon x={0} y={0} R={R} id="hv-m0" fondo="#FFE3EE" aro="#F2A33A"><Hepatocito x={0} y={0} k={1.2} reloj={reloj} balon={easeOut(balon)} sem={3} /></Medallon>
      </Sale>
      <Sale p={apop} x={X[1]} y={Y}>
        <Medallon x={0} y={0} R={R} id="hv-m1" fondo="#FFE3EE" aro="#F2A33A"><Hepatocito x={0} y={0} k={1.4} reloj={reloj} apop={easeOut(apop)} sem={4} /></Medallon>
      </Sale>
      {/* necrosis: la célula se hincha, su membrana se rompe y suelta el contenido */}
      <Sale p={necrosis} x={X[2]} y={Y}>
        <Medallon x={0} y={0} R={R} id="hv-m2" fondo="#FFE3EE" aro="#F2A33A">
          <g opacity={1 - 0.45 * tramo(necrosis, 0.5, 1)}>
            <Hepatocito x={0} y={0} k={1.2} reloj={reloj} balon={1} vidrio={0.6} sem={5} />
            <circle r={116} fill="none" stroke="#FFF" strokeWidth={8} strokeDasharray="10 18" strokeLinecap="round" opacity={0.9} />
          </g>
          {Array.from({ length: 14 }, (_, i) => {
            const a = hash(i, 8) * 6.28, d = lerp(40, 138, tramo(necrosis, 0.3, 1)) * (0.6 + hash(i, 9) * 0.6) + 4 * Math.sin(reloj / 500 + i);
            return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={5 + hash(i, 10) * 5} fill={i % 2 ? '#E3203F' : '#F5A0A6'} opacity={tramo(necrosis, 0.3, 0.7)} />;
          })}
        </Medallon>
      </Sale>
      <Sale p={inflamacion} x={X[3]} y={Y}>
        <Medallon x={0} y={0} R={R} id="hv-m3" fondo="#FFE3EE" aro="#F2A33A">
          <Linfo x={-46} y={-24} k={0.66} reloj={reloj} activo={0.5} /><Linfo x={50} y={34} k={0.56} reloj={reloj} fase={2} activo={0.5} /><Linfo x={34} y={-58} k={0.46} reloj={reloj} fase={4} />
        </Medallon>
      </Sale>
      <Etiqueta x={X[0]} y={600} txt="balonización" color="#E04AB0" p={balon} t={26} punta="arriba" />
      <Etiqueta x={X[1]} y={600} txt="apoptosis" color="#B8237A" p={apop} t={26} punta="arriba" />
      <Etiqueta x={X[1]} y={662} txt="cuerpo de Councilman" color="#8A3FD8" p={councilman} t={24} punta="no" />
      <Etiqueta x={X[2]} y={600} txt="necrosis" color="#E5324C" p={necrosis} t={26} punta="arriba" />
      <Etiqueta x={X[3]} y={600} txt="inflamación" color="#10B5A8" p={inflamacion} t={26} punta="arriba" />
      {/* lo que llega después: regeneración (la célula se divide) y fibrosis */}
      <Sale p={regeneracion} x={640} y={800}>
        <Hepatocito x={-sep} y={0} k={0.6} reloj={reloj} sem={6} /><Hepatocito x={sep} y={0} k={0.6} reloj={reloj} sem={7} fase={1} />
      </Sale>
      <Etiqueta x={640} y={896} txt="regeneración" color="#2FA84F" p={regeneracion} t={26} punta="arriba" />
      <Colageno x={990} y={800} w={300} h={64} n={4} p={fibrosis} reloj={reloj} />
      <Etiqueta x={990} y={896} txt="fibrosis" color="#1F6FB0" p={fibrosis} t={26} punta="arriba" />
      <Txt x={800} y={968} txt="todo cuadro hepático se arma con estos ladrillos" t={28} p={ladrillos} />
    </g>
  );
};

// ─── 1 · Hepatitis aguda: la lesión lobulillar ──────────────────────────────
const Aguda: Lamina = ({ p, reloj }) => {
  const aguda = p('aguda'), lobulillo = p('lobulillo'), desordenan = p('desordenan'), hinchan = p('hinchan'), councilman = p('councilman'), kupffer = p('kupffer'), caos = p('caos'), trans = p('transaminasas');
  const celdas = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * 6.28 + hash(i, 2), d = 70 + hash(i, 3) * 190;
    return { x: 500 + Math.cos(a) * d * 1.05, y: 500 + Math.sin(a) * d * 0.9, i };
  });
  return (
    <g>
      <Ocular x={500} y={500} R={330} id="hv-o1" reloj={reloj} o={tramo(aguda, 0, 0.4)}>
        <g opacity={tramo(lobulillo, 0, 0.4)}>
          {celdas.map(({ x, y, i }) => (
            <Hepatocito key={i} x={x + 14 * desordenan * Math.sin(i * 2.3)} y={y + 14 * desordenan * Math.cos(i * 1.7)} k={0.46} r={desordenan * ((i * 37) % 60 - 30)} reloj={reloj} fase={i} sem={i + 1}
              balon={i % 3 === 0 ? hinchan : 0} apop={i === 4 || i === 11 ? councilman : 0} />
          ))}
          <circle cx={500} cy={500} r={34} fill="#3A1470" opacity={0.9} /><circle cx={500} cy={500} r={26} fill="#7A55D8" /><circle cx={500} cy={500} r={14} fill="#3A1470" />
          {[[370, 380], [640, 620], [580, 360]].map(([kx, ky], i) => <Kupffer key={i} x={kx} y={ky} k={0.42 * tramo(kupffer, i * 0.2, i * 0.2 + 0.5)} reloj={reloj} fase={i * 2} />)}
        </g>
      </Ocular>
      <Etiqueta x={500} y={925} txt="el daño no tiene lugar fijo" color="#B23A5E" p={aguda} t={28} punta="no" />
      <Nota x={1150} y={250} txt="trabéculas desordenadas" p={desordenan} />
      <Nota x={1150} y={345} txt="células hinchadas" p={hinchan} />
      <Nota x={1150} y={440} txt="cuerpos de Councilman" p={councilman} color={TXH.d} />
      <Nota x={1150} y={535} txt="células de Kupffer proliferan" p={kupffer} color={TXH.kupffer} />
      <Etiqueta x={1150} y={700} txt="caos hepatocelular" color="#E5324C" p={caos} t={32} punta="no" />
      <BarraLab x={1450} y={900} w={120} alto={500} val={1450} max={1600} norm={40} color="#F2848C" oscuro="#B83A52" p={trans} nombre="ALT" valor="por las nubes" t={26} />
    </g>
  );
};

// ─── 2 · Necrosis confluente y en puente ────────────────────────────────────
const Puente: Lamina = ({ p, reloj }) => {
  const necrosis = p('necrosis'), confluente = p('confluente'), zona3 = p('zona3'), puente = p('puente'), gravedad = p('gravedad'), masiva = p('masiva'), estructura = p('estructura');
  const R = 300;
  const V: P2[] = Array.from({ length: 6 }, (_, i) => [Math.cos((i / 6) * Math.PI * 2 - Math.PI / 2) * R, Math.sin((i / 6) * Math.PI * 2 - Math.PI / 2) * R]);
  return (
    <g>
      <Lobulillo x={640} y={520} R={R} id="hv-l4" reloj={reloj} flujo={0} o={tramo(necrosis, 0, 0.4)} />
      <g transform="translate(640,520)">
        <circle r={120 * easeOut(confluente)} fill="#2A0A24" opacity={0.78 * tramo(confluente, 0, 0.5)} />
        <path d={`M0,0 L${V[1][0] * 0.95},${V[1][1] * 0.95}`} stroke="#2A0A24" strokeWidth={92} strokeLinecap="round" opacity={0.78 * tramo(puente, 0, 0.5)} strokeDasharray={`${(380 * easeOut(clamp(puente))).toFixed(0)} 900`} />
        <path d={`M${V.map(([a, b]) => `${a},${b}`).join(' L')} Z`} fill="#2A0A24" opacity={0.74 * tramo(masiva, 0, 0.8)} />
        <circle r={26} fill="#7A55D8" /><circle r={14} fill="#3A1470" />
      </g>
      <Etiqueta x={640} y={890} txt="necrosis confluente · zona 3" color="#B21E58" p={zona3} t={28} punta="no" />
      <Etiqueta x={1210} y={280} txt="en puente: un signo de gravedad" color="#E5324C" p={gravedad} t={28} punta="no" />
      <Flecha a={[1100, 320]} b={[860, 420]} c={[1000, 360]} p={tramo(puente, 0.3, 1)} color="#E5324C" w={7} />
      <Etiqueta x={1210} y={520} txt="masiva: casi todo el lobulillo" color="#7A1230" p={masiva} t={28} punta="no" />
      <Sale p={gravedad} x={1260} y={720} k={1.1}><circle r={38} fill="#A81830" /><circle cx={-2} cy={-2} r={32} fill="#E5324C" /><rect x={-5} y={-20} width={10} height={22} rx={5} fill="#FFF" /><circle cy={14} r={5.6} fill="#FFF" /></Sale>
      <Txt x={1210} y={820} txt="el hígado pierde su estructura" t={30} p={estructura} color={TXH.sangre} />
    </g>
  );
};

// ─── 3 · La bilis atrapada ──────────────────────────────────────────────────
const Colestasis: Lamina = ({ p, reloj }) => {
  const ictericia = p('ictericia'), microscopio = p('microscopio'), colestasis = p('colestasis'), bilis = p('bilis'), tapones = p('tapones'), zona3 = p('zona3'), citocinas = p('citocinas'), transportadores = p('transportadores'), hinchados = p('hinchados'), atrapada = p('atrapada');
  return (
    <g>
      <Sombra><Sale p={ictericia} x={1440} y={250} k={0.5}><Busto quien="p1" reloj={reloj} ictericia={easeOut(ictericia)} dolor={0.3} sonrisa={-0.4} /></Sale></Sombra>
      <Ocular x={500} y={440} R={290} id="hv-o3" reloj={reloj} o={tramo(microscopio, 0, 0.4)}>
        {[[400, 350], [600, 350], [400, 540], [600, 540], [500, 445]].map(([cx, cy], i) => <Hepatocito key={i} x={cx} y={cy} k={0.5 + 0.12 * hinchados} reloj={reloj} fase={i} sem={i + 2} balon={hinchados} />)}
        {[[500, 350], [500, 540], [400, 445], [600, 445]].map(([cx, cy], i) => (
          <g key={i} opacity={tramo(tapones, i * 0.1, i * 0.1 + 0.4)}>
            <ellipse cx={cx} cy={cy} rx={9 * (1 - 0.4 * hinchados)} ry={40} fill={H.bilis[0]} transform={`rotate(${i > 1 ? 90 : 0} ${cx} ${cy})`} /><ellipse cx={cx} cy={cy} rx={6} ry={32} fill={H.bilis[1]} transform={`rotate(${i > 1 ? 90 : 0} ${cx} ${cy})`} />
          </g>
        ))}
        {[[410, 360], [590, 360], [410, 530], [580, 540]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy + 3 * Math.sin(reloj / 600 + i)} r={11 * bilis} fill={H.bilis[1]} opacity={0.85 * bilis} />)}
      </Ocular>
      <Etiqueta x={500} y={800} txt="colestasis" color="#9AAE22" p={colestasis} t={30} punta="no" />
      <Nota x={500} y={868} txt="sobre todo en la zona 3" p={zona3} />
      {/* las citocinas apagan los transportadores */}
      <g opacity={tramo(citocinas, 0, 0.4)}>
        {Array.from({ length: 5 }, (_, i) => {
          const u = ((reloj / 2200 + i / 5) % 1);
          return <g key={i} transform={`translate(${lerp(1260, 900, u)},${420 + i * 34 + 6 * Math.sin(u * 9)})`} opacity={Math.sin(u * Math.PI)}>
            {[0, 72, 144, 216, 288].map((a) => <line key={a} x1={0} y1={0} x2={15} y2={0} stroke="#C2540A" strokeWidth={4} strokeLinecap="round" transform={`rotate(${a})`} />)}
            <circle r={9} fill="#FF8A1E" />
          </g>;
        })}
      </g>
      <Txt x={1080} y={380} txt="citocinas (TNF-α)" t={26} p={citocinas} color={TXH.kupffer} />
      <Sale p={transportadores} x={1090} y={600} k={0.95}><Toro reloj={reloj} tapon={transportadores} tallo={50} tono={H.nk} /></Sale>
      <Nota x={1090} y={712} txt="transportadores apagados" p={transportadores} />
      <Etiqueta x={1190} y={790} txt="hepatocitos hinchados aprietan el canalículo" color="#E04AB0" p={hinchados} t={24} punta="no" />
      <Etiqueta x={1190} y={880} txt="la bilis no sale: se queda atrapada" color="#9AAE22" p={atrapada} t={28} punta="no" />
    </g>
  );
};

// ─── 4 · Hepatitis crónica: del lobulillo al espacio porta ──────────────────
const Cronica: Lamina = ({ p, reloj }) => {
  const cronica = p('cronica'), inflamacion = p('inflamacion'), linfocitos = p('linfocitos'), interfase = p('interfase'), tabiques = p('tabiques'), cicatriz = p('cicatriz'), cambio = p('cambio');
  return (
    <g>
      <Lobulillo x={290} y={400} R={190} id="hv-l5" reloj={reloj} o={tramo(cronica, 0, 0.4)} />
      <Etiqueta x={290} y={650} txt="aguda: todo el lobulillo" color="#B23A5E" p={cronica} t={26} punta="arriba" />
      <Flecha a={[520, 400]} b={[700, 400]} p={tramo(inflamacion, 0, 0.8)} color="var(--cit-flecha)" w={9} />
      {/* el espacio porta, lleno de linfocitos */}
      <Levita x={1030} y={400} reloj={reloj} k={1.7} p={inflamacion} suelo={190} ancho={300} fase={0.5}><Triada reloj={reloj} /></Levita>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * 6.28 + 0.3, q = tramo(linfocitos, i / 14, i / 14 + 0.3);
        return <Linfo key={i} x={1030 + Math.cos(a) * 250 + 8 * Math.sin(reloj / 700 + i)} y={400 + Math.sin(a) * 200 + 8 * Math.cos(reloj / 800 + i)} k={0.32 * q} o={q} reloj={reloj} fase={i} activo={0.3} receptores={5} />;
      })}
      <Nota x={1030} y={130} txt="inflamación en el espacio porta" p={inflamacion} color={TXH.cd8} />
      <Etiqueta x={1030} y={650} txt="hepatitis de interfase" color="#B8237A" p={interfase} t={26} punta="arriba" />
      {/* dos espacios porta unidos por un tabique de fibrosis */}
      <Triada x={420} y={850} k={0.62} reloj={reloj} o={tramo(tabiques, 0, 0.3)} />
      <Triada x={1180} y={850} k={0.62} reloj={reloj} o={tramo(tabiques, 0, 0.3)} />
      <Colageno x={800} y={850} w={560} h={46} n={5} p={tabiques} reloj={reloj} />
      <Nota x={800} y={775} txt="tabiques de fibrosis que unen espacios porta" p={tabiques} />
      <Etiqueta x={1390} y={850} txt="una cicatriz por dentro" color="#1F6FB0" p={cicatriz} t={26} punta="no" />
      <Txt x={800} y={968} txt="del lobulillo al espacio porta" t={32} p={cambio} color={TXH.hep} />
    </g>
  );
};

// ─── 5 · La hepatitis de interfase, paso a paso ─────────────────────────────
const Interfase: Lamina = ({ p, reloj }) => {
  const camara = p('camara'), cruzan = p('cruzan'), pegan = p('pegan'), destruyen = p('destruyen'), mordido = p('mordido'), sacabocados = p('sacabocados'), colageno = p('colageno'), crece = p('crece'), fibrosis = p('fibrosis');
  const ys = [250, 360, 470, 580, 690, 800];
  return (
    <g>
      <Levita x={290} y={520} reloj={reloj} k={1.9} p={camara} suelo={190} ancho={260} fase={0.3}><Triada reloj={reloj} /></Levita>
      {/* la placa limitante: una columna de hepatocitos; los atacados se encogen y quedan mordidos */}
      {ys.map((yy, i) => {
        const ataca = i === 1 || i === 3 || i === 4 ? 1 : 0;
        return <Hepatocito key={i} x={770 + 20 * Math.sin(i * 1.2)} y={yy} k={0.8} reloj={reloj} fase={i} sem={i + 1} apop={ataca * destruyen} o={1 - 0.4 * tramo(mordido, 0.4, 1) * ataca} />;
      })}
      <Etiqueta x={800} y={150} txt="placa limitante" color="#E0707A" p={camara} t={28} punta="abajo" />
      {/* el borde mordido (se pinta antes que los linfocitos para no taparlos) */}
      {[360, 580, 690].map((by, i) => <circle key={i} cx={718} cy={by} r={34 * tramo(mordido, i * 0.2, i * 0.2 + 0.5)} fill="#FFE6EE" opacity={0.95} />)}
      {/* los linfocitos cruzan, se pegan y destruyen */}
      {[0, 1, 2].map((i) => {
        const yy = [360, 580, 690][i], q = tramo(cruzan, i * 0.15, i * 0.15 + 0.6);
        return <Linfo key={i} x={lerp(500, 660 + 14 * pegan, easeOut(q))} y={yy + 14 * Math.sin(reloj / 400 + i)} k={0.5 * Math.min(1, q * 3)} o={tramo(cruzan, i * 0.15, i * 0.15 + 0.3)} reloj={reloj} fase={i * 2} activo={0.4 + 0.5 * destruyen} />;
      })}
      <Nota x={500} y={110} txt="cruzan la placa" p={cruzan} color={TXH.cd8} />
      <Nota x={520} y={930} txt="se pegan a los hepatocitos periportales" p={pegan} />
      <Etiqueta x={1190} y={400} txt="necrosis en sacabocados" color="#B8237A" p={sacabocados} t={28} punta="izq" />
      <Colageno x={930} y={520} w={160} h={560} n={7} p={colageno} reloj={reloj} sem={2} o={0.9} />
      <Etiqueta x={1260} y={560} txt="el colágeno rellena el hueco" color="#1F6FB0" p={colageno} t={26} punta="no" />
      <Flecha a={[1020, 690]} b={[1200, 690]} p={tramo(crece, 0, 0.8)} color="#1F6FB0" w={8} />
      <Txt x={1290} y={760} txt="el espacio porta crece" t={28} p={crece} color={TXH.colageno} />
      <Etiqueta x={1260} y={900} txt="así empieza la fibrosis crónica" color="#1F6FB0" p={fibrosis} t={28} punta="no" />
    </g>
  );
};

// ─── 6 · Grado y estadio ────────────────────────────────────────────────────
const GradoEstadio: Lamina = ({ p, reloj }) => {
  const biopsia = p('biopsia'), ejes = p('ejes'), grado = p('grado'), estadio = p('estadio'), f0 = p('f0'), f4 = p('f4'), otras = p('otras'), esteato = p('esteato'), autoinmune = p('autoinmune'), depositos = p('depositos'), guerra = p('guerra'), cicatriz = p('cicatriz');
  const activo = 4 * easeOut(clamp(f0));
  return (
    <g>
      <Etiqueta x={800} y={100} txt="biopsia" color="#E04AB0" p={biopsia} t={32} punta="no" />
      <Biopsia x={800} y={440} k={0.8} p={biopsia} />
      <Flecha a={[740, 260]} b={[470, 280]} c={[600, 240]} p={tramo(ejes, 0, 0.8)} color="var(--cit-flecha)" w={6} />
      <Flecha a={[860, 260]} b={[1130, 280]} c={[1000, 240]} p={tramo(ejes, 0, 0.8)} color="var(--cit-flecha)" w={6} />
      {/* grado: la actividad, en llamas que se mecen */}
      <Txt x={340} y={300} txt="GRADO" t={44} p={grado} color={TXH.kupffer} />
      <Txt x={340} y={352} txt="cuánta actividad necroinflamatoria" t={24} p={grado} fuerte={false} />
      {[0, 1, 2, 3].map((i) => (
        <Sale key={i} p={tramo(grado, i * 0.2, i * 0.2 + 0.5)} x={140 + i * 130} y={560}>
          <g transform={`scale(${(0.7 + i * 0.28).toFixed(2)},${((0.7 + i * 0.28) * (1 + 0.05 * Math.sin(reloj / 130 + i * 1.7))).toFixed(3)}) translate(0,${-i * 4})`}><Llama /></g>
          <text y={150} textAnchor="middle" style={{ fontSize: 28, fontWeight: 800, fill: 'var(--cit-texto)' }}>A{i}</text>
        </Sale>
      ))}
      <Txt x={340} y={790} txt="el grado cuenta la guerra" t={28} p={guerra} color={TXH.kupffer} />
      {/* estadio: la fibrosis, de F0 (abajo) a F4 (arriba) */}
      <Txt x={1260} y={300} txt="ESTADIO" t={44} p={estadio} color={TXH.colageno} />
      <Txt x={1260} y={352} txt="cuánta fibrosis" t={24} p={estadio} fuerte={false} />
      <Estadios x={1260} y={600} niveles={['F0', 'F1', 'F2', 'F3', 'F4']} activo={activo} p={estadio} t={30} />
      <Etiqueta x={1480} y={455} txt="F4 = cirrosis" color="#8C1E40" p={f4} t={26} punta="izq" />
      <Txt x={1260} y={810} txt="el estadio, la cicatriz" t={28} p={cicatriz} color={TXH.colageno} />
      {/* lo que la biopsia también excluye */}
      <Etiqueta x={800} y={780} txt="también excluye otras causas" color="#8A3FD8" p={otras} t={26} punta="no" />
      <Sale p={esteato} x={560} y={880}><circle r={36} fill="#C79A00" /><circle cx={-2} cy={-2} r={31} fill="#FFD23F" /><circle cx={-10} cy={-10} r={8} fill="#FFF" opacity={0.8} /></Sale>
      <Txt x={560} y={955} txt="esteatohepatitis" t={24} p={esteato} />
      <Sale p={autoinmune} x={800} y={880}><Linfo k={0.7} reloj={reloj} activo={0.4} /></Sale>
      <Txt x={800} y={955} txt="autoinmune" t={24} p={autoinmune} />
      <Sale p={depositos} x={1040} y={880}><rect x={-28} y={-28} width={56} height={56} rx={12} fill="#6A3F1E" /><rect x={-26} y={-28} width={50} height={48} rx={10} fill="#B07A44" /></Sale>
      <Txt x={1040} y={955} txt="depósitos" t={24} p={depositos} />
    </g>
  );
};

// ─── 7 · Cuando el hígado no alcanza ────────────────────────────────────────
const Falla: Lamina = ({ p, reloj }) => {
  const alcanza = p('alcanza'), falla = p('falla'), masiva = p('masiva'), ictericia = p('ictericia'), inr = p('inr'), encef = p('encefalopatia'), semanas = p('semanas'), va = p('va'), vb = p('vb'), ve = p('ve'), embarazo = p('embarazo'), urgencia = p('urgencia'), abasto = p('abasto');
  const alarma = 0.5 + 0.5 * onda(reloj, 480, 0);
  return (
    <g>
      <Levita x={380} y={470} reloj={reloj} k={0.85} p={alcanza} suelo={190} ancho={340} fase={0.4}>
        <Higado corte={false} />
        <g opacity={0.78 * tramo(masiva, 0, 0.6)}>
          <ellipse cx={-10} cy={4} rx={190} ry={96} fill="#2A0A24" /><ellipse cx={-90} cy={-30} rx={96} ry={62} fill="#2A0A24" /><ellipse cx={90} cy={40} rx={110} ry={60} fill="#2A0A24" />
        </g>
      </Levita>
      <Etiqueta x={380} y={190} txt="falla hepática aguda" color="#B8237A" p={falla} t={34} punta="no" />
      <Txt x={380} y={740} txt="necrosis masiva, sin cirrosis previa" t={26} p={masiva} />
      {/* los tres criterios: ictericia, INR y encefalopatía */}
      <Sombra><Sale p={ictericia} x={850} y={430} k={0.5}><Busto quien="p1" reloj={reloj} ictericia={easeOut(ictericia)} sueno={0.5 * encef} dolor={0.4} /></Sale></Sombra>
      <Nota x={850} y={640} txt="ictericia" p={ictericia} color={TXH.biliI} />
      <Etiqueta x={850} y={730} txt="encefalopatía" color="#7A55D8" p={encef} t={26} punta="no" />
      {encef > 0.1 && ['?', '?', '?'].map((q, i) => <text key={i} x={850 + (i - 1) * 90} y={250 - 20 * Math.abs(onda(reloj, 700, i))} textAnchor="middle" style={{ fontSize: 56 + i * 8, fontWeight: 800, fill: 'var(--se-ambar)', opacity: encef }}>{q}</text>)}
      <BarraLab x={1130} y={700} w={88} alto={320} val={1.6} max={2.5} norm={1.1} color="#F0495F" oscuro="#A8203A" p={inr} nombre="INR" valor="1,5 o más" t={26} />
      <Reloj x={1400} y={430} k={1.4} ang={(reloj / 90) % 360} o={tramo(semanas, 0, 0.4)} />
      <Etiqueta x={1400} y={590} txt="en menos de 26 semanas" color="#E0A100" p={semanas} t={26} punta="no" />
      {/* causas virales: A, B y E (en el embarazo) */}
      {([['A', '#FF8A1E', 1230, va], ['B', '#2F55E0', 1330, vb], ['E', '#D4A21E', 1430, ve]] as [string, string, number, number][]).map(([l, c, x, q]) => (
        <Sale key={l} p={q} x={x} y={820} k={0.85}><circle r={34} fill={c} /><circle cx={-3} cy={-3} r={29} fill={c} opacity={0.9} /><text dy="0.36em" textAnchor="middle" style={{ fontSize: 38, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>{l}</text></Sale>
      ))}
      <Txt x={1330} y={895} txt="el E, sobre todo en el embarazo" t={24} p={embarazo} color={TXH.e} />
      <Sale p={urgencia} x={1500} y={190} k={1 + 0.1 * alarma}><circle r={46} fill="#A81830" /><circle cx={-2} cy={-2} r={40} fill="#E5324C" /><rect x={-6} y={-24} width={12} height={28} rx={6} fill="#FFF" /><circle cy={18} r={7} fill="#FFF" /></Sale>
      <Txt x={1500} y={280} txt="una urgencia" t={30} p={urgencia} color={TXH.sangre} />
      <Etiqueta x={800} y={960} txt="los hepatocitos ya no dan abasto" color="#E5324C" p={abasto} t={28} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Ladrillos, Aguda, Puente, Colestasis, Cronica, Interfase, GradoEstadio, Falla];
export default LAMINAS;
