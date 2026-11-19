'use client';
// Capítulo 11 · Infecciones oportunistas y VIH avanzado

import type { Lamina } from '../Lienzo';
import { Bandera, Bola, Cerebro, Corazon, Cruz, Cuerpo, Flota, FotoLente, Granuloma, Hombre, Letra, Linfocito, Medallon, P, Pastilla, Pulmones, Punto, Reloj, Sale, Trazo, TuboEnsayo, Txt, TXV, Virion, Visto, easeOut, hash, lerp, tramo } from '../Piezas';

/** Una bacteria en bastón (micobacteria). */
const Bastoncillo = ({ x, y, r = 0, k = 1, c = P.esp as readonly string[] }: { x: number; y: number; r?: number; k?: number; c?: readonly string[] }) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${k})`}>
    <rect x={-30} y={-9} width={60} height={18} rx={9} fill={c[0]} /><rect x={-27} y={-7} width={50} height={12} rx={6} fill={c[1]} /><circle cx={-14} cy={-3} r={3} fill="#FFF" opacity={0.7} />
  </g>
);

// ─── 0 · Los oportunistas y la escalera de CD4 ───────────────────────────────
const EscaleraCD4: Lamina = ({ p, reloj }) => {
  const E = [
    { n: '< 500', q: p('n500'), t: P.virus, xs: [['tuberculosis', p('tb')], ['herpes zóster', p('zoster')], ['candidiasis', p('cand')]] },
    { n: '< 200', q: p('n200'), t: P.cap, xs: [['Pneumocystis', p('pj')]] },
    { n: '< 100', q: p('n100'), t: P.hla, xs: [['toxoplasmosis cerebral', p('toxo')], ['criptococosis', p('crip')]] },
    { n: '< 50', q: p('n50'), t: P.sangre, xs: [['citomegalovirus', p('cmv')], ['complejo M. avium', p('mac')]] },
  ] as const;
  return (
    <g>
      <Txt x={800} y={90} txt="los oportunistas aprovechan la oportunidad" t={42} p={p('oportunistas')} color={TXV.violeta} />
      <Txt x={800} y={145} txt="casi nunca enferman a una persona sana" t={28} p={p('sana')} />
      <Txt x={1250} y={230} txt="en un orden bastante predecible" t={28} p={p('orden')} color={TXV.ambar} />
      {E.map((e, i) => {
        const x = 130 + i * 340, y = 360 + i * 130;
        return (
          <g key={e.n}>
            <Sale p={e.q} x={x + 150} y={(y + 930) / 2}>
              <rect x={-150} y={-(930 - y) / 2} width={300} height={930 - y} rx={26} fill={e.t[0]} /><rect x={-144} y={-(930 - y) / 2 + 4} width={288} height={930 - y - 14} rx={22} fill={e.t[1]} />
              <rect x={-120} y={-(930 - y) / 2 + 16} width={120} height={10} rx={5} fill="#FFF" opacity={0.5} />
            </Sale>
            <Txt x={x + 150} y={y + 55} txt={`CD4 ${e.n}`} t={40} p={e.q} color="#FFF" />
            {e.xs.map(([n, q], j) => <Bandera key={n as string} x={x + 150} y={y - 50 - j * 66} txt={n as string} color={e.t[0]} p={q as number} t={24} punta="no" />)}
          </g>
        );
      })}
    </g>
  );
};

// ─── 1 · Tuberculosis, con cualquier CD4 ─────────────────────────────────────
const Tuberculosis: Lamina = ({ p, reloj }) => {
  const rompe = easeOut(p('rompe'));
  return (
    <g>
      <Txt x={800} y={90} txt="tuberculosis: con cualquier recuento de CD4" t={40} p={p('tuberculosis')} color={TXV.violeta} />
      <Granuloma x={520} y={520} k={1.0} p={p('granuloma')} necrosis={1 + rompe} />
      {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return <Sale key={i} p={tramo(p('cd4'), (i / 8) * 0.6, (i / 8) * 0.6 + 0.4) * (1 - 0.8 * rompe)} x={520 + Math.cos(a) * 290} y={520 + Math.sin(a) * 270}><Linfocito k={0.4} /></Sale>; })}
      {Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * Math.PI * 2 + 0.3; return <Sale key={i} p={tramo(p('interferon'), (i / 7) * 0.6, (i / 7) * 0.6 + 0.4) * (1 - 0.7 * rompe)} x={520 + Math.cos(a) * 350} y={520 + Math.sin(a) * 320}><circle r={17} fill={P.espiga[1]} /><Letra txt="γ" t={22} color="#5A3A00" /></Sale>; })}
      <Txt x={520} y={880} txt="los CD4 y el interferón gamma sostienen el granuloma" t={26} p={p('granuloma')} />
      {Array.from({ length: 10 }, (_, i) => <Bastoncillo key={i} x={520 + (hash(i, 1) - 0.5) * 120 + (hash(i, 2) - 0.5) * 700 * rompe} y={520 + (hash(i, 3) - 0.5) * 120 + (hash(i, 4) - 0.5) * 600 * rompe} r={hash(i, 5) * 180} k={0.8 * easeOut(tramo(p('rompe'), 0, 0.3))} c={P.cap} />)}
      <Txt x={520} y={150} txt="si caen los CD4, el granuloma se rompe" t={30} p={p('rompe')} color={TXV.sangre} />
      <Bandera x={1200} y={200} txt="el VIH: el mayor factor de riesgo" color={P.sangre[0]} p={p('riesgo')} t={28} punta="no" />
      <Txt x={1200} y={260} txt="de infección latente a enfermedad" t={26} p={p('enfermedad')} />
      <Cuerpo x={1220} y={560} k={0.55}>
        <Punto x={-30} y={-170} p={p('menos')} /><Punto x={40} y={-150} p={p('extrapulmonar')} /><Punto x={-60} y={-10} p={p('extrapulmonar')} /><Punto x={50} y={80} p={p('diseminada')} /><Punto x={-20} y={190} p={p('diseminada')} />
      </Cuerpo>
      <Txt x={1220} y={870} txt="con menos CD4: fuera del pulmón y diseminada" t={24} p={p('diseminada')} color={TXV.sangre} />
      <Bandera x={1200} y={950} txt="se busca y se previene" color={P.virus[0]} p={p('busca')} t={28} punta="no" />
      <Visto x={1470} y={950} k={0.7} p={p('previene')} />
    </g>
  );
};

// ─── 2 · Kaposi y linfoma ────────────────────────────────────────────────────
const KaposiLinfoma: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="los tumores que definen el sida" t={40} p={p('tumores')} color={TXV.violeta} />
    <Cuerpo x={250} y={540} k={0.7}>
      {[[-60, 210], [50, 150], [-110, 20], [90, -60], [20, -200], [0, -250]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`} opacity={easeOut(tramo(i < 3 ? p('manchas') : p('nodulos'), (i % 3) * 0.2, (i % 3) * 0.2 + 0.5))}><ellipse rx={i < 3 ? 24 : 18} ry={i < 3 ? 17 : 14} fill="#6B1FB0" /><ellipse cx={-3} cy={-3} rx={i < 3 ? 15 : 10} ry={9} fill="#B04AE8" /></g>
      ))}
    </Cuerpo>
    <Bandera x={250} y={200} txt="sarcoma de Kaposi" color={P.inte[0]} p={p('sarcoma')} t={28} punta="no" />
    <Txt x={230} y={893} txt="manchas y nódulos violáceos" t={22} p={p('piel')} /><Txt x={230} y={925} txt="en piel y boca" t={22} p={p('piel')} />
    <Sale p={p('herpesvirus')} x={560} y={250}><Virion k={0.4} tono={P.inte} reloj={reloj} /></Sale>
    <Txt x={560} y={340} txt="herpesvirus humano 8" t={24} p={p('herpesvirus')} color={TXV.violeta} />
    <Txt x={560} y={380} txt="sin control del sistema inmunitario" t={22} p={p('controla')} color={TXV.sangre} />
    <Medallon x={800} y={640} R={230} id="kap" fondo="#F6D6E4">
      {Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={-150 + (i % 5) * 75 + (hash(i, 2) - 0.5) * 30} cy={-120 + Math.floor(i / 5) * 90 + (hash(i, 3) - 0.5) * 30} rx={44} ry={13} fill={i % 2 ? '#8A3FD0' : '#6B1FB0'} transform={`rotate(${(hash(i, 4) - 0.5) * 60} ${-150 + (i % 5) * 75} ${-120 + Math.floor(i / 5) * 90})`} opacity={easeOut(p('fusiformes'))} />)}
      {[[-60, -30], [40, 40], [-110, 70], [100, -60]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={34 * easeOut(p('hendidura'))} ry={7} fill="#FFF" opacity={0.9} />)}
      {[[-60, -30], [40, 40], [-100, 78], [96, -52], [10, -80]].map(([x, y], i) => <circle key={i} cx={x + 20} cy={y + 18} r={9 * easeOut(p('globulos'))} fill="#E5324C" />)}
    </Medallon>
    {/* la lente es un zoom: primero la piel de un paciente (manchas y nódulos) y después el corte, a gran aumento */}
    <FotoLente x={800} y={640} R={230} foto="kaposi-piel" o={tramo(p('manchas'), 0, 0.5) * (1 - tramo(p('microscopio'), 0, 0.4))} credito={[800, 906]} />
    <FotoLente x={800} y={640} R={230} foto="kaposi-corte" o={p('microscopio')} credito={[800, 906]} />
    <Txt x={440} y={955} txt="células fusiformes, hendiduras vasculares y glóbulos rojos fuera de los vasos" t={20} ancla="start" p={p('microscopio')} />
    <Txt x={1300} y={200} txt="linfomas" t={40} p={p('linfomas')} color={TXV.violeta} />
    {Array.from({ length: 6 }, (_, i) => <Sale key={i} p={tramo(p('linfoma'), i * 0.1, i * 0.1 + 0.5)} x={1200 + (i % 3) * 110} y={330 + Math.floor(i / 3) * 110}><Linfocito tono="b" k={0.6} /></Sale>)}
    <Txt x={1300} y={500} txt="de células B: difuso de células grandes y Burkitt" t={22} p={p('linfoma')} />
    <Sale p={p('cerebro')} x={1260} y={720}><Cerebro k={0.8} /></Sale>
    <Sale p={p('epstein')} x={1440} y={620}><Virion k={0.32} tono={P.cap} reloj={reloj} /></Sale>
    <Txt x={1340} y={880} txt="primario del sistema nervioso central" t={22} p={p('cerebro')} />
    <Txt x={1340} y={920} txt="ligado al virus de Epstein-Barr" t={22} p={p('epstein')} color={TXV.ambar} />
  </g>
);

