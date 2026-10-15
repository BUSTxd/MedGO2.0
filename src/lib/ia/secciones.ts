import 'server-only';
import { createHash } from 'crypto';
import { descargarResumenHtml } from '@/lib/resumen-html';
import { CONTEXTO } from './config';

/**
 * Un resumen partido en tramos que hablan de lo mismo, para mandarle al
 * modelo sólo el tramo donde está lo que el alumno subrayó (mandar el
 * documento entero en cada pregunta cuesta ~15× más y responde peor).
 *
 * Cada envase se parte distinto (ver CLAUDE.md, «PDF reconstruido en capas»):
 *  - Notion y «documento de flujo» traen títulos h1-h4 → un tramo por título,
 *    con la ruta «Padre › Hijo».
 *  - Las hojas/páginas de tamaño fijo no tienen títulos de verdad (el texto
 *    son cajas sueltas) → un tramo por hoja.
 *  - Lo que no encaje en nada → trozos de tamaño fijo.
 * Lo subrayado se busca por contenido (`buscarTramo`), así que la ruta que
 * manda el cliente es sólo una pista y no hace falta que calce exacta.
 */

export interface Tramo {
  ruta: string;
  texto: string;
  /** URLs de las figuras que caen en este tramo. */
  figuras: string[];
}

export interface Documento {
  claseId: string;
  version: string;
  titulo: string;
  tramos: Tramo[];
  /** Todo el texto seguido (para «resumir» y para buscar). */
  completo: string;
}

const ENTIDADES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—',
  laquo: '«', raquo: '»', hellip: '…', middot: '·', rarr: '→', larr: '←', uarr: '↑', darr: '↓',
};

function decodificar(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENTIDADES[e.toLowerCase()] ?? m;
  });
}

/** HTML → texto legible: bloques en líneas, celdas separadas, sin estilos ni vectores. */
function aTexto(html: string): string {
  return decodificar(
    html
      .replace(/<(style|script|svg|noscript)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|tr|h[1-6]|blockquote|figcaption|section|article|ul|ol|table)>/gi, '\n')
      .replace(/<\/(td|th)>/gi, ' | ')
      .replace(/<li\b[^>]*>/gi, '• ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/[ \t\f\v ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * La misma URL escrita como la devuelve el navegador (`img.src`, con tildes y
 * espacios codificados). El HTML del bucket las trae crudas: sin esto una
 * figura «Ácido.avif» no se reconocería como parte del resumen.
 */
export function urlCanonica(u: string): string | null {
  try {
    const url = new URL(u);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}

function figurasDe(html: string): string[] {
  const urls = new Set<string>();
  for (const m of html.matchAll(/<img\b[^>]*?\bsrc="([^"]+)"/gi)) urls.add(decodificar(m[1]));
  for (const m of html.matchAll(/<a\b[^>]*?\bhref="([^"]+\.(?:avif|webp|png|jpe?g))"/gi)) urls.add(decodificar(m[1]));
  return [...urls].map(urlCanonica).filter((u): u is string => u !== null);
}

/** Clave de comparación: sin tildes, sin mayúsculas y SIN espacios (las hojas pegan palabras sueltas). */
export function normalizar(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9ñ]/g, '');
}

function porTitulos(html: string): Tramo[] | null {
  const titulos = [...html.matchAll(/<h([1-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi)];
  if (titulos.length < 3) return null;
  const tramos: Tramo[] = [];
  const pila: { nivel: number; texto: string }[] = [];
  // Lo de antes del primer título (portada, índice) también cuenta.
  const inicio = html.slice(0, titulos[0].index);
  if (aTexto(inicio).length > 40) tramos.push({ ruta: 'Inicio', texto: aTexto(inicio), figuras: figurasDe(inicio) });
  titulos.forEach((t, i) => {
    const nivel = Number(t[1]);
    const nombre = aTexto(t[2]).replace(/\s+/g, ' ').slice(0, 120) || `Sección ${i + 1}`;
    while (pila.length && pila[pila.length - 1].nivel >= nivel) pila.pop();
    pila.push({ nivel, texto: nombre });
    const fin = i + 1 < titulos.length ? titulos[i + 1].index : html.length;
    const cuerpo = html.slice(t.index, fin);
    tramos.push({ ruta: pila.map((p) => p.texto).join(' › '), texto: aTexto(cuerpo), figuras: figurasDe(cuerpo) });
  });
  return tramos;
}

function porHojas(html: string): Tramo[] | null {
  const cortes = [...html.matchAll(/<(?:div|section)\b[^>]*\bclass="[^"]*\b(page-shell|pdf-page|page)\b[^"]*"/gi)];
  // Una hoja dentro de otra (`.page-shell > .page`) duplicaría cortes: se usa la clase más externa.
  const clase = cortes[0]?.[1];
  const propios = cortes.filter((c) => c[1] === clase);
  if (propios.length < 2) return null;
  return propios.map((c, i) => {
    const fin = i + 1 < propios.length ? propios[i + 1].index : html.length;
    const cuerpo = html.slice(c.index, fin);
    const texto = aTexto(cuerpo);
    const primera = texto.split('\n').find((l) => l.trim().length > 3)?.trim().slice(0, 80) ?? '';
    return { ruta: `Hoja ${i + 1}${primera ? ` — ${primera}` : ''}`, texto, figuras: figurasDe(cuerpo) };
  });
}

function porTrozos(html: string): Tramo[] {
  const texto = aTexto(html);
  const tramos: Tramo[] = [];
  const paso = 6_000;
  for (let i = 0; i < texto.length; i += paso) {
    tramos.push({ ruta: `Parte ${tramos.length + 1}`, texto: texto.slice(i, i + paso), figuras: [] });
  }
  if (tramos.length) tramos[0].figuras = figurasDe(html);
  return tramos;
}

const memoria = new Map<string, Documento>();

/** El resumen segmentado. Se recalcula sólo si el HTML del bucket cambió. */
export async function documentoDe(claseId: string): Promise<Documento | null> {
  const html = await descargarResumenHtml(claseId);
  if (html === null) return null;
  const version = createHash('sha1').update(html).digest('base64url').slice(0, 16);
  const previo = memoria.get(claseId);
  if (previo?.version === version) return previo;

  const tramos = (porTitulos(html) ?? porHojas(html) ?? porTrozos(html)).filter((t) => t.texto.length > 0);
  const tituloHtml = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  const doc: Documento = {
    claseId,
    version,
    titulo: tituloHtml ? aTexto(tituloHtml).slice(0, 140) : claseId,
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
export function recortar(texto: string, seleccion?: string): string {
  const max = CONTEXTO.maxCharsSeccion;
  if (texto.length <= max) return texto;
  let centro = texto.length / 2;
  if (seleccion) {
    const i = texto.toLowerCase().indexOf(seleccion.slice(0, 30).toLowerCase());
    if (i >= 0) centro = i;
  }
  const desde = Math.max(0, Math.min(texto.length - max, Math.floor(centro - max / 2)));
  return `${desde > 0 ? '[…] ' : ''}${texto.slice(desde, desde + max)}${desde + max < texto.length ? ' […]' : ''}`;
}
