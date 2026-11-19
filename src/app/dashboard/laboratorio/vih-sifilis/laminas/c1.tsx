'use client';
// Capítulo 1 · VIH-1 y VIH-2 (vistazo gratis)

import type { Lamina } from '../Lienzo';
import { Africa, Arn, Bandera, Bola, Caracol, Cerrojo, Cruz, Cuerpo, En, Escudo, Flecha, Flota, Ganglio, Helice, Hombre, Letra, Linfocito, Llave, Macrofago, Medalla, Mundo, Nota, P, Pastilla, Persona, Pulmones, Reloj, Sale, Simio, Trazo, Txt, TXV, Virion, Visto, easeOut, hash, lerp, tramo } from '../Piezas';

// ─── 0 · Marcha atrás ────────────────────────────────────────────────────────
const MarchaAtras: Lamina = ({ p, reloj }) => {
  const habitual = easeOut(p('habitual'));
  const A = 1 - easeOut(p('lenti'));
  return (
    <g>
      {/* la idea, en grande: «retro» = marcha atrás */}
      <g opacity={(1 - habitual) * A}>
        <Bandera x={800} y={280} txt="retrovirus" color={P.virus[0]} p={p('retro')} t={80} punta="no" />
        <Flecha a={[1050, 470]} b={[550, 470]} c={[800, 880]} p={p('atras')} color={P.sangre[1]} w={28} />
        <Txt x={800} y={800} txt="marcha atrás" t={64} p={p('atras')} color={TXV.sangre} />
      </g>
      {/* lo habitual: del ADN al ARN. Este virus: del ARN al ADN */}
      <g opacity={A}>
        <Bandera x={330} y={150} txt="lo habitual" color={P.cd4[0]} p={p('habitual')} t={34} punta="abajo" />
        <Helice x={330} y={300} w={300} amp={34} vueltas={2.2} p={p('adn')} fase={reloj / 700} />
        <Txt x={330} y={395} txt="ADN" t={40} p={p('adn')} color={TXV.adn} />
        <Flecha a={[520, 300]} b={[680, 300]} p={p('arn')} color={P.cd4[1]} w={16} />
        <Arn x={730} y={300} w={300} p={p('arn')} fase={reloj / 500} />
        <Txt x={880} y={395} txt="ARN" t={40} p={p('arn')} color={TXV.sangre} />
        <Bandera x={800} y={560} txt="este virus hace lo contrario" color={P.sangre[0]} p={p('contrario')} t={34} punta="no" />
        <Sale p={p('genoma')} x={1290} y={720} k={0.95}><Virion abre={1} capside={1} arn={1} reloj={reloj} /></Sale>
        <Arn x={760} y={720} w={300} p={p('genoma')} fase={reloj / 500 + 1} />
        <Txt x={910} y={815} txt="ARN" t={40} p={p('genoma')} color={TXV.sangre} />
        <Flecha a={[730, 720]} b={[520, 720]} p={p('copia')} color={P.sangre[1]} w={18} />
        <Txt x={625} y={668} txt="copia" t={28} p={p('copia')} color={TXV.sangre} />
        <Helice x={330} y={720} w={300} amp={34} vueltas={2.2} p={p('adn2')} fase={reloj / 700 + 2} />
        <Txt x={330} y={815} txt="ADN" t={40} p={p('adn2')} color={TXV.adn} />
      </g>
      {/* lentivirus: lento, años, el escudo que se desarma */}
      <Bandera x={800} y={130} txt="lentivirus" color={P.virus[0]} p={p('lenti')} t={56} punta="no" />
      <Sale p={p('lento')} x={330} y={520} k={1.5}><Caracol reloj={reloj} /></Sale>
      <Txt x={330} y={740} txt="lenti = lento" t={44} p={p('lento')} color={TXV.verde} />
      <Sale p={p('anos')} x={800} y={500} k={2.1}><Reloj ang={lerp(0, 1440, p('anos'))} /></Sale>
      <Txt x={800} y={730} txt="años sin tratamiento" t={40} p={p('anos')} />
      <Flecha a={[960, 500]} b={[1090, 500]} p={tramo(p('anos'), 0.2, 0.8)} color="var(--cit-flecha)" w={12} />
      <Sale p={p('anos')} x={1290} y={510} k={1.9}><Escudo rotura={tramo(p('anos'), 0.35, 1)} id="esc10" /></Sale>
      <Txt x={1290} y={800} txt="sistema inmunitario" t={36} p={p('anos')} color={TXV.cd4} />
    </g>
  );
};

