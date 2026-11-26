'use client';
// Capítulo 17 · Hepatitis D
//
// El virión D, una bolita violeta con un abrigo azul prestado por el VHB y mucho menor que el B; el interruptor molecular de sus dos proteínas
// (HDAg corto que enciende la replicación y HDAg largo, con su colita de prenilación, que la apaga y empaqueta); la frase clásica que hay que
// corregir; coinfección frente a sobreinfección; el mapa de Sudamérica con la cuenca del Amazonas, Lábrea y Huanta; el corte con células en mora
// y el bulevirtide sentado sobre NTCP.

import type { Lamina } from '../Lienzo';
import { Sello } from '../../vih-sifilis/Piezas';
import { Tijera, tijeretazo } from '../../bilirrubina/Piezas';
import { Etiqueta, Flecha, Globo, Higado, Reloj, Sale, TXH, Toro, Txt, VirionB, VirionD, H, clamp, easeBack, easeOut, hash, lerp, onda, tramo } from '../Piezas';
import { Hepatocito } from '../Higado';
import { BarraLab, Eje, Ocular } from '../Clinica';
import { Luz, Tacha, Visto } from '../Extras';

type P2 = [number, number];

// ─── 0 · El virus más pequeño que infecta a las personas ────────────────────
// Lo pequeño es el genoma, no la partícula: el anillo de ARN del Delta (1,7 kb) frente al ADN del B (3,2 kb). La polimerasa II del huésped
// lo copia en una hebra larga y el propio ARN, con su ribozima, la corta en trozos del tamaño del genoma.
const HEBRA_X0 = 560, HEBRA_W = 940, HEBRA_Y = 700;
const hebraY = (u: number) => HEBRA_Y + 20 * Math.sin(u * 26);
/** Un trozo de la hebra ondulada, de la fracción a a la fracción b. */
const hebraTramo = (a: number, b: number) =>
  'M' + Array.from({ length: 41 }, (_, i) => { const u = lerp(a, b, i / 40); return `${(HEBRA_X0 + HEBRA_W * u).toFixed(1)},${hebraY(u).toFixed(1)}`; }).join(' L');

