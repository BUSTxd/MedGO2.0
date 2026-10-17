/**
 * Arma los banqueos del Parcial 2 de Patología (Unidad 2).
 *
 *   node scripts/patologia-u2/ensamblar.mjs
 *
 * Lee de `data/patologia-u2/` (fuera de git: son respuestas de pago):
 *   - crudo/*.json            transcripciones literales, una por fuente
 *   - decision.json           qué entra, tema, nivel, correcta, módulos (agente Opus)
 *   - explicaciones/*.json    { "<ref>": { explanation, flujo? } }
 *   - secciones-*.json        { "<ref>": { claseId, resumenId, seccion } }  (ancla al resumen)
 * y escribe `scripts/examenes/patologia-parcial-2-<modulo>.json`, que es lo que
 * se sube con `node scripts/upload-examen.mjs`. Además:
 *   - `patologia-parcial-2-temas.json`: todas las preguntas juntas para el modo
 *     por temas (mismo texto, explicación y flujo que en los módulos). Las
 *     `MUESTRA` primeras son las gratis del módulo 1, así que la misma
 *     `muestra` de `examenes-acceso.ts` abre lo mismo en los dos modos.
 *   - `src/lib/data/temas/patologia-parcial-2-conteo.ts`: preguntas por tema
 *     (total y gratis) para la ruleta. Solo cifras: no lleva respuestas.
 *
 * El id de cada pregunta sale de su ref (`examen-3#12` → `examen-3-12`), no de
 * su posición: reordenar un módulo no rompe el historial de los alumnos.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DATOS = join(RAIZ, 'data', 'patologia-u2');
const SALIDA = join(RAIZ, 'scripts', 'examenes');
const IMG_BASE = 'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/patologia/parcial-2';

const leer = (p) => JSON.parse(readFileSync(p, 'utf8'));
const decision = leer(join(DATOS, 'decision.json'));

// ── crudo: ref → pregunta ────────────────────────────────────────────────────
const crudo = new Map();
for (const f of readdirSync(join(DATOS, 'crudo'))) {
  if (!f.endsWith('.json')) continue;
  const j = leer(join(DATOS, 'crudo', f));
  if (j.fuente === 'parcial-1') {
    for (const q of j.preguntas) crudo.set(`parcial-1:${q.archivo}#${q.id}`, { ...q, deParcial1: true });
  } else {
    // La ref usa el nombre del archivo: Pato-oncología se transcribió en tres
    // (`pato-onc-a/b/c`) y los tres dicen `fuente: "pato-oncologia"`.
    const base = f.replace(/.json$/, '');
    for (const q of j.preguntas) crudo.set(`${base}#${q.n}`, { ...q, fuente: base });
  }
}

const explicaciones = {};
const dirExp = join(DATOS, 'explicaciones');
if (existsSync(dirExp)) {
  for (const f of readdirSync(dirExp)) if (f.endsWith('.json')) Object.assign(explicaciones, leer(join(dirExp, f)));
}
const secciones = {};
for (const f of readdirSync(DATOS)) if (/^secciones-.*.json$/.test(f)) Object.assign(secciones, leer(join(DATOS, f)));

/** Rótulo del examen de origen, para el interruptor de versiones. */
function rotuloDe(ref) {
  const r = ref.replace(/^parcial-1:/, '');
  const TABLA = [
    [/^patologia-parcial-1-2020-b#/, '2020 B'], [/^patologia-parcial-1-2020#/, '2020 A'],
    [/^patologia-parcial-1-2022#/, '2022'], [/^patologia-parcial-1#/, '2024'],
    [/^examen2-2018#/, '2018'], [/^examen2-2021#/, '2021'], [/^examen2-2020#/, '2020'],
    [/^examen-3#/, 'Teórico A'], [/^examen-5#/, 'Teórico B'],
    [/^banqueo-72dc#/, 'Banqueo'], [/^pato-onc-/, 'Pato-oncología'],
  ];
  return TABLA.find(([rx]) => rx.test(r))?.[1] ?? 'Otra versión';
}

const idDe = (ref) => ref.replace(/^parcial-1:patologia-/, 'p1-').replace(/[#:]/g, '-').replace(/[^\w-]/g, '');

async function imagenDe(q) {
  if (q.deParcial1) return q.image ? { image: q.image, imageW: q.imageW, imageH: q.imageH } : {};
  if (!q.imagen) return {};
  const png = join(RAIZ, q.imagen);
  const nombre = png.split(/[\\/]/).pop().replace(/\.png$/i, '');
  const carpeta = png.split(/[\\/]/).slice(-2, -1)[0];
  const { width, height } = await sharp(png).metadata();
  return { image: `${IMG_BASE}/${carpeta}/${nombre}.webp`, imageW: width, imageH: height };
}

/** Alternativas con id propio y su `correct`, en el orden de la fuente (el runner baraja). */
function opcionesDe(q, correcta, prefijo = '') {
  if (q.deParcial1) {
    if (!correcta) return q.options.map((o) => ({ id: prefijo + o.id, text: o.text, correct: o.correct }));
    const letra = correcta.toLowerCase();
    return q.options.map((o, i) => ({ id: prefijo + o.id, text: o.text, correct: (o.id === letra) || String.fromCharCode(97 + i) === letra }));
  }
  return q.options.map((o) => ({ id: prefijo + o.letra.toLowerCase(), text: o.text, correct: o.letra.toUpperCase() === correcta?.toUpperCase() }));
}

/** Igual que `muestra` de 'patologia/parcial-2-m1' en examenes-acceso.ts. */
const MUESTRA = 20;

let total = 0;
const avisos = [];
const porModulo = [];
for (const [mi, mod] of decision.modulos.entries()) {
  const questions = [];
  for (const ref of mod.preguntas) {
    const d = decision.preguntas[ref];
    const q = crudo.get(ref);
    if (!d || !q) { avisos.push(`${mod.id}: ${ref} sin ${!d ? 'decisión' : 'crudo'}`); continue; }
    const exp = explicaciones[ref] ?? {};
    const sec = secciones[ref];
    const pregunta = {
      id: idDe(ref),
      stem: q.stem,
      ...(await imagenDe(q)),
      options: opcionesDe(q, d.correcta),
      explanation: exp.explanation ?? q.explicacion ?? q.explanation ?? undefined,
      tema: d.tema,
      nivel: d.nivel,
      ...(exp.flujo ? { flujo: exp.flujo } : {}),
      // `claseId`: la clase a la que enlaza; `resumenId`: el fragmento que abre (C5 → pat-tbl-4).
      ...(sec ? { claseId: sec.claseId, resumenId: sec.resumenId ?? sec.claseId, seccion: sec.seccion } : {}),
      ...(d.repite ? { repite: d.repite } : {}),
      ...(d.reviewNote ? { reviewNote: d.reviewNote } : {}),
    };
    // Una segunda versión legítima de la misma pregunta (Teórico A/B) va como
    // `variante`: comparte número, nota y rastro, y el alumno elige cuál ver.
    const varRef = Object.entries(decision.preguntas).find(([, v]) => v.varianteDe === ref)?.[0];
    if (varRef) {
      const vq = crudo.get(varRef);
      const vd = decision.preguntas[varRef];
      const vexp = explicaciones[varRef] ?? {};
      pregunta.variante = {
        rotulo: rotuloDe(varRef),
        rotuloBase: rotuloDe(ref),
        stem: vq.stem,
        ...(await imagenDe(vq).then((im) => (im.image ? im : {}))),
        options: opcionesDe(vq, vd.correcta, 'v'),
        ...(vexp.explanation ? { explanation: vexp.explanation } : {}),
      };
    }
    const correctas = pregunta.options.filter((o) => o.correct).length;
    if (correctas !== 1) avisos.push(`${ref}: ${correctas} correctas`);
    if (!pregunta.explanation) avisos.push(`${ref}: sin explicación`);
    questions.push(pregunta);
  }
  const key = `patologia/parcial-2-${mod.id}`;
  const payload = {
    version: 1,
    key,
    title: `Examen Parcial 2 — ${mod.rotulo}`,
    duration_min: questions.length * 2,
    questions,
  };
  writeFileSync(join(SALIDA, `patologia-parcial-2-${mod.id}.json`), JSON.stringify(payload, null, 2) + '\n');
  porModulo.push(questions);
  total += questions.length;
  console.log(`${String(mi + 1).padStart(2)}. ${key.padEnd(30)} ${String(questions.length).padStart(3)} preguntas · ${mod.rotulo}`);
}
console.log(`\n${total} preguntas en ${decision.modulos.length} módulos.`);

// ── modo por temas ───────────────────────────────────────────────────────────
const [m1, ...resto] = porModulo;
const todas = [...m1.slice(0, MUESTRA), ...m1.slice(MUESTRA), ...resto.flat()];
const gratis = new Set(m1.slice(0, MUESTRA).map((q) => q.id));
writeFileSync(join(SALIDA, 'patologia-parcial-2-temas.json'), JSON.stringify({
  version: 1,
  key: 'patologia/parcial-2-temas',
  title: 'Examen Parcial 2 — Por temas',
  duration_min: todas.length * 2,
  questions: todas,
}, null, 2) + '\n');

const conteo = {};
for (const q of todas) {
  conteo[q.tema] ??= { total: 0, gratis: 0 };
  conteo[q.tema].total++;
  if (gratis.has(q.id)) conteo[q.tema].gratis++;
}
const filas = Object.entries(conteo).map(([t, c]) => `  '${t}': { total: ${c.total}, gratis: ${c.gratis} },`).join('\n');
writeFileSync(join(RAIZ, 'src', 'lib', 'data', 'temas', 'patologia-parcial-2-conteo.ts'),
`// GENERADO por scripts/patologia-u2/ensamblar.mjs — no editar a mano.
// Preguntas del Parcial 2 por tema (\`gratis\` = dentro de la muestra sin plan).
export const CONTEO_PARCIAL_2: Record<string, { total: number; gratis: number }> = {
${filas}
};
`);
console.log(`Por temas: ${todas.length} preguntas (${gratis.size} gratis), ${Object.keys(conteo).length} temas.`);
if (avisos.length) { console.log(`\nAvisos (${avisos.length}):`); for (const a of avisos) console.log('  · ' + a); }
