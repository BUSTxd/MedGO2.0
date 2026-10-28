import 'server-only';
import { createHash } from 'crypto';
import { descargarResumenHtml } from '@/lib/resumen-html';
import { normalizar, segmentar, tituloDe, urlCanonica, type Tramo } from '@/lib/resumen/segmentar';
import { CONTEXTO } from './config';

/**
 * Un resumen partido en tramos que hablan de lo mismo, para mandarle al
 * modelo sólo el tramo donde está lo que el alumno subrayó (mandar el
 * documento entero en cada pregunta cuesta ~15× más y responde peor).
 * El corte vive en `lib/resumen/segmentar.ts`, compartido con el índice del
 * planificador. Lo subrayado se busca por contenido (`buscarTramo`), así que
 * la ruta que manda el cliente es sólo una pista y no hace falta que calce exacta.
 */

export type { Tramo };
export { normalizar, urlCanonica };

export interface Documento {
  claseId: string;
  version: string;
  titulo: string;
  tramos: Tramo[];
  /** Todo el texto seguido (para «resumir» y para buscar). */
  completo: string;
}

const memoria = new Map<string, Documento>();

/** El resumen segmentado. Se recalcula sólo si el HTML del bucket cambió. */
export async function documentoDe(claseId: string): Promise<Documento | null> {
  const html = await descargarResumenHtml(claseId);
  if (html === null) return null;
  const version = createHash('sha1').update(html).digest('base64url').slice(0, 16);
  const previo = memoria.get(claseId);
  if (previo?.version === version) return previo;

  const { tramos } = segmentar(html);
  const doc: Documento = {
    claseId,
    version,
    titulo: tituloDe(html) ?? claseId,
    tramos,
    completo: tramos.map((t) => `## ${t.ruta}\n${t.texto}`).join('\n\n'),
  };
  if (memoria.size > 60) memoria.delete(memoria.keys().next().value!);
  memoria.set(claseId, doc);
  return doc;
}

/**
 * El tramo que contiene lo subrayado. Con varios candidatos gana el que calza
 * con la ruta que manda el cliente. `null` si el texto no está en el
 * resumen: así nadie usa la IA con textos ajenos al material.
 */
export function buscarTramo(doc: Documento, seleccion: string, rutaPista?: string): Tramo | null {
  const aguja = normalizar(seleccion);
  if (aguja.length < 2) return null;
  const candidatos = doc.tramos.filter((t) => normalizar(t.texto).includes(aguja));
  if (candidatos.length === 0) {
    // Una selección que cruza dos tramos: vale si su comienzo está en alguno.
    const inicio = aguja.slice(0, Math.min(40, aguja.length));
    const cruza = doc.tramos.find((t) => normalizar(t.texto).includes(inicio));
    return cruza && normalizar(doc.completo).includes(aguja) ? cruza : null;
  }
  if (rutaPista) {
    const pista = normalizar(rutaPista.split('›').pop() ?? '');
    const calza = candidatos.find((t) => pista && normalizar(t.ruta).includes(pista));
    if (calza) return calza;
  }
  return candidatos[0];
}

export function tramoPorRuta(doc: Documento, ruta: string): Tramo | null {
  const pista = normalizar(ruta.split('›').pop() ?? '');
  if (!pista) return null;
  return doc.tramos.find((t) => normalizar(t.ruta).endsWith(pista)) ??
    doc.tramos.find((t) => normalizar(t.ruta).includes(pista)) ?? null;
}

export function tramoDeFigura(doc: Documento, url: string): Tramo | null {
  const canonica = urlCanonica(url);
  return canonica ? doc.tramos.find((t) => t.figuras.includes(canonica)) ?? null : null;
}

/**
 * El tramo con sus vecinos (antes y después, alternando) hasta
 * `CONTEXTO.minCharsSeccion`. Un subtítulo de Notion suele traer dos líneas:
 * sin su entorno la IA no sabe de qué tema forma parte.
 */
