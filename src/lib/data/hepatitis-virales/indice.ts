// Los 23 capítulos del laboratorio «Hepatitis virales», en orden: solo lo que se enseña aunque el
// capítulo esté cerrado. Nada de pasos ni de voz.

import type { ParteId } from './tipos';

export type MetaParte = {
  id: ParteId; numero: number; nombre: string; nombreCorto: string; tipo: string; lugar: string; color: string; pregunta: string;
};

export const INDICE: MetaParte[] = [
  { id: 'pacientes', numero: 0, nombre: 'Dos pacientes, un órgano', nombreCorto: 'Pacientes', tipo: 'Introducción', lugar: 'Los dos casos del ACP15', color: '#E8541F', pregunta: '¿Por qué un virus que casi no mata al hepatocito destruye un hígado?' },
  { id: 'cinco', numero: 1, nombre: 'Cinco virus, un blanco', nombreCorto: 'Cinco virus', tipo: 'Virología', lugar: 'De la A a la E', color: '#8A3FD8', pregunta: '¿Qué comparten cinco virus que no son parientes?' },
  { id: 'histologia', numero: 2, nombre: 'El hígado por dentro: histología', nombreCorto: 'Histología', tipo: 'Histología', lugar: 'Lobulillo, sinusoide y trabéculas', color: '#E0707A', pregunta: '¿Cómo está hecho un órgano de sangre?' },
  { id: 'fisiologia', numero: 3, nombre: 'El hígado que trabaja: fisiología', nombreCorto: 'Fisiología', tipo: 'Fisiología', lugar: 'Zonación, enzimas y bilis', color: '#C2307A', pregunta: '¿Qué hace cada zona del acino?' },
  { id: 'patrones', numero: 4, nombre: 'Cómo se lesiona: patrones', nombreCorto: 'Patrones', tipo: 'Patología', lugar: 'Del hepatocito al lobulillo', color: '#B23A5E', pregunta: '¿De cuántas maneras enferma un hepatocito?' },
  { id: 'laboratorio', numero: 5, nombre: 'El hígado en el laboratorio', nombreCorto: 'Laboratorio', tipo: 'Patología clínica', lugar: 'ALT, AST, bilirrubina e INR', color: '#E0A100', pregunta: '¿Qué miden de verdad las pruebas del hígado?' },
  { id: 'ae', numero: 6, nombre: 'Hepatitis A y E: la vía fecal-oral', nombreCorto: 'A y E', tipo: 'Virología', lugar: 'Agua, intestino y hepatocito', color: '#FF8A1E', pregunta: '¿Qué hace el agua contaminada en un hígado?' },
  { id: 'vhb-particula', numero: 7, nombre: 'El VHB: partícula y genoma', nombreCorto: 'Partícula', tipo: 'Virología', lugar: 'Dane, señuelos y genoma', color: '#2F55E0', pregunta: '¿Por qué hay más partículas que virus?' },
  { id: 'vhb-ciclo', numero: 8, nombre: 'El ciclo del VHB y el cccDNA', nombreCorto: 'Ciclo', tipo: 'Biología celular', lugar: 'De NTCP al núcleo', color: '#2742C8', pregunta: '¿Por qué no se destruye el cccDNA?' },
  { id: 'vhb-inmuno', numero: 9, nombre: 'Inmunopatogenia del VHB', nombreCorto: 'Inmunidad', tipo: 'Inmunología', lugar: 'Linfocitos CD8 y tolerancia', color: '#10B5A8', pregunta: '¿Quién daña el hígado: el virus o la defensa?' },
  { id: 'vhb-sero', numero: 10, nombre: 'La serología del VHB', nombreCorto: 'Serología', tipo: 'Laboratorio', lugar: 'Marcadores, ventana y patrones', color: '#4F7FF0', pregunta: '¿Qué cuenta cada marcador?' },
  { id: 'vhb-fases', numero: 11, nombre: 'Historia natural y fases', nombreCorto: 'Fases', tipo: 'Patología', lugar: 'Las cuatro fases de EASL', color: '#5B4BE8', pregunta: '¿Por qué tanto virus y tan poca guerra?' },
  { id: 'brote', numero: 12, nombre: 'Caso 1: el brote', nombreCorto: 'Brote', tipo: 'Patología', lugar: 'La reagudización del paciente 1', color: '#E5324C', pregunta: '¿Es una hepatitis aguda nueva?' },
  { id: 'cancer', numero: 13, nombre: 'Del virus al cáncer', nombreCorto: 'Cáncer', tipo: 'Oncogénesis', lugar: 'Integración, HBx y aflatoxina', color: '#7B3FD8', pregunta: '¿Hace falta cirrosis para que haya cáncer?' },
  { id: 'carcinoma', numero: 14, nombre: 'El carcinoma: imagen, biopsia y vigilancia', nombreCorto: 'Carcinoma', tipo: 'Patología', lugar: 'El segmento VI y su biopsia', color: '#B8237A', pregunta: '¿Qué dice el patólogo?' },
  { id: 'vhb-tratamiento', numero: 15, nombre: 'Tratamiento del VHB: antes y ahora', nombreCorto: 'Tratar el B', tipo: 'Farmacología', lugar: 'Análogos, interferón y guías', color: '#1F8FB0', pregunta: '¿Qué se busca al tratar el virus B?' },
  { id: 'vhb-prevenir', numero: 16, nombre: 'Prevenir y lo nuevo en el VHB', nombreCorto: 'Prevenir', tipo: 'Prevención', lugar: 'Vacuna, embarazo y bepirovirsen', color: '#0E9E6A', pregunta: '¿Se puede curar la hepatitis B?' },
  { id: 'delta', numero: 17, nombre: 'Hepatitis D', nombreCorto: 'Delta', tipo: 'Virología', lugar: 'Un viroide con abrigo prestado', color: '#8A4FE8', pregunta: '¿Cuál es el virus más pequeño que nos infecta?' },
  { id: 'vhc-ciclo', numero: 18, nombre: 'El VHC: virus, genoma y ciclo', nombreCorto: 'VHC', tipo: 'Virología', lugar: 'De CD81 a las gotas lipídicas', color: '#14B870', pregunta: '¿Cómo entra y se multiplica el virus C?' },
  { id: 'vhc-evasion', numero: 19, nombre: 'Cómo se esconde el VHC', nombreCorto: 'Evasión', tipo: 'Inmunología', lugar: 'NS3/4A, NK y cuasiespecies', color: '#0B7A4A', pregunta: '¿Por qué se cronifica el 70 %?' },
  { id: 'vhc-caso', numero: 20, nombre: 'Caso 2: diagnóstico y fibrosis', nombreCorto: 'Fibrosis', tipo: 'Patología', lugar: 'Kupffer, TGF-β y estrelladas', color: '#3AA7E0', pregunta: '¿Cómo se pasa del virus a la cicatriz?' },
  { id: 'crioglobulinas', numero: 21, nombre: 'Crioglobulinemia y lo extrahepático', nombreCorto: 'Crioglobulinas', tipo: 'Inmunopatología', lugar: 'CD81, frío y complemento', color: '#6D3FD8', pregunta: '¿Por qué se manchan las piernas con el frío?' },
  { id: 'vhc-tratamiento', numero: 22, nombre: 'Tratamiento del VHC y cierre', nombreCorto: 'Cura del C', tipo: 'Farmacología', lugar: 'Antivirales directos y los dos casos', color: '#14A864', pregunta: '¿Qué significa curarse del virus C?' },
];
