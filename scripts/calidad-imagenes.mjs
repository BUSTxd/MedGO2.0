/**
 * Calidad real de imágenes, sin fiarse de sus dimensiones.
 *
 * Una imagen puede declarar 2000 px y tener el detalle de una de 500 (fue
 * agrandada), estar pixelada o venir de un JPEG muy comprimido. Este script lo
 * mide con cálculos sobre los píxeles: no manda nada a ninguna IA.
 *
 *   1. Resolución real: achica y reagranda la imagen a varias escalas; la menor
 *      escala que no pierde detalle (energía del laplaciano) es su resolución real.
 *   2. Pixelado: columnas/filas idénticas a su vecina (agrandada «a lo bruto»).
 *   3. Compresión: salto de diferencias en la rejilla de 8 px del JPEG.
 *   4. Desenfoque: ancho, en px, de los bordes más nítidos de la imagen.
 *
 * Uso:
 *   node scripts/calidad-imagenes.mjs --dir "<carpeta>"            (recursivo)
 *   node scripts/calidad-imagenes.mjs --bucket resumenes-img --prefijo digestivo/
 *
 * Flags: --peores N (filas a listar, 20 por defecto; «todas» lista todas)
 *        --salida <carpeta> (por defecto, una carpeta temporal del sistema)
 *
 * Deja en la salida `informe.json` (todas) y `peores.html` (hoja para mirar a
 * ojo las peores). Nunca escribe dentro de la carpeta analizada: el export de
 * Notion debe seguir teniendo un solo .html para upload-resumen-html.mjs.
 */

import { readdirSync, statSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, relative, resolve, extname, dirname } from 'path';
import { tmpdir } from 'os';
import { pathToFileURL } from 'url';
import sharp from 'sharp';

// ─── argumentos ──────────────────────────────────────────────────────────
const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith('--')) continue;
  const next = process.argv[i + 1];
  if (!next || next.startsWith('--')) args[a.slice(2)] = true;
  else { args[a.slice(2)] = next; i++; }
}
if (!args.dir && !args.bucket) {
  console.error('Uso:\n  node scripts/calidad-imagenes.mjs --dir <carpeta> [--peores N] [--salida <carpeta>]\n  node scripts/calidad-imagenes.mjs --bucket <bucket> [--prefijo <ruta/>] [--peores N]');
  process.exit(1);
}
const PEORES = args.peores === 'todas' ? Infinity : Number(args.peores ?? 20);
const SALIDA = resolve(args.salida ?? join(tmpdir(), 'medgo-calidad-imagenes', new Date().toISOString().replace(/[:.]/g, '-')));
mkdirSync(SALIDA, { recursive: true });

const EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.tif', '.tiff']);
const MAX_LADO = 3000;      // recorte central para no tardar con láminas enormes
const MIN_LADO = 64;

// ─── 0. reunir archivos ──────────────────────────────────────────────────
async function archivosLocales(dir) {
  const out = [];
  const rec = (d) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) rec(p);
      else if (EXT.has(extname(f).toLowerCase())) out.push({ ruta: p, nombre: relative(dir, p) });
    }
  };
  rec(dir);
  return out;
}

async function archivosDeBucket(bucket, prefijo = '') {
  const { createClient } = await import('@supabase/supabase-js');
  const { config } = await import('./load-env.mjs');
  const sb = createClient(config.NEXT_PUBLIC_SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const destino = join(SALIDA, 'descargas');
  const out = [];
  const rec = async (ruta) => {
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await sb.storage.from(bucket).list(ruta, { limit: 1000, offset });
      if (error) throw new Error(`${bucket}/${ruta}: ${error.message}`);
      for (const it of data) {
        const p = ruta ? `${ruta}/${it.name}` : it.name;
        if (!it.id) { await rec(p); continue; }            // carpeta
        if (!EXT.has(extname(it.name).toLowerCase())) continue;
        const { data: blob, error: e2 } = await sb.storage.from(bucket).download(p);
        if (e2) { console.error(`  ✗ ${p}: ${e2.message}`); continue; }
        const local = join(destino, p);
        mkdirSync(dirname(local), { recursive: true });
        writeFileSync(local, Buffer.from(await blob.arrayBuffer()));
        out.push({ ruta: local, nombre: `${bucket}/${p}` });
      }
      if (data.length < 1000) break;
    }
  };
  await rec(prefijo.replace(/\/+$/, ''));
  return out;
}

