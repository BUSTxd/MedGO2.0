import 'server-only';

/**
 * Límite de peticiones por clave (usuario o IP) en una ventana fija, en memoria
 * de la instancia. No es un límite global —cada instancia lleva su cuenta—, pero
 * con Fluid Compute las instancias se reutilizan y basta para que un bucle desde
 * un solo origen no llene una tabla ni gaste la cuota de Realtime. Si hiciera
 * falta un límite duro, va en el Firewall de Vercel.
 */
const contadores = new Map<string, { n: number; desde: number }>();

export function pasaElFreno(clave: string, max: number, ventanaMs = 60_000): boolean {
  const ahora = Date.now();
  const r = contadores.get(clave);
  if (!r || ahora - r.desde > ventanaMs) {
    if (contadores.size > 10_000) contadores.clear();
    contadores.set(clave, { n: 1, desde: ahora });
    return true;
  }
  r.n += 1;
  return r.n <= max;
}
