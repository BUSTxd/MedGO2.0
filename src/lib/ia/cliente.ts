import 'server-only';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Cliente de Anthropic. La key sale SOLO de `ANTHROPIC_API_KEY` (Vercel y
 * `.env.local`, nunca `NEXT_PUBLIC_`, nunca en el repo). Sin ella devuelve
 * `null` y la ruta responde 503: así todo el sistema se puede construir y
 * probar antes de tener la key.
 */
let cliente: Anthropic | null = null;

export function clienteIA(): Anthropic | null {
  if (cliente) return cliente;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  cliente = new Anthropic({ apiKey, maxRetries: 1, timeout: 90_000 });
  return cliente;
}
