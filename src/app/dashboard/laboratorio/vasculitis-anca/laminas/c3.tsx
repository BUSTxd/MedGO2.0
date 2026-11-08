'use client';
// Capítulo 3 · Ordenar las vasculitis: tamaño del vaso (Chapel Hill 2012) y mecanismo.

import type { Lamina } from '../Lienzo';
import { Pastilla, TuboOrina, Termometro } from '../../citopenias-autoinmunes/Piezas';
import { Bateria, Cruz } from '../../citopenias-autoinmunes/laminas/Comun';
import { Alveolos, Anca, Bandera, Complejo, Cuerpo, En, Flecha, FLECHA, Glomerulo, Granuloma, Linfocito, Neutrofilo, PiernaPurpura, Punto, Rinon, Sale, Txt, V, Vaso, clamp, easeOut, lerp, tramo } from '../Piezas';

const Definicion: Lamina = ({ p, reloj }) => {
  const d = p('dano');
  return (
    <g>
      <Vaso x={800} y={300} largo={1900} ancho={180} pared={50} ang={-4} reloj={reloj} flujo={10} o={tramo(p('def'), 0, 0.5)}>
        {Array.from({ length: 7 }, (_, i) => <Neutrofilo key={i} x={-300 + i * 100} y={-128} k={0.42} o={tramo(d, i / 10, i / 10 + 0.3)} activo={d} />)}
        {d > 0.01 && <rect x={-330} y={-160} width={680} height={60} fill="#FFB23E" opacity={0.18 + 0.12 * Math.sin(reloj / 260)} />}
      </Vaso>
      <Bandera x={800} y={70} txt="Inflamación de la pared del vaso, con daño de la pared" color={V.sangre[0]} p={p('def')} t={28} punta="no" />
      <Txt x={800} y={460} txt="dos tipos de síntomas" t={30} p={p('dos')} />
      <Cuerpo x={360} y={720} k={0.62} o={tramo(p('generales'), 0, 0.4)} />
      <Bandera x={360} y={510} txt="Generales" color={V.ambar[0]} p={p('generales')} t={28} />
      <Sale p={p('fiebre')} x={570} y={600} k={0.38}><Termometro val={0.9} /></Sale>
      <Txt x={620} y={720} txt="pierde peso" t={24} p={p('peso')} />
      <Sale p={p('fatiga')} x={130} y={620} k={0.7}><Bateria val={0.15} /></Sale>
      <Punto x={360 + 0.62 * 60} y={720 + 0.62 * 100} p={p('articular')} />
      <Txt x={420} y={940} txt="inflamación sistémica" t={24} p={p('articular')} fuerte={false} />
      <Bandera x={1150} y={510} txt="De isquemia" color={V.violeta[0]} p={p('isquemia')} t={28} />
      <Sale p={p('isquemia')} x={1150} y={720}>
        <Rinon x={-120} k={0.9} />
        <path d="M-120,-118 C-20,-200 60,-180 140,-140" fill="none" stroke={V.sangre[1]} strokeWidth={14} strokeLinecap="round" strokeDasharray="22 16" />
        <Txt x={120} y={60} txt="el órgano que ese vaso alimenta" t={24} fuerte={false} />
      </Sale>
    </g>
  );
};