const Pequeno: Lamina = ({ p, reloj }) => {
  const pequeno = p('pequeno'), delta = p('delta'), arn = p('arn'), circular = p('circular'), kb = p('kb'), varilla = p('varilla'), replica = p('replica'), pol2 = p('pol2'), ribozima = p('ribozima'), envoltura = p('envoltura'), hbsag = p('hbsag'), viroide = p('viroide'), abrigo = p('abrigo');
  const CX = 790, CY = 330, v = easeOut(varilla);
  const rx = lerp(78, 170, v), ry = lerp(78, 15, v);
  const f = easeOut(pol2), sep = 30 * easeOut(ribozima);
  const trozos: P2[] = [[0, 1 / 3], [1 / 3, 2 / 3], [2 / 3, 1]];
  const pulso = 1 + 0.03 * Math.sin(reloj / 380);
  const salida = 1 - tramo(ribozima, 0, 0.5);
  const px = HEBRA_X0 + HEBRA_W * f, py = hebraY(f);
  return (
    <g>
      <Globo x={700} y={90} txt="¿cuál es el virus más pequeño que infecta a las personas?" t={32} p={pequeno} colaX={0} />
      <VirionD x={290} y={450} k={2.3} reloj={reloj} abrigo={easeOut(envoltura)} o={tramo(delta, 0, 0.4)} />
      <Etiqueta x={290} y={610} txt="el virus Delta" color="#8A4FE8" p={delta} t={32} punta="no" />
      <Etiqueta x={290} y={690} txt="su envoltura es el HBsAg del B" color="#2F55E0" p={hbsag} t={24} punta="no" />
      <Txt x={290} y={790} txt="un viroide" t={34} p={viroide} color={TXH.hep} />
      <Txt x={290} y={840} txt="con abrigo prestado" t={30} p={abrigo} color={TXH.b} />
      {/* el ARN del Delta: un anillo de 1,7 kb que se pliega en varilla */}
      <g opacity={tramo(arn, 0, 0.4)}>
        <ellipse cx={CX + 4} cy={CY + 8} rx={rx} ry={ry} fill="none" stroke="#000" strokeWidth={14} opacity={0.13} />
        <ellipse cx={CX} cy={CY} rx={rx * pulso} ry={ry * pulso} fill="none" stroke="#8A4FE8" strokeWidth={14} pathLength={1} strokeDasharray={`${easeOut(circular).toFixed(3)} 1`} strokeLinecap="round" />
        <ellipse cx={CX - 3} cy={CY - 4} rx={rx} ry={ry} fill="none" stroke="#C9A6F5" strokeWidth={4} opacity={0.6 * tramo(circular, 0.5, 1)} />
      </g>
      <g opacity={tramo(varilla, 0.3, 1)}>
        {Array.from({ length: 14 }, (_, i) => { const tx = CX - rx * 0.86 + (i / 13) * rx * 1.72; return <line key={i} x1={tx} x2={tx} y1={CY - ry * 0.7} y2={CY + ry * 0.7} stroke="#5A22A8" strokeWidth={5} strokeLinecap="round" opacity={0.8} />; })}
      </g>
      <Etiqueta x={CX} y={190} txt="ARN circular" color="#8A4FE8" p={circular} t={28} punta="no" />
      <Txt x={CX} y={480} txt="de unas 1,7 kilobases" t={26} p={kb} color={TXH.d} />
      <Txt x={CX} y={530} txt="plegado en forma de varilla" t={26} p={varilla} color={TXH.d} />
      {/* el ADN del B, para comparar: casi el doble */}
      <g opacity={tramo(kb, 0.2, 0.7)}>
        <circle cx={1304} cy={CY + 8} r={132} fill="none" stroke="#000" strokeWidth={12} opacity={0.12} />
        <circle cx={1300} cy={CY} r={132} fill="none" stroke="#2F55E0" strokeWidth={10} />
        <circle cx={1300} cy={CY} r={114} fill="none" stroke="#4F7FF0" strokeWidth={6} opacity={0.8} strokeDasharray="60 24" strokeDashoffset={-reloj / 60} />
      </g>
      <Txt x={1300} y={CY + 190} txt="el ADN del B: 3,2 kb" t={26} p={kb} color={TXH.b} />
      {/* la replicación: la polimerasa II copia el anillo en una hebra larga y la ribozima la corta */}
      <Txt x={1030} y={810} txt="se replica con la ARN polimerasa II del huésped" t={26} p={replica} color={TXH.hep} />
      <Txt x={1030} y={860} txt="y se corta a sí mismo con una ribozima" t={26} p={ribozima} color={TXH.sangre} />
      {trozos.map(([a, b], j) => {
        const fin = Math.min(b, f);
        if (fin <= a + 0.002) return null;
        return (
          <g key={j} transform={`translate(${((j - 1) * sep).toFixed(1)},0)`}>
            <path d={hebraTramo(a, fin)} fill="none" stroke="#000" strokeWidth={14} strokeLinecap="round" opacity={0.12} transform="translate(4,8)" />
            <path d={hebraTramo(a, fin)} fill="none" stroke={j === 1 ? '#8A4FE8' : '#A874F0'} strokeWidth={13} strokeLinecap="round" />
          </g>
        );
      })}
      <g opacity={tramo(pol2, 0, 0.15) * salida}>
        <circle cx={px + 3} cy={py + 6} r={34} fill="#000" opacity={0.15} />
        <circle cx={px} cy={py} r={34} fill="#C2540A" /><circle cx={px - 3} cy={py - 4} r={30} fill="#FF8A1E" /><circle cx={px - 12} cy={py - 14} r={8} fill="#FFF" opacity={0.6} />
      </g>
      <Txt x={px} y={py - 64} txt="pol II" t={24} p={pol2 * salida} color={TXH.a} />
      {[1 / 3, 2 / 3].map((u, i) => (
        <Sale key={i} p={ribozima} x={HEBRA_X0 + HEBRA_W * u + (i === 0 ? -sep / 2 : sep / 2)} y={hebraY(u) - 52}><g transform="rotate(90)"><Tijera corta={tijeretazo(reloj, 900)} k={0.62} /></g></Sale>
      ))}
    </g>
  );
};

