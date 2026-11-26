'use client';
// Capítulo 2 · El hígado por dentro: histología
//
// Un zoom en capas (referencias «vaso sanguíneo» y «músculo esquelético»): el órgano que respira, el lobulillo con su sangre que entra por los
// vértices, la tríada con su placa limitante, las trabéculas, el sinusoide con su endotelio fenestrado y su espacio de Disse, los vigilantes (Kupffer,
// NK, estrelladas) y la bilis que corre en sentido contrario. Cada celda respira, cada hematíe rueda, cada fenestra parpadea.

import type { Lamina } from '../Lienzo';
import { Anticuerpo, Cruz, Etiqueta, Flecha, Higado, Levita, Linfo, Nota, Sale, Sombra, Suelo, TXH, Txt, Vaso, Zoom, H, clamp, easeBack, easeOut, hash, lerp, mezcla, onda, tramo, Hematie, VirionB } from '../Piezas';
import { Colageno, Corre, Estrellada, Hepatocito, Kupffer, Lobulillo, ParedFenestrada, Triada, TuboCurvo } from '../Higado';

type P2 = [number, number];

// ─── 0 · Una esponja de sangre ──────────────────────────────────────────────
const Esponja: Lamina = ({ p, reloj }) => {
  const higado = p('higado'), capsula = p('capsula'), laminas = p('laminas'), sinusoides = p('sinusoides'), entra = p('entra'), sale = p('sale'), despacio = p('despacio');
  return (
    <g>
      <Suelo x={420} y={820} w={420} o={tramo(higado, 0, 0.5)} />
      <Sombra><Sale p={higado} x={420} y={540} k={1.25}><Higado corte={false} /></Sale></Sombra>
      <Nota x={420} y={230} txt="cápsula de Glisson" p={capsula} a={[300, 400]} de={[400, 250]} />
      <Txt x={420} y={900} txt="≈ 1,5 kg" t={34} p={higado} color={TXH.hep} />
      <Zoom x={1130} y={500} R={290} de={[500, 470]} p={laminas} fondo="#FFE9F2">
        {[360, 500, 640].map((yy, i) => <Vaso key={i} x={1130} y={yy} largo={700} ancho={64} ang={0} pared={26} reloj={reloj + i * 900} flujo={4} />)}
        {[0, 1, 2, 3, 4].map((i) => [430, 570].map((yy) => <Hepatocito key={`${i}-${yy}`} x={900 + i * 115 + (yy > 500 ? 55 : 0)} y={yy} k={0.46} reloj={reloj} fase={i + yy} sem={i + 3} />))}
      </Zoom>
      <Nota x={1130} y={150} txt="láminas de hepatocitos entre sinusoides" p={sinusoides} />
      <Etiqueta x={840} y={880} txt="entra: espacio porta" color="#7A55D8" p={entra} t={26} punta="arriba" />
      <Etiqueta x={1420} y={880} txt="sale: vena central" color="#3A5FD0" p={sale} t={26} punta="arriba" />
      <Flecha a={[880, 830]} b={[1380, 830]} c={[1130, 850]} p={tramo(sale, 0, 0.9)} color="#E3203F" w={8} />
      <Txt x={1130} y={955} txt="la sangre pasa despacio" t={30} p={despacio} />
    </g>
  );
};

