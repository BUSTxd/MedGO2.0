'use client';
// Capítulo 6 · Cuando la barrera falla: bacteriemia y sepsis.

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Bacilo, Bandera, Corazon, Corte, Cruz, Cuerpo, En, Flecha, FLECHA, Frasco, G, Hematie, Il1, Jeringa, Manometro, Neutrofilo, Pastilla, PildoraFlota, Pulmones, Punto, Rinon, Sale, Suero, TXT_FARMACO, TXTC, Tijera, Tnf, Txt, V, Vaso, Visto, clamp, easeOut, tramo } from '../Piezas';

function Gota({ x, y, k = 1, o = 1, c = '#5AA8FF' }: { x: number; y: number; k?: number; o?: number; c?: string }) {
  return <En x={x} y={y} k={k} o={o}><path d="M0,-20 c14,20 20,30 20,40 a20,20 0 1 1 -40,0 c0,-10 6,-20 20,-40 z" fill={c} /><circle cx={-7} cy={8} r={5} fill="#FFF" opacity={0.7} /></En>;
}

const Flujo: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Corte y={470} moco={0.6} interna={0.5} externa={0.5} o={tramo(p('flujo'), 0, 0.5)} />
      <Vaso x={800} y={900} largo={1700} ancho={80} ang={0} reloj={reloj} flujo={6} pared={30} o={tramo(p('flujo'), 0.3, 1)} />
      {[0, 1, 2].map((i) => { const q = tramo(p('haciaLuz'), i * 0.12, 0.7 + i * 0.12); return <Gota key={i} x={250 + i * 130} y={360 - 150 * q} k={0.8} o={tramo(q, 0, 0.3) * (1 - tramo(q, 0.85, 1))} />; })}
      <Neutrofilo x={620} y={330 - 120 * easeOut(clamp(p('haciaLuz')))} k={0.5} o={tramo(p('haciaLuz'), 0.3, 0.7)} />
      <Flecha a={[400, 440]} b={[400, 250]} p={p('haciaLuz')} color="#2F6FD8" w={9} />
      <Txt x={400} y={150} txt="agua y células del huésped hacia la luz" t={26} p={p('haciaLuz')} />
      {[0, 1, 2].map((i) => { const q = tramo(p('haciaSangre'), i * 0.12, 0.7 + i * 0.12); return <circle key={i} cx={1000 + i * 90} cy={560 + 280 * q} r={i % 2 ? 12 : 9} fill={i % 2 ? G.toxina[1] : G.patogeno[1]} opacity={tramo(q, 0, 0.2)} />; })}
      <Flecha a={[1090, 540]} b={[1090, 810]} p={p('haciaSangre')} color={FLECHA} w={9} />
      <Bandera x={1300} y={660} txt="bacterias y toxinas → tejidos, linfa y sangre" color="#B8237A" p={p('haciaSangre')} t={24} punta="no" />
      <Bandera x={800} y={80} txt="El tráfico va en los dos sentidos" color="var(--cit-base)" p={p('flujo')} t={32} punta="no" />
      <Bandera x={800} y={965} txt="la diarrea es solo una parte del problema" color="#B8237A" p={p('diarrea')} t={26} punta="no" />
    </g>
  );
};

const Comensales: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('nicho')} x={430} y={450}>
        <circle r={230} fill={G.mucoso[2]} opacity={0.6} />
        {[[-70, -40, 20], [40, -80, -30], [20, 40, 50], [-90, 70, 10]].map(([cx, cy, r], i) => <Bacilo key={i} x={cx} y={cy} r={r} k={0.8} tono={G.comensal} />)}
      </Sale>
      <Txt x={430} y={730} txt="en su nicho: beneficioso" t={30} p={p('beneficioso')} color={TXTC.comensal} />
      <Visto x={430} y={820} k={1.5} p={p('beneficioso')} />
      <Flecha a={[680, 450]} b={[930, 450]} p={p('escapan')} color={FLECHA} w={11} />
      <Txt x={800} y={400} txt="escapan" t={30} p={p('escapan')} />
      <Sale p={p('fuera')} x={1170} y={450}>
        <circle r={230} fill="#7E1840" opacity={0.7} />
        <Hematie x={-100} y={-90} k={0.9} /><Hematie x={90} y={80} k={0.9} lado={0.6} />
        <Bacilo x={0} y={-10} r={20} k={1.2} tono={G.comensal} sombra />
      </Sale>
      <Txt x={1170} y={730} txt="fuera de él: perjudicial" t={30} p={p('perjudicial')} color={TXTC.sangre} />
      <Cruz x={1170} y={820} k={1.5} p={p('perjudicial')} />
      <Bandera x={800} y={90} txt="Escapan patógenos… y también comensales" color="var(--cit-base)" p={p('escapan')} t={32} punta="no" />
    </g>
  );
};