// ─── utilidades de imagen ────────────────────────────────────────────────
async function gris(ruta) {
  let img = sharp(ruta, { failOn: 'none' }).flatten({ background: '#ffffff' });
  const meta = await sharp(ruta, { failOn: 'none' }).metadata();
  const W0 = meta.width, H0 = meta.height;
  let recorte = false;
  if (W0 > MAX_LADO || H0 > MAX_LADO) {
    const w = Math.min(W0, MAX_LADO), h = Math.min(H0, MAX_LADO);
    img = img.extract({ left: Math.floor((W0 - w) / 2), top: Math.floor((H0 - h) / 2), width: w, height: h });
    recorte = true;
  }
  const { data, info } = await img.toColourspace('b-w').raw().toBuffer({ resolveWithObject: true });
  let px = data;
  if (info.channels > 1) {
    px = new Uint8Array(info.width * info.height);
    for (let i = 0; i < px.length; i++) px[i] = data[i * info.channels];
  }
  return { px, W: info.width, H: info.height, W0, H0, formato: meta.format, recorte };
}

// FFT radix-2 en el sitio (re, im de longitud potencia de 2).
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = a + len / 2;
        const tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
      }
    }
  }
}

// Espectro de potencia medio de líneas (filas o columnas) con ventana de Hann.
function espectro(px, W, H, eje) {
  const largo = eje === 'x' ? W : H, lineas = eje === 'x' ? H : W;
  let N = 1; while (N * 2 <= Math.min(largo, 1024)) N *= 2;
  const ini = Math.floor((largo - N) / 2);
  const paso = Math.max(1, Math.floor(lineas / 384));
  const hann = Float64Array.from({ length: N }, (_, i) => 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1)));
  const P = new Float64Array(N / 2 + 1);
  const re = new Float64Array(N), im = new Float64Array(N);
  let n = 0;
  for (let l = 0; l < lineas; l += paso) {
    let media = 0;
    for (let i = 0; i < N; i++) { re[i] = eje === 'x' ? px[l * W + ini + i] : px[(ini + i) * W + l]; media += re[i]; }
    media /= N;
    for (let i = 0; i < N; i++) { re[i] = (re[i] - media) * hann[i]; im[i] = 0; }
    fft(re, im);
    for (let k = 0; k <= N / 2; k++) P[k] += (re[k] * re[k] + im[k] * im[k]) / N;
    n++;
  }
  for (let k = 0; k <= N / 2; k++) P[k] /= n;
  return { P, N };
}

// 1. Resolución real: hasta qué frecuencia llega el detalle. Se pondera el
//    espectro por f² (espectro del gradiente): en una imagen nítida es casi
//    plano hasta Nyquist; en una agrandada ×k se apaga en 1/k. El factor es la
//    frecuencia (fracción de Nyquist) que acumula el 90 % de esa energía.
function resolucionReal(px, W, H) {
  const ejes = ['x', 'y'].map((eje) => {
    const { P, N } = espectro(px, W, H, eje);
    const piso = 0.375 * 2 / 12;          // ruido de cuantización de 8 bits × Hann, con margen
    const g = [];
    let total = 0;
    for (let k = 1; k <= N / 2; k++) { const v = (k / N) ** 2 * Math.max(0, P[k] - piso); g.push(v); total += v; }
    if (total < 1e-3) return null;
    let acum = 0;
    for (let k = 0; k < g.length; k++) { acum += g[k]; if (acum >= 0.9 * total) return (k + 1) / g.length; }
    return 1;
  }).filter((v) => v !== null);
  if (!ejes.length) return { factor: null };
  // media de los dos ejes; /0,9 para que un espectro plano dé 1
  return { factor: +Math.min(1, ejes.reduce((a, b) => a + b, 0) / ejes.length / 0.9).toFixed(2) };
}

// Diferencia media entre cada columna (o fila) y la siguiente, y si la columna
// tiene contenido (no es margen liso).
function difVecinas(px, W, H, eje) {
  const N = eje === 'x' ? W : H, M = eje === 'x' ? H : W;
  const at = eje === 'x' ? (a, b) => px[b * W + a] : (a, b) => px[a * W + b];
  const D = new Float64Array(N - 1), conContenido = new Uint8Array(N);
  for (let a = 0; a < N; a++) {
    let lo = 255, hi = 0, s = 0;
    for (let b = 0; b < M; b++) {
      const v = at(a, b);
      if (v < lo) lo = v; if (v > hi) hi = v;
      if (a < N - 1) s += Math.abs(at(a + 1, b) - v);
    }
    conContenido[a] = hi - lo > 8 ? 1 : 0;
    if (a < N - 1) D[a] = s / M;
  }
  return { D, conContenido };
}