// ─── 1 · Del simio al humano ─────────────────────────────────────────────────
const DelSimio: Lamina = ({ p, reloj }) => {
  const fin = 1 - easeOut(p('grupos'));
  const gr = (i: number) => easeOut(tramo(p('distinto'), i * 0.2, i * 0.2 + 0.4));
  const M = easeOut(p('pandemia'));
  const GRUPOS: { l: string; quien: 'chimpance' | 'gorila' }[] = [{ l: 'M', quien: 'chimpance' }, { l: 'N', quien: 'chimpance' }, { l: 'O', quien: 'gorila' }, { l: 'P', quien: 'gorila' }];
  return (
    <g>
      <Africa x={330} y={180} k={2.2} o={easeOut(p('simios'))} />
      <Bandera x={790} y={430} txt="África central" color={P.virus[0]} p={p('vih1')} t={26} punta="abajo" />
      <Sale p={p('chimpance')} x={700} y={590}><Flota x={0} y={0} rl={reloj} alto={5}><Simio quien="chimpance" k={0.9} /></Flota></Sale>
      <Sale p={p('gorila')} x={860} y={680}><Flota x={0} y={0} rl={reloj} fase={1.5} alto={5}><Simio quien="gorila" k={0.9} /></Flota></Sale>
      {/* VIH-1: un salto a los humanos hace cerca de un siglo */}
      <g opacity={fin}>
        <Bandera x={1215} y={330} txt="VIH-1" color={P.virus[0]} p={p('vih1')} t={34} punta="abajo" />
        <Sale p={p('salto')} x={1215} y={490}><Hombre k={0.3} piel={P.piel2} /></Sale>
        <Flecha a={[830, 560]} b={[1120, 480]} c={[980, 380]} p={tramo(p('salto'), 0, 0.9)} color={P.virus[1]} w={16} />
        <Sale p={p('siglo')} x={1215} y={760}><Reloj k={0.9} ang={lerp(0, 1080, p('siglo'))} /></Sale>
        <Txt x={1215} y={860} txt="hace cerca de un siglo" t={28} p={p('siglo')} />
      </g>
      {/* VIH-2: el mangabey, en África occidental */}
      <Bandera x={470} y={410} txt="África occidental" color={P.hla[0]} p={p('occidental')} t={26} punta="abajo" />
      <Bandera x={200} y={470} txt="VIH-2" color={P.hla[0]} p={p('vih2')} t={34} punta="abajo" />
      <Sale p={p('vih2')} x={200} y={630}><Hombre k={0.3} piel={P.piel2} pelo="#3A1B8E" /></Sale>
      <Sale p={p('mangabey')} x={540} y={540}><Flota x={0} y={0} rl={reloj} fase={3} alto={5}><Simio quien="mangabey" k={0.8} /></Flota></Sale>
      <Flecha a={[470, 560]} b={[300, 620]} c={[380, 480]} p={tramo(p('mangabey'), 0.3, 1)} color={P.hla[1]} w={14} />
      {/* cada grupo es un salto distinto */}
      <Bandera x={1330} y={140} txt="cada grupo, un salto" color={P.hla[0]} p={p('grupos')} t={30} punta="no" />
      {GRUPOS.map((g, i) => {
        const q = gr(i), y = 290 + i * 150, esM = i === 0;
        const k = 1 + 0.2 * M * (esM ? 1 : 0);
        const tono = esM ? P.sangre : P.hla;
        return (
          <g key={g.l}>
            {esM && M > 0.01 && <circle cx={1290} cy={y} r={125 * M} fill={P.espiga[2]} opacity={0.5} />}
            <Sale p={q} x={1130} y={y} k={k}><Simio quien={g.quien} k={0.42} /></Sale>
            <Flecha a={[1200, y]} b={[1370, y]} p={tramo(q, 0.3, 1)} color={tono[1]} w={esM ? 17 : 11} />
            <Sale p={q} x={1285} y={y - 42}><Bola R={24} tono={[...tono]} /><Letra txt={g.l} t={30} /></Sale>
            <Sale p={q} x={1450} y={y} k={0.28 * k}><Hombre piel={P.piel2} /></Sale>
          </g>
        );
      })}
      <Sale p={p('pandemia')} x={1470} y={905}><Mundo k={0.95} /></Sale>
      <Txt x={1255} y={905} txt="pandemia" t={38} p={p('pandemia')} color={TXV.sangre} />
      <Flecha a={[1500, 330]} b={[1530, 820]} c={[1590, 560]} p={tramo(p('pandemia'), 0.2, 1)} color={P.sangre[1]} w={11} />
    </g>
  );
};

