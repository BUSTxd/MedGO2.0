/**
 * Sanea el <style> de un export para poder inyectarlo dentro del fragmento.
 *
 * Lo usan `upload-resumen-doc.mjs` y `upload-resumen-capas.mjs`. La idea es la
 * misma en los dos: la maquetación propia del documento —rejillas, posiciones
 * de cada hoja, tipografías, colores— **es el documento**, y tirarla lo
 * desarma; pero su hoja de estilo también trae reglas globales que pisarían el
 * dashboard entero. Así que ni se descarta ni se copia tal cual: se recorta.
 *
 * Qué se hace con cada regla:
 *   · selectores globales (`html`, `body`, `*`) → fuera;
 *   · `:root` → pasa a ser el propio contenedor, para que sus custom
 *     properties sigan resolviéndose sin escaparse;
 *   · los que casen `descartar` → fuera (los usa el envase en capas para
 *     quedarse con el control de la página y del escalado);
 *   · todo lo demás → prefijado con el contenedor, de modo que no puede
 *     alcanzar nada del visor.
 *
 * Un <style> inyectado con dangerouslySetInnerHTML **sí se aplica** (a
 * diferencia de un <script>, que no se ejecuta), y por eso esto es viable.
 */

const ES_GLOBAL = /^(\*|html|body)$/i;

/**
 * @param {string} css     contenido de los <style> del documento
 * @param {object} opts
 * @param {string} opts.prefijo    selector del contenedor, p. ej. '.capas'
 * @param {RegExp} [opts.descartar] selectores que no deben sobrevivir
 * @returns {string} CSS en una línea, prefijado y sin reglas globales
 */
export function sanearCss(css, { prefijo, descartar } = {}) {
  const prefijarSelector = (sel) =>
    sel.split(',').map(s => s.trim()).filter(Boolean).map(s => {
      if (ES_GLOBAL.test(s) || /^html\b|^body\b/i.test(s)) return null;
      if (descartar?.test(s)) return null;
      if (s === ':root') return prefijo;
      return `${prefijo} ${s}`;
    }).filter(Boolean).join(', ');

  const recorrer = (texto) => {
    let out = '';
    let i = 0;
    while (i < texto.length) {
      const llave = texto.indexOf('{', i);
      if (llave === -1) break;
      const cabecera = texto.slice(i, llave).trim();

      if (cabecera.startsWith('@')) {
        // bloque anidado (@media, @supports): recortar por balance de llaves
        let nivel = 0, j = llave;
        for (; j < texto.length; j++) {
          if (texto[j] === '{') nivel++;
          else if (texto[j] === '}' && --nivel === 0) break;
        }
        // @media print no aporta nada en un visor y puede confundir
        if (!/^@media\s+print/i.test(cabecera)) {
          const dentro = recorrer(texto.slice(llave + 1, j));
          if (dentro.trim()) out += `${cabecera}{${dentro}}`;
        }
        i = j + 1;
        continue;
      }

      const cierre = texto.indexOf('}', llave);
      const decls = texto.slice(llave + 1, cierre).trim();
      const sel = prefijarSelector(cabecera);
      if (sel && decls) out += `${sel}{${decls}}`;
      i = cierre + 1;
    }
    return out;
  };

  return recorrer(css.replace(/\/\*[\s\S]*?\*\//g, ''))
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extrae y concatena el contenido de todos los <style> de un documento. */
export function estilosDe(html) {
  return [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join('\n');
}
