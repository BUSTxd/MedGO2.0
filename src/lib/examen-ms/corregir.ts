/**
 * Corrector de respuestas escritas del examen 3D de miembro superior.
 *
 * Normaliza (mayúsculas, tildes, puntos, espacios), expande las abreviaturas
 * oficiales (n., a., v., m., lig., r.) y unifica ordinales (1er, 1.º, primer → 1)
 * antes de comparar. El prefijo «músculo»/«hueso» es opcional; el de «nervio»,
 * «arteria» y «vena» no, porque «radial» o «cubital» solos no dicen qué son.
 *
 * Erratas: una letra en una palabra de 7 o más se acepta con aviso, salvo que lo
 * escrito quede igual de cerca de OTRA estructura (radial/radio, cubital/cúbito).
 */

import { levenshtein, normalizar } from '@/lib/utils/texto';
import type { PreguntaMS, RespuestaB } from './tipos';

const ABREVIATURAS: Record<string, string> = {
  n: 'nervio', nn: 'nervios', a: 'arteria', aa: 'arterias', v: 'vena', vv: 'venas',
  m: 'musculo', mm: 'musculos', lig: 'ligamento', ligs: 'ligamentos', r: 'rama', rr: 'ramas',
};
const ORDINALES: Record<string, string> = {
  primer: '1', primero: '1', primera: '1', segundo: '2', segunda: '2', tercer: '3', tercero: '3', tercera: '3',
  cuarto: '4', cuarta: '4', quinto: '5', quinta: '5',
};
const ARTICULOS = new Set(['el', 'la', 'los', 'las', 'un', 'una']);
/** Prefijos de categoría que se pueden omitir («músculo bíceps braquial» = «bíceps braquial»). */
const PREFIJO_OPCIONAL = /^(musculos?|huesos?) /;

/** Forma comparable de un texto. */
export function clave(texto: string): string {
  // «n. mediano», «a.radial», «lig. anular»: la abreviatura lleva punto.
  let t = texto.replace(/\b(nn|n|aa|a|vv|v|mm|m|ligs|lig|rr|r)\.\s*/gi, (_, ab: string) => `${ABREVIATURAS[ab.toLowerCase()]} `);
  t = normalizar(t)
    // 1.er, 1er, 1ro, 1º → 1
    .replace(/\b(\d+)\s*(er|ro|do|to|vo|no|o|a)\b/g, '$1');
  const palabras = t.split(' ').filter(Boolean).map((p) => ORDINALES[p] ?? p).filter((p) => !ARTICULOS.has(p));
  // Sin punto, la abreviatura solo cuenta al principio («n mediano»).
  if (palabras.length > 1 && ['n', 'a', 'v', 'm'].includes(palabras[0])) palabras[0] = ABREVIATURAS[palabras[0]];
  return palabras.join(' ');
}

/** Lo escrito sin el prefijo opcional («hueso trapecio» → «trapecio»). */
const sinPrefijo = (k: string) => k.replace(PREFIJO_OPCIONAL, '');

/** Índice de todas las formas del léxico → estructura, para desambiguar. */
export interface IndiceFormas {
  porClave: Map<string, Set<string>>;
  claves: string[];
}
export function indexarFormas(formas: Record<string, string[]>): IndiceFormas {
  const porClave = new Map<string, Set<string>>();
  for (const [nombre, lista] of Object.entries(formas)) {
    for (const f of [nombre, ...lista]) {
      const k = clave(f);
      if (!k) continue;
      if (!porClave.has(k)) porClave.set(k, new Set());
      porClave.get(k)!.add(nombre);
    }
  }
  return { porClave, claves: [...porClave.keys()] };
}

/** Una letra de diferencia en UNA palabra de 7 o más letras (mismo número de palabras). */
function errata(a: string, b: string): boolean {
  const pa = a.split(' '), pb = b.split(' ');
  if (pa.length !== pb.length) return false;
  let distintas = 0;
  for (let i = 0; i < pa.length; i++) {
    if (pa[i] === pb[i]) continue;
    if (++distintas > 1) return false;
    if (Math.max(pa[i].length, pb[i].length) < 7 || levenshtein(pa[i], pb[i]) !== 1) return false;
  }
  return distintas === 1;
}

export type Veredicto = 'bien' | 'casi' | 'mal';

/**
 * Compara lo escrito con las formas de UNA estructura.
 * `bien` = coincide; `casi` = errata aceptada (con aviso); `mal` = no.
 */
