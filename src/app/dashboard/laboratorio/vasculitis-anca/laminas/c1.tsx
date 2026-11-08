'use client';
// Capítulo 1 · El endotelio, la frontera que decide.

import type { Lamina } from '../Lienzo';
import { Lente } from '../../citopenias-autoinmunes/laminas/Comun';
import { Antitrombina, Basal, Chip, Endo, Enzima, FT, Fibrina, Heparan, Histamina, Il1, Intersticio, Liso, Luz, NO, Nfkb, PGI2, Pericito, PlaqAct, Receptor7, Selectina, Tallo, Tijera, Tnf, Union, VWF, Viaja, WP, cupula } from '../Fisio';
import { Bandera, Bola, CelEndo, Complejo, En, Flecha, FLECHA, Foco, Granuloma, Hematie, Anca, Neutrofilo, Plaqueta, Sale, Txt, V, clamp, easeOut, hash, lerp, tramo } from '../Piezas';

/** Fila de células endoteliales sobre la membrana basal, de x0 a x1 en la altura y. */
function Endotelio({ x0 = 100, x1 = 1500, y = 560, w = 200, p = 1, gluco = 0, juntas = 0, basal = 1, huecos = 0, activa = 0 }: { x0?: number; x1?: number; y?: number; w?: number; p?: number; gluco?: number; juntas?: number; basal?: number; huecos?: number; activa?: number }) {
  const n = Math.round((x1 - x0) / w);
  return (
    <g opacity={tramo(p, 0, 0.4)}>
      {basal > 0.01 && <rect x={x0 - 40} y={y + 30} width={(x1 - x0 + 80) * easeOut(clamp(basal))} height={22} rx={11} fill="#E7A93A" />}
      {Array.from({ length: n }, (_, i) => {
        const cx = x0 + w * (i + 0.5), ab = huecos * (i % 2 ? 1 : -1) * 14;
        return <CelEndo key={i} x={cx + ab} y={y} w={w - 8 - huecos * 26} h={52} tono={activa > 0.5 ? ['#D41F5A', '#FF4F86', '#FFB3CB'] : V.endo} />;
      })}
      {gluco > 0.01 && Array.from({ length: n * 9 }, (_, i) => {
        const gx = x0 + 10 + (i / (n * 9)) * (x1 - x0 - 20), q = tramo(gluco, i / (n * 12), i / (n * 12) + 0.25);
        return q > 0 ? <path key={i} d={`M${gx},${y - 24} q${(hash(i, 3) - 0.5) * 16},${-14 * q} ${(hash(i, 4) - 0.5) * 8},${-30 * q}`} fill="none" stroke="#8FE3B4" strokeWidth={5} strokeLinecap="round" /> : null;
      })}
      {juntas > 0.01 && Array.from({ length: n - 1 }, (_, i) => {
        const jx = x0 + w * (i + 1);
        return (
          <g key={i} opacity={tramo(juntas, i / n, i / n + 0.3)}>
            {[-16, -4, 8].map((dy) => <rect key={dy} x={jx - 9} y={y + dy - 3} width={18} height={6} rx={3} fill="#5E1030" />)}
          </g>
        );
      })}
    </g>
  );
}

/** Llama centrada en (0,0). */
function Fuego({ k = 1 }: { k?: number }) {
  return (
    <g transform={`scale(${k})`}>
      <path d="M0,-30 C12,-16 22,-6 20,10 C18,24 9,30 0,30 C-9,30 -18,24 -20,10 C-22,-4 -12,-12 -6,-26 C-3,-14 2,-12 0,-30 Z" fill="#FF7A1A" />
      <path d="M0,-6 C7,2 11,8 10,16 C9,23 4,26 0,26 C-4,26 -9,23 -10,16 C-11,9 -6,4 -3,-4 C-1,2 1,2 0,-6 Z" fill="#FFD23F" />
    </g>
  );
}

