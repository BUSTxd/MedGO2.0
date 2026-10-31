// Capítulo 2 — La basura nuclear. El tejido es el protagonista: una epidermis
// por capas sobre la dermis. Apoptosis normal → la UV mata muchos queratinocitos
// (lupa: las burbujas empaquetan el núcleo) → el macrófago con C1q limpia sin
// inflamar → en el lupus la limpieza falla → necrosis secundaria: nucleosomas
// libres que se modifican → con la tolerancia debilitada, la chispa → la ciudad
// con el triple de basura. Guion §2. `at` = hora de cada frase en el audio (ms).

import type { Accion, ActorDecl, Parte, ParamTejido, Pos } from './tipos';
import { L } from './colores';
import { NARRACION } from './narracion';

const p = (param: ParamTejido, a: number, at: number, duration: number): Accion => ({ at, duration, tipo: 'tejido', param, a });
const apagar = (at: number, ...ps: ParamTejido[]) => ps.map((x) => p(x, 0, at, 600));
const ocultar = (at: number, ...ks: string[]): Accion[] => ks.map((actor) => ({ at, duration: 600, tipo: 'hide', actor }));

const AP: ActorDecl = { forma: 'dibujo', dibujo: 'apoptotico', label: '', d: 74, color: '#E9A8B8', info: 'apoptotico' };
const NUC: ActorDecl = { forma: 'dibujo', dibujo: 'nucleosoma', label: '', d: 66, color: L.histona, info: 'nucleosoma' };

/** Dónde cae cada cuerpo apoptótico en la dermis (y luego su nucleosoma). */
const SITIO: Record<string, Pos> = {
  ap2: { col: 7.3, row: 6.3 }, ap3: { col: 8.5, row: 7.8 }, ap4: { col: 9.5, row: 6.4 },
  ap5: { col: 10.2, row: 8.6 }, ap6: { col: 7.6, row: 8.5 }, ap7: { col: 9.1, row: 8.8 },
};
/** De qué queratinocito sale (en la epidermis). */
const ORIGEN: Record<string, Pos> = {
  ap2: { col: 6.4, row: 3.4 }, ap3: { col: 8.1, row: 2.8 }, ap4: { col: 9.6, row: 3.6 },
  ap5: { col: 11.2, row: 3 }, ap6: { col: 5.2, row: 3.9 }, ap7: { col: 12.6, row: 3.8 },
};
const CAEN = Object.keys(SITIO);

