'use client';
// Capítulo 8 · Historia natural

import type { Lamina } from '../Lienzo';
import { Bandera, Bola, Capas, Cerebro, Cuerpo, Cruz, Escamoso, Flecha, Flota, Ganglio, Helice, HILLS, Hombre, IgG, Letra, Linfocito, Medallon, Nodo, Nube, P, Pulmones, Punto, Sale, Termometro, Trazo, TuboEnsayo, Txt, TXV, Virion, Visto, clamp, easeOut, hash, tramo } from '../Piezas';

/** La tira de las tres fases abajo: aguda, crónica y sida (la actual, resaltada). */
function Fases({ cur, o = 1 }: { cur: 0 | 1 | 2; o?: number }) {
  const segs: [string, number, number, readonly string[]][] = [['aguda', 100, 460, P.sangre], ['crónica', 560, 700, P.cd4], ['sida', 1260, 240, P.hla]];
  return (
    <g opacity={o}>
      {segs.map(([n, x, w, tono], i) => (
        <g key={n}>
          {i === cur && <rect x={x - 6} y={934} width={w + 12} height={52} rx={26} fill={P.espiga[1]} />}
          <rect x={x} y={940} width={w} height={40} rx={20} fill={tono[i === cur ? 1 : 0]} opacity={i === cur ? 1 : 0.55} />
          <Txt x={x + w / 2} y={961} txt={n} t={26} color="#FFF" />
        </g>
      ))}
    </g>
  );
}

// ─── 0 · La fase eclipse y el pico ───────────────────────────────────────────
const EclipsePico: Lamina = ({ p, reloj }) => (
  <g>
    <path d="M160,720 L1450,720 M160,720 L160,200" fill="none" stroke="var(--cit-texto-2)" strokeWidth={5} strokeLinecap="round" opacity={0.5 * tramo(p('empieza'), 0, 0.5)} />
    <rect x={160} y={280} width={380} height={440} rx={20} fill={P.inte[1]} opacity={0.22 * tramo(p('eclipse'), 0, 0.5)} />
    <Txt x={350} y={250} txt="fase eclipse" t={38} p={p('eclipse')} color={TXV.violeta} />
    <Txt x={350} y={300} txt="unos 10 días" t={28} p={p('dias')} />
    <Trazo pts={[[160, 700], [300, 698], [420, 694], [540, 686]]} p={p('dias')} color={P.virus[1]} w={12} />
    <Trazo pts={[[540, 686], [620, 560], [720, 340], [820, 250], [900, 270], [980, 340]]} p={p('explota')} color={P.virus[1]} w={12} />
    <Txt x={820} y={205} txt="pico" t={36} p={p('pico')} color={TXV.sangre} />
    <Txt x={760} y={160} txt="entre la 2.ª y la 4.ª semana" t={26} p={p('semana')} />
    <Txt x={300} y={770} txt="días" t={26} p={p('dias')} fuerte={false} /><Txt x={820} y={770} txt="semanas" t={26} p={p('semana')} fuerte={false} />
    {/* mientras tanto, el virus se multiplica en la mucosa y los ganglios, y la sangre no lo detecta */}
    <Nube x={350} y={560} w={300} h={160} n={9} k={0.22} reloj={reloj} o={tramo(p('multiplica'), 0, 0.5)} sem={5} />
    <Bandera x={230} y={820} txt="mucosa" color={P.hla[0]} p={p('mucosa')} t={26} punta="no" />
    <Bandera x={470} y={820} txt="ganglios" color={P.cd4[0]} p={p('ganglios')} t={26} punta="no" />
    <Sale p={p('sangre')} x={1250} y={470}><TuboEnsayo k={1.2} nivel={0.15 + 0.75 * easeOut(p('pico'))} color={easeOut(p('pico')) > 0.2 ? P.sangre[1] : '#C9C4E4'} reloj={reloj} /></Sale>
    <Txt x={1250} y={640} txt="sangre" t={30} p={p('sangre')} />
    <Cruz x={1380} y={430} k={0.8} p={p('detecta') * (1 - easeOut(p('explota')))} />
    <Txt x={1250} y={690} txt="todavía nada detectable" t={26} p={p('detecta')} color={TXV.sangre} />
    <Txt x={1230} y={130} txt="5 800 000" t={96} p={p('cifra')} color={TXV.virus} />
    <Txt x={1230} y={210} txt="copias por mililitro: el paciente 1" t={26} p={p('caso')} />
    <Fases cur={0} />
  </g>
);

