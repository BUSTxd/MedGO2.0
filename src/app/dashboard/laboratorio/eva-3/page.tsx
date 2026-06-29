'use client';
// Página de la EVA 3: examen interactivo de identificación anatómica.
// Reutiliza el layout estándar del laboratorio; toda la lógica vive en Eva3Exam.

import TrackLabVisit from '@/components/TrackLabVisit';
import Eva3Exam from './Eva3Exam';

export default function Eva3Page() {
  return (
    <>
      <TrackLabVisit labId="eva-3" />
      <Eva3Exam />
    </>
  );
}