export function compararNombre(escrito: string, aceptadas: string[], noConfundir: string[], indice: IndiceFormas, propia?: string): Veredicto {
  const completo = clave(escrito);
  if (!completo) return 'mal';
  // «hueso trapecio» para el músculo trapecio: lo que está en noConfundir manda
  // antes de quitar el prefijo.
  if (noConfundir.some((n) => clave(n) === completo)) return 'mal';
  const mias = new Set(aceptadas.flatMap((a) => [clave(a), sinPrefijo(clave(a))]));
  if (mias.has(completo)) return 'bien';
  const k = sinPrefijo(completo);
  if (mias.has(k)) return 'bien';
  if (noConfundir.some((n) => clave(n) === k)) return 'mal';
  // Coincide exacto con otra estructura: no es una errata de esta.
  const duenos = indice.porClave.get(k);
  if (duenos && (!propia || !duenos.has(propia))) return 'mal';
  if (![...mias].some((m) => errata(k, m))) return 'mal';
  // La errata no puede quedar igual de cerca de una forma ajena.
  for (const otra of indice.claves) {
    if (mias.has(otra)) continue;
    const de = indice.porClave.get(otra)!;
    if (propia && de.has(propia)) continue;
    if (errata(k, otra)) return 'mal';
  }
  for (const n of noConfundir) if (errata(k, clave(n))) return 'mal';
  return 'casi';
}

/** La forma más larga del léxico contenida (por palabras enteras) en lo escrito. */
function formaContenida(k: string, indice: IndiceFormas): string | null {
  const conBordes = ` ${k} `;
  let mejor: string | null = null;
  for (const f of indice.claves) {
    if (f.length <= (mejor?.length ?? 0)) continue;
    if (conBordes.includes(` ${f} `)) mejor = f;
  }
  return mejor;
}

function cumpleConceptos(k: string, r: RespuestaB): boolean {
  if (!r.conceptos?.length) return false;
  const palabras = ` ${k} `;
  const tiene = (kw: string) => palabras.includes(` ${clave(kw)}`);
  if (r.excluye?.some((x) => palabras.includes(` ${clave(x)} `))) return false;
  return r.conceptos.every((grupo) => grupo.some(tiene));
}

/** ¿Este fragmento responde a esta respuesta esperada? */
function encaja(fragmento: string, r: RespuestaB, indice: IndiceFormas): Veredicto {
  const k = clave(fragmento);
  if (!k) return 'mal';
  // Una forma aceptada escrita tal cual vale aunque contenga una palabra de `excluye`
  // («rotación lateral del ángulo inferior»); `excluye` solo filtra lo que se
  // reconoce por conceptos o por contener el nombre.
  if (r.aceptadas.some((a) => clave(a) === k)) return 'bien';
  if (r.excluye?.some((x) => ` ${k} `.includes(` ${clave(x)} `))) return 'mal';
  const v = compararNombre(fragmento, r.aceptadas, r.noConfundir ?? [], indice, r.ref);
  if (v !== 'mal') return v;
  if (cumpleConceptos(k, r)) return 'bien';
  // «mitad medial del flexor profundo de los dedos» → flexor profundo de los dedos:
  // vale si la forma más larga que contiene es de esta misma estructura.
  if (r.ref) {
    const f = formaContenida(k, indice);
    if (f && indice.porClave.get(f)?.has(r.ref)) return 'bien';
  }
  return 'mal';
}

export interface CorreccionA {
  veredicto: Veredicto;
}

export function corregirA(escrito: string, p: PreguntaMS, indice: IndiceFormas): CorreccionA {
  return { veredicto: compararNombre(escrito, p.preguntaA.aceptadas, p.preguntaA.noConfundir, indice) };
}

export interface CorreccionB {
  /** 1 si la B está bien (todas las necesarias y ninguna incorrecta), 0 si no o si la A estuvo mal. */
  puntaje: number;
  /** Respuestas esperadas que acertó (índice en `respuestas`) y lo que escribió. */
  acertadas: { indice: number; escrito: string; errata: boolean }[];
  /** Fragmentos que no responden a nada de lo esperado. */
  incorrectas: string[];
  /** Índices de las respuestas esperadas que no escribió. */
  faltan: number[];
  /** Cuántas hacían falta para el puntaje completo. */
  necesarias: number;
}

