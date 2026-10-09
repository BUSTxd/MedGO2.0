/**
 * Prueba el corrector (src/lib/examen-ms/corregir.ts) contra el banco entero y
 * contra los casos de las reglas de BUST.
 *
 *   node scripts/examen-ms/probar-corrector.mjs
 *
 * - Toda forma aceptada de la A y de cada respuesta B tiene que pasar.
 * - Todo `noConfundir` tiene que fallar.
 * - Escribir todas las respuestas de una B da puntaje 1; con la A mal, 0; con
 *   menos de las que pide o con una incorrecta, 0 (la B vale entera o nada).
 * - Casos de las reglas: abreviaturas, prefijo opcional, porción obligatoria,
 *   radial ≠ radio, cubital ≠ cúbito, erratas de una letra con aviso.
 */

import fs from 'node:fs';
import path from 'node:path';
import { register } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(AQUI, '..', '..');
// Node importa TypeScript, pero no entiende el alias «@/» de Next ni las rutas sin extensión.
const src = pathToFileURL(path.join(RAIZ, 'src') + path.sep).href;
register('data:text/javascript,' + encodeURIComponent(`
  export async function resolve(s, c, n) {
    if (s.startsWith('@/')) return n(new URL(s.slice(2) + '.ts', ${JSON.stringify(src)}).href, c);
    if (s.startsWith('.') && !/\\.[a-z]+$/.test(s) && c.parentURL?.endsWith('.ts')) return n(s + '.ts', c);
    return n(s, c);
  }`));
const { clave, indexarFormas, corregirA, corregirB } = await import(pathToFileURL(path.join(RAIZ, 'src', 'lib', 'examen-ms', 'corregir.ts')).href);
const { hidratarBanco } = await import(pathToFileURL(path.join(RAIZ, 'src', 'lib', 'examen-ms', 'sesion.ts')).href);

// Lo mismo que recibe el navegador: el banco publicado, hidratado con la función del cliente.
const banco = hidratarBanco(JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'examen-ms', 'banco.publicar.json'), 'utf8')));
const completo = JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'examen-ms', 'banco.json'), 'utf8'));
const indice = indexarFormas(banco.formas);
const fallos = [];
const falla = (t) => fallos.push(t);

// El publicado no puede haber perdido ninguna forma aceptada del completo.
for (const c of completo.preguntas) {
  const h = banco.preguntas.find((x) => x.id === c.id);
  const falta = (a, b) => a.filter((f) => !b.includes(f));
  if (!h) { fallos.push(`${c.id}: falta en el publicado`); continue; }
  if (falta(c.preguntaA.aceptadas, h.preguntaA.aceptadas).length) fallos.push(`${c.id} A: el publicado pierde formas`);
  c.preguntaB.respuestas.forEach((r, i) => { if (falta(r.aceptadas, h.preguntaB.respuestas[i].aceptadas).length) fallos.push(`${c.id} B${i}: el publicado pierde formas`); });
}

// ── Todo el banco ─────────────────────────────────────────────────────────────
let comprobaciones = 0;
for (const p of banco.preguntas) {
  for (const f of p.preguntaA.aceptadas) {
    comprobaciones++;
    if (corregirA(f, p, indice).veredicto !== 'bien') falla(`${p.id} A: «${f}» no pasa`);
  }
  for (const f of p.preguntaA.noConfundir) {
    comprobaciones++;
    if (corregirA(f, p, indice).veredicto !== 'mal') falla(`${p.id} A: «${f}» (noConfundir) pasa`);
  }
  const b = p.preguntaB;
  b.respuestas.forEach((r, i) => {
    for (const f of [r.texto, ...r.aceptadas]) {
      comprobaciones++;
      const c = corregirB(f, p, true, indice);
      if (!c.acertadas.length) falla(`${p.id} B: «${f}» no acierta «${r.texto}»`);
      else if (c.acertadas[0].indice !== i && clave(b.respuestas[c.acertadas[0].indice].texto) !== clave(r.texto)) {
        // Cuenta como otra respuesta: solo es problema si no son equivalentes.
        if (!b.respuestas[c.acertadas[0].indice].aceptadas.some((x) => clave(x) === clave(f))) falla(`${p.id} B: «${f}» se cuenta como «${b.respuestas[c.acertadas[0].indice].texto}»`);
      }
    }
  });
  comprobaciones++;
  const todas = corregirB(b.respuestas.map((r) => r.texto).join(', '), p, true, indice);
  if (todas.puntaje !== 1) falla(`${p.id} B: todas las respuestas juntas dan ${todas.puntaje}`);
  if (todas.incorrectas.length) falla(`${p.id} B: todas juntas dejan como incorrectas ${JSON.stringify(todas.incorrectas)}`);
  comprobaciones++;
  if (corregirB(b.respuestas.map((r) => r.texto).join(', '), p, false, indice).puntaje !== 0) falla(`${p.id} B: con la A mal no da 0`);
}

