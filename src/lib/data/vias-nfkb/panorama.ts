// Panorama: las tres vías en un solo lienzo, con la disposición de la figura
// de Küppers (J Clin Invest 2012, fig. 2) llevada a 16 × 10 celdas. Sirve a
// tres cosas:
//   · INTRO, la animación de entrada (guion §2.4), cuyo estado final es la
//     portada (un esquema estático como la figura: el complejo citoplasmático
//     y el dímero nuclear se ven a la vez);
//   · ESTUDIO_INICIO + PIEZAS, el modo estudio (guion §2.5), que en cambio es
//     mecánico: el dímero citoplasmático es el que viaja al núcleo;
//   · ALTERACIONES_PANORAMA, los rótulos rojos de la figura.

import type { ActorDecl, Escenario, Paso, Pieza, Pos } from './tipos';
import { C, ROJO_ALTERACION } from './colores';

/** Escala del texto del panorama (las elipses miden 92 × 46, como en la figura). */
const K = 0.78;
const P = (label: string, color: string, info?: string, w = 92): ActorDecl => ({ forma: 'proteina', label, color, info, w, h: 46 });
const R = (label: string, color: string, info?: string): ActorDecl => ({ forma: 'receptor', label, color, info, w: 28, h: 92 });
const L = (label: string, color: string, info: string): ActorDecl => ({ forma: 'ligando', label, color, info, w: 50, h: 44 });

export const MEMBRANA = 1.62;
export const NUCLEO = 7.45;
const FILA_NUC = 8.62;

const actores: Record<string, ActorDecl> = {
  // Vía clásica
  c_cd30l: L('CD30L', C.cd30, 'cd30l'),
  c_rankl: L('RANKL', C.rank, 'rankl'),
  c_cd40l: L('CD40L', C.cd40, 'cd40l'),
  c_cd30: R('CD30', C.cd30, 'cd30'),
  c_rank: R('RANK', C.rank, 'rank'),
  c_cd40: R('CD40', C.cd40, 'cd40'),
  c_rip: P('RIP', C.rip, 'rip'),
  c_traf: P('TRAF', C.traf, 'traf'),
  c_tak1: P('TAK1', C.tak1, 'tak1', 72),
  c_nemo: P('NEMO', C.nemo, 'nemo'),
  c_ikka: P('IKKα', C.ikka, 'ikka'),
  c_ikkb: P('IKKβ', C.ikkb, 'ikkb'),
  c_ikba: P('IκBα/IκBε', C.ikba, 'ikba', 112),
  c_p50: P('p50', C.p50, 'p50'),
  c_p65: P('p65', C.p65, 'p65'),
  c_btrcp: { forma: 'imagen', img: 'e3_ligasa_scf', label: 'β-TrCP', w: 96, info: 'btrcp' },
  c_p50n: P('p50', C.p50, 'p50'),
  c_p65n: P('p65', C.p65, 'p65'),
  c_bcl3: P('BCL3', C.bcl3, 'bcl3'),
  c_p50b: P('p50', C.p50, 'p50'),
  c_p50c: P('p50', C.p50, 'p50'),
  c_lmp1: { forma: 'multipaso', label: 'LMP1', color: C.lmp1, info: 'lmp1', w: 74, h: 88 },
  c_a20: P('A20', C.a20, 'a20', 72),
  c_cyld: P('CYLD', C.cyld, 'cyld', 76),
  c_ikbn: P('IκBα', C.ikba, 'ikba'),
  c_rel: P('c-Rel', C.crel, 'crel', 80),
  // Compartido
  prot: { forma: 'imagen', img: 'proteasoma', label: 'Proteasoma', w: 70, info: 'proteasoma' },
  adn: { forma: 'adn', label: 'ADN', tira: 16, info: 'adn', h: 50 },
  // Vía alternativa
  a_cd40l: L('CD40L', C.cd40, 'cd40l'),
  a_baff: L('BAFF', C.bcma, 'baff'),
  a_cd40: R('CD40', C.cd40, 'cd40'),
  a_bcma: R('BCMA', C.bcma, 'bcma'),
  a_nik: P('NIK', C.nik, 'nik'),
  a_traf3: P('TRAF3', C.traf3, 'traf3', 84),
  a_ikka1: P('IKKα', C.ikka, 'ikka'),
  a_ikka2: P('IKKα', C.ikka, 'ikka'),
  a_p100: P('p100', C.p100, 'p100'),
  a_relb: P('RELB', C.relb, 'relb'),
  a_p52: P('p52', C.p52, 'p52'),
  a_p52n: P('p52', C.p52, 'p52'),
  a_relbn: P('RELB', C.relb, 'relb'),
  // JAK/STAT
  j_il13: { forma: 'citocina', label: 'IL-13', color: C.citocina, info: 'il13', w: 38, h: 38 },
  j_rec: R('Receptor de citocinas', C.receptor, 'receptor_citocinas'),
  j_jak: P('JAK', C.jak, 'jak'),
  j_stat1: P('STAT', C.stat, 'stat'),
  j_stat2: P('STAT', C.stat, 'stat'),
  j_stat1n: P('STAT', C.stat, 'stat'),
  j_stat2n: P('STAT', C.stat, 'stat'),
  j_socs1: P('SOCS1', C.socs1, 'socs1', 84),
};

const compartimentos = {
  membrana: MEMBRANA,
  nucleo: NUCLEO,
  rotulosVias: [
    { via: 'clasica' as const, col: 2.5 },
    { via: 'alternativa' as const, col: 8.33 },
    { via: 'jakstat' as const, col: 13.8 },
  ],
  rotulos: { citoplasma: { col: 11.2, row: 6.75 }, nucleo: { col: 11.2, row: 8.3 } },
};

const pos = (col: number, row: number): Pos => ({ col, row });

// ─── Reposo (común a la intro y al estudio) ──────────────────────────────────

