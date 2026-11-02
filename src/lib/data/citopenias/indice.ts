// Los 10 capítulos del laboratorio «Citopenias autoinmunes», en orden: solo lo que se
// enseña aunque el capítulo esté cerrado. Nada de pasos ni de voz: esto llega a cualquier navegador.

import type { ParteId } from './tipos';

export type MetaParte = {
  id: ParteId; numero: number; nombre: string; nombreCorto: string; tipo: string; lugar: string; color: string; pregunta: string;
};

export const INDICE: MetaParte[] = [
  { id: "marca", numero: 0, nombre: "Una marca, dos enfermedades", nombreCorto: "Una marca", tipo: "Introducción", lugar: "Sangre", color: "#2E78F2", pregunta: "¿Qué tres preguntas ordenan cualquier citopenia autoinmune?" },
  { id: "temperatura", numero: 1, nombre: "La temperatura lo decide", nombreCorto: "Temperatura", tipo: "AHAI", lugar: "Glóbulo rojo", color: "#E5324C", pregunta: "¿Por qué importa a qué temperatura se une el anticuerpo?" },
  { id: "caliente", numero: 2, nombre: "AHAI caliente", nombreCorto: "AHAI caliente", tipo: "AHAI", lugar: "Bazo y sangre", color: "#E5324C", pregunta: "¿Cómo termina un bazo destruyendo glóbulos rojos sanos?" },
  { id: "frias", numero: 3, nombre: "Aglutininas frías", nombreCorto: "Aglutininas frías", tipo: "AHAI", lugar: "Médula, dedos e hígado", color: "#2F8DE8", pregunta: "¿Por qué sacar el bazo no sirve en la forma fría?" },
  { id: "reconocer-ahai", numero: 4, nombre: "Cómo se reconoce la AHAI", nombreCorto: "Reconocerla", tipo: "AHAI", lugar: "Clínica y laboratorio", color: "#BF3B6F", pregunta: "¿Qué patrón de hemólisis tiene y qué dice el Coombs?" },
  { id: "tratar-ahai", numero: 5, nombre: "Cómo se trata la AHAI", nombreCorto: "Tratarla", tipo: "AHAI", lugar: "Según dónde muere el glóbulo", color: "#10BCC4", pregunta: "¿Por qué lo que sirve en una forma falla en la otra?" },
  { id: "marca-pti", numero: 6, nombre: "PTI: la marca en la plaqueta", nombreCorto: "La marca", tipo: "PTI", lugar: "Bazo", color: "#8460E8", pregunta: "¿Quién fabrica el anticuerpo contra la plaqueta?" },
  { id: "destruir-pti", numero: 7, nombre: "PTI: cuatro formas de destruir", nombreCorto: "Cuatro formas", tipo: "PTI", lugar: "Sangre, bazo e hígado", color: "#8460E8", pregunta: "¿De cuántas formas se destruye una plaqueta?" },
  { id: "medula-pti", numero: 8, nombre: "PTI: por qué la médula no repone", nombreCorto: "La médula", tipo: "PTI", lugar: "Médula e hígado", color: "#0F9D8F", pregunta: "¿Por qué la médula no repone lo que se destruye?" },
  { id: "tratar-pti", numero: 9, nombre: "PTI: reconocerla y tratarla", nombreCorto: "Tratarla", tipo: "PTI", lugar: "Clínica y tratamiento", color: "#F97316", pregunta: "¿Cómo se reconoce y qué trata cada mecanismo?" },
];
