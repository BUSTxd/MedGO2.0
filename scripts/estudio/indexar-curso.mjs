/**
 * Índice de un curso para el planificador de estudio (`/estudio` → Mi progreso).
 *
 *   node --experimental-strip-types --no-warnings scripts/estudio/indexar-curso.mjs --curso inmunologia
 *   … --curso inmunologia --dry     arma el índice y lo resume, sin subir nada
 *   … --auditar [--curso x]         informe de qué le falta a cada curso (no sube)
 *
 * Por cada clase del sílabo baja su resumen HTML del bucket `resumenes`, lo parte
 * en subtítulos con el MISMO corte que la IA (`src/lib/resumen/segmentar.ts`),
 * mide cuánto se tarda en leer cada uno y le cuelga la práctica que lo toca: las
 * preguntas y tarjetas traen `tema` y `seccion` (el subtítulo), así que se cuentan
 * por clase, por tema y por subtítulo. Sube el resultado al bucket privado
 * `examenes/_indice/<curso>.json` (forma en `src/lib/estudio/indice-tipos.ts`).
 *
 * Hay que volver a correrlo al añadir o editar un resumen, un banqueo o unas
 * tarjetas del curso (lista completa en CLAUDE.md, «Planificador y catálogo por
 * tema»); `npm run verificar:catalogo` avisa si el índice quedó viejo.
 */

import { segmentar, slug, normalizar } from '../../src/lib/resumen/segmentar.ts';
import {
  BUCKET_INDICE, archivosDeSilabos, bajarResumen, cargarPractica, cargarSilabo, cargarTemas,
  clavesDePractica, hash, opcionesDeResumen, resumenesHtml, rutaIndice, supabase,
} from './comun.mjs';

const args = process.argv.slice(2);
const opcion = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const CURSO = opcion('--curso');
const DRY = args.includes('--dry');
const AUDITAR = args.includes('--auditar');

if (!CURSO && !AUDITAR) {
  console.error('Uso: indexar-curso.mjs --curso <slug> [--dry]  |  --auditar [--curso <slug>]');
  process.exit(1);
}

/** Palabras por minuto de lectura de estudio (texto médico denso, no lectura corrida). */
const PPM = 180;
/** Lo que se le da a cada figura: mirarla y entenderla. */
const MIN_POR_FIGURA = 0.5;
/** Un resumen en PDF no se puede medir: se le supone esto. */
const MIN_PDF = 25;

const redondear = (x) => Math.round(x * 10) / 10;
const contarPalabras = (t) => (t.match(/[\p{L}\p{N}]+/gu) ?? []).length;

function seccionesDe(resumenId, html) {
  const { modo, tramos } = segmentar(html);
  const usados = new Map();
  const secciones = tramos.map((t, i) => {
    const base = modo === 'titulos' ? slug(t.titulo) : `${modo === 'hojas' ? 'hoja' : 'parte'}-${i + 1}`;
    const n = (usados.get(base) ?? 0) + 1;
    usados.set(base, n);
    const palabras = contarPalabras(t.texto);
    return {
      id: `${resumenId}#${n > 1 ? `${base}-${n}` : base}`,
      titulo: t.titulo,
      ruta: t.ruta,
      nivel: t.nivel,
      palabras,
      figuras: t.figuras.length,
      minutos: redondear(palabras / PPM + t.figuras.length * MIN_POR_FIGURA),
      temas: [],
      preguntas: 0,
      tarjetas: 0,
      // Sólo para casar preguntas con su sección; se quita antes de subir.
      _texto: normalizar(t.texto),
    };
  });
  return { modo, secciones };
}

/**
 * El subtítulo al que apunta el `seccion` de una pregunta. El visor
 * (`buscarSeccion` de DocumentoResumen) lo busca por el comienzo de un título y,
 * si no, en las celdas de las tablas; aquí igual: primero el título, luego la
 * sección cuyo texto lo contiene. «Padre › Hijo» se busca por el último eslabón.
 */
function buscarSeccion(secciones, texto) {
  const n = normalizar((texto ?? '').split('›').pop());
  if (n.length < 3) return null;
  return secciones.find((s) => normalizar(s.titulo) === n)
    ?? secciones.find((s) => normalizar(s.titulo).startsWith(n))
    ?? secciones.find((s) => n.startsWith(normalizar(s.titulo)) && normalizar(s.titulo).length >= 4)
    ?? secciones.find((s) => s._texto.includes(n))
    ?? null;
}

