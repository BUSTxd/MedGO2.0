'use client';
// Capítulo 8 · Tres formas de brillar: inmunofluorescencia lineal, granular y pauciinmune.

import type { Lamina } from '../Lienzo';
import { Pastilla, BolsaSangre } from '../../citopenias-autoinmunes/Piezas';
import { Visto } from '../../citopenias-autoinmunes/laminas/Comun';
import { Anca, Bandera, En, Flecha, FLECHA, Glomerulo, IgG, Neutrofilo, Pantalla, Pulmones, Sale, Txt, TxtPantalla, V, clamp, easeOut, tramo } from '../Piezas';

const VERDE_IF = ['#0E7A2A', '#3BE35C', '#C9FFD4'];

const QueHay: Lamina = ({ p }) => {
  const anti: [string, string][] = [['igg', 'IgG'], ['iga', 'IgA'], ['igm', 'IgM'], ['c3', 'C3'], ['c1q', 'C1q']];
  return (
    <g>
      <Pantalla x={800} y={500} w={1440} h={860} p={p('saber')}>
        <TxtPantalla x={0} y={-330} txt="Inmunofluorescencia directa" t={36} p={p('if')} />
        {anti.map(([n, txt], i) => (
          <g key={n}>
            <IgG x={-480 + i * 240} y={-200} k={2} tono={VERDE_IF} o={tramo(p(n), 0, 0.4)} />
            <TxtPantalla x={-480 + i * 240} y={-80} txt={`anti ${txt}`} t={28} p={p(n)} />
          </g>
        ))}
        <TxtPantalla x={0} y={0} txt="no solo qué hay: con qué forma está depositado" t={28} p={p('forma')} />
        {(['lineal', 'granular', 'pauci'] as const).map((b, i) => (
          <g key={b}>
            <En x={-420 + i * 420} y={220} k={0.42} o={tramo(p('tres'), i * 0.2, 0.5 + i * 0.2)}><Glomerulo brillo={b} /></En>
            <TxtPantalla x={-420 + i * 420} y={360} txt={['lineal', 'granular', 'pauciinmune'][i]} t={28} p={tramo(p('tres'), i * 0.2, 0.6 + i * 0.2)} />
          </g>
        ))}
      </Pantalla>
    </g>
  );
};

const Lineal: Lamina = ({ p }) => {
  const c = p('cinta');
  return (
    <g>
      <Pantalla x={560} y={500} w={980} h={860} p={p('lineal')}>
        <TxtPantalla x={0} y={-340} txt="Patrón lineal" t={36} p={p('lineal')} />
        <En k={1.05} o={tramo(c, 0, 0.6)}><Glomerulo brillo="lineal" /></En>
        <En k={1.05} o={1 - tramo(c, 0, 0.6)}><Glomerulo brillo="pauci" /></En>
        <TxtPantalla x={0} y={330} txt="una cinta fina y continua en cada asa" t={26} p={c} />
      </Pantalla>
      <Bandera x={1300} y={220} txt="Anti colágeno IV (cadena α3)" color={V.verde[0]} p={p('colageno')} t={22} />
      <Txt x={1300} y={290} txt="el antígeno es la propia membrana" t={22} p={p('continuo')} />
      <Txt x={1300} y={340} txt="repartido de forma continua" t={22} p={p('continuo')} fuerte={false} />
      <Txt x={1300} y={450} txt="brilla entero, como un ovillo de cintas" t={22} p={p('entero')} />
      <Bandera x={1300} y={560} txt="Enfermedad anti membrana basal" color="#2F6FD8" p={p('antimbg')} t={22} />
      <Sale p={p('pulmon')} x={1300} y={720} k={0.5}><Pulmones sangre={p('goodpasture')} /></Sale>
      <Bandera x={1300} y={900} txt="Si sangra el pulmón: Goodpasture" color={V.sangre[0]} p={p('goodpasture')} t={22} />
    </g>
  );
};