// ─── 1 · Fiebre y malestar ───────────────────────────────────────────────────
const FiebreMalestar: Lamina = ({ p, reloj }) => (
  <g>
    <Cuerpo x={280} y={520} k={0.82}>
      <Punto x={0} y={-290} p={p('cabeza')} /><Punto x={0} y={-196} p={p('garganta')} /><Punto x={-100} y={-60} p={p('musculares')} /><Punto x={100} y={-60} p={p('musculares')} />
    </Cuerpo>
    <Sale p={p('fiebre')} x={560} y={330}><Flota x={0} y={0} rl={reloj} alto={5}><Termometro k={0.6} val={0.92} /></Flota></Sale>
    <Txt x={560} y={470} txt="38,9 °C" t={34} p={p('temp')} color={TXV.sangre} />
    <Bandera x={720} y={250} txt="dolor de garganta" color={P.hla[0]} p={p('garganta')} t={26} punta="no" ancla="izq" />
    <Bandera x={720} y={320} txt="dolor de cabeza" color={P.rt[0]} p={p('cabeza')} t={26} punta="no" ancla="izq" />
    <Bandera x={720} y={390} txt="dolores musculares" color={P.cap[0]} p={p('musculares')} t={26} punta="no" ancla="izq" />
    <Bandera x={720} y={460} txt="cansancio" color={P.esp[0]} p={p('cansancio')} t={26} punta="no" ancla="izq" />
    <Bandera x={480} y={810} txt="síndrome retroviral agudo" color={P.sangre[0]} p={p('sindrome')} t={32} punta="no" />
    <Txt x={480} y={880} txt="parece una gripe o una mononucleosis" t={28} p={p('gripe')} />
    {/* la causa: citocinas */}
    {[['IL-1', P.sangre, 1060, 'il1'], ['IL-6', P.espiga, 1200, 'il6'], ['PGE2', P.hla, 1340, 'pge2']].map(([n, tono, x, id], i) => (
      <Sale key={n as string} p={[p('il1'), p('il6'), p('pge2')][i]} x={x as number} y={300}><Bola R={44} tono={[...(tono as readonly string[])]} /><Letra txt={n as string} t={28} /></Sale>
    ))}
    <Txt x={1200} y={200} txt="citocinas: la causa de la fiebre" t={30} p={p('citocinas')} color={TXV.violeta} />
    <Flecha a={[1130, 360]} b={[640, 400]} c={[900, 520]} p={p('citocinas')} color={P.sangre[1]} w={8} />
    <Sale p={p('activacion')} x={1200} y={540}><Linfocito k={0.9} /></Sale>
    <Txt x={1200} y={630} txt="activación masiva de linfocitos" t={26} p={p('activacion')} />
    {/* el hemograma */}
    <Txt x={1200} y={720} txt="hemograma" t={30} p={p('hemograma')} color={TXV.violeta} />
    <rect x={1040} y={770} width={160} height={36} rx={18} fill="var(--vas-suave)" /><rect x={1040} y={770} width={160 * 0.6 * easeOut(p('linfos'))} height={36} rx={18} fill={P.cd4[1]} />
    <Txt x={1220} y={788} txt="linfocitos 900/µL" t={24} ancla="start" p={p('linfos')} />
    <rect x={1040} y={830} width={160} height={36} rx={18} fill="var(--vas-suave)" /><rect x={1040} y={830} width={160 * 0.65 * easeOut(p('plaquetas'))} height={36} rx={18} fill={P.sangre[1]} />
    <Txt x={1220} y={848} txt="plaquetas 145 000/µL" t={24} ancla="start" p={p('plaquetas')} />
    <Txt x={1200} y={920} txt="algo bajos" t={28} p={p('bajos')} color={TXV.sangre} />
    <Fases cur={0} />
  </g>
);

