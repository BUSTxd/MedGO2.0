'use client';
// Capítulo 7 · Reparar la barrera.

import type { Lamina } from '../Lienzo';
import { Bacilo, Bandera, Cruz, En, Flecha, FLECHA, G, Intestino, Pastilla, PildoraFlota, Sale, TXT_FARMACO, TXTC, Txt, clamp, easeOut, hash, tramo } from '../Piezas';

/** Cripta en «U»: dos columnas de células con las madre en la base, los progenitores a media altura y las maduras arriba.
 *  `migra` 0-1 las sube; `luz` las suelta hacia la luz. `muertas` 0-1 apaga las que se dividen (quimioterapia). */
function Cripta({ x = 800, y = 860, k = 1, migra = 0, luz = 0, madre = 1, prog = 1, muertas = 0, clu = 0 }: { x?: number; y?: number; k?: number; migra?: number; luz?: number; madre?: number; prog?: number; muertas?: number; clu?: number }) {
  const celulas: { cx: number; cy: number; z: 0 | 1 | 2 }[] = [];
  for (let i = 0; i < 9; i++) {
    const cy = -i * 56;
    const z: 0 | 1 | 2 = i < 2 ? 0 : i < 6 ? 1 : 2;
    celulas.push({ cx: -110, cy, z }, { cx: 110, cy, z });
  }
  for (const cx of [-55, 0, 55]) celulas.push({ cx, cy: 52, z: 0 });
  const col = [['#B07A00', '#FFD23F', '#FFF0A8'], ['#8A1FB8', '#E26AE0', '#F7B7F7'], ['#4B0F7A', '#8A2BB8', '#C58AE8']];
  return (
    <En x={x} y={y} k={k}>
      <rect x={-64} y={-480} width={128} height={500} rx={64} fill="#FFF1B8" opacity={0.85} />
      {celulas.map((c, i) => {
        const sube = c.z === 2 ? -80 * clamp(luz) * (1 + hash(i, 3)) : 0;
        const mov = c.z === 1 ? -22 * easeOut(clamp(migra)) : 0;
        const muerta = c.z === 1 ? clamp(muertas) : 0;
        const o = (c.z === 0 ? clamp(madre) : c.z === 1 ? clamp(prog) : 1) * (c.z === 2 ? 1 - 0.8 * clamp(luz) : 1);
        const cc = muerta > 0.5 ? ['#3A2A4A', '#5A4A6A', '#8A7A9A'] : col[c.z];
        return (
          <g key={i} opacity={o}>
            <circle cx={c.cx + 5} cy={c.cy + mov + sube + 6} r={34} fill={G.sombra} />
            <circle cx={c.cx} cy={c.cy + mov + sube} r={34} fill={cc[0]} /><circle cx={c.cx - 3} cy={c.cy + mov + sube - 3} r={29} fill={cc[1]} /><circle cx={c.cx - 10} cy={c.cy + mov + sube - 11} r={7} fill={cc[2]} opacity={0.85} />
            {c.z === 1 && clu > 0.01 && i % 3 === 0 && <circle cx={c.cx} cy={c.cy + mov} r={38} fill="none" stroke="#2FB98A" strokeWidth={6} opacity={clamp(clu)} />}
          </g>
        );
      })}
    </En>
  );
}

