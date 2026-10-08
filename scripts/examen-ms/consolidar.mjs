/**
 * Une las extracciones de los resúmenes (docs/examen-ms/extraccion/*.json) en un
 * catálogo único, lo cruza con el modelo 3D (manifiesto local) y con las fichas
 * del atlas, y marca conflictos para revisión.
 *
 *   node scripts/examen-ms/consolidar.mjs
 *
 * Salidas (gitignored):
 *   docs/examen-ms/catalogo_estructuras.json
 *   docs/examen-ms/estructuras_sin_modelo.md
 *   docs/examen-ms/CATALOGO.md            (tabla legible para revisar)
 *
 * Reglas: nada se completa de memoria. Los alias solo unen nombres que el resumen
 * usa para lo mismo; las equivalencias que no salen del resumen van con `revision`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(AQUI, '..', '..');
const DOCS = path.join(RAIZ, 'docs', 'examen-ms');
const REGION = 'miembro-superior-derecho';

export const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[.,;:()[\]{}"«»/]/g, ' ').replace(/\s+/g, ' ').trim();

// ── Alias: nombre del resumen → nombre canónico (por categoría) ────────────────
const ALIAS = {
  hueso: {
    '1er metacarpiano': 'Primer metacarpiano', '1 er metacarpiano': 'Primer metacarpiano',
    '2do metacarpiano': 'Segundo metacarpiano', '2 º metacarpiano': 'Segundo metacarpiano',
    '3er metacarpiano': 'Tercer metacarpiano', '3 er metacarpiano': 'Tercer metacarpiano',
    '4to metacarpiano': 'Cuarto metacarpiano',
    '5to metacarpiano': 'Quinto metacarpiano', '5 º metacarpiano': 'Quinto metacarpiano',
    'trapecio': 'Trapecio (hueso)', 'grande': 'Grande (hueso)', 'cubito': 'Cúbito',
    'falange proximal del 1 er dedo': 'Falange proximal del pulgar',
    'falange distal del pulgar': 'Falange distal del pulgar',
    'falange proximal del 5 º dedo': 'Falange proximal del meñique',
    'falange proximal': 'Falanges proximales', 'falanges proximales 2 º-4 º dedos': 'Falanges proximales',
    'falange media': 'Falanges medias', 'falanges medias': 'Falanges medias', 'falanges medias del 2 º al 5 º dedo': 'Falanges medias',
    'falange distal': 'Falanges distales', 'falanges distales': 'Falanges distales', 'falanges distales del 2 º al 5 º dedo': 'Falanges distales',
    'metacarpo': 'Metacarpianos', 'carpo': 'Huesos del carpo',
    // nombres que salen en los rótulos de las figuras
    'capitato hueso grande': 'Grande (hueso)', 'lunar semilunar': 'Semilunar', 'triquetro piramidal': 'Piramidal',
    'clavicula derecha vista superior e inferior': 'Clavícula',
    'falange distal fd': 'Falanges distales', 'falange media fm': 'Falanges medias', 'falange proximal fp': 'Falanges proximales',
    'falange media del dedo indice': 'Falange media del índice', 'falanges proximal media distal': 'Falanges',
    'metacarpiano sin numero': 'Metacarpianos', 'metacarpianos i-v': 'Metacarpianos', 'orden de los huesos del carpo rotulos de f23': 'Huesos del carpo',
  },
  accidente: {
    'borde lateral axilar de la escapula': 'Borde lateral de la escápula',
    'borde medial vertebral de la escapula': 'Borde medial de la escápula',
    'borde lateral interoseo del cubito': 'Borde interóseo del cúbito',
    'borde medial interoseo del radio': 'Borde interóseo del radio',
    'capitulo': 'Capítulo del húmero',
    'cresta tuberculo del trapecio': 'Tubérculo del trapecio',
    'cresta del supinador del cubito': 'Cresta del supinador',
    'cuello quirurgico': 'Cuello quirúrgico del húmero', 'cuello anatomico': 'Cuello anatómico del húmero',
    'diafisis del humero tercio medio de la cara anteromedial': 'Diáfisis del húmero',
    'epicondilo medial epitroclea': 'Epicóndilo medial',
    'escotadura radial': 'Escotadura radial del cúbito', 'escotadura troclear': 'Escotadura troclear del cúbito',
    'surco radial': 'Surco del nervio radial',
    'troclea': 'Tróclea del húmero',
    'tuberculo de lister': 'Tubérculo dorsal del radio', 'tuberculo dorsal del radio tuberculo de lister': 'Tubérculo dorsal del radio',
    'tuberosidad infraglenoidea': 'Tubérculo infraglenoideo', 'tuberosidad supraglenoidea': 'Tubérculo supraglenoideo',
    'tuberosidad cubital': 'Tuberosidad del cúbito', 'tuberosidad radial': 'Tuberosidad del radio',
    'apofisis unciforme gancho del ganchoso': 'Gancho del ganchoso',
    'fosa radial': 'Fosa radial del húmero', 'fosa coronoidea': 'Fosa coronoidea del húmero', 'fosa olecraneana': 'Fosa olecraneana del húmero',
    'cara inferior del radio': 'Cara inferior (carpiana) del radio',
    'superficie articular carpiana del radio': 'Cara inferior (carpiana) del radio',
    'apofisis coronoides cara anterior': 'Apófisis coronoides', 'capitulo condilo': 'Capítulo del húmero',
    'condilo del humero capitulo + troclea': 'Cóndilo del húmero', 'cavidad glenoidea angulo lateral': 'Cavidad glenoidea',
    'cresta supinadora': 'Cresta del supinador',
    'epifisis lateral acromial de la clavicula': 'Extremo lateral (acromial) de la clavícula', 'extremidad acromial extremo lateral de la clavicula': 'Extremo lateral (acromial) de la clavícula',
    'epifisis medial esternal de la clavicula': 'Extremo medial (esternal) de la clavícula', 'extremidad esternal extremo medial de la clavicula': 'Extremo medial (esternal) de la clavícula',
    'escotadura radial incisura radial': 'Escotadura radial del cúbito', 'escotadura troclear incisura troclear': 'Escotadura troclear del cúbito',
    'fosa olecraneana del olecranon': 'Fosa olecraneana del húmero',
    'linea trapezoidea': 'Línea trapezoide', 'rugosidad trapezoide': 'Línea trapezoide',
    'tuberculo conoideo': 'Tubérculo conoide', 'rugosidad conoide': 'Tubérculo conoide',
    'rugosidad costoclavicular': 'Impresión para el ligamento costoclavicular', 'surco para el musculo subclavio': 'Surco subclavio',
    'olecranon parte posterior de la superficie superior': 'Olécranon', 'surco del nervio radial surco radial': 'Surco del nervio radial',
    'tuberculo dorsal del radio de lister': 'Tubérculo dorsal del radio',
    'tuberculo mayor troquiter': 'Tubérculo mayor', 'tuberculo menor troquin': 'Tubérculo menor',
    'tuberosidad del radio parte posterior': 'Tuberosidad del radio', 'tuberosidad deltoidea insercion del deltoides': 'Tuberosidad deltoidea',
    'borde lateral del humero cresta supracondilea lateral': 'Cresta supracondílea lateral',
    'borde medial del humero cresta supracondilea medial': 'Cresta supracondílea medial',
    'borde medial del humero tercio medio ~5 cm': 'Borde medial del húmero',
    'mitad inferior de la cara anterior del humero origen del braquial': 'Cara anterior del húmero (mitad inferior)',
  },
  musculo: {
    '1 er extensor radial del carpo': 'Extensor radial largo del carpo', 'extensor radial del carpo largo': 'Extensor radial largo del carpo',
    '2 º extensor radial del carpo': 'Extensor radial corto del carpo', 'extensor radial del carpo corto': 'Extensor radial corto del carpo',
    '1 er y 2 º lumbricales': 'Lumbricales 1.º y 2.º', '3 er y 4 º lumbricales': 'Lumbricales 3.º y 4.º',
    'extensor del 5 º dedo': 'Extensor del meñique', 'extensor del 5to dedo': 'Extensor del meñique',
    'extensor propio del indice': 'Extensor del índice',
    'flexor comun profundo de los dedos': 'Flexor profundo de los dedos', 'flexor comun superficial de los dedos': 'Flexor superficial de los dedos',
    'flexor del menique': 'Flexor corto del meñique',
    'flexor largo del 1 er dedo pulgar': 'Flexor largo del pulgar',
    'interoseos dorsales 4': 'Interóseos dorsales', 'interoseos palmares 3': 'Interóseos palmares',
    'trapecio musculo': 'Trapecio',
    'triceps braquial porcion larga': 'Tríceps braquial (cabeza larga)',
    'vasto lateral del triceps': 'Tríceps braquial (cabeza lateral)', 'vasto medial del triceps': 'Tríceps braquial (cabeza medial)',
    'biceps braquial insercion distal': 'Bíceps braquial', 'triceps braquial insercion': 'Tríceps braquial',
    'braquial pequena porcion lateral': 'Braquial', 'interoseo dorsal': 'Interóseos dorsales', 'omohioideo vientre inferior': 'Omohioideo',
    // los tendones rotulados en las figuras se suman a su músculo
    'tendon del braquiorradial': 'Braquiorradial', 'tendon del flexor largo del pulgar f l p d': 'Flexor largo del pulgar',
    'tendon del flexor radial del carpo': 'Flexor radial del carpo', 'tendon del palmar largo': 'Palmar largo',
    'tendones del flexor profundo de los dedos f p d': 'Flexor profundo de los dedos', 'tendones del flexor superficial de los dedos f s d': 'Flexor superficial de los dedos',
  },
  nervio: {
    'nervio antebraquial cutaneo lateral': 'Nervio cutáneo lateral del antebrazo',
    'nervio antebraquial cutaneo medial': 'Nervio cutáneo medial del antebrazo', 'nervio cutaneo antebraquial medial': 'Nervio cutáneo medial del antebrazo',
    'nervio antebraquial cutaneo posterior': 'Nervio cutáneo posterior del antebrazo', 'nervio cutaneo antebraquial posterior': 'Nervio cutáneo posterior del antebrazo',
    'nervio braquial cutaneo medial': 'Nervio cutáneo medial del brazo', 'nervio cutaneo braquial medial': 'Nervio cutáneo medial del brazo',
    'nervio cutaneo braquial lateral inferior': 'Nervio cutáneo lateral inferior del brazo',
    'nervio cutaneo braquial posterior': 'Nervio cutáneo posterior del brazo',
    'nervio subclavio': 'Nervio del subclavio',
    'rama tenar del nervio mediano': 'Rama recurrente (tenar) del nervio mediano',
    'rama recurrente del nervio mediano': 'Rama recurrente (tenar) del nervio mediano',
    'nervio cutaneo braquial lateral superior': 'Nervio cutáneo lateral superior del brazo',
    'nervio intercostobraquial': 'Nervios intercostobraquiales',
    'nervios supraclaviculares medial intermedio y lateral': 'Nervios supraclaviculares',
    'rama dorsal del nervio cubital': 'Rama cutánea dorsal del nervio cubital',
    'rama palmar del nervio cubital': 'Rama cutánea palmar del nervio cubital',
    'rama cutanea palmar del nervio mediano': 'Rama palmar del nervio mediano',
    'rama superficial del nervio radial mano': 'Rama superficial del nervio radial',
    'rama terminal profunda del nervio cubital': 'Rama profunda del nervio cubital', 'rama terminal superficial del nervio cubital': 'Rama superficial del nervio cubital',
  },
  arteria: {
    'arco arterial palmar superficial': 'Arco palmar superficial', 'arco arterial palmar profundo': 'Arco palmar profundo',
    'arco arterial dorsal': 'Arco arterial dorsal del carpo',
    'arteria recurrente interosea': 'Arteria interósea recurrente',
    'vasos braquiales profundos': 'Arteria braquial profunda',
    'arterias digitales palmares comunes digitopalmares': 'Arterias digitales palmares comunes',
    'rama palmar superficial de la arteria radial radiopalmar': 'Rama palmar superficial de la arteria radial (radiopalmar)',
    'arteria radiopalmar': 'Rama palmar superficial de la arteria radial (radiopalmar)',
    'arteria cubito palmar': 'Rama cubitopalmar de la arteria cubital',
    'arteria carpiana dorsal rama de la cubital': 'Rama carpiana dorsal de la arteria cubital', 'arteria carpiana dorsal rama de la radial': 'Rama carpiana dorsal de la arteria radial',
    'arteria carpiana anterior rama de la cubital': 'Rama carpiana anterior de la arteria cubital', 'arteria carpiana anterior rama de la radial': 'Rama carpiana anterior de la arteria radial',
    'arteria dorsal de la escapula': 'Arteria dorsal de la escápula', 'arteria princeps del pulgar': 'Arteria principal del pulgar (princeps pollicis)',
    'arteria recurrente radial anterior': 'Arteria recurrente radial',
    'arteria recurrente radial posterior recurrente interosea': 'Arteria interósea recurrente',
    'rama circunfleja escapular': 'Arteria circunfleja escapular',
    'tronco de las arterias interoseas': 'Tronco de las interóseas', 'tronco de las arterias recurrentes cubitales': 'Tronco de las recurrentes cubitales',
  },
  vena: {
    'venas radiales profundas': 'Venas radiales',
    'a v d m': 'Arco venoso dorsal de la mano', 'arco venoso dorsal': 'Arco venoso dorsal de la mano',
    'venas humerales': 'Venas braquiales', 'venas intercapitulares': 'Venas intercapitulares de la mano',
  },
};

// Grupos o menciones genéricas: entran al catálogo pero no son blanco de pregunta A.
const GRUPOS = new Set([
  'hueso|huesos del carpo', 'hueso|metacarpianos', 'hueso|falanges', 'hueso|costillas', 'hueso|esternon', 'hueso|vertebras t2 y t7',
  'musculo|musculos cubitales anterior y posterior', 'musculo|musculos extensores del antebrazo', 'musculo|musculos flexores del epicondilo medial',
  'nervio|plexo braquial', 'nervio|ramas palmares de los nervios mediano y cubital', 'nervio|ramas sensitivas del nervio mediano 7',
  'arteria|arterias digitales palmares y dorsales', 'arteria|vasos circunflejos humerales', 'arteria|arcos palmares',
  'vena|venas satelites de la arteria braquial profunda', 'vena|venas satelites de las arterias del codo',
]);

// Fuera del miembro superior (se conservan, pero no se preguntan).
const FUERA = new Set([
  'hueso|1 ª costilla', 'musculo|oblicuo externo', 'accidente|cresta iliaca', 'accidente|linea nucal superior',
  'accidente|protuberancia occipital externa', 'accidente|apofisis espinosas vertebrales', 'accidente|apofisis transversas de c1 a c4',
  'accidente|manubrio esternal',
  'musculo|escaleno anterior', 'musculo|escaleno medio', 'arteria|arterias intercostales',
]);

// Hueso padre de los accidentes cuyo extractor lo dejó vacío o con otro nombre.
const PADRE = {
  'cavidad glenoidea': 'Escápula',
  'apofisis estiloides del 3er metacarpiano': 'Tercer metacarpiano', 'base del 1er metacarpiano': 'Primer metacarpiano',
  'base del 2do metacarpiano': 'Segundo metacarpiano', 'base del 4to metacarpiano': 'Cuarto metacarpiano',
  'tuberculo del 5to metacarpiano': 'Quinto metacarpiano',
  'tuberosidad en herradura de la falange distal': 'Falanges distales',
  'bases de los metacarpianos': 'Metacarpianos', 'cabezas de los metacarpianos': 'Metacarpianos',
};

// Correspondencia con el modelo cuando el nombre no coincide solo.
// Valor: lista de `nombre` del manifiesto, o null = no existe en el modelo.
// `revision` acompaña las equivalencias que no salen del texto del resumen.
const MODELO = {
  'hueso|grande hueso': ['Grande (hueso)'],
  'hueso|falange proximal del menique': ['Falange proximal del meñique'],
  'hueso|falanges proximales': ['Falange proximal del índice', 'Falange proximal del dedo medio', 'Falange proximal del anular', 'Falange proximal del meñique'],
  'hueso|falanges medias': ['Falange media del índice', 'Falange media del dedo medio', 'Falange media del anular', 'Falange media del meñique'],
  'hueso|falanges distales': ['Falange distal del índice', 'Falange distal del dedo medio', 'Falange distal del anular', 'Falange distal del meñique'],
  'hueso|falange media del indice': ['Falange media del índice'],
  'hueso|metacarpianos': ['Primer metacarpiano', 'Segundo metacarpiano', 'Tercer metacarpiano', 'Cuarto metacarpiano', 'Quinto metacarpiano'],
  'musculo|lumbricales': ['Primer lumbrical de la mano', 'Segundo lumbrical de la mano', 'Tercer lumbrical de la mano', 'Cuarto lumbrical de la mano'],
  'musculo|lumbricales 1 º y 2 º': ['Primer lumbrical de la mano', 'Segundo lumbrical de la mano'],
  'musculo|lumbricales 3 º y 4 º': ['Tercer lumbrical de la mano', 'Cuarto lumbrical de la mano'],
  'musculo|interoseos dorsales': ['Primer interóseo dorsal de la mano', 'Segundo interóseo dorsal de la mano', 'Tercer interóseo dorsal de la mano', 'Cuarto interóseo dorsal de la mano'],
  'musculo|interoseos palmares': ['Primer interóseo palmar', 'Segundo interóseo palmar', 'Tercer interóseo palmar'],
  'musculo|aductor del pulgar': ['Aductor del pulgar (cabeza oblicua)', 'Aductor del pulgar (cabeza transversa)'],
  'musculo|flexor corto del pulgar': ['Flexor corto del pulgar (cabeza profunda)', 'Flexor corto del pulgar (cabeza superficial)'],
  'musculo|biceps braquial': ['Bíceps braquial (cabeza corta)', 'Bíceps braquial (cabeza larga)'],
  'musculo|triceps braquial': ['Tríceps braquial (cabeza larga)', 'Tríceps braquial (cabeza lateral)', 'Tríceps braquial (cabeza medial)'],
  'musculo|elevador de la escapula': ['Elevador de la escápula (angular)'],
  'musculo|esternohioideo': null, 'musculo|omohioideo': null,
  'nervio|nervio dorsal de la escapula': ['Nervio escapular dorsal'],
  'nervio|nervio toracico largo': ['Nervio torácico largo (de Bell)'],
  'nervio|nervio accesorio xi': ['Nervio accesorio (XI)'],
  'nervio|rama profunda del nervio radial': ['Rama profunda del n. radial', 'Nervio interóseo posterior (radial)'],
  'nervio|rama profunda del nervio cubital': ['Rama profunda del n. cubital'],
  'nervio|rama superficial del nervio radial': ['Rama superficial del n. radial'],
  'nervio|rama recurrente tenar del nervio mediano': ['Rama recurrente (tenar) del n. mediano'],
  'nervio|ramas digitales palmares del nervio mediano': ['Nervios digitales palmares comunes (mediano)', 'Nervios digitales palmares propios (mediano)'],
  'nervio|nervio cutaneo lateral inferior del brazo': ['Nervio cutáneo lateral inferior del brazo (radial)'],
  'nervio|nervio cutaneo posterior del brazo': ['Nervio cutáneo posterior del brazo (radial)'],
  'nervio|nervio cutaneo posterior del antebrazo': ['Nervio cutáneo posterior del antebrazo (radial)'],
  'nervio|nervio cutaneo lateral del antebrazo': ['Nervio cutáneo lateral del antebrazo (musculocutáneo)'],
  'nervio|nervio interoseo anterior': null, 'nervio|nervios intercostobraquiales': null,
  'nervio|rama superficial del nervio cubital': null,
  'nervio|nervio cutaneo lateral superior del brazo': null,
  'nervio|nervios supraclaviculares': ['Nervios supraclaviculares mediales', 'Nervios supraclaviculares intermedios', 'Nervios supraclaviculares laterales'],
  'nervio|rama cutanea dorsal del nervio cubital': ['Rama cutánea dorsal del n. cubital'],
  'nervio|rama cutanea palmar del nervio cubital': ['Rama cutánea palmar del n. cubital'],
  'nervio|rama palmar del nervio mediano': ['Rama palmar del n. mediano'],
  'arteria|arco arterial dorsal del carpo': ['Arco carpiano dorsal'],
  'arteria|arteria circunfleja escapular': ['Arteria circunfleja de la escápula'],
  'arteria|arteria dorsal de la escapula': ['Arteria escapular dorsal'],
  'arteria|arteria principal del pulgar princeps pollicis': ['Arteria principal del pulgar'],
  'arteria|tronco de las interoseas': ['Arteria interósea común'],
  'vena|arco venoso dorsal de la mano': ['Red venosa dorsal de la mano'],
  'vena|venas intercapitulares de la mano': ['Venas intercapitulares de la mano'],
  'arteria|arteria toracoacromial': null, 'arteria|arteria nutricia del humero': null, 'arteria|arteria recurrente carpiana': null,
  'arteria|rama carpiana dorsal de la arteria cubital': ['Rama carpiana dorsal de la a. cubital'],
  'arteria|rama carpiana dorsal de la arteria radial': null,
  'arteria|rama cubitopalmar de la arteria cubital': null,
  'arteria|rama palmar superficial de la arteria radial radiopalmar': null,
  'arteria|rama profunda de la arteria cervical transversa': null,
  'vena|vena cubital superficial': null, 'vena|vena mediana basilica': null, 'vena|vena mediana cefalica': null,
  'vena|vena radial superficial': null, 'vena|vena dorsal del 1 er dedo': null, 'vena|vena dorsal del 5 º dedo': null,
  'vena|venas carpianas palmares': null,
};
// Equivalencias del mapa que no dice el resumen: quedan para revisión.
const REVISION_MAPA = {
  'arteria|arco arterial dorsal del carpo': 'El resumen dice «arco arterial dorsal»; el modelo lo llama «Arco carpiano dorsal». Confirmar que es la misma estructura.',
  'arteria|rama profunda de la arteria cervical transversa': 'En el modelo existe «Arteria escapular dorsal»; el resumen no dice que sea la misma (no se mapea).',
  'arteria|tronco de las interoseas': 'El resumen dice «tronco de las interóseas»; el modelo, «Arteria interósea común». Confirmar.',
  'vena|arco venoso dorsal de la mano': 'El resumen dice «arco venoso dorsal» (A.V.D.M.); el modelo tiene «Red venosa dorsal de la mano». Confirmar.',
};

const SISTEMA = { hueso: 'hueso', accidente: 'hueso', musculo: 'musculo', nervio: 'nervio', arteria: 'arteria', vena: 'vena' };
const CAMPOS = ['funcion', 'inervacion', 'origen', 'insercion', 'inserciones_musculares', 'articulaciones', 'musculos_que_inerva',
  'territorio_sensitivo', 'formadores', 'desemboca', 'ramas', 'ramas_colaterales', 'ramas_terminales', 'recorrido'];

// Los extractores de figuras metieron como «accidente» lo que no tiene categoría
// propia (ligamentos, tabiques, retináculos, articulaciones, espacios…): no son
// accidentes óseos ni blanco del examen, se descartan del catálogo.
const NO_OSEO = /^(lig|ligamento|tabique|aponeurosis|membrana|retinaculo|arco tendinoso|articulacion|articulaciones|fascia|canal|corredera|tabaquera|complejo|interlinea|espacio|tunel|polea|vaina|caperuza|capsula|bolsa|disco|fibrocartilago|anillo|hiato|cuadrilatero|triangulo|zona|eminencia|correderas|ligamentos|limites|linea de articulacion|poleas|vinculos|fovea radial)\b/;
// Rótulos de figuras que no son estructuras (pruebas clínicas, síndromes).
const NO_ESTRUCTURA = new Set(['sindrome del tunel carpiano', 'test de allen']);

const canon = (cat, nombre) => ALIAS[cat]?.[norm(nombre)] ?? nombre.replace(/\s+/g, ' ').trim();
const clave = (cat, nombre) => `${cat}|${norm(canon(cat, nombre))}`;

// ── 1. Leer extracciones ─────────────────────────────────────────────────────
const dirExt = path.join(DOCS, 'extraccion');
const archivos = fs.readdirSync(dirExt).filter((f) => f.endsWith('.json')).sort();
const cat = new Map();
const descartados = new Set();
for (const f of archivos) {
  const j = JSON.parse(fs.readFileSync(path.join(dirExt, f), 'utf8'));
  for (const e of j.estructuras) {
    const c = e.categoria;
    if (!SISTEMA[c]) throw new Error(`${f}: categoría desconocida «${c}» en ${e.nombre}`);
    if ((c === 'accidente' && NO_OSEO.test(norm(e.nombre))) || NO_ESTRUCTURA.has(norm(e.nombre))) { descartados.add(e.nombre); continue; }
    const k = clave(c, e.nombre);
    let r = cat.get(k);
    if (!r) {
      r = { clave: k, nombre: canon(c, e.nombre), categoria: c, sinonimos: new Set(), huesoPadre: '', regiones: new Set(),
        datos_B: Object.fromEntries(CAMPOS.map((x) => [x, new Map()])), fuentes: [], dudas: [] };
      cat.set(k, r);
    }
    if (e.nombre !== r.nombre) r.sinonimos.add(e.nombre);
    for (const s of e.sinonimos ?? []) if (norm(s) !== norm(r.nombre)) r.sinonimos.add(s);
    if (c === 'accidente') {
      const padre = PADRE[norm(e.nombre)] ?? (e.huesoPadre ? canon('hueso', e.huesoPadre) : '');
      if (padre && !r.huesoPadre) r.huesoPadre = padre;
    }
    if (e.region) r.regiones.add(e.region);
    // *.figuras.json: lo que solo está en las imágenes del resumen. `deducido` =
    // sale de cómo está dibujado el esquema, no de un rótulo escrito.
    r.fuentes.push({ resumenId: j.resumenId, archivo: f, seccion: e.seccion ?? '', cita: e.cita_textual_del_resumen ?? '',
      ...(e.figura ? { figura: e.figura } : {}), ...(e.deducido_de_esquema ? { deducido: true } : {}) });
    if (e.duda) r.dudas.push(`[${f.replace('.json', '')}] ${e.duda}`);
    for (const campo of CAMPOS) {
      for (const v of e.datos_B?.[campo] ?? []) {
        const n = norm(v);
        if (!n) continue;
        const m = r.datos_B[campo];
        if (!m.has(n)) m.set(n, { v, de: new Set() });
        m.get(n).de.add(e.figura ? `${j.resumenId}·${e.figura.split(',')[0].trim()}` : j.resumenId);
      }
    }
  }
}

// ── 2. Modelo 3D ─────────────────────────────────────────────────────────────
const man = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts', 'atlas-3d', 'salida', REGION, 'manifiesto.json'), 'utf8'));
const porSistema = {};
for (const p of man.piezas) {
  const s = (porSistema[p.sistema] ??= new Map());
  if (!s.has(p.nombre)) s.set(p.nombre, { nombre: p.nombre, nombreEn: p.nombreEn, ids: [] });
  s.get(p.nombre).ids.push(p.id);
}
const sinParen = (s) => norm(s.replace(/\s*\([^)]*\)\s*/g, ' '));
function buscarEnModelo(sistema, nombre) {
  const mapa = porSistema[sistema];
  const n = norm(nombre);
  const exacto = [...mapa.values()].filter((e) => norm(e.nombre) === n);
  if (exacto.length) return exacto;
  return [...mapa.values()].filter((e) => sinParen(e.nombre) === n);
}
const porNombre = (sistema, lista) => lista.map((nom) => {
  const e = porSistema[sistema].get(nom);
  if (!e) throw new Error(`MODELO: «${nom}» no existe en el manifiesto (${sistema})`);
  return e;
});

