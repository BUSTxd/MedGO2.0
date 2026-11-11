/**
 * Manda un export a la web medgo-imgflow de BUST y trae lo que ella devuelve.
 *
 * La web es la que hace el trabajo, con su propio código (canvas del navegador
 * para achicar a 700 KB, subida firmada a Cloudinary, f_avif + q_auto:low,
 * reescritura del HTML y ZIP). Este script solo la maneja: abre Edge sin
 * ventana con un perfil temporal, le pone las credenciales de Cloudinary de
 * C:\Users\BUST\medgo-imgflow\.env.local (nunca se imprimen y el perfil se
 * borra al terminar), le pasa el ZIP, pulsa «Descargar ZIP» y lo descomprime.
 *
 * Uso: node scripts/imagenes/imgflow.mjs --dir "<export>" [--salida <carpeta>] [--url <web>] [--objetivo 700]
 *   --objetivo: el «Reducir a … KB» de la web (por defecto 700, el de la web).
 *   - arma <nombre>.zip con el HTML y las imágenes del export (sin .avif sueltos)
 *   - el ZIP convertido queda en Descargas y se descomprime en --salida
 *     (por defecto «Descargas/<nombre> (imgflow)»). Imprime la carpeta con el HTML.
 */

import { spawn } from 'child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, copyFileSync } from 'fs';
import { join, basename, extname, resolve } from 'path';
import { homedir, tmpdir } from 'os';

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith('--')) continue;
  const next = process.argv[i + 1];
  if (!next || next.startsWith('--')) args[a.slice(2)] = true;
  else { args[a.slice(2)] = next; i++; }
}
if (!args.dir || !existsSync(args.dir)) { console.error('Falta --dir <carpeta del export>'); process.exit(1); }

const URL_WEB = args.url ?? 'https://bustxd.github.io/medgo-imgflow/';
const OBJETIVO_KB = Math.max(50, Number(args.objetivo ?? 700));   // «Reducir a … KB» de la web
const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe']
  .find((p) => existsSync(p));
if (!EDGE) { console.error('No encuentro Microsoft Edge.'); process.exit(1); }
const DESCARGAS = join(homedir(), 'Downloads');
// El tar de Windows (bsdtar): desde Git Bash, «tar» es el GNU de MSYS, que lee «C:» como un
// servidor remoto («Cannot connect to C: resolve failed») y no sabe hacer .zip con -a.
const TAR = [join(process.env.SystemRoot ?? 'C:/Windows', 'System32', 'tar.exe')].find((p) => existsSync(p)) ?? 'tar';
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const correr = (cmd, argv) => new Promise((ok, mal) => {
  const p = spawn(cmd, argv, { stdio: ['ignore', 'pipe', 'pipe'] });
  let err = ''; p.stderr.on('data', (d) => { err += d; });
  p.on('close', (c) => (c === 0 ? ok() : mal(new Error(`${cmd} salió con ${c}: ${err.slice(-400)}`))));
});

