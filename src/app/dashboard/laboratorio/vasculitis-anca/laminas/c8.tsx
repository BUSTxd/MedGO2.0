'use client';
// Capítulo 8 · Tres formas de brillar: inmunofluorescencia lineal, granular y pauciinmune.

import type { Lamina } from '../Lienzo';
import { Pastilla, BolsaSangre } from '../../citopenias-autoinmunes/Piezas';
import { Visto } from '../../citopenias-autoinmunes/laminas/Comun';
import { Anca, Bandera, En, Pr3, Flecha, FLECHA, Glomerulo, IgG, Neutrofilo, Pantalla, Pulmones, Sale, Txt, TxtPantalla, V, clamp, easeOut, tramo, Portaobjetos, FotoLente, FotoCuadro, Llamada } from '../Piezas';

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

/** Red de colágeno IV de la membrana basal (triples hélices en malla), con anticuerpos pegados de forma continua. */
function ColagenoIV({ ig = 0 }: { ig?: number }) {
  const nodos: [number, number][] = [[-120, -20], [-60, 20], [0, -20], [60, 20], [120, -20]];
  return (
    <g>
      {nodos.slice(0, -1).map(([x1, y1], i) => { const [x2, y2] = nodos[i + 1]; return [0, 1, 2].map((j) => <path key={i + '-' + j} d={'M' + x1 + ',' + (y1 + j * 4 - 4) + ' Q' + ((x1 + x2) / 2) + ',' + ((y1 + y2) / 2 + (j - 1) * 10) + ' ' + x2 + ',' + (y2 + j * 4 - 4)} fill="none" stroke={['#E5A32E', '#F2C230', '#C99300'][j]} strokeWidth={3.5} strokeLinecap="round" />); })}
      {nodos.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={8} fill="#C99300" />)}
      {[-90, -30, 30, 90].map((x, i) => <g key={i} opacity={tramo(ig, i * 0.15, 0.5 + i * 0.15)}><Anca x={x} y={i % 2 ? 10 : -50} r={i % 2 ? 180 : 0} k={0.9} /></g>)}
    </g>
  );
}

/** Estreptococo: cadena de cocos (glomerulonefritis postinfecciosa). */
function Estrepto() {
  return <g>{[0, 1, 2, 3, 4].map((i) => <g key={i}><circle cx={-48 + i * 24} cy={Math.sin(i) * 8} r={12} fill="#1F6FB2" /><circle cx={-51 + i * 24} cy={Math.sin(i) * 8 - 3} r={9} fill="#3B9EDD" /></g>)}</g>;
}

/** Eritema en alas de mariposa (lupus). */
function Mariposa() {
  return (
    <g>
      <circle r={42} fill="#E9A58A" />
      <path d="M0,4 C-10,-10 -36,-12 -38,2 C-40,16 -20,22 -2,14 Z M0,4 C10,-10 36,-12 38,2 C40,16 20,22 2,14 Z" fill="#E0338A" opacity={0.8} />
      <circle cx={-14} cy={-10} r={3.5} fill="#3A1342" /><circle cx={14} cy={-10} r={3.5} fill="#3A1342" />
    </g>
  );
}

/** IgA dimérica: dos anticuerpos unidos por la cadena J. */
function IgAdimero() {
  return (
    <g>
      <Anca x={-16} y={-8} r={-60} k={1.1} />
      <Anca x={16} y={-8} r={60} k={1.1} />
      <circle cx={0} cy={8} r={7} fill="#0C9E9A" />
    </g>
  );
}

