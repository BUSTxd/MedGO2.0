/**
 * Prepara la narración del laboratorio «Infecciones bacterianas por gramnegativas» (clase AI18).
 *
 *   node scripts/gramnegativas/preparar-narracion.mjs --dir <audios de Voz Lab> --salida <carpeta>
 *
 * Voz Lab (Fish Audio, Drama 3, voz «cristian cornejo») deja un MP3 por paso:
 * `gramnegativas-<bloque>-p<n>.mp3`. Aquí cada paso se recorta en los bordes y todos los
 * de un capítulo se unen con la misma pausa (`PAUSA`), así las marcas son exactas y no se
 * pierde espacio en silencios largos. Luego: volumen igual (loudnorm en dos pasadas,
 * -16 LUFS), WebM Opus 32 kbps (el que se usa) y MP3 40 kbps (respaldo). Escribe
 * `narracion.json` y deja el WAV de cada capítulo para sacar los tiempos por palabra.
 * Misma arquitectura que `scripts/vasculitis/preparar-narracion.mjs`.
 */

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const arg = (k) => { const i = process.argv.indexOf(`--${k}`); return i === -1 ? null : process.argv[i + 1]; };
const dir = arg('dir'), salida = arg('salida');
if (!dir || !salida) { console.error('Uso: --dir <carpeta de audios de Voz Lab> --salida <carpeta>'); process.exit(1); }
mkdirSync(salida, { recursive: true });

const paso = (bloque, desde, hasta) => Array.from({ length: hasta - desde + 1 }, (_, i) => `gramnegativas-${bloque}-p${desde + i}.mp3`);

/** Por capítulo, los archivos de sus pasos en orden. Bloques según docs/gramnegativas/NARRACION-ELEVENLABS.md. */
const FUENTES = [
  [...paso('0', 0, 3)],
  [...paso('1A', 0, 3), ...paso('1B', 4, 6)],
  [...paso('2A', 0, 3), ...paso('2B', 4, 8)],
  [...paso('3A', 0, 3), ...paso('3B', 4, 7)],
  [...paso('4A', 0, 3), ...paso('4B', 4, 7)],
  [...paso('5A', 0, 4), ...paso('5B', 5, 9)],
  [...paso('6A', 0, 4), ...paso('6B', 5, 10)],
  [...paso('7', 0, 5)],
  [...paso('8A', 0, 4), ...paso('8B', 5, 10), ...paso('8C', 11, 13), ...paso('8D', 14, 18)],
  [...paso('9A', 0, 3), ...paso('9B', 4, 7), ...paso('9C', 8, 11)],
];
const PASOS = [4, 7, 9, 8, 8, 10, 11, 6, 19, 12];
/** Pausa entre pasos (s). */
const PAUSA = 1.0;

const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-nostats', '-y', ...args], { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26 });
const stderr = (args) => spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], { encoding: 'utf8', maxBuffer: 1 << 26 }).stderr;
const duracion = (f) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' }).trim());

function silencios(f, ruido, min) {
  const out = stderr(['-i', f, '-af', `silencedetect=noise=${ruido}dB:d=${min}`, '-f', 'null', '-']);
  const res = [];
  let ini = null;
  for (const l of out.split('\n')) {
    const a = l.match(/silence_start: (-?[\d.]+)/); if (a) ini = Math.max(0, Number(a[1]));
    const b = l.match(/silence_end: ([\d.]+)/); if (b) { res.push({ ini: ini ?? 0, fin: Number(b[1]) }); ini = null; }
  }
  return res;
}

/** Recorta el silencio de los bordes de [desde, hasta] dentro de `f`. */
function bordes(f, desde, hasta) {
  const s = silencios(f, -45, 0.05);
  let a = desde, b = hasta;
  for (const x of s) {
    if (x.ini <= a + 0.01 && x.fin > a) a = Math.min(x.fin, b);
    if (x.fin >= b - 0.01 && x.ini < b) b = Math.max(x.ini, a);
  }
  return [Math.max(desde, a - 0.04), Math.min(hasta, b + 0.08)];
}

const tmp = join(salida, 'tmp');
mkdirSync(tmp, { recursive: true });
const resumen = [];

for (let cap = 0; cap < FUENTES.length; cap++) {
  const segmentos = []; // [archivo, desde, hasta]
  for (const nombre of FUENTES[cap]) {
    const f = join(dir, nombre);
    if (!existsSync(f)) throw new Error(`cap ${cap}: falta ${nombre}`);
    segmentos.push([f, ...bordes(f, 0, duracion(f))]);
  }
  if (segmentos.length !== PASOS[cap]) throw new Error(`cap ${cap}: ${segmentos.length} pasos, se esperaban ${PASOS[cap]}`);

  const entradas = [], filtros = [], orden = [], marcas = [];
  let t = 0, k = 0;
  segmentos.forEach(([f, a, b], i) => {
    if (i > 0) {
      entradas.push('-f', 'lavfi', '-t', String(PAUSA), '-i', 'anullsrc=r=48000:cl=mono');
      orden.push(`[${k++}:a]`); t += PAUSA;
    }
    marcas.push(+t.toFixed(2));
    entradas.push('-i', f);
    filtros.push(`[${k++}:a]atrim=start=${a.toFixed(3)}:end=${b.toFixed(3)},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=mono[s${i}]`);
    orden.push(`[s${i}]`);
    t += b - a;
  });
  const unido = join(tmp, `cap-${cap}.wav`);
  ff([...entradas, '-filter_complex', `${filtros.join(';')};${orden.join('')}concat=n=${orden.length}:v=0:a=1[a]`, '-map', '[a]', '-ar', '48000', '-ac', '1', unido]);

  const medida = stderr(['-i', unido, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-']);
  const m = JSON.parse(medida.slice(medida.lastIndexOf('{'), medida.lastIndexOf('}') + 1));
  const norm = `loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
  const webm = join(salida, `gramnegativas-${cap}.webm`), mp3 = join(salida, `gramnegativas-${cap}.mp3`), wav = join(salida, `gramnegativas-${cap}.wav`);
  ff(['-i', unido, '-af', norm, '-ar', '48000', '-ac', '1', '-c:a', 'libopus', '-b:a', '32k', '-vbr', 'on', '-application', 'voip', '-compression_level', '10', webm]);
  ff(['-i', unido, '-af', norm, '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '40k', mp3]);
  ff(['-i', webm, '-ar', '16000', '-ac', '1', wav]);
  const dur = duracion(webm);
  resumen.push({ cap, duracion: +dur.toFixed(2), marcas, webmKB: Math.round(statSync(webm).size / 1024), mp3KB: Math.round(statSync(mp3).size / 1024) });
  console.log(`cap ${cap}: ${dur.toFixed(1)} s · webm ${resumen.at(-1).webmKB} KB · mp3 ${resumen.at(-1).mp3KB} KB · ${marcas.length} marcas`);
}

writeFileSync(join(salida, 'narracion.json'), JSON.stringify(resumen, null, 2));
const tot = resumen.reduce((s, r) => s + r.duracion, 0);
console.log(`\nTotal ${(tot / 60).toFixed(1)} min · ${resumen.reduce((s, r) => s + r.marcas.length, 0)} pasos · webm ${(resumen.reduce((s, r) => s + r.webmKB, 0) / 1024).toFixed(1)} MB · mp3 ${(resumen.reduce((s, r) => s + r.mp3KB, 0) / 1024).toFixed(1)} MB`);
