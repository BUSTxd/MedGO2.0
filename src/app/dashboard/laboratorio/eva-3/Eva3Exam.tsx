'use client';
// EVA 3 · Anatomía. Wrapper delgado: el banco de preguntas vive en ./questions
// y toda la lógica de flujo/precarga en el motor compartido AnatExam.

import AnatExam from '@/components/AnatExam';
import { QUESTIONS } from './questions';

export default function Eva3Exam() {
  return (
    <AnatExam
      questions={QUESTIONS}
      kicker="EVA 3 · Anatomía"
      title="Identificación de estructuras — preguntas de examen pasadas"
    />
  );
}