const Frontera: Lamina = ({ p, reloj }) => {
  const latido = 1 + 0.05 * Math.sin(reloj / 260) * p('presion');
  const dec = p('decide');
  const ciclo = (reloj % 2200) / 2200;
  return (
    <g>
      <Sale p={p('capa')} x={480} y={520} k={1}>
        <circle r={300} fill={V.pared[2]} />
        <circle r={262} fill={V.endo[0]} />
        <circle r={244} fill={V.pared[1]} />
        {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a) * 252} cy={Math.sin(a) * 252} rx={30} ry={9} fill={V.endo[1]} transform={`rotate(${(a * 180) / Math.PI + 90} ${Math.cos(a) * 252} ${Math.sin(a) * 252})`} />; })}
        {[0, 1, 2, 3, 4].map((i) => <Hematie key={i} x={-120 + i * 60} y={(hash(i, 2) - 0.5) * 200} k={0.8} r={i * 50} />)}
      </Sale>
      <Foco x={480} y={520} R={268} p={p('capa')} color="#FFD23F" />
      <Bandera x={480} y={110} txt="Una sola capa de células: el endotelio" color={V.sangre[0]} p={p('capa')} t={30} punta="no" />
      <Txt x={1240} y={150} txt="parece un forro…" t={34} p={p('forro')} />
      <Bandera x={1240} y={220} txt="…pero es un órgano" color={V.violeta[0]} p={p('organo')} t={34} />
      {([['presion', 1040, V.sangre, 'presión'], ['flujo', 1240, V.turquesa, 'flujo'], ['inflama', 1440, V.ambar, 'inflamación']] as const).map(([n, x, tono, txt]) => (
        <g key={n}>
          <Sale p={p(n)} x={x} y={380} k={0.9 * (n === 'presion' ? latido : 1)}>
            <Bola R={52} tono={tono} />
            {n === 'presion' && <path d="M-18,-6 L0,-26 L18,-6 M-18,14 L0,-6 L18,14" fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />}
            {n === 'flujo' && <path d="M-26,-8 L16,-8 M6,-20 L22,-8 L6,4 M-26,14 L10,14" fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />}
            {n === 'inflama' && <Fuego k={1} />}
          </Sale>
          <Txt x={x} y={470} txt={txt} t={26} p={p(n)} />
          {dec > 0.01 && <path d={`M${x},505 C${x},590 1240,580 1240,650`} fill="none" stroke="var(--cit-flecha)" strokeWidth={4} strokeDasharray="10 9" strokeLinecap="round" opacity={tramo(dec, 0, 0.5)} />}
        </g>
      ))}
      <g opacity={tramo(dec, 0.2, 0.7)} transform="translate(1245,724) scale(1.3) translate(-1245,-724)">
        <rect x={1000} y={724} width={480} height={18} rx={9} fill="#E7A93A" />
        {[1060, 1170, 1310, 1420].map((cx, i) => <Endo key={cx} x={cx} y={724} w={110} h={40} sem={i + 3} />)}
        {[0, 1, 2].map((i) => {
          const c = (ciclo + i / 3) % 1;
          return <path key={i} d="M0,-10 C5,-3 8,1 8,5 A8,8 0 1 1 -8,5 C-8,1 -5,-3 0,-10 Z" fill="#7FC8F5" transform={`translate(1245,${lerp(640, 800, c)})`} opacity={1 - tramo(c, 0.75, 1)} />;
        })}
        <Hematie x={1245} y={668 - 10 * Math.abs(Math.sin(reloj / 300))} k={0.6} lado={0.6} />
      </g>
      <Bandera x={1240} y={850} txt="Decide qué cruza la pared" color={V.endo[0]} p={tramo(dec, 0.3, 1)} t={30} punta="no" />
    </g>
  );
};

/** Fila de células endoteliales detalladas con sus uniones, sobre la basal. */
function Fila({ y, xs, w, h, gluco = 0, uniones = 0, cierre = 1, activa = 0, wp = 0, muere = [] as number[], caida = 0 }: { y: number; xs: number[]; w: number; h: number; gluco?: number; uniones?: number; cierre?: number; activa?: number; wp?: number; muere?: number[]; caida?: number }) {
  return (
    <g>
      {xs.map((cx, i) => {
        const m = muere.includes(i) ? clamp(caida) : 0;
        return <Endo key={cx} x={cx} y={y - 150 * easeOut(tramo(m, 0.4, 1))} r={(i % 2 ? 1 : -1) * 20 * tramo(m, 0.4, 1)} w={w} h={h} gluco={gluco} activa={activa} wp={wp} muere={m} sem={i + 1} />;
      })}
      {uniones > 0.01 && xs.slice(1).map((cx, i) => <Union key={i} x={cx - w / 2} y={y} h={h} cierre={cierre} o={tramo(uniones, i / xs.length, i / xs.length + 0.3)} />)}
    </g>
  );
}

