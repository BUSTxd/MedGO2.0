'use client';
// EVA 2 · Anatomía. Wrapper delgado: el banco de preguntas vive en ./questions
// y toda la lógica de flujo/precarga en el motor compartido AnatExam.

import AnatExam from '@/components/AnatExam';
import { QUESTIONS } from './questions';

export default function Eva2Exam() {
  return (
    <AnatExam
      questions={QUESTIONS}
      examId="eva-2"
      kicker="EVA 2 · Anatomía"
      title="Identificación de estructuras — preguntas de examen pasadas"
    />
  );
}