// ─── 3 · Pneumocystis: el hongo y el alvéolo ─────────────────────────────────
const Pneumocystis: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="la protagonista: Pneumocystis jirovecii" t={38} p={p('protagonista')} color={TXV.violeta} />
    <Sale p={p('alveolo')} x={520} y={540}>
      <circle r={320} fill="#F6B4C8" /><circle r={296} fill="#FBE3EC" />
      {Array.from({ length: 26 }, (_, i) => { const a = (i / 26) * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a) * 308} cy={Math.sin(a) * 308} rx={17} ry={11} fill="#D970A8" transform={`rotate(${(a * 180) / Math.PI + 90} ${Math.cos(a) * 308} ${Math.sin(a) * 308})`} />; })}
    </Sale>
    <Txt x={520} y={150} txt="el alvéolo" t={30} p={p('alveolo')} />
    {Array.from({ length: 22 }, (_, i) => { const a = hash(i, 2) * Math.PI * 2, r = hash(i, 3) * 230; return <circle key={i} cx={520 + Math.cos(a) * r} cy={540 + Math.sin(a) * r} r={(14 + hash(i, 4) * 18) * easeOut(tramo(p('espumoso'), (i / 22) * 0.6, (i / 22) * 0.6 + 0.4)) * easeOut(p('llenan'))} fill="#F9C9D9" opacity={0.85} />; })}
    <Txt x={520} y={560} txt="material espumoso y rosado" t={26} p={p('espumoso')} color="#8A1F5A" />
    {Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * Math.PI * 2 + 0.2; return <g key={i} transform={`translate(${520 + Math.cos(a) * 270},${540 + Math.sin(a) * 270})`} opacity={easeOut(tramo(p('pegado'), (i / 9) * 0.6, (i / 9) * 0.6 + 0.4))}><circle r={22} fill="#C9A86A" /><circle cx={-4} cy={-4} r={16} fill="#E8D29A" /><path d="M-10,-10 Q-2,-18 8,-10" fill="none" stroke="#8A6A2A" strokeWidth={4} strokeLinecap="round" /></g>; })}
    <Bandera x={170} y={350} txt="un hongo que no invade el tejido" color={P.cap[0]} p={p('hongo')} t={24} punta="no" />
    <Bandera x={170} y={430} txt="vive pegado a los neumocitos tipo I" color={P.hla[0]} p={p('neumocitos')} t={24} punta="no" />
    <Txt x={520} y={925} txt="las paredes se inflaman" t={28} p={p('paredes')} color={TXV.sangre} />
    <Medallon x={1250} y={300} R={170} id="gms" fondo="#E6F2C8">
      {[[-60, -40], [30, -70], [70, 20], [-30, 50], [10, -5]].map(([x, y], i) => <g key={i} transform={`translate(${x},${y})`} opacity={easeOut(tramo(p('quistes'), i * 0.12, i * 0.12 + 0.5))}><circle r={34} fill="#3A2A1A" /><path d="M-18,-8 Q0,-34 18,-8" fill="none" stroke="#E8D29A" strokeWidth={5} strokeLinecap="round" /></g>)}
    </Medallon>
    <FotoLente x={1250} y={300} R={170} foto="pneumocystis-gms" o={p('plata')} credito={[1250, 503]} />
    <Txt x={1250} y={535} txt="tinción de plata: quistes" t={26} p={p('plata')} />
    <Txt x={1250} y={575} txt="como pelotas de ping-pong aplastadas" t={22} p={p('pingpong')} color={TXV.ambar} />
    <Txt x={1250} y={640} txt="lavado broncoalveolar" t={26} p={p('lavado')} />
    <Txt x={1250} y={684} txt="o esputo inducido" t={26} p={p('esputo')} />
    <Sale p={p('radiografia')} x={1250} y={820}>
      <rect x={-170} y={-100} width={340} height={200} rx={22} fill="#241062" /><g transform="scale(0.5)"><Pulmones infiltrados={p('difusos')} /></g>
    </Sale>
    <Txt x={1250} y={950} txt="infiltrados difusos en ambos pulmones" t={22} p={p('difusos')} />
  </g>
);

