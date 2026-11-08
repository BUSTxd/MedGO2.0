// Los 10 capítulos del laboratorio «Vasculitis de vasos medianos y pequeños y ANCA», en
// orden: solo lo que se enseña aunque el capítulo esté cerrado. Nada de pasos ni de voz.

import type { ParteId } from './tipos';

export type MetaParte = {
  id: ParteId; numero: number; nombre: string; nombreCorto: string; tipo: string; lugar: string; color: string; pregunta: string;
};

export const INDICE: MetaParte[] = [
  { id: 'pacientes', numero: 0, nombre: 'Dos pacientes, un vaso roto', nombreCorto: 'Dos pacientes', tipo: 'Introducción', lugar: 'Nariz, pulmón, riñón y piel', color: '#D6287F', pregunta: '¿Qué comparten una nariz que se hunde y un asma que empeora?' },
  { id: 'endotelio', numero: 1, nombre: 'El endotelio, la frontera que decide', nombreCorto: 'Endotelio', tipo: 'Fisiología', lugar: 'Pared del vaso', color: '#E5324C', pregunta: '¿Qué hace el endotelio sano y qué cambia al activarse?' },
  { id: 'pared', numero: 2, nombre: 'La pared se abre', nombreCorto: 'La pared se abre', tipo: 'Fisiología', lugar: 'Vénula poscapilar', color: '#EE6A1F', pregunta: '¿Cómo sale el plasma y cómo cruza un neutrófilo?' },
  { id: 'ordenar', numero: 3, nombre: 'Ordenar las vasculitis', nombreCorto: 'Clasificación', tipo: 'Clasificación', lugar: 'Chapel Hill 2012', color: '#8A4FE0', pregunta: '¿Qué tamaño de vaso y qué mecanismo?' },
  { id: 'mecanismos', numero: 4, nombre: 'Cuatro formas de romper un vaso', nombreCorto: 'Mecanismos', tipo: 'Fisiopatología', lugar: 'Pared del vaso', color: '#2E78F2', pregunta: '¿Cómo rompen el vaso los inmunocomplejos, los ANCA, el granuloma y la respuesta tipo 2?' },
  { id: 'enfermedades', numero: 5, nombre: 'Vasos medianos y pequeños', nombreCorto: 'Las enfermedades', tipo: 'Clínica', lugar: 'PAN, Kawasaki, GPA, GEPA y PAM', color: '#0C9E9A', pregunta: '¿Cómo se reconoce cada vasculitis?' },
  { id: 'patologo', numero: 6, nombre: 'Lo que ve el patólogo', nombreCorto: 'Histología', tipo: 'Patología', lugar: 'Biopsia', color: '#C2307A', pregunta: '¿Qué dicen la necrosis fibrinoide y el granuloma?' },
  { id: 'glomerulo', numero: 7, nombre: 'El glomérulo se rompe', nombreCorto: 'Glomérulo', tipo: 'Fisiopatología', lugar: 'Riñón', color: '#D9480F', pregunta: '¿Cómo nace una semiluna y por qué cae el filtrado?' },
  { id: 'brillar', numero: 8, nombre: 'Tres formas de brillar', nombreCorto: 'Inmunofluorescencia', tipo: 'Diagnóstico', lugar: 'Glomérulo', color: '#18A34A', pregunta: '¿Lineal, granular o pauciinmune?' },
  { id: 'organos', numero: 9, nombre: 'Nariz, pulmón y riñón', nombreCorto: 'Nariz, pulmón y riñón', tipo: 'Integración', lugar: 'Síndrome pulmón-riñón', color: '#6D3FD8', pregunta: '¿Por qué sangran a la vez el pulmón y el riñón?' },
];
