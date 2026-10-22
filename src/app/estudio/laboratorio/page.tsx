import IndiceLaboratorio from '@/components/estudio/IndiceLaboratorio';
import { prepararSesionApp } from '@/lib/sesion-app';
import { tarjetasLaboratorio } from '@/lib/estudio/laboratorios';

export const metadata = { title: 'Laboratorio virtual · MedGO' };

export default async function LaboratorioEstudioPage() {
  const s = await prepararSesionApp();
  return <IndiceLaboratorio tarjetas={tarjetasLaboratorio(s.planState, s.deCayetano)} />;
}