const Granular: Lamina = ({ p }) => {
  const ej: [string, string, string, string][] = [['postinf', 'Postinfecciosa', 'jorobas de IgG y C3', 'jorobas'], ['lupus', 'Nefritis lúpica', 'todo positivo: «casa llena»', 'casallena'], ['iga', 'Nefropatía por IgA', 'IgA en el mesangio', 'mesangio']];
  return (
    <g>
      <Pantalla x={560} y={500} w={980} h={860} p={p('granular')}>
        <TxtPantalla x={0} y={-340} txt="Patrón granular" t={36} p={p('granular')} />
        <En k={1.05} o={tramo(p('grumos'), 0, 0.6)}><Glomerulo brillo="granular" /></En>
        <En k={1.05} o={1 - tramo(p('grumos'), 0, 0.6)}><Glomerulo brillo="pauci" /></En>
        <TxtPantalla x={0} y={330} txt="complejos en puntos sueltos: un collar de grumos" t={24} p={p('puntos')} />
      </Pantalla>
      {ej.map(([n, txt, sub, s2], i) => (
        <g key={n}>
          <Bandera x={1300} y={250 + i * 220} txt={txt} color={['#2F6FD8', '#8A4FE0', '#0C9E9A'][i]} p={p(n)} t={24} />
          <Txt x={1300} y={320 + i * 220} txt={sub} t={22} p={p(s2)} />
        </g>
      ))}
    </g>
  );
};

const Pauci: Lamina = ({ p, reloj }) => {
  return (
    <g>
      <Pantalla x={560} y={500} w={980} h={860} p={p('pauci')}>
        <TxtPantalla x={0} y={-340} txt="Patrón pauciinmune" t={36} p={p('pauci')} />
        <En k={1.05}><Glomerulo brillo="pauci" /></En>
        <TxtPantalla x={0} y={330} txt="casi a oscuras: poca IgG, poco C3" t={26} p={p('oscuras')} />
      </Pantalla>
      <Sale p={p('paradoja')} x={1300} y={300} k={0.6}><Glomerulo semiluna={0.9} necrosis={1} /></Sale>
      <Txt x={1300} y={490} txt="necrosado y lleno de semilunas…" t={22} p={p('paradoja')} />
      <Txt x={1300} y={530} txt="…pero la inmunofluorescencia sale vacía" t={22} p={p('paradoja')} />
      <Bandera x={1300} y={640} txt="Ese vacío es el diagnóstico" color={V.verde[0]} p={p('vacio')} t={26} />
      <Sale p={p('neutrofilo')} x={1300} y={820} k={1}><Neutrofilo cebado={1} activo={0.5 + 0.5 * Math.sin(reloj / 400) ** 2} /><Anca x={80} y={-50} r={-50} /></Sale>
      <Txt x={1300} y={930} txt="destruye sin dejar depósitos" t={22} p={p('neutrofilo')} />
    </g>
  );
};

const Caso: Lamina = ({ p }) => {
  const dob = p('doble');
  return (
    <g>
      <Bandera x={800} y={80} txt="Volvamos al caso" color={V.ambar[0]} p={p('caso')} t={30} punta="no" />
      <Bandera x={420} y={200} txt="Anti-PR3 positivo" color={V.pr3[0]} p={p('pr3')} t={26} />
      <Sale p={p('semilunas')} x={420} y={440} k={0.65}><Glomerulo semiluna={0.9} /></Sale>
      <Txt x={420} y={630} txt="biopsia con semilunas" t={24} p={p('semilunas')} />
      <Txt x={1150} y={220} txt="¿hace falta la inmunofluorescencia?" t={32} p={p('hacefalta')} />
      <Visto x={1150} y={320} k={1.3} p={p('si')} />
      <Txt x={1150} y={420} txt="al microscopio de luz, las tres pueden verse iguales" t={22} p={p('iguales')} />
      {[0, 1, 2].map((i) => <En key={i} x={960 + i * 190} y={560} k={0.28} o={tramo(p('iguales'), i * 0.15, 0.5 + i * 0.15)}><Glomerulo semiluna={0.9} /></En>)}
      <Bandera x={1150} y={760} txt="Un ANCA positivo no descarta anti-MBG" color="#2F6FD8" p={dob} t={24} />
      <Txt x={1150} y={830} txt="hay pacientes con los dos a la vez" t={22} p={dob} />
    </g>
  );
};

