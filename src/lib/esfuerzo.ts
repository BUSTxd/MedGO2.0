/**
 * Panel «Tu esfuerzo» del home: el círculo de invocación se completa al llegar
 * a esta racha. La comparten el botón (señal) y /api/esfuerzo/invocar (cerradura).
 */
export const RACHA_INVOCAR = 20;

// Nombres con versión: /assets/esfuerzo/* se sirve immutable (next.config.mjs).
// Si se regenera un sprite, subir la versión aquí y en su script de scripts/esfuerzo/.
export const SPRITE_CIRCULO = '/assets/esfuerzo/circulo_invocacion_v1.png';
/** Célula con sombra: la del panel y la tarjeta (16 fotogramas de 32×32). */
export const SPRITE_CELULA = '/assets/esfuerzo/celula_sombra_v1.png';
/** Célula sin sombra y con paleta reducida: el puntero del mouse. */
export const SPRITE_PUNTERO = '/assets/esfuerzo/celula_puntero_v1.png';
