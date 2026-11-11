'use client';
// Capítulo 9 · Comparar, resistencia y leer la evidencia (y el regreso a los dos pacientes ilustrativos).

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Bacilo, Bandera, Cruz, Enterocito, Flecha, FLECHA, Frasco, G, Higado, Intestino, Jeringa, Neutrofilo, Pastilla, PildoraFlota, Pulmones, Retrato, Rinon, Sale, Tarjeta, Tijera, TXT_CASO, TXT_FARMACO, TXTC, Txt, Visto, V, clamp, easeOut, tramo } from '../Piezas';

const Entericos: Lamina = ({ p }) => {
  const c: [string, string, string, number, number][] = [
    ['typhi', 'S. Typhi', 'disemina con poco daño al inicio', 270, 250], ['typhimurium', 'S. Typhimurium', 'inflama; invade con T3SS', 800, 250], ['epec', 'EPEC · EHEC', 'adhesión y borramiento; EHEC suma Shiga', 1330, 250],
    ['shigella', 'Shigella', 'acceso basolateral', 270, 520], ['cholerae', 'V. cholerae', 'proteólisis del moco · ZOT', 800, 520], ['hpylori', 'H. pylori', 'CagA: proliferación', 1330, 520],
    ['campy', 'Campylobacter', 'ocludina y citocinas', 270, 790], ['yersinia', 'Yersinia', 'invasión y señal inflamatoria', 800, 790], ['clostridios', 'clostridios', 'comparación grampositiva', 1330, 790],
  ];
  return (
    <g>
      <Bandera x={800} y={80} txt="Patógenos entéricos, lado a lado" color="var(--cit-base)" p={p('typhi')} t={32} punta="no" />
      {c.map(([n, txt, sub, x, y], i) => (
        <g key={n}>
          <Sale p={p(n)} x={x} y={y - 40}><Bacilo k={0.9} tono={n === 'clostridios' ? G.grampos : G.patogeno} flagelo={i % 2 ? 0 : 0.6} /></Sale>
          <Txt x={x} y={y + 40} txt={txt} t={28} p={p(n)} color={n === 'clostridios' ? TXTC.grampos : TXTC.patogeno} /><Txt x={x} y={y + 76} txt={sub} t={21} p={p(n)} fuerte={false} />
        </g>
      ))}
    </g>
  );
};

const Ejes: Lamina = ({ p }) => {
  const e: [string, string, number, ReactNode][] = [
    ['capsula', 'la cápsula reduce la eliminación inmunitaria', 270, <g key="a"><circle r={80} fill={G.patogeno[2]} opacity={0.5} /><Bacilo k={1.1} /></g>],
    ['adhesion', 'las adhesinas colonizan y cruzan barreras', 640, <g key="b"><Bacilo k={1.1} fimbrias={1} /></g>],
    ['hierro', 'los sideróforos contrarrestan la falta de hierro', 1010, <g key="c">{[0, 1, 2].map((i) => <g key={i}><circle cx={-60 + i * 60} cy={0} r={24} fill="#C46A00" /><text x={-60 + i * 60} y={8} textAnchor="middle" style={{ fontSize: 20, fontWeight: 800 }} fill="#FFF">Fe</text></g>)}</g>],
    ['metabolismo', 'la flexibilidad metabólica permite sobrevivir', 1380, <g key="d"><path d="M0,-60 l50,30 v60 l-50,30 l-50,-30 v-60 z" fill="#FFD23F" /><path d="M0,-60 l50,30 l-50,30 l-50,-30 z" fill="#FFF0A8" /></g>],
  ];
  return (
    <g>
      <Bandera x={800} y={80} txt="Ejes que comparten" color="var(--cit-base)" p={p('capsula')} t={34} punta="no" />
      {e.map(([n, txt, x, ic]) => <g key={n}><Sale p={p(n)} x={x} y={380}>{ic}</Sale><Txt x={x} y={520} txt={txt} t={24} p={p(n)} /></g>)}
      <Txt x={800} y={780} txt="las toxinas, en cambio, pesan distinto según la especie" t={32} p={p('toxinas')} color={TXTC.sangre} />
    </g>
  );
};