// ─── credenciales (de medgo-imgflow/.env.local) ──────────────────────────
const env = Object.fromEntries(readFileSync(join(homedir(), 'medgo-imgflow', '.env.local'), 'utf8').split(/\r?\n/)
  .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)).filter(Boolean)
  .map(([, k, v]) => [k, v.replace(/^["']|["']$/g, '')]));
const credenciales = { cloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, apiKey: env.NEXT_PUBLIC_CLOUDINARY_API_KEY, apiSecret: env.CLOUDINARY_API_SECRET };
if (!credenciales.cloudName || !credenciales.apiKey || !credenciales.apiSecret) { console.error('Faltan credenciales en medgo-imgflow/.env.local'); process.exit(1); }

// ─── 1. ZIP del export: HTML + imágenes (los .avif sueltos no van) ───────
const nombre = basename(resolve(args.dir)).replace(/\s+[0-9a-f]{32}$/i, '');
const trabajo = join(tmpdir(), `medgo-imgflow-${Date.now()}`);
const carpetaZip = join(trabajo, nombre);
mkdirSync(carpetaZip, { recursive: true });
for (const f of readdirSync(args.dir)) {
  const ext = extname(f).toLowerCase();
  if (['.html', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext) && statSync(join(args.dir, f)).isFile()) copyFileSync(join(args.dir, f), join(carpetaZip, f));
}
const zipEntrada = join(trabajo, `${nombre}.zip`);
await correr(TAR, ['-a', '-cf', zipEntrada, '-C', trabajo, nombre]);
console.log(`ZIP armado: ${(statSync(zipEntrada).size / 1048576).toFixed(1)} MB`);

// ─── 2. Edge sin ventana + DevTools Protocol ─────────────────────────────
const perfil = join(trabajo, 'perfil');
const edge = spawn(EDGE, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${perfil}`,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions', 'about:blank'], { stdio: 'ignore' });
let puerto;
for (let i = 0; i < 100 && !puerto; i++) {
  await dormir(200);
  const f = join(perfil, 'DevToolsActivePort');
  if (existsSync(f)) puerto = readFileSync(f, 'utf8').split('\n')[0].trim();
}
if (!puerto) { edge.kill(); throw new Error('Edge no abrió el puerto de depuración'); }
const { webSocketDebuggerUrl } = await (await fetch(`http://127.0.0.1:${puerto}/json/version`)).json();

const ws = new WebSocket(webSocketDebuggerUrl);
await new Promise((ok, mal) => { ws.onopen = ok; ws.onerror = mal; });
let n = 0;
const pendientes = new Map();
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pendientes.has(d.id)) { const { ok, mal } = pendientes.get(d.id); pendientes.delete(d.id); d.error ? mal(new Error(d.error.message)) : ok(d.result); }
};
const cdp = (method, params = {}, sessionId) => new Promise((ok, mal) => {
  const id = ++n; pendientes.set(id, { ok, mal });
  ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
});

let salida;
try {
  const { targetId } = await cdp('Target.createTarget', { url: 'about:blank' });
  const { sessionId: s } = await cdp('Target.attachToTarget', { targetId, flatten: true });
  const evalua = async (expression) => (await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true }, s)).result.value;
  await cdp('Page.enable', {}, s);
  // baja a una carpeta propia y luego se copia a Descargas: si ya hay un ZIP con
  // ese nombre en Descargas, Edge lo pisa y no se puede saber cuándo llegó el nuevo
  const bajadas = join(trabajo, 'bajadas');
  mkdirSync(bajadas, { recursive: true });
  await cdp('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: bajadas, eventsEnabled: true });

  // credenciales en el localStorage del perfil temporal, y recarga para que la web las lea
  await cdp('Page.navigate', { url: URL_WEB }, s);
  await dormir(3000);
  await evalua(`localStorage.setItem('medgo-imgflow:cloudinary', ${JSON.stringify(JSON.stringify(credenciales))}); true`);
  // el mismo ajuste que el panel de la web («Reducir a … KB»); 700 por defecto
  await evalua(`localStorage.setItem('medgo-imgflow:settings', ${JSON.stringify(JSON.stringify({ format: 'avif', resize: true, targetKB: OBJETIVO_KB }))}); true`);
  await cdp('Page.navigate', { url: URL_WEB }, s);
  for (let i = 0; i < 60 && !(await evalua(`!!document.querySelector('input[accept*="zip"]')`)); i++) await dormir(500);

  // 3. pasarle el ZIP (DOM.setFileInputFiles no tiene límite de tamaño y dispara «change»)
  const { root } = await cdp('DOM.getDocument', { depth: -1 }, s);
  const { nodeId } = await cdp('DOM.querySelector', { nodeId: root.nodeId, selector: 'input[accept*="zip"]' }, s);
  await cdp('DOM.setFileInputFiles', { nodeId, files: [zipEntrada] }, s);
  console.log('Enviado a medgo-imgflow; procesando…');

  // 4. esperar a «Descargar ZIP» (o un error)
  const t0 = Date.now();
  let estado = '';
  while (Date.now() - t0 < 20 * 60 * 1000) {
    await dormir(2000);
    estado = await evalua(`(() => {
      const b = [...document.querySelectorAll('button')].find((x) => /Descargar ZIP/.test(x.textContent));
      if (b) return 'listo';
      const t = document.body.innerText;
      if (/Algo salió mal|No encontré HTML/.test(t)) return 'error: ' + t.slice(0, 300);
      return 'procesando';
    })()`);
    if (estado !== 'procesando') break;
  }
  if (estado !== 'listo') throw new Error(`La web no terminó: ${estado}`);
  const resumen = await evalua(`[...document.querySelectorAll('p')].map((p) => p.innerText).filter((t) => /archivos ·|error|falló|fallaron|copias/i.test(t)).join(' | ')`);
  console.log(`Web: ${resumen}`);

  // 5. descargar el ZIP a Descargas
  await evalua(`[...document.querySelectorAll('button')].find((x) => /Descargar ZIP/.test(x.textContent)).click(); true`);
  let bajado;
  for (let i = 0; i < 300 && !bajado; i++) {
    await dormir(500);
    const f = readdirSync(bajadas).find((x) => x.toLowerCase().endsWith('.zip'));   // sin .crdownload
    if (f) bajado = join(bajadas, f);
  }
  if (!bajado) throw new Error('La web no entregó el ZIP');
  for (let t = -1; ; await dormir(500)) { const s2 = statSync(bajado).size; if (s2 === t && s2 > 0) break; t = s2; }
  const zipSalida = join(DESCARGAS, `${nombre} (imgflow).zip`);
  copyFileSync(bajado, zipSalida);
  console.log(`ZIP de la web: ${zipSalida} (${(statSync(zipSalida).size / 1048576).toFixed(2)} MB)`);

  // 6. descomprimir
  salida = resolve(args.salida ?? join(DESCARGAS, `${nombre} (imgflow)`));
  rmSync(salida, { recursive: true, force: true });
  mkdirSync(salida, { recursive: true });
  await correr(TAR, ['-xf', zipSalida, '-C', salida]);
} finally {
  ws.close();
  edge.kill();
  await dormir(1000);
  rmSync(trabajo, { recursive: true, force: true });       // perfil temporal con las credenciales
}

// carpeta que tiene el HTML (el ZIP puede traer una subcarpeta)
const conHtml = (d) => readdirSync(d).some((f) => f.endsWith('.html')) ? d
  : readdirSync(d).map((f) => join(d, f)).filter((p) => statSync(p).isDirectory()).map(conHtml).find(Boolean);
const final = conHtml(salida);
const avif = readdirSync(final).filter((f) => f.endsWith('.avif'));
const peso = avif.reduce((s, f) => s + statSync(join(final, f)).size, 0);
console.log(`\nListo: ${avif.length} AVIF, ${(peso / 1048576).toFixed(2)} MB\nCarpeta para subir: ${final}`);