async function indexar(curso) {
  const semanas = await cargarSilabo(curso);
  if (!semanas) throw new Error(`«${curso}» no tiene sílabo en silabos.ts.`);
  const htmls = resumenesHtml();
  const tabla = (await cargarTemas(curso)) ?? {};
  const temasUsados = new Map(); // tema → { preguntas, enExamenes }
  const temasSecciones = new Map(); // tema → Set(id sección)
  const informe = { clases: 0, conResumen: 0, calidad: {}, conPractica: 0, secciones: 0, minutos: 0, conSeccion: 0, sinCasar: 0, temaAjeno: new Set(), faltan: [] };

  const clases = [];
  for (const semana of semanas) {
    for (const act of semana.actividades ?? []) {
      informe.clases++;
      const resumenes = [];
      for (const op of opcionesDeResumen(act)) {
        if (op.formato !== 'html') {
          resumenes.push({ id: op.id, label: op.label, formato: 'pdf', calidad: 'pdf', minutos: MIN_PDF, secciones: [] });
          continue;
        }
        const ruta = htmls.get(op.id);
        const html = ruta ? await bajarResumen(ruta) : null;
        if (!html) {
          informe.faltan.push(op.id);
          resumenes.push({ id: op.id, label: op.label, formato: 'html', calidad: 'falta', minutos: 0, secciones: [] });
          continue;
        }
        const { modo, secciones } = seccionesDe(op.id, html);
        resumenes.push({
          id: op.id, label: op.label, formato: 'html', calidad: modo, hash: hash(html),
          minutos: redondear(secciones.reduce((a, s) => a + s.minutos, 0)), secciones,
        });
      }
      if (resumenes.length) informe.conResumen++;
      for (const r of resumenes) {
        informe.calidad[r.calidad] = (informe.calidad[r.calidad] ?? 0) + 1;
        informe.secciones += r.secciones.length;
        informe.minutos += r.minutos;
      }
      const todasSecciones = resumenes.flatMap((r) => r.secciones);

      const practica = [];
      for (const { key, tipo, etiqueta } of clavesDePractica(act)) {
        const json = await cargarPractica(key);
        if (!json) { informe.faltan.push(key); continue; }
        const items = [
          ...(json.questions ?? []).map((q) => ({ ...q, _tipo: 'preguntas' })),
          ...(json.flashcards ?? []).map((f) => ({ ...f, _tipo: 'tarjetas' })),
        ];
        const porTema = {};
        for (const it of items) {
          if (it.tema) {
            porTema[it.tema] = (porTema[it.tema] ?? 0) + 1;
            const u = temasUsados.get(it.tema) ?? { preguntas: 0, enExamenes: 0 };
            u.preguntas++;
            if (semana.esEvaluacion) u.enExamenes++;
            temasUsados.set(it.tema, u);
            if (!tabla[it.tema]) informe.temaAjeno.add(it.tema);
          }
          if (!it.seccion) continue;
          const s = buscarSeccion(todasSecciones, it.seccion);
          if (!s) { informe.sinCasar++; continue; }
          informe.conSeccion++;
          s[it._tipo]++;
          if (it.tema) {
            if (!s.temas.includes(it.tema)) s.temas.push(it.tema);
            if (!temasSecciones.has(it.tema)) temasSecciones.set(it.tema, new Set());
            temasSecciones.get(it.tema).add(s.id);
          }
        }
        practica.push({
          key, tipo, ...(etiqueta ? { etiqueta } : {}),
          preguntas: (json.questions ?? []).length,
          tarjetas: (json.flashcards ?? []).length,
          porTema,
        });
      }
      if (practica.length) informe.conPractica++;

      clases.push({
        id: act.id,
        ...(act.codigo ? { codigo: act.codigo } : {}),
        titulo: act.titulo,
        tipo: act.tipo,
        semana: semana.id,
        evaluacion: !!semana.esEvaluacion,
        resumenes,
        practica,
      });
    }
  }

  const temas = {};
  for (const [id, t] of Object.entries(tabla)) {
    const secciones = new Set([...(t.secciones ?? []), ...(temasSecciones.get(id) ?? [])]);
    const u = temasUsados.get(id) ?? { preguntas: 0, enExamenes: 0 };
    temas[id] = {
      label: t.label,
      clases: (t.clases ?? []).map((c) => c.claseId),
      secciones: [...secciones],
      preguntas: u.preguntas,
      enExamenes: u.enExamenes,
      ...(t.banqueo ? { banqueo: t.banqueo } : {}),
      ...(t.tarjetas ? { tarjetas: t.tarjetas } : {}),
    };
  }

  for (const k of clases) for (const r of k.resumenes) for (const sec of r.secciones) delete sec._texto;
  informe.trozos = clases.flatMap((k) => k.resumenes.filter((r) => r.calidad === 'trozos').map((r) => r.id));

  return { indice: { version: 1, curso, generado: new Date().toISOString(), clases, temas }, informe, tieneTabla: Object.keys(tabla).length > 0 };
}