// ─── 4 · Tos seca, disnea e hipoxemia ────────────────────────────────────────
const TosSeca: Lamina = ({ p, reloj }) => {
  const lat = Math.sin(reloj / 280);
  return (
    <g>
      <Txt x={800} y={90} txt="tos seca, disnea e hipoxemia" t={40} p={p('seca')} color={TXV.violeta} />
      <Bandera x={420} y={200} txt="la inflamación es del intersticio" color={P.hla[0]} p={p('inflamacion')} t={28} punta="no" />
      <Txt x={420} y={255} txt="no de las vías aéreas: tos sin esputo" t={24} p={p('vias')} />
      {/* la pared del alvéolo: normal y engrosada */}
      <rect x={90} y={440} width={360} height={26} rx={13} fill="#E588B6" opacity={tramo(p('intersticio'), 0, 0.5)} />
      <rect x={570} y={440} width={360} height={26 + 90 * easeOut(p('engrosado'))} rx={20} fill="#C95A98" opacity={tramo(p('intersticio'), 0, 0.5)} />
      <Txt x={270} y={520} txt="intersticio normal" t={24} p={p('intersticio')} />
      <Txt x={750} y={600} txt="intersticio engrosado" t={26} p={p('engrosado')} color={TXV.sangre} />
      {Array.from({ length: 6 }, (_, i) => { const u = ((reloj / 2200 + i / 6) % 1); return <circle key={i} cx={130 + i * 56} cy={lerp(340, 600, u)} r={11} fill={P.cd4[1]} opacity={tramo(p('falta'), 0, 0.5) * (1 - 0.0)} />; })}
      {Array.from({ length: 6 }, (_, i) => { const u = ((reloj / 4800 + i / 6) % 1); return <circle key={i} cx={610 + i * 56} cy={lerp(340, 540, Math.min(1, u * 1.3)) + (u > 0.75 ? 0 : 0)} r={11} fill={P.cd4[1]} opacity={easeOut(p('material')) * (1 - 0.5 * u)} />; })}
      <Txt x={750} y={680} txt="material dentro del alvéolo: el oxígeno se difunde peor" t={22} p={p('difunde')} />
      <Txt x={270} y={340} txt="aire" t={22} p={p('falta')} fuerte={false} /><Txt x={270} y={640} txt="sangre" t={22} p={p('difunde')} fuerte={false} color={TXV.sangre} />
      {/* la hipoxemia y cómo se compensa */}
      <Bandera x={1180} y={230} txt="hipoxemia" color={P.sangre[0]} p={p('hipoxemia')} t={32} punta="no" />
      <Txt x={1180} y={360} txt="89 %" t={110} p={p('n89')} color={TXV.sangre} />
      <Txt x={1180} y={440} txt="saturación de oxígeno" t={26} p={p('saturacion')} />
      <Txt x={420} y={800} txt="lo compensa:" t={30} p={p('compensar')} color={TXV.ambar} />
      <Sale p={p('rapido')} x={640} y={800}><g transform={`scale(${1 + 0.1 * lat})`}><Pulmones k={0.3} /></g></Sale>
      <Txt x={800} y={800} txt="26 por minuto" t={34} ancla="start" p={p('n26')} color={TXV.violeta} />
      <Sale p={p('corazon')} x={1140} y={800}><g transform={`scale(${1 + 0.12 * Math.max(0, lat)})`}><Corazon k={0.5} /></g></Sale>
      <Txt x={1230} y={800} txt="112 por minuto" t={34} ancla="start" p={p('n112')} color={TXV.sangre} />
    </g>
  );
};