// 2. Pixelado: fracción de columnas con contenido idénticas a su vecina.
//    Agrandar ×k «a lo bruto» repite cada columna k veces → fracción (k-1)/k.
function pixelado(px, W, H) {
  const factorEje = (eje) => {
    const { D, conContenido } = difVecinas(px, W, H, eje);
    const validas = [];
    for (let a = 0; a < D.length; a++) if (conContenido[a] || conContenido[a + 1]) validas.push(D[a]);
    if (validas.length < 16) return 1;
    const media = validas.reduce((s, d) => s + d, 0) / validas.length;
    if (media === 0) return 1;
    const frac = validas.filter((d) => d < 0.1 * media).length / validas.length;
    return Math.min(20, 1 / (1 - frac));
  };
  return +Math.min(factorEje('x'), factorEje('y')).toFixed(2);
}

// 3. Compresión: cuánto más salta una sola fase de la rejilla de 8 px que la
//    siguiente más alta. Contra la segunda (no la mediana) para que un patrón
//    cada 2 o 4 px, que deja agrandar ×2 o ×4, no pase por JPEG.
function bloques(px, W, H) {
  const ejes = ['x', 'y'].map((eje) => {
    const { D } = difVecinas(px, W, H, eje);
    const fase = new Float64Array(8), n = new Float64Array(8);
    for (let a = 0; a < D.length; a++) { fase[a % 8] += D[a]; n[a % 8]++; }
    const m = [...fase].map((s, i) => s / n[i]).sort((a, b) => b - a);
    return m[1] > 0.3 ? m[0] / m[1] : 1;            // demasiado lisa: no se puede medir
  });
  return +Math.sqrt(ejes[0] * ejes[1]).toFixed(2);
}

// 4. Desenfoque: ancho típico de los bordes más fuertes (rango local / gradiente).
function anchoBorde(px, W, H) {
  const g = new Uint8Array(W * H);
  const hist = new Uint32Array(256);
  for (let y = 4; y < H - 5; y++) for (let x = 4; x < W - 5; x++) {
    const i = y * W + x;
    const v = Math.max(Math.abs(px[i + 1] - px[i]), Math.abs(px[i + W] - px[i]));
    g[i] = v; hist[v]++;
  }
  // umbral = percentil 99,5 del gradiente, nunca por debajo de 20
  let total = 0; for (const h of hist) total += h;
  let acum = 0, umbral = 255;
  for (let v = 255; v >= 0; v--) { acum += hist[v]; if (acum >= total * 0.005) { umbral = v; break; } }
  umbral = Math.max(umbral, 20);
  const anchos = [];
  for (let y = 4; y < H - 5; y++) for (let x = 4; x < W - 5; x++) {
    const i = y * W + x;
    if (g[i] < umbral) continue;
    // rango a lo largo de la dirección del gradiente (9 px), no en todo el cuadro
    const horiz = Math.abs(px[i + 1] - px[i]) >= Math.abs(px[i + W] - px[i]);
    const paso = horiz ? 1 : W;
    let lo = 255, hi = 0;
    for (let k = -4; k <= 5; k++) { const v = px[i + k * paso]; if (v < lo) lo = v; if (v > hi) hi = v; }
    anchos.push((hi - lo) / g[i]);
    if (anchos.length > 200000) break;
  }
  if (anchos.length < 50) return null;
  anchos.sort((a, b) => a - b);
  return +anchos[Math.floor(anchos.length / 2)].toFixed(2);
}

// ─── veredicto ───────────────────────────────────────────────────────────
// Estirada y desenfocada son lo mismo para el ojo (falta detalle fino), así
// que van en un solo motivo; el ancho de borde sólo lo acompaña.
function veredicto(r) {
  const motivos = [];
  let nota = 100 * (r.factor ?? 1);
  const borde = r.anchoBorde !== null && r.anchoBorde >= 2 ? `, bordes de ${r.anchoBorde} px` : '';
  if (r.pixelado >= 1.5) motivos.push(`pixelada ×${r.pixelado}: detalle de ~${r.ladoReal} px`);
  else if (r.factor !== null && r.factor <= 0.5) motivos.push(`estirada o desenfocada: detalle de ~${r.ladoReal} px${borde}`);
  else if (r.factor !== null && r.factor <= 0.75) motivos.push(`algo estirada o blanda: detalle de ~${r.ladoReal} px${borde}`);
  if (r.bloques >= 1.5) { motivos.push('compresión JPEG fuerte'); nota -= 25; }
  else if (r.bloques >= 1.2) { motivos.push('compresión JPEG visible'); nota -= 10; }
  if (r.factor === null) motivos.push('casi lisa: no se puede medir');
  return { nota: Math.max(0, Math.round(nota)), motivos };
}

