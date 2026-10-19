// Tablas del laboratorio «Hipersensibilidad»: los cuatro tipos (tabla 6.1 de
// Robbins) y las enfermedades por mecanismo (tablas 6.2 a 6.5). Cada fila lleva
// al paso donde se anima.

import type { FilaEnfermedad, FilaTipo } from './tipos';
import { H } from './colores';

export const TIPOS: FilaTipo[] = [
  { tipo: 'Tipo I', nombre: 'Inmediata', color: H.tipo1, efector: 'Th2, IgE, mastocitos (y eosinófilos)', antigeno: 'Ambiental (alérgeno)', tiempo: 'minutos · tardía 2–24 h', mecanismo: 'IgE en el FcεRI; el alérgeno la entrecruza: aminas vasoactivas, lípidos, citocinas', lesion: 'Dilatación vascular, edema, contracción del músculo liso, moco, inflamación', prototipos: 'Anafilaxia, alergias, asma atópica', destino: { parte: 'fase-inmediata', paso: 'm-1' } },
  { tipo: 'Tipo II', nombre: 'Por anticuerpos', color: H.tipo2, efector: 'IgG, IgM, complemento, fagocitos', antigeno: 'De la superficie celular o la matriz', tiempo: 'horas–días', mecanismo: 'Opsonización y fagocitosis, lisis por complemento, inflamación por FcR y C5a, disfunción de receptores', lesion: 'Fagocitosis y lisis; inflamación; a veces solo alteración funcional', prototipos: 'AHAI, Goodpasture, miastenia, Graves', destino: { parte: 'tipo-2', paso: 'd-0' } },
  { tipo: 'Tipo III', nombre: 'Por complejos', color: H.tipo3, efector: 'Complejos antígeno-anticuerpo, complemento, neutrófilos', antigeno: 'Soluble (circulante)', tiempo: '~1–2 semanas (horas en Arthus)', mecanismo: 'Depósito de complejos → complemento → neutrófilos → enzimas y radicales', lesion: 'Inflamación, vasculitis necrosante (necrosis fibrinoide)', prototipos: 'LES, GN postestreptocócica, enfermedad del suero, Arthus', destino: { parte: 'tipo-3', paso: 'v-0' } },
  { tipo: 'Tipo IV', nombre: 'Por linfocitos T', color: H.tipo4, efector: 'Th1, Th17, CD8; macrófagos', antigeno: 'Celular o tisular, hapteno', tiempo: '24–72 h', mecanismo: 'Citocinas (IFN-γ, IL-17) que inflaman y activan macrófagos; citotoxicidad del CD8', lesion: 'Infiltrados perivasculares, edema, granulomas, destrucción celular', prototipos: 'Dermatitis de contacto, PPD, EM, DM1, tuberculosis', destino: { parte: 'tipo-4', paso: 'c-0' } },
];

