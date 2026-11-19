'use client';
// Capítulo 2 · El virión

import type { Lamina } from '../Lienzo';
import { Arn, Bandera, Bola, Burbujas, Capside, Cruz, Diana, Enzima, Espiga, Flecha, Flota, Frasco, Helice, Hla, IgG, Letra, Linfocito, P, Pastilla, Sale, Sol, Tijeras, Tira, Txt, TXV, Virion, Visto, easeOut, lerp, tramo } from '../Piezas';

/** Un trazo fino de la flecha al objeto (sin cabeza): la línea de llamada de las referencias. */
const Guia = ({ a, b, p, color = 'var(--cit-flecha)' }: { a: [number, number]; b: [number, number]; p: number; color?: string }) => (
  <Flecha a={a} b={b} p={p} color={color} w={4} cabeza={false} />
);

// ─── 0 · Una muñeca rusa ─────────────────────────────────────────────────────
const MunecaRusa: Lamina = ({ p, reloj }) => {
  const A = 1 - easeOut(p('capas'));
  return (
    <g>
      {/* el tamaño: 120 nm, decenas de veces menos que un linfocito */}
      <g opacity={A}>
        <Sale p={p('linfocito')} x={420} y={520}><Linfocito k={3.2} /></Sale>
        <Txt x={420} y={770} txt="linfocito" t={40} p={p('linfocito')} color={TXV.cd4} />
        <Sale p={p('tamano')} x={1050} y={520}><Virion k={0.5} reloj={reloj} /></Sale>
        <path d="M980,640 L980,660 L1120,660 L1120,640" fill="none" stroke="var(--cit-texto)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={tramo(p('nm'), 0.3, 1)} />
        <Txt x={1050} y={715} txt="120 nm" t={52} p={p('nm')} color={TXV.virus} />
        <Txt x={1050} y={800} txt="virión" t={40} p={p('tamano')} color={TXV.virus} />
        <Flecha a={[620, 360]} b={[960, 450]} c={[800, 300]} p={tramo(p('linfocito'), 0.3, 1)} color="var(--cit-flecha)" w={9} />
        <Txt x={800} y={285} txt="decenas de veces más grande" t={32} p={p('linfocito')} />
      </g>
      {/* las capas, como una muñeca rusa */}
      <g opacity={1 - A}>
        <Virion x={500} y={500} k={2.1} abre={p('capas')} matriz={p('matriz')} capside={p('capside')} arn={p('arn')} enzimas={p('enzimas')} reloj={reloj} />
        <Guia a={[1130, 225]} b={[700, 338]} p={p('envoltura')} color={P.virus[1]} />
        <Bandera x={1250} y={225} txt="envoltura" color={P.virus[0]} p={p('envoltura')} t={34} punta="no" />
        <Guia a={[1130, 385]} b={[688, 468]} p={p('matriz')} color={P.esp[1]} />
        <Bandera x={1250} y={385} txt="matriz" color={P.esp[0]} p={p('matriz')} t={34} punta="no" />
        <Guia a={[1130, 545]} b={[600, 496]} p={p('capside')} color={P.cap[1]} />
        <Bandera x={1250} y={545} txt="cápside" color={P.cap[0]} p={p('capside')} t={34} punta="no" />
        <Guia a={[1130, 705]} b={[440, 492]} p={p('arn')} color={P.arn[1]} />
        <Bandera x={1250} y={705} txt="ARN" color={P.arn[0]} p={p('arn')} t={34} punta="no" />
        <Guia a={[1130, 865]} b={[410, 512]} p={p('enzimas')} color={P.rt[1]} />
        <Bandera x={1250} y={865} txt="enzimas" color={P.rt[0]} p={p('enzimas')} t={34} punta="no" />
      </g>
    </g>
  );
};

