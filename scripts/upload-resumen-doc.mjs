/**
 * Publica los dos envases que traen su propia maquetación y NO necesitan que
 * el visor los escale:
 *
 *   · «documento de flujo» (`.doc-flujo`) — un HTML escrito a mano (o
 *     reconstruido de una foto) con texto en flujo normal, figuras en rejilla
 *     y sus propias media queries;
 *   · «páginas auto-escaladas» (`.doc-paginas`) — hojas de proporción fija
 *     (`aspect-ratio` + `container-type: inline-size`) con el contenido en % y
 *     `cqw`. Es un PDF reconstruido, como el envase en capas, pero se escala
 *     solo: no tiene altura fija que ajustar ni hace falta `transform`.
 *
 * El script elige por sí mismo (ver «elegir el envase»).
 *
 *   node scripts/upload-resumen-doc.mjs \
 *     --dir "C:/Users/BUST/Downloads/biologia/Taller_1_HTML_optimizado" \
 *     --curso biologia-celular --id bcm-ta-1 --slug ta1-agua
 *
 * Tercer hermano de `upload-resumen-html.mjs` (exports de Notion) y
 * `upload-resumen-capas.mjs` (PDF reconstruido en capas). Existe aparte porque
 * los otros dos buscan un ancla que este envase no tiene —el
 * `<div class="page-body">` de Notion, la `.page`/`.pdf-page` de capas— y
 * abortan.
 *
 * Es el MEJOR de los tres envases y por eso merece el suyo: el texto reflowea
 * de verdad, así que en móvil se lee, y los botones A−/A+ del visor sí hacen
 * algo. No hay que escalar nada.
 *
 * Diferencia de criterio con los otros dos: aquí el <style> del documento
 * **no se descarta**. En Notion y en capas el estilo es ruido del conversor y
 * lo pone MedGO, pero en un documento escrito a mano la maquetación ES el
 * documento (rejillas de figuras, proporciones, cortes por ancho) y tirarla
 * dejaría las figuras apiladas a una columna. Lo que se hace es sanearlo:
 *   · se eliminan las reglas globales (html, body, *, y `:root` pasa a ser el
 *     propio contenedor) — son las que pisarían el dashboard entero;
 *   · todo lo demás se prefija con `.doc-flujo`, de modo que no puede
 *     escaparse del fragmento.
 * El tema (claro/oscuro) lo sigue poniendo `resumenHtml.module.css`, que
 * redefine las custom properties del documento con los tokens del visor.
 *
 * Lo que NO hace (son cambios de código, quedan para el agente):
 *   - registrar el id en ALLOWED/FILE_ALIAS de la route de resumen-html
 *   - marcar la actividad en `src/lib/data/<curso>.ts`
 *
 * Flags: --dry (no sube, deja `<id>.preview.html`) · --force (re-sube y pisa).
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { createClient } from '@supabase/supabase-js';
import { config } from './load-env.mjs';
import { sanearCss, estilosDe } from './sanear-css.mjs';

const BUCKET_IMG  = 'resumenes-img';   // público
const BUCKET_HTML = 'resumenes';       // privado

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith('--')) continue;
  const key = a.slice(2);
  const next = process.argv[i + 1];
  if (!next || next.startsWith('--')) args[key] = true;
  else { args[key] = next; i++; }
}

const { dir, curso, id, slug, dry, force } = args;
if (!dir || !curso || !id || !slug) {
  console.error('Faltan flags. Uso:\n  node scripts/upload-resumen-doc.mjs --dir <carpeta> --curso <slug-curso> --id <id> --slug <slug-doc> [--dry] [--force]');
  process.exit(1);
}
if (!existsSync(dir)) { console.error(`No existe la carpeta: ${dir}`); process.exit(1); }

const PREFIX = `${curso}/${slug}`;
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

// ─── 1. localizar y validar el HTML ──────────────────────────────────────
const htmls = readdirSync(dir).filter(f => f.toLowerCase().endsWith('.html') && !/preview/i.test(f));
if (htmls.length !== 1) {
  console.error(`Esperaba 1 .html (sin contar preview), encontré ${htmls.length}: ${htmls.join(', ')}`);
  process.exit(1);
}
let html = readFileSync(join(dir, htmls[0]), 'utf8');
console.log(`\nHTML   : ${htmls[0]}  (${kb(Buffer.byteLength(html, 'utf8'))})`);

// Mandar cada envase a su script. Publicar un export de Notion o uno en capas
// por aquí produciría un documento roto de formas difíciles de ver.
if (/<div class="page-body">/.test(html)) {
  console.error('✗ Esto es un export de Notion. Usa scripts/upload-resumen-html.mjs (/addresumenhtml).');
  process.exit(1);
}
/* La frontera con el envase en capas es la **altura fija de la página**, no el
   nombre de sus clases. Ta7 tiene `.pdf-page`, pero declara `min-height` y
   `padding` y no usa ni un `position:absolute`: es flujo, y rechazarlo por el
   nombre lo mandaba a un uploader que no sabe qué altura darle. */
