/**
 * Funde en su página principal las subpáginas de un export de Notion.
 *
 *   node scripts/notion-fusionar-subpaginas.mjs --dir "<carpeta con el .html principal>"
 *
 * `upload-resumen-html.mjs` exige un solo `.html` y no sigue enlaces: una
 * página con subpáginas (Notion las exporta como `<figure class="link-to-page">`
 * que apuntan a `<Página>/<Sub> <hash>.html`) llegaría a la web con esos
 * enlaces muertos. Este paso previo cambia cada enlace por el cuerpo de su
 * subpágina:
 *   - su título entra como h1 y sus títulos bajan un nivel (h1→h2, h2→h3,
 *     h3→h4), para que el índice del visor y las secciones de `?seccion=`
 *     sigan la jerarquía de la página principal;
 *   - todas las figuras locales (de la principal y de las subpáginas) se
 *     copian a `figuras/` con nombre ASCII y numerado: Storage no admite
 *     tildes en la clave y cada subpágina trae su propio `image.avif`.
 * Reescribe el `.html` principal en su sitio y guarda el original como
 * `<nombre>.original.html.bak` (con otra extensión, para que la subida siga
 * viendo un solo `.html`).
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith('--')) args[a.slice(2)] = process.argv[i + 1];
}
const dir = args.dir;
if (!dir || !existsSync(dir)) {
  console.error('Uso: node scripts/notion-fusionar-subpaginas.mjs --dir <carpeta>');
  process.exit(1);
}

const htmls = readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.html'));
if (htmls.length !== 1) {
  console.error(`Esperaba 1 .html en la carpeta, hay ${htmls.length}: ${htmls.join(', ')}`);
  process.exit(1);
}
const principal = join(dir, htmls[0]);
let html = readFileSync(principal, 'utf8');

const ENLACE = /<figure[^>]*class="link-to-page"[^>]*>\s*<a href="([^"]+\.html)"[^>]*>([\s\S]*?)<\/a>\s*<\/figure>/g;

/** El cuerpo de la página: lo que va dentro de `<div class="page-body">`. */
function cuerpoDe(sub) {
  const ini = sub.indexOf('<div class="page-body">');
  const fin = sub.lastIndexOf('</article>');
  if (ini < 0 || fin < 0) throw new Error('subpágina sin page-body');
  let c = sub.slice(ini + '<div class="page-body">'.length, fin);
  c = c.replace(/<\/div>\s*$/, ''); // cierre del page-body
  return c;
}

const bajarTitulos = (c) =>
  c.replace(/<(\/?)h([1-3])(\s|>)/g, (_, cierre, n, resto) => `<${cierre}h${Number(n) + 1}${resto}`);

let n = 0;
html = html.replace(ENLACE, (todo, href, titulo) => {
  const ruta = join(dir, decodeURIComponent(href));
  if (!existsSync(ruta)) {
    console.warn(`  ! no existe ${ruta}: el enlace se queda como está`);
    return todo;
  }
  const sub = readFileSync(ruta, 'utf8');
  const base = href.slice(0, href.lastIndexOf('/') + 1); // ya viene codificada
  let cuerpo = bajarTitulos(cuerpoDe(sub));
  cuerpo = cuerpo.replace(/(src|href)="(?!https?:|data:|#|\/)([^"]+)"/g, (_, attr, url) => `${attr}="${base}${url}"`);
  n++;
  const limpio = titulo.replace(/<[^>]+>/g, '').trim();
  console.log(`  + ${limpio}  (${(Buffer.byteLength(cuerpo) / 1024).toFixed(0)} KB)`);
  return `<h1>${limpio}</h1>\n${cuerpo}`;
});

if (!n) {
  console.log('No hay subpáginas que fundir.');
  process.exit(0);
}

// Las carpetas de Notion llevan el título de la página («Bases genéticas…»)
// y Storage rechaza claves con tildes; además cada subpágina tiene su propio
// `image.avif`. Toda figura local se copia a `figuras/NN-<nombre ASCII>`.
mkdirSync(join(dir, 'figuras'), { recursive: true });
const copiadas = new Map();
html = html.replace(/(<(?:img|a)\b[^>]*?(?:src|href)=")(?!https?:|data:|#|\/)([^"]+\.(?:avif|webp|png|jpe?g|gif))"/gi, (_, pre, url) => {
  if (!copiadas.has(url)) {
    const origen = join(dir, decodeURIComponent(url));
    if (!existsSync(origen)) return `${pre}${url}"`;
    const base = decodeURIComponent(url).split('/').pop().normalize('NFD').replace(/[^\w.-]+/g, '-');
    const nombre = `${String(copiadas.size + 1).padStart(2, '0')}-${base}`;
    copyFileSync(origen, join(dir, 'figuras', nombre));
    copiadas.set(url, `figuras/${nombre}`);
  }
  return `${pre}${copiadas.get(url)}"`;
});
console.log(`  ${copiadas.size} figuras copiadas a figuras/`);
const bak = principal.replace(/\.html$/i, '.original.html.bak');
if (!existsSync(bak)) writeFileSync(bak, readFileSync(principal));
writeFileSync(principal, html);
console.log(`\n${n} subpáginas fundidas en ${htmls[0]} (original en ${dirname(bak)}).`);
