/**
 * Qué pasarela cobra a cada alumno: Mercado Pago en el Perú (soles) y Creem
 * en el resto del mundo (dólares). El país sale de la IP (`x-vercel-ip-country`,
 * en `api/pago/pais`); el modal de compra deja cambiarlo a mano por si alguien
 * está de viaje o usa una VPN.
 */
export type Pasarela = 'mercadopago' | 'creem';

/**
 * ¿Ya cobra Creem? Hasta que Creem apruebe la cuenta (revisión de su equipo),
 * su checkout responde «Live payments are not enabled»: mientras tanto todos
 * pagan con Mercado Pago. El día de la aprobación, pasarlo a `true`.
 */
export const CREEM_COBROS_ACTIVOS = false;

export function pasarelaDePais(pais: string | null | undefined): Pasarela {
  // Sin país (en local no hay cabecera de Vercel) se queda en Mercado Pago.
  if (!pais) return 'mercadopago';
  return pais.toUpperCase() === 'PE' ? 'mercadopago' : 'creem';
}