// ─── 2 · El exantema ─────────────────────────────────────────────────────────
const Exantema: Lamina = ({ p, reloj }) => {
  const dil = easeOut(p('dilatan'));
  const per = easeOut(p('permeables'));
  const edema = easeOut(p('edema'));
  const pts: [number, number, string][] = [[-110, 250, 'tronco'], [30, 280, 'tronco'], [-40, 320, 'tronco'], [90, 230, 'tronco'], [-10, 160, 'cuello'], [40, 170, 'cuello'], [-170, 290, 'brazos'], [170, 295, 'brazos'], [-190, 250, 'brazos'], [190, 250, 'brazos']];
  return (
    <g>
      <Sale p={p('exantema')} x={330} y={470} k={1.15}>
        <Hombre rubor={0.3} />
        {pts.map(([x, y, g], i) => {
          const q = easeOut(tramo(g === 'tronco' ? p('tronco') : g === 'cuello' ? p('cuello') : p('brazos'), (i % 4) * 0.12, (i % 4) * 0.12 + 0.5));
          return <circle key={i} cx={x} cy={y} r={(i % 2 ? 10 : 7) * q} fill="#E5324C" />;
        })}
      </Sale>
      <Txt x={330} y={90} txt="exantema" t={46} p={p('exantema')} color={TXV.sangre} />
      <Txt x={330} y={150} txt="máculas y pápulas rojas" t={28} p={p('maculas')} />
      <Txt x={330} y={915} txt="tronco, cuello y brazos" t={30} p={p('tronco')} />
      {/* la piel por dentro */}
      <Medallon x={1130} y={500} R={320} id="exa" fondo="#F6D6E4">
        <Escamoso x0={-330} x1={330} y={-290} filas={4} />
        <rect x={-330} y={-170} width={660} height={500} fill="#FBE3EC" />
        <rect x={-330} y={-8 - 18 * dil} width={660} height={36 + 36 * dil} fill={P.sangre[0]} />
        <rect x={-330} y={-2 - 14 * dil} width={660} height={24 + 28 * dil} fill={P.sangre[1]} />
        {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={-290 + i * 44} cy={(i % 2 ? -1 : 1) * (60 + 20 * hash(i, 3)) + (i % 2 ? -40 : 50)} r={14 * per * easeOut(clamp(edema * 1.2))} fill="#CFE9FF" opacity={0.85} />)}
        {Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${-230 + i * 90},${i % 2 ? -90 : 100})`} opacity={easeOut(tramo(p('infiltran'), i * 0.1, i * 0.1 + 0.5))}><Linfocito k={0.34} /></g>)}
      </Medallon>
      <Txt x={1130} y={880} txt="la piel por dentro" t={28} p={p('piel')} />
      <Bandera x={1130} y={190} txt="vasos que se dilatan y se vuelven permeables" color={P.sangre[0]} p={p('vasos')} t={24} punta="no" />
      <Bandera x={1470} y={640} txt="edema" color={P.rt[0]} p={p('edema')} t={26} punta="no" />
      <Bandera x={1470} y={720} txt="linfocitos CD4" color={P.cd4[0]} p={p('cd4')} t={26} punta="no" />
      <Fases cur={0} />
    </g>
  );
};

// ─── 3 · Los ganglios ────────────────────────────────────────────────────────
const Ganglios: Lamina = ({ p, reloj }) => {
  const agr = easeOut(p('agrandan'));
  const vac = easeOut(p('vacia'));
  const cic = easeOut(p('cicatriz'));
  const k = (1 + 0.5 * agr) * (1 - 0.45 * vac);
  return (
    <g>
      <Cuerpo x={260} y={520} k={0.82}>
        <Nodo x={0} y={-215} p={p('cuello')} /><Nodo x={-96} y={-150} p={p('axila')} /><Nodo x={96} y={-150} p={p('axila')} />
      </Cuerpo>
      <Bandera x={260} y={170} txt="ganglios del cuello y las axilas" color={P.espiga[0]} p={p('ganglios')} t={26} punta="no" />
      <Txt x={260} y={860} txt="grandes y dolorosos" t={30} p={p('duelen')} color={TXV.sangre} />
      <Medallon x={1060} y={500} R={320} id="gan" fondo="#F6D6E4">
        <g transform={`scale(${k * 1.6})`}><Ganglio /></g>
        {[[-90, -60], [60, -90], [100, 40], [-50, 70], [10, -10]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x * k * 1.6},${y * k * 1.6})`} opacity={easeOut(tramo(p('foliculos'), i * 0.1, i * 0.1 + 0.5)) * (1 - vac)}>
            <circle r={(26 + 20 * agr) * k} fill="#FFF" opacity={0.75} /><circle r={(14 + 12 * agr) * k} fill={P.hla[2]} opacity={easeOut(p('germinales'))} />
          </g>
        ))}
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={-120 + i * 22} y1={-130} x2={-60 + i * 22} y2={130} stroke="#8A6A8A" strokeWidth={6} strokeLinecap="round" opacity={0.6 * cic} />)}
      </Medallon>
      <Txt x={640} y={250} txt="la guerra" t={30} p={p('guerra')} color={TXV.sangre} />
      <Txt x={640} y={295} txt="el virus se replica en los ganglios" t={24} p={p('replica')} />
      <Txt x={640} y={335} txt="y activa a los linfocitos T y B" t={24} p={p('activan')} />
      <Bandera x={1060} y={165} txt="hiperplasia reactiva" color={P.hla[0]} p={p('hiperplasia')} t={28} punta="no" />
      <Txt x={1060} y={880} txt="folículos y centros germinales grandes" t={26} p={p('germinales')} />
      <Txt x={1060} y={925} txt="más adelante: el sistema se agota, el ganglio se vacía y se llena de cicatriz" t={22} p={p('agota')} color={TXV.sangre} />
      <Fases cur={0} />
    </g>
  );
};

