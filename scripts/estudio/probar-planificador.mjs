/**
 * Pruebas del motor del planificador (`src/lib/estudio/planificador.ts`) con el
 * índice real de un curso (bucket privado `examenes/_indice/<curso>.json`).
 *
 *   node --experimental-strip-types --no-warnings scripts/estudio/probar-planificador.mjs [--curso inmunologia]
 *
 * Escenarios: tiempo de sobra, justo, déficit, atraso, todo hecho, un solo tema,
 * bloques propios y una evaluación. En cada uno comprueba que ninguna tarea cae
 * el día del examen o después, que ningún día pasa su tope (salvo una tarea sola
 * más larga que el día), que los ids no se repiten, que lo hecho no vuelve y que
 * dos cálculos iguales dan lo mismo.
 */

import { planificar, sumarDias, evaluaciones } from '../../src/lib/estudio/planificador.ts';
import { bajarIndice } from './comun.mjs';

const args = process.argv.slice(2);
const CURSO = args.includes('--curso') ? args[args.indexOf('--curso') + 1] : 'inmunologia';
const indice = await bajarIndice(CURSO);
if (!indice) { console.error(`No hay índice de ${CURSO}: corre antes indexar-curso.mjs.`); process.exit(1); }

const HOY = '2026-11-02'; // lunes
const LAB = [1, 2, 3, 4, 5];
const vacio = { intentos: [], hechas: [], estudiadas: [] };
const errores = [];
const fallo = (esc, m) => errores.push(`${esc}: ${m}`);

function comprobar(esc, plan, avance, hoy = HOY) {
  const r = planificar(indice, plan, avance, hoy);
  const ids = new Set();
  for (const d of r.dias) {
    if (d.fecha >= plan.fechaExamen) fallo(esc, `tarea el ${d.fecha}, día del examen o después`);
    if (d.fecha < hoy) fallo(esc, `tarea en el pasado (${d.fecha})`);
    const tope = d.vispera ? Math.round(plan.respuestas.minutos / 2) : plan.respuestas.minutos;
    if (d.minutos > tope && d.tareas.length > 1) fallo(esc, `${d.fecha} suma ${d.minutos} min con tope ${tope}`);
    if (d.vispera && d.tareas.some((t) => t.tipo === 'leer')) fallo(esc, 'la víspera tiene lectura nueva');
    for (const t of d.tareas) {
      if (ids.has(t.id)) fallo(esc, `id repetido ${t.id}`);
      ids.add(t.id);
      if (t.hecha) fallo(esc, `tarea hecha en el calendario: ${t.id}`);
    }
  }
  for (const t of r.sinHueco) if (ids.has(t.id)) fallo(esc, `${t.id} está en el calendario y sin hueco`);
  const otra = planificar(indice, plan, avance, hoy);
  if (JSON.stringify(otra) !== JSON.stringify(r)) fallo(esc, 'dos cálculos iguales no dan lo mismo');
  const n = r.dias.reduce((a, d) => a + d.tareas.length, 0);
  console.log(`  ${esc.padEnd(26)} ${String(r.dias.length).padStart(3)} días · ${String(n).padStart(3)} tareas · ${String(r.sinHueco.length).padStart(3)} sin hueco · ${String(r.hechas.length).padStart(3)} hechas · ${r.totales.minutosPendientes}/${r.totales.minutosDisponibles} min${r.totales.priorizado ? ' · priorizado' : ''}`);
  return r;
}

const respuestas = (minutos, objetivo = 'aprobar', dias = LAB) => ({ dias, minutos, partida: {}, objetivo });
console.log(`\n${CURSO}: ${indice.clases.length} clases, ${Object.keys(indice.temas).length} temas`);

// 1. Tiempo de sobra: todo cabe.
const sobra = comprobar('curso, 8 semanas', { fechaExamen: sumarDias(HOY, 56), alcance: { tipo: 'curso' }, respuestas: respuestas(150, 'destacar') }, vacio);
if (sobra.sinHueco.length) fallo('curso, 8 semanas', `${sobra.sinHueco.length} tareas sin hueco con tiempo de sobra`);
const simul = sobra.dias.flatMap((d) => d.tareas.filter((t) => t.tipo === 'simulacro').map(() => d.fecha));
if (!simul.length) fallo('curso, 8 semanas', 'sin simulacros');
// Las segundas vueltas van después de las primeras, con espacio.
const dia = new Map(sobra.dias.flatMap((d) => d.tareas.map((t) => [t.id, d.fecha])));
for (const [id, f] of dia) {
  const m = id.match(/^practicar:(.+):2$/);
  if (!m) continue;
  const primera = dia.get(`practicar:${m[1]}:1`);
  if (primera && f <= primera) fallo('curso, 8 semanas', `segunda vuelta de ${m[1]} no va después de la primera`);
}

// 2. Déficit: dos semanas a 45 min para el curso entero.
const deficit = comprobar('curso, 2 semanas a 45 min', { fechaExamen: sumarDias(HOY, 14), alcance: { tipo: 'curso' }, respuestas: respuestas(45) }, vacio);
if (!deficit.sinHueco.length) fallo('déficit', 'debería sobrar trabajo');
if (!deficit.totales.priorizado) fallo('déficit', 'debería priorizar por peso');

