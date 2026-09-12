/**
 * El banqueo de una actividad, igual en todos los cursos. Lo lee
 * `ExamenDeCurso`, que es quien monta el runner: un curso nuevo sólo declara
 * esto en su sílabo y registra las claves en `EXAMENES` de la route.
 */
export interface ExamenRef {
  /** Banqueo que abre por defecto (el más reciente, cuando hay varios años). */
  key: string;
  /** Abre el banqueo a cualquier cuenta, aunque el curso sea de pago. */
  free?: boolean;
  /** Grupos adicionales (B, C, …); cada uno se descarga solo al pulsar su cuadro. */
  groups?: string[];
  /**
   * Rótulo de cada banqueo, por su clave (`key` y cada una de `groups`). Con él
   * el selector deja de decir A/B/C y nombra cada JSON por el año del examen del
   * que salió («2024», «2020»). Va por clave, no por posición, para que
   * reordenar `groups` no pueda cruzar un año con el JSON de otro.
   */
  labels?: Record<string, string>;
  /**
   * Banqueos que exigen suscripción aunque el curso sea gratis: los abre el plan
   * del tramo del curso. Las mismas claves van sin `free` en `EXAMENES` de la
   * route, que es quien los bloquea de verdad; esto sólo pinta el candado.
   */
  dePago?: string[];
}