/** Membrana, receptores sin ligando, complejos citoplasmáticos y ADN. */
const REPOSO: Paso['acciones'] = [
  { at: 0, tipo: 'appear', actor: 'adn', pos: pos(8, 9.05) },
  { at: 150, tipo: 'appear', actor: 'c_cd30', pos: pos(1.64, MEMBRANA), from: 'top' },
  { at: 250, tipo: 'appear', actor: 'c_rank', pos: pos(2.51, MEMBRANA), from: 'top' },
  { at: 350, tipo: 'appear', actor: 'c_cd40', pos: pos(3.39, MEMBRANA), from: 'top' },
  { at: 450, tipo: 'appear', actor: 'a_cd40', pos: pos(8.34, MEMBRANA), from: 'top' },
  { at: 550, tipo: 'appear', actor: 'a_bcma', pos: pos(9.21, MEMBRANA), from: 'top' },
  { at: 650, tipo: 'appear', actor: 'j_rec', pos: pos(13.8, MEMBRANA), from: 'top' },
  { at: 700, tipo: 'appear', actor: 'prot', pos: pos(5.3, 6.35) },
  { at: 800, tipo: 'appear', actor: 'c_p50', pos: pos(2.07, 6.5) },
  { at: 800, tipo: 'appear', actor: 'c_p65', pos: pos(2.95, 6.5) },
  { at: 1100, tipo: 'bind', actor: 'c_p65', target: 'c_p50', lado: 'der', duration: 250 },
  { at: 1100, tipo: 'appear', actor: 'c_ikba', pos: pos(2.51, 5.9), from: 'top' },
  { at: 1400, tipo: 'bind', actor: 'c_ikba', target: 'c_p50', offset: pos(0.44, -0.34), duration: 400 },
  { at: 900, tipo: 'appear', actor: 'a_p100', pos: pos(7.89, 6.26) },
  { at: 900, tipo: 'appear', actor: 'a_relb', pos: pos(8.78, 6.26) },
  { at: 1200, tipo: 'bind', actor: 'a_relb', target: 'a_p100', lado: 'der', duration: 250 },
  { at: 1000, tipo: 'appear', actor: 'j_jak', pos: pos(13.8, 2.9) },
  { at: 1300, tipo: 'bind', actor: 'j_jak', target: 'j_rec', offset: pos(0, 1.0), duration: 300 },
  { at: 1000, tipo: 'appear', actor: 'j_stat1', pos: pos(12.9, 6.26) },
  { at: 1100, tipo: 'appear', actor: 'j_stat2', pos: pos(14.7, 6.26) },
];

// ─── Intro (animación de entrada → portada) ──────────────────────────────────