// ─── 4 · Las úlceras de la boca ──────────────────────────────────────────────
const Ulceras: Lamina = ({ p, reloj }) => {
  const mu = easeOut(p('mueren'));
  const pie = easeOut(p('pierde'));
  return (
    <g>
      <Medallon x={640} y={520} R={340} id="ulb" fondo="#FBE3EC">
        <g opacity={1 - 0.0}><Capas x={0} y={-30} w={800} fondo={500} bandas={HILLS} sem={21} /></g>
        <g opacity={1 - pie}><Escamoso x0={-340} x1={340} y={-300} filas={4} /></g>
        <g opacity={0.35 + 0.65 * (1 - pie)}><Escamoso x0={-340} x1={340} y={-190} filas={4} o={1} /></g>
        {Array.from({ length: 8 }, (_, i) => <Cruz key={i} x={-280 + i * 80} y={-250 + (i % 2) * 60} k={0.4} p={tramo(mu, (i / 8) * 0.6, (i / 8) * 0.6 + 0.4)} />)}
        <Sale p={p('virus')} x={0} y={-330}><Virion k={0.3} reloj={reloj} /></Sale>
      </Medallon>
      <Txt x={640} y={130} txt="las úlceras de la boca" t={44} p={p('ulceras')} color={TXV.violeta} />
      <Txt x={640} y={905} txt="muerte de los queratinocitos" t={30} p={p('keratinocitos')} />
      <Txt x={1170} y={250} txt="el virus y la inflamación dañan el epitelio" t={26} p={p('inflamacion')} />
      <Txt x={1170} y={300} txt="las células mueren por apoptosis" t={26} p={p('apoptosis')} color={TXV.sangre} />
      <Txt x={1170} y={350} txt="se pierde la capa superficial" t={26} p={p('pierde')} />
      <Bandera x={1170} y={470} txt="queda expuesta la lámina propia" color={P.virus[0]} p={p('expuesta')} t={28} punta="no" />
      <Txt x={1170} y={560} txt="la úlcera" t={34} p={p('ulcera')} color={TXV.sangre} />
      <Bandera x={1170} y={680} txt="«dermis»" color="#8F89B8" p={p('dermis')} t={30} punta="no" />
      <Cruz x={1380} y={680} k={0.8} p={p('dermis')} />
      <Bandera x={1170} y={770} txt="lámina propia" color={P.virus[0]} p={p('lamina')} t={30} punta="no" />
      <Visto x={1380} y={770} k={0.8} p={p('lamina')} />
      <Txt x={1170} y={850} txt="la mucosa oral no tiene dermis" t={26} p={p('mucosa')} />
      <Fases cur={0} />
    </g>
  );
};