const Renueva: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="Una barrera que se renueva" color="var(--cit-base)" p={p('cripta')} t={34} punta="no" />
      <Cripta y={840} migra={p('migran')} luz={p('luz')} madre={tramo(p('madre'), 0, 0.4)} prog={tramo(p('progenitores'), 0, 0.4)} />
      <Txt x={640} y={800} txt="células madre en la base" t={26} p={p('madre')} ancla="end" color={TXTC.amarillo} />
      <Txt x={640} y={520} txt="progenitores: proliferan" t={26} p={p('progenitores')} ancla="end" color={TXTC.epitelio} /><Txt x={640} y={558} txt="y se diferencian" t={26} p={p('progenitores')} ancla="end" color={TXTC.epitelio} />
      <Flecha a={[1010, 700]} b={[1010, 380]} p={p('migran')} color={FLECHA} w={10} />
      <Txt x={1090} y={540} txt="y migran" t={28} p={p('migran')} ancla="start" />
      <Txt x={1090} y={300} txt="las maduras se eliminan hacia la luz" t={26} p={p('luz')} ancla="start" />
      <Sale p={p('dias')} x={1360} y={800}><rect x={-100} y={-90} width={200} height={190} rx={22} fill={G.sombra} transform="translate(8,9)" /><rect x={-100} y={-90} width={200} height={190} rx={22} fill="#FFF7E8" /><rect x={-100} y={-90} width={200} height={62} rx={22} fill="#E5324C" /><text textAnchor="middle" y={58} style={{ fontSize: 56, fontWeight: 800 }} fill="#3B1A6E">3 – 5</text><text textAnchor="middle" y={-48} style={{ fontSize: 30, fontWeight: 800 }} fill="#FFF">días</text></Sale>
      <Txt x={1360} y={950} txt="ese recambio ya es una defensa mecánica" t={22} p={p('dias')} />
    </g>
  );
};

const Modelos: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="Dos modelos complementarios" color="var(--cit-base)" p={p('lgr5')} t={34} punta="no" />
      <Cripta y={860} k={0.95} clu={p('clu')} />
      <Txt x={330} y={830} txt="LGR5+" t={34} p={p('lgr5')} color={TXTC.amarillo} />
      <Txt x={330} y={870} txt="el recambio de cada día" t={24} p={p('lgr5')} />
      <Txt x={330} y={720} txt="nicho regulado por WNT" t={26} p={p('wnt')} color={TXTC.verde} />
      {[0, 1, 2].map((i) => <circle key={i} cx={470 + i * 26} cy={690 + (i % 2) * 20} r={9 * tramo(p('wnt'), i * 0.12, 0.5 + i * 0.12)} fill="#5FE08A" />)}
      <Txt x={1290} y={420} txt="tras una lesión: células CLU+" t={28} p={p('clu')} color={TXTC.verde} />
      <Txt x={1290} y={464} txt="se expanden con YAP1" t={26} p={p('yap')} />
      <Sale p={p('lesion')} x={1290} y={300}><path d="M-40,-30 l24,18 l-8,-34 l30,26 l6,-36 l16,38 l24,-22 l-6,40 z" fill="#E5324C" /></Sale>
      <Flecha a={[1290, 640]} b={[1050, 760]} p={p('plasticidad')} color={FLECHA} w={10} />
      <Txt x={1290} y={640} txt="la plasticidad de células ya diferenciadas" t={24} p={p('plasticidad')} />
      <Txt x={1290} y={676} txt="también repone progenitores" t={24} p={p('plasticidad')} />
      <Txt x={800} y={965} txt="no se excluyen entre sí" t={30} p={p('noExcluyen')} color={TXTC.violeta} />
    </g>
  );
};