export const ENFERMEDADES: FilaEnfermedad[] = [
  { nombre: 'Anafilaxia', tipo: 'Tipo I', blanco: 'Fármacos, picadura, alimentos', manifestacion: 'Shock por vasodilatación; edema laríngeo', destino: { parte: 'anafilaxia', paso: 'a-4' } },
  { nombre: 'Asma bronquial', tipo: 'Tipo I', blanco: 'Aeroalérgenos', manifestacion: 'Broncoespasmo; inflamación de la fase tardía', destino: { parte: 'fase-tardia', paso: 't-6' } },
  { nombre: 'Rinitis alérgica', tipo: 'Tipo I', blanco: 'Pólenes, ácaros', manifestacion: 'Moco; inflamación de vías altas', destino: { parte: 'fase-inmediata', paso: 'm-5' } },
  { nombre: 'Urticaria', tipo: 'Tipo I', blanco: 'Alimentos, fármacos, físicos', manifestacion: 'Habones por edema de la dermis', destino: { parte: 'fase-inmediata', paso: 'm-3' } },
  { nombre: 'Alergia alimentaria', tipo: 'Tipo I', blanco: 'Maní, mariscos, leche, huevo', manifestacion: 'Más peristaltismo; puede dar anafilaxia', destino: { parte: 'anafilaxia', paso: 'a-3' } },
  { nombre: 'Anemia hemolítica autoinmune', tipo: 'Tipo II', blanco: 'Proteínas del hematíe (Rh, antígeno I)', manifestacion: 'Hemólisis, anemia', destino: { parte: 'tipo-2', paso: 'd-1' } },
  { nombre: 'Reacción transfusional ABO', tipo: 'Tipo II', blanco: 'Antígenos A/B del donante', manifestacion: 'Hemólisis intravascular, hemoglobinuria', destino: { parte: 'tipo-2', paso: 'd-3' } },
  { nombre: 'Enfermedad hemolítica del recién nacido', tipo: 'Tipo II', blanco: 'Rh (D) del hematíe fetal', manifestacion: 'Anemia, ictericia, hidrops', destino: { parte: 'tipo-2', paso: 'd-5' } },
  { nombre: 'Púrpura trombocitopénica autoinmune', tipo: 'Tipo II', blanco: 'GpIIb/IIIa plaquetaria', manifestacion: 'Sangrado', destino: { parte: 'tipo-2', paso: 'd-10' } },
  { nombre: 'Síndrome de Goodpasture', tipo: 'Tipo II', blanco: 'Membrana basal de glomérulo y alvéolo', manifestacion: 'Nefritis, hemorragia pulmonar', destino: { parte: 'tipo-2', paso: 'd-7' } },
  { nombre: 'Pénfigo vulgar', tipo: 'Tipo II', blanco: 'Desmogleínas', manifestacion: 'Ampollas suprabasales', destino: { parte: 'tipo-2', paso: 'd-9' } },
  { nombre: 'Fiebre reumática', tipo: 'Tipo II', blanco: 'Pared del estreptococo ↔ miocardio', manifestacion: 'Miocarditis, artritis', destino: { parte: 'tipo-2', paso: 'd-10' } },
  { nombre: 'Miastenia gravis', tipo: 'Tipo II', blanco: 'Receptor de acetilcolina', manifestacion: 'Debilidad muscular fatigable', destino: { parte: 'tipo-2', paso: 'd-11' } },
  { nombre: 'Enfermedad de Graves', tipo: 'Tipo II', blanco: 'Receptor de TSH', manifestacion: 'Hipertiroidismo', destino: { parte: 'tipo-2', paso: 'd-12' } },
  { nombre: 'Anemia perniciosa', tipo: 'Tipo II', blanco: 'Factor intrínseco', manifestacion: 'Déficit de B₁₂, anemia megaloblástica', destino: { parte: 'tipo-2', paso: 'd-13' } },
  { nombre: 'Lupus eritematoso sistémico', tipo: 'Tipo III (y II)', blanco: 'Antígenos nucleares', manifestacion: 'Nefritis, piel, artritis, citopenias', destino: { parte: 'tipo-3', paso: 'v-7' } },
  { nombre: 'GN postestreptocócica', tipo: 'Tipo III', blanco: 'Antígenos del estreptococo', manifestacion: 'Nefritis con C3 bajo', destino: { parte: 'tipo-3', paso: 'v-6' } },
  { nombre: 'Enfermedad del suero', tipo: 'Tipo III', blanco: 'Proteína extraña (antisuero)', manifestacion: 'Fiebre, artritis, vasculitis, nefritis', destino: { parte: 'tipo-3', paso: 'v-1' } },
  { nombre: 'Poliarteritis nudosa', tipo: 'Tipo III', blanco: 'Antígenos del VHB (a veces)', manifestacion: 'Vasculitis sistémica', destino: { parte: 'tipo-3', paso: 'v-5' } },
  { nombre: 'Reacción de Arthus', tipo: 'Tipo III', blanco: 'Proteína inyectada en la piel', manifestacion: 'Vasculitis y necrosis local', destino: { parte: 'tipo-3', paso: 'v-8' } },
  { nombre: 'Reacción de tuberculina (PPD)', tipo: 'Tipo IV', blanco: 'Proteínas de M. tuberculosis', manifestacion: 'Induración a las 24–72 h', destino: { parte: 'tipo-4', paso: 'c-2' } },
  { nombre: 'Dermatitis de contacto', tipo: 'Tipo IV', blanco: 'Urushiol, níquel (haptenos)', manifestacion: 'Dermatitis vesicular pruriginosa', destino: { parte: 'tipo-4', paso: 'c-7' } },
  { nombre: 'Tuberculosis', tipo: 'Tipo IV', blanco: 'Micobacterias persistentes', manifestacion: 'Granulomas caseificantes', destino: { parte: 'tipo-4', paso: 'c-8' } },
  { nombre: 'Artritis reumatoide', tipo: 'Tipo IV (y III)', blanco: 'Colágeno, proteínas citrulinadas', manifestacion: 'Artritis crónica destructiva', destino: { parte: 'tipo-4', paso: 'c-10' } },
  { nombre: 'Esclerosis múltiple', tipo: 'Tipo IV', blanco: 'Proteína básica de la mielina', manifestacion: 'Desmielinización, neuritis óptica', destino: { parte: 'tipo-4', paso: 'c-10' } },
  { nombre: 'Diabetes tipo 1', tipo: 'Tipo IV', blanco: 'Células β (insulina, GAD)', manifestacion: 'Insulitis, diabetes', destino: { parte: 'tipo-4', paso: 'c-11' } },
  { nombre: 'Psoriasis', tipo: 'Tipo IV', blanco: 'Desconocido', manifestacion: 'Placas cutáneas (Th17)', destino: { parte: 'tipo-4', paso: 'c-10' } },
];