const estiloDoc = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join('\n');
const paginasFijas = [];   // clases cuya regla declara una página de tamaño fijo
for (const bloque of estiloDoc.split('}')) {
  const i = bloque.indexOf('{');
  if (i === -1) continue;
  const sel = bloque.slice(0, i).trim();
  if (!/^\.[\w-]+$/.test(sel)) continue;
  const decl = bloque.slice(i + 1);
  const alto = decl.match(/(?:^|;)\s*height:\s*(?:([\d.]+)(?:pt|px)|var\()/);
  if (!alto || !/(?:^|;)\s*width:/.test(decl)) continue;
  if (alto[1] && +alto[1] < 300) continue;
  paginasFijas.push(sel.slice(1));
}
/* Con página fija hay DOS destinos posibles, y los separa cuántas páginas hay.
   Los documentos del envase en capas son UNA página larguísima (aunque dentro
   lleven varias hojas dibujadas: Ta5 tiene 4, Ta12 tres `.inner-page`). Este
   otro conversor emite **N contenedores de página**, cada uno con sus propias
   medidas inline (`--pw/--ph` + `data-w/data-h`) — LAB6 trae 14, y encima de
   dos tamaños distintos. Ahí el modelo de capas no vale: escribe un único
   `--page-w/--page-h` en el envoltorio y escala una sola `.page`. */
const nHojas = Math.max(0, ...paginasFijas.map(
  c => (html.match(new RegExp(`class="[^"]*(?<![\\w-])${c}(?![\\w-])`, 'g')) || []).length));
if (/class="(?:image-layer|text-layer|pdf-text)"/.test(html) || (paginasFijas.length && nHojas < 2)) {
  console.error('✗ Esto es un PDF reconstruido en capas (una página de altura fija).');
  console.error('  Usa scripts/upload-resumen-capas.mjs (/addresumencapas).');
  process.exit(1);
}

// ─── 2. resolver los assets contra el disco ──────────────────────────────
/* El fallo silencioso nº1 de estos exports: convertir `assets/*` a AVIF por
   fuera NO toca el HTML, que sigue pidiendo `.webp`. El documento carga con
   CERO imágenes y, como el texto sí se ve, parece que "sólo faltan figuras".
   Aquí se resuelve cada referencia contra lo que hay de verdad en la carpeta. */
const RE_SRC = /src="([^"]+\.(?:png|jpe?g|webp|avif|svg))"/gi;
const refs = [...new Set([...html.matchAll(RE_SRC)].map(m => m[1]))];
if (!refs.length) { console.error('✗ El documento no referencia ninguna imagen.'); process.exit(1); }