const Microbiota: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="La microbiota sostiene el nicho" color="var(--cit-base)" p={p('microbiota')} t={34} punta="no" />
      <Cripta x={760} y={920} k={0.85} />
      <Sale p={p('akk')} x={300} y={330}><Bacilo tono={['#2E6E8E', '#5AB3CF', '#C4EEFF']} largo={90} alto={64} k={1.3} sombra /></Sale>
      <Txt x={300} y={430} txt="Akkermansia muciniphila" t={26} p={p('akk')} />
      <Sale p={p('lacto')} x={560} y={330}><Bacilo tono={G.comensal} k={1.3} sombra /></Sale>
      <Txt x={560} y={430} txt="lactobacilos" t={26} p={p('lacto')} />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={420 + i * 40} cy={480 + 70 * tramo(p('metabolitos'), i * 0.1, 0.5 + i * 0.1)} r={11} fill="#FFD23F" opacity={tramo(p('metabolitos'), i * 0.1, 0.3)} />)}
      <Txt x={600} y={560} txt="metabolitos y señales" t={24} p={p('metabolitos')} ancla="start" />
      <Sale p={p('organoide')} x={1230} y={330}>
        <circle r={86} fill="#7A45E6" /><circle r={66} fill="#B79BFF" />{[[-20, -20], [20, 10], [-10, 26]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={14} fill="#5A1590" />)}
      </Sale>
      <Txt x={1230} y={450} txt="organoides" t={26} p={p('organoide')} />
      <Sale p={p('ratones')} x={1450} y={330}><ellipse rx={64} ry={42} fill="#D9822B" /><circle cx={-54} cy={-26} r={22} fill="#D9822B" /><circle cx={-54} cy={-26} r={12} fill="#FFC060" /><circle cx={-70} cy={-6} r={6} fill="#2A0A48" /><path d="M64,0 q60,10 50,50" fill="none" stroke="#D9822B" strokeWidth={8} strokeLinecap="round" /></Sale>
      <Txt x={1450} y={450} txt="ratones" t={26} p={p('ratones')} />
      <Cruz x={1150} y={700} k={1.4} p={p('noUniversal')} />
      <Txt x={1000} y={800} txt="no demuestran por sí solos" t={26} p={p('noUniversal')} ancla="start" /><Txt x={1000} y={840} txt="una terapia probiótica universal" t={26} p={p('noUniversal')} ancla="start" />
    </g>
  );
};

const Interfieren: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="Los patógenos también interfieren" color="var(--cit-base)" p={p('tcdb')} t={32} punta="no" />
      <Sale p={p('tcdb')} x={250} y={340}><Bacilo tono={G.grampos} k={1.1} /></Sale>
      <Txt x={250} y={430} txt="TcdB" t={30} p={p('tcdb')} color={TXTC.grampos} /><Txt x={250} y={470} txt="intoxica células madre" t={22} p={p('tcdb')} /><Txt x={250} y={505} txt="e interfiere con WNT" t={22} p={p('wnt')} />
      <Sale p={p('cif')} x={640} y={340}><Bacilo k={1.1} /></Sale>
      <Txt x={640} y={430} txt="Cif · EPEC" t={30} p={p('cif')} color={TXTC.patogeno} /><Txt x={640} y={470} txt="detiene el ciclo celular" t={22} p={p('cif')} />
      <Cruz x={640} y={560} k={1.1} p={p('cif')} />
      <Sale p={p('nleb1')} x={1030} y={340}><Bacilo k={1.1} /></Sale>
      <Txt x={1030} y={430} txt="NleB1" t={30} p={p('nleb1')} color={TXTC.patogeno} /><Txt x={1030} y={470} txt="bloquea receptores de muerte" t={22} p={p('nleb1')} />
      <Sale p={p('ipab')} x={1400} y={340}><Bacilo k={1.1} /></Sale>
      <Txt x={1400} y={430} txt="IpaB · Shigella" t={30} p={p('ipab')} color={TXTC.patogeno} /><Txt x={1400} y={470} txt="altera reguladores del ciclo" t={22} p={p('ipab')} />
      <Sale p={p('caga')} x={430} y={720}><Bacilo k={1.1} /></Sale>
      <Txt x={430} y={810} txt="CagA · H. pylori" t={30} p={p('caga')} color={TXTC.patogeno} />
      <Sale p={p('avra')} x={900} y={720}><Bacilo k={1.1} flagelo={1} /></Sale>
      <Txt x={900} y={810} txt="AvrA · Salmonella" t={30} p={p('avra')} color={TXTC.patogeno} />
      <Txt x={665} y={900} txt="favorecen la proliferación y la supervivencia" t={26} p={p('avra')} />
    </g>
  );
};