const Cinco: Lamina = ({ p }) => {
  const c: [string, string, string, number, ReactNode][] = [
    ['blee', 'BLEE', 'amplía la hidrólisis de β-lactámicos', 270, <Tijera key="a" k={2.6} />],
    ['ampc', 'AmpC', 'cefalosporinasas cromosómicas', 560, <Tijera key="b" k={2.6} color="#6D3FD8" />],
    ['carbapenemasas', 'Carbapenemasas', 'KPC · NDM · VIM · OXA', 850, <g key="c"><Tijera k={2.6} color="#E5324C" /></g>],
    ['eflujo', 'Eflujo y porinas', 'bombas, menos permeabilidad', 1140, <g key="d"><rect x={-40} y={-50} width={80} height={100} rx={26} fill="#0A7F86" /><rect x={-14} y={-70} width={28} height={140} rx={12} fill="#16B9BE" /></g>],
    ['moviles', 'Elementos móviles', 'plásmidos entre cepas y especies', 1430, <g key="e"><circle r={46} fill="none" stroke="#FFD23F" strokeWidth={14} /><Bacilo x={-110} y={0} k={0.5} /><Bacilo x={110} y={0} k={0.5} /></g>],
  ];
  return (
    <g>
      <Bandera x={800} y={80} txt="Resistencia en cinco ideas" color="var(--cit-base)" p={p('blee')} t={34} punta="no" />
      {c.map(([n, txt, sub, x, ic]) => <g key={n}><Sale p={p(n)} x={x} y={400}>{ic}</Sale><Txt x={x} y={530} txt={txt} t={26} p={p(n)} color={TXTC.sangre} /><Txt x={x} y={570} txt={sub} t={20} p={p(n)} fuerte={false} /></g>)}
    </g>
  );
};

const Distintas: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('resistencia')} x={330} y={400}><Pastilla k={1.6} r={-20} color={['#C2410C', '#F97316', '#FFC48A']} /><Cruz x={0} y={0} k={1.8} /></Sale>
      <Txt x={330} y={540} txt="resistencia" t={34} p={p('resistencia')} />
      <Sale p={p('virulencia')} x={1270} y={400}><Bacilo k={1.8} sombra /><circle cx={80} cy={-70} r={26} fill="#E5324C" /></Sale>
      <Txt x={1270} y={540} txt="virulencia" t={34} p={p('virulencia')} />
      <Sale p={p('virulencia')} x={800} y={400}><rect x={-60} y={-40} width={120} height={80} rx={16} fill="#FFD23F" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 56, fontWeight: 800 }} fill="#3B1A6E">≠</text></Sale>
      <Flecha a={[470, 470]} b={[680, 470]} p={p('converger')} color={FLECHA} w={9} /><Flecha a={[1130, 470]} b={[920, 470]} p={p('converger')} color={FLECHA} w={9} />
      <Txt x={800} y={620} txt="pueden converger" t={30} p={p('converger')} />
      <Txt x={800} y={720} txt="detectar resistencia no demuestra mayor capacidad invasiva" t={28} p={p('noDemuestra')} color={TXTC.violeta} />
      <Txt x={800} y={830} txt="una infección sin terapia eficaz puede empeorar el desenlace" t={28} p={p('terapia')} color={TXTC.sangre} />
    </g>
  );
};

