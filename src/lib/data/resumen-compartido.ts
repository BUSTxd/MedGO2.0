/**
 * Resúmenes compartidos entre clases que el sílabo separa pero enseñan lo
 * mismo: la magistral «Anatomía del hígado y vías biliares» y la «Práctica de
 * Anatomía 5 — Hígado y vías biliares» son el mismo tema, visto en el aula y
 * sobre el cadáver. La práctica muestra el resumen de su magistral en vez de
 * quedar vacía (y contar como hueco en el panel de avance).
 *
 * Se aplica al cargar el sílabo, mutando `semanas`, para que la página, el
 * índice, `acceso-resumen.ts` y el panel vean lo mismo. Se toma de la clase
 * origen en vez de copiar el objeto: una opción nueva llega a las dos.
 *
 * La clase que recibe un resumen queda marcada `resumenCompartido`, y con eso
 * deja de ser libre aunque su tipo lo sea: si no, el resumen de pago de la
 * magistral se descargaría gratis desde la práctica (mismo trato que
 * `esLibre` de Aparato Locomotor).
 */

type Formato = 'pdf' | 'html';

interface Opcion {
  id: string;
  label: string;
  formato?: Formato;
}

interface ActConResumen {
  id: string;
  resumen?: { tipo: 'pdf'; formato?: Formato; opciones?: Opcion[] };
  resumenCompartido?: boolean;
}

/** La clase origen, o `[clase, etiqueta]` cuando el selector junta varias. */
export type Fuente = string | readonly [string, string];

export function compartirResumenes(
  semanas: readonly { actividades: ActConResumen[] }[],
  mapa: Readonly<Record<string, readonly Fuente[]>>,
): void {
  const porId = new Map<string, ActConResumen>();
  for (const semana of semanas) for (const a of semana.actividades) porId.set(a.id, a);

  for (const [destinoId, fuentes] of Object.entries(mapa)) {
    const destino = porId.get(destinoId);
    // Una clase que ya trae resumen propio se respeta.
    if (!destino || destino.resumen) continue;

    const opciones: Opcion[] = [];
    for (const fuente of fuentes) {
      const [id, etiqueta] = typeof fuente === 'string' ? [fuente, undefined] : fuente;
      const r = porId.get(id)?.resumen;
      if (!r) continue;
      // Sin opciones, la tarjeta pide el archivo con el id de la clase.
      const propias = r.opciones ?? [{ id, label: 'Resumen' }];
      for (const o of propias) {
        if (opciones.some((x) => x.id === o.id)) continue;
        opciones.push({
          ...o,
          formato: o.formato ?? r.formato,
          // La etiqueta sólo sustituye a un «Resumen» genérico de opción única.
          label: etiqueta && propias.length === 1 ? etiqueta : o.label,
        });
      }
    }
    if (opciones.length === 0) continue;

    destino.resumen = { tipo: 'pdf', formato: opciones[0].formato, opciones };
    destino.resumenCompartido = true;
  }
}