const Tratamiento: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="El patrón cambia el tratamiento" color="var(--cit-base)" p={p('tratamiento')} t={30} punta="no" />
      <Bandera x={400} y={220} txt="Anti membrana basal" color="#2F6FD8" p={p('mbg')} t={26} />
      <Sale p={p('plasma')} x={400} y={460} k={1.3}><BolsaSangre /></Sale>
      {[0, 1, 2].map((i) => <IgG key={i} x={560 + i * 50} y={lerp3(460, 300, p('plasma'), i)} k={1.2} r={i * 40} o={1 - tramo(p('plasma'), 0.6, 1)} />)}
      <Txt x={400} y={720} txt="recambio plasmático: sacar el anticuerpo" t={24} p={p('plasma')} />
      <Bandera x={1200} y={220} txt="Pauciinmune" color={V.verde[0]} p={p('pauci')} t={26} />
      <Sale p={p('rituximab')} x={1080} y={430} k={1.2}><Pastilla color={['#5B3CC4', '#8460E8', '#B39BFF']} /></Sale>
      <Txt x={1080} y={520} txt="rituximab" t={24} p={p('rituximab')} />
      <Sale p={p('ciclofosfamida')} x={1320} y={430} k={1.2}><Pastilla color={['#C2410C', '#F97316', '#FFC48A']} /></Sale>
      <Txt x={1320} y={520} txt="o ciclofosfamida" t={24} p={p('ciclofosfamida')} />
      <Txt x={1200} y={600} txt="frenar a los linfocitos B, más corticoides" t={24} p={p('corticoides')} />
      <Bandera x={800} y={850} txt="La inmunofluorescencia caracteriza cualquier glomerulonefritis" color={V.verde[0]} p={p('fundamental')} t={26} />
    </g>
  );
};
const lerp3 = (a: number, b: number, q: number, i: number) => a + (b - a) * easeOut(clamp(q * 1.2 - i * 0.1));

const Resumen: Lamina = ({ p }) => {
  const filas: [string, 'lineal' | 'granular' | 'pauci', string][] = [['lineal', 'lineal', 'el antígeno es la propia membrana'], ['granular', 'granular', 'complejos que llegan o se forman en puntos'], ['pauci', 'pauci', 'un neutrófilo que no deja huella']];
  return (
    <g>
      <Bandera x={800} y={80} txt="Resumen" color="var(--cit-base)" p={p('resumen')} t={32} punta="no" />
      {filas.map(([n, b, txt], i) => (
        <g key={n}>
          <Sale p={p(n)} x={300} y={250 + i * 210} k={0.32}><Pantalla w={560} h={560}><Glomerulo brillo={b} R={230} /></Pantalla></Sale>
          <Bandera x={560} y={250 + i * 210} txt={['Lineal', 'Granular', 'Pauciinmune'][i]} color={V.verde[0]} p={p(n)} t={28} ancla="izq" punta="izq" />
          <Txt x={820} y={250 + i * 210} txt={txt} t={26} p={p(n)} ancla="start" />
        </g>
      ))}
      <Flecha a={[800, 820]} b={[800, 870]} p={p('paciente')} color={FLECHA} w={7} />
      <Bandera x={800} y={920} txt="Primer paciente: pauciinmune, anti-PR3 → GPA" color={V.turquesa[0]} p={p('gpa')} t={28} />
    </g>
  );
};

const LAMINAS: Lamina[] = [QueHay, Lineal, Granular, Pauci, Caso, Tratamiento, Resumen];
export default LAMINAS;