// ─── 2 · Una familia, no un virus ────────────────────────────────────────────
const HOJAS: { n: string; tono: readonly string[] }[] = [
  { n: 'A', tono: P.cd4 }, { n: 'B', tono: P.virus }, { n: 'C', tono: P.espiga }, { n: 'D', tono: P.hla }, { n: 'F', tono: P.rt },
  { n: 'G', tono: P.esp }, { n: 'H', tono: P.sangre }, { n: 'J', tono: P.inte }, { n: 'K', tono: P.menta },
];
const MC: [number, number] = [520, 340];
const hoja = (i: number): [number, number] => { const a = ((-60 + i * 15) * Math.PI) / 180; return [MC[0] + 330 * Math.cos(a), MC[1] + 330 * Math.sin(a)]; };

const Familia: Lamina = ({ p, reloj }) => {
  const NODOS: { n: string; y: number; q: number; R: number }[] = [
    { n: 'M', y: 340, q: p('gm'), R: 56 }, { n: 'N', y: 520, q: p('gn'), R: 38 }, { n: 'O', y: 650, q: p('go'), R: 38 }, { n: 'P', y: 780, q: p('gp'), R: 38 },
  ];
  const m = easeOut(p('grupoM'));
  const sube = easeOut(p('resalta'));
  const [rx, ry] = [990, 400];
  return (
    <g>
      <Sale p={p('familia')} x={170} y={520} k={0.7}><Virion reloj={reloj} /></Sale>
      <Bandera x={170} y={660} txt="VIH-1" color={P.virus[0]} p={p('familia')} t={32} punta="no" />
      {NODOS.map((nd) => (
        <g key={nd.n}>
          <Flecha a={[250, 520]} b={[520 - nd.R - 6, nd.y]} c={[380, nd.y]} p={nd.q} color={P.cd4[1]} w={9} cabeza={false} />
          <Sale p={nd.q} x={520} y={nd.y} k={nd.n === 'M' ? 1 + 0.22 * m : 1}>
            {nd.n === 'M' && m > 0.01 && <circle r={nd.R + 24 * m} fill={P.espiga[2]} opacity={0.5} />}
            <Bola R={nd.R} tono={[...(nd.n === 'M' ? P.virus : P.hla)]} />
            <Letra y={2} txt={nd.n} t={nd.n === 'M' ? 54 : 38} />
          </Sale>
        </g>
      ))}
      <Txt x={520} y={436} txt="el principal" t={28} p={p('grupoM')} color={TXV.verde} />
      {/* los subtipos del grupo M */}
      {HOJAS.map((h, i) => {
        const f = easeOut(tramo(p('subtipos'), i * 0.08, i * 0.08 + 0.4));
        const [hx, hy] = hoja(i);
        const esB = h.n === 'B';
        return (
          <g key={h.n}>
            <Flecha a={[MC[0] + 60, MC[1]]} b={[hx - 32, hy]} p={f} color={h.tono[1]} w={5} cabeza={false} />
            <Sale p={f} x={hx} y={hy} k={esB ? 1 + 0.35 * sube : 1}>
              {esB && sube > 0.01 && <circle r={30 + 20 * sube} fill={P.espiga[2]} opacity={0.55} />}
              <Bola R={30} tono={[...h.tono]} />
              <Letra y={1} txt={h.n} t={28} />
            </Sale>
          </g>
        );
      })}
      {/* formas recombinantes: mitad y mitad */}
      <Flecha a={[hoja(3)[0] + 30, hoja(3)[1] + 10]} b={[rx - 36, ry - 14]} p={p('recomb')} color={P.hla[1]} w={5} cabeza={false} />
      <Flecha a={[hoja(5)[0] + 30, hoja(5)[1] - 10]} b={[rx - 36, ry + 14]} p={p('recomb')} color={P.esp[1]} w={5} cabeza={false} />
      <Sale p={p('recomb')} x={rx} y={ry}>
        <path d="M0,-34 A34,34 0 0 0 0,34 Z" fill={P.hla[1]} /><path d="M0,-34 A34,34 0 0 1 0,34 Z" fill={P.esp[1]} />
        <circle r={34} fill="none" stroke="#FFF" strokeWidth={4} opacity={0.5} /><path d="M-22,-16 Q-12,-28 4,-30" fill="none" stroke="#FFF" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
      </Sale>
      <Txt x={rx} y={ry + 70} txt="recombinante" t={28} p={p('recomb')} color={TXV.violeta} />
      {/* América y Europa: predomina el B */}
      <Sale p={p('america')} x={1300} y={290}><Mundo k={1.5} /></Sale>
      <Bandera x={1200} y={470} txt="América" color={P.cd4[0]} p={p('america')} t={26} punta="no" />
      <Bandera x={1400} y={470} txt="Europa" color={P.hla[0]} p={p('europa')} t={26} punta="no" />
      <Flecha a={[hoja(1)[0] + 50, hoja(1)[1] - 6]} b={[1170, 215]} c={[980, 100]} p={p('resalta')} color={P.espiga[1]} w={12} />
      <Txt x={980} y={150} txt="predomina el B" t={30} p={p('resalta')} color={TXV.ambar} />
      {/* la diversidad nace de los errores al copiarse */}
      <Txt x={1080} y={735} txt="copiar el genoma" t={28} p={p('errores')} color={TXV.violeta} />
      {Array.from({ length: 9 }, (_, i) => {
        const px = 900 + i * 45, malo = i === 5;
        const qa = easeOut(tramo(p('errores'), (i / 9) * 0.6, (i / 9) * 0.6 + 0.4));
        const qb = easeOut(tramo(p('copiarse'), (i / 9) * 0.6, (i / 9) * 0.6 + 0.4));
        return (
          <g key={i}>
            <rect x={px - 3} y={800} width={6} height={70 * qb} fill={P.cd4[2]} opacity={0.8} />
            <circle cx={px} cy={800} r={14 * qa} fill={P.cd4[1]} /><circle cx={px - 4} cy={796} r={4 * qa} fill="#FFF" opacity={0.7} />
            <circle cx={px} cy={870} r={14 * qb} fill={malo ? P.sangre[1] : P.cd4[1]} />
          </g>
        );
      })}
      <Cruz x={1125} y={930} k={0.8} p={tramo(p('copiarse'), 0.7, 1)} />
      <Txt x={1190} y={932} txt="error" t={28} ancla="start" p={tramo(p('copiarse'), 0.7, 1)} color={TXV.sangre} />
      {/* y por eso, la resistencia a los fármacos */}
      <Sale p={p('resistencia')} x={1450} y={810} k={1.5}><Pastilla r={-30} /></Sale>
      <Cruz x={1500} y={760} k={0.9} p={tramo(p('resistencia'), 0.4, 1)} />
      <Txt x={1450} y={910} txt="resistencia" t={32} p={p('resistencia')} color={TXV.sangre} />
    </g>
  );
};