const DeCerca: Lamina = ({ p, reloj }) => {
  const xs = [120, 360, 600, 840, 1080, 1320, 1560];
  return (
    <g>
      <Bandera x={800} y={70} txt="El endotelio de cerca" color="var(--cit-base)" p={p('mira')} t={32} punta="no" />
      <Intersticio y={584} o={tramo(p('mira'), 0, 0.4)} />
      <Luz y0={130} y1={560} reloj={reloj} o={tramo(p('mira'), 0, 0.4)} />
      {p('gluco') > 0.01 && [0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={((reloj * 0.07 + i * 320) % 1900) - 150} cy={300 + (i % 3) * 40} r={9} fill="#F5A623" opacity={0.7 * tramo(p('gluco'), 0, 0.4)} />)}
      <Fila y={560} xs={xs} w={240} h={72} gluco={p('gluco')} uniones={p('uniones')} cierre={0.3 + 0.7 * p('cremallera')} />
      <Basal x0={-20} x1={1640} y={560} p={p('basal')} h={24} />
      <Pericito x={1100} y={600} w={640} p={p('pericito')} />
      <Bandera x={250} y={400} txt="Glucocáliz" color="#1E9E62" p={p('gluco')} t={24} />
      <Bandera x={720} y={420} txt="Uniones · cadherina VE" color="#5A1E9E" p={p('uniones')} t={24} punta="abajo" />
      <Lente x={1340} y={300} R={130} id="c1-zip" o={tramo(p('cremallera'), 0, 0.4)}>
        <rect x={-150} y={-150} width={300} height={300} fill="#FF7480" />
        <rect x={-150} y={-150} width={150} height={300} fill="#FF8A93" />
        <En k={3.2} y={50}><Union x={0} y={0} h={50} cierre={p('cremallera')} /></En>
      </Lente>
      <Chip x={1340} y={455} txt="como una cremallera" color="#5A1E9E" p={p('cremallera')} t={20} />
      <Bandera x={380} y={680} txt="Membrana basal" color="#C47A0E" p={p('basal')} t={24} />
      <Bandera x={1100} y={740} txt="Pericito" color={V.violeta[0]} p={p('pericito')} t={24} />
    </g>
  );
};

/** Corte de un vaso: anillos de la pared y su luz. */
function Corte({ x, y, R, capas, p, hueco = 0 }: { x: number; y: number; R: number; capas: [number, string][]; p: number; hueco?: number }) {
  return (
    <Sale p={p} x={x} y={y}>
      {capas.map(([r, c], i) => <circle key={i} r={R * r} fill={c} />)}
      {hueco > 0.01 && Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * R * capas.at(-2)![0] * 0.98} cy={Math.sin(a) * R * capas.at(-2)![0] * 0.98} r={R * 0.07 * hueco} fill="var(--vas-fondo-a)" />; })}
    </Sale>
  );
}

const Tamanos: Lamina = ({ p }) => {
  const m = p('media');
  return (
    <g>
      <Bandera x={800} y={90} txt="La pared cambia con el tamaño" color="var(--cit-base)" p={p('tamano')} t={32} punta="no" />
      <Corte x={360} y={470} R={250} p={p('arteria')} capas={[[1, '#D9A86A'], [0.86, '#F2C98A'], [0.8, V.pared[3]], [0.62, '#FFE08A'], [0.6, V.endo[0]], [0.55, V.pared[0]]]} />
      {p('adventicia') > 0.01 && [0, 1, 2, 3].map((i) => { const a = 0.6 + i * 1.5; return <circle key={i} cx={360 + Math.cos(a) * 232} cy={470 + Math.sin(a) * 232} r={13} fill={V.sangre[1]} opacity={tramo(p('adventicia'), i * 0.15, 0.5 + i * 0.15)} />; })}
      <Txt x={360} y={130 + 30} txt="arteria grande" t={28} p={p('arteria')} />
      <Bandera x={170} y={800} txt="Íntima" color={V.endo[0]} p={p('intima')} t={24} />
      <Bandera x={360} y={860} txt="Media: músculo y láminas elásticas" color={V.pared[3]} p={m} t={24} />
      <Bandera x={560} y={800} txt="Adventicia" color="#B07A2E" p={p('adventicia')} t={24} />
      <Corte x={900} y={470} R={130} p={p('capilar')} capas={[[1, '#E7A93A'], [0.9, V.endo[0]], [0.78, V.pared[0]]]} />
      <Hematie x={900} y={470} k={1.1} o={tramo(p('capilar'), 0.3, 0.8)} />
      <Txt x={900} y={660} txt="capilar" t={28} p={p('capilar')} />
      <Txt x={900} y={700} txt="endotelio y membrana basal" t={22} fuerte={false} p={p('capilar')} />
      <Corte x={1300} y={470} R={190} p={p('venula')} hueco={p('recuerda')} capas={[[1, '#E7A93A'], [0.93, V.endo[0]], [0.84, V.pared[1]]]} />
      <Txt x={1300} y={720} txt="vénula poscapilar" t={28} p={p('venula')} />
      <Txt x={1300} y={760} txt="las uniones más laxas" t={22} fuerte={false} p={p('venula')} />
      <Foco x={1300} y={470} R={215} p={p('recuerda')} />
      <Bandera x={1300} y={870} txt="Ahí se decide la inflamación" color={V.ambar[0]} p={p('recuerda')} t={28} />
    </g>
  );
};

