/**
 * Revisión SIN navegador de las láminas de «Infecciones bacterianas por gramnegativas»
 * (CLAUDE.md: «render con react-dom/server, o Edge sin ventana para degradados y máscaras»).
 *
 *   node scripts/gramnegativas/vista.mjs --caps 0,1 [--pasos 0,3] [--tema claro|oscuro|ambos]
 *        [--p 1] [--reloj 2000] [--salida <carpeta>] [--por-hoja 4] [--lab gramnegativas] [--ancho 800|1600]
 *
 * Pinta cada lámina con todos sus parámetros en `--p` (1 = estado final) dentro del mismo
 * lienzo de 1600 × 1000 (fondo y variables de color de claro u oscuro, como en el lab) y
 * deja hojas de contacto PNG (2 × 2 por defecto, 800 × 500 por lámina) hechas con Edge sin
 * ventana. No abre nada para nadie: solo escribe imágenes. Límite honesto: la tipografía
 * Outfit puede caer a una de respaldo y lo animado (movimiento, voz) no se ve.
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
const caps = (arg('caps') ?? '0').split(',').map(Number);
const pasosPedidos = arg('pasos') ? arg('pasos').split(',').map(Number) : null;
const temas = arg('tema', 'ambos') === 'ambos' ? ['claro', 'oscuro'] : [arg('tema')];
const valorP = Number(arg('p', '1'));
const reloj = Number(arg('reloj', '2000'));
const ancho = Number(arg('ancho', '800')); // ancho de cada lámina (1600 = tamaño real, de una en una)
const alto = Math.round(ancho * 0.625);
const cols = ancho >= 1200 ? 1 : 2;
const porHoja = Number(arg('por-hoja', ancho >= 1200 ? '1' : '4'));
const lab = arg('lab', 'gramnegativas'); // otro lab con la misma forma (p. ej. vasculitis-anca) para probar la herramienta
const salida = path.resolve(arg('salida', path.join(os.tmpdir(), 'vista-gramnegativas')));
const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
if (!EDGE) { console.error('No encuentro Microsoft Edge.'); process.exit(1); }
mkdirSync(salida, { recursive: true });

const React = (await import('react')).default;
const { renderToStaticMarkup } = await import('react-dom/server');

// Variables de color: las de `.lienzo` (claro) y `.dark-mode .lienzo` (oscuro) del CSS del lab.
const cssLab = readFileSync(path.join(RAIZ, 'src/styles/gramnegativas.module.css'), 'utf8');
const vars = (bloque) => bloque.split('\n').filter((l) => /^\s*--[\w-]+:/.test(l)).join('\n');
const claro = vars(cssLab.match(/\.lienzo \{([\s\S]*?)\}/)[1]);
const oscuro = vars(cssLab.match(/:global\(\.dark-mode\) \.lienzo \{([\s\S]*?)\}/)[1]);

const celdas = []; // { cap, paso, svg }
for (const cap of caps) {
  const ruta = path.join(RAIZ, `src/app/dashboard/laboratorio/${lab}/laminas/c${cap}.tsx`);
  const { default: LAMINAS } = await import(pathToFileURL(ruta).href);
  LAMINAS.forEach((L, paso) => {
    if (pasosPedidos && !pasosPedidos.includes(paso)) return;
    let svg;
    try {
      svg = renderToStaticMarkup(React.createElement(L, { p: () => valorP, reloj }));
    } catch (e) {
      svg = `<text x="40" y="120" font-size="36" fill="#c00">ERROR c${cap}.${paso}: ${String(e.message).slice(0, 120).replace(/[<&]/g, '')}</text>`;
      console.error(`  ERROR c${cap}.${paso}: ${e.message}`);
    }
    celdas.push({ cap, paso, svg });
  });
}

// CSS de los módulos que usan las piezas (sus clases conservan el nombre). El hook del cargador corre en otro
// hilo, así que la lista va fija: los mismos que importan `Piezas.tsx` de Vasculitis y de Citopenias.
const cssModulos = ['citopenias', 'vasculitis', 'gramnegativas'].map((n) => readFileSync(path.join(RAIZ, `src/styles/${n}.module.css`), 'utf8').replace(/:global\(([^)]*)\)/g, '$1')).join('\n');
const base = `
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Outfit', 'Segoe UI', Arial, sans-serif; background: #888; }
.hoja { display: grid; grid-template-columns: repeat(${cols}, ${ancho}px); grid-auto-rows: ${alto}px; gap: 0; width: ${cols * ancho}px; }
.celda { position: relative; width: ${ancho}px; height: ${alto}px; overflow: hidden; }
.etq { position: absolute; left: 8px; bottom: 6px; z-index: 5; font: 700 15px Arial, sans-serif; color: #fff; background: rgba(20,10,40,.7); padding: 2px 7px; border-radius: 4px; }
.celda .lienzo { position: absolute; inset: 0; }
`;

const hojas = [];
for (const tema of temas) {
  for (let i = 0; i < celdas.length; i += porHoja) {
    const lote = celdas.slice(i, i + porHoja);
    const variables = tema === 'oscuro' ? oscuro : claro;
    const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>${cssModulos}\n${base}\n.celda .lienzo { ${variables} background: linear-gradient(165deg, var(--vas-fondo-a), var(--vas-fondo-b)); }</style></head>
<body class="${tema === 'oscuro' ? 'dark-mode' : ''}"><div class="hoja">${lote.map((c) => `<div class="celda"><div class="lienzo"><svg class="svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;overflow:visible">${c.svg}</svg></div><span class="etq">c${c.cap}.${c.paso} · ${tema}</span></div>`).join('')}</div></body></html>`;
    const nombre = `${tema}-c${lote[0].cap}p${lote[0].paso}${ancho >= 1200 ? 'z' : ''}`;
    const archivoHtml = path.join(salida, `${nombre}.html`);
    const archivoPng = path.join(salida, `${nombre}.png`);
    writeFileSync(archivoHtml, html);
    const filas = Math.ceil(lote.length / cols);
    const perfil = path.join(salida, '.perfil-edge');
    const r = spawnSync(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--user-data-dir=${perfil}`, `--window-size=${cols * ancho},${filas * alto}`, '--virtual-time-budget=6000', `--screenshot=${archivoPng}`, pathToFileURL(archivoHtml).href], { encoding: 'utf8', timeout: 90000 });
    if (!existsSync(archivoPng)) { console.error(`  Edge no dejó ${nombre}.png`, r.stderr?.slice(0, 200)); continue; }
    rmSync(archivoHtml);
    hojas.push(archivoPng);
  }
}
try { rmSync(path.join(salida, '.perfil-edge'), { recursive: true, force: true }); } catch {}
console.log(`${celdas.length} láminas · ${hojas.length} hojas en ${salida}`);
for (const h of hojas) console.log(`  ${h}`);
