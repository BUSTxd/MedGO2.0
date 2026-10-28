/**
 * Qué pasarela cobra a cada alumno: Mercado Pago en el Perú (soles) y Creem
 * en el resto del mundo (dólares). El país sale de la IP (`x-vercel-ip-country`,
 * en `api/pago/pais`); el modal de compra deja cambiarlo a mano por si alguien
 * está de viaje o usa una VPN.
 */
export type Pasarela = 'mercadopago' | 'creem';

/**
 * ¿Se ofrece Creem fuera del Perú? Encendido también durante la revisión de la
 * cuenta: su equipo prueba la compra con un código de descuento del 100 %, y
 * para eso tiene que llegar a su checkout desde la web. Hasta la aprobación,
 * una compra sin código responde «Live payments are not enabled»; el modal deja
 * pasar a Mercado Pago desde cualquier país. Con `false`, todos van a Mercado Pago.
 */
export const CREEM_COBROS_ACTIVOS = true;

export function pasarelaDePais(pais: string | null | undefined): Pasarela {
  // Sin país (en local no hay cabecera de Vercel) se queda en Mercado Pago.
  if (!pais) return 'mercadopago';
  return pais.toUpperCase() === 'PE' ? 'mercadopago' : 'creem';
}