// ─── 3 · VIH-1 frente a VIH-2 ────────────────────────────────────────────────
const Contraste: Lamina = ({ p, reloj }) => {
  const X1 = 470, X2 = 1130;
  const filas = 1 - easeOut(p('detalle'));
  const dos = p('dos');
  const barra = (cx: number, val: number, color: string, txt: string) => (
    <g>
      <rect x={cx - 170} y={540} width={340} height={40} rx={20} fill="var(--vas-suave)" />
      <rect x={cx - 170} y={540} width={Math.max(0.1, 340 * val * easeOut(p('cargas')))} height={40} rx={20} fill={color} />
      <Txt x={cx + 190} y={560} txt={txt} t={28} ancla="start" p={p('cargas')} color={TXV.sangre} />
    </g>
  );
  const e = easeOut(p('efavirenz'));
  const sacude = (1 - e) * Math.sin(e * 25) * 10;
  return (
    <g>
      <g opacity={filas}>
        <Sale p={dos} x={X1} y={170} k={0.55}><Virion reloj={reloj} /></Sale>
        <Sale p={dos} x={X2} y={170} k={0.55}><Virion reloj={reloj + 400} tono={P.inte} /></Sale>
        <Bandera x={X1} y={290} txt="VIH-1" color={P.virus[0]} p={dos} t={34} punta="no" />
        <Bandera x={X2} y={290} txt="VIH-2" color={P.inte[0]} p={dos} t={34} punta="no" />
        {/* se transmite menos */}
        <Txt x={800} y={405} txt="transmisión" t={28} p={p('menos')} fuerte={false} />
        {[X1, X2].map((cx, v) => (
          <g key={cx}>
            <Sale p={p('menos')} x={cx - 190} y={405}><Bola R={30} tono={[...P.sangre]} /></Sale>
            {Array.from({ length: 4 }, (_, i) => {
              const tx = cx - 60 + i * 80, inf = i < (v === 0 ? 4 : 1);
              const q = tramo(p('menos'), 0.2 + i * 0.15, 0.55 + i * 0.15);
              return (
                <g key={i}>
                  {inf && <Flecha a={[cx - 160, 395]} b={[tx - 26, 395]} c={[(cx - 160 + tx - 26) / 2, 395 - 40 - i * 18]} p={q} color={P.sangre[1]} w={7} />}
                  <Sale p={q} x={tx} y={405}><Bola R={24} tono={inf ? [...P.sangre] : ['#8F89B8', '#BDB4DD', '#E6E0F7']} /></Sale>
                </g>
              );
            })}
          </g>
        ))}
        {/* cargas virales más bajas */}
        <Txt x={800} y={560} txt="carga viral" t={28} p={p('cargas')} fuerte={false} />
        {barra(X1, 0.92, P.sangre[1], 'alta')}
        {barra(X2, 0.22, P.virus[1], 'baja')}
        {/* progresa más despacio */}
        <Txt x={800} y={740} txt="progresión" t={28} p={p('progresa')} fuerte={false} />
        <path d="M290,640 L290,830 L660,830 M950,640 L950,830 L1520,830" fill="none" stroke="var(--cit-texto-2)" strokeWidth={4} strokeLinecap="round" opacity={0.45} />
        <Trazo pts={[[300, 690], [380, 740], [480, 790], [640, 800]]} p={p('progresa')} color={P.sangre[1]} w={12} />
        <Txt x={470} y={868} txt="años" t={30} p={p('progresa')} color={TXV.sangre} />
        <Trazo pts={[[960, 690], [1130, 712], [1300, 736]]} p={p('progresa')} color={P.virus[1]} w={12} />
        <Trazo pts={[[1300, 736], [1400, 750], [1500, 764]]} p={p('decadas')} color={P.virus[1]} w={12} />
        <Txt x={1230} y={868} txt="décadas sin enfermar" t={30} p={p('decadas')} color={TXV.verde} />
      </g>
      {/* resistente a los inhibidores no nucleósidos */}
      <Bandera x={800} y={130} txt="resistente por naturaleza" color={P.sangre[0]} p={p('resistente')} t={40} punta="no" />
      <Sale p={p('resistente')} x={X1} y={450} k={1.5}><Cerrojo forma={1} /></Sale>
      <Sale p={p('resistente')} x={X2} y={450} k={1.5}><Cerrojo forma={2} tono={P.inte} /></Sale>
      <Txt x={X1} y={250} txt="VIH-1" t={40} p={p('resistente')} color={TXV.virus} />
      <Txt x={X2} y={250} txt="VIH-2" t={40} p={p('resistente')} color={TXV.violeta} />
      <Txt x={800} y={940} txt="inhibidores no nucleósidos de la transcriptasa inversa" t={26} p={p('inhibidores')} fuerte={false} />
      <Llave x={X1} y={lerp(790, 505, e)} r={-90} forma={1} o={tramo(p('inhibidores'), 0, 0.5)} />
      <Llave x={X2} y={lerp(790, 625, e)} r={-90 + sacude} forma={1} o={tramo(p('inhibidores'), 0, 0.5)} />
      <Visto x={X1 + 150} y={420} p={tramo(p('efavirenz'), 0.6, 1)} />
      <Cruz x={X2 + 150} y={420} p={tramo(p('efavirenz'), 0.6, 1)} />
      <Txt x={800} y={840} txt="efavirenz" t={36} p={p('efavirenz')} color={TXV.ambar} />
      <Txt x={800} y={890} txt="nevirapina" t={36} p={p('nevirapina')} color={TXV.ambar} />
      <Txt x={800} y={450} txt="¿cuál es?" t={52} p={p('distinguir')} color={TXV.sangre} />
    </g>
  );
};