const Lineal: Lamina = ({ p }) => {
  const c = p('cinta');
  return (
    <g>
      <Pantalla x={560} y={500} w={980} h={860} p={p('lineal')}>
        <TxtPantalla x={0} y={-340} txt="Patrón lineal" t={36} p={p('lineal')} />
        <TxtPantalla x={-235} y={-238} txt="dibujo" t={20} p={p('lineal')} />
        <En x={-235} y={0} k={0.7} o={tramo(c, 0, 0.6)}><Glomerulo brillo="lineal" /></En>
        <En x={-235} y={0} k={0.7} o={1 - tramo(c, 0, 0.6)}><Glomerulo brillo="pauci" /></En>
        <TxtPantalla x={235} y={-238} txt="foto real" t={20} p={p('lineal')} />
        <FotoLente x={235} y={-10} R={200} foto="if-igg" o={p('lineal')} aro={V.verde[0]} tinta="#BFF5CB" />
        <Portaobjetos x={235} y={292} k={0.55} o={tramo(p('lineal'), 0.3, 1)} organo="RIÑÓN" tincion="IF · IgG" caso="biopsia renal" tejido="#2A3A2A" />
        <TxtPantalla x={0} y={370} txt="una cinta fina y continua en cada asa" t={24} p={c} />
      </Pantalla>
      <Sale p={p('colageno')} x={1300} y={190} k={1}><ColagenoIV ig={p('continuo')} /></Sale>
      <Txt x={1300} y={262} txt="anticuerpos contra el colágeno IV (cadena α3)" t={20} p={p('colageno')} />
      <Txt x={1300} y={310} txt="el antígeno es la propia membrana" t={22} p={p('continuo')} />
      <Txt x={1300} y={345} txt="repartido de forma continua" t={20} p={p('continuo')} fuerte={false} />
      <Txt x={1300} y={450} txt="brilla entero, como un ovillo de cintas" t={22} p={p('entero')} />
      <Txt x={1300} y={560} txt="enfermedad anti membrana basal" t={26} color="#2F6FD8" p={p('antimbg')} />
      <Sale p={p('pulmon')} x={1300} y={720} k={0.5}><Pulmones sangre={p('goodpasture')} /></Sale>
      <Txt x={1300} y={900} txt="si sangra el pulmón: Goodpasture" t={24} color={V.sangre[1]} p={p('goodpasture')} />
    </g>
  );
};