const Sin: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Vaso x={560} y={440} largo={1300} ancho={190} ang={0} reloj={reloj} flujo={8} o={tramo(p('toxinas'), 0, 0.4)}>
        {[[-300, -20], [-100, 20], [120, -30], [320, 10], [-200, 50], [220, 40]].map(([cx, cy], i) => <g key={i} opacity={tramo(p('circulan'), i * 0.1, 0.5 + i * 0.1)}><circle cx={cx + 30 * Math.sin(reloj / 400 + i)} cy={cy} r={14} fill={G.toxina[1]} /><circle cx={cx - 4} cy={cy - 4} r={5} fill="#FFF" opacity={0.8} /></g>)}
      </Vaso>
      <Txt x={560} y={640} txt="toxinas circulando… sin bacterias demostradas" t={28} p={p('sinBacteria')} color={TXTC.verde} />
      <Flecha a={[1220, 440]} b={[1330, 330]} p={p('organos')} color={FLECHA} w={9} />
      <Sale p={p('organos')} x={1380} y={250} k={0.85}><Rinon palido={p('organos')} /></Sale>
      <Sale p={p('organos')} x={1250} y={650} k={0.9}><Pulmones infiltrados={p('organos')} /></Sale>
      <Sale p={p('organos')} x={1000} y={780} k={0.8}><Corazon /></Sale>
      <Txt x={1380} y={380} txt="riñón" t={24} p={p('organos')} /><Txt x={1250} y={850} txt="pulmón" t={24} p={p('organos')} /><Txt x={1000} y={900} txt="corazón" t={24} p={p('organos')} />
      <Bandera x={560} y={170} txt="Daño a distancia, sin invasión" color="var(--cit-base)" p={p('toxinas')} t={32} punta="no" />
      <Txt x={460} y={900} txt="endotoxina y exotoxinas actúan sobre órganos lejanos" t={26} p={p('organos')} />
    </g>
  );
};

const Rinon1: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Sale p={p('stx')} x={250} y={300}><Bacilo r={-20} k={1.4} /></Sale>
      <Bandera x={250} y={190} txt="STEC / EHEC" color={G.patogeno[0]} p={p('stx')} t={28} punta="abajo" />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={350 + i * 90} cy={340 + 20 * i + 10 * Math.sin(reloj / 300 + i)} r={13} fill={G.toxina[1]} opacity={tramo(p('stx'), i * 0.1, 0.4 + i * 0.1)} />)}
      <Txt x={420} y={450} txt="toxina Shiga (Stx)" t={26} p={p('stx')} color={TXTC.verde} />
      <Sale p={p('rinon')} x={800} y={560} k={1.6}><Rinon palido={p('shu')} /></Sale>
      <Txt x={800} y={890} txt="lesión del endotelio" t={28} p={p('endotelio')} color={TXTC.sangre} />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={690 + i * 80} cy={930} r={9 * tramo(p('endotelio'), i * 0.1, 0.5 + i * 0.1)} fill="#E5324C" />)}
      <Sale p={p('shu')} x={1330} y={500}>
        <Hematie x={-80} y={-60} k={0.8} vesiculas={1} /><Hematie x={70} y={30} k={0.7} vesiculas={1} lado={0.5} />
        <path d="M-30,120 l26,-22 l10,28 l24,-20 l-8,38 z" fill="#FFD23F" />
      </Sale>
      <Bandera x={1330} y={330} txt="Síndrome hemolítico urémico" color={V.sangre[0]} p={p('shu')} t={26} punta="abajo" />
      <Txt x={1330} y={720} txt="hemólisis, plaquetas bajas, uremia" t={24} p={p('shu')} />
      <Txt x={1330} y={820} txt="la endotoxina coopera… sin explicarlo todo" t={24} p={p('endotoxina')} fuerte={false} />
    </g>
  );
};