// ─── 1 · La envoltura es robada ──────────────────────────────────────────────
const EnvolturaRobada: Lamina = ({ p, reloj }) => {
  const brota = easeOut(p('brota'));
  const sale = easeOut(p('pedazo'));
  const viaja = easeOut(p('fragil'));
  const vx = lerp(lerp(560, 720, brota), 1000, viaja), vy = lerp(lerp(520, 430, brota), 500, viaja);
  const vk = lerp(0.2, 0.95, brota) * (1 + 0.2 * viaja);
  const rota = easeOut(p('destruyen'));
  const CX = 330, CY = 650, RC = 58 * 4;
  return (
    <g>
      {/* la célula que lo fabrica, con sus HLA */}
      <Sale p={p('roba')} x={CX} y={CY}><Linfocito k={4} /></Sale>
      <Bandera x={CX} y={310} txt="la célula que lo fabrica" color={P.cd4[0]} p={p('roba')} t={30} punta="abajo" />
      {Array.from({ length: 9 }, (_, i) => {
        const a = -110 + i * 17;
        const q = tramo(p('huesped'), (i / 9) * 0.6, (i / 9) * 0.6 + 0.4);
        const ar = (a * Math.PI) / 180;
        return <Hla key={i} x={CX + Math.cos(ar) * RC} y={CY + Math.sin(ar) * RC} r={a + 90} k={2.2 * easeOut(q)} o={tramo(q, 0, 0.4)} />;
      })}
      {/* el virión brota y se lleva un pedazo de membrana */}
      {brota > 0.02 && sale < 0.98 && <path d={`M${CX + RC * 0.76},${CY - RC * 0.62} L${vx - 20},${vy + 20}`} fill="none" stroke={P.cd4[1]} strokeWidth={lerp(60, 8, sale)} strokeLinecap="round" opacity={0.9} />}
      <Virion x={vx} y={vy} k={vk} o={tramo(p('brota'), 0, 0.2)} reloj={reloj} hla={p('hla')} espigas={tramo(p('brota'), 0.5, 1)} tono={P.virus} />
      {rota > 0.01 && (
        <g transform={`translate(${vx},${vy}) scale(${vk})`} opacity={rota}>
          <circle r={118} fill="#6E6A8A" opacity={0.45} />
          <path d="M-70,-90 L-30,-40 L-60,-10 L-10,40 L-40,90 M40,-100 L20,-50 L64,-20 L30,30 L60,80" fill="none" stroke="#2A1A5A" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      <Txt x={680} y={200} txt="se lleva un pedazo de su membrana" t={30} p={p('pedazo')} color={TXV.tejido} />
      <Bandera x={760} y={285} txt="proteínas del huésped: HLA" color={P.hla[0]} p={p('hla')} t={26} punta="abajo" />
      {/* frágil fuera del cuerpo */}
      <Txt x={1000} y={150} txt="frágil fuera del cuerpo" t={44} p={p('fragil')} color={TXV.sangre} />
      <Sale p={p('jabon')} x={1330} y={250}><Burbujas k={1.5} reloj={reloj} /></Sale>
      <Txt x={1420} y={252} txt="jabón" t={34} ancla="start" p={p('jabon')} />
      <Sale p={p('alcohol')} x={1330} y={500}><Frasco k={1.2} /></Sale>
      <Txt x={1420} y={502} txt="alcohol" t={34} ancla="start" p={p('alcohol')} />
      <Sale p={p('desecacion')} x={1330} y={760}><Sol k={1.2} reloj={reloj} /></Sale>
      <Txt x={1420} y={762} txt="desecación" t={34} ancla="start" p={p('desecacion')} />
      <Flecha a={[1240, 285]} b={[1130, 430]} c={[1220, 400]} p={tramo(p('jabon'), 0.3, 1)} color={P.sangre[1]} w={9} />
      <Flecha a={[1230, 500]} b={[1150, 500]} p={tramo(p('alcohol'), 0.3, 1)} color={P.sangre[1]} w={9} />
      <Flecha a={[1240, 730]} b={[1130, 580]} c={[1220, 600]} p={tramo(p('desecacion'), 0.3, 1)} color={P.sangre[1]} w={9} />
    </g>
  );
};

// ─── 2 · Las espículas ───────────────────────────────────────────────────────
const Espiculas: Lamina = ({ p, reloj }) => {
  const ida = easeOut(tramo(p('anticuerpos'), 0, 0.5));
  const vuelta = easeOut(tramo(p('anticuerpos'), 0.5, 1));
  const gl = p('azucares');
  return (
    <g>
      {/* el virión con sus espículas, pocas */}
      <Virion x={330} y={470} k={1.15} espigas={p('espiculas')} reloj={reloj} />
      <Bandera x={330} y={250} txt="las espículas: la llave de entrada" color={P.espiga[0]} p={p('llave')} t={28} punta="abajo" />
      <Txt x={330} y={790} txt="14" t={110} p={p('catorce')} color={TXV.ambar} />
      <Txt x={330} y={885} txt="por virión, en promedio" t={30} p={p('pocas')} />
      {/* la membrana de la envoltura */}
      <g opacity={tramo(p('membrana'), 0, 0.5)}>
        <rect x={640} y={792} width={940} height={84} rx={42} fill={P.hla[0]} />
        <rect x={640} y={792} width={940} height={66} rx={33} fill={P.hla[1]} />
        {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={680 + i * 42} cy={806} r={13} fill={P.hla[2]} />)}
        {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={680 + i * 42} cy={862} r={13} fill={P.hla[0]} />)}
      </g>
      <Txt x={1100} y={935} txt="membrana de la envoltura" t={30} p={p('membrana')} color={TXV.tejido} />
      {/* un trímero: tres gp120 arriba y tres gp41 que atraviesan la membrana */}
      <Espiga x={1100} y={800} k={4.5} crece={easeOut(p('llave'))} glico={gl} />
      {gl > 0.02 && <path d="M900,640 C900,380 1300,380 1300,640" fill="none" stroke={P.hla[1]} strokeWidth={14} strokeLinecap="round" opacity={0.5 * easeOut(p('escudo'))} />}
      <Guia a={[880, 470]} b={[1040, 590]} p={p('gp120')} color={P.espiga[1]} />
      <Bandera x={770} y={470} txt="3 × gp120" color={P.espiga[0]} p={p('gp120')} t={30} punta="no" />
      <Guia a={[880, 690]} b={[1070, 720]} p={p('gp41')} color={P.espiga[1]} />
      <Bandera x={770} y={690} txt="3 × gp41" color={P.rt[0]} p={p('gp41')} t={30} punta="no" />
      <Txt x={1100} y={330} txt="un trímero" t={40} p={p('trimero')} color={TXV.violeta} />
      <Bandera x={1440} y={330} txt="azúcares: un escudo" color={P.hla[0]} p={p('azucares')} t={26} punta="no" />
      {/* los anticuerpos no llegan */}
      {[0, 1, 2].map((i) => {
        const y = 470 + i * 110;
        const x = lerp(1590, 1290, ida) + 140 * vuelta;
        return (
          <g key={i}>
            <IgG x={x} y={y} r={-90} k={1.9} o={tramo(p('anticuerpos'), 0, 0.2)} />
            <Cruz x={1260} y={y - 30} k={0.7} p={tramo(vuelta, 0.1, 0.6)} />
          </g>
        );
      })}
    </g>
  );
};