/** Altura de la superficie de una fila de células (base `y`, ancho w, alto h) en x. */
const superficie = (xs: number[], y: number, w: number, h: number, x: number) => {
  const c = xs.reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a), xs[0]);
  return y + cupula(w, h, Math.max(-w / 2, Math.min(w / 2, x - c)));
};

const EnPaz: Lamina = ({ p, reloj }) => {
  const xs = [115, 345, 575, 805, 1035, 1265, 1495];
  const sup = (x: number) => superficie(xs, 560, 230, 70, x);
  const no = p('no'), pgi = p('pgi'), pl = p('plaquetas');
  const tm = p('tm'), hs = p('hs'), tpa = p('tpa');
  const PLAQ: [number, number][] = [[230, 300], [420, 250], [600, 320]];
  return (
    <g>
      <Bandera x={800} y={70} txt="En reposo: que la sangre no se coagule" color="var(--cit-base)" p={p('reposo')} t={30} punta="no" />
      <Intersticio y={582} o={tramo(p('reposo'), 0, 0.4)} />
      <Luz y0={130} y1={560} reloj={reloj} n={6} o={tramo(p('reposo'), 0, 0.4)} />
      {[[200, 650], [420, 680], [640, 650], [300, 740], [540, 760]].map(([x, y], i) => <Liso key={i} x={x} y={y} relaja={tramo(no, 0.5, 1)} r={-4 + i * 2} />)}
      <Fila y={560} xs={xs} w={230} h={70} uniones={1} />
      <Basal x0={-20} x1={1640} y={560} h={22} />
      {/* NO: sube a las plaquetas y baja al músculo */}
      {no > 0.01 && Array.from({ length: 10 }, (_, i) => {
        const arriba = i < 6;
        const a: [number, number] = [320 + (i % 3) * 20, sup(340) - 6];
        const b: [number, number] = arriba ? PLAQ[i % 3] : [220 + (i % 4) * 140, 680];
        return <Viaja key={i} a={a} b={[b[0] + (i % 2 ? 26 : -26), b[1] + 20]} q={tramo(no, i * 0.05, 0.55 + i * 0.04)} sem={i}><NO k={1.6} /></Viaja>;
      })}
      {pgi > 0.01 && Array.from({ length: 5 }, (_, i) => <Viaja key={i} a={[560 + i * 12, sup(575) - 6]} b={[PLAQ[i % 3][0] + 30, PLAQ[i % 3][1] - 30]} q={tramo(pgi, i * 0.08, 0.6 + i * 0.08)} sem={i + 4}><PGI2 k={1.5} r={i * 40} /></Viaja>)}
      {PLAQ.map(([x, y], i) => (
        <g key={i}>
          <PlaqAct x={x} y={y} k={1.7} r={reloj * 0.03 + i * 40} o={1 - tramo(pl, 0, 0.7)} />
          <Plaqueta x={x} y={y} k={1.4} o={tramo(pl, 0.2, 0.9)} />
        </g>
      ))}
      <Chip x={330} y={190} txt="óxido nítrico" color="#2F6FD8" p={no} />
      <Chip x={560} y={190} txt="prostaciclina" color="#0A7F86" p={pgi} />
      {/* Trombomodulina: atrapa trombina y activa la proteína C */}
      <Tallo x={830} y={sup(830)} n={3} color="#7A45E6" claro="#CDB4FF" p={tm} k={1.7} />
      <Enzima x={lerp(760, 830, easeOut(tramo(tm, 0, 0.5)))} y={lerp(250, sup(830) - 104, easeOut(tramo(tm, 0, 0.5)))} k={1.8} abre={0.2} o={tramo(tm, 0, 0.2)} r={-90} />
      <En x={lerp(1000, 900, easeOut(tramo(tm, 0.4, 0.8)))} y={lerp(260, sup(830) - 110, easeOut(tramo(tm, 0.4, 0.8)))} o={tramo(tm, 0.4, 0.6)}>
        <circle r={46 * tramo(tm, 0.75, 1)} fill="#3BE35C" opacity={0.3} />
        <Bola R={24} tono={V.verde} />
      </En>
      <Chip x={830} y={220} txt="trombomodulina" color="#7A45E6" p={tm} />
      {/* Heparán sulfato: ancla a la antitrombina, que atrapa a la trombina */}
      <En x={1040} y={sup(1040)} k={1.6}><Heparan p={hs} n={6} /></En>
      <Antitrombina x={1040} y={sup(1040) - 170} k={1.7} o={tramo(hs, 0.3, 0.6)} />
      <Enzima x={lerp(1200, 1040, easeOut(tramo(hs, 0.5, 1)))} y={lerp(230, sup(1040) - 165, easeOut(tramo(hs, 0.5, 1)))} k={1.3} abre={0.1} o={tramo(hs, 0.5, 0.7) * (1 - 0.4 * tramo(hs, 0.9, 1))} />
      <Chip x={1060} y={190} txt="heparán sulfato" color="#B8237A" p={hs} />
      {/* t-PA: la plasmina disuelve la fibrina */}
      <Fibrina x={1340} y={300} w={340} rota={tramo(tpa, 0.5, 1)} o={tramo(p('reposo'), 0, 0.5) * (1 - 0.6 * tramo(tpa, 0.7, 1))} />
      <Viaja a={[1290, sup(1290) - 4]} b={[1300, 350]} q={tpa} sem={2}><Tijera k={1.8} corta={tramo(tpa, 0.5, 0.8)} /></Viaja>
      <Chip x={1340} y={190} txt="activador del plasminógeno" color="#0C9E9A" p={tpa} />
      <Bandera x={800} y={900} txt="Lisa, antiadherente, en paz" color={V.turquesa[0]} p={p('paz')} t={32} />
    </g>
  );
};