const Otros: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('glucano')} x={290} y={400}>{Array.from({ length: 12 }, (_, i) => <g key={i} transform={`rotate(${i * 30})`}><rect x={-5} y={-92} width={10} height={36} rx={5} fill="#FFD23F" /><circle cy={-98} r={10} fill="#FF9F1C" /></g>)}<circle r={62} fill="#7A45E6" /><circle cx={-4} cy={-4} r={54} fill="#B79BFF" /></Sale>
      <Txt x={290} y={560} txt="β-D-glucano de hongos" t={28} p={p('glucano')} />
      <Sale p={p('proteasas')} x={800} y={400} k={3}><Tijera /></Sale>
      <Txt x={800} y={560} txt="proteasas del huésped" t={28} p={p('proteasas')} />
      <Sale p={p('plasminogeno')} x={1310} y={340}><circle r={46} fill="#2F6FD8" /><circle r={36} fill="#5AA8FF" /></Sale>
      <Txt x={1310} y={410} txt="plasminógeno" t={26} p={p('plasminogeno')} />
      <Flecha a={[1310, 450]} b={[1310, 540]} p={p('plasmina')} color={FLECHA} w={9} />
      <Sale p={p('plasmina')} x={1310} y={610}><circle r={46} fill="#E5324C" /><circle r={36} fill="#FF7A8A" /></Sale>
      <Txt x={1310} y={690} txt="plasmina: agrava el daño" t={26} p={p('plasmina')} color={TXTC.sangre} />
      <Sale p={p('cdiff')} x={1000} y={600}><Bacilo tono={G.grampos} k={0.9} /></Sale>
      <Txt x={1000} y={670} txt="C. difficile (modelos)" t={22} p={p('cdiff')} color={TXTC.grampos} />
      <Bandera x={800} y={100} txt="Más contenidos luminales con efecto a distancia" color="var(--cit-base)" p={p('glucano')} t={30} punta="no" />
    </g>
  );
};

const Circulo: Lamina = ({ p }) => {
  const nodos: [string, string, number, number][] = [['inflama', 'inflamación', 800, 250], ['abre', 'uniones abiertas', 1180, 640], ['perm', 'más permeabilidad', 420, 640]];
  return (
    <g>
      <Bandera x={800} y={80} txt="Un círculo vicioso" color="var(--cit-base)" p={p('circulo')} t={34} punta="no" />
      <Flecha a={[880, 310]} b={[1120, 570]} c={[1090, 360]} p={p('abre')} color={FLECHA} w={11} />
      <Flecha a={[1090, 700]} b={[520, 700]} c={[800, 800]} p={p('perm')} color={FLECHA} w={11} />
      <Flecha a={[360, 570]} b={[720, 290]} c={[400, 360]} p={p('circulo')} color={FLECHA} w={11} />
      {nodos.map(([n, txt, x, y]) => <g key={n}><Sale p={p(n === 'inflama' ? 'tnf' : n)} x={x} y={y}><circle r={86} fill="#7A45E6" /><circle cx={-6} cy={-6} r={76} fill="#B79BFF" /></Sale><Txt x={x} y={y + 130} txt={txt} t={28} p={p(n === 'inflama' ? 'tnf' : n)} /></g>)}
      <Sale p={p('tnf')} x={800} y={235}><Tnf k={1.4} /></Sale>
      <Sale p={p('il1')} x={730} y={285}><Il1 k={1.3} /></Sale>
      <Sale p={p('il6')} x={880} y={285}><circle r={22} fill="#FF7A9A" /></Sale>
      <Txt x={800} y={430} txt="TNF · IL-1β · IL-6" t={26} p={p('il6')} color={TXTC.rosa} />
      <Txt x={800} y={500} txt="la barrera rota favorece más inflamación" t={26} p={p('circulo')} />
    </g>
  );
};

const Gravedad: Lamina = ({ p }) => {
  const items: [string, string, number, number, ReactNode][] = [
    ['foco', 'el foco', 270, 330, <g key="f"><circle r={60} fill="#E5324C" /><circle r={38} fill="#FFF7E8" /><circle r={16} fill="#E5324C" /></g>],
    ['toxinas', 'las toxinas', 620, 330, <g key="t"><circle r={34} fill={G.toxina[1]} /><circle cx={-38} cy={30} r={20} fill={G.toxina[1]} /><circle cx={40} cy={34} r={16} fill={G.toxina[1]} /></g>],
    ['reserva', 'la reserva del paciente', 970, 330, <g key="r"><rect x={-60} y={-34} width={110} height={68} rx={14} fill="#138A3A" /><rect x={50} y={-14} width={14} height={28} rx={5} fill="#138A3A" /><rect x={-50} y={-24} width={50} height={48} rx={8} fill="#5FE08A" /></g>],
    ['respuesta', 'la respuesta inmunitaria', 1330, 330, <g key="s"><path d="M0,-62 C28,-46 52,-42 56,-40 C56,12 40,46 0,66 C-40,46 -56,12 -56,-40 C-52,-42 -28,-46 0,-62 Z" fill="#2F6FD8" /></g>],
  ];
  return (
    <g>
      <Bandera x={800} y={90} txt="La gravedad no es solo cuántas bacterias hay" color="var(--cit-base)" p={p('numero')} t={32} punta="no" />
      {items.map(([n, txt, x, y, ic]) => <g key={n}><Sale p={p(n)} x={x} y={y}>{ic}</Sale><Txt x={x} y={y + 110} txt={txt} t={26} p={p(n)} /></g>)}
      <Sale p={p('negativo')} x={800} y={700} k={1.6}><Frasco tono={['#7E1840', '#B8456F']} /></Sale>
      <Cruz x={800} y={700} k={1.6} p={p('negativo')} />
      <Txt x={800} y={860} txt="puede haber sepsis con hemocultivos negativos" t={30} p={p('negativo')} color={TXTC.sangre} />
    </g>
  );
};

