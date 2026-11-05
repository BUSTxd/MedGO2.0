/**
 * Redimensiona una carpeta de figuras (PNG de Codex) con la regla de tamano.mjs y el
 * fondo crema, lista para mandarla a la web medgo-imgflow. No toca la carpeta de origen.
 *
 * Uso: node scripts/imagenes/redimensionar.mjs --dir "<carpeta>" --salida "<carpeta>" [--plan plan.json]
 *   --plan: de ahí salen los tipos (foto / dibujo) que decidió Codex; sin él, una figura
 *           es «foto» si no tiene transparencia ni rótulos y por números parece foto.
 * Copia también el .html si lo hay. Las líneas de texto se miden con analizar.py.
 */

import { spawn } from 'child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, copyFileSync, rmSync, statSync } from 'fs';
import { join, dirname, extname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';
import sharp from 'sharp';
import { anchoObjetivo, FONDO_FIGURAS, KERNEL } from './tamano.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith('--')) continue;
  const next = process.argv[i + 1];
  if (!next || next.startsWith('--')) args[a.slice(2)] = true;
  else { args[a.slice(2)] = next; i++; }
}
if (!args.dir || !args.salida) { console.error('Uso: --dir <carpeta> --salida <carpeta> [--plan plan.json]'); process.exit(1); }
const dir = resolve(args.dir), salida = resolve(args.salida);
if (dir === salida) { console.error('--salida tiene que ser otra carpeta'); process.exit(1); }

const correr = (cmd, argv) => new Promise((ok, mal) => {
  const p = spawn(cmd, argv, { stdio: ['ignore', 'pipe', 'pipe'] });
  let err = ''; p.stderr.on('data', (d) => { err += d; });
  p.on('close', (c) => (c === 0 ? ok() : mal(new Error(err.slice(-400)))));
});

// tipos de Codex, si hay plan
const tipos = new Map();
if (args.plan) for (const i of JSON.parse(readFileSync(args.plan, 'utf8')).imagenes) if (i.codex?.tipo) tipos.set(i.nombre, i.codex.tipo);

// líneas de texto y pista de foto (analizar.py, sin buscar logos)
const tmp = join(tmpdir(), `medgo-redim-${Date.now()}`);
await correr('py', ['-3', '-I', join(AQUI, 'analizar.py'), dir, tmp, join(tmp, 'sin-logos')]);
const analisis = new Map(JSON.parse(readFileSync(join(tmp, 'analisis.json'), 'utf8')).map((a) => [a.nombre, a]));
rmSync(tmp, { recursive: true, force: true });

rmSync(salida, { recursive: true, force: true });
mkdirSync(salida, { recursive: true });
let antes = 0, despues = 0;
for (const f of readdirSync(dir)) {
  const p = join(dir, f), q = join(salida, f), ext = extname(f).toLowerCase();
  if (!statSync(p).isFile()) continue;
  if (ext !== '.png') { if (ext === '.html') copyFileSync(p, q); continue; }
  const m = await sharp(p).metadata();
  const a = analisis.get(f);
  const tipo = tipos.get(f) ?? (!m.hasAlpha && a?.foto?.parece_foto && (a?.texto?.lineas ?? 0) < 3 ? 'foto' : 'dibujo');
  const W = anchoObjetivo({ W: m.width, H: m.height, tipo, lineas: a?.texto?.lineas ?? 0 });
  await sharp(p).resize(W, Math.round(W * m.height / m.width), { kernel: KERNEL })
    .flatten({ background: FONDO_FIGURAS }).png({ compressionLevel: 9 }).toFile(q);
  antes += statSync(p).size; despues += statSync(q).size;
  console.log(`${f.slice(0, 40).padEnd(41)} ${tipo.padEnd(7)} ${String(a?.texto?.lineas ?? 0).padStart(3)} líneas  ${m.width}×${m.height} → ${W}×${Math.round(W * m.height / m.width)}`);
}
console.log(`\nPNG: ${(antes / 1048576).toFixed(1)} MB → ${(despues / 1048576).toFixed(1)} MB · en ${salida}`);
