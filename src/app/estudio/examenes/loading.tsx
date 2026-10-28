import MarcoLab from '@/components/estudio/MarcoLab';
import { cx } from '@/components/estudio/Icono';

export default function CargandoExamenes() {
  return <MarcoLab pagina="exams"><div className={cx('examenes')} role="status">Cargando exámenes…</div></MarcoLab>;
}