/** Separa lo escrito por comas, punto y coma, barras y saltos de línea, sin cortar dentro de paréntesis. */
function trocear(texto: string): string[] {
  const trozos: string[] = [];
  let actual = '';
  let nivel = 0;
  for (const ch of texto) {
    if (ch === '(') nivel++;
    if (ch === ')') nivel = Math.max(0, nivel - 1);
    if (nivel === 0 && (ch === ',' || ch === ';' || ch === '\n' || ch === '/')) { trozos.push(actual); actual = ''; continue; }
    actual += ch;
  }
  trozos.push(actual);
  return trozos.map((t) => t.trim()).filter(Boolean);
}

const partesConY = (t: string) => t.split(/\s+(?:y|e)\s+/i).map((x) => x.trim()).filter(Boolean);

/**
 * Corrige la B. Cada elemento escrito se compara por separado contra cada
 * respuesta esperada (para mostrar qué acertó, qué faltó y qué sobra); la B vale
 * solo si escribió `pide` correctas (o todas, si `todas`) y ninguna incorrecta.
 * Si la A estuvo mal, la B vale 0 aunque esté bien escrita.
 */
export function corregirB(escrito: string, p: PreguntaMS, aCorrecta: boolean, indice: IndiceFormas): CorreccionB {
  const rs = p.preguntaB.respuestas;
  const usadas = new Set<number>();
  const acertadas: CorreccionB['acertadas'] = [];
  const incorrectas: string[] = [];

  /** Qué respuesta esperada (libre) responde este texto, sin asignarla todavía. */
  const buscar = (frag: string): { i: number; v: Veredicto } | 'repetida' | null => {
    let repetida = false;
    for (let i = 0; i < rs.length; i++) {
      const v = encaja(frag, rs[i], indice);
      if (v === 'mal') continue;
      if (usadas.has(i)) { repetida = true; continue; }
      return { i, v };
    }
    return repetida ? 'repetida' : null;
  };
  const asignar = (frag: string, h: { i: number; v: Veredicto }) => {
    usadas.add(h.i);
    acertadas.push({ indice: h.i, escrito: frag, errata: h.v === 'casi' });
  };
  /** Un trozo: primero por partes con «y» si TODAS responden algo; si no, entero. */
  const corregirTrozo = (trozo: string): boolean => {
    const partes = partesConY(trozo);
    if (partes.length > 1 && partes.every((p) => buscar(p) !== null)) {
      // Se asignan de una en una: así dos partes no se quedan con la misma respuesta.
      const antes = acertadas.length;
      for (const p of partes) { const h = buscar(p); if (h && h !== 'repetida') asignar(p, h); }
      if (acertadas.length - antes > 1) return true;
      // Solo una parte respondía algo nuevo: se deshace y se prueba el trozo entero.
      for (const a of acertadas.splice(antes)) usadas.delete(a.indice);
    }
    const h = buscar(trozo);
    if (h === 'repetida') return true;
    if (h) { asignar(trozo, h); return true; }
    return false;
  };

  // «Raíces C5, C6 y C7» o «cara posterior del húmero, tercio superior»: si unir
  // trozos seguidos responde algo que por separado no, se unen.
  const trozos = trocear(escrito);
  for (let i = 0; i < trozos.length; i++) {
    let hecho = false;
    for (let largo = Math.min(4, trozos.length - i); largo >= 2 && !hecho; largo--) {
      const unido = trozos.slice(i, i + largo).join(', ');
      if (!trozos.slice(i, i + largo).every((t) => buscar(t)) && buscar(unido)) {
        hecho = corregirTrozo(unido);
        if (hecho) i += largo - 1;
      }
    }
    if (hecho) continue;
    if (!corregirTrozo(trozos[i])) {
      // Por partes, lo que sí responde algo se cuenta y el resto es incorrecto.
      const partes = partesConY(trozos[i]);
      const sueltas = partes.length > 1 ? partes.filter((p) => !corregirTrozo(p)) : [trozos[i]];
      incorrectas.push(...(sueltas.length === partes.length ? [trozos[i]] : sueltas));
    }
  }

  // Regla del examen real (BUST): la B vale entera o nada. Hay que escribir las
  // `necesarias` bien, y un solo elemento incorrecto la tumba.
  const necesarias = p.preguntaB.todas ? rs.length : Math.min(p.preguntaB.pide, rs.length);
  const puntaje = aCorrecta && acertadas.length >= necesarias && !incorrectas.length ? 1 : 0;
  const faltan = rs.map((_, i) => i).filter((i) => !usadas.has(i));
  return { puntaje, acertadas, incorrectas, faltan, necesarias };
}