const Granular: Lamina = ({ p }) => {
  const ej: [string, string, string, string][] = [['postinf', 'Postinfecciosa', 'jorobas de IgG y C3', 'jorobas'], ['lupus', 'Nefritis lúpica', 'todo positivo: «casa llena»', 'casallena'], ['iga', 'Nefropatía por IgA', 'IgA en el mesangio', 'mesangio']];
  return (
    <g>
      <Pantalla x={560} y={500} w={980} h={860} p={p('granular')}>
        <TxtPantalla x={0} y={-340} txt="Patrón granular" t={36} p={p('granular')} />
        <TxtPantalla x={-235} y={-238} txt="dibujo" t={20} p={p('granular')} />
        <En x={-235} y={0} k={0.7} o={tramo(p('grumos'), 0, 0.6)}><Glomerulo brillo="granular" /></En>
        <En x={-235} y={0} k={0.7} o={1 - tramo(p('grumos'), 0, 0.6)}><Glomerulo brillo="pauci" /></En>
        <TxtPantalla x={235} y={-238} txt="foto real" t={20} p={p('granular')} />
        <FotoLente x={235} y={-10} R={200} foto="if-granular" o={p('granular')} aro={V.verde[0]} tinta="#BFF5CB" />
        <Portaobjetos x={235} y={292} k={0.55} o={tramo(p('granular'), 0.3, 1)} organo="RIÑÓN" tincion="IF · IgA" caso="nefropatía IgA" tejido="#2A3A2A" />
        <TxtPantalla x={0} y={370} txt="complejos en puntos sueltos: un collar de grumos" t={24} p={p('puntos')} />
      </Pantalla>
      {ej.map(([n, txt, sub, s2], i) => (
        <g key={n}>
          <Sale p={p(n)} x={1180} y={250 + i * 220} k={1.4}>{i === 0 ? <Estrepto /> : i === 1 ? <Mariposa /> : <IgAdimero />}</Sale>
          <Txt x={1280} y={232 + i * 220} txt={["postinfecciosa", "nefritis lúpica", "nefropatía por IgA"][i]} t={24} p={p(n)} ancla="start" />
          <Txt x={1280} y={268 + i * 220} txt={sub} t={20} p={p(s2)} ancla="start" fuerte={false} />
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
        <TxtPantalla x={-235} y={-238} txt="dibujo" t={20} p={p('pauci')} />
        <En x={-235} y={0} k={0.7}><Glomerulo brillo="pauci" /></En>
        <TxtPantalla x={235} y={-238} txt="foto real" t={20} p={p('pauci')} />
        {/* Ocho tinciones del mismo glomérulo: todo apagado salvo el fibrinógeno de la necrosis */}
        <FotoCuadro x={235} y={-2} w={281} h={420} foto="if-pauci" o={p('pauci')} tinta="#BFF5CB" />
        <Portaobjetos x={235} y={292} k={0.55} o={tramo(p('pauci'), 0.3, 1)} organo="RIÑÓN" tincion="IF directa" caso="GN por ANCA" tejido="#2A3A2A" />
        <TxtPantalla x={0} y={345} txt="casi a oscuras: poca IgG, poco C3" t={26} p={p('oscuras')} />
        <TxtPantalla x={0} y={381} txt="solo brilla el fibrinógeno de la necrosis" t={20} p={p('oscuras')} />
      </Pantalla>
      {/* Foto real desde el principio (centro 1340,300, R 140: 1 px de la foto = 0,389) */}
      <FotoLente x={1340} y={300} R={140} foto="anca-gn-fibrinoide" o={p('pauci')} credito="arriba" />
      <Llamada x={1060} y={300} a={[1340 + (267 - 360) * 0.389, 300 + (278 - 360) * 0.389]} txt="necrosis" p={p('paradoja')} t={20} halo />
      <Portaobjetos x={1340} y={585} k={0.55} o={tramo(p('pauci'), 0.3, 1)} organo="RIÑÓN" tincion="H-E" caso="GN por ANCA" />
      <Txt x={1300} y={490} txt="necrosado, con semilunas…" t={22} p={p('paradoja')} />
      <Txt x={1300} y={530} txt="…pero la inmunofluorescencia sale vacía" t={22} p={p('paradoja')} />
      <Txt x={1300} y={640} txt="ese vacío es el diagnóstico" t={28} color={V.verde[0]} p={p('vacio')} />
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
      <En x={300} y={190} o={tramo(p('pr3'), 0, 0.4)}><Anca y={-6} k={1.8} /><Pr3 y={-22} k={1.3} /></En>
      <Txt x={360} y={190} txt="anti-PR3 positivo" t={26} p={p('pr3')} ancla="start" />
      <Sale p={p('semilunas')} x={420} y={440} k={0.65}><Glomerulo semiluna={0.9} /></Sale>
      <Txt x={420} y={630} txt="biopsia con semilunas" t={24} p={p('semilunas')} />
      <Txt x={1150} y={220} txt="¿hace falta la inmunofluorescencia?" t={32} p={p('hacefalta')} />
      <Visto x={1150} y={320} k={1.3} p={p('si')} />
      <Txt x={1150} y={420} txt="al microscopio de luz, las tres pueden verse iguales" t={22} p={p('iguales')} />
      {[0, 1, 2].map((i) => <En key={i} x={960 + i * 190} y={560} k={0.28} o={tramo(p('iguales'), i * 0.15, 0.5 + i * 0.15)}><Glomerulo semiluna={0.9} /></En>)}
      <Txt x={1150} y={760} txt="un ANCA positivo no descarta anti-MBG" t={26} color="#2F6FD8" p={dob} />
      <Txt x={1150} y={830} txt="hay pacientes con los dos a la vez" t={22} p={dob} />
    </g>
  );
};

const Tratamiento: Lamina = ({ p }) => {
  return (
    <g>
      <Bandera x={800} y={80} txt="El patrón cambia el tratamiento" color="var(--cit-base)" p={p('tratamiento')} t={30} punta="no" />
      <Sale p={p('mbg')} x={250} y={185} k={0.42}><Pantalla w={300} h={300}><Glomerulo brillo="lineal" R={120} /></Pantalla></Sale>
      <Txt x={330} y={185} txt="anti membrana basal" t={26} p={p('mbg')} ancla="start" />
      <Sale p={p('plasma')} x={400} y={460} k={1.3}><BolsaSangre /></Sale>
      {[0, 1, 2].map((i) => <IgG key={i} x={560 + i * 50} y={lerp3(460, 300, p('plasma'), i)} k={1.2} r={i * 40} o={1 - tramo(p('plasma'), 0.6, 1)} />)}
      <Txt x={400} y={720} txt="recambio plasmático: sacar el anticuerpo" t={24} p={p('plasma')} />
      <Sale p={p('pauci')} x={1070} y={185} k={0.42}><Pantalla w={300} h={300}><Glomerulo brillo="pauci" R={120} /></Pantalla></Sale>
      <Txt x={1150} y={185} txt="pauciinmune" t={26} p={p('pauci')} ancla="start" />
      <Sale p={p('rituximab')} x={1080} y={430} k={1.2}><Pastilla color={['#5B3CC4', '#8460E8', '#B39BFF']} /></Sale>
      <Txt x={1080} y={520} txt="rituximab" t={24} p={p('rituximab')} />
      <Sale p={p('ciclofosfamida')} x={1320} y={430} k={1.2}><Pastilla color={['#C2410C', '#F97316', '#FFC48A']} /></Sale>
      <Txt x={1320} y={520} txt="o ciclofosfamida" t={24} p={p('ciclofosfamida')} />
      <Txt x={1200} y={600} txt="frenar a los linfocitos B, más corticoides" t={24} p={p('corticoides')} />
      <Txt x={800} y={850} txt="la inmunofluorescencia caracteriza cualquier glomerulonefritis" t={28} color={V.verde[0]} p={p('fundamental')} />
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
          <Txt x={470} y={250 + i * 210} txt={['lineal', 'granular', 'pauciinmune'][i]} t={30} color={V.verde[0]} p={p(n)} ancla="start" />
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