const real = new Map();      // ref del HTML → ruta relativa existente
const faltan = [];
for (const ref of refs) {
  if (existsSync(join(dir, ref))) { real.set(ref, ref); continue; }
  const carpeta = dirname(ref);
  const base = basename(ref, extname(ref));
  const cand = ['.avif', '.webp', '.png', '.jpg', '.jpeg', '.svg']
    .map(e => `${carpeta}/${base}${e}`)
    .find(p => existsSync(join(dir, p)));
  if (cand) real.set(ref, cand);
  else faltan.push(ref);
}
if (faltan.length) {
  console.error(`✗ ${faltan.length} asset(s) referenciados que no están en la carpeta:`);
  faltan.forEach(f => console.error('   ' + f));
  process.exit(1);
}
const reescritas = [...real.entries()].filter(([a, b]) => a !== b).length;
console.log(`assets : ${refs.length}  (${reescritas} con la extensión corregida)`);

// ─── 3. elegir el envase ─────────────────────────────────────────────────
/* Tres documentos pueden llegar aquí, y no quieren el mismo trato:
     · «flujo» — texto en flujo normal, figuras en rejilla. Necesita los
       parches del visor: `max-width` en los hijos, tabla ancha que scrollea.
     · «páginas» — hojas de proporción fija (`aspect-ratio` + `container-type`)
       con el contenido en % y `cqw`. Se escala solo, así que tampoco es capas
       (no hay altura fija que el visor tenga que ajustar), pero sus tablas y
       figuras van en `position:absolute` y aquellos parches las destrozarían.
     · «hojas» — N páginas de tamaño fijo en px, cada una con sus medidas, que
       el visor tiene que escalar con `transform` (ver `nHojas` arriba).

   Los dos primeros los separa lo único que de verdad los distingue: si el
   documento posiciona su contenido en absoluto. No se mira el nombre de las
   clases, que ya engañó una vez con el `.pdf-page` de Ta7. */
const estilos = estilosDe(html);
const posicionado = (estilos.match(/position:\s*absolute/gi) || []).length;
const ENVASE = nHojas >= 2 ? 'doc-hojas' : posicionado ? 'doc-paginas' : 'doc-flujo';

/* El prefijo va DOBLE en «páginas» (`.doc-paginas.doc-paginas`, que casa el
   mismo elemento y suma una clase de especificidad). El motivo: este envase
   trae su maquetación entera, incluidas tablas, y el vocabulario de Notion del
   module —que no se puede acotar, porque sus fragmentos no llevan envoltorio—
   tiene reglas como `tbody tr:nth-child(even) td` (0-2-3) que le ganarían a un
   `.doc-paginas .bluecell` (0-2-0) y le cambiarían el color a una celda. Con el
   prefijo doble el documento manda siempre sobre lo genérico del visor. */
const PREFIJO = ENVASE === 'doc-flujo' ? '.doc-flujo' : `.${ENVASE}.${ENVASE}`;
console.log(`envase : ${ENVASE}  ${ENVASE === 'doc-hojas' ? `(${nHojas} hojas de tamaño fijo)`
  : posicionado ? `(${posicionado} reglas position:absolute)` : '(sin posicionamiento absoluto)'}`);

// ─── 3b. sanear el <style> del documento ─────────────────────────────────
/* Se conserva la maquetación y se tira lo global; el detalle, en sanear-css.mjs
   (compartido con el uploader de capas, que hace lo mismo con otro prefijo). */
const cssSaneado = sanearCss(estilos, { prefijo: PREFIJO });
if (!cssSaneado) { console.error('✗ El <style> quedó vacío tras sanearlo. Revisa el documento.'); process.exit(1); }
console.log(`estilo : ${kb(Buffer.byteLength(estilos, 'utf8'))} → ${kb(Buffer.byteLength(cssSaneado, 'utf8'))} saneado y prefijado`);

// ─── 4. extraer el cuerpo ────────────────────────────────────────────────
const mBody = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
if (!mBody) { console.error('✗ No encontré <body>.'); process.exit(1); }
let body = mBody[1]
  .replace(/<script[\s\S]*?<\/script>/gi, '')   // no se ejecutarían igualmente
  .replace(/<style[\s\S]*?<\/style>/gi, '')     // ya está saneado arriba
  .trim();

