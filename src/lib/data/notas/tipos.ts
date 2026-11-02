// Notas de una clase: el resumen práctico de la pestaña «Notas» de /estudio. Una
// comparación lado a lado y unas claves sueltas. Con solo tipos: esto sí puede
// importarlo un componente de cliente, el contenido no (`./index.ts`).

export type LadoNota = string | string[];

export type NotaClase = {
  titulo: string;
  entrada: string;
  /** Lo que se compara: dos columnas con su nombre. */
  comparacion: {
    titulo: string;
    columnas: [string, string];
    filas: { nombre: string; a: LadoNota; b: LadoNota; clave?: string }[];
  };
  /** Hallazgos que se explican uno a uno. `flujo`: una cadena de causas, en orden. */
  claves: {
    titulo: string;
    filas: { nombre: string; donde: string; columna: 0 | 1; texto?: string; flujo?: string[] }[];
  };
};
