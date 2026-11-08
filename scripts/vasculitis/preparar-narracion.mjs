/**
 * Prepara la narración del laboratorio «Vasculitis de vasos medianos y pequeños y ANCA».
 *
 *   node scripts/vasculitis/preparar-narracion.mjs --dir <Descargas> --salida <carpeta>
 *
 * Los audios llegan mezclados: bloques de ElevenLabs con varios pasos (separados por
 * `[long pause]`) y archivos de Fish Audio con un paso cada uno (Voz Lab). `FUENTES`
 * dice, por capítulo, qué archivo trae cuántos pasos. Cada bloque se corta en pasos
 * por sus N-1 pausas más largas; cada paso se recorta en los bordes, y todos se unen
 * con la misma pausa (`PAUSA`), así las marcas son exactas y no se pierde espacio en
 * silencios largos. Luego: volumen igual (loudnorm en dos pasadas, -16 LUFS), WebM
 * Opus 32 kbps (el que se usa) y MP3 40 kbps (respaldo). Escribe `narracion.json` y
 * deja el WAV de cada capítulo para sacar los tiempos por palabra.
 */

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const arg = (k) => { const i = process.argv.indexOf(`--${k}`); return i === -1 ? null : process.argv[i + 1]; };
const dir = arg('dir'), salida = arg('salida');
if (!dir || !salida) { console.error('Uso: --dir <carpeta de descargas> --salida <carpeta>'); process.exit(1); }
mkdirSync(salida, { recursive: true });

const LOTE = 'vasculitis-5D-a-9B';
const pasoFish = (bloque, desde, hasta) => Array.from({ length: hasta - desde + 1 }, (_, i) => [`${LOTE}/vasculitis-${bloque}-p${desde + i}.mp3`, 1]);

/** Por capítulo: [archivo, pasos que trae]. Pasos según docs/vasculitis/NARRACION-ELEVENLABS.md. */
const FUENTES = [
  [['vasculitis-0.mp3.mp3', 4]],
  [['vasculitis-1A.mp3', 4], ['vasculitis-1B.mp3', 4]],
  [['vasculitis-2A.mp3', 5], ['vasculitis-2B.mp3', 4]],
  [['vasculitis-3.mp3', 5], ['vasculitis-3.1.mp3', 2]],
  [['vasculitis-4A.mp3', 5], ['vasculitis-4B.mp3', 6], ['vasculitis-4C.mp3', 6]],
  [
    ['vasculitis-5A.mp3', 3],
    ...[1, 2, 3, 4, 5].map((n) => [`vasculitis-5B-${n}.mp3`, 1]),
    ['vasculitis5C-1.mp3', 1], ['vasculitis5C-2.mp3', 1], ['vasculitis5C-3.wav', 1], ['vasculitis5C-4.mp3', 1],
    ...pasoFish('5D', 12, 14),
  ],
  [...pasoFish('6A', 0, 3), ...pasoFish('6B', 4, 8)],
  [...pasoFish('7A', 0, 4), ...pasoFish('7B', 5, 8)],
  [...pasoFish('8A', 0, 3), ...pasoFish('8B', 4, 6)],
  [...pasoFish('9A', 0, 4), ...pasoFish('9B', 5, 9)],
];
const PASOS = [4, 8, 9, 7, 17, 15, 9, 9, 7, 10];
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
  for (const [nombre, n] of FUENTES[cap]) {
    const f = join(dir, nombre);
    if (!existsSync(f)) throw new Error(`cap ${cap}: falta ${nombre}`);
    const total = duracion(f);
    let cortes = [];
    if (n > 1) {
      const cand = silencios(f, -36, 0.4).filter((s) => s.ini > 1 && s.fin < total - 1);
      if (cand.length < n - 1) throw new Error(`${nombre}: ${cand.length} pausas para ${n} pasos`);
      const largas = [...cand].sort((x, y) => (y.fin - y.ini) - (x.fin - x.ini)).slice(0, n - 1).sort((x, y) => x.ini - y.ini);
      const corta = Math.min(...largas.map((s) => s.fin - s.ini));
      const siguiente = [...cand].sort((x, y) => (y.fin - y.ini) - (x.fin - x.ini))[n - 1];
      console.log(`  ${nombre}: pausa elegida más corta ${corta.toFixed(2)} s · siguiente candidata ${siguiente ? (siguiente.fin - siguiente.ini).toFixed(2) : '—'} s`);
      cortes = largas.map((s) => (s.ini + s.fin) / 2);
    }
    const lim = [0, ...cortes, total];
    for (let i = 0; i < n; i++) segmentos.push([f, ...bordes(f, lim[i], lim[i + 1])]);
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
  const webm = join(salida, `vasculitis-${cap}.webm`), mp3 = join(salida, `vasculitis-${cap}.mp3`), wav = join(salida, `vasculitis-${cap}.wav`);
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