// ── 3. Fichas (solo para cruzar) ─────────────────────────────────────────────
const { FICHAS } = await import(pathToFileURL(path.join(RAIZ, 'src', 'lib', 'data', 'atlas-3d', 'fichas', `${REGION}.ts`)).href);
const NERVIOS = ['axilar', 'radial', 'mediano', 'cubital', 'musculocutaneo', 'supraescapular', 'subescapular', 'toracodorsal',
  'pectoral lateral', 'pectoral medial', 'dorsal de la escapula', 'escapular dorsal', 'toracico largo', 'accesorio', 'espinal', 'subclavio', 'interoseo anterior', 'interoseo posterior'];
const nerviosEn = (txt) => NERVIOS.filter((n) => norm(txt).includes(n)).map((n) => (n === 'escapular dorsal' ? 'dorsal de la escapula' : n === 'espinal' ? 'accesorio' : n));

// ── 4. Armar el catálogo ─────────────────────────────────────────────────────
const salida = [];
const sinModelo = [];
for (const r of [...cat.values()].sort((a, b) => a.categoria.localeCompare(b.categoria) || a.nombre.localeCompare(b.nombre, 'es'))) {
  const k = r.clave;
  const grupo = GRUPOS.has(k);
  const fuera = FUERA.has(k);
  let modelo;
  const revision = [];
  if (REVISION_MAPA[k]) revision.push(REVISION_MAPA[k]);

  if (r.categoria === 'accidente') {
    const padre = r.huesoPadre;
    const pzs = padre ? (MODELO[`hueso|${norm(padre)}`] !== undefined
      ? (MODELO[`hueso|${norm(padre)}`] ? porNombre('hueso', MODELO[`hueso|${norm(padre)}`]) : [])
      : buscarEnModelo('hueso', padre)) : [];
    modelo = pzs.length ? { tipo: 'marcador', hueso: pzs.map((p) => p.nombreEn), ids: pzs.flatMap((p) => p.ids) } : null;
    if (!padre) revision.push('Accidente sin hueso padre en el resumen.');
  } else if (MODELO[k] !== undefined) {
    modelo = MODELO[k] ? { tipo: 'pieza', en: porNombre(SISTEMA[r.categoria], MODELO[k]).map((p) => p.nombreEn) } : null;
  } else {
    const pzs = buscarEnModelo(SISTEMA[r.categoria], r.nombre);
    modelo = pzs.length ? { tipo: 'pieza', en: pzs.map((p) => p.nombreEn) } : null;
  }
  if (modelo?.tipo === 'pieza') {
    modelo.nombresModelo = modelo.en.map((en) => [...porSistema[SISTEMA[r.categoria]].values()].find((e) => e.nombreEn === en).nombre);
  }

  // Conflictos entre resúmenes: campos de valor único con conjuntos disjuntos.
  const datos_B = {};
  const procedencia = {};
  for (const campo of CAMPOS) {
    const vals = [...r.datos_B[campo].values()];
    if (!vals.length) continue;
    datos_B[campo] = vals.map((x) => x.v);
    procedencia[campo] = Object.fromEntries(vals.map((x) => [x.v, [...x.de]]));
  }
  const conflictos = [];
  // Cada fuente (resumen o figura) aporta un conjunto de «claves»: en inervación,
  // los nervios nombrados (un ramo cuenta como su nervio de origen); en el resto,
  // el texto sin paréntesis. Hay conflicto si dos fuentes no comparten ninguna.
  const RAMO_DE = { 'interoseo posterior': 'radial', 'interoseo anterior': 'mediano' };
  const claves = (campo, v) => {
    if (campo === 'inervacion') {
      const n = nerviosEn(v).map((x) => RAMO_DE[x] ?? x);
      if (/rama (recurrente|tenar)/.test(norm(v))) n.push('mediano');
      return n.length ? n : [norm(v)];
    }
    return [norm(v.replace(/\([^)]*\)/g, ' ')).replace(/^(la |el )/, '')];
  };
  const resumenesCon = (campo) => {
    const por = new Map();
    for (const x of r.datos_B[campo].values()) for (const d of x.de) {
      if (!por.has(d)) por.set(d, new Set());
      for (const k of claves(campo, x.v)) por.get(d).add(k);
    }
    return por;
  };
  const comparten = (A, B) => [...A].some((x) => [...B].some((y) => x === y || x.includes(y) || y.includes(x)));
  for (const campo of ['inervacion', 'desemboca']) {
    const por = resumenesCon(campo);
    if (por.size < 2) continue;
    const conj = [...por.entries()];
    for (let i = 0; i < conj.length; i++) for (let j = i + 1; j < conj.length; j++) {
      const [a, A] = conj[i]; const [b, B] = conj[j];
      if (!comparten(A, B)) conflictos.push(`${campo}: ${a} dice «${[...r.datos_B[campo].values()].filter((x) => x.de.has(a)).map((x) => x.v).join('; ')}» y ${b} «${[...r.datos_B[campo].values()].filter((x) => x.de.has(b)).map((x) => x.v).join('; ')}»`);
    }
  }

  // Cruce con las fichas: inervación de músculos.
  if (r.categoria === 'musculo' && modelo?.tipo === 'pieza' && datos_B.inervacion) {
    // Se compara contra la unión de las fichas de todas sus piezas (cabezas,
    // porciones, lumbricales…); un ramo cuenta como su nervio de origen.
    const RAMO = { 'interoseo posterior': 'radial', 'interoseo anterior': 'mediano' };
    const ampliar = (l) => l.flatMap((n) => (RAMO[n] ? [n, RAMO[n]] : [n]));
    const nervCat = new Set(datos_B.inervacion.flatMap(nerviosEn).map((n) => RAMO[n] ?? n));
    const textos = modelo.en.map((en) => FICHAS[en]?.inervacion).filter(Boolean);
    const nervF = new Set(ampliar(textos.flatMap(nerviosEn)));
    const faltan = [...nervCat].filter((n) => !nervF.has(n));
    if (faltan.length && nervF.size) conflictos.push(`ficha del atlas: inervación «${[...new Set(textos)].join(' / ')}» no menciona ${faltan.join(', ')} (el resumen: «${datos_B.inervacion.join('; ')}»)`);
  }

  const fila = {
    nombre: r.nombre,
    sinonimos: [...r.sinonimos],
    categoria: r.categoria,
    ...(r.huesoPadre ? { huesoPadre: r.huesoPadre } : {}),
    regiones: [...r.regiones],
    preguntable: !grupo && !fuera && !!modelo,
    ...(grupo ? { grupo: true } : {}),
    ...(fuera ? { fueraDeMS: true } : {}),
    modelo,
    datos_B,
    procedencia,
    fuentes: r.fuentes,
    ...(r.dudas.length ? { dudas: r.dudas } : {}),
    ...(conflictos.length ? { conflictos: [...new Set(conflictos)] } : {}),
    ...(revision.length ? { revision } : {}),
  };
  salida.push(fila);
  if (!modelo && !grupo && !fuera) sinModelo.push(fila);
}