// ─── 5 · Crepitantes sin consolidación ───────────────────────────────────────
const Crepitantes: Lamina = ({ p, reloj }) => (
  <g>
    {/* dos radiografías: una neumonía bacteriana lobar y la del Pneumocystis */}
    <Sale p={p('consolidacion')} x={380} y={330}>
      <rect x={-250} y={-190} width={500} height={380} rx={26} fill="#241062" /><g transform="translate(0,10) scale(0.9)"><Pulmones /></g>
      <ellipse cx={120} cy={-30} rx={78} ry={110} fill="#FFF" opacity={0.7 * easeOut(p('lobulo'))} />
    </Sale>
    <Txt x={380} y={560} txt="neumonía bacteriana: consolidación de un lóbulo" t={24} p={p('bacteriana')} color={TXV.ambar} />
    <Sale p={p('pj')} x={1000} y={330}>
      <rect x={-250} y={-190} width={500} height={380} rx={26} fill="#241062" /><g transform="translate(0,10) scale(0.9)"><Pulmones infiltrados={p('difusa')} /></g>
    </Sale>
    <Txt x={1000} y={560} txt="Pneumocystis: difusa, afecta el intersticio de ambos pulmones" t={24} p={p('intersticio')} color={TXV.violeta} />
    {/* se oyen crepitantes finos en ambos lados */}
    <Sale p={p('oyen')} x={250} y={760}><circle r={46} fill="#8F89B8" /><circle r={34} fill="#C9C6F0" /><path d="M46,-10 C120,-60 150,40 120,100" fill="none" stroke="#8F89B8" strokeWidth={9} strokeLinecap="round" /></Sale>
    <Txt x={250} y={860} txt="crepitantes finos en ambos lados" t={26} p={p('crepitantes')} color={TXV.sangre} />
    {[0, 1, 2, 3, 4].map((i) => <Txt key={i} x={440 + i * 36} y={720 + (i % 2) * 26} txt="crr" t={22} p={tramo(p('finos'), i * 0.12, i * 0.12 + 0.4)} color={TXV.sangre} />)}
    <Txt x={700} y={880} txt="sin la condensación de un foco" t={24} p={p('foco')} />
    {/* la pérdida de peso: inflamación, fiebre, más gasto y anorexia */}
    <Bandera x={1150} y={740} txt="pérdida de peso" color={P.cap[0]} p={p('peso')} t={30} punta="no" />
    {[['inflamación crónica', 'inflamacion'], ['fiebre', 'fiebre'], ['mayor gasto de energía', 'gasto'], ['anorexia', 'anorexia']].map(([n, id], i) => (
      <Txt key={id} x={1010} y={810 + i * 40} txt={n} t={24} ancla="start" p={[p('inflamacion'), p('fiebre'), p('gasto'), p('anorexia')][i]} />
    ))}
    <Txt x={800} y={110} txt="CD4 85/µL" t={50} p={p('n85')} color={TXV.cd4} />
    <Bandera x={800} y={180} txt="una condición definitoria: sida" color={P.sangre[0]} p={p('sida')} t={30} punta="no" />
  </g>
);

