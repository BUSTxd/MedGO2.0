/**
 * Qué pasarela cobra a cada alumno: Mercado Pago en el Perú (soles) y Creem
 * en el resto del mundo (dólares). El país sale de la IP (`x-vercel-ip-country`,
 * en `api/pago/pais`); el modal de compra deja cambiarlo a mano por si alguien
 * está de viaje o usa una VPN.
 */
export type Pasarela = 'mercadopago' | 'creem';

/**
 * ¿Se ofrece Creem fuera del Perú? Con `false`, todos van a Mercado Pago.
 *
 * Encendido de nuevo el 2026-11-03, tras editar sus 3 productos en el panel de
 * Creem: US$ 6,99/mes, 23,99 cada 6 meses y 38,99/año, igual que `PLANS`. Si se
 * cambia un precio aquí, hay que cambiarlo también allí, o apagarlo mientras tanto.
 */
export const CREEM_COBROS_ACTIVOS = true;

/**
 * Zona de precios de Creem. `europa`: Unión Europea, Reino Unido, Noruega, Islandia,
 * Liechtenstein y Suiza, donde Creem cobra un IVA alto que sale del precio; el resto
 * del mundo paga el precio `general`. Se decide por la IP, igual que la pasarela.
 */
export type Zona = 'general' | 'europa';

const PAISES_EUROPA = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE',
  'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  'GB', 'NO', 'IS', 'LI', 'CH',
]);

export function zonaDePais(pais: string | null | undefined): Zona {
  return pais && PAISES_EUROPA.has(pais.toUpperCase()) ? 'europa' : 'general';
}

export function pasarelaDePais(pais: string | null | undefined): Pasarela {
  // Sin país (en local no hay cabecera de Vercel) se queda en Mercado Pago.
  if (!pais) return 'mercadopago';
  return pais.toUpperCase() === 'PE' ? 'mercadopago' : 'creem';
}