const ChapelHill: Lamina = ({ p }) => {
  const g = p('grandes'), m = p('medianos'), pq = p('pequenos');
  return (
    <g>
      <Bandera x={800} y={70} txt="Chapel Hill 2012: por el tamaño del vaso" color="var(--cit-base)" p={p('chapel')} t={30} punta="no" />
      {g > 0.01 && <path d={`M-40,520 C200,500 300,500 ${lerp(-40, 560, easeOut(g))},500`} fill="none" stroke={V.pared[2]} strokeWidth={150} />}
      {g > 0.01 && <path d={`M-40,520 C200,500 300,500 ${lerp(-40, 560, easeOut(g))},500`} fill="none" stroke={V.sangre[0]} strokeWidth={100} />}
      {m > 0.01 && [-1, 1].map((sg) => <path key={sg} d={`M540,500 C700,500 760,${500 + sg * 120} ${lerp(540, 1050, easeOut(m))},${500 + sg * 150}`} fill="none" stroke={V.pared[2]} strokeWidth={62} strokeLinecap="round" />)}
      {m > 0.01 && [-1, 1].map((sg) => <path key={sg} d={`M540,500 C700,500 760,${500 + sg * 120} ${lerp(540, 1050, easeOut(m))},${500 + sg * 150}`} fill="none" stroke={V.sangre[1]} strokeWidth={36} strokeLinecap="round" />)}
      {pq > 0.01 && [-1, 1].map((sg) => [-1, 0, 1].map((k) => (
        <path key={`${sg}${k}`} d={`M1040,${500 + sg * 150} C1180,${500 + sg * 150} 1240,${500 + sg * 150 + k * 70} ${lerp(1040, 1520, easeOut(tramo(pq, 0.1 * (k + 1), 1)))},${500 + sg * 150 + k * 90}`} fill="none" stroke={V.sangre[2]} strokeWidth={12} strokeLinecap="round" />
      )))}
      <Bandera x={260} y={330} txt="Vasos grandes" color={V.sangre[0]} p={g} t={28} />
      <Txt x={260} y={680} txt="aorta y sus ramas principales" t={24} p={g} fuerte={false} />
      <Bandera x={800} y={240} txt="Vasos medianos" color={V.sangre[1]} p={m} t={28} />
      <Txt x={800} y={780} txt="arterias de los órganos" t={24} p={m} fuerte={false} />
      <Bandera x={1300} y={170} txt="Vasos pequeños" color="#E0338A" p={pq} t={28} />
      <Txt x={1300} y={860} txt="arteriolas, capilares, vénulas" t={24} p={pq} fuerte={false} />
      <Bandera x={800} y={940} txt="Ojo: predominio, no exclusividad" color={V.ambar[0]} p={p('predominio')} t={28} />
    </g>
  );
};

const Mecanismo: Lamina = ({ p, reloj }) => {
  const inf = p('infecciosa');
  return (
    <g>
      <Bandera x={800} y={70} txt="El segundo eje: el mecanismo" color="var(--cit-base)" p={p('eje')} t={30} punta="no" />
      {([['complejos', 280, '¿Inmunocomplejos en la pared?'], ['anca', 800, '¿ANCA y casi ningún depósito?'], ['granulomas', 1320, '¿Granulomas y linfocitos T?']] as const).map(([n, x, txt]) => (
        <g key={n}>
          <Sale p={p(n)} x={x} y={360}>
            <rect x={-200} y={60} width={400} height={56} rx={28} fill={V.pared[2]} />
            <rect x={-190} y={60} width={380} height={18} rx={9} fill={V.endo[0]} />
          </Sale>
          <Txt x={x} y={560} txt={txt} t={24} p={p(n)} />
        </g>
      ))}
      {[0, 1, 2, 3].map((i) => <Complejo key={i} x={160 + i * 80} y={440} k={0.9} r={i * 50} o={tramo(p('complejos'), i * 0.12, 0.5)} />)}
      <Neutrofilo x={760} y={330} k={1} cebado={1} o={tramo(p('anca'), 0, 0.4)} />
      <Anca x={870} y={300} r={-60} k={1.2} o={tramo(p('anca'), 0.2, 0.6)} />
      <Granuloma x={1290} y={340} k={0.42} p={p('granulomas')} />
      <Linfocito x={1460} y={300} k={0.45} tono="th1" o={tramo(p('granulomas'), 0.4, 0.8)} />
      <Sale p={inf} x={800} y={760}>
        <rect x={-260} y={-30} width={520} height={60} rx={30} fill={V.pared[2]} />
        {[0, 1, 2].map((i) => <En key={i} x={-80 + i * 80} y={-10 + Math.sin(reloj / 300 + i) * 6}><rect x={-30} y={-12} width={60} height={24} rx={12} fill={V.verde[0]} /><rect x={-22} y={-7} width={30} height={7} rx={3.5} fill={V.verde[2]} /></En>)}
      </Sale>
      <Bandera x={420} y={760} txt="Vasculitis infecciosa" color={V.verde[0]} p={inf} t={26} />
      <Sale p={p('error')} x={1220} y={760} k={1.1}><Pastilla /></Sale>
      <Cruz x={1220} y={760} k={1.2} p={p('error')} />
      <Txt x={1220} y={870} txt="un inmunosupresor sería un error" t={24} p={p('error')} />
    </g>
  );
};