// ─── 1 · Tres formas de partir el hígado ────────────────────────────────────
const TresFormas: Lamina = ({ p, reloj }) => {
  const tres = p('tres'), clasico = p('clasico'), portal = p('portal'), acino = p('acino'), zonas = p('zonas'), explica = p('explica');
  const CV: P2[] = [[0, -190], [165, 95], [-165, 95]];
  return (
    <g>
      <Txt x={800} y={100} txt="tres maneras de partirlo" t={44} p={tres} />
      {/* lobulillo clásico */}
      <Lobulillo x={290} y={520} R={215} id="l1" reloj={reloj} flujo={clasico} o={tramo(clasico, 0, 0.4)} k={0.88 + 0.12 * easeBack(clamp(clasico))} />
      <Etiqueta x={290} y={800} txt="lobulillo clásico" color="#E0707A" p={clasico} t={28} punta="arriba" />
      <Nota x={290} y={860} txt="vena central en medio, tríadas en los vértices" p={clasico} t={22} />
      {/* lobulillo portal: un triángulo entre tres venas centrales, con la tríada en el medio */}
      <g transform="translate(800,520)" opacity={tramo(portal, 0, 0.4)}>
        <path d={`M${CV.map(([a, b]) => `${a},${b}`).join(' L')} Z`} fill={H.bilis[0]} transform="translate(8,12)" opacity={0.45} />
        <path d={`M${CV.map(([a, b]) => `${a},${b}`).join(' L')} Z`} fill={mezcla(H.hep[1], H.bilis[2], 0.35)} />
        {CV.map(([a, b], i) => <g key={i} transform={`translate(${a},${b})`}><circle r={24} fill="#3A1470" /><circle r={19} fill="#7A55D8" /><circle r={12} fill="#3A1470" /></g>)}
        <Corre camino={(u) => [lerp(CV[0][0], 0, u), lerp(CV[0][1], 10, u)]} reloj={reloj} n={3} tono={H.bilis} R={7} o={portal} sem={1} />
        <Corre camino={(u) => [lerp(CV[1][0], 0, u), lerp(CV[1][1], 10, u)]} reloj={reloj} n={3} tono={H.bilis} R={7} o={portal} sem={2} />
        <Corre camino={(u) => [lerp(CV[2][0], 0, u), lerp(CV[2][1], 10, u)]} reloj={reloj} n={3} tono={H.bilis} R={7} o={portal} sem={3} />
        <g transform="scale(0.55)"><Triada k={1} reloj={reloj} /></g>
      </g>
      <Etiqueta x={800} y={800} txt="lobulillo portal" color="#9AAE22" p={portal} t={28} punta="arriba" />
      <Nota x={800} y={860} txt="centrado en la tríada: sigue a la bilis" p={portal} t={22} />
      {/* acino de Rappaport */}
      <g transform="translate(1310,520)" opacity={tramo(acino, 0, 0.4)}>
        <defs><clipPath id="hv-acino"><path d="M0,-215 L135,0 L0,215 L-135,0 Z" /></clipPath></defs>
        <path d="M0,-215 L135,0 L0,215 L-135,0 Z" fill="#000" opacity={0.15} transform="translate(8,12)" />
        <path d="M0,-215 L135,0 L0,215 L-135,0 Z" fill={H.hep[1]} />
        <g clipPath="url(#hv-acino)" opacity={clamp(zonas)}>
          <rect x={-140} y={-220} width={280} height={440} fill="#B21E58" />
          <ellipse cx={0} cy={0} rx={150} ry={150} fill="#E8486A" />
          <ellipse cx={0} cy={0} rx={105} ry={70} fill="#FF7A66" />
        </g>
        {[[0, -215], [0, 215]].map(([a, b], i) => <g key={i} transform={`translate(${a},${b})`}><circle r={26} fill="#3A1470" /><circle r={20} fill="#7A55D8" /><circle r={12} fill="#3A1470" /></g>)}
        {[[-135, 0], [135, 0]].map(([a, b], i) => <g key={i} transform={`translate(${a},${b}) scale(0.34)`}><circle r={96} fill="#FFE0E6" /><circle cx={-44} cy={-24} r={24} fill="#E3203F" /><circle cx={38} cy={-4} r={40} fill="#7A55D8" /><circle cx={-8} cy={50} r={24} fill={H.bilis[1]} /></g>)}
        {zonas > 0.3 && [['1', 0, 0, '#FFF'], ['2', 0, -92, '#FFF'], ['3', 0, -170, '#FFF']].map(([t, a, b, c]) => <text key={t as string} x={a as number} y={b as number} dy="0.36em" textAnchor="middle" opacity={zonas} style={{ fontSize: 34, fontWeight: 800, fill: c as string }}>{t as string}</text>)}
      </g>
      <Etiqueta x={1310} y={800} txt="acino de Rappaport" color="#B21E58" p={acino} t={28} punta="arriba" />
      <Nota x={1310} y={860} txt="tres zonas según el oxígeno" p={zonas} t={22} />
      <Txt x={800} y={950} txt="la tercera forma explica cómo trabaja el hígado" t={30} p={explica} color={TXH.hep} />
    </g>
  );
};