// ─── 6 · Tratamiento y profilaxis ────────────────────────────────────────────
const Profilaxis: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="se trata según la guía del HHS" t={38} p={p('trata')} color={TXV.violeta} />
    <Sale p={p('tmp')} x={330} y={360}><Flota x={0} y={0} rl={reloj} alto={5}><Pastilla r={-30} k={2.2} /></Flota></Sale>
    <Bandera x={330} y={560} txt="trimetoprima-sulfametoxazol" color={P.rt[0]} p={p('tmp')} t={26} punta="no" />
    {Array.from({ length: 21 }, (_, i) => <circle key={i} cx={130 + (i % 7) * 66} cy={650 + Math.floor(i / 7) * 56} r={20 * easeOut(tramo(p('n21'), (i / 21) * 0.7, (i / 21) * 0.7 + 0.3))} fill={P.virus[1]} />)}
    <Txt x={330} y={840} txt="durante 21 días" t={32} p={p('n21')} color={TXV.verde} />
    {/* corticoides si la hipoxemia es importante */}
    <Sale p={p('corticoides')} x={800} y={360}><Pastilla r={30} k={1.8} color={[...P.cap]} /></Sale>
    <Txt x={800} y={470} txt="corticoides" t={28} p={p('corticoides')} color={TXV.ambar} />
    <Txt x={800} y={560} txt="si la hipoxemia es importante" t={24} p={p('hipoxemia')} />
    <Txt x={800} y={620} txt="PaO₂ < 70 mmHg" t={36} p={p('n70')} color={TXV.sangre} />
    <Txt x={800} y={670} txt="o gradiente alveoloarterial ≥ 35" t={22} p={p('n70')} />
    {/* profilaxis con CD4 < 200, que se suspende al recuperarse */}
    <Bandera x={1250} y={230} txt="profilaxis" color={P.hla[0]} p={p('profilaxis')} t={32} punta="no" />
    <Txt x={1250} y={310} txt="la misma combinación" t={26} p={p('misma')} />
    <Txt x={1250} y={360} txt="con CD4 < 200/µL" t={32} p={p('n200')} color={TXV.cd4} />
    <Trazo pts={[[1070, 780], [1170, 740], [1270, 640], [1380, 580], [1480, 560]]} p={p('recupera')} color={P.cd4[1]} w={13} />
    <Sale p={p('tar')} x={1170} y={880}><Pastilla r={-30} k={1.2} color={[...P.virus]} /></Sale>
    <Txt x={1235} y={880} txt="con el tratamiento antirretroviral" t={21} ancla="start" p={p('tar')} />
    <Txt x={1250} y={520} txt="se suspende al recuperarse" t={28} p={p('suspende')} color={TXV.verde} />
    <Cruz x={1450} y={470} k={0.7} p={p('suspende')} />
  </g>
);