const Sepsis3: Lamina = ({ p }) => {
  const puntos: [string, number, number][] = [['sofa', 575, 255], ['sofa', 510, 340], ['sofa', 590, 470], ['sofa', 560, 560]];
  return (
    <g>
      <Sale p={p('disfuncion')} x={800} y={540} k={1.2}><Cuerpo y={0}><g transform="translate(0,-90)"><Pulmones k={0.26} /></g><g transform="translate(-30,40)"><Rinon k={0.2} /></g></Cuerpo></Sale>
      {puntos.map(([n, x, y], i) => <Punto key={i} x={x + 320} y={y} p={tramo(p(n), i * 0.15, 0.5 + i * 0.15)} />)}
      <Txt x={70} y={300} txt="disfunción orgánica" t={30} p={p('disfuncion')} ancla="start" />
      <Txt x={70} y={344} txt="potencialmente mortal" t={30} p={p('disfuncion')} ancla="start" />
      <Txt x={70} y={410} txt="por una respuesta desregulada" t={24} p={p('disfuncion')} ancla="start" fuerte={false} />
      <Txt x={70} y={446} txt="a una infección" t={24} p={p('disfuncion')} ancla="start" fuerte={false} />
      <Sale p={p('dos')} x={1260} y={430}><rect x={-150} y={-80} width={300} height={160} rx={24} fill={G.sombra} transform="translate(8,9)" /><rect x={-150} y={-80} width={300} height={160} rx={24} fill="#E0338A" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 54, fontWeight: 800 }} fill="#FFF">SOFA ≥ 2</text></Sale>
      <Txt x={1260} y={560} txt="aumento atribuible a la infección" t={26} p={p('dos')} />
      <Cruz x={1260} y={700} k={1.4} p={p('noEscala')} />
      <Txt x={1260} y={790} txt="no es una escala global de cuatro puntos" t={26} p={p('noEscala')} color={TXTC.sangre} />
    </g>
  );
};

const Qsofa: Lamina = ({ p }) => {
  const q: [string, string, string, number][] = [['fr', 'frecuencia respiratoria', '≥ 22', 250], ['pas', 'presión sistólica', '≤ 100', 560], ['mental', 'alteración mental', '?', 870]];
  return (
    <g>
      <Bandera x={560} y={90} txt="qSOFA" color="var(--cit-base)" p={p('fr')} t={34} punta="no" />
      {q.map(([n, txt, val, x]) => <g key={n}><Sale p={p(n)} x={x} y={280}><circle r={80} fill="#7A45E6" /><circle cx={-6} cy={-6} r={70} fill="#B79BFF" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 44, fontWeight: 800 }} fill="#2A0A48">{val}</text></Sale><Txt x={x} y={400} txt={txt} t={24} p={p(n)} /></g>)}
      <Txt x={560} y={500} txt="dos o más: mayor riesgo, no diagnóstico" t={28} p={p('dosOMas')} color={TXTC.ambar} />
      <Bandera x={1300} y={90} txt="Choque séptico" color={V.sangre[0]} p={p('choque')} t={34} punta="no" />
      <Sale p={p('pam')} x={1160} y={330} k={1.3}><Manometro x={0} y={0} val={0.2} /></Sale>
      <Txt x={1160} y={470} txt="PAM ≥ 65" t={28} p={p('pam')} /><Txt x={1160} y={506} txt="con vasopresores" t={22} p={p('pam')} fuerte={false} />
      <Sale p={p('lactato')} x={1440} y={320} k={0.8}><rect x={-34} y={-100} width={68} height={200} rx={30} fill="#D6E7F2" /><rect x={-26} y={-30} width={52} height={120} rx={24} fill="#F7CE55" /></Sale>
      <Txt x={1440} y={470} txt="lactato > 2" t={28} p={p('lactato')} /><Txt x={1440} y={506} txt="mmol/L" t={22} p={p('lactato')} fuerte={false} />
      <Txt x={1300} y={600} txt="pese a una reanimación adecuada" t={26} p={p('choque')} fuerte={false} />
      <Txt x={800} y={860} txt="se reconoce por la disfunción, no por el hemocultivo" t={28} p={p('dosOMas')} />
    </g>
  );
};

