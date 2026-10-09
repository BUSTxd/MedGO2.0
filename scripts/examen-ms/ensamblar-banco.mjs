/**
 * Fase 3 (paso 3): une esqueletos + preguntas B + léxico + marcadores en el banco
 * del examen 3D de miembro superior, y valida todo contra el modelo.
 *
 *   node scripts/examen-ms/ensamblar-banco.mjs
 *
 * Lee (gitignored) docs/examen-ms/{preguntas,lexico}/, marcadores.json y el
 * manifiesto local del atlas. Escribe data/examen-ms/banco.json (lo que se sube al
 * bucket `examenes`) y docs/examen-ms/BANCO.md (resumen para revisar).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(AQUI, '..', '..');
const DOCS = path.join(RAIZ, 'docs', 'examen-ms');
const leer = (...p) => JSON.parse(fs.readFileSync(path.join(DOCS, ...p), 'utf8'));
const REGION = 'miembro-superior-derecho';
const CURSO = 'aparato-locomotor';

const man = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts', 'atlas-3d', 'salida', REGION, 'manifiesto.json'), 'utf8'));
const enModelo = new Set(man.piezas.map((p) => p.nombreEn));

// ── Léxico ────────────────────────────────────────────────────────────────────
const lexico = {};
for (const f of ['huesos', 'musculos', 'nervios-vasos']) Object.assign(lexico, leer('lexico', `${f}.json`));
const formas = (nombre) => {
  const l = lexico[nombre];
  if (!l) throw new Error(`«${nombre}» no está en el léxico`);
  return [...new Set([nombre, l.oficial, ...(l.aceptadas ?? [])].filter(Boolean))];
};

const marcadores = leer('marcadores.json');
// Decisiones de BUST sobre preguntas concretas (gitignored: contienen respuestas).
const rutaAjustes = path.join(DOCS, 'ajustes.mjs');
const { AJUSTES = {} } = fs.existsSync(rutaAjustes) ? await import(pathToFileURL(rutaAjustes).href) : {};
const ajustesUsados = new Set();
const dirP = path.join(DOCS, 'preguntas');
const lotes = fs.readdirSync(dirP).filter((f) => f.startsWith('entrada-')).map((f) => f.slice(8, -5));

const banco = [];
const descartadas = [];
const noSenalables = [];
const errores = [];
for (const lote of lotes) {
  const esqueletos = leer('preguntas', `entrada-${lote}.json`);
  const archivo = path.join(dirP, `${lote}.json`);
  if (!fs.existsSync(archivo)) { errores.push(`falta el lote ${lote}`); continue; }
  const generadas = new Map(JSON.parse(fs.readFileSync(archivo, 'utf8')).map((g) => [g.id, g]));
  for (const s of esqueletos) {
    const g = generadas.get(s.id);
    if (!g) { errores.push(`${lote}: falta ${s.id}`); continue; }
    if (g.descartar) { descartadas.push({ id: s.id, motivo: g.descartar }); continue; }

    let objetivo;
    if (s.objetivo?.tipo === 'marcador') {
      const m = marcadores[s.estructura];
      if (!m) { errores.push(`${s.id}: sin marcador para «${s.estructura}»`); continue; }
      if (m.noSenalable) { noSenalables.push(s.id); continue; }
      objetivo = { tipo: 'marcador', hueso: m.hueso, punto: m.punto, radio: m.radio };
    } else if (s.objetivo?.tipo === 'pieza') {
      for (const en of s.objetivo.en) if (!enModelo.has(en)) errores.push(`${s.id}: la pieza «${en}» no existe en el modelo`);
      objetivo = { tipo: 'pieza', en: s.objetivo.en };
    } else { errores.push(`${s.id}: sin objetivo en el modelo`); continue; }

    const respuestas = (g.preguntaB?.respuestas ?? []).map((r) => {
      if (r.ref) {
        if (!lexico[r.ref]) { errores.push(`${s.id}: ref «${r.ref}» no está en el léxico`); return null; }
        // El texto que escribió el generador (a menudo el de la clave oficial,
        // «Carpiana anterior») también vale en ESTA pregunta.
        return { texto: r.texto, ref: r.ref, aceptadas: [...new Set([...formas(r.ref), r.texto])], noConfundir: lexico[r.ref].noConfundir ?? [], ...(r.precisión ? { precision: r.precisión } : {}) };
      }
      if (!r.aceptadas?.length) { errores.push(`${s.id}: respuesta «${r.texto}» sin ref ni aceptadas`); return null; }
      return { texto: r.texto, aceptadas: r.aceptadas, ...(r.conceptos?.length ? { conceptos: r.conceptos } : {}) };
    }).filter(Boolean);
    if (!respuestas.length) { errores.push(`${s.id}: pregunta B sin respuestas`); continue; }
    const pide = Math.min(g.preguntaB.pide ?? 1, respuestas.length);

    const rr = s.resumenRelacionado;
    let pregunta = {
      id: s.id,
      categoria: s.grupo,
      tipoEstructura: s.categoria,
      region: s.region,
      objetivo,
      preguntaA: {
        enunciado: 'Nombre de la estructura señalada',
        respuesta: lexico[s.estructura]?.oficial || s.estructura,
        aceptadas: formas(s.estructura),
        noConfundir: lexico[s.estructura]?.noConfundir ?? [],
      },
      preguntaB: {
        enunciado: g.preguntaB.enunciado,
        tipoB: s.tipoB,
        pide,
        ...(g.preguntaB.filtro ? { filtro: g.preguntaB.filtro } : {}),
        respuestas,
        criterio: g.preguntaB.criterio ?? (pide > 1 ? `Basta con ${pide} de la lista; cada una se corrige por separado.` : 'Una sola respuesta.'),
      },
      origen: s.origen,
      ...(s.tambienOficial ? { tambienOficial: s.tambienOficial } : {}),
      probabilidad: s.estado,
      resumenRelacionado: {
        claseId: rr.claseId, opcion: rr.opcion, seccion: rr.seccion,
        href: `/dashboard/cursos/${CURSO}/${rr.claseId}?resumen=1&opcion=${rr.opcion}&seccion=${encodeURIComponent(rr.seccion)}`,
      },
      ...(g.revision || lexico[s.estructura]?.revision ? { revision: [g.revision, lexico[s.estructura]?.revision && `Léxico: ${lexico[s.estructura].revision}`].filter(Boolean) } : {}),
    };
    if (AJUSTES[s.id]) {
      ajustesUsados.add(s.id);
      pregunta = AJUSTES[s.id](pregunta, { lexico });
      if (!pregunta) { descartadas.push({ id: s.id, motivo: 'Quitada por decisión de BUST (ajustes.mjs)' }); continue; }
      if (pregunta.preguntaB.pide > pregunta.preguntaB.respuestas.length) errores.push(`${s.id}: tras el ajuste pide más respuestas de las que hay`);
    }
    banco.push(pregunta);
  }
}
for (const id of Object.keys(AJUSTES)) if (!ajustesUsados.has(id)) errores.push(`ajuste para una pregunta que no existe: ${id}`);

if (errores.length) {
  console.error(`✗ ${errores.length} errores`);
  for (const e of errores.slice(0, 40)) console.error('  ' + e);
  process.exit(1);
}

// Cada forma aceptada de una pregunta A no puede ser también forma de OTRA
// estructura del banco: el corrector no sabría cuál es.
const duenos = new Map();
const nrm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[.,;:()]/g, ' ').replace(/\s+/g, ' ').trim();
for (const [nombre, l] of Object.entries(lexico)) for (const f of [nombre, l.oficial, ...(l.aceptadas ?? [])].filter(Boolean)) {
  const k = nrm(f);
  if (!duenos.has(k)) duenos.set(k, new Set());
  duenos.get(k).add(nombre);
}
const choques = [...duenos.entries()].filter(([, s]) => s.size > 1).map(([k, s]) => `«${k}»: ${[...s].join(' / ')}`);

fs.mkdirSync(path.join(RAIZ, 'data', 'examen-ms'), { recursive: true });
fs.writeFileSync(path.join(RAIZ, 'data', 'examen-ms', 'banco.json'), JSON.stringify({
  version: 1,
  generado: new Date().toISOString().slice(0, 10),
  region: REGION,
  categorias: ['Huesos', 'Músculos', 'Arterias', 'Nervios', 'Venas'],
  preguntas: banco,
  // Todas las formas del léxico: el corrector las usa para no dar por buena una
  // errata que en realidad es el nombre de otra estructura.
  formas: Object.fromEntries(Object.keys(lexico).map((n) => [n, formas(n)])),
}, null, 2));

// ── Versión para publicar ────────────────────────────────────────────────────
// Lo que sale del léxico no se repite en cada pregunta: va una vez en `formas` y
// `confusiones`, y el cliente lo rellena al cargar (hidratarBanco en
// src/lib/examen-ms/sesion.ts). Así pesa la mitad.
const nombrePorRespuestaA = new Map(Object.keys(lexico).map((n) => [lexico[n].oficial || n, n]));
const compacto = {
  version: 1,
  generado: new Date().toISOString().slice(0, 10),
  region: REGION,
  categorias: ['Huesos', 'Músculos', 'Arterias', 'Nervios', 'Venas'],
  formas: Object.fromEntries(Object.keys(lexico).map((n) => [n, formas(n)])),
  confusiones: Object.fromEntries(Object.entries(lexico).filter(([, l]) => l.noConfundir?.length).map(([n, l]) => [n, l.noConfundir])),
  preguntas: banco.map((p) => {
    const { revision, origen, tambienOficial, ...resto } = p;
    void revision; void tambienOficial;
    const ref = nombrePorRespuestaA.get(p.preguntaA.respuesta);
    return {
      ...resto,
      origen: origen.startsWith('oficial') ? origen.replace(/ \(.*\)$/, '') : origen,
      preguntaA: ref ? { enunciado: p.preguntaA.enunciado, respuesta: p.preguntaA.respuesta, ref } : p.preguntaA,
      preguntaB: {
        ...p.preguntaB,
        respuestas: p.preguntaB.respuestas.map((r) => {
          if (!r.ref) return r;
          const { aceptadas, noConfundir, ...sin } = r;
          void noConfundir;
          const propias = aceptadas.filter((a) => !formas(r.ref).includes(a));
          return propias.length ? { ...sin, aceptadas: propias } : sin;
        }),
      },
    };
  }),
};
fs.writeFileSync(path.join(RAIZ, 'data', 'examen-ms', 'banco.publicar.json'), JSON.stringify(compacto));

// ── Resumen para revisar ─────────────────────────────────────────────────────
const CATS = ['Huesos', 'Músculos', 'Arterias', 'Nervios', 'Venas'];
const n = (f) => banco.filter(f).length;
const L = ['# Banco del examen 3D de miembro superior', '', `Generado por \`scripts/examen-ms/ensamblar-banco.mjs\` (${new Date().toISOString().slice(0, 10)}). Fuera de git.`, '',
  '| Categoría | Preguntas | Oficiales | Salió | Muy probable | Posible | Con marcador | Para revisar |', '|---|---|---|---|---|---|---|---|'];
for (const c of CATS) L.push(`| ${c} | ${n((p) => p.categoria === c)} | ${n((p) => p.categoria === c && p.origen !== 'generada')} | ${['salio', 'muy_probable', 'posible'].map((e) => n((p) => p.categoria === c && p.probabilidad === e)).join(' | ')} | ${n((p) => p.categoria === c && p.objetivo.tipo === 'marcador')} | ${n((p) => p.categoria === c && p.revision)} |`);
L.push(`| **total** | ${banco.length} | ${n((p) => p.origen !== 'generada')} | ${['salio', 'muy_probable', 'posible'].map((e) => n((p) => p.probabilidad === e)).join(' | ')} | ${n((p) => p.objetivo.tipo === 'marcador')} | ${n((p) => p.revision)} |`, '');
L.push('## Preguntas oficiales', '');
for (const p of banco.filter((x) => x.origen !== 'generada')) L.push(`- **${p.origen}** — ${p.preguntaA.respuesta} → ${p.preguntaB.enunciado}: ${p.preguntaB.respuestas.map((r) => r.texto).join('; ')}`);
L.push('', '## Para revisar', '');
for (const p of banco.filter((x) => x.revision)) L.push(`- \`${p.id}\` — ${p.revision.join(' · ')}`);
if (descartadas.length) { L.push('', '## Descartadas por el generador', ''); for (const d of descartadas) L.push(`- \`${d.id}\` — ${d.motivo}`); }
if (noSenalables.length) L.push('', '## No señalables (accidente = cara o cuerpo entero)', '', noSenalables.map((i) => `\`${i}\``).join(', '));
if (choques.length) { L.push('', '## Formas aceptadas que comparten dos estructuras', ''); for (const c of choques) L.push(`- ${c}`); }
fs.writeFileSync(path.join(DOCS, 'BANCO.md'), L.join('\n') + '\n');

console.log(`✓ ${banco.length} preguntas · oficiales ${n((p) => p.origen !== 'generada')} · descartadas ${descartadas.length} · no señalables ${noSenalables.length} · para revisar ${n((p) => p.revision)} · formas compartidas ${choques.length}`);
for (const c of CATS) console.log(`  ${c.padEnd(9)} ${n((p) => p.categoria === c)}`);