// ─── 4 · De un puñado de casos al virus ──────────────────────────────────────
const Hallazgo: Lamina = ({ p, reloj }) => {
  const avance = 0.2 * p('a1981') + 0.35 * p('a1983') + 0.45 * p('a2008');
  const lesiones: [number, number][] = [[-48, 200], [40, 150], [-30, 262], [-120, -10], [10, -80], [62, 240]];
  return (
    <g>
      <rect x={140} y={800} width={1320} height={14} rx={7} fill="var(--cit-texto-2)" opacity={0.3} />
      <rect x={140} y={800} width={Math.max(0.1, 1320 * avance)} height={14} rx={7} fill={P.hla[1]} />
      {[['1981', 330, p('a1981')], ['1983', 800, p('a1983')], ['2008', 1270, p('a2008')]].map(([a, x, q]) => (
        <g key={String(a)}>
          <Sale p={q as number} x={x as number} y={807}><circle r={24} fill={P.hla[0]} /><circle cx={-2} cy={-2} r={19} fill={P.hla[1]} /><circle cx={-8} cy={-8} r={6} fill="#FFF" opacity={0.7} /></Sale>
          <Txt x={x as number} y={880} txt={a as string} t={60} p={q as number} color={TXV.violeta} />
        </g>
      ))}
      {/* 1981: casos raros en Estados Unidos */}
      <Txt x={330} y={690} txt="Estados Unidos" t={32} p={p('eeuu')} />
      <Txt x={330} y={738} txt="hombres jóvenes, antes sanos" t={28} p={p('jovenes')} fuerte={false} />
      <Sale p={p('kaposi')} x={200} y={440}>
        <Cuerpo k={0.55}>
          {lesiones.map(([lx, ly], i) => <g key={i} transform={`translate(${lx},${ly})`}><ellipse rx={20} ry={14} fill="#6B1FB0" /><ellipse cx={-3} cy={-3} rx={13} ry={8} fill="#B04AE8" /></g>)}
        </Cuerpo>
      </Sale>
      <Bandera x={210} y={240} txt="sarcoma de Kaposi" color={P.inte[0]} p={p('kaposi')} t={22} punta="abajo" />
      <Sale p={p('neumonia')} x={450} y={440}><Pulmones infiltrados={p('neumonia')} k={0.8} /></Sale>
      <Bandera x={530} y={240} txt="neumonía por Pneumocystis" color={P.rt[0]} p={p('neumonia')} t={22} punta="abajo" />
      {/* 1983: Francia, un ganglio, un virus */}
      <Bandera x={800} y={150} txt="Francia" color={P.cd4[0]} p={p('francia')} t={34} punta="no" />
      <Sale p={p('francois')} x={625} y={510}><Persona quien="mujer" k={0.26} /></Sale>
      <Txt x={625} y={645} txt="Barré-Sinoussi" t={26} p={p('francois')} />
      <Sale p={p('luc')} x={975} y={510}><Persona quien="hombre" k={0.26} /></Sale>
      <Txt x={975} y={645} txt="Montagnier" t={26} p={p('luc')} />
      <Sale p={p('aislan')} x={800} y={300}><Virion k={0.4} reloj={reloj} /></Sale>
      <Sale p={p('ganglio')} x={800} y={510} k={1.25}><Ganglio /></Sale>
      <Flecha a={[800, 430]} b={[800, 352]} p={tramo(p('ganglio'), 0.3, 1)} color="var(--cit-flecha)" w={9} />
      <Txt x={800} y={605} txt="ganglio linfático" t={26} p={p('ganglio')} fuerte={false} />
      {/* 2008: el Nobel */}
      <Sale p={p('nobel')} x={1270} y={470}><Flota x={0} y={0} rl={reloj} alto={6}><Medalla k={1.1} /></Flota></Sale>
      <Txt x={1270} y={680} txt="Nobel de Medicina" t={34} p={p('nobel')} color={TXV.ambar} />
    </g>
  );
};

