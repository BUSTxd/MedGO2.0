/**
 * Publica un resumen de tipo "PDF reconstruido en capas" (ver
 * /addresumencapas). Hermano de `upload-resumen-html.mjs`, que sólo sabe de
 * exports de Notion y aborta con este formato.
 *
 *   node scripts/upload-resumen-capas.mjs \
 *     --dir "C:/Users/BUST/Downloads/Te8_Comunicacion_HTML_optimizado" \
 *     --curso biologia-celular --id bcm-te-8 --slug te8-comunicacion-celular
 *
 * Hace, en este orden:
 *   1. aplica las correcciones del auditor (extensiones reales, aspecto de las
 *      figuras, object-fit, mix-blend-mode de la tinta) — aborta si el auditor
 *      encuentra algo que no sabe reparar;
 *   2. sube `assets/*` tal cual al bucket PÚBLICO `resumenes-img` (ya son AVIF:
 *      NO se recomprimen, sería una segunda pérdida sobre un formato lossy);
 *   3. reduce el documento a un fragmento con las tres capas y lo sube al
 *      bucket PRIVADO `resumenes`.
 *
 * Lo que NO hace (son cambios de código, quedan para el agente):
 *   - registrar el id en ALLOWED/FILE_ALIAS de la route de resumen-html
 *   - marcar la actividad en `src/lib/data/<curso>.ts`
 *
 * Flags: --dry (no sube, deja `<id>.preview.html`) · --force (re-sube y pisa).
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import { config } from './load-env.mjs';
import { sanearCss, estilosDe } from './sanear-css.mjs';

const BUCKET_IMG  = 'resumenes-img';   // público
const BUCKET_HTML = 'resumenes';       // privado
const DESVIO_MAX  = 2;                 // % de aspecto tolerado sin corregir

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
  console.error('Faltan flags. Uso:\n  node scripts/upload-resumen-capas.mjs --dir <carpeta> --curso <slug-curso> --id <id> --slug <slug-doc> [--dry] [--force]');
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

/* El conversor tiene DOS variantes. Comparten la idea (página de tamaño fijo,
   capas absolutas, texto real) pero no el vocabulario, así que hay que
   distinguirlas antes de tocar nada:

     A · «layers»   .page + .image-layer/.text-layer/.ink-layer, todo en px,
                    figuras en <figure data-image>, tinta raster (AVIF) con el
                    resaltador quemado dentro como píxeles opacos.
     B · «pdf-page» .pdf-page + .vector-bg/.pdf-image/.pdf-text/.vector-ink,
                    todo en **pt**, figuras en <img> directo, tinta en **SVG**
                    y el resaltador en un SVG aparte (marks-bg).
     D · «text-block» .pdf-page con el texto en <p>/<h2> .text-block que
                    envuelven .text-span, figuras en <figure class="pdf-image">
                    y la tinta en <img class="ink-layer"> (SVG, pese al nombre
                    que en la variante A era un raster). Su SVG puede
                    referenciar texturas propias con xlink:href.
     C · «native-line» .pdf-page también, pero el texto va en .native-line /
                    .ocr-text, las figuras en <figure class="figure">, la tinta
                    en <img class="annotation-layer"> y el resaltador en
                    <img class="marks-bg"> — y ninguno de los dos trae regla
                    CSS propia, así que el visor tiene que ponérsela entera.
                    Añade .sheet-border (el marco de cada hoja escaneada).

   B y C son mejores documentos: la tinta es vectorial (nítida a cualquier
   zoom) y el resaltador, al venir separado, se puede volver translúcido sin
   tocar la tinta — lo hace el CSS del visor, no este script.

   La familia se reconoce por la PÁGINA (.page o .pdf-page); lo que cambia de
   una variante a otra es el vocabulario del texto, y por eso la detección
   pregunta por él. Un documento con .pdf-page pero sin .pdf-text no es «otro
   formato»: es una variante nueva, y hay que añadirla aquí en vez de dejar que
   el script diga que no lo reconoce. */
const tieneTexto = (...clases) =>
  clases.some(c => new RegExp(`class="[^"]*\\b${c}\\b`).test(html));