// ─── 5 · Seroconversión y set point ──────────────────────────────────────────
const SetPoint: Lamina = ({ p, reloj }) => (
  <g>
    <path d="M160,720 L1450,720 M160,720 L160,200" fill="none" stroke="var(--cit-texto-2)" strokeWidth={5} strokeLinecap="round" opacity={0.5} />
    <Trazo pts={[[160, 700], [260, 600], [360, 330], [440, 230], [520, 280]]} p={p('pico')} color={P.virus[1]} w={12} />
    <Trazo pts={[[520, 280], [620, 400], [720, 500], [860, 540], [1100, 545], [1440, 550]]} p={p('baja')} color={P.virus[1]} w={12} />
    <Txt x={440} y={180} txt="pico" t={30} p={p('pico')} color={TXV.sangre} />
    <Txt x={300} y={770} txt="a las pocas semanas" t={28} p={p('semanas')} />
    <Sale p={p('citotoxicos')} x={590} y={250}><Linfocito tono="cd8" k={0.9} /></Sale>
    <Txt x={590} y={330} txt="CD8 citotóxicos" t={24} p={p('citotoxicos')} color={TXV.cd8} />
    <Sale p={p('anticuerpos')} x={810} y={250}><IgG k={1.6} /></Sale>
    <Txt x={810} y={330} txt="anticuerpos" t={24} p={p('anticuerpos')} color={TXV.ab} />
    <Txt x={950} y={235} txt="anti-gp120" t={24} p={p('gp120')} /><Txt x={950} y={275} txt="anti-gp41" t={24} p={p('gp41')} />
    <Trazo pts={[[560, 600], [680, 630], [820, 680], [1000, 696]]} p={p('p24')} color={P.espiga[1]} w={9} />
    <Txt x={900} y={748} txt="el p24 baja" t={24} p={p('baja')} color={TXV.ambar} />
    <path d="M820,545 L1440,545" stroke={P.espiga[1]} strokeWidth={8} strokeDasharray="14 12" opacity={p('estabiliza')} />
    <Bandera x={1250} y={470} txt="set point" color={P.espiga[0]} p={p('point')} t={34} punta="abajo" />
    <Txt x={1250} y={620} txt="un nivel estable de carga viral" t={26} p={p('estabiliza')} />
    {/* cuanto más alto, más rápida la progresión */}
    <path d="M900,420 L1440,420" stroke={P.sangre[1]} strokeWidth={7} strokeDasharray="14 12" opacity={p('alto')} />
    <Txt x={1160} y={385} txt="más alto: progresión más rápida" t={26} p={p('rapido')} color={TXV.sangre} />
    <path d="M900,660 L1440,660" stroke={P.virus[1]} strokeWidth={7} strokeDasharray="14 12" opacity={p('progreso')} />
    <Txt x={1160} y={705} txt="más bajo: más lenta" t={26} p={p('progreso')} color={TXV.verde} />
    <Fases cur={1} />
  </g>
);