// ─── 3 · Matriz y cápside ────────────────────────────────────────────────────
const MatrizCapside: Lamina = ({ p, reloj }) => {
  const glow = 0.5 + 0.5 * Math.sin(reloj / 300);
  return (
    <g>
      <Virion x={440} y={500} k={2.0} abre={p('adentro')} matriz={p('matriz')} capside={p('capside')} reloj={reloj} />
      <Guia a={[900, 300]} b={[600, 380]} p={p('matriz')} color={P.esp[1]} />
      <Bandera x={1010} y={300} txt="matriz · p17" color={P.esp[0]} p={p('p17')} t={30} punta="no" />
      <Guia a={[900, 440]} b={[540, 480]} p={p('capside')} color={P.cap[1]} />
      <Bandera x={1010} y={440} txt="cápside · p24" color={P.cap[0]} p={p('p24')} t={30} punta="no" />
      {p('p24b') > 0.02 && <circle cx={452} cy={504} r={118 + 10 * glow} fill="none" stroke={P.espiga[1]} strokeWidth={14} opacity={0.85 * p('p24b')} />}
      {/* p de proteína, gp de glicoproteína */}
      <Sale p={p('letras')} x={1040} y={680}><Bola R={70} tono={[...P.cap]} /><Letra txt="p" t={64} /></Sale>
      <Sale p={p('letras')} x={1330} y={680}>
        <Bola R={70} tono={[...P.cap]} />
        <Letra txt="gp" t={60} />
        {Array.from({ length: 9 }, (_, i) => {
          const a = ((-150 + i * 40) * Math.PI) / 180, q = easeOut(tramo(p('azucares'), (i / 9) * 0.6, (i / 9) * 0.6 + 0.4));
          return <circle key={i} cx={Math.cos(a) * 88} cy={Math.sin(a) * 88} r={11 * q} fill={P.hla[1]} />;
        })}
      </Sale>
      <Txt x={1040} y={800} txt="proteína" t={34} p={p('significa')} />
      <Txt x={1330} y={800} txt="glicoproteína" t={34} p={p('noglico')} />
      <Bandera x={1040} y={565} txt="p24" color={P.cap[0]} p={p('significa')} t={28} punta="no" />
      <Bandera x={1330} y={565} txt="gp24" color={P.hla[0]} p={p('noglico')} t={28} punta="no" />
      <Visto x={1120} y={565} k={0.8} p={p('significa')} />
      <Cruz x={1415} y={565} k={0.8} p={p('noglico')} />
      <Sale p={p('gp')} x={1330} y={910}><Espiga k={1.1} glico={p('azucares')} /></Sale>
      <Txt x={1090} y={905} txt="solo las gp llevan azúcares" t={28} ancla="end" p={p('gp')} />
      {/* la p24 será el diagnóstico precoz y un fármaco nuevo */}
      <Sale p={p('diagnostico')} x={1110} y={125}><Tira r={80} k={0.42} pads={[P.sangre[1], '#F5E6C8', P.virus[1]]} /></Sale>
      <Txt x={1110} y={200} txt="diagnóstico precoz" t={28} p={p('diagnostico')} />
      <Sale p={p('farmaco')} x={1400} y={125}><Flota x={0} y={0} rl={reloj} alto={5}><Pastilla r={-30} k={1.3} /></Flota></Sale>
      <Txt x={1400} y={200} txt="fármaco nuevo" t={28} p={p('farmaco')} />
    </g>
  );
};

