/**
 * Revisión SIN navegador del panel de tablas resumen de «Infecciones bacterianas por
 * gramnegativas» (hermano de `vista.mjs`, que pinta las láminas).
 *
 *   node scripts/gramnegativas/vista-tablas.mjs [--grupos conceptos,moco|todos] [--tema claro|oscuro|ambos]
 *        [--ancho 1280] [--alto 1700] [--sin-plan] [--salida <carpeta>]
 *
 * Pinta `Tablas.tsx` con react-dom/server dentro de la misma envoltura del lab (`.lab`, con sus
 * variables de claro y oscuro) y deja un PNG por pestaña hecho con Edge sin ventana. `--sin-plan`
 * pinta lo que ve una cuenta sin plan (solo la pestaña gratis; las demás, con candado). La
 * pestaña que se enseña es la primera de la lista: las demás se reordenan detrás. No abre nada
 * para nadie: solo escribe imágenes. Límite honesto: no se prueba el clic ni el scroll.
 */

import { register } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

register('./cargador-tsx.mjs', import.meta.url);

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const arg = (k, d = null) => { const i = process.argv.indexOf(`--${k}`); return i === -1 ? d : process.argv[i + 1]; };
const temas = arg('tema', 'ambos') === 'ambos' ? ['claro', 'oscuro'] : [arg('tema')];
const ancho = Number(arg('ancho', '1280'));
const alto = Number(arg('alto', '1700'));
const sinPlan = process.argv.includes('--sin-plan');
const salida = path.resolve(arg('salida', path.join(os.tmpdir(), 'vista-tablas')));
const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
if (!EDGE) { console.error('No encuentro Microsoft Edge.'); process.exit(1); }
mkdirSync(salida, { recursive: true });

const React = (await import('react')).default;
const { renderToStaticMarkup } = await import('react-dom/server');
const cargar = (rel) => import(pathToFileURL(path.join(RAIZ, 'src', rel)).href);
const { CAPITULOS } = await cargar('lib/data/gramnegativas/capitulos.ts');
const { INDICE } = await cargar('lib/data/gramnegativas/indice.ts');
const { VISTAZO } = await cargar('lib/data/gramnegativas/vistazo.ts');
const { GRUPOS } = await cargar('lib/data/gramnegativas/tablas-indice.ts');
const { TABLAS } = await cargar('lib/data/gramnegativas/tablas.ts');
const { default: PanelTablas } = await cargar('app/dashboard/laboratorio/gramnegativas/Tablas.tsx');

const pedidos = arg('grupos', 'todos') === 'todos' ? GRUPOS.map((g) => g.id) : arg('grupos').split(',');
const indice = INDICE.map((m) => ({ ...m, nPasos: CAPITULOS[m.numero].pasos.length, segundos: 0, gratis: VISTAZO.includes(m.id) }));
const partes = CAPITULOS.filter((p) => !sinPlan || VISTAZO.includes(p.id));
const abierto = (g) => !sinPlan || g.gratis;
const grupos = GRUPOS.map((g) => ({ ...g, ...(abierto(g) ? { tablas: TABLAS[g.id] } : {}) }));

// CSS de los módulos que usa el panel (sus clases conservan el nombre en el cargador).
const modulos = ['cicloCelular', 'linfocitos', 'hipersensibilidad', 'gramnegativas'];
const css = modulos.map((n) => readFileSync(path.join(RAIZ, `src/styles/${n}.module.css`), 'utf8').replace(/:global\(([^)]*)\)/g, '$1')).join('\n');

const hojas = [];
for (const id of pedidos) {
  const primero = grupos.findIndex((g) => g.id === id);
  if (primero === -1 || !grupos[primero].tablas) { console.error(`  «${id}» no existe o está cerrada`); continue; }
  // La pestaña pedida va primera (así es la que se abre) y las demás conservan su orden.
  const orden = [grupos[primero], ...grupos.filter((_, i) => i !== primero)];
  const contenido = { completo: !sinPlan, indice, partes, tablas: orden };
  const marcado = renderToStaticMarkup(React.createElement(PanelTablas, { contenido, desde: null, onCerrar: () => {}, onIr: () => {}, onMuro: () => {} }));
  for (const tema of temas) {
    const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>${css}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; font-family: 'Outfit', 'Segoe UI', Arial, sans-serif; }
html, body { overflow: hidden; }
/* Edge sin ventana no baja de ~500 px de ancho: el ancho que se pide se fija en la propia página. */
.pagina { margin: 0 !important; width: ${ancho}px; height: 100vh !important; border-radius: 0 !important; }
</style></head>
<body class="${tema === 'oscuro' ? 'dark-mode' : ''}"><div class="pagina wrapper"><div class="lab">${marcado}</div></div></body></html>`;
    const nombre = `${sinPlan ? 'sinplan-' : ''}${id}-${tema}-${ancho}`;
    const archivoHtml = path.join(salida, `${nombre}.html`);
    const archivoPng = path.join(salida, `${nombre}.png`);
    writeFileSync(archivoHtml, html);
    const perfil = path.join(salida, '.perfil-edge');
    const r = spawnSync(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--user-data-dir=${perfil}`, `--window-size=${ancho},${alto}`, '--virtual-time-budget=6000', `--screenshot=${archivoPng}`, pathToFileURL(archivoHtml).href], { encoding: 'utf8', timeout: 90000 });
    if (!existsSync(archivoPng)) { console.error(`  Edge no dejó ${nombre}.png`, r.stderr?.slice(0, 200)); continue; }
    rmSync(archivoHtml);
    hojas.push(archivoPng);
  }
}
try { rmSync(path.join(salida, '.perfil-edge'), { recursive: true, force: true }); } catch {}
console.log(`${hojas.length} imágenes en ${salida}`);
for (const h of hojas) console.log(`  ${h}`);
