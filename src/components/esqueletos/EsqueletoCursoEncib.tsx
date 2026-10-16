import Hueso, { Esqueleto } from './Hueso';
import s from '@/styles/cursoEncib.module.css';

/** Un curso de ciencias básicas (`cursos/area/<slug>`): cabecera y el temario numerado. */
export default function EsqueletoCursoEncib() {
  return (
    <Esqueleto>
      <Hueso w={80} h={14} mb={14} />
      <div className={s.pagina}>
        <div className={s.cabecera}>
          <Hueso w={64} h={64} r={16} />
          <div>
            <Hueso w={200} h={32} mb={8} />
            <Hueso w={140} h={13} />
          </div>
        </div>
        <ol className={s.bloques}>
          {[4, 3].map((n, i) => (
            <li key={i} className={s.bloque}>
              <div className={s.bloqueNombre}>
                <Hueso w={24} h={24} r={7} />
                <Hueso w={180} h={17} />
              </div>
              <ol className={s.temas}>
                {Array.from({ length: n }, (_, j) => (
                  <li key={j} className={s.tema}>
                    <Hueso w={22} h={12} />
                    <Hueso w={`${58 + ((i + j) % 3) * 14}%`} h={14} />
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </div>
    </Esqueleto>
  );
}