const basura: Parte = {
  id: 'basura',
  numero: 2,
  tipo: 'Mecanismo',
  nombre: 'La basura nuclear',
  nombreCorto: 'Basura nuclear',
  lugar: 'Epidermis y macrófago',
  color: L.mecanismo,
  pregunta: '¿Qué pasa cuando las células mueren de más y se limpian de menos?',
  resumen: 'Apoptosis por UV, burbujas con antígenos nucleares, eferocitosis con C1q, limpieza que falla, necrosis secundaria y autoantígenos.',
  fondo: 'epidermis',
  narracion: NARRACION[2],
  actores: {
    mac: { forma: 'celula', img: 'macrofago', label: 'Macrófago', sub: 'equipo de limpieza', d: 200, color: '#E8A06A', info: 'macrofago' },
    ap1: { ...AP, label: 'Cuerpo apoptótico' },
    ap2: AP, ap3: AP, ap4: AP, ap5: AP, ap6: AP, ap7: AP,
    c1q: { forma: 'dibujo', dibujo: 'c1q', label: 'C1q', d: 62, color: '#C0397A', info: 'c1q' },
    nuc2: { ...NUC, label: 'Nucleosoma' }, nuc3: NUC, nuc4: NUC, nuc5: NUC, nuc6: NUC, nuc7: NUC,
    adn: { forma: 'dibujo', dibujo: 'fragadn', label: 'ADN', d: 100, color: L.adn, info: 'adn' },
    arn: { forma: 'dibujo', dibujo: 'fragarn', label: 'ARN', d: 90, color: L.rnp, info: 'arn' },
    his: { forma: 'dibujo', dibujo: 'octamero', label: 'Histonas', d: 84, color: L.histona, info: 'histonas' },
    lin: { forma: 'celula', img: 'linfocito_b', label: 'Linfocito autorreactivo', sub: 'escapó a la tolerancia', d: 130, color: '#5E9CD3', info: 'linfocito_b' },
  },
  pasos: [
    {
      id: 'bn-0',
      orden: 0,
      titulo: 'La epidermis',
      texto: 'La epidermis, con sus queratinocitos en capas. Cada día mueren millones de células por apoptosis: una muerte programada, silenciosa y ordenada. El problema del lupus no es que mueran, sino lo que pasa después.',
      claves: ['apoptosis', 'silenciosa', 'lo que pasa después'],
      profundiza: 'La apoptosis es una muerte «limpia»: la célula se encoge, condensa la cromatina, corta su ADN en fragmentos regulares y se parte en cuerpos rodeados de membrana. No derrama su contenido, así que no inflama. La necrosis, en cambio, rompe la membrana y lo derrama todo.',
      protagonistas: [],
      encuadre: 'all',
      acciones: [
        p('capas', 1, 3400, 2000),
        p('apoNormal', 1, 7200, 3000),
        p('silencio', 1, 11100, 800),
        p('despues', 1, 17800, 900),
      ],
    },
    {
      id: 'bn-1',
      orden: 1,
      titulo: 'Burbujas con núcleo',
      texto: 'La luz UV daña el ADN de los queratinocitos y muchos entran en apoptosis a la vez. Al morir, su membrana se llena de burbujas donde se concentran los antígenos nucleares: ADN fragmentado, nucleosomas, Ro y Sm.',
      claves: ['luz UV', 'burbujas', 'antígenos nucleares'],
      profundiza: 'Hay dos tipos de burbujas: las pequeñas, cerca de la superficie, llevan Ro y restos del retículo; las grandes llevan nucleosomas, ADN y Sm. Quedan justo al alcance de los anticuerpos y de los receptores de los fagocitos.',
      clinica: 'Por eso la piel expuesta al sol es donde más aparece el lupus cutáneo, y por eso un día de playa puede desencadenar un brote sistémico.',
      protagonistas: [],
      encuadre: 'all',
      acciones: [
        ...apagar(0, 'silencio', 'despues'),
        p('uv', 1, 0, 1800),
        p('apoUV', 1, 2000, 3500),
        p('sano', 1, 6400, 800),
        p('zoom', 0.5, 9100, 1200),
        p('zoom', 1, 17900, 2500),
        p('empaqueta', 1, 23100, 1000),
      ],
    },
    {
      id: 'bn-2',
      orden: 2,
      titulo: 'La limpieza normal',
      texto: 'Los macrófagos reconocen a la célula apoptótica por la fosfatidilserina expuesta, y el C1q marca los restos para que los engullan rápido. Se los comen antes de que nadie los vea, y eso además calma la inflamación.',
      claves: ['fosfatidilserina', 'C1q', 'calma la inflamación'],
      profundiza: 'La fosfatidilserina vive normalmente en la cara interna de la membrana; al morir, la célula la voltea hacia afuera: es la señal de «cómeme». Al engullir células apoptóticas, el macrófago libera IL-10 y TGF-β, que apagan la inflamación: la eferocitosis es antiinflamatoria.',
      protagonistas: ['mac', 'ap1'],
      encuadre: 'all',
      acciones: [
        ...apagar(0, 'zoom', 'empaqueta', 'sano', 'uv'),
        { at: 400, duration: 900, tipo: 'appear', actor: 'mac', pos: { col: 5.6, row: 7.4 }, from: 'grow' },
        { at: 800, duration: 600, tipo: 'appear', actor: 'ap1', pos: { col: 7.2, row: 3.5 } },
        { at: 1600, duration: 1800, tipo: 'move', actor: 'ap1', to: { col: 8.6, row: 7.2 } },
        { at: 4500, tipo: 'express', actor: 'ap1', marcador: { id: 'ps', tipo: 'cd', label: 'PS', ang: -30, color: '#E8B21E' } },
        { at: 5200, tipo: 'note', text: 'Fosfatidilserina: la señal de «cómeme»', near: 'ap1', side: 'right' },
        { at: 8000, duration: 600, tipo: 'appear', actor: 'c1q', pos: { col: 9.9, row: 5.8 } },
        { at: 8600, duration: 700, tipo: 'bind', actor: 'c1q', target: 'ap1', ang: -110 },
        { at: 11500, duration: 2600, tipo: 'fagocitar', actor: 'mac', target: 'ap1' },
        p('calma', 1, 15100, 1000),
        p('sinAlarma', 1, 19800, 900),
      ],
    },
    {
      id: 'bn-3',
      orden: 3,
      titulo: 'La limpieza falla',
      texto: 'En el lupus hay más apoptosis y, además, los macrófagos y todo el sistema fagocítico mononuclear no retiran a tiempo los cuerpos apoptóticos (falta complemento o falla el fagocito). Es el evento central: más muerte, limpieza más lenta.',
      claves: ['más apoptosis', 'no retiran a tiempo', 'evento central'],
      profundiza: 'Los macrófagos de muchos pacientes con lupus engullen peor in vitro, y en los centros germinales de sus ganglios se ven cuerpos apoptóticos sin retirar, justo donde maduran los linfocitos B: allí la basura nuclear se encuentra con quien puede fabricar anticuerpos contra ella.',
      protagonistas: CAEN,
      encuadre: 'all',
      acciones: [
        ...apagar(0, 'calma', 'sinAlarma'),
        p('falla', 1, 0, 800),
        p('apoMas', 1, 2600, 2500),
        ...CAEN.flatMap((k, i): Accion[] => [
          { at: 3000 + i * 500, duration: 500, tipo: 'appear', actor: k, pos: ORIGEN[k] },
          { at: 3600 + i * 600, duration: 2200, tipo: 'move', actor: k, to: SITIO[k] },
        ]),
        p('medidor', 1, 3200, 1200),
        p('muerte', 1, 3600, 2600),
        p('lenta', 1, 7000, 2800),
        p('central', 1, 14100, 900),
      ],
    },
    {
      id: 'bn-4',
      orden: 4,
      titulo: 'Necrosis secundaria',
      texto: 'Los cuerpos que nadie recoge pasan a necrosis secundaria, se rompen y su contenido queda libre: ADN, ARN, histonas, nucleosomas. Persiste, se modifica, se oxida, y el sistema inmune lo ve como algo nuevo, extraño.',
      claves: ['necrosis secundaria', 'nucleosomas', 'se modifica', 'extraño'],
      profundiza: 'Las modificaciones importan: el ADN oxidado y las histonas acetiladas o citrulinadas son mucho más inmunogénicas que las normales. Lo que el sistema inmune toleraba en su forma original deja de parecerle propio.',
      protagonistas: [],
      encuadre: 'all',
      acciones: [
        ...apagar(0, 'falla', 'medidor', 'muerte', 'lenta', 'central'),
        ...CAEN.flatMap((k, i): Accion[] => [
          { at: 2600 + i * 500, duration: 1400, tipo: 'lisis', actor: k },
          { at: 3500 + i * 500, duration: 700, tipo: 'appear', actor: `nuc${k.slice(2)}`, pos: SITIO[k], from: 'grow' },
        ]),
        { at: 7000, duration: 600, tipo: 'appear', actor: 'adn', pos: { col: 11.6, row: 6.5 }, from: 'grow' },
        { at: 7900, duration: 600, tipo: 'appear', actor: 'arn', pos: { col: 13.1, row: 8.6 }, from: 'grow' },
        { at: 8800, duration: 600, tipo: 'appear', actor: 'his', pos: { col: 12.5, row: 7.1 }, from: 'grow' },
        ...CAEN.map((k, i): Accion => ({ at: 11400 + i * 350, duration: 900, tipo: 'swap', actor: `nuc${k.slice(2)}`, dibujo: 'nucleosomaox' })),
        { at: 12000, tipo: 'note', text: 'Se modifica, se oxida, se fragmenta', near: 'nuc2', side: 'top' },
        { at: 15900, tipo: 'note', text: 'Ahora parece extraño', near: 'nuc5', side: 'right' },
        { at: 20300, duration: 800, tipo: 'outcome', kind: 'lesion', pos: { col: 8, row: 9.6 }, texto: 'Lo propio, antes escondido en el núcleo, ahora está a la vista' },
      ],
    },
    {
      id: 'bn-5',
      orden: 5,
      titulo: 'Nacen los autoantígenos',
      texto: 'Así nacen los autoantígenos del lupus. Normalmente, los linfocitos que reconocen lo propio se eliminan o se frenan (médula, timo, periferia); en el lupus esa tolerancia está debilitada. Exceso de antígeno + poca tolerancia = la chispa.',
      claves: ['autoantígenos', 'tolerancia', 'la chispa'],
      profundiza: 'Tolerancia central: en la médula ósea (linfocitos B) y en el timo (linfocitos T) se eliminan o reeditan los que reconocen lo propio con fuerza. Tolerancia periférica: anergia, linfocitos T reguladores y falta de coestimulación. En el lupus fallan las dos, y lo veremos en detalle en el capítulo 4.',
      protagonistas: ['lin', 'nuc2'],
      encuadre: 'all',
      acciones: [
        ...ocultar(0, 'adn', 'arn', 'his'),
        { at: 500, tipo: 'note', text: 'Autoantígenos', near: 'nuc2', side: 'top' },
        p('tolerancia', 1, 2600, 1800),
        p('debil', 1, 11500, 1800),
        { at: 12500, duration: 800, tipo: 'appear', actor: 'lin', pos: { col: 15, row: 7.4 }, from: 'right' },
        { at: 14000, duration: 3000, tipo: 'move', actor: 'lin', to: { col: 11.4, row: 7.4 } },
        { at: 17400, duration: 2400, tipo: 'move', actor: 'lin', to: { col: 10.9, row: 6.7 } },
        { at: 22100, duration: 900, tipo: 'activate', actor: 'lin' },
        p('chispa', 1, 22100, 1200),
      ],
    },
    {
      id: 'bn-6',
      orden: 6,
      titulo: 'Resumen: la ciudad',
      texto: 'Como una ciudad donde se triplica la basura y el camión pasa una vez por semana: tarde o temprano alguien llama a la policía. La policía es el sistema inmune, y la llamada es el interferón (capítulo 3).',
      claves: ['se triplica la basura', 'una vez por semana', 'interferón'],
      profundiza: 'Basura = ADN, ARN y nucleosomas expuestos. Camión = macrófagos con C1q. Policía = la célula dendrítica plasmocitoide y los linfocitos. La alarma = el interferón de tipo I, que el capítulo siguiente pone en el centro del lupus.',
      protagonistas: [],
      encuadre: 'all',
      acciones: [
        ...ocultar(0, 'mac', 'ap1', 'c1q', 'lin', 'nuc2', 'nuc3', 'nuc4', 'nuc5', 'nuc6', 'nuc7'),
        { at: 0, duration: 1000, tipo: 'fondo', fondo: 'ciudad' },
        p('calle', 1, 1000, 1400),
        p('basura', 1, 3000, 2600),
        p('camion', 1, 5200, 1600),
        p('policia', 1, 7400, 1200),
        p('inmune', 1, 10100, 2400),
        p('interferon', 0.5, 15600, 1000),
        p('interferon', 1, 19000, 1000),
      ],
    },
  ],
};

export default basura;