const Arsenal: Lamina = ({ p, reloj }) => {
  const K = 4.2, CX = 800, BY = 770, W = 262, H = 72;
  const top = (x: number) => BY + K * cupula(W, H, Math.max(-W / 2, Math.min(W / 2, (x - CX) / K)));
  const fus = p('fusion'), cara = p('cara'), hist = p('histamina');
  const RODS: [number, number][] = [[400, 700], [520, 640], [660, 690], [940, 690], [1080, 640], [1200, 700], [590, 735], [1010, 735]];
  const REC = [460, 800, 1140];
  return (
    <g>
      <Bandera x={800} y={70} txt="Un arsenal guardado" color={V.sangre[0]} p={p('arsenal')} t={32} punta="no" />
      <Intersticio y={792} o={tramo(p('arsenal'), 0, 0.4)} />
      <Luz y0={130} y1={770} reloj={reloj} n={5} o={tramo(p('arsenal'), 0, 0.4)} />
      <Sale p={p('arsenal')} x={CX} y={BY}><En k={K}><Endo w={W} h={H} activa={0.3 * cara} /></En></Sale>
      <Basal x0={-20} x1={1640} y={770} h={22} />
      {REC.map((x, i) => <Receptor7 key={x} x={x} y={top(x) + 2} on={tramo(hist, 0.55 + i * 0.1, 0.9 + i * 0.03)} k={1.1} />)}
      {[0, 1, 2, 3, 4].map((i) => (
        <Viaja key={i} a={[300 + i * 260, 190]} b={[REC[i % 3] + (i > 2 ? 18 : 0), top(REC[i % 3]) - 30]} q={tramo(hist, i * 0.06, 0.6 + i * 0.05)} sem={i}>
          {i % 2 ? <Enzima k={0.9} abre={0.3} r={90} /> : <Histamina k={1.2} />}
        </Viaja>
      ))}
      <Chip x={800} y={180} txt="histamina o trombina" color="#C46A00" p={hist} />
      {RODS.map(([x0, y0], i) => {
        const llega = easeOut(tramo(fus, i * 0.06, 0.55 + i * 0.05));
        const yt = top(x0) + 22;
        const abre = tramo(cara, i * 0.05, 0.5 + i * 0.05);
        return (
          <g key={i}>
            <WP x={x0} y={lerp(y0, yt, llega)} k={1} r={lerp(i % 2 ? 12 : -10, 0, llega)} o={tramo(p('wp'), i * 0.05, 0.4 + i * 0.05)} abre={abre} />
            <VWF x={x0} y={yt - 12} largo={abre} sem={i} r={(i % 2 ? 1 : -1) * 8} />
            <Selectina x={x0 - 26} y={yt - 22} p={abre} k={1.3} />
            <Selectina x={x0 + 26} y={yt - 22} p={tramo(abre, 0.2, 1)} k={1.3} />
          </g>
        );
      })}
      <Bandera x={330} y={870} txt="Cuerpos de Weibel-Palade" color="#4B1FA0" p={p('wp')} t={24} />
      <Bandera x={800} y={870} txt="Factor de von Willebrand" color="#C99300" p={p('vwf')} t={24} />
      <Bandera x={1250} y={870} txt="P-selectina" color={V.verde[0]} p={p('psel')} t={24} />
      <Chip x={800} y={950} txt="en minutos, la superficie cambia de cara" color={V.verde[0]} p={cara} t={22} />
    </g>
  );
};

