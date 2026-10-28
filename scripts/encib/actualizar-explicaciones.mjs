/** Banco privado: node scripts/encib/actualizar-explicaciones.mjs [--comprobar] */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const comprobar = process.argv.includes('--comprobar');
const carpeta = path.join(raiz, 'data/encib');
const observaciones = JSON.parse(fs.readFileSync(path.join(carpeta, 'observaciones-editoriales.json'), 'utf8'));
const pendientes = [];
let palabras = 0;

for (const anio of [2021, 2024, 2025]) {
  const archivo = path.join(carpeta, `${anio}.json`);
  const banco = JSON.parse(fs.readFileSync(archivo, 'utf8'));
  const editorial = JSON.parse(fs.readFileSync(path.join(carpeta, `editorial-${anio}.json`), 'utf8'));
  assert.equal(banco.questions.length, 100);
  assert.equal(editorial.length, 100);
  assert.equal(new Set(editorial.map((r) => r[0])).size, 100);
  for (const [n, fundamento, ...resto] of editorial) {
    const q = banco.questions.find((q) => q.n === n);
    assert.ok(q, `${anio}/${n}: pregunta no encontrada`);
    assert.equal(q.options.length, 4);
    assert.equal(q.options.filter((o) => o.correct).length, 1);
    assert.equal(resto.length, 5, `${anio}/${n}: cuatro alternativas y un dato clave`);
    const datoClave = resto[4];
    const wc = fundamento.trim().split(/\s+/).length;
    assert.ok(wc >= 35 && wc <= 100, `${anio}/${n}: fundamento fuera de 35–100 palabras (${wc})`);
    assert.ok(datoClave.length >= 30 && datoClave.length <= 320);
    palabras += wc;
    const descartes = q.options.flatMap((o, i) => {
      if (o.correct) { assert.equal(resto[i], null, `${anio}/${n}: descarte de respuesta correcta`); return []; }
      assert.ok(typeof resto[i] === 'string' && resto[i].length >= 35, `${anio}/${n}/${o.id}: descarte ausente o demasiado breve`);
      return [{ optionId: o.id, texto: resto[i] }];
    });
    const explanationDetail = { fundamento, descartes, datoClave };
    const observacion = observaciones[anio]?.[n];
    // Markdown de respaldo para motores que aún no renderizan el contrato estructurado.
    const explanation = `${fundamento}\n\n**Por qué las otras opciones no corresponden**\n\n${descartes.map((d) => `- **${q.options.find((o) => o.id === d.optionId).text}**: ${d.texto}`).join('\n')}\n\n**Dato clave:** ${datoClave}`;
    if (comprobar) {
      assert.deepEqual(q.explanationDetail, explanationDetail, `${anio}/${n}: banco desactualizado`);
      assert.equal(q.explanation, explanation);
      if (observacion) assert.equal(q.reviewNote, observacion);
    } else {
      q.explanationDetail = explanationDetail;
      q.explanation = explanation;
      if (observacion) q.reviewNote = observacion;
    }
  }
  pendientes.push({ archivo, banco });
}

// Se validan los tres antes de escribir alguno; respaldo local de los originales.
if (!comprobar) {
  const respaldo = path.join(carpeta, 'respaldo-explicaciones-2026-10-23');
  fs.mkdirSync(respaldo, { recursive: true });
  for (const { archivo, banco } of pendientes) {
    const copia = path.join(respaldo, path.basename(archivo));
    if (!fs.existsSync(copia)) fs.copyFileSync(archivo, copia);
    fs.writeFileSync(archivo, `${JSON.stringify(banco, null, 2)}\n`);
  }
}
console.log(`${comprobar ? 'Verificadas' : 'Actualizadas'} 300 explicaciones: fundamento medio de ${Math.round(palabras / 300)} palabras, 900 descartes por id y 300 datos clave.`);