const INTRO_PASOS: Paso[] = [
  {
    id: 'in-1',
    orden: 0,
    titulo: 'Tres vías, una célula',
    texto: 'Membrana, citoplasma y núcleo: los receptores esperan sin ligando y los factores de transcripción, retenidos en el citoplasma.',
    profundiza: '',
    protagonistas: [],
    acciones: [
      ...REPOSO,
      { at: 1500, tipo: 'appear', actor: 'a_traf3', pos: pos(9.75, 2.95) },
    ],
  },
  {
    id: 'in-2',
    orden: 1,
    titulo: 'Vía clásica',
    texto: 'Los receptores activan RIP/TRAF y el complejo IKK; IκBα va al proteasoma y p50/p65 entra al núcleo.',
    profundiza: '',
    protagonistas: [],
    acciones: [
      { at: 0, tipo: 'appear', actor: 'c_cd30l', pos: pos(1.64, 0.62), from: 'top', duration: 350 },
      { at: 60, tipo: 'appear', actor: 'c_rankl', pos: pos(2.51, 0.62), from: 'top', duration: 350 },
      { at: 120, tipo: 'appear', actor: 'c_cd40l', pos: pos(3.39, 0.62), from: 'top', duration: 350 },
      { at: 300, tipo: 'appear', actor: 'c_rip', pos: pos(2.07, 2.95), duration: 350 },
      { at: 350, tipo: 'appear', actor: 'c_traf', pos: pos(2.95, 2.95), duration: 350 },
      { at: 400, tipo: 'connect', id: 'i:cd30>rip', from: 'c_cd30', to: 'c_rip', type: 'activa', duration: 300 },
      { at: 420, tipo: 'connect', id: 'i:rank>rip', from: 'c_rank', to: 'c_rip', type: 'activa', duration: 300, curve: 0 },
      { at: 440, tipo: 'connect', id: 'i:cd40>traf', from: 'c_cd40', to: 'c_traf', type: 'activa', duration: 300 },
      { at: 700, tipo: 'appear', actor: 'c_nemo', pos: pos(2.51, 4.18), duration: 350 },
      { at: 720, tipo: 'appear', actor: 'c_ikka', pos: pos(2.07, 4.52), duration: 350 },
      { at: 740, tipo: 'appear', actor: 'c_ikkb', pos: pos(2.95, 4.52), duration: 350 },
      { at: 800, tipo: 'connect', id: 'i:traf>nemo', from: 'c_rip', to: 'c_nemo', type: 'activa', duration: 300, curve: 0 },
      { at: 1100, tipo: 'connect', id: 'i:ikk>ikba', from: 'c_ikka', to: 'c_ikba', type: 'activa', duration: 300, curve: 0 },
      { at: 1300, tipo: 'connect', id: 'i:ikba>prot', from: 'c_ikba', to: 'prot', type: 'degrada', duration: 400 },
      { at: 1500, tipo: 'pulse_signal', from: 'c_rank', to: 'c_rip' },
      { at: 1700, tipo: 'appear', actor: 'c_p50n', pos: pos(2.07, FILA_NUC), from: 'grow', duration: 400 },
      { at: 1750, tipo: 'appear', actor: 'c_p65n', pos: pos(2.95, FILA_NUC), from: 'grow', duration: 400 },
      { at: 1800, tipo: 'connect', id: 'i:p50>p50n', from: 'c_p50', to: 'c_p50n', type: 'activa', duration: 400, curve: 0 },
      { at: 2000, tipo: 'appear', actor: 'c_p50b', pos: pos(4.97, FILA_NUC), from: 'grow', duration: 400 },
      { at: 2050, tipo: 'appear', actor: 'c_p50c', pos: pos(5.85, FILA_NUC), from: 'grow', duration: 400 },
      { at: 2150, tipo: 'appear', actor: 'c_bcl3', pos: pos(5.41, 8.27), from: 'top', duration: 400 },
      { at: 2300, tipo: 'pulse_signal', from: 'c_p50', to: 'c_p50n' },
    ],
  },
  {
    id: 'in-3',
    orden: 2,
    titulo: 'Vía alternativa',
    texto: 'CD40 y BCMA dejan que NIK se acumule; IKKα marca a p100, que el proteasoma recorta a p52.',
    profundiza: '',
    protagonistas: [],
    acciones: [
      { at: 0, tipo: 'appear', actor: 'a_cd40l', pos: pos(8.34, 0.62), from: 'top', duration: 350 },
      { at: 60, tipo: 'appear', actor: 'a_baff', pos: pos(9.21, 0.62), from: 'top', duration: 350 },
      { at: 300, tipo: 'appear', actor: 'a_nik', pos: pos(8.35, 2.95), duration: 350 },
      { at: 350, tipo: 'connect', id: 'i:cd40>nik', from: 'a_cd40', to: 'a_nik', type: 'activa', duration: 300, curve: 0 },
      { at: 380, tipo: 'connect', id: 'i:bcma>nik', from: 'a_bcma', to: 'a_nik', type: 'activa', duration: 300 },
      { at: 450, tipo: 'connect', id: 'i:traf3-nik', from: 'a_traf3', to: 'a_nik', type: 'inhibe', duration: 300, curve: 0 },
      { at: 700, tipo: 'appear', actor: 'a_ikka1', pos: pos(7.89, 4.52), duration: 350 },
      { at: 720, tipo: 'appear', actor: 'a_ikka2', pos: pos(8.78, 4.52), duration: 350 },
      { at: 800, tipo: 'connect', id: 'i:nik>ikka', from: 'a_nik', to: 'a_ikka1', type: 'activa', duration: 300, curve: 0 },
      { at: 1100, tipo: 'connect', id: 'i:ikka>p100', from: 'a_ikka1', to: 'a_p100', type: 'activa', duration: 300, curve: 0 },
      { at: 1300, tipo: 'connect', id: 'i:p100>prot', from: 'a_p100', to: 'prot', type: 'degrada', duration: 400 },
      { at: 1500, tipo: 'pulse_signal', from: 'a_cd40', to: 'a_nik' },
      { at: 1700, tipo: 'appear', actor: 'a_p52n', pos: pos(7.89, FILA_NUC), from: 'grow', duration: 400 },
      { at: 1750, tipo: 'appear', actor: 'a_relbn', pos: pos(8.78, FILA_NUC), from: 'grow', duration: 400 },
      { at: 1800, tipo: 'connect', id: 'i:relb>relbn', from: 'a_relb', to: 'a_relbn', type: 'activa', duration: 400, curve: 0 },
      { at: 2200, tipo: 'pulse_signal', from: 'a_relb', to: 'a_relbn' },
    ],
  },
  {
    id: 'in-4',
    orden: 3,
    titulo: 'JAK/STAT',
    texto: 'La citocina activa JAK, que fosforila a STAT; el dímero de STAT entra al núcleo.',
    profundiza: '',
    protagonistas: [],
    acciones: [
      { at: 0, tipo: 'appear', actor: 'j_il13', pos: pos(13.8, 0.62), from: 'top', duration: 350 },
      { at: 300, tipo: 'connect', id: 'i:rec>jak', from: 'j_rec', to: 'j_jak', type: 'activa', duration: 300, curve: 0 },
      { at: 500, tipo: 'move', actor: 'j_stat1', to: pos(13.36, 6.26), duration: 500 },
      { at: 500, tipo: 'move', actor: 'j_stat2', to: pos(14.24, 6.26), duration: 500 },
      { at: 800, tipo: 'connect', id: 'i:jak>stat', from: 'j_jak', to: 'j_stat1', type: 'activa', duration: 300, curve: 0 },
      { at: 1100, tipo: 'pulse_signal', from: 'j_rec', to: 'j_jak' },
      { at: 1300, tipo: 'appear', actor: 'j_stat1n', pos: pos(13.36, FILA_NUC), from: 'grow', duration: 400 },
      { at: 1350, tipo: 'appear', actor: 'j_stat2n', pos: pos(14.24, FILA_NUC), from: 'grow', duration: 400 },
      { at: 1400, tipo: 'connect', id: 'i:stat>statn', from: 'j_stat1', to: 'j_stat1n', type: 'activa', duration: 400, curve: 0 },
      { at: 1800, tipo: 'pulse_signal', from: 'j_stat1', to: 'j_stat1n' },
    ],
  },
  {
    id: 'in-5',
    orden: 4,
    titulo: 'VEB: LMP1',
    texto: 'En ≈40 % de los linfomas de Hodgkin, la proteína LMP1 del virus de Epstein-Barr enciende las dos vías NF-κB sin ligando.',
    profundiza: '',
    protagonistas: [],
    acciones: [
      { at: 0, tipo: 'appear', actor: 'c_lmp1', pos: pos(5.54, MEMBRANA), from: 'grow', duration: 450 },
      { at: 400, tipo: 'connect', id: 'i:lmp1>traf', from: 'c_lmp1', to: 'c_traf', type: 'activa', duration: 450, curve: 0.18 },
      { at: 450, tipo: 'connect', id: 'i:lmp1>nik', from: 'c_lmp1', to: 'a_nik', type: 'activa', duration: 450, curve: -0.12 },
      { at: 1000, tipo: 'pulse_signal', from: 'c_lmp1', to: 'c_traf' },
      { at: 1000, tipo: 'pulse_signal', from: 'c_lmp1', to: 'a_nik' },
      { at: 1500, tipo: 'activate', actor: 'adn', duration: 600 },
    ],
  },
];

