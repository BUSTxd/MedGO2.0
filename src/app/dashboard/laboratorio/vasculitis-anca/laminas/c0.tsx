'use client';
// Capítulo 0 · Dos pacientes, un vaso roto.

import type { Lamina } from '../Lienzo';
import { TuboOrina, Termometro } from '../../citopenias-autoinmunes/Piezas';
import { Anca, Bandera, En, Foco, Hematie, Neutrofilo, Paciente, Perfil, PiernaPurpura, Sale, Tarjeta, Txt, V, Vaso, clamp, easeOut, tramo } from '../Piezas';

/** Gotas de sangre que caen desde (x, y). */
function Gotas({ x, y, p, n = 3 }: { x: number; y: number; p: number; n?: number }) {
  if (p <= 0.01) return null;
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <En key={i} x={x + i * 20} y={y + easeOut(tramo(p, i * 0.18, 0.6 + i * 0.12)) * (50 + i * 22)} o={tramo(p, i * 0.18, 0.35 + i * 0.18)} k={0.8}>
          <path d="M0,-14 C6,-5 11,1 11,7 A11,11 0 1 1 -11,7 C-11,1 -6,-5 0,-14 Z" fill={V.sangre[1]} />
        </En>
      ))}
    </>
  );
}

/** Inhalador de rescate. */
function Inhalador({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o} r={-12}>
      <rect x={-34} y={-120} width={68} height={150} rx={22} fill="#2F7DE8" />
      <rect x={-34} y={-120} width={30} height={150} rx={15} fill="#5FA0FF" />
      <path d="M-40,20 L60,20 Q80,20 80,40 L80,70 L-40,70 Z" fill="#E7EEF8" />
      <rect x={40} y={30} width={40} height={30} rx={8} fill="#B9C7DB" />
    </En>
  );
}

const El: Lamina = ({ p }) => {
  return (
    <g>
      <Sale p={p('persona')} x={290} y={470}>
        <Tarjeta w={460} h={560} y={-20} />
        <En y={-40} k={1.12}><Paciente quien="el" triste={p('tos')} /></En>
      </Sale>
      <Bandera x={290} y={120} txt="42 años" color={V.turquesa[0]} p={p('persona')} t={30} />
      <Sale p={p('nariz')} x={810} y={470}>
        <Tarjeta w={460} h={560} y={-20} />
        <En y={-40} k={1.12}><Perfil quien="el" hundida={p('hunde')} costras={p('costras')} /></En>
      </Sale>
      <Gotas x={928} y={440} p={p('sangra')} n={2} />
      <Bandera x={810} y={120} txt="Nariz tapada · 5 años" color="#B8237A" p={p('nariz')} t={28} />
      <Txt x={810} y={800} txt="costras y sangrados" t={28} p={p('costras')} />
      <Bandera x={810} y={880} txt="La nariz se hunde" color={V.violeta[0]} p={p('hunde')} t={30} />
      <Gotas x={1140} y={330} p={p('tos')} />
      <Txt x={1170} y={600} txt="tose sangre" t={28} p={p('tos')} color={V.sangre[0]} />
      <Sale p={p('fiebre')} x={1330} y={430} k={0.55}><Termometro val={0.92} /></Sale>
      <Txt x={1330} y={600} txt="fiebre" t={28} p={p('fiebre')} />
      <Sale p={p('orina')} x={1490} y={420} k={0.75}><TuboOrina oscuro={p('orina')} /></Sale>
      <Txt x={1490} y={600} txt="orina oscura" t={28} p={p('orina')} />
    </g>
  );
};

const Ella: Lamina = ({ p }) => {
  const presion = p('presion');
  return (
    <g>
      <Sale p={p('persona')} x={330} y={470}>
        <Tarjeta w={460} h={560} y={-20} color="#FFF1F6" />
        <En y={-40} k={1.12}><Paciente quien="ella" /></En>
      </Sale>
      <Bandera x={330} y={120} txt="39 años" color={V.ambar[0]} p={p('persona')} t={30} />
      <Bandera x={830} y={100} txt="Asma · 5 años" color="#2F6FD8" p={p('asma')} t={28} />
      <Sale p={p('asma')} x={830} y={215} k={0.5}><Inhalador /></Sale>
      <Txt x={830} y={310} txt="cada vez respira peor" t={26} p={p('peor')} />
      <Sale p={p('olfato')} x={830} y={600} k={0.8}>
        <Tarjeta w={460} h={560} y={-20} color="#FFF1F6" />
        <En y={-40} k={1.12}><Perfil quien="ella" polipo={p('polipos')} /></En>
      </Sale>
      <Bandera x={830} y={880} txt="Sin olfato · pólipos" color="#8A9A1E" p={p('polipos')} t={28} />
      <Sale p={p('pierna')} x={1280} y={520} k={1.25}><PiernaPurpura p={p('manchas')} presion={presion} /></Sale>
      <Bandera x={1280} y={90} txt="Manchas violáceas" color="#7A1F6E" p={p('manchas')} t={28} />
      <Bandera x={1280} y={930} txt="No se borran al presionar" color={V.sangre[0]} p={presion} t={28} />
    </g>
  );
};

