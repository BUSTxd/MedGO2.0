// Genera src/lib/data/encib/temario.ts y preguntas.ts a partir de las fuentes
// de esta carpeta:
//   temario-2026.md         tabla de especificaciones ENCIB codificada (ÁREA-sub.tema)
//   clasificacion-300.json  clasificación de las 300 preguntas 2021/2024/2025
//
//   node scripts/encib/generar.mjs
//
// El enunciado, las alternativas y las respuestas NO están aquí ni pasan a la
// web: solo el tema, la dificultad estimada, la carga cognitiva y el concepto
// evaluado. El repo es público; la clasificación completa vive fuera de git.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const destino = path.join(aqui, '..', '..', 'src', 'lib', 'data', 'encib');
fs.mkdirSync(destino, { recursive: true });

// ── Temario ──
const md = fs.readFileSync(path.join(aqui, 'temario-2026.md'), 'utf8');
const temario = {};
for (const linea of md.split(/\r?\n/)) {
  const m = linea.match(/^([A-Z]{3})-(\d+) ([^:]+): (.+)$/);
  if (!m) continue;
  const [, area, sub, nombre, resto] = m;
  const temas = resto.split(' · ').map((t) => {
    const tm = t.match(/^(\d+)\.(\d+) (.+)$/);
    if (!tm || tm[1] !== sub) throw new Error(`Tema mal formado en ${area}-${sub}: «${t}»`);
    const texto = tm[3].trim();
    return { codigo: `${area}-${sub}.${tm[2]}`, nombre: texto[0].toUpperCase() + texto.slice(1) };
  });
  (temario[area] ??= []).push({ codigo: `${area}-${sub}`, nombre: nombre.trim(), temas });
}
const nAreas = Object.keys(temario).length;
if (nAreas !== 8) throw new Error(`Se esperaban 8 áreas y salieron ${nAreas}`);

let ts = `// GENERADO por scripts/encib/generar.mjs desde scripts/encib/temario-2026.md — no editar a mano.
import type { SubareaEncib } from './tipos';

export const TEMARIO: Record<string, SubareaEncib[]> = ${JSON.stringify(temario, null, 2)};
`;
fs.writeFileSync(path.join(destino, 'temario.ts'), ts);

// ── Preguntas ──
const todas = JSON.parse(fs.readFileSync(path.join(aqui, 'clasificacion-300.json'), 'utf8'));
const codigos = new Set(Object.values(temario).flatMap((s) => s.flatMap((x) => x.temas.map((t) => t.codigo))));
const preguntas = todas
  .sort((a, b) => a.anio - b.anio || a.n - b.n)
  .map((q) => {
    if (!codigos.has(q.codigo)) throw new Error(`${q.anio}-${q.n}: código ${q.codigo} no está en el temario`);
    return {
      anio: q.anio,
      n: q.n,
      codigo: q.codigo,
      secundarios: (q.codigos_secundarios ?? []).filter((c) => codigos.has(c)),
      dificultad: q.dificultad,
      carga: q.carga_cognitiva,
      formato: q.formato,
      decorativo: !!q.caso_decorativo,
      patron: q.patron,
      concepto: q.concepto_especifico,
    };
  });
for (const anio of [2021, 2024, 2025]) {
  const n = preguntas.filter((q) => q.anio === anio).length;
  if (n !== 100) throw new Error(`${anio}: ${n} preguntas, se esperaban 100`);
}

ts = `// GENERADO por scripts/encib/generar.mjs desde scripts/encib/clasificacion-300.json — no editar a mano.
import type { PreguntaEncib } from './tipos';

export const PREGUNTAS: PreguntaEncib[] = ${JSON.stringify(preguntas, null, 1)};
`;
fs.writeFileSync(path.join(destino, 'preguntas.ts'), ts);
console.log(`ok · ${Object.values(temario).flat().length} subáreas · ${codigos.size} temas · ${preguntas.length} preguntas`);