export const INTRO: Escenario = {
  id: 'intro',
  nombre: 'Vías NF-κB y JAK/STAT',
  resumen: 'Las tres vías de la figura de Küppers en un solo lienzo.',
  compartimentos,
  actores,
  pasos: INTRO_PASOS,
  texto: K,
};

// ─── Modo estudio ────────────────────────────────────────────────────────────

export const ESTUDIO: Escenario = {
  id: 'estudio',
  nombre: 'Modo estudio',
  resumen: 'Arrastra cada pieza a su vía, en orden.',
  compartimentos,
  actores,
  pasos: [{
    id: 'es-0',
    orden: 0,
    titulo: 'Reposo',
    texto: '',
    profundiza: '',
    protagonistas: [],
    acciones: [...REPOSO, { at: 1500, tipo: 'appear', actor: 'a_traf3', pos: pos(9.75, 2.95) }],
  }],
  texto: K,
};

const tok = {
  lig: (label: string, color: string) => ({ label, color, forma: 'ligando' as const }),
  prot: (label: string, color: string) => ({ label, color, forma: 'proteina' as const }),
  alt: (label: string) => ({ label, color: ROJO_ALTERACION, forma: 'alteracion' as const }),
};

export const PIEZAS: Pieza[] = [
  // ─── Fisiología · vía clásica ─────────────────────────────────────────────
  {
    id: 'c-lig', via: 'clasica', ronda: 'fisiologia',
    ficha: tok.lig('CD30L · RANKL · CD40L', C.cd30),
    hueco: pos(2.51, 0.82),
    titulo: 'Llegan los ligandos',
    explica: 'Los ligandos triméricos de las células vecinas se unen a CD30, RANK y CD40 y agrupan sus colas: ahora pueden reclutar a TRAF.',
    acciones: [
      { at: 0, tipo: 'appear', actor: 'c_cd30l', pos: pos(1.64, 0.25), from: 'top' },
      { at: 80, tipo: 'appear', actor: 'c_rankl', pos: pos(2.51, 0.25), from: 'top' },
      { at: 160, tipo: 'appear', actor: 'c_cd40l', pos: pos(3.39, 0.25), from: 'top' },
      { at: 500, tipo: 'bind', actor: 'c_cd30l', target: 'c_cd30', lado: 'arriba' },
      { at: 560, tipo: 'bind', actor: 'c_rankl', target: 'c_rank', lado: 'arriba' },
      { at: 620, tipo: 'bind', actor: 'c_cd40l', target: 'c_cd40', lado: 'arriba' },
      { at: 1300, tipo: 'activate', actor: 'c_cd30' },
      { at: 1350, tipo: 'activate', actor: 'c_rank' },
      { at: 1400, tipo: 'activate', actor: 'c_cd40' },
    ],
  },
  {
    id: 'c-riptraf', via: 'clasica', ronda: 'fisiologia',
    ficha: tok.prot('RIP + TRAF', C.traf),
    hueco: pos(2.51, 2.95),
    titulo: 'RIP y TRAF fabrican la plataforma',
    explica: 'TRAF se acopla a las colas de los receptores y trae a RIP. Su dominio RING fabrica cadenas de ubiquitina K63 sobre RIP: no son para degradar, sino una plataforma de anclaje.',
    acciones: [
      { at: 0, tipo: 'appear', actor: 'c_traf', pos: pos(2.95, 3.4), from: 'bottom' },
      { at: 150, tipo: 'appear', actor: 'c_rip', pos: pos(1.5, 3.4), from: 'left' },
      { at: 600, tipo: 'move', actor: 'c_traf', to: pos(2.95, 2.95) },
      { at: 700, tipo: 'bind', actor: 'c_rip', target: 'c_traf', lado: 'izq' },
      { at: 1400, tipo: 'connect', id: 'e:cd40>traf', from: 'c_cd40', to: 'c_traf', type: 'activa' },
      { at: 1450, tipo: 'connect', id: 'e:cd30>rip', from: 'c_cd30', to: 'c_rip', type: 'activa' },
      { at: 1700, tipo: 'activate', actor: 'c_traf' },
      { at: 1800, tipo: 'ubiquitinate', ligase: 'c_traf', target: 'c_rip', chain: 'K63' },
    ],
  },
  {
    id: 'c-ikk', via: 'clasica', ronda: 'fisiologia',
    ficha: tok.prot('NEMO + IKKα/β', C.nemo),
    hueco: pos(2.51, 4.35),
    titulo: 'El complejo IKK se activa y marca a IκBα',
    explica: 'TAK1 se ancla a las cadenas K63; NEMO las lee y trae a IKKα e IKKβ. TAK1 fosforila a IKKβ (Ser177/181) y el complejo IKK fosforila a IκBα en Ser32/Ser36: el fosfodegrón.',
    acciones: [
      { at: 0, tipo: 'appear', actor: 'c_tak1', pos: pos(4.2, 2.95), from: 'right' },
      { at: 300, tipo: 'bind', actor: 'c_tak1', target: 'c_traf', lado: 'der' },
      { at: 900, tipo: 'activate', actor: 'c_tak1' },
      { at: 900, tipo: 'appear', actor: 'c_nemo', pos: pos(2.51, 4.6), from: 'bottom' },
      { at: 950, tipo: 'appear', actor: 'c_ikka', pos: pos(2.07, 4.9), from: 'bottom' },
      { at: 1000, tipo: 'appear', actor: 'c_ikkb', pos: pos(2.95, 4.9), from: 'bottom' },
      { at: 1400, tipo: 'bind', actor: 'c_ikka', target: 'c_nemo', offset: pos(-0.44, 0.34), duration: 400 },
      { at: 1400, tipo: 'bind', actor: 'c_ikkb', target: 'c_nemo', offset: pos(0.44, 0.34), duration: 400 },
      { at: 1900, tipo: 'move', actor: 'c_nemo', to: pos(2.51, 4.18) },
      { at: 2600, tipo: 'phosphorylate', kinase: 'c_tak1', target: 'c_ikkb', site: 'p3' },
      { at: 3300, tipo: 'activate', actor: 'c_ikkb' },
      { at: 3350, tipo: 'activate', actor: 'c_ikka' },
      { at: 3400, tipo: 'disconnect', id: 'fos:c_tak1>c_ikkb' },
      { at: 3500, tipo: 'phosphorylate', kinase: 'c_ikkb', target: 'c_ikba', site: 'p1', label: 'S32' },
      { at: 3900, tipo: 'phosphorylate', kinase: 'c_ikkb', target: 'c_ikba', site: 'p3', label: 'S36' },
      { at: 4700, tipo: 'disconnect', id: 'fos:c_ikkb>c_ikba' },
    ],
  },
  {
    id: 'c-btrcp', via: 'clasica', ronda: 'fisiologia',
    ficha: { label: 'SCF-β-TrCP', color: '#9D7BEA', forma: 'imagen', img: 'e3_ligasa_scf' },
    hueco: pos(3.95, 5.75),
    titulo: 'β-TrCP sentencia a IκBα',
    explica: 'La ligasa SCF-β-TrCP reconoce el fosfodegrón y pone una cadena K48 sobre IκBα. El proteasoma 26S la reconoce y destruye a IκBα: p50/p65 queda libre, con su señal de entrada al núcleo expuesta.',
    acciones: [
      { at: 0, tipo: 'appear', actor: 'c_btrcp', pos: pos(4.3, 5.75), from: 'right' },
      { at: 400, tipo: 'bind', actor: 'c_btrcp', target: 'c_ikba', lado: 'der' },
      { at: 1100, tipo: 'ubiquitinate', ligase: 'c_btrcp', target: 'c_ikba', chain: 'K48' },
      { at: 2100, tipo: 'release', actor: 'c_btrcp', from: 'c_ikba', to: pos(4.3, 5.2) },
      { at: 2400, tipo: 'degrade', target: 'c_ikba' },
      { at: 2700, tipo: 'hide', actor: 'c_btrcp' },
      { at: 3500, tipo: 'activate', actor: 'c_p50' },
      { at: 3550, tipo: 'activate', actor: 'c_p65' },
    ],
  },
  {
    id: 'c-nucleo', via: 'clasica', ronda: 'fisiologia',
    ficha: tok.prot('p50/p65', C.p65),
    hueco: pos(2.51, FILA_NUC),
    titulo: 'p50/p65 entra al núcleo',
    explica: 'El dímero cruza el poro nuclear, se une a sitios κB y transcribe genes antiapoptóticos (BCL-xL, cFLIP, cIAP), de proliferación (ciclina D2, MYC), quimiocinas (CCL17/TARC) y sus propios frenos (IκBα, A20).',
    acciones: [
      { at: 0, tipo: 'translocate', actor: 'c_p50', to: pos(2.07, FILA_NUC), duration: 1200 },
      { at: 1300, tipo: 'activate', actor: 'adn' },
    ],
  },

  // ─── Fisiología · vía alternativa ─────────────────────────────────────────
  {
    id: 'a-lig', via: 'alternativa', ronda: 'fisiologia',
    ficha: tok.lig('CD40L · BAFF/APRIL', C.bcma),
    hueco: pos(8.78, 0.82),
    titulo: 'Llegan los ligandos',
    explica: 'CD40L (linfocitos T CD4) y BAFF o APRIL (neutrófilos, estroma) se unen a CD40 y BCMA. Sus colas secuestran al complejo TRAF2–TRAF3–cIAP1/2.',
    acciones: [
      { at: 0, tipo: 'appear', actor: 'a_cd40l', pos: pos(8.34, 0.25), from: 'top' },
      { at: 100, tipo: 'appear', actor: 'a_baff', pos: pos(9.21, 0.25), from: 'top' },
      { at: 500, tipo: 'bind', actor: 'a_cd40l', target: 'a_cd40', lado: 'arriba' },
      { at: 600, tipo: 'bind', actor: 'a_baff', target: 'a_bcma', lado: 'arriba' },
      { at: 1300, tipo: 'activate', actor: 'a_cd40' },
      { at: 1350, tipo: 'activate', actor: 'a_bcma' },
    ],
  },
  {
    id: 'a-nik', via: 'alternativa', ronda: 'fisiologia',
    ficha: tok.prot('NIK', C.nik),
    hueco: pos(8.35, 2.95),
    titulo: 'TRAF3 cae y NIK se acumula',
    explica: 'Con el receptor activo, cIAP1/2 ubiquitina a TRAF3 y el proteasoma lo destruye. Sin TRAF3, NIK —que se fabrica sin parar— deja de degradarse, se acumula y se activa (en horas).',
    acciones: [
      { at: 0, tipo: 'connect', id: 'e:bcma>traf3', from: 'a_bcma', to: 'a_traf3', type: 'activa' },
      { at: 600, tipo: 'degrade', target: 'a_traf3' },
      { at: 1900, tipo: 'appear', actor: 'a_nik', pos: pos(8.35, 2.95), from: 'grow', duration: 800 },
      { at: 2800, tipo: 'activate', actor: 'a_nik' },
    ],
  },
  {
    id: 'a-ikka', via: 'alternativa', ronda: 'fisiologia',
    ficha: tok.prot('IKKα / IKKα', C.ikka),
    hueco: pos(8.33, 4.52),
    titulo: 'IKKα procesa a p100',
    explica: 'NIK activa al homodímero IKKα (sin NEMO), que fosforila el extremo C-terminal de p100. β-TrCP lo ubiquitina y el proteasoma corta solo esa cola inhibidora: queda p52 unido a RELB.',
    acciones: [
      { at: 0, tipo: 'appear', actor: 'a_ikka1', pos: pos(7.89, 4.9), from: 'bottom' },
      { at: 80, tipo: 'appear', actor: 'a_ikka2', pos: pos(8.78, 4.9), from: 'bottom' },
      { at: 400, tipo: 'move', actor: 'a_ikka1', to: pos(7.89, 4.52) },
      { at: 450, tipo: 'bind', actor: 'a_ikka2', target: 'a_ikka1', lado: 'der' },
      { at: 1200, tipo: 'phosphorylate', kinase: 'a_nik', target: 'a_ikka1', site: 'p2' },
      { at: 1900, tipo: 'activate', actor: 'a_ikka1' },
      { at: 1950, tipo: 'activate', actor: 'a_ikka2' },
      { at: 2000, tipo: 'disconnect', id: 'fos:a_nik>a_ikka1' },
      { at: 2100, tipo: 'phosphorylate', kinase: 'a_ikka1', target: 'a_p100', site: 'p1' },
      { at: 2800, tipo: 'disconnect', id: 'fos:a_ikka1>a_p100' },
      { at: 2900, tipo: 'process', target: 'a_p100', into: 'a_p52', back: pos(7.89, 6.26) },
      { at: 5000, tipo: 'bind', actor: 'a_relb', target: 'a_p52', lado: 'der', duration: 400 },
    ],
  },
  {
    id: 'a-nucleo', via: 'alternativa', ronda: 'fisiologia',
    ficha: tok.prot('p52/RELB', C.relb),
    hueco: pos(8.33, FILA_NUC),
    titulo: 'p52/RELB entra al núcleo',
    explica: 'Sin el extremo inhibidor de p100, el dímero p52/RELB entra al núcleo y activa genes de supervivencia (BCL-xL) y quimiocinas de organización linfoide (CXCL13, CCL19, CCL21).',
    acciones: [
      { at: 0, tipo: 'activate', actor: 'a_p52' },
      { at: 0, tipo: 'activate', actor: 'a_relb' },
      { at: 200, tipo: 'translocate', actor: 'a_p52', to: pos(7.89, FILA_NUC), duration: 1200 },
      { at: 1500, tipo: 'activate', actor: 'adn' },
    ],
  },

  // ─── Fisiología · JAK/STAT ────────────────────────────────────────────────
  {
    id: 'j-il13', via: 'jakstat', ronda: 'fisiologia',
    ficha: { label: 'IL-13', color: C.citocina, forma: 'citocina' },
    hueco: pos(13.8, 0.82),
    titulo: 'La citocina activa a JAK',
    explica: 'La IL-13 une las dos cadenas del receptor; las JAK, que ya iban unidas a la cola, quedan enfrentadas, se transfosforilan y fosforilan tirosinas del receptor: los sitios de anclaje de STAT.',
    acciones: [
      { at: 0, tipo: 'appear', actor: 'j_il13', pos: pos(13.8, 0.2), from: 'top' },
      { at: 400, tipo: 'move', actor: 'j_il13', to: pos(13.8, 0.72) },
      { at: 1100, tipo: 'activate', actor: 'j_rec' },
      { at: 1200, tipo: 'phosphorylate', kinase: 'j_jak', target: 'j_jak', site: 'p2', label: 'Y1007/8' },
      { at: 1900, tipo: 'activate', actor: 'j_jak' },
      { at: 2000, tipo: 'phosphorylate', kinase: 'j_jak', target: 'j_rec', site: 'p1', label: 'pY' },
      { at: 2700, tipo: 'disconnect', id: 'fos:j_jak>j_rec' },
    ],
  },
  {
    id: 'j-stat', via: 'jakstat', ronda: 'fisiologia',
    ficha: tok.prot('STAT', C.stat),
    hueco: pos(13.8, 5.1),
    titulo: 'STAT se ancla, se fosforila y dimeriza',
    explica: 'Cada STAT se une con su dominio SH2 a una fosfotirosina del receptor; JAK le fosforila una tirosina C-terminal (STAT3 Tyr705, STAT6 Tyr641). Fosforiladas, se sueltan y forman un dímero SH2–pTyr recíproco.',
    acciones: [
      { at: 0, tipo: 'move', actor: 'j_stat1', to: pos(13.2, 4.75), duration: 800 },
      { at: 50, tipo: 'move', actor: 'j_stat2', to: pos(14.4, 4.75), duration: 800 },
      { at: 900, tipo: 'connect', id: 'e:s1>rec', from: 'j_stat1', to: 'j_rec', type: 'secuestra' },
      { at: 950, tipo: 'connect', id: 'e:s2>rec', from: 'j_stat2', to: 'j_rec', type: 'secuestra' },
      { at: 1400, tipo: 'phosphorylate', kinase: 'j_jak', target: 'j_stat1', site: 'p2', label: 'Y705' },
      { at: 1800, tipo: 'phosphorylate', kinase: 'j_jak', target: 'j_stat2', site: 'p2' },
      { at: 2600, tipo: 'disconnect', id: 'fos:j_jak>j_stat1' },
      { at: 2600, tipo: 'disconnect', id: 'fos:j_jak>j_stat2' },
      { at: 2600, tipo: 'disconnect', id: 'e:s1>rec' },
      { at: 2600, tipo: 'disconnect', id: 'e:s2>rec' },
      { at: 2800, tipo: 'move', actor: 'j_stat1', to: pos(13.36, 6.26) },
      { at: 2850, tipo: 'bind', actor: 'j_stat2', target: 'j_stat1', lado: 'der' },
      { at: 3600, tipo: 'activate', actor: 'j_stat1' },
      { at: 3650, tipo: 'activate', actor: 'j_stat2' },
    ],
  },
  {
    id: 'j-nucleo', via: 'jakstat', ronda: 'fisiologia',
    ficha: tok.prot('STAT/STAT', C.stat),
    hueco: pos(13.8, FILA_NUC),
    titulo: 'El dímero de STAT entra al núcleo',
    explica: 'El dímero entra al núcleo, se une a secuencias GAS y transcribe BCL-xL, MCL-1, MYC, PD-L1/PD-L2 y su propio freno, SOCS1.',
    acciones: [
      { at: 0, tipo: 'translocate', actor: 'j_stat1', to: pos(13.36, FILA_NUC), duration: 1200 },
      { at: 1300, tipo: 'activate', actor: 'adn' },
    ],
  },

  // ─── Linfoma de Hodgkin clásico (las marcas rojas de la figura) ──────────
  {
    id: 'h-tnfaip3', via: 'clasica', ronda: 'hodgkin',
    ficha: tok.alt('TNFAIP3 · 40 %'),
    hueco: pos(1.25, 3.72),
    titulo: 'TNFAIP3 mutado',
    explica: 'A20 (TNFAIP3) es el freno que quita las cadenas K63 de RIP y TRAF. Inactivado en ≈40 % de los casos (sobre todo VEB negativos), las cadenas se quedan y el complejo IKK no se apaga.',
    acciones: [
      { at: 0, tipo: 'appear', actor: 'c_a20', pos: pos(1.25, 3.72), from: 'grow' },
      { at: 500, tipo: 'mutate', actor: 'c_a20', gene: 'TNFAIP3', efecto: 'perdida', pct: '40 %' },
      { at: 1300, tipo: 'deubiquitinate', enzyme: 'c_a20', target: 'c_rip' },
      { at: 2300, tipo: 'pulse_signal', from: 'c_rip', to: 'c_nemo' },
    ],
  },
  {
    id: 'h-cyld', via: 'clasica', ronda: 'hodgkin',
    ficha: tok.alt('CYLD · rara'),
    hueco: pos(3.9, 3.72),
    titulo: 'CYLD mutado',
    explica: 'CYLD es la otra desubiquitinasa que corta cadenas K63. Sus mutaciones son raras, pero dan el mismo resultado: la plataforma de ubiquitina no se desarma.',
    acciones: [
      { at: 0, tipo: 'appear', actor: 'c_cyld', pos: pos(3.9, 3.72), from: 'grow' },
      { at: 500, tipo: 'mutate', actor: 'c_cyld', gene: 'CYLD', efecto: 'perdida', pct: 'rara' },
      { at: 1300, tipo: 'deubiquitinate', enzyme: 'c_cyld', target: 'c_traf' },
    ],
  },
  {
    id: 'h-nfkbia', via: 'clasica', ronda: 'hodgkin',
    ficha: tok.alt('NFKBIA / NFKBIE · 10–20 %'),
    hueco: pos(1.1, 5.4),
    titulo: 'NFKBIA / NFKBIE mutados',
    explica: 'El IκBα (o IκBε) mutado sale truncado y ya no puede envolver a p50/p65: el dímero queda libre aunque el complejo IKK no actúe.',
    acciones: [
      { at: 0, tipo: 'appear', actor: 'c_ikbn', pos: pos(1.1, 5.4), from: 'grow' },
      { at: 500, tipo: 'mutate', actor: 'c_ikbn', gene: 'NFKBIA / NFKBIE', efecto: 'perdida', pct: '10–20 %' },
    ],
  },
  {
    id: 'h-rel', via: 'clasica', ronda: 'hodgkin',
    ficha: tok.alt('REL amplificado · 40 %'),
    hueco: pos(1.1, 7.0),
    titulo: 'Amplificación de REL',
    explica: 'Copias extra de REL (2p16) producen más c-Rel: más dímeros p50/c-Rel que entran al núcleo cada vez que el inhibidor se destruye.',
    acciones: [
      { at: 0, tipo: 'appear', actor: 'c_rel', pos: pos(1.1, 7.0), from: 'grow' },
      { at: 500, tipo: 'mutate', actor: 'c_rel', gene: 'REL', efecto: 'ganancia', pct: '40 %' },
      { at: 1300, tipo: 'translocate', actor: 'c_rel', to: pos(1.0, FILA_NUC), duration: 1000 },
      { at: 2400, tipo: 'activate', actor: 'c_rel' },
    ],
  },
  {
    id: 'h-bcl3', via: 'clasica', ronda: 'hodgkin',
    ficha: tok.alt('BCL3 · rara'),
    hueco: pos(5.41, 8.27),
    titulo: 'BCL3: ganancias o translocaciones',
    explica: 'BCL3, un IκB nuclear, se une a homodímeros p50/p50 —que sin él reprimen— y los convierte en activadores de la transcripción.',
    acciones: [
      { at: 0, tipo: 'appear', actor: 'c_p50b', pos: pos(4.97, FILA_NUC), from: 'grow' },
      { at: 80, tipo: 'appear', actor: 'c_p50c', pos: pos(5.85, FILA_NUC), from: 'grow' },
      { at: 400, tipo: 'appear', actor: 'c_bcl3', pos: pos(5.41, 8.27), from: 'top' },
      { at: 1000, tipo: 'mutate', actor: 'c_bcl3', gene: 'BCL3', efecto: 'ganancia', pct: 'rara' },
      { at: 1800, tipo: 'activate', actor: 'c_p50b' },
      { at: 1850, tipo: 'activate', actor: 'c_p50c' },
    ],
  },
  {
    id: 'h-lmp1', via: 'clasica', ronda: 'hodgkin',
    ficha: tok.alt('VEB · LMP1 · 40 %'),
    hueco: pos(5.54, MEMBRANA),
    titulo: 'Infección por el VEB',
    explica: 'LMP1, proteína del virus de Epstein-Barr, se agrega sola en la membrana: recluta TRAF y RIP (vía clásica) y secuestra a TRAF3 (vía alternativa) sin necesidad de ligando.',
    acciones: [
      { at: 0, tipo: 'appear', actor: 'c_lmp1', pos: pos(5.54, MEMBRANA), from: 'grow' },
      { at: 500, tipo: 'mutate', actor: 'c_lmp1', gene: 'VEB · LMP1', efecto: 'ganancia', pct: '40 %' },
      { at: 1200, tipo: 'activate', actor: 'c_lmp1' },
      { at: 1300, tipo: 'connect', id: 'e:lmp1>traf', from: 'c_lmp1', to: 'c_traf', type: 'activa', curve: 0.18 },
      { at: 1350, tipo: 'connect', id: 'e:lmp1>nik', from: 'c_lmp1', to: 'a_nik', type: 'activa', curve: -0.12 },
      { at: 1900, tipo: 'pulse_signal', from: 'c_lmp1', to: 'c_traf' },
      { at: 1900, tipo: 'pulse_signal', from: 'c_lmp1', to: 'a_nik' },
    ],
  },
  {
    id: 'h-nik', via: 'alternativa', ronda: 'hodgkin',
    ficha: tok.alt('NIK ganancia · 25 %'),
    hueco: pos(7.25, 3.6),
    titulo: 'Ganancias de NIK',
    explica: 'Con copias extra de MAP3K14 se fabrica tanta NIK que el complejo TRAF3–cIAP no da abasto: la vía alternativa queda encendida sin ligando.',
    acciones: [
      { at: 0, tipo: 'mutate', actor: 'a_nik', gene: 'NIK (MAP3K14)', efecto: 'ganancia', pct: '25 %' },
      { at: 900, tipo: 'activate', actor: 'a_nik' },
    ],
  },
  {
    id: 'h-traf3', via: 'alternativa', ronda: 'hodgkin',
    ficha: tok.alt('TRAF3 · rara'),
    hueco: pos(9.75, 2.95),
    titulo: 'TRAF3 mutado',
    explica: 'TRAF3 es quien entrega a NIK a las ligasas cIAP1/2 para que la destruyan. Inactivado, NIK deja de degradarse aunque no haya ligando.',
    acciones: [
      { at: 0, tipo: 'appear', actor: 'a_traf3', pos: pos(9.75, 2.95), from: 'grow' },
      { at: 500, tipo: 'mutate', actor: 'a_traf3', gene: 'TRAF3', efecto: 'perdida', pct: 'rara' },
    ],
  },
  {
    id: 'h-jak2', via: 'jakstat', ronda: 'hodgkin',
    ficha: tok.alt('JAK2 ganancia · 30 %'),
    hueco: pos(12.6, 2.9),
    titulo: 'Ganancias de JAK2 (9p24.1)',
    explica: 'Copias extra de 9p24.1 multiplican JAK2 y, en el mismo fragmento, PD-L1 y PD-L2: más señal JAK/STAT y más evasión inmunitaria. Por eso el linfoma de Hodgkin responde a los anti-PD-1.',
    acciones: [
      { at: 0, tipo: 'mutate', actor: 'j_jak', gene: 'JAK2 (9p24.1)', efecto: 'ganancia', pct: '30 %' },
      { at: 900, tipo: 'activate', actor: 'j_jak' },
    ],
  },
  {
    id: 'h-socs1', via: 'jakstat', ronda: 'hodgkin',
    ficha: tok.alt('SOCS1 · 40 %'),
    hueco: pos(12.25, 4.95),
    titulo: 'SOCS1 mutado',
    explica: 'SOCS1, el freno que STAT fabrica para bloquear a JAK, sale roto en ≈40 % de los casos: JAK queda sin freno y STAT sigue fosforilado.',
    acciones: [
      { at: 0, tipo: 'appear', actor: 'j_socs1', pos: pos(12.25, 4.95), from: 'grow' },
      { at: 500, tipo: 'mutate', actor: 'j_socs1', gene: 'SOCS1', efecto: 'perdida', pct: '40 %' },
      { at: 1300, tipo: 'pulse_signal', from: 'j_jak', to: 'j_stat1' },
    ],
  },
];