// ─── 6 · La fase crónica y el reservorio ─────────────────────────────────────
const Cronica: Lamina = ({ p, reloj }) => (
  <g>
    <Sale p={p('asintomatica')} x={240} y={400}><Hombre k={0.6} triste={0} boca={0.6} /></Sale>
    <Txt x={240} y={640} txt="asintomática durante años" t={28} p={p('asintomatica')} color={TXV.verde} />
    <Txt x={240} y={672} txt="la persona se siente bien" t={24} p={p('bien')} />
    <Flecha a={[120, 700]} b={[1440, 700]} p={p('anos')} color="var(--cit-flecha)" w={9} />
    <Txt x={780} y={745} txt="años" t={32} p={p('anos')} />
    {/* adentro, el virus no descansa: replica en los ganglios y los CD4 caen poco a poco */}
    <Sale p={p('replica')} x={680} y={380}><Ganglio k={1.3} /></Sale>
    <Nube x={680} y={380} w={260} h={130} n={7} k={0.2} reloj={reloj} o={tramo(p('replica'), 0, 0.5)} sem={8} />
    <Txt x={680} y={500} txt="el virus no descansa: replica en los ganglios" t={24} p={p('ganglios')} />
    <Trazo pts={[[900, 240], [1020, 270], [1150, 320], [1280, 380], [1420, 450]]} p={p('caen')} color={P.cd4[1]} w={12} />
    <Txt x={1160} y={200} txt="CD4: caen poco a poco" t={26} p={p('cd4')} color={TXV.cd4} />
    <Txt x={1160} y={560} txt="la relación CD4/CD8 baja" t={24} p={p('caen')} />
    {/* el reservorio: un provirus dormido en un linfocito de memoria en reposo */}
    <Sale p={p('dormido')} x={470} y={830}><Linfocito tono="gris" k={1.4} /></Sale>
    <Helice x={470} y={830} w={80} amp={10} vueltas={1.2} p={p('provirus')} grosor={7} fase={reloj / 2000} resalta={[0, 1] as [number, number]} />
    <Txt x={560} y={745} txt="z z z" t={30} p={p('dormido')} color={TXV.violeta} />
    <Bandera x={250} y={830} txt="provirus dormido" color={P.hla[0]} p={p('esconde')} t={24} punta="no" />
    <Txt x={620} y={800} txt="en linfocitos de memoria en reposo" t={26} ancla="start" p={p('memoria')} />
    <Txt x={620} y={845} txt="viven años: vida media de unos 44 meses" t={26} ancla="start" p={p('viven')} color={TXV.ambar} />
    <Bandera x={1350} y={800} txt="reservorio latente" color={P.sangre[0]} p={p('reservorio')} t={34} punta="no" />
    <Txt x={1380} y={858} txt="por eso el tratamiento controla" t={24} p={p('tratamiento')} />
    <Cruz x={1200} y={912} k={0.6} p={p('cura2')} />
    <Txt x={1270} y={912} txt="pero no cura" t={32} ancla="start" p={p('cura2')} color={TXV.sangre} />
    <Fases cur={1} />
  </g>
);

// ─── 7 · El sida ─────────────────────────────────────────────────────────────
const Sida: Lamina = ({ p, reloj }) => {
  const inv = easeOut(p('involucionan'));
  return (
    <g>
      <Txt x={800} y={110} txt="la fase final se llama sida: tres criterios" t={38} p={p('criterios')} color={TXV.violeta} />
      <Bandera x={400} y={230} txt="CD4 < 200/µL" color={P.sangre[0]} p={p('n200')} t={36} punta="no" />
      <Bandera x={800} y={230} txt="CD4 < 14 % de los linfocitos" color={P.sangre[0]} p={p('n14')} t={30} punta="no" />
      <Bandera x={1240} y={230} txt="una condición definitoria" color={P.hla[0]} p={p('definitoria')} t={32} punta="no" />
      {[['neumonía por Pneumocystis', 'neumonia', P.rt], ['candidiasis esofágica', 'candidiasis', P.cap], ['tuberculosis', 'tuberculosis', P.esp], ['sarcoma de Kaposi', 'kaposi', P.inte], ['linfoma', 'linfoma', P.hla], ['criptococosis', 'criptococosis', P.espiga], ['toxoplasmosis cerebral', 'toxoplasmosis', P.sangre]].map(([n, id, tono], i) => (
        <Bandera key={id as string} x={420 + (i % 2) * 520} y={340 + Math.floor(i / 2) * 80} txt={n as string} color={(tono as readonly string[])[0]} p={[p('neumonia'), p('candidiasis'), p('tuberculosis'), p('kaposi'), p('linfoma'), p('criptococosis'), p('toxoplasmosis')][i]} t={26} punta="no" />
      ))}
      <Sale p={p('neumonia')} x={1280} y={420}><Pulmones k={0.6} infiltrados={1} /></Sale>
      <Sale p={p('toxoplasmosis')} x={1280} y={620}><Cerebro k={0.7} /></Sale>
      {/* el ganglio se invierte: los folículos se vacían */}
      <Sale p={p('ganglio')} x={430} y={760}><Ganglio k={1.5 * (1 - 0.35 * inv)} /></Sale>
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={430 + Math.cos(i * 1.2) * 60} cy={760 + Math.sin(i * 1.2) * 40} r={16 * (1 - easeOut(tramo(p('vacian'), i * 0.1, i * 0.1 + 0.5)))} fill="#FFF" opacity={0.8 * tramo(p('ganglio'), 0, 0.5)} />)}
      <Txt x={430} y={860} txt="el ganglio: los folículos se involucionan" t={24} p={p('involucionan')} />
      <Txt x={430} y={895} txt="y se vacían de linfocitos" t={24} p={p('vacian')} color={TXV.sangre} />
      <Fases cur={2} />
    </g>
  );
};

