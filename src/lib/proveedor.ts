/**
 * Quién está detrás de MedGO, para Términos, Privacidad y el Libro de
 * Reclamaciones. Un solo sitio: si algo cambia (RUC, domicilio), cambia en todas
 * las páginas a la vez.
 *
 * `ruc` en `null` no se pinta (nunca un hueco de relleno). El domicilio NO va
 * aquí: el repo es público y este archivo llega al navegador. Vive en la
 * variable `PROVEEDOR_DOMICILIO` (Vercel) y solo sale en la hoja ya registrada
 * del Libro de Reclamaciones (`domicilioProveedor()` de `proveedor-server.ts`).
 */
export const PROVEEDOR = {
  nombreComercial: 'MedGO',
  titular: 'Fernand Gonzalo Durand Bustamante',
  ruc: '10705926315' as string | null,
  web: 'www.medgoplus.com',
};
