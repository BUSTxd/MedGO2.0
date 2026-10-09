// Banco del examen 3D de miembro superior → tarjetas de memoria para el motor
// de tarjetas (Banqueo de la Evaluación 1 de Aparato Locomotor).
//
//   node scripts/examen-ms/tarjetas.mjs
//   node scripts/upload-examen.mjs data/examen-ms/tarjetas.json aparato-locomotor/practico-ms-tarjetas.json
//
// Lee data/examen-ms/banco.publicar.json (fuera de git, como su salida). Una
// tarjeta por pregunta: delante la estructura (la respuesta de la A, que sin el
// modelo se da por sabida) y la pregunta B; detrás lo que se esperaba.

import { readFileSync, writeFileSync } from 'node:fs';

const ENTRADA = 'data/examen-ms/banco.publicar.json';
const SALIDA = 'data/examen-ms/tarjetas.json';

const banco = JSON.parse(readFileSync(ENTRADA, 'utf8'));
const errores = [];

const flashcards = banco.preguntas.map((q) => {
  const a = q.preguntaA;
  const b = q.preguntaB;
  const rs = b.respuestas ?? [];
  const frente = `${a.respuesta} — ${b.enunciado}`;

  // Con una sola pedida y varias en la lista, la principal va delante.
  const orden = b.pide === 1 ? [...rs].sort((x, y) => Number(!!y.principal) - Number(!!x.principal)) : rs;
  const respuesta = orden.map((r) => r.texto).join(b.pide === 1 ? ' / ' : ' · ');

  const detalle = [
    b.criterio,
    ...orden.filter((r) => r.precision || r.nota).map((r) => `- **${r.texto}**: ${[r.precision, r.nota].filter(Boolean).join('. ')}`),
    b.nota,
  ]
    .filter(Boolean)
    .join('\n\n');

  if (!a.respuesta || !b.enunciado) errores.push(`${q.id}: frente vacío`);
  if (!respuesta) errores.push(`${q.id}: sin respuesta`);

  const r = q.resumenRelacionado;
  return {
    id: q.id,
    frente,
    respuesta,
    ...(detalle ? { detalle } : {}),
    tema: q.categoria,
    ...(r?.opcion && r?.seccion ? { resumen: r.opcion, seccion: r.seccion } : {}),
  };
});

if (errores.length) {
  console.error(errores.join('\n'));
  process.exit(1);
}

const payload = {
  version: 1,
  key: 'aparato-locomotor/practico-ms-tarjetas',
  title: 'Examen práctico de miembro superior',
  duration_min: null,
  questions: [],
  flashcards,
};
writeFileSync(SALIDA, JSON.stringify(payload));

const porTema = {};
for (const f of flashcards) porTema[f.tema] = (porTema[f.tema] ?? 0) + 1;
const resumenes = [...new Set(flashcards.map((f) => f.resumen).filter(Boolean))];
console.log(`${flashcards.length} tarjetas → ${SALIDA}`);
console.log('Por categoría:', porTema);
console.log('Resúmenes enlazados:', resumenes.join(', '), `(${flashcards.filter((f) => !f.resumen).length} sin resumen)`);
