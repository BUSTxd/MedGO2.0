/**
 * Tabla de formas aceptadas por estructura, para que BUST la revise antes de
 * publicar el examen. Solo las estructuras que el banco usa (como A o en una B).
 *
 *   node scripts/examen-ms/sinonimos.mjs
 *
 * Escribe docs/examen-ms/sinonimos.md (gitignored).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(AQUI, '..', '..');
const DOCS = path.join(RAIZ, 'docs', 'examen-ms');
const leer = (...p) => JSON.parse(fs.readFileSync(path.join(...p), 'utf8'));

const lexico = {};
const categoria = {};
for (const [f, cat] of [['huesos', 'Huesos y accidentes'], ['musculos', 'Músculos'], ['nervios-vasos', 'Nervios, arterias y venas']]) {
  const l = leer(DOCS, 'lexico', `${f}.json`);
  Object.assign(lexico, l);
  for (const n of Object.keys(l)) categoria[n] = cat;
}
const { preguntas } = leer(RAIZ, 'data', 'examen-ms', 'banco.json');
const { estructuras } = leer(DOCS, 'catalogo_estructuras.json');
const comoA = new Map();
for (const p of preguntas) {
  const e = estructuras.find((x) => (lexico[x.nombre]?.oficial || x.nombre) === p.preguntaA.respuesta);
  const n = e?.nombre ?? p.preguntaA.respuesta;
  comoA.set(n, (comoA.get(n) ?? 0) + 1);
}
const comoB = new Map();
for (const p of preguntas) for (const r of p.preguntaB.respuestas) if (r.ref) comoB.set(r.ref, (comoB.get(r.ref) ?? 0) + 1);

const usadas = Object.keys(lexico).filter((n) => comoA.has(n) || comoB.has(n));
const esc = (s) => String(s).replace(/\|/g, '/');
const L = ['# Formas aceptadas por estructura', '',
  'Para revisar antes de publicar. El corrector ignora mayúsculas, tildes, puntos y espacios; expande n./a./v./m./lig./r.; unifica ordinales (1er, 1.º, primer); y acepta una errata de una letra en palabras de 7 o más letras (con aviso), salvo que lo escrito sea igual de parecido a otra estructura.', '',
  `${usadas.length} estructuras (las que el banco usa como pregunta A o como respuesta de una B).`, ''];
for (const cat of ['Huesos y accidentes', 'Músculos', 'Nervios, arterias y venas']) {
  const l = usadas.filter((n) => categoria[n] === cat).sort((a, b) => a.localeCompare(b, 'es'));
  L.push(`## ${cat} (${l.length})`, '', '| Estructura | Oficial TA (latín) | Formas aceptadas | No confundir con | Usos | Revisar |', '|---|---|---|---|---|---|');
  for (const n of l) {
    const x = lexico[n];
    const usos = [comoA.has(n) && `A×${comoA.get(n)}`, comoB.has(n) && `B×${comoB.get(n)}`].filter(Boolean).join(' ');
    L.push(`| **${esc(n)}** | ${esc(x.oficial)}${x.latin ? ` (*${esc(x.latin)}*)` : ''} | ${x.aceptadas.map(esc).join(' · ')} | ${(x.noConfundir ?? []).map(esc).join(' · ')} | ${usos} | ${esc(x.revision ?? '')} |`);
  }
  L.push('');
}
L.push('## Respuestas que no son una estructura del léxico', '', 'Funciones, territorios, lugares descriptivos… Se corrigen por sus formas aceptadas o por sus palabras clave (todas tienen que aparecer).', '',
  '| Pregunta | Respuesta | Formas aceptadas | Palabras clave | Si aparece, es incorrecta |', '|---|---|---|---|---|');
for (const p of preguntas) for (const r of p.preguntaB.respuestas) if (!r.ref) {
  L.push(`| \`${p.id}\` | ${esc(r.texto)} | ${r.aceptadas.map(esc).join(' · ')} | ${(r.conceptos ?? []).map((g) => g.join('/')).join(' + ')} | ${(r.excluye ?? []).join(', ')} |`);
}
fs.writeFileSync(path.join(DOCS, 'sinonimos.md'), L.join('\n') + '\n');
console.log(`sinonimos.md: ${usadas.length} estructuras · ${preguntas.reduce((n, p) => n + p.preguntaB.respuestas.filter((r) => !r.ref).length, 0)} respuestas descriptivas`);