// ─── 1 · Dos proteínas, un interruptor ──────────────────────────────────────
const Interruptor: Lamina = ({ p, reloj }) => {
  const dos = p('dos'), corta = p('corta'), estimula = p('estimula'), larga = p('larga'), edita = p('edita'), lipido = p('lipido'), apaga = p('apaga'), obliga = p('obliga'), hbsag = p('hbsag'), salir = p('salir'), decide = p('decide'), interruptor = p('interruptor');
  const giro = easeOut(apaga);
  return (
    <g>
      <Etiqueta x={800} y={100} txt="el Delta tiene dos proteínas" color="#8A4FE8" p={dos} t={34} punta="no" />
      {/* HDAg corto: estimula la replicación */}
      <g opacity={tramo(corta, 0, 0.4)} transform={`translate(330,${(330 + 7 * Math.sin(reloj / 700)).toFixed(1)})`}><circle cx={5} cy={8} r={60} fill="#000" opacity={0.15} /><circle r={60} fill="#5A22A8" /><circle cx={-4} cy={-4} r={54} fill="#8A4FE8" /><circle cx={-20} cy={-22} r={12} fill="#FFF" opacity={0.6} /><text dy="0.36em" textAnchor="middle" style={{ fontSize: 34, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>S</text></g>
      <Etiqueta x={330} y={440} txt="la corta" color="#8A4FE8" p={corta} t={28} punta="no" />
      <Txt x={330} y={500} txt="estimula la replicación del ARN" t={24} p={estimula} color={TXH.d} />
      {/* HDAg largo: nace de editar el ARN y recibe un lípido */}
      <g opacity={tramo(larga, 0, 0.4)} transform={`translate(1270,${(330 + 7 * Math.sin(reloj / 700 + 1.5)).toFixed(1)})`}><circle cx={5} cy={8} r={76} fill="#000" opacity={0.15} /><circle r={76} fill="#5A22A8" /><circle cx={-4} cy={-4} r={70} fill="#B58AE8" /><circle cx={-24} cy={-26} r={14} fill="#FFF" opacity={0.6} /><text dy="0.36em" textAnchor="middle" style={{ fontSize: 40, fontWeight: 800, fill: '#FFF', fontFamily: 'inherit' }}>L</text>
        <path d="M54,50 C90,70 70,110 110,120 S130,150 100,170" fill="none" stroke="#FFC81E" strokeWidth={9} strokeLinecap="round" opacity={tramo(lipido, 0, 0.5)} /></g>
      <Etiqueta x={1270} y={470} txt="la larga" color="#8A4FE8" p={larga} t={28} punta="no" />
      <Txt x={1270} y={530} txt="nace de editar el ARN" t={24} p={edita} color={TXH.d} />
      <Txt x={1270} y={575} txt="y recibe un lípido" t={24} p={lipido} color={TXH.kupffer} />
      <g opacity={tramo(edita, 0, 0.4)}>
        <path d={`M1170,650 ${Array.from({ length: 9 }, (_, i) => `L${1170 + i * 25},${650 + (i % 2 ? -16 : 16)}`).join(' ')}`} fill="none" stroke="#FF8A1E" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        <g transform={`translate(1270,650) scale(${(1 + 0.25 * Math.sin(reloj / 160)).toFixed(3)})`}><path d="M0,-26 L7,-7 L26,0 L7,7 L0,26 L-7,7 L-26,0 L-7,-7 Z" fill="#FFC81E" /></g>
      </g>
      {/* el interruptor */}
      <g transform="translate(800,420)">
        <rect x={-150} y={-50} width={300} height={100} rx={50} fill="#000" opacity={0.15} transform="translate(6,10)" /><rect x={-150} y={-50} width={300} height={100} rx={50} fill={giro > 0.5 ? '#E5324C' : '#3FD467'} />
        <circle cx={lerp(-100, 100, easeBack(clamp(giro)))} cy={0} r={42} fill="#FFF" /><circle cx={lerp(-102, 98, easeBack(clamp(giro)))} cy={-2} r={35} fill="#F4F0FA" />
      </g>
      <Txt x={640} y={510} txt="replicación" t={26} p={estimula} color={TXH.c} /><Txt x={960} y={510} txt="empaquetar y salir" t={26} p={apaga} color={TXH.sangre} />
      <Etiqueta x={800} y={620} txt="apaga la replicación" color="#E5324C" p={apaga} t={30} punta="no" />
      {/* obliga al ARN a empaquetarse con el HBsAg para salir */}
      <VirionD x={lerp(800, 1000, easeOut(salir))} y={lerp(790, 740, easeOut(salir))} k={1.2} reloj={reloj} o={tramo(obliga, 0, 0.4)} />
      <Txt x={620} y={780} txt="obliga al ARN a empaquetarse" t={26} p={obliga} color={TXH.d} />
      <Etiqueta x={620} y={840} txt="con el HBsAg del B" color="#2F55E0" p={hbsag} t={26} punta="no" />
      <Txt x={1160} y={780} txt="para salir" t={30} p={salir} color={TXH.hep} />
      <Txt x={800} y={920} txt="así el virus decide cuándo multiplicarse y cuándo irse" t={30} p={decide} color={TXH.hep} />
      <Txt x={800} y={970} txt="un interruptor molecular" t={36} p={interruptor} color={TXH.d} />
    </g>
  );
};

// ─── 2 · Cuidado con una frase clásica ──────────────────────────────────────
const FraseClasica: Lamina = ({ p, reloj }) => {
  const cuidado = p('cuidado'), frase = p('frase'), solo = p('solo'), realidad = p('realidad'), genoma = p('genoma'), replicarse = p('replicarse'), hacer = p('hacer'), hbsag = p('hbsag'), empaquetarse = p('empaquetarse'), salir = p('salir'), infectar = p('infectar'), entra = p('entra'), ntcp = p('ntcp'), prospera = p('prospera');
  const tachar = easeOut(realidad), baja = 34 * easeOut(entra);
  return (
    <g>
      <Etiqueta x={500} y={100} txt="cuidado con una frase clásica" color="#E8841E" p={cuidado} t={32} punta="no" />
      <Txt x={500} y={200} txt="«el Delta solo se replica" t={30} p={frase} color={TXH.gris} /><Txt x={500} y={245} txt="en presencia del virus B»" t={30} p={solo} color={TXH.gris} />
      {[205, 250].map((y) => <line key={y} x1={290} x2={lerp(290, 712, tachar)} y1={y} y2={y} stroke="#E5324C" strokeWidth={8} strokeLinecap="round" opacity={tachar > 0.01 ? 1 : 0} />)}
      <Etiqueta x={1100} y={150} txt="en realidad…" color="#1FA85A" p={realidad} t={32} punta="no" />
      {/* su genoma puede replicarse solo: el anillo se copia */}
      <Visto x={150} y={470} k={0.8} p={replicarse} />
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={tramo(genoma, 0, 0.4) * (i === 0 ? 1 : tramo(replicarse, i * 0.25 - 0.2, i * 0.25 + 0.4))}>
          <circle cx={303 + i * 170} cy={476} r={50} fill="none" stroke="#000" strokeWidth={12} opacity={0.12} /><circle cx={300 + i * 170} cy={470} r={50} fill="none" stroke="#8A4FE8" strokeWidth={12} />
        </g>
      ))}
      {[0, 1].map((i) => <Flecha key={i} a={[366 + i * 170, 470]} b={[404 + i * 170, 470]} p={tramo(replicarse, i * 0.3, i * 0.3 + 0.5)} color="#8A4FE8" w={7} />)}
      <Etiqueta x={300} y={575} txt="su genoma" color="#8A4FE8" p={genoma} t={26} punta="no" /><Txt x={560} y={575} txt="puede replicarse solo" t={26} p={replicarse} color={TXH.c} />
      {/* lo que no puede hacer sin HBsAg */}
      <Txt x={700} y={690} txt="lo que no puede hacer sin HBsAg:" t={28} p={hacer} color={TXH.sangre} /><Etiqueta x={1060} y={690} txt="HBsAg" color="#2F55E0" p={hbsag} t={26} punta="no" />
      {[['empaquetarse', empaquetarse, 330], ['salir', salir, 800], ['infectar', infectar, 1270]].map(([t, q, x]) => (
        <g key={t as string}><VirionD x={x as number} y={800} k={0.9} reloj={reloj} abrigo={0} o={tramo(q as number, 0, 0.4)} /><Tacha x={x as number} y={800} r={50} p={q as number} /><Txt x={x as number} y={890} txt={t as string} t={28} p={q as number} color={TXH.sangre} /></g>
      ))}
      {/* entra por la misma NTCP que el B */}
      <g opacity={tramo(entra, 0, 0.4)}>
        <rect x={1060} y={470} width={380} height={38} rx={19} fill={H.membrana[0]} opacity={0.5} /><rect x={1060} y={462} width={380} height={38} rx={19} fill={H.membrana[1]} />
      </g>
      <Toro x={1250} y={380} k={1.2} tallo={70} tono={H.toro} reloj={reloj} o={tramo(entra, 0, 0.4)} />
      <VirionD x={1160} y={245 + 24 * Math.sin(reloj / 600) + baja} k={0.8} reloj={reloj} o={tramo(entra, 0, 0.4)} />
      <VirionB x={1345} y={250 + 24 * Math.sin(reloj / 650 + 1) + baja} k={0.5} reloj={reloj} o={tramo(entra, 0, 0.4)} />
      <Etiqueta x={1250} y={555} txt="entra por la misma NTCP que el B" color="#C77800" p={ntcp} t={24} punta="no" />
      <Txt x={800} y={965} txt="por eso solo prospera donde ya hay un virus B" t={32} p={prospera} color={TXH.hep} />
    </g>
  );
};

