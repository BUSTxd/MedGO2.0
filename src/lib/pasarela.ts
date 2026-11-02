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
 * Apagado desde el 2026-11-02: sus productos siguen con los precios de antes
 * (hasta US$ 179 cada 2 años) y la web mostraría otros. Encender solo después de
 * `scripts/creem/actualizar-productos.mjs --aplicar`. Su equipo prueba la compra
 * con un código de descuento del 100 % durante la revisión de la cuenta, y para eso
 * tiene que llegar a su checkout desde la web; hasta la aprobación, una compra sin
 * código responde «Live payments are not enabled».
 */
export const CREEM_COBROS_ACTIVOS = false;

export function pasarelaDePais(pais: string | null | undefined): Pasarela {
  // Sin país (en local no hay cabecera de Vercel) se queda en Mercado Pago.
  if (!pais) return 'mercadopago';
  return pais.toUpperCase() === 'PE' ? 'mercadopago' : 'creem';
}
