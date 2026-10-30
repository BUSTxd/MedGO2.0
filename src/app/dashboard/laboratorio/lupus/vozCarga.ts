'use client';
// Carga de la voz del laboratorio: nunca se bajan los 12 capítulos (≈ 10 MB).
//
// 1. Al entrar al lab no se baja ningún audio (la portada tampoco: suena al pulsar).
// 2. Al abrir un capítulo con la voz encendida se baja SOLO el suyo, en el formato que
//    lee el navegador (WebM Opus ≈ 0,6–1,2 MB; MP3 si no lee Opus).
// 3. Cuando faltan `ANTES_DEL_FINAL` segundos para acabar el capítulo, se precarga el
//    siguiente (uno, nunca más), para que el paso de capítulo no espere a la red.
// 4. La precarga es un `<audio>` que se guarda aquí y que `tomar()` entrega tal cual al
//    abrir ese capítulo: no depende de que la caché HTTP reaproveche una descarga hecha
//    con `fetch` para un `<audio>` de otro dominio (no siempre lo hace).
// 5. Con ahorro de datos o red 2G no se precarga nada: solo el capítulo abierto.
// 6. Solo se precargan capítulos que el alumno puede abrir: el servidor no manda la
//    narración de los cerrados (vistazo gratis).
// Los archivos llevan caché de un año (versión en el nombre): volver a un capítulo
// ya escuchado no vuelve a bajarlo.

import type { Narracion } from '@/lib/data/lupus/tipos';

/** Segundos antes del final del capítulo en que se precarga el siguiente. */
export const ANTES_DEL_FINAL = 45;
/** Audios guardados a la vez como mucho (el que suena y el siguiente). */
const MAX = 2;

const guardados = new Map<string, HTMLAudioElement>();

let opus: boolean | null = null;
/** La URL que lee este navegador. */
export function fuenteVoz(n: Narracion): string {
  if (opus === null) opus = typeof Audio !== 'undefined' && new Audio().canPlayType('audio/webm; codecs=opus') !== '';
  return opus ? n.webm : n.mp3;
}

/** Red lenta o ahorro de datos: solo se baja lo que suena. */
function redCorta(): boolean {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !!c && (!!c.saveData || /(^|-)2g$/.test(c.effectiveType ?? ''));
}

function crear(src: string, preload: 'auto' | 'metadata'): HTMLAudioElement {
  const a = new Audio();
  a.preload = preload;
  a.src = src;
  return a;
}

/** Deja empezada la descarga del capítulo `n` (si la red lo permite). */
export function precargarVoz(n: Narracion | undefined) {
  if (!n || redCorta()) return;
  const src = fuenteVoz(n);
  if (guardados.has(src)) return;
  while (guardados.size >= MAX) soltar(guardados.keys().next().value!);
  guardados.set(src, crear(src, 'auto'));
}

/** El audio del capítulo que se abre: el precargado si lo hay; si no, uno nuevo. */
export function tomarVoz(n: Narracion): HTMLAudioElement {
  const src = fuenteVoz(n);
  const a = guardados.get(src);
  if (a) { guardados.delete(src); return a; }
  return crear(src, redCorta() ? 'metadata' : 'auto');
}

/** Corta la descarga y libera el audio. */
export function liberarVoz(a: HTMLAudioElement) {
  a.pause();
  a.removeAttribute('src');
  a.load();
}

function soltar(src: string) {
  const a = guardados.get(src);
  guardados.delete(src);
  if (a) liberarVoz(a);
}