const VARIANTE = /class="image-layer"/.test(html) && tieneTexto('text-layer') ? 'layers'
               : /class="pdf-page"/.test(html) && tieneTexto('pdf-text')      ? 'pdf-page'
               : /class="pdf-page"/.test(html) && tieneTexto('native-line', 'ocr-text') ? 'native-line'
               : /class="pdf-page"/.test(html) && tieneTexto('text-block')    ? 'text-block'
               // Página fija pero vocabulario desconocido: NO es otro formato,
               // es una variante más. Se acepta y se publica llevándose su
               // propio <style> saneado (ver más abajo), que es lo que hace
               // que no haga falta enseñarle su vocabulario al proyecto.
               : /class="pdf-page"|class="page"/.test(html)                    ? 'estilo-propio'
               : null;
if (!VARIANTE) {
  console.error('✗ No es un PDF reconstruido en capas: no encuentro ni .image-layer ni .pdf-page.');
  console.error('  Si es un export de Notion, usa upload-resumen-html.mjs.');
  console.error('  Si no tiene página de tamaño fijo, es un documento de flujo: upload-resumen-doc.mjs.');
  process.exit(1);
}

/* Dentro de «pdf-page» el conversor no es consistente: hay documentos en pt y
   documentos en px, y la unidad no se anuncia en ninguna parte salvo en el
   propio `.pdf-page`. Se lee de ahí en vez de asumirla — dar por hecho que
   siempre es pt escalaría un documento en px por 4/3 sin que nada avise.

   El wrapper del fragmento SIEMPRE sale en px porque el visor hace
   `parseFloat` sobre la custom property y la compara con `clientWidth`, que
   está en px. Los hijos se quedan en su unidad original: 1245.612pt son
   exactamente 1660.816px, así que caen en su sitio dentro de la caja sin
   reescribir cientos de coordenadas. */
const PT_A_PX = 4 / 3;
let PAGE_W, PAGE_H, U = 'px';
if (VARIANTE === 'layers') {
  const m = html.match(/--page-w:\s*([\d.]+)px;\s*--page-h:\s*([\d.]+)px/);
  if (!m) { console.error('✗ No encontré --page-w / --page-h.'); process.exit(1); }
  [, PAGE_W, PAGE_H] = m;
} else {
  /* Dos sitios posibles, y hay que probar los dos: unos exports ponen las
     medidas literales en `.pdf-page` (Ta4, Te4, Taller 3) y otros las dejan
     ahí como `var(--page-w)` y el número vive en `:root` (Taller 2). Buscar
     sólo en uno hacía abortar con «no encontré el width/height de .pdf-page»,
     que suena a documento inválido cuando lo único que pasa es que las
     declara en el otro. */
  const lit = html.match(/\.pdf-page\s*\{[^}]*width:\s*([\d.]+)(pt|px);\s*height:\s*([\d.]+)(pt|px)/);
  const raiz = html.match(/--page-w:\s*([\d.]+)(pt|px)?\s*;\s*--page-h:\s*([\d.]+)(pt|px)?\s*;/);
  const m = lit ?? raiz;
  if (!m) {
    console.error('✗ No encontré las medidas de la página (ni en .pdf-page ni en --page-w/--page-h).');
    process.exit(1);
  }
  // La unidad no se anuncia: se lee de donde esté, y si falta se asume px —
  // asumir pt escalaría un documento en px por 4/3 sin que nada avisara.
  U = m[2] ?? m[4] ?? 'px';
  const k = U === 'pt' ? PT_A_PX : 1;
  PAGE_W = (+m[1] * k).toFixed(3);
  PAGE_H = (+m[3] * k).toFixed(3);
}
console.log(`variante: ${VARIANTE}${VARIANTE === 'pdf-page' ? ` (coordenadas en ${U})` : ''}`);
console.log(`página : ${(+PAGE_W).toFixed(0)} × ${(+PAGE_H).toFixed(0)} px`);

// ─── 2. correcciones del auditor ─────────────────────────────────────────
// Se aplican SIEMPRE, aunque el HTML ya venga arreglado: son idempotentes y
// evitan depender de que alguien recuerde correr el auditor antes.
// .svg incluido: en la variante «pdf-page» la tinta y el resaltador son SVG,
// y dejarlos fuera subiría el documento sin sus anotaciones.
const RE_ASSET = /src="([^"]+\.(?:png|jpe?g|webp|avif|svg))"/gi;
const refsRaw = [...new Set([...html.matchAll(RE_ASSET)].map(m => m[1]))];
const renombres = new Map();
const ausentes = [];
for (const ref of refsRaw) {
  if (existsSync(join(dir, ref))) continue;
  const base = ref.replace(/\.(png|jpe?g|webp|avif|svg)$/i, '');
  const alt = ['avif', 'webp', 'png', 'jpg', 'jpeg', 'svg'].map(e => `${base}.${e}`).find(c => existsSync(join(dir, c)));
  if (alt) renombres.set(ref, alt);
  else ausentes.push(ref);
}
for (const [de, a] of renombres) html = html.split(`src="${de}"`).join(`src="${a}"`);
if (renombres.size) console.log(`✓ ${renombres.size} referencias reapuntadas a la extensión real`);

