import Hueso, { Esqueleto } from './Hueso';
import e from '@/styles/esqueletos.module.css';
import c from '@/styles/cursos.module.css';

/** Una tarjeta de curso: badge + ícono, nombre, dos líneas de descripción y nivel. */
function TarjetaCurso() {
  return (
    <div className={c.qCard}>
      <div className={c.qCardTop}>
        <Hueso w={96} h={22} r={999} />
        <Hueso w={30} h={30} />
      </div>
      <Hueso w="78%" h={20} />
      <Hueso w="100%" h={12} />
      <Hueso w="62%" h={12} />
      <Hueso w={104} h={22} r={999} style={{ marginTop: 4 }} />
    </div>
  );
}

/** Rejilla de cursos: título y los dos tramos, cada uno con su fila de tarjetas. */
export function EsqueletoCursos() {
  return (
    <Esqueleto>
      <div className={c.qbankPanelIcon}>
        <Hueso w={20} h={20} r={6} />
      </div>
      <Hueso w={120} h={32} mb={8} />
      <Hueso w={270} h={14} mb={18} />
      {/* La franja del ENCIB. */}
      <Hueso h={48} r={14} mb={26} />

      {[230, 260].map((w) => (
        <section key={w} className={c.trackSection}>
          <div className={c.trackHead}>
            <Hueso w={w} h={17} />
          </div>
          <div className={c.qgrid}>
            {Array.from({ length: 6 }, (_, i) => (
              <TarjetaCurso key={i} />
            ))}
          </div>
        </section>
      ))}
    </Esqueleto>
  );
}

/** Sílabo de un curso: cabecera, fórmula de evaluación y semanas con sus clases. */
export function EsqueletoSilabo() {
  return (
    <Esqueleto>
      <div className={c.microPage}>
        <div className={c.container}>
          <Hueso w={110} h={15} mb={28} />

          <Hueso w="min(380px, 80%)" h={32} mb={8} />
          <Hueso w="min(300px, 65%)" h={14} mb={14} />
          <div className={c.courseMeta} style={{ marginBottom: 24 }}>
            <Hueso w={90} h={13} />
            <Hueso w={80} h={13} />
            <Hueso w={170} h={13} />
          </div>

          <Hueso h={54} r={12} mb={36} />

          <div className={c.legend}>
            {[120, 104, 136, 112, 76].map((w) => (
              <Hueso key={w} w={w} h={11} />
            ))}
          </div>

          {[4, 5, 4].map((clases, s) => (
            <section key={s} className={c.weekSection}>
              <div className={c.weekHeader}>
                <Hueso w={190} h={11} />
                <div className={c.weekLine} />
              </div>
              {Array.from({ length: clases }, (_, i) => (
                <div key={i} className={c.activityCard}>
                  <Hueso w={3} r={0} style={{ alignSelf: 'stretch' }} />
                  <div className={e.actividad}>
                    <Hueso w={`${52 + ((i * 17 + s * 11) % 34)}%`} h={14} />
                    <Hueso w={`${30 + ((i * 13 + s * 7) % 22)}%`} h={11} />
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </Esqueleto>
  );
}

/** Una clase: volver, badges, título, datos, temas y las tres tarjetas de material. */
export function EsqueletoClase() {
  return (
    <Esqueleto>
      <div className={c.microPage}>
        <div className={c.container}>
          <Hueso w={200} h={15} mb={28} />

          <div className={c.detailBadgeRow}>
            <Hueso w={74} h={18} r={5} />
            <Hueso w={130} h={18} r={6} />
          </div>
          <Hueso w="min(460px, 88%)" h={30} mb={18} />
          <div className={c.detailMetaRow}>
            <Hueso w={70} h={13} />
            <Hueso w={96} h={13} />
            <Hueso w={150} h={13} />
          </div>

          <div className={c.subtemasSection}>
            <Hueso w={110} h={10} mb={10} />
            <div className={c.subtemasWrap}>
              {[130, 190, 110, 160].map((w) => (
                <Hueso key={w} w={w} h={31} />
              ))}
            </div>
          </div>

          <Hueso w={150} h={10} mb={14} />
          <div className={c.studyGrid}>
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className={c.studyCard}>
                <Hueso w={38} h={38} r={10} mb={6} />
                <Hueso w="55%" h={16} />
                <Hueso w="90%" h={12} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Esqueleto>
  );
}