// ─── 5. Supabase ─────────────────────────────────────────────────────────
const URL = config.NEXT_PUBLIC_SUPABASE_URL;
const KEY = config.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error('Faltan credenciales en .env.local'); process.exit(1); }
const sb = createClient(URL, KEY, { auth: { persistSession: false } });
const BASE_PUB = `${URL}/storage/v1/object/public/${BUCKET_IMG}`;

// ─── 6. subir los assets ─────────────────────────────────────────────────
// Ya son AVIF: se suben tal cual. Recomprimir un AVIF sería una segunda
// pérdida sobre un formato que ya es lossy.
let bytes = 0, subidas = 0;
const fallos = [];
for (const ruta of new Set(real.values())) {
  const buf = readFileSync(join(dir, ruta));
  bytes += buf.length;
  const dest = `${PREFIX}/${ruta.split('/').pop()}`;
  if (dry) { subidas++; continue; }
  const ext = ruta.split('.').pop().toLowerCase();
  const mime = ext === 'avif' ? 'image/avif' : ext === 'png' ? 'image/png'
             : ext === 'webp' ? 'image/webp' : ext === 'svg' ? 'image/svg+xml' : 'image/jpeg';
  const { error } = await sb.storage.from(BUCKET_IMG).upload(dest, buf, {
    contentType: mime,
    cacheControl: '31536000, immutable',  // una figura no se reedita
    upsert: Boolean(force),
  });
  if (error) fallos.push(`${dest}: ${error.message}`);
  else subidas++;
  process.stdout.write(`\r  subidos: ${subidas}/${real.size}`);
}
console.log(`\r  subidos: ${subidas}/${new Set(real.values()).size}   ${kb(bytes)}`);
if (fallos.length) {
  console.error(`\n✗ ${fallos.length} fallos:`);
  fallos.slice(0, 10).forEach(f => console.error('   ' + f));
  if (!force) console.error('\n  Si lo estás actualizando, repite con --force.');
  process.exit(1);
}

// ─── 7. armar el fragmento ───────────────────────────────────────────────
// rutas locales → CDN público, con la extensión que de verdad existe
body = body.replace(RE_SRC, (tag, ref) => {
  const r = real.get(ref) ?? ref;
  return `src="${BASE_PUB}/${PREFIX}/${r.split('/').pop()}"`;
});

