// Animación de entrada: la ruta completa en un vistazo, de la médula al timo y
// al ganglio, y la advertencia de que cada etapa puede originar una neoplasia.
// Su estado final es la portada.

import type { Escenario } from './tipos';
import { L } from './colores';

/** Duración mínima de cada parte de la intro (ms). */
const LECTURA = 6500;

const intro: Escenario = {
  id: 'intro',
  nombre: 'Maduración de linfocitos',
  resumen: 'De la célula madre a la célula plasmática, y dónde nacen las neoplasias linfoides.',
  fondo: 'ruta',
  actores: {
    o_medula: { forma: 'dibujo', dibujo: 'hueso', label: 'Médula ósea', d: 390, color: '#D8C3A5', info: 'medula_osea' },
    o_timo: { forma: 'organo', img: 'timo', label: 'Timo', d: 250, color: L.t, info: 'timo' },
    o_ganglio: { forma: 'organo', img: 'ganglio', label: 'Ganglio linfático', d: 320, color: L.gc, info: 'ganglio' },
    // Pequeña: nace dentro de la médula roja de la epífisis (la ventana del dibujo).
    i_hsc: { forma: 'celula', img: 'hsc', label: 'Célula madre', d: 72, color: L.madre, info: 'hsc' },
    i_clp: { forma: 'celula', img: 'progenitor_linfoide', label: 'Progenitor linfoide', d: 100, color: L.linfoide, info: 'clp' },
    i_b: { forma: 'celula', img: 'linfocito_1', label: 'Linfocito B', d: 100, color: L.b, info: 'bmaduro' },
    i_t: { forma: 'celula', img: 'linfocito_2', label: 'Linfocito T', d: 100, color: L.t, info: 'sp' },
    i_gc: { forma: 'dibujo', dibujo: 'centroblasto', label: 'Centro germinal', d: 105, color: L.gc, info: 'centroblasto' },
    i_pc: { forma: 'dibujo', dibujo: 'plasmocito', label: 'Célula plasmática', d: 110, color: L.plasma, info: 'plasmocito' },
  },
  pasos: [
    {
      id: 'in-0',
      orden: 0,
      titulo: 'Tres lugares',
      texto: 'Los linfocitos nacen en la médula ósea, los T maduran en el timo y todos encuentran al antígeno en los ganglios.',
      profundiza: '',
      protagonistas: [],
      acciones: [
        // Tiempo de lectura: la parte no se acaba antes de poder leerla.
        { at: 0, tipo: 'wait', ms: LECTURA },
        // En un teléfono vertical (posV/toV) los órganos se apilan: médula y
        // timo arriba, ganglio abajo. En fila salían diminutos.
        { at: 0, tipo: 'appear', actor: 'o_medula', pos: { col: 2.2, row: 4.9 }, posV: { col: 6.0, row: 2.6 }, from: 'grow' },
        { at: 300, tipo: 'appear', actor: 'o_timo', pos: { col: 7.6, row: 2.4 }, posV: { col: 10.0, row: 2.0 }, from: 'grow' },
        { at: 600, tipo: 'appear', actor: 'o_ganglio', pos: { col: 13.0, row: 5.4 }, posV: { col: 8.0, row: 7.3 }, from: 'grow' },
      ],
    },
    {
      id: 'in-1',
      orden: 1,
      titulo: 'La célula madre',
      texto: 'En la médula, la célula madre se divide y da un progenitor linfoide común.',
      profundiza: '',
      protagonistas: [],
      acciones: [
        // Tiempo de lectura: la parte no se acaba antes de poder leerla.
        { at: 0, tipo: 'wait', ms: LECTURA },
        // La célula madre aparece en la médula roja (centro de la epífisis
        // abierta del hueso: (1,56; 3,70) con el hueso en (2,2; 4,9) girado 28°),
        // se divide allí y sus hijas salen del hueso hacia la derecha, lejos de
        // los rótulos «médula roja» y «médula amarilla».
        { at: 0, tipo: 'appear', actor: 'i_hsc', pos: { col: 1.56, row: 3.7 }, posV: { col: 5.36, row: 1.4 }, from: 'grow', duration: 700 },
        { at: 700, tipo: 'activate', actor: 'i_hsc' },
        { at: 900, tipo: 'note', text: 'Nace en la médula roja', near: 'i_hsc', side: 'top' },
        { at: 2200, tipo: 'divide', actor: 'i_hsc', into: ['i_clp', 'i_b'], pos: [{ col: 5.4, row: 3.7 }, { col: 5.0, row: 1.75 }], posV: [{ col: 8.6, row: 4.1 }, { col: 3.9, row: 5.5 }], duration: 2200 },
      ],
    },
    {
      id: 'in-2',
      orden: 2,
      titulo: 'B en la médula, T en el timo',
      texto: 'El linfocito B madura en la médula; el progenitor T viaja al timo y aprende allí a reconocer lo propio.',
      profundiza: '',
      protagonistas: [],
      acciones: [
        // Tiempo de lectura: la parte no se acaba antes de poder leerla.
        { at: 0, tipo: 'wait', ms: LECTURA },
        { at: 0, tipo: 'connect', id: 'a-timo', from: 'i_clp', to: 'o_timo', type: 'migra', curve: -0.25 },
        { at: 300, tipo: 'move', actor: 'i_clp', to: { col: 7.6, row: 4.5 }, toV: { col: 10.0, row: 4.1 }, duration: 1500 },
        { at: 1800, tipo: 'swap', actor: 'i_clp', img: 'linfocito_2', label: 'Linfocito T' },
        { at: 1900, tipo: 'disconnect', id: 'a-timo' },
      ],
    },
    {
      id: 'in-3',
      orden: 3,
      titulo: 'Al ganglio',
      texto: 'Los dos salen a la sangre y se alojan en los ganglios: el B en los folículos, el T en la paracorteza.',
      profundiza: '',
      protagonistas: [],
      acciones: [
        // Tiempo de lectura: la parte no se acaba antes de poder leerla.
        { at: 0, tipo: 'wait', ms: LECTURA },
        { at: 0, tipo: 'move', actor: 'i_b', to: { col: 10.4, row: 4.3 }, toV: { col: 5.6, row: 6.2 }, duration: 1600 },
        { at: 200, tipo: 'move', actor: 'i_clp', to: { col: 15.0, row: 3.0 }, toV: { col: 10.4, row: 5.8 }, duration: 1500 },
        { at: 1800, tipo: 'connect', id: 'ayuda', from: 'i_clp', to: 'i_b', type: 'activa', label: 'ayuda T' },
      ],
    },
    {
      id: 'in-4',
      orden: 4,
      titulo: 'Centro germinal y plasmática',
      texto: 'Con el antígeno y la ayuda T, el B forma un centro germinal, mejora su anticuerpo y sale como célula plasmática, que vuelve a la médula.',
      profundiza: '',
      protagonistas: [],
      acciones: [
        // Tiempo de lectura: la parte no se acaba antes de poder leerla.
        { at: 0, tipo: 'wait', ms: LECTURA },
        { at: 0, tipo: 'disconnect', id: 'ayuda' },
        { at: 100, tipo: 'swap', actor: 'i_b', dibujo: 'centroblasto', label: 'Centro germinal' },
        { at: 900, tipo: 'divide', actor: 'i_b', into: ['i_gc', 'i_pc'], pos: [{ col: 10.6, row: 7.6 }, { col: 8.2, row: 7.8 }], posV: [{ col: 5.4, row: 8.9 }, { col: 3.6, row: 7.6 }], duration: 1300 },
        { at: 2300, tipo: 'connect', id: 'vuelve', from: 'i_pc', to: 'o_medula', type: 'migra', curve: -0.15 },
      ],
    },
    {
      id: 'in-5',
      orden: 5,
      titulo: 'Y cada etapa puede volverse neoplasia',
      texto: 'Si una etapa se congela y prolifera sin control, nace una leucemia o un linfoma con su inmunofenotipo.',
      profundiza: '',
      protagonistas: [],
      planoGeneral: true,
      acciones: [
        // Tiempo de lectura: la parte no se acaba antes de poder leerla.
        { at: 0, tipo: 'wait', ms: LECTURA },
        { at: 0, tipo: 'marca', actor: 'o_medula', texto: 'LLA-B · mieloma' },
        { at: 400, tipo: 'marca', actor: 'o_timo', texto: 'LLA-T' },
        { at: 800, tipo: 'marca', actor: 'o_ganglio', texto: 'Linfomas B y Hodgkin' },
      ],
    },
  ],
};

export default intro;