// ─── 7 · VIH avanzado y el paquete de la OMS ─────────────────────────────────
const PaqueteOMS: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={90} txt="VIH avanzado" t={46} p={p('avanzado')} color={TXV.violeta} />
    <Bandera x={420} y={200} txt="CD4 < 200/µL" color={P.sangre[0]} p={p('n200')} t={32} punta="no" />
    <Bandera x={780} y={200} txt="o estadio clínico" color={P.hla[0]} p={p('estadio')} t={30} punta="no" />
    <Bola x={1000} y={200} R={32} tono={[...P.espiga]} o={tramo(p('e3'), 0, 0.5)} /><Txt x={1000} y={202} txt="3" t={34} p={p('e3')} color="#FFF" />
    <Bola x={1090} y={200} R={32} tono={[...P.espiga]} o={tramo(p('e4'), 0, 0.5)} /><Txt x={1090} y={202} txt="4" t={34} p={p('e4')} color="#FFF" />
    <Bandera x={800} y={330} txt="el paquete de la OMS" color={P.virus[0]} p={p('paquete')} t={36} punta="abajo" />
    <Sale p={p('paquete')} x={800} y={640}>
      <rect x={-420} y={-120} width={840} height={300} rx={30} fill={P.sombra} transform="translate(10,12)" /><rect x={-420} y={-120} width={840} height={300} rx={30} fill="#C98A3C" /><rect x={-410} y={-110} width={820} height={280} rx={26} fill="#E8B05A" />
      <rect x={-380} y={-96} width={300} height={14} rx={7} fill="#FFF" opacity={0.4} />
    </Sale>
    <Sale p={p('buscar')} x={450} y={560}><TuboEnsayo k={0.8} reloj={reloj} color={P.cap[1]} /></Sale>
    <Txt x={450} y={700} txt="buscar tuberculosis" t={22} p={p('tb')} /><Txt x={450} y={735} txt="y criptococo" t={22} p={p('crip')} />
    <Txt x={450} y={775} txt="antes de los síntomas" t={22} p={p('antes')} color={TXV.ambar} />
    <Sale p={p('profilaxis')} x={690} y={600}><Pastilla r={-30} k={1.3} color={[...P.rt]} /></Sale>
    <Txt x={690} y={700} txt="profilaxis de las" t={22} p={p('profilaxis')} /><Txt x={690} y={735} txt="infecciones frecuentes" t={22} p={p('profilaxis')} />
    <Sale p={p('iniciar')} x={930} y={600}><Pastilla r={30} k={1.3} color={[...P.virus]} /></Sale>
    <Txt x={930} y={700} txt="iniciar el tratamiento" t={22} p={p('iniciar')} /><Txt x={930} y={735} txt="antirretroviral" t={22} p={p('iniciar')} />
    <Txt x={930} y={775} txt="cuanto antes" t={22} p={p('antes2')} color={TXV.verde} />
    <Sale p={p('apoyar')} x={1170} y={580}><Hombre k={0.2} piel={P.piel2} /></Sale>
    <Txt x={1170} y={700} txt="apoyar la" t={22} p={p('adherencia')} /><Txt x={1170} y={735} txt="adherencia" t={22} p={p('adherencia')} />
    <Txt x={800} y={900} txt="quien llega tarde necesita todo" t={36} p={p('tarde')} color={TXV.sangre} />
    <Txt x={800} y={950} txt="una idea sencilla" t={26} p={p('idea')} />
  </g>
);

