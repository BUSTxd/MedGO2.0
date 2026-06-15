'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';
import styles from '@/styles/cursos.module.css';

// Loaded only when the user opens the resumen
const PdfFullscreenModal = dynamic(() => import('./PdfFullscreenModal'), {
  ssr: false,
});

interface ResumenOpcion {
  id: string;
  label: string;
}

interface ExamenRef {
  key: string;
  free?: boolean;
}

interface Props {
  claseId: string;
  hasResumen: boolean;
  resumenOpciones?: ResumenOpcion[];
  examen?: ExamenRef;
  examenTitle?: string;
}

export default function StudyMaterialSection({ claseId, hasResumen, resumenOpciones, examen }: Props) {
  const isMulti = resumenOpciones && resumenOpciones.length > 1;
  const pathname = usePathname();

  const [pickerOpen, setPickerOpen]       = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [selectedId, setSelectedId]       = useState<string | null>(null);

  // Evento curado: el alumno entró a la clase (una vez por montaje).
  useEffect(() => {
    trackEvent('clase_abierta', { claseId });
  }, [claseId]);

  // Which PDF the fullscreen modal targets.
  // Si hay una sola opcion, usar su id (permite que el data file sobreescriba el
  // claseId — util cuando dos cursos comparten ids como `clase-14`).
  const activeId = isMulti
    ? selectedId
    : (resumenOpciones?.[0]?.id ?? claseId);

  const handleCardClick = () => {
    if (!hasResumen) return;
    if (isMulti) {
      setPickerOpen(true);
    } else {
      trackEvent('resumen_abierto', { claseId: activeId });
      setFullscreenOpen(true);
    }
  };

  const handlePick = (id: string) => {
    trackEvent('resumen_abierto', { claseId: id });
    setSelectedId(id);
    setPickerOpen(false);
    setFullscreenOpen(true);
  };

  const handleCloseFullscreen = () => {
    setFullscreenOpen(false);
    if (isMulti) {
      // Reset selection so next click reopens the picker
      setSelectedId(null);
    }
  };

  return (
    <div className={styles.studySection}>
      <p className={styles.studyLabel}>Material de Estudio</p>

      <div className={styles.studyGrid}>
        {/* Video resumen — siempre bloqueado */}
        <div className={`${styles.studyCard} ${styles.studyCardLocked}`}>
          <div className={styles.studyCardIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M15.3276 7.54199H8.67239C5.29758 7.54199 3.61017 7.54199 2.66232 8.52882C1.71447 9.51565 1.93748 11.0403 2.38351 14.0895L2.80648 16.9811C3.15626 19.3723 3.33115 20.5679 4.22834 21.2839C5.12553 21.9999 6.4488 21.9999 9.09534 21.9999H14.9046C17.5512 21.9999 18.8745 21.9999 19.7717 21.2839C20.6689 20.5679 20.8437 19.3723 21.1935 16.9811L21.6165 14.0895C22.0625 11.0403 22.2855 9.51564 21.3377 8.52882C20.3898 7.54199 18.7024 7.54199 15.3276 7.54199ZM14.5812 15.7942C15.1396 15.448 15.1396 14.5519 14.5812 14.2057L11.2096 12.1156C10.6669 11.7792 10 12.2171 10 12.9098V17.0901C10 17.7828 10.6669 18.2207 11.2096 17.8843L14.5812 15.7942Z" fill="currentColor"/>
              <path opacity="0.5" d="M8.50956 2.00001H15.4897C15.7221 1.99995 15.9004 1.99991 16.0562 2.01515C17.164 2.12352 18.0708 2.78958 18.4553 3.68678H5.54395C5.92846 2.78958 6.83521 2.12352 7.94303 2.01515C8.09884 1.99991 8.27708 1.99995 8.50956 2.00001Z" fill="currentColor"/>
              <path opacity="0.7" d="M6.3102 4.72266C4.91958 4.72266 3.77931 5.56241 3.39878 6.67645C3.39085 6.69967 3.38325 6.72302 3.37598 6.74647C3.77413 6.6259 4.18849 6.54713 4.60796 6.49336C5.68833 6.35485 7.05367 6.35492 8.6397 6.35501H15.5318C17.1178 6.35492 18.4832 6.35485 19.5635 6.49336C19.983 6.54713 20.3974 6.6259 20.7955 6.74647C20.7883 6.72302 20.7806 6.69967 20.7727 6.67645C20.3922 5.56241 19.2519 4.72266 17.8613 4.72266H6.3102Z" fill="currentColor"/>
            </svg>
          </div>
          <p className={styles.studyCardTitle}>Video</p>
          <p className={styles.studyCardDesc}>Repaso en video del tema de la clase</p>
          <span className={styles.studyComingSoon}>Próximamente</span>
        </div>

        {/* Banco de preguntas / examen interactivo */}
        {examen ? (
          <Link
            href={`${pathname}?examen=1`}
            className={`${styles.studyCard} ${styles.studyCardActive}`}
            onClick={() => trackEvent('banco_iniciado', { claseId, examKey: examen.key })}
          >
            <div className={styles.studyCardIcon}>
              <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
                <path d="M10 29V26H13V29H10Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M32 44H8C5.79086 44 4 42.2091 4 40V8C4 5.79086 5.79086 4 8 4H32C34.2091 4 36 5.79086 36 8V40C36 42.2091 34.2091 44 32 44ZM18 13C18 12.4477 18.4477 12 19 12H31C31.5523 12 32 12.4477 32 13C32 13.5523 31.5523 14 31 14H19C18.4477 14 18 13.5523 18 13ZM19 16C18.4477 16 18 16.4477 18 17C18 17.5523 18.4477 18 19 18H31C31.5523 18 32 17.5523 32 17C32 16.4477 31.5523 16 31 16H19ZM15.7071 12.2929C16.0976 12.6834 16.0976 13.3166 15.7071 13.7071L11 18.4142L8.29289 15.7071C7.90237 15.3166 7.90237 14.6834 8.29289 14.2929C8.68342 13.9024 9.31658 13.9024 9.70711 14.2929L11 15.5858L14.2929 12.2929C14.6834 11.9024 15.3166 11.9024 15.7071 12.2929ZM19 24C18.4477 24 18 24.4477 18 25C18 25.5523 18.4477 26 19 26H31C31.5523 26 32 25.5523 32 25C32 24.4477 31.5523 24 31 24H19ZM18 29C18 28.4477 18.4477 28 19 28H31C31.5523 28 32 28.4477 32 29C32 29.5523 31.5523 30 31 30H19C18.4477 30 18 29.5523 18 29ZM14 24H9C8.44772 24 8 24.4477 8 25V30C8 30.5523 8.44772 31 9 31H14C14.5523 31 15 30.5523 15 30V25C15 24.4477 14.5523 24 14 24Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M44 40L41 44L38 40V22H44V40Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M40 15H42C43.1046 15 44 15.8954 44 17V21H38V17C38 15.8954 38.8954 15 40 15Z" fill="currentColor"/>
              </svg>
            </div>
            <p className={styles.studyCardTitle}>Banqueo</p>
            <p className={styles.studyCardDesc}>Preguntas tipo examen con explicación</p>
            <span className={styles.studyAvailable}>Comenzar ▸</span>
          </Link>
        ) : (
          <div className={`${styles.studyCard} ${styles.studyCardLocked}`}>
            <div className={styles.studyCardIcon}>
              <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
                <path d="M10 29V26H13V29H10Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M32 44H8C5.79086 44 4 42.2091 4 40V8C4 5.79086 5.79086 4 8 4H32C34.2091 4 36 5.79086 36 8V40C36 42.2091 34.2091 44 32 44ZM18 13C18 12.4477 18.4477 12 19 12H31C31.5523 12 32 12.4477 32 13C32 13.5523 31.5523 14 31 14H19C18.4477 14 18 13.5523 18 13ZM19 16C18.4477 16 18 16.4477 18 17C18 17.5523 18.4477 18 19 18H31C31.5523 18 32 17.5523 32 17C32 16.4477 31.5523 16 31 16H19ZM15.7071 12.2929C16.0976 12.6834 16.0976 13.3166 15.7071 13.7071L11 18.4142L8.29289 15.7071C7.90237 15.3166 7.90237 14.6834 8.29289 14.2929C8.68342 13.9024 9.31658 13.9024 9.70711 14.2929L11 15.5858L14.2929 12.2929C14.6834 11.9024 15.3166 11.9024 15.7071 12.2929ZM19 24C18.4477 24 18 24.4477 18 25C18 25.5523 18.4477 26 19 26H31C31.5523 26 32 25.5523 32 25C32 24.4477 31.5523 24 31 24H19ZM18 29C18 28.4477 18.4477 28 19 28H31C31.5523 28 32 28.4477 32 29C32 29.5523 31.5523 30 31 30H19C18.4477 30 18 29.5523 18 29ZM14 24H9C8.44772 24 8 24.4477 8 25V30C8 30.5523 8.44772 31 9 31H14C14.5523 31 15 30.5523 15 30V25C15 24.4477 14.5523 24 14 24Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M44 40L41 44L38 40V22H44V40Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M40 15H42C43.1046 15 44 15.8954 44 17V21H38V17C38 15.8954 38.8954 15 40 15Z" fill="currentColor"/>
              </svg>
            </div>
            <p className={styles.studyCardTitle}>Banqueo</p>
            <p className={styles.studyCardDesc}>Preguntas de práctica tipo examen</p>
            <span className={styles.studyComingSoon}>Próximamente</span>
          </div>
        )}

        {/* Resumen — abre directo en pantalla completa */}
        <div
          className={`${styles.studyCard} ${
            hasResumen ? styles.studyCardActive : styles.studyCardLocked
          }`}
          onClick={handleCardClick}
        >
          <div className={styles.studyCardIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M21.7071 2.29292C21.9787 2.56456 22.0707 2.96779 21.9438 3.33038L15.3605 22.14C14.9117 23.4223 13.1257 23.4951 12.574 22.2537L9.90437 16.2471L17.3676 7.33665C17.7595 6.86875 17.1312 6.24038 16.6633 6.63229L7.75272 14.0956L1.74631 11.426C0.504876 10.8743 0.577721 9.08834 1.85999 8.63954L20.6696 2.05617C21.0322 1.92926 21.4354 2.02128 21.7071 2.29292Z" fill="currentColor"/>
            </svg>
          </div>
          <p className={styles.studyCardTitle}>Resumen</p>
          <p className={styles.studyCardDesc}>Resumen completo del material visto</p>
          {hasResumen ? (
            <span className={styles.studyAvailable}>Ver resumen ⛶</span>
          ) : (
            <span className={styles.studyComingSoon}>Próximamente</span>
          )}
        </div>
      </div>

      {/* ── Picker modal (solo clases con opciones múltiples) ── */}
      {pickerOpen && isMulti && (
        <div className={styles.pickerOverlay} onClick={() => setPickerOpen(false)}>
          <div className={styles.pickerCard} onClick={e => e.stopPropagation()}>
            <button className={styles.pickerClose} onClick={() => setPickerOpen(false)}>✕</button>
            <p className={styles.pickerTitle}>¿Qué resumen quieres ver?</p>
            <div className={styles.pickerOptions}>
              {resumenOpciones.map(opcion => (
                <button
                  key={opcion.id}
                  className={styles.pickerOption}
                  onClick={() => handlePick(opcion.id)}
                >
                  <span className={styles.pickerOptionIcon}>📄</span>
                  {opcion.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Fullscreen viewer con zoom (única instancia del PdfViewer) ── */}
      {fullscreenOpen && activeId && (
        <PdfFullscreenModal
          claseId={activeId}
          onClose={handleCloseFullscreen}
        />
      )}
    </div>
  );
}