const Activacion: Lamina = ({ p, reloj }) => {
  const xs = [150, 450, 750, 1050, 1350, 1650];
  const sup = (x: number) => superficie(xs, 600, 300, 85, x);
  const hr = p('horas'), atr = p('atrapa');
  const MOL: [string, number, string, string][] = [['esel', -110, 'E-selectina', '#0A7F86'], ['icam', -55, 'ICAM-1', '#2F86D8'], ['vcam', 0, 'VCAM-1', '#7A45E6'], ['ft', 55, 'Factor tisular', '#C46A00'], ['quimio', 110, 'Quimiocinas', '#E0338A']];
  const pinta = (cx: number, chips: boolean) => MOL.map(([n, dx, txt, col], j) => {
    const x = cx + dx, y = sup(x), q = p(n);
    return (
      <g key={`${cx}${n}`}>
        {n === 'esel' && <Selectina x={x} y={y} p={q} color="#16B9BE" k={1.5} />}
        {n === 'icam' && <Tallo x={x} y={y} n={5} color="#2F86D8" claro="#A3E3F7" p={q} k={1.3} />}
        {n === 'vcam' && <Tallo x={x} y={y} n={7} color="#7A45E6" claro="#CDB4FF" p={q} k={1.3} />}
        {n === 'ft' && <FT x={x} y={y} p={q} k={1.6} />}
        {n === 'quimio' && [0, 1, 2].map((k) => <circle key={k} cx={x + (k - 1) * 14} cy={y - 26 - (k % 2) * 10} r={7 * easeOut(tramo(q, k * 0.2, 0.6 + k * 0.2))} fill="#E0338A" />)}
        {chips && <path d={`M${x},${y - 40} L${780 + j * 175},${352}`} stroke={col} strokeWidth={3} strokeDasharray="5 5" opacity={0.8 * tramo(q, 0, 0.5)} />}
        {chips && <Chip x={780 + j * 175} y={330} txt={txt} color={col} p={q} t={20} />}
      </g>
    );
  });
  return (
    <g>
      <Bandera x={800} y={70} txt="Señal fuerte: el endotelio se activa" color={V.sangre[0]} p={p('senal')} t={30} punta="no" />
      <Intersticio y={624} o={tramo(p('senal'), 0, 0.4)} />
      <Luz y0={130} y1={600} reloj={reloj} n={5} o={tramo(p('senal'), 0, 0.4)} />
      <Fila y={600} xs={xs} w={300} h={85} activa={hr} uniones={1} gluco={0.5} />
      <Basal x0={-20} x1={1640} y={600} h={22} />
      {[300, 450, 600].map((x, i) => <Tallo key={x} x={x} y={sup(x)} n={2} color="#8D95A5" claro="#C8CDD6" p={p('senal')} />)}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Viaja key={i} a={[200 + i * 90, 200]} b={[[300, 450, 600][i % 3] + (i > 2 ? 10 : -10), sup([300, 450, 600][i % 3]) - 34]} q={tramo(p('tnf'), i * 0.07, 0.55 + i * 0.06)} sem={i}>
          {i % 2 ? <Il1 k={1.6} /> : <Tnf k={1.7} r={i * 30} />}
        </Viaja>
      ))}
      <Chip x={420} y={175} txt="TNF · IL-1" color="#B51D3B" p={p('tnf')} />
      {[150, 450, 750].map((cx, i) => <Nfkb key={cx} x={lerp(cx + 70, cx, easeOut(hr))} y={lerp(560, 600 - 85 * 0.42, easeOut(hr))} k={0.9} o={tramo(hr, 0, 0.2) * (1 - 0.5 * tramo(hr, 0.85, 1))} />)}
      <Chip x={600} y={690} txt="en horas, genes nuevos" color="#0A7F86" p={hr} t={20} />
      {[150, 450, 750].map((cx) => pinta(cx, false))}
      {[1050, 1350].map((cx, i) => pinta(cx, i === 0))}
      {[0, 1, 2, 3].map((i) => <NO key={i} k={1.5} x={1180 + i * 70} y={sup(1220 + i * 50) - 150 - (i % 2) * 40} o={(1 - tramo(p('sinno'), 0, 0.7)) * tramo(p('senal'), 0, 0.4)} />)}
      <Chip x={1350} y={690} txt="menos óxido nítrico" color="#2F6FD8" p={p('sinno')} t={20} />
      <Neutrofilo x={lerp(-80, 470, easeOut(clamp(atr * 1.3)))} y={lerp(260, sup(450) - 75, easeOut(atr))} r={(1 - atr) * reloj * 0.05} k={1} o={tramo(atr, 0, 0.15)} activo={tramo(atr, 0.8, 1) * 0.3} />
      <Bandera x={800} y={900} txt="Ahora atrapa leucocitos y favorece el coágulo" color={V.nucleo[1]} p={atr} t={28} />
    </g>
  );
};