// ─── 8 · Síndrome inflamatorio de reconstitución inmune ──────────────────────
const SIRI: Lamina = ({ p, reloj }) => {
  const vis = easeOut(p('visible'));
  const emp = easeOut(p('empeora'));
  return (
    <g>
      <Txt x={800} y={90} txt="síndrome inflamatorio de reconstitución inmune" t={36} p={p('reconstitucion')} color={TXV.violeta} />
      <Sale p={p('primeras')} x={200} y={250}><Reloj k={0.7} ang={lerp(0, 720, p('primeras'))} /></Sale>
      <Txt x={200} y={350} txt="primeras semanas del tratamiento" t={22} p={p('primeras')} />
      <Trazo pts={[[420, 640], [540, 560], [660, 470], [780, 420]]} p={p('suben')} color={P.cd4[1]} w={13} />
      <Txt x={620} y={400} txt="los CD4 suben" t={26} p={p('suben')} color={TXV.cd4} />
      <Trazo pts={[[420, 460], [540, 520], [660, 600], [780, 660]]} p={p('baja')} color={P.sangre[1]} w={13} />
      <Txt x={640} y={720} txt="la carga viral baja" t={26} p={p('baja')} color={TXV.sangre} />
      {/* una infección escondida se vuelve visible, o una tratada empeora */}
      <Sale p={p('escondida')} x={1020} y={420}><circle r={110} fill="#F6B4C8" /><circle r={96} fill="#FBE3EC" /></Sale>
      <Bastoncillo x={1020} y={420} r={20} k={1.6} c={P.cap} />
      <circle cx={1020} cy={420} r={110 * (1 - vis)} fill="#FBE3EC" />
      <Txt x={1020} y={580} txt="una infección escondida se vuelve visible" t={22} p={p('visible')} />
      <Sale p={p('trataba')} x={1330} y={420}><circle r={110} fill="#F6B4C8" /><circle r={96} fill="#FBE3EC" /></Sale>
      <Bastoncillo x={1330} y={420} r={-10} k={1.2} c={P.cap} />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d="M0,0 Q8,-18 0,-34 Q-8,-18 0,0" fill={P.sangre[1]} transform={`translate(${1260 + i * 20},${400 + (i % 2) * 10}) rotate(${(i - 4) * 12}) scale(${emp * (0.8 + 0.4 * Math.sin(reloj / 200 + i))})`} opacity={0.9} />)}
      <Txt x={1330} y={580} txt="una ya tratada empeora" t={22} p={p('empeora')} />
      <Txt x={1190} y={680} txt="el cuerpo reacciona contra el microbio" t={30} p={p('reacciona')} color={TXV.sangre} />
      <Visto x={440} y={830} k={0.9} p={p('fallo')} />
      <Txt x={500} y={830} txt="no es un fallo del tratamiento" t={32} ancla="start" p={p('fallo')} color={TXV.verde} />
      <Bandera x={470} y={920} txt="paciente 1" color={P.cd4[0]} p={p('caso')} t={28} punta="no" />
      <Txt x={700} y={920} txt="la carga viral subió" t={26} ancla="start" p={p('subio')} color={TXV.sangre} />
      <Txt x={1040} y={920} txt="y los CD4 bajaron" t={26} ancla="start" p={p('bajaron')} color={TXV.cd4} />
    </g>
  );
};

const LAMINAS: Lamina[] = [EscaleraCD4, Tuberculosis, KaposiLinfoma, Pneumocystis, TosSeca, Crepitantes, Profilaxis, PaqueteOMS, SIRI];
export default LAMINAS;
