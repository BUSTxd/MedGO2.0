/**
 * Verifica el laboratorio «Infecciones bacterianas por gramnegativas» (clase AI18).
 *
 *   npm run verificar:gramnegativas [-- --caps 0,1,2]
 *
 * LA VOZ ES EL RELOJ: cada capítulo tiene una marca por paso, en orden, y NINGUNA
 * animación puede terminar después del final de la frase de su paso. Además caza lo
 * que no rompe la compilación: un parámetro que su lámina lee y nadie anima (el dibujo
 * no saldría nunca) o que se anima y ninguna lámina lee, y una lámina de más o de menos.
 * Compila cada capítulo con el motor de Lupus buscando NaN. Revisa también las tablas
 * resumen (`tablas.ts`): que cada fila lleve a un paso que existe, que la pestaña gratis solo
 * apunte al vistazo y que las celdas encajen con sus columnas (`--tablas` imprime a qué paso
 * lleva cada fila, para comprobar a ojo que es el que toca). ERRORES → código 1.
 */

import { readFileSync } from 'node:fs';
import { register } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

register('../lupus/cargador.mjs', import.meta.url);

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const cargar = async (rel) => import(pathToFileURL(path.join(RAIZ, 'src', rel)).href);
const { CAPITULOS } = await cargar('lib/data/gramnegativas/capitulos.ts');
const { INDICE } = await cargar('lib/data/gramnegativas/indice.ts');
const { NARRACION } = await cargar('lib/data/gramnegativas/narracion.ts');
const { VISTAZO } = await cargar('lib/data/gramnegativas/vistazo.ts');
const { GRUPOS } = await cargar('lib/data/gramnegativas/tablas-indice.ts');
const { TABLAS } = await cargar('lib/data/gramnegativas/tablas.ts');
const motor = await cargar('lib/lupus/motor.ts');

// `--caps 0,1,2`: solo esos capítulos (para ir verificando por lotes mientras se anima).
const iCaps = process.argv.indexOf('--caps');
const SOLO = iCaps === -1 ? null : process.argv[iCaps + 1].split(',').map(Number);
const toca = (c) => !SOLO || SOLO.includes(c);

const errores = [], avisos = [];
const err = (d, m) => errores.push(`${d}: ${m}`);
const aviso = (d, m) => avisos.push(`${d}: ${m}`);