const Falla: Lamina = ({ p, reloj }) => {
  const f: [string, string, string, number][] = [['blee', 'BLEE', 'cefalosporinas de 3.ª generación', 360], ['ampc', 'AmpC', 'no la frena el clavulanato', 760], ['carba', 'Carbapenemasas', 'los carbapenémicos', 1160]];
  return (
    <g>
      <PildoraFlota x={150} y={140} k={0.9} rl={reloj} p={p('blee')} />
      <Bandera x={170} y={250} txt={TXT_FARMACO} color="#2F6FD8" p={p('blee')} t={22} punta="no" />
      {f.map(([n, mec, droga, x]) => (
        <g key={n}>
          <Sale p={p(n)} x={x} y={400}><Tijera k={2.4} /></Sale><Txt x={x} y={500} txt={mec} t={30} p={p(n)} color={TXTC.sangre} />
          <Flecha a={[x, 530]} b={[x, 620]} p={p(n)} color={FLECHA} w={8} />
          <Sale p={p(n)} x={x} y={700}><Pastilla k={1.1} r={-15} color={['#1E56C6', '#3B82F0', '#BFDBFF']} /><Cruz x={0} y={0} k={1.4} /></Sale>
          <Txt x={x} y={800} txt={droga} t={22} p={p(n)} />
        </g>
      ))}
      <Txt x={1480} y={420} txt="eflujo y porinas" t={24} p={p('eflujo')} color={TXTC.sangre} /><Txt x={1480} y={456} txt="varias clases" t={22} p={p('varias')} />
      <Sale p={p('varias')} x={1480} y={620}>{[0, 1, 2].map((i) => <Pastilla key={i} x={0} y={-90 + i * 90} k={0.7} r={i * 20 - 20} color={[['#1E56C6', '#3B82F0', '#BFDBFF'], ['#138A3A', '#3FD467', '#B5F5C4'], ['#C2410C', '#F97316', '#FFC48A']][i]} />)}</Sale>
    </g>
  );
};

const Receta: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={90} txt="Mecanismo, no receta" color="var(--cit-base)" p={p('cultivo')} t={36} punta="no" />
      <Sale p={p('cultivo')} x={280} y={400}><Frasco tono={['#9B1B3A', '#E5324C']} /></Sale>
      <Txt x={280} y={540} txt="cultivo" t={28} p={p('cultivo')} />
      <Txt x={280} y={582} txt="y antibiograma" t={26} p={p('antibiograma')} />
      <Sale p={p('desescalar')} x={800} y={400}>{[0, 1, 2].map((i) => <rect key={i} x={-120 + i * 80} y={-60 + i * 40} width={80} height={120 - i * 40} fill={['#7A45E6', '#B79BFF', '#E2D8F8'][i]} />)}</Sale>
      <Txt x={800} y={540} txt="se desescala cuando se puede" t={28} p={p('desescalar')} />
      <Sale p={p('foco')} x={1320} y={400}><circle r={70} fill="#E5324C" /><circle r={44} fill="#FFF7E8" /><circle r={18} fill="#E5324C" /></Sale>
      <Txt x={1320} y={540} txt="y se controla el foco" t={28} p={p('foco')} />
      <Visto x={800} y={720} k={1.6} p={p('guia')} />
      <Txt x={800} y={830} txt="la elección real: tu guía local y tu clase de Farmacología" t={30} p={p('guia')} color={TXTC.violeta} />
      <Txt x={800} y={880} txt="aquí aprendes por qué un fármaco funciona o falla" t={24} p={p('guia')} fuerte={false} />
    </g>
  );
};

const Modelos: Lamina = ({ p }) => {
  const m: [string, string, string, number, number, ReactNode][] = [
    ['respiratorio', 'respiratorio', 'colonización pulmonar y diseminación', 280, 300, <Pulmones key="a" k={0.8} />],
    ['urinario', 'urinario', 'del aparato urinario a la sangre', 800, 300, <Rinon key="b" k={0.9} />],
    ['intravenoso', 'intravenoso', 'aptitud tras el acceso directo', 1320, 300, <Jeringa key="c" k={0.9} r={-30} liquido="#5FE08A" />],
    ['intraperitoneal', 'intraperitoneal', 'diseminación desde la cavidad', 280, 700, <Intestino key="d" k={0.5} />],
    ['suero', 'suero', 'muerte y crecimiento en suero', 800, 700, <g key="e"><rect x={-34} y={-90} width={68} height={190} rx={30} fill="#D6E7F2" /><rect x={-26} y={-20} width={52} height={110} rx={24} fill="#F7CE55" /></g>],
    ['organoides', 'organoides y ómicas', 'daño de barrera y reparación', 1320, 700, <g key="f"><circle r={70} fill="#7A45E6" /><circle r={52} fill="#B79BFF" />{[[-20, -16], [18, 10], [-6, 24]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={13} fill="#5A1590" />)}</g>],
  ];
  return (
    <g>
      <Bandera x={800} y={80} txt="¿Cómo sabemos todo esto? Con modelos" color="var(--cit-base)" p={p('respiratorio')} t={32} punta="no" />
      {m.map(([n, txt, sub, x, y, ic]) => <g key={n}><Sale p={p(n)} x={x} y={y}>{ic}</Sale><Txt x={x} y={y + 130} txt={txt} t={28} p={p(n)} /><Txt x={x} y={y + 166} txt={sub} t={21} p={p(n)} fuerte={false} /></g>)}
    </g>
  );
};

