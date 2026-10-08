/**
 * Fase 2 del examen 3D de miembro superior: cruza los exámenes oficiales con el
 * catálogo y arma la matriz «estructura × tipo de pregunta B», marcando qué
 * combinaciones ya salieron, cuáles son muy probables según los patrones de
 * 2025 (confirmados con 2024) y cuáles son posibles.
 *
 *   node scripts/examen-ms/analizar.mjs
 *
 * Lee (gitignored): docs/examen-ms/catalogo_estructuras.json y examenes_oficiales.json
 * Escribe (gitignored): docs/examen-ms/matriz_combinaciones.json y ANALISIS_PATRONES.md
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DOCS = path.join(AQUI, '..', '..', 'docs', 'examen-ms');
const leer = (f) => JSON.parse(fs.readFileSync(path.join(DOCS, f), 'utf8'));
const { estructuras } = leer('catalogo_estructuras.json');
const { examenes, paralelos_2025: paralelos } = leer('examenes_oficiales.json');
const porNombre = new Map(estructuras.map((e) => [e.nombre, e]));

// ── Tipos de pregunta B por categoría (y de qué campo del catálogo salen) ─────
const TIPOS_B = {
  musculo: { inervacion: ['inervacion'], funcion: ['funcion'], insercion: ['insercion'], origen: ['origen'] },
  nervio: { musculos_que_inerva: ['musculos_que_inerva'], territorio_sensitivo: ['territorio_sensitivo'], origen: ['origen', 'formadores'] },
  hueso: { articulaciones: ['articulaciones'], inserciones_musculares: ['inserciones_musculares'] },
  accidente: { inserciones_musculares: ['inserciones_musculares'], articulaciones: ['articulaciones'] },
  arteria: { ramas_colaterales: ['ramas_colaterales', 'ramas'], ramas_terminales: ['ramas_terminales'], formadores: ['formadores'], origen: ['origen'] },
  vena: { formadores: ['formadores'], desemboca: ['desemboca'] },
};
const ETIQUETA_B = {
  inervacion: 'inervación', funcion: 'función', insercion: 'inserción', origen: 'origen',
  musculos_que_inerva: 'músculos que inerva', territorio_sensitivo: 'territorio sensitivo',
  articulaciones: 'con qué se articula', inserciones_musculares: 'inserciones musculares',
  ramas_colaterales: 'ramas (colaterales)', ramas_terminales: 'ramas terminales', formadores: 'formantes', desemboca: 'dónde desemboca',
};

// Las cabezas/porciones heredan inervación y función del músculo entero (decisión
// de BUST, 2026-10-07); inserciones y orígenes solo si el resumen los da propios.
const HEREDA = {
  'Tríceps braquial (cabeza larga)': 'Tríceps braquial', 'Tríceps braquial (cabeza lateral)': 'Tríceps braquial',
  'Tríceps braquial (cabeza medial)': 'Tríceps braquial',
  'Bíceps braquial (cabeza corta)': 'Bíceps braquial', 'Bíceps braquial (cabeza larga)': 'Bíceps braquial',
  'Lumbricales 1.º y 2.º': 'Lumbricales', 'Lumbricales 3.º y 4.º': 'Lumbricales',
};
const CAMPOS_HEREDABLES = new Set(['inervacion', 'funcion']);

// ── Familias de estructuras (los patrones de paralelismo de 2025) ─────────────
const NERVIOS_MAYORES = new Set(['Nervio axilar', 'Nervio musculocutáneo', 'Nervio mediano', 'Nervio cubital', 'Nervio radial']);
const AXIOAPENDICULARES = new Set(['Trapecio', 'Dorsal ancho', 'Romboides mayor', 'Romboides menor', 'Elevador de la escápula', 'Serrato anterior', 'Pectoral mayor', 'Pectoral menor', 'Subclavio']);
const HOMBRO_POSTERIOR = new Set(['Redondo menor', 'Redondo mayor', 'Infraespinoso', 'Supraespinoso', 'Subescapular', 'Deltoides',
  'Tríceps braquial', 'Tríceps braquial (cabeza larga)', 'Tríceps braquial (cabeza lateral)', 'Tríceps braquial (cabeza medial)']);
const BRAZO_ANTERIOR = new Set(['Bíceps braquial', 'Bíceps braquial (cabeza corta)', 'Bíceps braquial (cabeza larga)', 'Braquial', 'Coracobraquial']);
const CARPO = new Set(['Escafoides', 'Semilunar', 'Piramidal', 'Pisiforme', 'Trapecio (hueso)', 'Trapezoide', 'Grande (hueso)', 'Ganchoso']);
const VENAS_SUPERFICIALES = new Set(['Vena basílica', 'Vena cefálica', 'Vena mediana del codo', 'Vena mediana del antebrazo', 'Arco venoso dorsal de la mano']);
const ARTERIAS_PRINCIPALES = new Set(['Arteria axilar', 'Arteria braquial', 'Arteria braquial profunda', 'Arteria radial', 'Arteria cubital',
  'Arco palmar superficial', 'Arco palmar profundo', 'Arco arterial dorsal del carpo', 'Arteria subclavia', 'Arteria subescapular']);

const tiene = (e, r) => (e.regiones ?? []).includes(r);
function familia(e) {
  const n = e.nombre;
  switch (e.categoria) {
    case 'nervio': return NERVIOS_MAYORES.has(n) ? 'nervio-mayor' : 'nervio-menor';
    case 'musculo':
      if (AXIOAPENDICULARES.has(n)) return 'musculo-axioapendicular';
      if (HOMBRO_POSTERIOR.has(n)) return 'musculo-hombro-posterior';
      if (BRAZO_ANTERIOR.has(n)) return 'musculo-brazo';
      if (tiene(e, 'mano') && !tiene(e, 'antebrazo')) return 'musculo-mano';
      if (tiene(e, 'antebrazo')) return 'musculo-antebrazo';
      return 'musculo-otro';
    case 'hueso': return CARPO.has(n) ? 'hueso-carpo' : 'hueso-otro';
    case 'accidente': return ['Húmero', 'Escápula'].includes(e.huesoPadre) ? 'accidente-hombro' : 'accidente-otro';
    case 'vena': return VENAS_SUPERFICIALES.has(n) ? 'vena-superficial' : 'vena-profunda';
    case 'arteria': return ARTERIAS_PRINCIPALES.has(n) ? 'arteria-principal' : /^Arteria circunfleja humeral/.test(n) ? 'arteria-circunfleja' : 'arteria-menor';
  }
  return 'otro';
}

// Tipos B que los patrones de 2025 hacen muy probables en cada familia.
const PATRON = {
  'nervio-mayor': ['musculos_que_inerva', 'territorio_sensitivo'],
  'accidente-hombro': ['inserciones_musculares'],
  'musculo-antebrazo': ['inervacion'],
  'musculo-mano': ['inervacion', 'funcion'],
  'musculo-hombro-posterior': ['funcion', 'inervacion'],
  'musculo-brazo': ['inervacion', 'funcion'],
  'musculo-axioapendicular': ['inervacion', 'insercion'],
  'hueso-carpo': ['articulaciones'],
  'vena-superficial': ['formadores', 'desemboca'],
  'arteria-principal': ['ramas_colaterales', 'formadores'],
  // Las circunflejas humerales (la posterior salió en 2024): de dónde nacen.
  'arteria-circunfleja': ['origen'],
};

// ── Lo que ya salió ───────────────────────────────────────────────────────────
const salio = new Map();   // `${estructura}|${tipoB}` → ['2025-A#2', …]
const salioA = new Map();  // estructura → ['2024#5', …]
for (const ex of examenes) for (const it of ex.items) {
  if (!porNombre.has(it.estructura)) throw new Error(`${ex.id} #${it.n}: «${it.estructura}» no está en el catálogo`);
  const ref = `${ex.id}#${it.n}`;
  (salioA.get(it.estructura) ?? salioA.set(it.estructura, []).get(it.estructura)).push(ref);
  if (it.tipoB) { const k = `${it.estructura}|${it.tipoB}`; (salio.get(k) ?? salio.set(k, []).get(k)).push(ref); }
}

// ── Matriz ────────────────────────────────────────────────────────────────────
const matriz = [];
const sinDatos = [];
for (const e of estructuras) {
  if (!e.preguntable && !salioA.has(e.nombre)) continue;
  const fam = familia(e);
  const padre = HEREDA[e.nombre] ? porNombre.get(HEREDA[e.nombre]) : null;
  for (const [tipo, campos] of Object.entries(TIPOS_B[e.categoria] ?? {})) {
    // «Formantes» de una arteria solo tiene sentido en los arcos.
    if (e.categoria === 'arteria' && tipo === 'formadores' && !/^arco/i.test(e.nombre)) continue;
    let respuestas = campos.flatMap((c) => e.datos_B[c] ?? []);
    let heredado = false;
    if (!respuestas.length && padre && campos.some((c) => CAMPOS_HEREDABLES.has(c))) {
      respuestas = campos.flatMap((c) => padre.datos_B[c] ?? []);
      heredado = respuestas.length > 0;
    }
    const proc = campos.flatMap((c) => Object.values((heredado ? padre : e).procedencia?.[c] ?? {}).flat());
    const soloFigura = proc.length > 0 && proc.every((d) => d.includes('·f'));
    const oficial = salio.get(`${e.nombre}|${tipo}`) ?? [];
    let estado, motivo;
    if (oficial.length) { estado = 'salio'; motivo = `Pregunta oficial ${oficial.join(', ')}`; }
    else if (PATRON[fam]?.includes(tipo) && salioA.has(e.nombre)) { estado = 'muy_probable'; motivo = `La estructura ya salió (${salioA.get(e.nombre).join(', ')}) y el tipo B es el del patrón de su familia (${fam})`; }
    else if (PATRON[fam]?.includes(tipo)) { estado = 'muy_probable'; motivo = `Mismo patrón que 2025 para la familia ${fam}`; }
    else if (salioA.has(e.nombre)) { estado = 'posible'; motivo = `La estructura ya salió (${salioA.get(e.nombre).join(', ')}), con otro tipo B`; }
    else { estado = 'posible'; motivo = `Tipo B aplicable a ${e.categoria}, fuera del patrón de 2025`; }
    if (!respuestas.length) {
      // Un accidente sin inserciones simplemente no se pregunta por inserciones.
      if (estado !== 'posible' && e.categoria !== 'accidente') sinDatos.push({ estructura: e.nombre, tipoB: tipo, estado, motivo });
      continue;
    }
    // El examen pide «3 inserciones»: un accidente con menos es posible, no probable.
    if (estado === 'muy_probable' && tipo === 'inserciones_musculares' && respuestas.length < 3) {
      estado = 'posible'; motivo = `Accidente del hombro con solo ${respuestas.length} inserción(es) (el examen pide 3)`;
    }
    const n = respuestas.length;
    const pide = n === 1 ? 1 : tipo === 'inserciones_musculares' ? Math.min(3, n) : Math.min(2, n);
    matriz.push({
      estructura: e.nombre, categoria: e.categoria, region: e.regiones?.[0] ?? '', familia: fam, tipoB: tipo,
      estado, motivo, oficial, respuestas, pide,
      ...(heredado ? { heredadoDe: padre.nombre } : {}),
      ...(soloFigura ? { soloFigura: true } : {}),
      ...(e.conflictos ? { conflicto: true } : {}),
    });
  }
}
fs.writeFileSync(path.join(DOCS, 'matriz_combinaciones.json'), JSON.stringify({ generado: new Date().toISOString(), matriz, sinDatos }, null, 2));

// ── Informe ───────────────────────────────────────────────────────────────────
const CATS = ['hueso', 'accidente', 'musculo', 'nervio', 'arteria', 'vena'];
const ESTADOS = ['salio', 'muy_probable', 'posible'];
const cuenta = (f) => matriz.filter(f).length;
const L = [];
L.push('# Análisis de patrones — examen práctico de miembro superior', '',
  `Generado por \`scripts/examen-ms/analizar.mjs\` (${new Date().toISOString().slice(0, 10)}). Fuera de git: nombra las respuestas oficiales.`, '');

L.push('## 1. Los exámenes', '');
for (const ex of examenes) {
  L.push(`### ${ex.id}${ex.nota ? ` — ${ex.nota}` : ''}`, '', '| # | Estructura A | Categoría | Región | Tipo B | Pide |', '|---|---|---|---|---|---|');
  for (const it of ex.items) L.push(`| ${it.n} | ${it.estructura} | ${it.categoria} | ${it.region} | ${it.tipoB ? `${ETIQUETA_B[it.tipoB]}${it.filtro ? ` (${it.filtro})` : ''}` : '—'} | ${it.pide ?? '—'} |`);
  L.push('');
}

L.push('## 2. Paralelismo 2025-A ↔ 2025-B', '',
  'Las dos versiones no se emparejan por número de ítem sino por **hueco**: cada examen tiene los mismos 10 huecos en distinto orden.', '',
  '| A | B | Patrón |', '|---|---|---|');
const ia = examenes.find((x) => x.id === '2025-A'), ib = examenes.find((x) => x.id === '2025-B');
for (const p of paralelos) {
  const a = ia.items.find((x) => x.n === p.A), b = ib.items.find((x) => x.n === p.B);
  L.push(`| ${p.A}. ${a.estructura} → ${ETIQUETA_B[a.tipoB]} | ${p.B}. ${b.estructura} → ${ETIQUETA_B[b.tipoB]} | ${p.patron} |`);
}
L.push('', '**Plantilla de 10 huecos** (la misma en A y B):', '',
  '- 2 nervios mayores — uno siempre el **mediano** (repite en A y B), el otro axilar/cubital → músculos que inerva o territorio sensitivo, acotado por región («en el antebrazo», «intrínsecos de la mano», «en la palma»).',
  '- 4 músculos — uno de antebrazo (flexor ↔ extensor) → inervación; uno intrínseco de la mano → inervación/función; uno de hombro posterior/brazo (espacios axilares) → función/inervación; uno axioapendicular posterior (trapecio ↔ dorsal ancho) → inervación/inserción.',
  '- 2 de hueso — un **accidente** de húmero/escápula → 3 inserciones; un **hueso del carpo** → con qué se articula en una dirección dada.',
  '- 1 vena superficial (basílica ↔ cefálica) → formantes / desembocadura.',
  '- 1 arteria de antebrazo/mano (arco palmar superficial ↔ radial) → formantes / ramas colaterales (2).',
  '', '**Reglas de enunciado observadas:** «indique N» (N = 2 o 3) cuando la respuesta es una lista; se acepta cualquier subconjunto de N de la lista completa (la clave da la lista entera). Las direcciones (lateralmente, distalmente) y las regiones acotan la lista.', '');

const e24 = examenes.find((x) => x.id === '2024');
const fam25 = new Set(examenes.filter((x) => x.id.startsWith('2025')).flatMap((x) => x.items.map((it) => familia(porNombre.get(it.estructura)))));
const lineas24 = []; let repiten = 0, paralelas = 0;
for (const it of e24.items) {
  const en25 = (salioA.get(it.estructura) ?? []).filter((r) => r.startsWith('2025'));
  const fam = familia(porNombre.get(it.estructura));
  if (en25.length) repiten++; else if (fam25.has(fam)) paralelas++;
  lineas24.push(`- ${it.estructura} (${fam})${en25.length ? ` — **repite en ${en25.join(', ')}**` : fam25.has(fam) ? ' — misma familia que un hueco de 2025' : ' — **no encaja en ningún hueco de 2025**'}`);
}
L.push('## 3. Lo que confirma 2024', '', `Del 2024 (solo pregunta A) salen ${e24.items.length} estructuras de miembro superior: **${repiten} repiten tal cual en 2025** y **${paralelas} más caen en un hueco de la plantilla** (misma familia).`, '', ...lineas24);
L.push('', '- Se confirma el peso de: músculos de antebrazo (FRC, 1.er y 2.º radial), carpo (trapezoide / ganchoso / escafoides), coracoides, redondo menor, aductor del pulgar y los nervios mayores (cubital, radial, musculocutáneo).',
  '- **Ojo:** el 2024 señaló la **arteria circunfleja humeral posterior**, una de las 15 ramas pequeñas que dejamos solo como respuesta B. Es la única rama pequeña que aparece en los tres exámenes; propongo dejar esa (y su par, la circunfleja humeral anterior) también como pregunta A.', '');

L.push('## 4. Matriz de combinaciones', '', `${matriz.length} combinaciones estructura × tipo B con respuesta en los resúmenes.`, '',
  '| Categoría | Salió | Muy probable | Posible | Total |', '|---|---|---|---|---|');
for (const c of CATS) L.push(`| ${c} | ${ESTADOS.map((s) => cuenta((m) => m.categoria === c && m.estado === s)).join(' | ')} | ${cuenta((m) => m.categoria === c)} |`);
L.push(`| **total** | ${ESTADOS.map((s) => cuenta((m) => m.estado === s)).join(' | ')} | ${matriz.length} |`, '');
L.push(`- ${cuenta((m) => m.heredadoDe)} combinaciones usan datos heredados del músculo entero (cabezas del tríceps/bíceps, lumbricales).`,
  `- ${cuenta((m) => m.soloFigura)} combinaciones tienen su respuesta **solo en las figuras** del resumen.`,
  `- ${cuenta((m) => m.conflicto)} combinaciones son de estructuras con un conflicto abierto.`, '');

L.push('### Muy probables (por familia)', '');
const fams = [...new Set(matriz.filter((m) => m.estado !== 'posible').map((m) => m.familia))];
for (const f of fams) {
  const l = matriz.filter((m) => m.familia === f && m.estado !== 'posible');
  L.push(`- **${f}** (${l.length}): ${l.map((m) => `${m.estructura} → ${ETIQUETA_B[m.tipoB]}${m.estado === 'salio' ? ' ✔' : ''}`).join(' · ')}`);
}
L.push('');
if (sinDatos.length) {
  L.push('### Combinaciones del patrón SIN respuesta en los resúmenes', '', 'No se generan (no hay de dónde sacar la respuesta). Si alguna importa, hay que buscar el dato:', '');
  for (const s of sinDatos) L.push(`- ${s.estructura} → ${ETIQUETA_B[s.tipoB]} (${s.estado})`);
  L.push('');
}
fs.writeFileSync(path.join(DOCS, 'ANALISIS_PATRONES.md'), L.join('\n') + '\n');

console.log(`matriz: ${matriz.length} combinaciones · ${ESTADOS.map((s) => `${s} ${cuenta((m) => m.estado === s)}`).join(' · ')} · sin datos ${sinDatos.length}`);
for (const c of CATS) console.log(`  ${c.padEnd(10)} ${ESTADOS.map((s) => String(cuenta((m) => m.categoria === c && m.estado === s)).padStart(3)).join(' ')}`);