fs.writeFileSync(path.join(DOCS, 'catalogo_estructuras.json'), JSON.stringify({ generado: new Date().toISOString(), region: REGION, estructuras: salida }, null, 2));

// ── 5. Lista de estructuras sin modelo ───────────────────────────────────────
const md = ['# Estructuras sin modelo 3D', '',
  'Salen en los resúmenes de anatomía del miembro superior pero no existen como pieza en el modelo `miembro-superior-derecho` (v17).',
  'No llevan pregunta A; sí pueden aparecer como respuesta de una pregunta B.', '',
  '| Categoría | Estructura | Resúmenes | Nota |', '|---|---|---|---|',
  ...sinModelo.map((f) => `| ${f.categoria} | ${f.nombre}${f.sinonimos.length ? ` (${f.sinonimos.join(', ')})` : ''} | ${[...new Set(f.fuentes.map((x) => x.resumenId))].join(', ')} | ${(f.revision ?? []).join(' ')} |`),
  ''];
fs.writeFileSync(path.join(DOCS, 'estructuras_sin_modelo.md'), md.join('\n'));

// ── 6. Tabla legible ─────────────────────────────────────────────────────────
const cats = ['hueso', 'accidente', 'musculo', 'nervio', 'arteria', 'vena'];
const lin = ['# Catálogo de estructuras — miembro superior', '', `Generado por \`scripts/examen-ms/consolidar.mjs\` a partir de ${archivos.length} extracciones.`, ''];
lin.push('| Categoría | Total | Preguntables | Accidente→marcador | Sin modelo | Grupos/fuera | Con conflicto o duda |', '|---|---|---|---|---|---|---|');
for (const c of cats) {
  const l = salida.filter((f) => f.categoria === c);
  lin.push(`| ${c} | ${l.length} | ${l.filter((f) => f.preguntable).length} | ${l.filter((f) => f.modelo?.tipo === 'marcador').length} | ${l.filter((f) => !f.modelo && !f.grupo && !f.fueraDeMS).length} | ${l.filter((f) => f.grupo || f.fueraDeMS).length} | ${l.filter((f) => f.conflictos || f.dudas || f.revision).length} |`);
}
for (const c of cats) {
  lin.push('', `## ${c}`, '', '| Estructura | Modelo | Resúmenes | Datos B | Revisar |', '|---|---|---|---|---|');
  for (const f of salida.filter((x) => x.categoria === c)) {
    const mod = f.grupo ? 'grupo' : f.fueraDeMS ? 'fuera de MS' : !f.modelo ? '**sin modelo**' : f.modelo.tipo === 'marcador' ? `marcador en ${f.huesoPadre}` : f.modelo.nombresModelo.join(' + ');
    const datos = Object.entries(f.datos_B).filter(([k]) => k !== 'recorrido').map(([k, v]) => `${k} (${v.length})`).join(', ');
    const rev = [...(f.conflictos ?? []).map((x) => `⚠ ${x}`), ...(f.dudas ?? []).map((x) => `? ${x}`), ...(f.revision ?? []).map((x) => `↺ ${x}`)].join('<br>').replace(/\|/g, '/');
    lin.push(`| ${f.nombre}${f.huesoPadre ? ` · ${f.huesoPadre}` : ''} | ${mod} | ${[...new Set(f.fuentes.map((x) => x.resumenId.replace('loc-', '')))].join(', ')} | ${datos} | ${rev} |`);
  }
}
fs.writeFileSync(path.join(DOCS, 'CATALOGO.md'), lin.join('\n') + '\n');

// ── Resumen por consola ──────────────────────────────────────────────────────
console.log(`${salida.length} estructuras únicas (de ${archivos.length} extracciones)`);
for (const c of cats) {
  const l = salida.filter((f) => f.categoria === c);
  console.log(`  ${c.padEnd(10)} ${String(l.length).padStart(3)}  preguntables ${String(l.filter((f) => f.preguntable).length).padStart(3)}  sin modelo ${l.filter((f) => !f.modelo && !f.grupo && !f.fueraDeMS).length}`);
}
console.log(`descartados (no óseos): ${[...descartados].join(' · ')}`);
console.log(`conflictos: ${salida.filter((f) => f.conflictos).length} · dudas: ${salida.filter((f) => f.dudas).length} · revisión: ${salida.filter((f) => f.revision).length}`);
