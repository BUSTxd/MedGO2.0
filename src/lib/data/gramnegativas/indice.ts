// Los 10 capítulos del laboratorio «Infecciones bacterianas por gramnegativas», en
// orden: solo lo que se enseña aunque el capítulo esté cerrado. Nada de pasos ni de voz.

import type { ParteId } from './tipos';

export type MetaParte = {
  id: ParteId; numero: number; nombre: string; nombreCorto: string; tipo: string; lugar: string; color: string; pregunta: string;
};

export const INDICE: MetaParte[] = [
  { id: 'pacientes', numero: 0, nombre: 'Dos pacientes, una pregunta', nombreCorto: 'Dos pacientes', tipo: 'Introducción', lugar: 'Intestino y pulmón', color: '#D6287F', pregunta: '¿Cómo llega una bacteria de un lugar a la sangre?' },
  { id: 'quien', numero: 1, nombre: 'Quién, desde dónde y en qué fases', nombreCorto: 'Quién y fases', tipo: 'Panorama', lugar: 'Huésped, reservorios y puertas', color: '#E5324C', pregunta: '¿Quién está en riesgo, de dónde vienen y cómo avanzan?' },
  { id: 'barrera', numero: 2, nombre: 'La barrera sana y cómo se estropea', nombreCorto: 'La barrera', tipo: 'Fisiología', lugar: 'Moco y microbiota', color: '#EE6A1F', pregunta: '¿Qué protege al intestino y qué lo deshace?' },
  { id: 'uniones', numero: 3, nombre: 'Uniones y rutas de cruce', nombreCorto: 'Uniones', tipo: 'Fisiopatología', lugar: 'Epitelio intestinal', color: '#8A4FE0', pregunta: '¿Por dónde cruza una bacteria la barrera?' },
  { id: 'invasion', numero: 4, nombre: 'Invasión y muerte del enterocito', nombreCorto: 'Invasión', tipo: 'Fisiopatología', lugar: 'Enterocito', color: '#2E78F2', pregunta: '¿Cómo entra una bacteria a la célula y cómo la mata?' },
  { id: 'toxinas', numero: 5, nombre: 'Endotoxina y exotoxinas', nombreCorto: 'Toxinas', tipo: 'Mecanismos', lugar: 'LPS, TLR4 y toxinas', color: '#0C9E9A', pregunta: '¿En qué se diferencian la endotoxina y las exotoxinas?' },
  { id: 'sepsis', numero: 6, nombre: 'Cuando la barrera falla: bacteriemia y sepsis', nombreCorto: 'Bacteriemia y sepsis', tipo: 'Clínica', lugar: 'Sangre y órganos', color: '#C2307A', pregunta: '¿Qué pasa cuando la barrera falla y cómo se reconoce la sepsis?' },
  { id: 'reparar', numero: 7, nombre: 'Reparar la barrera', nombreCorto: 'Reparación', tipo: 'Fisiología', lugar: 'Cripta intestinal', color: '#D9480F', pregunta: '¿Cómo se repara el epitelio y qué lo impide?' },
  { id: 'especies', numero: 8, nombre: 'Cuatro especies, cuatro estrategias', nombreCorto: 'Las especies', tipo: 'Microbiología', lugar: 'E. coli, Klebsiella, Pseudomonas, Acinetobacter', color: '#18A34A', pregunta: '¿Qué estrategia usa cada una de las cuatro especies?' },
  { id: 'resistencia', numero: 9, nombre: 'Comparar, resistencia y leer la evidencia', nombreCorto: 'Resistencia', tipo: 'Integración', lugar: 'Fármacos, modelos y casos', color: '#6D3FD8', pregunta: '¿Cómo se comparan, cómo resisten y cómo se lee la evidencia?' },
];
