import type { Ficha } from '@/lib/data/atlas-3d/fichas/tipos';
import s from '@/styles/atlas3d.module.css';

/** Campos de cada tipo de ficha, en el orden en que se estudian. */
const CAMPOS: { [T in Ficha['tipo']]: [keyof Extract<Ficha, { tipo: T }>, string][] } = {
  musculo: [['origen', 'Origen'], ['insercion', 'Inserción'], ['inervacion', 'Inervación'], ['accion', 'Acción'], ['irrigacion', 'Irrigación']],
  nervio: [['origen', 'Origen'], ['recorrido', 'Recorrido'], ['motor', 'Inerva'], ['sensitivo', 'Sensibilidad']],
  hueso: [['clase', 'Tipo'], ['partes', 'Partes'], ['articulaciones', 'Articulaciones']],
  arteria: [['origen', 'Origen'], ['recorrido', 'Recorrido'], ['ramas', 'Ramas'], ['irriga', 'Irriga']],
  vena: [['origen', 'Origen'], ['recorrido', 'Recorrido'], ['desemboca', 'Desemboca en'], ['drena', 'Drena']],
  conectivo: [['une', 'Une / ubicación'], ['funcion', 'Función']],
};

export default function FichaDetalle({ ficha }: { ficha: Ficha | undefined }) {
  if (!ficha) return null;
  const campos = CAMPOS[ficha.tipo] as [string, string][];
  const valor = (k: string) => (ficha as unknown as Record<string, string | string[] | undefined>)[k];
  return (
    <>
      <dl className={s.fichaDatos}>
        {campos.map(([k, etiqueta]) => {
          const v = valor(k);
          if (!v || (Array.isArray(v) && !v.length)) return null;
          return (
            <div key={k}>
              <dt>{etiqueta}</dt>
              <dd>
                {Array.isArray(v) ? (
                  <ul>
                    {v.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                ) : (
                  v
                )}
              </dd>
            </div>
          );
        })}
      </dl>
      {ficha.nota && (
        <p className={s.fichaNota}>
          <strong>Para recordar</strong>
          {ficha.nota}
        </p>
      )}
    </>
  );
}
