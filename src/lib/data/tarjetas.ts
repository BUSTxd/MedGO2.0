/**
 * El banqueo de tarjetas de una actividad, igual en todos los cursos. Lo lee
 * `TarjetasDeCurso`, que es quien monta el runner: un curso nuevo sólo declara
 * esto en su sílabo y registra la clave en `EXAMENES` de la route.
 *
 * Es el tercer envase de la tarjeta «Banqueo», para clases magistrales y TBL:
 * repaso rápido en dos modos, no un simulacro de examen. Los parciales y
 * finales siguen con `ExamenRef` y la hoja larga de `ExamRunner`.
 */
export interface TarjetasRef {
  /** Clave en el bucket `examenes`, sin `.json` (`inmunologia/tbl-3-vacunas`). */
  key: string;
  /** Sobreescribe la descripción de la tarjeta del sílabo. */
  desc?: string;
}
