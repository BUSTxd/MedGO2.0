/**
 * Verifica el laboratorio «Vasculitis de vasos medianos y pequeños y ANCA».
 *
 *   npm run verificar:vasculitis
 *
 * LA VOZ ES EL RELOJ: cada capítulo tiene una marca por paso, en orden, y NINGUNA
 * animación puede terminar después del final de la frase de su paso. Además caza lo
 * que no rompe la compilación: un parámetro que su lámina lee y nadie anima (el dibujo
 * no saldría nunca) o que se anima y ninguna lámina lee, y una lámina de más o de menos.
 * Compila cada capítulo con el motor de Lupus buscando NaN. ERRORES → código 1.
 */

import { readFileSync } from 'node:fs';
import { register } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

register('../lupus/cargador.mjs', import.meta.url);

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const cargar = async (rel) => import(pathToFileURL(path.join(RAIZ, 'src', rel)).href);
const { CAPITULOS } = await cargar('lib/data/vasculitis/capitulos.ts');
const { INDICE } = await cargar('lib/data/vasculitis/indice.ts');
const { NARRACION } = await cargar('lib/data/vasculitis/narracion.ts');
const { VISTAZO } = await cargar('lib/data/vasculitis/vistazo.ts');
const motor = await cargar('lib/lupus/motor.ts');

const errores = [], avisos = [];
const err = (d, m) => errores.push(`${d}: ${m}`);
const aviso = (d, m) => avisos.push(`${d}: ${m}`);

/** Por cada lámina (en el orden de `LAMINAS`), los parámetros que lee. */
function parametrosDeLaminas(cap) {
  const src = readFileSync(path.join(RAIZ, 'src/app/dashboard/laboratorio/vasculitis-anca/laminas', `c${cap}.tsx`), 'utf8');
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

let fotogramas = 0;
for (const esc of CAPITULOS) {
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

const pasos = CAPITULOS.reduce((n, p) => n + p.pasos.length, 0);
const min = CAPITULOS.reduce((n, p) => n + p.narracion.duracion, 0) / 60;
console.log(`Vasculitis · ${CAPITULOS.length} capítulos · ${pasos} pasos · ${min.toFixed(1)} min de voz · ${fotogramas} fotogramas evaluados`);
for (const a of avisos) console.log(`  aviso  ${a}`);
for (const e of errores) console.log(`  ERROR  ${e}`);
if (errores.length) { console.log(`\n${errores.length} error(es).`); process.exit(1); }
console.log(avisos.length ? `\nSin errores (${avisos.length} avisos).` : '\nSin errores.');