const NoEsLoMismo: Lamina = ({ p, reloj }) => {
  const rev = p('reversible'), cal = p('calma');
  const act = clamp(tramo(rev, 0, 0.6) - tramo(cal, 0.2, 1));
  const L = [140, 380, 620], R = [960, 1200, 1440];
  const supL = (x: number) => superficie(L, 600, 240, 75, x);
  const les = p('lesion'), mue = p('mueren'), exp = p('expuesta'), pl = p('plaquetas'), esc = p('escapa');
  return (
    <g>
      <Bandera x={800} y={60} txt="Activarse no es lo mismo que lesionarse" color="var(--cit-base)" p={p('distinto')} t={30} punta="no" />
      <Intersticio y={622} o={tramo(p('distinto'), 0, 0.4)} />
      <Luz y0={200} y1={600} reloj={reloj} n={6} o={tramo(p('distinto'), 0, 0.4)} />
      <Bandera x={380} y={150} txt="Activación" color={V.verde[0]} p={p('distinto')} t={28} punta="no" />
      <Fila y={600} xs={L} w={240} h={75} activa={act} uniones={1} />
      {L.map((cx) => [-60, 0, 60].map((dx, j) => {
        const x = cx + dx;
        return j === 1 ? <Tallo key={x} x={x} y={supL(x)} n={5} color="#2F86D8" claro="#A3E3F7" p={act} /> : <Selectina key={x} x={x} y={supL(x)} color="#16B9BE" p={act} k={1.1} />;
      }))}
      <Basal x0={-20} x1={770} y={600} h={22} />
      <Flecha a={[260, 720]} b={[500, 720]} c={[380, 800]} p={rev} color={V.verde[0]} w={8} />
      <Flecha a={[500, 690]} b={[260, 690]} c={[380, 640]} p={cal} color={V.verde[0]} w={8} />
      <Txt x={380} y={840} txt="reversible: la señal se apaga y vuelve a la calma" t={24} p={rev} />
      <path d="M800,200 L800,960" stroke="var(--cit-flecha)" strokeWidth={4} strokeDasharray="10 12" opacity={0.5 * tramo(les, 0, 0.5)} />
      <Bandera x={1200} y={150} txt="Lesión" color={V.sangre[0]} p={les} t={28} punta="no" />
      <g opacity={tramo(les, 0, 0.4)}>
        <Basal x0={830} x1={1640} y={600} h={22} />
        {exp > 0.01 && <rect x={1075} y={596} width={250} height={30} rx={15} fill="#FFB23E" opacity={0.5 + 0.4 * Math.abs(Math.sin(reloj / 300)) * exp} />}
        {exp > 0.01 && [0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${1100 + i * 50},600 q${(i % 2 ? 12 : -12)},${-24 * exp} 0,${-48 * exp}`} fill="none" stroke="#F2C98A" strokeWidth={6} strokeLinecap="round" />)}
        <Fila y={600} xs={R} w={240} h={75} muere={[1]} caida={mue} uniones={1 - tramo(mue, 0, 0.5)} />
        {[0, 1, 2].map((i) => <VWF key={i} x={1120 + i * 80} y={590} largo={tramo(pl, i * 0.1, 0.5) * 0.35} sem={i} />)}
        {[0, 1, 2].map((i) => <PlaqAct key={i} x={1120 + i * 80} y={lerp(380, 560, easeOut(tramo(pl, i * 0.12, 0.7 + i * 0.1)))} k={0.9} r={i * 40} o={tramo(pl, i * 0.12, 0.3)} />)}
        {[0, 1, 2, 3].map((i) => <Hematie key={i} x={1180 + (i % 2) * 50} y={lerp(470, 700 + i * 50, easeOut(tramo(esc, i * 0.12, 0.8)))} k={0.55} r={i * 60} o={tramo(esc, i * 0.12, 0.3)} />)}
      </g>
      <Txt x={1200} y={840} txt="mueren, se desprenden; la basal queda expuesta" t={24} p={mue} />
      <Bandera x={1200} y={920} txt="Eso hace una vasculitis" color={V.sangre[0]} p={esc} t={30} />
    </g>
  );
};

const LaVictima: Lamina = ({ p, reloj }) => {
  const atq: [string, number, number][] = [['complejos', 260, 300], ['neutro', 800, 230], ['granuloma', 1340, 300]];
  return (
    <g>
      <Bandera x={800} y={80} txt="En toda vasculitis, alguien ataca al endotelio" color="var(--cit-base)" p={p('idea')} t={30} punta="no" />
      <Endotelio x0={300} x1={1300} y={720} p={p('idea')} />
      <Foco x={800} y={720} R={110} p={p('victima')} color={V.sangre[1]} />
      <Sale p={p('complejos')} x={260} y={300}>{[0, 1, 2].map((i) => <Complejo key={i} x={(i - 1) * 70} y={(i % 2) * 50} k={1.3} r={reloj * 0.02 + i * 50} />)}</Sale>
      <Txt x={260} y={420} txt="inmunocomplejos" t={26} p={p('complejos')} />
      <Sale p={p('neutro')} x={800} y={250}><Neutrofilo k={1.2} cebado={1} /><Anca x={-90} y={-30} r={60} k={1.2} /><Anca x={84} y={20} r={-70} k={1.2} /></Sale>
      <Txt x={800} y={380} txt="neutrófilos activados por anticuerpos" t={26} p={p('neutro')} />
      <Granuloma x={1340} y={290} k={0.4} p={p('granuloma')} />
      <Txt x={1340} y={420} txt="granulomas" t={26} p={p('granuloma')} />
      {atq.map(([n, x, y]) => <Flecha key={n} a={[x, y + 150]} b={[lerp(x, 800, 0.8), 640]} p={tramo(p(n), 0.4, 1)} color={FLECHA} w={7} />)}
      <Txt x={800} y={860} txt="cambia el agresor; la víctima es la misma" t={30} p={p('victima')} />
      <Bandera x={800} y={940} txt="Para atacar, primero tiene que llegar" color={V.nucleo[1]} p={p('llegar')} t={28} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Frontera, DeCerca, Tamanos, EnPaz, Arsenal, Activacion, NoEsLoMismo, LaVictima];
export default LAMINAS;
