// Los 12 capítulos del laboratorio «Lupus» en orden: solo lo que se enseña
// aunque el capítulo esté cerrado o aún no esté hecho (portada, selector, la
// lámina de la ruta). Nada de pasos ni de narración: esto sí llega a cualquier
// navegador. Los capítulos animados están en `src/lib/lupus/registro.ts`.

import type { ParteId } from './tipos';
import { L } from './colores';

export type MetaParte = {
  id: ParteId;
  numero: number;
  nombre: string;
  nombreCorto: string;
  /** Bloque de la ruta. */
  tipo: string;
  lugar: string;
  color: string;
  pregunta: string;
};

export const INDICE: MetaParte[] = [
  { id: 'que-es', numero: 0, nombre: '¿Qué es el lupus?', nombreCorto: '¿Qué es?', tipo: 'Introducción', lugar: 'Todo el cuerpo', color: L.queEs, pregunta: '¿Por qué una enfermedad contra el propio núcleo puede tocar cualquier órgano?' },
  { id: 'causas', numero: 1, nombre: '¿Por qué aparece?', nombreCorto: 'Causas', tipo: 'Causas', lugar: 'Genes, hormonas y ambiente', color: L.causas, pregunta: '¿Qué tiene que juntarse para que se pierda la tolerancia?' },
  { id: 'basura', numero: 2, nombre: 'La basura nuclear', nombreCorto: 'Basura nuclear', tipo: 'Mecanismo', lugar: 'Epidermis y macrófago', color: L.mecanismo, pregunta: '¿Qué pasa cuando las células mueren de más y se limpian de menos?' },
  { id: 'interferon', numero: 3, nombre: 'La firma del interferón', nombreCorto: 'Interferón', tipo: 'Mecanismo', lugar: 'Célula dendrítica plasmocitoide', color: L.mecanismo, pregunta: '¿Por qué el sistema inmune confunde el ADN propio con un virus?' },
  { id: 'linfocitos', numero: 4, nombre: 'Linfocitos B y T fuera de control', nombreCorto: 'Linfocitos B y T', tipo: 'Mecanismo', lugar: 'Ganglio y centro germinal', color: L.mecanismo, pregunta: '¿Quién fabrica los autoanticuerpos y quién no los frena?' },
  { id: 'tipo-3', numero: 5, nombre: 'El daño, 1: tipo III', nombreCorto: 'Tipo III', tipo: 'Daño', lugar: 'Vasos pequeños', color: L.dano, pregunta: '¿Cómo daña un complejo que se deposita en la pared del vaso?' },
  { id: 'tipo-2', numero: 6, nombre: 'El daño, 2: tipo II y antifosfolípidos', nombreCorto: 'Tipo II y AFL', tipo: 'Daño', lugar: 'Sangre', color: L.dano, pregunta: '¿Por qué un «anticoagulante» puede causar trombosis?' },
  { id: 'piel', numero: 7, nombre: 'Piel, mucosas, articulaciones y sistema nervioso', nombreCorto: 'Piel y articulaciones', tipo: 'Daño', lugar: 'Piel, articulaciones, SNC', color: L.dano, pregunta: '¿Cómo se distingue el lupus de la piel del de las articulaciones?' },
  { id: 'corazon', numero: 8, nombre: 'Corazón, serosas, bazo y pulmón', nombreCorto: 'Corazón y serosas', tipo: 'Daño', lugar: 'Corazón, serosas, bazo, pulmón', color: L.dano, pregunta: '¿Qué hallazgo del bazo es casi patognomónico?' },
  { id: 'nefritis', numero: 9, nombre: 'Nefritis lúpica', nombreCorto: 'Nefritis lúpica', tipo: 'Daño', lugar: 'Glomérulo', color: L.rinon, pregunta: '¿Dónde se depositan los complejos y qué clase de nefritis dan?' },
  { id: 'diagnostico', numero: 10, nombre: 'Cómo se diagnostica', nombreCorto: 'Diagnóstico', tipo: 'Diagnóstico', lugar: 'Clínica y laboratorio', color: L.diagnostico, pregunta: '¿Qué anticuerpo tamiza y cuál confirma?' },
  { id: 'tratamiento', numero: 11, nombre: 'Complicaciones y tratamiento', nombreCorto: 'Tratamiento', tipo: 'Tratamiento', lugar: 'Todo el circuito', color: L.tratamiento, pregunta: '¿Dónde actúa cada fármaco sobre el circuito del lupus?' },
];
