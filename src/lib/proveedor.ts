/**
 * Quién está detrás de MedGO, para Términos, Privacidad y el Libro de
 * Reclamaciones. Un solo sitio: si algo cambia (RUC, domicilio), cambia en todas
 * las páginas a la vez.
 *
 * `ruc` y `domicilio` quedan en `null` hasta tenerlos: las páginas solo pintan
 * lo que hay, nunca un hueco de relleno.
 */
export const PROVEEDOR = {
  nombreComercial: 'MedGO',
  titular: 'Fernand Gonzalo Durand Bustamante',
  ruc: null as string | null,
  domicilio: null as string | null,
  web: 'www.medgoplus.com',
};