// 3. Atraso: el mismo plan visto tres días después, sin haber hecho nada.
comprobar('atraso de 3 días', { fechaExamen: sumarDias(HOY, 56), alcance: { tipo: 'curso' }, respuestas: respuestas(150, 'destacar') }, vacio, sumarDias(HOY, 3));

// 4. Todo hecho: lo que estaba en el plan vuelve como hecho y no se reprograma.
const todasIds = [...sobra.dias.flatMap((d) => d.tareas), ...sobra.sinHueco];
const avanceTodo = {
  hechas: todasIds.filter((t) => t.tipo === 'leer' || t.tipo === 'repasar').map((t) => t.id),
  estudiadas: [],
  intentos: todasIds.filter((t) => t.practica).flatMap((t) => [0, 5].map((dd) => ({
    key: t.practica.key, fecha: `${sumarDias(HOY, -10 + dd)}T10:00:00Z`, score: 9, total: 10,
    ...(t.practica.tema ? { tema: t.practica.tema } : {}),
  }))),
};
const hecho = comprobar('todo hecho', { fechaExamen: sumarDias(HOY, 56), alcance: { tipo: 'curso' }, respuestas: respuestas(150, 'destacar') }, avanceTodo);
const quedan = hecho.dias.reduce((a, d) => a + d.tareas.length, 0) + hecho.sinHueco.length;
if (quedan) fallo('todo hecho', `quedan ${quedan} tareas`);
if (hecho.totales.progreso !== 100) fallo('todo hecho', `progreso ${hecho.totales.progreso} %`);

// 5. Un intento flojo pide refuerzo, y al repetirlo bien desaparece.
const unaClase = indice.clases.find((c) => !c.evaluacion && c.practica.some((p) => p.tipo === 'tarjetas'));
if (unaClase) {
  const key = unaClase.practica.find((p) => p.tipo === 'tarjetas').key;
  const plan = { fechaExamen: sumarDias(HOY, 21), alcance: { tipo: 'clases', clases: [unaClase.id] }, respuestas: respuestas(60) };
  const flojo = comprobar('intento flojo', plan, { ...vacio, intentos: [{ key, fecha: `${HOY}T08:00:00Z`, score: 3, total: 10 }] });
  if (!flojo.dias.some((d) => d.tareas.some((t) => t.tipo === 'repasar'))) fallo('intento flojo', 'no aparece el refuerzo');
  const mejor = comprobar('repetido bien', plan, { ...vacio, intentos: [{ key, fecha: `${HOY}T08:00:00Z`, score: 3, total: 10 }, { key, fecha: `${HOY}T09:00:00Z`, score: 9, total: 10 }] });
  if (mejor.dias.some((d) => d.tareas.some((t) => t.tipo === 'repasar'))) fallo('repetido bien', 'el refuerzo no desaparece');
  // Marcar la clase como estudiada da su lectura por hecha.
  const est = comprobar('clase estudiada', plan, { ...vacio, estudiadas: [unaClase.id] });
  if (est.dias.some((d) => d.tareas.some((t) => t.tipo === 'leer'))) fallo('clase estudiada', 'sigue pidiendo leer');
}

// 6. Un solo tema y bloques propios.
const temaId = Object.entries(indice.temas).sort((a, b) => b[1].preguntas - a[1].preguntas)[0]?.[0];
if (temaId) {
  const t = comprobar(`tema «${temaId}»`, { fechaExamen: sumarDias(HOY, 7), alcance: { tipo: 'temas', temas: [temaId] }, respuestas: respuestas(60) }, vacio);
  const tareas = t.dias.flatMap((d) => d.tareas);
  if (!tareas.some((x) => x.tipo === 'leer')) fallo('tema', 'sin lectura');
  if (!tareas.some((x) => x.practica?.tema === temaId)) fallo('tema', 'sin práctica filtrada por el tema');
}
const secs = indice.clases.flatMap((c) => c.resumenes.flatMap((r) => r.secciones)).filter((s) => s.temas.length);
if (secs.length > 6) {
  const b = comprobar('bloques propios', {
    fechaExamen: sumarDias(HOY, 10),
    alcance: { tipo: 'bloques', bloques: [{ nombre: 'Bloque A', secciones: secs.slice(0, 3).map((s) => s.id) }, { nombre: 'Bloque B', secciones: secs.slice(3, 6).map((s) => s.id) }] },
    respuestas: respuestas(60),
  }, vacio);
  if (b.unidades.length !== 2) fallo('bloques', `${b.unidades.length} unidades en vez de 2`);
}

// 7. Una evaluación.
const ev = evaluaciones(indice)[0];
if (ev) comprobar(`evaluación ${ev.semana}`, { fechaExamen: sumarDias(HOY, 30), alcance: { tipo: 'evaluacion', semana: ev.semana }, respuestas: respuestas(120, 'aprobar', [0, 1, 2, 3, 4, 5, 6]) }, vacio);

// 8. Examen mañana: no hay días (hoy cuenta solo si es día de estudio).
comprobar('examen mañana', { fechaExamen: sumarDias(HOY, 1), alcance: { tipo: 'curso' }, respuestas: respuestas(60) }, vacio);

console.log('');
if (errores.length) {
  console.error(`ERRORES (${errores.length}):`);
  for (const e of errores.slice(0, 40)) console.error(`  ✕ ${e}`);
  process.exit(1);
}
console.log('✓ Sin errores.');