// ─── 3 · Coinfección frente a sobreinfección ────────────────────────────────
const Coinfeccion: Lamina = ({ p, reloj }) => {
  const junto = p('junto'), coinfeccion = p('coinfeccion'), curarse = p('curarse'), cae = p('cae'), cronico = p('cronico'), sobreinfeccion = p('sobreinfeccion'), cronifica = p('cronifica'), grave = p('grave'), cirrosis = p('cirrosis'), pocos = p('pocos'), momento = p('momento');
  const g = (m: number, c: number, s: number) => Math.exp(-((m - c) ** 2) / (2 * s * s));
  const nodulos = [[-26, -8], [-8, -22], [14, -14], [26, 4], [8, 14], [-14, 10], [-30, 14], [4, -2], [20, -26]] as P2[];
  return (
    <g>
      {/* coinfección: el D llega junto con el B y suele curarse */}
      <Etiqueta x={300} y={130} txt="coinfección" color="#1FA85A" p={coinfeccion} t={34} punta="no" />
      <VirionB x={170} y={290} k={0.5} reloj={reloj} o={tramo(junto, 0, 0.4)} /><VirionD x={250} y={300} k={0.6} reloj={reloj} o={tramo(junto, 0, 0.4)} />
      <Txt x={210} y={380} txt="llegan juntos" t={24} p={junto} color={TXH.gris} />
      <Eje x={420} y={400} w={700} alto={200} p={coinfeccion} marcas={[]} />
      <path d={`M${420},${400} ${Array.from({ length: 36 }, (_, i) => { const m = i / 35 * 5; return `L${420 + m * 140},${400 - 190 * g(m, 1.8, 0.8)}`; }).join(' ')}`} fill="none" stroke="#1FA85A" strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={`${easeOut(curarse).toFixed(3)} 1`} />
      <Txt x={1250} y={300} txt="suele curarse" t={32} p={curarse} color={TXH.c} /><Visto x={1250} y={380} k={0.9} p={curarse} />
      {/* sobreinfección: el D cae sobre un B crónico y casi siempre se cronifica */}
      <Etiqueta x={300} y={540} txt="sobreinfección" color="#E5324C" p={sobreinfeccion} t={34} punta="no" />
      <rect x={160} y={650} width={560 * tramo(cronico, 0, 1)} height={40} rx={20} fill="#2F55E0" opacity={0.85} />
      <Txt x={440} y={740} txt="un B crónico" t={26} p={cronico} color={TXH.b} />
      <VirionD x={lerp(560, 640, easeOut(cae))} y={lerp(560, 640, easeOut(cae))} k={0.8} reloj={reloj} o={tramo(cae, 0, 0.4)} />
      <Txt x={640} y={560} txt="el Delta cae sobre él" t={24} p={cae} color={TXH.d} />
      <path d="M720,670 C900,670 1000,640 1100,560 S1250,440 1330,380" fill="none" stroke="#E5324C" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${easeOut(cronifica).toFixed(3)} 1`} />
      <Txt x={950} y={720} txt="casi siempre se cronifica" t={28} p={cronifica} color={TXH.sangre} />
      <Sale p={cirrosis} x={1400} y={500} k={0.42}><Higado corte={false} />{nodulos.map(([nx, ny], i) => <g key={i} transform={`translate(${nx * 4},${ny * 4})`}><circle r={26} fill="#8A3A1E" /><circle cx={-2} cy={-3} r={22} fill="#B8602F" /></g>)}</Sale>
      <Etiqueta x={1400} y={620} txt="cirrosis en pocos años" color="#8A3A1E" p={cirrosis} t={26} punta="no" />
      <Reloj x={1400} y={755} k={0.8} ang={(reloj / 30) % 360} o={tramo(pocos, 0, 0.4)} />
      <Etiqueta x={1000} y={830} txt="la forma más grave de hepatitis viral crónica" color="#B8237A" p={grave} t={28} punta="no" />
      <Txt x={800} y={950} txt="el momento lo cambia todo" t={40} p={momento} color={TXH.hep} />
    </g>
  );
};

// ─── 4 · Viajemos a la Amazonía ─────────────────────────────────────────────
// Mapa plano de Sudamérica (equirrectangular, 11,5 px por grado): la cuenca del Amazonas en verde, la selva peruana más oscura y el río en
// azul con su corriente. Los contornos son aproximados: sirven para ubicar, no para medir.
const proyMapa = (lon: number, lat: number): P2 => [880 + (lon + 58) * 11.5, 150 + (13 - lat) * 11.5];
const caminoMapa = (pts: P2[], cerrar = true) => 'M' + pts.map(([lo, la]) => proyMapa(lo, la).map((v) => v.toFixed(1)).join(',')).join(' L') + (cerrar ? ' Z' : '');
const SUDAMERICA: P2[] = [[-71.7, 12.4], [-70, 12.2], [-68.5, 10.6], [-66, 10.6], [-63, 10.7], [-61, 9], [-60, 8.3], [-57.5, 6], [-54, 5.8], [-51.6, 4.2], [-50, 1.5], [-50, -0.5], [-47.5, -1], [-44.5, -2.5], [-39.5, -3], [-35.2, -5.2], [-34.8, -8], [-37.2, -11.5], [-38.7, -13], [-39, -17.5], [-40.2, -20.5], [-41.8, -23], [-44.5, -23.3], [-48.5, -26], [-48.8, -28.5], [-51, -31], [-53.5, -34], [-56.2, -34.9], [-58.5, -34.5], [-57.5, -37.5], [-62, -39], [-64.5, -41], [-65, -45], [-67.5, -46.5], [-66, -48.5], [-69, -51], [-68.5, -53], [-71.5, -53.8], [-74, -52], [-75.5, -48], [-73.8, -43], [-73.5, -38], [-71.8, -33], [-71.5, -28], [-70.3, -23], [-70.3, -18.5], [-75, -15.5], [-77.2, -12], [-79.5, -7.5], [-81.2, -5.5], [-80, -2.5], [-80.8, -1], [-79.8, 1], [-78.2, 2.8], [-77.4, 4], [-77.5, 7.5], [-76, 8.8], [-74.5, 10.8], [-72.5, 11.8]];
const CUENCA: P2[] = [[-76.5, 1.5], [-72, 2.5], [-67.5, 2], [-64, 3.5], [-60, 3], [-56, 2.5], [-52.5, 1.5], [-50.5, -0.5], [-50, -3.5], [-52, -7.5], [-55, -10], [-58, -12.5], [-61.5, -13], [-65, -12], [-68.5, -12.5], [-72, -13.5], [-74.5, -12], [-76, -9], [-77.5, -6], [-77.8, -3]];
const SELVA_PERU: P2[] = [[-77.5, -3.5], [-75.5, -0.5], [-73, -2], [-71.5, -4], [-70, -4.2], [-69.5, -7.5], [-70.5, -10.5], [-69.2, -12], [-71.5, -13], [-73.5, -12.5], [-75, -11], [-76.5, -9], [-77.5, -6.5]];
const RIO_AMAZONAS: P2[] = [[-77, -4.8], [-75, -4.3], [-73.2, -3.8], [-70, -3.5], [-66, -3.2], [-62, -3.3], [-58, -2.5], [-54.5, -2.1], [-51, -1.3], [-49.8, -0.5]];

const Amazonia: Lamina = ({ p, reloj }) => {
  const viajemos = p('viajemos'), amazonia = p('amazonia'), hiperendemica = p('hiperendemica'), labrea = p('labrea'), fulminante = p('fulminante'), cuenca = p('cuenca'), genotipo3 = p('genotipo3'), guanta = p('guanta'), comunidades = p('comunidades'), geografia = p('geografia');
  const [lx, ly] = proyMapa(-64.8, -7.3), [hx, hy] = proyMapa(-74.2, -12.9), [cx, cy] = proyMapa(-73, -6.5), [sx, sy] = proyMapa(-73, -6.5);
  const flujo = -((reloj / 45) % 28);
  const pin = (x: number, y: number, col: string, q: number, r = 20) => (
    <g transform={`translate(${x},${y})`} opacity={tramo(q, 0, 0.4)}>
      <circle cx={3} cy={6} r={r} fill="#000" opacity={0.25} /><circle r={r + 8 * Math.max(0, onda(reloj, 700))} fill={col} opacity={0.3} /><circle r={r} fill={col} /><circle cx={-r * 0.3} cy={-r * 0.3} r={r * 0.28} fill="#FFF" opacity={0.7} />
    </g>
  );
  const guia = (a: P2, b: P2, q: number, col: string) => <line x1={a[0]} y1={a[1]} x2={lerp(a[0], b[0], easeOut(q))} y2={lerp(a[1], b[1], easeOut(q))} stroke={col} strokeWidth={4} strokeDasharray="10 8" strokeLinecap="round" opacity={0.85 * tramo(q, 0, 0.2)} />;
  return (
    <g>
      <Etiqueta x={310} y={110} txt="viajemos a la Amazonía" color="#1FA85A" p={viajemos} t={32} punta="no" />
      <path d={caminoMapa(SUDAMERICA)} fill="#B5651D" opacity={0.22 * tramo(viajemos, 0, 0.5)} transform="translate(6,10)" />
      <path d={caminoMapa(SUDAMERICA)} fill="#F4B860" stroke="#F4B860" strokeWidth={6} strokeLinejoin="round" opacity={tramo(viajemos, 0, 0.5)} />
      <path d={caminoMapa(CUENCA)} fill="#3DB36B" stroke="#3DB36B" strokeWidth={5} strokeLinejoin="round" opacity={tramo(amazonia, 0, 0.5)} />
      <path d={caminoMapa(SELVA_PERU)} fill="#1F8F4E" stroke="#1F8F4E" strokeWidth={4} strokeLinejoin="round" opacity={tramo(amazonia, 0.3, 0.9)} />
      <path d={caminoMapa(RIO_AMAZONAS, false)} fill="none" stroke="#3FA9F5" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={tramo(amazonia, 0.2, 0.7)} />
      <path d={caminoMapa(RIO_AMAZONAS, false)} fill="none" stroke="#CFEFFF" strokeWidth={3} strokeLinecap="round" strokeDasharray="14 14" strokeDashoffset={flujo} opacity={0.8 * tramo(amazonia, 0.4, 1)} />
      {/* la Amazonía peruana: hiperendémica de B y Delta */}
      <Etiqueta x={310} y={250} txt="la Amazonía peruana" color="#1F8F4E" p={amazonia} t={28} punta="no" />
      <Txt x={310} y={305} txt="hiperendémica de B y Delta" t={24} p={hiperendemica} color={TXH.b} />
      {guia([478, 252], [sx - 14, sy - 14], amazonia, '#1F8F4E')}
      {/* Lábrea: la fiebre negra */}
      {pin(lx, ly, '#E5324C', labrea, 22)}
      <Etiqueta x={1380} y={330} txt="Lábrea: la fiebre negra" color="#E5324C" p={labrea} t={26} punta="no" />
      <Txt x={1380} y={385} txt="una forma fulminante" t={24} p={fulminante} color={TXH.sangre} /><Txt x={1380} y={430} txt="en la cuenca amazónica" t={24} p={cuenca} color={TXH.gris} />
      {guia([1214, 334], [lx + 26, ly], labrea, '#E5324C')}
      {/* el genotipo 3 del Delta: Huanta y las comunidades amazónicas */}
      {pin(cx, cy, '#C25A00', comunidades, 16)}
      {pin(hx, hy, '#8A4FE8', guanta, 20)}
      <Txt x={310} y={400} txt="genotipo 3 del Delta" t={30} p={genotipo3} color={TXH.d} /><Txt x={310} y={445} txt="en comunidades amazónicas" t={24} p={comunidades} color={TXH.a} />
      {guia([450, 447], [cx - 20, cy + 4], comunidades, '#C25A00')}
      <Etiqueta x={310} y={580} txt="y en Huanta" color="#8A4FE8" p={guanta} t={28} punta="no" />
      {guia([400, 580], [hx - 22, hy + 6], guanta, '#8A4FE8')}
      <Txt x={800} y={965} txt="una enfermedad con geografía" t={38} p={geografia} color={TXH.hep} />
    </g>
  );
};

// ─── 5 · La histología del Delta y su diagnóstico ───────────────────────────
const HistoD: Lamina = ({ p, reloj }) => {
  const microscopio = p('microscopio'), necrosis = p('necrosis'), eosinofilos = p('eosinofilos'), antigeno = p('antigeno'), nucleo = p('nucleo'), inmuno = p('inmuno'), amazonicas = p('amazonicas'), esteatosis = p('esteatosis'), mora = p('mora'), busca = p('busca'), hbsag = p('hbsag'), positivo = p('positivo'), arn = p('arn'), pruebas = p('pruebas'), diagnostico = p('diagnostico');
  const CX = 480, CY = 500;
  return (
    <g>
      <Ocular x={CX} y={CY} R={310} id="hv-o17" reloj={reloj} o={tramo(microscopio, 0, 0.4)}>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * 6.28, d = 60 + 190 * hash(i, 4);
          const cx = CX + Math.cos(a) * d, cy = CY + Math.sin(a) * d * 0.9;
          return (
            <g key={i}>
              <Hepatocito x={cx} y={cy} k={0.5} reloj={reloj} fase={i} sem={i + 1} apop={i % 4 === 0 ? 0.6 * necrosis : 0} vidrio={0} balon={0} grasa={i % 2 === 1 ? easeOut(esteatosis) * (mora > 0.1 ? 1 : 0.5) : 0} />
              {i % 3 === 0 && <g opacity={tramo(antigeno, 0, 0.4)}>{Array.from({ length: 6 }, (_, j) => <circle key={j} cx={cx + (hash(j, i + 40) - 0.5) * 22} cy={cy + (hash(j, i + 50) - 0.5) * 22} r={3.4} fill="#7A4A22" opacity={tramo(inmuno, 0, 0.5)} />)}</g>}
            </g>
          );
        })}
      </Ocular>
      <Etiqueta x={1170} y={190} txt="necrosis de hepatocitos eosinófilos" color="#E5324C" p={eosinofilos} t={24} punta="no" />
      <Txt x={1170} y={250} txt="antígeno Delta en el núcleo" t={26} p={nucleo} color={TXH.d} /><Txt x={1170} y={295} txt="si se tiñe por inmunohistoquímica" t={22} p={inmuno} color={TXH.gris} />
      <Etiqueta x={1170} y={380} txt="formas amazónicas" color="#1FA85A" p={amazonicas} t={26} punta="no" />
      <Txt x={1170} y={440} txt="esteatosis microvesicular" t={26} p={esteatosis} color={TXH.kupffer} /><Txt x={1170} y={485} txt="células en mora" t={30} p={mora} color={TXH.hep} />
      <Txt x={1170} y={580} txt="por eso se busca el anti-Delta" t={26} p={busca} color={TXH.b} /><Etiqueta x={1170} y={640} txt="en todo HBsAg positivo" color="#2F55E0" p={hbsag} t={26} punta="no" />
      <Luz x={1030} y={760} on={positivo} col="#8A4FE8" signo="+" q={positivo} reloj={reloj} /><Txt x={1090} y={760} txt="anti-Delta positivo" t={26} p={positivo} ancla="start" color={TXH.d} />
      <Luz x={1030} y={860} on={arn} col="#E04AB0" signo="+" q={arn} reloj={reloj} /><Txt x={1090} y={860} txt="ARN Delta" t={26} p={arn} ancla="start" color={TXH.hep} />
      <Txt x={500} y={900} txt="dos pruebas," t={36} p={pruebas} color={TXH.hep} /><Txt x={500} y={950} txt="un diagnóstico" t={36} p={diagnostico} color={TXH.hep} />
    </g>
  );
};

// ─── 6 · El bulevirtide tapa la puerta ──────────────────────────────────────
const colinaBule = 'M0,1000 L0,790 C140,740 260,740 380,790 S640,840 780,780 S980,730 1100,790 L1100,1000 Z';

const Bulevirtide: Lamina = ({ p, reloj }) => {
  const novedad = p('novedad'), bulevirtide = p('bulevirtide'), miristoilado = p('miristoilado'), copia = p('copia'), ocupa = p('ocupa'), ntcp = p('ntcp'), impide = p('impide'), mir301 = p('mir301'), baja = p('baja'), alt = p('alt'), europa = p('europa'), fda = p('fda'), fecha = p('fecha'), analogos = p('analogos'), sirven = p('sirven'), tapar = p('tapar');
  const acerca = easeOut(impide);
  const golpe = Math.abs(Math.sin(reloj / 520)) * acerca, golpe2 = Math.abs(Math.sin(reloj / 520 + 1.3)) * acerca;
  return (
    <g>
      <Etiqueta x={420} y={100} txt="una novedad: el bulevirtide" color="#2F55E0" p={novedad} t={34} punta="no" />
      <path d={colinaBule} fill={H.membrana[0]} transform="translate(0,10)" /><path d={colinaBule} fill={H.membrana[1]} />
      <Toro x={520} y={790} k={1.6} tallo={90} tono={H.toro} reloj={reloj} tapon={ocupa} />
      {/* el péptido baja y se sienta sobre la NTCP */}
      <g opacity={tramo(bulevirtide, 0, 0.4)} transform={`translate(520,${lerp(430, 735, easeOut(ocupa))})`}>
        {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={(i - 2.5) * 22} cy={Math.sin(i * 1.3) * 6} r={13} fill="#4F7FF0" />)}
        <path d="M70,0 C100,20 90,60 130,66" fill="none" stroke="#FF8A1E" strokeWidth={8} strokeLinecap="round" opacity={tramo(miristoilado, 0, 0.5)} />
      </g>
      <Txt x={520} y={290} txt="un péptido miristoilado" t={26} p={miristoilado} color={TXH.a} /><Txt x={520} y={335} txt="copia del pre-S1" t={24} p={copia} color={TXH.b} />
      {/* los virus chocan y rebotan: la puerta está tapada */}
      <VirionD x={360 + 90 * golpe} y={480 + 200 * golpe} k={0.8} reloj={reloj} o={tramo(impide, 0, 0.4)} />
      <VirionB x={700 - 90 * golpe2} y={480 + 200 * golpe2} k={0.5} reloj={reloj} o={tramo(impide, 0, 0.4)} />
      <Etiqueta x={520} y={880} txt="ocupa la NTCP" color="#C77800" p={ntcp} t={28} punta="no" />
      <Etiqueta x={520} y={950} txt="impide la entrada del Delta y del B" color="#E5324C" p={impide} t={24} punta="no" />
      {/* los resultados */}
      <Etiqueta x={1315} y={110} txt="MIR301" color="#8A4FE8" p={mir301} t={32} punta="no" />
      <BarraLab x={1200} y={520} w={80} alto={280} val={0.3} max={1} color="#E04AB0" oscuro="#B8237A" p={baja} nombre="ARN Delta" valor="baja" t={22} />
      <BarraLab x={1420} y={520} w={80} alto={280} val={0.2} max={1} color="#FFC81E" oscuro="#C79A00" p={alt} nombre="ALT" valor="baja" t={22} />
      <Sale p={europa} x={1200} y={660}><Sello ok /></Sale><Txt x={1200} y={745} txt="aprobado en Europa" t={24} p={europa} color={TXH.c} />
      <Sale p={fda} x={1430} y={660}><Sello ok /></Sale><Txt x={1430} y={745} txt="y por la FDA" t={24} p={fda} color={TXH.c} /><Etiqueta x={1430} y={795} txt="22 de mayo de 2026" color="#0A7F78" p={fecha} t={24} punta="no" />
      <Sale p={analogos} x={1200} y={870}><ellipse cx={0} cy={0} rx={60} ry={26} fill="#8A4FE8" /></Sale><Tacha x={1200} y={870} r={46} p={sirven} />
      <Txt x={1420} y={860} txt="los análogos del B" t={24} p={analogos} color={TXH.d} /><Txt x={1420} y={900} txt="no sirven contra el Delta" t={24} p={sirven} color={TXH.sangre} />
      <Txt x={1330} y={965} txt="tapar la puerta ayuda" t={42} p={tapar} color={TXH.hep} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Pequeno, Interruptor, FraseClasica, Coinfeccion, Amazonia, HistoD, Bulevirtide];
export default LAMINAS;
