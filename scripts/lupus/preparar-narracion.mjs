/**
 * Prepara la narración del laboratorio «Lupus» a partir de los bloques de ElevenLabs.
 *
 *   node scripts/lupus/preparar-narracion.mjs --dir <carpeta con lupus-0A.mp3, lupus-0B.mp3…> --salida <carpeta>
 *
 * Por capítulo: recorta el silencio de los bordes de cada bloque, los une con una
 * pausa igual a las que hay entre pasos, iguala el volumen (loudnorm en dos
 * pasadas, -16 LUFS) y lo codifica en WebM Opus 32 kbps (el que se usa) y MP3
 * 48 kbps (respaldo). Las marcas (segundo en que empieza cada paso) salen de las
 * pausas largas del audio (ffmpeg silencedetect) y se comprueba que haya tantas
 * como pasos; `MANUAL` resuelve los bloques donde una pausa salió corta o hay una
 * de más dentro de una frase. Escribe `narracion.json` con marcas y duración.
 */

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const arg = (k) => { const i = process.argv.indexOf(`--${k}`); return i === -1 ? null : process.argv[i + 1]; };
const dir = arg('dir'), salida = arg('salida');
if (!dir || !salida) { console.error('Uso: --dir <bloques> --salida <carpeta>'); process.exit(1); }
mkdirSync(salida, { recursive: true });

/** Pasos de cada capítulo (docs/lupus/NARRACION-ELEVENLABS.md). */
const PASOS = [6, 8, 7, 8, 9, 8, 7, 9, 6, 10, 8, 9];
/** Pausa entre bloques (s): la media de las que hay entre pasos dentro de un bloque. */
const PAUSA = 1.3;
/** Las marcas caen este rato antes de que empiece la frase (como en Hipersensibilidad). */
const ADELANTO = 0.05;
/** Bloques cuyas pausas no salen limpias con el umbral general: inicios de paso a mano
 *  (segundos dentro del bloque original, final de la pausa). Comprobados contra el texto. */
const MANUAL = {
  // La pausa antes del paso 5 salió de 0,34 s.
  '8': [28.27, 50.96, 74.74, 95.35, 119.70],
  // 1,69-2,21 es la pausa tras «¿Cómo se diagnostica el lupus?», dentro del paso 0.
  '10A': [20.43, 41.68, 70.24, 98.55],
};

const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-nostats', '-y', ...args], { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26 });
/** ffmpeg escribe sus mediciones (silencedetect, loudnorm) en stderr. */
const stderr = (args) => spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], { encoding: 'utf8', maxBuffer: 1 << 26 }).stderr;
const duracion = (f) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' }).trim());

/** Silencios de un archivo: [{ ini, fin }]. */
function silencios(f, ruido, min) {
  const out = stderr(['-i', f, '-af', `silencedetect=noise=${ruido}dB:d=${min}`, '-f', 'null', '-']);
  const res = [];
  let ini = null;
  for (const l of out.split('\n')) {
    const a = l.match(/silence_start: ([\d.]+)/); if (a) ini = Number(a[1]);
    const b = l.match(/silence_end: ([\d.]+)/); if (b) { res.push({ ini: ini ?? 0, fin: Number(b[1]) }); ini = null; }
  }
  return res;
}

const tmp = join(salida, 'tmp');
mkdirSync(tmp, { recursive: true });
const archivos = readdirSync(dir).filter((f) => /^lupus-\d+[AB]?\.mp3$/.test(f));
const resumen = [];

for (let cap = 0; cap < PASOS.length; cap++) {
  const bloques = archivos.filter((f) => f.match(/^lupus-(\d+)/)[1] === String(cap))
    .sort((a, b) => a.localeCompare(b));
  if (!bloques.length) throw new Error(`cap ${cap}: sin bloques`);
  const marcas = [];
  const piezas = [];
  let t = 0;
  for (const [k, b] of bloques.entries()) {
    const id = b.replace(/^lupus-|\.mp3$/g, '');
    const fuente = join(dir, b);
    // Silencio de los bordes: lo que hay antes de la primera voz y después de la última.
    const bordes = silencios(fuente, -45, 0.05);
    const total = duracion(fuente);
    const lead = bordes[0] && bordes[0].ini < 0.01 ? bordes[0].fin : 0;
    const ultimo = bordes.at(-1);
    const trail = ultimo && ultimo.fin > total - 0.02 ? total - ultimo.ini : 0;
    const desde = Math.max(0, lead - 0.04), hasta = total - Math.max(0, trail - 0.08);
    // Inicios de paso dentro del bloque.
    const inicios = MANUAL[id] ?? silencios(fuente, -40, 0.5).filter((s) => s.ini > desde + 0.05 && s.fin < hasta - 0.05).map((s) => s.fin);
    const wav = join(tmp, `${id}.wav`);
    ff(['-i', fuente, '-af', `atrim=start=${desde}:end=${hasta},asetpts=PTS-STARTPTS`, '-ar', '48000', '-ac', '1', wav]);
    if (k > 0) { piezas.push(`silencio:${PAUSA}`); t += PAUSA; }
    marcas.push(+t.toFixed(2));
    for (const s of inicios) marcas.push(+(t + s - desde - ADELANTO).toFixed(2));
    piezas.push(wav);
    t += hasta - desde;
  }
  if (marcas.length !== PASOS[cap]) throw new Error(`cap ${cap}: ${marcas.length} marcas para ${PASOS[cap]} pasos (${marcas.join(', ')})`);

  // Unir.
  const unido = join(tmp, `cap-${cap}.wav`);
  const entradas = [], filtros = [];
  piezas.forEach((p, i) => {
    if (p.startsWith('silencio:')) entradas.push('-f', 'lavfi', '-t', p.split(':')[1], '-i', 'anullsrc=r=48000:cl=mono');
    else entradas.push('-i', p);
    filtros.push(`[${i}:a]`);
  });
  ff([...entradas, '-filter_complex', `${filtros.join('')}concat=n=${piezas.length}:v=0:a=1[a]`, '-map', '[a]', unido]);

  // Volumen igual en todos los capítulos: loudnorm en dos pasadas (lineal, sin bombeo).
  const medida = stderr(['-i', unido, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-']);
  const j = JSON.parse(medida.slice(medida.lastIndexOf('{'), medida.lastIndexOf('}') + 1));
  const norm = `loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`;
  const webm = join(salida, `lupus-${cap}.webm`), mp3 = join(salida, `lupus-${cap}.mp3`);
  ff(['-i', unido, '-af', norm, '-ar', '48000', '-ac', '1', '-c:a', 'libopus', '-b:a', '32k', '-vbr', 'on', '-application', 'voip', '-compression_level', '10', webm]);
  ff(['-i', unido, '-af', norm, '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '48k', mp3]);
  const dur = duracion(webm);
  resumen.push({ cap, duracion: +dur.toFixed(2), marcas, webmKB: Math.round(statSync(webm).size / 1024), mp3KB: Math.round(statSync(mp3).size / 1024), origKB: bloques.reduce((s, b) => s + Math.round(statSync(join(dir, b)).size / 1024), 0) });
  console.log(`cap ${cap}: ${dur.toFixed(1)} s · webm ${resumen.at(-1).webmKB} KB · mp3 ${resumen.at(-1).mp3KB} KB · marcas ${marcas.join(', ')}`);
}

writeFileSync(join(salida, 'narracion.json'), JSON.stringify(resumen, null, 2));
if (existsSync(tmp)) console.log(`\nIntermedios en ${tmp}`);