// ─── 5 · Atacar al director de orquesta ──────────────────────────────────────
const Director: Lamina = ({ p, reloj }) => {
  const cae = easeOut(p('cae'));
  const des = easeOut(p('desordena'));
  const R = easeOut(p('camino'));
  const orq = 1 - R;
  const bate = Math.sin(reloj / 260) * 14 * (1 - cae);
  const musicos: { id: string; x: number; y: number; q: number; txt: string }[] = [
    { id: 'b', x: 360, y: 700, q: p('b'), txt: 'linfocitos B' },
    { id: 'c', x: 800, y: 800, q: p('citotoxicos'), txt: 'citotóxicos' },
    { id: 'm', x: 1240, y: 700, q: p('macrofagos'), txt: 'macrófagos' },
  ];
  const desv = (i: number): [number, number, number] => [(hash(i, 3) - 0.5) * 260 * des, (hash(i, 4) - 0.2) * 140 * des, (hash(i, 5) - 0.5) * 80 * des];
  return (
    <g>
      <g opacity={orq}>
        <Bandera x={800} y={150} txt="linfocito T CD4: el director" color={P.cd4[0]} p={p('linfocito')} t={34} punta="no" />
        <Sale p={p('director')} x={800} y={600}><rect x={-120} y={-10} width={240} height={58} rx={14} fill={P.interior} /><rect x={-120} y={-10} width={240} height={20} rx={10} fill={P.inte[1]} /></Sale>
        <En x={800} y={440 + 170 * cae} r={-72 * cae} o={tramo(p('director'), 0, 0.4) * (1 - 0.45 * cae)}>
          <Linfocito k={1.45} />
          <Letra y={30} txt="CD4" t={40} />
          <g transform={`translate(78,-34) rotate(${bate - 25})`} opacity={1 - cae}><rect x={0} y={-5} width={120} height={9} rx={4.5} fill="#FFF" /><circle cx={0} cy={0} r={11} fill={P.cd4[2]} /></g>
        </En>
        {/* el virus que lo ataca */}
        <Sale p={p('director')} x={lerp(1260, 960, easeOut(tramo(p('cae'), 0, 0.8)))} y={lerp(230, 400, easeOut(tramo(p('cae'), 0, 0.8)))}><Virion k={0.4} reloj={reloj} /></Sale>
        <Cruz x={800} y={380} p={tramo(p('cae'), 0.5, 1)} k={1.2} />
        {/* la orquesta */}
        {musicos.map((mu, i) => {
          const [dx, dy, dr] = desv(i);
          return (
            <g key={mu.id}>
              <Sale p={mu.q} x={mu.x + dx} y={mu.y + dy} r={dr}>
                {mu.id === 'b' ? <Linfocito tono="b" k={1.1} /> : mu.id === 'c' ? <Linfocito tono="cd8" k={1.1} /> : <Macrofago k={0.9} />}
              </Sale>
              <Txt x={mu.x} y={mu.y + (mu.id === 'm' ? 142 : 98)} txt={mu.txt} t={30} p={mu.q} color={mu.id === 'b' ? TXV.ab : mu.id === 'c' ? TXV.cd8 : TXV.mac} />
              {[0, 1].map((j) => {
                const nx = mu.x + (j ? 70 : -70) + (hash(i * 2 + j, 8) - 0.5) * 300 * des, ny = mu.y - 120 - j * 24 + Math.sin(reloj / 400 + i + j) * 8 + (hash(i * 2 + j, 9) - 0.5) * 260 * des;
                return <Nota key={j} x={nx} y={ny} k={1.1} r={(hash(i * 2 + j, 10) - 0.5) * 160 * des} o={tramo(mu.q, 0.3, 1)} color={des > 0.3 ? '#9A92B8' : [P.hla[1], P.cd4[1], P.espiga[1]][i]} />;
              })}
            </g>
          );
        })}
        <Txt x={800} y={940} txt="se desordena toda la orquesta" t={36} p={p('desordena')} color={TXV.sangre} />
      </g>
      {/* el camino del laboratorio */}
      <Bandera x={800} y={200} txt="el camino del laboratorio" color={P.virus[0]} p={p('camino')} t={40} punta="no" />
      {[['virus', 260], ['célula', 600], ['tejido', 940], ['paciente', 1280]].map(([nombre, x], i) => {
        const q = [p('rv'), p('rc'), p('rt'), p('rp')][i];
        return (
          <g key={nombre}>
            <Sale p={q} x={x as number} y={500}>
              {i === 0 ? <Virion k={0.6} reloj={reloj} /> : i === 1 ? <Linfocito k={1.2} /> : i === 2 ? <Ganglio k={1.6} /> : <Hombre k={0.3} />}
            </Sale>
            <Txt x={x as number} y={680} txt={nombre as string} t={40} p={q} color={[TXV.virus, TXV.cd4, TXV.violeta, TXV.sangre][i]} />
            {i < 3 && <Flecha a={[(x as number) + 110, 500]} b={[(x as number) + 230, 500]} p={tramo([p('rc'), p('rt'), p('rp')][i], 0, 0.8)} color="var(--cit-flecha)" w={12} />}
          </g>
        );
      })}
    </g>
  );
};

const LAMINAS: Lamina[] = [MarchaAtras, DelSimio, Familia, Contraste, Hallazgo, Director];
export default LAMINAS;