/* Assets que un SVG referencia por su cuenta.
 *
 * La tinta de algunas variantes trae `<image xlink:href="tex01.webp">`: texturas
 * que rellenan flechas y trazos. **No aparecen en el HTML**, así que el barrido
 * de arriba no las ve y se quedarían sin subir — el SVG se publicaría pidiendo
 * archivos que no existen en el CDN. Se resuelven contra el disco igual que las
 * demás y se suben a la misma carpeta, que es donde su href relativo las busca.
 *
 * Las que falten se tratan con el mismo criterio que una figura ausente: se
 * informan y hace falta --omitir-faltantes para quitarlas. Aquí «quitar»
 * significa borrar ese <image> del SVG; dejarlo referenciado no pinta un icono
 * roto (el SVG no lo hace) pero sí encadena un 404 por cada carga. */
const RE_HREF_SVG = /(?:xlink:)?href="([^"#][^"]*\.(?:png|jpe?g|webp|avif))"/gi;
const svgReescrito = new Map();
const texturas = new Set();
for (const ref of refsRaw.filter(r => /\.svg$/i.test(r))) {
  const rutaSvg = renombres.get(ref) ?? ref;
  if (!existsSync(join(dir, rutaSvg))) continue;
  const carpeta = rutaSvg.includes('/') ? rutaSvg.slice(0, rutaSvg.lastIndexOf('/')) : '.';
  let svg = readFileSync(join(dir, rutaSvg), 'utf8');
  const dentro = [...new Set([...svg.matchAll(RE_HREF_SVG)].map(m => m[1]))];
  const perdidas = [];
  for (const t of dentro) {
    const rel = carpeta === '.' ? t : `${carpeta}/${t}`;
    if (existsSync(join(dir, rel))) texturas.add(rel);
    else perdidas.push(t);
  }
  if (!perdidas.length) continue;

  console.log(`\n⚠ ${rutaSvg} referencia ${perdidas.length} textura(s) que no están en disco: ${perdidas.join(', ')}`);
  if (!args['omitir-faltantes']) {
    console.error('✗ Consíguelas, o repite con --omitir-faltantes si eran decorativas.');
    process.exit(1);
  }
  for (const t of perdidas) {
    const esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    svg = svg.replace(new RegExp(`<image\\b[^>]*(?:xlink:)?href="${esc}"[^>]*/>`, 'g'), '')
             .replace(new RegExp(`<image\\b[^>]*(?:xlink:)?href="${esc}"[^>]*>[\\s\\S]*?</image>`, 'g'), '');
  }
  svgReescrito.set(rutaSvg, svg);
  console.log(`  · quitadas del SVG (lo que rellenaban queda sin color, no desaparece la forma)`);
}
if (texturas.size) console.log(`✓ ${texturas.size} textura(s) referenciada(s) desde dentro de un SVG: se suben con él`);

/* Un asset que no está en disco por ninguna extensión. NO se decide solo: una
   figura de 600px que falta es contenido perdido y hay que ir a buscarla,
   mientras que un icono decorativo de 16px no vale detener la publicación —
   pero dejarlo referenciado pinta el icono de imagen rota del navegador.
   Así que se informa con el tamaño de su caja y se exige `--omitir-faltantes`
   para descartarlas: la decisión queda escrita en el comando, no en una
   heurística que un día borre una figura de verdad. */