const Limites: Lamina = ({ p }) => {
  const l: [string, string, string, number, ReactNode][] = [
    ['iv', 'intravenoso', 'se salta la colonización y el cruce de barreras', 270, <Jeringa key="a" k={0.8} r={-30} liquido="#5FE08A" />],
    ['resp', 'respiratorio', 'un defecto pulmonar sin defecto de cruce', 640, <Pulmones key="b" k={0.7} />],
    ['suero', 'suero', 'no tiene células inmunitarias', 1010, <g key="c"><rect x={-30} y={-80} width={60} height={170} rx={28} fill="#D6E7F2" /><rect x={-22} y={-16} width={44} height={98} rx={20} fill="#F7CE55" /></g>],
    ['organoide', 'organoides', 'hay que validar su contexto fisiológico', 1380, <g key="d"><circle r={64} fill="#7A45E6" /><circle r={46} fill="#B79BFF" /></g>],
  ];
  return (
    <g>
      <Bandera x={800} y={80} txt="Cada modelo omite algo" color="var(--cit-base)" p={p('iv')} t={34} punta="no" />
      {l.map(([n, txt, sub, x, ic]) => <g key={n}><Sale p={p(n)} x={x} y={380}>{ic}<Cruz x={50} y={-50} k={1} p={1} /></Sale><Txt x={x} y={530} txt={txt} t={28} p={p(n)} /><Txt x={x} y={570} txt={sub} t={20} p={p(n)} fuerte={false} /></g>)}
    </g>
  );
};

const Cuello: Lamina = ({ p }) => {
  const q = easeOut(clamp(p('azar')));
  return (
    <g>
      <Bandera x={800} y={80} txt="El cuello de botella" color="var(--cit-base)" p={p('embudo')} t={34} punta="no" />
      <Sale p={p('embudo')} x={800} y={420}><path d="M-300,-170 L300,-170 L70,50 L70,160 L-70,160 L-70,50 Z" fill="#7A45E6" opacity={0.85} /><path d="M-280,-160 L280,-160 L56,52 L56,150 L-56,150 L-56,52 Z" fill="#B79BFF" opacity={0.6} /></Sale>
      {Array.from({ length: 14 }, (_, i) => <Bacilo key={i} x={800 + ((i % 7) - 3) * 70 * (1 - 0.2 * q)} y={290 + Math.floor(i / 7) * 60 + 30 * q} r={i * 25} k={0.36} o={tramo(p('azar'), 0, 0.3) * (i % 3 === 0 ? 1 - 0.9 * q : 1)} />)}
      <Txt x={800} y={640} txt="elimina al azar parte de la población al pasar de un nicho a otro" t={26} p={p('azar')} />
      <Txt x={800} y={680} txt="y puede ocultar o exagerar efectos genéticos" t={24} p={p('azar')} fuerte={false} />
      <Sale p={p('higado')} x={330} y={800} k={0.55}><Higado /></Sale>
      <Txt x={330} y={925} txt="recuperar bacterias de hígado o bazo" t={22} p={p('higado')} />
      <Sale p={p('noSangre')} x={1000} y={820}><rect x={-160} y={-40} width={320} height={80} rx={40} fill="#5E1030" /><Bacilo x={-40} y={0} k={0.4} /></Sale>
      <Cruz x={650} y={820} k={1.4} p={p('noSangre')} />
      <Txt x={1230} y={820} txt="≠ la carga en sangre" t={28} p={p('noSangre')} ancla="start" color={TXTC.sangre} />
      <Txt x={800} y={975} txt="en humanos puede ser intermitente y de baja densidad; los modelos usan dosis altas" t={22} p={p('humana')} fuerte={false} />
    </g>
  );
};

