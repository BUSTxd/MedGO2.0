import type { BancoTema } from './types';
import { PATOLOGIA_ACP_1 } from './patologia-acp-1';

export type { BancoTema, BancoTanda, BancoFase, BancoPregunta, BancoOpcion } from './types';

/**
 * Registro de bancos, indexado por el **id de la actividad del sílabo**.
 *
 * Igual que `SOLUCIONARIOS`, el banco vive fuera del sílabo y se descubre con
 * `findBanco(act.id)`: añadir un tema nuevo no obliga a tocar el archivo del
 * curso. Lo consumen la página de la clase (para abrir `?banco=1`) y
 * `material-plan.ts` (para contar el banqueo como publicado en Aportes).
 */
export const BANCOS: Record<string, BancoTema> = {
  [PATOLOGIA_ACP_1.claseId]: PATOLOGIA_ACP_1,
};

export function findBanco(claseId: string): BancoTema | null {
  return BANCOS[claseId] ?? null;
}