// ─── 2 · La tríada portal ───────────────────────────────────────────────────
const LaTriada: Lamina = ({ p, reloj }) => {
  const triada = p('triada'), arteriola = p('arteriola'), venula = p('venula'), conducto = p('conducto'), conectivo = p('conectivo'), placa = p('placa'), rompe = p('rompe'), interfase = p('interfase');
  const N = 12;
  return (
    <g>
      <Levita x={800} y={510} reloj={reloj} k={2.15} p={triada} suelo={140} ancho={260} fase={0.5}><Triada reloj={reloj} /></Levita>
      {/* la placa limitante: un anillo de hepatocitos */}
      {Array.from({ length: N }, (_, i) => {
        const a = (i / N) * Math.PI * 2 + 0.2, q = tramo(placa, i / (N + 2), i / (N + 2) + 0.3);
        const dañada = [1, 4, 8].includes(i) ? tramo(rompe, 0, 1) : 0;
        return <Hepatocito key={i} x={800 + Math.cos(a) * 372} y={510 + Math.sin(a) * 292} k={0.46 * q} o={q} reloj={reloj} fase={i} sem={i + 2} apop={dañada} />;
      })}
      {[[1, 0.2], [4, 0.2], [8, 0.2]].map(([i], j) => {
        const a = ((i as number) / N) * Math.PI * 2 + 0.2, q = tramo(interfase, j * 0.15, j * 0.15 + 0.6);
        return <Linfo key={j} x={800 + Math.cos(a) * (372 - 120 * q + 140 * (1 - q))} y={510 + Math.sin(a) * (292 - 90 * q + 100 * (1 - q))} k={0.36} o={tramo(interfase, j * 0.15, j * 0.15 + 0.3)} reloj={reloj} fase={j * 2} activo={q} />;
      })}
      <Nota x={420} y={250} txt="arteriola hepática" p={arteriola} a={[691, 457]} de={[500, 262]} color={TXH.sangre} />
      <Nota x={1230} y={250} txt="vénula portal" p={venula} a={[888, 516]} de={[1160, 262]} color={TXH.d} />
      <Nota x={420} y={800} txt="conducto biliar" p={conducto} a={[775, 638]} de={[500, 790]} color={TXH.bilis} />
      <Nota x={1250} y={790} txt="tejido conectivo y linfáticos" p={conectivo} a={[880, 600]} de={[1200, 782]} />
      <Etiqueta x={800} y={120} txt="placa limitante" color="#E0707A" p={placa} t={32} punta="abajo" />
      <Etiqueta x={800} y={920} txt="hepatitis de interfase" color="#B8237A" p={interfase} t={30} punta="no" />
    </g>
  );
};