/** Por cada lámina (en el orden de `LAMINAS`), los parámetros que lee. */
function parametrosDeLaminas(cap) {
  const src = readFileSync(path.join(RAIZ, 'src/app/dashboard/laboratorio/gramnegativas/laminas', `c${cap}.tsx`), 'utf8');
  const lista = src.match(/const LAMINAS: Lamina\[\] = \[([^\]]*)\]/);
  if (!lista) { err(`c${cap}`, 'sin `LAMINAS`'); return []; }
  return lista[1].split(',').map((x) => x.trim()).filter(Boolean).map((nombre) => {
    const ini = src.indexOf(`const ${nombre}: Lamina`);
    if (ini === -1) { err(`c${cap}`, `no encuentro la lámina «${nombre}»`); return new Set(); }
    const fin = src.indexOf('\nconst ', ini + 10);
    const cuerpo = src.slice(ini, fin === -1 ? undefined : fin);
    const usados = new Set([...cuerpo.matchAll(/\bp\('([^']+)'\)/g)].map((m) => m[1]));
    // Parámetros leídos desde una variable (`p(n)`, `p(n as string)`, `p(genes[i][0])`):
    // cualquier literal de la lámina puede ser uno de ellos.
    if (/\bp\((?!')[^)]/.test(cuerpo)) for (const q of cuerpo.matchAll(/'([a-zA-Z0-9]+)'/g)) usados.add(`?${q[1]}`);
    return usados;
  });
}

if (INDICE.length !== NARRACION.length) err('indice', `${INDICE.length} capítulos y ${NARRACION.length} audios`);
if (CAPITULOS.length !== INDICE.length) err('capitulos', `${CAPITULOS.length} capítulos y ${INDICE.length} en el índice`);
for (const id of VISTAZO) if (!INDICE.some((m) => m.id === id)) err('vistazo', `«${id}» no es un capítulo`);

for (const [c, esc] of CAPITULOS.entries()) {
  if (!toca(c)) continue;
  const voz = esc.narracion;
  if (voz !== NARRACION[c]) err(esc.id, 'usa una narración que no es la suya');
  if (voz.marcas.length !== esc.pasos.length) err(esc.id, `${voz.marcas.length} marcas y ${esc.pasos.length} pasos`);
  if (voz.marcas[0] !== 0) err(esc.id, 'la primera marca debe ser 0');
  if (voz.marcas.some((m, i) => i > 0 && m <= voz.marcas[i - 1])) err(esc.id, 'marcas fuera de orden');
  const lim = motor.duracionesVoz(esc);
  const leidos = parametrosDeLaminas(c);
  if (leidos.length !== esc.pasos.length) err(esc.id, `${leidos.length} láminas y ${esc.pasos.length} pasos`);
  esc.pasos.forEach((p, i) => {
    const donde = `${esc.id} · ${p.id}`;
    const nombres = new Set();
    for (const a of p.acciones) {
      const fin = a.at + motor.duracionDe(a);
      if (fin > lim[i]) err(donde, `«${a.param}» termina a ${(fin / 1000).toFixed(2)} s y la frase dura ${(lim[i] / 1000).toFixed(2)} s`);
      const n = a.param.split('.').pop();
      if (nombres.has(n)) err(donde, `«${n}» está animado dos veces`);
      nombres.add(n);
    }
    const u = leidos[i] ?? new Set();
    for (const n of u) if (!n.startsWith('?') && !nombres.has(n)) err(donde, `la lámina lee «${n}» y nadie lo anima`);
    for (const n of nombres) if (!u.has(n) && !u.has(`?${n}`)) err(donde, `se anima «${n}» y la lámina no lo lee`);
    const ultima = Math.max(0, ...p.acciones.map((a) => a.at + motor.duracionDe(a)));
    if (lim[i] - ultima > 9000) aviso(donde, `${((lim[i] - ultima) / 1000).toFixed(1)} s de voz sin nada que se mueva`);
    if (p.texto.split(/\s+/).length > 60) aviso(donde, `texto de ${p.texto.split(/\s+/).length} palabras`);
  });
}

// ─── Tablas resumen ──────────────────────────────────────────────────────────
let nTablas = 0, nFilas = 0;
const mapaTablas = [];
const idsGrupo = new Set();
for (const gr of GRUPOS) {
  if (idsGrupo.has(gr.id)) err('tablas', `pestaña «${gr.id}» repetida`);
  idsGrupo.add(gr.id);
  for (const cap of gr.capitulos) if (!INDICE.some((m) => m.id === cap)) err(`tablas · ${gr.id}`, `«${cap}» no es un capítulo`);
  const tablas = TABLAS[gr.id];
  if (!tablas?.length) { err(`tablas · ${gr.id}`, 'la pestaña no tiene tablas'); continue; }
  const idsTabla = new Set();
  for (const t of tablas) {
    const donde = `tablas · ${gr.id} · ${t.id}`;
    nTablas++;
    if (idsTabla.has(t.id)) err(donde, 'id de tabla repetido');
    idsTabla.add(t.id);
    if (t.columnas.length < 2) err(donde, 'menos de dos columnas');
    if (t.farmacologia && gr.gratis) err(donde, 'repaso de Farmacología en la pestaña gratis');
    const destinos = t.destino ? [[t.titulo, t.destino]] : [];
    const nombres = new Set();
    for (const f of t.filas) {
      nFilas++;
      if (nombres.has(f.nombre)) err(donde, `fila «${f.nombre}» repetida`);
      nombres.add(f.nombre);
      if (f.celdas.length !== t.columnas.length - 1) err(donde, `«${f.nombre}»: ${f.celdas.length} celdas para ${t.columnas.length - 1} columnas`);
      for (const cel of f.celdas) if (!(Array.isArray(cel) ? cel.length > 0 && cel.every((x) => x.trim()) : cel.trim())) err(donde, `«${f.nombre}» tiene una celda vacía`);
      if (!f.destino && !t.destino) err(donde, `«${f.nombre}» no lleva a ningún paso`);
      if (f.destino) destinos.push([f.nombre, f.destino]);
    }
    for (const [que, dst] of destinos) {
      const meta = INDICE.find((m) => m.id === dst.cap);
      const paso = meta ? CAPITULOS[meta.numero]?.pasos[dst.paso] : undefined;
      if (!paso) { err(donde, `«${que}» lleva a «${dst.cap}» paso ${dst.paso}, que no existe`); continue; }
      if (gr.gratis && !VISTAZO.includes(dst.cap)) err(donde, `«${que}» está en la pestaña gratis y lleva a «${dst.cap}», que es de pago`);
      mapaTablas.push(`  ${gr.id} · ${t.id} · ${que.replaceAll('*', '').slice(0, 44).padEnd(44)} → cap. ${meta.numero} paso ${dst.paso} «${paso.titulo}»`);
    }
    for (const x of [t.titulo, t.nota ?? '', ...t.filas.flatMap((f) => [f.nombre, ...f.celdas.flat()])]) {
      if (x.split('*').length % 2 === 0) err(donde, `asteriscos sin pareja en «${x.slice(0, 50)}…»`);
    }
  }
}
for (const id of Object.keys(TABLAS)) if (!idsGrupo.has(id)) err('tablas', `hay tablas de «${id}» y ninguna pestaña con ese id`);
if (process.argv.includes('--tablas')) console.log(`${mapaTablas.join('\n')}\n`);

let fotogramas = 0;
for (const [c, esc] of CAPITULOS.entries()) {
  if (!toca(c)) continue;
  for (const modo of [motor.MODO_ESCRITORIO, { asp: 0.6, movil: true }, { asp: 1.6, movil: true }]) {
    const cmp = motor.compilar(esc, modo);
    const total = cmp.pasos.reduce((s, pc) => s + pc.duracion, 0) / 1000;
    if (!modo.movil && Math.abs(total - esc.narracion.duracion) > 0.05) err(esc.id, `dura ${total.toFixed(2)} s y su voz ${esc.narracion.duracion} s`);
    for (const pc of cmp.pasos) for (const f of [0, 0.25, 0.5, 0.75, 1]) {
      const e = motor.evaluar(pc, pc.duracion * f);
      fotogramas++;
      for (const [k, v] of Object.entries(e.tejido)) if (!Number.isFinite(v)) err(pc.paso.id, `«${k}» = ${v}`);
    }
  }
}

const elegidos = CAPITULOS.filter((_, c) => toca(c));
const pasos = elegidos.reduce((n, p) => n + p.pasos.length, 0);
const min = elegidos.reduce((n, p) => n + p.narracion.duracion, 0) / 60;
console.log(`Gramnegativas · ${elegidos.length} capítulos · ${pasos} pasos · ${min.toFixed(1)} min de voz · ${fotogramas} fotogramas evaluados · ${GRUPOS.length} pestañas de tablas, ${nTablas} tablas, ${nFilas} filas`);
for (const a of avisos) console.log(`  aviso  ${a}`);
for (const e of errores) console.log(`  ERROR  ${e}`);
if (errores.length) { console.log(`\n${errores.length} error(es).`); process.exit(1); }
console.log(avisos.length ? `\nSin errores (${avisos.length} avisos).` : '\nSin errores.');
