import 'server-only';
import { ACCION, CREDITOS_POR_USD, PRECIO, type Accion } from './config';

export interface Uso {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number | null;
  cache_read_input_tokens?: number | null;
}

/** Costo real en US$ de una respuesta, a partir de su `usage`. */
export function costoUsd(uso: Uso): number {
  const escritura = uso.cache_creation_input_tokens ?? 0;
  const lectura = uso.cache_read_input_tokens ?? 0;
  const prompt = uso.input_tokens + escritura + lectura;
  const largo = prompt > PRECIO.umbralLargo;
  const pIn = (largo ? PRECIO.entradaLarga : PRECIO.entrada) / 1e6;
  const pOut = (largo ? PRECIO.salidaLarga : PRECIO.salida) / 1e6;
  return (
    uso.input_tokens * pIn +
    escritura * pIn * PRECIO.cacheEscritura +
    lectura * pIn * PRECIO.cacheLectura +
    uso.output_tokens * pOut
  );
}

export function aCreditos(usd: number): number {
  return Math.max(1, Math.ceil(usd * CREDITOS_POR_USD));
}

/** Tokens aproximados de un texto en español (cota alta: ~3 caracteres por token). */
export function tokensDe(chars: number): number {
  return Math.ceil(chars / 3);
}

/**
 * Lo máximo que puede costar una petición: toda la entrada escrita en caché
 * (lo más caro) y la salida hasta el tope. Es lo que se reserva; al terminar
 * se cobra lo real y se devuelve el resto.
 */
export function creditosMaximos(accion: Accion, tokensEntrada: number): number {
  const salida = ACCION[accion].maxTokens;
  return aCreditos(costoUsd({
    input_tokens: 0,
    cache_creation_input_tokens: tokensEntrada,
    output_tokens: salida,
  }));
}

/** Precio orientativo («~50 créditos») que se enseña antes de pulsar. */
export function creditosTipicos(): Record<Accion, number> {
  const fuera = {} as Record<Accion, number>;
  for (const a of Object.keys(ACCION) as Accion[]) {
    const t = ACCION[a].tipico;
    fuera[a] = aCreditos(costoUsd({ input_tokens: t.entrada, output_tokens: t.salida }));
  }
  return fuera;
}
