/**
 * Fase 3 (paso 2): convierte cada combinación de la matriz en el esqueleto de una
 * pregunta (blanco en el modelo, probabilidad, pregunta oficial, resumen al que
 * enlaza el fallo) y lo reparte en lotes para los generadores.
 *
 *   node scripts/examen-ms/preparar-preguntas.mjs
 *
 * Escribe docs/examen-ms/preguntas/entrada-<lote>.json (gitignored).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DOCS = path.join(AQUI, '..', '..', 'docs', 'examen-ms');
const leer = (f) => JSON.parse(fs.readFileSync(path.join(DOCS, f), 'utf8'));
const { estructuras } = leer('catalogo_estructuras.json');
const { matriz } = leer('matriz_combinaciones.json');
const { examenes } = leer('examenes_oficiales.json');
const porNombre = new Map(estructuras.map((e) => [e.nombre, e]));

export const GRUPO = { hueso: 'Huesos', accidente: 'Huesos', musculo: 'Músculos', nervio: 'Nervios', arteria: 'Arterias', vena: 'Venas' };

// Resumen de cada fuente → clase del sílabo de Aparato Locomotor y opción del visor.
export const CLASE_DE = {
  'loc-clase-2': { claseId: 'clase-2', opcion: 'loc-clase-2' },
  'loc-clase-2-osteo': { claseId: 'clase-2', opcion: 'loc-clase-2-osteo' },
  'loc-clase-3': { claseId: 'clase-3', opcion: 'loc-clase-3' },
  'loc-clase-5': { claseId: 'clase-5', opcion: 'loc-clase-5' },
  'loc-sgp-2': { claseId: 'sgp-2', opcion: 'loc-sgp-2' },
};

const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// El resumen que mejor explica esta combinación: el que aportó el dato (texto antes
// que figura), con el encabezado bajo el que está.
function resumenDe(e, campos) {
  const deDato = campos.flatMap((c) => Object.values(e.procedencia?.[c] ?? {}).flat());
  const orden = [...deDato.filter((d) => !d.includes('·')), ...deDato.filter((d) => d.includes('·')), ...e.fuentes.map((f) => f.resumenId)];
  for (const d of orden) {
    const [resumenId, figura] = d.split('·');
    const f = e.fuentes.find((x) => x.resumenId === resumenId && (figura ? x.figura?.startsWith(figura) : !x.figura) && x.seccion)
      ?? e.fuentes.find((x) => x.resumenId === resumenId && x.seccion);
    if (f && CLASE_DE[resumenId]) return { ...CLASE_DE[resumenId], seccion: f.seccion };
  }
  return null;
}

const CAMPOS = {
  inervacion: ['inervacion'], funcion: ['funcion'], insercion: ['insercion'], origen: ['origen', 'formadores'],
  musculos_que_inerva: ['musculos_que_inerva'], territorio_sensitivo: ['territorio_sensitivo'],
  articulaciones: ['articulaciones'], inserciones_musculares: ['inserciones_musculares'],
  ramas_colaterales: ['ramas_colaterales', 'ramas'], ramas_terminales: ['ramas_terminales'], formadores: ['formadores'], desemboca: ['desemboca'],
};

function objetivoDe(e, piezaOficial) {
  if (!e.modelo) return null;
  if (e.modelo.tipo === 'marcador') return { tipo: 'marcador', hueso: e.modelo.hueso[0], accidente: e.nombre };
  if (piezaOficial) {
    const i = e.modelo.nombresModelo.indexOf(piezaOficial);
    if (i < 0) throw new Error(`pieza oficial «${piezaOficial}» no está en ${e.nombre}`);
    return { tipo: 'pieza', en: [e.modelo.en[i]], nombresModelo: [piezaOficial] };
  }
  return { tipo: 'pieza', en: e.modelo.en, nombresModelo: e.modelo.nombresModelo };
}

const oficialDe = new Map();
for (const ex of examenes) for (const it of ex.items) {
  const k = `${it.estructura}|${it.tipoB ?? ''}`;
  oficialDe.set(k, { examen: ex.id, n: it.n, ...it });
}

const preguntas = [];
const usadas = new Set();
for (const m of matriz) {
  const e = porNombre.get(m.estructura);
  const of = oficialDe.get(`${m.estructura}|${m.tipoB}`);
  if (of) usadas.add(`${m.estructura}|${m.tipoB}`);
  const fuenteDatos = m.heredadoDe ? porNombre.get(m.heredadoDe) : e;
  preguntas.push({
    id: `ms-${slug(m.estructura)}-${m.tipoB.replace(/_/g, '-')}`,
    grupo: GRUPO[m.categoria], categoria: m.categoria, region: m.region,
    estructura: m.estructura,
    ...(e.huesoPadre ? { huesoPadre: e.huesoPadre } : {}),
    sinonimosDelResumen: e.sinonimos,
    objetivo: objetivoDe(e, of?.pieza),
    tipoB: m.tipoB, estado: m.estado, motivo: m.motivo,
    origen: of ? `oficial ${of.examen}` : 'generada',
    ...(of ? { oficial: { examen: of.examen, n: of.n, respuestaA: of.respuestaA, enunciadoB: of.enunciadoB, respuestaB: of.respuestaB, pide: of.pide, filtro: of.filtro } } : {}),
    datosDelResumen: m.respuestas,
    ...(m.heredadoDe ? { heredadoDe: m.heredadoDe } : {}),
    ...(m.soloFigura ? { soloFigura: true } : {}),
    ...(e.conflictos ? { conflictos: e.conflictos } : {}),
    resumenRelacionado: resumenDe(fuenteDatos, CAMPOS[m.tipoB]),
  });
}

// Preguntas oficiales del 2024 (solo A): se les da la B del patrón de su familia
// si la matriz la tiene; si no, quedan señaladas para revisión.
const e24 = examenes.find((x) => x.id === '2024');
const faltan2024 = [];
for (const it of e24.items) {
  const deEsta = preguntas.filter((p) => p.estructura === it.estructura);
  const conPatron = deEsta.find((p) => p.estado === 'muy_probable' || p.estado === 'salio') ?? deEsta[0];
  if (!conPatron) { faltan2024.push(it.estructura); continue; }
  if (conPatron.origen === 'generada') {
    conPatron.origen = 'oficial 2024 (solo A; B generada)';
    conPatron.oficial = { examen: '2024', n: it.n, respuestaA: it.respuestaA };
  } else {
    conPatron.tambienOficial = `2024#${it.n} (solo A)`;
  }
}

for (const k of oficialDe.keys()) if (!k.endsWith('|') && !usadas.has(k)) throw new Error(`pregunta oficial sin combinación en la matriz: ${k}`);
const ids = new Set();
for (const p of preguntas) { if (ids.has(p.id)) throw new Error(`id repetido ${p.id}`); ids.add(p.id); }

// Lotes por categoría (los músculos y huesos, partidos para que cada generador tenga ~60-75).
const LOTES = [
  ['huesos-a', (p) => p.categoria === 'hueso' || (p.categoria === 'accidente' && ['Húmero'].includes(p.huesoPadre))],
  ['huesos-b', (p) => p.categoria === 'accidente' && !['Húmero'].includes(p.huesoPadre)],
  ['musculos-a', (p) => p.categoria === 'musculo' && ['hombro', 'axila', 'espalda', 'torax', 'cuello'].includes(p.region)],
  ['musculos-b', (p) => p.categoria === 'musculo' && ['brazo', 'codo'].includes(p.region)],
  ['musculos-c', (p) => p.categoria === 'musculo' && p.region === 'antebrazo'],
  ['musculos-d', (p) => p.categoria === 'musculo' && !['hombro', 'axila', 'espalda', 'torax', 'cuello', 'brazo', 'codo', 'antebrazo'].includes(p.region)],
  ['nervios', (p) => p.categoria === 'nervio'],
  ['vasos', (p) => p.categoria === 'arteria' || p.categoria === 'vena'],
];
const dir = path.join(DOCS, 'preguntas');
fs.mkdirSync(dir, { recursive: true });
let total = 0;
for (const [lote, f] of LOTES) {
  const l = preguntas.filter(f);
  total += l.length;
  fs.writeFileSync(path.join(dir, `entrada-${lote}.json`), JSON.stringify(l, null, 2));
  console.log(`${lote.padEnd(11)} ${String(l.length).padStart(3)}  (oficiales ${l.filter((p) => p.origen !== 'generada').length}, sin resumen ${l.filter((p) => !p.resumenRelacionado).length})`);
}
if (total !== preguntas.length) throw new Error(`lotes ${total} ≠ preguntas ${preguntas.length}`);
fs.writeFileSync(path.join(dir, 'nombres-lexico.json'), JSON.stringify(estructuras.filter((e) => !e.fueraDeMS).map((e) => e.nombre)));
console.log(`total ${preguntas.length}${faltan2024.length ? ` · 2024 sin combinación: ${faltan2024.join(', ')}` : ''}`);