// ─── 8 · Controladores y progresores rápidos ─────────────────────────────────
const Controladores: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={100} txt="no todos progresan igual" t={44} p={p('progresan')} color={TXV.violeta} />
    {/* la población: unos pocos controladores de élite */}
    {Array.from({ length: 100 }, (_, i) => <circle key={i} cx={130 + (i % 10) * 36} cy={230 + Math.floor(i / 10) * 36} r={12 * easeOut(tramo(p('personas'), (i / 100) * 0.6, (i / 100) * 0.6 + 0.4))} fill={i === 37 ? P.virus[1] : '#B7AEDB'} />)}
    <Sale p={p('uno')} x={130 + 7 * 36} y={230 + 3 * 36}><circle r={24} fill="none" stroke={P.virus[1]} strokeWidth={7} /></Sale>
    <Bandera x={310} y={640} txt="controladores de élite: menos del 1 %" color={P.virus[0]} p={p('controladores')} t={26} punta="no" />
    <Txt x={310} y={690} txt="sin tratamiento, durante años" t={24} p={p('controlan')} />
    {/* tres curvas de CD4 */}
    <path d="M660,780 L660,220 M660,780 L1500,780" fill="none" stroke="var(--cit-texto-2)" strokeWidth={5} strokeLinecap="round" opacity={0.45 * tramo(p('mantienen'), 0, 0.5)} />
    <Trazo pts={[[670, 300], [900, 305], [1200, 310], [1490, 318]]} p={p('mantienen')} color={P.virus[1]} w={12} />
    <Txt x={1100} y={265} txt="carga viral bajo el límite de detección" t={24} p={p('limite')} color={TXV.verde} />
    <Trazo pts={[[670, 305], [800, 380], [900, 560], [980, 740]]} p={p('progresores')} color={P.sangre[1]} w={12} />
    <Txt x={980} y={810} txt="progresores rápidos: sida en pocos años" t={24} p={p('sida')} color={TXV.sangre} />
    <Bandera x={760} y={640} txt="el otro extremo" color={P.sangre[0]} p={p('extremo')} t={24} punta="no" />
    {/* con frecuencia, HLA-B*57 o B*27 y CD8 muy eficaces */}
    <Bandera x={1130} y={420} txt="HLA-B*57" color={P.hla[0]} p={p('b57')} t={26} punta="no" />
    <Bandera x={1130} y={480} txt="HLA-B*27" color={P.hla[0]} p={p('hla')} t={26} punta="no" />
    <Sale p={p('citotoxicos')} x={1370} y={450}><Linfocito tono="cd8" k={0.9} /></Sale>
    <Txt x={1370} y={530} txt="CD8 muy eficaces" t={24} p={p('citotoxicos')} color={TXV.cd8} />
    <Txt x={1100} y={880} txt="la diferencia depende del virus, del huésped y de su genética" t={28} p={p('diferencia')} color={TXV.violeta} />
    <Fases cur={1} o={p('virus')} />
  </g>
);

const LAMINAS: Lamina[] = [EclipsePico, FiebreMalestar, Exantema, Ganglios, Ulceras, SetPoint, Cronica, Sida, Controladores];
export default LAMINAS;