if (ausentes.length) {
  console.log(`\n⚠ ${ausentes.length} figura(s) referenciada(s) que no están en disco:`);
  for (const ref of ausentes) {
    const caja = html.match(new RegExp(`style="[^"]*width:([\\d.]+)(?:pt|px);height:([\\d.]+)(?:pt|px)[^"]*"[^>]*>\\s*<img src="${ref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`))
              ?? html.match(new RegExp(`<img[^>]*src="${ref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*width:([\\d.]+)(?:pt|px);height:([\\d.]+)(?:pt|px)`));
    const dim = caja ? `${(+caja[1]).toFixed(0)}×${(+caja[2]).toFixed(0)}` : 'tamaño desconocido';
    const alt = html.match(new RegExp(`src="${ref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*alt="([^"]*)"`))?.[1] ?? '';
    console.log(`   · ${ref}  (${dim})  ${alt && `«${alt}»`}`);
  }
  if (!args['omitir-faltantes']) {
    console.error('\n✗ Consigue esos archivos, o repite con --omitir-faltantes si son decorativos.');
    console.error('  Mira el tamaño y el alt de arriba antes de decidir: si es una figura grande, es contenido.');
    process.exit(1);
  }
  // se quita la <figure> entera cuando la envuelve; si no, sólo la <img>
  for (const ref of ausentes) {
    const esc = ref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp(`<figure class="pdf-image"[^>]*>\\s*<img src="${esc}"[^>]*>\\s*</figure>`, 'g'), '');
    html = html.replace(new RegExp(`<img[^>]*src="${esc}"[^>]*>`, 'g'), '');
  }
  console.log(`✓ ${ausentes.length} figura(s) ausente(s) retirada(s) del documento`);
}

// aspecto: se corrige por el ancho — cambiar el alto empujaría la figura
// contra el texto de abajo, que está en coordenada fija.
//
// Las dos variantes anotan la caja distinto, así que primero se normaliza a
// una lista { ref, w, h, u (unidad), literal } y a partir de ahí el criterio
// es el mismo.
const cajas = [];
if (VARIANTE === 'layers') {
  const srcDe = new Map([...html.matchAll(/data-image="([^"]+)"[\s\S]{0,400}?src="([^"]+)"/g)].map(m => [m[1], m[2]]));
  for (const c of html.matchAll(/data-image="([^"]+)"[^>]*style="left:([\d.]+)px;top:([\d.]+)px;width:([\d.]+)px;height:([\d.]+)px"/g)) {
    const ref = srcDe.get(c[1]);
    if (ref) cajas.push({ id: c[1], ref, w: +c[4], h: +c[5], u: 'px' });
  }
} else {
  /* No hay data-image al que referirse, así que el id del log es el archivo.
     Dos formas conviven dentro de esta variante y hay que cubrir las dos:
       · la <img> lleva su propia caja      → <img class="pdf-image" style="…">
       · la envuelve un <figure> con la caja → <figure class="pdf-image" style="…"><img …>
     La segunda pone el `style` ANTES del `src`, así que no vale un solo regex. */
  const N = String.raw`[\d.]+`, UU = '(?:pt|px)';
  for (const c of html.matchAll(
    new RegExp(`<img class="pdf-image" src="([^"]+)"[^>]*style="left:${N}${UU};top:${N}${UU};width:(${N})${UU};height:(${N})${UU};?"`, 'g'))) {
    cajas.push({ id: c[1].split('/').pop(), ref: c[1], w: +c[2], h: +c[3], u: U });
  }
  for (const c of html.matchAll(
    new RegExp(`<figure class="pdf-image" style="left:${N}${UU};top:${N}${UU};width:(${N})${UU};height:(${N})${UU};?"[^>]*>\\s*<img src="([^"]+)"`, 'g'))) {
    cajas.push({ id: c[3].split('/').pop(), ref: c[3], w: +c[1], h: +c[2], u: U });
  }
}

let corregidas = 0;
for (const c of cajas) {
  const ref = renombres.get(c.ref) ?? c.ref;
  if (!existsSync(join(dir, ref))) continue;
  const meta = await sharp(join(dir, ref)).metadata();
  const desvio = ((meta.width / meta.height) / (c.w / c.h) - 1) * 100;
  if (Math.abs(desvio) <= DESVIO_MAX) continue;
  const wOk = Math.round(c.h * (meta.width / meta.height));
  html = html.replace(`width:${c.w.toFixed(2)}${c.u};height:${c.h.toFixed(2)}${c.u}`,
                      `width:${wOk.toFixed(2)}${c.u};height:${c.h.toFixed(2)}${c.u}`);
  html = html.replace(`width:${c.w.toFixed(3)}${c.u};height:${c.h.toFixed(3)}${c.u}`,
                      `width:${wOk.toFixed(3)}${c.u};height:${c.h.toFixed(3)}${c.u}`);
  console.log(`✓ figura ${c.id}: ancho ${c.w} → ${wOk}${c.u}  (deformaba ${desvio.toFixed(1)}%)`);
  corregidas++;
}