// ─── 4 · El cargamento ───────────────────────────────────────────────────────
const Cargamento: Lamina = ({ p, reloj }) => {
  const s = easeOut(p('saltar'));
  const mez = easeOut(p('mezclar'));
  return (
    <g>
      <Sale p={p('cargamento')} x={470} y={415}><Capside k={4.1} arn={p('copias')} enzimas={p('enzimas')} /></Sale>
      <Guia a={[1000, 240]} b={[390, 398]} p={p('copias')} color={P.arn[1]} />
      <Bandera x={1220} y={240} txt="2 copias de ARN · ~9 000 bases" color={P.arn[0]} p={p('copias')} t={28} punta="no" />
      <Guia a={[1000, 340]} b={[363, 419]} p={p('rt')} color={P.rt[1]} />
      <Bandera x={1220} y={340} txt="transcriptasa inversa: ARN → ADN" color={P.rt[0]} p={p('rt')} t={28} punta="no" />
      <Guia a={[1000, 440]} b={[487, 403]} p={p('integrasa')} color={P.inte[1]} />
      <Bandera x={1220} y={440} txt="integrasa: lo pega al genoma" color={P.inte[0]} p={p('integrasa')} t={28} punta="no" />
      <Guia a={[1000, 540]} b={[593, 423]} p={p('proteasa')} color={P.prot[1]} />
      <Bandera x={1220} y={540} txt="proteasa: corta y madura" color={P.prot[0]} p={p('proteasa')} t={28} punta="no" />
      {/* ¿por qué dos copias? para poder mezclarlas */}
      <Txt x={400} y={730} txt="dos ARN distintos" t={30} p={p('distintos')} color={TXV.violeta} />
      <Arn x={180} y={800} w={560} p={p('porque')} fase={reloj / 600} tono={P.arn} grosor={9} />
      <Arn x={180} y={880} w={560} p={p('porque')} fase={reloj / 600 + 2} tono={P.rt} grosor={9} />
      <Sale p={p('saltar')} x={lerp(380, 560, s)} y={lerp(800, 880, s)}><Enzima k={1.5} tono={[...P.rt]} abre={0.8} /></Sale>
      <Flecha a={[780, 840]} b={[880, 840]} p={mez} color="var(--cit-flecha)" w={10} />
      <Arn x={920} y={840} w={280} p={mez} tono={P.arn} grosor={9} />
      <Arn x={1200} y={840} w={280} p={mez} tono={P.rt} grosor={9} />
      <Txt x={1200} y={925} txt="mezclados" t={34} p={p('mezclar')} color={TXV.sangre} />
    </g>
  );
};

