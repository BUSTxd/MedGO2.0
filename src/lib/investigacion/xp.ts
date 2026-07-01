// Constantes de XP del sistema de Investigación.
export const XP = {
  /** leer un bloque de contenido completo */
  BLOQUE: 10,
  /** minijuego completado al primer intento */
  MJ_1ER: 50,
  /** minijuego completado al segundo intento (o más) */
  MJ_2DO: 25,
  /** boss challenge completado */
  BOSS: 100,
  /** nivel completado al 100% */
  NIVEL: 200,
} as const;

/** XP por completar un minijuego según el número de intentos usados. */
export function xpPorMinijuego(intentos: number): number {
  return intentos <= 1 ? XP.MJ_1ER : XP.MJ_2DO;
}

/** Color de acento por banda de dificultad. */
export const COLOR_BANDA: Record<string, string> = {
  fundamentos: '#3B82F6',
  desarrollo: '#10B981',
  analisis: '#8B5CF6',
  sintesis: '#F59E0B',
};