// red de seguridad para los desvíos por debajo del umbral
html = html.replace(/object-fit:fill/g, 'object-fit:contain');

// el resaltador se extrae OPACO y tapa el texto; multiply lo devuelve a
// comportarse como rotulador. Se aplica en el CSS del módulo, pero también
// aquí por si el fragmento se abriera suelto.
const tieneMultiply = /mix-blend-mode/.test(html);

// ─── 5. reducir a fragmento ──────────────────────────────────────────────
// Fuera <head>, el <style> global (html/body/* pisarían el dashboard: los
// estilos los pone resumenHtml.module.css) y el <script> del fit() (no se
// ejecuta con dangerouslySetInnerHTML; el escalado lo hace el visor en React).
/* La etiqueta que lleva la página se LEE del documento en vez de asumirse: la
   variante «pdf-page» la trae en un <section> y la «native-line» en un
   <article> con id, y hardcodear una hacía abortar a la otra. */
const CLASE_PAGINA = VARIANTE === 'layers' ? 'page' : 'pdf-page';
// article, section, div y main: cada export elige la suya y ya han salido las
// cuatro. Se lee del documento en vez de asumirla.
const mAbre = html.match(new RegExp(`<(article|section|div|main)\\b[^>]*class="[^"]*\\b${CLASE_PAGINA}\\b[^"]*"[^>]*>`));
if (!mAbre) { console.error(`✗ No encontré el elemento con class="${CLASE_PAGINA}".`); process.exit(1); }
const TAG = mAbre[1];
const ini = mAbre.index;
const fin = html.indexOf(`</${TAG}>`, ini);
if (fin === -1) { console.error(`✗ No encontré el cierre </${TAG}> de la página.`); process.exit(1); }
let page = html.slice(ini, fin + `</${TAG}>`.length);

// El visor localiza la página por la clase `.page` para escalarla; la variante
// «pdf-page» no la trae, así que se le añade sin quitarle la suya (de la que
// cuelgan los estilos propios de esa variante en el CSS module).
if (VARIANTE !== 'layers') page = page.replace(/class="([^"]*\bpdf-page\b[^"]*)"/, 'class="page $1"');

/* ── Recorte por franja: --recorte y0:y1 ─────────────────────────────────
 *
 * Un export puede traer DOS clases en la misma página (el de T2 llevaba la
 * teórica y el taller, 10 486 px seguidos). Publicarlo entero en las dos
 * actividades obligaría al alumno a buscar su mitad, así que se corta.
 *
 * El corte es por coordenada, no por marcador: en este formato no hay
 * estructura que separe una sección de otra —todo son cajas absolutas—, así
 * que lo único fiable es la geometría. Hay que elegir la y en un hueco real
 * (mirar dónde acaba la última figura de arriba y dónde empieza el título de
 * abajo) o se parte un elemento por la mitad.
 *
 * Cada caja se desplaza restando y0 y se descarta si no toca la franja. Las
 * capas a página completa (tinta, resaltador) son la excepción: NO se
 * recortan ni se reescalan —deformarían el trazo—, se dejan a su tamaño
 * original con un `top` negativo, y el `overflow:hidden` de la página se
 * encarga del resto. Es también lo más barato: el mismo SVG sirve para las
 * dos mitades. */
const CAPA_COMPLETA = /\b(?:ink-layer|ink|annotation-layer|marks-bg|vector-bg|vector-ink|vector-layer)\b/;