// ─── 3 · Trabéculas: células en fila ────────────────────────────────────────
const Trabeculas: Lamina = ({ p, reloj }) => {
  const fila = p('fila'), trabeculas = p('trabeculas'), nucleo = p('nucleo'), binuclear = p('binuclear'), grosor = p('grosor'), sinusoide = p('sinusoide'), canaliculo = p('canaliculo'), opuestos = p('opuestos');
  const n = 6, paso = 200;
  return (
    <g>
      <Vaso x={800} y={190} largo={1700} ancho={92} ang={0} pared={26} reloj={reloj} flujo={9} o={tramo(sinusoide, 0, 0.4)} />
      <Vaso x={800} y={830} largo={1700} ancho={92} ang={0} pared={26} reloj={reloj + 2000} flujo={9} o={tramo(sinusoide, 0, 0.4)} />
      {/* la fila india de hepatocitos */}
      {Array.from({ length: n }, (_, i) => (
        <Hepatocito key={i} x={800 + (i - (n - 1) / 2) * paso} y={510} k={1.28 * tramo(fila, i / (n + 2), i / (n + 2) + 0.3)} o={tramo(fila, i / (n + 2), i / (n + 2) + 0.2)} reloj={reloj} fase={i * 1.3} sem={i + 1} binuclear={i === 2 ? binuclear : 0} />
      ))}
      {/* canalículo entre dos células vecinas */}
      {canaliculo > 0.02 && Array.from({ length: n - 1 }, (_, i) => {
        const cx = 800 + (i - (n - 1) / 2 + 0.5) * paso;
        return (
          <g key={i} opacity={clamp(canaliculo)}>
            <ellipse cx={cx} cy={510} rx={8} ry={34} fill={H.bilis[0]} /><ellipse cx={cx} cy={510} rx={5} ry={28} fill={H.bilis[2]} />
            <circle cx={cx} cy={510 + 18 * onda(reloj, 1800, i)} r={4.4} fill={H.bilis[1]} />
          </g>
        );
      })}
      <Nota x={460} y={330} txt="trabécula: una o dos células de grosor" p={trabeculas} />
      <Nota x={1220} y={700} txt="núcleo redondo y central" p={nucleo} a={[1250, 520]} de={[1230, 688]} />
      <Nota x={880} y={730} txt="a veces, dos núcleos" p={binuclear} a={[850, 478]} de={[880, 718]} color={TXH.d} />
      <Txt x={1480} y={330} txt="1-2 células" t={34} p={grosor} color={TXH.hep} />
      {/* los dos lados de la célula */}
      <Flecha a={[800, 290]} b={[800, 400]} c={[800, 340]} p={tramo(opuestos, 0, 0.6)} color="#E3203F" w={9} />
      <Etiqueta x={1180} y={290} txt="polo sinusoidal: recibe de la sangre" color="#E3203F" p={opuestos} t={26} punta="izq" />
      <Etiqueta x={400} y={680} txt="polo biliar: da a la bilis" color="#9AAE22" p={tramo(opuestos, 0.4, 1)} t={26} punta="arriba" />
      <Etiqueta x={800} y={950} txt="dos lados, dos trabajos opuestos" color="#8A3FD8" p={opuestos} t={30} punta="no" />
    </g>
  );
};

// ─── 4 · El sinusoide: un capilar sin pared completa ────────────────────────
const Sinusoide: Lamina = ({ p, reloj }) => {
  const capilar = p('capilar'), fenestras = p('fenestras'), membrana = p('membrana'), disse = p('disse'), plasma = p('plasma'), proteinas = p('proteinas'), intimo = p('intimo');
  return (
    <g>
      {/* luz del sinusoide con su flujo */}
      <Vaso x={800} y={190} largo={1700} ancho={200} ang={0} pared={0} reloj={reloj} flujo={12} o={tramo(capilar, 0, 0.4)} />
      <ParedFenestrada x={800} y={330} w={1500} p={fenestras} reloj={reloj} />
      {/* espacio de Disse */}
      <g opacity={tramo(disse, 0, 0.4)}>
        <rect x={50} y={344} width={1500} height={112} fill="#BFA8F5" opacity={0.28} />
        <path d="M50,456 Q150,434 250,456 T450,456 T650,456 T850,456 T1050,456 T1250,456 T1450,456 T1550,456" fill="none" stroke={H.hep[0]} strokeWidth={10} />
      </g>
      {/* el hepatocito, con sus microvellosidades */}
      <Hepatocito x={800} y={715} k={2.6} reloj={reloj} sem={3} />
      {Array.from({ length: 22 }, (_, i) => {
        const cx = 130 + i * 68, largo = 14 + 8 * onda(reloj, 1700, i * 0.9);
        return <rect key={i} x={cx - 5} y={456 - largo * tramo(disse, 0.3, 0.9)} width={10} height={largo * tramo(disse, 0.3, 0.9)} rx={5} fill={H.hep[1]} opacity={tramo(disse, 0.3, 0.9)} />;
      })}
      {/* el plasma pasa por las fenestras y las proteínas salen */}
      {Array.from({ length: 10 }, (_, i) => {
        const u = ((reloj / 3200 + i / 10) % 1), cx = 150 + (i % 5) * 300 + 70;
        const yy = lerp(260, 470, u);
        return <circle key={i} cx={cx + 8 * Math.sin(u * 6.28 + i)} cy={yy} r={9} fill="#7FD0F5" opacity={tramo(plasma, 0, 0.4) * Math.sin(u * Math.PI)} />;
      })}
      {Array.from({ length: 6 }, (_, i) => {
        const u = ((reloj / 3800 + i / 6) % 1), cx = 240 + i * 250;
        return <g key={i} transform={`translate(${cx + 10 * Math.sin(u * 8)},${lerp(460, 270, u)})`} opacity={tramo(proteinas, 0, 0.4) * Math.sin(u * Math.PI)}><circle r={9} fill="#C79A00" /><circle cx={-1} cy={-1} r={7} fill="#FFD23F" /><circle cx={-3} cy={-3} r={2.2} fill="#FFF" opacity={0.9} /></g>;
      })}
      <Nota x={1330} y={52} txt="endotelio con fenestras" p={fenestras} a={[1330, 326]} de={[1330, 70]} />
      <Nota x={430} y={52} txt="sin membrana basal continua" p={membrana} a={[470, 332]} de={[440, 70]} color={TXH.sangre} />
      <Etiqueta x={1380} y={410} txt="espacio de Disse" color="#7A55D8" p={disse} t={26} punta="no" />
      <Nota x={560} y={560} txt="microvellosidades del hepatocito" p={intimo} a={[560, 452]} de={[560, 548]} />
      <Txt x={1300} y={640} txt="el plasma entra, las proteínas salen" t={28} p={proteinas} />
    </g>
  );
};