// Carga diferida: aquí no hay capas a página completa que excluir, sólo
// figuras. Se respeta el `loading` que ya traiga el documento.
body = body.replace(/<img (?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async" ');

/* En «hojas», el visor escala cada hoja leyendo `data-w`/`data-h` del
   `.page-shell`. No todos los exports los traen: LAB6 sí, pero LAB8 y LAB10
   declaran las medidas en `var(--page-w)`/`var(--page-h)` sobre `:root`, y sin
   los atributos el visor hace `continue` — la hoja se queda a tamaño natural y
   **A−/A+ no hacen nada**, que es como se ve el fallo.

   Se normaliza aquí y no en el visor a propósito: el nombre de la variable
   cambia con cada export (`--pw`, `--page-w`, `--W`…) y el uploader ya está
   leyendo el CSS del documento, mientras que el visor lo comparten cuatro
   envases. Así el contrato del visor sigue siendo uno solo. */
if (ENVASE === 'doc-hojas') {
  const varDe = n => {
    const m = estilos.match(new RegExp(`--${n}\\s*:\\s*([\\d.]+)(px|pt)?`));
    return m ? (m[2] === 'pt' ? +m[1] * 4 / 3 : +m[1]) : null;
  };
  // Medida declarada en la regla de la hoja: literal, o `var(--x)` a resolver.
  const medidaDe = prop => {
    const regla = estilos.match(/\.page-shell\s*{([^}]*)}/);
    if (!regla) return null;
    const d = regla[1].match(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`));
    if (!d) return null;
    const lit = d[1].match(/^\s*([\d.]+)(px|pt)?/);
    if (lit) return lit[2] === 'pt' ? +lit[1] * 4 / 3 : +lit[1];
    const v = d[1].match(/var\(\s*--([\w-]+)/);
    return v ? varDe(v[1]) : null;
  };
  let inyectadas = 0;
  body = body.replace(/<(\w+)([^>]*\bclass="[^"]*(?<![\w-])page-shell(?![\w-])[^"]*"[^>]*)>/g,
    (tag, el, attrs) => {
      if (/\bdata-w=/.test(attrs)) return tag;          // el export ya las trae
      const inline = attrs.match(/--pw\s*:\s*([\d.]+)(px|pt)?/);
      const inlineH = attrs.match(/--ph\s*:\s*([\d.]+)(px|pt)?/);
      const W = inline ? (inline[2] === 'pt' ? +inline[1] * 4 / 3 : +inline[1]) : medidaDe('width');
      const H = inlineH ? (inlineH[2] === 'pt' ? +inlineH[1] * 4 / 3 : +inlineH[1]) : medidaDe('height');
      if (!W || !H) return tag;
      inyectadas++;
      return `<${el}${attrs} data-w="${W}" data-h="${H}">`;
    });
  if (inyectadas) console.log(`hojas  : ${inyectadas} con data-w/data-h inyectados (el export no los traía)`);
  else if (!/\bdata-w=/.test(body)) {
    console.error('✗ Ninguna hoja tiene data-w/data-h y no pude deducirlos del CSS.');
    console.error('  El visor no podría escalarlas: revisa dónde declara sus medidas.');
    process.exit(1);
  }
}

/* El <style> viaja DENTRO del fragmento. Un <style> inyectado con
   dangerouslySetInnerHTML sí se aplica (a diferencia de un <script>, que no se
   ejecuta), y prefijado con la clase del envase no puede alcanzar nada del
   visor. */
const frag = `<div class="${ENVASE}"><style>${cssSaneado}</style>${body}</div>`;

const quedan = (frag.match(/src="(?!https:\/\/)/g) || []).length;
if (quedan) { console.error(`✗ Quedaron ${quedan} rutas locales sin reapuntar.`); process.exit(1); }

console.log(`\nfragmento: ${kb(Buffer.byteLength(frag, 'utf8'))}  ·  ${new Set(real.values()).size} assets`);

// ─── 8. subir el fragmento ───────────────────────────────────────────────
const destHtml = `${curso}/${id}.html`;
if (dry) {
  const out = join(dir, `${id}.preview.html`);
  writeFileSync(out, frag, 'utf8');
  console.log(`\n[--dry] nada subido. Fragmento en ${out}`);
} else {
  const { error } = await sb.storage.from(BUCKET_HTML).upload(destHtml, Buffer.from(frag, 'utf8'), {
    contentType: 'text/html',
    cacheControl: '300',   // de la caché se encarga el ETag de la route
    upsert: Boolean(force),
  });
  if (error) {
    console.error(`✗ No se pudo subir el HTML: ${error.message}`);
    if (!force) console.error('  Si lo estás actualizando, repite con --force.');
    process.exit(1);
  }
  console.log(`\n✓ ${BUCKET_HTML}/${destHtml}`);
  console.log(`✓ ${BUCKET_IMG}/${PREFIX}/  (${subidas} assets)`);
}

console.log(`
Falta el código:

 1. src/app/api/resumen-html/[claseId]/route.ts
    ALLOWED    → '${id}'
    FILE_ALIAS → '${id}': '${curso}/${id}'

 2. src/lib/data/${curso}.ts, en la actividad '${id}':
    resumen: { tipo: 'pdf', formato: 'html', opciones: [{ id: '${id}', label: 'Resumen', formato: 'html' }] }
`);