export function ampliar(doc: Documento, tramo: Tramo): { ruta: string; texto: string } {
  const i = doc.tramos.indexOf(tramo);
  if (i < 0 || tramo.texto.length >= CONTEXTO.minCharsSeccion) return { ruta: tramo.ruta, texto: tramo.texto };
  let desde = i, hasta = i, largo = tramo.texto.length;
  while (largo < CONTEXTO.minCharsSeccion && (desde > 0 || hasta < doc.tramos.length - 1)) {
    if (desde > 0) { desde--; largo += doc.tramos[desde].texto.length; }
    if (largo < CONTEXTO.minCharsSeccion && hasta < doc.tramos.length - 1) { hasta++; largo += doc.tramos[hasta].texto.length; }
  }
  const texto = doc.tramos.slice(desde, hasta + 1)
    .map((t) => (t === tramo ? `### ${t.ruta} (sección del alumno)\n${t.texto}` : `### ${t.ruta}\n${t.texto}`))
    .join('\n\n');
  return { ruta: tramo.ruta, texto };
}

const VACIAS = new Set(('que como cual cuales cuando donde porque para por con sin una uno unos unas los las del '
  + 'esta este esto estos estas ese esa eso entre sobre tiene tienen hace hacen puede pueden explica explicame '
  + 'dime significa sirve funciona diferencia ejemplo mas menos muy todo toda todos todas cada desde hasta ser son '
  + 'esta estan fue pasa ocurre').split(' '));

function palabras(s: string): string[] {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .split(/[^a-z0-9ñ]+/).filter((p) => p.length >= 4 && !VACIAS.has(p));
}

/**
 * Para una pregunta libre dentro de un resumen: las secciones que más
 * palabras comparten con la pregunta (el título cuenta doble), en el orden
 * del documento y hasta `CONTEXTO.maxCharsLibre`. Sin IA: es un buscador por
 * palabras clave. Si nada coincide, el índice de títulos para orientarse.
 */
export function buscarPorPregunta(doc: Documento, pregunta: string): string {
  const claves = new Set(palabras(pregunta).map((p) => p.slice(0, 6)));
  const puntuados = doc.tramos.map((t, i) => {
    let n = 0;
    for (const p of palabras(t.ruta)) if (claves.has(p.slice(0, 6))) n += 2;
    for (const p of palabras(t.texto)) if (claves.has(p.slice(0, 6))) n += 1;
    return { t, i, n };
  }).filter((x) => x.n > 0).sort((a, b) => b.n - a.n);

  const elegidos: typeof puntuados = [];
  let largo = 0;
  for (const x of puntuados) {
    if (largo + x.t.texto.length > CONTEXTO.maxCharsLibre && elegidos.length) continue;
    elegidos.push(x);
    largo += x.t.texto.length;
    if (largo >= CONTEXTO.maxCharsLibre) break;
  }
  if (!elegidos.length) {
    return `Índice del resumen (ninguna sección coincide con la pregunta):\n${doc.tramos.map((t) => `- ${t.ruta}`).join('\n')}`;
  }
  return elegidos.sort((a, b) => a.i - b.i)
    .map((x) => `### ${x.t.ruta}\n${recortar(x.t.texto)}`).join('\n\n').slice(0, CONTEXTO.maxCharsLibre + 2_000);
}

/** Recorta un tramo largo a una ventana alrededor de lo subrayado. */
export function recortar(texto: string, seleccion?: string, max: number = CONTEXTO.maxCharsSeccion): string {
  if (texto.length <= max) return texto;
  let centro = texto.length / 2;
  if (seleccion) {
    const i = texto.toLowerCase().indexOf(seleccion.slice(0, 30).toLowerCase());
    if (i >= 0) centro = i;
  }
  const desde = Math.max(0, Math.min(texto.length - max, Math.floor(centro - max / 2)));
  return `${desde > 0 ? '[…] ' : ''}${texto.slice(desde, desde + max)}${desde + max < texto.length ? ' […]' : ''}`;
}
