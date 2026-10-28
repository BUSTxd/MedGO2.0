/**
 * Genera la red «segundo cerebro» de la landing y la cifra de resúmenes.
 *
 *   npm run generar:red-landing
 *
 * Lee lo que hay publicado (sílabos, cursos y catálogo de laboratorios) y lo escribe
 * aparte, en dos módulos GENERADOS:
 *   - src/components/landing-nueva/red-datos.ts  → la red (se baja con la tarjeta, aparte)
 *   - src/components/landing-nueva/cifras.ts     → cuántos resúmenes hay (va en la página)
 * Así la landing no toca los sílabos al servirse. Volver a correrlo al publicar
 * resúmenes, banqueos o laboratorios.
 *
 * Red: cada curso es un nodo central y de él cuelgan sus resúmenes y su banqueo; el
 * banqueo se une a las clases que preguntan, cada laboratorio a su curso y a las clases
 * que anima, y el ENCIB a los cursos de ciencias básicas. Sólo títulos (los sílabos ya
 * son públicos), nunca contenido de pago.
 */

import { writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DATA = path.join(RAIZ, 'src', 'lib', 'data');
const SALIDA = path.join(RAIZ, 'src', 'components', 'landing-nueva');

/** Igual que `src/lib/data/silabos.ts` (slug de la ruta → archivo). */
const SILABOS = {
  'microbiologia': 'microbiologia', 'farmacologia': 'farmacologia', 'cardiovascular': 'cardiovascular',
  'neurologia': 'neurologia', 'excretor': 'excretor', 'hematologia': 'hematologia',
  'aparato-locomotor': 'locomotor', 'inmunologia': 'inmunologia', 'digestivo': 'digestivo',
  'endocrino-reproductor': 'endocrino', 'respiratorio': 'respiratorio', 'patologia': 'patologia',
  'epidemiologia': 'epidemiologia', 'psicologia-medica': 'psicologiaMedica', 'biologia-celular': 'biologiaCelular',
  'ciencias-sociales': 'cienciasSociales', 'fisica-medicina': 'fisica', 'quimica-organica': 'quimicaOrganica',
  'comunicacion-redaccion-ii': 'comunicacion', 'cultura-ambiental': 'culturaAmbiental',
};

/** Cursos que la landing todavía no enseña: ni en la red ni en la cifra de resúmenes (ni sus laboratorios). */
const FUERA_DE_LA_LANDING = new Set(['fisica-medicina']);

/** Clases (curso/actividad) que un laboratorio anima, además de su curso. */
const CLASES_DE_LAB = {
  'hipersensibilidad': ['patologia/pat-acp-9', 'inmunologia/sgp-3', 'inmunologia/t-12'],
  'maduracion-linfocitos': ['inmunologia/t-3', 'inmunologia/t-4', 'inmunologia/t-9', 'patologia/pat-acp-8'],
  'vias-nfkb-jakstat': ['patologia/pat-acp-8'],
  'cascada-coagulacion': ['hematologia/clase-9'],
};

/** Regiones del atlas 3D → clases de anatomía de Locomotor que cubren (por título). */
const REGIONES_ATLAS = {
  'miembro-superior-derecho': /hombro|brazo|muñeca|mano|miembro superior/i,
  'miembro-inferior-derecho': /glútea|muslo|rodilla|pierna|tobillo|pie\b|miembro inferior/i,
};

/** Cursos de Cayetano que cubren áreas del ENCIB (ciencias básicas): elegidos a mano. */
const CURSOS_ENCIB = ['aparato-locomotor', 'cardiovascular', 'excretor', 'respiratorio', 'neurologia', 'microbiologia', 'farmacologia', 'patologia', 'inmunologia', 'biologia-celular', 'quimica-organica', 'hematologia'];

/** Lo que el grafo resalta solo mientras nadie lo toca. */
const PASEO = ['lab:hipersensibilidad', 'lab:atlas-3d:miembro-superior-derecho', 'pregunta:encib', 'lab:maduracion-linfocitos', 'lab:cascada-coagulacion'];

const LARGO = 46;
const corto = (t) => (t.length > LARGO ? `${t.slice(0, LARGO - 1).trimEnd()}…` : t);
const importar = (archivo) => import(pathToFileURL(archivo).href);

const semanasDe = (mod) => Object.values(mod).find((v) => Array.isArray(v) && v.some((s) => Array.isArray(s?.actividades)));

const silabos = {};
for (const [slug, archivo] of Object.entries(SILABOS)) {
  if (FUERA_DE_LA_LANDING.has(slug)) continue;
  const semanas = semanasDe(await importar(path.join(DATA, `${archivo}.ts`)));
  if (!semanas) throw new Error(`${archivo}.ts: no encontré las semanas del sílabo`);
  silabos[slug] = semanas.flatMap((s) => s.actividades);
}
const { CURSOS } = await importar(path.join(DATA, 'aportes.ts'));
const { LAB_TOPICS } = await importar(path.join(DATA, 'laboratorio-catalogo.ts'));

// ── La red ──
const nodos = [];
const indice = new Map();
const aristas = new Set();
const nodo = (id, label, tipo) => {
  let i = indice.get(id);
  if (i === undefined) { i = nodos.length; nodos.push([id, corto(label), tipo]); indice.set(id, i); }
  return i;
};
const unir = (a, b) => {
  if (a === undefined || b === undefined || a === b) return;
  aristas.add(a < b ? `${a}-${b}` : `${b}-${a}`);
};
const nombre = new Map(CURSOS.map((c) => [c.slug, c.nombre]));
const resumenDe = new Map();
const hub = new Map();
const resumenes = new Set();

for (const [curso, acts] of Object.entries(silabos)) {
  const conResumen = acts.filter((a) => a.resumen);
  const conPractica = acts.filter((a) => a.examen || a.tarjetas || a.solucionario || a.propuestos || a.propuestosPdf);
  if (!conResumen.length && !conPractica.length) continue;
  const h = nodo(`curso:${curso}`, nombre.get(curso) ?? curso, 'curso');
  hub.set(curso, h);
  for (const a of conResumen) {
    // Las clases que comparten resumen (práctica ↔ magistral) apuntan al mismo nodo.
    const rid = a.resumen.opciones?.[0]?.id ?? `${curso}/${a.id}`;
    resumenes.add(rid);
    const r = nodo(`resumen:${rid}`, a.titulo, 'resumen');
    resumenDe.set(`${curso}/${a.id}`, r);
    unir(h, r);
  }
  if (conPractica.length) {
    const b = nodo(`banqueo:${curso}`, `Banqueo de ${nombre.get(curso) ?? curso}`, 'pregunta');
    unir(h, b);
    for (const a of conPractica) unir(b, resumenDe.get(`${curso}/${a.id}`));
  }
}

for (const tema of LAB_TOPICS) {
  if (FUERA_DE_LA_LANDING.has(tema.id)) continue;
  for (const e of tema.experiments) {
    if (!e.href) continue;
    const url = new URL(e.href, 'https://medgo.local');
    const modulo = url.pathname.match(/\/cursos\/([^/]+)\/modulo\/([^/]+)/);
    if (modulo && FUERA_DE_LA_LANDING.has(modulo[1])) continue;
    const slug = url.pathname.split('/').pop();
    const region = url.searchParams.get('region');
    const l = nodo(modulo ? `lab:${modulo[2]}` : `lab:${slug}${region ? `:${region}` : ''}`, e.name, 'lab');
    if (modulo) {
      // Física: cada módulo es la simulación de una clase.
      unir(l, resumenDe.get(`${modulo[1]}/${modulo[2]}`) ?? hub.get(modulo[1]));
      continue;
    }
    unir(l, hub.get(tema.id));
    for (const clase of CLASES_DE_LAB[slug] ?? []) {
      if (!resumenDe.has(clase)) throw new Error(`CLASES_DE_LAB.${slug}: «${clase}» no existe o no tiene resumen`);
      unir(l, resumenDe.get(clase));
    }
    if (region && REGIONES_ATLAS[region]) {
      const deRegion = silabos['aparato-locomotor'].filter((a) => a.unidad === 'ANATOMIA' && REGIONES_ATLAS[region].test(a.titulo));
      for (const a of deRegion) unir(l, resumenDe.get(`aparato-locomotor/${a.id}`));
      if (region === 'miembro-superior-derecho') {
        // El examen 3D se armó con esas mismas clases.
        const ex = nodo('pregunta:examen-ms', 'Examen 3D de miembro superior', 'pregunta');
        unir(ex, l);
        for (const a of deRegion) unir(ex, resumenDe.get(`aparato-locomotor/${a.id}`));
      }
    }
  }
}

const encib = nodo('pregunta:encib', 'Banqueo ENCIB · 300 preguntas', 'pregunta');
for (const c of CURSOS_ENCIB) unir(encib, hub.get(c));

for (const id of PASEO) if (!indice.has(id)) throw new Error(`PASEO: «${id}» no es un nodo`);

// ── Escribir ──
const lista = [...aristas].map((k) => k.split('-').map(Number));
const cabecera = '// GENERADO por scripts/landing/generar-red.mjs (npm run generar:red-landing). No editar a mano.\n';
await writeFile(path.join(SALIDA, 'red-datos.ts'), `${cabecera}
export type TipoNodoRed = 'curso' | 'resumen' | 'pregunta' | 'lab';
/** [id, rótulo, tipo] */
export type NodoRed = readonly [string, string, TipoNodoRed];

export const NODOS: readonly NodoRed[] = [
${nodos.map((n) => `  ${JSON.stringify(n)},`).join('\n')}
];

/** Pares de índices de NODOS. */
export const ARISTAS: readonly (readonly [number, number])[] = ${JSON.stringify(lista)};

export const PASEO: readonly string[] = ${JSON.stringify(PASEO)};
`);
await writeFile(path.join(SALIDA, 'cifras.ts'), `${cabecera}
/** Resúmenes distintos publicados en los sílabos (los compartidos cuentan una vez). */
export const RESUMENES = ${resumenes.size};
`);

const porTipo = nodos.reduce((m, n) => ((m[n[2]] = (m[n[2]] ?? 0) + 1), m), {});
console.log(`Red: ${nodos.length} nodos (${Object.entries(porTipo).map(([t, n]) => `${n} ${t}`).join(', ')}), ${lista.length} aristas.`);
console.log(`Resúmenes: ${resumenes.size}.`);