// ─── 5 · Los vigilantes ─────────────────────────────────────────────────────
const Vigilantes: Lamina = ({ p, reloj }) => {
  const vig = p('vigilantes'), kupffer = p('kupffer'), nk = p('nk'), estrellada = p('estrellada'), vitamina = p('vitamina'), cronica = p('cronica'), colageno = p('colageno'), fibrosis = p('fibrosis');
  const act = tramo(cronica, 0, 1);
  return (
    <g>
      <Vaso x={800} y={280} largo={1700} ancho={240} ang={0} pared={26} reloj={reloj} flujo={6} o={tramo(vig, 0, 0.4)} />
      {/* Kupffer pegada a la pared, comiendo una partícula */}
      <Sale p={kupffer} x={500} y={395} k={1.15}><Kupffer reloj={reloj} activa={0.5 * tramo(kupffer, 0.5, 1)} /></Sale>
      <VirionB x={380} y={300 + 10 * onda(reloj, 1500, 0)} k={0.3} o={tramo(kupffer, 0.2, 0.6)} reloj={reloj} />
      <Nota x={500} y={540} txt="célula de Kupffer" p={kupffer} color={TXH.kupffer} />
      {/* NK patrullando */}
      <Linfo x={((reloj / 22) % 1900) - 150} y={250} k={0.62} o={tramo(nk, 0, 0.3)} tono={H.nk} reloj={reloj} activo={0.5} receptores={6} />
      <Nota x={1100} y={112} txt="células NK" p={nk} color={TXH.hep} />
      {/* espacio de Disse con la estrellada dormida */}
      <rect x={50} y={430} width={1500} height={150} fill="#BFA8F5" opacity={0.25 * tramo(estrellada, 0, 0.4)} />
      <Sale p={estrellada} x={1050} y={520} k={1.4}><Estrellada reloj={reloj} activa={act} /></Sale>
      <Nota x={1050} y={640} txt="célula estrellada (de Ito)" p={estrellada} color={TXH.estrellada} />
      <Nota x={1330} y={440} txt="gotas de vitamina A" p={vitamina} a={[1090, 505]} de={[1300, 448]} />
      {Array.from({ length: 2 }, (_, i) => <Hepatocito key={i} x={420 + i * 460} y={800} k={1.1} reloj={reloj} sem={i + 4} fase={i * 2} />)}
      <Colageno x={1050} y={520} w={560} h={120} n={6} p={colageno} reloj={reloj} sem={4} />
      <Etiqueta x={1250} y={800} txt="inflamación crónica: fibrosis" color="#1F6FB0" p={fibrosis} t={30} punta="no" />
    </g>
  );
};

