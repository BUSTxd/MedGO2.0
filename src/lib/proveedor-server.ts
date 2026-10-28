import 'server-only';

/**
 * Domicilio fiscal del titular. Se guarda fuera del repo (variable de entorno)
 * y solo se muestra en la hoja del Libro de Reclamaciones una vez registrada:
 * la norma lo exige en la hoja, pero no hace falta publicarlo en la web.
 */
export function domicilioProveedor(): string | null {
  return process.env.PROVEEDOR_DOMICILIO?.trim() || null;
}