/** Rótulos rojos de la figura para la portada (posición en celdas). */
export const ALTERACIONES_PANORAMA: { texto: string; pct: string; pos: Pos; ancla?: 'izq' | 'der' | 'centro' }[] = [
  { texto: 'TNFAIP3', pct: 'mutaciones (40 %)', pos: pos(1.25, 3.62), ancla: 'centro' },
  { texto: 'CYLD', pct: 'mutaciones (rara)', pos: pos(3.95, 3.62), ancla: 'centro' },
  { texto: 'NFKBIA y NFKBIE', pct: 'mutaciones (10–20 %)', pos: pos(1.12, 5.3), ancla: 'centro' },
  { texto: 'REL', pct: 'amplificación (40 %)', pos: pos(1.12, 7.05), ancla: 'centro' },
  { texto: 'BCL3', pct: 'ganancias o transl. (rara)', pos: pos(5.41, 9.62), ancla: 'centro' },
  { texto: 'VEB', pct: 'infección (40 %)', pos: pos(5.54, 0.42), ancla: 'centro' },
  { texto: 'NIK', pct: 'ganancias (25 %)', pos: pos(7.2, 3.55), ancla: 'centro' },
  { texto: 'TRAF3', pct: 'mutaciones (rara)', pos: pos(9.75, 3.55), ancla: 'centro' },
  { texto: 'JAK2', pct: 'ganancias (30 %) o transl. (rara)', pos: pos(12.35, 2.75), ancla: 'centro' },
  { texto: 'SOCS1', pct: 'mutaciones (40 %)', pos: pos(12.25, 5.05), ancla: 'centro' },
];