const UnBlanco: Lamina = ({ p, reloj }) => {
  const anca = p('anca'), neu = p('neutro');
  const rompe = p('rompe');
  return (
    <g>
      <Vaso x={800} y={560} largo={2100} ancho={300} ang={-12} reloj={reloj} flujo={14} o={tramo(p('vaso'), 0, 0.5)}>
        {anca > 0.01 && [0, 1, 2, 3].map((i) => <Anca key={i} x={-260 + i * 150 - 200 * (1 - easeOut(anca))} y={-60 + (i % 2) * 70} r={90 + i * 20} k={1.1} o={tramo(anca, i * 0.1, 0.4 + i * 0.1)} />)}
        <Neutrofilo x={60} y={-80 + 0 * neu} k={1.2} o={tramo(neu, 0, 0.3)} cebado={neu} activo={rompe} />
        {rompe > 0.01 && Array.from({ length: 6 }, (_, i) => <Hematie key={i} x={20 + i * 30} y={-170 - easeOut(tramo(rompe, i * 0.08, 0.7)) * (40 + i * 22)} k={0.5} r={i * 40} o={tramo(rompe, i * 0.08, 0.3)} />)}
        {rompe > 0.01 && <rect x={0} y={-200} width={150} height={50} fill="#2B0A18" opacity={0.6 * clamp(rompe * 1.5)} />}
      </Vaso>
      <Foco x={810} y={400} R={140} p={p('blanco')} />
      <Bandera x={800} y={110} txt="Un mismo blanco: la pared de los vasos pequeños" color="var(--cit-base)" p={p('blanco')} t={30} punta="no" />
      <Sale p={p('dos')} x={230} y={260} k={0.42}><Tarjeta w={460} h={500} /><En y={-20}><Paciente quien="el" /></En></Sale>
      <Sale p={p('dos')} x={1370} y={260} k={0.42}><Tarjeta w={460} h={500} color="#FFF1F6" /><En y={-20}><Paciente quien="ella" /></En></Sale>
      <Bandera x={230} y={420} txt="Granulomatosis con poliangeítis" color={V.turquesa[0]} p={p('gpa')} t={24} />
      <Bandera x={1370} y={420} txt="Granulomatosis eosinofílica con poliangeítis" color={V.ambar[0]} p={p('gepa')} t={22} />
      <Bandera x={560} y={880} txt="ANCA" color={V.anca[1]} p={anca} t={34} />
      <Bandera x={1060} y={880} txt="El neutrófilo rompe el vaso" color={V.nucleo[1]} p={rompe} t={30} />
    </g>
  );
};

const VasoSano: Lamina = ({ p, reloj }) => {
  const leu = p('leuco'), cruza = p('cruza');
  const x = -700 + easeOut(clamp(leu)) * 640 + easeOut(cruza) * 60;
  return (
    <g>
      <Vaso x={800} y={520} largo={2100} ancho={330} ang={-12} reloj={reloj} flujo={18} o={tramo(p('vaso'), 0, 0.5)}>
        <Neutrofilo x={x} y={lerpY(cruza)} k={1.05} o={tramo(leu, 0, 0.2)} r={reloj * 0.02 * (1 - cruza)} activo={p('contra')} cebado={p('contra')} />
      </Vaso>
      <Bandera x={800} y={110} txt="Primero, el vaso sano" color={V.sangre[0]} p={p('sano')} t={34} punta="no" />
      <Txt x={420} y={860} txt="cómo está construido" t={30} p={p('sano')} />
      <Txt x={1180} y={860} txt="cómo deja pasar a los leucocitos" t={30} p={leu} />
      <Bandera x={800} y={940} txt="La maquinaria normal… contra la propia pared" color={V.anca[0]} p={p('maquina')} t={28} />
    </g>
  );
};
/** El neutrófilo baja hasta la pared y la atraviesa. */
const lerpY = (c: number) => -40 - 180 * easeOut(c);

const LAMINAS: Lamina[] = [El, Ella, UnBlanco, VasoSano];
export default LAMINAS;