const Leer: Lamina = ({ p }) => {
  const c: [string, string, number, number][] = [['especie', 'especie y cepa', 280, 300], ['huesped', 'huésped', 800, 300], ['foco', 'foco', 1320, 300], ['fase', 'fase estudiada', 280, 520], ['inoculo', 'inóculo', 800, 520], ['variable', 'variable medida', 1320, 520]];
  return (
    <g>
      <Bandera x={800} y={80} txt="Para leer un hallazgo, precisa…" color="var(--cit-base)" p={p('especie')} t={34} punta="no" />
      {c.map(([n, txt, x, y]) => <g key={n}><Sale p={p(n)} x={x} y={y}><circle r={60} fill="#7A45E6" /><circle cx={-5} cy={-5} r={52} fill="#B79BFF" /></Sale><Visto x={x} y={y} k={0.9} p={p(n)} /><Txt x={x} y={y + 100} txt={txt} t={28} p={p(n)} /></g>)}
      <Sale p={p('raton')} x={440} y={800}><ellipse rx={64} ry={42} fill="#D9822B" /><circle cx={-54} cy={-26} r={22} fill="#D9822B" /><circle cx={-54} cy={-26} r={12} fill="#FFC060" /><circle cx={-70} cy={-6} r={6} fill="#2A0A48" /></Sale>
      <Txt x={440} y={880} txt="un gen necesario en el ratón" t={26} p={p('raton')} />
      <Sale p={p('humano')} x={1260} y={790}><circle r={46} fill="#F27BA0" /><rect x={-34} y={40} width={68} height={50} rx={22} fill="#2E2EB0" /></Sale>
      <Cruz x={820} y={790} k={1.6} p={p('humano')} />
      <Txt x={1260} y={900} txt="no es un blanco terapéutico" t={24} p={p('humano')} color={TXTC.sangre} /><Txt x={1260} y={936} txt="demostrado en humanos" t={24} p={p('humano')} color={TXTC.sangre} />
    </g>
  );
};

const Ella: Lamina = ({ p, reloj }) => {
  const cadena: [string, string, number][] = [['quimio', 'quimioterapia', 360], ['moco', 'moco y disbiosis', 620], ['uniones', 'uniones abiertas', 880], ['cruza', 'E. coli cruza', 1140], ['endotoxina', 'endotoxina · TLR4', 1400]];
  return (
    <g>
      <Sale p={p('ella')} x={160} y={400}><Tarjeta w={240} h={300} color="#FFF1F6" /><Retrato quien="ella" y={20} k={0.5} /></Sale>
      <Bandera x={160} y={190} txt={TXT_CASO} color={V.violeta[0]} p={p('ella')} t={20} punta="no" />
      {cadena.map(([n, txt, x], i) => (
        <g key={n}>
          <Sale p={p(n)} x={x} y={330}>
            {i === 0 && <Pastilla k={1.1} r={-20} color={['#7E1840', '#C2364E', '#FFC0C5']} />}
            {i === 1 && <><Enterocito x={-50} y={0} k={0.4} micro={0.3} /><Bacilo x={50} y={0} k={0.5} tono={G.comensal} o={0.5} /></>}
            {i === 2 && <Intestino k={0.35} lesion={1} />}
            {i === 3 && <Bacilo k={1.1} r={90} />}
            {i === 4 && <><circle r={44} fill="#0A7F86" /><circle r={32} fill="#16B9BE" /></>}
          </Sale>
          <Txt x={x} y={470} txt={txt} t={22} p={p(n)} />
          {i < 4 && <Flecha a={[x + 90, 330]} b={[x + 170, 330]} p={p(cadena[i + 1][0])} color={FLECHA} w={7} />}
        </g>
      ))}
      <Sale p={p('sofa')} x={800} y={650}><rect x={-200} y={-60} width={400} height={120} rx={22} fill="#E0338A" /><text textAnchor="middle" dy="0.35em" style={{ fontSize: 38, fontWeight: 800 }} fill="#FFF">SOFA ↑ ≥ 2 · sepsis</text></Sale>
      <Sale p={p('tratamiento')} x={800} y={820}><Pastilla x={-120} k={0.9} r={-20} color={['#C2410C', '#F97316', '#FFC48A']} /><circle cx={120} cy={0} r={40} fill="#E5324C" /><circle cx={120} cy={0} r={24} fill="#FFF7E8" /></Sale>
      <Txt x={800} y={920} txt="antibiótico y control del foco" t={26} p={p('tratamiento')} />
      <PildoraFlota x={1480} y={800} k={0.9} rl={reloj} p={p('tratamiento')} />
    </g>
  );
};