if (args.recorte) {
  const m = /^([\d.]+):([\d.]+)$/.exec(args.recorte);
  if (!m) { console.error('✗ --recorte espera y0:y1 (en px de la página), p. ej. 0:8715'); process.exit(1); }
  const [y0, y1] = [+m[1], +m[2]];
  if (!(y1 > y0)) { console.error('✗ --recorte: y1 debe ser mayor que y0.'); process.exit(1); }

  const ALTO_ORIG = +PAGE_H;
  const topDe = (tag) => parseFloat(tag.match(/[;"\s]top:\s*(-?[\d.]+)/)?.[1] ?? 'NaN');
  const altoDe = (tag) => parseFloat(tag.match(/[;"\s]height:\s*(-?[\d.]+)/)?.[1] ?? '0');
  let dentro = 0, fuera = 0, capas = 0;

  // elementos con contenido (figuras y bloques de texto) + imágenes sueltas
  const RE_ELEM = /<(figure|p|div|h[1-6]|section|span)\b[^>]*style="[^"]*top:[^"]*"[^>]*>[\s\S]*?<\/\1>|<img\b[^>]*>/g;
  page = page.replace(RE_ELEM, (el) => {
    const abre = el.slice(0, el.indexOf('>') + 1);

    if (CAPA_COMPLETA.test(abre.match(/class="([^"]*)"/)?.[1] ?? '')) {
      capas++;
      const estilo = `left:0;top:${-y0}px;width:${PAGE_W}px;height:${ALTO_ORIG}px`;
      return /style="/.test(abre)
        ? el.replace(/style="[^"]*"/, `style="${estilo}"`)
        : el.replace('<img', `<img style="${estilo}"`);
    }

    const t = topDe(abre);
    if (Number.isNaN(t)) return el;                 // sin posición: no es del layout
    if (t + altoDe(abre) <= y0 || t >= y1) { fuera++; return ''; }
    dentro++;
    return el.replace(/([;"\s]top:\s*)(-?[\d.]+)/, (_, p, v) => `${p}${(+v - y0).toFixed(3)}`);
  });

  PAGE_H = (y1 - y0).toFixed(3);
  console.log(`✂ recorte ${y0}–${y1}: ${dentro} elementos conservados, ${fuera} descartados, ${capas} capa(s) a página completa desplazada(s)`);
  console.log(`  página recortada: ${(+PAGE_W).toFixed(0)} × ${(+PAGE_H).toFixed(0)} px`);
}

// ─── 3. Supabase ─────────────────────────────────────────────────────────
const URL = config.NEXT_PUBLIC_SUPABASE_URL;
const KEY = config.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error('Faltan credenciales en .env.local'); process.exit(1); }
const sb = createClient(URL, KEY, { auth: { persistSession: false } });
const BASE_PUB = `${URL}/storage/v1/object/public/${BUCKET_IMG}`;

// ─── 4. subir los assets ─────────────────────────────────────────────────
// Ya son AVIF: se suben tal cual. Recomprimir un AVIF sería una segunda
// pérdida sobre un formato que ya es lossy.
/* La lista sale de la PÁGINA ya recortada, no del HTML completo: al partir un
   documento en dos, cada mitad debe llevarse sólo sus figuras. Si se calculara
   sobre el html, cada mitad subiría también las de la otra — en el T2 eran
   1,6 MB duplicados en el bucket por nada.
   Las texturas van en la misma lista aunque no aparezcan en el HTML: el href
   relativo del SVG las busca en su propia carpeta del CDN. */
const assets = [...new Set([...[...page.matchAll(RE_ASSET)].map(m => m[1]), ...texturas])];
let bytes = 0, subidas = 0;
const fallos = [];

/* Atenuar los resaltados que viajan DENTRO de un SVG de capa.
 *
 * Cuando la tinta y el resaltador vienen en archivos separados (`marks-bg` +
 * `ink`) basta con bajarle la opacidad a la capa entera desde el CSS. Pero hay
 * exports que los mezclan en un único `vectors.svg`, y ahí el CSS no puede
 * distinguirlos: atenuar la capa apagaría también las flechas y los círculos
 * dibujados a mano, que deben quedar nítidos.
 *
 * Se separan por su geometría, que es inequívoca: un resaltado es un
 * **rectángulo** (sólo M/H/V/L/Z y pocos comandos), mientras que un trazo de
 * rotulador son decenas o cientos de puntos. En Te4: 6 rectángulos frente a
 * 122 trazos.
 *
 * Aquí sí se reescribe el asset, a diferencia de las figuras: la regla de
 * subirlos tal cual existe para no recomprimir un AVIF —que sería una segunda
 * pérdida sobre un formato lossy—, y un SVG es texto. Añadir un atributo no
 * degrada nada y es idempotente. */
/* Un resaltado puede venir como <path> con forma de rectángulo (Te4) o como
   <rect> de verdad (Taller 3), así que se miran los dos.
 *
 * Y la opacidad no es una sola. Lo normal es 0.45, que deja el color a la
 * vista sin aplastar la letra. Pero hay conversores que **pierden el color
 * del resaltador y lo escriben en negro**: en el Taller 3 son 12 rectángulos
 * `#000000` a opacidad plena, alineados uno a uno con líneas del enunciado
 * (18 px de alto, partidos donde la selección soltaba). Un resaltado negro no
 * existe; es un color perdido, no una intención. Al 0.45 seguiría siendo un
 * gris medio bajo texto negro —ilegible—, así que a los oscuros se les da una
 * opacidad mucho menor: quedan como un sombreado que dice «esta línea estaba
 * resaltada» sin tapar nada y sin inventar un color que no consta. */
const LUMA_OSCURO = 0.4;
const luma = (hex) => {
  const m = /^#([0-9a-f]{6})$/i.exec(hex ?? '');
  if (!m) return 1;
  const n = parseInt(m[1], 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
};

const svgAtenuado = new Map();
for (const ref of assets.filter(r => /\.svg$/i.test(r))) {
  // parte del ya reescrito si le quitamos texturas ausentes, no del de disco
  const original = svgReescrito.get(ref) ?? readFileSync(join(dir, ref), 'utf8');
  let tocados = 0, oscuros = 0;
  const atenuar = (tag) => {
    if (/fill="none"/.test(tag)) return tag;              // no pinta nada
    if (!/fill-opacity="1(\.0+)?"/.test(tag)) return tag; // ya venía translúcido
    const fill = tag.match(/fill="(#[0-9a-fA-F]{6})"/)?.[1];
    const oscuro = luma(fill) < LUMA_OSCURO;
    if (oscuro) oscuros++;
    tocados++;
    return tag.replace(/fill-opacity="1(\.0+)?"/, `fill-opacity="${oscuro ? '0.15' : '0.45'}"`);
  };

  /* Si el archivo es SÓLO de resaltado no hay nada que discriminar: todo lo
     que hay dentro es resaltado y se atenúa entero, trazos a mano incluidos
     (en el Taller 3, 3 barridos de rotulador amarillo que la heurística
     geométrica habría dejado a opacidad plena). La discriminación por
     geometría hace falta únicamente cuando tinta y resaltado comparten
     archivo, que es el caso de un `vectors.svg` único. */
  const soloResaltado = /marks?-?bg|highlight/i.test(ref);

  let out = original.replace(/<path\b[^>]*\/>/g, (tag) => {
    const d = tag.match(/\bd="([^"]+)"/)?.[1];
    if (!d) return tag;
    // Un resaltado es un rectángulo (sólo M/H/V/L/Z y pocos comandos); un
    // trazo de rotulador son decenas o cientos de puntos y se deja intacto.
    const esRectangulo = !/[CcSsQqTtAa]/.test(d) && (d.match(/[A-Za-z]/g) ?? []).length <= 6;
    return soloResaltado || esRectangulo ? atenuar(tag) : tag;
  });
  out = out.replace(/<rect\b[^>]*\/>/g, (tag) => atenuar(tag));

  if (tocados || svgReescrito.has(ref)) {
    svgAtenuado.set(ref, Buffer.from(out, 'utf8'));
  }
  if (tocados) {
    console.log(`✓ ${ref}: ${tocados} resaltado(s) atenuado(s)${oscuros ? ` — ${oscuros} venían en un color OSCURO (color perdido por el conversor): van al 15 % para no tapar la letra` : ''}; la tinta queda intacta`);
  }
}

console.log(`\nassets : ${assets.length}`);
for (const ref of assets) {
  const p = join(dir, ref);
  const buf = svgAtenuado.get(ref) ?? readFileSync(p);
  bytes += buf.length;
  const dest = `${PREFIX}/${ref.split('/').pop()}`;
  if (dry) { subidas++; continue; }
  const ext = ref.split('.').pop().toLowerCase();
  const mime = ext === 'avif' ? 'image/avif' : ext === 'png' ? 'image/png'
             : ext === 'webp' ? 'image/webp' : ext === 'svg' ? 'image/svg+xml' : 'image/jpeg';
  const { error } = await sb.storage.from(BUCKET_IMG).upload(dest, buf, {
    contentType: mime,
    cacheControl: '31536000, immutable',  // una figura no se reedita
    upsert: Boolean(force),
  });
  if (error) fallos.push(`${dest}: ${error.message}`);
  else subidas++;
  process.stdout.write(`\r  subidos: ${subidas}/${assets.length}`);
}
console.log(`\r  subidos: ${subidas}/${assets.length}   ${kb(bytes)}`);
if (fallos.length) {
  console.error(`\n✗ ${fallos.length} fallos:`);
  fallos.slice(0, 10).forEach(f => console.error('   ' + f));
  if (!force) console.error('\n  Si lo estás actualizando, repite con --force.');
  process.exit(1);
}

// rutas locales → CDN público
let body = page.replace(RE_ASSET, (_, p) => `src="${BASE_PUB}/${PREFIX}/${p.split('/').pop()}"`);

// Carga diferida de las figuras. Dos exclusiones:
//  - las capas a página completa (tinta y resaltador): cubren el documento
//    entero y hacen falta desde el primer scroll, así que diferirlas sólo
//    retrasaría lo inevitable;
//  - las que ya traen `loading`: el export suele ponerlo, y añadirlo otra vez
//    deja el atributo duplicado (el navegador se queda con el primero, pero
//    es markup sucio que además engaña al contar figuras diferidas).
body = body.replace(/<img (?!class="(?:ink|vector-ink|vector-bg|vector-layer)")(?![^>]*\bloading=)/g,
                    '<img loading="lazy" decoding="async" ');

/* El <style> del documento, sólo en las variantes que el proyecto no conoce.
 *
 * Las cuatro variantes catalogadas tienen su vocabulario en
 * `resumenHtml.module.css` por historia, y ahí se queda: reinyectarles su
 * estilo cambiaría documentos ya publicados sin necesidad (y devolvería, por
 * ejemplo, el `overflow:hidden` que se come la sombra del hover).
 *
 * Pero enseñarle al proyecto el vocabulario de cada export nuevo no escala —el
 * Taller 5 traía `.txt`, `.external`, `.sheet`, `.s1`–`.s4`, `.sheet-table`…, y
 * las posiciones de sus cuatro hojas son suyas, no de un envase—. Así que una
 * variante desconocida viaja con su propia hoja de estilo, saneada: fuera lo
 * global, y fuera también **lo que gobierna la página y el escalado**, que es
 * responsabilidad del visor. Sin ese segundo recorte, un `.pdf-page` del
 * documento (position:relative, alto fijo) empataría en especificidad con la
 * regla del module y ganaría por ir después, dejando el documento sin escalar. */
const RECORTAR = /(^|\s)(\.pdf-page|\.page|\.page-shell|\.stage-holder|\.viewport|\.viewer|\.capas)(\s|$|[.:])/;
let estilo = '';
if (VARIANTE === 'estilo-propio') {
  const crudo = estilosDe(html);
  estilo = sanearCss(crudo, { prefijo: '.capas', descartar: RECORTAR });
  if (!estilo) {
    console.error('✗ Variante desconocida y su <style> quedó vacío al sanearlo: no hay con qué maquetarlo.');
    process.exit(1);
  }
  console.log(`estilo : ${kb(Buffer.byteLength(crudo, 'utf8'))} → ${kb(Buffer.byteLength(estilo, 'utf8'))} saneado y prefijado con .capas`);
}

// el wrapper lleva las medidas de ESTE documento; el resto del estilo es
// común y vive en el CSS module (o viaja aquí, si la variante es nueva).
const frag = `<div class="capas" style="--page-w:${PAGE_W}px;--page-h:${PAGE_H}px">`
           + (estilo ? `<style>${estilo}</style>` : '')
           + `<div class="page-shell">${body}</div></div>`;

const quedan = (frag.match(/src="(?!https:\/\/)/g) || []).length;
if (quedan) { console.error(`✗ Quedaron ${quedan} rutas locales sin reapuntar.`); process.exit(1); }

console.log(`\nfragmento: ${kb(Buffer.byteLength(frag, 'utf8'))}  ·  ${assets.length} assets  ·  ${corregidas} figuras corregidas  ·  tinta ${tieneMultiply ? 'ya con' : 'sin'} multiply en el HTML (la pone el CSS)`);

// ─── 6. subir el fragmento ───────────────────────────────────────────────
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
      ALLOWED     → añadir '${id}'
      FILE_ALIAS  → '${id}': '${curso}/${id}'

 2. src/lib/data/${curso}.ts — en la actividad:
      resumen: {
        tipo: 'pdf',
        formato: 'html',
        opciones: [{ id: '${id}', label: 'Resumen', formato: 'html' }],
      },

 3. La página del curso debe pasar resumenFormato y resumenTitulo.
`);
