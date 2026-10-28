/**
 * Un resumen HTML partido en tramos que hablan de lo mismo. Módulo puro (sin
 * `server-only` ni alias `@/`) porque lo comparten la IA (`lib/ia/secciones.ts`)
 * y el indexador del planificador (`scripts/estudio/indexar-curso.mjs`, que lo
 * importa desde Node): así los dos parten igual cada resumen.
 *
 * Cada envase se parte distinto (ver CLAUDE.md, «PDF reconstruido en capas»):
 *  - Notion y «documento de flujo» traen títulos h1-h4 → un tramo por título,
 *    con la ruta «Padre › Hijo».
 *  - Las hojas/páginas de tamaño fijo no tienen títulos de verdad (el texto
 *    son cajas sueltas) → un tramo por hoja.
 *  - Lo que no encaje en nada → trozos de tamaño fijo.
 */

export interface Tramo {
  ruta: string;
  texto: string;
  /** URLs de las figuras que caen en este tramo. */
  figuras: string[];
  /** 1-4 con títulos; 1 en hojas y trozos. */
  nivel: number;
  /** El último eslabón de la ruta. */
  titulo: string;
}

export type ModoSegmento = 'titulos' | 'hojas' | 'trozos';

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
export function aTexto(html: string): string {
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

export function figurasDe(html: string): string[] {
  const urls = new Set<string>();
  for (const m of html.matchAll(/<img\b[^>]*?\bsrc="([^"]+)"/gi)) urls.add(decodificar(m[1]));
  for (const m of html.matchAll(/<a\b[^>]*?\bhref="([^"]+\.(?:avif|webp|png|jpe?g))"/gi)) urls.add(decodificar(m[1]));
  return [...urls].map(urlCanonica).filter((u): u is string => u !== null);
}

/** Clave de comparación: sin tildes, sin mayúsculas y SIN espacios (las hojas pegan palabras sueltas). */
export function normalizar(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9ñ]/g, '');
}

/** «Complemento: vía clásica» → `complemento-via-clasica` (id legible de una sección). */
export function slug(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9ñ]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'seccion';
}

export function porTitulos(html: string): Tramo[] | null {
  const titulos = [...html.matchAll(/<h([1-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi)];
  if (titulos.length < 3) return null;
  const tramos: Tramo[] = [];
  const pila: { nivel: number; texto: string }[] = [];
  // Lo de antes del primer título (portada, índice) también cuenta.
  const inicio = html.slice(0, titulos[0].index);
  if (aTexto(inicio).length > 40) tramos.push({ ruta: 'Inicio', titulo: 'Inicio', nivel: 1, texto: aTexto(inicio), figuras: figurasDe(inicio) });
  titulos.forEach((t, i) => {
    const nivel = Number(t[1]);
    const nombre = aTexto(t[2]).replace(/\s+/g, ' ').slice(0, 120) || `Sección ${i + 1}`;
    while (pila.length && pila[pila.length - 1].nivel >= nivel) pila.pop();
    pila.push({ nivel, texto: nombre });
    const fin = i + 1 < titulos.length ? titulos[i + 1].index : html.length;
    const cuerpo = html.slice(t.index, fin);
    tramos.push({ ruta: pila.map((p) => p.texto).join(' › '), titulo: nombre, nivel, texto: aTexto(cuerpo), figuras: figurasDe(cuerpo) });
  });
  return tramos;
}

export function porHojas(html: string): Tramo[] | null {
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
    const ruta = `Hoja ${i + 1}${primera ? ` — ${primera}` : ''}`;
    return { ruta, titulo: ruta, nivel: 1, texto, figuras: figurasDe(cuerpo) };
  });
}

export function porTrozos(html: string): Tramo[] {
  const texto = aTexto(html);
  const tramos: Tramo[] = [];
  const paso = 6_000;
  for (let i = 0; i < texto.length; i += paso) {
    const ruta = `Parte ${tramos.length + 1}`;
    tramos.push({ ruta, titulo: ruta, nivel: 1, texto: texto.slice(i, i + paso), figuras: [] });
  }
  if (tramos.length) tramos[0].figuras = figurasDe(html);
  return tramos;
}

/** El resumen en tramos y cómo se partió (el índice lo anota como su «calidad»). */
export function segmentar(html: string): { modo: ModoSegmento; tramos: Tramo[] } {
  const t = porTitulos(html);
  if (t) return { modo: 'titulos', tramos: t.filter((x) => x.texto.length > 0) };
  const h = porHojas(html);
  if (h) return { modo: 'hojas', tramos: h.filter((x) => x.texto.length > 0) };
  return { modo: 'trozos', tramos: porTrozos(html).filter((x) => x.texto.length > 0) };
}

/** El `<h1>` del documento, si lo trae. */
export function tituloDe(html: string): string | null {
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  return h1 ? aTexto(h1).slice(0, 140) : null;
}