const Familias: Lamina = ({ p }) => {
  const anca: [string, string][] = [['pam', 'Poliangeítis microscópica'], ['gpa', 'Granulomatosis con poliangeítis'], ['gepa', 'Granulomatosis eosinofílica con poliangeítis']];
  const ic: [string, string][] = [['mbg', 'Anti membrana basal glomerular'], ['crio', 'Crioglobulinémica'], ['iga', 'Vasculitis por IgA'], ['urticarial', 'Urticarial hipocomplementémica']];
  return (
    <g>
      <Bandera x={800} y={80} txt="Vaso pequeño: dos familias" color="#E0338A" p={p('familias')} t={32} punta="no" />
      <Flecha a={[700, 140]} b={[420, 230]} c={[480, 150]} p={p('anca')} color={FLECHA} w={7} />
      <Flecha a={[900, 140]} b={[1180, 230]} c={[1120, 150]} p={p('ic')} color={FLECHA} w={7} />
      <Bandera x={420} y={290} txt="Asociadas a ANCA" color={V.anca[1]} p={p('anca')} t={30} punta="no" />
      {anca.map(([n, txt], i) => <Bandera key={n} x={420} y={400 + i * 95} txt={txt} color={['#B8237A', V.turquesa[0], V.ambar[0]][i]} p={p(n)} t={22} punta="no" />)}
      <Anca x={420} y={740} k={2.4} o={tramo(p('anca'), 0, 0.5)} />
      <Bandera x={1180} y={290} txt="Por inmunocomplejos" color="#2F6FD8" p={p('ic')} t={30} punta="no" />
      {ic.map(([n, txt], i) => <Bandera key={n} x={1180} y={400 + i * 95} txt={txt} color={['#2F6FD8', '#4A9AE8', '#6C5CE6', '#8A6AE0'][i]} p={p(n)} t={22} punta="no" />)}
      <Complejo x={1180} y={840} k={2.2} o={tramo(p('ic'), 0, 0.5)} />
    </g>
  );
};

/** Cajón de un mueble, con su tirador y su etiqueta. */
function Cajon({ x, y, txt, ej, color, p }: { x: number; y: number; txt: string; ej: string; color: string; p: number }) {
  if (p <= 0.002) return null;
  const sale = easeOut(clamp(p * 1.4)) * 40;
  return (
    <En x={x} y={y + sale * 0.3} o={tramo(p, 0, 0.3)}>
      <rect x={-300} y={-80} width={600} height={160} rx={18} fill="#6B3A1E" />
      <rect x={-286} y={-70 + sale * 0.2} width={572} height={140} rx={14} fill={color} />
      <rect x={-60} y={-28} width={120} height={20} rx={10} fill="#FFF" opacity={0.85} />
      <text x={0} y={22} dy="0.35em" textAnchor="middle" fill="#FFF" style={{ fontSize: 26, fontWeight: 700 }}>{txt}</text>
      <text x={0} y={56} dy="0.35em" textAnchor="middle" fill="#FFF" opacity={0.85} style={{ fontSize: 21, fontWeight: 500 }}>{ej}</text>
    </En>
  );
}

const Cajones: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={70} txt="Hay más cajones" color="var(--cit-base)" p={p('cajones')} t={32} punta="no" />
      <Cajon x={440} y={240} txt="De vaso variable" ej="Behçet" color="#8A4FE0" p={p('variable')} />
      <Cajon x={1160} y={240} txt="De un solo órgano" ej="angeítis cutánea" color="#C2307A" p={p('organo')} />
      <Cajon x={440} y={460} txt="Asociada a una enfermedad sistémica" ej="lupus, artritis reumatoide" color="#2F6FD8" p={p('sistemica')} />
      <Cajon x={1160} y={460} txt="Con causa probable" ej="infecciones y fármacos" color="#D9480F" p={p('causa')} />
      <Bandera x={420} y={720} txt="Hepatitis C → crioglobulinemia" color={V.ambar[0]} p={p('vhc')} t={24} />
      <Bandera x={420} y={810} txt="Hepatitis B → poliarteritis nodosa" color={V.ambar[0]} p={p('vhb')} t={24} />
      <Bandera x={1160} y={720} txt="Hidralazina · propiltiouracilo" color="#B8237A" p={p('farmacos')} t={24} />
      <Bandera x={1160} y={810} txt="Cocaína con levamisol" color="#B8237A" p={p('cocaina')} t={24} />
    </g>
  );
};

