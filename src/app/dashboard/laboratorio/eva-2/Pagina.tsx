'use client';
// Página de la EVA 2: examen interactivo de identificación anatómica.
// Reutiliza el layout estándar del laboratorio; toda la lógica vive en Eva2Exam.

import TrackLabVisit from '@/components/TrackLabVisit';
import Eva2Exam from './Eva2Exam';

export default function Eva2Page() {
  return (
    <>
      <TrackLabVisit labId="eva-2" />
      <Eva2Exam />
    </>
  );
}
