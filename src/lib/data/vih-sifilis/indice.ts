// Los 21 capítulos del laboratorio «VIH y sífilis», en orden: solo lo que se enseña aunque
// el capítulo esté cerrado. Nada de pasos ni de voz. Del 0 al 14, el VIH; del 15 al 20, la
// sífilis (el lienzo cambia de fondo en el 15).

import type { ParteId } from './tipos';

export type MetaParte = {
  id: ParteId; numero: number; nombre: string; nombreCorto: string; tipo: string; lugar: string; color: string; pregunta: string;
};

export const INDICE: MetaParte[] = [
  { id: 'pacientes', numero: 0, nombre: 'Dos pacientes, una puerta', nombreCorto: 'Pacientes', tipo: 'Introducción', lugar: 'Los dos casos del ACP14', color: '#E8541F', pregunta: '¿Por qué se estudian juntos un virus y una espiroqueta?' },
  { id: 'vih', numero: 1, nombre: 'VIH-1 y VIH-2', nombreCorto: 'VIH-1 y 2', tipo: 'Virología', lugar: 'El virus y su origen', color: '#2FA84F', pregunta: '¿Qué es un retrovirus y de dónde salió?' },
  { id: 'virion', numero: 2, nombre: 'El virión', nombreCorto: 'El virión', tipo: 'Virología', lugar: 'La partícula', color: '#4FB82E', pregunta: '¿Qué hay afuera y adentro del virus?' },
  { id: 'genes', numero: 3, nombre: 'Genes y proteínas', nombreCorto: 'Genes', tipo: 'Virología', lugar: 'El genoma y las accesorias', color: '#7AB317', pregunta: '¿Cómo vence a las defensas con nueve genes?' },
  { id: 'celulas', numero: 4, nombre: 'Células diana y tropismo', nombreCorto: 'Células diana', tipo: 'Virología', lugar: 'Linfocitos, macrófagos y dendríticas', color: '#5B4BE8', pregunta: '¿A qué células entra y con qué dos llaves?' },
  { id: 'mucosa', numero: 5, nombre: 'La mucosa: por dónde entra', nombreCorto: 'La mucosa', tipo: 'Histología', lugar: 'Epitelios y lámina propia', color: '#C42FB0', pregunta: '¿Cómo cruza el virus la barrera?' },
  { id: 'ciclo', numero: 6, nombre: 'El ciclo replicativo', nombreCorto: 'El ciclo', tipo: 'Virología', lugar: 'Dentro de un linfocito CD4', color: '#E8721E', pregunta: '¿Cómo un virión se vuelve mil?' },
  { id: 'inmunidad', numero: 7, nombre: 'La respuesta inmunitaria y la caída de los CD4', nombreCorto: 'Inmunidad', tipo: 'Inmunopatología', lugar: 'Ganglio, sangre e intestino', color: '#19A8C2', pregunta: '¿De cuántas formas se pierde un CD4?' },
  { id: 'historia', numero: 8, nombre: 'Historia natural', nombreCorto: 'Historia', tipo: 'Clínica', lugar: 'Del contagio al sida', color: '#D9344F', pregunta: '¿Qué explica cada hallazgo del paciente 1?' },
  { id: 'carga', numero: 9, nombre: 'Carga viral, CD4 y clínica', nombreCorto: 'Carga y CD4', tipo: 'Clínica', lugar: 'Los dos números', color: '#2E78F2', pregunta: '¿Qué cuentan el CD4 y la carga viral?' },
  { id: 'diagnostico', numero: 10, nombre: 'El diagnóstico', nombreCorto: 'Diagnóstico', tipo: 'Diagnóstico', lugar: 'Laboratorio', color: '#0E9E6A', pregunta: '¿Cuándo una prueba negativa no descarta la infección?' },
  { id: 'oportunistas', numero: 11, nombre: 'Infecciones oportunistas y VIH avanzado', nombreCorto: 'Oportunistas', tipo: 'Patología', lugar: 'Pulmón, piel y sangre', color: '#8A3FD8', pregunta: '¿Qué aparece cuando cae el CD4?' },
  { id: 'tar', numero: 12, nombre: 'El tratamiento antirretroviral: antes y ahora', nombreCorto: 'Tratamiento', tipo: 'Farmacología', lugar: 'Cada hueco del ciclo', color: '#E0A100', pregunta: '¿Qué fármaco ocupa cada hueco?' },
  { id: 'nuevo', numero: 13, nombre: 'Lo nuevo', nombreCorto: 'Lo nuevo', tipo: 'Farmacología', lugar: 'Lenacapavir y lo que viene', color: '#F2546B', pregunta: '¿Qué cambian las inyecciones y la cápside?' },
  { id: 'fallo', numero: 14, nombre: 'Fallo y resistencia', nombreCorto: 'Fallo', tipo: 'Clínica', lugar: 'El paciente 1, a los ocho meses', color: '#B8237A', pregunta: '¿Por qué falla un tratamiento?' },
  { id: 'treponema', numero: 15, nombre: 'Treponema pallidum', nombreCorto: 'Treponema', tipo: 'Microbiología', lugar: 'La espiroqueta', color: '#0C9E9A', pregunta: '¿Cómo se esconde una bacteria tan fina?' },
  { id: 'endarteritis', numero: 16, nombre: 'Inmunopatogenia y endarteritis', nombreCorto: 'Endarteritis', tipo: 'Patología', lugar: 'El vaso pequeño', color: '#C2307A', pregunta: '¿Cómo daña los vasos?' },
  { id: 'chancro', numero: 17, nombre: 'Sífilis primaria: el chancro', nombreCorto: 'El chancro', tipo: 'Clínica', lugar: 'Piel y mucosa', color: '#E8541F', pregunta: '¿Por qué la úlcera no duele?' },
  { id: 'estadios', numero: 18, nombre: 'Secundaria, latente, terciaria y congénita', nombreCorto: 'Estadios', tipo: 'Clínica', lugar: 'Piel, aorta, cerebro y placenta', color: '#1E9E6A', pregunta: '¿Por qué cada lesión?' },
  { id: 'serologia', numero: 19, nombre: 'Serología de la sífilis', nombreCorto: 'Serología', tipo: 'Diagnóstico', lugar: 'Suero y títulos', color: '#2E78F2', pregunta: '¿Qué miden las pruebas y cuándo fallan?' },
  { id: 'tratamiento', numero: 20, nombre: 'Tratamiento de la sífilis y cierre', nombreCorto: 'Cierre', tipo: 'Farmacología', lugar: 'Penicilina y las dos infecciones', color: '#6D3FD8', pregunta: '¿Por qué van juntas?' },
];
