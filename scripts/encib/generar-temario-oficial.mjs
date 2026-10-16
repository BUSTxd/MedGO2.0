// Genera src/lib/data/encib/temario-oficial.ts: el texto oficial de cada tema
// de la tabla de especificaciones del ENCIB 2026 (ASPEFAM), por código de tema.
//
//   node scripts/encib/generar-temario-oficial.mjs
//
// Fuente: scripts/encib/tabla-especificaciones-2026.md (documento público de
// ASPEFAM; el original viene en MAYÚSCULAS). Los códigos (`ÁREA-sub.tema`) se
// asignan por posición y deben casar EXACTAMENTE con los de TEMARIO
// (src/lib/data/encib/temario.ts): si sobra o falta alguno, el script falla y
// lo imprime. El texto pasa a tipo oración respetando siglas y nombres propios.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const destino = path.join(aqui, '..', '..', 'src', 'lib', 'data', 'encib');
const md = fs.readFileSync(path.join(aqui, 'tabla-especificaciones-2026.md'), 'utf8');

const AREA = {
  'anatomía': 'ANA', 'histología': 'HIS', 'embriología': 'EMB', 'patología': 'PAT',
  'farmacología': 'FAR', 'bioquímica': 'BIO', 'fisiología': 'FIS', 'microbiología y parasitología': 'MIC',
};

// Siglas que se conservan en mayúsculas.
const SIGLAS = new Set(['snc', 'sna', 'adn', 'arn', 'arnm', 'arnt', 'arnr', 'vih', 'sida', 'ecg', 'ekg', 'atp', 'gtp', 'nad', 'nadh', 'nadph', 'fad', 'ldl', 'hdl', 'vldl', 'htlv', 'vsr', 'epoc', 'sdra', 'hta', 'lcr', 'pcr', 'aines', 'gaba', 'mhc', 'hla', 'tnf', 'abo']);
// Nombres propios, géneros y especies (se escriben con inicial mayúscula).
const PROPIOS = new Set([
  'staphylococcus', 'sthaphylococcus', 'streptococcus', 'enterococcus', 'escherichia', 'shigella', 'brucella', 'pseudomonas', 'klebsiella', 'klebsiellla', 'salmonella', 'bartonella', 'proteus', 'helicobacter', 'haemophilus', 'acinetobacter', 'vibrio', 'neisserias', 'clostridium', 'bacillus', 'listeria', 'treponema', 'leptospira', 'mycobacterium', 'rickettsia', 'mycoplasma', 'chlamydia',
  'candida', 'cryptococcus', 'malassezia', 'pneumocystis', 'sporothrix', 'paracoccidiodes', 'histoplasma', 'aspergillus', 'fusarium', 'epidermophyton', 'trichophyton', 'microsporum',
  'herpes', 'ascaris', 'strongyloides', 'toxocara', 'trichuris', 'taenia', 'echinococcus', 'adenocephalus', 'diphylobothrium', 'diphyllobothrium', 'hymenolepis', 'fasciola', 'paragonimus',
  'entamoeba', 'giardia', 'trichomona', 'tripanosoma', 'leishmania', 'balantidium', 'plasmodium', 'cryptosporidium', 'toxoplasma', 'cystoisospora', 'cyclospora', 'blastocystis',
  'sarcoptes', 'loxosceles', 'latrodectus', 'aedes', 'lutzomyia', 'anopheles', 'culex', 'xenopsylla', 'ctenocephalides', 'tunga', 'pulex', 'rhodnius', 'panstrongylus', 'spp',
  'down', 'turner', 'klinefelter', 'hodgkin', 'wilson', 'cushing', 'addison', 'graves', 'hashimoto', 'alzheimer', 'parkinson', 'huntington', 'paget', 'krebs', 'cori', 'golgi', 'willis', 'meckel', 'wharton', 'bowman', 'henle', 'purkinje', 'langerhans', 'leydig', 'sertoli', 'graaf', 'fallopio', 'falopio', 'rh',
]);

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function oracion(t) {
  let s = t.trim().replace(/\s+/g, ' ').replace(/\s+([,;:.])/g, '$1').replace(/([,;:])(?=[^\s\d])/g, '$1 ');
  s = s.toLowerCase().replace(/[\p{L}\p{N}]+/gu, (w) => {
    const n = norm(w);
    if (SIGLAS.has(n)) return w.toUpperCase();
    if (PROPIOS.has(n)) return w[0].toUpperCase() + w.slice(1);
    return w;
  });
  s = s.replace(/\bhepatitis ([abcde])\b/g, (_, x) => `hepatitis ${x.toUpperCase()}`);
  // Inicial de cada oración.
  s = s.replace(/(^|\.\s+)(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
  return s;
}

const oficial = {};
let area = null;
let sub = 0;
let modo = null;
for (const raw of md.split(/\r?\n/)) {
  const l = raw.trim();
  let m;
  if ((m = l.match(/^## [A-H]\. Área (.+)$/))) {
    area = AREA[m[1].trim().toLowerCase()];
    if (!area) throw new Error(`Área desconocida: ${m[1]}`);
    sub = 0;
    modo = 'esperando';
    continue;
  }
  if (!area) continue;
  if (/^### Subáreas/.test(l)) { modo = 'lista'; continue; }
  if ((m = l.match(/^### (\d+)\. /))) { sub = Number(m[1]); modo = 'temas'; continue; }
  if (modo === 'temas' && (m = l.match(/^(\d+)\. (.+)$/))) {
    oficial[`${area}-${sub}.${m[1]}`] = oracion(m[2]);
  }
}

// ── Casa con TEMARIO ──
const ts = fs.readFileSync(path.join(destino, 'temario.ts'), 'utf8');
const esperados = new Set([...ts.matchAll(/"codigo": "([A-Z]{3}-\d+\.\d+)"/g)].map((x) => x[1]));
const propios = new Set(Object.keys(oficial));
const sobran = [...propios].filter((c) => !esperados.has(c));
const faltan = [...esperados].filter((c) => !propios.has(c));
if (sobran.length || faltan.length || esperados.size !== 337) {
  console.error(`Sobran: ${sobran.join(', ') || '—'}\nFaltan: ${faltan.join(', ') || '—'}\nEsperados ${esperados.size}, leídos ${propios.size}`);
  process.exit(1);
}

const out = `// GENERADO por scripts/encib/generar-temario-oficial.mjs desde scripts/encib/tabla-especificaciones-2026.md — no editar a mano.

/** Texto oficial (ASPEFAM, ENCIB 2026) de cada tema, por código \`ÁREA-sub.tema\`. */
export const TEMARIO_OFICIAL: Record<string, string> = ${JSON.stringify(oficial, null, 2)};
`;
fs.writeFileSync(path.join(destino, 'temario-oficial.ts'), out);
console.log(`OK: ${Object.keys(oficial).length} temas.`);