// ── Casos de las reglas de BUST ───────────────────────────────────────────────
const P = (id) => {
  const p = banco.preguntas.find((x) => x.id === id);
  if (!p) throw new Error(`no existe ${id}`);
  return p;
};
const A = (id, escrito, esperado) => {
  comprobaciones++;
  const v = corregirA(escrito, P(id), indice).veredicto;
  if (v !== esperado) falla(`regla: A de ${id} con «${escrito}» → ${v} (esperado ${esperado})`);
};
const B = (id, escrito, puntaje, aCorrecta = true) => {
  comprobaciones++;
  const c = corregirB(escrito, P(id), aCorrecta, indice);
  if (Math.abs(c.puntaje - puntaje) > 1e-9) falla(`regla: B de ${id} con «${escrito}» → ${c.puntaje} (esperado ${puntaje}; acertadas ${c.acertadas.map((a) => a.escrito).join(' | ')}; incorrectas ${c.incorrectas.join(' | ')})`);
};
const nervioMediano = banco.preguntas.find((p) => p.id.startsWith('ms-nervio-mediano-')).id;
const biceps = banco.preguntas.find((p) => p.id.startsWith('ms-biceps-braquial-cabeza-larga-')).id;
const bicepsEntero = banco.preguntas.find((p) => /^ms-biceps-braquial-(inervacion|funcion)/.test(p.id)).id;
const nervioRadial = banco.preguntas.find((p) => p.id.startsWith('ms-nervio-radial-')).id;
const arteriaCubital = banco.preguntas.find((p) => p.id.startsWith('ms-arteria-cubital-')).id;
const radio = banco.preguntas.find((p) => p.id.startsWith('ms-radio-')).id;

A(nervioMediano, 'N. Mediano', 'bien');
A(nervioMediano, 'n mediano', 'bien');
A(nervioMediano, 'nervio mediano', 'bien');
A(nervioMediano, 'NERVIO   MEDIANO.', 'bien');
A(nervioMediano, 'mediano', 'mal');                 // sin «nervio» no se sabe qué es
A(nervioMediano, 'nervio medianno', 'casi');        // una letra de más en palabra larga
A(bicepsEntero, 'músculo bíceps braquial', 'bien');
A(bicepsEntero, 'bíceps braquial', 'bien');
A(bicepsEntero, 'm. bíceps braquial', 'bien');
A(biceps, 'bíceps braquial', 'mal');                // la porción es obligatoria
A(biceps, 'cabeza larga del bíceps', 'bien');
A(nervioRadial, 'nervio radio', 'mal');             // radial ≠ radio
A(radio, 'radial', 'mal');
A(arteriaCubital, 'arteria cúbito', 'mal');         // cubital ≠ cúbito
A(arteriaCubital, 'arteria ulnar', 'bien');
A(arteriaCubital, 'nervio cubital', 'mal');

// B con varias respuestas: separadores, orden libre, parcial, A mal → 0.
const axilarMusculos = 'ms-nervio-axilar-musculos-que-inerva';
B(axilarMusculos, 'deltoides y redondo menor', 1);
B(axilarMusculos, 'Redondo menor, deltoides', 1);
B(axilarMusculos, 'redondo menor\ndeltoides', 1);
B(axilarMusculos, 'deltoides', 0);                 // pide 2: con uno no basta
B(axilarMusculos, 'deltoides, redondo mayor', 0);  // uno mal tumba toda la B
B(axilarMusculos, 'deltoides, redondo menor, redondo mayor', 0);
B(axilarMusculos, 'deltoides y redondo menor', 0, false);
B('ms-tuberculo-mayor-inserciones-musculares', 'supraespinoso, infraespinoso, redondo menor', 1);
B('ms-tuberculo-mayor-inserciones-musculares', 'supraespinoso, infraespinoso', 0);
B('ms-vena-basilica-formadores', 'vena cubital superficial y vena mediana basílica', 1);
B('ms-redondo-menor-funcion', 'rotación externa del brazo', 1);
B('ms-redondo-menor-funcion', 'rotación medial del brazo', 0);
B('ms-arteria-subescapular-ramas-terminales', 'arteria toracodorsal', 0);
B('ms-nervio-radial-musculos-que-inerva', 'ancóneo, supinador', 1);
B('ms-serrato-anterior-funcion', 'rota la escápula hacia abajo', 0);

console.log(`${comprobaciones} comprobaciones · ${fallos.length} fallos`);
for (const f of fallos.slice(0, 60)) console.log('  ✗ ' + f);
if (fallos.length > 60) console.log(`  … y ${fallos.length - 60} más`);
process.exit(fallos.length ? 1 : 0);