const Hora: Lamina = ({ p, reloj }) => {
  const pasos: [string, string, string, ReactNode][] = [
    ['hemocultivos', '1 · hemocultivos', '#7A45E6', <Frasco key="f" k={0.55} tono={['#9B1B3A', '#E5324C']} />],
    ['antibiotico', '2 · antibiótico', '#D9822B', <Pastilla key="p" k={1.1} r={-20} color={['#C2410C', '#F97316', '#FFC48A']} />],
    ['cristaloides', '3 · cristaloides', '#2F6FD8', <Suero key="s" k={0.45} />],
    ['noradrenalina', '4 · noradrenalina', '#138A3A', <Jeringa key="j" k={0.6} r={-20} liquido="#5FE08A" />],
  ];
  return (
    <g>
      <PildoraFlota x={150} y={150} k={1.0} rl={reloj} p={p('farmaco')} />
      <Bandera x={170} y={270} txt={TXT_FARMACO} color="#2F6FD8" p={p('farmaco')} t={22} punta="no" />
      <Bandera x={600} y={110} txt="La primera hora" color="var(--cit-base)" p={p('farmaco')} t={36} punta="no" />
      {pasos.map(([n, txt, c, ic], i) => (
        <g key={n}>
          <rect x={120 + i * 360} y={560} width={340} height={96} fill={c} opacity={tramo(p(n), 0, 0.4)} /><rect x={120 + i * 360} y={560} width={340} height={96} fill="none" stroke="#FFF" strokeWidth={4} opacity={tramo(p(n), 0, 0.4)} />
          <Sale p={p(n)} x={290 + i * 360} y={380}>{ic}</Sale>
          <Bandera x={290 + i * 360} y={608} txt={txt} color={c} p={p(n)} t={26} punta="no" />
        </g>
      ))}
      <Txt x={800} y={780} txt="antibiótico lo antes posible en choque · hemocultivos antes del empírico" t={26} p={p('antibiotico')} />
      <Txt x={800} y={850} txt="noradrenalina como vasopresor de primera línea" t={26} p={p('noradrenalina')} />
      <Txt x={800} y={930} txt="dosis y esquema: los de tu guía local" t={28} p={p('guia')} color={TXTC.violeta} />
    </g>
  );
};

const Foco: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={90} txt="Sin control del foco no basta el antibiótico" color="var(--cit-base)" p={p('foco')} t={32} punta="no" />
      <Sale p={p('absceso')} x={400} y={420}><circle r={130} fill="#C46A00" /><circle cx={-8} cy={-8} r={116} fill="#FFD27A" />{[[-40, -30, 18], [30, 10, 24], [-10, 50, 14]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#FFF7C8" />)}</Sale>
      <Txt x={400} y={600} txt="absceso" t={28} p={p('absceso')} />
      <Sale p={p('drenar')} x={560} y={420}><rect x={0} y={-12} width={170} height={24} rx={12} fill="#7F93A8" /><rect x={0} y={-12} width={170} height={9} rx={4} fill="#FFF" opacity={0.6} /></Sale>
      <Txt x={640} y={470} txt="drenar" t={28} p={p('drenar')} />
      <Sale p={p('cateter')} x={1060} y={420}><rect x={-14} y={-160} width={28} height={320} rx={12} fill="#AAB6C3" /><rect x={-24} y={-170} width={48} height={20} rx={8} fill="#7F93A8" /></Sale>
      <Cruz x={1060} y={420} k={2.2} p={p('cateter')} />
      <Txt x={1060} y={640} txt="retirar el catéter o el dispositivo infectado" t={26} p={p('cateter')} />
      <Sale p={p('cultivo')} x={1380} y={420} k={1.1}><Frasco tono={['#9B1B3A', '#E5324C']} /></Sale>
      <Txt x={1380} y={580} txt="según el cultivo" t={26} p={p('cultivo')} />
      <Txt x={800} y={800} txt="y se reajusta el tratamiento" t={30} p={p('ajusta')} />
      <Txt x={800} y={860} txt="(Acinetobacter y Pseudomonas en dispositivos)" t={24} p={p('ajusta')} fuerte={false} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Flujo, Comensales, Sin, Rinon1, Otros, Circulo, Gravedad, Sepsis3, Qsofa, Hora, Foco];
export default LAMINAS;