function imprimir(curso, { indice, informe, tieneTabla }) {
  const c = informe.calidad;
  const horas = Math.round(informe.minutos / 6) / 10;
  console.log(`\n${curso}`);
  console.log(`  ${informe.clases} actividades · ${informe.conResumen} con resumen · ${informe.conPractica} con práctica`);
  console.log(`  Resúmenes: ${c.titulos ?? 0} con subtítulos, ${c.hojas ?? 0} por hojas, ${c.trozos ?? 0} en trozos, ${c.pdf ?? 0} en PDF, ${c.falta ?? 0} que no se pudieron bajar`);
  console.log(`  ${informe.secciones} subtítulos · ~${horas} h de lectura`);
  console.log(`  Preguntas/tarjetas con «seccion»: ${informe.conSeccion} casadas, ${informe.sinCasar} sin casar`);
  console.log(`  Tabla de temas: ${tieneTabla ? `${Object.keys(indice.temas).length} temas` : 'NO TIENE'}`);
  if (informe.trozos.length) console.log(`  Sin subtítulos (se leen por partes): ${informe.trozos.join(', ')}`);
  if (informe.temaAjeno.size) console.log(`  ⚠ temas usados que no están en la tabla: ${[...informe.temaAjeno].join(', ')}`);
  if (informe.faltan.length) console.log(`  ⚠ no se pudo bajar: ${informe.faltan.join(', ')}`);
  const sinNada = indice.clases.filter((k) => !k.evaluacion && !k.resumenes.length && !k.practica.length).map((k) => k.codigo ?? k.id);
  if (sinNada.length) console.log(`  Sin resumen ni práctica: ${sinNada.join(', ')}`);
}

/** Listo para el planificador: todo en HTML con subtítulos u hojas, con práctica y tabla de temas. */
function veredicto({ indice, informe, tieneTabla }) {
  const c = informe.calidad;
  const motivos = [];
  if (!informe.conResumen) motivos.push('sin resúmenes');
  if ((c.pdf ?? 0) > 0) motivos.push(`${c.pdf} resúmenes en PDF`);
  if ((c.trozos ?? 0) > 0) motivos.push(`${c.trozos} resúmenes sin subtítulos`);
  if ((c.falta ?? 0) > 0) motivos.push(`${c.falta} resúmenes que faltan en el bucket`);
  if (!tieneTabla) motivos.push('sin tabla de temas');
  const sinPractica = indice.clases.filter((k) => k.resumenes.length && !k.practica.length).length;
  if (sinPractica) motivos.push(`${sinPractica} clases con resumen y sin práctica`);
  return motivos;
}

// ── main ─────────────────────────────────────────────────────────────────────

const cursos = CURSO ? [CURSO] : [...archivosDeSilabos().keys()];
const resultados = [];
for (const curso of cursos) {
  try {
    const r = await indexar(curso);
    resultados.push([curso, r]);
    imprimir(curso, r);
  } catch (e) {
    console.error(`\n${curso}: ${e.message}`);
    if (!AUDITAR) process.exit(1);
  }
}

if (AUDITAR) {
  console.log('\n── Listos para el planificador ──');
  for (const [curso, r] of resultados) {
    const m = veredicto(r);
    console.log(`  ${m.length ? '·' : '✓'} ${curso}${m.length ? ` — ${m.join('; ')}` : ''}`);
  }
  process.exit(0);
}

const [[curso, { indice }]] = resultados;
const cuerpo = JSON.stringify(indice);
console.log(`\nÍndice: ${(cuerpo.length / 1024).toFixed(1)} KB`);
if (DRY) {
  for (const k of indice.clases.filter((x) => x.resumenes.length).slice(0, 6)) {
    for (const r of k.resumenes) console.log(`  ${k.codigo ?? k.id} · ${r.id} (${r.calidad}, ${r.minutos} min): ${r.secciones.slice(0, 5).map((s) => s.titulo).join(' | ')}${r.secciones.length > 5 ? ' …' : ''}`);
  }
  console.log('\n--dry: no se subió nada.');
  process.exit(0);
}
if (cuerpo.length > 1024 * 1024) {
  console.error('El índice pasa de 1 MB (límite del bucket `examenes`).');
  process.exit(1);
}
const { error } = await supabase().storage.from(BUCKET_INDICE).upload(rutaIndice(curso), Buffer.from(cuerpo), {
  contentType: 'application/json',
  upsert: true,
  cacheControl: '60',
});
if (error) { console.error('upload:', error.message); process.exit(1); }
console.log(`✓ Subido a ${BUCKET_INDICE}/${rutaIndice(curso)}`);
