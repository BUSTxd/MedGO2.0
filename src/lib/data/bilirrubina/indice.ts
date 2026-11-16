// Los 12 capítulos del laboratorio «Metabolismo de la bilirrubina», en orden: solo lo
// que se enseña aunque el capítulo esté cerrado. Nada de pasos ni de voz.

import type { ParteId } from './tipos';

export type MetaParte = {
  id: ParteId; numero: number; nombre: string; nombreCorto: string; tipo: string; lugar: string; color: string; pregunta: string;
};

export const INDICE: MetaParte[] = [
  { id: 'amarillo', numero: 0, nombre: '¿Por qué se vuelve amarillo?', nombreCorto: 'El amarillo', tipo: 'Introducción', lugar: 'El viaje completo', color: '#D99A00', pregunta: '¿En qué estación del viaje se atasca la bilirrubina?' },
  { id: 'hemo', numero: 1, nombre: 'Del hemo a la bilirrubina', nombreCorto: 'Del hemo', tipo: 'Bioquímica', lugar: 'Macrófago', color: '#D7263D', pregunta: '¿Cómo se convierte el hemo en un pigmento amarillo?' },
  { id: 'molecula', numero: 2, nombre: 'Una molécula paradójica', nombreCorto: 'La molécula', tipo: 'Bioquímica', lugar: 'Sangre y albúmina', color: '#E8720C', pregunta: '¿Por qué no se disuelve en agua y quién la lleva?' },
  { id: 'entrada', numero: 3, nombre: 'La entrada al hepatocito', nombreCorto: 'La entrada', tipo: 'Fisiología', lugar: 'Sinusoide y hepatocito', color: '#C2307A', pregunta: '¿Cómo entra la bilirrubina al hígado?' },
  { id: 'conjugacion', numero: 4, nombre: 'La conjugación', nombreCorto: 'Conjugación', tipo: 'Fisiología', lugar: 'Retículo endoplasmático', color: '#8A4FE0', pregunta: '¿Qué cambia cuando la UGT1A1 la conjuga?' },
  { id: 'salida', numero: 5, nombre: 'La salida a la bilis', nombreCorto: 'La salida', tipo: 'Fisiología', lugar: 'Canalículo y vías biliares', color: '#1E9E6A', pregunta: '¿Cómo sale del hepatocito y por qué cuesta tanto?' },
  { id: 'intestino', numero: 6, nombre: 'El intestino y sus bacterias', nombreCorto: 'El intestino', tipo: 'Fisiología', lugar: 'Colon y circulación enterohepática', color: '#0C9E9A', pregunta: '¿De dónde salen el marrón de las heces y el amarillo de la orina?' },
  { id: 'laboratorio', numero: 7, nombre: 'Leer el laboratorio', nombreCorto: 'Laboratorio', tipo: 'Diagnóstico', lugar: 'Sangre y orina', color: '#2E78F2', pregunta: '¿Qué significan directa, indirecta y total?' },
  { id: 'noconjugada', numero: 8, nombre: 'Cuando sube la no conjugada', nombreCorto: 'No conjugada', tipo: 'Patología', lugar: 'Antes y dentro del hepatocito', color: '#E0A100', pregunta: '¿Producir mucho, captar poco o conjugar poco?' },
  { id: 'kernicterus', numero: 9, nombre: 'El cerebro en riesgo: kernícterus y la luz', nombreCorto: 'Kernícterus', tipo: 'Clínica', lugar: 'Cerebro del recién nacido', color: '#6D3FD8', pregunta: '¿Por qué daña el cerebro y cómo la baja la luz?' },
  { id: 'conjugada', numero: 10, nombre: 'Cuando sube la conjugada', nombreCorto: 'Conjugada', tipo: 'Patología', lugar: 'Hepatocito y vías biliares', color: '#18A34A', pregunta: '¿La bomba, la colestasis o el hígado dañado?' },
  { id: 'calculos', numero: 11, nombre: 'Cálculos pigmentarios y mapa final', nombreCorto: 'Mapa final', tipo: 'Integración', lugar: 'Vesícula, conductos y el viaje entero', color: '#8B5A2B', pregunta: '¿Antes, dentro o después del hígado?' },
];