// ─── 5 · Cada pieza, su trabajo ──────────────────────────────────────────────
const Resumen: Lamina = ({ p, reloj }) => {
  const tres = easeOut(p('tres'));
  const blanco = p('blancos');
  const COL = [300, 800, 1300];
  const trabajo = (x: number, y: number, nombre: string, accion: string, color: string, q: number) => (
    <g>
      <Bandera x={x} y={y + 118} txt={nombre} color={color} p={q} t={28} punta="no" />
      <Txt x={x} y={y + 175} txt={accion} t={28} p={q} />
    </g>
  );
  return (
    <g>
      <Bandera x={800} y={80} txt="¿de dónde sale cada una?" color={P.hla[0]} p={p('antes')} t={34} punta="no" />
      {/* arriba: las proteínas estructurales */}
      <Sale p={p('gp120')} x={COL[0]} y={340}><Espiga k={2.4} /></Sale>
      {trabajo(COL[0], 290, 'gp120', 'se une al receptor', P.espiga[0], p('gp120'))}
      <Sale p={p('gp41')} x={COL[1]} y={290}>
        <circle cx={-42} cy={0} r={52} fill={P.hla[0]} /><circle cx={42} cy={0} r={52} fill={P.hla[0]} /><rect x={-42} y={-38} width={84} height={76} fill={P.hla[0]} />
        <circle cx={-44} cy={-3} r={44} fill={P.hla[1]} /><circle cx={40} cy={-3} r={44} fill={P.hla[1]} /><rect x={-42} y={-34} width={84} height={66} fill={P.hla[1]} />
        <path d="M-70,-28 Q-52,-52 -22,-50" fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
      </Sale>
      {trabajo(COL[1], 290, 'gp41', 'fusiona las membranas', P.hla[0], p('gp41'))}
      <Sale p={p('p24')} x={COL[2]} y={290}><Capside k={1.7} r={-14} /></Sale>
      {trabajo(COL[2], 290, 'p24', 'forma la cápside', P.cap[0], p('p24'))}
      {/* abajo: las tres enzimas */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={COL[i]} cy={660} r={110 * tres} fill={P.espiga[2]} opacity={0.55} />
      ))}
      <Sale p={p('rt')} x={COL[0]} y={655}>
        <Enzima k={2.6} tono={[...P.rt]} abre={0.6} r={-20} />
        <Arn x={-150} y={-135} w={90} grosor={6} tono={P.arn} p={1} fase={reloj / 500} />
        <Helice x={110} y={-135} w={96} amp={14} vueltas={1.4} grosor={7} />
      </Sale>
      {trabajo(COL[0], 655, 'transcriptasa inversa', 'convierte ARN en ADN', P.rt[0], p('rt'))}
      <Sale p={p('integrasa')} x={COL[1]} y={655}>
        <Enzima k={2.6} tono={[...P.inte]} abre={0.6} r={-20} />
        <Helice x={0} y={-135} w={220} amp={16} vueltas={2} grosor={7} resalta={[0.4, 0.62]} />
      </Sale>
      {trabajo(COL[1], 655, 'integrasa', 'lo integra al ADN', P.inte[0], p('integrasa'))}
      <Sale p={p('proteasa')} x={COL[2]} y={655}>
        <Tijeras k={1.0} abre={0.7} r={-90} tono={P.prot} />
        {[-110, -70, -30].map((cx, i) => <circle key={i} cx={cx - 40} cy={-135} r={13} fill={P.cap[1]} />)}
        {[50, 90, 130].map((cx, i) => <circle key={i} cx={cx + 20} cy={-135} r={13} fill={P.cap[1]} />)}
      </Sale>
      {trabajo(COL[2], 655, 'proteasa', 'madura al virus', P.prot[0], p('proteasa'))}
      {/* tres enzimas: tres blancos para los fármacos */}
      {[0, 1, 2].map((i) => <Diana key={i} x={COL[i] + 150} y={660} p={blanco} />)}
      <Txt x={800} y={955} txt="las enzimas son blancos de los fármacos" t={38} p={p('farmacos')} color={TXV.sangre} />
    </g>
  );
};

const LAMINAS: Lamina[] = [MunecaRusa, EnvolturaRobada, Espiculas, MatrizCapside, Cargamento, Resumen];
export default LAMINAS;
