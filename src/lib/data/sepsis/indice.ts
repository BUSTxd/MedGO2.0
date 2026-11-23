// Los 17 capítulos del laboratorio «Sepsis», en orden: solo lo que se enseña aunque el
// capítulo esté cerrado. Nada de pasos ni de voz.

import type { ParteId } from './tipos';

export type MetaParte = {
  id: ParteId; numero: number; nombre: string; nombreCorto: string; tipo: string; lugar: string; color: string; pregunta: string;
};

export const INDICE: MetaParte[] = [
  { id: 'pacientes', numero: 0, nombre: 'Dos pacientes, una pregunta', nombreCorto: 'Pacientes', tipo: 'Introducción', lugar: 'Los dos casos del ACP13', color: '#E8541F', pregunta: '¿Cómo una infección apaga órganos que el microbio nunca tocó?' },
  { id: 'definicion', numero: 1, nombre: 'Sepsis, choque séptico y disfunción multiorgánica', nombreCorto: 'Definición', tipo: 'Definiciones', lugar: 'Sepsis-3, SOFA y qSOFA', color: '#C2307A', pregunta: '¿Sepsis es lo mismo que una infección grave?' },
  { id: 'huesped', numero: 2, nombre: 'La respuesta del huésped', nombreCorto: 'El huésped', tipo: 'Fisiopatología', lugar: 'Del foco a todo el cuerpo', color: '#7B3FD8', pregunta: '¿Cuándo una defensa deja de defender?' },
  { id: 'hemodinamia', numero: 3, nombre: 'Caliente y luego frío', nombreCorto: 'Caliente y frío', tipo: 'Fisiopatología', lugar: 'Choque cálido y choque frío', color: '#E0A100', pregunta: '¿Por qué el choque empieza con la piel caliente?' },
  { id: 'reconocer', numero: 4, nombre: 'Reconocer al invasor: PAMP, DAMP, PRR y TLR', nombreCorto: 'Reconocer', tipo: 'Inmunología', lugar: 'La membrana del monocito', color: '#2FA84F', pregunta: '¿Cómo sabe el cuerpo que algo es un microbio?' },
  { id: 'senal', numero: 5, nombre: 'La señal entra: MyD88, NF-κB e inflamasoma', nombreCorto: 'La señal', tipo: 'Biología celular', lugar: 'Del receptor al núcleo', color: '#5B4BE8', pregunta: '¿Cómo viaja la orden hasta el núcleo?' },
  { id: 'mensajeros', numero: 6, nombre: 'Los mensajeros: IL-1, IL-6, TNF-α, complemento y C5a', nombreCorto: 'Mensajeros', tipo: 'Inmunología', lugar: 'Hipotálamo, hígado y médula', color: '#E8721E', pregunta: '¿Qué hace cada mensajero y qué deja en la clínica?' },
  { id: 'endotelio', numero: 7, nombre: 'El endotelio se rompe', nombreCorto: 'Endotelio', tipo: 'Histología', lugar: 'El glucocálix y las uniones', color: '#0C9E9A', pregunta: '¿Cómo se rompe la pared que mantiene la sangre dentro?' },
  { id: 'coagulacion', numero: 8, nombre: 'Coagulación y anticoagulación: el equilibrio normal', nombreCorto: 'Coagulación', tipo: 'Hemostasia', lugar: 'Factores, plaquetas y frenos', color: '#2E78F2', pregunta: '¿Qué impide que la sangre se coagule por dentro?' },
  { id: 'enciende', numero: 9, nombre: 'La coagulación se enciende en la sepsis', nombreCorto: 'Se enciende', tipo: 'Hemostasia', lugar: 'Factor tisular y frenos rotos', color: '#D9344F', pregunta: '¿Qué le pasa a la balanza en la sepsis?' },
  { id: 'inmunotrombosis', numero: 10, nombre: 'Inmunotrombosis', nombreCorto: 'Inmunotrombosis', tipo: 'Inmunopatología', lugar: 'El microvaso y las NET', color: '#8A3FD8', pregunta: '¿Cuándo un coágulo defiende y cuándo estorba?' },
  { id: 'cid', numero: 11, nombre: 'CID, púrpura y necrosis', nombreCorto: 'CID', tipo: 'Patología', lugar: 'Sangre y piel', color: '#B8237A', pregunta: '¿Cómo se pasa de una petequia a la púrpura fulminante?' },
  { id: 'choque', numero: 12, nombre: 'El choque: vasoplejía, catecolaminas y corazón', nombreCorto: 'El choque', tipo: 'Fisiopatología', lugar: 'La arteriola y el corazón', color: '#19A8C2', pregunta: '¿Por qué los vasos dejan de apretar?' },
  { id: 'microcirculacion', numero: 13, nombre: 'Microcirculación y lactato', nombreCorto: 'Lactato', tipo: 'Metabolismo', lugar: 'Capilares y mitocondria', color: '#F2546B', pregunta: '¿Por qué sube el lactato aunque la presión esté bien?' },
  { id: 'organos', numero: 14, nombre: 'Órganos que fallan: riñón y cerebro', nombreCorto: 'Riñón y cerebro', tipo: 'Patología', lugar: 'Nefrona y encéfalo', color: '#0E9E6A', pregunta: '¿Por qué fallan órganos que el microbio no tocó?' },
  { id: 'pulmon', numero: 15, nombre: 'El pulmón: SDRA y su histopatología', nombreCorto: 'El pulmón', tipo: 'Patología', lugar: 'El alvéolo', color: '#2E5FD8', pregunta: '¿Por qué se llena de líquido un pulmón que no se infectó?' },
  { id: 'inmunoparalisis', numero: 16, nombre: 'Inmunosupresión y cierre', nombreCorto: 'Cierre', tipo: 'Inmunología', lugar: 'Linfocitos, monocitos y neutrófilos', color: '#6D3FD8', pregunta: '¿Qué le queda al cuerpo después del incendio?' },
];