const Mas: Lamina = ({ p }) => {
  const barra = (x: number, h: number, c: string, n: string, txt: string, t2: string) => (
    <g key={n}><rect x={x} y={760 - h} width={150} height={h} rx={20} fill={c} opacity={tramo(p(n), 0, 0.4)} /><Txt x={x + 75} y={810} txt={txt} t={28} p={p(n)} /><Txt x={x + 75} y={850} txt={t2} t={22} p={p(n)} fuerte={false} /></g>
  );
  return (
    <g>
      <Bandera x={800} y={90} txt="Más proliferación no siempre es recuperación" color="var(--cit-base)" p={p('moderada')} t={32} punta="no" />
      {barra(250, 220, '#5FE08A', 'moderada', 'moderada', 'elimina infectadas')}
      {barra(520, 560, '#E5324C', 'exceso', 'exceso de daño', 'impide reparar')}
      <Sale p={p('hiperplasia')} x={900} y={560}><path d="M-110,100 Q-110,-120 0,-120 Q110,-120 110,100 Z" fill={G.epitelio[1]} />{[[-50, -20], [30, -40], [50, 30], [-20, 40]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={22} fill={G.epitelio[2]} />)}</Sale>
      <Txt x={900} y={720} txt="hiperplasia" t={28} p={p('hiperplasia')} />
      <Flecha a={[1030, 560]} b={[1130, 560]} p={p('persistencia')} color={FLECHA} w={9} />
      <Txt x={1170} y={560} txt="puede sostener la persistencia" t={26} p={p('persistencia')} ancla="start" />
      <Bandera x={800} y={950} txt="Inflamación crónica + proliferación aberrante ≠ cáncer en toda infección" color="#4B1FA0" p={p('cancer')} t={22} punta="no" />
    </g>
  );
};

const Farmacos: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Cripta y={880} k={0.85} muertas={p('divide')} />
      <Sale p={p('quimio')} x={330} y={330}><Pastilla k={1.3} r={-20} color={['#7E1840', '#C2364E', '#FFC0C5']} /></Sale>
      <Txt x={330} y={430} txt="quimioterapia" t={30} p={p('quimio')} />
      <Flecha a={[430, 380]} b={[640, 560]} p={p('divide')} color={FLECHA} w={9} />
      <Txt x={330} y={480} txt="mata células que se dividen" t={24} p={p('divide')} />
      <Sale p={p('mucositis')} x={1250} y={330} k={0.7}><Intestino lesion={p('mucositis')} /></Sale>
      <Txt x={1250} y={500} txt="mucositis: la puerta de nuestra paciente" t={24} p={p('mucositis')} />
      <Sale p={p('radio')} x={1250} y={640}>{Array.from({ length: 3 }, (_, i) => <path key={i} d={`M${-60 + i * 60},-40 l20,40 l-20,40`} fill="none" stroke="#FFD23F" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />)}</Sale>
      <Txt x={1250} y={730} txt="la radioterapia hace lo mismo" t={24} p={p('radio')} />
      <Sale p={p('fmt')} x={400} y={700}><rect x={-60} y={-70} width={120} height={150} rx={22} fill="#C46A00" /><rect x={-50} y={-60} width={100} height={130} rx={16} fill="#FFD27A" /><Bacilo x={0} y={0} k={0.4} tono={G.comensal} /></Sale>
      <Txt x={400} y={830} txt="trasplante de microbiota fecal" t={24} p={p('fmt')} />
      <Txt x={400} y={866} txt="en C. difficile recurrente: recompone el nicho" t={22} p={p('caso')} fuerte={false} />
      <PildoraFlota x={1480} y={830} k={0.8} rl={reloj} p={p('farmaco')} />
      <Bandera x={1200} y={950} txt={TXT_FARMACO} color="#2F6FD8" p={p('farmaco')} t={22} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [Renueva, Modelos, Microbiota, Interfieren, Mas, Farmacos];
export default LAMINAS;