// ─── principal ───────────────────────────────────────────────────────────
const archivos = args.dir ? await archivosLocales(args.dir) : await archivosDeBucket(args.bucket, args.prefijo ?? '');
if (!archivos.length) { console.error('No encontré imágenes.'); process.exit(1); }
console.log(`Analizando ${archivos.length} imágenes…`);

const resultados = [];
for (const [n, a] of archivos.entries()) {
  try {
    const { px, W, H, W0, H0, formato, recorte } = await gris(a.ruta);
    if (Math.min(W, H) < MIN_LADO) { resultados.push({ ...a, W: W0, H: H0, omitida: 'demasiado pequeña' }); continue; }
    const espectral = resolucionReal(px, W, H).factor;
    const pix = pixelado(px, W, H);
    // pixelada ×k: los bloques dan espectro alto, pero el detalle real es 1/k
    const factor = espectral === null ? null : +Math.min(espectral, 1 / pix).toFixed(2);
    const r = {
      ...a, formato, W: W0, H: H0, recorte,
      factor, ladoReal: factor === null ? null : Math.round(Math.max(W0, H0) * factor),
      pixelado: pix, bloques: bloques(px, W, H), anchoBorde: anchoBorde(px, W, H),
    };
    resultados.push({ ...r, ...veredicto(r) });
  } catch (e) {
    resultados.push({ ...a, omitida: `no se pudo leer: ${e.message}` });
  }
  if ((n + 1) % 25 === 0) console.log(`  ${n + 1}/${archivos.length}`);
}

const medidas = resultados.filter((r) => !r.omitida).sort((a, b) => a.nota - b.nota || (a.ladoReal ?? 0) - (b.ladoReal ?? 0));
const omitidas = resultados.filter((r) => r.omitida);

writeFileSync(join(SALIDA, 'informe.json'), JSON.stringify({ origen: args.dir ?? `${args.bucket}/${args.prefijo ?? ''}`, medidas, omitidas }, null, 2));

const peores = medidas.slice(0, PEORES);
const corto = (s, n) => (s.length > n ? '…' + s.slice(-(n - 1)) : s);
console.log(`\nNota 0-100 (100 = usa todos sus píxeles). De peor a mejor${Number.isFinite(PEORES) ? `, las ${peores.length} peores` : ''}:\n`);
console.log('nota  declarada    real    archivo  →  motivo');
for (const r of peores) {
  console.log(`${String(r.nota).padStart(4)}  ${`${r.W}×${r.H}`.padEnd(11)} ${String(r.ladoReal ?? '—').padStart(5)}  ${corto(r.nombre, 60)}  →  ${r.motivos.join(' · ') || 'bien'}`);
}
const malas = medidas.filter((r) => r.motivos.length && !r.motivos[0].startsWith('casi lisa')).length;
console.log(`\n${malas} de ${medidas.length} con algún problema · ${omitidas.length} omitidas`);

// hoja para mirar a ojo (la abre BUST, no la IA)
const filas = peores.map((r) => `
  <figure><a href="${pathToFileURL(r.ruta)}"><img src="${pathToFileURL(r.ruta)}" loading="lazy"></a>
  <figcaption><b>${r.nota}</b> · ${r.W}×${r.H} → real ~${r.ladoReal ?? '—'} px<br>${r.motivos.join(' · ') || 'bien'}<br><small>${r.nombre}</small></figcaption></figure>`).join('');
writeFileSync(join(SALIDA, 'peores.html'), `<!doctype html><meta charset="utf-8"><title>Peores imágenes</title>
<style>
  :root{color-scheme:light dark;--bg:#f6f6fa;--fg:#1a1a2e;--card:#fff}
  @media (prefers-color-scheme:dark){:root{--bg:#08061a;--fg:#f0eeff;--card:#16143a}}
  body{margin:0;padding:16px;background:var(--bg);color:var(--fg);font:14px/1.4 system-ui,sans-serif}
  main{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
  figure{margin:0;background:var(--card);border-radius:10px;overflow:hidden}
  img{width:100%;height:260px;object-fit:contain;background:#fff;image-rendering:auto}
  figcaption{padding:8px 10px} small{opacity:.65;word-break:break-all}
</style><h1>Peores imágenes (${peores.length} de ${medidas.length})</h1><main>${filas}</main>`);

console.log(`\nInforme: ${join(SALIDA, 'informe.json')}\nHoja para mirar: ${join(SALIDA, 'peores.html')}`);