const Predice: Lamina = ({ p, reloj }) => {
  const pulso = Math.sin(reloj / 200);
  return (
    <g>
      <Bandera x={800} y={70} txt="El tamaño predice lo que vas a ver" color="var(--cit-base)" p={p('predice')} t={30} punta="no" />
      <Bandera x={290} y={170} txt="Vaso grande" color={V.sangre[0]} p={p('grande')} t={28} />
      <Sale p={p('grande')} x={290} y={360}>
        <path d={`M-180,0 ${Array.from({ length: 9 }, (_, i) => `L${-180 + (i + 1) * 40},${i % 2 ? 0 : -24 * (0.4 + 0.1 * pulso)}`).join(' ')}`} fill="none" stroke={V.sangre[1]} strokeWidth={8} strokeLinejoin="round" />
        <rect x={-180} y={70} width={360} height={60} rx={30} fill={V.pared[2]} />
        <ellipse cx={40} cy={100} rx={70} ry={58} fill={V.pared[2]} /><ellipse cx={40} cy={100} rx={52} ry={42} fill={V.sangre[0]} />
      </Sale>
      <Txt x={290} y={560} txt="pulsos débiles, claudicación, aneurismas" t={22} p={p('grande')} />
      <Bandera x={800} y={170} txt="Vaso mediano" color={V.sangre[1]} p={p('mediano')} t={28} />
      <Sale p={p('mediano')} x={800} y={360} k={0.9}>
        <Rinon />
        <path d="M-20,-60 L60,-20 L30,60 L-40,30 Z" fill="#3A1342" opacity={0.6} />
      </Sale>
      <Txt x={800} y={560} txt="infartos, nódulos, mononeuritis" t={22} p={p('mediano')} />
      <Bandera x={1310} y={170} txt="Vaso pequeño" color="#E0338A" p={p('pequeno')} t={28} />
      <Sale p={p('pequeno')} x={1170} y={380} k={0.32}><PiernaPurpura p={1} /></Sale>
      <Sale p={tramo(p('pequeno'), 0.2, 1)} x={1320} y={350} k={0.36}><Alveolos sangre={1} /></Sale>
      <Sale p={tramo(p('pequeno'), 0.4, 1)} x={1460} y={380} k={0.3}><Glomerulo necrosis={1} /></Sale>
      <Txt x={1310} y={560} txt="púrpura, hemorragia alveolar, glomerulonefritis" t={22} p={p('pequeno')} />
      <Sale p={p('capilares')} x={560} y={790} k={0.55}><Glomerulo /></Sale>
      <Txt x={800} y={790} txt="=" t={60} p={p('capilares')} />
      <Sale p={p('capilares')} x={1040} y={790} k={0.45}><Alveolos /></Sale>
      <Bandera x={800} y={940} txt="Capilares: solo una vasculitis de vaso pequeño los inflama" color="#E0338A" p={p('solo')} t={26} />
    </g>
  );
};

const DosPreguntas: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="Frente a cualquier vasculitis, dos preguntas" color="var(--cit-base)" p={p('preguntas')} t={30} punta="no" />
      <Bandera x={420} y={220} txt="¿Qué tamaño de vaso?" color={V.sangre[0]} p={p('tamano')} t={34} punta="no" />
      <Bandera x={1180} y={220} txt="¿Qué mecanismo?" color={V.nucleo[1]} p={p('mecanismo')} t={34} punta="no" />
      <Cuerpo x={420} y={620} k={0.85} o={tramo(p('buscar'), 0, 0.4)}>
        <Punto x={-30} y={-210} p={p('buscar')} />
        <Punto x={40} y={-110} p={tramo(p('buscar'), 0.2, 1)} />
        <Punto x={-50} y={-40} p={tramo(p('buscar'), 0.4, 1)} />
      </Cuerpo>
      <Txt x={420} y={940} txt="dónde buscar" t={30} p={p('buscar')} />
      <Sale p={p('patologo')} x={940} y={500} k={0.9}>
        <rect x={-14} y={-110} width={28} height={110} rx={10} fill="#5B3A86" transform="rotate(-20)" />
        <rect x={-50} y={10} width={100} height={20} rx={10} fill="#5B3A86" />
        <path d="M40,-80 Q90,-20 40,30" fill="none" stroke="#5B3A86" strokeWidth={16} />
        <rect x={-80} y={30} width={160} height={24} rx={12} fill="#3B1A6E" />
      </Sale>
      <Txt x={940} y={640} txt="qué verá el patólogo" t={22} p={p('patologo')} />
      <Sale p={p('sangre')} x={1180} y={490} k={0.7}><TuboOrina oscuro={0} /></Sale>
      <Txt x={1180} y={700} txt="qué saldrá en la sangre" t={22} p={p('sangre')} />
      <Sale p={p('tratamiento')} x={1420} y={500} k={1.3}><Pastilla /></Sale>
      <Txt x={1420} y={640} txt="qué tratamiento funciona" t={22} p={p('tratamiento')} />
      {[940, 1180, 1420].map((x, i) => <Flecha key={x} a={[1180, 280]} b={[x, 390]} p={p(['patologo', 'sangre', 'tratamiento'][i])} color={FLECHA} w={6} />)}
    </g>
  );
};

const LAMINAS: Lamina[] = [Definicion, ChapelHill, Mecanismo, Familias, Cajones, Predice, DosPreguntas];
export default LAMINAS;