// ─── 6 · La bilis sale por el otro lado ─────────────────────────────────────
const bez = (a: P2, c: P2, b: P2, u: number): P2 => [(1 - u) ** 2 * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];
const Bilis: Lamina = ({ p, reloj }) => {
  const canaliculo = p('canaliculo'), uniones = p('uniones'), hering = p('hering'), conductillo = p('conductillo'), conducto = p('conducto'), bilis = p('bilis'), sangre = p('sangre'), contra = p('contracorriente');
  const A: P2 = [360, 496], C: P2 = [360, 330], B: P2 = [640, 330];
  return (
    <g>
      <Hepatocito x={250} y={570} k={1.15} reloj={reloj} sem={5} />
      <Hepatocito x={470} y={570} k={1.15} reloj={reloj} sem={6} fase={1.4} />
      <g opacity={tramo(canaliculo, 0, 0.4)}>
        <ellipse cx={360} cy={570} rx={10} ry={64} fill={H.bilis[0]} /><ellipse cx={360} cy={570} rx={6} ry={56} fill={H.bilis[2]} />
        {uniones > 0.02 && [-56, 56].map((dy) => <rect key={dy} x={348} y={570 + dy - 7} width={24} height={14} rx={5} fill="#7A55D8" opacity={clamp(uniones)} />)}
      </g>
      <Nota x={150} y={380} txt="canalículo biliar" p={canaliculo} a={[354, 560]} de={[190, 392]} color={TXH.bilis} />
      <Nota x={360} y={745} txt="uniones estrechas" p={uniones} a={[360, 628]} de={[360, 730]} color={TXH.d} />
      {/* el camino de la bilis: canalículo → canal de Hering → conductillo → conducto de la tríada */}
      <TuboCurvo a={A} b={B} c={C} w={26} tono={H.bilis} p={hering} />
      <TuboCurvo a={B} b={[1000, 330]} w={32} tono={H.bilis} p={conductillo} />
      <Sale p={conducto} x={1210} y={330} k={1.2}><Triada reloj={reloj} /></Sale>
      <Nota x={520} y={240} txt="canal de Hering" p={hering} color={TXH.bilis} />
      <Nota x={820} y={250} txt="conductillo" p={conductillo} color={TXH.bilis} />
      <Nota x={1210} y={160} txt="conducto biliar del espacio porta" p={conducto} color={TXH.bilis} />
      <Corre camino={(u) => (u < 0.4 ? bez(A, C, B, u / 0.4) : [lerp(B[0], 1100, (u - 0.4) / 0.6), 330])} reloj={reloj} n={9} tono={H.bilis} R={9} o={bilis} sem={2} vel={0.0001} />
      {/* la sangre, en sentido contrario */}
      <Sale p={sangre} x={250} y={850} k={1}><circle r={64} fill="#3A1470" /><circle r={54} fill="#7A55D8" /><circle r={36} fill="#3A1470" /></Sale>
      <Nota x={250} y={940} txt="vena central" p={sangre} color={TXH.d} />
      <TuboCurvo a={[1250, 850]} b={[330, 850]} w={40} tono={H.sangre} p={sangre} />
      <Corre camino={(u) => [lerp(1240, 340, u), 850]} reloj={reloj} n={9} tono={H.sangre} R={12} o={sangre} sem={4} vel={0.0001} />
      <Etiqueta x={900} y={560} txt="la bilis va hacia la tríada" color="#9AAE22" p={contra} t={30} punta="arriba" />
      <Etiqueta x={900} y={750} txt="la sangre va hacia la vena central" color="#E3203F" p={contra} t={30} punta="abajo" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Esponja, TresFormas, LaTriada, Trabeculas, Sinusoide, Vigilantes, Bilis];
export default LAMINAS;
