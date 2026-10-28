/**
 * Qué pasarela cobra a cada alumno: Mercado Pago en el Perú (soles) y Creem
 * en el resto del mundo (dólares). El país sale de la IP (`x-vercel-ip-country`,
 * en `api/pago/pais`); el modal de compra deja cambiarlo a mano por si alguien
 * está de viaje o usa una VPN.
 */
export type Pasarela = 'mercadopago' | 'creem';

export function pasarelaDePais(pais: string | null | undefined): Pasarela {
  // Sin país (en local no hay cabecera de Vercel) se queda en Mercado Pago.
  if (!pais) return 'mercadopago';
  return pais.toUpperCase() === 'PE' ? 'mercadopago' : 'creem';
}