const El: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Sale p={p('el')} x={160} y={400}><Tarjeta w={240} h={300} color="#EFF8F9" /><Retrato quien="el" y={20} k={0.5} tubo={1} /></Sale>
      <Bandera x={160} y={190} txt={TXT_CASO} color={V.violeta[0]} p={p('el')} t={20} punta="no" />
      <Sale p={p('pulmon')} x={600} y={380}><Pulmones k={0.9} infiltrados={1} /></Sale>
      <Txt x={600} y={560} txt="Pseudomonas colonizó el pulmón con la ventilación" t={24} p={p('pulmon')} />
      <Sale p={p('t3ss')} x={1000} y={330}><Bacilo k={1.3} flagelo={1} reloj={reloj} /><rect x={-5} y={24} width={10} height={80} rx={5} fill="#FFD23F" /></Sale>
      <Txt x={1000} y={470} txt="sistema tipo 3" t={26} p={p('t3ss')} color={TXTC.patogeno} />
      <Sale p={p('lasb')} x={1300} y={330}><Tijera k={2.4} /></Sale>
      <Txt x={1300} y={470} txt="LasB" t={26} p={p('lasb')} color={TXTC.verde} />
      <Sale p={p('barrera')} x={1150} y={620}><rect x={-120} y={-50} width={90} height={100} rx={26} fill={G.epitelio[1]} /><rect x={30} y={-50} width={90} height={100} rx={26} fill={G.epitelio[1]} /><Neutrofilo x={0} y={-90} k={0.4} /></Sale>
      <Txt x={1150} y={720} txt="rompen la barrera alveolar y vascular" t={24} p={p('barrera')} />
      <Sale p={p('sangre')} x={600} y={820}><rect x={-260} y={-44} width={520} height={88} rx={44} fill="#5E1030" /><Bacilo x={-60} y={0} k={0.5} flagelo={0} /><Bacilo x={80} y={0} r={20} k={0.5} /></Sale>
      <Txt x={600} y={900} txt="y llegan a la sangre" t={26} p={p('sangre')} />
      <Bandera x={1240} y={880} txt="Dos pacientes, dos puertas, una lógica" color="var(--cit-base)" p={p('cierre')} t={26} punta="no" />
      <Txt x={1240} y={940} txt="barrera · cruce · toxinas · respuesta del huésped" t={22} p={p('cierre')} fuerte={false} />
      <Txt x={1240} y={975} txt="y un fármaco que funciona… o falla" t={22} p={p('foco')} fuerte={false} />
    </g>
  );
};

const LAMINAS: Lamina[] = [Entericos, Ejes, Cinco, Distintas, Falla, Receta, Modelos, Limites, Cuello, Leer, Ella, El];
export default LAMINAS;
